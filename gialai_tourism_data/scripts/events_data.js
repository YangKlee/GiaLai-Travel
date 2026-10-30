/**
 * Dữ liệu 12 Sự kiện & Lễ hội tiêu biểu Gia Lai (Events Dataset)
 * Nguồn: Cổng TTĐT Tỉnh Gia Lai, Sở Văn hóa Thể thao và Du lịch Gia Lai, Báo Gia Lai.
 */

export const eventsData = [
  {
    slug: 'festival-van-hoa-cong-chieng-tay-nguyen',
    id: '40000000-0000-4000-8000-000000000001',
    contentId: '40000000-0000-4000-8000-000000000001',
    revisionId: '41000000-0000-4000-8000-000000000001',
    placeId: '30000000-0000-4000-8000-000000000005', // Quảng trường Đại Đoàn Kết
    title: 'Festival Tinh hoa Văn hóa Cồng chiêng Tây Nguyên',
    startsAt: '2026-11-10 01:00:00.000000', // UTC tương đương 08:00 AM VN
    endsAt: '2026-11-15 15:00:00.000000',   // UTC tương đương 22:00 PM VN
    eventStatus: 'SCHEDULED',
    locationName: 'Quảng trường Đại Đoàn Kết, TP. Pleiku, Tỉnh Gia Lai',
    frequency: 'Định kỳ 2 năm một lần (Thường tổ chức vào trung tuần tháng 11)',
    summary: 'Sự kiện văn hóa quy mô quốc tế tôn vinh Không gian văn hóa cồng chiêng Tây Nguyên - Kiệt tác truyền khẩu và Di sản văn hóa phi vật thể của nhân loại được UNESCO công nhận.',
    sections: [
      {
        title: 'Tôn vinh di sản văn hóa phi vật thể nhân loại',
        content: `Không gian văn hóa cồng chiêng Tây Nguyên trải rộng trên 5 tỉnh Kon Tum, Gia Lai, Đắk Lắk, Đắk Nông và Lâm Đồng. Festival là ngày hội lớn tụ hội hàng ngàn nghệ nhân, diễn viên dân gian của các dân tộc Ba Na, Jrai, Ê Đê, M’Nông, Xơ Đăng... về mảnh đất Gia Lai để phô diễn những thanh âm vang vọng của núi rừng.`
      },
      {
        title: 'Các nghi lễ và hoạt động đặc sắc trong Festival',
        content: `Festival diễn ra với chuỗi hoạt động phong phú: Lễ hội đường phố với các đoàn nghệ nhân diễu hành vừa đi vừa hòa tấu cồng chiêng, múa xoang nhịp nhàng; Hội thi tạc tượng gỗ dân gian Tây Nguyên; Trình diễn dệt thổ cẩm thủ công truyền thống; Tái hiện các nghi lễ cúng mừng lúa mới, lễ cúng nhà Rông mới và không gian thưởng thức rượu cần, ẩm thực ẩm thực cơm lam gà nướng thơm nồng.`
      },
      {
        title: 'Cẩm nang dành cho du khách',
        content: `Festival mở cửa tự do phục vụ nhân dân và du khách thập phương. Du khách nên đặt phòng khách sạn tại Pleiku trước 2-3 tuần do lượng khách đổ về rất đông trong những ngày diễn ra lễ hội.`
      }
    ],
    source: 'Sở Văn hóa, Thể thao và Du lịch Gia Lai & Báo Gia Lai'
  },
  {
    slug: 'tuan-le-hoa-da-quy-chu-dang-ya',
    id: '40000000-0000-4000-8000-000000000002',
    contentId: '40000000-0000-4000-8000-000000000002',
    revisionId: '41000000-0000-4000-8000-000000000002',
    placeId: '30000000-0000-4000-8000-000000000002', // Núi lửa Chư Đang Ya
    title: 'Tuần lễ Hoa Dã Quỳ - Núi lửa Chư Đang Ya',
    startsAt: '2026-11-06 01:00:00.000000',
    endsAt: '2026-11-12 11:00:00.000000',
    eventStatus: 'SCHEDULED',
    locationName: 'Làng Ploi lagri, Xã Chư Đang Ya, Huyện Chư Păh, Tỉnh Gia Lai',
    frequency: 'Thường niên hàng năm vào tháng 11',
    summary: 'Lễ hội du lịch thiên nhiên và văn hóa đặc sắc bậc nhất Gia Lai khi hoa dã quỳ nở vàng rực rỡ khắp miệng núi lửa triệu năm tuổi Chư Đang Ya.',
    sections: [
      {
        title: 'Mùa hoa vàng rực rỡ trên miệng núi lửa',
        content: `Hàng năm vào tháng 11, khi những cơn mưa dầm Tây Nguyên vừa dứt, khắp các triền đồi, lối mòn và sườn núi lửa Chư Đang Ya lại được bao phủ bởi sắc vàng rực của hoa dã quỳ dại. Tuần lễ hoa dã quỳ là sản phẩm du lịch thương hiệu nổi tiếng thu hút đông đảo bạn trẻ và du khách cả nước.`
      },
      {
        title: 'Nhiều hoạt động trải nghiệm văn hóa & Thể thao hấp dẫn',
        content: `Trong tuần lễ diễn ra các sự kiện: Bay dù lượn ngắm toàn cảnh miệng núi lửa từ tầng không trung; Hội thi giã gạo truyền thống, đan lát gùi tre; Các trò chơi dân gian như đi cà kheo, đẩy gậy, kéo co; Hội thi ẩm thực giới thiệu các món ăn đặc trưng của đồng bào Jrai.`
      },
      {
        title: 'Kinh nghiệm tham gia lễ hội',
        content: `Du khách nên đi vào sáng sớm từ 7h - 9h để đón ánh bình minh dịu ngọt trên hoa dã quỳ và chụp được những bức hình check-in ưng ý nhất. Hãy chuẩn bị kem chống nắng, mũ nón và giày thể thao thoải mái.`
      }
    ],
    source: 'UBND Huyện Chư Păh & Cổng TTĐT Tỉnh Gia Lai'
  },
  {
    slug: 'le-hoi-cau-mua-vua-lua-plei-oi',
    id: '40000000-0000-4000-8000-000000000003',
    contentId: '40000000-0000-4000-8000-000000000003',
    revisionId: '41000000-0000-4000-8000-000000000003',
    placeId: '30000000-0000-4000-8000-000000000015', // Di tích Plei Ơi
    title: 'Lễ hội Cầu Mưa Yang Pơtao Apui (Lễ Cầu Mưa Vua Lửa)',
    startsAt: '2026-05-15 01:00:00.000000',
    endsAt: '2026-05-16 11:00:00.000000',
    eventStatus: 'SCHEDULED',
    locationName: 'Di tích Lịch sử Quốc gia Plei Ơi, Xã Ayun Hạ, Huyện Phú Thiện, Tỉnh Gia Lai',
    frequency: 'Thường niên vào trung tuần tháng 4 âm lịch',
    summary: 'Nghi lễ tín ngưỡng nông nghiệp cổ xưa huyền bí của đồng bào Jrai, Di sản văn hóa phi vật thể quốc gia cầu xin thần linh ban mưa thuận gió hòa, mùa màng bội thu.',
    sections: [
      {
        title: 'Nghi lễ nông nghiệp huyền bí của người Jrai',
        content: `Lễ Cầu mưa của Vua Lửa (Yang Pơtao Apui) phản ánh triết lý nhân sinh gắn bó mật thiết giữa con người và tự nhiên. Nghi lễ được tổ chức tại khu nhà chòi thiêng của làng Plei Ơi nhằm cầu xin các đấng Yang (thần linh) ban mưa mát cho cỏ cây đâm chồi, xua tan khô hạn của vùng thung lũng sông Ba.`
      },
      {
        title: 'Các nghi thức cổ truyền',
        content: `Lễ vật hiến tế gồm một con heo thiến, ghè rượu cần, gạo nếp và trầu cau. Người phụ tá (thầy cúng kế vị) tiến hành đọc bài cúng thần gươm thiêng, thần rừng, thần núi, cầu xin nước trời rơi xuống. Sau phần nghi lễ trang trọng là phần hội rộn ràng tiếng chiêng vang dội và điệu múa xoang của các chàng trai cô gái Jrai.`
      }
    ],
    source: 'Cục Di sản Văn hóa & Sở VHTTDL Gia Lai'
  },
  {
    slug: 'hoi-dua-thuyen-doc-moc-song-po-co',
    id: '40000000-0000-4000-8000-000000000004',
    contentId: '40000000-0000-4000-8000-000000000004',
    revisionId: '41000000-0000-4000-8000-000000000004',
    placeId: '30000000-0000-4000-8000-000000000017', // Lòng hồ Sê San 4 & Sông Pô Cô
    title: 'Hội Đua Thuyền Độc Mộc trên Sông Pô Cô (Cúp A Sanh)',
    startsAt: '2026-11-20 01:00:00.000000',
    endsAt: '2026-11-22 10:00:00.000000',
    eventStatus: 'SCHEDULED',
    locationName: 'Bến đò A Sanh, Làng Dăng, Xã Ia O, Huyện Ia Grai, Tỉnh Gia Lai',
    frequency: 'Thường niên hàng năm vào tháng 11',
    summary: 'Hội đua thuyền thể thao sông nước truyền thống độc đáo bậc nhất Tây Nguyên, tái hiện hào khí người lái đò A Sanh kiên cường chèo thuyền độc mộc qua dòng Pô Cô.',
    sections: [
      {
        title: 'Hào khí anh hùng trên dòng sông Pô Cô',
        content: `Thuyền độc mộc là phương tiện di chuyển lâu đời được đục rỗng từ một thân cây gỗ nguyên khối của đồng bào Jrai ven sông Pô Cô. Hội đua thuyền độc mộc tranh cúp A Sanh là sự kiện tôn vinh tinh thần kiên cường, quả cảm của người dân biên cương và tri ân người anh hùng lái đò A Sanh huyền thoại.`
      },
      {
        title: 'Các chặng đua kịch tính & Liên hoan cồng chiêng',
        content: `Các đội thuyền thi đấu nội dung đôi nam chèo cự ly 1.000m trên mặt sông xanh biếc. Tiếng reo hò cổ vũ, tiếng cồng chiêng rộn rã bên bờ sông tạo nên bầu không khí lễ hội sôi động náo nhiệt chưa từng có.`
      }
    ],
    source: 'UBND Huyện Ia Grai & Báo Gia Lai'
  },
  {
    slug: 'giai-chay-gia-lai-city-trail',
    id: '40000000-0000-4000-8000-000000000005',
    contentId: '40000000-0000-4000-8000-000000000005',
    revisionId: '41000000-0000-4000-8000-000000000005',
    placeId: '30000000-0000-4000-8000-000000000001', // Biển Hồ Pleiku
    title: 'Giải chạy Gia Lai City Trail - Giấc mơ đại ngàn',
    startsAt: '2026-11-14 21:00:00.000000', // Khởi hành 4:00 AM VN ngày 15/11
    endsAt: '2026-11-15 10:00:00.000000',
    eventStatus: 'SCHEDULED',
    locationName: 'Thành phố Pleiku và Huyện Chư Păh, Tỉnh Gia Lai',
    frequency: 'Thường niên vào trung tuần tháng 11',
    summary: 'Giải chạy marathon kết hợp đường mòn trail quy mô quốc gia thu hút hơn 5.000 vận động viên trong và ngoài nước chinh phục các danh thắng tuyệt đẹp của Gia Lai.',
    sections: [
      {
        title: 'Cung đường chạy đẹp nhất Tây Nguyên',
        content: `Gia Lai City Trail đưa các runner trải nghiệm những cung đường mộng mơ: chạy xuyên qua hai hàng thông trăm tuổi, bạt ngàn nương chè xanh Biển Hồ Chè, ngắm nhìn bình minh trên Biển Hồ T’Nưng và uốn lượn dưới chân núi lửa Chư Đang Ya.`
      },
      {
        title: 'Các cự ly thi đấu đa dạng',
        content: `Giải gồm 4 cự ly: 42km (Full Marathon), 21km (Half Marathon), 10km và 5km phù hợp cho cả vận động viên chuyên nghiệp lẫn người chạy phong trào và gia đình.`
      }
    ],
    source: 'UBND TP. Pleiku & Ban Tổ chức Gia Lai City Trail'
  },
  {
    slug: 'le-mung-lua-moi-yang-sa',
    id: '40000000-0000-4000-8000-000000000006',
    contentId: '40000000-0000-4000-8000-000000000006',
    revisionId: '41000000-0000-4000-8000-000000000006',
    placeId: '30000000-0000-4000-8000-000000000028', // Làng Plei Ốp
    title: 'Lễ Mừng Lúa Mới (Yang Sa) của đồng bào Jrai & Ba Na',
    startsAt: '2026-12-20 01:00:00.000000',
    endsAt: '2026-12-22 15:00:00.000000',
    eventStatus: 'SCHEDULED',
    locationName: 'Làng Văn hóa Du lịch Plei Ốp, Phường Hoa Lư, TP. Pleiku, Tỉnh Gia Lai',
    frequency: 'Hàng năm vào dịp kết thúc vụ thu hoạch lúa rẫy (Tháng 12 đến tháng 1)',
    summary: 'Nghi lễ tạ ơn Giàng (Trời) và Hồn Lúa đã ban cho buôn làng một vụ mùa ấm no, đánh dấu thời khắc nông nhàn sum họp rượu cần và hòa tấu cồng chiêng rộn rã.',
    sections: [
      {
        title: 'Ý nghĩa văn hóa tâm linh',
        content: `Lễ Mừng Lúa Mới (Yang Sa trong tiếng Jrai, Bơ Mâu trong tiếng Ba Na) là một trong những lễ hội nông nghiệp quan trọng nhất trong chu kỳ canh tác nương rẫy của người Tây Nguyên. Buôn làng làm lễ rước Hồn Lúa từ rẫy về kho thóc để tạ ơn thần linh che chở cho lúa trĩu bông, không bị chim chóc sâu bọ phá hoại.`
      },
      {
        title: 'Không khí lễ hội tại buôn làng',
        content: `Mỗi gia đình đều mang ché rượu cần thơm ngon nhất, gùi nếp mới và thịt heo nướng ra nhà Rông cùng nhau cúng thần và chia sẻ niềm vui được mùa. Mọi người cùng nắm tay nhau múa xoang vòng quanh đống lửa thâu đêm suốt sáng.`
      }
    ],
    source: 'Sở VHTTDL Tỉnh Gia Lai'
  },
  {
    slug: 'le-bo-ma-po-thi-tay-nguyen',
    id: '40000000-0000-4000-8000-000000000007',
    contentId: '40000000-0000-4000-8000-000000000007',
    revisionId: '41000000-0000-4000-8000-000000000007',
    placeId: '30000000-0000-4000-8000-000000000014', // Làng Stơr Kbang
    title: 'Lễ Bỏ Mả (Pơ Thi) - Huyền thoại tiễn đưa linh hồn',
    startsAt: '2026-03-10 01:00:00.000000',
    endsAt: '2026-03-13 14:00:00.000000',
    eventStatus: 'SCHEDULED',
    locationName: 'Các buôn làng dân tộc Jrai và Ba Na, Tỉnh Gia Lai',
    frequency: 'Mùa Ninh Nơng (Mùa nông nhàn từ tháng 1 đến tháng 3 âm lịch)',
    summary: 'Đại lễ hội tâm linh lớn nhất đời người của các dân tộc Tây Nguyên, tiễn biệt vĩnh viễn linh hồn người quá cố về thế giới tổ tiên để bước vào kiếp sống mới.',
    sections: [
      {
        title: 'Triết lý nhân sinh độc đáo',
        content: `Người Tây Nguyên quan niệm cái chết chưa phải là sự chấm dứt. Trước lễ Bỏ Mả, người sống vẫn thường xuyên mang cơm nước ra mộ chăm sóc người mất. Chỉ sau lễ Pơ Thi, mối liên hệ giữa người sống và người chết mới hoàn toàn chấm dứt, linh hồn được siêu thoát để đầu thai.`
      },
      {
        title: 'Nghệ thuật kiến trúc nhà mồ & Tượng gỗ dân gian',
        content: `Để chuẩn bị lễ Pơ Thi, cả gia tộc và buôn làng cùng dựng một ngôi nhà mồ mới chạm khắc hoa văn tinh xảo, tạc những bức tượng gỗ sinh động (tượng người phụ nữ mang thai, tượng người đàn ông trầm tư, tượng thú rừng...). Lễ hội kéo dài 3 - 4 ngày với âm thanh cồng chiêng ngân vang không ngớt.`
      }
    ],
    source: 'Bảo tàng Tỉnh Gia Lai & Viện Nghiên cứu Văn hóa Dân gian'
  },
  {
    slug: 'hoi-cau-hue-an-khe',
    id: '40000000-0000-4000-8000-000000000008',
    contentId: '40000000-0000-4000-8000-000000000008',
    revisionId: '41000000-0000-4000-8000-000000000008',
    placeId: '30000000-0000-4000-8000-000000000009', // Quần thể di tích Tây Sơn Thượng Đạo
    title: 'Hội Cầu Huê & Kỷ niệm Khởi nghĩa Tây Sơn Thượng Đạo',
    startsAt: '2026-02-20 01:00:00.000000', // Mùng 4 Tết âm lịch
    endsAt: '2026-02-22 11:00:00.000000',
    eventStatus: 'SCHEDULED',
    locationName: 'Đình An Lũy (An Khê Đình), Thị xã An Khê, Tỉnh Gia Lai',
    frequency: 'Mùng 4 đến mùng 6 tháng Giêng âm lịch hàng năm',
    summary: 'Lễ hội truyền thống độc đáo ghi dấu phiên chợ đầu xuân Cầu Huê của người Kinh và đồng bào Thượng, kết hợp kỷ niệm chiến thắng Ngọc Hồi - Đống Đa hào hùng.',
    sections: [
      {
        title: 'Phiên chợ phiên đầu xuân của nghĩa quân Tây Sơn',
        content: `Hội Cầu Huê xưa kia là nơi người Kinh vùng đồng bằng lên giao thương buôn bán muối mắm, đồ kim loại với lâm thổ sản của đồng bào Ba Na vùng Tây Sơn Thượng Đạo, đồng thời là dịp để nghĩa quân Tây Sơn chiêu mộ hào kiệt.`
      },
      {
        title: 'Nghi lễ tế tiền hiền & Hội thi võ cổ truyền',
        content: `Lễ hội bắt đầu bằng nghi thức rước sắc lệnh, tế tiền hiền tại Đình An Lũy, tái hiện cảnh xuất quân đánh giặc cứu nước của ba anh em Tây Sơn, tiếp nối là các màn múa cờ, biểu diễn võ thuật cổ truyền Bình Định - Tây Sơn và trò chơi dân gian rộn ràng.`
      }
    ],
    source: 'UBND Thị xã An Khê & Báo Gia Lai'
  },
  {
    slug: 'le-hoi-ca-phe-am-thuc-cao-nguyen-pleiku',
    id: '40000000-0000-4000-8000-000000000009',
    contentId: '40000000-0000-4000-8000-000000000009',
    revisionId: '41000000-0000-4000-8000-000000000009',
    placeId: '30000000-0000-4000-8000-000000000005', // Quảng trường Đại Đoàn Kết
    title: 'Lễ hội Cà phê và Ẩm thực Đường phố Cao nguyên Pleiku',
    startsAt: '2026-04-29 01:00:00.000000',
    endsAt: '2026-05-03 15:00:00.000000',
    eventStatus: 'SCHEDULED',
    locationName: 'Quảng trường Đại Đoàn Kết, Thành phố Pleiku, Tỉnh Gia Lai',
    frequency: 'Dịp nghỉ lễ 30/4 - 1/5 hàng năm',
    summary: 'Ngày hội văn hóa ẩm thực tôn vinh hạt cà phê Robusta Pleiku thơm nồng và các món ăn đặc sản trứ danh của vùng đất cao nguyên Gia Lai.',
    sections: [
      {
        title: 'Hương vị cà phê Robusta đậm đà cao nguyên',
        content: `Gia Lai là thủ phủ cà phê Robusta với diện tích gần 100.000ha. Lễ hội quy tụ hàng chục thương hiệu cà phê đặc sản hàng đầu, không gian biểu diễn pha chế barista đỉnh cao và góc thưởng thức cà phê miễn phí dành cho du khách.`
      },
      {
        title: 'Khám phá thế giới ẩm thực phong phú',
        content: `Hơn 50 gian hàng ẩm thực giới thiệu các món ngon đặc sản: Phở hai tô Pleiku chuẩn vị, Bò một nắng Krông Pa chấm muối kiến vàng, Gà nướng sa lửa cơm lam, Bún cua thối (bún mắm cua) nức tiếng và các loại bia thủ công hương trái cây Tây Nguyên.`
      }
    ],
    source: 'Hiệp hội Cà phê Gia Lai & UBND TP. Pleiku'
  },
  {
    slug: 'tuan-le-kham-pha-thien-nhien-kon-ka-kinh-k50',
    id: '40000000-0000-4000-8000-000000000010',
    contentId: '40000000-0000-4000-8000-000000000010',
    revisionId: '41000000-0000-4000-8000-000000000010',
    placeId: '30000000-0000-4000-8000-000000000008', // Vườn Quốc gia Kon Ka Kinh
    title: 'Tuần lễ Khám phá Thiên nhiên & Trekking VQG Kon Ka Kinh - Thác K50',
    startsAt: '2026-03-25 01:00:00.000000',
    endsAt: '2026-03-30 11:00:00.000000',
    eventStatus: 'SCHEDULED',
    locationName: 'Vườn Quốc gia Kon Ka Kinh và KBTTN Kon Chư Răng, Tỉnh Gia Lai',
    frequency: 'Hàng năm vào cuối tháng 3 (Thời tiết khô ráo, hoa rừng khoe sắc)',
    summary: 'Sự kiện du lịch sinh thái mạo hiểm kết nối hai khu bảo tồn lớn của Gia Lai, mở ra những hành trình trekking khám phá rừng già và hệ thống thác nước ngoạn mục.',
    sections: [
      {
        title: 'Hành trình xanh giữa đại ngàn Tây Nguyên',
        content: `Chương trình mang đến các tour trekking chuyên nghiệp dẫn dắt du khách thám hiểm hệ động thực vật Vườn Di sản ASEAN Kon Ka Kinh, ngắm loài Voọc chà vá chân xám và chinh phục dòng thác K50 tráng lệ.`
      },
      {
        title: 'Hội thảo bảo tồn & Cắm trại sinh thái',
        content: `Bên cạnh hoạt động dã ngoại, tuần lễ còn diễn ra tọa đàm khoa học về bảo tồn đa dạng sinh học và phát triển du lịch sinh thái bền vững gắn với sinh kế của cộng đồng người bản địa.`
      }
    ],
    source: 'Ban Quản lý VQG Kon Ka Kinh & KBTTN Kon Chư Răng'
  },
  {
    slug: 'le-dam-trau-ta-on-giang-to-mo-ko-po',
    id: '40000000-0000-4000-8000-000000000011',
    contentId: '40000000-0000-4000-8000-000000000011',
    revisionId: '41000000-0000-4000-8000-000000000011',
    placeId: '30000000-0000-4000-8000-000000000030', // Đèo Mang Yang / Huyện Mang Yang
    title: 'Lễ Đâm Trâu (Tạ ơn Giàng - Tơ Mơ Kơ Pô) người Ba Na',
    startsAt: '2026-04-10 01:00:00.000000',
    endsAt: '2026-04-12 14:00:00.000000',
    eventStatus: 'SCHEDULED',
    locationName: 'Làng Dektur, Xã Đak Sơ Mei, Huyện Mang Yang, Tỉnh Gia Lai',
    frequency: 'Tổ chức vào dịp khánh thành nhà Rông mới hoặc lễ hội cộng đồng lớn',
    summary: 'Nghi lễ tạ ơn Trời Đất thần linh cổ xưa nhất của người Ba Na, thể hiện tinh thần thượng võ, sự gắn kết cộng đồng và lòng biết ơn thiên nhiên.',
    sections: [
      {
        title: 'Nghi lễ tạ ơn thần linh thiêng liêng',
        content: `Trong tâm thức người Ba Na, con trâu là vật tế lễ cao quý nhất dâng lên các đấng Yang để tạ ơn đã ban cho buôn làng mưa thuận gió hòa, người người khỏe mạnh, con cái sinh sôi nảy nở.`
      },
      {
        title: 'Cột Blang (Gơng Sa) & Vũ điệu xoang huyền bí',
        content: `Cột tế trâu được đẽo từ thân cây gỗ lớn, chạm trổ hoa văn hình học tinh xảo và treo bông tua rực rỡ tượng trưng cho cây vũ trụ nối liền đất trời. Trong tiếng cồng chiêng dồn dập, các tráng sĩ múa khiên gươm quanh cột tế, sau đó thịt trâu được chia đều cho tất cả mọi gia đình trong buôn làng làm biểu tượng của sự no ấm đoàn kết.`
      }
    ],
    source: 'Bảo tàng Dân tộc học & Báo Gia Lai'
  },
  {
    slug: 'hoi-hoa-xuan-phien-cho-ocop-gia-lai',
    id: '40000000-0000-4000-8000-000000000012',
    contentId: '40000000-0000-4000-8000-000000000012',
    revisionId: '41000000-0000-4000-8000-000000000012',
    placeId: '30000000-0000-4000-8000-000000000020', // Công viên Diên Hồng
    title: 'Hội Hoa Xuân & Phiên chợ Nông sản OCOP Gia Lai',
    startsAt: '2026-01-30 01:00:00.000000', // 23 tháng Chạp Tết
    endsAt: '2026-02-08 15:00:00.000000',  // Mùng 3 Tết
    eventStatus: 'SCHEDULED',
    locationName: 'Công viên Diên Hồng và Đường Anh Hùng Núp, TP. Pleiku, Tỉnh Gia Lai',
    frequency: 'Thường niên vào dịp Tết Nguyên Đán',
    summary: 'Hội chợ hoa Tết rực rỡ sắc màu và không gian xúc tiến thương mại nông sản OCOP tiêu biểu của 17 huyện, thị xã, thành phố trong tỉnh Gia Lai.',
    sections: [
      {
        title: 'Sắc xuân rực rỡ phố núi Pleiku',
        content: `Hội Hoa Xuân quy tụ hàng trăm ngàn chậu hoa mai rừng Tây Nguyên, hoa cúc vạn thọ, hoa đào xứ lạnh, phong lan rừng quý hiếm và cây cảnh bonsai nghệ thuật được các nghệ nhân chăm chút công phu.`
      },
      {
        title: 'Không gian sản phẩm đặc sản OCOP Gia Lai',
        content: `Phiên chợ OCOP là nơi trưng bày và bán các sản phẩm chứng nhận sao: Mật ong rừng hoa cà phê, Hạt mắc ca Kbang, Hồ tiêu Chư Sê, Chuối sấy dẻo Đak Đoa, Gạo Ba Chăm Phú Thiện, Thịt bò một nắng Krông Pa thơm ngon phục vụ người dân đón Tết cổ truyền.`
      }
    ],
    source: 'Sở Nông nghiệp và PTNT Tỉnh Gia Lai'
  }
];
