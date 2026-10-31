import { adminNavigation } from '@/features/admin/adminNavigation';
import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  LogOut,
  MapPinned,
  Menu,
  Mountain,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
  X,
} from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate, useNavigation } from 'react-router-dom';
import { APP_PATHS } from '@/constants/path';
import { useAuthStore } from '@/store/useAuthStore';
import { logout } from '@/services/auth';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/button-variants';
import { NetworkStatusBanner } from '@/components/common/NetworkStatusBanner';
import { useTripDraftStore } from '@/store/useTripDraftStore';

export function MainLayout() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = Boolean(user?.roles.includes('ADMIN'));
  const draftCount = useTripDraftStore(
    (state) => state.drafts.live?.places.length ?? state.drafts.demo?.places.length ?? 0,
  );

  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('gialai:sidebar-collapsed') === '1';
    } catch {
      return false;
    }
  });
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // User dropdown menu state
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userDropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setSidebarMobileOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarMobileOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('gialai:sidebar-collapsed', next ? '1' : '0');
        } catch {
          /* ignore */
        }
        return next;
      });
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setUserDropdownOpen(false);
      await navigate(APP_PATHS.EXPLORE, { replace: true });
    } catch {
      /* Handled by auth store */
    } finally {
      setLoggingOut(false);
    }
  };

  const getUserRoleLabel = () => {
    if (!user) return '';
    if (user.roles.includes('ADMIN')) return 'Quản trị viên';
    if (user.roles.includes('PARTNER')) return 'Đối tác dịch vụ';
    if (user.roles.includes('B2G')) return 'Cơ quan quản lý';
    if (user.roles.includes('CONTRIBUTOR')) return 'Cộng tác viên';
    return 'Du khách';
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>

      {/* TOP HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <div className="header-left">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
              title="Đóng / mở menu bên trái"
            >
              <Menu size={22} aria-hidden="true" />
            </button>

            <Link to={APP_PATHS.HOME} className="brand" aria-label="GiaLai Travel — trang chủ">
              <span className="brand-mark">
                <Mountain size={22} aria-hidden="true" />
              </span>
              <span className="brand-text">
                GiaLai<span className="brand-accent">Travel</span>
                <small>ĐI ĐỂ THẤY. Ở ĐỂ NHỚ.</small>
              </span>
            </Link>
          </div>

          <div className="header-right">
            {user ? (
              <div className="user-menu-container" ref={userMenuRef}>
                <button
                  type="button"
                  className={`user-profile-trigger ${userDropdownOpen ? 'active' : ''}`}
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Tài khoản cá nhân"
                >
                  <div className="user-avatar" aria-hidden="true">
                    {user.displayName ? user.displayName.trim().charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-info-text">
                    <span className="user-name">{user.displayName}</span>
                    <span className="user-role-badge">{getUserRoleLabel()}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`chevron-icon ${userDropdownOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-menu" role="menu">
                    <div className="dropdown-user-header">
                      <div className="user-avatar-lg" aria-hidden="true">
                        {user.displayName ? user.displayName.trim().charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="header-details">
                        <p className="full-name">{user.displayName}</p>
                        <p className="email-text">{user.email}</p>
                        <Badge>{getUserRoleLabel()}</Badge>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <div className="dropdown-links">
                      <Link
                        to={APP_PATHS.ACCOUNT}
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                        role="menuitem"
                      >
                        <UserRound size={18} aria-hidden="true" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>

                      <Link
                        to={APP_PATHS.TRIPS}
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                        role="menuitem"
                      >
                        <MapPinned size={18} aria-hidden="true" />
                        <span>Chuyến đi của tôi</span>
                      </Link>

                      <Link
                        to={APP_PATHS.BOOKINGS}
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                        role="menuitem"
                      >
                        <Ticket size={18} aria-hidden="true" />
                        <span>Đơn đặt chỗ</span>
                      </Link>

                      <Link
                        to={APP_PATHS.NOTIFICATIONS}
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                        role="menuitem"
                      >
                        <Bell size={18} aria-hidden="true" />
                        <span>Thông báo</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to={APP_PATHS.ADMIN}
                          className="dropdown-item admin-highlight"
                          onClick={() => setUserDropdownOpen(false)}
                          role="menuitem"
                        >
                          <ShieldCheck size={18} aria-hidden="true" />
                          <span>Quản trị CMS</span>
                        </Link>
                      )}
                    </div>

                    <div className="dropdown-divider" />

                    <div className="dropdown-footer">
                      <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        role="menuitem"
                      >
                        <LogOut size={16} aria-hidden="true" />
                        <span>{loggingOut ? 'Đang đăng xuất…' : 'Đăng xuất tài khoản'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-header-actions">
                <Link to={APP_PATHS.LOGIN} className={buttonVariants({ variant: 'secondary' })}>
                  Đăng nhập
                </Link>
                <Link to={APP_PATHS.REGISTER} className={buttonVariants()}>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* APP BODY: SIDEBAR + MAIN CONTENT */}
      <div className="app-layout-body">
        {/* Mobile backdrop */}
        {sidebarMobileOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* LEFT SIDEBAR MENU */}
        <aside
          className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${
            sidebarMobileOpen ? 'mobile-open' : ''
          }`}
          aria-label="Thanh điều hướng chính"
        >
          <div className="sidebar-header-mobile">
            <span className="brand-title-mobile">Danh mục điều hướng</span>
            <button
              type="button"
              className="close-mobile-btn"
              onClick={() => setSidebarMobileOpen(false)}
              aria-label="Đóng thanh điều hướng"
            >
              <X size={20} />
            </button>
          </div>

          <div className="sidebar-nav-container">
            <div className="nav-group">
              <span className="nav-group-title">Khám phá</span>
              <nav className="sidebar-nav" aria-label="Khám phá">
                <NavLink
                  to={APP_PATHS.EXPLORE}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarMobileOpen(false)}
                  title="Khám phá điểm đến"
                >
                  <Compass size={20} className="sidebar-icon" aria-hidden="true" />
                  <span className="sidebar-text">Khám phá</span>
                </NavLink>

                <NavLink
                  to={APP_PATHS.EVENTS}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarMobileOpen(false)}
                  title="Sự kiện & Lễ hội"
                >
                  <Sparkles size={20} className="sidebar-icon" aria-hidden="true" />
                  <span className="sidebar-text">Sự kiện &amp; Lễ hội</span>
                </NavLink>

                <NavLink
                  to={APP_PATHS.TRIPS}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarMobileOpen(false)}
                  title="Chuyến đi của tôi"
                >
                  <MapPinned size={20} className="sidebar-icon" aria-hidden="true" />
                  <span className="sidebar-text">Chuyến đi</span>
                </NavLink>
              </nav>
            </div>

            {user && (
              <div className="nav-group">
                <span className="nav-group-title">Tiện ích cá nhân</span>
                <nav className="sidebar-nav" aria-label="Tiện ích cá nhân">
                  <NavLink
                    to={APP_PATHS.BOOKINGS}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarMobileOpen(false)}
                    title="Đơn đặt chỗ dịch vụ"
                  >
                    <Ticket size={20} className="sidebar-icon" aria-hidden="true" />
                    <span className="sidebar-text">Đơn đặt chỗ</span>
                  </NavLink>

                  <NavLink
                    to={APP_PATHS.NOTIFICATIONS}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarMobileOpen(false)}
                    title="Hộp thư thông báo"
                  >
                    <Bell size={20} className="sidebar-icon" aria-hidden="true" />
                    <span className="sidebar-text">Thông báo</span>
                  </NavLink>

                  <NavLink
                    to={APP_PATHS.ACCOUNT}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarMobileOpen(false)}
                    title="Hồ sơ cá nhân"
                  >
                    <UserRound size={20} className="sidebar-icon" aria-hidden="true" />
                    <span className="sidebar-text">Hồ sơ cá nhân</span>
                  </NavLink>
                </nav>
              </div>
            )}

            {isAdmin && (
              <div className="nav-group">
                <span className="nav-group-title">Quản trị</span>
                <nav className="sidebar-nav" aria-label="Quản trị">
                  {adminNavigation.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        `sidebar-link admin-link ${isActive ? 'active' : ''}`
                      }
                      onClick={() => setSidebarMobileOpen(false)}
                      title={label}
                    >
                      <Icon size={20} className="sidebar-icon" aria-hidden="true" />
                      <span className="sidebar-text">{label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}
          </div>

          <div className="sidebar-footer">
            <button
              type="button"
              className="collapse-toggle-btn"
              onClick={toggleSidebar}
              title={sidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={18} aria-hidden="true" />
              ) : (
                <ChevronLeft size={18} aria-hidden="true" />
              )}
              <span className="sidebar-text">Thu gọn menu</span>
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN VIEWPORT */}
        <div className="app-main-viewport">
          <NetworkStatusBanner />
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
              <span>GiaLai Travel · Khám phá đại ngàn Gia Lai.</span>
              <span>Một hành trình, nhiều điều để nhớ.</span>
            </div>
          </footer>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="mobile-bottom-nav" aria-label="Điều hướng nhanh điện thoại">
        <NavLink
          to={APP_PATHS.EXPLORE}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Compass size={20} aria-hidden="true" />
          <span>Khám phá</span>
        </NavLink>
        <NavLink
          to={APP_PATHS.EVENTS}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Sparkles size={20} aria-hidden="true" />
          <span>Sự kiện</span>
        </NavLink>
        <NavLink
          to={APP_PATHS.TRIPS}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon-wrap">
            <MapPinned size={20} aria-hidden="true" />
            {draftCount > 0 && <span className="mobile-nav-badge">{draftCount}</span>}
          </div>
          <span>Chuyến đi</span>
        </NavLink>
        <NavLink
          to={APP_PATHS.BOOKINGS}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Ticket size={20} aria-hidden="true" />
          <span>Đơn đặt</span>
        </NavLink>
        <NavLink
          to={user ? APP_PATHS.ACCOUNT : APP_PATHS.LOGIN}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <UserRound size={20} aria-hidden="true" />
          <span>{user ? 'Tài khoản' : 'Đăng nhập'}</span>
        </NavLink>
      </nav>
    </div>
  );
}
