import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminPlacesManager } from './components/AdminPlacesManager';
import { AdminEventsManager } from './components/AdminEventsManager';
import type { AdminContentMeta, AdminEventItem, AdminPlaceItem } from '../explore/types/catalog';
import * as adminService from '@/services/admin';

const mockMeta: AdminContentMeta = {
  regions: [
    { id: 'reg-1', name: 'TP. Pleiku', code: 'PLEIKU' },
    { id: 'reg-2', name: 'Huyện Chư Păh', code: 'CHUPAH' },
  ],
  partners: [],
  places: [
    {
      id: 'pl-1',
      contentId: 'cnt-1',
      title: 'Biển Hồ (Hồ T’Nưng)',
      category: 'NATURE',
      regionId: 'reg-1',
    },
  ],
  mediaAssets: [],
};

const mockPlaces: AdminPlaceItem[] = [
  {
    id: 'pl-1',
    contentId: 'cnt-1',
    title: 'Biển Hồ (Hồ T’Nưng)',
    description: 'Đôi mắt Pleiku ngút ngàn rừng thông...',
    category: 'NATURE',
    regionId: 'reg-1',
    regionName: 'TP. Pleiku',
    latitude: 14.05,
    longitude: 108.01,
    referencePriceVnd: '10000',
    typicalDurationMinutes: 120,
    bannerUrl: 'https://cdn.example.com/bien-ho.jpg',
    imageUrl: 'https://cdn.example.com/bien-ho.jpg',
    sourceReference: 'https://gialai.gov.vn',
    visibility: 'PUBLIC',
    openingHours: [],
    updatedAt: '2026-10-30T00:00:00.000Z',
  },
];

const mockEvents: AdminEventItem[] = [
  {
    id: 'ev-1',
    contentId: 'cnt-ev-1',
    placeId: 'pl-1',
    placeTitle: 'Biển Hồ (Hồ T’Nưng)',
    regionName: 'TP. Pleiku',
    title: 'Lễ hội Hoa Dã Quỳ Chư Đang Ya',
    description: 'Mùa hoa dã quỳ nhuộm vàng miệng núi lửa cổ...',
    startsAt: '2026-11-10T08:00:00.000Z',
    endsAt: '2026-11-12T18:00:00.000Z',
    eventStatus: 'SCHEDULED',
    bannerUrl: 'https://pub-r2.dev/events/da-quy.jpg',
    imageUrl: 'https://pub-r2.dev/events/da-quy.jpg',
    sourceReference: 'https://baogialai.com.vn',
    visibility: 'PUBLIC',
    updatedAt: '2026-10-30T00:00:00.000Z',
  },
];

describe('Admin Places CRUD (AdminPlacesManager)', () => {
  it('hiển thị danh sách địa điểm và lọc theo từ khóa', async () => {
    const user = userEvent.setup();
    render(<AdminPlacesManager initialPlaces={mockPlaces} meta={mockMeta} />);

    expect(screen.getByText('Biển Hồ (Hồ T’Nưng)')).toBeInTheDocument();
    expect(screen.getByText(/10.000/)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Tìm theo tên địa điểm, mô tả...');
    await user.type(searchInput, 'Không tồn tại');
    expect(screen.getByText('Không tìm thấy địa điểm nào phù hợp.')).toBeInTheDocument();
  });

  it('mở modal tạo mới địa điểm và gửi dữ liệu thành công', async () => {
    const user = userEvent.setup();
    const createdPlace: AdminPlaceItem = {
      ...mockPlaces[0],
      id: 'pl-2',
      title: 'Thác Phú Cường',
      description: 'Dải lụa trắng giữa đại ngàn Chư Sê...',
    };
    vi.spyOn(adminService, 'createAdminPlace').mockResolvedValue(createdPlace);

    render(<AdminPlacesManager initialPlaces={mockPlaces} meta={mockMeta} />);

    await user.click(screen.getByRole('button', { name: /Thêm địa điểm mới/i }));
    expect(screen.getByRole('heading', { name: 'Thêm địa điểm du lịch mới' })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Tiêu đề địa điểm/i), 'Thác Phú Cường');
    await user.type(
      screen.getByLabelText(/Mô tả điểm đến chi tiết/i),
      'Dải lụa trắng giữa đại ngàn Chư Sê...',
    );

    await user.click(screen.getByRole('button', { name: 'Tạo địa điểm' }));

    await waitFor(() => {
      expect(
        screen.getByText(/Đã tạo mới địa điểm "Thác Phú Cường" thành công!/i),
      ).toBeInTheDocument();
    });
    expect(screen.getByText('Thác Phú Cường')).toBeInTheDocument();
  });

  it('xóa địa điểm với xác nhận thành công', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(adminService, 'deleteAdminPlace').mockResolvedValue({
      success: true,
      message: 'Đã xóa',
    });

    render(<AdminPlacesManager initialPlaces={mockPlaces} meta={mockMeta} />);

    await user.click(screen.getByRole('button', { name: /Xóa/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Đã xóa địa điểm "Biển Hồ \(Hồ T’Nưng\)" thành công!/i),
      ).toBeInTheDocument();
    });
    expect(screen.queryByText('Biển Hồ (Hồ T’Nưng)')).not.toBeInTheDocument();
  });
});

describe('Admin Events CRUD & Banner Cloudflare R2 (AdminEventsManager)', () => {
  it('hiển thị danh sách sự kiện với trạng thái và banner', () => {
    render(<AdminEventsManager initialEvents={mockEvents} meta={mockMeta} />);

    expect(screen.getByText('Lễ hội Hoa Dã Quỳ Chư Đang Ya')).toBeInTheDocument();
    expect(screen.getAllByText('Sắp diễn ra')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Biển Hồ (Hồ T’Nưng)')[0]).toBeInTheDocument();
  });

  it('hỗ trợ 2 tùy chọn banner: Dán URL và Upload lên Cloudflare R2', async () => {
    const user = userEvent.setup();
    vi.spyOn(adminService, 'uploadAdminR2Image').mockResolvedValue({
      url: 'https://pub-abc.r2.dev/events/festival.webp',
      key: 'events/festival.webp',
      provider: 'cloudflare-r2',
      byteSize: 102400,
      mimeType: 'image/webp',
    });

    render(<AdminEventsManager initialEvents={mockEvents} meta={mockMeta} />);

    await user.click(screen.getByRole('button', { name: /Thêm sự kiện mới/i }));
    expect(screen.getByText(/Cách 1: Sao chép liên kết dán vào/i)).toBeInTheDocument();
    expect(screen.getByText(/Cách 2: Upload ảnh lên Cloudflare R2/i)).toBeInTheDocument();

    // 1. Test cách 1: dán URL
    const urlInput = screen.getByPlaceholderText(/Dán liên kết ảnh vào đây/i);
    await user.type(urlInput, 'https://images.unsplash.com/test-banner.jpg');
    expect(screen.getByText('Xem trước ảnh banner:')).toBeInTheDocument();

    // 2. Test cách 2: chuyển sang Upload Cloudflare R2
    await user.click(screen.getByText(/Cách 2: Upload ảnh lên Cloudflare R2/i));
    const fileInput = screen.getByLabelText(/Chọn tệp ảnh từ máy tính/i);

    const testFile = new File(['dummy-content'], 'festival.png', { type: 'image/png' });
    await user.upload(fileInput, testFile);

    await waitFor(() => {
      expect(screen.getByText(/Đã upload lên Cloudflare R2/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Cloudflare R2')).toBeInTheDocument();
  });

  it('cho phép đổi nhanh trạng thái sự kiện sang Đã kết thúc', async () => {
    const user = userEvent.setup();
    vi.spyOn(adminService, 'updateAdminEvent').mockResolvedValue({
      ...mockEvents[0],
      eventStatus: 'COMPLETED',
    });

    render(<AdminEventsManager initialEvents={mockEvents} meta={mockMeta} />);

    const completeBtn = screen.getByRole('button', { name: 'Đã kết thúc' });
    await user.click(completeBtn);

    await waitFor(() => {
      expect(screen.getByText(/Đã đổi trạng thái sự kiện sang "Đã kết thúc"/i)).toBeInTheDocument();
    });
  });

  it('xóa sự kiện thành công khi xác nhận', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(adminService, 'deleteAdminEvent').mockResolvedValue({
      success: true,
      message: 'Đã xóa',
    });

    render(<AdminEventsManager initialEvents={mockEvents} meta={mockMeta} />);

    await user.click(screen.getByRole('button', { name: /Xóa/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Đã xóa sự kiện "Lễ hội Hoa Dã Quỳ Chư Đang Ya" thành công!/i),
      ).toBeInTheDocument();
    });
    expect(screen.queryByText('Lễ hội Hoa Dã Quỳ Chư Đang Ya')).not.toBeInTheDocument();
  });
});
