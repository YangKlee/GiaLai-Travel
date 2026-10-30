import { randomUUID } from 'node:crypto';
import { Op } from 'sequelize';

export function createBookingRepository(database) {
  const {
    Bookings,
    BookingStatusHistory,
    ServiceSlots,
    Services,
    Partners,
    Places,
    ContentItems,
    ContentRevisions,
    ContentTranslations,
    PaymentAttempts,
    Refunds,
    Commissions,
    Users,
  } = database.models;

  return {
    async findServiceWithSlot(serviceId, slotId, transaction) {
      const slot = await ServiceSlots.findOne({
        where: { id: slotId, service_id: serviceId },
        include: [
          {
            model: Services,
            as: 'service',
            where: { active: true },
            required: true,
            include: [
              {
                model: Partners,
                as: 'partner',
                where: { status: 'ACTIVE' },
                required: true,
                include: [
                  {
                    model: ContentItems,
                    as: 'content',
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
              },
              {
                model: ContentItems,
                as: 'content',
                where: { visibility: 'PUBLIC' },
                required: true,
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
          },
        ],
        transaction,
      });

      return slot;
    },

    async lockSlot(slotId, transaction) {
      return ServiceSlots.findByPk(slotId, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
    },

    async lockBooking(bookingId, transaction) {
      return Bookings.findByPk(bookingId, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
    },

    async findBookingById(bookingId, transaction) {
      return Bookings.findByPk(bookingId, {
        include: [
          {
            model: Users,
            as: 'customer',
            attributes: ['id', 'display_name', 'email'],
            required: false,
          },
          {
            model: ServiceSlots,
            as: 'slot',
            required: false,
          },
          {
            model: BookingStatusHistory,
            as: 'booking_status_histories',
            required: false,
          },
          {
            model: PaymentAttempts,
            as: 'payment_attempts',
            required: false,
          },
          {
            model: Refunds,
            as: 'refunds',
            required: false,
          },
        ],
        transaction,
      });
    },

    async findBookingByIdempotency(customerId, idempotencyKey, transaction) {
      return Bookings.findOne({
        where: { customer_id: customerId, idempotency_key: idempotencyKey },
        transaction,
      });
    },

    async createBookingRecord(data, transaction) {
      return Bookings.create(data, { transaction });
    },

    async addStatusHistory(
      {
        id = randomUUID(),
        bookingId,
        fromStatus = null,
        toStatus,
        actorId = null,
        reason = null,
        now = new Date(),
      },
      transactionOrOptions,
    ) {
      const transaction =
        transactionOrOptions && 'transaction' in transactionOrOptions
          ? transactionOrOptions.transaction
          : transactionOrOptions;
      return BookingStatusHistory.create(
        {
          id,
          booking_id: bookingId,
          from_status: fromStatus,
          to_status: toStatus,
          actor_id: actorId,
          reason,
          created_at: now,
        },
        { transaction },
      );
    },

    async findPaymentAttemptByIdempotency(idempotencyKey, transaction) {
      return PaymentAttempts.findOne({
        where: { idempotency_key: idempotencyKey },
        transaction,
      });
    },

    async createPaymentAttemptRecord(data, transaction) {
      return PaymentAttempts.create(data, { transaction });
    },

    async createRefundRecord(data, transaction) {
      return Refunds.create(data, { transaction });
    },

    async createCommissionRecord(data, transaction) {
      return Commissions.create(data, { transaction });
    },

    async listUserBookings(customerId, query = {}) {
      const page = Math.max(1, Number(query.page) || 1);
      const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 20));
      const offset = (page - 1) * pageSize;

      const where = { customer_id: customerId };
      if (query.status) where.status = query.status;

      const { rows, count } = await Bookings.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: pageSize,
        offset,
        include: [
          {
            model: ServiceSlots,
            as: 'slot',
          },
        ],
      });

      return { rows, total: count, page, pageSize };
    },

    async listAdminBookings(query = {}) {
      const page = Math.max(1, Number(query.page) || 1);
      const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 20));
      const offset = (page - 1) * pageSize;

      const where = {};
      if (query.status) where.status = query.status;

      const { rows, count } = await Bookings.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: pageSize,
        offset,
        include: [
          {
            model: ServiceSlots,
            as: 'slot',
          },
          {
            model: Users,
            as: 'customer',
            attributes: ['id', 'email', 'display_name'],
          },
        ],
      });

      return { rows, total: count, page, pageSize };
    },

    async findOverdueBookings(now) {
      const overdueReviews = await Bookings.findAll({
        where: {
          status: 'CHO_DUYET',
          review_deadline: { [Op.lt]: now },
        },
      });

      const overduePayments = await Bookings.findAll({
        where: {
          status: 'CHO_THANH_TOAN',
          payment_deadline: { [Op.lt]: now },
        },
      });

      return { overdueReviews, overduePayments };
    },
  };
}
