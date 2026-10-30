import { fn } from 'sequelize';

export function createUsersRepository(database) {
  const { Users, UserRoles, Consents } = database.models;
  return {
    userById: (id, transaction) =>
      Users.findByPk(id, {
        transaction,
        ...(transaction
          ? {
              lock: transaction.LOCK.UPDATE,
              attributes: { include: [[fn('UTC_TIMESTAMP', 6), 'server_now']] },
            }
          : {}),
      }),
    roles: async (userId, transaction) =>
      (
        await UserRoles.findAll({
          where: { user_id: userId },
          attributes: ['role_code'],
          transaction,
        })
      ).map((role) => role.role_code),
    consentsByUser: (userId, transaction) =>
      Consents.findAll({
        where: { user_id: userId },
        order: [
          ['decision_no', 'DESC'],
          ['purpose', 'ASC'],
        ],
        transaction,
      }),
    maxDecisionNo: (userId, purpose, transaction) =>
      Consents.max('decision_no', {
        where: { user_id: userId, purpose },
        transaction,
      }),
    createConsent: (values, transaction) => Consents.create(values, { transaction }),
  };
}
