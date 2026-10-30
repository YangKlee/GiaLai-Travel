import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { AppError } from '../../shared/app-error.js';
import { hashPassword, verifyPassword } from '../../shared/password.js';
import { appendAudit } from '../../shared/audit.js';
import { serializeUtc } from '../../shared/time.js';
import { createAuthRepository } from './auth.repository.js';
import { createTokens } from './auth.tokens.js';

const tokenHash = (token) => createHash('sha256').update(token).digest();
const validRefresh = (token) => typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token);
const invalidRefresh = () => new AppError(401, 'INVALID_REFRESH_TOKEN', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
const invalidCredentials = () => new AppError(401, 'INVALID_CREDENTIALS', 'Email hoặc mật khẩu chưa đúng.');
const dto = (user, roles) => ({ id: user.id, email: user.email, displayName: user.display_name, roles });

export function createAuthService(database, config) {
  const repository = createAuthRepository(database);
  const tokens = createTokens(config);
  async function safe(work) {
    try { return await work(); }
    catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(503, 'AUTH_UNAVAILABLE', 'Tài khoản đang tạm gián đoạn. Vui lòng thử lại sau.');
    }
  }
  async function sessionResult(user, session, now, transaction) {
    const refreshToken = randomBytes(32).toString('base64url');
    await repository.createRefresh({ id: randomUUID(), session_id: session.id, token_hash: tokenHash(refreshToken), expires_at: session.expires_at }, transaction);
    const roles = await repository.roles(user.id, transaction);
    return { data: { ...await tokens.issue(user.id, session.id, now, new Date(session.expires_at)), user: dto(user, roles) },
      refreshToken, expiresAt: new Date(session.expires_at) };
  }
  return {
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
        const now = new Date(serializeUtc(user.get('server_now')));
        const session = await repository.createSession({ id: randomUUID(), user_id: user.id, expires_at: new Date(now.getTime() + config.sessionMilliseconds) }, transaction);
        const result = await sessionResult(user, session, now, transaction);
        await appendAudit(database, transaction, { actorId: user.id, action: 'AUTH_LOGIN', targetType: 'SESSION', targetId: session.id, requestId });
        return result;
      });
    }),
    refresh: (token, requestId) => safe(async () => {
      if (!validRefresh(token)) throw invalidRefresh();
      const known = await repository.refreshByHash(tokenHash(token));
      const knownSession = known && await repository.sessionById(known.session_id);
      if (!knownSession) throw invalidRefresh();
      const result = await database.transaction(async (transaction) => {
        const user = await repository.userById(knownSession.user_id, transaction);
        const session = await repository.sessionById(knownSession.id, transaction);
        const refresh = await repository.refreshByHash(tokenHash(token), transaction);
        if (!user || !session || !refresh) return { error: invalidRefresh() };
        const now = new Date(serializeUtc(user.get('server_now')));
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
      if (!validRefresh(token)) return;
      const refresh = await repository.refreshByHash(tokenHash(token));
      const known = refresh && await repository.sessionById(refresh.session_id);
      if (!known) return;
      await database.transaction(async (transaction) => {
        const user = await repository.userById(known.user_id, transaction);
        const session = await repository.sessionById(known.id, transaction);
        if (!user || !session || session.revoked_at) return;
        await session.update({ revoked_at: new Date(serializeUtc(user.get('server_now'))) }, { transaction });
        await appendAudit(database, transaction, { actorId: user.id, action: 'AUTH_LOGOUT', targetType: 'SESSION', targetId: session.id, requestId });
      });
    }),
    me: (authorization) => safe(async () => {
      if (!/^Bearer [A-Za-z0-9_.-]+$/.test(authorization || '') || authorization.length > 8192) throw new AppError(401, 'AUTH_REQUIRED', 'Vui lòng đăng nhập để tiếp tục.');
      const claims = await tokens.verify(authorization.slice(7));
      const session = await repository.activeSession(claims.sessionId, claims.userId);
      const user = session && await repository.userById(claims.userId);
      if (!user || user.status !== 'ACTIVE') throw new AppError(401, 'SESSION_REVOKED', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
      return { data: { user: dto(user, await repository.roles(user.id)) } };
    }),
  };
}
