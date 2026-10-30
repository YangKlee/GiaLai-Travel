import { randomUUID } from 'node:crypto';
import { AppError } from '../../shared/app-error.js';
import { appendAudit, appendNotification } from '../../shared/audit.js';
import { paginationMeta } from '../../shared/pagination.js';
import { resolveNow, serializeUtc } from '../../shared/time.js';
import { createBookingRepository } from './booking.repository.js';

function requireUser(actor) {
  if (!actor || !actor.user || !actor.user.id) {
    throw new AppError(401, 'AUTH_REQUIRED', 'Vui lòng đăng nhập để thực hiện đặt dịch vụ.');
  }
}

function requireAdmin(actor) {
  if (!actor || !Array.isArray(actor.roles) || !actor.roles.includes('ADMIN')) {
    throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền thực hiện thao tác quản trị đặt chỗ.');
  }
}

function serializeBooking(b) {
  const plain = b.get ? b.get({ plain: true }) : b;
  return {
    id: plain.id,
    customerId: plain.customer_id,
    customerName: plain.customer?.display_name ?? null,
    customerEmail: plain.customer?.email ?? null,
    serviceId: plain.service_id,
    serviceTitle: plain.service_snapshot?.title ?? 'Dịch vụ đối tác',
    partnerName: plain.service_snapshot?.partnerName ?? 'Đối tác',
    slotId: plain.slot_id,
    status: plain.status,
    quantity: Number(plain.quantity),
    unitPriceVnd: String(plain.unit_price_vnd),
    totalVnd: String(plain.total_vnd),
    commissionPercent: Number(plain.commission_percent),
    contactName: plain.contact_name,
    contactEmail: plain.contact_email,
    contactPhone: plain.contact_phone,
    startsAt: serializeUtc(plain.starts_at),
    endsAt: serializeUtc(plain.ends_at),
    reviewDeadline: serializeUtc(plain.review_deadline),
    paymentDeadline: plain.payment_deadline ? serializeUtc(plain.payment_deadline) : null,
    reviewedBy: plain.reviewed_by ?? null,
    reviewedAt: plain.reviewed_at ? serializeUtc(plain.reviewed_at) : null,
    rejectionReason: plain.rejection_reason ?? null,
    cancelledAt: plain.cancelled_at ? serializeUtc(plain.cancelled_at) : null,
    completedAt: plain.completed_at ? serializeUtc(plain.completed_at) : null,
    idempotencyKey: plain.idempotency_key,
    lockVersion: Number(plain.lock_version),
    createdAt: serializeUtc(plain.created_at),
    updatedAt: serializeUtc(plain.updated_at),
    history: (plain.booking_status_histories ?? []).map((h) => ({
      id: h.id,
      fromStatus: h.from_status,
      toStatus: h.to_status,
      reason: h.reason,
      createdAt: serializeUtc(h.created_at),
    })),
    payments: (plain.payment_attempts ?? []).map((p) => ({
      id: p.id,
      amountVnd: String(p.amount_vnd),
      status: p.status,
      isMock: Boolean(p.is_mock),
      idempotencyKey: p.idempotency_key,
      completedAt: p.completed_at ? serializeUtc(p.completed_at) : null,
    })),
    refunds: (plain.refunds ?? []).map((r) => ({
      id: r.id,
      amountVnd: String(r.amount_vnd),
      status: r.status,
      isMock: Boolean(r.is_mock),
      createdAt: serializeUtc(r.created_at),
    })),
  };
}

export function createBookingService(database, { clock } = {}) {
  const repository = createBookingRepository(database);

  async function safe(work) {
    try {
      return await work();
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error?.name === 'SequelizeUniqueConstraintError') {
        throw new AppError(409, 'BOOKING_CONFLICT', 'Yêu cầu bị trùng lặp hoặc xung đột khóa dữ liệu.');
      }
      throw new AppError(
        503,
        'BOOKING_UNAVAILABLE',
        'Hệ thống đặt dịch vụ đang tạm gián đoạn. Vui lòng thử lại sau.',
      );
    }
  }

  return {
    quoteBooking: (input) =>
      safe(async () => {
        const slot = await repository.findServiceWithSlot(input.serviceId, input.slotId);
        if (!slot) {
          throw new AppError(404, 'SLOT_NOT_FOUND', 'Không tìm thấy khung giờ dịch vụ yêu cầu.');
        }

        const available = slot.capacity - slot.held_quantity - slot.sold_quantity;
        const unitPrice = BigInt(String(slot.service.unit_price_vnd));
        const quantity = BigInt(input.quantity);
        const totalVnd = unitPrice * quantity;

        return {
          data: {
            serviceId: input.serviceId,
            slotId: input.slotId,
            serviceTitle: slot.service.content?.published_revision?.content_translations?.[0]?.title ?? 'Dịch vụ',
            partnerName: slot.service.partner?.content?.published_revision?.content_translations?.[0]?.title ?? 'Đối tác',
            startsAt: serializeUtc(slot.starts_at),
            endsAt: serializeUtc(slot.ends_at),
            quantity: input.quantity,
            availableQuantity: Math.max(0, available),
            isAvailable: available >= input.quantity,
            unitPriceVnd: unitPrice.toString(),
            totalVnd: totalVnd.toString(),
            currency: 'VND',
            cancellationPolicy: 'Mô phỏng: Hủy trước giờ khởi hành được hoàn 100% giá trị dịch vụ.',
          },
        };
      }),

    createBooking: (actor, input, requestId) =>
      safe(async () => {
        requireUser(actor);
        const now = resolveNow(clock);

        // Check customer idempotency first
        const existing = await repository.findBookingByIdempotency(
          actor.user.id,
          input.idempotencyKey,
        );
        if (existing) {
          const full = await repository.findBookingById(existing.id);
          return { data: serializeBooking(full) };
        }

        const slot = await repository.findServiceWithSlot(input.serviceId, input.slotId);
        if (!slot) {
          throw new AppError(404, 'SLOT_NOT_FOUND', 'Không tìm thấy khung giờ dịch vụ yêu cầu.');
        }

        // Rule BE-20: booking must be requested at least 24h30m prior to starts_at
        const minLeadTimeMs = 88200_000; // 24h30m in milliseconds
        const startsAtTime = new Date(slot.starts_at).getTime();
        const nowTime = now.getTime();
        if (startsAtTime <= nowTime + minLeadTimeMs) {
          throw new AppError(
            422,
            'INSUFFICIENT_LEAD_TIME',
            'Đơn đặt dịch vụ phải được gửi trước giờ bắt đầu tối thiểu 24 giờ 30 phút để ban quản trị kịp kiểm duyệt.',
          );
        }

        const available = slot.capacity - slot.held_quantity - slot.sold_quantity;
        if (available < input.quantity) {
          throw new AppError(
            409,
            'SLOT_CAPACITY_EXCEEDED',
            `Khung giờ này chỉ còn ${Math.max(0, available)} suất trống, không đủ cho ${input.quantity} khách.`,
          );
        }

        const unitPrice = BigInt(String(slot.service.unit_price_vnd));
        const totalVnd = unitPrice * BigInt(input.quantity);
        const reviewDeadline = new Date(nowTime + 24 * 3600000); // +24 hours
        const bookingId = randomUUID();

        const serviceTitle =
          slot.service.content?.published_revision?.content_translations?.[0]?.title ?? 'Dịch vụ';
        const partnerName =
          slot.service.partner?.content?.published_revision?.content_translations?.[0]?.title ?? 'Đối tác';

        return database.transaction(async (transaction) => {
          const created = await repository.createBookingRecord(
            {
              id: bookingId,
              customer_id: actor.user.id,
              service_id: input.serviceId,
              slot_id: input.slotId,
              status: 'CHO_DUYET',
              quantity: input.quantity,
              unit_price_vnd: unitPrice.toString(),
              total_vnd: totalVnd.toString(),
              commission_percent: 10.0,
              policy_snapshot: {
                cancellationPolicy: 'Hoàn 100% mô phỏng trước giờ khởi hành',
                refundLeadTimeHours: 1,
              },
              service_snapshot: {
                title: serviceTitle,
                partnerName,
                serviceType: slot.service.service_type,
                priceUnit: slot.service.price_unit,
              },
              contact_name: input.contactName,
              contact_email: input.contactEmail ?? null,
              contact_phone: input.contactPhone ?? null,
              starts_at: slot.starts_at,
              ends_at: slot.ends_at,
              review_deadline: reviewDeadline,
              payment_deadline: null,
              idempotency_key: input.idempotencyKey,
              lock_version: 0,
              created_at: now,
              updated_at: now,
            },
            transaction,
          );

          await repository.addStatusHistory(
            {
              bookingId: created.id,
              fromStatus: null,
              toStatus: 'CHO_DUYET',
              actorId: actor.user.id,
              reason: 'Du khách gửi yêu cầu đặt dịch vụ',
              now,
            },
            transaction,
          );

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'BOOKING_CREATE',
            targetType: 'BOOKING',
            targetId: created.id,
            requestId,
            metadata: { serviceId: input.serviceId, quantity: input.quantity, totalVnd: totalVnd.toString() },
          });

          await appendNotification(database, transaction, {
            userId: actor.user.id,
            eventKey: `booking-${created.id}-created`,
            kind: 'BOOKING',
            title: 'Yêu cầu đặt dịch vụ đã được ghi nhận',
            body: `Yêu cầu cho "${serviceTitle}" (${input.quantity} suất) đang chờ ban quản trị kiểm duyệt trong 24 giờ.`,
            targetType: 'BOOKING',
            targetId: created.id,
          });

          const full = await repository.findBookingById(created.id, transaction);
          return { data: serializeBooking(full) };
        });
      }),

    reviewBooking: (actor, bookingId, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);

        return database.transaction(async (transaction) => {
          // Lock slot then booking in consistent order
          const existingBooking = await repository.findBookingById(bookingId, transaction);
          if (!existingBooking) {
            throw new AppError(404, 'BOOKING_NOT_FOUND', 'Không tìm thấy đơn đặt dịch vụ.');
          }

          const slot = await repository.lockSlot(existingBooking.slot_id, transaction);
          const booking = await repository.lockBooking(bookingId, transaction);

          if (booking.status !== 'CHO_DUYET') {
            throw new AppError(
              409,
              'INVALID_BOOKING_STATE',
              `Đơn đặt dịch vụ đang ở trạng thái "${booking.status}", không thể duyệt lại.`,
            );
          }

          if (now > new Date(booking.review_deadline)) {
            throw new AppError(
              409,
              'REVIEW_DEADLINE_EXPIRED',
              'Đơn đặt dịch vụ đã quá thời hạn duyệt 24 giờ (đã hết hạn).',
            );
          }

          if (input.decision === 'REJECT') {
            await booking.update(
              {
                status: 'TU_CHOI',
                rejection_reason: input.rejectionReason,
                reviewed_by: actor.user.id,
                reviewed_at: now,
                updated_at: now,
              },
              { transaction },
            );

            await repository.addStatusHistory(
              {
                bookingId: booking.id,
                fromStatus: 'CHO_DUYET',
                toStatus: 'TU_CHOI',
                actorId: actor.user.id,
                reason: input.rejectionReason,
                now,
              },
              { transaction },
            );

            await appendAudit(database, transaction, {
              actorId: actor.user.id,
              action: 'BOOKING_REJECT',
              targetType: 'BOOKING',
              targetId: booking.id,
              requestId,
              metadata: { rejectionReason: input.rejectionReason },
            });

            await appendNotification(database, transaction, {
              userId: booking.customer_id,
              eventKey: `booking-${booking.id}-rejected`,
              kind: 'BOOKING',
              title: 'Đơn đặt dịch vụ không được phê duyệt',
              body: `Lý do từ chối: ${input.rejectionReason}`,
              targetType: 'BOOKING',
              targetId: booking.id,
            });

            const full = await repository.findBookingById(booking.id, transaction);
            return { data: serializeBooking(full) };
          }

          // Decision === 'APPROVE': hold slot capacity and set payment deadline +30m
          const currentHeld = slot.held_quantity;
          const currentSold = slot.sold_quantity;
          if (currentHeld + currentSold + booking.quantity > slot.capacity) {
            throw new AppError(
              409,
              'SLOT_CAPACITY_EXCEEDED',
              'Khung giờ đã hết sức chứa khả dụng, không thể phê duyệt giữ chỗ.',
            );
          }

          const paymentDeadline = new Date(now.getTime() + 30 * 60000);
          await slot.update(
            {
              held_quantity: currentHeld + booking.quantity,
              updated_at: now,
            },
            { transaction },
          );

          await booking.update(
            {
              status: 'CHO_THANH_TOAN',
              payment_deadline: paymentDeadline,
              reviewed_by: actor.user.id,
              reviewed_at: now,
              updated_at: now,
            },
            { transaction },
          );

          await repository.addStatusHistory(
            {
              bookingId: booking.id,
              fromStatus: 'CHO_DUYET',
              toStatus: 'CHO_THANH_TOAN',
              actorId: actor.user.id,
              reason: 'Ban quản trị phê duyệt, giữ chỗ trong 30 phút chờ thanh toán',
              now,
            },
            { transaction },
          );

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'BOOKING_APPROVE',
            targetType: 'BOOKING',
            targetId: booking.id,
            requestId,
            metadata: { heldQuantity: currentHeld + booking.quantity },
          });

          await appendNotification(database, transaction, {
            userId: booking.customer_id,
            eventKey: `booking-${booking.id}-approved`,
            kind: 'BOOKING',
            title: 'Đơn đặt dịch vụ đã được phê duyệt',
            body: 'Chỗ của bạn đã được giữ tạm thời. Vui lòng thanh toán mô phỏng trong vòng 30 phút.',
            targetType: 'BOOKING',
            targetId: booking.id,
          });

          const full = await repository.findBookingById(booking.id, transaction);
          return { data: serializeBooking(full) };
        });
      }),

    recordPaymentAttempt: (actor, bookingId, input, requestId) =>
      safe(async () => {
        requireUser(actor);
        const now = resolveNow(clock);

        // Check idempotency first
        const existingAttempt = await repository.findPaymentAttemptByIdempotency(
          input.idempotencyKey,
        );
        if (existingAttempt) {
          const full = await repository.findBookingById(bookingId);
          return { data: serializeBooking(full) };
        }

        return database.transaction(async (transaction) => {
          const existingBooking = await repository.findBookingById(bookingId, transaction);
          if (!existingBooking) {
            throw new AppError(404, 'BOOKING_NOT_FOUND', 'Không tìm thấy đơn đặt dịch vụ.');
          }

          if (
            existingBooking.customer_id !== actor.user.id &&
            !actor.roles?.includes('ADMIN')
          ) {
            throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền thanh toán cho đơn này.');
          }

          const slot = await repository.lockSlot(existingBooking.slot_id, transaction);
          const booking = await repository.lockBooking(bookingId, transaction);

          if (booking.status !== 'CHO_THANH_TOAN') {
            throw new AppError(
              409,
              'INVALID_BOOKING_STATE',
              `Đơn đặt dịch vụ đang ở trạng thái "${booking.status}", không chờ thanh toán.`,
            );
          }

          if (now > new Date(booking.payment_deadline)) {
            throw new AppError(
              409,
              'PAYMENT_DEADLINE_EXPIRED',
              'Đã quá thời hạn 30 phút để thanh toán giữ chỗ.',
            );
          }

          const attemptId = randomUUID();
          const dbStatus =
            input.outcome === 'SUCCEEDED'
              ? 'THANH_CONG'
              : input.outcome === 'FAILED'
                ? 'THAT_BAI'
                : 'DA_HUY_LAN_THU';

          await repository.createPaymentAttemptRecord(
            {
              id: attemptId,
              booking_id: booking.id,
              purchase_order_id: null,
              amount_vnd: booking.total_vnd,
              status: dbStatus,
              is_mock: true,
              idempotency_key: input.idempotencyKey,
              created_at: now,
              completed_at: now,
            },
            transaction,
          );

          if (input.outcome === 'SUCCEEDED') {
            // Move held quantity to sold quantity
            const newHeld = Math.max(0, slot.held_quantity - booking.quantity);
            const newSold = slot.sold_quantity + booking.quantity;
            await slot.update(
              {
                held_quantity: newHeld,
                sold_quantity: newSold,
                updated_at: now,
              },
              { transaction },
            );

            await booking.update(
              {
                status: 'DA_XAC_NHAN',
                updated_at: now,
              },
              { transaction },
            );

            await repository.addStatusHistory(
              {
                bookingId: booking.id,
                fromStatus: 'CHO_THANH_TOAN',
                toStatus: 'DA_XAC_NHAN',
                actorId: actor.user.id,
                reason: 'Thanh toán mô phỏng thành công',
                now,
              },
              { transaction },
            );

            await appendAudit(database, transaction, {
              actorId: actor.user.id,
              action: 'BOOKING_PAYMENT_SUCCESS',
              targetType: 'BOOKING',
              targetId: booking.id,
              requestId,
              metadata: { attemptId, amountVnd: String(booking.total_vnd) },
            });

            await appendNotification(database, transaction, {
              userId: booking.customer_id,
              eventKey: `booking-${booking.id}-confirmed`,
              kind: 'BOOKING',
              title: 'Đặt dịch vụ thành công & đã xác nhận',
              body: `Đơn đặt "${booking.service_snapshot?.title}" (${booking.quantity} suất) đã hoàn tất thanh toán mô phỏng.`,
              targetType: 'BOOKING',
              targetId: booking.id,
            });
          } else {
            await appendAudit(database, transaction, {
              actorId: actor.user.id,
              action: 'BOOKING_PAYMENT_FAILED',
              targetType: 'BOOKING',
              targetId: booking.id,
              requestId,
              metadata: { outcome: input.outcome },
            });
          }

          const full = await repository.findBookingById(booking.id, transaction);
          return { data: serializeBooking(full) };
        });
      }),

    cancelBooking: (actor, bookingId, input, requestId) =>
      safe(async () => {
        requireUser(actor);
        const now = resolveNow(clock);

        return database.transaction(async (transaction) => {
          const existingBooking = await repository.findBookingById(bookingId, transaction);
          if (!existingBooking) {
            throw new AppError(404, 'BOOKING_NOT_FOUND', 'Không tìm thấy đơn đặt dịch vụ.');
          }

          if (
            existingBooking.customer_id !== actor.user.id &&
            !actor.roles?.includes('ADMIN')
          ) {
            throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền hủy đơn này.');
          }

          const slot = await repository.lockSlot(existingBooking.slot_id, transaction);
          const booking = await repository.lockBooking(bookingId, transaction);

          if (!['CHO_DUYET', 'CHO_THANH_TOAN', 'DA_XAC_NHAN'].includes(booking.status)) {
            throw new AppError(
              409,
              'INVALID_BOOKING_STATE',
              `Đơn ở trạng thái "${booking.status}" không thể hủy.`,
            );
          }

          if (now >= new Date(booking.starts_at)) {
            throw new AppError(
              409,
              'SERVICE_ALREADY_STARTED',
              'Dịch vụ đã đến giờ bắt đầu hoặc đã qua, không thể hủy đơn.',
            );
          }

          // Inventory release
          if (booking.status === 'CHO_THANH_TOAN') {
            await slot.update(
              {
                held_quantity: Math.max(0, slot.held_quantity - booking.quantity),
                updated_at: now,
              },
              { transaction },
            );
          } else if (booking.status === 'DA_XAC_NHAN') {
            await slot.update(
              {
                sold_quantity: Math.max(0, slot.sold_quantity - booking.quantity),
                updated_at: now,
              },
              { transaction },
            );

            // Create 100% mock refund
            const successfulAttempt = await database.models.PaymentAttempts.findOne({
              where: { booking_id: booking.id, status: 'THANH_CONG' },
              transaction,
            });

            if (successfulAttempt) {
              await repository.createRefundRecord(
                {
                  id: randomUUID(),
                  payment_attempt_id: successfulAttempt.id,
                  booking_id: booking.id,
                  amount_vnd: booking.total_vnd,
                  status: 'HOAN_GIA_LAP_THANH_CONG',
                  is_mock: true,
                  idempotency_key: randomUUID(),
                  created_at: now,
                },
                transaction,
              );
            }
          }

          await booking.update(
            {
              status: 'DA_HUY',
              cancelled_at: now,
              updated_at: now,
            },
            { transaction },
          );

          await repository.addStatusHistory(
            {
              bookingId: booking.id,
              fromStatus: booking.status,
              toStatus: 'DA_HUY',
              actorId: actor.user.id,
              reason: input?.reason ?? 'Người dùng yêu cầu hủy đơn',
              now,
            },
            { transaction },
          );

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'BOOKING_CANCEL',
            targetType: 'BOOKING',
            targetId: booking.id,
            requestId,
            metadata: { reason: input?.reason },
          });

          await appendNotification(database, transaction, {
            userId: booking.customer_id,
            eventKey: `booking-${booking.id}-cancelled`,
            kind: 'BOOKING',
            title: 'Đơn đặt dịch vụ đã được hủy',
            body:
              booking.status === 'DA_XAC_NHAN'
                ? 'Đơn đã hủy và được tạo lệnh hoàn 100% tiền mô phỏng.'
                : 'Đơn đặt dịch vụ đã được hủy thành công.',
            targetType: 'BOOKING',
            targetId: booking.id,
          });

          const full = await repository.findBookingById(booking.id, transaction);
          return { data: serializeBooking(full) };
        });
      }),

    completeBooking: (actor, bookingId, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);

        return database.transaction(async (transaction) => {
          const booking = await repository.lockBooking(bookingId, transaction);
          if (!booking) {
            throw new AppError(404, 'BOOKING_NOT_FOUND', 'Không tìm thấy đơn đặt dịch vụ.');
          }

          if (booking.status !== 'DA_XAC_NHAN') {
            throw new AppError(
              409,
              'INVALID_BOOKING_STATE',
              `Chỉ đơn đã xác nhận (DA_XAC_NHAN) mới có thể hoàn tất, trạng thái hiện tại: "${booking.status}".`,
            );
          }

          if (now < new Date(booking.ends_at)) {
            throw new AppError(
              422,
              'SERVICE_NOT_ENDED',
              'Chưa đến thời điểm kết thúc dịch vụ (ends_at), chưa thể đánh dấu hoàn thành.',
            );
          }

          await booking.update(
            {
              status: 'HOAN_THANH',
              completed_at: now,
              updated_at: now,
            },
            { transaction },
          );

          // Calculate commission (10.00%)
          const totalVnd = BigInt(String(booking.total_vnd));
          const rate = Number(booking.commission_percent || 10.0);
          const commissionAmount = (totalVnd * BigInt(Math.round(rate * 100))) / 10000n;

          await repository.createCommissionRecord(
            {
              id: randomUUID(),
              booking_id: booking.id,
              base_amount_vnd: booking.total_vnd,
              rate_percent: rate,
              amount_vnd: commissionAmount.toString(),
              is_mock: true,
              created_at: now,
            },
            transaction,
          );

          await repository.addStatusHistory(
            {
              bookingId: booking.id,
              fromStatus: 'DA_XAC_NHAN',
              toStatus: 'HOAN_THANH',
              actorId: actor.user.id,
              reason: 'Dịch vụ đã hoàn tất và ghi nhận hoa hồng mô phỏng',
              now,
            },
            transaction,
          );

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'BOOKING_COMPLETE',
            targetType: 'BOOKING',
            targetId: booking.id,
            requestId,
            metadata: { commissionAmount: commissionAmount.toString() },
          });

          const full = await repository.findBookingById(booking.id, transaction);
          return { data: serializeBooking(full) };
        });
      }),

    listMyBookings: (actor, query) =>
      safe(async () => {
        requireUser(actor);
        const { rows, total, page, pageSize } = await repository.listUserBookings(
          actor.user.id,
          query,
        );
        return {
          data: rows.map(serializeBooking),
          meta: paginationMeta({ page, pageSize }, total),
        };
      }),

    getMyBooking: (actor, bookingId) =>
      safe(async () => {
        requireUser(actor);
        const booking = await repository.findBookingById(bookingId);
        if (!booking) {
          throw new AppError(404, 'BOOKING_NOT_FOUND', 'Không tìm thấy đơn đặt dịch vụ.');
        }
        if (booking.customer_id !== actor.user.id && !actor.roles?.includes('ADMIN')) {
          throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền truy cập đơn này.');
        }
        return { data: serializeBooking(booking) };
      }),

    listAdminBookings: (actor, query) =>
      safe(async () => {
        requireAdmin(actor);
        const { rows, total, page, pageSize } = await repository.listAdminBookings(query);
        return {
          data: rows.map(serializeBooking),
          meta: paginationMeta({ page, pageSize }, total),
        };
      }),

    expireOverdueBookings: async (requestId) => {
      const now = resolveNow(clock);
      const { overdueReviews, overduePayments } = await repository.findOverdueBookings(now);
      let expiredCount = 0;

      for (const booking of overdueReviews) {
        try {
          await database.transaction(async (transaction) => {
            const locked = await repository.lockBooking(booking.id, transaction);
            if (locked && locked.status === 'CHO_DUYET') {
              await locked.update({ status: 'HET_HAN', updated_at: now }, { transaction });
              await repository.addStatusHistory(
                {
                  bookingId: locked.id,
                  fromStatus: 'CHO_DUYET',
                  toStatus: 'HET_HAN',
                  reason: 'Quá hạn duyệt 24h',
                  now,
                },
                transaction,
              );
              expiredCount++;
            }
          });
        } catch {}
      }

      for (const booking of overduePayments) {
        try {
          await database.transaction(async (transaction) => {
            const slot = await repository.lockSlot(booking.slot_id, transaction);
            const locked = await repository.lockBooking(booking.id, transaction);
            if (locked && locked.status === 'CHO_THANH_TOAN') {
              await slot.update(
                {
                  held_quantity: Math.max(0, slot.held_quantity - locked.quantity),
                  updated_at: now,
                },
                { transaction },
              );
              await locked.update({ status: 'HET_HAN', updated_at: now }, { transaction });
              await repository.addStatusHistory(
                {
                  bookingId: locked.id,
                  fromStatus: 'CHO_THANH_TOAN',
                  toStatus: 'HET_HAN',
                  reason: 'Quá hạn thanh toán 30 phút, giải phóng tồn kho giữ chỗ',
                  now,
                },
                transaction,
              );
              expiredCount++;
            }
          });
        } catch {}
      }

      return { expiredCount };
    },
  };
}
