import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { createHttpClient } from './http';
import { ApiError, toApiError } from './api-error';
import { useAuthStore } from '@/store/useAuthStore';
import { clearAuthSession, getAccessToken, refreshSession } from './auth';
export { ApiError } from './api-error';
export type { FieldError } from './api-error';

const client = createHttpClient();
type RetryConfig = InternalAxiosRequestConfig & {
  authRetried?: boolean;
  authIdentity?: string | null;
};
client.interceptors.request.use((config) => {
  const scoped = config as RetryConfig;
  if (scoped.authIdentity === undefined)
    scoped.authIdentity = useAuthStore.getState().user?.id ?? null;
  const token = getAccessToken();
  if (token) config.headers.set('Authorization', 'Bearer ' + token);
  return config;
});
client.interceptors.response.use(
  (response) => {
    const identity = (response.config as RetryConfig).authIdentity;
    if (identity && identity !== useAuthStore.getState().user?.id)
      throw new ApiError(
        401,
        'SESSION_CHANGED',
        'Phiên đã thay đổi. Vui lòng thực hiện lại thao tác.',
      );
    return response;
  },
  async (error: unknown) => {
    if (axios.isCancel(error)) throw error;
    if (
      axios.isAxiosError<{ error?: { code?: string } }>(error) &&
      error.response?.status === 401
    ) {
      const config = error.config as RetryConfig | undefined;
      if (config?.authIdentity && config.authIdentity !== useAuthStore.getState().user?.id)
        throw new ApiError(
          401,
          'SESSION_CHANGED',
          'Phiên đã thay đổi. Vui lòng thực hiện lại thao tác.',
        );
      if (
        error.response.data?.error?.code === 'ACCESS_TOKEN_EXPIRED' &&
        config &&
        !config.authRetried
      ) {
        config.authRetried = true;
        await refreshSession();
        // Reuse the same config/body/idempotency header, exactly once.
        config.headers.set('Authorization', 'Bearer ' + getAccessToken());
        return client.request(config);
      }
      clearAuthSession('Phiên đã kết thúc. Vui lòng đăng nhập lại.');
    }
    throw toApiError(error);
  },
);

export async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  return (await client.get<T>(path, { signal })).data;
}
