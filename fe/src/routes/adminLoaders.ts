import { redirect } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { APP_PATHS } from '@/constants/path';
import { bootstrapAuth } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { getAdminContentMeta, listAdminEvents, listAdminPlaces } from '@/services/admin';
import { listAdminBookings } from '@/services/bookings';
import { listAdminAuditLogs, listAdminIssues } from '@/services/operations';
import { listAdminUsers } from '@/services/adminUsers';

export async function requireAdmin() {
  await bootstrapAuth();
  const state = useAuthStore.getState();
  if (state.phase !== 'authenticated' || !state.user?.roles.includes('ADMIN')) {
    throw redirect(APP_PATHS.FORBIDDEN);
  }
  return null;
}

export async function adminPlacesLoader({ request }: LoaderFunctionArgs) {
  await requireAdmin();
  const [meta, places] = await Promise.all([
    getAdminContentMeta(request.signal),
    listAdminPlaces({ pageSize: 100 }, request.signal),
  ]);
  return { meta, data: places.data };
}

export async function adminEventsLoader({ request }: LoaderFunctionArgs) {
  await requireAdmin();
  const [meta, events] = await Promise.all([
    getAdminContentMeta(request.signal),
    listAdminEvents({ pageSize: 100 }, request.signal),
  ]);
  return { meta, data: events.data };
}

export async function adminBookingsLoader() {
  await requireAdmin();
  return listAdminBookings({ pageSize: 50 });
}

export async function adminIssuesLoader() {
  await requireAdmin();
  return listAdminIssues({ pageSize: 50 });
}

export async function adminAuditLoader() {
  await requireAdmin();
  return listAdminAuditLogs({ pageSize: 50 });
}

export async function adminUsersLoader({ request }: LoaderFunctionArgs) {
  await requireAdmin();
  const params = new URL(request.url).searchParams;
  const query = new URLSearchParams();
  for (const key of ['q', 'status', 'role', 'page']) {
    const value = params.get(key);
    if (value) query.set(key, value);
  }
  query.set('pageSize', '20');
  return listAdminUsers(query, request.signal);
}
