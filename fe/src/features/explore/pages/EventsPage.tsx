import { eventStatusLabel } from '@/utils/event-status';
import { ArrowUpRight, CalendarDays, MapPin, Search, Sparkles } from 'lucide-react';
import { Form, Link, useLoaderData, useSearchParams } from 'react-router-dom';
import type { eventsLoader } from '@/routes/catalogLoaders';
import { APP_PATHS } from '@/constants/path';
import { DatasetNotice } from '@/components/common/DatasetNotice';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/button-variants';
import { formatDate } from '@/utils/format';
import { EVENT_STATUS_NAMES } from '../types/catalog';
import type { EventStatus } from '../types/catalog';

export default function EventsPage() {
  const { catalog, events } = useLoaderData<typeof eventsLoader>();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const status = searchParams.get('status') ?? '';
  const regionId = searchParams.get('regionId') ?? '';

  return (
    <>
      <DatasetNotice dataset={events.dataset} />
      <section className="section-heading">
        <div>
          <h1>Sự kiện &amp; Lễ hội</h1>
          <p>Lễ hội văn hóa, cồng chiêng Tây Nguyên và các sự kiện theo mùa tại Gia Lai.</p>
        </div>
        <Link to={APP_PATHS.EXPLORE} className={buttonVariants({ variant: 'secondary' })}>
          Khám phá địa điểm
        </Link>
      </section>

      <Form method="get" action={APP_PATHS.EVENTS} className="filter-panel">
        <div className="filter-main">
          <label className="search-field">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Tìm tên sự kiện, lễ hội..."
              aria-label="Tìm tên sự kiện"
            />
          </label>
          <label className="filter-field">
            <span>Trạng thái</span>
            <select name="status" defaultValue={status}>
              <option value="">Tất cả trạng thái</option>
              {(Object.keys(EVENT_STATUS_NAMES) as EventStatus[]).map((code) => (
                <option key={code} value={code}>
                  {EVENT_STATUS_NAMES[code]}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-field">
            <span>Khu vực</span>
            <select name="regionId" defaultValue={regionId}>
              <option value="">Tất cả khu vực</option>
              {catalog.data.regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit">Lọc sự kiện</Button>
        </div>
      </Form>

      {events.data.length === 0 ? (
        <section className="empty-state empty-card">
          <Sparkles size={36} aria-hidden="true" />
          <h2>Chưa có sự kiện phù hợp bộ lọc</h2>
          <p>Hãy thử đổi trạng thái hoặc xóa bộ lọc để xem toàn bộ sự kiện đã công bố.</p>
          <Link to={APP_PATHS.EVENTS} className={buttonVariants({ variant: 'secondary' })}>
            Xóa bộ lọc
          </Link>
        </section>
      ) : (
        <div className="place-grid" style={{ marginTop: '24px' }}>
          {events.data.map((eventItem) => (
            <article key={eventItem.id} className="place-card">
              <div className="place-card-body">
                <Badge>{eventStatusLabel(eventItem)}</Badge>
                <h3>
                  <Link to={APP_PATHS.event(eventItem.id)}>
                    <span>{eventItem.title}</span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </h3>
                <p className="meta-line">
                  <MapPin size={14} aria-hidden="true" />
                  <Link to={APP_PATHS.place(eventItem.placeId)}>{eventItem.placeTitle}</Link>
                  {eventItem.region ? ` · ${eventItem.region.name}` : ''}
                </p>
                <p className="meta-line">
                  <CalendarDays size={14} aria-hidden="true" />
                  {formatDate(eventItem.startsAt)} – {formatDate(eventItem.endsAt)}
                </p>
                <p className="place-description">{eventItem.description}</p>
                <div className="place-card-bottom">
                  <Link
                    to={APP_PATHS.event(eventItem.id)}
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    Xem chi tiết sự kiện
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
