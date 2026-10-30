import { Op, fn } from 'sequelize';

const ACTIVE_BOOKING_STATUSES = ['CHO_DUYET', 'CHO_THANH_TOAN', 'DA_XAC_NHAN'];
const HISTORICAL_BOOKING_STATUSES = ['HOAN_THANH', 'DA_HUY', 'TU_CHOI', 'HET_HAN'];

export function createPrivacyRepository(database) {
  const {
    Users,
    UserRoles,
    Consents,
    PrivacyRequests,
    Bookings,
    Itineraries,
    IssueReports,
    AuthSessions,
    PasswordResetTokens,
  } = database.models;
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
    requestsByUser: (userId, transaction) =>
      PrivacyRequests.findAll({
        where: { user_id: userId },
        order: [
          ['created_at', 'DESC'],
          ['id', 'ASC'],
        ],
        transaction,
      }),
    requestById: (id, transaction) =>
      PrivacyRequests.findByPk(id, {
        transaction,
        ...(transaction ? { lock: transaction.LOCK.UPDATE } : {}),
      }),
    openRequestByType: (userId, requestType, transaction) =>
      PrivacyRequests.findOne({
        where: {
          user_id: userId,
          request_type: requestType,
          status: { [Op.in]: ['NEW', 'VERIFIED', 'PROCESSING'] },
        },
        transaction,
        ...(transaction ? { lock: transaction.LOCK.UPDATE } : {}),
      }),
    pendingDeleteRequests: () =>
      PrivacyRequests.findAll({
        where: {
          request_type: 'DELETE',
          status: { [Op.in]: ['VERIFIED', 'PROCESSING'] },
        },
        order: [
          ['created_at', 'ASC'],
          ['id', 'ASC'],
        ],
      }),
    createRequest: (values, transaction) => PrivacyRequests.create(values, { transaction }),
    countActiveBookings: (userId, transaction) =>
      Bookings.count({
        where: { customer_id: userId, status: { [Op.in]: ACTIVE_BOOKING_STATUSES } },
        transaction,
      }),
    countHistoricalBookings: (userId, transaction) =>
      Bookings.count({
        where: { customer_id: userId, status: { [Op.in]: HISTORICAL_BOOKING_STATUSES } },
        transaction,
      }),
    revokeUserSessions: (userId, now, transaction) =>
      AuthSessions.update(
        { revoked_at: now },
        { where: { user_id: userId, revoked_at: null }, transaction },
      ),
    consumeUserPasswordResets: (userId, now, transaction) =>
      PasswordResetTokens.update(
        { used_at: now },
        { where: { user_id: userId, used_at: null }, transaction },
      ),
    exportSnapshot: async (userId) => {
      const [consents, itineraries, bookings, issueReports, privacyRequests] = await Promise.all([
        Consents.findAll({
          where: { user_id: userId },
          order: [
            ['decision_no', 'DESC'],
            ['purpose', 'ASC'],
          ],
        }),
        Itineraries.findAll({
          where: { owner_id: userId },
          order: [
            ['created_at', 'DESC'],
            ['id', 'ASC'],
          ],
        }),
        Bookings.findAll({
          where: { customer_id: userId },
          order: [
            ['created_at', 'DESC'],
            ['id', 'ASC'],
          ],
        }),
        IssueReports.findAll({
          where: { reporter_id: userId },
          order: [
            ['created_at', 'DESC'],
            ['id', 'ASC'],
          ],
        }),
        PrivacyRequests.findAll({
          where: { user_id: userId },
          order: [
            ['created_at', 'DESC'],
            ['id', 'ASC'],
          ],
        }),
      ]);
      return { consents, itineraries, bookings, issueReports, privacyRequests };
    },
  };
}
