import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { APP_PATHS, ROUTE_SEGMENTS } from '@/constants/path';
import { RouteSuspense } from './RouteSuspense';
import { exploreLoader, placeLoader, tripsLoader } from './catalogLoaders';
import { PageLoadingState } from '@/components/common/PageLoadingState';

const ExplorePage = lazy(() => import('@/features/explore/pages/ExplorePage'));
const TripsPage = lazy(() => import('@/features/trips/pages/TripsPage'));
const PlaceDetailPage = lazy(() => import('@/features/explore/pages/PlaceDetailPage'));
const ServerErrorPage = lazy(() =>
  import('@/features/errors/pages/ErrorPages').then((m) => ({ default: m.ServerErrorPage })),
);

export const mainRoutes: RouteObject[] = [
  {
    path: APP_PATHS.HOME,
    element: <MainLayout />,
    hydrateFallbackElement: <PageLoadingState />,
    errorElement: (
      <RouteSuspense>
        <ServerErrorPage />
      </RouteSuspense>
    ),
    children: [
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
    ],
  },
];
