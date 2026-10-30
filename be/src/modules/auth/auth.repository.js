import { Op, fn } from 'sequelize';

export function createAuthRepository(database) {
  const { Users, UserRoles, AuthSessions, AuthRefreshTokens, PasswordResetTokens } = database.models;
  return {
    findUserByEmail: (email) => Users.findOne({ where: { email_key: email } }),
    userById: (id, transaction) => Users.findByPk(id, { transaction,
      ...(transaction ? { lock: transaction.LOCK.UPDATE, attributes: { include: [[fn('UTC_TIMESTAMP', 6), 'server_now']] } } : {}) }),
    sessionById: (id, transaction) => AuthSessions.findByPk(id, { transaction, ...(transaction ? { lock: transaction.LOCK.UPDATE } : {}) }),
    userSessions: (userId, transaction) => AuthSessions.findAll({ where: { user_id: userId, revoked_at: null },
      transaction, ...(transaction ? { lock: transaction.LOCK.UPDATE } : {}) }),
    revokeUserSessions: (userId, now, transaction) => AuthSessions.update({ revoked_at: now },
      { where: { user_id: userId, revoked_at: null }, transaction }),
    roles: async (userId, transaction) => (await UserRoles.findAll({ where: { user_id: userId }, attributes: ['role_code'], transaction })).map((role) => role.role_code),
    createUser: (values, transaction) => Users.create(values, { transaction }),
    createRole: (values, transaction) => UserRoles.create(values, { transaction }),
    createSession: (values, transaction) => AuthSessions.create(values, { transaction }),
    createRefresh: (values, transaction) => AuthRefreshTokens.create(values, { transaction }),
    refreshByHash: (hash, transaction) => AuthRefreshTokens.findOne({ where: { token_hash: hash }, transaction,
      ...(transaction ? { lock: transaction.LOCK.UPDATE } : {}) }),
    createPasswordReset: (values, transaction) => PasswordResetTokens.create(values, { transaction }),
    passwordResetByHash: (hash, transaction) => PasswordResetTokens.findOne({ where: { token_hash: hash }, transaction,
      ...(transaction ? { lock: transaction.LOCK.UPDATE } : {}) }),
    consumeUserPasswordResets: (userId, now, transaction) => PasswordResetTokens.update({ used_at: now },
      { where: { user_id: userId, used_at: null }, transaction }),
    activeSession: (sessionId, userId, now) => AuthSessions.findOne({ where: { id: sessionId, user_id: userId,
      revoked_at: null, expires_at: { [Op.gt]: now ?? fn('UTC_TIMESTAMP', 6) } } }),
  };
}
