# BỘ DỮ LIỆU DU LỊCH & SỰ KIỆN LIÊN VÙNG GIA LAI & BÌNH ĐỊNH

> **Trục liên kết du lịch "Rừng Vàng - Biển Bạc":** Kết nối cao nguyên bazan hùng vĩ Gia Lai (Tây Sơn Thượng Đạo) với miền duyên hải xứ võ Quy Nhơn - Bình Định (Tây Sơn Hạ Đạo) qua tuyến Quốc lộ 19 huyền thoại.  
> **Nguồn công khai chính thống:** Cổng thông tin điện tử tỉnh Gia Lai (`gialai.gov.vn`), Sở Du lịch Bình Định (`dulich.binhdinh.gov.vn`), Cổng TTĐT tỉnh Bình Định (`binhdinh.gov.vn`), Báo Gia Lai, Báo Bình Định, Bảo tàng Quang Trung, Ban Quản lý VQG Kon Ka Kinh và các khu di tích danh thắng.

---

## 📂 1. Cấu Trúc Thư Mục Dữ Liệu

```
gialai_tourism_data/
├── articles/
│   ├── places/                  # 55 file HTML bài viết chi tiết địa điểm du lịch
│   │   ├── [30 bài viết Gia Lai: Biển Hồ, Chư Đang Ya, Minh Thành, K50, Phú Cường, Tây Sơn Thượng Đạo...]
│   │   └── [25 bài viết Bình Định: Kỳ Co, Eo Gió, Hòn Khô, Ghềnh Ráng, Tháp Đôi, Tháp Bánh Ít, Hầm Hô, Cù Lao Xanh, Bảo tàng Quang Trung, Chùa Ông Núi...]
│   └── events/                  # 24 file HTML bài viết chi tiết lễ hội & sự kiện
│       ├── [12 sự kiện Gia Lai: Festival Cồng chiêng, Tuần lễ Hoa Dã Quỳ, Lễ hội Cầu Mưa, Đua thuyền Pô Cô, City Trail...]
│       └── [12 sự kiện Bình Định: Lễ hội Đống Đa - Tây Sơn, Chùa Bà Nước Mặn, Liên hoan Quốc tế Võ cổ truyền, Đua thuyền F1H2O, Cầu Ngư...]
├── metadata/
│   ├── regions.json             # 28 đơn vị hành chính (17 Gia Lai + 11 Bình Định)
│   ├── places.json              # Thuộc tính JSON 55 địa điểm
│   ├── events.json              # Thuộc tính JSON 24 sự kiện
│   ├── binhdinh_regions.json    # JSON 11 huyện/thị/thành phố Bình Định
│   ├── binhdinh_places.json     # JSON 25 địa điểm Bình Định
│   └── binhdinh_events.json     # JSON 12 sự kiện Bình Định
├── scripts/
│   ├── places_data.js           # Dữ liệu gốc 30 địa điểm Gia Lai
│   ├── events_data.js           # Dữ liệu gốc 12 sự kiện Gia Lai
│   ├── binhdinh_places_data.js  # Dữ liệu gốc 25 địa điểm Bình Định
│   ├── binhdinh_events_data.js  # Dữ liệu gốc 12 sự kiện Bình Định
│   └── generate_dataset.js      # Script biên dịch tự động sinh dataset
├── import_gialai_tourism.sql    # File SQL import TẤT CẢ (Gia Lai + Bình Định)
├── import_binhdinh_tourism.sql  # File SQL import RIÊNG BÌNH ĐỊNH
└── README.md                    # Tài liệu hướng dẫn sử dụng này
```

---

## 📊 2. Thống Kê Tổng Hợp Bộ Dữ Liệu

| Hạng mục | Toàn bộ Dataset | Tỉnh Gia Lai | Tỉnh Bình Định | Ghi chú |
| :--- | :---: | :---: | :---: | :--- |
| **Đơn vị hành chính (Regions)** | **28** | 17 | 11 | Đầy đủ tất cả Thành phố, Thị xã và Huyện của 2 tỉnh |
| **Điểm đến du lịch (Places)** | **55** | 30 | 25 | Thiên nhiên, Văn hóa - Lịch sử, Mạo hiểm - Trekking, Biển đảo |
| **Bài viết điểm đến (HTML)** | **55** | 30 | 25 | Định dạng HTML5 độc lập, responsive, bảng Quick Facts |
| **Sự kiện & Lễ hội (Events)** | **24** | 12 | 12 | Các lễ hội văn hóa dân gian, giải thể thao, festival quốc tế |
| **Bài viết sự kiện (HTML)** | **24** | 12 | 12 | Thuyết minh ý nghĩa lịch sử, phong tục, nghi thức cổ truyền |
| **Giờ mở cửa (Opening Hours)** | **385** | 210 | 175 | 55 địa điểm x 7 ngày trong tuần |
| **File SQL Import** | **2** | - | - | 1 file tổng hợp toàn bộ + 1 file độc lập cho Bình Định |

---

## 🏝️ 3. Danh Sách Địa Điểm & Sự Kiện Bình Định Tiêu Biểu

### 📍 Các Địa Điểm Du Lịch Bình Định (25 Places):
1. **Bãi biển Kỳ Co (Nhơn Lý)** - "Maldives của Việt Nam", nước trong 2 màu xanh ngọc bích.
2. **Eo Gió (Nhơn Lý)** - Con đường đi bộ ven vách núi ngắm hoàng hôn đẹp nhất Việt Nam.
3. **Đảo Hòn Khô (Nhơn Hải)** - Con đường cát xuyên biển và cánh đồng rong mơ huyền ảo.
4. **Khu du lịch Ghềnh Ráng - Tiên Sa & Mộ Hàn Mặc Tử** - Bãi tắm Hoàng Hậu (Bãi Đá Trứng).
5. **Tháp Đôi Quy Nhơn (Tháp Hưng Thạnh)** - Tháp Chăm cổ thế kỷ XII giữa lòng phố biển.
6. **Tháp Bánh Ít (Tuy Phước)** - Quần thể 4 tháp Chăm trong top 1001 công trình kiến trúc cổ thế giới.
7. **Bảo tàng Quang Trung & Điện thờ Tây Sơn Tam Kiệt** - Cây me cổ thụ 300 năm, giếng nước đá ong, biểu diễn nhạc võ.
8. **Khu du lịch sinh thái Hầm Hô (Tây Sơn)** - Vương quốc đá hoa cương, chèo thuyền trên sông Kút.
9. **Đảo Cù Lao Xanh (Nhơn Châu)** - Ngọn hải đăng cổ 130 năm tuổi, Cột cờ Tổ quốc thiêng liêng.
10. **Chùa Linh Phong (Chùa Ông Núi)** - Tượng Phật Thích Ca ngồi cao 69m lớn nhất Đông Nam Á.
11. **Tiểu Chủng viện Làng Sông (Tuy Phước)** - Cái nôi in ấn và truyền bá chữ Quốc ngữ đầu tiên.
12. **Khu dã ngoại Trung Lương (Phù Cát)** - Thung lũng cắm trại ven biển tuyệt đẹp.
13. **Đồi cát Phương Mai** - Sa mạc cát vàng mịn, trượt cát cảm giác mạnh.
14. **Đầm Thị Nại & Cầu Thị Nại** - Cầu vượt biển dài gần 2,5km bắc qua đầm nước lợ lịch sử.
15. **Thành Hoàng Đế & Tháp Cánh Tiên (An Nhơn)** - Dấu tích kinh đô Champa và kinh đô Hoàng đế Thái Đức Nguyễn Nhạc.
16. **Mũi Vi Rồng (Phù Mỹ)** - Mỏm đá hoa cương hình con rồng vươn mình ra biển lớn.
17. **Chùa Thiên Hưng (An Nhơn)** - Chốn bồng lai thanh tịnh, nơi lưu giữ Ngọc Xá Lợi Phật.
18. **Đàn Tế Trời Đất Tây Sơn (Ấn Sơn)** - Nơi nghĩa quân Tây Sơn tế trời đất nhận ấn kiếm lệnh.
19. **Làng chài Bãi Xép (Ghềnh Ráng)** - Top 16 hòn ngọc bí ẩn châu Á của Business Insider.
20. **Hải đăng Hòn Nước (Mũi Điện Tân Phụng)** - Ngọn hải đăng sừng sững trên đỉnh núi đá biển.
21. **Khu du lịch Cửa Biển (Seagate Park)** - Công viên thể thao giải trí mạo hiểm.
22. **Làng chiếu Hoài Châu Bắc & Rừng dừa Tam Quan** - Làng nghề truyền thống xứ dừa Bình Định.
23. **Thắng cảnh Hòn Sẹo (Nhơn Lý)** - Bãi đá sỏi cuội tròn nhẵn ngũ sắc kỳ lạ.
24. **Thành đá Tà Kơn & Suối nước nóng Vĩnh Thạnh** - Thành đá tự nhiên hùng vĩ, tắm khoáng nóng.
25. **Tháp Dương Long (Tây Sơn)** - Quần thể 3 tháp Chăm gạch nung cao nhất Đông Nam Á (39m).

### 🎪 Các Sự Kiện & Lễ Hội Bình Định (12 Events):
1. **Lễ hội Kỷ niệm Chiến thắng Ngọc Hồi - Đống Đa (Lễ hội Đống Đa - Tây Sơn)** (Mùng 4 - 5 Tết âm lịch).
2. **Lễ hội Chùa Bà - Cảng thị Nước Mặn** (Di sản văn hóa phi vật thể Quốc gia - cuối tháng Giêng).
3. **Liên hoan Quốc tế Võ cổ truyền Việt Nam tại Đất Võ Bình Định** (Định kỳ mùa hè).
4. **Giải đua thuyền máy Nhà nghề Quốc tế UIM F1H2O & Aquabike Grand Prix of Binh Dinh** (Tháng 3).
5. **Lễ hội Cầu Ngư Nam Hải (Lễ hội Lăng Ông làng chài)** (Tháng Giêng - tháng Hai âm lịch).
6. **Lễ hội Chùa Ông Núi (Linh Phong Thiền Tự)** (Ngày 24 - 25 tháng Giêng âm lịch).
7. **Lễ hội Du lịch Biển Quy Nhơn - Bình Định ("Quy Nhơn - Thiên đường biển")** (Dịp 30/4 - 1/5).
8. **Giải chạy VnExpress Marathon Sparkling Quy Nhơn** (Tháng 6 hàng năm).
9. **Lễ hội Đổ giàn An Thái** (Rằm tháng 7 âm lịch - hội võ tranh heo quay kịch tính).
10. **Lễ hội Đua thuyền truyền thống Gò Bồi** (Mùng 2 Tết Nguyên Đán).
11. **Chương trình Đêm Võ đài Xứ Nẫu** (Định kỳ tối thứ 7 và Chủ nhật hàng tuần tại Quy Nhơn).
12. **Lễ hội Văn hóa Ẩm thực & Chợ đêm Xứ Nẫu Bình Định** (Bánh ít lá gai, nem Chợ Huyện, bún cá, rượu Bàu Đá).

---

## 🚀 4. Hướng Dẫn Import CSDL

Các file SQL đã được thiết kế tuân thủ 100% ràng buộc của `be/schema.sql`:

### Nhập toàn bộ dữ liệu (Gia Lai + Bình Định):
```bash
mysql --default-character-set=utf8mb4 -u root -p gialaitravel < gialai_tourism_data/import_gialai_tourism.sql
```

### Hoặc chỉ nhập riêng Bình Định:
```bash
mysql --default-character-set=utf8mb4 -u root -p gialaitravel < gialai_tourism_data/import_binhdinh_tourism.sql
```

### Qua giao diện phpMyAdmin / cPanel:
Mở database `gialaitravel` -> chọn tab **Import** -> Chọn file `import_gialai_tourism.sql` (hoặc `import_binhdinh_tourism.sql`) và bấm **Go**.
