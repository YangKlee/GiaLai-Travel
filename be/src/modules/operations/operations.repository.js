import { randomUUID } from 'node:crypto';
import { Op } from 'sequelize';

export function createOperationsRepository(database) {
  const {
    Notifications,
    IssueReports,
    ContentItems,
    ContentRevisions,
    ContentTranslations,
    Users,
  } = database.models;

  return {
    async listNotifications(userId, query = {}) {
      const page = Math.max(1, Number(query.page) || 1);
      const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 20));
      const offset = (page - 1) * pageSize;

      const where = { user_id: userId };
      if (query.unreadOnly) {
        where.read_at = null;
      }

      const { rows, count } = await Notifications.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: pageSize,
        offset,
      });

      const unreadCount = await Notifications.count({
        where: { user_id: userId, read_at: null },
      });

      return { rows, total: count, unreadCount, page, pageSize };
    },

    async markNotificationRead(id, userId, now = new Date()) {
      const notification = await Notifications.findOne({
        where: { id, user_id: userId },
      });
      if (!notification) return null;
      if (!notification.read_at) {
        await notification.update({ read_at: now });
      }
      return notification;
    },

    async markAllNotificationsRead(userId, now = new Date()) {
      return Notifications.update(
        { read_at: now },
        { where: { user_id: userId, read_at: null } },
      );
    },

    async createIssueReport(
      { reporterId, contentId, category, description, now = new Date() },
      transaction,
    ) {
      return IssueReports.create(
        {
          id: randomUUID(),
          reporter_id: reporterId,
          content_id: contentId,
          category,
          description,
          status: 'NEW',
          created_at: now,
          updated_at: now,
        },
        { transaction },
      );
    },

    async findIssueById(id, transaction) {
      return IssueReports.findByPk(id, {
        include: [
          {
            model: Users,
            as: 'reporter',
            attributes: ['id', 'display_name', 'email'],
            required: false,
          },
          {
            model: Users,
            as: 'assignee',
            attributes: ['id', 'display_name', 'email'],
            required: false,
          },
          {
            model: ContentItems,
            as: 'content',
            required: false,
            include: [
              {
                model: ContentRevisions,
                as: 'published_revision',
                include: [
                  {
                    model: ContentTranslations,
                    as: 'content_translations',
                    where: { language_code: 'vi' },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
        transaction,
      });
    },

    async listUserIssues(userId, query = {}) {
      const page = Math.max(1, Number(query.page) || 1);
      const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 20));
      const offset = (page - 1) * pageSize;

      const where = { reporter_id: userId };
      if (query.status) where.status = query.status;

      const { rows, count } = await IssueReports.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: pageSize,
        offset,
        include: [
          {
            model: ContentItems,
            as: 'content',
            required: false,
            include: [
              {
                model: ContentRevisions,
                as: 'published_revision',
                include: [
                  {
                    model: ContentTranslations,
                    as: 'content_translations',
                    where: { language_code: 'vi' },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });

      return { rows, total: count, page, pageSize };
    },

    async listAdminIssues(query = {}) {
      const page = Math.max(1, Number(query.page) || 1);
      const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 20));
      const offset = (page - 1) * pageSize;

      const where = {};
      if (query.status) where.status = query.status;
      if (query.category) where.category = query.category;
      if (query.contentId) where.content_id = query.contentId;

      const { rows, count } = await IssueReports.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: pageSize,
        offset,
        include: [
          {
            model: Users,
            as: 'reporter',
            attributes: ['id', 'display_name', 'email'],
            required: false,
          },
          {
            model: ContentItems,
            as: 'content',
            required: false,
            include: [
              {
                model: ContentRevisions,
                as: 'published_revision',
                include: [
                  {
                    model: ContentTranslations,
                    as: 'content_translations',
                    where: { language_code: 'vi' },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });

      return { rows, total: count, page, pageSize };
    },
  };
}
