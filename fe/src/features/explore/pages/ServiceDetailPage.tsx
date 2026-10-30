import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Ticket,
  Users,
} from 'lucide-react';
import { Link, useLoaderData } from 'react-router-dom';
import type { serviceDetailLoader } from '@/routes/catalogLoaders';
import { APP_PATHS } from '@/constants/path';
import { DatasetNotice } from '@/components/common/DatasetNotice';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatVnd, safeHttpUrl } from '@/utils/format';
import { SERVICE_TYPE_NAMES } from '../types/catalog';
import { useAuthStore } from '@/store/useAuthStore';
import { createBooking } from '@/services/bookings';
import { ApiError } from '@/services/api';

export default function ServiceDetailPage() {
  const { data: service, dataset } = useLoaderData<typeof serviceDetailLoader>();
  const user = useAuthStore((state) => state.user);
  const sourceUrl = safeHttpUrl(service.sourceReference);

  const [selectedSlotId, setSelectedSlotId] = useState<string>(service.slots[0]?.id ?? '');
  const [quantity, setQuantity] = useState<number>(1);
  const [contactName, setContactName] = useState<string>(user?.displayName ?? '');
  const [contactEmail, setContactEmail] = useState<string>(user?.email ?? '');
  const [contactPhone, setContactPhone] = useState<string>('0905123456');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

  const selectedSlot = service.slots.find((s) => s.id === selectedSlotId) ?? service.slots[0];
  const unitPrice = BigInt(service.unitPriceVnd || '0');
  const totalCost = unitPrice * BigInt(quantity);

  async function handleBookService(e: FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const idempotencyKey = `book-${service.id}-${selectedSlot.id}-${Date.now()}`;
      const res = await createBooking({
        serviceId: service.id,
        slotId: selectedSlot.id,
        quantity,
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        idempotencyKey,
      });
      setSuccessBookingId(res.data.id);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Không thể gửi yêu cầu đặt dịch vụ. Vui lòng thử lại sau.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <DatasetNotice dataset={dataset} />
      <Link
        to={service.placeId ? APP_PATHS.place(service.placeId) : APP_PATHS.EXPLORE}
        className="back-link"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {service.placeTitle ? `Trở về ${service.placeTitle}` : 'Trở về khám phá'}
      </Link>
      <div className="detail-heading">
        <div>
          <Badge>{SERVICE_TYPE_NAMES[service.serviceType]}</Badge>
          <h1>{service.title}</h1>
          <p className="meta-line">
            <Users size={16} aria-hidden="true" />
            Đối tác cung cấp: <strong>{service.partnerName}</strong>
            {service.placeId && service.placeTitle && (
              <>
                {' · '}
                <MapPin size={15} aria-hidden="true" />
                <Link to={APP_PATHS.place(service.placeId)}>{service.placeTitle}</Link>
              </>
            )}
          </p>
        </div>
        <div className="price">
          {formatVnd(service.unitPriceVnd)} <small>/ {service.priceUnit}</small>
        </div>
      </div>

      <div className="detail-grid">
        <article className="detail-main">
          <section className="content-card">
            <h2>Mô tả &amp; Điều kiện dịch vụ</h2>
            <p className="description-full">{service.description}</p>
            <div className="source-note">
              <CalendarDays size={16} aria-hidden="true" />
              <span>
                Cập nhật: {formatDate(service.updatedAt)}
                <br />
                {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noreferrer">
                    Xem nguồn công bố dịch vụ
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : (
                  (service.sourceReference ?? 'Chưa có nguồn tham chiếu.')
                )}
              </span>
            </div>
          </section>

          <section className="content-card" style={{ marginTop: '24px' }}>
            <div className="card-header-inline">
              <Ticket size={22} aria-hidden="true" />
              <div>
                <h2>Khung giờ phục vụ</h2>
              </div>
            </div>

            {service.slots.length === 0 ? (
              <p className="muted">Hiện chưa có khung giờ mở bán cho dịch vụ này.</p>
            ) : (
              <div className="consent-list" style={{ marginTop: '16px' }}>
                {service.slots.map((slot) => {
                  const isSelected = slot.id === selectedSlotId;
                  return (
                    <div
                      key={slot.id}
                      className="consent-item"
                      style={{
                        cursor: 'pointer',
                        borderColor: isSelected ? 'var(--color-primary)' : undefined,
                        background: isSelected ? 'rgba(40, 167, 69, 0.04)' : undefined,
                      }}
                      onClick={() => setSelectedSlotId(slot.id)}
                    >
                      <div className="consent-title-row">
                        <div>
                          <strong>
                            {formatDate(slot.startsAt)} → {formatDate(slot.endsAt)}
                          </strong>
                          <p className="muted">
                            Tổng sức chứa: {slot.capacity} · Đang giữ tạm: {slot.heldQuantity} · Đã
                            xác nhận: {slot.soldQuantity}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Badge>
                            {slot.availableQuantity > 0
                              ? `Còn ${slot.availableQuantity} suất`
                              : 'Hết suất'}
                          </Badge>
                          <input
                            type="radio"
                            name="slotSelect"
                            checked={isSelected}
                            onChange={() => setSelectedSlotId(slot.id)}
                            aria-label={`Chọn khung giờ ${slot.startsAt}`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </article>

        <aside className="detail-sidebar">
          <section className="content-card">
            <h3>Đặt dịch vụ (Mô phỏng)</h3>

            {successBookingId ? (
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(40, 167, 69, 0.1)',
                  borderRadius: '8px',
                  marginTop: '12px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#28a745' }}
                >
                  <CheckCircle2 size={20} />
                  <strong>Gửi yêu cầu thành công!</strong>
                </div>
                <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>
                  Mã đơn đặt: <code>{successBookingId}</code>
                </p>
                <p style={{ margin: '8px 0', fontSize: '0.85rem', color: '#666' }}>
                  Đơn của bạn đang ở trạng thái <strong>CHỜ DUYỆT</strong>. Bạn có thể theo dõi tiến
                  độ và thanh toán giữ chỗ tại trang Đơn đặt chỗ.
                </p>
                <Link
                  to={APP_PATHS.BOOKINGS}
                  className="button button-primary"
                  style={{
                    display: 'inline-flex',
                    marginTop: '8px',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  <CalendarCheck size={16} style={{ marginRight: '6px' }} />
                  Xem danh sách đơn đặt chỗ
                </Link>
              </div>
            ) : selectedSlot ? (
              <form onSubmit={handleBookService} style={{ marginTop: '16px' }}>
                {errorMsg && (
                  <div
                    style={{
                      padding: '10px',
                      background: 'rgba(220, 53, 69, 0.1)',
                      color: '#dc3545',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label
                    htmlFor="quantity"
                    style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    Số lượng người / suất:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={Math.max(1, selectedSlot.availableQuantity)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="form-input"
                    style={{ width: '100%', padding: '8px' }}
                    required
                  />
                  <small className="muted">
                    Còn khả dụng: {selectedSlot.availableQuantity} suất
                  </small>
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label
                    htmlFor="contactName"
                    style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    Họ tên liên hệ:
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="form-input"
                    style={{ width: '100%', padding: '8px' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label
                    htmlFor="contactPhone"
                    style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    Số điện thoại liên hệ:
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="0905123456"
                    className="form-input"
                    style={{ width: '100%', padding: '8px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="contactEmail"
                    style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    Email nhận xác nhận:
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="dukhach@example.com"
                    className="form-input"
                    style={{ width: '100%', padding: '8px' }}
                  />
                </div>

                <dl
                  className="facts"
                  style={{ margin: '16px 0', borderTop: '1px solid #eee', paddingTop: '12px' }}
                >
                  <div>
                    <dt>Đơn giá</dt>
                    <dd>{formatVnd(service.unitPriceVnd)}</dd>
                  </div>
                  <div>
                    <dt>Số lượng</dt>
                    <dd>{quantity} suất</dd>
                  </div>
                  <div>
                    <dt>
                      <strong>Tổng chi phí</strong>
                    </dt>
                    <dd>
                      <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                        {formatVnd(totalCost.toString())}
                      </strong>
                    </dd>
                  </div>
                </dl>

                <p className="muted" style={{ fontSize: '0.8rem', marginBottom: '16px' }}>
                  Chính sách: Hoàn 100% tiền mô phỏng nếu hủy trước giờ bắt đầu dịch vụ. Đơn phải
                  gửi trước giờ khởi hành tối thiểu 24h30m.
                </p>

                {user ? (
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting || selectedSlot.availableQuantity < quantity}
                    style={{ width: '100%', padding: '10px' }}
                  >
                    {submitting ? 'Đang gửi yêu cầu…' : 'Gửi yêu cầu đặt dịch vụ (Chờ duyệt)'}
                  </Button>
                ) : (
                  <Link
                    to={APP_PATHS.LOGIN}
                    className="button button-primary"
                    style={{ display: 'block', textAlign: 'center', width: '100%' }}
                  >
                    Đăng nhập để đặt dịch vụ
                  </Link>
                )}
              </form>
            ) : (
              <p className="muted">Vui lòng chọn một khung giờ để đặt dịch vụ.</p>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
