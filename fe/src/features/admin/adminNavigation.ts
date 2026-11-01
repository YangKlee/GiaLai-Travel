import { Building2, CalendarDays, FileEdit, Flag, History, MapPin, Ticket, Users } from 'lucide-react';
import { APP_PATHS } from '@/constants/path';

export const adminNavigation = [
  { to: APP_PATHS.ADMIN_CONTENT, label: 'Quản trị nội dung', icon: FileEdit },
  { to: APP_PATHS.ADMIN_PLACES, label: 'Địa điểm', icon: MapPin },
  { to: APP_PATHS.ADMIN_WARDS, label: 'Phường / Xã', icon: Building2 },
  { to: APP_PATHS.ADMIN_EVENTS, label: 'Sự kiện & banner', icon: CalendarDays },
  { to: APP_PATHS.ADMIN_BOOKINGS, label: 'Đặt chỗ & hoa hồng', icon: Ticket },
  { to: APP_PATHS.ADMIN_ISSUES, label: 'Báo lỗi & góp ý', icon: Flag },
  { to: APP_PATHS.ADMIN_AUDIT, label: 'Nhật ký kiểm toán', icon: History },
  { to: APP_PATHS.ADMIN_USERS, label: 'Người dùng', icon: Users },
];
