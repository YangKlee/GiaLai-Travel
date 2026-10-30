import { createHash } from 'node:crypto';
import { AppError } from '../../shared/app-error.js';
import { appendAudit, appendNotification, listAuditLogs } from '../../shared/audit.js';
import { paginationMeta } from '../../shared/pagination.js';
import { resolveNow, serializeUtc } from '../../shared/time.js';
import { createOperationsRepository } from './operations.repository.js';
import { createItineraryRepository } from '../itineraries/itinerary.repository.js';

function requireUser(actor) {
  if (!actor || !actor.user || !actor.user.id) {
    throw new AppError(401, 'AUTH_REQUIRED', 'Vui lòng đăng nhập để thực hiện thao tác này.');
  }
}

function requireAdmin(actor) {
  if (!actor || !Array.isArray(actor.roles) || !actor.roles.includes('ADMIN')) {
    throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền thực hiện thao tác quản trị này.');
  }
}

function serializeNotification(n) {
  return {
    id: n.id,
    userId: n.user_id,
    eventKey: n.event_key,
    kind: n.kind,
    title: n.title,
    body: n.body,
    targetType: n.target_type,
    targetId: n.target_id,
    readAt: n.read_at ? serializeUtc(n.read_at) : null,
    createdAt: serializeUtc(n.created_at),
  };
}

function serializeIssue(i) {
  return {
    id: i.id,
    reporterId: i.reporter_id,
    reporterName: i.reporter?.display_name ?? null,
    contentId: i.content_id,
    contentTitle:
      i.content?.published_revision?.content_translations?.[0]?.title ?? 'Nội dung',
    contentKind: i.content?.kind ?? null,
    category: i.category,
    description: i.description,
    status: i.status,
    assigneeId: i.assignee_id,
    assigneeName: i.assignee?.display_name ?? null,
    duplicateOf: i.duplicate_of,
    response: i.response,
    createdAt: serializeUtc(i.created_at),
    updatedAt: serializeUtc(i.updated_at),
  };
}

export function createOperationsService(database, { clock } = {}) {
  const repository = createOperationsRepository(database);
  const itineraryRepo = createItineraryRepository(database);

  return {
    listNotifications: async (actor, query) => {
      requireUser(actor);
      const { rows, total, unreadCount, page, pageSize } =
        await repository.listNotifications(actor.user.id, query);
      return {
        data: rows.map(serializeNotification),
        meta: {
          ...paginationMeta({ page, pageSize }, total),
          unreadCount,
        },
      };
    },

    getUnreadCount: async (actor) => {
      requireUser(actor);
      const { unreadCount } = await repository.listNotifications(actor.user.id, {
        pageSize: 1,
      });
      return { data: { unreadCount } };
    },

    markNotificationRead: async (actor, id) => {
      requireUser(actor);
      const now = resolveNow(clock);
      const updated = await repository.markNotificationRead(id, actor.user.id, now);
      if (!updated) {
        throw new AppError(404, 'NOTIFICATION_NOT_FOUND', 'Không tìm thấy thông báo.');
      }
      return { data: serializeNotification(updated) };
    },

    markAllNotificationsRead: async (actor) => {
      requireUser(actor);
      const now = resolveNow(clock);
      await repository.markAllNotificationsRead(actor.user.id, now);
      return { data: { success: true } };
    },

    createIssueReport: async (actor, input, requestId) => {
      requireUser(actor);
      const now = resolveNow(clock);

      const content = await database.models.ContentItems.findByPk(input.contentId);
      if (!content) {
        throw new AppError(404, 'CONTENT_NOT_FOUND', 'Mục nội dung được báo cáo không tồn tại.');
      }

      return database.transaction(async (transaction) => {
        const created = await repository.createIssueReport(
          {
            reporterId: actor.user.id,
            contentId: input.contentId,
            category: input.category,
            description: input.description,
            now,
          },
          transaction,
        );

        await appendAudit(database, transaction, {
          actorId: actor.user.id,
          action: 'ISSUE_REPORT_CREATE',
          targetType: 'ISSUE',
          targetId: created.id,
          requestId,
          metadata: { contentId: input.contentId, category: input.category },
        });

        await appendNotification(database, transaction, {
          userId: actor.user.id,
          eventKey: `issue-${created.id}-created`,
          kind: 'ISSUE',
          title: 'Đã tiếp nhận phản hồi đóng góp của bạn',
          body: 'Cảm ơn bạn đã phản hồi chất lượng dữ liệu. Ban quản trị sẽ xác minh và cập nhật.',
          targetType: 'ISSUE',
          targetId: created.id,
        });

        const full = await repository.findIssueById(created.id, transaction);
        return { data: serializeIssue(full) };
      });
    },

    listUserIssues: async (actor, query) => {
      requireUser(actor);
      const { rows, total, page, pageSize } = await repository.listUserIssues(
        actor.user.id,
        query,
      );
      return {
        data: rows.map(serializeIssue),
        meta: paginationMeta({ page, pageSize }, total),
      };
    },

    listAdminIssues: async (actor, query) => {
      requireAdmin(actor);
      const { rows, total, page, pageSize } = await repository.listAdminIssues(query);
      return {
        data: rows.map(serializeIssue),
        meta: paginationMeta({ page, pageSize }, total),
      };
    },

    reviewAdminIssue: async (actor, issueId, input, requestId) => {
      requireAdmin(actor);
      const now = resolveNow(clock);

      return database.transaction(async (transaction) => {
        const issue = await database.models.IssueReports.findByPk(issueId, {
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        if (!issue) {
          throw new AppError(404, 'ISSUE_NOT_FOUND', 'Không tìm thấy phiếu báo lỗi.');
        }

        await issue.update(
          {
            status: input.status,
            response: input.response ?? issue.response,
            duplicate_of: input.duplicateOf ?? issue.duplicate_of,
            assignee_id: actor.user.id,
            updated_at: now,
          },
          { transaction },
        );

        await appendAudit(database, transaction, {
          actorId: actor.user.id,
          action: 'ISSUE_REPORT_REVIEW',
          targetType: 'ISSUE',
          targetId: issue.id,
          requestId,
          metadata: { status: input.status },
        });

        if (input.response) {
          await appendNotification(database, transaction, {
            userId: issue.reporter_id,
            eventKey: `issue-${issue.id}-updated-${now.getTime()}`,
            kind: 'ISSUE',
            title: 'Phản hồi cho đóng góp của bạn đã có cập nhật',
            body: input.response,
            targetType: 'ISSUE',
            targetId: issue.id,
          });
        }

        const full = await repository.findIssueById(issue.id, transaction);
        return { data: serializeIssue(full) };
      });
    },

    listAdminAuditLogs: async (actor, query) => {
      requireAdmin(actor);
      return listAuditLogs(database, {
        actorUser: actor.user,
        page: query.page,
        pageSize: query.pageSize,
        targetType: query.targetType,
        targetId: query.targetId,
        action: query.action,
        result: query.result,
      });
    },

    getItineraryOfflineManifest: async (actor, itineraryId) => {
      requireUser(actor);
      const now = resolveNow(clock);

      const itinerary = await itineraryRepo.findItineraryById(itineraryId);
      if (!itinerary) {
        throw new AppError(404, 'ITINERARY_NOT_FOUND', 'Không tìm thấy lịch trình du lịch.');
      }
      if (itinerary.owner_id !== actor.user.id && !actor.roles?.includes('ADMIN')) {
        throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền truy cập lịch trình này.');
      }

      const activeRevision = itinerary.current_revision;
      if (!activeRevision) {
        throw new AppError(422, 'NO_REVISION', 'Lịch trình chưa có bản sửa đổi hợp lệ.');
      }

      const days = (activeRevision.itinerary_days ?? []).map((day) => ({
        dayNumber: day.day_number,
        date: day.date,
        title: day.title,
        notes: day.notes,
        stops: (day.itinerary_stops ?? []).map((stop) => ({
          id: stop.id,
          stopOrder: stop.stop_order,
          placeId: stop.place_id,
          placeTitle: stop.place_title,
          contentRevisionId: stop.content_revision_id,
          lat: stop.lat ? Number(stop.lat) : null,
          lng: stop.lng ? Number(stop.lng) : null,
          arrivalMinutes: stop.arrival_minutes,
          departureMinutes: stop.departure_minutes,
          estimatedCostVnd: String(stop.estimated_cost_vnd),
        })),
        legs: (day.itinerary_legs ?? []).map((leg) => ({
          fromStopId: leg.from_stop_id,
          toStopId: leg.to_stop_id,
          transportMode: leg.transport_mode,
          durationMinutes: leg.duration_minutes,
          distanceMeters: leg.distance_meters,
          estimatedCostVnd: String(leg.estimated_cost_vnd),
        })),
      }));

      const manifestPayload = {
        manifestVersion: '1.0',
        packageId: itinerary.id,
        itineraryName: itinerary.name,
        startDate: activeRevision.start_date,
        daysCount: activeRevision.days_count,
        partySize: activeRevision.party_size,
        totalBudgetVnd: String(activeRevision.total_budget_vnd),
        transportMode: activeRevision.transport_mode,
        origin: activeRevision.origin,
        days,
      };

      const checksum = createHash('sha256')
        .update(JSON.stringify(manifestPayload))
        .digest('hex');

      return {
        data: {
          ...manifestPayload,
          checksum,
          generatedAt: serializeUtc(now),
        },
      };
    },
  };
}
