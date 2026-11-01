import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { APP_PATHS, ROUTE_SEGMENTS } from '@/constants/path';
import { RouteSuspense } from './RouteSuspense';
import { adminContentLoader } from './catalogLoaders';
import {
  adminAuditLoader,
  adminBookingsLoader,
  adminEventsLoader,
  adminIssuesLoader,
  adminPlacesLoader,
  adminUsersLoader,
  adminWardsLoader,
  requireAdmin,
} from './adminLoaders';

const AdminContentPage = lazy(() => import('@/features/admin/pages/AdminContentPage'));
const AdminPlacesPage = lazy(() => import('@/features/admin/pages/AdminPlacesPage'));
const AdminWardsPage = lazy(() => import('@/features/admin/pages/AdminWardsPage'));
const AdminEventsPage = lazy(() => import('@/features/admin/pages/AdminEventsPage'));
const AdminBookingsPage = lazy(() => import('@/features/admin/pages/AdminBookingsPage'));
const AdminIssuesPage = lazy(() => import('@/features/admin/pages/AdminIssuesPage'));
const AdminAuditPage = lazy(() => import('@/features/admin/pages/AdminAuditPage'));
const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminUsersPage'));
const ServerErrorPage = lazy(() =>
  import('@/features/errors/pages/ErrorPages').then((m) => ({ default: m.ServerErrorPage })),
);

const errorElement = (
  <RouteSuspense>
    <ServerErrorPage />
  </RouteSuspense>
);

export const adminRoutes: RouteObject[] = [
  {
    path: ROUTE_SEGMENTS.ADMIN,
    loader: requireAdmin,
    errorElement,
    children: [
      { index: true, element: <Navigate to={APP_PATHS.ADMIN_CONTENT} replace /> },
      {
        path: ROUTE_SEGMENTS.ADMIN_CONTENT,
        loader: adminContentLoader,
        errorElement,
        element: (
          <RouteSuspense>
            <AdminContentPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.ADMIN_PLACES,
        loader: adminPlacesLoader,
        errorElement,
        element: (
          <RouteSuspense>
            <AdminPlacesPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.ADMIN_WARDS,
        loader: adminWardsLoader,
        errorElement,
        element: (
          <RouteSuspense>
            <AdminWardsPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.ADMIN_EVENTS,
        loader: adminEventsLoader,
        errorElement,
        element: (
          <RouteSuspense>
            <AdminEventsPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.ADMIN_BOOKINGS,
        loader: adminBookingsLoader,
        errorElement,
        element: (
          <RouteSuspense>
            <AdminBookingsPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.ADMIN_ISSUES,
        loader: adminIssuesLoader,
        errorElement,
        element: (
          <RouteSuspense>
            <AdminIssuesPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.ADMIN_AUDIT,
        loader: adminAuditLoader,
        errorElement,
        element: (
          <RouteSuspense>
            <AdminAuditPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.ADMIN_USERS,
        loader: adminUsersLoader,
        errorElement,
        element: (
          <RouteSuspense>
            <AdminUsersPage />
          </RouteSuspense>
        ),
      },
    ],
  },
];
