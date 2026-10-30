import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { AppError } from '../../shared/app-error.js';
import { hashPassword, verifyPassword } from '../../shared/password.js';
import { appendAudit } from '../../shared/audit.js';
import { resolveNow } from '../../shared/time.js';
import { createMailAdapter } from '../../adapters/index.js';
import { createAuthRepository } from './auth.repository.js';
import { createTokens } from './auth.tokens.js';

const tokenHash = (token) => createHash('sha256').update(token).digest();
const validOpaqueToken = (token) => typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token);
const invalidRefresh = () => new AppError(401, 'INVALID_REFRESH_TOKEN', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
const invalidCredentials = () => new AppError(401, 'INVALID_CREDENTIALS', 'Email hoặc mật khẩu chưa đúng.');
const invalidResetToken = () => new AppError(400, 'INVALID_RESET_TOKEN', 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
const publicResetAccepted = () => ({
  data: {
    accepted: true,
    message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi trong ít phút.',
  },
});
const dto = (user, roles) => ({ id: user.id, email: user.email, displayName: user.display_name, roles });

export function createAuthService(database, config, { mail = createMailAdapter({ mode: config.mailMode || 'disabled' }), clock, logger } = {}) {
  const repository = createAuthRepository(database);
  const tokens = createTokens(config);
  const resetMilliseconds = config.resetMilliseconds ?? 15 * 60_000;
  async function safe(work) {
    try { return await work(); }
    catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(503, 'AUTH_UNAVAILABLE', 'Tài khoản đang tạm gián đoạn. Vui lòng thử lại sau.');
    }
  }
  async function sessionResult(user, session, now, transaction) {
    const refreshToken = randomBytes(32).toString('base64url');
    await repository.createRefresh({
      id: randomUUID(), session_id: session.id, token_hash: tokenHash(refreshToken),
      created_at: now, expires_at: session.expires_at,
    }, transaction);
    const roles = await repository.roles(user.id, transaction);
    return {
      data: { ...await tokens.issue(user.id, session.id, now, new Date(session.expires_at)), user: dto(user, roles) },
      refreshToken, expiresAt: new Date(session.expires_at),
    };
  }
  const authenticate = (authorization) => safe(async () => {
    if (!/^Bearer [A-Za-z0-9_.-]+$/.test(authorization || '') || authorization.length > 8192) {
      throw new AppError(401, 'AUTH_REQUIRED', 'Vui lòng đăng nhập để tiếp tục.');
    }
    const claims = await tokens.verify(authorization.slice(7));
    const session = await repository.activeSession(claims.sessionId, claims.userId, clock ? resolveNow(clock) : undefined);
    const user = session && await repository.userById(claims.userId);
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError(401, 'SESSION_REVOKED', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
    }
    const roles = await repository.roles(user.id);
    return { user, session, roles, dto: dto(user, roles) };
  });
  return {
    authenticate,
    register: (input, requestId) => safe(async () => {
      const passwordHash = await hashPassword(input.password);
      try {
        return await database.transaction(async (transaction) => {
          const user = await repository.createUser({ id: randomUUID(), email: input.email, password_hash: passwordHash, display_name: input.displayName }, transaction);
          await repository.createRole({ user_id: user.id, role_code: 'TOURIST' }, transaction);
          await appendAudit(database, transaction, { actorId: user.id, action: 'AUTH_REGISTER', targetType: 'USER', targetId: user.id, requestId });
          return { data: { id: user.id, email: user.email, displayName: user.display_name } };
        });
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') throw new AppError(409, 'EMAIL_EXISTS', 'Email này đã được đăng ký.', [{ field: 'email', message: 'Hãy đăng nhập hoặc dùng email khác.' }]);
        throw error;
      }
    }),
    login: (input, requestId) => safe(async () => {
      const candidate = await repository.findUserByEmail(input.email);
      const matches = await verifyPassword(input.password, candidate?.password_hash);
      if (!matches) {
        await database.transaction((transaction) => appendAudit(database, transaction, { actorId: candidate?.id, action: 'AUTH_LOGIN', targetType: 'USER', targetId: candidate?.id, result: 'FAILURE', requestId }));
        throw invalidCredentials();
      }
      return database.transaction(async (transaction) => {
        const user = await repository.userById(candidate.id, transaction);
        if (!user || user.password_hash !== candidate.password_hash) throw invalidCredentials();
        if (user.status !== 'ACTIVE') throw new AppError(403, 'ACCOUNT_LOCKED', 'Tài khoản hiện không được phép đăng nhập.');
        const now = resolveNow(clock, user.get('server_now'));
        const session = await repository.createSession({
          id: randomUUID(), user_id: user.id, created_at: now,
          expires_at: new Date(now.getTime() + config.sessionMilliseconds),
        }, transaction);
        const result = await sessionResult(user, session, now, transaction);
        await appendAudit(database, transaction, { actorId: user.id, action: 'AUTH_LOGIN', targetType: 'SESSION', targetId: session.id, requestId });
        return result;
      });
    }),
    refresh: (token, requestId) => safe(async () => {
      if (!validOpaqueToken(token)) throw invalidRefresh();
      const known = await repository.refreshByHash(tokenHash(token));
      const knownSession = known && await repository.sessionById(known.session_id);
      if (!knownSession) throw invalidRefresh();
      const result = await database.transaction(async (transaction) => {
        const user = await repository.userById(knownSession.user_id, transaction);
        const session = await repository.sessionById(knownSession.id, transaction);
        const refresh = await repository.refreshByHash(tokenHash(token), transaction);
        if (!user || !session || !refresh) return { error: invalidRefresh() };
        const now = resolveNow(clock, user.get('server_now'));
        if (session.revoked_at || new Date(session.expires_at) <= now || new Date(refresh.expires_at) <= now || user.status !== 'ACTIVE') return { error: invalidRefresh() };
        if (refresh.used_at) {
          await session.update({ revoked_at: now }, { transaction });
          await appendAudit(database, transaction, { actorId: user.id, action: 'AUTH_REFRESH_REUSE', targetType: 'SESSION', targetId: session.id, result: 'FAILURE', requestId });
          return { error: invalidRefresh() };
        }
        await refresh.update({ used_at: now }, { transaction });
        const next = await sessionResult(user, session, now, transaction);
        await appendAudit(database, transaction, { actorId: user.id, action: 'AUTH_REFRESH', targetType: 'SESSION', targetId: session.id, requestId });
        return next;
      });
      if (result.error) throw result.error;
      return result;
    }),
    logout: (token, requestId) => safe(async () => {
      if (!validOpaqueToken(token)) return;
      const refresh = await repository.refreshByHash(tokenHash(token));
      const known = refresh && await repository.sessionById(refresh.session_id);
      if (!known) return;
      await database.transaction(async (transaction) => {
        const user = await repository.userById(known.user_id, transaction);
        const session = await repository.sessionById(known.id, transaction);
        if (!user || !session || session.revoked_at) return;
        await session.update({ revoked_at: resolveNow(clock, user.get('server_now')) }, { transaction });
        await appendAudit(database, transaction, { actorId: user.id, action: 'AUTH_LOGOUT', targetType: 'SESSION', targetId: session.id, requestId });
      });
    }),
    me: async (authorization) => ({ data: { user: (await authenticate(authorization)).dto } }),
    forgotPassword: (input, requestId) => safe(async () => {
      if (!mail?.enabled) {
        throw new AppError(503, 'MAIL_UNAVAILABLE', 'Dịch vụ gửi thư khôi phục chưa được cấu hình.');
      }
      const candidate = await repository.findUserByEmail(input.email);
      if (!candidate || candidate.status !== 'ACTIVE') {
        await database.transaction((transaction) =>
          appendAudit(database, transaction, {
            actorId: null, action: 'AUTH_PASSWORD_RESET_REQUEST',
            targetType: 'USER', targetId: candidate?.id ?? null, requestId,
          }),
        );
        return publicResetAccepted();
      }
      const rawToken = randomBytes(32).toString('base64url');
      const hash = tokenHash(rawToken);
      const issued = await database.transaction(async (transaction) => {
        const user = await repository.userById(candidate.id, transaction);
        if (!user || user.status !== 'ACTIVE') return null;
        const now = resolveNow(clock, user.get('server_now'));
        const expiresAt = new Date(now.getTime() + resetMilliseconds);
        const reset = await repository.createPasswordReset({
          id: randomUUID(), user_id: user.id, token_hash: hash,
          created_at: now, expires_at: expiresAt,
        }, transaction);
        await appendAudit(database, transaction, {
          actorId: user.id, action: 'AUTH_PASSWORD_RESET_REQUEST',
          targetType: 'USER', targetId: user.id, requestId,
        });
        return { user, reset, now, expiresAt };
      });
      if (!issued) return publicResetAccepted();
      const resetUrl = `${config.origins[0]}/reset-password?token=${encodeURIComponent(rawToken)}`;
      try {
        const delivery = await mail.sendPasswordReset({
          to: issued.user.email, displayName: issued.user.display_name,
          resetUrl, expiresAt: issued.expiresAt.toISOString(), requestId,
        });
        await database.transaction((transaction) =>
          appendAudit(database, transaction, {
            actorId: issued.user.id, action: 'AUTH_PASSWORD_RESET_DELIVERY',
            targetType: 'USER', targetId: issued.user.id, requestId,
            metadata: { delivered: Boolean(delivery?.delivered), simulated: Boolean(delivery?.simulated) },
          }),
        );
      } catch (error) {
        await database.transaction(async (transaction) => {
          const reset = await repository.passwordResetByHash(hash, transaction);
          if (reset && !reset.used_at) await reset.update({ used_at: issued.now }, { transaction });
          await appendAudit(database, transaction, {
            actorId: issued.user.id, action: 'AUTH_PASSWORD_RESET_DELIVERY',
            targetType: 'USER', targetId: issued.user.id, result: 'FAILURE', requestId,
            metadata: { errorCode: error.code || 'MAIL_DELIVERY_FAILED' },
          });
        });
        logger?.error({ requestId, action: 'AUTH_PASSWORD_RESET_DELIVERY' }, 'Password reset email delivery failed');
      }
      return publicResetAccepted();
    }),
    resetPassword: (input, requestId) => safe(async () => {
      if (!validOpaqueToken(input.token)) throw invalidResetToken();
      const hash = tokenHash(input.token);
      const known = await repository.passwordResetByHash(hash);
      if (!known) throw invalidResetToken();
      const passwordHash = await hashPassword(input.password);
      const outcome = await database.transaction(async (transaction) => {
        const user = await repository.userById(known.user_id, transaction);
        await repository.userSessions(known.user_id, transaction);
        const reset = await repository.passwordResetByHash(hash, transaction);
        const now = resolveNow(clock, user?.get('server_now'));
        if (!user || user.status !== 'ACTIVE' || !reset || reset.used_at || new Date(reset.expires_at) <= now) {
          await appendAudit(database, transaction, {
            actorId: user?.id ?? null, action: 'AUTH_PASSWORD_RESET',
            targetType: 'USER', targetId: user?.id ?? null, result: 'FAILURE', requestId,
          });
          return { error: invalidResetToken() };
        }
        await repository.consumeUserPasswordResets(user.id, now, transaction);
        await user.update({ password_hash: passwordHash }, { transaction });
        await repository.revokeUserSessions(user.id, now, transaction);
        await appendAudit(database, transaction, {
          actorId: user.id, action: 'AUTH_PASSWORD_RESET',
          targetType: 'USER', targetId: user.id, requestId,
        });
        return { data: { message: 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.' } };
      }, { maxRetries: 2 });
      if (outcome.error) throw outcome.error;
      return outcome;
    }),
  };
}
