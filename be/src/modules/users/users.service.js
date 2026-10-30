import { randomUUID } from 'node:crypto';
import { AppError } from '../../shared/app-error.js';
import { appendAudit } from '../../shared/audit.js';
import { resolveNow, serializeUtc } from '../../shared/time.js';
import {
  CONSENT_POLICY_VERSION,
  CONSENT_PURPOSES,
  PREFERENCE_CATALOG,
  normalizePreferences,
} from './users.schema.js';
import { createUsersRepository } from './users.repository.js';

function profileDto(user, roles) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    phone: user.phone ?? null,
    roles,
    createdAt: serializeUtc(user.created_at),
    updatedAt: serializeUtc(user.updated_at),
  };
}

function consentDecisionDto(row) {
  return {
    id: row.id,
    purpose: row.purpose,
    decisionNo: Number(row.decision_no),
    granted: Boolean(row.granted),
    policyVersion: row.policy_version,
    decidedAt: serializeUtc(row.created_at),
  };
}

function buildConsentState(rows) {
  const history = rows.map(consentDecisionDto);
  const current = CONSENT_PURPOSES.map((meta) => {
    // Rows are ordered by decision_no DESC; first match per purpose is current.
    const latest = history.find((item) => item.purpose === meta.purpose);
    return {
      purpose: meta.purpose,
      title: meta.title,
      description: meta.description,
      policyVersion: latest?.policyVersion ?? meta.policyVersion,
      decisionNo: latest?.decisionNo ?? 0,
      granted: latest ? latest.granted : false,
      decidedAt: latest?.decidedAt ?? null,
    };
  });
  return { current, history };
}

export function createUsersService(database, { clock } = {}) {
  const repository = createUsersRepository(database);
  async function safe(work) {
    try {
      return await work();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(503, 'ACCOUNT_UNAVAILABLE', 'Không thể xử lý hồ sơ lúc này. Vui lòng thử lại sau.');
    }
  }
  return {
    getProfile: (userId) =>
      safe(async () => {
        const user = await repository.userById(userId);
        if (!user || user.status !== 'ACTIVE') {
          throw new AppError(401, 'SESSION_REVOKED', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
        }
        const roles = await repository.roles(user.id);
        return { data: profileDto(user, roles) };
      }),
    updateProfile: (userId, input, requestId) =>
      safe(async () =>
        database.transaction(async (transaction) => {
          const user = await repository.userById(userId, transaction);
          if (!user || user.status !== 'ACTIVE') {
            throw new AppError(401, 'SESSION_REVOKED', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
          }
          const now = resolveNow(clock, user.get('server_now'));
          await user.update(
            {
              display_name: input.displayName,
              phone: input.phone ?? null,
              updated_at: now,
            },
            { transaction },
          );
          const roles = await repository.roles(user.id, transaction);
          await appendAudit(database, transaction, {
            actorId: user.id,
            action: 'USER_PROFILE_UPDATE',
            targetType: 'USER',
            targetId: user.id,
            requestId,
          });
          return { data: profileDto(user, roles) };
        }),
      ),
    getPreferences: (userId) =>
      safe(async () => {
        const user = await repository.userById(userId);
        if (!user || user.status !== 'ACTIVE') {
          throw new AppError(401, 'SESSION_REVOKED', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
        }
        return {
          data: {
            preferences: normalizePreferences(user.preferences),
            catalog: PREFERENCE_CATALOG,
          },
        };
      }),
    updatePreferences: (userId, input, requestId) =>
      safe(async () =>
        database.transaction(async (transaction) => {
          const user = await repository.userById(userId, transaction);
          if (!user || user.status !== 'ACTIVE') {
            throw new AppError(401, 'SESSION_REVOKED', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
          }
          const now = resolveNow(clock, user.get('server_now'));
          const normalized = normalizePreferences(input);
          await user.update({ preferences: normalized, updated_at: now }, { transaction });
          await appendAudit(database, transaction, {
            actorId: user.id,
            action: 'USER_PREFERENCES_UPDATE',
            targetType: 'USER',
            targetId: user.id,
            requestId,
            metadata: { categoriesCount: normalized.categories.length, pace: normalized.pace },
          });
          return {
            data: {
              preferences: normalized,
              catalog: PREFERENCE_CATALOG,
            },
          };
        }),
      ),
    getConsents: (userId) =>
      safe(async () => {
        const rows = await repository.consentsByUser(userId);
        return { data: buildConsentState(rows) };
      }),
    recordConsent: (userId, input, requestId) =>
      safe(async () =>
        database.transaction(
          async (transaction) => {
            const user = await repository.userById(userId, transaction);
            if (!user || user.status !== 'ACTIVE') {
              throw new AppError(401, 'SESSION_REVOKED', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
            }
            const now = resolveNow(clock, user.get('server_now'));
            const maxNo = await repository.maxDecisionNo(user.id, input.purpose, transaction);
            const decisionNo = (Number(maxNo) || 0) + 1;
            const created = await repository.createConsent(
              {
                id: randomUUID(),
                user_id: user.id,
                purpose: input.purpose,
                decision_no: decisionNo,
                granted: input.granted,
                policy_version: CONSENT_POLICY_VERSION,
                created_at: now,
              },
              transaction,
            );
            await appendAudit(database, transaction, {
              actorId: user.id,
              action: 'USER_CONSENT_DECISION',
              targetType: 'CONSENT',
              targetId: created.id,
              requestId,
              metadata: {
                purpose: input.purpose,
                decisionNo,
                granted: input.granted,
                policyVersion: CONSENT_POLICY_VERSION,
              },
            });
            const rows = await repository.consentsByUser(user.id, transaction);
            return {
              data: {
                decision: consentDecisionDto(created),
                ...buildConsentState(rows),
              },
            };
          },
          { maxRetries: 2 },
        ),
      ),
  };
}
