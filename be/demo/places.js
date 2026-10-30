// Deliberately isolated from src/server.js: sample data, never production content.
const regions = [
  { id: '20000000-0000-4000-8000-000000000001', name: 'Vùng mẫu A' },
  { id: '20000000-0000-4000-8000-000000000002', name: 'Vùng mẫu B' },
];

// Minimal valid WAV header + silent PCM frame for offline/sandbox audio playback testing.
export const DEMO_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

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

export const demoAudioGuides = [
  {
    id: '30000000-0000-4000-8000-000000000001',
    placeId: '10000000-0000-4000-8000-000000000001',
    title: 'Thuyết minh Biển Hồ (Tơ Nưng)',
    description: 'Bản thu giới thiệu lịch sử hình thành miệng núi lửa cổ Biển Hồ Pleiku.',
    transcript:
      'Chào mừng bạn đến với Biển Hồ Tơ Nưng — miệng núi lửa cổ ngập nước ngọt nằm ở phía bắc Pleiku. Hàng thông cổ thụ hai bên đường dẫn xuống mặt hồ tạo nên không gian tĩnh lặng đặc trưng của vùng cao nguyên Gia Lai.',
    languageCode: 'vi',
    audioUrl: DEMO_WAV_DATA_URI,
    premiumOnly: false,
    sourceReference: 'https://gialai.gov.vn/demo/audio/bien-ho',
  },
  {
    id: '30000000-0000-4000-8000-000000000002',
    placeId: '10000000-0000-4000-8000-000000000003',
    title: 'Thuyết minh Kiến trúc Chùa Minh Thành',
    description: 'Giới thiệu bảo tháp và kiến trúc gỗ chạm khắc tại Chùa Minh Thành.',
    transcript:
      'Chùa Minh Thành nổi bật với bảo tháp Xá Lợi chín tầng và hệ mái cong chạm khắc tinh xảo tại trung tâm Pleiku. Vui lòng giữ trật tự và trang phục lịch sự khi tham quan khuôn viên chùa.',
    languageCode: 'vi',
    audioUrl: DEMO_WAV_DATA_URI,
    premiumOnly: false,
    sourceReference: 'https://gialai.gov.vn/demo/audio/chua-minh-thanh',
  },
];

export const demoEvents = [
  {
    id: '40000000-0000-4000-8000-000000000001',
    placeId: '10000000-0000-4000-8000-000000000002',
    placeTitle: 'Chư Đăng Ya',
    region: regions[1],
    title: 'Tuần lễ Hoa Dã Quỳ – Núi lửa Chư Đăng Ya',
    description:
      'Sự kiện văn hóa – du lịch thường niên dưới chân núi lửa Chư Đăng Ya với trình diễn cồng chiêng Jrai, đan lát, dệt thổ cẩm và ẩm thực bản địa.',
    startsAt: '2026-11-10T01:00:00.000Z',
    endsAt: '2026-11-12T10:00:00.000Z',
    eventStatus: 'SCHEDULED',
    sourceReference: 'https://gialai.gov.vn/demo/events/chu-dang-ya',
    updatedAt: '2026-10-30T00:00:00.000Z',
  },
  {
    id: '40000000-0000-4000-8000-000000000002',
    placeId: '10000000-0000-4000-8000-000000000006',
    placeTitle: 'Không gian văn hóa',
    region: regions[1],
    title: 'Đêm giao lưu Cồng chiêng Tây Nguyên',
    description:
      'Biểu diễn nghệ thuật cồng chiêng và múa xoang truyền thống của nghệ nhân Jrai tại khuôn viên văn hóa.',
    startsAt: '2026-11-15T11:00:00.000Z',
    endsAt: '2026-11-15T14:00:00.000Z',
    eventStatus: 'SCHEDULED',
    sourceReference: 'https://gialai.gov.vn/demo/events/cong-chieng',
    updatedAt: '2026-10-30T00:00:00.000Z',
  },
  {
    id: '40000000-0000-4000-8000-000000000003',
    placeId: '10000000-0000-4000-8000-000000000001',
    placeTitle: 'Biển Hồ',
    region: regions[0],
    title: 'Giải chạy cung đường thông Biển Hồ (Tạm hoãn)',
    description:
      'Sự kiện thể thao ngoài trời quanh cung đường thông Biển Hồ đã được ban tổ chức thông báo hủy do bảo trì đường nội bộ.',
    startsAt: '2026-11-20T00:00:00.000Z',
    endsAt: '2026-11-20T05:00:00.000Z',
    eventStatus: 'CANCELLED',
    sourceReference: 'https://gialai.gov.vn/demo/events/bien-ho-run',
    updatedAt: '2026-10-30T00:00:00.000Z',
  },
];

export const demoServices = [
  {
    id: '50000000-0000-4000-8000-000000000001',
    placeId: '10000000-0000-4000-8000-000000000001',
    placeTitle: 'Biển Hồ',
    partnerId: '60000000-0000-4000-8000-000000000001',
    partnerName: 'Hợp tác xã Du lịch Sinh thái Pleiku',
    title: 'Tour thuyết minh & thưởng trà đồi thông Biển Hồ',
    description:
      'Hướng dẫn viên bản địa đồng hành 90 phút quanh cung đường thông và thưởng thức trà hoa cà phê Gia Lai.',
    serviceType: 'GUIDE',
    priceUnit: 'khách',
    unitPriceVnd: '150000',
    active: true,
    sourceReference: 'https://gialai.gov.vn/demo/services/bien-ho-guide',
    updatedAt: '2026-10-30T00:00:00.000Z',
    slots: [
      {
        id: '70000000-0000-4000-8000-000000000001',
        serviceId: '50000000-0000-4000-8000-000000000001',
        startsAt: '2026-11-05T01:00:00.000Z',
        endsAt: '2026-11-05T03:00:00.000Z',
        capacity: 12,
        heldQuantity: 2,
        soldQuantity: 4,
        availableQuantity: 6,
      },
      {
        id: '70000000-0000-4000-8000-000000000002',
        serviceId: '50000000-0000-4000-8000-000000000001',
        startsAt: '2026-11-06T01:00:00.000Z',
        endsAt: '2026-11-06T03:00:00.000Z',
        capacity: 12,
        heldQuantity: 0,
        soldQuantity: 2,
        availableQuantity: 10,
      },
    ],
  },
  {
    id: '50000000-0000-4000-8000-000000000002',
    placeId: '10000000-0000-4000-8000-000000000002',
    placeTitle: 'Chư Đăng Ya',
    partnerId: '60000000-0000-4000-8000-000000000001',
    partnerName: 'Hợp tác xã Du lịch Sinh thái Pleiku',
    title: 'Trải nghiệm trekking & ẩm thực bản Jrai Chư Đăng Ya',
    description:
      'Hành trình nửa ngày chinh phục miệng núi lửa Chư Đăng Ya kết hợp thưởng thức cơm lam, gà nướng cùng nghệ nhân bản địa.',
    serviceType: 'EXPERIENCE',
    priceUnit: 'khách',
    unitPriceVnd: '280000',
    active: true,
    sourceReference: 'https://gialai.gov.vn/demo/services/chu-dang-ya-trek',
    updatedAt: '2026-10-30T00:00:00.000Z',
    slots: [
      {
        id: '70000000-0000-4000-8000-000000000003',
        serviceId: '50000000-0000-4000-8000-000000000002',
        startsAt: '2026-11-10T00:30:00.000Z',
        endsAt: '2026-11-10T04:30:00.000Z',
        capacity: 15,
        heldQuantity: 1,
        soldQuantity: 5,
        availableQuantity: 9,
      },
    ],
  },
];

export const demoPlaces = entries.map(([title, category, regionIndex, price, duration], index) => {
  const id = `10000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
  return {
    id,
    title,
    category,
    region: regions[regionIndex],
    description: `Khám phá ${title} trong hành trình thử nghiệm của bạn. Chọn điểm này để trải nghiệm cách sắp xếp một chuyến đi phù hợp với sở thích.\n\nĐây là nội dung mẫu phục vụ trình diễn giao diện, chưa được xác minh để hướng dẫn du lịch. Giá và thời lượng nếu có đều là số liệu minh họa. Chưa có thông tin giờ mở cửa, tọa độ hoặc nguồn nội dung được duyệt.`,
    latitude: null,
    longitude: null,
    referencePriceVnd: price,
    typicalDurationMinutes: duration,
    sourceReference: null,
    updatedAt: '2026-10-30T00:00:00.000Z',
    openingHours: [],
    closures: [],
    audioGuides: demoAudioGuides.filter((guide) => guide.placeId === id),
    events: demoEvents.filter((ev) => ev.placeId === id),
    services: demoServices.filter((svc) => svc.placeId === id),
  };
});
