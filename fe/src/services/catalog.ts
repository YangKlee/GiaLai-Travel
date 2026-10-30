import { get } from './api';
import type {
  AudioGuideItem,
  CatalogResponse,
  Dataset,
  EventDetailResponse,
  EventsResponse,
  PlaceResponse,
  PlacesResponse,
  ServiceDetailResponse,
  ServicesResponse,
} from '@/features/explore/types/catalog';

export const getCatalog = (signal?: AbortSignal): Promise<CatalogResponse> =>
  get('/api/v1/catalog', signal);

export const getPlaces = (query: URLSearchParams, signal?: AbortSignal): Promise<PlacesResponse> =>
  get(`/api/v1/places?${query.toString()}`, signal);

export const getPlace = (id: string, signal?: AbortSignal): Promise<PlaceResponse> =>
  get(`/api/v1/places/${encodeURIComponent(id)}`, signal);

export const getPlaceAudioGuides = (
  id: string,
  signal?: AbortSignal,
): Promise<{ data: AudioGuideItem[]; dataset: Dataset }> =>
  get(`/api/v1/places/${encodeURIComponent(id)}/audio-guides`, signal);

export const getEvents = (query: URLSearchParams, signal?: AbortSignal): Promise<EventsResponse> =>
  get(`/api/v1/events?${query.toString()}`, signal);

export const getEvent = (id: string, signal?: AbortSignal): Promise<EventDetailResponse> =>
  get(`/api/v1/events/${encodeURIComponent(id)}`, signal);

export const getServices = (
  query: URLSearchParams,
  signal?: AbortSignal,
): Promise<ServicesResponse> => get(`/api/v1/services?${query.toString()}`, signal);

export const getService = (id: string, signal?: AbortSignal): Promise<ServiceDetailResponse> =>
  get(`/api/v1/services/${encodeURIComponent(id)}`, signal);
