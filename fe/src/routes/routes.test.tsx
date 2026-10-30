import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { APP_PATHS } from '@/constants/path';
import { catalogFixture, placesFixture } from '@/services/__fixtures__/catalog';
import {
  getCatalog,
  getEvent,
  getEvents,
  getPlace,
  getPlaceAudioGuides,
  getPlaces,
  getService,
  getServices,
} from '@/services/catalog';
import {
  createAdminContent,
  createAdminMediaAsset,
  createAdminRevision,
  getAdminContentMeta,
  listAdminContents,
  reviewAdminRevision,
  submitAdminRevision,
  updateAdminContentVisibility,
} from '@/services/admin';
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
import {
  createMyItinerary,
  generateItineraryProposal,
  listMyItineraries,
  revalidateItineraryProposal,
} from '@/services/itineraries';
import {
  cancelBooking,
  listAdminBookings,
  listMyBookings,
  recordPaymentAttempt,
} from '@/services/bookings';
import {
  getUnreadNotificationCount,
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/services/notifications';
import {
  createIssueReport,
  listAdminAuditLogs,
  listAdminIssues,
  reviewAdminIssue,
} from '@/services/operations';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from '@/services/api';

vi.mock('@/services/catalog', () => ({
  getCatalog: vi.fn(),
  getPlaces: vi.fn(),
  getPlace: vi.fn(),
  getPlaceAudioGuides: vi.fn(),
  getEvents: vi.fn(),
  getEvent: vi.fn(),
  getServices: vi.fn(),
  getService: vi.fn(),
}));
vi.mock('@/services/admin', () => ({
  getAdminContentMeta: vi.fn(),
  listAdminContents: vi.fn(),
  createAdminContent: vi.fn(),
  createAdminRevision: vi.fn(),
  submitAdminRevision: vi.fn(),
  reviewAdminRevision: vi.fn(),
  updateAdminContentVisibility: vi.fn(),
  createAdminMediaAsset: vi.fn(),
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
vi.mock('@/services/itineraries', () => ({
  generateItineraryProposal: vi.fn(),
  revalidateItineraryProposal: vi.fn(),
  listMyItineraries: vi.fn(),
  getMyItinerary: vi.fn(),
  createMyItinerary: vi.fn(),
  updateMyItineraryRevision: vi.fn(),
  renameMyItinerary: vi.fn(),
  copyMyItinerary: vi.fn(),
  deleteMyItinerary: vi.fn(),
}));
vi.mock('@/services/bookings', () => ({
  createBooking: vi.fn(),
  quoteBooking: vi.fn(),
  listMyBookings: vi.fn(),
  getMyBooking: vi.fn(),
  recordPaymentAttempt: vi.fn(),
  cancelBooking: vi.fn(),
  listAdminBookings: vi.fn(),
  reviewAdminBooking: vi.fn(),
  completeAdminBooking: vi.fn(),
}));
vi.mock('@/services/notifications', () => ({
  listMyNotifications: vi.fn(),
  getUnreadNotificationCount: vi.fn(),
  markNotificationRead: vi.fn(),
  markAllNotificationsRead: vi.fn(),
}));
vi.mock('@/services/operations', () => ({
  createIssueReport: vi.fn(),
  listMyIssues: vi.fn(),
  listAdminIssues: vi.fn(),
  reviewAdminIssue: vi.fn(),
  listAdminAuditLogs: vi.fn(),
}));
beforeEach(() => {
  vi.mocked(getCatalog).mockResolvedValue(catalogFixture);
  vi.mocked(getPlaces).mockResolvedValue(placesFixture);
  vi.mocked(listAdminBookings).mockResolvedValue({
    data: [],
    meta: { page: 1, pageSize: 50, total: 0, totalPages: 1 },
  });
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

  it('hiển thị thuyết minh âm thanh, sự kiện, dịch vụ và khu vực quản trị CMS cho ADMIN', async () => {
    const user = userEvent.setup();
    const firstPlace = placesFixture.data[0];
    vi.mocked(getPlace).mockResolvedValue({
      dataset: 'live',
      data: {
        ...firstPlace,
        openingHours: [
          { weekday: 1, opensAt: '07:00:00', closesAt: '17:30:00', crossesMidnight: false },
        ],
        closures: [],
        audioGuides: [
          {
            id: 'ag-1',
            placeId: firstPlace.id,
            title: 'Huyền thoại Biển Hồ T’Nưng',
            description: 'Thuyết minh tiếng Việt.',
            transcript: 'Biển Hồ Pleiku được hình thành từ miệng núi lửa cổ.',
            languageCode: 'vi',
            audioUrl:
              'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=',
            premiumOnly: false,
            sourceReference: 'Sở Du lịch Gia Lai',
          },
        ],
        events: [
          {
            id: 'ev-1',
            placeId: firstPlace.id,
            placeTitle: firstPlace.title,
            region: firstPlace.region,
            title: 'Không gian Cồng chiêng Tây Nguyên cuối tuần',
            description: 'Biểu diễn cồng chiêng tại Biển Hồ.',
            startsAt: '2026-11-01T19:00:00.000Z',
            endsAt: '2026-11-01T21:00:00.000Z',
            eventStatus: 'SCHEDULED',
            sourceReference: 'Lịch sự kiện Pleiku',
            updatedAt: '2026-10-30T00:00:00.000Z',
          },
        ],
        services: [
          {
            id: 'sv-1',
            placeId: firstPlace.id,
            placeTitle: firstPlace.title,
            partnerId: 'pt-1',
            partnerName: 'HTX Du lịch Pleiku',
            title: 'Tour bình minh Biển Hồ',
            description: 'Trải nghiệm ngắm bình minh và thưởng thức cà phê.',
            serviceType: 'EXPERIENCE',
            priceUnit: 'khách',
            unitPriceVnd: '250000',
            active: true,
            sourceReference: 'Bảng giá HTX Pleiku',
            updatedAt: '2026-10-30T00:00:00.000Z',
            slots: [
              {
                id: 'sl-1',
                serviceId: 'sv-1',
                startsAt: '2026-11-02T05:30:00.000Z',
                endsAt: '2026-11-02T09:00:00.000Z',
                capacity: 12,
                heldQuantity: 0,
                soldQuantity: 2,
                availableQuantity: 10,
              },
            ],
          },
        ],
      },
    });
    vi.mocked(getPlaceAudioGuides).mockResolvedValue({ data: [], dataset: 'live' });
    vi.mocked(getEvents).mockResolvedValue({
      dataset: 'live',
      data: [
        {
          id: 'ev-1',
          placeId: firstPlace.id,
          placeTitle: firstPlace.title,
          region: firstPlace.region,
          title: 'Không gian Cồng chiêng Tây Nguyên cuối tuần',
          description: 'Biểu diễn cồng chiêng tại Biển Hồ.',
          startsAt: '2026-11-01T19:00:00.000Z',
          endsAt: '2026-11-01T21:00:00.000Z',
          eventStatus: 'SCHEDULED',
          sourceReference: 'Lịch sự kiện Pleiku',
          updatedAt: '2026-10-30T00:00:00.000Z',
        },
      ],
      meta: { page: 1, pageSize: 12, total: 1, totalPages: 1 },
    });
    vi.mocked(getEvent).mockResolvedValue({
      dataset: 'live',
      data: {
        id: 'ev-1',
        placeId: firstPlace.id,
        placeTitle: firstPlace.title,
        region: firstPlace.region,
        title: 'Không gian Cồng chiêng Tây Nguyên cuối tuần',
        description: 'Biểu diễn cồng chiêng tại Biển Hồ.',
        startsAt: '2026-11-01T19:00:00.000Z',
        endsAt: '2026-11-01T21:00:00.000Z',
        eventStatus: 'SCHEDULED',
        sourceReference: 'Lịch sự kiện Pleiku',
        updatedAt: '2026-10-30T00:00:00.000Z',
      },
    });
    vi.mocked(getServices).mockResolvedValue({
      dataset: 'live',
      data: [],
      meta: { page: 1, pageSize: 12, total: 0, totalPages: 1 },
    });
    vi.mocked(getService).mockResolvedValue({
      dataset: 'live',
      data: {
        id: 'sv-1',
        placeId: firstPlace.id,
        placeTitle: firstPlace.title,
        partnerId: 'pt-1',
        partnerName: 'HTX Du lịch Pleiku',
        title: 'Tour bình minh Biển Hồ',
        description: 'Trải nghiệm ngắm bình minh và thưởng thức cà phê.',
        serviceType: 'EXPERIENCE',
        priceUnit: 'khách',
        unitPriceVnd: '250000',
        active: true,
        sourceReference: 'Bảng giá HTX Pleiku',
        updatedAt: '2026-10-30T00:00:00.000Z',
        slots: [],
      },
    });

    const placeRouter = createMemoryRouter(appRoutes, {
      initialEntries: [`/places/${firstPlace.id}`],
    });
    const placeView = render(<RouterProvider router={placeRouter} />);
    expect(await screen.findByText('Huyền thoại Biển Hồ T’Nưng')).toBeInTheDocument();
    expect(
      screen.getByText('Biển Hồ Pleiku được hình thành từ miệng núi lửa cổ.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Tour bình minh Biển Hồ')).toBeInTheDocument();
    placeRouter.dispose();
    placeView.unmount();

    useAuthStore.setState({
      enabled: true,
      phase: 'authenticated',
      user: {
        id: 'admin-1',
        email: 'admin@example.test',
        displayName: 'Biên tập viên Admin',
        roles: ['ADMIN'],
      },
      note: null,
    });
    vi.mocked(getAdminContentMeta).mockResolvedValue({
      regions: [{ id: firstPlace.region.id, name: firstPlace.region.name, code: 'PLEIKU' }],
      places: [
        {
          id: firstPlace.id,
          contentId: 'cnt-place-1',
          category: firstPlace.category,
          regionId: firstPlace.region.id,
          title: firstPlace.title,
        },
      ],
      partners: [
        { id: 'pt-1', contentId: 'cnt-partner-1', status: 'ACTIVE', title: 'HTX Du lịch Pleiku' },
      ],
      mediaAssets: [],
    });
    const pendingContentItem = {
      id: 'cnt-1',
      kind: 'EVENT' as const,
      visibility: 'DRAFT' as const,
      publishedRevisionId: null,
      projectionId: null,
      title: 'Lễ hội Cồng chiêng mùa thu',
      latestStatus: 'PENDING' as const,
      createdBy: 'admin-1',
      createdAt: '2026-10-30T02:00:00.000Z',
      updatedAt: '2026-10-30T02:00:00.000Z',
      revisions: [
        {
          id: 'rev-1',
          contentId: 'cnt-1',
          revisionNo: 1,
          status: 'PENDING' as const,
          sourceReference: 'https://gialai.gov.vn/le-hoi',
          title: 'Lễ hội Cồng chiêng mùa thu',
          body: 'Sự kiện văn hóa cồng chiêng tại Pleiku.',
          transcript: null,
          audioAssetId: null,
          payload: {},
          submittedBy: 'admin-1',
          reviewedBy: null,
          reviewedAt: null,
          rejectionReason: null,
          createdAt: '2026-10-30T02:00:00.000Z',
        },
      ],
    };
    vi.mocked(listAdminContents).mockResolvedValue({
      data: [pendingContentItem],
      meta: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
    });
    vi.mocked(reviewAdminRevision).mockResolvedValue({
      ...pendingContentItem,
      visibility: 'PUBLIC',
      publishedRevisionId: 'rev-1',
      latestStatus: 'PUBLISHED',
      revisions: [
        {
          ...pendingContentItem.revisions[0],
          status: 'PUBLISHED',
          reviewedBy: 'admin-1',
          reviewedAt: '2026-10-30T02:05:00.000Z',
        },
      ],
    });
    vi.mocked(createAdminContent).mockResolvedValue(pendingContentItem);
    vi.mocked(createAdminRevision).mockResolvedValue(pendingContentItem);
    vi.mocked(submitAdminRevision).mockResolvedValue(pendingContentItem);
    vi.mocked(updateAdminContentVisibility).mockResolvedValue(pendingContentItem);
    vi.mocked(createAdminMediaAsset).mockResolvedValue({} as never);

    const adminRouter = createMemoryRouter(appRoutes, { initialEntries: [APP_PATHS.ADMIN] });
    render(<RouterProvider router={adminRouter} />);
    expect(
      await screen.findByRole('heading', { name: 'Quản trị nội dung & Hàng đợi duyệt' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Lễ hội Cồng chiêng mùa thu')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Duyệt công bố #1' }));
    expect(
      await screen.findByText(
        'Đã duyệt công bố "Lễ hội Cồng chiêng mùa thu" và đồng bộ bảng hiển thị công khai.',
      ),
    ).toBeInTheDocument();
    adminRouter.dispose();
  });

  it('tạo gợi ý lịch trình AI từ 7 thông số, kiểm tra lại (revalidate) và lưu vào chuyến đi đã lưu', async () => {
    const user = userEvent.setup();
    useAuthStore.setState({
      enabled: true,
      phase: 'authenticated',
      user: {
        id: 'u-planner',
        email: 'tourist@example.test',
        displayName: 'Du khách Lập Lịch',
        roles: ['TOURIST'],
      },
      note: null,
    });

    vi.mocked(listMyItineraries).mockResolvedValue([
      {
        id: 'it-saved-1',
        name: 'Chuyến Pleiku cuối tuần',
        lockVersion: 1,
        currentRevisionId: 'rev-1',
        startDate: '2026-11-05',
        daysCount: 2,
        partySize: 2,
        totalBudgetVnd: '2500000',
        estimatedTotalVnd: '1800000',
        createdAt: '2026-10-30T00:00:00.000Z',
        updatedAt: '2026-10-30T01:00:00.000Z',
      },
    ]);

    const mockProposal = {
      startDate: '2026-11-01',
      daysCount: 2,
      partySize: 2,
      totalBudgetVnd: '3000000',
      estimatedTotalVnd: '1200000',
      origin: { latitude: 13.9833, longitude: 108.0, label: 'Quảng trường Pleiku' },
      transportMode: 'MOTORBIKE' as const,
      preferences: { categories: ['NATURE' as const], pace: 'BALANCED' as const },
      warnings: [],
      violations: [],
      isValid: true,
      aiRequestId: 'ai-req-123',
      days: [
        {
          dayNumber: 1,
          travelDate: '2026-11-01',
          stops: [
            {
              placeId: 'pl-1',
              placeTitle: 'Biển Hồ Pleiku',
              sequenceNo: 1,
              arrivesAt: '2026-11-01T08:30:00.000Z',
              departsAt: '2026-11-01T10:30:00.000Z',
              estimatedCostVnd: 40000,
            },
          ],
          legs: [],
        },
      ],
    };

    vi.mocked(generateItineraryProposal).mockResolvedValue(mockProposal);
    vi.mocked(revalidateItineraryProposal).mockResolvedValue({
      ...mockProposal,
      warnings: ['Lưu ý: Thời gian di chuyển có thể tăng vào giờ cao điểm.'],
    });
    vi.mocked(createMyItinerary).mockResolvedValue({
      id: 'it-new-1',
      ownerId: 'u-planner',
      name: 'Khám phá Gia Lai 2N1Đ',
      lockVersion: 0,
      currentRevisionId: 'rev-new-1',
      createdAt: '2026-10-30T03:00:00.000Z',
      updatedAt: '2026-10-30T03:00:00.000Z',
      revision: {
        id: 'rev-new-1',
        revisionNo: 1,
        validatedAt: '2026-10-30T03:00:00.000Z',
        ...mockProposal,
      },
    });

    const router = createMemoryRouter(appRoutes, { initialEntries: [APP_PATHS.TRIPS] });
    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole('heading', { name: 'Chuyến đi & Lịch trình AI' }),
    ).toBeInTheDocument();

    // Switch to AI planner tab
    await user.click(screen.getByRole('button', { name: /Tạo lịch trình AI/ }));
    expect(await screen.findByRole('heading', { name: /Thông số chuyến đi/ })).toBeInTheDocument();

    // Click submit AI proposal generator
    await user.click(screen.getByRole('button', { name: 'Lập lịch trình với AI' }));
    expect(await screen.findByText('Biển Hồ Pleiku')).toBeInTheDocument();
    expect(screen.getByText('Lịch trình hợp lệ')).toBeInTheDocument();

    // Revalidate
    await user.click(screen.getByRole('button', { name: /Kiểm tra lại/ }));
    expect(
      await screen.findByText('Lưu ý: Thời gian di chuyển có thể tăng vào giờ cao điểm.'),
    ).toBeInTheDocument();

    // Save to account
    await user.click(screen.getByRole('button', { name: 'Lưu vào tài khoản' }));
    expect(
      await screen.findByText(/Đã lưu "Khám phá Gia Lai 2N1Đ" vào danh sách chuyến đi/),
    ).toBeInTheDocument();
    router.dispose();
  });

  it('quản lý quy trình đặt dịch vụ: tạo đơn, duyệt giữ chỗ 30p, thanh toán mô phỏng và hủy đơn có hoàn tiền', async () => {
    const user = userEvent.setup();
    useAuthStore.setState({
      enabled: true,
      phase: 'authenticated',
      user: {
        id: 'user-tourist-1',
        email: 'tourist@example.com',
        displayName: 'Du Khách Mẫu',
        roles: ['TOURIST'],
      },
      note: null,
    });

    const mockBooking = {
      id: 'book-sample-1234',
      customerId: 'user-tourist-1',
      customerName: 'Du Khách Mẫu',
      customerEmail: 'tourist@example.com',
      serviceId: 'srv-1',
      serviceTitle: 'Tour Trekking Chư Đang Ya',
      partnerName: 'Hợp tác xã Du lịch Chư Đang Ya',
      slotId: 'slot-1',
      status: 'CHO_THANH_TOAN' as const,
      quantity: 2,
      unitPriceVnd: '350000',
      totalVnd: '700000',
      commissionPercent: 10,
      contactName: 'Du Khách Mẫu',
      contactEmail: 'tourist@example.com',
      contactPhone: '0905123456',
      startsAt: '2026-11-20T08:00:00.000Z',
      endsAt: '2026-11-20T12:00:00.000Z',
      reviewDeadline: '2026-11-19T08:00:00.000Z',
      paymentDeadline: '2026-11-19T08:30:00.000Z',
      reviewedBy: 'admin-1',
      reviewedAt: '2026-11-19T08:00:00.000Z',
      rejectionReason: null,
      cancelledAt: null,
      completedAt: null,
      idempotencyKey: 'idem-1234',
      lockVersion: 1,
      createdAt: '2026-11-18T08:00:00.000Z',
      updatedAt: '2026-11-19T08:00:00.000Z',
    };

    vi.mocked(listMyBookings).mockResolvedValue({
      data: [mockBooking],
      meta: { page: 1, pageSize: 50, total: 1, totalPages: 1 },
    });

    vi.mocked(recordPaymentAttempt).mockResolvedValue({
      data: {
        ...mockBooking,
        status: 'DA_XAC_NHAN',
      },
    });

    vi.mocked(cancelBooking).mockResolvedValue({
      data: {
        ...mockBooking,
        status: 'DA_HUY',
        cancelledAt: '2026-11-19T09:00:00.000Z',
      },
    });

    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const router = createMemoryRouter(appRoutes, { initialEntries: [APP_PATHS.BOOKINGS] });
    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole('heading', { name: 'Đơn đặt dịch vụ của tôi' }),
    ).toBeInTheDocument();

    expect(await screen.findByText('Tour Trekking Chư Đang Ya')).toBeInTheDocument();
    expect(screen.getByText('Chờ thanh toán')).toBeInTheDocument();
    expect(screen.getByText('700.000 ₫')).toBeInTheDocument();

    // Trigger mock payment
    const payBtn = screen.getByRole('button', { name: /Thanh toán mô phỏng thành công/ });
    await user.click(payBtn);
    expect(recordPaymentAttempt).toHaveBeenCalledWith(
      'book-sample-1234',
      expect.objectContaining({ outcome: 'SUCCEEDED' }),
    );

    // Cancel booking
    const cancelBtn = screen.getByRole('button', { name: 'Hủy đơn đặt' });
    await user.click(cancelBtn);
    expect(cancelBooking).toHaveBeenCalledWith('book-sample-1234', expect.any(String));

    router.dispose();
  });

  it('xem thông báo hệ thống và đóng góp phản hồi/báo lỗi dữ liệu địa điểm', async () => {
    const user = userEvent.setup();
    useAuthStore.setState({
      enabled: true,
      phase: 'authenticated',
      user: {
        id: 'user-tourist-1',
        email: 'tourist@example.com',
        displayName: 'Du Khách Mẫu',
        roles: ['TOURIST'],
      },
      note: null,
    });

    const mockNotification = {
      id: 'notif-1',
      userId: 'user-tourist-1',
      eventKey: 'booking-created',
      kind: 'BOOKING',
      title: 'Đơn đặt dịch vụ thành công',
      body: 'Bạn có một đơn đặt dịch vụ Chư Đang Ya đang chờ duyệt.',
      targetType: 'BOOKING',
      targetId: 'book-1',
      readAt: null,
      createdAt: '2026-10-30T04:00:00.000Z',
    };

    vi.mocked(listMyNotifications).mockResolvedValue({
      data: [mockNotification],
      meta: { page: 1, pageSize: 50, total: 1, totalPages: 1, unreadCount: 1 },
    });
    vi.mocked(markAllNotificationsRead).mockResolvedValue({ data: { success: true } });

    const router = createMemoryRouter(appRoutes, { initialEntries: [APP_PATHS.NOTIFICATIONS] });
    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole('heading', { name: 'Hộp thư thông báo hệ thống' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Đơn đặt dịch vụ thành công')).toBeInTheDocument();
    expect(screen.getByText('Đánh dấu tất cả đã đọc (1)')).toBeInTheDocument();

    const markAllBtn = screen.getByRole('button', { name: /Đánh dấu tất cả đã đọc/ });
    await user.click(markAllBtn);
    expect(markAllNotificationsRead).toHaveBeenCalled();

    router.dispose();
  });
});
