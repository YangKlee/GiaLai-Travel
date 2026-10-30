import { Link, Outlet } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { APP_PATHS } from '@/constants/path';
import { buttonVariants } from '@/components/ui/button-variants';

export function TouristLayout() {
  const phase = useAuthStore((state) => state.phase);
  const note = useAuthStore((state) => state.note);
  if (phase !== 'authenticated')
    return (
      <section className="empty-state">
        <ShieldAlert size={40} aria-hidden="true" />
        <h1>Vui lòng đăng nhập lại</h1>
        <p>{note ?? 'Phiên tài khoản đã kết thúc.'}</p>
        <Link to={APP_PATHS.LOGIN} className={buttonVariants()}>
          Đăng nhập
        </Link>
      </section>
    );
  return <Outlet />;
}
