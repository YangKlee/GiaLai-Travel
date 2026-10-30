import { randomUUID } from 'node:crypto';
import { AppError } from './app-error.js';
import { paginationSchema, paginationMeta } from './pagination.js';

const SENSITIVE_KEY = /password|token|secret|cookie|authorization|email|phone|contact|sql|credential|private_?key|reset_?url/i;
const TOKEN_LIKE_VALUE = /^(?:Bearer\s+)?[A-Za-z0-9_-]{32,}(?:\.[A-Za-z0-9_-]+){0,2}$/;

export function redactMetadata(input, depth = 0) {
  if (input === null || input === undefined) return null;
  if (depth > 3) return '[TRUNCATED]';
  if (Array.isArray(input)) return input.slice(0, 20).map((item) => redactMetadata(item, depth + 1));
  if (typeof input === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(input)) {
      if (SENSITIVE_KEY.test(key)) out[key] = '[REDACTED]';
      else out[key] = redactMetadata(value, depth + 1);
    }
    return out;
  }
  if (typeof input === 'string') {
    if (TOKEN_LIKE_VALUE.test(input.trim()) || input.includes('token=')) return '[REDACTED]';
    return input.slice(0, 500);
  }
  if (typeof input === 'number' || typeof input === 'boolean') return input;
  return String(input).slice(0, 200);
}

// No request body, token, password, email or raw SQL in audit metadata.
export async function appendAudit(database, transaction, {
  actorId = null, action, targetType, targetId = null, result = 'SUCCESS', requestId, metadata = null,
}) {
  return database.models.AuditLogs.create({
    id: randomUUID(), actor_id: actorId, action, target_type: targetType,
    target_id: targetId, result, correlation_id: requestId,
    redacted_metadata: metadata ? redactMetadata(metadata) : null,
  }, { transaction });
}

export async function appendNotification(database, transaction, {
  userId, eventKey, kind, title, body, targetType = null, targetId = null,
}) {
  const existing = await database.models.Notifications.findOne({
    where: { user_id: userId, event_key: eventKey }, transaction,
  });
  if (existing) return existing;
  try {
    return await database.models.Notifications.create({
      id: randomUUID(), user_id: userId, event_key: eventKey, kind,
      title, body, target_type: targetType, target_id: targetId,
    }, { transaction });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return database.models.Notifications.findOne({
        where: { user_id: userId, event_key: eventKey }, transaction,
      });
    }
    throw error;
  }
}

export async function listAuditLogs(database, {
  actorUser, page = 1, pageSize = 20, targetType, targetId, action, result,
} = {}) {
  if (!actorUser || !Array.isArray(actorUser.roles) || !actorUser.roles.includes('ADMIN')) {
    throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền truy cập nhật ký kiểm toán.');
  }
  const pagination = paginationSchema.parse({ page, pageSize });
  const where = {
    ...(targetType ? { target_type: targetType } : {}),
    ...(targetId ? { target_id: targetId } : {}),
    ...(action ? { action } : {}),
    ...(result ? { result } : {}),
  };
  const { rows, count } = await database.models.AuditLogs.findAndCountAll({
    where, order: [['created_at', 'DESC'], ['id', 'ASC']],
    limit: pagination.pageSize, offset: (pagination.page - 1) * pagination.pageSize,
  });
  return {
    data: rows.map((row) => ({
      id: row.id, actorId: row.actor_id, action: row.action,
      targetType: row.target_type, targetId: row.target_id, result: row.result,
      correlationId: row.correlation_id, metadata: row.redacted_metadata,
      createdAt: row.created_at,
    })),
    meta: paginationMeta(pagination, count),
  };
}
