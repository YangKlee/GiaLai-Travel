import { randomUUID } from 'node:crypto';
import { AppError } from '../../shared/app-error.js';
import { appendAudit } from '../../shared/audit.js';
import { hashPassword } from '../../shared/password.js';
import { paginationMeta } from '../../shared/pagination.js';
import { resolveNow, serializeUtc } from '../../shared/time.js';
import { createAdminUsersRepository } from './admin-users.repository.js';

function requireAdmin(actor) {
  if (!actor?.user || !actor.roles?.includes('ADMIN')) {
    throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền quản trị người dùng.');
  }
}
const dto = (user, roles) => ({
  id: user.id, email: user.email, displayName: user.display_name,
  phone: user.phone ?? null, status: user.status, roles,
  createdAt: serializeUtc(user.created_at), updatedAt: serializeUtc(user.updated_at),
});

export function createAdminUsersService(database, { clock } = {}) {
  const repository = createAdminUsersRepository(database);
  async function safe(work) {
    try { return await work(); } catch (error) {
      if (error instanceof AppError) throw error;
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new AppError(409, 'EMAIL_EXISTS', 'Email này đã được đăng ký.');
      }
      throw new AppError(503, 'USERS_UNAVAILABLE', 'Không thể xử lý người dùng lúc này. Vui lòng thử lại.');
    }
  }
  async function authorizeWrite(actor, transaction) {
    // Serialize administrative changes and recheck the actor after acquiring the lock.
    await repository.lockAdminRole(transaction);
    const current = await repository.userById(actor.user.id, transaction);
    const roles = await repository.rolesForUsers([actor.user.id], transaction);
    if (current?.status !== 'ACTIVE' || !roles.some(row => row.role_code === 'ADMIN')) {
      throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền quản trị người dùng.');
    }
  }
  async function target(id, transaction) {
    const user = await repository.userById(id, transaction);
    if (!user || user.status === 'ANONYMIZED') throw new AppError(404, 'USER_NOT_FOUND', 'Không tìm thấy người dùng.');
    return user;
  }
  return {
    list: (actor, query) => safe(async () => {
      requireAdmin(actor);
      const { rows, count } = await repository.list(query);
      const roles = await repository.rolesForUsers(rows.map(row => row.id));
      return { data: rows.map(row => dto(row, roles.filter(role => role.user_id === row.id).map(role => role.role_code))), meta: paginationMeta(query, count) };
    }),
    get: (actor, id) => safe(async () => {
      requireAdmin(actor);
      const user = await target(id);
      const roles = await repository.rolesForUsers([id]);
      return { data: dto(user, roles.map(role => role.role_code)) };
    }),
    create: (actor, input, requestId) => safe(async () => {
      requireAdmin(actor);
      const passwordHash = await hashPassword(input.password);
      return database.transaction(async transaction => {
        await authorizeWrite(actor, transaction);
        const now = resolveNow(clock);
        const user = await repository.create({
          id: randomUUID(), email: input.email, password_hash: passwordHash,
          display_name: input.displayName, phone: input.phone, status: input.status,
          created_at: now, updated_at: now,
        }, transaction);
        await repository.replaceRoles(user.id, input.roles, transaction);
        await appendAudit(database, transaction, { actorId: actor.user.id, action: 'ADMIN_USER_CREATE', targetType: 'USER', targetId: user.id, requestId });
        return { data: dto(user, input.roles) };
      });
    }),
    update: (actor, id, input, requestId) => safe(async () => {
      requireAdmin(actor);
      if (actor.user.id === id && (input.status !== 'ACTIVE' || !input.roles.includes('ADMIN'))) {
        throw new AppError(409, 'SELF_ADMIN_CHANGE', 'Không thể tự khóa hoặc gỡ quyền quản trị của tài khoản đang đăng nhập.');
      }
      const passwordHash = input.password ? await hashPassword(input.password) : undefined;
      return database.transaction(async transaction => {
        await authorizeWrite(actor, transaction);
        const user = await target(id, transaction);
        const previousRoles = (await repository.rolesForUsers([id], transaction)).map(role => role.role_code);
        const now = resolveNow(clock, user.get('server_now'));
        const credentialsChanged = Boolean(passwordHash) || user.email !== input.email;
        const accessChanged = input.status !== user.status || [...previousRoles].sort().join() !== [...input.roles].sort().join();
        await user.update({ email: input.email, display_name: input.displayName, phone: input.phone, status: input.status,
          ...(passwordHash ? { password_hash: passwordHash } : {}), updated_at: now }, { transaction });
        await repository.replaceRoles(id, input.roles, transaction);
        if (credentialsChanged || accessChanged) await repository.revokeSessions(id, now, transaction);
        if (credentialsChanged || input.status === 'LOCKED') await repository.consumeResets(id, now, transaction);
        await appendAudit(database, transaction, { actorId: actor.user.id, action: 'ADMIN_USER_UPDATE', targetType: 'USER', targetId: id, requestId });
        return { data: dto(user, input.roles) };
      });
    }),
    delete: (actor, id, requestId) => safe(async () => {
      requireAdmin(actor);
      if (actor.user.id === id) throw new AppError(409, 'SELF_DELETE', 'Không thể xóa tài khoản đang đăng nhập.');
      return database.transaction(async transaction => {
        await authorizeWrite(actor, transaction);
        const user = await target(id, transaction);
        const now = resolveNow(clock, user.get('server_now'));
        await repository.revokeSessions(id, now, transaction);
        await repository.consumeResets(id, now, transaction);
        await repository.replaceRoles(id, [], transaction);
        // Keep referenced booking/audit records while removing account access and personal fields.
        await user.update({ status: 'ANONYMIZED', email: null, password_hash: null,
          display_name: 'Tài khoản đã xóa', phone: null, preferences: null, updated_at: now }, { transaction });
        await appendAudit(database, transaction, { actorId: actor.user.id, action: 'ADMIN_USER_DELETE', targetType: 'USER', targetId: id, requestId });
        return { data: { id, deleted: true } };
      });
    }),
  };
}
