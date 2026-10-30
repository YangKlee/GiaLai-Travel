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
import type { Place } from '@/features/explore/types/catalog';
import { getAdminContentMeta, listAdminContents } from '@/services/admin';
import { listMyItineraries } from '@/services/itineraries';
import type { SavedItinerarySummary } from '@/services/itineraries';
import { listMyBookings } from '@/services/bookings';
import type { BookingRecord } from '@/services/bookings';
import { listMyNotifications } from '@/services/notifications';
import type { NotificationItem } from '@/services/notifications';
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
  if (!query.has('pageSize')) query.set('pageSize', '12');
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
  const [{ dataset }, placesRes] = await Promise.all([
    getCatalog(request.signal),
    getPlaces(new URLSearchParams({ pageSize: '50' }), request.signal).catch(() => ({
      data: [] as Place[],
    })),
  ]);
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
  return {
    dataset,
    availablePlaces: placesRes.data,
    savedItineraries,
    isAuthenticated: state.phase === 'authenticated',
  };
}

export async function bookingsLoader({ request }: LoaderFunctionArgs) {
  const { dataset } = await getCatalog(request.signal);
  await bootstrapAuth();
  const state = useAuthStore.getState();
  if (state.phase !== 'authenticated') {
    return redirect(APP_PATHS.LOGIN);
  }
  let bookings: BookingRecord[];
  try {
    const res = await listMyBookings({ pageSize: 50 });
    bookings = res.data;
  } catch {
    bookings = [];
  }
  return { dataset, bookings, user: state.user };
}

export async function notificationsLoader({ request }: LoaderFunctionArgs) {
  const { dataset } = await getCatalog(request.signal);
  await bootstrapAuth();
  const state = useAuthStore.getState();
  if (state.phase !== 'authenticated') {
    return redirect(APP_PATHS.LOGIN);
  }
  let notifications: NotificationItem[];
  let unreadCount = 0;
  try {
    const res = await listMyNotifications({ pageSize: 50 });
    notifications = res.data;
    unreadCount = res.meta.unreadCount;
  } catch {
    notifications = [];
  }
  return { dataset, notifications, unreadCount, user: state.user };
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
