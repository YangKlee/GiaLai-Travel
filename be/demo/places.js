// Deliberately isolated from src/server.js: sample data, never production content.
const regions = [
  { id: '20000000-0000-4000-8000-000000000001', name: 'Vùng mẫu A' },
  { id: '20000000-0000-4000-8000-000000000002', name: 'Vùng mẫu B' },
];
const entries = [
  ['Biển Hồ', 'NATURE', 0, null, 60],
  ['Chư Đăng Ya', 'ADVENTURE', 1, '50000', 120],
  ['Chùa Minh Thành', 'CULTURE', 0, '0', 60],
  ['Đồi chè', 'NATURE', 1, '30000', 90],
  ['Góc cà phê cao nguyên', 'FOOD', 0, '45000', 45],
  ['Không gian văn hóa', 'CULTURE', 1, null, 90],
  ['Vườn trải nghiệm', 'ADVENTURE', 1, '120000', 120],
  ['Ẩm thực địa phương', 'FOOD', 0, '80000', 60],
];

export const demoPlaces = entries.map(([title, category, regionIndex, price, duration], index) => ({
  id: `10000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  title, category, region: regions[regionIndex],
  description: `Khám phá ${title} trong hành trình thử nghiệm của bạn. Chọn điểm này để trải nghiệm cách sắp xếp một chuyến đi phù hợp với sở thích.\n\nĐây là nội dung mẫu phục vụ trình diễn giao diện, chưa được xác minh để hướng dẫn du lịch. Giá và thời lượng nếu có đều là số liệu minh họa. Chưa có thông tin giờ mở cửa, tọa độ hoặc nguồn nội dung được duyệt.`,
  latitude: null, longitude: null, referencePriceVnd: price,
  typicalDurationMinutes: duration, sourceReference: null,
  updatedAt: '2026-10-30T00:00:00.000Z', openingHours: [],
}));
