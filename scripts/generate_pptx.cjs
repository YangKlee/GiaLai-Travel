const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createPitchDeck() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
  pres.title = 'GiaLai Travel - Ý tưởng Khởi nghiệp Du lịch số';
  pres.author = 'YangKlee - GiaLai Travel Team';

  // Palette: Blue (#0047AB, #1E3A8A), Red (#DC2626, #991B1B), White (#FFFFFF), Neutral Dark (#0F172A), Light Gray (#F8FAFC)
  const BLUE_PRIMARY = '0047AB';
  const BLUE_DARK = '1E3A8A';
  const BLUE_LIGHT = 'EFF6FF';
  const RED_ACCENT = 'DC2626';
  const RED_DARK = '991B1B';
  const RED_LIGHT = 'FEF2F2';
  const WHITE = 'FFFFFF';
  const TEXT_MAIN = '0F172A';
  const TEXT_MUTED = '475569';
  const BORDER_COLOR = 'CBD5E1';
  const CARD_BG = 'F8FAFC';

  const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

  // Helper to add header to content slides
  function addSlideHeader(slide, category, title, slideNum) {
    // Top banner subtle line
    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: 10, h: 0.12,
      fill: { color: RED_ACCENT },
      line: { color: RED_ACCENT }
    });

    // Category badge
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.35, w: 7, h: 0.3,
      fontSize: 10, bold: true, color: RED_ACCENT, fontFace: 'Segoe UI'
    });

    // Slide Title
    slide.addText(title, {
      x: 0.8, y: 0.65, w: 7.5, h: 0.5,
      fontSize: 22, bold: true, color: BLUE_DARK, fontFace: 'Segoe UI'
    });

    // Slide Number & branding
    slide.addText(`${slideNum} | GiaLai Travel Pitch Deck`, {
      x: 6.8, y: 0.35, w: 2.4, h: 0.3,
      fontSize: 9, color: TEXT_MUTED, align: 'right', fontFace: 'Segoe UI'
    });

    // Separator line
    slide.addShape(pres.ShapeType.line, {
      x: 0.8, y: 1.2, w: 8.4, h: 0,
      line: { color: 'E2E8F0', width: 1.5 }
    });
  }

  // ==========================================
  // SLIDE 1: COVER
  // ==========================================
  {
    const slide = pres.addSlide();
    // Background gradient or split color
    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: 10, h: 5.625,
      fill: { color: BLUE_DARK }
    });

    // Red Accent decorative shape
    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: 0.35, h: 5.625,
      fill: { color: RED_ACCENT }
    });
    slide.addShape(pres.ShapeType.rect, {
      x: 0.35, y: 0, w: 0.1, h: 5.625,
      fill: { color: WHITE }
    });

    // Badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.9, y: 0.8, w: 2.8, h: 0.38,
      fill: { color: RED_ACCENT },
      rectRadius: 0.1
    });
    slide.addText('DỰ ÁN KHỞI NGHIỆP ĐỔI MỚI SÁNG TẠO', {
      x: 0.9, y: 0.8, w: 2.8, h: 0.38,
      fontSize: 9, bold: true, color: WHITE, align: 'center', fontFace: 'Segoe UI'
    });

    // Title
    slide.addText('GiaLai Travel', {
      x: 0.9, y: 1.3, w: 5.5, h: 0.9,
      fontSize: 44, bold: true, color: WHITE, fontFace: 'Segoe UI'
    });

    // Subtitle
    slide.addText('Nền tảng Du lịch số Thông minh & Trợ lý Đồng hành Khám phá Bản địa', {
      x: 0.9, y: 2.2, w: 5.2, h: 0.8,
      fontSize: 16, color: 'E2E8F0', fontFace: 'Segoe UI'
    });

    // Key bullets
    slide.addText([
      { text: '• Trợ lý AI lập lịch trình cá nhân hóa theo ngân sách & sở thích\n', options: { fontSize: 12, color: 'CBD5E1' } },
      { text: '• Kiến trúc Ngoại tuyến (Offline-First) - Không lo mất sóng vùng núi\n', options: { fontSize: 12, color: 'CBD5E1' } },
      { text: '• Số hóa Văn hóa Tây Nguyên & Kết nối Dịch vụ Địa phương trực tiếp\n', options: { fontSize: 12, color: 'CBD5E1' } },
      { text: '• Nền tảng Web Responsive hiện đại, không cần cài đặt ứng dụng nặng', options: { fontSize: 12, color: 'CBD5E1' } }
    ], {
      x: 0.9, y: 3.1, w: 5.2, h: 1.2, fontFace: 'Segoe UI'
    });

    // Screenshot Mockup on Right
    const homeImg = path.join(SCREENSHOT_DIR, '01_home_hero.png');
    if (fs.existsSync(homeImg)) {
      // Mockup border card
      slide.addShape(pres.ShapeType.roundRect, {
        x: 6.0, y: 1.0, w: 3.4, h: 3.6,
        fill: { color: WHITE },
        rectRadius: 0.15,
        line: { color: RED_ACCENT, width: 2 }
      });
      slide.addImage({
        path: homeImg,
        x: 6.05, y: 1.05, w: 3.3, h: 2.5
      });
      // Live web url badge
      slide.addText('🌐 Demo trực tuyến:\ngialaitravel.yangkleeserver.io.vn', {
        x: 6.1, y: 3.65, w: 3.2, h: 0.85,
        fontSize: 11, bold: true, color: BLUE_DARK, align: 'center', fontFace: 'Segoe UI'
      });
    }

    // Presenter Info footer
    slide.addText('Người trình bày: Đội ngũ Sáng lập GiaLai Travel (YangKlee) | Tài khoản Demo: khanhduong18072005@gmail.com', {
      x: 0.9, y: 4.85, w: 8.5, h: 0.4,
      fontSize: 10, color: '94A3B8', fontFace: 'Segoe UI'
    });
  }

  // ==========================================
  // SLIDE 2: BỐI CẢNH & VẤN ĐỀ THỊ TRƯỜNG (PROBLEM)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '01. Bối cảnh & Vấn đề', 'Thực Trạng & Nỗi Đau (Pain Points) Của Du Lịch Gia Lai', 2);

    // Left Column: Market Context Box
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.4, w: 2.6, h: 3.8,
      fill: { color: BLUE_LIGHT },
      line: { color: BLUE_PRIMARY, width: 1.5 },
      rectRadius: 0.1
    });
    slide.addText('TIỀM NĂNG GIA LAI', {
      x: 0.9, y: 1.55, w: 2.4, h: 0.3,
      fontSize: 12, bold: true, color: BLUE_DARK, fontFace: 'Segoe UI'
    });
    slide.addText([
      { text: '• Điểm đến nổi tiếng: ', options: { bold: true, color: TEXT_MAIN } },
      { text: 'Biển Hồ T\'Nưng, Chư Đăng Ya, Thác K50, Chùa Minh Thành, Hàng thông trăm tuổi.\n\n' },
      { text: '• Văn hóa đặc sắc: ', options: { bold: true, color: TEXT_MAIN } },
      { text: 'Không gian văn hóa Cồng chiêng Tây Nguyên (UNESCO), nhà rông, sử thi Jrai.\n\n' },
      { text: '• Quy mô: ', options: { bold: true, color: TEXT_MAIN } },
      { text: 'Hơn 1.2+ triệu lượt khách/năm nhưng chi tiêu bình quân và thời gian lưu trú còn thấp.' }
    ], {
      x: 0.9, y: 1.95, w: 2.4, h: 3.1,
      fontSize: 10.5, fontFace: 'Segoe UI', color: TEXT_MAIN
    });

    // Right: 4 Problem Cards
    const problems = [
      {
        icon: '⚠️ VẤN ĐỀ 1',
        title: 'Thông Tin Rời Rạc & Thiếu Kiểm Chứng',
        desc: 'Du khách phải tìm kiếm thủ công qua mạng xã hội, diễn đàn; thông tin về giờ mở cửa, đường đi, giá dịch vụ thiếu chuẩn xác và không có cẩm nang thống nhất.'
      },
      {
        icon: '🗺️ VẤN ĐỀ 2',
        title: 'Lúng Túng Khi Tự Lên Lịch Trình',
        desc: 'Gia Lai có địa hình đồi núi, đèo dốc và các huyện cách xa nhau (Kbang, Chư Păh, Ia Grai). Du khách không biết sắp xếp tuyến đường tối ưu thời gian & chi phí.'
      },
      {
        icon: '📵 VẤN ĐỀ 3',
        title: 'Mất Sóng 4G/Internet Khi Trải Nghiệm',
        desc: 'Nhiều điểm sinh thái hùng vĩ (thác sâu, rừng nguyên sinh, khu bảo tồn Kon Chư Răng) hoàn toàn mất sóng mạng. Các ứng dụng du lịch thông thường bị tê liệt.'
      },
      {
        icon: '💸 VẤN ĐỀ 4',
        title: 'Cộng Đồng Bản Địa Chịu Phí OTA Cao',
        desc: 'Các hộ homestay, hướng dẫn viên, hộ kinh doanh đặc sản Gia Lai bị áp mức chiết khấu 18-25% từ các nền tảng OTA nước ngoài, hạn chế quảng bá văn hóa địa phương.'
      }
    ];

    problems.forEach((p, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 3.6 + col * 2.8;
      const y = 1.4 + row * 1.95;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 2.65, h: 1.8,
        fill: { color: WHITE },
        line: { color: RED_ACCENT, width: 1.2 },
        rectRadius: 0.1
      });

      slide.addShape(pres.ShapeType.rect, {
        x: x + 0.15, y: y + 0.15, w: 1.2, h: 0.28,
        fill: { color: RED_LIGHT }
      });
      slide.addText(p.icon, {
        x: x + 0.15, y: y + 0.15, w: 1.2, h: 0.28,
        fontSize: 9, bold: true, color: RED_ACCENT, align: 'center', fontFace: 'Segoe UI'
      });

      slide.addText(p.title, {
        x: x + 0.15, y: y + 0.48, w: 2.35, h: 0.45,
        fontSize: 11, bold: true, color: BLUE_DARK, fontFace: 'Segoe UI'
      });
      slide.addText(p.desc, {
        x: x + 0.15, y: y + 0.95, w: 2.35, h: 0.8,
        fontSize: 9.5, color: TEXT_MUTED, fontFace: 'Segoe UI'
      });
    });
  }

  // ==========================================
  // SLIDE 3: GIẢI PHÁP ĐỘT PHÁ (SOLUTION)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '02. Giải pháp', 'GiaLai Travel - Hệ Sinh Thái Du Lịch Số Bản Địa "All-in-One"', 3);

    const pillars = [
      {
        num: '01',
        title: 'Trí Tuệ Nhân Tạo (AI) Lập Lịch Trình',
        color: BLUE_PRIMARY,
        points: [
          'Tự động sinh lịch trình chi tiết theo ngân sách (VND), số ngày, số khách.',
          'Cân bằng nhịp độ di chuyển: Thong thả (2-3 điểm/ngày), Cân bằng, Năng động.',
          'Hiểu văn hóa bản địa: gợi ý quán ăn sáng phở hai tô, cà phê Pleiku, hoàng hôn Biển Hồ.'
        ]
      },
      {
        num: '02',
        title: 'Kiến Trúc Ngoại Tuyến (Offline-First)',
        color: RED_ACCENT,
        points: [
          'Lưu trữ toàn bộ cẩm nang điểm đến và lịch trình chuyến đi vào Local Storage / Cache.',
          'Du khách vẫn tra cứu lộ trình, địa chỉ, lưu ý an toàn khi vào rừng sâu, thác K50 mất sóng.',
          'Tự động đồng bộ ngay khi thiết bị kết nối mạng trở lại.'
        ]
      },
      {
        num: '03',
        title: 'Số Hóa Văn Hóa & Audio Thuyết Minh',
        color: BLUE_DARK,
        points: [
          'Kho dữ liệu chuẩn hóa về di tích lịch sử, danh lam thắng cảnh và lễ hội cồng chiêng.',
          'Thuyết minh Audio Guide sống động và cẩm nang giao tiếp từ vựng Jrai.',
          'Lịch sự kiện lễ hội thời gian thực (Lễ hội hoa dã quỳ, đua thuyền, cồng chiêng).'
        ]
      },
      {
        num: '04',
        title: 'Kết Nối Trực Tiếp Cộng Đồng Bản Địa',
        color: RED_DARK,
        points: [
          'Đặt dịch vụ Homestay, thuê xe máy/ô tô, trải nghiệm tour bản địa dễ dàng.',
          'Phí hoa hồng chỉ 8-10% (tiết kiệm hơn 50% so với OTA ngoại).',
          'Nền tảng Web Responsive đa thiết bị (Mobile, Tablet, Desktop) không tốn bộ nhớ tải app.'
        ]
      }
    ];

    pillars.forEach((item, idx) => {
      const x = 0.8 + idx * 2.18;
      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: 1.45, w: 2.05, h: 3.75,
        fill: { color: WHITE },
        line: { color: item.color, width: 2 },
        rectRadius: 0.12
      });

      // Top number tag
      slide.addShape(pres.ShapeType.rect, {
        x: x, y: 1.45, w: 2.05, h: 0.45,
        fill: { color: item.color }
      });
      slide.addText(`TRỤ CỘT ${item.num}`, {
        x: x, y: 1.45, w: 2.05, h: 0.45,
        fontSize: 11, bold: true, color: WHITE, align: 'center', fontFace: 'Segoe UI'
      });

      slide.addText(item.title, {
        x: x + 0.1, y: 2.0, w: 1.85, h: 0.65,
        fontSize: 12, bold: true, color: BLUE_DARK, align: 'center', fontFace: 'Segoe UI'
      });

      const bullets = item.points.map(pt => ({
        text: `• ${pt}\n\n`,
        options: { fontSize: 9.5, color: TEXT_MAIN }
      }));
      slide.addText(bullets, {
        x: x + 0.1, y: 2.7, w: 1.85, h: 2.35,
        fontFace: 'Segoe UI'
      });
    });
  }

  // ==========================================
  // SLIDE 4: SẢN PHẨM THỰC TẾ - KHÁM PHÁ POI (EXPLORE)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '03. Demo Sản Phẩm', 'Khám Phá Điểm Đến Gia Lai Với Dữ Liệu Bản Địa Chuẩn Hóa', 4);

    // Left description card
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.4, w: 3.2, h: 3.8,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.1
    });

    slide.addText('TÍNH NĂNG KHÁM PHÁ (EXPLORE)', {
      x: 1.0, y: 1.55, w: 2.8, h: 0.3,
      fontSize: 11, bold: true, color: RED_ACCENT, fontFace: 'Segoe UI'
    });
    slide.addText('Trải nghiệm duyệt điểm đến chuẩn xác từng km', {
      x: 1.0, y: 1.85, w: 2.8, h: 0.5,
      fontSize: 14, bold: true, color: BLUE_DARK, fontFace: 'Segoe UI'
    });

    slide.addText([
      { text: '✓ Dữ liệu phong phú: ', options: { bold: true, color: BLUE_PRIMARY } },
      { text: 'Biển Hồ T\'Nưng, Núi lửa Chư Đăng Ya, Thác Phú Cường, Chùa Minh Thành, Thác K50...\n\n' },
      { text: '✓ Bộ lọc đa tầng: ', options: { bold: true, color: BLUE_PRIMARY } },
      { text: 'Lọc theo danh mục (Thiên nhiên, Văn hóa, Ẩm thực), khu vực hành chính (Pleiku, Chư Păh, Kbang...).\n\n' },
      { text: '✓ Thêm nhanh vào chuyến đi: ', options: { bold: true, color: BLUE_PRIMARY } },
      { text: 'Người dùng chỉ cần 1 click để đưa POI yêu thích vào Bản nháp chuyến đi của mình.\n\n' },
      { text: '✓ Web Link: ', options: { bold: true, color: RED_ACCENT } },
      { text: 'gialaitravel.yangkleeserver.io.vn/explore' }
    ], {
      x: 1.0, y: 2.4, w: 2.8, h: 2.6,
      fontSize: 10, fontFace: 'Segoe UI', color: TEXT_MAIN
    });

    // Right screenshots (Grid: Explore + Place Detail)
    const exploreImg = path.join(SCREENSHOT_DIR, '02_explore.png');
    const detailImg = path.join(SCREENSHOT_DIR, '03_place_detail.png');

    if (fs.existsSync(exploreImg)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 4.2, y: 1.4, w: 5.0, h: 1.85,
        fill: { color: WHITE },
        line: { color: BLUE_PRIMARY, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addImage({
        path: exploreImg,
        x: 4.25, y: 1.45, w: 4.9, h: 1.75
      });
    }

    if (fs.existsSync(detailImg)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 4.2, y: 3.35, w: 5.0, h: 1.85,
        fill: { color: WHITE },
        line: { color: RED_ACCENT, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addImage({
        path: detailImg,
        x: 4.25, y: 3.4, w: 4.9, h: 1.75
      });
    }
  }

  // ==========================================
  // SLIDE 5: TRỢ LÝ AI LẬP LỊCH TRÌNH (AI TRIP PLANNER)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '04. Trọng Tâm Công Nghệ', 'Trợ Lý AI Lập Lịch Trình Tự Động Theo Nhu Cầu Thực Tế', 5);

    // Left screenshot: AI Form Modal
    const aiModalImg = path.join(SCREENSHOT_DIR, '05b_ai_form_modal.png');
    const draftImg = path.join(SCREENSHOT_DIR, '05d_trips_with_draft.png');

    if (fs.existsSync(aiModalImg)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 1.4, w: 4.3, h: 3.8,
        fill: { color: WHITE },
        line: { color: BLUE_PRIMARY, width: 1.5 },
        rectRadius: 0.1
      });
      slide.addImage({
        path: aiModalImg,
        x: 0.85, y: 1.45, w: 4.2, h: 3.4
      });
      slide.addText('Giao diện Form tạo lịch trình AI trên website thực tế', {
        x: 0.85, y: 4.88, w: 4.2, h: 0.28,
        fontSize: 9, italic: true, color: TEXT_MUTED, align: 'center', fontFace: 'Segoe UI'
      });
    }

    // Right: Explanation of AI Capabilities & Draft screenshot
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.3, y: 1.4, w: 3.9, h: 3.8,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.1
    });

    slide.addText('ĐIỂM ĐỘT PHÁ CỦA AI GIALAI TRAVEL', {
      x: 5.5, y: 1.55, w: 3.5, h: 0.3,
      fontSize: 11, bold: true, color: RED_ACCENT, fontFace: 'Segoe UI'
    });

    slide.addText([
      { text: '1. Đầu vào thực tế, không lý thuyết:\n', options: { bold: true, color: BLUE_DARK } },
      { text: '• Ngày khởi hành & Số ngày (1 - 7 ngày)\n• Số khách trong đoàn & Ngân sách dự kiến (VND)\n• Phương tiện: Xe máy, Ô tô, Đi bộ khám phá\n• Nhịp độ: Thong thả / Cân bằng / Năng động\n\n' },
      { text: '2. Nhận lệnh ngôn ngữ tự nhiên:\n', options: { bold: true, color: BLUE_DARK } },
      { text: 'Du khách có thể nhắn: "Thích ăn phở hai tô buổi sáng, trưa ngắm hồ T\'Nưng, chiều chụp ảnh hoa dã quỳ..."\n\n' },
      { text: '3. Bản nháp tương tác (Draft Itinerary):\n', options: { bold: true, color: BLUE_DARK } },
      { text: 'Dễ dàng hoán đổi vị trí, thêm bớt điểm dừng, tính toán tổng chi phí và lưu vào tài khoản cá nhân.' }
    ], {
      x: 5.5, y: 1.9, w: 3.5, h: 3.1,
      fontSize: 9.5, fontFace: 'Segoe UI', color: TEXT_MAIN
    });
  }

  // ==========================================
  // SLIDE 6: SỰ KIỆN VĂN HÓA & OFFLINE-READY
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '05. Bản Sắc & Công Nghệ', 'Số Hóa Lễ Hội Văn Hóa & Công Nghệ Offline-First', 6);

    // Left Column: Events Screenshot & Details
    const eventsImg = path.join(SCREENSHOT_DIR, '04_events.png');
    if (fs.existsSync(eventsImg)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 1.4, w: 4.1, h: 2.3,
        fill: { color: WHITE },
        line: { color: RED_ACCENT, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addImage({
        path: eventsImg,
        x: 0.85, y: 1.45, w: 4.0, h: 2.2
      });
    }

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 3.8, w: 4.1, h: 1.4,
      fill: { color: RED_LIGHT },
      line: { color: RED_ACCENT, width: 1 },
      rectRadius: 0.08
    });
    slide.addText('SỰ KIỆN & LỄ HỘI GIA LAI THỜI GIAN THỰC', {
      x: 0.95, y: 3.9, w: 3.8, h: 0.25,
      fontSize: 10, bold: true, color: RED_DARK, fontFace: 'Segoe UI'
    });
    slide.addText('Cập nhật chính xác lịch tổ chức: Tuần lễ Hoa Dã Quỳ Chư Đăng Ya, Lễ hội Cồng Chiêng Tây Nguyên, Đua thuyền độc mộc... Giúp du khách đi đúng mùa hoa, trúng mùa lễ hội.', {
      x: 0.95, y: 4.15, w: 3.8, h: 0.95,
      fontSize: 9.5, color: TEXT_MAIN, fontFace: 'Segoe UI'
    });

    // Right Column: Mobile + Offline Architecture
    const mobileImg = path.join(SCREENSHOT_DIR, 'm_01_home.png');
    if (fs.existsSync(mobileImg)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 5.1, y: 1.4, w: 1.7, h: 3.8,
        fill: { color: WHITE },
        line: { color: BLUE_PRIMARY, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addImage({
        path: mobileImg,
        x: 5.15, y: 1.45, w: 1.6, h: 3.7
      });
    }

    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.0, y: 1.4, w: 2.2, h: 3.8,
      fill: { color: BLUE_LIGHT },
      line: { color: BLUE_PRIMARY, width: 1 },
      rectRadius: 0.08
    });
    slide.addText('OFFLINE-FIRST\nKIẾN TRÚC MẠNH MẼ', {
      x: 7.1, y: 1.55, w: 2.0, h: 0.5,
      fontSize: 11, bold: true, color: BLUE_DARK, fontFace: 'Segoe UI'
    });
    slide.addText([
      { text: '• Lưu cục bộ: ', options: { bold: true, color: BLUE_PRIMARY } },
      { text: 'Toàn bộ điểm đến, số điện thoại khẩn cấp, bản đồ lộ trình lưu sẵn trong trình duyệt.\n\n' },
      { text: '• Mất mạng vẫn chạy: ', options: { bold: true, color: RED_ACCENT } },
      { text: 'Đặc biệt hữu ích tại Thác K50, Rừng Chư Mom Ray, Hang động Chư Bluk khi không có sóng 4G.\n\n' },
      { text: '• Tối ưu Mobile: ', options: { bold: true, color: BLUE_PRIMARY } },
      { text: 'Chuẩn PWA responsive, tốc độ mở trang dưới 1.5s, giao diện mượt mà cảm ứng chạm.' }
    ], {
      x: 7.1, y: 2.15, w: 2.0, h: 2.9,
      fontSize: 9.5, fontFace: 'Segoe UI', color: TEXT_MAIN
    });
  }

  // ==========================================
  // SLIDE 7: HỆ THỐNG QUẢN TRỊ & NỀN TẢNG B2B (ADMIN PLATFORM)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '06. Phân Hệ Quản Trị', 'Nền Tảng Quản Lý Đối Tác, Dữ Liệu & Vận Hành B2B', 7);

    // Left 2 screenshots (Admin Places & Admin Content)
    const adminPlacesImg = path.join(SCREENSHOT_DIR, '13_admin_places_manager.png');
    const adminEventsImg = path.join(SCREENSHOT_DIR, '14_admin_events_manager.png');

    if (fs.existsSync(adminPlacesImg)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 1.4, w: 4.4, h: 1.85,
        fill: { color: WHITE },
        line: { color: BLUE_PRIMARY, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addImage({
        path: adminPlacesImg,
        x: 0.85, y: 1.45, w: 4.3, h: 1.75
      });
    }

    if (fs.existsSync(adminEventsImg)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 3.35, w: 4.4, h: 1.85,
        fill: { color: WHITE },
        line: { color: RED_ACCENT, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addImage({
        path: adminEventsImg,
        x: 0.85, y: 3.4, w: 4.3, h: 1.75
      });
    }

    // Right: Admin & B2B capabilities
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.4, y: 1.4, w: 3.8, h: 3.8,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.1
    });

    slide.addText('HỆ THỐNG VẬN HÀNH TOÀN DIỆN', {
      x: 5.6, y: 1.55, w: 3.4, h: 0.3,
      fontSize: 11, bold: true, color: BLUE_DARK, fontFace: 'Segoe UI'
    });

    slide.addText([
      { text: '1. Quản lý Điểm đến (POI Management):\n', options: { bold: true, color: BLUE_PRIMARY } },
      { text: 'Kiểm duyệt tọa độ GPS, thời gian mở cửa, mức giá, bài viết thuyết minh văn hóa và ảnh bản quyền.\n\n' },
      { text: '2. Quản lý Lễ hội & Sự kiện:\n', options: { bold: true, color: BLUE_PRIMARY } },
      { text: 'Điều phối lịch trình sự kiện địa phương, liên kết địa điểm diễn ra hoạt động văn hóa.\n\n' },
      { text: '3. Quản lý Đặt chỗ & Đối tác (Bookings & B2B):\n', options: { bold: true, color: RED_ACCENT } },
      { text: 'Duyệt yêu cầu đặt dịch vụ homestay/tour, quản lý tồn phòng, đối soát hoa hồng minh bạch 10%.\n\n' },
      { text: '4. Kiểm toán & Phân quyền (Audit & Security):\n', options: { bold: true, color: BLUE_PRIMARY } },
      { text: 'Bảo mật JWT, nhật ký hệ thống ghi lại mọi thao tác thêm/sửa/xóa, an toàn dữ liệu khách hàng.' }
    ], {
      x: 5.6, y: 1.9, w: 3.4, h: 3.1,
      fontSize: 9.5, fontFace: 'Segoe UI', color: TEXT_MAIN
    });
  }

  // ==========================================
  // SLIDE 8: THỊ TRƯỜNG MỤC TIÊU & CHÂN DUNG KHÁCH HÀNG (MARKET)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '07. Thị Trường Mục Tiêu', 'Quy Mô Thị Trường (TAM - SAM - SOM) & Khách Hàng Mục Tiêu', 8);

    // Left Column: 3 Customer Segments
    const segments = [
      {
        badge: 'B2C • GEN Z & MILLENNIALS (60%)',
        color: BLUE_PRIMARY,
        title: 'Khách Du Lịch Trải Nghiệm & Phượt Thủ',
        traits: '• Yêu thích check-in, săn mây, khám phá thiên nhiên hoang sơ.\n• Rất chuộng công nghệ, muốn tự chủ thời gian và ngân sách.\n• Thích các địa điểm mới lạ ít người biết.'
      },
      {
        badge: 'B2C • GIA ĐÌNH & ĐOÀN KHÁCH (30%)',
        color: RED_ACCENT,
        title: 'Du Khách Gia Đình & Nghỉ Dưỡng',
        traits: '• Ưu tiên lịch trình an toàn, nhịp độ thong thả, chỗ ở tiện nghi.\n• Cần thông tin rõ ràng về giá vé, ẩm thực đặc sản phù hợp mọi lứa tuổi.'
      },
      {
        badge: 'B2B • ĐỐI TÁC BẢN ĐỊA (10%)',
        color: BLUE_DARK,
        title: 'Homestay, Nhà Hàng, HDV Bản Địa',
        traits: '• Cần kênh quảng bá số hóa với chi phí hoa hồng thấp.\n• Mong muốn tiếp cận nguồn khách du lịch chất lượng cao, bền vững.'
      }
    ];

    segments.forEach((seg, idx) => {
      const y = 1.4 + idx * 1.25;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: y, w: 4.8, h: 1.15,
        fill: { color: WHITE },
        line: { color: seg.color, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addText(seg.badge, {
        x: 1.0, y: y + 0.08, w: 4.4, h: 0.22,
        fontSize: 8.5, bold: true, color: seg.color, fontFace: 'Segoe UI'
      });
      slide.addText(seg.title, {
        x: 1.0, y: y + 0.3, w: 4.4, h: 0.28,
        fontSize: 11, bold: true, color: BLUE_DARK, fontFace: 'Segoe UI'
      });
      slide.addText(seg.traits, {
        x: 1.0, y: y + 0.58, w: 4.4, h: 0.52,
        fontSize: 8.5, color: TEXT_MUTED, fontFace: 'Segoe UI'
      });
    });

    // Right Column: TAM - SAM - SOM Visual Circles/Boxes
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.8, y: 1.4, w: 3.4, h: 3.8,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.1
    });

    slide.addText('DUNG LƯỢNG THỊ TRƯỜNG', {
      x: 6.0, y: 1.55, w: 3.0, h: 0.3,
      fontSize: 11, bold: true, color: RED_ACCENT, fontFace: 'Segoe UI'
    });

    // TAM
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.0, y: 1.9, w: 3.0, h: 0.9,
      fill: { color: BLUE_LIGHT },
      line: { color: BLUE_PRIMARY, width: 1.2 },
      rectRadius: 0.08
    });
    slide.addText('TAM: 12.000+ TỶ ĐỒNG', {
      x: 6.1, y: 1.95, w: 2.8, h: 0.25,
      fontSize: 11, bold: true, color: BLUE_DARK, fontFace: 'Segoe UI'
    });
    slide.addText('Tổng quy mô thị trường du lịch 5 tỉnh Tây Nguyên (10+ triệu lượt khách/năm)', {
      x: 6.1, y: 2.22, w: 2.8, h: 0.5,
      fontSize: 8.5, color: TEXT_MAIN, fontFace: 'Segoe UI'
    });

    // SAM
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.0, y: 2.9, w: 3.0, h: 0.9,
      fill: { color: RED_LIGHT },
      line: { color: RED_ACCENT, width: 1.2 },
      rectRadius: 0.08
    });
    slide.addText('SAM: 1.800+ TỶ ĐỒNG', {
      x: 6.1, y: 2.95, w: 2.8, h: 0.25,
      fontSize: 11, bold: true, color: RED_DARK, fontFace: 'Segoe UI'
    });
    slide.addText('Quy mô chi tiêu du lịch tự túc tại Gia Lai (1.2+ triệu lượt khách hàng năm)', {
      x: 6.1, y: 3.22, w: 2.8, h: 0.5,
      fontSize: 8.5, color: TEXT_MAIN, fontFace: 'Segoe UI'
    });

    // SOM
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.0, y: 3.9, w: 3.0, h: 1.15,
      fill: { color: BLUE_PRIMARY },
      rectRadius: 0.08
    });
    slide.addText('SOM: 15+ TỶ ĐỒNG / NĂM 1-2', {
      x: 6.1, y: 3.98, w: 2.8, h: 0.25,
      fontSize: 11, bold: true, color: WHITE, fontFace: 'Segoe UI'
    });
    slide.addText('Mục tiêu chiếm lĩnh 10-15% thị phần khách du lịch số tại Gia Lai (150.000 người dùng thường xuyên, 20.000 giao dịch dịch vụ)', {
      x: 6.1, y: 4.25, w: 2.8, h: 0.72,
      fontSize: 8.5, color: 'E2E8F0', fontFace: 'Segoe UI'
    });
  }

  // ==========================================
  // SLIDE 9: MÔ HÌNH KINH DOANH & DOANH THU (BUSINESS MODEL)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '08. Mô Hình Kinh Doanh', 'Mô Hình Đa Dòng Doanh Thu Bền Vững (B2C & B2B & B2G)', 9);

    const streams = [
      {
        tag: 'DÒNG THU 1 • B2C',
        color: BLUE_PRIMARY,
        title: 'Gói Hội Viên Cao Cấp (Premium Subscription)',
        price: '49.000đ/tháng hoặc 199.000đ/năm',
        desc: '• Tải bản đồ offline không giới hạn.\n• Thuyết minh Audio Guide cao cấp.\n• Không quảng cáo, nhận voucher giảm giá 5-10% tại hệ sinh thái đối tác.\n• Hỗ trợ tạo lịch trình AI chuyên sâu không giới hạn.'
      },
      {
        tag: 'DÒNG THU 2 • B2C/B2B',
        color: RED_ACCENT,
        title: 'Phí Hoa Hồng Đặt Dịch Vụ (Take-rate)',
        price: '8% - 10% trên mỗi giao dịch thành công',
        desc: '• Thu trên đơn đặt phòng Homestay, thuê xe máy/ô tô tự lái, tour trải nghiệm bản địa.\n• Thấp hơn đáng kể so với 18-25% của Booking/Agoda, tạo động lực liên kết mạnh từ cộng đồng kinh doanh Gia Lai.'
      },
      {
        tag: 'DÒNG THU 3 • B2B',
        color: BLUE_DARK,
        title: 'Gói Đối Tác & Quảng Cáo Bản Địa (Sponsored)',
        price: '500.000đ - 2.000.000đ / tháng / đối tác',
        desc: '• Hiển thị ưu tiên (Featured POI) trên trang Khám phá & Gợi ý lộ trình AI.\n• Gói công cụ quản trị dành riêng cho chủ homestay và quán ăn đặc sản Gia Lai.'
      },
      {
        tag: 'DÒNG THU 4 • B2G',
        color: RED_DARK,
        title: 'Báo Cáo Phân Tích Dữ Liệu Du Lịch (Insights)',
        price: 'Hợp đồng dự án / Định kỳ hàng quý',
        desc: '• Báo cáo tổng hợp xu hướng luồng du khách, mật độ POI, thị hiếu chi tiêu phục vụ Sở Du lịch & các cơ quan xúc tiến phát triển du lịch địa phương.'
      }
    ];

    streams.forEach((st, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.8 + col * 4.3;
      const y = 1.4 + row * 1.95;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 4.15, h: 1.82,
        fill: { color: WHITE },
        line: { color: st.color, width: 1.5 },
        rectRadius: 0.1
      });

      slide.addShape(pres.ShapeType.rect, {
        x: x + 0.15, y: y + 0.12, w: 1.6, h: 0.25,
        fill: { color: st.color }
      });
      slide.addText(st.tag, {
        x: x + 0.15, y: y + 0.12, w: 1.6, h: 0.25,
        fontSize: 8.5, bold: true, color: WHITE, align: 'center', fontFace: 'Segoe UI'
      });

      slide.addText(st.title, {
        x: x + 0.15, y: y + 0.42, w: 3.85, h: 0.35,
        fontSize: 11.5, bold: true, color: BLUE_DARK, fontFace: 'Segoe UI'
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.15, y: y + 0.78, w: 3.85, h: 0.26,
        fill: { color: CARD_BG },
        rectRadius: 0.05
      });
      slide.addText(`Mức giá: ${st.price}`, {
        x: x + 0.2, y: y + 0.78, w: 3.75, h: 0.26,
        fontSize: 9, bold: true, color: RED_ACCENT, fontFace: 'Segoe UI'
      });

      slide.addText(st.desc, {
        x: x + 0.15, y: y + 1.08, w: 3.85, h: 0.68,
        fontSize: 8.5, color: TEXT_MAIN, fontFace: 'Segoe UI'
      });
    });
  }

  // ==========================================
  // SLIDE 10: LỢI THẾ CẠNH TRANH (COMPETITIVE ADVANTAGE)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '09. Lợi Thế Cạnh Tranh', 'Ma Trận So Sánh Điểm Vượt Trội Của GiaLai Travel', 10);

    // Comparison Table Header
    const tableData = [
      [
        { text: 'Tiêu Chí So Sánh', options: { bold: true, fill: BLUE_DARK, color: WHITE, align: 'center' } },
        { text: 'Google Maps', options: { bold: true, fill: '64748B', color: WHITE, align: 'center' } },
        { text: 'OTA Quốc Tế\n(Booking/Traveloka)', options: { bold: true, fill: '64748B', color: WHITE, align: 'center' } },
        { text: 'GiaLai Travel\n(Dự Án Khởi Nghiệp)', options: { bold: true, fill: RED_ACCENT, color: WHITE, align: 'center' } }
      ],
      [
        { text: 'Độ sâu dữ liệu bản địa\n(Hyper-local data)', options: { bold: true } },
        { text: 'Trung bình\n(Dữ liệu chung toàn cầu)' },
        { text: 'Thấp\n(Chỉ tập trung khách sạn lớn)' },
        { text: 'Rất cao ★★★\n(Đầy đủ POI nhỏ, quán ăn địa phương, bản làng, mùa hoa)', options: { bold: true, color: RED_ACCENT } }
      ],
      [
        { text: 'Lập lịch trình bằng AI\n(Smart Itinerary)', options: { bold: true } },
        { text: 'Không có\n(Chỉ chỉ đường từng chặng)' },
        { text: 'Không có\n(Chỉ đặt dịch vụ riêng lẻ)' },
        { text: 'AI chuyên biệt ★★★\n(Tối ưu ngân sách, số người, sở thích và nhịp độ)', options: { bold: true, color: RED_ACCENT } }
      ],
      [
        { text: 'Chế độ hoạt động Ngoại tuyến\n(Offline-First)', options: { bold: true } },
        { text: 'Hạn chế\n(Tải map nặng, không có cẩm nang)' },
        { text: 'Không hoạt động\n(Bắt buộc có internet)' },
        { text: 'Hoạt động toàn diện ★★★\n(Lưu cẩm nang & lịch trình ngay trên web)', options: { bold: true, color: RED_ACCENT } }
      ],
      [
        { text: 'Văn hóa & Audio Guide\n(Cultural Heritage)', options: { bold: true } },
        { text: 'Không có' },
        { text: 'Không có' },
        { text: 'Thuyết minh bản địa ★★★\n(Di sản cồng chiêng, từ vựng Jrai, lịch lễ hội)', options: { bold: true, color: RED_ACCENT } }
      ],
      [
        { text: 'Chi phí hoa hồng dịch vụ\n(Commission rate)', options: { bold: true } },
        { text: 'Không áp dụng' },
        { text: 'Rất cao (18% - 25%)' },
        { text: 'Hợp lý (8% - 10%) ★★★\n(Bảo vệ lợi nhuận đối tác bản địa)', options: { bold: true, color: RED_ACCENT } }
      ]
    ];

    slide.addTable(tableData, {
      x: 0.8, y: 1.45, w: 8.4, h: 3.65,
      colW: [2.1, 1.9, 2.1, 2.3],
      fontSize: 9.5,
      fontFace: 'Segoe UI',
      border: { pt: 1, color: 'CBD5E1' },
      align: 'left',
      valign: 'middle'
    });
  }

  // ==========================================
  // SLIDE 11: LỘ TRÌNH PHÁT TRIỂN (ROADMAP)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '10. Lộ Trình Phát Triển', 'Kế Hoạch Triển Khai 3 Giai Đoạn (2026 - 2028)', 11);

    const phases = [
      {
        phase: 'GIAI ĐOẠN 1 (ĐÃ ĐẠT ĐƯỢC)',
        time: 'Năm 2026 (Hiện tại)',
        color: BLUE_PRIMARY,
        status: '✅ ĐÃ HOÀN THÀNH & DEMO LIVE',
        items: [
          'Ra mắt Web Responsive chạy live trên gialaitravel.yangkleeserver.io.vn.',
          'Số hóa 50+ điểm đến tiêu biểu tại Pleiku, Chư Păh, Kbang...',
          'Tích hợp Trợ lý AI lập lịch trình cá nhân hóa v1.',
          'Hoàn thiện cơ chế Offline cơ bản lưu trữ Local Storage.',
          'Hệ thống quản trị Content Management & bảo mật tài khoản JWT.'
        ]
      },
      {
        phase: 'GIAI ĐOẠN 2 (MỞ RỘNG & TĂNG TRƯỞNG)',
        time: 'Nửa cuối 2026 - 2027',
        color: RED_ACCENT,
        status: '🚀 KẾ HOẠCH BỨC PHÁ',
        items: [
          'Ra mắt cổng tự phục vụ dành cho Đối tác bản địa (Partner Portal).',
          'Nâng cấp Audio Guide đa ngôn ngữ: Tiếng Anh, Tiếng Hàn, Tiếng Trung.',
          'Tích hợp thanh toán trực tuyến chính thức (VNPAY, MoMo, VietQR).',
          'Triển khai gói Premium 49k/tháng và hợp tác 100+ Homestay địa phương.',
          'Chiến dịch Marketing quảng bá du lịch Gia Lai trên TikTok & Facebook.'
        ]
      },
      {
        phase: 'GIAI ĐOẠN 3 (LIÊN KẾT VÙNG)',
        time: 'Năm 2027 - 2028',
        color: BLUE_DARK,
        status: '🌟 TẦM NHÌN DÀI HẠN',
        items: [
          'Mở rộng tuyến du lịch liên tỉnh Tây Nguyên: Gia Lai - Măng Đen (Kon Tum) - Đắk Lắk.',
          'Ký kết hợp tác chiến lược B2G với Sở Du Lịch tỉnh Gia Lai.',
          'Ứng dụng AI Chatbot chuyên sâu phân tích thời tiết và dự báo mật độ du khách.',
          'Đạt mốc 500.000 người dùng tích cực và trở thành ứng dụng du lịch số số 1 Tây Nguyên.'
        ]
      }
    ];

    phases.forEach((ph, idx) => {
      const x = 0.8 + idx * 2.85;
      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: 1.45, w: 2.7, h: 3.75,
        fill: { color: WHITE },
        line: { color: ph.color, width: 2 },
        rectRadius: 0.12
      });

      slide.addShape(pres.ShapeType.rect, {
        x: x, y: 1.45, w: 2.7, h: 0.5,
        fill: { color: ph.color }
      });
      slide.addText(ph.phase, {
        x: x, y: 1.45, w: 2.7, h: 0.28,
        fontSize: 9.5, bold: true, color: WHITE, align: 'center', fontFace: 'Segoe UI'
      });
      slide.addText(ph.time, {
        x: x, y: 1.7, w: 2.7, h: 0.22,
        fontSize: 8.5, color: 'E2E8F0', align: 'center', fontFace: 'Segoe UI'
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.1, y: 2.05, w: 2.5, h: 0.32,
        fill: { color: CARD_BG },
        line: { color: ph.color, width: 1 },
        rectRadius: 0.05
      });
      slide.addText(ph.status, {
        x: x + 0.1, y: 2.05, w: 2.5, h: 0.32,
        fontSize: 8.5, bold: true, color: ph.color, align: 'center', fontFace: 'Segoe UI'
      });

      const bullets = ph.items.map(it => ({
        text: `• ${it}\n\n`,
        options: { fontSize: 9, color: TEXT_MAIN }
      }));
      slide.addText(bullets, {
        x: x + 0.15, y: 2.45, w: 2.4, h: 2.65,
        fontFace: 'Segoe UI'
      });
    });
  }

  // ==========================================
  // SLIDE 12: ĐỘI NGŨ & KÊU GỌI HỢP TÁC (TEAM & CALL TO ACTION)
  // ==========================================
  {
    const slide = pres.addSlide();
    addSlideHeader(slide, '11. Đội Ngũ & Kêu Gọi Hợp Tác', 'Khát Vọng Nâng Tầm Du Lịch Tây Nguyên Cùng GiaLai Travel', 12);

    // Left Box: Vision & Team
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.4, w: 4.1, h: 3.8,
      fill: { color: BLUE_LIGHT },
      line: { color: BLUE_PRIMARY, width: 1.5 },
      rectRadius: 0.1
    });

    slide.addText('SỨ MỆNH & ĐỘI NGŨ SÁNG LẬP', {
      x: 1.0, y: 1.55, w: 3.7, h: 0.3,
      fontSize: 11, bold: true, color: BLUE_DARK, fontFace: 'Segoe UI'
    });

    slide.addText('“Mang công nghệ số phụng sự quê hương, biến vẻ đẹp hoang sơ của Gia Lai thành điểm đến thông minh hàng đầu Việt Nam.”', {
      x: 1.0, y: 1.85, w: 3.7, h: 0.7,
      fontSize: 11, italic: true, bold: true, color: RED_ACCENT, fontFace: 'Segoe UI'
    });

    slide.addText([
      { text: '• Trưởng nhóm & Lập trình chính: ', options: { bold: true, color: BLUE_DARK } },
      { text: 'YangKlee (Dương Khánh) - Quản trị và kiến trúc hệ thống Full-stack BE/FE.\n\n' },
      { text: '• Thế mạnh đội ngũ: ', options: { bold: true, color: BLUE_DARK } },
      { text: 'Am hiểu sâu sắc văn hóa Tây Nguyên, thành thạo công nghệ Web hiện đại, Trí tuệ nhân tạo (AI) và Kiến trúc Offline-First.\n\n' },
      { text: '• Tinh thần: ', options: { bold: true, color: BLUE_DARK } },
      { text: 'Nhiệt huyết của người trẻ đam mê khởi nghiệp sáng tạo, sẵn sàng học hỏi và cam kết triển khai tới cùng.' }
    ], {
      x: 1.0, y: 2.6, w: 3.7, h: 2.4,
      fontSize: 9.5, fontFace: 'Segoe UI', color: TEXT_MAIN
    });

    // Right Box: The Ask / Call to Action
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.1, y: 1.4, w: 4.1, h: 3.8,
      fill: { color: WHITE },
      line: { color: RED_ACCENT, width: 2 },
      rectRadius: 0.1
    });

    slide.addText('KÊU GỌI HỢP TÁC & ĐỒNG HÀNH', {
      x: 5.3, y: 1.55, w: 3.7, h: 0.3,
      fontSize: 11, bold: true, color: RED_DARK, fontFace: 'Segoe UI'
    });

    slide.addText([
      { text: '1. Tìm kiếm Cố vấn & Vốn Hạt Giống (Seed Round):\n', options: { bold: true, color: RED_ACCENT } },
      { text: 'Quy mô kêu gọi 200 - 500 triệu VND phục vụ chi phí mở rộng máy chủ, sản xuất kho nội dung số bản địa và đẩy mạnh truyền thông.\n\n' },
      { text: '2. Hợp tác Đối tác Doanh nghiệp Địa phương:\n', options: { bold: true, color: BLUE_DARK } },
      { text: 'Chào đón các khách sạn, homestay, quán cà phê, đơn vị cho thuê xe tại Gia Lai tham gia thử nghiệm miễn phí hệ thống.\n\n' },
      { text: '3. Đồng hành cùng Cơ quan Quản lý Nhà nước:\n', options: { bold: true, color: BLUE_DARK } },
      { text: 'Sẵn sàng kết nối chia sẻ dữ liệu và giải pháp thúc đẩy Chuyển đổi số Du lịch tỉnh Gia Lai.' }
    ], {
      x: 5.3, y: 1.9, w: 3.7, h: 2.3,
      fontSize: 9.5, fontFace: 'Segoe UI', color: TEXT_MAIN
    });

    // Contact button / badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.3, y: 4.25, w: 3.7, h: 0.8,
      fill: { color: BLUE_DARK },
      rectRadius: 0.08
    });
    slide.addText('LIÊN HỆ & TRẢI NGHIỆM TRỰC TIẾP\n🌐 gialaitravel.yangkleeserver.io.vn\n✉ khanhduong18072005@gmail.com', {
      x: 5.3, y: 4.25, w: 3.7, h: 0.8,
      fontSize: 9.5, bold: true, color: WHITE, align: 'center', fontFace: 'Segoe UI'
    });
  }

  // Save the PPTX file
  const outputPath = path.join(__dirname, '..', 'slides', 'GiaLai_Travel_Pitch_Deck.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log('PowerPoint presentation generated at:', outputPath);
}

createPitchDeck().catch(console.error);
