import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { APP_PATHS, ROUTE_SEGMENTS } from '@/constants/path';
import { RouteSuspense } from './RouteSuspense';

const ExplorePage = lazy(() => import('@/features/explore/pages/ExplorePage'));
const TripsPage = lazy(() => import('@/features/trips/pages/TripsPage'));
const ServerErrorPage = lazy(() => import('@/features/errors/pages/ErrorPages').then((m) => ({ default: m.ServerErrorPage })));

export const mainRoutes: RouteObject[] = [{
  path: APP_PATHS.HOME, element: <MainLayout />,
  errorElement: <RouteSuspense><ServerErrorPage /></RouteSuspense>,
  children: [
    { index: true, element: <Navigate to={APP_PATHS.EXPLORE} replace /> },
    { path: ROUTE_SEGMENTS.EXPLORE, element: <RouteSuspense><ExplorePage /></RouteSuspense> },
    { path: ROUTE_SEGMENTS.TRIPS, element: <RouteSuspense><TripsPage /></RouteSuspense> },
  ],
}];
