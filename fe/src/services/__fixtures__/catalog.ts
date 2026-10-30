import type { CatalogResponse, Place, PlacesResponse } from '@/features/explore/types/catalog';

// Imported only by unit tests, never by application routes/services.
export const placeFixture: Place = {
  id: '10000000-0000-4000-8000-000000000001',
  title: 'Địa điểm kiểm thử',
  description: 'Nội dung kiểm thử',
  category: 'NATURE',
  region: { id: '20000000-0000-4000-8000-000000000001', name: 'Vùng kiểm thử' },
  latitude: null,
  longitude: null,
  referencePriceVnd: null,
  typicalDurationMinutes: null,
  sourceReference: null,
  updatedAt: '2026-10-30T00:00:00.000Z',
};
export const catalogFixture: CatalogResponse = {
  dataset: 'demo',
  data: { categories: [{ code: 'NATURE', name: 'Thiên nhiên' }], regions: [placeFixture.region] },
};
export const placesFixture: PlacesResponse = {
  data: [placeFixture],
  dataset: 'demo',
  meta: { page: 1, pageSize: 6, total: 1, totalPages: 1 },
};
