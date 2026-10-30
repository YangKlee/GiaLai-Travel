import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { APP_PATHS } from '@/constants/path';
import { catalogFixture, placesFixture } from '@/services/__fixtures__/catalog';
import { getCatalog, getPlaces } from '@/services/catalog';
import { requestPasswordReset, resetPassword } from '@/services/auth';
import {
  createMyPrivacyRequest,
  downloadMyPrivacyExport,
  getMyConsents,
  getMyPreferences,
  getMyProfile,
  listMyPrivacyRequests,
  recordMyConsent,
  updateMyPreferences,
  updateMyProfile,
} from '@/services/account';
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
vi.mock('@/services/account', () => ({
  getMyProfile: vi.fn(),
  updateMyProfile: vi.fn(),
  getMyPreferences: vi.fn(),
  updateMyPreferences: vi.fn(),
  getMyConsents: vi.fn(),
  recordMyConsent: vi.fn(),
  listMyPrivacyRequests: vi.fn(),
  createMyPrivacyRequest: vi.fn(),
  downloadMyPrivacyExport: vi.fn(),
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

  it('quản lý hồ sơ, sở thích, đồng ý dữ liệu (mặc định chưa chọn) và yêu cầu quyền riêng tư', async () => {
    const user = userEvent.setup();
    useAuthStore.setState({
      enabled: true,
      phase: 'authenticated',
      user: {
        id: 'u-1',
        email: 'tourist@example.test',
        displayName: 'Du khách Gia Lai',
        roles: ['TOURIST'],
      },
      note: null,
    });

    vi.mocked(getMyProfile).mockResolvedValue({
      id: 'u-1',
      email: 'tourist@example.test',
      displayName: 'Du khách Gia Lai',
      phone: null,
      roles: ['TOURIST'],
      createdAt: '2026-10-30T00:00:00.000Z',
      updatedAt: '2026-10-30T00:00:00.000Z',
    });
    vi.mocked(getMyPreferences).mockResolvedValue({
      preferences: {
        categories: ['NATURE'],
        pace: 'BALANCED',
        travelGroup: 'SOLO',
        dietaryNotes: null,
      },
      catalog: {
        categories: [
          { code: 'NATURE', name: 'Thiên nhiên & Sinh thái' },
          { code: 'FOOD', name: 'Ẩm thực & Cà phê' },
        ],
        paces: [
          { code: 'RELAXED', name: 'Thong thả' },
          { code: 'BALANCED', name: 'Cân bằng' },
        ],
        travelGroups: [
          { code: 'SOLO', name: 'Đi một mình' },
          { code: 'FAMILY', name: 'Gia đình' },
        ],
      },
    });
    vi.mocked(getMyConsents).mockResolvedValue({
      current: [
        {
          purpose: 'PERSONALIZATION',
          title: 'Cá nhân hóa gợi ý du lịch',
          description: 'Cho phép sử dụng sở thích đã lưu.',
          policyVersion: '2026-04-v1',
          decisionNo: 0,
          granted: false,
          decidedAt: null,
        },
      ],
      history: [],
    });
    vi.mocked(listMyPrivacyRequests).mockResolvedValue({
      requests: [],
      retentionSummary: {
        activeBookingsCount: 1,
        historicalBookingsCount: 2,
        slaDays: 7,
        policyNote: 'Các đơn đặt chỗ đang hoạt động không bị hủy tự động.',
      },
    });

    vi.mocked(updateMyProfile).mockResolvedValue({
      id: 'u-1',
      email: 'tourist@example.test',
      displayName: 'Ksor H’Hen',
      phone: '+84901234567',
      roles: ['TOURIST'],
      createdAt: '2026-10-30T00:00:00.000Z',
      updatedAt: '2026-10-30T01:00:00.000Z',
    });
    vi.mocked(updateMyPreferences).mockResolvedValue({
      preferences: {
        categories: ['NATURE', 'FOOD'],
        pace: 'RELAXED',
        travelGroup: 'FAMILY',
        dietaryNotes: 'Ưu tiên cà phê Pleiku',
      },
      catalog: {
        categories: [
          { code: 'NATURE', name: 'Thiên nhiên & Sinh thái' },
          { code: 'FOOD', name: 'Ẩm thực & Cà phê' },
        ],
        paces: [
          { code: 'RELAXED', name: 'Thong thả' },
          { code: 'BALANCED', name: 'Cân bằng' },
        ],
        travelGroups: [
          { code: 'SOLO', name: 'Đi một mình' },
          { code: 'FAMILY', name: 'Gia đình' },
        ],
      },
    });
    vi.mocked(recordMyConsent).mockResolvedValue({
      decision: {
        id: 'c-1',
        purpose: 'PERSONALIZATION',
        decisionNo: 1,
        granted: true,
        policyVersion: '2026-04-v1',
        decidedAt: '2026-10-30T01:05:00.000Z',
      },
      current: [
        {
          purpose: 'PERSONALIZATION',
          title: 'Cá nhân hóa gợi ý du lịch',
          description: 'Cho phép sử dụng sở thích đã lưu.',
          policyVersion: '2026-04-v1',
          decisionNo: 1,
          granted: true,
          decidedAt: '2026-10-30T01:05:00.000Z',
        },
      ],
      history: [
        {
          id: 'c-1',
          purpose: 'PERSONALIZATION',
          decisionNo: 1,
          granted: true,
          policyVersion: '2026-04-v1',
          decidedAt: '2026-10-30T01:05:00.000Z',
        },
      ],
    });
    vi.mocked(createMyPrivacyRequest).mockResolvedValue({
      request: {
        id: 'pr-1',
        requestType: 'EXPORT',
        status: 'COMPLETED',
        verifiedAt: '2026-10-30T01:10:00.000Z',
        completedAt: '2026-10-30T01:10:00.000Z',
        slaDueAt: '2026-11-06T01:10:00.000Z',
        resultNote: 'Gói dữ liệu cá nhân đã sẵn sàng.',
        downloadPath: '/api/v1/me/privacy-requests/pr-1/export',
        createdAt: '2026-10-30T01:10:00.000Z',
      },
      retentionSummary: {
        activeBookingsCount: 1,
        historicalBookingsCount: 2,
        slaDays: 7,
        policyNote: 'Các đơn đặt chỗ đang hoạt động không bị hủy tự động.',
      },
    });
    vi.mocked(downloadMyPrivacyExport).mockResolvedValue({
      requestId: 'pr-1',
      exportedAt: '2026-10-30T01:10:00.000Z',
      expiresAt: '2026-11-06T01:10:00.000Z',
      subject: {
        id: 'u-1',
        email: 'tourist@example.test',
        displayName: 'Ksor H’Hen',
        phone: '+84901234567',
        roles: ['TOURIST'],
        preferences: {
          categories: ['NATURE', 'FOOD'],
          pace: 'RELAXED',
          travelGroup: 'FAMILY',
          dietaryNotes: 'Ưu tiên cà phê Pleiku',
        },
        createdAt: '2026-10-30T00:00:00.000Z',
      },
      consents: [],
      itineraries: [],
      bookings: [],
      issueReports: [],
      privacyRequests: [],
    });

    const router = createMemoryRouter(appRoutes, { initialEntries: [APP_PATHS.ACCOUNT] });
    render(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Tài khoản của tôi' })).toBeInTheDocument();
    expect(screen.getByText('Mặc định: Chưa đồng ý')).toBeInTheDocument();

    const nameInput = screen.getByLabelText('Tên hiển thị');
    await user.clear(nameInput);
    await user.type(nameInput, 'Ksor H’Hen');
    await user.type(screen.getByLabelText('Số điện thoại liên hệ'), '+84901234567');
    await user.click(screen.getByRole('button', { name: 'Lưu hồ sơ' }));
    expect(await screen.findByText('Đã lưu thông tin hồ sơ.')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Ẩm thực & Cà phê'));
    await user.click(screen.getByRole('button', { name: 'Lưu sở thích' }));
    expect(await screen.findByText('Đã lưu sở thích du lịch.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Đồng ý PERSONALIZATION' }));
    expect(await screen.findByText('Đang đồng ý (Quyết định #1)')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Xác nhận mật khẩu hiện tại'), 'Valid password 🌿');
    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu quyền riêng tư' }));
    expect(await screen.findByRole('button', { name: 'Tải gói dữ liệu JSON' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tải gói dữ liệu JSON' }));
    expect(await screen.findByLabelText('Gói dữ liệu cá nhân đã xuất')).toBeInTheDocument();
    router.dispose();
  });
});
