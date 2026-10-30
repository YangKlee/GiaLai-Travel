import { redirect } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { bootstrapAuth } from '@/services/auth';
import { get } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import type { AuthUser } from '@/features/auth/types/auth';
import { APP_PATHS } from '@/constants/path';

export async function sessionLoader() {
  await bootstrapAuth();
  return null;
}

export async function resetPasswordLoader({ request }: LoaderFunctionArgs) {
  await bootstrapAuth();
  const url = new URL(request.url);
  const token = url.searchParams.get('token')?.trim() ?? '';
  if (token && typeof window !== 'undefined' && window.location.search.includes('token=')) {
    window.history.replaceState(window.history.state, '', APP_PATHS.RESET_PASSWORD);
  }
  return { token };
}

export async function accountLoader({ request }: LoaderFunctionArgs) {
  await bootstrapAuth();
  if (useAuthStore.getState().phase !== 'authenticated')
    return redirect(`${APP_PATHS.LOGIN}?returnTo=${encodeURIComponent(APP_PATHS.ACCOUNT)}`);
  const response = await get<{ data: { user: AuthUser } }>('/api/v1/auth/me', request.signal);
  const current = useAuthStore.getState();
  if (current.phase !== 'authenticated') return redirect(APP_PATHS.LOGIN);
  if (current.user?.id === response.data.user.id)
    useAuthStore.setState({ user: response.data.user });
  return null;
}
