import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { TouristLayout } from '@/layouts/TouristLayout';
import { ROUTE_SEGMENTS } from '@/constants/path';
import { accountLoader } from './authLoaders';
import { RouteSuspense } from './RouteSuspense';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const AccountPage = lazy(() => import('@/features/auth/pages/AccountPage'));
const ServerErrorPage = lazy(() =>
  import('@/features/errors/pages/ErrorPages').then((module) => ({
    default: module.ServerErrorPage,
  })),
);

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTE_SEGMENTS.LOGIN,
        element: (
          <RouteSuspense>
            <LoginPage />
          </RouteSuspense>
        ),
      },
      {
        path: ROUTE_SEGMENTS.REGISTER,
        element: (
          <RouteSuspense>
            <RegisterPage />
          </RouteSuspense>
        ),
      },
    ],
  },
  {
    element: <TouristLayout />,
    children: [
      {
        path: ROUTE_SEGMENTS.ACCOUNT,
        loader: accountLoader,
        element: (
          <RouteSuspense>
            <AccountPage />
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
