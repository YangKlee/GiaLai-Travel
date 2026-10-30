import axios from 'axios';

export function createHttpClient() {
  return axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, ''),
    timeout: 12_000,
    withCredentials: true,
    headers: { Accept: 'application/json' },
  });
}
