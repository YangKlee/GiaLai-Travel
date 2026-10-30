import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { APP_PATHS, ROUTE_SEGMENTS } from '@/constants/path';
import { RouteSuspense } from './RouteSuspense';
import {
  adminContentLoader,
  bookingsLoader,
  eventDetailLoader,
  eventsLoader,
  exploreLoader,
  notificationsLoader,
  placeLoader,
  serviceDetailLoader,
  tripsLoader,
} from './catalogLoaders';
import { PageLoadingState } from '@/components/common/PageLoadingState';
import { sessionLoader } from './authLoaders';
import { authRoutes } from './authRoutes';

const ExplorePage = lazy(() => import('@/features/explore/pages/ExplorePage'));
const PlaceDetailPage = lazy(() => import('@/features/explore/pages/PlaceDetailPage'));
const EventsPage = lazy(() => import('@/features/explore/pages/EventsPage'));
const EventDetailPage = lazy(() => import('@/features/explore/pages/EventDetailPage'));
const ServiceDetailPage = lazy(() => import('@/features/explore/pages/ServiceDetailPage'));
const TripsPage = lazy(() => import('@/features/trips/pages/TripsPage'));
const BookingsPage = lazy(() => import('@/features/bookings/pages/BookingsPage'));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'));
const AdminContentPage = lazy(() => import('@/features/admin/pages/AdminContentPage'));
const ServerErrorPage = lazy(() =>
  import('@/features/errors/pages/ErrorPages').then((m) => ({ default: m.ServerErrorPage })),
);

export const mainRoutes: RouteObject[] = [
  {
    path: APP_PATHS.HOME,
    element: <MainLayout />,
    loader: sessionLoader,
    hydrateFallbackElement: <PageLoadingState />,
    errorElement: (
      <RouteSuspense>
        <ServerErrorPage />
      </RouteSuspense>
    ),
    children: [
      ...authRoutes,
      { index: true, element: <Navigate to={APP_PATHS.EXPLORE} replace /> },
      {
        path: ROUTE_SEGMENTS.EXPLORE,
        loader: exploreLoader,
        element: (
          <RouteSuspense>
            <ExplorePage />
          </RouteSuspense>
        ),
        errorElement: (
          <RouteSuspense>
            <ServerErrorPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.PLACES,
        loader: placeLoader,
        element: (
          <RouteSuspense>
            <PlaceDetailPage />
          </RouteSuspense>
        ),
        errorElement: (
          <RouteSuspense>
            <ServerErrorPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.EVENTS,
        loader: eventsLoader,
        element: (
          <RouteSuspense>
            <EventsPage />
          </RouteSuspense>
        ),
        errorElement: (
          <RouteSuspense>
            <ServerErrorPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.EVENT_DETAIL,
        loader: eventDetailLoader,
        element: (
          <RouteSuspense>
            <EventDetailPage />
          </RouteSuspense>
        ),
        errorElement: (
          <RouteSuspense>
            <ServerErrorPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.SERVICE_DETAIL,
        loader: serviceDetailLoader,
        element: (
          <RouteSuspense>
            <ServiceDetailPage />
          </RouteSuspense>
        ),
        errorElement: (
          <RouteSuspense>
            <ServerErrorPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.TRIPS,
        loader: tripsLoader,
        element: (
          <RouteSuspense>
            <TripsPage />
          </RouteSuspense>
        ),
        errorElement: (
          <RouteSuspense>
            <ServerErrorPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.BOOKINGS,
        loader: bookingsLoader,
        element: (
          <RouteSuspense>
            <BookingsPage />
          </RouteSuspense>
        ),
        errorElement: (
          <RouteSuspense>
            <ServerErrorPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.NOTIFICATIONS,
        loader: notificationsLoader,
        element: (
          <RouteSuspense>
            <NotificationsPage />
          </RouteSuspense>
        ),
        errorElement: (
          <RouteSuspense>
            <ServerErrorPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.ADMIN,
        loader: adminContentLoader,
        element: (
          <RouteSuspense>
            <AdminContentPage />
          </RouteSuspense>
        ),
        errorElement: (
          <RouteSuspense>
            <ServerErrorPage />
          </RouteSuspense>
        ),
      },
    ],
  },
];
