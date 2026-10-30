import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Ticket, Users } from 'lucide-react';
import { Link, useLoaderData } from 'react-router-dom';
import type { serviceDetailLoader } from '@/routes/catalogLoaders';
import { APP_PATHS } from '@/constants/path';
import { DatasetNotice } from '@/components/common/DatasetNotice';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatVnd, safeHttpUrl } from '@/utils/format';
import { SERVICE_TYPE_NAMES } from '../types/catalog';

export default function ServiceDetailPage() {
  const { data: service, dataset } = useLoaderData<typeof serviceDetailLoader>();
  const sourceUrl = safeHttpUrl(service.sourceReference);

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
                <h2>Khung giờ phục vụ (Service Slots)</h2>
                <p className="muted">
                  Tồn kho tính theo từng khoảng thời gian độc lập; yêu cầu đặt dịch vụ chỉ giữ chỗ
                  sau khi quản trị viên duyệt đơn.
                </p>
              </div>
            </div>

            {service.slots.length === 0 ? (
              <p className="muted">Hiện chưa có khung giờ mở bán cho dịch vụ này.</p>
            ) : (
              <div className="consent-list">
                {service.slots.map((slot) => (
                  <div key={slot.id} className="consent-item">
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
                      <Badge>
                        {slot.availableQuantity > 0
                          ? `Còn ${slot.availableQuantity} suất`
                          : 'Hết suất'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </article>

        <aside className="detail-sidebar">
          <section className="content-card">
            <h3>Tóm tắt chi phí</h3>
            <dl className="facts">
              <div>
                <dt>Đơn giá công bố</dt>
                <dd>{formatVnd(service.unitPriceVnd)}</dd>
              </div>
              <div>
                <dt>Đơn vị tính</dt>
                <dd>{service.priceUnit}</dd>
              </div>
              <div>
                <dt>Số khung giờ mở bán</dt>
                <dd>{service.slots.length} khung giờ</dd>
              </div>
            </dl>
            <p className="muted" style={{ marginTop: '12px' }}>
              Giao dịch trên hệ thống là mô phỏng học thuật, không thu tiền thật.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
