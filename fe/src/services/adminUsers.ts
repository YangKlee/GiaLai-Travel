import { del, get, post, put } from './api';

import type { AdminUser, AdminUserInput, AdminUserList } from '@/features/admin/types/users';

export function listAdminUsers(query: URLSearchParams, signal?: AbortSignal) {
  return get<AdminUserList>(`/api/v1/admin/users?${query}`, signal);
}
export async function createAdminUser(input: AdminUserInput & { password: string }) {
  return (await post<{ data: AdminUser }>('/api/v1/admin/users', input)).data;
}
export async function updateAdminUser(id: string, input: AdminUserInput) {
  return (await put<{ data: AdminUser }>(`/api/v1/admin/users/${encodeURIComponent(id)}`, input))
    .data;
}
export function deleteAdminUser(id: string) {
  return del<{ data: { id: string; deleted: true } }>(
    `/api/v1/admin/users/${encodeURIComponent(id)}`,
  );
}
