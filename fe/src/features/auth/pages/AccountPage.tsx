import { useState } from 'react';
import { LogOut, MapPinned, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { logout } from '@/services/auth';
import { APP_PATHS } from '@/constants/path';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/button-variants';

const roles: Record<string, string> = {
  TOURIST: 'Du khách',
  ADMIN: 'Quản trị viên',
  PARTNER: 'Đối tác',
  CONTRIBUTOR: 'Cộng tác viên',
  B2G: 'Báo cáo',
};
export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  if (!user) return null;
  async function signOut() {
    setPending(true);
    try {
      await logout();
      await navigate(APP_PATHS.EXPLORE, { replace: true });
    } catch {
      /* TouristLayout shows the coordinator's logout status after clearing private state. */
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="account-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow text-primary-hover">KHÔNG GIAN CỦA BẠN</p>
          <h1>Tài khoản của tôi</h1>
          <p>Chào {user.displayName}, hôm nay mình đi đâu?</p>
        </div>
        <Button variant="secondary" loading={pending} onClick={() => void signOut()}>
          <LogOut size={18} aria-hidden="true" />
          Đăng xuất
        </Button>
      </div>
      <div className="content-card account-card">
        <UserRound size={40} aria-hidden="true" />
        <h2>{user.displayName}</h2>
        <dl className="facts">
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Vai trò hiện tại</dt>
            <dd>
              {user.roles.map((role) => roles[role] ?? role).join(', ') || 'Chưa được cấp vai trò'}
            </dd>
          </div>
        </dl>
        <Link to={APP_PATHS.TRIPS} className={buttonVariants()}>
          <MapPinned size={18} aria-hidden="true" />
          Xem bản nháp chuyến đi
        </Link>
      </div>
    </section>
  );
}
