import { get, patch, post } from './api';

export interface NotificationItem {
  id: string;
  userId: string;
  eventKey: string;
  kind: string;
  title: string;
  body: string;
  targetType: string | null;
  targetId: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  data: NotificationItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    unreadCount: number;
  };
}

export interface UnreadCountResponse {
  data: {
    unreadCount: number;
  };
}

export async function listMyNotifications(params?: {
  page?: number;
  pageSize?: number;
  unreadOnly?: boolean;
}): Promise<NotificationListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  if (params?.unreadOnly) query.set('unreadOnly', 'true');
  const qs = query.toString();
  return get<NotificationListResponse>(`/v1/me/notifications${qs ? `?${qs}` : ''}`);
}

export async function getUnreadNotificationCount(): Promise<UnreadCountResponse> {
  return get<UnreadCountResponse>('/v1/me/notifications/unread-count');
}

export async function markNotificationRead(id: string): Promise<{ data: NotificationItem }> {
  return patch<{ data: NotificationItem }, Record<string, never>>(
    `/v1/me/notifications/${id}/read`,
    {},
  );
}

export async function markAllNotificationsRead(): Promise<{ data: { success: boolean } }> {
  return post<{ data: { success: boolean } }, Record<string, never>>(
    '/v1/me/notifications/read-all',
    {},
  );
}
