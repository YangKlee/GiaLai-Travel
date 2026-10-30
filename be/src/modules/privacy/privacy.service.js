import { randomUUID } from 'node:crypto';
import { AppError } from '../../shared/app-error.js';
import { verifyPassword } from '../../shared/password.js';
import { appendAudit, appendNotification } from '../../shared/audit.js';
import { resolveNow, serializeUtc } from '../../shared/time.js';
import { serializeVnd } from '../../shared/money.js';
import { normalizePreferences } from '../users/users.schema.js';
import { PRIVACY_SLA_DAYS, PRIVACY_SLA_MILLISECONDS } from './privacy.schema.js';
import { createPrivacyRepository } from './privacy.repository.js';

function requestDto(row) {
  const verifiedAt = row.verified_at ? serializeUtc(row.verified_at) : null;
  const completedAt = row.completed_at ? serializeUtc(row.completed_at) : null;
  const slaDueAt = verifiedAt
    ? new Date(new Date(verifiedAt).getTime() + PRIVACY_SLA_MILLISECONDS).toISOString()
    : null;
  return {
    id: row.id,
    requestType: row.request_type,
    status: row.status,
    verifiedAt,
    completedAt,
    slaDueAt,
    resultNote: row.result_note ?? null,
    downloadPath:
      row.request_type === 'EXPORT' && row.status === 'COMPLETED'
        ? `/api/v1/me/privacy-requests/${row.id}/export`
        : null,
    createdAt: serializeUtc(row.created_at),
  };
}

function buildRetentionSummary(activeBookingsCount, historicalBookingsCount) {
  let policyNote =
    'Khi xóa tài khoản, hồ sơ nhận dạng cá nhân (email, mật khẩu, số điện thoại, sở thích) được ẩn danh; dữ liệu giao dịch bắt buộc và nhật ký kiểm toán tối thiểu được tách giữ theo chính sách.';
  if (activeBookingsCount > 0) {
    policyNote = `Hiện có ${activeBookingsCount} đơn đặt dịch vụ đang hoạt động. Hệ thống không âm thầm hủy đơn khi tiếp nhận yêu cầu xóa; vui lòng hoàn tất hoặc hủy đơn trước khi hồ sơ được ẩn danh hoàn toàn.`;
  } else if (historicalBookingsCount > 0) {
    policyNote = `Hiện có ${historicalBookingsCount} đơn giao dịch lịch sử cần tách giữ theo chính sách lưu trữ khi ẩn danh hồ sơ cá nhân.`;
  }
  return {
    activeBookingsCount,
    historicalBookingsCount,
    slaDays: PRIVACY_SLA_DAYS,
    policyNote,
  };
}

function buildDeleteResultNote(activeBookingsCount, historicalBookingsCount, completed = false) {
  if (activeBookingsCount > 0) {
    return `Đã xác minh yêu cầu xóa. Hiện có ${activeBookingsCount} đơn đặt dịch vụ đang hoạt động chưa kết thúc; hệ thống không tự động hủy đơn. Sau khi các đơn này hoàn tất hoặc được hủy hợp lệ, tác vụ xử lý sẽ ẩn danh hồ sơ cá nhân và giữ lại bản ghi giao dịch/kiểm toán bắt buộc theo chính sách lưu trữ.`;
  }
  if (completed) {
    return historicalBookingsCount > 0
      ? `Đã ẩn danh hồ sơ cá nhân (xóa email, mật khẩu, số điện thoại, sở thích và thu hồi toàn bộ phiên). Giữ lại ${historicalBookingsCount} hồ sơ giao dịch lịch sử và nhật ký kiểm toán theo chính sách lưu trữ.`
      : 'Đã ẩn danh hồ sơ cá nhân (xóa email, mật khẩu, số điện thoại, sở thích và thu hồi toàn bộ phiên). Chỉ giữ lại nhật ký kiểm toán tối thiểu theo chính sách.';
  }
  return historicalBookingsCount > 0
    ? `Đã xác minh yêu cầu xóa (hạn xử lý tối đa ${PRIVACY_SLA_DAYS} ngày). Khi hoàn tất, thông tin nhận dạng cá nhân (email, mật khẩu, số điện thoại, sở thích) sẽ được ẩn danh; ${historicalBookingsCount} bản ghi giao dịch lịch sử và nhật ký kiểm toán được tách giữ theo chính sách lưu trữ.`
    : `Đã xác minh yêu cầu xóa (hạn xử lý tối đa ${PRIVACY_SLA_DAYS} ngày). Hồ sơ cá nhân sẽ được ẩn danh và chỉ giữ lại nhật ký kiểm toán tối thiểu theo chính sách.`;
}

export async function processPendingPrivacyRequests({ database, clock, requestId = randomUUID() }) {
  const repository = createPrivacyRepository(database);
  const pending = await repository.pendingDeleteRequests();
  let anonymizedCount = 0;
  let deferredActiveBookingsCount = 0;

  for (const candidate of pending) {
    await database.transaction(async (transaction) => {
      const user = await repository.userById(candidate.user_id, transaction);
      const reqRow = await repository.requestById(candidate.id, transaction);
      if (!user || !reqRow || !['VERIFIED', 'PROCESSING'].includes(reqRow.status)) return;
      const now = resolveNow(clock, user.get('server_now'));
      const activeBookings = await repository.countActiveBookings(user.id, transaction);
      const historicalBookings = await repository.countHistoricalBookings(user.id, transaction);

      if (activeBookings > 0) {
        deferredActiveBookingsCount++;
        await reqRow.update(
          {
            status: 'PROCESSING',
            result_note: buildDeleteResultNote(activeBookings, historicalBookings, false),
          },
          { transaction },
        );
        await appendAudit(database, transaction, {
          actorId: null,
          action: 'PRIVACY_DELETE_DEFERRED_ACTIVE_BOOKINGS',
          targetType: 'PRIVACY_REQUEST',
          targetId: reqRow.id,
          requestId,
          metadata: { activeBookings, historicalBookings },
        });
        return;
      }

      if (user.status !== 'ANONYMIZED') {
        await repository.revokeUserSessions(user.id, now, transaction);
        await repository.consumeUserPasswordResets(user.id, now, transaction);
        await user.update(
          {
            status: 'ANONYMIZED',
            email: null,
            password_hash: null,
            display_name: 'Tài khoản đã ẩn danh',
            phone: null,
            preferences: null,
            updated_at: now,
          },
          { transaction },
        );
      }
      await reqRow.update(
        {
          status: 'COMPLETED',
          completed_at: now,
          result_note: buildDeleteResultNote(0, historicalBookings, true),
        },
        { transaction },
      );
      await appendAudit(database, transaction, {
        actorId: null,
        action: 'PRIVACY_DELETE_COMPLETED',
        targetType: 'PRIVACY_REQUEST',
        targetId: reqRow.id,
        requestId,
        metadata: { retainedHistoricalBookings: historicalBookings },
      });
      anonymizedCount++;
    });
  }

  return { processed: pending.length, anonymizedCount, deferredActiveBookingsCount };
}

export function createPrivacyService(database, { clock } = {}) {
  const repository = createPrivacyRepository(database);
  async function safe(work) {
    try {
      return await work();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(503, 'PRIVACY_UNAVAILABLE', 'Không thể xử lý yêu cầu dữ liệu cá nhân lúc này. Vui lòng thử lại sau.');
    }
  }
  return {
    listRequests: (userId) =>
      safe(async () => {
        const [rows, activeBookings, historicalBookings] = await Promise.all([
          repository.requestsByUser(userId),
          repository.countActiveBookings(userId),
          repository.countHistoricalBookings(userId),
        ]);
        return {
          data: {
            requests: rows.map(requestDto),
            retentionSummary: buildRetentionSummary(activeBookings, historicalBookings),
          },
        };
      }),
    createRequest: (userId, input, requestId) =>
      safe(async () => {
        const candidate = await repository.userById(userId);
        if (!candidate || candidate.status !== 'ACTIVE') {
          throw new AppError(401, 'SESSION_REVOKED', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
        }
        const verified = await verifyPassword(input.password, candidate.password_hash);
        if (!verified) {
          await database.transaction((transaction) =>
            appendAudit(database, transaction, {
              actorId: candidate.id,
              action: 'PRIVACY_REQUEST_VERIFY',
              targetType: 'USER',
              targetId: candidate.id,
              result: 'FAILURE',
              requestId,
              metadata: { requestType: input.requestType },
            }),
          );
          throw new AppError(
            401,
            'INVALID_CREDENTIALS',
            'Mật khẩu xác minh chưa đúng.',
            [{ field: 'password', message: 'Mật khẩu hiện tại chưa đúng.' }],
          );
        }

        return database.transaction(async (transaction) => {
          const user = await repository.userById(userId, transaction);
          if (!user || user.status !== 'ACTIVE' || user.password_hash !== candidate.password_hash) {
            throw new AppError(401, 'SESSION_REVOKED', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
          }
          const existingOpen = await repository.openRequestByType(
            user.id,
            input.requestType,
            transaction,
          );
          if (existingOpen) {
            throw new AppError(
              409,
              'PRIVACY_REQUEST_PENDING',
              'Bạn đang có một yêu cầu cùng loại đang chờ xử lý.',
            );
          }

          const now = resolveNow(clock, user.get('server_now'));
          const activeBookings = await repository.countActiveBookings(user.id, transaction);
          const historicalBookings = await repository.countHistoricalBookings(user.id, transaction);
          const id = randomUUID();

          let created;
          if (input.requestType === 'EXPORT') {
            const resultNote =
              'Gói dữ liệu cá nhân của bạn đã được xác minh và sẵn sàng tải xuống (hiệu lực tải 7 ngày).';
            created = await repository.createRequest(
              {
                id,
                user_id: user.id,
                request_type: 'EXPORT',
                status: 'COMPLETED',
                verified_at: now,
                completed_at: now,
                artifact_key: `privacy-export:${user.id}:${id}`,
                result_note: resultNote,
                created_at: now,
              },
              transaction,
            );
            await appendAudit(database, transaction, {
              actorId: user.id,
              action: 'PRIVACY_EXPORT_REQUEST',
              targetType: 'PRIVACY_REQUEST',
              targetId: id,
              requestId,
            });
            await appendNotification(database, transaction, {
              userId: user.id,
              eventKey: `privacy-export:${id}`,
              kind: 'PRIVACY',
              title: 'Yêu cầu xuất dữ liệu cá nhân đã hoàn tất',
              body: resultNote,
              targetType: 'PRIVACY_REQUEST',
              targetId: id,
            });
          } else {
            const resultNote = buildDeleteResultNote(activeBookings, historicalBookings, false);
            created = await repository.createRequest(
              {
                id,
                user_id: user.id,
                request_type: 'DELETE',
                status: 'VERIFIED',
                verified_at: now,
                completed_at: null,
                artifact_key: null,
                result_note: resultNote,
                created_at: now,
              },
              transaction,
            );
            await appendAudit(database, transaction, {
              actorId: user.id,
              action: 'PRIVACY_DELETE_REQUEST',
              targetType: 'PRIVACY_REQUEST',
              targetId: id,
              requestId,
              metadata: { activeBookings, historicalBookings },
            });
            await appendNotification(database, transaction, {
              userId: user.id,
              eventKey: `privacy-delete:${id}`,
              kind: 'PRIVACY',
              title: 'Đã tiếp nhận yêu cầu xóa dữ liệu cá nhân',
              body: resultNote,
              targetType: 'PRIVACY_REQUEST',
              targetId: id,
            });
          }

          return {
            data: {
              request: requestDto(created),
              retentionSummary: buildRetentionSummary(activeBookings, historicalBookings),
            },
          };
        });
      }),
    exportData: (userId, requestIdParam, requestId) =>
      safe(async () => {
        const reqRow = await repository.requestById(requestIdParam);
        if (!reqRow || reqRow.user_id !== userId || reqRow.request_type !== 'EXPORT' || reqRow.status !== 'COMPLETED') {
          throw new AppError(404, 'PRIVACY_EXPORT_NOT_FOUND', 'Không tìm thấy gói xuất dữ liệu thuộc tài khoản của bạn.');
        }
        const user = await repository.userById(userId);
        if (!user || user.status !== 'ACTIVE') {
          throw new AppError(401, 'SESSION_REVOKED', 'Phiên đã kết thúc. Vui lòng đăng nhập lại.');
        }
        const now = resolveNow(clock);
        const completedAt = new Date(serializeUtc(reqRow.completed_at ?? reqRow.created_at));
        const expiresAt = new Date(completedAt.getTime() + PRIVACY_SLA_MILLISECONDS);
        if (now >= expiresAt) {
          throw new AppError(
            410,
            'PRIVACY_EXPORT_EXPIRED',
            'Liên kết tải gói dữ liệu đã hết hạn 7 ngày. Vui lòng tạo yêu cầu xuất mới.',
          );
        }

        const [roles, snapshot] = await Promise.all([
          repository.roles(user.id),
          repository.exportSnapshot(user.id),
        ]);
        await database.transaction((transaction) =>
          appendAudit(database, transaction, {
            actorId: user.id,
            action: 'PRIVACY_EXPORT_DOWNLOAD',
            targetType: 'PRIVACY_REQUEST',
            targetId: reqRow.id,
            requestId,
          }),
        );

        return {
          data: {
            requestId: reqRow.id,
            exportedAt: completedAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
            subject: {
              id: user.id,
              email: user.email,
              displayName: user.display_name,
              phone: user.phone ?? null,
              roles,
              preferences: normalizePreferences(user.preferences),
              createdAt: serializeUtc(user.created_at),
            },
            consents: snapshot.consents.map((item) => ({
              id: item.id,
              purpose: item.purpose,
              decisionNo: Number(item.decision_no),
              granted: Boolean(item.granted),
              policyVersion: item.policy_version,
              decidedAt: serializeUtc(item.created_at),
            })),
            itineraries: snapshot.itineraries.map((item) => ({
              id: item.id,
              name: item.name,
              currentRevisionId: item.current_revision_id,
              deletedAt: item.deleted_at ? serializeUtc(item.deleted_at) : null,
              createdAt: serializeUtc(item.created_at),
            })),
            bookings: snapshot.bookings.map((item) => ({
              id: item.id,
              serviceId: item.service_id,
              slotId: item.slot_id,
              status: item.status,
              quantity: Number(item.quantity),
              unitPriceVnd: serializeVnd(item.unit_price_vnd),
              totalVnd: serializeVnd(item.total_vnd),
              startsAt: serializeUtc(item.starts_at),
              endsAt: serializeUtc(item.ends_at),
              createdAt: serializeUtc(item.created_at),
            })),
            issueReports: snapshot.issueReports.map((item) => ({
              id: item.id,
              contentId: item.content_id,
              category: item.category,
              status: item.status,
              createdAt: serializeUtc(item.created_at),
            })),
            privacyRequests: snapshot.privacyRequests.map(requestDto),
          },
        };
      }),
  };
}
