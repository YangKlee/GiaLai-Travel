/**
 * Dữ liệu 25 Địa điểm du lịch Bình Định (Binh Dinh Places Dataset)
 * Nguồn: Sở Du lịch Bình Định (dulich.binhdinh.gov.vn), Cổng TTĐT Tỉnh Bình Định (binhdinh.gov.vn), Báo Bình Định (baobinhdinh.vn).
 */

export const binhDinhRegionsData = [
  { id: '20000000-0000-4000-8000-000000000018', code: 'QUYNHON', name: 'Thành phố Quy Nhơn', phase: 2 },
  { id: '20000000-0000-4000-8000-000000000019', code: 'TAYSON', name: 'Huyện Tây Sơn', phase: 2 },
  { id: '20000000-0000-4000-8000-000000000020', code: 'ANNHON', name: 'Thị xã An Nhơn', phase: 2 },
  { id: '20000000-0000-4000-8000-000000000021', code: 'HOAINHON', name: 'Thị xã Hoài Nhơn', phase: 2 },
  { id: '20000000-0000-4000-8000-000000000022', code: 'PHUCAT', name: 'Huyện Phù Cát', phase: 2 },
  { id: '20000000-0000-4000-8000-000000000023', code: 'PHUMY', name: 'Huyện Phù Mỹ', phase: 2 },
  { id: '20000000-0000-4000-8000-000000000024', code: 'TUYPHUOC', name: 'Huyện Tuy Phước', phase: 2 },
  { id: '20000000-0000-4000-8000-000000000025', code: 'HOAIAN', name: 'Huyện Hoài Ân', phase: 2 },
  { id: '20000000-0000-4000-8000-000000000026', code: 'ANLAO', name: 'Huyện An Lão', phase: 2 },
  { id: '20000000-0000-4000-8000-000000000027', code: 'VINHTHANH', name: 'Huyện Vĩnh Thạnh', phase: 2 },
  { id: '20000000-0000-4000-8000-000000000028', code: 'VANCANH', name: 'Huyện Vân Canh', phase: 2 }
];

export const binhDinhPlacesData = [
  {
    slug: 'bai-bien-ky-co-nhon-ly',
    id: '30000000-0000-4000-8000-000000000031',
    contentId: '30000000-0000-4000-8000-000000000031',
    revisionId: '31000000-0000-4000-8000-000000000031',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'NATURE',
    name: 'Bãi biển Kỳ Co (Thiên đường biển đảo Nhơn Lý)',
    latitude: 13.883333,
    longitude: 109.300000,
    referencePriceVnd: 100000,
    typicalDurationMinutes: 180,
    openingHours: { opens: '07:00:00', closes: '18:00:00' },
    address: 'Bán đảo Phương Mai, Xã Nhơn Lý, Thành phố Quy Nhơn, Tỉnh Bình Định',
    bestTime: 'Tháng 3 đến tháng 9 (Biển êm, nước trong vắt hai màu, nắng vàng rực rỡ)',
    summary: 'Được mệnh danh là "Maldives của Việt Nam", Kỳ Co sở hữu bãi cát vàng mịn màng hình vầng trăng khuyết ôm trọn làn nước biển trong xanh hai màu kỳ ảo dưới chân vách đá dựng đứng.',
    sections: [
      {
        title: 'Thiên đường biển hai màu ngoạn mục',
        content: `Kỳ Co nằm cách trung tâm thành phố Quy Nhơn khoảng 25km về phía Đông Bắc trên bán đảo Phương Mai. Một mặt giáp biển khơi bao la, ba mặt còn lại được bao bọc bởi những rặng núi đá sừng sững uốn lượn. Nước biển Kỳ Co đặc biệt sạch trong đến mức đứng trên bờ có thể nhìn thấu tận đáy cát, với hai dải màu xanh ngọc bích gần bờ và xanh thẳm ngoài khơi.`
      },
      {
        title: 'Trải nghiệm cano cao tốc & Lặn ngắm san hô Bãi Dứa',
        content: `Để đến Kỳ Co, du khách thường đi cano cao tốc lướt sóng từ bến thuyền làng chài Nhơn Lý (khoảng 15 phút), chiêm ngưỡng các vách đá kỳ vĩ dọc đường đi. Trên đường về, cano sẽ dừng tại Bãi Dứa để du khách đeo kính lặn ngắm những rạn san hô tự nhiên đa sắc màu và các đàn cá bơi lội tung tăng.`
      },
      {
        title: 'Hồ bơi tự nhiên & Cầu gỗ sống ảo',
        content: `Khi thủy triều rút, giữa các hốc đá xuất hiện những "hồ bơi tự nhiên" nước mát lạnh, nông và an toàn cho trẻ nhỏ. Chiếc cầu gỗ vươn dài ra biển là điểm check-in sống ảo biểu tượng không thể bỏ qua của mọi du khách.`
      },
      {
        title: 'Ẩm thực hải sản tươi sống Nhơn Lý',
        content: `Sau chuyến tắm biển, du khách được thưởng thức đại tiệc hải sản tại các nhà hàng làng chài: bào ngư nướng mỡ hành, tôm hùm hấp nước dừa, mực nhảy hấp gừng, ốc hương sốt trứng muối và cháo hải sản thơm lừng.`
      }
    ],
    source: 'Sở Du lịch Tỉnh Bình Định & UBND TP. Quy Nhơn'
  },
  {
    slug: 'eo-gio-nhon-ly',
    id: '30000000-0000-4000-8000-000000000032',
    contentId: '30000000-0000-4000-8000-000000000032',
    revisionId: '31000000-0000-4000-8000-000000000032',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'NATURE',
    name: 'Danh thắng Eo Gió (Nơi ngắm hoàng hôn đẹp nhất Việt Nam)',
    latitude: 13.888889,
    longitude: 109.316667,
    referencePriceVnd: 25000,
    typicalDurationMinutes: 90,
    openingHours: { opens: '06:00:00', closes: '18:30:00' },
    address: 'Thôn Lý Lương, Xã Nhơn Lý, Thành phố Quy Nhơn, Tỉnh Bình Định',
    bestTime: 'Tháng 4 đến tháng 9, đặc biệt là sáng sớm đón bình minh hoặc buổi chiều tà ngắm hoàng hôn',
    summary: 'Eo biển lộng gió hình cánh cung ôm trọn đại dương với cung đường đi bộ ven vách núi đá ngoạn mục, được mệnh danh là nơi ngắm hoàng hôn đẹp nhất Việt Nam.',
    sections: [
      {
        title: 'Vẻ đẹp kỳ vĩ của "Eo biển hút gió"',
        content: `Eo Gió là một eo biển nhỏ được tạo nên bởi hai mỏm núi đá cao chót vót uốn cong hình cánh cung ôm trọn lấy biển khơi. Do cấu tạo địa hình phễu đặc biệt, nơi đây quanh năm đón những luồng gió biển lồng lộng thổi vào mát rượi, tạo nên những đợt sóng bạc đầu xô bờ tung bọt trắng xóa.`
      },
      {
        title: 'Con đường đi bộ ven biển ngoạn mục',
        content: `Điểm nhấn nổi tiếng nhất của Eo Gió là con đường đi bộ uốn lượn ven vách núi đá với hàng ngàn bậc thang có tay vịn đỏ - trắng tuyệt đẹp. Đứng từ đây nhìn xuống là bãi đá Đẻ với hàng triệu viên đá cuội tròn nhẵn nhiều kích cỡ xếp chồng lên nhau do sóng biển mài giũa qua hàng ngàn năm.`
      },
      {
        title: 'Ngắm hoàng hôn đại dương lãng mạn',
        content: `Eo Gió được du khách mệnh danh là tọa độ ngắm hoàng hôn lộng lẫy bậc nhất duyên hải miền Trung. Khi ráng chiều đỏ rực buông xuống trên mặt biển lấp lánh, toàn bộ không gian nhuộm màu tím biếc huyền ảo đầy mê hoặc.`
      }
    ],
    source: 'Cổng thông tin du lịch Bình Định (dulich.binhdinh.gov.vn)'
  },
  {
    slug: 'dao-hon-kho-nhon-hai',
    id: '30000000-0000-4000-8000-000000000033',
    contentId: '30000000-0000-4000-8000-000000000033',
    revisionId: '31000000-0000-4000-8000-000000000033',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'NATURE',
    name: 'Đảo Hòn Khô (Làng chài Nhơn Hải)',
    latitude: 13.800000,
    longitude: 109.316667,
    referencePriceVnd: 50000,
    typicalDurationMinutes: 180,
    openingHours: { opens: '07:00:00', closes: '17:30:00' },
    address: 'Thôn Hải Đông, Xã Nhơn Hải, Thành phố Quy Nhơn, Tỉnh Bình Định',
    bestTime: 'Tháng 3 đến tháng 9 (Biển phẳng lặng, mùa rong mơ nở vàng óng trên mặt biển)',
    summary: 'Hòn đảo hoang sơ tuyệt đẹp với con đường cát đi xuyên biển kỳ thú khi thủy triều rút, cây cầu gỗ men theo vách đá và những cánh đồng rong mơ huyền ảo.',
    sections: [
      {
        title: 'Hòn đảo mộc mạc không bóng cây xanh',
        content: `Hòn Khô đúng như tên gọi, là một hòn đảo đá nhỏ hoang sơ không có cây cổ thụ râm mát, chỉ có những bụi cỏ dại kiên cường mọc xen kẽ giữa các khối đá hoa cương. Đảo cách đất liền làng chài Nhơn Hải chỉ khoảng 10 phút đi thuyền gỗ hoặc cano.`
      },
      {
        title: 'Con đường cát xuyên biển độc nhất vô nhị',
        content: `Mỗi khi thủy triều rút xuống, một dải cát trắng mịn màng dài hơn 500m nối liền hai mỏm đá nhô lên khỏi mặt nước, mở ra con đường đi bộ xuyên biển kỳ thú giữa làn nước trong vắt hai bên.`
      },
      {
        title: 'Lặn ngắm san hô & Mùa rong mơ vàng rực',
        content: `Từ tháng 5 đến tháng 7 hàng năm, vùng biển quanh Hòn Khô bước vào mùa rong mơ. Những tán rong mơ nở rộ dưới đáy biển tạo thành cánh đồng vàng óng rập rờn theo con sóng, là môi trường sống của muôn vàn loài cá biển nhiều màu sắc.`
      }
    ],
    source: 'UBND Xã Nhơn Hải & Báo Bình Định'
  },
  {
    slug: 'ghenh-rang-tien-sa-mo-han-mac-tu',
    id: '30000000-0000-4000-8000-000000000034',
    contentId: '30000000-0000-4000-8000-000000000034',
    revisionId: '31000000-0000-4000-8000-000000000034',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'CULTURE',
    name: 'Khu du lịch Ghềnh Ráng - Tiên Sa & Mộ Hàn Mặc Tử',
    latitude: 13.738889,
    longitude: 109.222222,
    referencePriceVnd: 0,
    typicalDurationMinutes: 90,
    openingHours: { opens: '06:00:00', closes: '21:00:00' },
    address: 'Số 3 đường Hàn Mặc Tử, Phường Ghềnh Ráng, Thành phố Quy Nhơn, Tỉnh Bình Định',
    bestTime: 'Quanh năm, đẹp nhất vào sáng sớm hoặc buổi chiều hoàng hôn mát mẻ',
    summary: 'Quần thể danh thắng hữu tình nằm sát biển Quy Nhơn, nơi an nghỉ của thi sĩ tài hoa Hàn Mặc Tử và Bãi tắm Hoàng Hậu (Bãi Đá Trứng) độc đáo của Nam Phương Hoàng hậu.',
    sections: [
      {
        title: 'Bãi tắm Hoàng Hậu (Bãi Đá Trứng chim)',
        content: `Ghềnh Ráng trải dài theo bờ biển trong xanh với dải đá uốn lượn nhấp nhô. Nổi bật nhất là Bãi tắm Hoàng Hậu - nơi Nam Phương Hoàng hậu (vợ vua Bảo Đại) từng chọn làm bãi tắm riêng khi về kinh lý Quy Nhơn năm 1927. Bãi biển phủ kín hàng triệu viên đá cuội tròn nhẵn bóng như những quả trứng chim khổng lồ.`
      },
      {
        title: 'Mộ nhà thơ tài hoa bạc mệnh Hàn Mặc Tử',
        content: `Nằm trên đồi Thi Nhân rợp bóng thông xanh lộng gió là nơi yên nghỉ của nhà thơ Hàn Mặc Tử (1912 - 1940) - ngôi sao chói lọi của phong trào Thơ Mới Việt Nam. Du khách đến đây dâng hương tưởng niệm và ghé thăm gian nhà lưu niệm bút lửa Dzũ Kha với những vần thơ tình da diết khắc trên gỗ thông.`
      },
      {
        title: 'Vọng cảnh toàn cảnh vịnh Quy Nhơn',
        content: `Từ trên đỉnh đồi Ghềnh Ráng, du khách có thể phóng tầm mắt ngắm trọn bờ biển hình vầng trăng khuyết mềm mại của thành phố Quy Nhơn trải dài từ Ghềnh Ráng đến Mũi Tấn rực rỡ dưới ánh nắng.`
      }
    ],
    source: 'Bảo tàng Tỉnh Bình Định & Dulich.binhdinh.gov.vn'
  },
  {
    slug: 'thap-doi-quy-nhon',
    id: '30000000-0000-4000-8000-000000000035',
    contentId: '30000000-0000-4000-8000-000000000035',
    revisionId: '31000000-0000-4000-8000-000000000035',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'CULTURE',
    name: 'Tháp Đôi Quy Nhơn (Tháp Hưng Thạnh)',
    latitude: 13.788889,
    longitude: 109.213889,
    referencePriceVnd: 20000,
    typicalDurationMinutes: 60,
    openingHours: { opens: '07:00:00', closes: '17:30:00' },
    address: 'Đường Trần Hưng Đạo, Phường Đống Đa, Thành phố Quy Nhơn, Tỉnh Bình Định',
    bestTime: 'Quanh năm',
    summary: 'Cụm tháp Chăm Pa cổ kính thế kỷ XII độc đáo với kiến trúc vòm cong giao thoa nghệ thuật Khmer - Chăm, đứng song song uy nghiêm ngay giữa lòng phố biển Quy Nhơn.',
    sections: [
      {
        title: 'Kiệt tác tháp Chăm giữa lòng thành phố',
        content: `Tháp Đôi (còn gọi là Tháp Hưng Thạnh) được xây dựng vào cuối thế kỷ XII - đầu thế kỷ XIII, giai đoạn vương quốc Chăm Pa có mối quan hệ giao lưu mật thiết với đế chế Angkor Khmer. Khác với các tháp Chăm truyền thống có nhiều tầng thu nhỏ dần lên đỉnh, Tháp Đôi có cấu trúc hai tháp đứng song song với phần mái vòm cong thanh thoát.`
      },
      {
        title: 'Nghệ thuật điêu khắc phù điêu tinh xảo',
        content: `Tháp lớn cao 20m, tháp nhỏ cao 18m. Quanh các góc chân mái tháp được trang trí bằng các tượng phù điêu chim thần Garuda dang rộng đôi cánh, tượng các vũ nữ múa Apsara và các linh thú chạm khắc đá tinh xảo trên nền gạch đất nung gắn kết kỳ diệu không để lộ mạch vữa.`
      }
    ],
    source: 'Bảo tàng Tỉnh Bình Định'
  },
  {
    slug: 'thap-banh-it-tuy-phuoc',
    id: '30000000-0000-4000-8000-000000000036',
    contentId: '30000000-0000-4000-8000-000000000036',
    revisionId: '31000000-0000-4000-8000-000000000036',
    regionCode: 'TUYPHUOC',
    regionId: '20000000-0000-4000-8000-000000000024',
    category: 'CULTURE',
    name: 'Tháp Bánh Ít (Tháp Bạc - Tuy Phước)',
    latitude: 13.886111,
    longitude: 109.136111,
    referencePriceVnd: 20000,
    typicalDurationMinutes: 90,
    openingHours: { opens: '07:00:00', closes: '17:30:00' },
    address: 'Thôn Đại Lộc, Xã Phước Hiệp, Huyện Tuy Phước, Tỉnh Bình Định (ven Quốc lộ 1A)',
    bestTime: 'Quanh năm, buổi sáng sớm và chiều tà lúc nắng vàng rọi vào gạch nung cổ kính',
    summary: 'Quần thể 4 ngọn tháp Chăm Pa cổ thế kỷ XI uy nghi trên đỉnh đồi cao, công trình kiến trúc cổ duy nhất của Việt Nam lọt vào cuốn sách quốc tế "1001 công trình kiến trúc phải đến trong đời".',
    sections: [
      {
        title: 'Quần thể tháp Chăm tráng lệ trên đồi cao',
        content: `Tháp Bánh Ít (người Pháp gọi là Tour d’Argent - Tháp Bạc) được xây dựng từ cuối thế kỷ XI trên đỉnh một ngọn đồi thoai thoải cao chừng 100m. Nhìn từ xa, 4 ngọn tháp sừng sững trông như những chiếc bánh ít - món bánh truyền thống thơm ngon của xứ Nẫu Bình Định.`
      },
      {
        title: 'Kiến trúc đỉnh cao của phong cách Bình Định',
        content: `Quần thể gồm Tháp Chính cao 29m uy nghiêm, Tháp Cổng phía Đông, Tháp Hỏa (tháp mái hình yên ngựa) và Tháp Bia phía Nam. Các họa tiết chạm khắc hình hoa lá, tượng thần Shiva, khỉ thần Hanuman trên gạch nung đỏ rực rỡ thể hiện kỹ thuật xây dựng và điêu khắc bậc thầy của người Chăm cổ.`
      },
      {
        title: 'Tầm nhìn bao quát đồng lúa Tuy Phước',
        content: `Đứng trên đỉnh đồi tháp Bánh Ít, du khách có thể phóng tầm mắt bao quát toàn cảnh những cánh đồng lúa xanh ngát của huyện Tuy Phước, dòng sông Côn hiền hòa uốn lượn và cầu Bà Gi bắc qua dòng sông.`
      }
    ],
    source: 'Cục Di sản Văn hóa & Báo Bình Định'
  },
  {
    slug: 'bao-tang-quang-trung-tay-son',
    id: '30000000-0000-4000-8000-000000000037',
    contentId: '30000000-0000-4000-8000-000000000037',
    revisionId: '31000000-0000-4000-8000-000000000037',
    regionCode: 'TAYSON',
    regionId: '20000000-0000-4000-8000-000000000019',
    category: 'CULTURE',
    name: 'Bảo tàng Quang Trung & Điện thờ Tây Sơn Tam Kiệt',
    latitude: 13.919444,
    longitude: 108.911111,
    referencePriceVnd: 30000,
    typicalDurationMinutes: 120,
    openingHours: { opens: '07:00:00', closes: '17:00:00' },
    address: 'Thị trấn Phú Phong, Huyện Tây Sơn, Tỉnh Bình Định (cách TP. Quy Nhơn 45km)',
    bestTime: 'Quanh năm, đặc biệt dịp mùng 4 - 5 Tết Âm lịch diễn ra Lễ hội Đống Đa - Tây Sơn',
    summary: 'Khu di tích lịch sử Quốc gia đặc biệt tưởng nhớ công đức vĩ đại của Hoàng đế Quang Trung - Nguyễn Huệ và nghĩa quân Tây Sơn, nơi lưu giữ cây me cổ thụ 300 năm, giếng nước đá ong và biểu diễn nhạc võ Tây Sơn lẫy lừng.',
    sections: [
      {
        title: 'Đền thờ phong trào khởi nghĩa Tây Sơn hiển hách',
        content: `Bảo tàng Quang Trung được xây dựng ngay trên chính nền ngôi nhà cũ của gia đình ba anh em Tây Sơn (Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ) tại làng Kiên Mỹ, huyện Tây Sơn. Đây là một trong những bảo tàng danh nhân lớn nhất Việt Nam thu hút hàng triệu lượt khách hành hương mỗi năm.`
      },
      {
        title: 'Cây me cổ thụ & Giếng nước đá ong lịch sử',
        content: `Trong khuôn viên điện thờ vẫn vẹn nguyên hai di vật vô giá gắn bó với tuổi thơ của anh em Tây Sơn: Cây me cổ thụ hơn 300 năm tuổi cành lá sum suê che mát một góc vườn, và Giếng nước đá ong trong vắt mát ngọt mà nhân dân tương truyền uống vào sẽ tiếp thêm hào khí và sức khỏe.`
      },
      {
        title: 'Thưởng thức nhạc võ Tây Sơn & Múa trống trận',
        content: `Đến bảo tàng, du khách không thể bỏ qua chương trình biểu diễn Nhạc võ Tây Sơn với dàn trống trận 12 chiếc tượng trưng cho thập nhị địa chi, hòa cùng tiếng đàn nhị, kèn bóp, xập xõa hào hùng tái hiện khí thế bách chiến bách thắng của đoàn quân áo vải cờ đào năm xưa.`
      }
    ],
    source: 'Bảo tàng Quang Trung & Sở VHTTDL Bình Định'
  },
  {
    slug: 'khu-du-lich-sinh-thai-ham-ho-tay-son',
    id: '30000000-0000-4000-8000-000000000038',
    contentId: '30000000-0000-4000-8000-000000000038',
    revisionId: '31000000-0000-4000-8000-000000000038',
    regionCode: 'TAYSON',
    regionId: '20000000-0000-4000-8000-000000000019',
    category: 'NATURE',
    name: 'Khu du lịch Sinh thái Hầm Hô (Vương quốc Đá Hoa Cương)',
    latitude: 13.886111,
    longitude: 108.863889,
    referencePriceVnd: 50000,
    typicalDurationMinutes: 180,
    openingHours: { opens: '07:30:00', closes: '17:00:00' },
    address: 'Xã Tây Phú, Huyện Tây Sơn, Tỉnh Bình Định (cách Quy Nhơn khoảng 50km)',
    bestTime: 'Tháng 2 đến tháng 8 (Mùa nước cạn trong veo, trời trong xanh, chèo thuyền ngắm cảnh lý tưởng)',
    summary: 'Tuyệt tác thiên nhiên hoang sơ với dòng sông Kút chảy qua vương quốc đá hoa cương muôn hình vạn trạng giữa rừng nguyên sinh đại ngàn, từng là căn cứ kháng chiến của nghĩa quân Tây Sơn và Mai Xuân Thưởng.',
    sections: [
      {
        title: 'Vương quốc đá hoa cương kỳ thú',
        content: `Hầm Hô là một khúc sông Kút dài gần 3km chảy qua lòng thung lũng đá hoa cương kỳ vĩ. Lòng sông dày đặc những khối đá khổng lồ với muôn hình thù độc đáo: Hòn Chuông, Hòn Bóng, Đá Thành, Bàn Cờ Tiên, Dấu Chân Khổng Lồ... Mỗi khi ánh mặt trời rọi xuống, các tinh thể đá lấp lánh như dát kim cương.`
      },
      {
        title: 'Đi thuyền nan bồng bềnh giữa hẻm vực xanh',
        content: `Trải nghiệm thú vị nhất tại Hầm Hô là ngồi thuyền nan mộc mạc do người chèo đò bản địa chèo êm ả lướt trên mặt nước xanh biếc. Hai bên bờ là những vách đá phủ đầy dây leo cổ thụ, cành phong lan rừng rủ xuống soi bóng, tiếng chim rừng líu lo hòa cùng tiếng suối róc rách.`
      },
      {
        title: 'Căn cứ địa lịch sử oai hùng',
        content: `Nơi đây từng là căn cứ bí mật tích trữ lương thảo của nghĩa quân Tây Sơn và sau này là căn cứ khởi nghĩa Cần Vương kiên cường của lãnh tụ Mai Xuân Thưởng chống thực dân Pháp.`
      }
    ],
    source: 'Công ty Cổ phần Du lịch Hầm Hô & Báo Bình Định'
  },
  {
    slug: 'dao-cu-lao-xanh-nhon-chau',
    id: '30000000-0000-4000-8000-000000000039',
    contentId: '30000000-0000-4000-8000-000000000039',
    revisionId: '31000000-0000-4000-8000-000000000039',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'NATURE',
    name: 'Đảo Cù Lao Xanh (Xã đảo Nhơn Châu)',
    latitude: 13.616667,
    longitude: 109.350000,
    referencePriceVnd: 0,
    typicalDurationMinutes: 300,
    openingHours: { opens: '06:00:00', closes: '18:00:00' },
    address: 'Xã đảo Nhơn Châu, Thành phố Quy Nhơn, Tỉnh Bình Định',
    bestTime: 'Tháng 3 đến tháng 8 (Mùa biển êm, trời trong xanh, lặn ngắm san hô thuận lợi)',
    summary: 'Viên ngọc xanh vô giá giữa biển khơi Quy Nhơn với ngọn Hải đăng Plogamum cổ kính hơn 130 năm tuổi, Cột cờ Tổ quốc thiêng liêng và bãi biển nguyên sơ tĩnh lặng.',
    sections: [
      {
        title: 'Hòn ngọc xanh giữa đại dương',
        content: `Cù Lao Xanh (đảo Vân Phi) nằm cách bờ biển Quy Nhơn khoảng 24km về phía Đông Nam. Hòn đảo được bao bọc bởi một màu xanh bất tận: xanh ngắt của cây rừng, xanh biếc của biển khơi và xanh trong của mây trời Tây Sơn.`
      },
      {
        title: 'Ngọn Hải đăng cổ kính hơn 130 năm tuổi',
        content: `Trên đỉnh núi cao nhất của đảo là Ngọn Hải đăng Cù Lao Xanh được người Pháp xây dựng từ năm 1890 theo phong cách kiến trúc Gothic kết hợp phương Đông. Tháp đèn cao 16m xây bằng đá hoa cương khối lớn, chiếu xa tới 27 hải lý dẫn đường cho tàu thuyền qua lại vùng biển Bình Định.`
      },
      {
        title: 'Cột cờ Tổ quốc & Bãi đá Thảo Nguyên',
        content: `Bên cạnh hải đăng là Cột cờ Tổ quốc khẳng định chủ quyền biển đảo thiêng liêng. Du khách cũng không thể bỏ lỡ Bãi đá Thảo Nguyên với muôn vàn khối đá đủ hình thù ngộ nghĩnh và Bãi Gala ngắm san hô cạn tuyệt đẹp.`
      }
    ],
    source: 'UBND Xã đảo Nhơn Châu & Báo Bình Định'
  },
  {
    slug: 'chua-linh-phong-ong-nui-phu-cat',
    id: '30000000-0000-4000-8000-000000000040',
    contentId: '30000000-0000-4000-8000-000000000040',
    revisionId: '31000000-0000-4000-8000-000000000040',
    regionCode: 'PHUCAT',
    regionId: '20000000-0000-4000-8000-000000000022',
    category: 'CULTURE',
    name: 'Chùa Linh Phong (Chùa Ông Núi & Đại Tượng Phật ngồi cao nhất Đông Nam Á)',
    latitude: 13.944444,
    longitude: 109.183333,
    referencePriceVnd: 0,
    typicalDurationMinutes: 120,
    openingHours: { opens: '06:00:00', closes: '18:00:00' },
    address: 'Thôn Phương Chi, Xã Cát Tiến, Huyện Phù Cát, Tỉnh Bình Định',
    bestTime: 'Quanh năm, đặc biệt ngày 24 - 25 tháng Giêng âm lịch diễn ra Lễ hội Chùa Ông Núi',
    summary: 'Ngôi cổ tự hơn 300 năm tuổi trên lưng chừng núi Bà, nổi tiếng với pho đại tượng Đức Phật Thích Ca Mâu Ni ngồi ngự trên tòa sen cao 69m hướng nhìn ra biển Đông lớn nhất Đông Nam Á.',
    sections: [
      {
        title: 'Huyền tích vị thiền sư chữa bệnh cứu người',
        content: `Chùa Ông Núi (Linh Phong Thiền Tự) được khởi lập từ năm 1702 dưới thời chúa Nguyễn Phúc Chu. Gắn liền với chùa là huyền tích về thiền sư Tịnh Giác - Thiện Trì (thường gọi là Mộc Y Sơn Nhơn - Ông Núi) tu hành trong hang đá, hái thuốc nam cứu chữa miễn phí cho người nghèo quanh vùng.`
      },
      {
        title: 'Đại tượng Phật ngồi cao 69m kỷ lục',
        content: `Điểm nhấn vĩ đại là bức đại tượng Phật Thích Ca Mâu Ni bằng bê tông cốt thép cao 69m (tính cả đài sen), đường kính chân tượng 52m tọa lạc trên đỉnh núi ở độ cao 129m so với mực nước biển. Để lên đến chân tượng Phật, du khách sẽ bước qua hơn 600 bậc thang đá uốn lượn rợp bóng cây xanh.`
      },
      {
        title: 'Tầm nhìn ngoạn mục hướng biển Phù Cát',
        content: `Đứng từ sân chùa Linh Phong, du khách có thể phóng tầm mắt bao quát toàn bộ đầm Thị Nại, cầu vượt biển, cánh đồng quạt gió Phương Mai và bãi biển Cát Tiến hoang sơ tuyệt đẹp.`
      }
    ],
    source: 'Giáo hội Phật giáo Việt Nam tỉnh Bình Định & Báo Bình Định'
  },
  {
    slug: 'tieu-chung-vien-lang-song-tuy-phuoc',
    id: '30000000-0000-4000-8000-000000000041',
    contentId: '30000000-0000-4000-8000-000000000041',
    revisionId: '31000000-0000-4000-8000-000000000041',
    regionCode: 'TUYPHUOC',
    regionId: '20000000-0000-4000-8000-000000000024',
    category: 'CULTURE',
    name: 'Tiểu Chủng viện Làng Sông (Cái nôi Chữ Quốc Ngữ)',
    latitude: 13.844444,
    longitude: 109.186111,
    referencePriceVnd: 0,
    typicalDurationMinutes: 75,
    openingHours: { opens: '07:30:00', closes: '17:00:00' },
    address: 'Thôn Quảng Vân, Xã Phước Thuận, Huyện Tuy Phước, Tỉnh Bình Định',
    bestTime: 'Quanh năm, đẹp nhất vào sáng sớm khi ánh nắng xuyên qua hàng cây sao cổ thụ trăm tuổi',
    summary: 'Kiến trúc Gothic châu Âu cổ kính giữa đồng bằng Tuy Phước, nơi đặt Nhà in Làng Sông - một trong những cơ sở in ấn và truyền bá chữ Quốc ngữ đầu tiên tại Việt Nam.',
    sections: [
      {
        title: 'Cái nôi phôi thai và truyền bá chữ Quốc ngữ',
        content: `Vào đầu thế kỷ XVII, tại vùng đất cảng thị Nước Mặn (nay thuộc Tuy Phước, Bình Định), các giáo sĩ Dòng Tên phương Tây (như Cristoforo Borri, Francisco de Pina) cùng các học giả bản địa đã bắt đầu phiên âm tiếng Việt bằng ký tự Latinh, mở đầu cho sự ra đời của chữ Quốc ngữ. Nhà in Làng Sông thành lập tại đây là một trong ba nhà in chữ Quốc ngữ đầu tiên của cả nước.`
      },
      {
        title: 'Kiến trúc Gothic châu Âu tráng lệ',
        content: `Tiểu Chủng viện mang đậm nét kiến trúc Gothic cổ điển của Pháp với vòm nhọn, tháp chuông uy nghiêm và những ô cửa sổ kính màu trang nhã. Lối vào chủng viện rợp bóng hai hàng cây sao đen cổ thụ hơn 200 năm tuổi cao vút, tạo nên vẻ đẹp thanh bình thoát tục tựa một tu viện cổ kính ở châu Âu.`
      }
    ],
    source: 'Tòa Giám mục Quy Nhơn & Báo Bình Định'
  },
  {
    slug: 'khu-da-ngoai-trung-luong-phu-cat',
    id: '30000000-0000-4000-8000-000000000042',
    contentId: '30000000-0000-4000-8000-000000000042',
    revisionId: '31000000-0000-4000-8000-000000000042',
    regionCode: 'PHUCAT',
    regionId: '20000000-0000-4000-8000-000000000022',
    category: 'NATURE',
    name: 'Khu dã ngoại Trung Lương (Phù Cát)',
    latitude: 13.955556,
    longitude: 109.194444,
    referencePriceVnd: 40000,
    typicalDurationMinutes: 120,
    openingHours: { opens: '07:00:00', closes: '21:00:00' },
    address: 'Thôn Trung Lương, Xã Cát Tiến, Huyện Phù Cát, Tỉnh Bình Định',
    bestTime: 'Tháng 3 đến tháng 9 (Thời tiết nắng đẹp, gió biển mát lành, hoàng hôn tuyệt đẹp)',
    summary: 'Thung lũng cắm trại sát mép biển với bãi cỏ xanh mướt, những căn lều đủ màu sắc và con đường bậc thang lát đá dẫn thẳng xuống bãi tắm biển hoang sơ trong vắt.',
    sections: [
      {
        title: 'Thung lũng cắm trại "chill" bên bờ biển',
        content: `Khu dã ngoại Trung Lương nằm lọt thỏm giữa thung lũng đá hoa cương hướng ra bờ biển xanh biếc. Nơi đây được thiết kế hài hòa với thiên nhiên với những bãi cỏ xanh rì, các lều trại cắm trại ban đêm và hệ thống đèn trang trí lung linh lãng mạn.`
      },
      {
        title: 'Con đường đá lát dạo bước xuống biển',
        content: `Một con đường bậc thang đá uốn lượn ngoạn mục men theo sườn núi đưa du khách xuống tận bãi biển Trung Lương hoang sơ. Du khách có thể tắm biển, chụp ảnh kỷ niệm và thưởng thức các món đồ uống tươi mát tại quầy bar ven biển.`
      }
    ],
    source: 'Dulich.binhdinh.gov.vn'
  },
  {
    slug: 'doi-cat-phuong-mai-quy-nhon',
    id: '30000000-0000-4000-8000-000000000043',
    contentId: '30000000-0000-4000-8000-000000000043',
    revisionId: '31000000-0000-4000-8000-000000000043',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'NATURE',
    name: 'Đồi cát Phương Mai',
    latitude: 13.850000,
    longitude: 109.266667,
    referencePriceVnd: 0,
    typicalDurationMinutes: 75,
    openingHours: { opens: '05:30:00', closes: '18:30:00' },
    address: 'Bán đảo Phương Mai, Xã Nhơn Lý, Thành phố Quy Nhơn, Tỉnh Bình Định',
    bestTime: 'Sáng sớm (6h - 8h) hoặc chiều muộn (16h - 18h) để tránh cát nóng',
    summary: 'Đồi cát vàng mịn màng khổng lồ cao từ 20m đến 100m so với mực nước biển, nơi du khách trải nghiệm trò chơi trượt cát cảm giác mạnh và ngắm nhìn vịnh biển từ trên cao.',
    sections: [
      {
        title: 'Tiểu sa mạc cát vàng bên vịnh biển',
        content: `Nằm sát bờ biển Nhơn Lý, Đồi cát Phương Mai là một trong những đồi cát cao và đẹp nhất miền Trung. Do gió biển thổi quanh năm, hình thù vân cát trên đồi biến đổi liên tục từng giờ tạo nên những đường cong mềm mại như tranh thủy mặc.`
      },
      {
        title: 'Trải nghiệm trượt cát cảm giác mạnh',
        content: `Du khách thuê những chiếc ván trượt bằng gỗ hoặc nhựa để trượt từ đỉnh đồi cát dốc đứng xuống dưới với vận tốc lên tới 30 - 40km/h, mang lại cảm giác phấn khích tột độ.`
      }
    ],
    source: 'Sở Du lịch Tỉnh Bình Định'
  },
  {
    slug: 'dam-thi-nai-cau-thi-nai',
    id: '30000000-0000-4000-8000-000000000044',
    contentId: '30000000-0000-4000-8000-000000000044',
    revisionId: '31000000-0000-4000-8000-000000000044',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'NATURE',
    name: 'Đầm Thị Nại & Cầu Thị Nại (Cầu vượt biển dài gần 2,5km)',
    latitude: 13.794444,
    longitude: 109.255556,
    referencePriceVnd: 0,
    typicalDurationMinutes: 60,
    openingHours: { opens: '00:00:00', closes: '23:59:59' },
    address: 'Thành phố Quy Nhơn và Huyện Tuy Phước, Tỉnh Bình Định',
    bestTime: 'Chiều hoàng hôn buông hoặc ban đêm khi hệ thống đèn cầu lung linh',
    summary: 'Đầm nước lợ lớn nhất Bình Định rộng hơn 5.000ha ghi dấu nhiều chiến tích thủy chiến lẫy lừng trong lịch sử, nối với bán đảo Phương Mai bằng cây cầu vượt biển dài 2.477m.',
    sections: [
      {
        title: 'Chứng nhân lịch sử của những trận thủy chiến hào hùng',
        content: `Đầm Thị Nại là vùng đầm phá trù phú nối với biển qua cửa Giã (cửa Thị Nại). Nơi đây từng là chiến trường thủy chiến khốc liệt thời Champa - Đại Việt, cuộc đụng độ giữa quân Tây Sơn và chúa Nguyễn Ánh, ghi dấu tài thao lược quân sự của tiền nhân.`
      },
      {
        title: 'Kỳ quan cầu vượt biển Thị Nại',
        content: `Cầu Thị Nại khánh thành năm 2006 với chiều dài 2.477m, gồm 54 nhịp bắc ngang qua đầm nước lợ mênh mông, từng giữ kỷ lục cây cầu vượt biển dài nhất Việt Nam suốt nhiều năm.`
      }
    ],
    source: 'Báo Bình Định & Cổng TTĐT Tỉnh Bình Định'
  },
  {
    slug: 'thanh-hoang-de-thap-canh-tien-an-nhon',
    id: '30000000-0000-4000-8000-000000000045',
    contentId: '30000000-0000-4000-8000-000000000045',
    revisionId: '31000000-0000-4000-8000-000000000045',
    regionCode: 'ANNHON',
    regionId: '20000000-0000-4000-8000-000000000020',
    category: 'CULTURE',
    name: 'Di tích Thành Hoàng Đế & Tháp Cánh Tiên (An Nhơn)',
    latitude: 13.916667,
    longitude: 109.083333,
    referencePriceVnd: 20000,
    typicalDurationMinutes: 90,
    openingHours: { opens: '07:30:00', closes: '17:00:00' },
    address: 'Xã Nhơn Hậu, Thị xã An Nhơn, Tỉnh Bình Định',
    bestTime: 'Quanh năm, điểm tham quan văn hóa lịch sử đặc sắc',
    summary: 'Quần thể di tích quốc gia đặc biệt ghi dấu kinh đô Đồ Bàn xưa của Vương quốc Chăm Pa và kinh đô của triều đại Hoàng đế Thái Đức Nguyễn Nhạc thời Tây Sơn.',
    sections: [
      {
        title: 'Kinh đô hai vương triều Champa và Tây Sơn',
        content: `Thành Hoàng Đế nguyên là kinh thành Đồ Bàn (Vijaya) của vương quốc Chăm Pa suốt 5 thế kỷ (từ thế kỷ XI đến XV). Đến năm 1776, Nguyễn Nhạc cho xây dựng lại thành Đồ Bàn làm kinh đô của triều đại Tây Sơn lấy tên là Thành Hoàng Đế.`
      },
      {
        title: 'Tháp Cánh Tiên kiêu hãnh giữa lòng kinh thành',
        content: `Tọa lạc ngay chính giữa trung tâm Thành Hoàng Đế là Tháp Cánh Tiên - ngôi tháp Chăm cao gần 20m xây dựng từ thế kỷ XII. Bốn mặt góc tường tháp nhô ra những phiến đá thanh thoát uốn cong tựa như đôi cánh tiên đang bay lượn trên trời cao.`
      }
    ],
    source: 'Bảo tàng Tỉnh Bình Định & UBND Thị xã An Nhơn'
  },
  {
    slug: 'mui-vi-rong-phu-my',
    id: '30000000-0000-4000-8000-000000000046',
    contentId: '30000000-0000-4000-8000-000000000046',
    revisionId: '31000000-0000-4000-8000-000000000046',
    regionCode: 'PHUMY',
    regionId: '20000000-0000-4000-8000-000000000023',
    category: 'NATURE',
    name: 'Thắng cảnh Mũi Vi Rồng (Mũi Rồng - Phù Mỹ)',
    latitude: 14.283333,
    longitude: 109.216667,
    referencePriceVnd: 0,
    typicalDurationMinutes: 90,
    openingHours: { opens: '06:00:00', closes: '18:00:00' },
    address: 'Thôn Tân Phụng, Xã Mỹ Thọ, Huyện Phù Mỹ, Tỉnh Bình Định (cách Quy Nhơn 70km)',
    bestTime: 'Mùa khô từ tháng 3 đến tháng 9, đặc biệt lúc bình minh sáng sớm',
    summary: 'Kiệt tác đá hoa cương thiên nhiên nhô ra biển khơi có hình dáng một con rồng khổng lồ đang vươn mình ra đại dương, sóng vỗ ầm ầm qua hang hầm kỳ thú.',
    sections: [
      {
        title: 'Huyền thoại mỏm đá rồng vươn biển',
        content: `Mũi Vi Rồng là một ghềnh đá hoa cương sừng sững có hình dáng tựa như vi rồng cất cánh ra biển. Giữa lòng mỏm đá có một hang động xuyên thủy, mỗi khi sóng lớn xô vào nước bắn vọt lên qua khe đá như miệng rồng đang phun nước trắng xóa.`
      },
      {
        title: 'Trải nghiệm leo ghềnh & Bãi tắm hoang sơ',
        content: `Bao quanh Mũi Rồng là những bãi cát vàng hoang sơ và làn nước biển trong vắt. Du khách có thể leo lên đỉnh mỏm đá ngắm nhìn thuyền câu mực của ngư dân làng chài Tân Phụng và thưởng thức rượu Mỹ Thọ trứ danh.`
      }
    ],
    source: 'Cổng TTĐT Huyện Phù Mỹ & Báo Bình Định'
  },
  {
    slug: 'chua-thien-hung-an-nhon',
    id: '30000000-0000-4000-8000-000000000047',
    contentId: '30000000-0000-4000-8000-000000000047',
    revisionId: '31000000-0000-4000-8000-000000000047',
    regionCode: 'ANNHON',
    regionId: '20000000-0000-4000-8000-000000000020',
    category: 'CULTURE',
    name: 'Chùa Thiên Hưng (Chốn Bồng Lai Cảnh Giới)',
    latitude: 13.888889,
    longitude: 109.111111,
    referencePriceVnd: 0,
    typicalDurationMinutes: 75,
    openingHours: { opens: '08:00:00', closes: '17:30:00' },
    address: 'Phường Nhơn Hưng, Thị xã An Nhơn, Tỉnh Bình Định (ven Quốc lộ 1A)',
    bestTime: 'Quanh năm, đẹp nhất vào sáng sớm hoặc lúc hoàng hôn buông xuống khuôn viên hồ sen',
    summary: 'Ngôi chùa được ví như "Phượng Hoàng Cổ Trấn" thu nhỏ của Bình Định với hoa viên cổ kính thanh thoát, nơi vinh dự lưu giữ Ngọc Xá Lợi của Đức Phật Thích Ca Mâu Ni.',
    sections: [
      {
        title: 'Kiến trúc Á Đông thanh thoát',
        content: `Chùa Thiên Hưng do Đại đức Thích Đồng Ngộ trụ trì, nổi tiếng với khuôn viên vườn thiền tuyệt mỹ rộng hàng ngàn mét vuông với hào nước trong xanh, cầu ngói cổ kính, hồ hoa sen thơm ngát và tháp Chuông 12 tầng vươn cao lên bầu trời.`
      },
      {
        title: 'Nơi lưu giữ Ngọc Xá Lợi Phật',
        content: `Chùa là chốn linh thiêng được Giáo hội Phật giáo Myanmar trao tặng Ngọc Xá Lợi Phật Thích Ca. Hàng năm, hàng vạn phật tử và du khách khắp nơi về đây dâng hương chiêm bái cầu nguyện bình an cho gia đình.`
      }
    ],
    source: 'Giáo hội Phật giáo Việt Nam tỉnh Bình Định'
  },
  {
    slug: 'dan-te-troi-dat-an-son-tay-son',
    id: '30000000-0000-4000-8000-000000000048',
    contentId: '30000000-0000-4000-8000-000000000048',
    revisionId: '31000000-0000-4000-8000-000000000048',
    regionCode: 'TAYSON',
    regionId: '20000000-0000-4000-8000-000000000019',
    category: 'CULTURE',
    name: 'Đàn Tế Trời Đất Tây Sơn (Khu du lịch Tâm linh Ấn Sơn)',
    latitude: 13.883333,
    longitude: 108.933333,
    referencePriceVnd: 0,
    typicalDurationMinutes: 90,
    openingHours: { opens: '07:00:00', closes: '17:30:00' },
    address: 'Núi Ấn (Ấn Sơn), Thôn Hòa Sơn, Xã Bình Tường, Huyện Tây Sơn, Tỉnh Bình Định',
    bestTime: 'Quanh năm, đặc biệt dịp đầu năm mới xin lộc đất trời',
    summary: 'Khu tâm linh uy nghiêm trên đỉnh núi Ấn Sơn hùng vĩ, nơi ba anh em Nguyễn Huệ lập đàn tế cáo trời đất nhận ấn kiếm lệnh trước khi xuất quân dựng nghiệp lớn.',
    sections: [
      {
        title: 'Địa linh nhân kiệt phát tích phong trào Tây Sơn',
        content: `Ấn Sơn là ngọn núi linh thiêng nằm trong dãy Hoành Sơn của vùng đất Tây Sơn. Tương truyền, trước khi dựng cờ khởi nghĩa, ba anh em Tây Sơn đã lập đàn tế trời đất tại đây và được ban kiếm lệnh cùng ấn báu thiên tử khởi xướng phong trào nông dân bão táp.`
      },
      {
        title: 'Cấu trúc Đàn Tế Trời Đất 3 tầng',
        content: `Đàn tế được xây dựng theo thuyết âm dương ngũ hành gồm 3 tầng: Tầng trên cùng hình tròn tượng trưng cho Trời (Viên Đàn), tầng giữa hình vuông tượng trưng cho Đất (Phương Đàn) và tầng dưới cùng hình vuông tượng trưng cho Nhân giới, bao quanh bởi rừng thông xanh mát.`
      }
    ],
    source: 'UBND Huyện Tây Sơn & Báo Bình Định'
  },
  {
    slug: 'bai-xep-ghenh-rang-quy-nhon',
    id: '30000000-0000-4000-8000-000000000049',
    contentId: '30000000-0000-4000-8000-000000000049',
    revisionId: '31000000-0000-4000-8000-000000000049',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'NATURE',
    name: 'Làng chài Bãi Xép (Hòn ngọc bí ẩn châu Á)',
    latitude: 13.688889,
    longitude: 109.219444,
    referencePriceVnd: 0,
    typicalDurationMinutes: 120,
    openingHours: { opens: '06:00:00', closes: '22:00:00' },
    address: 'Khu phố 1, Phường Ghềnh Ráng, Thành phố Quy Nhơn, Tỉnh Bình Định (Quốc lộ 1D)',
    bestTime: 'Tháng 3 đến tháng 9',
    summary: 'Làng chài cổ bình yên nằm nép mình bên bãi biển nước trong vắt, được tạp chí danh tiếng Business Insider bình chọn là một trong 16 "hòn ngọc bí ẩn" của châu Á.',
    sections: [
      {
        title: 'Ngôi làng chài không tiếng còi xe ồn ào',
        content: `Bãi Xép cách trung tâm Quy Nhơn khoảng 13km về phía Nam trên cung đường đèo Quy Nhơn - Sông Cầu. Ngôi làng chài có lịch sử hàng trăm năm với những con ngõ nhỏ chỉ dành cho người đi bộ, những chiếc thuyền thúng tròn nằm nghỉ ngơi trên bãi cát và nhịp sống làng chài bình dị.`
      },
      {
        title: 'Thiên đường nghỉ dưỡng homestay quốc tế',
        content: `Bãi Xép là điểm đến yêu thích của du khách quốc tế nhờ hệ thống homestay mộc mạc sát biển, bãi tắm riêng biệt nước trong veo và trải nghiệm theo chân ngư dân đi đánh bắt cá, cào nghêu vào sáng sớm.`
      }
    ],
    source: 'Sở Du lịch Tỉnh Bình Định'
  },
  {
    slug: 'thap-duong-long-thap-nga-tay-son',
    id: '30000000-0000-4000-8000-000000000050',
    contentId: '30000000-0000-4000-8000-000000000050',
    revisionId: '31000000-0000-4000-8000-000000000050',
    regionCode: 'TAYSON',
    regionId: '20000000-0000-4000-8000-000000000019',
    category: 'CULTURE',
    name: 'Tháp Dương Long (Tháp Ngà - Tháp gạch nung cao nhất Đông Nam Á)',
    latitude: 13.938889,
    longitude: 108.994444,
    referencePriceVnd: 20000,
    typicalDurationMinutes: 75,
    openingHours: { opens: '07:30:00', closes: '17:00:00' },
    address: 'Xã Tây Bình, Huyện Tây Sơn, Tỉnh Bình Định',
    bestTime: 'Quanh năm',
    summary: 'Quần thể 3 ngọn tháp Chăm Pa bằng gạch nung cao nhất Đông Nam Á với tháp giữa cao 39m, đỉnh cao nghệ thuật điêu khắc đá phối hợp gạch nung tinh xảo.',
    sections: [
      {
        title: 'Cụm tháp gạch nung cao nhất Đông Nam Á',
        content: `Tháp Dương Long (người Pháp gọi là Tour d’Ivoire - Tháp Ngà) được xây dựng vào cuối thế kỷ XII. Cụm tháp gồm 3 tòa tháp đứng thẳng hàng: tháp giữa cao tới 39m, hai tháp bắc và nam cao khoảng 32m, là công trình tháp gạch đồ sộ nhất còn tồn tại của văn minh Champa.`
      },
      {
        title: 'Nghệ thuật điêu khắc đá hoa cương lộng lẫy',
        content: `Khác biệt với các tháp Chăm khác thường chỉ chạm gạch, Tháp Dương Long sử dụng các khối đá hoa cương lớn ghép nối ở cửa tháp và diềm mái. Trên đá chạm khắc tinh xảo hình tượng các linh thú Garuda, Naga, sư tử Kala và hoa sen nở rộ rực rỡ.`
      }
    ],
    source: 'Cục Di sản Văn hóa & Bảo tàng Bình Định'
  },
  {
    slug: 'hai-dang-hon-nuoc-phu-my',
    id: '30000000-0000-4000-8000-000000000051',
    contentId: '30000000-0000-4000-8000-000000000051',
    revisionId: '31000000-0000-4000-8000-000000000051',
    regionCode: 'PHUMY',
    regionId: '20000000-0000-4000-8000-000000000023',
    category: 'NATURE',
    name: 'Ngọn Hải đăng Hòn Nước (Mũi Điện Tân Phụng)',
    latitude: 14.266667,
    longitude: 109.200000,
    referencePriceVnd: 20000,
    typicalDurationMinutes: 90,
    openingHours: { opens: '07:00:00', closes: '17:30:00' },
    address: 'Thôn Tân Phụng, Xã Mỹ Thọ, Huyện Phù Mỹ, Tỉnh Bình Định',
    bestTime: 'Tháng 3 đến tháng 9',
    summary: 'Ngọn hải đăng cổ kính xây dựng trên đỉnh núi đá Gà Đòn từ thời Pháp thuộc, điểm đón bình minh đầu tiên của vùng biển Phù Mỹ hoang sơ.',
    sections: [
      {
        title: 'Mắt thần dẫn đường biển cả',
        content: `Hải đăng Hòn Nước (trước đây gọi là hải đăng Vũng Mới) được xây dựng trên đỉnh núi Gà Đòn ở độ cao hơn 62m so với mặt biển. Từ trạm hải đăng, du khách có thể phóng tầm mắt ngắm nhìn vịnh biển hoang sơ và các bãi đá cuội nhấp nhô tuyệt đẹp.`
      }
    ],
    source: 'Tổng Công ty Bảo đảm An toàn Hàng hải miền Bắc'
  },
  {
    slug: 'khu-du-lich-cua-bien-seagate-park',
    id: '30000000-0000-4000-8000-000000000052',
    contentId: '30000000-0000-4000-8000-000000000052',
    revisionId: '31000000-0000-4000-8000-000000000052',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'ADVENTURE',
    name: 'Khu du lịch Cửa Biển (Seagate Park Quy Nhơn)',
    latitude: 13.805556,
    longitude: 109.250000,
    referencePriceVnd: 50000,
    typicalDurationMinutes: 180,
    openingHours: { opens: '07:30:00', closes: '19:00:00' },
    address: 'Bờ bắc Cầu Thị Nại, Khu kinh tế Nhơn Hội, TP. Quy Nhơn, Tỉnh Bình Định',
    bestTime: 'Quanh năm, điểm vui chơi dã ngoại cuối tuần lý tưởng cho giới trẻ và gia đình',
    summary: 'Công viên du lịch thể thao mạo hiểm ngoài trời quy mô lớn ngay chân cầu Thị Nại với các trò chơi chèo thuyền kayak, leo núi nhân tạo, bắn cung và cắm trại ven đầm.',
    sections: [
      {
        title: 'Công viên giải trí sinh thái năng động',
        content: `Nằm ngay cửa ngõ bán đảo Phương Mai, Seagate Park mang lại không gian xanh mát và hệ sinh thái trò chơi vận động phong phú: leo núi nhân tạo cao 20m, đu dây zipline qua mặt hồ, chèo thuyền kayak khám phá rừng ngập mặn đầm Thị Nại.`
      }
    ],
    source: 'Cổng TTĐT Tỉnh Bình Định'
  },
  {
    slug: 'lang-chieu-hoai-chau-bac-rung-dua-tam-quan',
    id: '30000000-0000-4000-8000-000000000053',
    contentId: '30000000-0000-4000-8000-000000000053',
    revisionId: '31000000-0000-4000-8000-000000000053',
    regionCode: 'HOAINHON',
    regionId: '20000000-0000-4000-8000-000000000021',
    category: 'CULTURE',
    name: 'Làng nghề Chiếu cói Hoài Châu Bắc & Rừng dừa Tam Quan',
    latitude: 14.566667,
    longitude: 109.050000,
    referencePriceVnd: 0,
    typicalDurationMinutes: 90,
    openingHours: { opens: '07:00:00', closes: '17:30:00' },
    address: 'Xã Hoài Châu Bắc và Phường Tam Quan, Thị xã Hoài Nhơn, Tỉnh Bình Định',
    bestTime: 'Quanh năm',
    summary: 'Xứ dừa bạt ngàn Tam Quan gắn liền với làng nghề dệt chiếu cói truyền thống hàng trăm năm tuổi và món bánh tráng nước dừa thơm lừng nức tiếng.',
    sections: [
      {
        title: 'Xứ sở ngút ngàn dừa Tam Quan',
        content: `Tam Quan từ lâu đã nổi tiếng với câu ca: "Công đâu công uổng công thừa / Công ra gánh nước tưới dừa Tam Quan". Nơi đây bạt ngàn những rặng dừa xanh mướt cho ra những đặc sản nức tiếng: nước cốt dừa, dầu dừa nguyên chất, bánh tráng nước dừa mè đen giòn rụm.`
      },
      {
        title: 'Làng dệt chiếu cói truyền thống',
        content: `Làng chiếu Hoài Châu Bắc lưu giữ nghề dệt chiếu cói thủ công rực rỡ hoa văn. Du khách được tự tay trải nghiệm dệt chiếu, se sợi cói cùng các nghệ nhân lão thành của làng.`
      }
    ],
    source: 'UBND Thị xã Hoài Nhơn & Báo Bình Định'
  },
  {
    slug: 'thang-canh-hon-seo-nhon-ly',
    id: '30000000-0000-4000-8000-000000000054',
    contentId: '30000000-0000-4000-8000-000000000054',
    revisionId: '31000000-0000-4000-8000-000000000054',
    regionCode: 'QUYNHON',
    regionId: '20000000-0000-4000-8000-000000000018',
    category: 'NATURE',
    name: 'Thắng cảnh Hòn Sẹo (Bãi đá ngũ sắc Nhơn Lý)',
    latitude: 13.900000,
    longitude: 109.333333,
    referencePriceVnd: 0,
    typicalDurationMinutes: 120,
    openingHours: { opens: '07:00:00', closes: '17:00:00' },
    address: 'Xã Nhơn Lý, Thành phố Quy Nhơn, Tỉnh Bình Định (cách bờ khoảng 5km)',
    bestTime: 'Tháng 4 đến tháng 8 hàng năm',
    summary: 'Hòn đảo hoang sơ độc đáo không có bãi cát mà được rải kín bởi hàng vạn viên đá sỏi cuội tròn nhẵn ngũ sắc, thiên đường lặn ngắm san hô biển sâu.',
    sections: [
      {
        title: 'Bãi đá sỏi cuội ngũ sắc kỳ diệu',
        content: `Hòn Sẹo là một hòn đảo nhỏ nguyên sinh nằm ngoài khơi xã Nhơn Lý. Đảo đặc biệt không có bãi cát thoai thoải như nơi khác, thay vào đó là bãi đá cuội tròn vo nhiều màu sắc (đá ngũ sắc) được sóng biển mài giũa nhẵn thín.`
      }
    ],
    source: 'UBND Xã Nhơn Lý & Dulich.binhdinh.gov.vn'
  },
  {
    slug: 'thanh-da-ta-kon-vinh-thanh',
    id: '30000000-0000-4000-8000-000000000055',
    contentId: '30000000-0000-4000-8000-000000000055',
    revisionId: '31000000-0000-4000-8000-000000000055',
    regionCode: 'VINHTHANH',
    regionId: '20000000-0000-4000-8000-000000000027',
    category: 'ADVENTURE',
    name: 'Thành đá Tà Kơn & Suối nước nóng Vĩnh Thạnh',
    latitude: 14.216667,
    longitude: 108.750000,
    referencePriceVnd: 0,
    typicalDurationMinutes: 180,
    openingHours: { opens: '07:00:00', closes: '17:30:00' },
    address: 'Xã Vĩnh Sơn và Vĩnh Thịnh, Huyện Vĩnh Thạnh, Tỉnh Bình Định',
    bestTime: 'Mùa khô từ tháng 2 đến tháng 8',
    summary: 'Bức tường thành đá tự nhiên khổng lồ sừng sững giữa rừng đại ngàn Vĩnh Thạnh gắn với truyền thuyết nghĩa quân Tây Sơn, kết hợp suối khoáng nóng thư giãn.',
    sections: [
      {
        title: 'Bức thành đá tự nhiên hùng vĩ',
        content: `Thành đá Tà Kơn là dãy vách đá hoa cương dựng đứng cao hàng chục mét kéo dài hàng cây số tựa như một chiến lũy kiên cố của thiên nhiên ban tặng cho đại ngàn Vĩnh Thạnh.`
      },
      {
        title: 'Tắm suối khoáng nóng phục hồi sức khỏe',
        content: `Du khách ghé suối nước nóng Vĩnh Thịnh ngâm chân, tắm khoáng nóng giàu khoáng chất tự nhiên và thưởng thức món gà đồi nướng than hoa của đồng bào Ba Na.`
      }
    ],
    source: 'Cổng TTĐT Huyện Vĩnh Thạnh & Báo Bình Định'
  }
];
