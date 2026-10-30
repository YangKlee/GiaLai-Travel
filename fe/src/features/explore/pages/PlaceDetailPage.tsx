import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Info,
  MapPin,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { Link, useLoaderData } from 'react-router-dom';
import type { placeLoader } from '@/routes/catalogLoaders';
import { APP_PATHS } from '@/constants/path';
import { DatasetNotice } from '@/components/common/DatasetNotice';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/button-variants';
import { formatDate, formatDuration, formatVnd, safeHttpUrl } from '@/utils/format';
import { CATEGORY_NAMES, EVENT_STATUS_NAMES, SERVICE_TYPE_NAMES } from '../types/catalog';
import { PlaceArtwork } from '../components/PlaceArtwork';
import { AddToTripButton } from '../components/AddToTripButton';
import { AudioGuidePlayer } from '../components/AudioGuidePlayer';

const weekdays = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

export default function PlaceDetailPage() {
  const { data: place, dataset } = useLoaderData<typeof placeLoader>();
  const sourceUrl = safeHttpUrl(place.sourceReference);
  const mapUrl =
    place.latitude !== null && place.longitude !== null
      ? `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=15/${place.latitude}/${place.longitude}`
      : null;
  const closures = place.closures ?? [];
  const audioGuides = place.audioGuides ?? [];
  const services = place.services ?? [];
  const events = place.events ?? [];

  return (
    <>
      <DatasetNotice dataset={dataset} />
      <Link to={APP_PATHS.EXPLORE} className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Trở về khám phá
      </Link>
      <div className="detail-heading">
        <div>
          <Badge>{CATEGORY_NAMES[place.category]}</Badge>
          <h1>{place.title}</h1>
          <p className="meta-line">
            <MapPin size={16} aria-hidden="true" />
            {place.region.name}
          </p>
        </div>
        <Link className={buttonVariants({ variant: 'secondary' })} to={APP_PATHS.TRIPS}>
          Xem bản nháp chuyến đi
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {closures.length > 0 && (
        <div className="info-note" role="status">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <strong>Thông báo đóng cửa ngoại lệ đã xác minh:</strong>
            {closures.map((closure) => (
              <p key={closure.id}>
                Từ {formatDate(closure.startsAt)} đến {formatDate(closure.endsAt)}: {closure.reason}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="detail-grid">
        <article className="detail-main">
          <PlaceArtwork category={place.category} large />
          <section className="content-card">
            <h2>Một điểm dừng, một trải nghiệm</h2>
            <p className="description-full">{place.description}</p>
            <div className="source-note">
              <CalendarDays size={16} aria-hidden="true" />
              <span>
                Cập nhật: {formatDate(place.updatedAt)}
                <br />
                {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noreferrer">
                    Xem nguồn nội dung
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : (
                  (place.sourceReference ?? 'Chưa có nguồn nội dung được xác minh.')
                )}
              </span>
            </div>
          </section>

          <div className="detail-sub-sections">
            <AudioGuidePlayer key={place.id} guides={audioGuides} />

            <section className="content-card">
              <div className="card-header-inline">
                <Ticket size={22} aria-hidden="true" />
                <div>
                  <h2>Dịch vụ &amp; Trải nghiệm tại điểm đến</h2>
                  <p className="muted">
                    Các dịch vụ đối tác công bố kèm khung giờ (slot) và số lượng suất còn nhận.
                  </p>
                </div>
              </div>
              {services.length === 0 ? (
                <p className="muted">Chưa có dịch vụ đối tác mở bán tại địa điểm này.</p>
              ) : (
                <div className="consent-list">
                  {services.map((service) => (
                    <div key={service.id} className="consent-item">
                      <div className="consent-title-row">
                        <div>
                          <Badge>{SERVICE_TYPE_NAMES[service.serviceType]}</Badge>
                          <h3>
                            <Link to={APP_PATHS.service(service.id)}>{service.title}</Link>
                          </h3>
                          <p className="muted">Đối tác: {service.partnerName}</p>
                        </div>
                        <div className="price">
                          {formatVnd(service.unitPriceVnd)} <small>/ {service.priceUnit}</small>
                        </div>
                      </div>
                      <p className="muted">{service.description}</p>
                      <div className="consent-actions">
                        <Link
                          to={APP_PATHS.service(service.id)}
                          className={buttonVariants({ variant: 'secondary' })}
                        >
                          Xem {service.slots.length} khung giờ &amp; điều kiện
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="content-card">
              <div className="card-header-inline">
                <Sparkles size={22} aria-hidden="true" />
                <div>
                  <h2>Sự kiện &amp; Lễ hội tại địa điểm</h2>
                  <p className="muted">
                    Thông tin sự kiện có nguồn xác minh theo lịch trình địa phương.
                  </p>
                </div>
              </div>
              {events.length === 0 ? (
                <p className="muted">Chưa có sự kiện nào được ghi nhận tại địa điểm này.</p>
              ) : (
                <div className="consent-list">
                  {events.map((eventItem) => (
                    <div key={eventItem.id} className="consent-item">
                      <div className="consent-title-row">
                        <h3>
                          <Link to={APP_PATHS.event(eventItem.id)}>{eventItem.title}</Link>
                        </h3>
                        <Badge>{EVENT_STATUS_NAMES[eventItem.eventStatus]}</Badge>
                      </div>
                      <p className="muted">{eventItem.description}</p>
                      <p className="muted">
                        Thời gian: {formatDate(eventItem.startsAt)} – {formatDate(eventItem.endsAt)}
                      </p>
                      <div className="consent-actions">
                        <Link
                          to={APP_PATHS.event(eventItem.id)}
                          className={buttonVariants({ variant: 'secondary' })}
                        >
                          Chi tiết sự kiện
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </article>
        <aside className="detail-sidebar">
          <section className="content-card trip-cta">
            <p className="eyebrow text-primary-hover">GỢI Ý ĐIỂM DỪNG</p>
            <h2>Đưa vào hành trình</h2>
            <dl className="facts">
              <div>
                <dt>Giá tham khảo</dt>
                <dd>{formatVnd(place.referencePriceVnd)}</dd>
              </div>
              <div>
                <dt>
                  <Clock3 size={16} aria-hidden="true" />
                  Thời lượng ghé thăm
                </dt>
                <dd>{formatDuration(place.typicalDurationMinutes)}</dd>
              </div>
            </dl>
            <AddToTripButton dataset={dataset} place={place} />
            <p className="muted">Chọn điểm vào bản nháp, chưa phát sinh đặt chỗ.</p>
          </section>
          <section className="content-card">
            <h3>Giờ mở cửa</h3>
            {place.openingHours.length ? (
              <>
                <ul className="opening-hours">
                  {place.openingHours.map((hour) => (
                    <li key={`${hour.weekday}-${hour.opensAt}`}>
                      <span>{weekdays[hour.weekday]}</span>
                      <strong>
                        {hour.opensAt.slice(0, 5)}–{hour.closesAt.slice(0, 5)}
                        {hour.crossesMidnight ? ' (+1 ngày)' : ''}
                      </strong>
                    </li>
                  ))}
                </ul>
                <p className="muted">
                  Giờ địa phương Việt Nam. Chưa bao gồm các đợt đóng cửa ngoại lệ; hãy xác nhận
                  trước khi đến.
                </p>
              </>
            ) : (
              <p className="muted">Chưa có giờ mở cửa. Hãy xác nhận với điểm đến trước khi đi.</p>
            )}
          </section>
          <section className="content-card">
            <h3>Vị trí</h3>
            {mapUrl ? (
              <a href={mapUrl} rel="noreferrer" target="_blank" className="map-link">
                <MapPin size={20} aria-hidden="true" />
                Xem trên OpenStreetMap
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : (
              <p className="muted">Chưa có tọa độ được xác minh.</p>
            )}
          </section>
        </aside>
      </div>
      <div className="info-note">
        <Info size={18} aria-hidden="true" />
        <p>
          Giá tham khảo có thể thay đổi. Bản nháp chưa kiểm tra quãng đường, giờ mở cửa hay tính khả
          thi của lịch trình.
        </p>
      </div>
    </>
  );
}
