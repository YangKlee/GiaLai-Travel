import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Flag,
  Info,
  MapPin,
  Navigation,
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
import { useAuthStore } from '@/store/useAuthStore';
import { createIssueReport } from '@/services/operations';
import type { IssueCategory } from '@/services/operations';
import { Button } from '@/components/ui/Button';

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

  const user = useAuthStore((state) => state.user);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCategory, setReportCategory] = useState<IssueCategory>('INACCURATE_INFO');
  const [reportDesc, setReportDesc] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  async function handleSubmitIssue(e: FormEvent) {
    e.preventDefault();
    if (!reportDesc.trim()) return;
    setSubmittingReport(true);
    setReportError(null);
    try {
      await createIssueReport({
        contentId: place.id,
        category: reportCategory,
        description: reportDesc.trim(),
      });
      setReportSuccess(true);
      setReportDesc('');
    } catch (err: unknown) {
      setReportError(
        err instanceof Error ? err.message : 'Không thể gửi phản ánh. Vui lòng thử lại.',
      );
    } finally {
      setSubmittingReport(false);
    }
  }

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
          {place.bannerUrl || place.imageUrl ? (
            <div className="detail-banner-wrapper">
              <img
                src={place.bannerUrl || place.imageUrl || ''}
                alt={place.title}
                className="detail-banner-img"
              />
            </div>
          ) : (
            <PlaceArtwork category={place.category} large />
          )}
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
            <h3>Vị trí trên bản đồ</h3>
            {place.latitude !== null && place.longitude !== null ? (
              <div className="map-embed-container">
                <div className="map-iframe-wrapper">
                  <iframe
                    title={`Bản đồ Google Maps cho ${place.title}`}
                    src={`https://maps.google.com/maps?q=${place.latitude},${place.longitude}&hl=vi&z=15&output=embed`}
                    width="100%"
                    height="260"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="map-actions-row">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                    rel="noreferrer"
                    target="_blank"
                    className={buttonVariants({ variant: 'secondary' })}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                  >
                    <Navigation size={16} aria-hidden="true" />
                    Chỉ đường trên Google Maps
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                  <div className="map-sub-links">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                      rel="noreferrer"
                      target="_blank"
                      className="muted"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      Mở Google Maps lớn
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                    {mapUrl ? (
                      <a
                        href={mapUrl}
                        rel="noreferrer"
                        target="_blank"
                        className="muted"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        OpenStreetMap
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <p className="muted">Chưa có tọa độ được xác minh.</p>
            )}
          </section>

          <section className="content-card">
            <h3>Đóng góp chất lượng dữ liệu</h3>
            <p className="muted" style={{ fontSize: '0.88rem', marginBottom: '12px' }}>
              Phát hiện thông tin chưa chính xác, địa điểm đóng cửa hoặc giá vé thay đổi? Hãy gửi phản ánh để ban quản trị xác minh.
            </p>

            {user ? (
              <Button
                variant="secondary"
                onClick={() => setShowReportModal(!showReportModal)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Flag size={16} />
                Báo lỗi / Góp ý nội dung
              </Button>
            ) : (
              <Link to={APP_PATHS.LOGIN} className="button button-outline" style={{ display: 'block', textAlign: 'center' }}>
                Đăng nhập để góp ý dữ liệu
              </Link>
            )}

            {showReportModal && (
              <form onSubmit={handleSubmitIssue} style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                {reportSuccess ? (
                  <p style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                    Cảm ơn bạn! Báo cáo đã được ghi nhận vào hệ thống.
                  </p>
                ) : (
                  <>
                    {reportError && (
                      <p style={{ color: '#dc3545', fontSize: '0.85rem', marginBottom: '8px' }}>
                        {reportError}
                      </p>
                    )}
                    <div style={{ marginBottom: '10px' }}>
                      <label htmlFor="issueCategory" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                        Loại phản ánh:
                      </label>
                      <select
                        id="issueCategory"
                        value={reportCategory}
                        onChange={(e) => setReportCategory(e.target.value as IssueCategory)}
                        style={{ width: '100%', padding: '6px', fontSize: '0.88rem' }}
                      >
                        <option value="INACCURATE_INFO">Thông tin không chính xác</option>
                        <option value="CLOSED_DOWN">Địa điểm đã ngừng hoạt động</option>
                        <option value="OUTDATED_PRICE">Giá vé / Giờ mở cửa thay đổi</option>
                        <option value="INAPPROPRIATE">Nội dung không phù hợp</option>
                        <option value="OTHER">Vấn đề khác</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label htmlFor="issueDesc" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                        Mô tả chi tiết:
                      </label>
                      <textarea
                        id="issueDesc"
                        rows={3}
                        value={reportDesc}
                        onChange={(e) => setReportDesc(e.target.value)}
                        placeholder="Mô tả cụ thể thông tin cần cập nhật..."
                        style={{ width: '100%', padding: '8px', fontSize: '0.88rem' }}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submittingReport || !reportDesc.trim()}
                      style={{ width: '100%' }}
                    >
                      {submittingReport ? 'Đang gửi…' : 'Gửi phản ánh'}
                    </Button>
                  </>
                )}
              </form>
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
