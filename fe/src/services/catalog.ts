import { get } from './api';
import type {
  CatalogResponse,
  PlaceResponse,
  PlacesResponse,
} from '@/features/explore/types/catalog';

export const getCatalog = (signal?: AbortSignal): Promise<CatalogResponse> =>
  get('/api/v1/catalog', signal);
export const getPlaces = (query: URLSearchParams, signal?: AbortSignal): Promise<PlacesResponse> =>
  get(`/api/v1/places?${query.toString()}`, signal);
export const getPlace = (id: string, signal?: AbortSignal): Promise<PlaceResponse> =>
  get(`/api/v1/places/${encodeURIComponent(id)}`, signal);
