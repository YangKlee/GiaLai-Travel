import { Op, fn } from 'sequelize';

export function createAdminUsersRepository(database) {
  const { Users, UserRoles, Roles, AuthSessions, PasswordResetTokens } = database.models;
  return {
    list: async ({ q, status, role, page, pageSize }) => {
      const roleRows = role ? await UserRoles.findAll({ where: { role_code: role }, attributes: ['user_id'] }) : null;
      return Users.findAndCountAll({
        attributes: ['id', 'email', 'display_name', 'phone', 'status', 'created_at', 'updated_at'],
        where: {
          status: status || { [Op.ne]: 'ANONYMIZED' },
          ...(roleRows ? { id: { [Op.in]: roleRows.map(row => row.user_id) } } : {}),
          ...(q ? { [Op.or]: ['email', 'display_name', 'phone'].map(field => ({ [field]: { [Op.like]: `%${q.replace(/[\\%_]/g, '\\$&')}%` } })) } : {}),
        },
        order: [['created_at', 'DESC'], ['id', 'ASC']],
        limit: pageSize, offset: (page - 1) * pageSize,
      });
    },
    rolesForUsers: (ids, transaction) => UserRoles.findAll({ where: { user_id: { [Op.in]: ids } }, transaction }),
    lockAdminRole: transaction => Roles.findByPk('ADMIN', { transaction, lock: transaction.LOCK.UPDATE }),
    userById: (id, transaction) => Users.findByPk(id, {
      transaction,
      ...(transaction ? { lock: transaction.LOCK.UPDATE, attributes: { include: [[fn('UTC_TIMESTAMP', 6), 'server_now']] } } : {}),
    }),
    create: (values, transaction) => Users.create(values, { transaction }),
    replaceRoles: async (id, roles, transaction) => {
      await UserRoles.destroy({ where: { user_id: id }, transaction });
      if (roles.length) await UserRoles.bulkCreate(roles.map(role => ({ user_id: id, role_code: role })), { transaction });
    },
    revokeSessions: (id, now, transaction) => AuthSessions.update({ revoked_at: now }, { where: { user_id: id, revoked_at: null }, transaction }),
    consumeResets: (id, now, transaction) => PasswordResetTokens.update({ used_at: now }, { where: { user_id: id, used_at: null }, transaction }),
  };
}
