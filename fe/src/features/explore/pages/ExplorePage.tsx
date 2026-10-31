import { ArrowRight, Compass, MapPinned, Search, SlidersHorizontal, X } from 'lucide-react';
import { Form, Link, useLoaderData, useSearchParams } from 'react-router-dom';
import type { exploreLoader } from '@/routes/catalogLoaders';
import { APP_PATHS } from '@/constants/path';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/button-variants';
import { DatasetNotice } from '@/components/common/DatasetNotice';
import { PlaceCard } from '../components/PlaceCard';
import { useTripDraftStore } from '@/store/useTripDraftStore';

export default function ExplorePage() {
  const { catalog, places } = useLoaderData<typeof exploreLoader>();
  const [params] = useSearchParams();
  const selectedCount = useTripDraftStore((state) => state.drafts[places.dataset].places.length);
  function filterLink(key: string, value: string): string {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    return `${APP_PATHS.EXPLORE}?${next.toString()}`;
  }
  const hasFilter = ['q', 'category', 'regionId', 'minPrice', 'maxPrice'].some((key) =>
    params.get(key),
  );
  return (
    <>
      <DatasetNotice dataset={places.dataset} />
      <section className="hero explore-hero">
        <div>
          <h1>
            Một Gia Lai,{' '}
            <br />
            nhiều điều để khám phá.
          </h1>
          <p>Chọn điểm đến yêu thích và tự viết nên hành trình của riêng bạn.</p>
          <a href="#destinations" className="hero-link">
            Tìm điểm đến <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-ring" />
          <Compass size={140} strokeWidth={0.7} />
        </div>
      </section>
      <section id="destinations" className="discovery-section" aria-labelledby="discovery-title">
        <div className="section-heading">
          <div>
            <h2 id="discovery-title">Hôm nay, mình đi đâu?</h2>
            <p>Thiên nhiên, văn hóa và ẩm thực bản địa Gia Lai.</p>
          </div>
          <Link className={buttonVariants({ variant: 'secondary' })} to={APP_PATHS.TRIPS}>
            <MapPinned size={18} aria-hidden="true" />
            Xem bản nháp{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </Link>
        </div>
        <Form
          method="get"
          action={APP_PATHS.EXPLORE}
          className="filter-panel"
          key={params.toString()}
          role="search"
          aria-label="Tìm địa điểm"
        >
          <div className="filter-main">
            <label className="search-field">
              <span className="sr-only">Tên địa điểm</span>
              <Search size={18} aria-hidden="true" />
              <input
                name="q"
                placeholder="Bạn muốn khám phá nơi nào?"
                defaultValue={params.get('q') ?? ''}
                maxLength={120}
              />
            </label>
            <input type="hidden" name="category" value={params.get('category') ?? ''} />
            <Button type="submit">
              <Search size={18} aria-hidden="true" />
              Tìm kiếm
            </Button>
          </div>
          <details
            className="price-filter advanced-filters"
            open={Boolean(
              params.get('regionId') ||
              params.get('minPrice') ||
              params.get('maxPrice') ||
              params.get('sort') === 'price-asc',
            )}
          >
            <summary>
              <SlidersHorizontal size={14} aria-hidden="true" />
              Bộ lọc nâng cao (
              {
                ['regionId', 'minPrice', 'maxPrice', 'sort'].filter(
                  (key) => params.get(key) && !(key === 'sort' && params.get(key) === 'name'),
                ).length
              }
              )
            </summary>
            <div className="price-filter-fields">
              <label className="filter-field">
                <span>Khu vực</span>
                <select name="regionId" defaultValue={params.get('regionId') ?? ''}>
                  <option value="">Tất cả khu vực</option>
                  {catalog.data.regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-field">
                <span>Sắp xếp</span>
                <select name="sort" defaultValue={params.get('sort') ?? 'name'}>
                  <option value="name">Theo tên</option>
                  <option value="price-asc">Giá tăng dần</option>
                </select>
              </label>

              <label className="filter-field">
                <span>Giá từ (VND)</span>
                <input
                  inputMode="numeric"
                  name="minPrice"
                  pattern="[0-9]*"
                  defaultValue={params.get('minPrice') ?? ''}
                  placeholder="Không giới hạn"
                />
              </label>
              <label className="filter-field">
                <span>Đến (VND)</span>
                <input
                  inputMode="numeric"
                  name="maxPrice"
                  pattern="[0-9]*"
                  defaultValue={params.get('maxPrice') ?? ''}
                  placeholder="Không giới hạn"
                />
              </label>
              <Button type="submit">Áp dụng bộ lọc</Button>
              <Link to={APP_PATHS.EXPLORE}>Xóa bộ lọc nâng cao</Link>
            </div>
          </details>
        </Form>
        <div className="category-tabs" aria-label="Loại địa điểm">
          <Link
            className={!params.get('category') ? 'selected' : ''}
            to={filterLink('category', '')}
          >
            Tất cả
          </Link>
          {catalog.data.categories.map((category) => (
            <Link
              key={category.code}
              className={params.get('category') === category.code ? 'selected' : ''}
              to={filterLink('category', category.code)}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="results-heading">
          <p role="status">
            <strong>{places.meta.total}</strong> điểm đến
            {params.get('q') ? ` cho “${params.get('q')}”` : ' đang chờ bạn'}
          </p>
          {hasFilter ? (
            <Link to={APP_PATHS.EXPLORE}>
              <X size={14} aria-hidden="true" />
              Xóa bộ lọc
            </Link>
          ) : null}
        </div>
        {places.data.length ? (
          <div className="place-grid">
            {places.data.map((place) => (
              <PlaceCard key={place.id} place={place} dataset={places.dataset} />
            ))}
          </div>
        ) : (
          <div className="empty-state empty-card">
            <Search size={36} aria-hidden="true" />
            <h3>Chưa tìm thấy điểm đến phù hợp</h3>
            <p>Thử một từ khóa khác hoặc bỏ bớt bộ lọc để khám phá thêm.</p>
            <Link to={APP_PATHS.EXPLORE} className={buttonVariants({ variant: 'secondary' })}>
              Xem tất cả địa điểm
            </Link>
          </div>
        )}
        {places.meta.totalPages > 1 ? (
          <nav className="pagination" aria-label="Phân trang">
            {places.meta.page > 1 ? (
              <Link to={filterLink('page', String(places.meta.page - 1))}>Trang trước</Link>
            ) : (
              <span>Trang trước</span>
            )}
            <span>
              Trang {places.meta.page} / {places.meta.totalPages}
            </span>
            {places.meta.page < places.meta.totalPages ? (
              <Link to={filterLink('page', String(places.meta.page + 1))}>Trang sau</Link>
            ) : (
              <span>Trang sau</span>
            )}
          </nav>
        ) : null}
      </section>
      {selectedCount ? (
        <aside className="draft-bar">
          <MapPinned size={20} aria-hidden="true" />
          <span>
            <strong>{selectedCount} điểm đã chọn</strong>
            <small>Hành trình của bạn đang thành hình</small>
          </span>
          <Link to={APP_PATHS.TRIPS} className={buttonVariants()}>
            Xem bản nháp
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </aside>
      ) : null}
    </>
  );
}
