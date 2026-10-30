import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { APP_PATHS } from '@/constants/path';
import { catalogFixture, placesFixture } from '@/services/__fixtures__/catalog';
import { getCatalog, getPlaces } from '@/services/catalog';
import { ApiError } from '@/services/api';

vi.mock('@/services/catalog', () => ({
  getCatalog: vi.fn(),
  getPlaces: vi.fn(),
  getPlace: vi.fn(),
}));
beforeEach(() => {
  vi.mocked(getCatalog).mockResolvedValue(catalogFixture);
  vi.mocked(getPlaces).mockResolvedValue(placesFixture);
});

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
    expect(
      await screen.findByRole('heading', { name: 'Khu vực chưa khả dụng' }),
    ).toBeInTheDocument();
    router.dispose();
  });

  it('lỗi API hiển thị hướng phục hồi thay vì stack trace', async () => {
    vi.mocked(getPlaces).mockRejectedValue(
      new ApiError(503, 'CATALOG_UNAVAILABLE', 'Danh mục đang tạm ngưng.'),
    );
    const router = createMemoryRouter(appRoutes, { initialEntries: [APP_PATHS.EXPLORE] });
    render(<RouterProvider router={router} />);
    expect(
      await screen.findByRole('heading', { name: 'Chưa tải được nội dung' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Danh mục đang tạm ngưng.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Thử lại' })).toBeInTheDocument();
    router.dispose();
  });
});
