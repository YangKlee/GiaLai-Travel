import { randomUUID } from 'node:crypto';

// No request body, token, password, email or raw SQL in audit metadata.
export async function appendAudit(database, transaction, { actorId = null, action, targetType, targetId = null, result = 'SUCCESS', requestId }) {
  await database.models.AuditLogs.create({ id: randomUUID(), actor_id: actorId, action,
    target_type: targetType, target_id: targetId, result, correlation_id: requestId }, { transaction });
}
