import { Compass, ShieldCheck } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="auth-grid">
      <aside className="auth-intro">
        <p className="eyebrow">GIALAI TRAVEL</p>
        <Compass size={80} strokeWidth={1} aria-hidden="true" />
        <h2>
          Những hành trình đáng nhớ
          <br />
          bắt đầu từ đây.
        </h2>
        <p>Một tài khoản để tiếp tục khám phá Gia Lai theo cách của bạn.</p>
        <span>
          <ShieldCheck size={18} aria-hidden="true" />
          Thông tin tài khoản được bảo vệ
        </span>
      </aside>
      <div className="content-card auth-card">
        <Outlet />
      </div>
    </div>
  );
}
