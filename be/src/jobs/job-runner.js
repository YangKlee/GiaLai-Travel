import { randomUUID } from 'node:crypto';
import { Op } from 'sequelize';
import { appendAudit } from '../shared/audit.js';
import { resolveNow } from '../shared/time.js';
import { processPendingPrivacyRequests } from '../modules/privacy/privacy.service.js';

export async function cleanupExpiredAuth({ database, clock }) {
  const now = resolveNow(clock);
  return database.transaction(async (transaction) => {
    const expiredResets = await database.models.PasswordResetTokens.destroy({
      where: { expires_at: { [Op.lte]: now } },
      transaction,
    });
    const expiredSessions = await database.models.AuthSessions.findAll({
      where: { expires_at: { [Op.lte]: now } },
      attributes: ['id'],
      transaction,
    });
    const sessionIds = expiredSessions.map((session) => session.id);
    let expiredRefreshes = 0;
    let deletedSessions = 0;
    if (sessionIds.length > 0) {
      expiredRefreshes = await database.models.AuthRefreshTokens.destroy({
        where: { session_id: { [Op.in]: sessionIds } },
        transaction,
      });
      deletedSessions = await database.models.AuthSessions.destroy({
        where: { id: { [Op.in]: sessionIds } },
        transaction,
      });
    }
    return { expiredResets, expiredRefreshes, deletedSessions };
  });
}

export function createJobRunner({ database, logger, clock }) {
  const jobs = new Map([
    ['cleanup-expired-auth', cleanupExpiredAuth],
    ['process-privacy-requests', processPendingPrivacyRequests],
  ]);
  return {
    register(name, handler) {
      if (!/^[a-z0-9-]{3,48}$/.test(name) || typeof handler !== 'function') {
        throw new TypeError('Invalid job registration');
      }
      jobs.set(name, handler);
    },
    async run(name, { requestId = randomUUID() } = {}) {
      const handler = jobs.get(name);
      if (!handler) throw new Error(`UNKNOWN_JOB:${name}`);
      const lock = await database.withAdvisoryLock(`gialai:job:${name}`, async () => {
        try {
          const summary = await handler({ database, clock, requestId });
          await database.transaction((transaction) =>
            appendAudit(database, transaction, {
              action: 'JOB_RUN', targetType: 'JOB', requestId,
              metadata: { job: name, summary },
            }),
          );
          logger?.info({ requestId, job: name }, 'Background job completed');
          return summary;
        } catch (error) {
          await database.transaction((transaction) =>
            appendAudit(database, transaction, {
              action: 'JOB_RUN', targetType: 'JOB', result: 'FAILURE', requestId,
              metadata: { job: name, errorCode: error.code || 'JOB_FAILED' },
            }),
          ).catch(() => {});
          logger?.error({ requestId, job: name, errorCode: error.code || 'JOB_FAILED' }, 'Background job failed');
          throw error;
        }
      });
      if (!lock.acquired) {
        logger?.info({ requestId, job: name }, 'Background job skipped because another runner holds the lock');
        return { job: name, status: 'SKIPPED', reason: 'LOCKED', requestId };
      }
      return { job: name, status: 'COMPLETED', summary: lock.value, requestId };
    },
  };
}
