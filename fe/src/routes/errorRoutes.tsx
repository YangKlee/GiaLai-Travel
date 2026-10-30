import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ErrorLayout } from '@/layouts/ErrorLayout';
import { APP_PATHS } from '@/constants/path';
import { RouteSuspense } from './RouteSuspense';

const Unauthorized = lazy(() =>
  import('@/features/errors/pages/ErrorPages').then((m) => ({ default: m.UnauthorizedPage })),
);
const Forbidden = lazy(() =>
  import('@/features/errors/pages/ErrorPages').then((m) => ({ default: m.ForbiddenPage })),
);
const NotFound = lazy(() =>
  import('@/features/errors/pages/ErrorPages').then((m) => ({ default: m.NotFoundPage })),
);
const ServerError = lazy(() =>
  import('@/features/errors/pages/ErrorPages').then((m) => ({ default: m.ServerErrorPage })),
);

export const errorRoutes: RouteObject[] = [
  {
    element: <ErrorLayout />,
    children: [
      {
        path: APP_PATHS.UNAUTHORIZED,
        element: (
          <RouteSuspense>
            <Unauthorized />
          </RouteSuspense>
        ),
      },
      {
        path: APP_PATHS.FORBIDDEN,
        element: (
          <RouteSuspense>
            <Forbidden />
          </RouteSuspense>
        ),
      },
      {
        path: `${APP_PATHS.ADMIN}/*`,
        element: (
          <RouteSuspense>
            <Forbidden />
          </RouteSuspense>
        ),
      },
      {
        path: APP_PATHS.NOT_FOUND,
        element: (
          <RouteSuspense>
            <NotFound />
          </RouteSuspense>
        ),
      },
      {
        path: APP_PATHS.SERVER_ERROR,
        element: (
          <RouteSuspense>
            <ServerError />
          </RouteSuspense>
        ),
      },
      {
        path: '*',
        element: (
          <RouteSuspense>
            <NotFound />
          </RouteSuspense>
        ),
      },
    ],
  },
];
