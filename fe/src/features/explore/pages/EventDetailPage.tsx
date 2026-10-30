import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { Link, useLoaderData } from 'react-router-dom';
import type { eventDetailLoader } from '@/routes/catalogLoaders';
import { APP_PATHS } from '@/constants/path';
import { DatasetNotice } from '@/components/common/DatasetNotice';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/button-variants';
import { formatDate, safeHttpUrl } from '@/utils/format';
import { EVENT_STATUS_NAMES } from '../types/catalog';

export default function EventDetailPage() {
  const { data: eventItem, dataset } = useLoaderData<typeof eventDetailLoader>();
  const sourceUrl = safeHttpUrl(eventItem.sourceReference);
  const isCancelled = eventItem.eventStatus === 'CANCELLED';
  const isCompleted = eventItem.eventStatus === 'COMPLETED';

  return (
    <>
      <DatasetNotice dataset={dataset} />
      <Link to={APP_PATHS.EVENTS} className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Trở về danh sách sự kiện
      </Link>
      <div className="detail-heading">
        <div>
          <Badge>{EVENT_STATUS_NAMES[eventItem.eventStatus]}</Badge>
          <h1>{eventItem.title}</h1>
          <p className="meta-line">
            <MapPin size={16} aria-hidden="true" />
            <Link to={APP_PATHS.place(eventItem.placeId)}>{eventItem.placeTitle}</Link>
            {eventItem.region ? ` · ${eventItem.region.name}` : ''}
          </p>
        </div>
        <Link
          to={APP_PATHS.place(eventItem.placeId)}
          className={buttonVariants({ variant: 'secondary' })}
        >
          Xem địa điểm tổ chức
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {isCancelled && (
        <div className="form-error" role="alert" style={{ marginBottom: '24px' }}>
          <AlertTriangle size={18} aria-hidden="true" /> Sự kiện này đang ở trạng thái{' '}
          <strong>Đã hủy / tạm hoãn</strong>. Không thể thêm vào lịch trình như một hoạt động hợp
          lệ.
        </div>
      )}

      <div className="detail-grid">
        <article className="detail-main">
          {(eventItem.bannerUrl || eventItem.imageUrl) && (
            <div className="detail-banner-wrapper">
              <img
                src={eventItem.bannerUrl || eventItem.imageUrl || ''}
                alt={eventItem.title}
                className="detail-banner-img"
              />
            </div>
          )}
          <section className="content-card">
            <h2>Thông tin chi tiết sự kiện</h2>
            <p className="description-full">{eventItem.description}</p>
            <div className="source-note">
              <CalendarDays size={16} aria-hidden="true" />
              <span>
                Cập nhật: {formatDate(eventItem.updatedAt)}
                <br />
                {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noreferrer">
                    Xem nguồn sự kiện
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : (
                  (eventItem.sourceReference ?? 'Chưa có nguồn tham chiếu.')
                )}
              </span>
            </div>
          </section>
        </article>
        <aside className="detail-sidebar">
          <section className="content-card">
            <h3>Thời gian &amp; Trạng thái</h3>
            <dl className="facts">
              <div>
                <dt>Bắt đầu (Giờ Việt Nam)</dt>
                <dd>{formatDate(eventItem.startsAt)}</dd>
              </div>
              <div>
                <dt>Kết thúc (Giờ Việt Nam)</dt>
                <dd>{formatDate(eventItem.endsAt)}</dd>
              </div>
              <div>
                <dt>Trạng thái hiện tại</dt>
                <dd>{EVENT_STATUS_NAMES[eventItem.eventStatus]}</dd>
              </div>
            </dl>
            {!isCancelled && !isCompleted ? (
              <div style={{ marginTop: '16px' }}>
                <Link to={APP_PATHS.TRIPS} className={buttonVariants()}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Kiểm tra &amp; đưa vào chuyến đi
                </Link>
                <p className="muted" style={{ marginTop: '8px' }}>
                  Sự kiện sẽ được kiểm tra khớp ngày và khung giờ mở cửa trước khi lưu vào lịch
                  trình.
                </p>
              </div>
            ) : (
              <p className="muted" style={{ marginTop: '16px' }}>
                Sự kiện đã hủy hoặc đã kết thúc không thể thêm vào chuyến đi mới.
              </p>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
