import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { createHttpClient } from './http';
import { toApiError } from './api-error';
import { clearAuthSession, getAccessToken, refreshSession } from './auth';
export { ApiError } from './api-error';
export type { FieldError } from './api-error';

const client = createHttpClient();
type RetryConfig = InternalAxiosRequestConfig & { authRetried?: boolean };
client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.set('Authorization', 'Bearer ' + token);
  return config;
});
client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isCancel(error)) throw error;
    if (
      axios.isAxiosError<{ error?: { code?: string } }>(error) &&
      error.response?.status === 401
    ) {
      const config = error.config as RetryConfig | undefined;
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
      clearAuthSession('Phi?n ?? k?t th?c. Vui l?ng ??ng nh?p l?i.');
    }
    throw toApiError(error);
  },
);

export async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  return (await client.get<T>(path, { signal })).data;
}
