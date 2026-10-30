import { Compass, MapPinned, Mountain, ArrowUpRight, UserRound } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigation } from 'react-router-dom';
import { APP_PATHS } from '@/constants/path';
import { useAuthStore } from '@/store/useAuthStore';

export function MainLayout() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link to={APP_PATHS.HOME} className="brand" aria-label="GiaLai Travel — trang chủ">
            <span className="brand-mark">
              <Mountain size={25} aria-hidden="true" />
            </span>
            <span>
              GiaLai<span className="text-primary">Travel</span>
              <small>ĐI ĐỂ THẤY. Ở ĐỂ NHỚ.</small>
            </span>
          </Link>
          <nav aria-label="Điều hướng chính">
            <NavLink to={APP_PATHS.EXPLORE}>
              <Compass size={18} aria-hidden="true" />
              Khám phá
            </NavLink>
            <NavLink to={user ? APP_PATHS.ACCOUNT : APP_PATHS.LOGIN}>
              <UserRound size={18} aria-hidden="true" />
              {user ? 'Tài khoản' : 'Đăng nhập'}
            </NavLink>
            <NavLink to={APP_PATHS.TRIPS}>
              <MapPinned size={18} aria-hidden="true" />
              Chuyến đi của tôi
            </NavLink>
          </nav>
          <span className="header-note">
            Cao nguyên đang chờ <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </header>
      {navigation.state !== 'idle' ? (
        <div className="navigation-progress" role="status">
          Đang tải…
        </div>
      ) : null}
      <main id="main-content" tabIndex={-1} className="container page-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>GiaLai Travel · Một hành trình, nhiều điều để nhớ.</span>
          <span>Khám phá theo cách của bạn.</span>
        </div>
      </footer>
    </>
  );
}
