import { Link, useLoaderData } from 'react-router-dom';
import { ArrowDown, ArrowUp, Clock3, Info, MapPin, MapPinned, Plus, Trash2 } from 'lucide-react';
import { APP_PATHS } from '@/constants/path';
import { buttonVariants } from '@/components/ui/button-variants';
import { Button } from '@/components/ui/Button';
import { DatasetNotice } from '@/components/common/DatasetNotice';
import type { tripsLoader } from '@/routes/catalogLoaders';
import { MAX_DRAFT_STOPS, useTripDraftStore } from '@/store/useTripDraftStore';
import { formatDuration, formatVnd } from '@/utils/format';
import { PlaceArtwork } from '@/features/explore/components/PlaceArtwork';

export default function TripsPage() {
  const { dataset } = useLoaderData<typeof tripsLoader>();
  const draft = useTripDraftStore((state) => state.drafts[dataset]);
  const remove = useTripDraftStore((state) => state.remove);
  const move = useTripDraftStore((state) => state.move);
  const rename = useTripDraftStore((state) => state.rename);
  const priced = draft.places.filter((place) => place.referencePriceVnd !== null);
  const subtotal = priced.reduce((sum, place) => sum + BigInt(place.referencePriceVnd!), 0n);
  const durations = draft.places.filter((place) => place.typicalDurationMinutes !== null);
  const duration = durations.reduce((sum, place) => sum + (place.typicalDurationMinutes ?? 0), 0);
  return (
    <>
      <DatasetNotice dataset={dataset} />
      <div className="section-heading trips-heading">
        <div>
          <p className="eyebrow text-primary-hover">GOM ĐIỂM ĐẾN, DỆT HÀNH TRÌNH</p>
          <h1>Chuyến đi của tôi</h1>
          <p>Bắt đầu từ những nơi bạn muốn ghé qua.</p>
        </div>
        <Link className={buttonVariants({ variant: 'secondary' })} to={APP_PATHS.EXPLORE}>
          <Plus size={18} aria-hidden="true" />
          Thêm điểm đến
        </Link>
      </div>
      <div className="info-note">
        <Info size={18} aria-hidden="true" />
        <p>
          <strong>Bản nháp trong phiên mở trang.</strong> Tải lại trang sẽ xóa bản nháp. Chưa lưu
          lên tài khoản, chưa tính tuyến hoặc kiểm tra lịch trình khả thi.
        </p>
      </div>
      {!draft.places.length ? (
        <section className="empty-state empty-card">
          <MapPinned size={40} aria-hidden="true" />
          <h2>Hành trình bắt đầu từ một điểm đến</h2>
          <p>Khám phá và chọn những nơi bạn muốn ghé thăm.</p>
          <Link className={buttonVariants()} to={APP_PATHS.EXPLORE}>
            Khám phá địa điểm
          </Link>
        </section>
      ) : (
        <div className="trip-grid">
          <section className="content-card">
            <label className="trip-name">
              <span>Tên bản nháp</span>
              <input
                value={draft.name}
                onChange={(event) => rename(dataset, event.target.value)}
                maxLength={100}
              />
            </label>
            <p className="muted">
              {draft.places.length}/{MAX_DRAFT_STOPS} điểm · Dùng nút lên/xuống để đổi thứ tự
            </p>
            <ol className="trip-stops">
              {draft.places.map((place, index) => (
                <li key={place.id}>
                  <span className="stop-number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="stop-art">
                    <PlaceArtwork category={place.category} />
                  </div>
                  <div className="stop-info">
                    <h3>
                      <Link to={APP_PATHS.place(place.id)}>{place.title}</Link>
                    </h3>
                    <p className="meta-line">
                      <MapPin size={14} aria-hidden="true" />
                      {place.region.name}
                    </p>
                    <p className="muted">
                      {formatDuration(place.typicalDurationMinutes)} ·{' '}
                      {formatVnd(place.referencePriceVnd)}
                    </p>
                  </div>
                  <div className="stop-actions">
                    <Button
                      variant="ghost"
                      aria-label={`Đưa ${place.title} lên`}
                      disabled={index === 0}
                      onClick={() => move(dataset, place.id, -1)}
                    >
                      <ArrowUp size={18} aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      aria-label={`Đưa ${place.title} xuống`}
                      disabled={index === draft.places.length - 1}
                      onClick={() => move(dataset, place.id, 1)}
                    >
                      <ArrowDown size={18} aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      aria-label={`Bỏ ${place.title}`}
                      onClick={() => remove(dataset, place.id)}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <aside className="content-card trip-summary">
            <p className="eyebrow text-primary-hover">BẢN NHÁP CỦA BẠN</p>
            <h2>{draft.name.trim() || 'Chuyến đi chưa đặt tên'}</h2>
            <dl className="facts">
              <div>
                <dt>
                  <MapPinned size={16} aria-hidden="true" />
                  Điểm dừng
                </dt>
                <dd>{draft.places.length} điểm</dd>
              </div>
              <div>
                <dt>
                  <Clock3 size={16} aria-hidden="true" />
                  Thời gian tham quan đã biết
                </dt>
                <dd>{durations.length ? formatDuration(duration) : 'Chưa có dữ liệu'}</dd>
              </div>
              <div>
                <dt>Tổng giá tham khảo đã biết</dt>
                <dd className="summary-price">
                  {priced.length ? formatVnd(subtotal.toString()) : 'Chưa có dữ liệu'}
                </dd>
              </div>
            </dl>
            <p className="muted">
              {priced.length}/{draft.places.length} điểm có giá, {durations.length}/
              {draft.places.length} điểm có thời lượng. Chưa gồm di chuyển, ăn, ở và các khoản khác;
              đây chưa phải tổng ngân sách chuyến đi.
            </p>
            <Link to={APP_PATHS.EXPLORE} className={buttonVariants({ variant: 'secondary' })}>
              <Plus size={16} aria-hidden="true" />
              Khám phá thêm
            </Link>
          </aside>
        </div>
      )}
    </>
  );
}
