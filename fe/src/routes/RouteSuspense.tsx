import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { PageLoadingState } from '@/components/common/PageLoadingState';

export function RouteSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoadingState />}>{children}</Suspense>;
}
