export const USER_ROLE_LABELS = {
  TOURIST: 'Du khách',
  ADMIN: 'Quản trị viên',
  PARTNER: 'Đối tác',
  B2G: 'Cơ quan quản lý',
  CONTRIBUTOR: 'Cộng tác viên',
} as const;
export type UserRole = keyof typeof USER_ROLE_LABELS;
export interface AdminUser {
  id: string;
  email: string | null;
  displayName: string;
  phone: string | null;
  status: 'ACTIVE' | 'LOCKED';
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}
export interface AdminUserInput {
  email: string;
  displayName: string;
  phone: string | null;
  status: AdminUser['status'];
  roles: UserRole[];
  password?: string;
}
export interface AdminUserList {
  data: AdminUser[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}
