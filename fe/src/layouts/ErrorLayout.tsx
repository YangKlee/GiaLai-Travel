import { Outlet } from 'react-router-dom';

export function ErrorLayout() {
  return (
    <main className="container page-content">
      <Outlet />
    </main>
  );
}
