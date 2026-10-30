import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { APP_PATHS } from '@/constants/path';
import { catalogFixture, placesFixture } from '@/services/__fixtures__/catalog';
import { getCatalog, getPlaces } from '@/services/catalog';
import { requestPasswordReset, resetPassword } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from '@/services/api';

vi.mock('@/services/catalog', () => ({
  getCatalog: vi.fn(),
  getPlaces: vi.fn(),
  getPlace: vi.fn(),
}));
vi.mock('@/services/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/auth')>()),
  bootstrapAuth: vi.fn(async () => {}),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));
beforeEach(() => {
  vi.mocked(getCatalog).mockResolvedValue(catalogFixture);
  vi.mocked(getPlaces).mockResolvedValue(placesFixture);
  useAuthStore.setState({ enabled: true, phase: 'anonymous', user: null, note: null });
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

  it('khôi phục mật khẩu gửi thông báo đồng nhất và đặt lại mật khẩu không lộ token', async () => {
    const user = userEvent.setup();
    vi.mocked(requestPasswordReset).mockResolvedValue({
      accepted: true,
      message:
        'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi trong ít phút.',
    });
    vi.mocked(resetPassword).mockRejectedValueOnce(
      new ApiError(
        400,
        'INVALID_RESET_TOKEN',
        'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
      ),
    );
    vi.mocked(resetPassword).mockResolvedValueOnce({
      message: 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.',
    });

    const forgotRouter = createMemoryRouter(appRoutes, {
      initialEntries: [APP_PATHS.FORGOT_PASSWORD],
    });
    const forgotView = render(<RouterProvider router={forgotRouter} />);
    await user.type(await screen.findByLabelText('Email'), 'visitor@example.test');
    await user.click(screen.getByRole('button', { name: 'Gửi liên kết đặt lại' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi trong ít phút.',
    );
    forgotRouter.dispose();
    forgotView.unmount();

    const secretToken = 'secret-reset-token-value-1234567890123456789';
    const resetRouter = createMemoryRouter(appRoutes, {
      initialEntries: [`${APP_PATHS.RESET_PASSWORD}?token=${secretToken}`],
    });
    render(<RouterProvider router={resetRouter} />);
    await user.type(await screen.findByLabelText('Mật khẩu mới'), 'New valid password 🌿');
    await user.click(screen.getByRole('button', { name: 'Cập nhật mật khẩu' }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
    expect(alert.textContent).not.toContain(secretToken);

    await user.click(screen.getByRole('button', { name: 'Cập nhật mật khẩu' }));
    expect(await screen.findByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Mật khẩu đã được đặt lại. Vui lòng đăng nhập bằng mật khẩu mới.',
    );
    resetRouter.dispose();
  });
});
