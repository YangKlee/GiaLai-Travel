import { redirect } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import {
  getCatalog,
  getEvent,
  getEvents,
  getPlace,
  getPlaces,
  getService,
} from '@/services/catalog';
import { getAdminContentMeta, listAdminContents } from '@/services/admin';
import { listMyItineraries } from '@/services/itineraries';
import type { SavedItinerarySummary } from '@/services/itineraries';
import { bootstrapAuth } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { APP_PATHS } from '@/constants/path';

const filterKeys = new Set([
  'q',
  'category',
  'regionId',
  'minPrice',
  'maxPrice',
  'sort',
  'page',
  'pageSize',
]);

const eventFilterKeys = new Set(['q', 'placeId', 'regionId', 'status', 'page', 'pageSize']);

export async function exploreLoader({ request }: LoaderFunctionArgs) {
  const query = new URLSearchParams();
  for (const [key, value] of new URL(request.url).searchParams) {
    if (filterKeys.has(key) && value.trim()) query.append(key, value);
  }
  if (!query.has('pageSize')) query.set('pageSize', '6');
  const [catalog, places] = await Promise.all([
    getCatalog(request.signal),
    getPlaces(query, request.signal),
  ]);
  return { catalog, places };
}

export async function placeLoader({ params, request }: LoaderFunctionArgs) {
  return getPlace(params.id ?? '', request.signal);
}

export async function eventsLoader({ request }: LoaderFunctionArgs) {
  const query = new URLSearchParams();
  for (const [key, value] of new URL(request.url).searchParams) {
    if (eventFilterKeys.has(key) && value.trim()) query.append(key, value);
  }
  if (!query.has('pageSize')) query.set('pageSize', '12');
  const [catalog, events] = await Promise.all([
    getCatalog(request.signal),
    getEvents(query, request.signal),
  ]);
  return { catalog, events };
}

export async function eventDetailLoader({ params, request }: LoaderFunctionArgs) {
  return getEvent(params.id ?? '', request.signal);
}

export async function serviceDetailLoader({ params, request }: LoaderFunctionArgs) {
  return getService(params.id ?? '', request.signal);
}

export async function tripsLoader({ request }: LoaderFunctionArgs) {
  const { dataset } = await getCatalog(request.signal);
  await bootstrapAuth();
  const state = useAuthStore.getState();
  let savedItineraries: SavedItinerarySummary[] = [];
  if (state.phase === 'authenticated') {
    try {
      savedItineraries = await listMyItineraries(request.signal);
    } catch {
      savedItineraries = [];
    }
  }
  return { dataset, savedItineraries, isAuthenticated: state.phase === 'authenticated' };
}

export async function adminContentLoader({ request }: LoaderFunctionArgs) {
  await bootstrapAuth();
  const state = useAuthStore.getState();
  if (state.phase !== 'authenticated' || !state.user?.roles.includes('ADMIN')) {
    return redirect(APP_PATHS.FORBIDDEN);
  }
  const [meta, contents] = await Promise.all([
    getAdminContentMeta(request.signal),
    listAdminContents(new URLSearchParams({ pageSize: '50' }), request.signal),
  ]);
  return { meta, contents };
}
