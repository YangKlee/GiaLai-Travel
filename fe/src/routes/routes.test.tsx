import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { APP_PATHS } from '@/constants/path';

describe('Điều hướng ứng dụng', () => {
  it('chuyển trang chủ sang khám phá', async () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: [APP_PATHS.HOME] });
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole('heading', { name: /Một Gia Lai/ })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(APP_PATHS.EXPLORE);
    router.dispose();
  });

  it('không mở chức năng quản trị khi chưa có xác thực', async () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: [APP_PATHS.ADMIN] });
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole('heading', { name: 'Khu vực chưa khả dụng' })).toBeInTheDocument();
    router.dispose();
  });
});
