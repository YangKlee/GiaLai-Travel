import { createHttpClient } from './http';
import { ApiError, toApiError } from './api-error';
import { useAuthStore } from '@/store/useAuthStore';
import { useTripDraftStore } from '@/store/useTripDraftStore';
import type { LoginInput, RegistrationInput, SessionResponse } from '@/features/auth/types/auth';

const client = createHttpClient();
const csrf = { 'X-CSRF-Protection': '1' };
const logoutMarker = 'gialai:explicitly-signed-out';
let accessToken: string | null = null;
let generation = 0;
let refreshPromise: Promise<void> | null = null;
let bootstrapPromise: Promise<void> | null = null;
let channel: BroadcastChannel | null = null;

function signedOut(): boolean {
  try {
    return localStorage.getItem(logoutMarker) === '1';
  } catch {
    return false;
  }
}
function markSignedOut(value: boolean): void {
  // A non-secret logout tombstone prevents a failed logout from restoring an old cookie.
  try {
    if (value) localStorage.setItem(logoutMarker, '1');
    else localStorage.removeItem(logoutMarker);
  } catch {
    /* storage can be disabled */
  }
}

export function clearAuthSession(note: string | null = null): void {
  generation++;
  accessToken = null;
  useAuthStore.setState({ phase: 'anonymous', user: null, note });
  useTripDraftStore.getState().reset();
}

function setupChannel(): void {
  if (channel || typeof window === 'undefined' || !window.BroadcastChannel) return;
  channel = new window.BroadcastChannel('gialai-auth');
  channel.onmessage = (event: MessageEvent<unknown>) => {
    if (!event.data || typeof event.data !== 'object' || !('type' in event.data)) return;
    if (event.data.type === 'logout') {
      markSignedOut(true);
      clearAuthSession('Phiên đã kết thúc ở một tab khác.');
    }
    if (event.data.type === 'session-changed') {
      clearAuthSession();
      markSignedOut(false);
      void refreshSession().catch(() => {});
    }
  };
}

async function withSessionLock<T>(work: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.locks)
    return navigator.locks.request('gialai-auth-cookie', work);
  return work();
}

function acceptSession(response: SessionResponse, version: number): void {
  if (version !== generation)
    throw new ApiError(401, 'SESSION_CHANGED', 'Phiên đã thay đổi. Vui lòng đăng nhập lại.');
  accessToken = response.data.accessToken;
  useAuthStore.setState({ phase: 'authenticated', user: response.data.user, note: null });
}

export const getAccessToken = (): string | null => accessToken;

export async function refreshSession(): Promise<void> {
  if (refreshPromise) return refreshPromise;
  const version = generation;
  refreshPromise = withSessionLock(async () => {
    if (signedOut() || version !== generation)
      throw new ApiError(401, 'AUTH_REQUIRED', 'Vui lòng đăng nhập để tiếp tục.');
    const response = await client.post<SessionResponse>('/api/v1/auth/refresh', undefined, {
      headers: csrf,
    });
    acceptSession(response.data, version);
  })
    .catch((error: unknown) => {
      if (version === generation) {
        markSignedOut(true);
        clearAuthSession('Phiên đã kết thúc. Vui lòng đăng nhập lại.');
        channel?.postMessage({ type: 'logout' });
      }
      throw toApiError(error);
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export async function bootstrapAuth(): Promise<void> {
  setupChannel();
  if (bootstrapPromise) return bootstrapPromise;
  bootstrapPromise = (async () => {
    try {
      const response = await client.get<{ data: { enabled: boolean } }>('/api/v1/auth/status');
      useAuthStore.setState({ enabled: response.data.data.enabled });
      if (!response.data.data.enabled || signedOut()) {
        clearAuthSession();
        return;
      }
      try {
        await refreshSession();
      } catch {
        /* An anonymous browser normally has no refresh cookie. */
      }
    } catch {
      useAuthStore.setState({ enabled: null, phase: 'unavailable', user: null });
    }
  })();
  return bootstrapPromise;
}

export async function register(input: RegistrationInput): Promise<void> {
  try {
    await client.post('/api/v1/auth/register', input, { headers: csrf });
  } catch (error) {
    throw toApiError(error);
  }
}

export async function login(input: LoginInput): Promise<void> {
  setupChannel();
  clearAuthSession();
  const version = generation;
  try {
    await withSessionLock(async () => {
      const response = await client.post<SessionResponse>('/api/v1/auth/login', input, {
        headers: csrf,
      });
      acceptSession(response.data, version);
      markSignedOut(false);
    });
    channel?.postMessage({ type: 'session-changed' });
  } catch (error) {
    throw toApiError(error);
  }
}

export async function logout(): Promise<void> {
  setupChannel();
  markSignedOut(true);
  clearAuthSession();
  channel?.postMessage({ type: 'logout' });
  try {
    await withSessionLock(() => client.post('/api/v1/auth/logout', undefined, { headers: csrf }));
  } catch (error) {
    useAuthStore.setState({
      note: 'Đã xóa phiên trên trình duyệt. Máy chủ chưa xác nhận đăng xuất; hãy kết nối lại và đăng nhập khi cần.',
    });
    throw toApiError(error);
  }
}
