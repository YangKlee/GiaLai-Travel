-- ==============================================================================
-- Gia Lai & Binh Dinh Tourism Dataset Full Import
-- Tuong thich hoan toan voi be/schema.sql (MariaDB 10.5+ / MySQL 8.0+)
-- Bao gom: 28 Regions, 55 Places, 24 Events
-- ==============================================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET time_zone = '+00:00';
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

START TRANSACTION;

-- 1. TAI KHOAN QUAN TRI BIEN SOAN & KIEM DUYET NOI DUNG
INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('10000000-0000-4000-8000-000000000001', 'portal@gialai.gov.vn', '$2b$10$DemoHashForTourismDatasetSeedOnly12345678901234567890', 'Cổng Thông Tin Du Lịch Liên Vùng', '02693824256', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), status = 'ACTIVE';

-- 2. DANH MUC CAC DON VI HANH CHINH (28 VUNG/HUYEN/THI)
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000001', 'PLEIKU', 'Thành phố Pleiku (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000002', 'CHUPAH', 'Huyện Chư Păh (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000003', 'KBANG', 'Huyện Kbang (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000004', 'DAKDOA', 'Huyện Đak Đoa (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000005', 'CHUSE', 'Huyện Chư Sê (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000006', 'IAGRAI', 'Huyện Ia Grai (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000007', 'MANGYANG', 'Huyện Mang Yang (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000008', 'ANKHE', 'Thị xã An Khê (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000009', 'AYUNPA', 'Thị xã Ayun Pa (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000010', 'PHUTHIEN', 'Huyện Phú Thiện (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000011', 'CHUPRONG', 'Huyện Chư Prông (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000012', 'DUCCO', 'Huyện Đức Cơ (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000013', 'KROENGPA', 'Huyện Krông Pa (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000014', 'KONGCHRO', 'Huyện Kông Chro (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000015', 'DAKPO', 'Huyện Đak Pơ (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000016', 'IAPA', 'Huyện Ia Pa (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000017', 'CHUPUH', 'Huyện Chư Pưh (Gia Lai)', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000018', 'QUYNHON', 'Thành phố Quy Nhơn', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000019', 'TAYSON', 'Huyện Tây Sơn', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000020', 'ANNHON', 'Thị xã An Nhơn', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000021', 'HOAINHON', 'Thị xã Hoài Nhơn', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000022', 'PHUCAT', 'Huyện Phù Cát', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000023', 'PHUMY', 'Huyện Phù Mỹ', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000024', 'TUYPHUOC', 'Huyện Tuy Phước', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000025', 'HOAIAN', 'Huyện Hoài Ân', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000026', 'ANLAO', 'Huyện An Lão', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000027', 'VINHTHANH', 'Huyện Vĩnh Thạnh', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);
INSERT INTO regions (id, code, name, phase)
VALUES ('20000000-0000-4000-8000-000000000028', 'VANCANH', 'Huyện Vân Canh', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);

-- 3. DANH SACH DIA DIEM DU LICH TIEU BIEU (55 PLACES)
-- [Place] Biển Hồ Pleiku (Hồ T’Nưng)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80&asset=bien-ho-tnung', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('bien-ho-tnung', 256)), 'Cổng thông tin xúc tiến du lịch Gia Lai (dulichgialai.gov.vn) & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000001', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 1, 'PUBLISHED', 'Cổng thông tin xúc tiến du lịch Gia Lai (dulichgialai.gov.vn) & Báo Gia Lai', '{"category":"NATURE","latitude":13.996111,"longitude":108.000278,"address":"Xã Biển Hồ, Thành phố Pleiku, Tỉnh Gia Lai","referencePriceVnd":10000,"typicalDurationMinutes":90,"slug":"bien-ho-tnung","bannerUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000001', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000001';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000001', 'vi', 'Biển Hồ Pleiku (Hồ T’Nưng)', 'Giới thiệu tổng quan & Nét độc đáo\nBiển Hồ (hay còn gọi là Hồ T’Nưng) cách trung tâm thành phố Pleiku khoảng 7km về phía Bắc. Hồ tọa lạc trên cao nguyên Pleiku ở độ cao gần 800m so với mực nước biển, diện tích mặt nước rộng khoảng 230ha và có thể mở rộng lên tới gần 400ha vào mùa mưa. T’Nưng trong tiếng đồng bào Jrai có nghĩa là "biển trên núi", bởi mặt hồ bao la, mỗi khi có gió to lại dậy sóng lăn tăn như biển khơi thực thụ. Hồ là nguồn cung cấp nước ngọt quan trọng bậc nhất cho toàn thành phố Pleiku.\n\nNguồn gốc địa chất & Huyền thoại Đôi mắt Pleiku\nVề mặt địa chất học, Biển Hồ là dấu tích của ba miệng núi lửa cổ thông nhau đã ngưng hoạt động từ hàng triệu năm trước. Bờ hồ chính là miệng núi lửa nhô cao, lòng hồ sâu thẳm có nơi sâu đến 20 - 40m. \nTheo truyền thuyết cổ xưa của người Jrai, nơi đây trước kia là một buôn làng trù phú mang tên T’Nưng. Một năm nọ hạn hán kéo dài, dân làng bắt được một con hươu trắng và xẻ thịt tế lễ thần linh. Đêm hôm ấy trời đất rung chuyển, mặt đất sụt xuống thành vực sâu nuốt chửng cả buôn làng, nước tuôn trào ngập tràn tạo thành hồ. Người con gái sót lại khóc thương buôn làng ngày đêm, nước mắt hòa vào dòng nước hồ, từ đó hồ được ví von như giọt nước mắt thủy chung hay "Đôi mắt Pleiku" chan chứa tình yêu đại ngàn.\n\nCảnh quan nổi bật & Check-in không thể bỏ lỡ\nCon đường dẫn vào Biển Hồ uốn lượn rợp bóng những rặng thông ba lá xanh ngắt hàng chục năm tuổi. Điểm cuối của con đường là đài vọng cảnh vươn ra lòng hồ, nơi đặt bức tượng Bồ Tát Quán Thế Âm bằng đá trắng hướng nhìn ra mặt nước bao la mang lại cảm giác bình yên thanh tịnh. Đứng từ đài vọng cảnh, du khách có thể phóng tầm mắt ngắm nhìn mặt nước xanh biếc như ngọc bích phẳng lặng in bóng mây trời, phía xa là những dải núi nhấp nhô và rặng lau trắng phất phơ trong gió.\n\nKinh nghiệm tham quan & Ẩm thực địa phương\nThời điểm lý tưởng nhất để ghé thăm Biển Hồ là lúc bình minh (khi làn sương mù mỏng còn bảng lảng trên mặt hồ) hoặc lúc hoàng hôn buông xuống nhuộm tím không gian. Giá vé tham quan chỉ 10.000 VNĐ/người lớn. \nSau khi tham quan, du khách có thể thưởng thức các món ăn đặc sản Pleiku gần khu vực Biển Hồ như gà nướng cơm lam ống tre chấm muối é, phở hai tô (phở khô Gia Lai), hoặc ghé các quán cà phê ngắm cảnh hồ thưởng thức hương vị cà phê Robusta Pleiku nguyên chất.', 'Được mệnh danh là "Đôi mắt Pleiku", Biển Hồ là một trong những hồ nước ngọt tự nhiên đẹp và thơ mộng nhất Tây Nguyên, hình thành từ miệng núi lửa cổ đại hàng triệu năm tuổi.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'NATURE', 13.996111, 108.000278, 10000, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000001', 0, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000001', 1, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000001', 2, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000001', 3, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000001', 4, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000001', 5, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000001', 6, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Núi lửa Chư Đang Ya
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80&asset=nui-lua-chu-dang-ya', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('nui-lua-chu-dang-ya', 256)), 'UBND Huyện Chư Păh & Cổng thông tin điện tử tỉnh Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000002', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', 1, 'PUBLISHED', 'UBND Huyện Chư Păh & Cổng thông tin điện tử tỉnh Gia Lai', '{"category":"NATURE","latitude":14.135278,"longitude":108.033611,"address":"Làng Ploi lagri, Xã Chư Đang Ya, Huyện Chư Păh, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":150,"slug":"nui-lua-chu-dang-ya","bannerUrl":"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000002', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000002';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000002', 'vi', 'Núi lửa Chư Đang Ya', 'Kiệt tác địa chất triệu năm tuổi\nNúi lửa Chư Đang Ya (theo tiếng Jrai nghĩa là "củ gừng dại") nằm cách trung tâm Pleiku khoảng 30km về hướng Đông Bắc. Đây là ngọn núi lửa đã ngừng hoạt động hàng triệu năm, để lại lòng chảo phì nhiêu màu mỡ với lớp đất đỏ bazan giàu khoáng chất. Miệng núi lửa hình phễu khổng lồ nghiêng dốc tạo nên một bức tranh địa hình độc nhất vô nhị ở Tây Nguyên.\n\nMùa hoa dã quỳ nhuộm vàng triền núi\nHàng năm, từ cuối tháng 10 đến đầu tháng 12, Chư Đang Ya thay lớp áo rực rỡ khi hàng triệu đóa hoa dã quỳ tự nhiên đồng loạt bung nở. Sắc vàng của dã quỳ xen lẫn màu xanh của nương ngô, dong riềng, khoai sọ của đồng bào Jrai tạo thành những mảng màu tương phản tuyệt mỹ. Nơi đây là điểm hẹn chính của "Tuần lễ Hoa Dã Quỳ - Núi lửa Chư Đang Ya" thường niên thu hút hàng vạn lượt khách thập phương.\n\nTrải nghiệm leo núi, dù lượn và săn mây\nChinh phục sườn núi Chư Đang Ya mất khoảng 20 - 30 phút đi bộ theo các lối mòn thoai thoải. Khi lên tới đỉnh, du khách có thể phóng tầm mắt bao quát toàn bộ thung lũng Chư Păh, ngắm nhìn đỉnh núi Chư Nâm uy nghi phía xa. Trong những dịp lễ hội, các câu lạc bộ dù lượn thường tổ chức bay dù từ đỉnh núi, mang đến trải nghiệm ngắm nhìn lòng núi lửa Chư Đang Ya từ không trung đầy phấn khích.\n\nHướng dẫn di chuyển & Lưu ý\nTừ Pleiku, du khách di chuyển theo hướng ngã ba Phù Đổng qua Biển Hồ, rẽ vào đường Lê Văn Sỹ đi Biển Hồ Chè, qua đập Tân Sơn rồi thẳng tiến đến xã Chư Đang Ya. Đường đi trải nhựa rộng rãi, phong cảnh hai bên đường rất đẹp. Du khách nên mang giày thể thao bám đường tốt, mũ nón chống nắng và nước uống cá nhân khi leo núi.', 'Kiệt tác núi lửa hình phễu lòng chảo triệu năm tuổi, thiên đường hoa dã quỳ vàng rực rỡ và là biểu tượng du lịch thiên nhiên hùng vĩ của Gia Lai.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000002', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'NATURE', 14.135278, 108.033611, 0, 150, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000002', 0, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000002', 1, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000002', 2, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000023', '30000000-0000-4000-8000-000000000002', 3, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000002', 4, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000002', 5, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000002', 6, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Chùa Minh Thành
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80&asset=chua-minh-thanh', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('chua-minh-thanh', 256)), 'Ban Trị sự Giáo hội Phật giáo Việt Nam tỉnh Gia Lai & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000003', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003', 1, 'PUBLISHED', 'Ban Trị sự Giáo hội Phật giáo Việt Nam tỉnh Gia Lai & Báo Gia Lai', '{"category":"CULTURE","latitude":13.968611,"longitude":108.004722,"address":"Số 348 đường Nguyễn Viết Xuân, Phường Hội Phú, TP. Pleiku, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":60,"slug":"chua-minh-thanh","bannerUrl":"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000003', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000003';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000003', 'vi', 'Chùa Minh Thành', 'Lịch sử xây dựng & Quy mô kiến trúc\nChùa Minh Thành được khởi lập từ năm 1964 bởi Đại đức Thích Giác Đạo. Trải qua các đợt đại trùng tu từ năm 1997 dưới bàn tay tài hoa của Thượng tọa Thích Tâm Mãn, chùa đã trở thành một kiệt tác kiến trúc Phật giáo tâm linh quy mô lớn với diện tích khuôn viên hơn 20.000m2 ngay giữa lòng phố núi Pleiku.\n\nBảo tháp Xá Lợi 9 tầng & Chánh điện tráng lệ\nĐiểm nhấn rực rỡ nhất của Chùa Minh Thành là Bảo tháp Từ Ân thờ Xá Lợi 9 tầng cao tới 72m với mái ngói cong vuốt nhọn vươn thẳng lên nền trời xanh ngắt mang đậm phong cách kiến trúc Á Đông. Tòa Chánh điện uy nghiêm cao 16m với trần gỗ chạm trổ tinh xảo, bên trong tôn trí tượng Phật Tỳ Lô Giá Na cao 6m bằng đồng đỏ nặng 16 tấn cùng bốn vị Bồ Tát lớn.\n\nHồ Liên Trì & Không gian thiền định xanh mát\nTrước sân chùa là hồ nước Liên Trì thả cá koi bơi lượn, xung quanh có những rặng liễu rủ bóng, cầu đá nhỏ bắc qua hồ, hàng thạch đăng Nhật Bản cùng nhiều cây cổ thụ xanh mát tạo nên khung cảnh thanh tịnh thoát tục. Đây là chốn tâm linh tôn nghiêm cầu an lành và là điểm chiêm bái, vãn cảnh nổi tiếng của du khách thập phương.\n\nLưu ý khi viếng thăm\nChùa miễn phí vé vào cổng. Du khách đến tham quan cần ăn mặc trang nghiêm, kín đáo (không mặc váy ngắn, quần đùi, áo sát nách), giữ gìn trật tự và vệ sinh chung, không cười đùa to tiếng tại khu vực chánh điện và tháp thờ.', 'Ngôi chùa có kiến trúc Phật giáo độc đáo bậc nhất Tây Nguyên, giao hòa tinh tế giữa phong cách Nhật Bản, Trung Hoa cổ và mỹ thuật thời Lý - Trần Việt Nam.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000003', '60000000-0000-4000-8000-000000000003', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'CULTURE', 13.968611, 108.004722, 0, 60, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000030', '30000000-0000-4000-8000-000000000003', 0, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000031', '30000000-0000-4000-8000-000000000003', 1, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000032', '30000000-0000-4000-8000-000000000003', 2, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000033', '30000000-0000-4000-8000-000000000003', 3, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000034', '30000000-0000-4000-8000-000000000003', 4, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000035', '30000000-0000-4000-8000-000000000003', 5, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000036', '30000000-0000-4000-8000-000000000003', 6, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Biển Hồ Chè & Hàng Thông Trăm Tuổi
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80&asset=bien-ho-che-hang-thong-tram-tuoi', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('bien-ho-che-hang-thong-tram-tuoi', 256)), 'Trung tâm Xúc tiến Du lịch tỉnh Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000004', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000004', 1, 'PUBLISHED', 'Trung tâm Xúc tiến Du lịch tỉnh Gia Lai', '{"category":"NATURE","latitude":14.043611,"longitude":108.006944,"address":"Xã Nghĩa Hưng, Huyện Chư Păh, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"bien-ho-che-hang-thong-tram-tuoi","bannerUrl":"https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000004', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000004';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000004', 'vi', 'Biển Hồ Chè & Hàng Thông Trăm Tuổi', 'Lịch sử trăm năm của đồn điền chè Tây Nguyên\nBiển Hồ Chè nằm cách Pleiku chừng 13km về phía Bắc, thuộc địa phận xã Nghĩa Hưng, huyện Chư Păh. Nơi đây gắn liền với lịch sử khai hoang trồng trọt của người Pháp tại cao nguyên Pleiku từ năm 1919. Nguồn nước ngọt dồi dào dẫn từ Biển Hồ T’Nưng qua hệ thống kênh mương đã nuôi dưỡng những đồi chè xanh mướt quanh năm trên nền đất đỏ bazan màu mỡ.\n\nCon đường tình yêu rợp bóng hàng thông trăm tuổi\nĐể vào đến đồi chè, du khách sẽ đi qua một con đường dài gần 1km với hai hàng thông ba lá cổ thụ sừng sững được trồng từ đầu thế kỷ XX. Những tán thông giao nhau trên nền trời tạo thành vòm lá râm mát, mặt đường trải nhựa phẳng phiu, ánh nắng rọi xiên qua kẽ lá tạo nên khung cảnh vô cùng lãng mạn mà du khách thường gọi yêu thương là "Con đường Hàn Quốc của Gia Lai".\n\nTrải nghiệm ngắm bình minh & Thưởng thức trà shan tuyết\nVào sáng sớm, khi những làn sương mỏng manh còn bay là là trên các luống chè bạt ngàn, du khách có thể tận hưởng không khí trong lành thoang thoảng hương thơm tươi mới của búp chè non. Ven đồi chè có nhiều quán cà phê nhỏ phục vụ trà xanh tươi mát, cà phê thơm ngon và là điểm check-in tuyệt đẹp nối liền với Chùa Bửu Minh cổ kính.', 'Đồn điền chè đầu tiên của người Pháp tại Tây Nguyên từ năm 1919, nổi tiếng với con đường rợp bóng hàng thông cổ thụ trăm tuổi lãng mạn như phim truyền hình Hàn Quốc.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000004', '60000000-0000-4000-8000-000000000004', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000002', 'NATURE', 14.043611, 108.006944, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000040', '30000000-0000-4000-8000-000000000004', 0, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000041', '30000000-0000-4000-8000-000000000004', 1, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000042', '30000000-0000-4000-8000-000000000004', 2, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000043', '30000000-0000-4000-8000-000000000004', 3, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000044', '30000000-0000-4000-8000-000000000004', 4, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000045', '30000000-0000-4000-8000-000000000004', 5, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000046', '30000000-0000-4000-8000-000000000004', 6, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Quảng trường Đại Đoàn Kết
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000005', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80&asset=quang-truong-dai-doan-ket', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('quang-truong-dai-doan-ket', 256)), 'Sở Văn hóa Thể thao và Du lịch Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000005', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000005', 1, 'PUBLISHED', 'Sở Văn hóa Thể thao và Du lịch Gia Lai', '{"category":"CULTURE","latitude":13.982222,"longitude":108.003889,"address":"Phường Tây Sơn, Thành phố Pleiku, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":60,"slug":"quang-truong-dai-doan-ket","bannerUrl":"https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000005', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000005';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000005', 'vi', 'Quảng trường Đại Đoàn Kết', 'Trái tim phố núi Pleiku\nQuảng trường Đại Đoàn Kết được khánh thành vào tháng 12 năm 2012, là trung tâm chính trị, văn hóa, xã hội của tỉnh Gia Lai. Với khuôn viên rộng hơn 12ha được quy hoạch đồng bộ với thảm cỏ xanh mướt, đồi nhân tạo mô phỏng đỉnh Hàm Rồng, hàng thông ba lá xanh tươi và hệ thống đường dạo bộ thênh thang.\n\nTượng đài Bác Hồ & Bức phù điêu đá kỷ lục\nTâm điểm của quảng trường là Tượng đài Bác Hồ bằng đồng nguyên chất đúc theo công nghệ gò đồng hiện đại, cao 10.8m trên bệ đá 4.5m, nặng gần 16 tấn. Phía sau tượng đài là bức phù điêu hình hoa sen bằng đá tự nhiên dài hơn 58m, khắc họa sinh động bản hùng ca lịch sử, cuộc sống lao động, chiến đấu và văn hóa cồng chiêng của các dân tộc Tây Nguyên.\n\nDàn cồng chiêng đồng & Tháp đá cổ kính\nBên cạnh tượng đài là dàn cồng chiêng bằng đồng lớn nhất Việt Nam với đầy đủ chiêng mẹ, chiêng con xếp theo thứ bậc lễ hội truyền thống. Quảng trường còn có ngọn tháp đá 54 khối tượng trưng cho 54 dân tộc anh em đoàn kết một lòng, hồ sen thơm ngát và khu vườn hoa rực rỡ.\n\nKhông gian sinh hoạt cộng đồng sôi động\nVào mỗi buổi chiều tối, quảng trường là nơi người dân Pleiku và du khách tập trung vui chơi, tập thể dục, thưởng thức các màn hòa tấu cồng chiêng đường phố vào dịp cuối tuần và chiêm ngưỡng nhạc nước màu sắc lung linh.', 'Trái tim của thành phố Pleiku với diện tích 12ha, nơi đặt Tượng đài Bác Hồ với các dân tộc Tây Nguyên lớn nhất Việt Nam và bức phù điêu đá hoành tráng.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000005', '60000000-0000-4000-8000-000000000005', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000001', 'CULTURE', 13.982222, 108.003889, 0, 60, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000050', '30000000-0000-4000-8000-000000000005', 0, '05:00:00', '23:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000051', '30000000-0000-4000-8000-000000000005', 1, '05:00:00', '23:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000052', '30000000-0000-4000-8000-000000000005', 2, '05:00:00', '23:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000053', '30000000-0000-4000-8000-000000000005', 3, '05:00:00', '23:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000054', '30000000-0000-4000-8000-000000000005', 4, '05:00:00', '23:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000055', '30000000-0000-4000-8000-000000000005', 5, '05:00:00', '23:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000056', '30000000-0000-4000-8000-000000000005', 6, '05:00:00', '23:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Thác K50 (Thác Hang Én - KBTTN Kon Chư Răng)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80&asset=thac-k50-hang-en-kon-chu-rang', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thac-k50-hang-en-kon-chu-rang', 256)), 'Ban Quản lý Khu Bảo tồn Thiên nhiên Kon Chư Răng & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000006', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000006', 1, 'PUBLISHED', 'Ban Quản lý Khu Bảo tồn Thiên nhiên Kon Chư Răng & Báo Gia Lai', '{"category":"ADVENTURE","latitude":14.536944,"longitude":108.591667,"address":"Khu Bảo tồn Thiên nhiên Kon Chư Răng, Xã Sơn Lang, Huyện Kbang, Tỉnh Gia Lai","referencePriceVnd":150000,"typicalDurationMinutes":360,"slug":"thac-k50-hang-en-kon-chu-rang","bannerUrl":"https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000006', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000006';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000006', 'vi', 'Thác K50 (Thác Hang Én - KBTTN Kon Chư Răng)', 'Kỳ quan thiên nhiên ẩn sâu giữa rừng nguyên sinh\nThác K50 (còn gọi là Thác Hang Én) nằm sâu trong Khu Bảo tồn Thiên nhiên Kon Chư Răng, giáp ranh giữa tỉnh Gia Lai và Bình Định. Thác có độ cao hơn 54m, bề mặt dòng nước rộng từ 20m đến 100m tùy theo mùa, đổ ào ạt thẳng đứng xuống đáy vực đá tạo nên bức màn nước trắng xóa cùng làn sương mờ ảo huyền bí.\n\nHành trình trekking mạo hiểm đầy lôi cuốn\nĐể tiếp cận được Thác K50, du khách phải trải qua hành trình trekking xuyên rừng nguyên sinh đầy phấn khích: vượt qua những con dốc đất bazan gập ghềnh, lội qua những dòng suối trong vắt, đi dưới tán cây cổ thụ hàng trăm năm tuổi râm mát. Phía sau bức màn nước của thác là một hang đá khổng lồ - nơi trú ngụ tự nhiên của hàng ngàn con chim én rừng ríu rít cả ngày.\n\nTrải nghiệm cắm trại & Săn cầu vồng chân thác\nVào những ngày trời nắng trong từ 9h đến 11h trưa, ánh mặt trời chiếu xiên qua bọt nước li ti tạo thành dải cầu vồng 7 màu rực rỡ vắt ngang qua dòng thác. Du khách có thể cắm trại qua đêm gần trạm kiểm lâm, lắng nghe tiếng thác gầm vang vọng giữa đêm rừng đại ngàn tĩnh mịch và ngắm nhìn bầu trời sao nguyên sơ lấp lánh.\n\nQuy định an toàn & Chuẩn bị cần thiết\nDu khách bắt buộc phải đăng ký với Ban Quản lý Khu Bảo tồn Kon Chư Răng và có cán bộ kiểm lâm hoặc người dẫn đường bản địa đi cùng. Cần trang bị giày leo núi chuyên dụng chống trượt, tất chống vắt rừng, áo khoác gió, thuốc men cá nhân, túi chống nước cho thiết bị điện tử và giữ gìn môi trường rừng tuyệt đối không xả rác.', 'Được mệnh danh là "Nàng thơ giữa chốn đại ngàn", Thác K50 đổ thẳng đứng từ độ cao 54m trong lòng rừng nguyên sinh Kon Chư Răng, tạo nên khung cảnh huyền ảo ngoạn mục.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000006', '60000000-0000-4000-8000-000000000006', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000003', 'ADVENTURE', 14.536944, 108.591667, 150000, 360, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000060', '30000000-0000-4000-8000-000000000006', 0, '06:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000061', '30000000-0000-4000-8000-000000000006', 1, '06:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000062', '30000000-0000-4000-8000-000000000006', 2, '06:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000063', '30000000-0000-4000-8000-000000000006', 3, '06:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000064', '30000000-0000-4000-8000-000000000006', 4, '06:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000065', '30000000-0000-4000-8000-000000000006', 5, '06:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000066', '30000000-0000-4000-8000-000000000006', 6, '06:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Thác Phú Cường
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000007', 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=1200&q=80&asset=thac-phu-cuong', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thac-phu-cuong', 256)), 'Cổng thông tin huyện Chư Sê & Dulichgialai.gov.vn', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000007', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000007', 1, 'PUBLISHED', 'Cổng thông tin huyện Chư Sê & Dulichgialai.gov.vn', '{"category":"NATURE","latitude":13.708889,"longitude":108.0675,"address":"Xã Dun, Huyện Chư Sê, Tỉnh Gia Lai (cách trung tâm thị trấn Chư Sê 3km)","referencePriceVnd":20000,"typicalDurationMinutes":120,"slug":"thac-phu-cuong","bannerUrl":"https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000007', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000007';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000007', 'vi', 'Thác Phú Cường', 'Dòng thác hùng vĩ trên nền nham thạch cổ\nThác Phú Cường nằm cách trung tâm Pleiku khoảng 45km về phía Nam theo quốc lộ 14. Thác đổ từ độ cao khoảng 45m theo dòng suối La Peet đổ ra sông Ayun. Điểm đặc sắc nhất là vách đá dựng đứng của thác được kiến tạo từ những khối đá nham thạch bazan nguội lạnh từ ngọn núi lửa đã tắt hàng triệu năm trước.\n\nCầu vồng rực rỡ và cảnh sắc bốn mùa\nVào mùa mưa, thác Phú Cường cuồn cuộn đổ như dải lụa bạc khổng lồ gầm vang khắp núi rừng. Đến mùa khô, dòng thác trở nên mềm mại êm ả hơn, nước trong veo len lỏi qua từng phiến đá. Dưới chân thác là hồ nước mát lạnh với những tảng đá phẳng lì cho du khách nghỉ ngơi ngắm cảnh.\n\nHạ tầng du lịch & Dịch vụ dã ngoại\nKhu du lịch sinh thái Thác Phú Cường đã xây dựng hệ thống bậc thang đá kiên cố có tay vịn dẫn xuống tận chân thác. Tại đây có các chòi nghỉ chân râm mát, dịch vụ giải khát và cho thuê bếp nướng dã ngoại phục vụ các nhóm gia đình, bạn bè muốn tổ chức picnic cuối tuần.', 'Dòng thác tráng lệ cao 45m tuôn trào trên vách đá nham thạch bazan của ngọn núi lửa cổ xưa, bao quanh bởi rừng cây hoang sơ và thảm thực vật xanh tốt.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000007', '60000000-0000-4000-8000-000000000007', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000005', 'NATURE', 13.708889, 108.0675, 20000, 120, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000070', '30000000-0000-4000-8000-000000000007', 0, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000071', '30000000-0000-4000-8000-000000000007', 1, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000072', '30000000-0000-4000-8000-000000000007', 2, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000073', '30000000-0000-4000-8000-000000000007', 3, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000074', '30000000-0000-4000-8000-000000000007', 4, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000075', '30000000-0000-4000-8000-000000000007', 5, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000076', '30000000-0000-4000-8000-000000000007', 6, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Vườn Quốc gia Kon Ka Kinh (Vườn Di sản ASEAN)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000008', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80&asset=vuon-quoc-gia-kon-ka-kinh', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('vuon-quoc-gia-kon-ka-kinh', 256)), 'Ban Quản lý Vườn Quốc gia Kon Ka Kinh', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000008', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000008', 1, 'PUBLISHED', 'Ban Quản lý Vườn Quốc gia Kon Ka Kinh', '{"category":"NATURE","latitude":14.3,"longitude":108.333333,"address":"Huyện Kbang, Mang Yang và Đak Đoa, Tỉnh Gia Lai","referencePriceVnd":60000,"typicalDurationMinutes":240,"slug":"vuon-quoc-gia-kon-ka-kinh","bannerUrl":"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000008', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000008';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000008', 'vi', 'Vườn Quốc gia Kon Ka Kinh (Vườn Di sản ASEAN)', 'Vườn Di sản ASEAN trên "Nóc nhà Gia Lai"\nĐược công nhận là Vườn Di sản ASEAN từ năm 2003, Vườn Quốc gia Kon Ka Kinh rộng gần 42.000ha, sở hữu đỉnh núi Kon Ka Kinh cao 1.748m so với mực nước biển - được coi là "nóc nhà của tỉnh Gia Lai". Nơi đây đóng vai trò là lưu vực đầu nguồn của các con sông lớn như sông Ba và sông Đak Pne.\n\nKho báu đa dạng sinh học vô giá\nKon Ka Kinh là nơi bảo tồn hơn 1.000 loài thực vật bậc cao và hàng trăm loài động vật quý hiếm ghi trong Sách Đỏ Việt Nam và thế giới. Đặc biệt, đây là một trong những nơi cư trú quan trọng nhất của loài Voọc chà vá chân xám (Pygathrix cinerea) - loài linh trưởng đặc hữu cực kỳ nguy cấp của Việt Nam.\n\nTuyến du lịch sinh thái & Trải nghiệm đỉnh cao\nDu khách đến Kon Ka Kinh có thể tham gia các tuyến trekking chinh phục đỉnh 1.748m, ngắm thác Đak Poóc, thám hiểm rừng rêu cổ tích và trải nghiệm giao lưu văn hóa với cộng đồng người Ba Na bản địa sinh sống ở vùng đệm của vườn quốc gia.', 'Một trong những Vườn Di sản ASEAN danh giá của Việt Nam, nơi lưu giữ hệ sinh thái rừng nhiệt đới gió mùa Tây Nguyên với quần thể loài Vọoc chà vá chân xám quý hiếm toàn cầu.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000008', '60000000-0000-4000-8000-000000000008', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000003', 'NATURE', 14.3, 108.333333, 60000, 240, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000080', '30000000-0000-4000-8000-000000000008', 0, '06:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000081', '30000000-0000-4000-8000-000000000008', 1, '06:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000082', '30000000-0000-4000-8000-000000000008', 2, '06:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000083', '30000000-0000-4000-8000-000000000008', 3, '06:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000084', '30000000-0000-4000-8000-000000000008', 4, '06:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000085', '30000000-0000-4000-8000-000000000008', 5, '06:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000086', '30000000-0000-4000-8000-000000000008', 6, '06:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Quần thể Di tích Quốc gia Đặc biệt Tây Sơn Thượng Đạo
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000009', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80&asset=quan-the-tay-son-thuong-dao', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('quan-the-tay-son-thuong-dao', 256)), 'Bảo tàng tỉnh Gia Lai & UBND Thị xã An Khê', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000009', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000009', 1, 'PUBLISHED', 'Bảo tàng tỉnh Gia Lai & UBND Thị xã An Khê', '{"category":"CULTURE","latitude":13.980556,"longitude":108.688889,"address":"Thị xã An Khê và các huyện Kbang, Đak Pơ, Kông Chro, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":120,"slug":"quan-the-tay-son-thuong-dao","bannerUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000009', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000009';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000009', 'vi', 'Quần thể Di tích Quốc gia Đặc biệt Tây Sơn Thượng Đạo', 'Cái nôi khởi nghĩa nông dân Tây Sơn\nTây Sơn Thượng Đạo là tên gọi vùng căn cứ nằm trên cao nguyên phía Đông Gia Lai, được xếp hạng Di tích Quốc gia đặc biệt năm 2022. Vào năm 1771, từ mảnh đất An Khê hiểm trở này, ba anh em nhà Tây Sơn đã liên kết các đồng bào Ba Na, Jrai và người Kinh bản địa dựng cờ tụ nghĩa, lập nên chiến công hiển hách thống nhất giang sơn.\n\nCác cụm di tích thành phần tiêu biểu\nQuần thể bao gồm nhiều điểm di tích lịch sử nổi bật: An Khê Trường (nơi tập luyện quân sĩ và giao thương), An Khê Đình (ngôi đình cổ kính thờ các bậc tiền hiền), Miếu Xà, Cây Ké phất cờ, Gò Kho - Xóm Ké (kho lương thực), Hòn Bình, Hòn Nhạc và Hòn Tào.\n\nBảo tàng Tây Sơn Thượng Đạo\nNhà trưng bày Tây Sơn Thượng Đạo tại thị xã An Khê lưu giữ hàng trăm hiện vật quý giá: vũ khí của nghĩa quân, đồ dùng sinh hoạt, trống đồng, gươm giáo và các tài liệu lịch sử phản ánh mối tình đoàn kết khăng khít Kinh - Thượng thời Tây Sơn.', 'Căn cứ địa đầu tiên của cuộc khởi nghĩa nông dân Tây Sơn cuối thế kỷ XVIII, nơi ba anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ tụ nghĩa dấy binh cứu nước.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000009', '60000000-0000-4000-8000-000000000009', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000008', 'CULTURE', 13.980556, 108.688889, 0, 120, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000090', '30000000-0000-4000-8000-000000000009', 0, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000091', '30000000-0000-4000-8000-000000000009', 1, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000092', '30000000-0000-4000-8000-000000000009', 2, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000093', '30000000-0000-4000-8000-000000000009', 3, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000094', '30000000-0000-4000-8000-000000000009', 4, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000095', '30000000-0000-4000-8000-000000000009', 5, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000096', '30000000-0000-4000-8000-000000000009', 6, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Nhà máy Thủy điện Ialy
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000010', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80&asset=nha-may-thuy-dien-ialy', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('nha-may-thuy-dien-ialy', 256)), 'Công ty Thủy điện Ialy & Cổng TTĐT Tỉnh Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000010', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000010', 1, 'PUBLISHED', 'Công ty Thủy điện Ialy & Cổng TTĐT Tỉnh Gia Lai', '{"category":"CULTURE","latitude":14.218889,"longitude":107.828889,"address":"Xã Ialy, Huyện Chư Păh, Tỉnh Gia Lai (trên dòng sông Sê San)","referencePriceVnd":30000,"typicalDurationMinutes":90,"slug":"nha-may-thuy-dien-ialy","bannerUrl":"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000010', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000010';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000010', 'vi', 'Nhà máy Thủy điện Ialy', 'Kỳ quan năng lượng trong lòng núi đại ngàn\nThủy điện Ialy có công suất 720 MW, là công trình thủy điện lớn thứ hai của Việt Nam vào thời điểm khánh thành (năm 2002). Toàn bộ gian máy phát điện hiện đại được đặt sâu trong lòng núi đá hoa cương ở độ cao âm hàng trăm mét, thể hiện kỳ tích lao động phi thường của đội ngũ kỹ sư, công nhân Việt Nam.\n\nHồ chứa mênh mông & Đập tràn hùng vĩ\nHồ chứa nước thủy điện Ialy rộng tới 64,5 km2 phẳng lặng như tấm gương khổng lồ phản chiếu mây trời và đồi núi chập chùng. Đập tràn xả lũ cao sừng sững, vào những ngày mở cửa xả nước tạo thành dòng thác nhân tạo cuồn cuộn tung bọt trắng xóa vô cùng tráng lệ.\n\nTham quan gian máy ngầm & Cầu treo ngắm cảnh\nDu khách được đi qua đường hầm xuyên lòng núi dài hàng trăm mét lung linh ánh đèn dẫn vào nhà máy ngầm ngắm nhìn 4 tổ máy khổng lồ đang ngày đêm vận hành, sau đó dạo bước trên đập thủy điện ngắm nhìn toàn cảnh dòng sông Sê San thơ mộng.', 'Công trình thủy điện ngầm kỳ vĩ lớn bậc nhất Tây Nguyên trên dòng sông Sê San huyền thoại, kết hợp hài hòa giữa bàn tay khối óc con người với cảnh quan thiên nhiên tráng lệ.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000010', '60000000-0000-4000-8000-000000000010', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000002', 'CULTURE', 14.218889, 107.828889, 30000, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000100', '30000000-0000-4000-8000-000000000010', 0, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000101', '30000000-0000-4000-8000-000000000010', 1, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000102', '30000000-0000-4000-8000-000000000010', 2, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000103', '30000000-0000-4000-8000-000000000010', 3, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000104', '30000000-0000-4000-8000-000000000010', 4, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000105', '30000000-0000-4000-8000-000000000010', 5, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000106', '30000000-0000-4000-8000-000000000010', 6, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đồi Cỏ Hồng Đak Đoa (Rừng Thông Glar)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000011', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80&asset=doi-co-hong-dak-doa', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('doi-co-hong-dak-doa', 256)), 'UBND Huyện Đak Đoa & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000011', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000011', 1, 'PUBLISHED', 'UBND Huyện Đak Đoa & Báo Gia Lai', '{"category":"NATURE","latitude":13.978611,"longitude":108.131111,"address":"Xã Glar, Huyện Đak Đoa, Tỉnh Gia Lai (cách TP. Pleiku khoảng 20km)","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"doi-co-hong-dak-doa","bannerUrl":"https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000011', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000011';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000011', 'vi', 'Đồi Cỏ Hồng Đak Đoa (Rừng Thông Glar)', 'Bản hòa ca sắc hồng chớm đông Tây Nguyên\nĐồi cỏ hồng Đak Đoa thực chất là một loài cỏ dại có tên gọi cỏ đuôi chồn mọc tự nhiên thành từng cụm lớn dưới thảm rừng thông ba lá thuộc địa bàn xã Glar. Khi cái lạnh đầu đông tràn về vào tháng 11, những bông hoa cỏ nhỏ li ti chuyển dần từ màu tím nhạt sang sắc hồng rực rỡ bồng bềnh như thảm nhung tuyết mịn màng.\n\nRừng thông bonsai dáng cổ độc nhất vô nhị\nĐiểm đặc biệt khiến đồi cỏ hồng Đak Đoa khác biệt so với các nơi khác chính là rừng thông cổ thụ ở đây có thân cây thấp, cành nhánh uốn lượn ngoạn mục tựa như những cây bonsai khổng lồ tự nhiên. Dưới ánh nắng sớm mai, những giọt sương đọng trên cỏ hồng long lanh như những hạt ngọc khiến khung cảnh đẹp tựa chốn bồng lai.\n\nTuần lễ Cỏ hồng & Trải nghiệm chụp ảnh\nNơi đây thường xuyên diễn ra "Tuần lễ Cỏ hồng Đak Đoa" với các hoạt động giao lưu cồng chiêng, múa xoang, hội thi thể thao dân tộc và phiên chợ nông sản đặc sản địa phương.', 'Thảm cỏ hồng tự nhiên phủ kín dưới tán rừng thông bonsai độc đáo, tạo nên bức tranh thiên nhiên lãng mạn mê đắm lòng người mỗi dịp chớm đông.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000011', '60000000-0000-4000-8000-000000000011', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000004', 'NATURE', 13.978611, 108.131111, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000110', '30000000-0000-4000-8000-000000000011', 0, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000111', '30000000-0000-4000-8000-000000000011', 1, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000112', '30000000-0000-4000-8000-000000000011', 2, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000113', '30000000-0000-4000-8000-000000000011', 3, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000114', '30000000-0000-4000-8000-000000000011', 4, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000115', '30000000-0000-4000-8000-000000000011', 5, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000116', '30000000-0000-4000-8000-000000000011', 6, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Di tích Lịch sử Nhà tù Pleiku
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000012', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80&asset=di-tich-lich-su-nha-tu-pleiku', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('di-tich-lich-su-nha-tu-pleiku', 256)), 'Bảo tàng tỉnh Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000012', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000012', 1, 'PUBLISHED', 'Bảo tàng tỉnh Gia Lai', '{"category":"CULTURE","latitude":13.985556,"longitude":108.008333,"address":"Đường Yết Kiêu, Phường Yên Đỗ, Thành phố Pleiku, Tỉnh Gia Lai","referencePriceVnd":10000,"typicalDurationMinutes":60,"slug":"di-tich-lich-su-nha-tu-pleiku","bannerUrl":"https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000012', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000012';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000012', 'vi', 'Di tích Lịch sử Nhà tù Pleiku', 'Lịch sử hình thành trại giam Pleiku\nNhà tù Pleiku được thực dân Pháp xây dựng từ năm 1925 để giam giữ các tù nhân thường phạm và sau đó là các chiến sĩ cộng sản yêu nước. Đến thời kỳ kháng chiến chống Mỹ cứu nước, nơi này tiếp tục được mở rộng và trở thành trung tâm thẩm vấn, đày ải dã man cán bộ kháng chiến khu vực Bắc Tây Nguyên.\n\nKiến trúc trại giam & Tinh thần đấu tranh bất khuất\nKhu di tích hiện nay vẫn bảo tồn nguyên vẹn hệ thống tường rào thép gai kiên cố, các phòng giam tập thể, xà lim biệt giam, chuồng cọp kẽm gai và nhà làm việc của cai ngục. Nơi đây từng chứng kiến nhiều cuộc đấu tranh tuyệt thực kiên cường, các phong trào vượt ngục táo bạo của các đồng chí cách mạng kiên trung.\n\nĐịa chỉ đỏ giáo dục truyền thống cách mạng\nNhà trưng bày di tích trưng bày nhiều hình ảnh tư liệu, hiện vật gốc quý giá: cùm chân, xiềng xích, các kỷ vật do tù nhân tự chế tác trong ngục tối. Đây là điểm đến tâm linh, tri ân và giáo dục truyền thống yêu nước sâu sắc cho thế hệ trẻ.', 'Di tích lịch sử cấp Quốc gia ghi dấu tinh thần bất khuất, kiên cường của các chiến sĩ cộng sản và đồng bào yêu nước Tây Nguyên trước các chế độ lao tù tàn khốc.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000012', '60000000-0000-4000-8000-000000000012', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000001', 'CULTURE', 13.985556, 108.008333, 10000, 60, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000120', '30000000-0000-4000-8000-000000000012', 0, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000121', '30000000-0000-4000-8000-000000000012', 1, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000122', '30000000-0000-4000-8000-000000000012', 2, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000123', '30000000-0000-4000-8000-000000000012', 3, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000124', '30000000-0000-4000-8000-000000000012', 4, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000125', '30000000-0000-4000-8000-000000000012', 5, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000126', '30000000-0000-4000-8000-000000000012', 6, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đỉnh núi Chư Nâm
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000013', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80&asset=dinh-nui-chu-nam', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('dinh-nui-chu-nam', 256)), 'Cộng đồng Trekking Gia Lai & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000013', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000013', 1, 'PUBLISHED', 'Cộng đồng Trekking Gia Lai & Báo Gia Lai', '{"category":"ADVENTURE","latitude":14.15,"longitude":108.016667,"address":"Xã Chư Đang Ya, Huyện Chư Păh, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":240,"slug":"dinh-nui-chu-nam","bannerUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000013', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000013';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000013', 'vi', 'Đỉnh núi Chư Nâm', 'Đỉnh núi cao nhất cao nguyên Pleiku\nVới độ cao 1.472m so với mực nước biển, Chư Nâm là đỉnh núi cao nhất khu vực cao nguyên Pleiku. Đứng sừng sững bên cạnh núi lửa Chư Đang Ya, Chư Nâm tựa như người anh cả che chở cho cả vùng lòng chảo Chư Păh trù phú.\n\nCung đường trekking thử thách & Thảm cỏ xanh mướt\nHành trình leo núi Chư Nâm kéo dài khoảng 3 - 4 giờ leo bộ qua những con dốc thẳng đứng và những trảng cỏ trải dài bạt ngàn. Dọc đường đi, du khách có thể bắt gặp những loài hoa dại, nghe tiếng chim hót véo von và tận hưởng những luồng gió mát lành từ đỉnh núi thổi về.\n\nThiên đường săn biển mây & Ngắm nhìn miệng núi lửa từ trên cao\nVào sáng sớm, đỉnh Chư Nâm thường chìm đắm trong biển mây bồng bềnh trắng muốt trôi lững lờ. Khi mây tan, từ trên đỉnh có thể nhìn thấy trọn vẹn miệng núi lửa hình phễu của Chư Đang Ya, những nương rẫy ô bàn cờ và dòng sông Sê San lấp lánh phía xa.', 'Đỉnh núi cao nhất cao nguyên Pleiku với độ cao 1.472m, tọa độ trekking và săn biển mây ngoạn mục bậc nhất Tây Nguyên nhìn thẳng xuống thung lũng Chư Đang Ya.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000013', '60000000-0000-4000-8000-000000000013', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000013', '20000000-0000-4000-8000-000000000002', 'ADVENTURE', 14.15, 108.016667, 0, 240, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000130', '30000000-0000-4000-8000-000000000013', 0, '05:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000131', '30000000-0000-4000-8000-000000000013', 1, '05:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000132', '30000000-0000-4000-8000-000000000013', 2, '05:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000133', '30000000-0000-4000-8000-000000000013', 3, '05:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000134', '30000000-0000-4000-8000-000000000013', 4, '05:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000135', '30000000-0000-4000-8000-000000000013', 5, '05:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000136', '30000000-0000-4000-8000-000000000013', 6, '05:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Làng Kháng chiến Stơr & Nhà lưu niệm Anh hùng Núp
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000014', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80&asset=lang-stor-anh-hung-nup', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('lang-stor-anh-hung-nup', 256)), 'UBND Huyện Kbang & Sở VHTTDL Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000014', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000014', 1, 'PUBLISHED', 'UBND Huyện Kbang & Sở VHTTDL Gia Lai', '{"category":"CULTURE","latitude":14.213889,"longitude":108.472222,"address":"Làng Stơr, Xã Tơ Tung, Huyện Kbang, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"lang-stor-anh-hung-nup","bannerUrl":"https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000014', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000014';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000014', 'vi', 'Làng Kháng chiến Stơr & Nhà lưu niệm Anh hùng Núp', 'Mảnh đất huyền thoại kháng chiến chống Pháp\nLàng Stơr là nơi sinh ra và lớn lên của Anh hùng Núp - người con ưu tú của đồng bào Ba Na đã lãnh đạo dân làng đánh Pháp bằng nỏ tên tẩm thuốc độc, hầm chông, bẫy đá lập nên những chiến công vang dội đi vào lịch sử văn học dân tộc.\n\nNhà lưu niệm Anh hùng Núp & Hiện vật thời chiến\nNhà lưu niệm được phục dựng theo kiến trúc nhà Rông truyền thống của người Ba Na. Nơi đây trưng bày nhiều kỷ vật vô giá của cụ Núp: bộ nỏ săn bắn thời trai trẻ, chiếc áo sờn vai, huân huy chương, ảnh chụp với Bác Hồ và bạn bè quốc tế (như Chủ tịch Cuba Fidel Castro).\n\nTrải nghiệm không gian văn hóa Ba Na nguyên bản\nDu khách đến làng Stơr được chiêm ngưỡng ngôi nhà Rông bề thế giữa làng, thưởng thức điệu múa xoang nhịp nhàng theo tiếng cồng chiêng, ngắm nhìn các nghệ nhân dệt thổ cẩm Ba Na tinh xảo và thưởng thức cơm lam gà nướng thơm lừng.', 'Quê hương của Anh hùng Lực lượng Vũ trang Nhân dân Đinh Núp - nguyên mẫu bất tử trong tiểu thuyết "Đất nước đứng lên" của nhà văn Nguyên Ngọc.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000014', '60000000-0000-4000-8000-000000000014', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000014', '20000000-0000-4000-8000-000000000003', 'CULTURE', 14.213889, 108.472222, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000140', '30000000-0000-4000-8000-000000000014', 0, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000141', '30000000-0000-4000-8000-000000000014', 1, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000142', '30000000-0000-4000-8000-000000000014', 2, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000143', '30000000-0000-4000-8000-000000000014', 3, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000144', '30000000-0000-4000-8000-000000000014', 4, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000145', '30000000-0000-4000-8000-000000000014', 5, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000146', '30000000-0000-4000-8000-000000000014', 6, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Di tích Lịch sử Quốc gia Plei Ơi (Thủ phủ Vua Lửa Yang Pơtao Apui)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000015', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80&asset=di-tich-plei-oi-vua-lua', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('di-tich-plei-oi-vua-lua', 256)), 'Cục Di sản Văn hóa & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000015', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000015', 1, 'PUBLISHED', 'Cục Di sản Văn hóa & Báo Gia Lai', '{"category":"CULTURE","latitude":13.583333,"longitude":108.166667,"address":"Làng Plei Ơi, Xã Ayun Hạ, Huyện Phú Thiện, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"di-tich-plei-oi-vua-lua","bannerUrl":"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000015', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000015';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000015', 'vi', 'Di tích Lịch sử Quốc gia Plei Ơi (Thủ phủ Vua Lửa Yang Pơtao Apui)', 'Huyền thoại các vị Vua Lửa Tây Nguyên\nPlei Ơi là thủ phủ lịch sử của các đời Pơtao Apui (thường được gọi là Vua Lửa). Theo tín ngưỡng bản địa của người Jrai, Pơtao không phải là vua thống trị về quyền lực hành chính mà là những vị thủ lĩnh tâm linh tối cao sở hữu năng lực cầu đảo mưa thuận gió hòa, bảo vệ mùa màng và đời sống cho muôn dân.\n\nBảo vật Gươm Thần huyền bí\nGắn liền với các đời Pơtao Apui là thanh Gươm Thần (Jơng Pơtao) được bảo quản nghiêm ngặt tại khu nhà thiêng. Hàng năm vào dịp hạn hán, Vua Lửa sẽ tiến hành nghi lễ mở hòm thiêng rút gươm làm phép cầu Giàng ban mưa cứu vớt buôn làng.\n\nKhông gian văn hóa Jrai & Lễ hội Cầu Mưa\nDi tích Plei Ơi được xếp hạng Di tích Lịch sử cấp Quốc gia năm 1993. Lễ Cầu mưa của Vua Lửa Plei Ơi đã được ghi danh vào Danh mục Di sản văn hóa phi vật thể Quốc gia năm 2015, thu hút sự quan tâm của nhiều nhà nghiên cứu dân tộc học trong và ngoài nước.', 'Trung tâm tín ngưỡng huyền bí của các đời Vua Lửa (Pơtao Apui) người Jrai với nghi thức Cầu Mưa bằng thanh Gươm thần huyền thoại đã được công nhận là Di sản văn hóa phi vật thể quốc gia.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000015', '60000000-0000-4000-8000-000000000015', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000015', '20000000-0000-4000-8000-000000000010', 'CULTURE', 13.583333, 108.166667, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000150', '30000000-0000-4000-8000-000000000015', 0, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000151', '30000000-0000-4000-8000-000000000015', 1, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000152', '30000000-0000-4000-8000-000000000015', 2, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000153', '30000000-0000-4000-8000-000000000015', 3, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000154', '30000000-0000-4000-8000-000000000015', 4, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000155', '30000000-0000-4000-8000-000000000015', 5, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000156', '30000000-0000-4000-8000-000000000015', 6, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Thác Chín Tầng (Ia Sao)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000016', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80&asset=thac-chin-tang-ia-grai', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thac-chin-tang-ia-grai', 256)), 'Cổng TTĐT Huyện Ia Grai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000016', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000016', 1, 'PUBLISHED', 'Cổng TTĐT Huyện Ia Grai', '{"category":"NATURE","latitude":13.961111,"longitude":107.863889,"address":"Xã Ia Sao, Huyện Ia Grai, Tỉnh Gia Lai (cách TP. Pleiku khoảng 25km)","referencePriceVnd":0,"typicalDurationMinutes":120,"slug":"thac-chin-tang-ia-grai","bannerUrl":"https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000016', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000016';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000016', 'vi', 'Thác Chín Tầng (Ia Sao)', 'Chuỗi 9 tầng đá ngoạn mục\nThác Chín Tầng không đổ thẳng đứng một mạch như những dòng thác khác mà uốn lượn thoai thoải qua 9 bậc đá tự nhiên xếp tầng như những bậc thang khổng lồ. Mỗi tầng thác lại đổ xuống một hồ nước trong vắt mát rượi, đáy hồ rải sỏi cuội lấp lánh dưới ánh mặt trời.\n\nCảnh quan sinh thái hoang sơ\nHai bên bờ thác là những rặng cây rừng nguyên sinh và nương cà phê xanh mướt râm mát. Những tảng đá lớn bằng phẳng nằm rải rác dọc bờ suối là nơi lý tưởng để nhóm bạn trải thảm nghỉ ngơi, cắm trại dã ngoại và tổ chức tiệc nướng BBQ ngoài trời.\n\nLưu ý trải nghiệm tắm thác\nDu khách có thể tắm suối tại các tầng thác dưới có mực nước nông và dòng chảy êm. Cần cẩn trọng tại các tảng đá phủ rêu trơn trượt và luôn để mắt đến trẻ nhỏ khi tham gia vui chơi dưới nước.', 'Dòng thác độc đáo bắt nguồn từ trên núi cao, uốn lượn chảy qua 9 tầng đá tự nhiên giữa rừng cây râm mát, tạo thành chuỗi hồ bơi tự nhiên mát lạnh.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000016', '60000000-0000-4000-8000-000000000016', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000016', '20000000-0000-4000-8000-000000000006', 'NATURE', 13.961111, 107.863889, 0, 120, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000160', '30000000-0000-4000-8000-000000000016', 0, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000161', '30000000-0000-4000-8000-000000000016', 1, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000162', '30000000-0000-4000-8000-000000000016', 2, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000163', '30000000-0000-4000-8000-000000000016', 3, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000164', '30000000-0000-4000-8000-000000000016', 4, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000165', '30000000-0000-4000-8000-000000000016', 5, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000166', '30000000-0000-4000-8000-000000000016', 6, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Lòng hồ Sê San 4 & Bến thuyền Sông Pô Cô
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000017', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80&asset=long-ho-se-san-4-ben-thuyen-po-co', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('long-ho-se-san-4-ben-thuyen-po-co', 256)), 'Báo Gia Lai & Cổng TTĐT Huyện Ia Grai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000017', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000017', 1, 'PUBLISHED', 'Báo Gia Lai & Cổng TTĐT Huyện Ia Grai', '{"category":"NATURE","latitude":13.983333,"longitude":107.5,"address":"Xã Ia O, Huyện Ia Grai, Tỉnh Gia Lai (khu vực giáp ranh Kon Tum và Campuchia)","referencePriceVnd":0,"typicalDurationMinutes":150,"slug":"long-ho-se-san-4-ben-thuyen-po-co","bannerUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000017', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000017';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000017', 'vi', 'Lòng hồ Sê San 4 & Bến thuyền Sông Pô Cô', 'Dòng sông Pô Cô huyền thoại nơi biên ải\nSông Pô Cô khởi nguồn từ dãy núi Ngọc Linh hùng vĩ chảy về phía Tây Nam hợp lưu với sông Sê San. Nơi đây từng đi vào thơ ca nhạc họa bất hủ với bài ca "Người lái đò trên sông Pô Cô" ngợi ca anh hùng A Sanh dũng cảm chèo thuyền đưa bộ đội qua sông trong kháng chiến chống Mỹ.\n\nBến thuyền Sê San & Làng chài bồng bềnh\nKhu vực bến thuyền xã Ia O là điểm khởi hành của các tour ca-nô du ngoạn lòng hồ Thủy điện Sê San 4. Du khách được ngắm nhìn hẻm núi đá kỳ vĩ hai bên dòng sông, thăm làng chài của những ngư dân vùng lòng hồ, ngắm bè cá thác lác cườm và cá lăng sông thơm ngon.\n\nThưởng thức ẩm thực sông nước\nĐến với Sê San, du khách nhất định phải thử món cá chình nướng than hoa, cá lăng om chuối đậu, lẩu cá thác lác và cơm lam muối é tại các nhà hàng nổi trên mặt hồ.', 'Vùng non nước sông biên cương hùng tráng, nơi gắn liền với huyền thoại người lái đò A Sanh trên sông Pô Cô và làng chài trên lòng hồ thủy điện Sê San 4 trù phú.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000017', '60000000-0000-4000-8000-000000000017', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000017', '20000000-0000-4000-8000-000000000006', 'NATURE', 13.983333, 107.5, 0, 150, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000170', '30000000-0000-4000-8000-000000000017', 0, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000171', '30000000-0000-4000-8000-000000000017', 1, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000172', '30000000-0000-4000-8000-000000000017', 2, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000173', '30000000-0000-4000-8000-000000000017', 3, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000174', '30000000-0000-4000-8000-000000000017', 4, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000175', '30000000-0000-4000-8000-000000000017', 5, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000176', '30000000-0000-4000-8000-000000000017', 6, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đập Tân Sơn (Hồ Tân Sơn)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000018', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80&asset=dap-tan-son-chu-pah', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('dap-tan-son-chu-pah', 256)), 'Dulichgialai.gov.vn', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000018', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000018', 1, 'PUBLISHED', 'Dulichgialai.gov.vn', '{"category":"NATURE","latitude":14.072222,"longitude":108.031944,"address":"Xã Nghĩa Hưng, Huyện Chư Păh, Tỉnh Gia Lai (cách Pleiku khoảng 18km)","referencePriceVnd":0,"typicalDurationMinutes":60,"slug":"dap-tan-son-chu-pah","bannerUrl":"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000018', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000018';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000018', 'vi', 'Đập Tân Sơn (Hồ Tân Sơn)', 'Vẻ đẹp tĩnh lặng dưới chân núi Tiên Sơn\nĐập Tân Sơn là công trình thủy lợi được xây dựng ngăn dòng suối tự nhiên tạo nên mặt hồ biếc xanh phẳng lặng. Bao quanh hồ là những dải núi trập trùng, những cánh đồng lúa bậc thang xanh ngát và những rặng thông reo ca trong gió chiều.\n\nĐiểm cắm trại & Sống ảo bình yên\nBờ đập cỏ xanh trải dài là vị trí yêu thích của giới trẻ đến chụp ảnh kỷ yếu, cắm trại dựng lều qua đêm và ngắm hoàng hôn đỏ ối rọi bóng xuống mặt nước mênh mông.', 'Hồ nước thủy lợi phẳng lặng như gương nép mình dưới chân sườn núi Tiên Sơn hùng vĩ, điểm check-in cắm trại thư thái dành cho các bạn trẻ.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000018', '60000000-0000-4000-8000-000000000018', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000018', '20000000-0000-4000-8000-000000000002', 'NATURE', 14.072222, 108.031944, 0, 60, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000180', '30000000-0000-4000-8000-000000000018', 0, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000181', '30000000-0000-4000-8000-000000000018', 1, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000182', '30000000-0000-4000-8000-000000000018', 2, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000183', '30000000-0000-4000-8000-000000000018', 3, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000184', '30000000-0000-4000-8000-000000000018', 4, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000185', '30000000-0000-4000-8000-000000000018', 5, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000186', '30000000-0000-4000-8000-000000000018', 6, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Chùa Bửu Minh
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000019', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80&asset=chua-buu-minh', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('chua-buu-minh', 256)), 'Giáo hội Phật giáo Việt Nam tỉnh Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000019', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000019', 1, 'PUBLISHED', 'Giáo hội Phật giáo Việt Nam tỉnh Gia Lai', '{"category":"CULTURE","latitude":14.045,"longitude":108.008889,"address":"Xã Nghĩa Hưng, Huyện Chư Păh, Tỉnh Gia Lai (nằm cuối hàng thông trăm tuổi)","referencePriceVnd":0,"typicalDurationMinutes":45,"slug":"chua-buu-minh","bannerUrl":"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000019', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000019';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000019', 'vi', 'Chùa Bửu Minh', 'Lịch sử hình thành bên đồi chè\nChùa Bửu Minh tiền thân là chùa "Sơn Ngọc" được xây dựng từ những năm đầu thế kỷ XX phục vụ nhu cầu tâm linh của những phu chè miền Trung lên Tây Nguyên lập nghiệp. Năm 1961 chùa được đại trùng tu và đổi tên thành Bửu Minh Tự.\n\nKiến trúc giao thoa truyền thống & Hiện đại\nMái chùa có hình dáng con rồng vươn cao, đỉnh tháp vươn thẳng lên trời xanh như mũi thuyền rẽ sóng. Toàn bộ khuôn viên chùa hòa quyện tuyệt vời với những luống chè xanh mướt bao quanh, tạo nên không gian thanh thoát tịnh tâm vô cùng hiếm có.', 'Ngôi cổ tự có lịch sử hơn nửa thế kỷ ẩn mình giữa ngút ngàn đồi chè Biển Hồ với đỉnh mái tháp vuốt cao thanh thoát tựa con thuyền lướt sóng.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000019', '60000000-0000-4000-8000-000000000019', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000019', '20000000-0000-4000-8000-000000000002', 'CULTURE', 14.045, 108.008889, 0, 45, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000190', '30000000-0000-4000-8000-000000000019', 0, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000191', '30000000-0000-4000-8000-000000000019', 1, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000192', '30000000-0000-4000-8000-000000000019', 2, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000193', '30000000-0000-4000-8000-000000000019', 3, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000194', '30000000-0000-4000-8000-000000000019', 4, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000195', '30000000-0000-4000-8000-000000000019', 5, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000196', '30000000-0000-4000-8000-000000000019', 6, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Công viên Diên Hồng (Hồ Đức An)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000020', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80&asset=cong-vien-dien-hong-ho-duc-an', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('cong-vien-dien-hong-ho-duc-an', 256)), 'UBND Thành phố Pleiku', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000020', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000020', 1, 'PUBLISHED', 'UBND Thành phố Pleiku', '{"category":"NATURE","latitude":13.971111,"longitude":107.994444,"address":"Phường Ia Kring, Thành phố Pleiku, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":60,"slug":"cong-vien-dien-hong-ho-duc-an","bannerUrl":"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000020', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000020';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000020', 'vi', 'Công viên Diên Hồng (Hồ Đức An)', 'Lá phổi xanh giữa lòng phố núi\nNằm ngay trung tâm thành phố, Công viên Diên Hồng rộng hơn 12ha với tâm điểm là hồ nước ngọt Đức An trong xanh rợp bóng cây cổ thụ. Nơi đây là điểm đến thư giãn, hít thở không khí trong lành quen thuộc của các thế hệ người dân Pleiku.\n\nCầu treo Diên Hồng & Bến đạp vịt giải trí\nĐiểm nhấn của công viên là cây cầu treo bắc ngang một góc hồ lắc lư thú vị và bến thuyền đạp vịt cho các gia đình có trẻ nhỏ. Ven hồ có nhiều quán cà phê phong cách mộc mạc phục vụ cà phê Gia Lai đậm đà trong tiếng chim hót ríu rít.', 'Lá phổi xanh êm đềm giữa lòng thành phố Pleiku với mặt hồ Đức An rộng lớn, rặng liễu rủ bóng, cầu treo thơ mộng và các quán cà phê ngắm cảnh ven hồ.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000020', '60000000-0000-4000-8000-000000000020', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000020', '20000000-0000-4000-8000-000000000001', 'NATURE', 13.971111, 107.994444, 0, 60, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000200', '30000000-0000-4000-8000-000000000020', 0, '05:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000201', '30000000-0000-4000-8000-000000000020', 1, '05:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000202', '30000000-0000-4000-8000-000000000020', 2, '05:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000203', '30000000-0000-4000-8000-000000000020', 3, '05:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000204', '30000000-0000-4000-8000-000000000020', 4, '05:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000205', '30000000-0000-4000-8000-000000000020', 5, '05:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000206', '30000000-0000-4000-8000-000000000020', 6, '05:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đỉnh núi Hàm Rồng (Chư H’Drông)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000021', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80&asset=nui-ham-rong-chu-hdrong', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('nui-ham-rong-chu-hdrong', 256)), 'Cổng TTĐT Tỉnh Gia Lai & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000021', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000021', 1, 'PUBLISHED', 'Cổng TTĐT Tỉnh Gia Lai & Báo Gia Lai', '{"category":"NATURE","latitude":13.905556,"longitude":108.019444,"address":"Xã Chư H’Drông, Thành phố Pleiku, Tỉnh Gia Lai (ngã ba Hàm Rồng quốc lộ 14 và 19)","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"nui-ham-rong-chu-hdrong","bannerUrl":"https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000021', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000021';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000021', 'vi', 'Đỉnh núi Hàm Rồng (Chư H’Drông)', 'Biểu tượng linh thiêng của cao nguyên Pleiku\nNúi Hàm Rồng (tên tiếng Jrai là Chư H’Drông nghĩa là "núi mẹ") cao 1.028m. Khác với Biển Hồ là núi lửa âm (lõm xuống), núi Hàm Rồng là núi lửa dương nổi bật sừng sững trên nền trời cao nguyên, có thể nhìn thấy từ khắp mọi nơi tại Pleiku.\n\nTọa độ viễn thông & Ngắm toàn cảnh Pleiku từ trên cao\nTrên đỉnh núi Hàm Rồng đặt trạm phát sóng viễn thông của tỉnh. Một con đường trải nhựa uốn lượn hình xoắn ốc dẫn lên tận đỉnh núi rợp bóng thông và hoa dã quỳ. Đứng từ đỉnh núi, du khách có thể thu trọn vào tầm mắt toàn cảnh thành phố Pleiku hiện đại và các đồn điền cà phê, cao su bạt ngàn.', 'Ngọn núi lửa dương hình nón cụt cao 1.028m, được mệnh danh là nóc nhà của Pleiku và là biểu tượng địa lý xuất hiện trên biểu trưng chính thức của tỉnh Gia Lai.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000021', '60000000-0000-4000-8000-000000000021', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000021', '20000000-0000-4000-8000-000000000001', 'NATURE', 13.905556, 108.019444, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000210', '30000000-0000-4000-8000-000000000021', 0, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000211', '30000000-0000-4000-8000-000000000021', 1, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000212', '30000000-0000-4000-8000-000000000021', 2, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000213', '30000000-0000-4000-8000-000000000021', 3, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000214', '30000000-0000-4000-8000-000000000021', 4, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000215', '30000000-0000-4000-8000-000000000021', 5, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000216', '30000000-0000-4000-8000-000000000021', 6, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Hồ thủy lợi Ayun Hạ
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000022', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80&asset=ho-thuy-loi-ayun-ha', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('ho-thuy-loi-ayun-ha', 256)), 'UBND Thị xã Ayun Pa', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000022', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000022', 1, 'PUBLISHED', 'UBND Thị xã Ayun Pa', '{"category":"NATURE","latitude":13.566667,"longitude":108.266667,"address":"Địa phận Thị xã Ayun Pa và Huyện Phú Thiện, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":120,"slug":"ho-thuy-loi-ayun-ha","bannerUrl":"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000022', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000022';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000022', 'vi', 'Hồ thủy lợi Ayun Hạ', 'Đại thủy nông của vùng đất lòng chảo\nĐập thủy lợi Ayun Hạ chặn dòng sông Ayun tạo nên hồ chứa khổng lồ trữ lượng hơn 253 triệu m3 nước, tưới mát cho hơn 13.500ha lúa nước của hai vựa lúa lớn nhất tỉnh Gia Lai là Ayun Pa và Phú Thiện.\n\nDu lịch thuyền ngắm cảnh lòng hồ\nMặt hồ mênh mông in bóng mây trời và dãy núi Chư A Thai hùng vĩ. Du khách có thể thuê thuyền du ngoạn lòng hồ, ghé thăm các ốc đảo nhỏ hoang sơ, câu cá giải trí và thưởng thức đặc sản cá bống kho nghệ, cá mè Ayun Hạ trứ danh.', 'Công trình đại thủy nông lớn bậc nhất Tây Nguyên với diện tích mặt hồ 37km2, phong cảnh non nước hữu tình và hệ sinh thái thủy sản phong phú.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000022', '60000000-0000-4000-8000-000000000022', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000022', '20000000-0000-4000-8000-000000000009', 'NATURE', 13.566667, 108.266667, 0, 120, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000220', '30000000-0000-4000-8000-000000000022', 0, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000221', '30000000-0000-4000-8000-000000000022', 1, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000222', '30000000-0000-4000-8000-000000000022', 2, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000223', '30000000-0000-4000-8000-000000000022', 3, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000224', '30000000-0000-4000-8000-000000000022', 4, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000225', '30000000-0000-4000-8000-000000000022', 5, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000226', '30000000-0000-4000-8000-000000000022', 6, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Khu Di tích Khảo cổ Sơ kỳ Đá cũ Rộc Tưng - Gò Đá
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000023', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80&asset=khu-khao-co-roc-tung-go-da', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('khu-khao-co-roc-tung-go-da', 256)), 'Viện Khảo cổ học Việt Nam & Bảo tàng Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000023', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000023', '30000000-0000-4000-8000-000000000023', 1, 'PUBLISHED', 'Viện Khảo cổ học Việt Nam & Bảo tàng Gia Lai', '{"category":"CULTURE","latitude":13.983333,"longitude":108.65,"address":"Xã An Bình và Phường An Tân, Thị xã An Khê, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"khu-khao-co-roc-tung-go-da","bannerUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000023', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000023';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000023', 'vi', 'Khu Di tích Khảo cổ Sơ kỳ Đá cũ Rộc Tưng - Gò Đá', 'Phát hiện khảo cổ học mang tầm thế giới\nTừ năm 2014, các nhà khảo cổ học Viện Khảo cổ học Việt Nam và Viện Hàn lâm Khoa học Nga đã phát hiện hàng loạt công cụ ghè đẽo bằng đá cuội thạch anh (rìu tay, mũi nhọn, nạo, mảnh tước) có niên đại khoảng 80 vạn năm trước tại thung lũng An Khê.\n\nÝ nghĩa lịch sử nhân loại\nPhát hiện này đã bác bỏ giả thuyết của học giả phương Tây Movius cho rằng phương Đông thời tiền sử lạc hậu chỉ dùng tre gỗ không có rìu tay đá. Di tích chứng minh An Khê là một trong những cái nôi xuất hiện sớm nhất của loài người trên trái đất.', 'Di tích khảo cổ học chấn động thế giới minh chứng sự xuất hiện của Người vượn đứng thẳng (Homo erectus) tại Việt Nam cách đây khoảng 80 vạn năm.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000023', '60000000-0000-4000-8000-000000000023', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000023', '30000000-0000-4000-8000-000000000023', '20000000-0000-4000-8000-000000000008', 'CULTURE', 13.983333, 108.65, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000230', '30000000-0000-4000-8000-000000000023', 0, '08:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000231', '30000000-0000-4000-8000-000000000023', 1, '08:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000232', '30000000-0000-4000-8000-000000000023', 2, '08:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000233', '30000000-0000-4000-8000-000000000023', 3, '08:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000234', '30000000-0000-4000-8000-000000000023', 4, '08:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000235', '30000000-0000-4000-8000-000000000023', 5, '08:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000236', '30000000-0000-4000-8000-000000000023', 6, '08:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đồi chè Bàu Cạn & Mùa Hoa Muồng Vàng
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000024', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80&asset=doi-che-bau-can-hoa-muong-vang', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('doi-che-bau-can-hoa-muong-vang', 256)), 'UBND Huyện Chư Prông & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000024', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000024', 1, 'PUBLISHED', 'UBND Huyện Chư Prông & Báo Gia Lai', '{"category":"NATURE","latitude":13.833333,"longitude":107.95,"address":"Xã Bàu Cạn, Huyện Chư Prông, Tỉnh Gia Lai (cách Pleiku khoảng 25km)","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"doi-che-bau-can-hoa-muong-vang","bannerUrl":"https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000024', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000024';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000024', 'vi', 'Đồi chè Bàu Cạn & Mùa Hoa Muồng Vàng', 'Sắc vàng hoa muồng trên đồi chè Bàu Cạn\nĐồn điền chè Bàu Cạn được người Pháp thành lập từ năm 1923. Để che bóng râm và chắn gió cho các luống chè non, người ta trồng xen kẽ các hàng cây muồng vàng (hoa hoàng yến). Vào tháng 10 hàng năm, hoa muồng bung nở nhuộm vàng rực cả góc trời Tây Nguyên.\n\nĐiểm check-in mùa thu không thể bỏ lỡ\nSự kết hợp giữa màu xanh bạt ngàn của chè và màu vàng óng ả của hoa muồng rụng đầy lối đi đất đỏ bazan đã biến Bàu Cạn thành điểm hẹn chụp ảnh mùa thu lãng mạn bậc nhất Gia Lai.', 'Đồn điền chè trăm tuổi gắn liền với mùa hoa muồng vàng rực nở xen kẽ giữa các luống chè xanh mướt, tạo nên cung đường thu Tây Nguyên thơ mộng hút hồn.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000024', '60000000-0000-4000-8000-000000000024', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000024', '20000000-0000-4000-8000-000000000011', 'NATURE', 13.833333, 107.95, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000240', '30000000-0000-4000-8000-000000000024', 0, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000241', '30000000-0000-4000-8000-000000000024', 1, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000242', '30000000-0000-4000-8000-000000000024', 2, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000243', '30000000-0000-4000-8000-000000000024', 3, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000244', '30000000-0000-4000-8000-000000000024', 4, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000245', '30000000-0000-4000-8000-000000000024', 5, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000246', '30000000-0000-4000-8000-000000000024', 6, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Thác Mơ Chư Păh
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000025', 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=1200&q=80&asset=thac-mo-chu-pah', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thac-mo-chu-pah', 256)), 'Cổng TTĐT Huyện Chư Păh', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000025', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000025', 1, 'PUBLISHED', 'Cổng TTĐT Huyện Chư Păh', '{"category":"NATURE","latitude":14.1,"longitude":107.966667,"address":"Xã Ia Khươl, Huyện Chư Păh, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"thac-mo-chu-pah","bannerUrl":"https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000025', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000025';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000025', 'vi', 'Thác Mơ Chư Păh', 'Dải lụa trắng giữa thung lũng bình yên\nThác Mơ ẩn mình sau những cánh rừng cao su và nương rẫy trù phú của xã Ia Khươl. Dòng nước mát lạnh bắt nguồn từ các khe núi cao đổ xuống qua các gờ đá thoai thoải tạo thành bọt nước trắng xóa mềm mại như một giấc mơ.\n\nTrải nghiệm dã ngoại cuối tuần\nKhông gian quanh thác vô cùng tĩnh mịch, chỉ có tiếng suối reo hòa cùng tiếng chim hót. Đây là địa điểm lý tưởng để các bạn trẻ yêu thiên nhiên tìm về thư giãn sau những ngày làm việc bận rộn.', 'Dòng thác mềm mại như dải lụa trắng vắt qua ghềnh đá giữa thung lũng xanh thanh bình, hoang sơ và trong trẻo.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000025', '60000000-0000-4000-8000-000000000025', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000025', '20000000-0000-4000-8000-000000000002', 'NATURE', 14.1, 107.966667, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000250', '30000000-0000-4000-8000-000000000025', 0, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000251', '30000000-0000-4000-8000-000000000025', 1, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000252', '30000000-0000-4000-8000-000000000025', 2, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000253', '30000000-0000-4000-8000-000000000025', 3, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000254', '30000000-0000-4000-8000-000000000025', 4, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000255', '30000000-0000-4000-8000-000000000025', 5, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000256', '30000000-0000-4000-8000-000000000025', 6, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Thác Kon Bông (Thác Ba Tầng Kbang)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000026', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80&asset=thac-kon-bong-ba-tang-kbang', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thac-kon-bong-ba-tang-kbang', 256)), 'UBND Huyện Kbang', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000026', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000026', 1, 'PUBLISHED', 'UBND Huyện Kbang', '{"category":"ADVENTURE","latitude":14.366667,"longitude":108.533333,"address":"Xã Đăk Hồng, Huyện Kbang, Tỉnh Gia Lai","referencePriceVnd":20000,"typicalDurationMinutes":180,"slug":"thac-kon-bong-ba-tang-kbang","bannerUrl":"https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000026', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000026';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000026', 'vi', 'Thác Kon Bông (Thác Ba Tầng Kbang)', 'Kỳ vĩ dòng thác 3 tầng giữa rừng già\nThác Kon Bông có 3 tầng nước nối tiếp nhau đổ xuống từ vách đá cheo leo. Tầng trên cùng cao hơn 20m đổ ầm ầm xuống một hồ nước trong xanh, tiếp tục tràn qua tầng thứ hai và thứ ba tạo nên bức tranh thiên nhiên sơn thủy hùng tráng.\n\nCung đường trekking hoang dã\nĐến với thác Kon Bông, du khách sẽ được băng qua những cánh rừng nhiệt đới bạt ngàn với những gốc cây cổ thụ phủ đầy rêu phong, chiêm ngưỡng các loài lan rừng khoe sắc ngát hương.', 'Dòng thác 3 tầng kỳ vĩ ẩn mình trong đại ngàn Kbang, điểm trekking hoang dã dành cho những người đam mê khám phá vẻ đẹp tự nhiên.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000026', '60000000-0000-4000-8000-000000000026', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000026', '20000000-0000-4000-8000-000000000003', 'ADVENTURE', 14.366667, 108.533333, 20000, 180, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000260', '30000000-0000-4000-8000-000000000026', 0, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000261', '30000000-0000-4000-8000-000000000026', 1, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000262', '30000000-0000-4000-8000-000000000026', 2, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000263', '30000000-0000-4000-8000-000000000026', 3, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000264', '30000000-0000-4000-8000-000000000026', 4, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000265', '30000000-0000-4000-8000-000000000026', 5, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000266', '30000000-0000-4000-8000-000000000026', 6, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Cửa khẩu Quốc tế Lệ Thanh
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000027', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80&asset=cua-khau-quoc-te-le-thanh', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('cua-khau-quoc-te-le-thanh', 256)), 'Ban Quản lý Khu Kinh tế tỉnh Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000027', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000027', '30000000-0000-4000-8000-000000000027', 1, 'PUBLISHED', 'Ban Quản lý Khu Kinh tế tỉnh Gia Lai', '{"category":"OTHER","latitude":13.783333,"longitude":107.533333,"address":"Thị trấn Chư Ty, Huyện Đức Cơ, Tỉnh Gia Lai (điểm cuối Quốc lộ 19)","referencePriceVnd":0,"typicalDurationMinutes":60,"slug":"cua-khau-quoc-te-le-thanh","bannerUrl":"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000027', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000027';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000027', 'vi', 'Cửa khẩu Quốc tế Lệ Thanh', 'Cột mốc biên cương thiêng liêng\nCửa khẩu Quốc tế Lệ Thanh nằm ở điểm cuối của Quốc lộ 19, cách trung tâm Pleiku khoảng 75km về phía Tây. Nơi đây có cột mốc biên giới số 30 khẳng định chủ quyền lãnh thổ thiêng liêng của Tổ quốc và trạm kiểm soát liên hợp hiện đại.\n\nGiao lưu thương mại & Du lịch biên giới\nKhu kinh tế cửa khẩu Lệ Thanh là nơi giao thương nhộn nhịp các mặt hàng nông sản, lâm sản giữa hai nước Việt Nam - Campuchia. Du khách đến đây có thể làm thủ tục tham quan cột mốc và mua sắm các sản phẩm đặc sản vùng biên giới.', 'Cửa khẩu quốc tế thông thương giữa tỉnh Gia Lai (Việt Nam) với tỉnh Ratanakiri (Vương quốc Campuchia), cột mốc biên giới thiêng liêng và trung tâm kinh tế mậu dịch biên phòng.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000027', '60000000-0000-4000-8000-000000000027', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000027', '30000000-0000-4000-8000-000000000027', '20000000-0000-4000-8000-000000000012', 'OTHER', 13.783333, 107.533333, 0, 60, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000270', '30000000-0000-4000-8000-000000000027', 0, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000271', '30000000-0000-4000-8000-000000000027', 1, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000272', '30000000-0000-4000-8000-000000000027', 2, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000273', '30000000-0000-4000-8000-000000000027', 3, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000274', '30000000-0000-4000-8000-000000000027', 4, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000275', '30000000-0000-4000-8000-000000000027', 5, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000276', '30000000-0000-4000-8000-000000000027', 6, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Làng Văn hóa Du lịch Plei Ốp
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000028', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80&asset=lang-van-hoa-du-lich-plei-op', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('lang-van-hoa-du-lich-plei-op', 256)), 'UBND Thành phố Pleiku & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000028', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000028', '30000000-0000-4000-8000-000000000028', 1, 'PUBLISHED', 'UBND Thành phố Pleiku & Báo Gia Lai', '{"category":"CULTURE","latitude":13.977778,"longitude":108.011111,"address":"Phường Hoa Lư, Thành phố Pleiku, Tỉnh Gia Lai (cách trung tâm chỉ 2km)","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"lang-van-hoa-du-lich-plei-op","bannerUrl":"https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000028', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000028';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000028', 'vi', 'Làng Văn hóa Du lịch Plei Ốp', 'Bản làng Jrai giữa lòng phố thị\nĐược công nhận là làng du lịch cộng đồng từ năm 2007, Plei Ốp tựa như một bảo tàng sống về đời sống văn hóa của người Jrai. Giữa những dãy phố hiện đại, Plei Ốp vẫn giữ được rặng tre xanh, bến nước cổ, giàn cồng chiêng quý và những nếp nhà sàn truyền thống.\n\nNhà Rông trung tâm & Hoạt động văn nghệ\nTrọng tâm của làng là ngôi Nhà Rông bề thế cao hơn 15m với mái nhọn hình lưỡi búa vươn cao. Sân Nhà Rông là nơi tổ chức các lễ hội cúng bến nước, lễ thổi tai, mừng lúa mới và các đêm biểu diễn hòa tấu cồng chiêng, múa xoang quanh ánh lửa trại bập bùng.\n\nThiên đường ẩm thực Tây Nguyên\nPlei Ốp là địa chỉ ẩm thực nức tiếng ở Pleiku với các quán cơm lam gà nướng than hoa thơm nức mũi, thịt heo gác bếp nướng chấm muối ớt kiến vàng, rau rừng xào tỏi và rượu cần ủ men lá thơm nồng say đắm.', 'Ngôi làng Jrai cổ truyền nằm ngay giữa lòng phố núi Pleiku, lưu giữ nguyên vẹn ngôi Nhà Rông sừng sững, bến nước thiêng và nét đẹp văn hóa cồng chiêng độc đáo.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000028', '60000000-0000-4000-8000-000000000028', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000028', '30000000-0000-4000-8000-000000000028', '20000000-0000-4000-8000-000000000001', 'CULTURE', 13.977778, 108.011111, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000280', '30000000-0000-4000-8000-000000000028', 0, '07:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000281', '30000000-0000-4000-8000-000000000028', 1, '07:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000282', '30000000-0000-4000-8000-000000000028', 2, '07:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000283', '30000000-0000-4000-8000-000000000028', 3, '07:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000284', '30000000-0000-4000-8000-000000000028', 4, '07:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000285', '30000000-0000-4000-8000-000000000028', 5, '07:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000286', '30000000-0000-4000-8000-000000000028', 6, '07:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Khu Du lịch Sinh thái Đồng Xanh
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000029', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80&asset=khu-du-lich-sinh-thai-dong-xanh', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('khu-du-lich-sinh-thai-dong-xanh', 256)), 'Sở Văn hóa Thể thao và Du lịch Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000029', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000029', '30000000-0000-4000-8000-000000000029', 1, 'PUBLISHED', 'Sở Văn hóa Thể thao và Du lịch Gia Lai', '{"category":"CULTURE","latitude":13.966667,"longitude":108.066667,"address":"Thôn 5, Xã An Phú, Thành phố Pleiku, Tỉnh Gia Lai (trên Quốc lộ 19)","referencePriceVnd":40000,"typicalDurationMinutes":120,"slug":"khu-du-lich-sinh-thai-dong-xanh","bannerUrl":"https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000029', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000029';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000029', 'vi', 'Khu Du lịch Sinh thái Đồng Xanh', 'Tây Nguyên thu nhỏ giữa đồng cỏ\nKhu du lịch Đồng Xanh rộng hơn 14ha, tái hiện trọn vẹn nét văn hóa đặc trưng của các dân tộc Gia Lai: nhà Rông, nhà mồ Tây Nguyên, kho thóc, cối giã gạo chạy bằng sức nước, tượng gỗ dân gian biểu cảm và cây đàn T’rưng nước khổng lồ.\n\nĐền tưởng niệm các Vua Hùng\nĐiểm nhấn tâm linh là Đền thờ Quốc Tổ Hùng Vương được xây dựng uy nghiêm, nơi người dân các dân tộc Tây Nguyên cùng hướng về nguồn cội giỗ Tổ mùng 10 tháng 3 âm lịch hàng năm.', 'Công viên văn hóa sinh thái tái hiện bức tranh thu nhỏ về không gian văn hóa Tây Nguyên với Đền Hùng An Phú, vườn tượng điêu khắc gỗ dân gian và hồ sen rộng lớn.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000029', '60000000-0000-4000-8000-000000000029', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000029', '30000000-0000-4000-8000-000000000029', '20000000-0000-4000-8000-000000000001', 'CULTURE', 13.966667, 108.066667, 40000, 120, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000290', '30000000-0000-4000-8000-000000000029', 0, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000291', '30000000-0000-4000-8000-000000000029', 1, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000292', '30000000-0000-4000-8000-000000000029', 2, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000293', '30000000-0000-4000-8000-000000000029', 3, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000294', '30000000-0000-4000-8000-000000000029', 4, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000295', '30000000-0000-4000-8000-000000000029', 5, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000296', '30000000-0000-4000-8000-000000000029', 6, '07:30:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đèo Mang Yang (Cổng Trời Tây Nguyên)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000030', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80&asset=deo-mang-yang-cong-troi', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('deo-mang-yang-cong-troi', 256)), 'Bảo tàng Lịch sử Quân sự Việt Nam & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000030', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000030', '30000000-0000-4000-8000-000000000030', 1, 'PUBLISHED', 'Bảo tàng Lịch sử Quân sự Việt Nam & Báo Gia Lai', '{"category":"NATURE","latitude":13.988889,"longitude":108.283333,"address":"Quốc lộ 19, Ranh giới giữa Huyện Mang Yang và Huyện Đak Pơ, Tỉnh Gia Lai","referencePriceVnd":0,"typicalDurationMinutes":60,"slug":"deo-mang-yang-cong-troi","bannerUrl":"https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000030', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000030';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000030', 'vi', 'Đèo Mang Yang (Cổng Trời Tây Nguyên)', 'Cổng Trời huyền thoại của xứ sở Ba Na\nTrong tiếng Ba Na, Mang Yang có nghĩa là "Cổng Trời" hay cửa ngõ của Thần linh. Cung đèo dài chừng 5km cắt ngang qua dãy núi hiểm trở trên Quốc lộ 19, nối liền vùng đồng bằng Bình Định với cao nguyên Pleiku lộng gió.\n\nRanh giới khí hậu & Cảnh quan ngoạn mục\nĐèo Mang Yang là ranh giới khí hậu độc đáo: nhiều khi ở phía Đông đèo trời đang mưa phùn mịt mù sương mù, nhưng chỉ cần qua đỉnh đèo sang phía Tây lại bừng lên ánh nắng vàng rực rỡ đặc trưng của Tây Nguyên. Từ đỉnh đèo nhìn xuống, thung lũng Đak Pơ và những cánh đồng mía, nương ngô xanh ngắt trải dài tít tắp.\n\nVùng đất lịch sử hào hùng\nDưới chân đèo là nơi diễn ra trận đánh Đak Pơ lịch sử vào tháng 6 năm 1954 tiêu diệt hoàn toàn Binh đoàn cơ động 100 của quân đội viễn chinh Pháp, góp phần quan trọng vào thắng lợi chung của chiến dịch Điện Biên Phủ.', 'Cung đèo hiểm trở mang tên "Cổng Trời" (Mang Yang trong tiếng Ba Na), phân định khí hậu giữa sườn Đông và sườn Tây dãy Trường Sơn, ghi dấu chiến thắng Đak Pơ lẫy lừng.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000030', '60000000-0000-4000-8000-000000000030', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000030', '30000000-0000-4000-8000-000000000030', '20000000-0000-4000-8000-000000000007', 'NATURE', 13.988889, 108.283333, 0, 60, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000300', '30000000-0000-4000-8000-000000000030', 0, '05:00:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000301', '30000000-0000-4000-8000-000000000030', 1, '05:00:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000302', '30000000-0000-4000-8000-000000000030', 2, '05:00:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000303', '30000000-0000-4000-8000-000000000030', 3, '05:00:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000304', '30000000-0000-4000-8000-000000000030', 4, '05:00:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000305', '30000000-0000-4000-8000-000000000030', 5, '05:00:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000306', '30000000-0000-4000-8000-000000000030', 6, '05:00:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Bãi biển Kỳ Co (Thiên đường biển đảo Nhơn Lý)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000031', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80&asset=bai-bien-ky-co-nhon-ly', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('bai-bien-ky-co-nhon-ly', 256)), 'Sở Du lịch Tỉnh Bình Định & UBND TP. Quy Nhơn', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000031', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000031', '30000000-0000-4000-8000-000000000031', 1, 'PUBLISHED', 'Sở Du lịch Tỉnh Bình Định & UBND TP. Quy Nhơn', '{"category":"NATURE","latitude":13.883333,"longitude":109.3,"address":"Bán đảo Phương Mai, Xã Nhơn Lý, Thành phố Quy Nhơn, Tỉnh Bình Định","referencePriceVnd":100000,"typicalDurationMinutes":180,"slug":"bai-bien-ky-co-nhon-ly","bannerUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000031', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000031';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000031', 'vi', 'Bãi biển Kỳ Co (Thiên đường biển đảo Nhơn Lý)', 'Thiên đường biển hai màu ngoạn mục\nKỳ Co nằm cách trung tâm thành phố Quy Nhơn khoảng 25km về phía Đông Bắc trên bán đảo Phương Mai. Một mặt giáp biển khơi bao la, ba mặt còn lại được bao bọc bởi những rặng núi đá sừng sững uốn lượn. Nước biển Kỳ Co đặc biệt sạch trong đến mức đứng trên bờ có thể nhìn thấu tận đáy cát, với hai dải màu xanh ngọc bích gần bờ và xanh thẳm ngoài khơi.\n\nTrải nghiệm cano cao tốc & Lặn ngắm san hô Bãi Dứa\nĐể đến Kỳ Co, du khách thường đi cano cao tốc lướt sóng từ bến thuyền làng chài Nhơn Lý (khoảng 15 phút), chiêm ngưỡng các vách đá kỳ vĩ dọc đường đi. Trên đường về, cano sẽ dừng tại Bãi Dứa để du khách đeo kính lặn ngắm những rạn san hô tự nhiên đa sắc màu và các đàn cá bơi lội tung tăng.\n\nHồ bơi tự nhiên & Cầu gỗ sống ảo\nKhi thủy triều rút, giữa các hốc đá xuất hiện những "hồ bơi tự nhiên" nước mát lạnh, nông và an toàn cho trẻ nhỏ. Chiếc cầu gỗ vươn dài ra biển là điểm check-in sống ảo biểu tượng không thể bỏ qua của mọi du khách.\n\nẨm thực hải sản tươi sống Nhơn Lý\nSau chuyến tắm biển, du khách được thưởng thức đại tiệc hải sản tại các nhà hàng làng chài: bào ngư nướng mỡ hành, tôm hùm hấp nước dừa, mực nhảy hấp gừng, ốc hương sốt trứng muối và cháo hải sản thơm lừng.', 'Được mệnh danh là "Maldives của Việt Nam", Kỳ Co sở hữu bãi cát vàng mịn màng hình vầng trăng khuyết ôm trọn làn nước biển trong xanh hai màu kỳ ảo dưới chân vách đá dựng đứng.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000031', '60000000-0000-4000-8000-000000000031', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000031', '30000000-0000-4000-8000-000000000031', '20000000-0000-4000-8000-000000000018', 'NATURE', 13.883333, 109.3, 100000, 180, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000310', '30000000-0000-4000-8000-000000000031', 0, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000311', '30000000-0000-4000-8000-000000000031', 1, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000312', '30000000-0000-4000-8000-000000000031', 2, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000313', '30000000-0000-4000-8000-000000000031', 3, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000314', '30000000-0000-4000-8000-000000000031', 4, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000315', '30000000-0000-4000-8000-000000000031', 5, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000316', '30000000-0000-4000-8000-000000000031', 6, '07:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Danh thắng Eo Gió (Nơi ngắm hoàng hôn đẹp nhất Việt Nam)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000032', 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1200&q=80&asset=eo-gio-nhon-ly', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('eo-gio-nhon-ly', 256)), 'Cổng thông tin du lịch Bình Định (dulich.binhdinh.gov.vn)', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000032', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000032', '30000000-0000-4000-8000-000000000032', 1, 'PUBLISHED', 'Cổng thông tin du lịch Bình Định (dulich.binhdinh.gov.vn)', '{"category":"NATURE","latitude":13.888889,"longitude":109.316667,"address":"Thôn Lý Lương, Xã Nhơn Lý, Thành phố Quy Nhơn, Tỉnh Bình Định","referencePriceVnd":25000,"typicalDurationMinutes":90,"slug":"eo-gio-nhon-ly","bannerUrl":"https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000032', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000032';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000032', 'vi', 'Danh thắng Eo Gió (Nơi ngắm hoàng hôn đẹp nhất Việt Nam)', 'Vẻ đẹp kỳ vĩ của "Eo biển hút gió"\nEo Gió là một eo biển nhỏ được tạo nên bởi hai mỏm núi đá cao chót vót uốn cong hình cánh cung ôm trọn lấy biển khơi. Do cấu tạo địa hình phễu đặc biệt, nơi đây quanh năm đón những luồng gió biển lồng lộng thổi vào mát rượi, tạo nên những đợt sóng bạc đầu xô bờ tung bọt trắng xóa.\n\nCon đường đi bộ ven biển ngoạn mục\nĐiểm nhấn nổi tiếng nhất của Eo Gió là con đường đi bộ uốn lượn ven vách núi đá với hàng ngàn bậc thang có tay vịn đỏ - trắng tuyệt đẹp. Đứng từ đây nhìn xuống là bãi đá Đẻ với hàng triệu viên đá cuội tròn nhẵn nhiều kích cỡ xếp chồng lên nhau do sóng biển mài giũa qua hàng ngàn năm.\n\nNgắm hoàng hôn đại dương lãng mạn\nEo Gió được du khách mệnh danh là tọa độ ngắm hoàng hôn lộng lẫy bậc nhất duyên hải miền Trung. Khi ráng chiều đỏ rực buông xuống trên mặt biển lấp lánh, toàn bộ không gian nhuộm màu tím biếc huyền ảo đầy mê hoặc.', 'Eo biển lộng gió hình cánh cung ôm trọn đại dương với cung đường đi bộ ven vách núi đá ngoạn mục, được mệnh danh là nơi ngắm hoàng hôn đẹp nhất Việt Nam.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000032', '60000000-0000-4000-8000-000000000032', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000032', '30000000-0000-4000-8000-000000000032', '20000000-0000-4000-8000-000000000018', 'NATURE', 13.888889, 109.316667, 25000, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000320', '30000000-0000-4000-8000-000000000032', 0, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000321', '30000000-0000-4000-8000-000000000032', 1, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000322', '30000000-0000-4000-8000-000000000032', 2, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000323', '30000000-0000-4000-8000-000000000032', 3, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000324', '30000000-0000-4000-8000-000000000032', 4, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000325', '30000000-0000-4000-8000-000000000032', 5, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000326', '30000000-0000-4000-8000-000000000032', 6, '06:00:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đảo Hòn Khô (Làng chài Nhơn Hải)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000033', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80&asset=dao-hon-kho-nhon-hai', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('dao-hon-kho-nhon-hai', 256)), 'UBND Xã Nhơn Hải & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000033', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000033', '30000000-0000-4000-8000-000000000033', 1, 'PUBLISHED', 'UBND Xã Nhơn Hải & Báo Bình Định', '{"category":"NATURE","latitude":13.8,"longitude":109.316667,"address":"Thôn Hải Đông, Xã Nhơn Hải, Thành phố Quy Nhơn, Tỉnh Bình Định","referencePriceVnd":50000,"typicalDurationMinutes":180,"slug":"dao-hon-kho-nhon-hai","bannerUrl":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000033', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000033';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000033', 'vi', 'Đảo Hòn Khô (Làng chài Nhơn Hải)', 'Hòn đảo mộc mạc không bóng cây xanh\nHòn Khô đúng như tên gọi, là một hòn đảo đá nhỏ hoang sơ không có cây cổ thụ râm mát, chỉ có những bụi cỏ dại kiên cường mọc xen kẽ giữa các khối đá hoa cương. Đảo cách đất liền làng chài Nhơn Hải chỉ khoảng 10 phút đi thuyền gỗ hoặc cano.\n\nCon đường cát xuyên biển độc nhất vô nhị\nMỗi khi thủy triều rút xuống, một dải cát trắng mịn màng dài hơn 500m nối liền hai mỏm đá nhô lên khỏi mặt nước, mở ra con đường đi bộ xuyên biển kỳ thú giữa làn nước trong vắt hai bên.\n\nLặn ngắm san hô & Mùa rong mơ vàng rực\nTừ tháng 5 đến tháng 7 hàng năm, vùng biển quanh Hòn Khô bước vào mùa rong mơ. Những tán rong mơ nở rộ dưới đáy biển tạo thành cánh đồng vàng óng rập rờn theo con sóng, là môi trường sống của muôn vàn loài cá biển nhiều màu sắc.', 'Hòn đảo hoang sơ tuyệt đẹp với con đường cát đi xuyên biển kỳ thú khi thủy triều rút, cây cầu gỗ men theo vách đá và những cánh đồng rong mơ huyền ảo.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000033', '60000000-0000-4000-8000-000000000033', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000033', '30000000-0000-4000-8000-000000000033', '20000000-0000-4000-8000-000000000018', 'NATURE', 13.8, 109.316667, 50000, 180, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000330', '30000000-0000-4000-8000-000000000033', 0, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000331', '30000000-0000-4000-8000-000000000033', 1, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000332', '30000000-0000-4000-8000-000000000033', 2, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000333', '30000000-0000-4000-8000-000000000033', 3, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000334', '30000000-0000-4000-8000-000000000033', 4, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000335', '30000000-0000-4000-8000-000000000033', 5, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000336', '30000000-0000-4000-8000-000000000033', 6, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Khu du lịch Ghềnh Ráng - Tiên Sa & Mộ Hàn Mặc Tử
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000034', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80&asset=ghenh-rang-tien-sa-mo-han-mac-tu', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('ghenh-rang-tien-sa-mo-han-mac-tu', 256)), 'Bảo tàng Tỉnh Bình Định & Dulich.binhdinh.gov.vn', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000034', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000034', '30000000-0000-4000-8000-000000000034', 1, 'PUBLISHED', 'Bảo tàng Tỉnh Bình Định & Dulich.binhdinh.gov.vn', '{"category":"CULTURE","latitude":13.738889,"longitude":109.222222,"address":"Số 3 đường Hàn Mặc Tử, Phường Ghềnh Ráng, Thành phố Quy Nhơn, Tỉnh Bình Định","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"ghenh-rang-tien-sa-mo-han-mac-tu","bannerUrl":"https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000034', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000034';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000034', 'vi', 'Khu du lịch Ghềnh Ráng - Tiên Sa & Mộ Hàn Mặc Tử', 'Bãi tắm Hoàng Hậu (Bãi Đá Trứng chim)\nGhềnh Ráng trải dài theo bờ biển trong xanh với dải đá uốn lượn nhấp nhô. Nổi bật nhất là Bãi tắm Hoàng Hậu - nơi Nam Phương Hoàng hậu (vợ vua Bảo Đại) từng chọn làm bãi tắm riêng khi về kinh lý Quy Nhơn năm 1927. Bãi biển phủ kín hàng triệu viên đá cuội tròn nhẵn bóng như những quả trứng chim khổng lồ.\n\nMộ nhà thơ tài hoa bạc mệnh Hàn Mặc Tử\nNằm trên đồi Thi Nhân rợp bóng thông xanh lộng gió là nơi yên nghỉ của nhà thơ Hàn Mặc Tử (1912 - 1940) - ngôi sao chói lọi của phong trào Thơ Mới Việt Nam. Du khách đến đây dâng hương tưởng niệm và ghé thăm gian nhà lưu niệm bút lửa Dzũ Kha với những vần thơ tình da diết khắc trên gỗ thông.\n\nVọng cảnh toàn cảnh vịnh Quy Nhơn\nTừ trên đỉnh đồi Ghềnh Ráng, du khách có thể phóng tầm mắt ngắm trọn bờ biển hình vầng trăng khuyết mềm mại của thành phố Quy Nhơn trải dài từ Ghềnh Ráng đến Mũi Tấn rực rỡ dưới ánh nắng.', 'Quần thể danh thắng hữu tình nằm sát biển Quy Nhơn, nơi an nghỉ của thi sĩ tài hoa Hàn Mặc Tử và Bãi tắm Hoàng Hậu (Bãi Đá Trứng) độc đáo của Nam Phương Hoàng hậu.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000034', '60000000-0000-4000-8000-000000000034', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000034', '30000000-0000-4000-8000-000000000034', '20000000-0000-4000-8000-000000000018', 'CULTURE', 13.738889, 109.222222, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000340', '30000000-0000-4000-8000-000000000034', 0, '06:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000341', '30000000-0000-4000-8000-000000000034', 1, '06:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000342', '30000000-0000-4000-8000-000000000034', 2, '06:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000343', '30000000-0000-4000-8000-000000000034', 3, '06:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000344', '30000000-0000-4000-8000-000000000034', 4, '06:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000345', '30000000-0000-4000-8000-000000000034', 5, '06:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000346', '30000000-0000-4000-8000-000000000034', 6, '06:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Tháp Đôi Quy Nhơn (Tháp Hưng Thạnh)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000035', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80&asset=thap-doi-quy-nhon', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thap-doi-quy-nhon', 256)), 'Bảo tàng Tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000035', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000035', '30000000-0000-4000-8000-000000000035', 1, 'PUBLISHED', 'Bảo tàng Tỉnh Bình Định', '{"category":"CULTURE","latitude":13.788889,"longitude":109.213889,"address":"Đường Trần Hưng Đạo, Phường Đống Đa, Thành phố Quy Nhơn, Tỉnh Bình Định","referencePriceVnd":20000,"typicalDurationMinutes":60,"slug":"thap-doi-quy-nhon","bannerUrl":"https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000035', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000035';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000035', 'vi', 'Tháp Đôi Quy Nhơn (Tháp Hưng Thạnh)', 'Kiệt tác tháp Chăm giữa lòng thành phố\nTháp Đôi (còn gọi là Tháp Hưng Thạnh) được xây dựng vào cuối thế kỷ XII - đầu thế kỷ XIII, giai đoạn vương quốc Chăm Pa có mối quan hệ giao lưu mật thiết với đế chế Angkor Khmer. Khác với các tháp Chăm truyền thống có nhiều tầng thu nhỏ dần lên đỉnh, Tháp Đôi có cấu trúc hai tháp đứng song song với phần mái vòm cong thanh thoát.\n\nNghệ thuật điêu khắc phù điêu tinh xảo\nTháp lớn cao 20m, tháp nhỏ cao 18m. Quanh các góc chân mái tháp được trang trí bằng các tượng phù điêu chim thần Garuda dang rộng đôi cánh, tượng các vũ nữ múa Apsara và các linh thú chạm khắc đá tinh xảo trên nền gạch đất nung gắn kết kỳ diệu không để lộ mạch vữa.', 'Cụm tháp Chăm Pa cổ kính thế kỷ XII độc đáo với kiến trúc vòm cong giao thoa nghệ thuật Khmer - Chăm, đứng song song uy nghiêm ngay giữa lòng phố biển Quy Nhơn.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000035', '60000000-0000-4000-8000-000000000035', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000035', '30000000-0000-4000-8000-000000000035', '20000000-0000-4000-8000-000000000018', 'CULTURE', 13.788889, 109.213889, 20000, 60, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000350', '30000000-0000-4000-8000-000000000035', 0, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000351', '30000000-0000-4000-8000-000000000035', 1, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000352', '30000000-0000-4000-8000-000000000035', 2, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000353', '30000000-0000-4000-8000-000000000035', 3, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000354', '30000000-0000-4000-8000-000000000035', 4, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000355', '30000000-0000-4000-8000-000000000035', 5, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000356', '30000000-0000-4000-8000-000000000035', 6, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Tháp Bánh Ít (Tháp Bạc - Tuy Phước)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000036', 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80&asset=thap-banh-it-tuy-phuoc', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thap-banh-it-tuy-phuoc', 256)), 'Cục Di sản Văn hóa & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000036', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000036', '30000000-0000-4000-8000-000000000036', 1, 'PUBLISHED', 'Cục Di sản Văn hóa & Báo Bình Định', '{"category":"CULTURE","latitude":13.886111,"longitude":109.136111,"address":"Thôn Đại Lộc, Xã Phước Hiệp, Huyện Tuy Phước, Tỉnh Bình Định (ven Quốc lộ 1A)","referencePriceVnd":20000,"typicalDurationMinutes":90,"slug":"thap-banh-it-tuy-phuoc","bannerUrl":"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000036', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000036';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000036', 'vi', 'Tháp Bánh Ít (Tháp Bạc - Tuy Phước)', 'Quần thể tháp Chăm tráng lệ trên đồi cao\nTháp Bánh Ít (người Pháp gọi là Tour d’Argent - Tháp Bạc) được xây dựng từ cuối thế kỷ XI trên đỉnh một ngọn đồi thoai thoải cao chừng 100m. Nhìn từ xa, 4 ngọn tháp sừng sững trông như những chiếc bánh ít - món bánh truyền thống thơm ngon của xứ Nẫu Bình Định.\n\nKiến trúc đỉnh cao của phong cách Bình Định\nQuần thể gồm Tháp Chính cao 29m uy nghiêm, Tháp Cổng phía Đông, Tháp Hỏa (tháp mái hình yên ngựa) và Tháp Bia phía Nam. Các họa tiết chạm khắc hình hoa lá, tượng thần Shiva, khỉ thần Hanuman trên gạch nung đỏ rực rỡ thể hiện kỹ thuật xây dựng và điêu khắc bậc thầy của người Chăm cổ.\n\nTầm nhìn bao quát đồng lúa Tuy Phước\nĐứng trên đỉnh đồi tháp Bánh Ít, du khách có thể phóng tầm mắt bao quát toàn cảnh những cánh đồng lúa xanh ngát của huyện Tuy Phước, dòng sông Côn hiền hòa uốn lượn và cầu Bà Gi bắc qua dòng sông.', 'Quần thể 4 ngọn tháp Chăm Pa cổ thế kỷ XI uy nghi trên đỉnh đồi cao, công trình kiến trúc cổ duy nhất của Việt Nam lọt vào cuốn sách quốc tế "1001 công trình kiến trúc phải đến trong đời".')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000036', '60000000-0000-4000-8000-000000000036', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000036', '30000000-0000-4000-8000-000000000036', '20000000-0000-4000-8000-000000000024', 'CULTURE', 13.886111, 109.136111, 20000, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000360', '30000000-0000-4000-8000-000000000036', 0, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000361', '30000000-0000-4000-8000-000000000036', 1, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000362', '30000000-0000-4000-8000-000000000036', 2, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000363', '30000000-0000-4000-8000-000000000036', 3, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000364', '30000000-0000-4000-8000-000000000036', 4, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000365', '30000000-0000-4000-8000-000000000036', 5, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000366', '30000000-0000-4000-8000-000000000036', 6, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Bảo tàng Quang Trung & Điện thờ Tây Sơn Tam Kiệt
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000037', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80&asset=bao-tang-quang-trung-tay-son', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('bao-tang-quang-trung-tay-son', 256)), 'Bảo tàng Quang Trung & Sở VHTTDL Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000037', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000037', '30000000-0000-4000-8000-000000000037', 1, 'PUBLISHED', 'Bảo tàng Quang Trung & Sở VHTTDL Bình Định', '{"category":"CULTURE","latitude":13.919444,"longitude":108.911111,"address":"Thị trấn Phú Phong, Huyện Tây Sơn, Tỉnh Bình Định (cách TP. Quy Nhơn 45km)","referencePriceVnd":30000,"typicalDurationMinutes":120,"slug":"bao-tang-quang-trung-tay-son","bannerUrl":"https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000037', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000037';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000037', 'vi', 'Bảo tàng Quang Trung & Điện thờ Tây Sơn Tam Kiệt', 'Đền thờ phong trào khởi nghĩa Tây Sơn hiển hách\nBảo tàng Quang Trung được xây dựng ngay trên chính nền ngôi nhà cũ của gia đình ba anh em Tây Sơn (Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ) tại làng Kiên Mỹ, huyện Tây Sơn. Đây là một trong những bảo tàng danh nhân lớn nhất Việt Nam thu hút hàng triệu lượt khách hành hương mỗi năm.\n\nCây me cổ thụ & Giếng nước đá ong lịch sử\nTrong khuôn viên điện thờ vẫn vẹn nguyên hai di vật vô giá gắn bó với tuổi thơ của anh em Tây Sơn: Cây me cổ thụ hơn 300 năm tuổi cành lá sum suê che mát một góc vườn, và Giếng nước đá ong trong vắt mát ngọt mà nhân dân tương truyền uống vào sẽ tiếp thêm hào khí và sức khỏe.\n\nThưởng thức nhạc võ Tây Sơn & Múa trống trận\nĐến bảo tàng, du khách không thể bỏ qua chương trình biểu diễn Nhạc võ Tây Sơn với dàn trống trận 12 chiếc tượng trưng cho thập nhị địa chi, hòa cùng tiếng đàn nhị, kèn bóp, xập xõa hào hùng tái hiện khí thế bách chiến bách thắng của đoàn quân áo vải cờ đào năm xưa.', 'Khu di tích lịch sử Quốc gia đặc biệt tưởng nhớ công đức vĩ đại của Hoàng đế Quang Trung - Nguyễn Huệ và nghĩa quân Tây Sơn, nơi lưu giữ cây me cổ thụ 300 năm, giếng nước đá ong và biểu diễn nhạc võ Tây Sơn lẫy lừng.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000037', '60000000-0000-4000-8000-000000000037', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000037', '30000000-0000-4000-8000-000000000037', '20000000-0000-4000-8000-000000000019', 'CULTURE', 13.919444, 108.911111, 30000, 120, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000370', '30000000-0000-4000-8000-000000000037', 0, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000371', '30000000-0000-4000-8000-000000000037', 1, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000372', '30000000-0000-4000-8000-000000000037', 2, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000373', '30000000-0000-4000-8000-000000000037', 3, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000374', '30000000-0000-4000-8000-000000000037', 4, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000375', '30000000-0000-4000-8000-000000000037', 5, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000376', '30000000-0000-4000-8000-000000000037', 6, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Khu du lịch Sinh thái Hầm Hô (Vương quốc Đá Hoa Cương)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000038', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80&asset=khu-du-lich-sinh-thai-ham-ho-tay-son', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('khu-du-lich-sinh-thai-ham-ho-tay-son', 256)), 'Công ty Cổ phần Du lịch Hầm Hô & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000038', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000038', '30000000-0000-4000-8000-000000000038', 1, 'PUBLISHED', 'Công ty Cổ phần Du lịch Hầm Hô & Báo Bình Định', '{"category":"NATURE","latitude":13.886111,"longitude":108.863889,"address":"Xã Tây Phú, Huyện Tây Sơn, Tỉnh Bình Định (cách Quy Nhơn khoảng 50km)","referencePriceVnd":50000,"typicalDurationMinutes":180,"slug":"khu-du-lich-sinh-thai-ham-ho-tay-son","bannerUrl":"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000038', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000038';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000038', 'vi', 'Khu du lịch Sinh thái Hầm Hô (Vương quốc Đá Hoa Cương)', 'Vương quốc đá hoa cương kỳ thú\nHầm Hô là một khúc sông Kút dài gần 3km chảy qua lòng thung lũng đá hoa cương kỳ vĩ. Lòng sông dày đặc những khối đá khổng lồ với muôn hình thù độc đáo: Hòn Chuông, Hòn Bóng, Đá Thành, Bàn Cờ Tiên, Dấu Chân Khổng Lồ... Mỗi khi ánh mặt trời rọi xuống, các tinh thể đá lấp lánh như dát kim cương.\n\nĐi thuyền nan bồng bềnh giữa hẻm vực xanh\nTrải nghiệm thú vị nhất tại Hầm Hô là ngồi thuyền nan mộc mạc do người chèo đò bản địa chèo êm ả lướt trên mặt nước xanh biếc. Hai bên bờ là những vách đá phủ đầy dây leo cổ thụ, cành phong lan rừng rủ xuống soi bóng, tiếng chim rừng líu lo hòa cùng tiếng suối róc rách.\n\nCăn cứ địa lịch sử oai hùng\nNơi đây từng là căn cứ bí mật tích trữ lương thảo của nghĩa quân Tây Sơn và sau này là căn cứ khởi nghĩa Cần Vương kiên cường của lãnh tụ Mai Xuân Thưởng chống thực dân Pháp.', 'Tuyệt tác thiên nhiên hoang sơ với dòng sông Kút chảy qua vương quốc đá hoa cương muôn hình vạn trạng giữa rừng nguyên sinh đại ngàn, từng là căn cứ kháng chiến của nghĩa quân Tây Sơn và Mai Xuân Thưởng.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000038', '60000000-0000-4000-8000-000000000038', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000038', '30000000-0000-4000-8000-000000000038', '20000000-0000-4000-8000-000000000019', 'NATURE', 13.886111, 108.863889, 50000, 180, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000380', '30000000-0000-4000-8000-000000000038', 0, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000381', '30000000-0000-4000-8000-000000000038', 1, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000382', '30000000-0000-4000-8000-000000000038', 2, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000383', '30000000-0000-4000-8000-000000000038', 3, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000384', '30000000-0000-4000-8000-000000000038', 4, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000385', '30000000-0000-4000-8000-000000000038', 5, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000386', '30000000-0000-4000-8000-000000000038', 6, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đảo Cù Lao Xanh (Xã đảo Nhơn Châu)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000039', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80&asset=dao-cu-lao-xanh-nhon-chau', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('dao-cu-lao-xanh-nhon-chau', 256)), 'UBND Xã đảo Nhơn Châu & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000039', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000039', '30000000-0000-4000-8000-000000000039', 1, 'PUBLISHED', 'UBND Xã đảo Nhơn Châu & Báo Bình Định', '{"category":"NATURE","latitude":13.616667,"longitude":109.35,"address":"Xã đảo Nhơn Châu, Thành phố Quy Nhơn, Tỉnh Bình Định","referencePriceVnd":0,"typicalDurationMinutes":300,"slug":"dao-cu-lao-xanh-nhon-chau","bannerUrl":"https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000039', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000039';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000039', 'vi', 'Đảo Cù Lao Xanh (Xã đảo Nhơn Châu)', 'Hòn ngọc xanh giữa đại dương\nCù Lao Xanh (đảo Vân Phi) nằm cách bờ biển Quy Nhơn khoảng 24km về phía Đông Nam. Hòn đảo được bao bọc bởi một màu xanh bất tận: xanh ngắt của cây rừng, xanh biếc của biển khơi và xanh trong của mây trời Tây Sơn.\n\nNgọn Hải đăng cổ kính hơn 130 năm tuổi\nTrên đỉnh núi cao nhất của đảo là Ngọn Hải đăng Cù Lao Xanh được người Pháp xây dựng từ năm 1890 theo phong cách kiến trúc Gothic kết hợp phương Đông. Tháp đèn cao 16m xây bằng đá hoa cương khối lớn, chiếu xa tới 27 hải lý dẫn đường cho tàu thuyền qua lại vùng biển Bình Định.\n\nCột cờ Tổ quốc & Bãi đá Thảo Nguyên\nBên cạnh hải đăng là Cột cờ Tổ quốc khẳng định chủ quyền biển đảo thiêng liêng. Du khách cũng không thể bỏ lỡ Bãi đá Thảo Nguyên với muôn vàn khối đá đủ hình thù ngộ nghĩnh và Bãi Gala ngắm san hô cạn tuyệt đẹp.', 'Viên ngọc xanh vô giá giữa biển khơi Quy Nhơn với ngọn Hải đăng Plogamum cổ kính hơn 130 năm tuổi, Cột cờ Tổ quốc thiêng liêng và bãi biển nguyên sơ tĩnh lặng.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000039', '60000000-0000-4000-8000-000000000039', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000039', '30000000-0000-4000-8000-000000000039', '20000000-0000-4000-8000-000000000018', 'NATURE', 13.616667, 109.35, 0, 300, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000390', '30000000-0000-4000-8000-000000000039', 0, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000391', '30000000-0000-4000-8000-000000000039', 1, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000392', '30000000-0000-4000-8000-000000000039', 2, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000393', '30000000-0000-4000-8000-000000000039', 3, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000394', '30000000-0000-4000-8000-000000000039', 4, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000395', '30000000-0000-4000-8000-000000000039', 5, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000396', '30000000-0000-4000-8000-000000000039', 6, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Chùa Linh Phong (Chùa Ông Núi & Đại Tượng Phật ngồi cao nhất Đông Nam Á)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000040', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80&asset=chua-linh-phong-ong-nui-phu-cat', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('chua-linh-phong-ong-nui-phu-cat', 256)), 'Giáo hội Phật giáo Việt Nam tỉnh Bình Định & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000040', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000040', '30000000-0000-4000-8000-000000000040', 1, 'PUBLISHED', 'Giáo hội Phật giáo Việt Nam tỉnh Bình Định & Báo Bình Định', '{"category":"CULTURE","latitude":13.944444,"longitude":109.183333,"address":"Thôn Phương Chi, Xã Cát Tiến, Huyện Phù Cát, Tỉnh Bình Định","referencePriceVnd":0,"typicalDurationMinutes":120,"slug":"chua-linh-phong-ong-nui-phu-cat","bannerUrl":"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000040', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000040';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000040', 'vi', 'Chùa Linh Phong (Chùa Ông Núi & Đại Tượng Phật ngồi cao nhất Đông Nam Á)', 'Huyền tích vị thiền sư chữa bệnh cứu người\nChùa Ông Núi (Linh Phong Thiền Tự) được khởi lập từ năm 1702 dưới thời chúa Nguyễn Phúc Chu. Gắn liền với chùa là huyền tích về thiền sư Tịnh Giác - Thiện Trì (thường gọi là Mộc Y Sơn Nhơn - Ông Núi) tu hành trong hang đá, hái thuốc nam cứu chữa miễn phí cho người nghèo quanh vùng.\n\nĐại tượng Phật ngồi cao 69m kỷ lục\nĐiểm nhấn vĩ đại là bức đại tượng Phật Thích Ca Mâu Ni bằng bê tông cốt thép cao 69m (tính cả đài sen), đường kính chân tượng 52m tọa lạc trên đỉnh núi ở độ cao 129m so với mực nước biển. Để lên đến chân tượng Phật, du khách sẽ bước qua hơn 600 bậc thang đá uốn lượn rợp bóng cây xanh.\n\nTầm nhìn ngoạn mục hướng biển Phù Cát\nĐứng từ sân chùa Linh Phong, du khách có thể phóng tầm mắt bao quát toàn bộ đầm Thị Nại, cầu vượt biển, cánh đồng quạt gió Phương Mai và bãi biển Cát Tiến hoang sơ tuyệt đẹp.', 'Ngôi cổ tự hơn 300 năm tuổi trên lưng chừng núi Bà, nổi tiếng với pho đại tượng Đức Phật Thích Ca Mâu Ni ngồi ngự trên tòa sen cao 69m hướng nhìn ra biển Đông lớn nhất Đông Nam Á.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000040', '60000000-0000-4000-8000-000000000040', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000040', '30000000-0000-4000-8000-000000000040', '20000000-0000-4000-8000-000000000022', 'CULTURE', 13.944444, 109.183333, 0, 120, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000400', '30000000-0000-4000-8000-000000000040', 0, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000401', '30000000-0000-4000-8000-000000000040', 1, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000402', '30000000-0000-4000-8000-000000000040', 2, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000403', '30000000-0000-4000-8000-000000000040', 3, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000404', '30000000-0000-4000-8000-000000000040', 4, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000405', '30000000-0000-4000-8000-000000000040', 5, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000406', '30000000-0000-4000-8000-000000000040', 6, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Tiểu Chủng viện Làng Sông (Cái nôi Chữ Quốc Ngữ)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000041', 'https://images.unsplash.com/photo-1548625361-195fe57876a3?auto=format&fit=crop&w=1200&q=80&asset=tieu-chung-vien-lang-song-tuy-phuoc', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('tieu-chung-vien-lang-song-tuy-phuoc', 256)), 'Tòa Giám mục Quy Nhơn & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000041', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000041', '30000000-0000-4000-8000-000000000041', 1, 'PUBLISHED', 'Tòa Giám mục Quy Nhơn & Báo Bình Định', '{"category":"CULTURE","latitude":13.844444,"longitude":109.186111,"address":"Thôn Quảng Vân, Xã Phước Thuận, Huyện Tuy Phước, Tỉnh Bình Định","referencePriceVnd":0,"typicalDurationMinutes":75,"slug":"tieu-chung-vien-lang-song-tuy-phuoc","bannerUrl":"https://images.unsplash.com/photo-1548625361-195fe57876a3?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1548625361-195fe57876a3?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000041', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000041';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000041', 'vi', 'Tiểu Chủng viện Làng Sông (Cái nôi Chữ Quốc Ngữ)', 'Cái nôi phôi thai và truyền bá chữ Quốc ngữ\nVào đầu thế kỷ XVII, tại vùng đất cảng thị Nước Mặn (nay thuộc Tuy Phước, Bình Định), các giáo sĩ Dòng Tên phương Tây (như Cristoforo Borri, Francisco de Pina) cùng các học giả bản địa đã bắt đầu phiên âm tiếng Việt bằng ký tự Latinh, mở đầu cho sự ra đời của chữ Quốc ngữ. Nhà in Làng Sông thành lập tại đây là một trong ba nhà in chữ Quốc ngữ đầu tiên của cả nước.\n\nKiến trúc Gothic châu Âu tráng lệ\nTiểu Chủng viện mang đậm nét kiến trúc Gothic cổ điển của Pháp với vòm nhọn, tháp chuông uy nghiêm và những ô cửa sổ kính màu trang nhã. Lối vào chủng viện rợp bóng hai hàng cây sao đen cổ thụ hơn 200 năm tuổi cao vút, tạo nên vẻ đẹp thanh bình thoát tục tựa một tu viện cổ kính ở châu Âu.', 'Kiến trúc Gothic châu Âu cổ kính giữa đồng bằng Tuy Phước, nơi đặt Nhà in Làng Sông - một trong những cơ sở in ấn và truyền bá chữ Quốc ngữ đầu tiên tại Việt Nam.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000041', '60000000-0000-4000-8000-000000000041', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000041', '30000000-0000-4000-8000-000000000041', '20000000-0000-4000-8000-000000000024', 'CULTURE', 13.844444, 109.186111, 0, 75, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000410', '30000000-0000-4000-8000-000000000041', 0, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000411', '30000000-0000-4000-8000-000000000041', 1, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000412', '30000000-0000-4000-8000-000000000041', 2, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000413', '30000000-0000-4000-8000-000000000041', 3, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000414', '30000000-0000-4000-8000-000000000041', 4, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000415', '30000000-0000-4000-8000-000000000041', 5, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000416', '30000000-0000-4000-8000-000000000041', 6, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Khu dã ngoại Trung Lương (Phù Cát)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000042', 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80&asset=khu-da-ngoai-trung-luong-phu-cat', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('khu-da-ngoai-trung-luong-phu-cat', 256)), 'Dulich.binhdinh.gov.vn', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000042', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000042', '30000000-0000-4000-8000-000000000042', 1, 'PUBLISHED', 'Dulich.binhdinh.gov.vn', '{"category":"NATURE","latitude":13.955556,"longitude":109.194444,"address":"Thôn Trung Lương, Xã Cát Tiến, Huyện Phù Cát, Tỉnh Bình Định","referencePriceVnd":40000,"typicalDurationMinutes":120,"slug":"khu-da-ngoai-trung-luong-phu-cat","bannerUrl":"https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000042', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000042';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000042', 'vi', 'Khu dã ngoại Trung Lương (Phù Cát)', 'Thung lũng cắm trại "chill" bên bờ biển\nKhu dã ngoại Trung Lương nằm lọt thỏm giữa thung lũng đá hoa cương hướng ra bờ biển xanh biếc. Nơi đây được thiết kế hài hòa với thiên nhiên với những bãi cỏ xanh rì, các lều trại cắm trại ban đêm và hệ thống đèn trang trí lung linh lãng mạn.\n\nCon đường đá lát dạo bước xuống biển\nMột con đường bậc thang đá uốn lượn ngoạn mục men theo sườn núi đưa du khách xuống tận bãi biển Trung Lương hoang sơ. Du khách có thể tắm biển, chụp ảnh kỷ niệm và thưởng thức các món đồ uống tươi mát tại quầy bar ven biển.', 'Thung lũng cắm trại sát mép biển với bãi cỏ xanh mướt, những căn lều đủ màu sắc và con đường bậc thang lát đá dẫn thẳng xuống bãi tắm biển hoang sơ trong vắt.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000042', '60000000-0000-4000-8000-000000000042', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000042', '30000000-0000-4000-8000-000000000042', '20000000-0000-4000-8000-000000000022', 'NATURE', 13.955556, 109.194444, 40000, 120, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000420', '30000000-0000-4000-8000-000000000042', 0, '07:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000421', '30000000-0000-4000-8000-000000000042', 1, '07:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000422', '30000000-0000-4000-8000-000000000042', 2, '07:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000423', '30000000-0000-4000-8000-000000000042', 3, '07:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000424', '30000000-0000-4000-8000-000000000042', 4, '07:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000425', '30000000-0000-4000-8000-000000000042', 5, '07:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000426', '30000000-0000-4000-8000-000000000042', 6, '07:00:00', '21:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đồi cát Phương Mai
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000043', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80&asset=doi-cat-phuong-mai-quy-nhon', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('doi-cat-phuong-mai-quy-nhon', 256)), 'Sở Du lịch Tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000043', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000043', '30000000-0000-4000-8000-000000000043', 1, 'PUBLISHED', 'Sở Du lịch Tỉnh Bình Định', '{"category":"NATURE","latitude":13.85,"longitude":109.266667,"address":"Bán đảo Phương Mai, Xã Nhơn Lý, Thành phố Quy Nhơn, Tỉnh Bình Định","referencePriceVnd":0,"typicalDurationMinutes":75,"slug":"doi-cat-phuong-mai-quy-nhon","bannerUrl":"https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000043', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000043';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000043', 'vi', 'Đồi cát Phương Mai', 'Tiểu sa mạc cát vàng bên vịnh biển\nNằm sát bờ biển Nhơn Lý, Đồi cát Phương Mai là một trong những đồi cát cao và đẹp nhất miền Trung. Do gió biển thổi quanh năm, hình thù vân cát trên đồi biến đổi liên tục từng giờ tạo nên những đường cong mềm mại như tranh thủy mặc.\n\nTrải nghiệm trượt cát cảm giác mạnh\nDu khách thuê những chiếc ván trượt bằng gỗ hoặc nhựa để trượt từ đỉnh đồi cát dốc đứng xuống dưới với vận tốc lên tới 30 - 40km/h, mang lại cảm giác phấn khích tột độ.', 'Đồi cát vàng mịn màng khổng lồ cao từ 20m đến 100m so với mực nước biển, nơi du khách trải nghiệm trò chơi trượt cát cảm giác mạnh và ngắm nhìn vịnh biển từ trên cao.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000043', '60000000-0000-4000-8000-000000000043', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000043', '30000000-0000-4000-8000-000000000043', '20000000-0000-4000-8000-000000000018', 'NATURE', 13.85, 109.266667, 0, 75, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000430', '30000000-0000-4000-8000-000000000043', 0, '05:30:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000431', '30000000-0000-4000-8000-000000000043', 1, '05:30:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000432', '30000000-0000-4000-8000-000000000043', 2, '05:30:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000433', '30000000-0000-4000-8000-000000000043', 3, '05:30:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000434', '30000000-0000-4000-8000-000000000043', 4, '05:30:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000435', '30000000-0000-4000-8000-000000000043', 5, '05:30:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000436', '30000000-0000-4000-8000-000000000043', 6, '05:30:00', '18:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đầm Thị Nại & Cầu Thị Nại (Cầu vượt biển dài gần 2,5km)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000044', 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80&asset=dam-thi-nai-cau-thi-nai', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('dam-thi-nai-cau-thi-nai', 256)), 'Báo Bình Định & Cổng TTĐT Tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000044', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000044', '30000000-0000-4000-8000-000000000044', 1, 'PUBLISHED', 'Báo Bình Định & Cổng TTĐT Tỉnh Bình Định', '{"category":"NATURE","latitude":13.794444,"longitude":109.255556,"address":"Thành phố Quy Nhơn và Huyện Tuy Phước, Tỉnh Bình Định","referencePriceVnd":0,"typicalDurationMinutes":60,"slug":"dam-thi-nai-cau-thi-nai","bannerUrl":"https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000044', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000044';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000044', 'vi', 'Đầm Thị Nại & Cầu Thị Nại (Cầu vượt biển dài gần 2,5km)', 'Chứng nhân lịch sử của những trận thủy chiến hào hùng\nĐầm Thị Nại là vùng đầm phá trù phú nối với biển qua cửa Giã (cửa Thị Nại). Nơi đây từng là chiến trường thủy chiến khốc liệt thời Champa - Đại Việt, cuộc đụng độ giữa quân Tây Sơn và chúa Nguyễn Ánh, ghi dấu tài thao lược quân sự của tiền nhân.\n\nKỳ quan cầu vượt biển Thị Nại\nCầu Thị Nại khánh thành năm 2006 với chiều dài 2.477m, gồm 54 nhịp bắc ngang qua đầm nước lợ mênh mông, từng giữ kỷ lục cây cầu vượt biển dài nhất Việt Nam suốt nhiều năm.', 'Đầm nước lợ lớn nhất Bình Định rộng hơn 5.000ha ghi dấu nhiều chiến tích thủy chiến lẫy lừng trong lịch sử, nối với bán đảo Phương Mai bằng cây cầu vượt biển dài 2.477m.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000044', '60000000-0000-4000-8000-000000000044', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000044', '30000000-0000-4000-8000-000000000044', '20000000-0000-4000-8000-000000000018', 'NATURE', 13.794444, 109.255556, 0, 60, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000440', '30000000-0000-4000-8000-000000000044', 0, '00:00:00', '23:59:59', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000441', '30000000-0000-4000-8000-000000000044', 1, '00:00:00', '23:59:59', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000442', '30000000-0000-4000-8000-000000000044', 2, '00:00:00', '23:59:59', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000443', '30000000-0000-4000-8000-000000000044', 3, '00:00:00', '23:59:59', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000444', '30000000-0000-4000-8000-000000000044', 4, '00:00:00', '23:59:59', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000445', '30000000-0000-4000-8000-000000000044', 5, '00:00:00', '23:59:59', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000446', '30000000-0000-4000-8000-000000000044', 6, '00:00:00', '23:59:59', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Di tích Thành Hoàng Đế & Tháp Cánh Tiên (An Nhơn)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000045', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80&asset=thanh-hoang-de-thap-canh-tien-an-nhon', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thanh-hoang-de-thap-canh-tien-an-nhon', 256)), 'Bảo tàng Tỉnh Bình Định & UBND Thị xã An Nhơn', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000045', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000045', '30000000-0000-4000-8000-000000000045', 1, 'PUBLISHED', 'Bảo tàng Tỉnh Bình Định & UBND Thị xã An Nhơn', '{"category":"CULTURE","latitude":13.916667,"longitude":109.083333,"address":"Xã Nhơn Hậu, Thị xã An Nhơn, Tỉnh Bình Định","referencePriceVnd":20000,"typicalDurationMinutes":90,"slug":"thanh-hoang-de-thap-canh-tien-an-nhon","bannerUrl":"https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000045', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000045';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000045', 'vi', 'Di tích Thành Hoàng Đế & Tháp Cánh Tiên (An Nhơn)', 'Kinh đô hai vương triều Champa và Tây Sơn\nThành Hoàng Đế nguyên là kinh thành Đồ Bàn (Vijaya) của vương quốc Chăm Pa suốt 5 thế kỷ (từ thế kỷ XI đến XV). Đến năm 1776, Nguyễn Nhạc cho xây dựng lại thành Đồ Bàn làm kinh đô của triều đại Tây Sơn lấy tên là Thành Hoàng Đế.\n\nTháp Cánh Tiên kiêu hãnh giữa lòng kinh thành\nTọa lạc ngay chính giữa trung tâm Thành Hoàng Đế là Tháp Cánh Tiên - ngôi tháp Chăm cao gần 20m xây dựng từ thế kỷ XII. Bốn mặt góc tường tháp nhô ra những phiến đá thanh thoát uốn cong tựa như đôi cánh tiên đang bay lượn trên trời cao.', 'Quần thể di tích quốc gia đặc biệt ghi dấu kinh đô Đồ Bàn xưa của Vương quốc Chăm Pa và kinh đô của triều đại Hoàng đế Thái Đức Nguyễn Nhạc thời Tây Sơn.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000045', '60000000-0000-4000-8000-000000000045', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000045', '30000000-0000-4000-8000-000000000045', '20000000-0000-4000-8000-000000000020', 'CULTURE', 13.916667, 109.083333, 20000, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000450', '30000000-0000-4000-8000-000000000045', 0, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000451', '30000000-0000-4000-8000-000000000045', 1, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000452', '30000000-0000-4000-8000-000000000045', 2, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000453', '30000000-0000-4000-8000-000000000045', 3, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000454', '30000000-0000-4000-8000-000000000045', 4, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000455', '30000000-0000-4000-8000-000000000045', 5, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000456', '30000000-0000-4000-8000-000000000045', 6, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Thắng cảnh Mũi Vi Rồng (Mũi Rồng - Phù Mỹ)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000046', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80&asset=mui-vi-rong-phu-my', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('mui-vi-rong-phu-my', 256)), 'Cổng TTĐT Huyện Phù Mỹ & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000046', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000046', '30000000-0000-4000-8000-000000000046', 1, 'PUBLISHED', 'Cổng TTĐT Huyện Phù Mỹ & Báo Bình Định', '{"category":"NATURE","latitude":14.283333,"longitude":109.216667,"address":"Thôn Tân Phụng, Xã Mỹ Thọ, Huyện Phù Mỹ, Tỉnh Bình Định (cách Quy Nhơn 70km)","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"mui-vi-rong-phu-my","bannerUrl":"https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000046', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000046';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000046', 'vi', 'Thắng cảnh Mũi Vi Rồng (Mũi Rồng - Phù Mỹ)', 'Huyền thoại mỏm đá rồng vươn biển\nMũi Vi Rồng là một ghềnh đá hoa cương sừng sững có hình dáng tựa như vi rồng cất cánh ra biển. Giữa lòng mỏm đá có một hang động xuyên thủy, mỗi khi sóng lớn xô vào nước bắn vọt lên qua khe đá như miệng rồng đang phun nước trắng xóa.\n\nTrải nghiệm leo ghềnh & Bãi tắm hoang sơ\nBao quanh Mũi Rồng là những bãi cát vàng hoang sơ và làn nước biển trong vắt. Du khách có thể leo lên đỉnh mỏm đá ngắm nhìn thuyền câu mực của ngư dân làng chài Tân Phụng và thưởng thức rượu Mỹ Thọ trứ danh.', 'Kiệt tác đá hoa cương thiên nhiên nhô ra biển khơi có hình dáng một con rồng khổng lồ đang vươn mình ra đại dương, sóng vỗ ầm ầm qua hang hầm kỳ thú.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000046', '60000000-0000-4000-8000-000000000046', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000046', '30000000-0000-4000-8000-000000000046', '20000000-0000-4000-8000-000000000023', 'NATURE', 14.283333, 109.216667, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000460', '30000000-0000-4000-8000-000000000046', 0, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000461', '30000000-0000-4000-8000-000000000046', 1, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000462', '30000000-0000-4000-8000-000000000046', 2, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000463', '30000000-0000-4000-8000-000000000046', 3, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000464', '30000000-0000-4000-8000-000000000046', 4, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000465', '30000000-0000-4000-8000-000000000046', 5, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000466', '30000000-0000-4000-8000-000000000046', 6, '06:00:00', '18:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Chùa Thiên Hưng (Chốn Bồng Lai Cảnh Giới)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000047', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80&asset=chua-thien-hung-an-nhon', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('chua-thien-hung-an-nhon', 256)), 'Giáo hội Phật giáo Việt Nam tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000047', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000047', '30000000-0000-4000-8000-000000000047', 1, 'PUBLISHED', 'Giáo hội Phật giáo Việt Nam tỉnh Bình Định', '{"category":"CULTURE","latitude":13.888889,"longitude":109.111111,"address":"Phường Nhơn Hưng, Thị xã An Nhơn, Tỉnh Bình Định (ven Quốc lộ 1A)","referencePriceVnd":0,"typicalDurationMinutes":75,"slug":"chua-thien-hung-an-nhon","bannerUrl":"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000047', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000047';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000047', 'vi', 'Chùa Thiên Hưng (Chốn Bồng Lai Cảnh Giới)', 'Kiến trúc Á Đông thanh thoát\nChùa Thiên Hưng do Đại đức Thích Đồng Ngộ trụ trì, nổi tiếng với khuôn viên vườn thiền tuyệt mỹ rộng hàng ngàn mét vuông với hào nước trong xanh, cầu ngói cổ kính, hồ hoa sen thơm ngát và tháp Chuông 12 tầng vươn cao lên bầu trời.\n\nNơi lưu giữ Ngọc Xá Lợi Phật\nChùa là chốn linh thiêng được Giáo hội Phật giáo Myanmar trao tặng Ngọc Xá Lợi Phật Thích Ca. Hàng năm, hàng vạn phật tử và du khách khắp nơi về đây dâng hương chiêm bái cầu nguyện bình an cho gia đình.', 'Ngôi chùa được ví như "Phượng Hoàng Cổ Trấn" thu nhỏ của Bình Định với hoa viên cổ kính thanh thoát, nơi vinh dự lưu giữ Ngọc Xá Lợi của Đức Phật Thích Ca Mâu Ni.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000047', '60000000-0000-4000-8000-000000000047', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000047', '30000000-0000-4000-8000-000000000047', '20000000-0000-4000-8000-000000000020', 'CULTURE', 13.888889, 109.111111, 0, 75, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000470', '30000000-0000-4000-8000-000000000047', 0, '08:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000471', '30000000-0000-4000-8000-000000000047', 1, '08:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000472', '30000000-0000-4000-8000-000000000047', 2, '08:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000473', '30000000-0000-4000-8000-000000000047', 3, '08:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000474', '30000000-0000-4000-8000-000000000047', 4, '08:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000475', '30000000-0000-4000-8000-000000000047', 5, '08:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000476', '30000000-0000-4000-8000-000000000047', 6, '08:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Đàn Tế Trời Đất Tây Sơn (Khu du lịch Tâm linh Ấn Sơn)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000048', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80&asset=dan-te-troi-dat-an-son-tay-son', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('dan-te-troi-dat-an-son-tay-son', 256)), 'UBND Huyện Tây Sơn & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000048', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000048', '30000000-0000-4000-8000-000000000048', 1, 'PUBLISHED', 'UBND Huyện Tây Sơn & Báo Bình Định', '{"category":"CULTURE","latitude":13.883333,"longitude":108.933333,"address":"Núi Ấn (Ấn Sơn), Thôn Hòa Sơn, Xã Bình Tường, Huyện Tây Sơn, Tỉnh Bình Định","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"dan-te-troi-dat-an-son-tay-son","bannerUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000048', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000048';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000048', 'vi', 'Đàn Tế Trời Đất Tây Sơn (Khu du lịch Tâm linh Ấn Sơn)', 'Địa linh nhân kiệt phát tích phong trào Tây Sơn\nẤn Sơn là ngọn núi linh thiêng nằm trong dãy Hoành Sơn của vùng đất Tây Sơn. Tương truyền, trước khi dựng cờ khởi nghĩa, ba anh em Tây Sơn đã lập đàn tế trời đất tại đây và được ban kiếm lệnh cùng ấn báu thiên tử khởi xướng phong trào nông dân bão táp.\n\nCấu trúc Đàn Tế Trời Đất 3 tầng\nĐàn tế được xây dựng theo thuyết âm dương ngũ hành gồm 3 tầng: Tầng trên cùng hình tròn tượng trưng cho Trời (Viên Đàn), tầng giữa hình vuông tượng trưng cho Đất (Phương Đàn) và tầng dưới cùng hình vuông tượng trưng cho Nhân giới, bao quanh bởi rừng thông xanh mát.', 'Khu tâm linh uy nghiêm trên đỉnh núi Ấn Sơn hùng vĩ, nơi ba anh em Nguyễn Huệ lập đàn tế cáo trời đất nhận ấn kiếm lệnh trước khi xuất quân dựng nghiệp lớn.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000048', '60000000-0000-4000-8000-000000000048', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000048', '30000000-0000-4000-8000-000000000048', '20000000-0000-4000-8000-000000000019', 'CULTURE', 13.883333, 108.933333, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000480', '30000000-0000-4000-8000-000000000048', 0, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000481', '30000000-0000-4000-8000-000000000048', 1, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000482', '30000000-0000-4000-8000-000000000048', 2, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000483', '30000000-0000-4000-8000-000000000048', 3, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000484', '30000000-0000-4000-8000-000000000048', 4, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000485', '30000000-0000-4000-8000-000000000048', 5, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000486', '30000000-0000-4000-8000-000000000048', 6, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Làng chài Bãi Xép (Hòn ngọc bí ẩn châu Á)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000049', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80&asset=bai-xep-ghenh-rang-quy-nhon', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('bai-xep-ghenh-rang-quy-nhon', 256)), 'Sở Du lịch Tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000049', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000049', '30000000-0000-4000-8000-000000000049', 1, 'PUBLISHED', 'Sở Du lịch Tỉnh Bình Định', '{"category":"NATURE","latitude":13.688889,"longitude":109.219444,"address":"Khu phố 1, Phường Ghềnh Ráng, Thành phố Quy Nhơn, Tỉnh Bình Định (Quốc lộ 1D)","referencePriceVnd":0,"typicalDurationMinutes":120,"slug":"bai-xep-ghenh-rang-quy-nhon","bannerUrl":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000049', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000049';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000049', 'vi', 'Làng chài Bãi Xép (Hòn ngọc bí ẩn châu Á)', 'Ngôi làng chài không tiếng còi xe ồn ào\nBãi Xép cách trung tâm Quy Nhơn khoảng 13km về phía Nam trên cung đường đèo Quy Nhơn - Sông Cầu. Ngôi làng chài có lịch sử hàng trăm năm với những con ngõ nhỏ chỉ dành cho người đi bộ, những chiếc thuyền thúng tròn nằm nghỉ ngơi trên bãi cát và nhịp sống làng chài bình dị.\n\nThiên đường nghỉ dưỡng homestay quốc tế\nBãi Xép là điểm đến yêu thích của du khách quốc tế nhờ hệ thống homestay mộc mạc sát biển, bãi tắm riêng biệt nước trong veo và trải nghiệm theo chân ngư dân đi đánh bắt cá, cào nghêu vào sáng sớm.', 'Làng chài cổ bình yên nằm nép mình bên bãi biển nước trong vắt, được tạp chí danh tiếng Business Insider bình chọn là một trong 16 "hòn ngọc bí ẩn" của châu Á.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000049', '60000000-0000-4000-8000-000000000049', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000049', '30000000-0000-4000-8000-000000000049', '20000000-0000-4000-8000-000000000018', 'NATURE', 13.688889, 109.219444, 0, 120, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000490', '30000000-0000-4000-8000-000000000049', 0, '06:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000491', '30000000-0000-4000-8000-000000000049', 1, '06:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000492', '30000000-0000-4000-8000-000000000049', 2, '06:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000493', '30000000-0000-4000-8000-000000000049', 3, '06:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000494', '30000000-0000-4000-8000-000000000049', 4, '06:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000495', '30000000-0000-4000-8000-000000000049', 5, '06:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000496', '30000000-0000-4000-8000-000000000049', 6, '06:00:00', '22:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Tháp Dương Long (Tháp Ngà - Tháp gạch nung cao nhất Đông Nam Á)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000050', 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80&asset=thap-duong-long-thap-nga-tay-son', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thap-duong-long-thap-nga-tay-son', 256)), 'Cục Di sản Văn hóa & Bảo tàng Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000050', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000050', '30000000-0000-4000-8000-000000000050', 1, 'PUBLISHED', 'Cục Di sản Văn hóa & Bảo tàng Bình Định', '{"category":"CULTURE","latitude":13.938889,"longitude":108.994444,"address":"Xã Tây Bình, Huyện Tây Sơn, Tỉnh Bình Định","referencePriceVnd":20000,"typicalDurationMinutes":75,"slug":"thap-duong-long-thap-nga-tay-son","bannerUrl":"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000050', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000050';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000050', 'vi', 'Tháp Dương Long (Tháp Ngà - Tháp gạch nung cao nhất Đông Nam Á)', 'Cụm tháp gạch nung cao nhất Đông Nam Á\nTháp Dương Long (người Pháp gọi là Tour d’Ivoire - Tháp Ngà) được xây dựng vào cuối thế kỷ XII. Cụm tháp gồm 3 tòa tháp đứng thẳng hàng: tháp giữa cao tới 39m, hai tháp bắc và nam cao khoảng 32m, là công trình tháp gạch đồ sộ nhất còn tồn tại của văn minh Champa.\n\nNghệ thuật điêu khắc đá hoa cương lộng lẫy\nKhác biệt với các tháp Chăm khác thường chỉ chạm gạch, Tháp Dương Long sử dụng các khối đá hoa cương lớn ghép nối ở cửa tháp và diềm mái. Trên đá chạm khắc tinh xảo hình tượng các linh thú Garuda, Naga, sư tử Kala và hoa sen nở rộ rực rỡ.', 'Quần thể 3 ngọn tháp Chăm Pa bằng gạch nung cao nhất Đông Nam Á với tháp giữa cao 39m, đỉnh cao nghệ thuật điêu khắc đá phối hợp gạch nung tinh xảo.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000050', '60000000-0000-4000-8000-000000000050', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000050', '30000000-0000-4000-8000-000000000050', '20000000-0000-4000-8000-000000000019', 'CULTURE', 13.938889, 108.994444, 20000, 75, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000500', '30000000-0000-4000-8000-000000000050', 0, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000501', '30000000-0000-4000-8000-000000000050', 1, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000502', '30000000-0000-4000-8000-000000000050', 2, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000503', '30000000-0000-4000-8000-000000000050', 3, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000504', '30000000-0000-4000-8000-000000000050', 4, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000505', '30000000-0000-4000-8000-000000000050', 5, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000506', '30000000-0000-4000-8000-000000000050', 6, '07:30:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Ngọn Hải đăng Hòn Nước (Mũi Điện Tân Phụng)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000051', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80&asset=hai-dang-hon-nuoc-phu-my', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('hai-dang-hon-nuoc-phu-my', 256)), 'Tổng Công ty Bảo đảm An toàn Hàng hải miền Bắc', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000051', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000051', '30000000-0000-4000-8000-000000000051', 1, 'PUBLISHED', 'Tổng Công ty Bảo đảm An toàn Hàng hải miền Bắc', '{"category":"NATURE","latitude":14.266667,"longitude":109.2,"address":"Thôn Tân Phụng, Xã Mỹ Thọ, Huyện Phù Mỹ, Tỉnh Bình Định","referencePriceVnd":20000,"typicalDurationMinutes":90,"slug":"hai-dang-hon-nuoc-phu-my","bannerUrl":"https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000051', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000051';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000051', 'vi', 'Ngọn Hải đăng Hòn Nước (Mũi Điện Tân Phụng)', 'Mắt thần dẫn đường biển cả\nHải đăng Hòn Nước (trước đây gọi là hải đăng Vũng Mới) được xây dựng trên đỉnh núi Gà Đòn ở độ cao hơn 62m so với mặt biển. Từ trạm hải đăng, du khách có thể phóng tầm mắt ngắm nhìn vịnh biển hoang sơ và các bãi đá cuội nhấp nhô tuyệt đẹp.', 'Ngọn hải đăng cổ kính xây dựng trên đỉnh núi đá Gà Đòn từ thời Pháp thuộc, điểm đón bình minh đầu tiên của vùng biển Phù Mỹ hoang sơ.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000051', '60000000-0000-4000-8000-000000000051', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000051', '30000000-0000-4000-8000-000000000051', '20000000-0000-4000-8000-000000000023', 'NATURE', 14.266667, 109.2, 20000, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000510', '30000000-0000-4000-8000-000000000051', 0, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000511', '30000000-0000-4000-8000-000000000051', 1, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000512', '30000000-0000-4000-8000-000000000051', 2, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000513', '30000000-0000-4000-8000-000000000051', 3, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000514', '30000000-0000-4000-8000-000000000051', 4, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000515', '30000000-0000-4000-8000-000000000051', 5, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000516', '30000000-0000-4000-8000-000000000051', 6, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Khu du lịch Cửa Biển (Seagate Park Quy Nhơn)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000052', 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80&asset=khu-du-lich-cua-bien-seagate-park', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('khu-du-lich-cua-bien-seagate-park', 256)), 'Cổng TTĐT Tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000052', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000052', '30000000-0000-4000-8000-000000000052', 1, 'PUBLISHED', 'Cổng TTĐT Tỉnh Bình Định', '{"category":"ADVENTURE","latitude":13.805556,"longitude":109.25,"address":"Bờ bắc Cầu Thị Nại, Khu kinh tế Nhơn Hội, TP. Quy Nhơn, Tỉnh Bình Định","referencePriceVnd":50000,"typicalDurationMinutes":180,"slug":"khu-du-lich-cua-bien-seagate-park","bannerUrl":"https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000052', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000052';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000052', 'vi', 'Khu du lịch Cửa Biển (Seagate Park Quy Nhơn)', 'Công viên giải trí sinh thái năng động\nNằm ngay cửa ngõ bán đảo Phương Mai, Seagate Park mang lại không gian xanh mát và hệ sinh thái trò chơi vận động phong phú: leo núi nhân tạo cao 20m, đu dây zipline qua mặt hồ, chèo thuyền kayak khám phá rừng ngập mặn đầm Thị Nại.', 'Công viên du lịch thể thao mạo hiểm ngoài trời quy mô lớn ngay chân cầu Thị Nại với các trò chơi chèo thuyền kayak, leo núi nhân tạo, bắn cung và cắm trại ven đầm.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000052', '60000000-0000-4000-8000-000000000052', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000052', '30000000-0000-4000-8000-000000000052', '20000000-0000-4000-8000-000000000018', 'ADVENTURE', 13.805556, 109.25, 50000, 180, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000520', '30000000-0000-4000-8000-000000000052', 0, '07:30:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000521', '30000000-0000-4000-8000-000000000052', 1, '07:30:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000522', '30000000-0000-4000-8000-000000000052', 2, '07:30:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000523', '30000000-0000-4000-8000-000000000052', 3, '07:30:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000524', '30000000-0000-4000-8000-000000000052', 4, '07:30:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000525', '30000000-0000-4000-8000-000000000052', 5, '07:30:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000526', '30000000-0000-4000-8000-000000000052', 6, '07:30:00', '19:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Làng nghề Chiếu cói Hoài Châu Bắc & Rừng dừa Tam Quan
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000053', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80&asset=lang-chieu-hoai-chau-bac-rung-dua-tam-quan', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('lang-chieu-hoai-chau-bac-rung-dua-tam-quan', 256)), 'UBND Thị xã Hoài Nhơn & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000053', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000053', '30000000-0000-4000-8000-000000000053', 1, 'PUBLISHED', 'UBND Thị xã Hoài Nhơn & Báo Bình Định', '{"category":"CULTURE","latitude":14.566667,"longitude":109.05,"address":"Xã Hoài Châu Bắc và Phường Tam Quan, Thị xã Hoài Nhơn, Tỉnh Bình Định","referencePriceVnd":0,"typicalDurationMinutes":90,"slug":"lang-chieu-hoai-chau-bac-rung-dua-tam-quan","bannerUrl":"https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000053', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000053';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000053', 'vi', 'Làng nghề Chiếu cói Hoài Châu Bắc & Rừng dừa Tam Quan', 'Xứ sở ngút ngàn dừa Tam Quan\nTam Quan từ lâu đã nổi tiếng với câu ca: "Công đâu công uổng công thừa / Công ra gánh nước tưới dừa Tam Quan". Nơi đây bạt ngàn những rặng dừa xanh mướt cho ra những đặc sản nức tiếng: nước cốt dừa, dầu dừa nguyên chất, bánh tráng nước dừa mè đen giòn rụm.\n\nLàng dệt chiếu cói truyền thống\nLàng chiếu Hoài Châu Bắc lưu giữ nghề dệt chiếu cói thủ công rực rỡ hoa văn. Du khách được tự tay trải nghiệm dệt chiếu, se sợi cói cùng các nghệ nhân lão thành của làng.', 'Xứ dừa bạt ngàn Tam Quan gắn liền với làng nghề dệt chiếu cói truyền thống hàng trăm năm tuổi và món bánh tráng nước dừa thơm lừng nức tiếng.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000053', '60000000-0000-4000-8000-000000000053', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000053', '30000000-0000-4000-8000-000000000053', '20000000-0000-4000-8000-000000000021', 'CULTURE', 14.566667, 109.05, 0, 90, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000530', '30000000-0000-4000-8000-000000000053', 0, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000531', '30000000-0000-4000-8000-000000000053', 1, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000532', '30000000-0000-4000-8000-000000000053', 2, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000533', '30000000-0000-4000-8000-000000000053', 3, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000534', '30000000-0000-4000-8000-000000000053', 4, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000535', '30000000-0000-4000-8000-000000000053', 5, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000536', '30000000-0000-4000-8000-000000000053', 6, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Thắng cảnh Hòn Sẹo (Bãi đá ngũ sắc Nhơn Lý)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000054', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80&asset=thang-canh-hon-seo-nhon-ly', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thang-canh-hon-seo-nhon-ly', 256)), 'UBND Xã Nhơn Lý & Dulich.binhdinh.gov.vn', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000054', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000054', '30000000-0000-4000-8000-000000000054', 1, 'PUBLISHED', 'UBND Xã Nhơn Lý & Dulich.binhdinh.gov.vn', '{"category":"NATURE","latitude":13.9,"longitude":109.333333,"address":"Xã Nhơn Lý, Thành phố Quy Nhơn, Tỉnh Bình Định (cách bờ khoảng 5km)","referencePriceVnd":0,"typicalDurationMinutes":120,"slug":"thang-canh-hon-seo-nhon-ly","bannerUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000054', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000054';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000054', 'vi', 'Thắng cảnh Hòn Sẹo (Bãi đá ngũ sắc Nhơn Lý)', 'Bãi đá sỏi cuội ngũ sắc kỳ diệu\nHòn Sẹo là một hòn đảo nhỏ nguyên sinh nằm ngoài khơi xã Nhơn Lý. Đảo đặc biệt không có bãi cát thoai thoải như nơi khác, thay vào đó là bãi đá cuội tròn vo nhiều màu sắc (đá ngũ sắc) được sóng biển mài giũa nhẵn thín.', 'Hòn đảo hoang sơ độc đáo không có bãi cát mà được rải kín bởi hàng vạn viên đá sỏi cuội tròn nhẵn ngũ sắc, thiên đường lặn ngắm san hô biển sâu.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000054', '60000000-0000-4000-8000-000000000054', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000054', '30000000-0000-4000-8000-000000000054', '20000000-0000-4000-8000-000000000018', 'NATURE', 13.9, 109.333333, 0, 120, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000540', '30000000-0000-4000-8000-000000000054', 0, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000541', '30000000-0000-4000-8000-000000000054', 1, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000542', '30000000-0000-4000-8000-000000000054', 2, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000543', '30000000-0000-4000-8000-000000000054', 3, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000544', '30000000-0000-4000-8000-000000000054', 4, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000545', '30000000-0000-4000-8000-000000000054', 5, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000546', '30000000-0000-4000-8000-000000000054', 6, '07:00:00', '17:00:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- [Place] Thành đá Tà Kơn & Suối nước nóng Vĩnh Thạnh
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('60000000-0000-4000-8000-000000000055', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80&asset=thanh-da-ta-kon-vinh-thanh', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('thanh-da-ta-kon-vinh-thanh', 256)), 'Cổng TTĐT Huyện Vĩnh Thạnh & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('30000000-0000-4000-8000-000000000055', 'PLACE', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('31000000-0000-4000-8000-000000000055', '30000000-0000-4000-8000-000000000055', 1, 'PUBLISHED', 'Cổng TTĐT Huyện Vĩnh Thạnh & Báo Bình Định', '{"category":"ADVENTURE","latitude":14.216667,"longitude":108.75,"address":"Xã Vĩnh Sơn và Vĩnh Thịnh, Huyện Vĩnh Thạnh, Tỉnh Bình Định","referencePriceVnd":0,"typicalDurationMinutes":180,"slug":"thanh-da-ta-kon-vinh-thanh","bannerUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '31000000-0000-4000-8000-000000000055', visibility = 'PUBLIC' WHERE id = '30000000-0000-4000-8000-000000000055';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('31000000-0000-4000-8000-000000000055', 'vi', 'Thành đá Tà Kơn & Suối nước nóng Vĩnh Thạnh', 'Bức thành đá tự nhiên hùng vĩ\nThành đá Tà Kơn là dãy vách đá hoa cương dựng đứng cao hàng chục mét kéo dài hàng cây số tựa như một chiến lũy kiên cố của thiên nhiên ban tặng cho đại ngàn Vĩnh Thạnh.\n\nTắm suối khoáng nóng phục hồi sức khỏe\nDu khách ghé suối nước nóng Vĩnh Thịnh ngâm chân, tắm khoáng nóng giàu khoáng chất tự nhiên và thưởng thức món gà đồi nướng than hoa của đồng bào Ba Na.', 'Bức tường thành đá tự nhiên khổng lồ sừng sững giữa rừng đại ngàn Vĩnh Thạnh gắn với truyền thuyết nghĩa quân Tây Sơn, kết hợp suối khoáng nóng thư giãn.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('31000000-0000-4000-8000-000000000055', '60000000-0000-4000-8000-000000000055', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('30000000-0000-4000-8000-000000000055', '30000000-0000-4000-8000-000000000055', '20000000-0000-4000-8000-000000000027', 'ADVENTURE', 14.216667, 108.75, 0, 180, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000550', '30000000-0000-4000-8000-000000000055', 0, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000551', '30000000-0000-4000-8000-000000000055', 1, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000552', '30000000-0000-4000-8000-000000000055', 2, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000553', '30000000-0000-4000-8000-000000000055', 3, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000554', '30000000-0000-4000-8000-000000000055', 4, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000555', '30000000-0000-4000-8000-000000000055', 5, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);
INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('50000000-0000-4000-8000-000000000556', '30000000-0000-4000-8000-000000000055', 6, '07:00:00', '17:30:00', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);

-- 4. DANH SACH SU KIEN & LE HOI (24 EVENTS)
-- [Event] Festival Tinh hoa Văn hóa Cồng chiêng Tây Nguyên
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80&asset=festival-van-hoa-cong-chieng-tay-nguyen', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('festival-van-hoa-cong-chieng-tay-nguyen', 256)), 'Sở Văn hóa, Thể thao và Du lịch Gia Lai & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000001', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 1, 'PUBLISHED', 'Sở Văn hóa, Thể thao và Du lịch Gia Lai & Báo Gia Lai', '{"placeId":"30000000-0000-4000-8000-000000000005","locationName":"Quảng trường Đại Đoàn Kết, TP. Pleiku, Tỉnh Gia Lai","startsAt":"2026-11-10 01:00:00.000000","endsAt":"2026-11-15 15:00:00.000000","frequency":"Định kỳ 2 năm một lần (Thường tổ chức vào trung tuần tháng 11)","slug":"festival-van-hoa-cong-chieng-tay-nguyen","bannerUrl":"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000001', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000001';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000001', 'vi', 'Festival Tinh hoa Văn hóa Cồng chiêng Tây Nguyên', 'Tôn vinh di sản văn hóa phi vật thể nhân loại\nKhông gian văn hóa cồng chiêng Tây Nguyên trải rộng trên 5 tỉnh Kon Tum, Gia Lai, Đắk Lắk, Đắk Nông và Lâm Đồng. Festival là ngày hội lớn tụ hội hàng ngàn nghệ nhân, diễn viên dân gian của các dân tộc Ba Na, Jrai, Ê Đê, M’Nông, Xơ Đăng... về mảnh đất Gia Lai để phô diễn những thanh âm vang vọng của núi rừng.\n\nCác nghi lễ và hoạt động đặc sắc trong Festival\nFestival diễn ra với chuỗi hoạt động phong phú: Lễ hội đường phố với các đoàn nghệ nhân diễu hành vừa đi vừa hòa tấu cồng chiêng, múa xoang nhịp nhàng; Hội thi tạc tượng gỗ dân gian Tây Nguyên; Trình diễn dệt thổ cẩm thủ công truyền thống; Tái hiện các nghi lễ cúng mừng lúa mới, lễ cúng nhà Rông mới và không gian thưởng thức rượu cần, ẩm thực ẩm thực cơm lam gà nướng thơm nồng.\n\nCẩm nang dành cho du khách\nFestival mở cửa tự do phục vụ nhân dân và du khách thập phương. Du khách nên đặt phòng khách sạn tại Pleiku trước 2-3 tuần do lượng khách đổ về rất đông trong những ngày diễn ra lễ hội.', 'Sự kiện văn hóa quy mô quốc tế tôn vinh Không gian văn hóa cồng chiêng Tây Nguyên - Kiệt tác truyền khẩu và Di sản văn hóa phi vật thể của nhân loại được UNESCO công nhận.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000001', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000005', '2026-11-10 01:00:00.000000', '2026-11-15 15:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Tuần lễ Hoa Dã Quỳ - Núi lửa Chư Đang Ya
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80&asset=tuan-le-hoa-da-quy-chu-dang-ya', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('tuan-le-hoa-da-quy-chu-dang-ya', 256)), 'UBND Huyện Chư Păh & Cổng TTĐT Tỉnh Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000002', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000002', 1, 'PUBLISHED', 'UBND Huyện Chư Păh & Cổng TTĐT Tỉnh Gia Lai', '{"placeId":"30000000-0000-4000-8000-000000000002","locationName":"Làng Ploi lagri, Xã Chư Đang Ya, Huyện Chư Păh, Tỉnh Gia Lai","startsAt":"2026-11-06 01:00:00.000000","endsAt":"2026-11-12 11:00:00.000000","frequency":"Thường niên hàng năm vào tháng 11","slug":"tuan-le-hoa-da-quy-chu-dang-ya","bannerUrl":"https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000002', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000002';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000002', 'vi', 'Tuần lễ Hoa Dã Quỳ - Núi lửa Chư Đang Ya', 'Mùa hoa vàng rực rỡ trên miệng núi lửa\nHàng năm vào tháng 11, khi những cơn mưa dầm Tây Nguyên vừa dứt, khắp các triền đồi, lối mòn và sườn núi lửa Chư Đang Ya lại được bao phủ bởi sắc vàng rực của hoa dã quỳ dại. Tuần lễ hoa dã quỳ là sản phẩm du lịch thương hiệu nổi tiếng thu hút đông đảo bạn trẻ và du khách cả nước.\n\nNhiều hoạt động trải nghiệm văn hóa & Thể thao hấp dẫn\nTrong tuần lễ diễn ra các sự kiện: Bay dù lượn ngắm toàn cảnh miệng núi lửa từ tầng không trung; Hội thi giã gạo truyền thống, đan lát gùi tre; Các trò chơi dân gian như đi cà kheo, đẩy gậy, kéo co; Hội thi ẩm thực giới thiệu các món ăn đặc trưng của đồng bào Jrai.\n\nKinh nghiệm tham gia lễ hội\nDu khách nên đi vào sáng sớm từ 7h - 9h để đón ánh bình minh dịu ngọt trên hoa dã quỳ và chụp được những bức hình check-in ưng ý nhất. Hãy chuẩn bị kem chống nắng, mũ nón và giày thể thao thoải mái.', 'Lễ hội du lịch thiên nhiên và văn hóa đặc sắc bậc nhất Gia Lai khi hoa dã quỳ nở vàng rực rỡ khắp miệng núi lửa triệu năm tuổi Chư Đang Ya.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000002', '70000000-0000-4000-8000-000000000002', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', '2026-11-06 01:00:00.000000', '2026-11-12 11:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ hội Cầu Mưa Yang Pơtao Apui (Lễ Cầu Mưa Vua Lửa)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80&asset=le-hoi-cau-mua-vua-lua-plei-oi', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-hoi-cau-mua-vua-lua-plei-oi', 256)), 'Cục Di sản Văn hóa & Sở VHTTDL Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000003', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000003', 1, 'PUBLISHED', 'Cục Di sản Văn hóa & Sở VHTTDL Gia Lai', '{"placeId":"30000000-0000-4000-8000-000000000015","locationName":"Di tích Lịch sử Quốc gia Plei Ơi, Xã Ayun Hạ, Huyện Phú Thiện, Tỉnh Gia Lai","startsAt":"2026-05-15 01:00:00.000000","endsAt":"2026-05-16 11:00:00.000000","frequency":"Thường niên vào trung tuần tháng 4 âm lịch","slug":"le-hoi-cau-mua-vua-lua-plei-oi","bannerUrl":"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000003', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000003';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000003', 'vi', 'Lễ hội Cầu Mưa Yang Pơtao Apui (Lễ Cầu Mưa Vua Lửa)', 'Nghi lễ nông nghiệp huyền bí của người Jrai\nLễ Cầu mưa của Vua Lửa (Yang Pơtao Apui) phản ánh triết lý nhân sinh gắn bó mật thiết giữa con người và tự nhiên. Nghi lễ được tổ chức tại khu nhà chòi thiêng của làng Plei Ơi nhằm cầu xin các đấng Yang (thần linh) ban mưa mát cho cỏ cây đâm chồi, xua tan khô hạn của vùng thung lũng sông Ba.\n\nCác nghi thức cổ truyền\nLễ vật hiến tế gồm một con heo thiến, ghè rượu cần, gạo nếp và trầu cau. Người phụ tá (thầy cúng kế vị) tiến hành đọc bài cúng thần gươm thiêng, thần rừng, thần núi, cầu xin nước trời rơi xuống. Sau phần nghi lễ trang trọng là phần hội rộn ràng tiếng chiêng vang dội và điệu múa xoang của các chàng trai cô gái Jrai.', 'Nghi lễ tín ngưỡng nông nghiệp cổ xưa huyền bí của đồng bào Jrai, Di sản văn hóa phi vật thể quốc gia cầu xin thần linh ban mưa thuận gió hòa, mùa màng bội thu.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000003', '70000000-0000-4000-8000-000000000003', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000015', '2026-05-15 01:00:00.000000', '2026-05-16 11:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Hội Đua Thuyền Độc Mộc trên Sông Pô Cô (Cúp A Sanh)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80&asset=hoi-dua-thuyen-doc-moc-song-po-co', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('hoi-dua-thuyen-doc-moc-song-po-co', 256)), 'UBND Huyện Ia Grai & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000004', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000004', 1, 'PUBLISHED', 'UBND Huyện Ia Grai & Báo Gia Lai', '{"placeId":"30000000-0000-4000-8000-000000000017","locationName":"Bến đò A Sanh, Làng Dăng, Xã Ia O, Huyện Ia Grai, Tỉnh Gia Lai","startsAt":"2026-11-20 01:00:00.000000","endsAt":"2026-11-22 10:00:00.000000","frequency":"Thường niên hàng năm vào tháng 11","slug":"hoi-dua-thuyen-doc-moc-song-po-co","bannerUrl":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000004', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000004';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000004', 'vi', 'Hội Đua Thuyền Độc Mộc trên Sông Pô Cô (Cúp A Sanh)', 'Hào khí anh hùng trên dòng sông Pô Cô\nThuyền độc mộc là phương tiện di chuyển lâu đời được đục rỗng từ một thân cây gỗ nguyên khối của đồng bào Jrai ven sông Pô Cô. Hội đua thuyền độc mộc tranh cúp A Sanh là sự kiện tôn vinh tinh thần kiên cường, quả cảm của người dân biên cương và tri ân người anh hùng lái đò A Sanh huyền thoại.\n\nCác chặng đua kịch tính & Liên hoan cồng chiêng\nCác đội thuyền thi đấu nội dung đôi nam chèo cự ly 1.000m trên mặt sông xanh biếc. Tiếng reo hò cổ vũ, tiếng cồng chiêng rộn rã bên bờ sông tạo nên bầu không khí lễ hội sôi động náo nhiệt chưa từng có.', 'Hội đua thuyền thể thao sông nước truyền thống độc đáo bậc nhất Tây Nguyên, tái hiện hào khí người lái đò A Sanh kiên cường chèo thuyền độc mộc qua dòng Pô Cô.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000004', '70000000-0000-4000-8000-000000000004', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000017', '2026-11-20 01:00:00.000000', '2026-11-22 10:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Giải chạy Gia Lai City Trail - Giấc mơ đại ngàn
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000005', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80&asset=giai-chay-gia-lai-city-trail', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('giai-chay-gia-lai-city-trail', 256)), 'UBND TP. Pleiku & Ban Tổ chức Gia Lai City Trail', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000005', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000005', 1, 'PUBLISHED', 'UBND TP. Pleiku & Ban Tổ chức Gia Lai City Trail', '{"placeId":"30000000-0000-4000-8000-000000000001","locationName":"Thành phố Pleiku và Huyện Chư Păh, Tỉnh Gia Lai","startsAt":"2026-11-14 21:00:00.000000","endsAt":"2026-11-15 10:00:00.000000","frequency":"Thường niên vào trung tuần tháng 11","slug":"giai-chay-gia-lai-city-trail","bannerUrl":"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000005', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000005';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000005', 'vi', 'Giải chạy Gia Lai City Trail - Giấc mơ đại ngàn', 'Cung đường chạy đẹp nhất Tây Nguyên\nGia Lai City Trail đưa các runner trải nghiệm những cung đường mộng mơ: chạy xuyên qua hai hàng thông trăm tuổi, bạt ngàn nương chè xanh Biển Hồ Chè, ngắm nhìn bình minh trên Biển Hồ T’Nưng và uốn lượn dưới chân núi lửa Chư Đang Ya.\n\nCác cự ly thi đấu đa dạng\nGiải gồm 4 cự ly: 42km (Full Marathon), 21km (Half Marathon), 10km và 5km phù hợp cho cả vận động viên chuyên nghiệp lẫn người chạy phong trào và gia đình.', 'Giải chạy marathon kết hợp đường mòn trail quy mô quốc gia thu hút hơn 5.000 vận động viên trong và ngoài nước chinh phục các danh thắng tuyệt đẹp của Gia Lai.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000005', '70000000-0000-4000-8000-000000000005', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000001', '2026-11-14 21:00:00.000000', '2026-11-15 10:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ Mừng Lúa Mới (Yang Sa) của đồng bào Jrai & Ba Na
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80&asset=le-mung-lua-moi-yang-sa', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-mung-lua-moi-yang-sa', 256)), 'Sở VHTTDL Tỉnh Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000006', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000006', '40000000-0000-4000-8000-000000000006', 1, 'PUBLISHED', 'Sở VHTTDL Tỉnh Gia Lai', '{"placeId":"30000000-0000-4000-8000-000000000028","locationName":"Làng Văn hóa Du lịch Plei Ốp, Phường Hoa Lư, TP. Pleiku, Tỉnh Gia Lai","startsAt":"2026-12-20 01:00:00.000000","endsAt":"2026-12-22 15:00:00.000000","frequency":"Hàng năm vào dịp kết thúc vụ thu hoạch lúa rẫy (Tháng 12 đến tháng 1)","slug":"le-mung-lua-moi-yang-sa","bannerUrl":"https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000006', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000006';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000006', 'vi', 'Lễ Mừng Lúa Mới (Yang Sa) của đồng bào Jrai & Ba Na', 'Ý nghĩa văn hóa tâm linh\nLễ Mừng Lúa Mới (Yang Sa trong tiếng Jrai, Bơ Mâu trong tiếng Ba Na) là một trong những lễ hội nông nghiệp quan trọng nhất trong chu kỳ canh tác nương rẫy của người Tây Nguyên. Buôn làng làm lễ rước Hồn Lúa từ rẫy về kho thóc để tạ ơn thần linh che chở cho lúa trĩu bông, không bị chim chóc sâu bọ phá hoại.\n\nKhông khí lễ hội tại buôn làng\nMỗi gia đình đều mang ché rượu cần thơm ngon nhất, gùi nếp mới và thịt heo nướng ra nhà Rông cùng nhau cúng thần và chia sẻ niềm vui được mùa. Mọi người cùng nắm tay nhau múa xoang vòng quanh đống lửa thâu đêm suốt sáng.', 'Nghi lễ tạ ơn Giàng (Trời) và Hồn Lúa đã ban cho buôn làng một vụ mùa ấm no, đánh dấu thời khắc nông nhàn sum họp rượu cần và hòa tấu cồng chiêng rộn rã.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000006', '70000000-0000-4000-8000-000000000006', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000006', '40000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000028', '2026-12-20 01:00:00.000000', '2026-12-22 15:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ Bỏ Mả (Pơ Thi) - Huyền thoại tiễn đưa linh hồn
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000007', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80&asset=le-bo-ma-po-thi-tay-nguyen', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-bo-ma-po-thi-tay-nguyen', 256)), 'Bảo tàng Tỉnh Gia Lai & Viện Nghiên cứu Văn hóa Dân gian', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000007', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000007', '40000000-0000-4000-8000-000000000007', 1, 'PUBLISHED', 'Bảo tàng Tỉnh Gia Lai & Viện Nghiên cứu Văn hóa Dân gian', '{"placeId":"30000000-0000-4000-8000-000000000014","locationName":"Các buôn làng dân tộc Jrai và Ba Na, Tỉnh Gia Lai","startsAt":"2026-03-10 01:00:00.000000","endsAt":"2026-03-13 14:00:00.000000","frequency":"Mùa Ninh Nơng (Mùa nông nhàn từ tháng 1 đến tháng 3 âm lịch)","slug":"le-bo-ma-po-thi-tay-nguyen","bannerUrl":"https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000007', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000007';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000007', 'vi', 'Lễ Bỏ Mả (Pơ Thi) - Huyền thoại tiễn đưa linh hồn', 'Triết lý nhân sinh độc đáo\nNgười Tây Nguyên quan niệm cái chết chưa phải là sự chấm dứt. Trước lễ Bỏ Mả, người sống vẫn thường xuyên mang cơm nước ra mộ chăm sóc người mất. Chỉ sau lễ Pơ Thi, mối liên hệ giữa người sống và người chết mới hoàn toàn chấm dứt, linh hồn được siêu thoát để đầu thai.\n\nNghệ thuật kiến trúc nhà mồ & Tượng gỗ dân gian\nĐể chuẩn bị lễ Pơ Thi, cả gia tộc và buôn làng cùng dựng một ngôi nhà mồ mới chạm khắc hoa văn tinh xảo, tạc những bức tượng gỗ sinh động (tượng người phụ nữ mang thai, tượng người đàn ông trầm tư, tượng thú rừng...). Lễ hội kéo dài 3 - 4 ngày với âm thanh cồng chiêng ngân vang không ngớt.', 'Đại lễ hội tâm linh lớn nhất đời người của các dân tộc Tây Nguyên, tiễn biệt vĩnh viễn linh hồn người quá cố về thế giới tổ tiên để bước vào kiếp sống mới.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000007', '70000000-0000-4000-8000-000000000007', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000007', '40000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000014', '2026-03-10 01:00:00.000000', '2026-03-13 14:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Hội Cầu Huê & Kỷ niệm Khởi nghĩa Tây Sơn Thượng Đạo
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000008', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80&asset=hoi-cau-hue-an-khe', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('hoi-cau-hue-an-khe', 256)), 'UBND Thị xã An Khê & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000008', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000008', '40000000-0000-4000-8000-000000000008', 1, 'PUBLISHED', 'UBND Thị xã An Khê & Báo Gia Lai', '{"placeId":"30000000-0000-4000-8000-000000000009","locationName":"Đình An Lũy (An Khê Đình), Thị xã An Khê, Tỉnh Gia Lai","startsAt":"2026-02-20 01:00:00.000000","endsAt":"2026-02-22 11:00:00.000000","frequency":"Mùng 4 đến mùng 6 tháng Giêng âm lịch hàng năm","slug":"hoi-cau-hue-an-khe","bannerUrl":"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000008', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000008';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000008', 'vi', 'Hội Cầu Huê & Kỷ niệm Khởi nghĩa Tây Sơn Thượng Đạo', 'Phiên chợ phiên đầu xuân của nghĩa quân Tây Sơn\nHội Cầu Huê xưa kia là nơi người Kinh vùng đồng bằng lên giao thương buôn bán muối mắm, đồ kim loại với lâm thổ sản của đồng bào Ba Na vùng Tây Sơn Thượng Đạo, đồng thời là dịp để nghĩa quân Tây Sơn chiêu mộ hào kiệt.\n\nNghi lễ tế tiền hiền & Hội thi võ cổ truyền\nLễ hội bắt đầu bằng nghi thức rước sắc lệnh, tế tiền hiền tại Đình An Lũy, tái hiện cảnh xuất quân đánh giặc cứu nước của ba anh em Tây Sơn, tiếp nối là các màn múa cờ, biểu diễn võ thuật cổ truyền Bình Định - Tây Sơn và trò chơi dân gian rộn ràng.', 'Lễ hội truyền thống độc đáo ghi dấu phiên chợ đầu xuân Cầu Huê của người Kinh và đồng bào Thượng, kết hợp kỷ niệm chiến thắng Ngọc Hồi - Đống Đa hào hùng.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000008', '70000000-0000-4000-8000-000000000008', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000008', '40000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000009', '2026-02-20 01:00:00.000000', '2026-02-22 11:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ hội Cà phê và Ẩm thực Đường phố Cao nguyên Pleiku
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000009', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80&asset=le-hoi-ca-phe-am-thuc-cao-nguyen-pleiku', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-hoi-ca-phe-am-thuc-cao-nguyen-pleiku', 256)), 'Hiệp hội Cà phê Gia Lai & UBND TP. Pleiku', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000009', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000009', '40000000-0000-4000-8000-000000000009', 1, 'PUBLISHED', 'Hiệp hội Cà phê Gia Lai & UBND TP. Pleiku', '{"placeId":"30000000-0000-4000-8000-000000000005","locationName":"Quảng trường Đại Đoàn Kết, Thành phố Pleiku, Tỉnh Gia Lai","startsAt":"2026-04-29 01:00:00.000000","endsAt":"2026-05-03 15:00:00.000000","frequency":"Dịp nghỉ lễ 30/4 - 1/5 hàng năm","slug":"le-hoi-ca-phe-am-thuc-cao-nguyen-pleiku","bannerUrl":"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000009', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000009';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000009', 'vi', 'Lễ hội Cà phê và Ẩm thực Đường phố Cao nguyên Pleiku', 'Hương vị cà phê Robusta đậm đà cao nguyên\nGia Lai là thủ phủ cà phê Robusta với diện tích gần 100.000ha. Lễ hội quy tụ hàng chục thương hiệu cà phê đặc sản hàng đầu, không gian biểu diễn pha chế barista đỉnh cao và góc thưởng thức cà phê miễn phí dành cho du khách.\n\nKhám phá thế giới ẩm thực phong phú\nHơn 50 gian hàng ẩm thực giới thiệu các món ngon đặc sản: Phở hai tô Pleiku chuẩn vị, Bò một nắng Krông Pa chấm muối kiến vàng, Gà nướng sa lửa cơm lam, Bún cua thối (bún mắm cua) nức tiếng và các loại bia thủ công hương trái cây Tây Nguyên.', 'Ngày hội văn hóa ẩm thực tôn vinh hạt cà phê Robusta Pleiku thơm nồng và các món ăn đặc sản trứ danh của vùng đất cao nguyên Gia Lai.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000009', '70000000-0000-4000-8000-000000000009', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000009', '40000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000005', '2026-04-29 01:00:00.000000', '2026-05-03 15:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Tuần lễ Khám phá Thiên nhiên & Trekking VQG Kon Ka Kinh - Thác K50
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000010', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80&asset=tuan-le-kham-pha-thien-nhien-kon-ka-kinh-k50', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('tuan-le-kham-pha-thien-nhien-kon-ka-kinh-k50', 256)), 'Ban Quản lý VQG Kon Ka Kinh & KBTTN Kon Chư Răng', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000010', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000010', '40000000-0000-4000-8000-000000000010', 1, 'PUBLISHED', 'Ban Quản lý VQG Kon Ka Kinh & KBTTN Kon Chư Răng', '{"placeId":"30000000-0000-4000-8000-000000000008","locationName":"Vườn Quốc gia Kon Ka Kinh và KBTTN Kon Chư Răng, Tỉnh Gia Lai","startsAt":"2026-03-25 01:00:00.000000","endsAt":"2026-03-30 11:00:00.000000","frequency":"Hàng năm vào cuối tháng 3 (Thời tiết khô ráo, hoa rừng khoe sắc)","slug":"tuan-le-kham-pha-thien-nhien-kon-ka-kinh-k50","bannerUrl":"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000010', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000010';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000010', 'vi', 'Tuần lễ Khám phá Thiên nhiên & Trekking VQG Kon Ka Kinh - Thác K50', 'Hành trình xanh giữa đại ngàn Tây Nguyên\nChương trình mang đến các tour trekking chuyên nghiệp dẫn dắt du khách thám hiểm hệ động thực vật Vườn Di sản ASEAN Kon Ka Kinh, ngắm loài Voọc chà vá chân xám và chinh phục dòng thác K50 tráng lệ.\n\nHội thảo bảo tồn & Cắm trại sinh thái\nBên cạnh hoạt động dã ngoại, tuần lễ còn diễn ra tọa đàm khoa học về bảo tồn đa dạng sinh học và phát triển du lịch sinh thái bền vững gắn với sinh kế của cộng đồng người bản địa.', 'Sự kiện du lịch sinh thái mạo hiểm kết nối hai khu bảo tồn lớn của Gia Lai, mở ra những hành trình trekking khám phá rừng già và hệ thống thác nước ngoạn mục.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000010', '70000000-0000-4000-8000-000000000010', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000010', '40000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000008', '2026-03-25 01:00:00.000000', '2026-03-30 11:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ Đâm Trâu (Tạ ơn Giàng - Tơ Mơ Kơ Pô) người Ba Na
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000011', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80&asset=le-dam-trau-ta-on-giang-to-mo-ko-po', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-dam-trau-ta-on-giang-to-mo-ko-po', 256)), 'Bảo tàng Dân tộc học & Báo Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000011', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000011', '40000000-0000-4000-8000-000000000011', 1, 'PUBLISHED', 'Bảo tàng Dân tộc học & Báo Gia Lai', '{"placeId":"30000000-0000-4000-8000-000000000030","locationName":"Làng Dektur, Xã Đak Sơ Mei, Huyện Mang Yang, Tỉnh Gia Lai","startsAt":"2026-04-10 01:00:00.000000","endsAt":"2026-04-12 14:00:00.000000","frequency":"Tổ chức vào dịp khánh thành nhà Rông mới hoặc lễ hội cộng đồng lớn","slug":"le-dam-trau-ta-on-giang-to-mo-ko-po","bannerUrl":"https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000011', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000011';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000011', 'vi', 'Lễ Đâm Trâu (Tạ ơn Giàng - Tơ Mơ Kơ Pô) người Ba Na', 'Nghi lễ tạ ơn thần linh thiêng liêng\nTrong tâm thức người Ba Na, con trâu là vật tế lễ cao quý nhất dâng lên các đấng Yang để tạ ơn đã ban cho buôn làng mưa thuận gió hòa, người người khỏe mạnh, con cái sinh sôi nảy nở.\n\nCột Blang (Gơng Sa) & Vũ điệu xoang huyền bí\nCột tế trâu được đẽo từ thân cây gỗ lớn, chạm trổ hoa văn hình học tinh xảo và treo bông tua rực rỡ tượng trưng cho cây vũ trụ nối liền đất trời. Trong tiếng cồng chiêng dồn dập, các tráng sĩ múa khiên gươm quanh cột tế, sau đó thịt trâu được chia đều cho tất cả mọi gia đình trong buôn làng làm biểu tượng của sự no ấm đoàn kết.', 'Nghi lễ tạ ơn Trời Đất thần linh cổ xưa nhất của người Ba Na, thể hiện tinh thần thượng võ, sự gắn kết cộng đồng và lòng biết ơn thiên nhiên.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000011', '70000000-0000-4000-8000-000000000011', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000011', '40000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000030', '2026-04-10 01:00:00.000000', '2026-04-12 14:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Hội Hoa Xuân & Phiên chợ Nông sản OCOP Gia Lai
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000012', 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80&asset=hoi-hoa-xuan-phien-cho-ocop-gia-lai', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('hoi-hoa-xuan-phien-cho-ocop-gia-lai', 256)), 'Sở Nông nghiệp và PTNT Tỉnh Gia Lai', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000012', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000012', '40000000-0000-4000-8000-000000000012', 1, 'PUBLISHED', 'Sở Nông nghiệp và PTNT Tỉnh Gia Lai', '{"placeId":"30000000-0000-4000-8000-000000000020","locationName":"Công viên Diên Hồng và Đường Anh Hùng Núp, TP. Pleiku, Tỉnh Gia Lai","startsAt":"2026-01-30 01:00:00.000000","endsAt":"2026-02-08 15:00:00.000000","frequency":"Thường niên vào dịp Tết Nguyên Đán","slug":"hoi-hoa-xuan-phien-cho-ocop-gia-lai","bannerUrl":"https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000012', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000012';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000012', 'vi', 'Hội Hoa Xuân & Phiên chợ Nông sản OCOP Gia Lai', 'Sắc xuân rực rỡ phố núi Pleiku\nHội Hoa Xuân quy tụ hàng trăm ngàn chậu hoa mai rừng Tây Nguyên, hoa cúc vạn thọ, hoa đào xứ lạnh, phong lan rừng quý hiếm và cây cảnh bonsai nghệ thuật được các nghệ nhân chăm chút công phu.\n\nKhông gian sản phẩm đặc sản OCOP Gia Lai\nPhiên chợ OCOP là nơi trưng bày và bán các sản phẩm chứng nhận sao: Mật ong rừng hoa cà phê, Hạt mắc ca Kbang, Hồ tiêu Chư Sê, Chuối sấy dẻo Đak Đoa, Gạo Ba Chăm Phú Thiện, Thịt bò một nắng Krông Pa thơm ngon phục vụ người dân đón Tết cổ truyền.', 'Hội chợ hoa Tết rực rỡ sắc màu và không gian xúc tiến thương mại nông sản OCOP tiêu biểu của 17 huyện, thị xã, thành phố trong tỉnh Gia Lai.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000012', '70000000-0000-4000-8000-000000000012', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000012', '40000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000020', '2026-01-30 01:00:00.000000', '2026-02-08 15:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ hội Kỷ niệm Chiến thắng Ngọc Hồi - Đống Đa (Lễ hội Đống Đa - Tây Sơn)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000013', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80&asset=le-hoi-dong-da-tay-son', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-hoi-dong-da-tay-son', 256)), 'UBND Tỉnh Bình Định & Bảo tàng Quang Trung', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000013', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000013', '40000000-0000-4000-8000-000000000013', 1, 'PUBLISHED', 'UBND Tỉnh Bình Định & Bảo tàng Quang Trung', '{"placeId":"30000000-0000-4000-8000-000000000037","locationName":"Bảo tàng Quang Trung, Thị trấn Phú Phong, Huyện Tây Sơn, Tỉnh Bình Định","startsAt":"2026-02-20 00:30:00.000000","endsAt":"2026-02-22 15:00:00.000000","frequency":"Thường niên vào mùng 4 và mùng 5 tháng Giêng âm lịch","slug":"le-hoi-dong-da-tay-son","bannerUrl":"https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000013', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000013';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000013', 'vi', 'Lễ hội Kỷ niệm Chiến thắng Ngọc Hồi - Đống Đa (Lễ hội Đống Đa - Tây Sơn)', 'Hào khí áo vải cờ đào đất Tây Sơn\nLễ hội Đống Đa là sự kiện văn hóa lịch sử trọng đại của tỉnh Bình Định. Hàng vạn người dân và du khách cả nước cùng đổ về đất Kiên Mỹ để dâng hương tri ân vị anh hùng dân tộc Quang Trung - Nguyễn Huệ và các tướng lĩnh nghĩa quân Tây Sơn.\n\nChương trình trống trận & Võ thuật đỉnh cao\nĐiểm nhấn rực rỡ là màn hòa tấu Trống trận Tây Sơn với dàn trống hào hùng, màn thao diễn võ thuật cổ truyền bách chiến bách thắng, tái hiện cảnh hành quân thần tốc của nghĩa quân Tây Sơn giải phóng Thăng Long.', 'Đại lễ hội lịch sử lớn nhất trong năm của Bình Định tưởng nhớ công đức Hoàng đế Quang Trung và chiến thắng hiển hách quét sạch 29 vạn quân Thanh mùa xuân Kỷ Dậu 1789.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000013', '70000000-0000-4000-8000-000000000013', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000013', '40000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000037', '2026-02-20 00:30:00.000000', '2026-02-22 15:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ hội Chùa Bà - Cảng thị Nước Mặn
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000014', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80&asset=le-hoi-chua-ba-nuoc-man', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-hoi-chua-ba-nuoc-man', 256)), 'Cục Di sản Văn hóa & Sở VHTTDL Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000014', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000014', '40000000-0000-4000-8000-000000000014', 1, 'PUBLISHED', 'Cục Di sản Văn hóa & Sở VHTTDL Bình Định', '{"placeId":"30000000-0000-4000-8000-000000000041","locationName":"Di tích Chùa Bà, Thôn An Hòa, Xã Phước Quang, Huyện Tuy Phước, Tỉnh Bình Định","startsAt":"2026-03-18 01:00:00.000000","endsAt":"2026-03-21 14:00:00.000000","frequency":"Thường niên từ ngày cuối tháng Giêng đến mùng 2 tháng Hai âm lịch","slug":"le-hoi-chua-ba-nuoc-man","bannerUrl":"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000014', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000014';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000014', 'vi', 'Lễ hội Chùa Bà - Cảng thị Nước Mặn', 'Dấu ấn thương cảng cổ phồn hoa\nCảng thị Nước Mặn từng là trung tâm mậu dịch quốc tế sầm uất bậc nhất Đàng Trong vào thế kỷ XVII. Lễ hội Chùa Bà được tổ chức để tạ ơn Thiên Hậu Thánh Mẫu đã phù trợ cho tàu thuyền buôn bán thuận buồm xuôi gió.\n\nNghi lễ rước sắc nghinh thần & Hội Bài Chòi\nLễ hội diễn ra các nghi thức rước sắc trang trọng tưởng nhớ các bậc tiền hiền mở cõi, múa lân sư rồng, thi đấu cờ người và hội đánh Bài Chòi rộn rã tiếng cười vui.', 'Di sản văn hóa phi vật thể Quốc gia gắn liền với lịch sử thương cảng Nước Mặn phồn hoa gần 400 năm trước, tôn vinh tinh thần đoàn kết giao lưu văn hóa Việt - Hoa.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000014', '70000000-0000-4000-8000-000000000014', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000014', '40000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000041', '2026-03-18 01:00:00.000000', '2026-03-21 14:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Liên hoan Quốc tế Võ cổ truyền Việt Nam tại Đất Võ Bình Định
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000015', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80&asset=lien-hoan-quoc-te-vo-co-truyen-viet-nam-binh-dinh', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('lien-hoan-quoc-te-vo-co-truyen-viet-nam-binh-dinh', 256)), 'Liên đoàn Võ thuật Cổ truyền Việt Nam & UBND Tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000015', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000015', '40000000-0000-4000-8000-000000000015', 1, 'PUBLISHED', 'Liên đoàn Võ thuật Cổ truyền Việt Nam & UBND Tỉnh Bình Định', '{"placeId":"30000000-0000-4000-8000-000000000037","locationName":"Quảng trường Nguyễn Tất Thành, TP. Quy Nhơn và các võ đường Bình Định","startsAt":"2026-08-01 01:00:00.000000","endsAt":"2026-08-06 15:00:00.000000","frequency":"Định kỳ 2 năm một lần vào mùa hè","slug":"lien-hoan-quoc-te-vo-co-truyen-viet-nam-binh-dinh","bannerUrl":"https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000015', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000015';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000015', 'vi', 'Liên hoan Quốc tế Võ cổ truyền Việt Nam tại Đất Võ Bình Định', 'Hội tụ tinh hoa võ thuật năm châu\nVõ cổ truyền Bình Định là Di sản văn hóa phi vật thể Quốc gia. Liên hoan là ngày hội lớn tôn vinh tinh thần thượng võ, nơi các võ phái khắp thế giới hội ngộ, biểu diễn các bài quyền, thập bát ban binh khí và kỹ thuật đối kháng đỉnh cao.', 'Đại hội tinh hoa võ thuật quốc tế quy tụ hàng ngàn võ sư, võ sinh từ hơn 30 quốc gia trên thế giới về miền đất tổ giao lưu, biểu diễn tuyệt kỹ võ cổ truyền Việt Nam.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000015', '70000000-0000-4000-8000-000000000015', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000015', '40000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000037', '2026-08-01 01:00:00.000000', '2026-08-06 15:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Giải đua thuyền máy Nhà nghề Quốc tế Grand Prix of Binh Dinh (UIM F1H2O & Aquabike)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000016', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80&asset=giai-dua-thuyen-may-f1h2o-binh-dinh', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('giai-dua-thuyen-may-f1h2o-binh-dinh', 256)), 'Liên đoàn Đua thuyền máy Quốc tế UIM & UBND Tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000016', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000016', '40000000-0000-4000-8000-000000000016', 1, 'PUBLISHED', 'Liên đoàn Đua thuyền máy Quốc tế UIM & UBND Tỉnh Bình Định', '{"placeId":"30000000-0000-4000-8000-000000000044","locationName":"Vịnh Thị Nại, Thành phố Quy Nhơn, Tỉnh Bình Định","startsAt":"2026-03-27 01:00:00.000000","endsAt":"2026-03-31 11:00:00.000000","frequency":"Thường niên hàng năm vào cuối tháng 3","slug":"giai-dua-thuyen-may-f1h2o-binh-dinh","bannerUrl":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000016', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000016';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000016', 'vi', 'Giải đua thuyền máy Nhà nghề Quốc tế Grand Prix of Binh Dinh (UIM F1H2O & Aquabike)', 'Sự kiện thể thao biển đẳng cấp quốc tế\nLần đầu tiên tại Việt Nam, khán giả được tận mắt chứng kiến những cỗ máy đua thuyền F1 lao đi với vận tốc trên 250km/h trên mặt nước đầm Thị Nại, cùng các màn nhào lộn mô tô nước ngoạn mục của các tay đua hàng đầu hành tinh.', 'Giải vô địch thế giới đua thuyền máy Công thức 1 (F1H2O) và mô tô nước (Aquabike) đỉnh cao thế giới tranh tài trên vịnh nước lợ Thị Nại lộng gió.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000016', '70000000-0000-4000-8000-000000000016', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000016', '40000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000044', '2026-03-27 01:00:00.000000', '2026-03-31 11:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ hội Cầu Ngư Nam Hải (Lễ hội Lăng Ông làng chài Bình Định)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000017', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80&asset=le-hoi-cau-ngu-nam-hai-binh-dinh', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-hoi-cau-ngu-nam-hai-binh-dinh', 256)), 'Bảo tàng Tỉnh Bình Định & Sở Du lịch Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000017', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000017', '40000000-0000-4000-8000-000000000017', 1, 'PUBLISHED', 'Bảo tàng Tỉnh Bình Định & Sở Du lịch Bình Định', '{"placeId":"30000000-0000-4000-8000-000000000033","locationName":"Các lăng Ông làng chài ven biển Nhơn Hải, Nhơn Lý (Quy Nhơn) và Hoài Nhơn","startsAt":"2026-03-05 00:30:00.000000","endsAt":"2026-03-07 14:00:00.000000","frequency":"Thường niên vào tháng Giêng và tháng Hai âm lịch","slug":"le-hoi-cau-ngu-nam-hai-binh-dinh","bannerUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000017', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000017';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000017', 'vi', 'Lễ hội Cầu Ngư Nam Hải (Lễ hội Lăng Ông làng chài Bình Định)', 'Tín ngưỡng thờ Thần Nam Hải của dân làng chài\nTrong tâm thức của ngư dân miền biển Bình Định, cá Voi là vị thần hộ mệnh thường xuất hiện cứu giúp tàu thuyền mỗi khi gặp bão tố. Lễ hội Cầu Ngư là dịp để cộng đồng làng chài tri ân biển cả và gắn kết tình làng nghĩa xóm.\n\nHát chèo Bả Trạo & Đua thuyền thúng\nĐiểm đặc sắc nhất là nghi thức Hát múa Bả Trạo tái hiện hình ảnh đoàn thủy thủ đồng lòng chèo thuyền vượt sóng to gió cả, theo sau là hội đua thuyền rồng, đua thuyền thúng sôi động trên mặt biển.', 'Tín ngưỡng văn hóa tâm linh của ngư dân duyên hải Bình Định tôn kính Thần Nam Hải (Cá Voi), cầu mong trời yên biển lặng, tàu thuyền ra khơi tôm cá đầy khoang.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000017', '70000000-0000-4000-8000-000000000017', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000017', '40000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000033', '2026-03-05 00:30:00.000000', '2026-03-07 14:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ hội Chùa Ông Núi (Linh Phong Thiền Tự)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000018', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80&asset=le-hoi-chua-ong-nui-phu-cat', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-hoi-chua-ong-nui-phu-cat', 256)), 'Giáo hội Phật giáo Việt Nam tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000018', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000018', '40000000-0000-4000-8000-000000000018', 1, 'PUBLISHED', 'Giáo hội Phật giáo Việt Nam tỉnh Bình Định', '{"placeId":"30000000-0000-4000-8000-000000000040","locationName":"Chùa Linh Phong, Xã Cát Tiến, Huyện Phù Cát, Tỉnh Bình Định","startsAt":"2026-03-12 01:00:00.000000","endsAt":"2026-03-14 12:00:00.000000","frequency":"Thường niên vào ngày 24 và 25 tháng Giêng âm lịch","slug":"le-hoi-chua-ong-nui-phu-cat","bannerUrl":"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000018', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000018';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000018', 'vi', 'Lễ hội Chùa Ông Núi (Linh Phong Thiền Tự)', 'Hành hương đất Phật đầu xuân\nLễ hội Chùa Ông Núi là một trong những lễ hội hành hương xuân lớn nhất miền Trung. Dòng người nườm nượp leo từng bậc thang đá lên đỉnh núi Bà dâng hương chiêm bái, cầu mong sức khỏe, may mắn cho gia đình trong năm mới.', 'Ngày giỗ tổ Viên Minh thiền sư (Ông Núi), thu hút hàng chục vạn phật tử và du khách thập phương hành hương chiêm bái đại tượng Phật ngồi khổng lồ cầu tài lộc, bình an.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000018', '70000000-0000-4000-8000-000000000018', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000018', '40000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000040', '2026-03-12 01:00:00.000000', '2026-03-14 12:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ hội Du lịch Biển Quy Nhơn - Bình Định ("Quy Nhơn - Thiên đường biển")
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000019', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80&asset=le-hoi-du-lich-bien-quy-nhon', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-hoi-du-lich-bien-quy-nhon', 256)), 'Sở Du lịch Tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000019', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000019', '40000000-0000-4000-8000-000000000019', 1, 'PUBLISHED', 'Sở Du lịch Tỉnh Bình Định', '{"placeId":"30000000-0000-4000-8000-000000000034","locationName":"Quảng trường Nguyễn Tất Thành và Bãi biển Quy Nhơn, Tỉnh Bình Định","startsAt":"2026-04-28 01:00:00.000000","endsAt":"2026-05-04 16:00:00.000000","frequency":"Thường niên dịp khai mạc mùa du lịch hè (cuối tháng 4 đến đầu tháng 5)","slug":"le-hoi-du-lich-bien-quy-nhon","bannerUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000019', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000019';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000019', 'vi', 'Lễ hội Du lịch Biển Quy Nhơn - Bình Định ("Quy Nhơn - Thiên đường biển")', 'Mùa hè rực lửa bên vịnh biển Quy Nhơn\nLễ hội du lịch biển biến thành phố biển Quy Nhơn thành một thiên đường lễ hội với các đêm nhạc EDM sôi động quy tụ các ngôi sao ca nhạc hàng đầu, lễ hội diều khổng lồ trên bãi biển và các giải bóng chuyền bãi biển hấp dẫn.', 'Chuỗi sự kiện văn hóa, thể thao và du lịch biển sôi động mở màn cho mùa du lịch hè với đại nhạc hội bãi biển, diễu hành cano dù lượn và lễ hội ẩm thực hải sản.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000019', '70000000-0000-4000-8000-000000000019', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000019', '40000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000034', '2026-04-28 01:00:00.000000', '2026-05-04 16:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Giải chạy VnExpress Marathon Sparkling Quy Nhơn
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000020', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80&asset=vnexpress-marathon-sparkling-quy-nhon', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('vnexpress-marathon-sparkling-quy-nhon', 256)), 'Báo VnExpress & UBND Tỉnh Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000020', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000020', '40000000-0000-4000-8000-000000000020', 1, 'PUBLISHED', 'Báo VnExpress & UBND Tỉnh Bình Định', '{"placeId":"30000000-0000-4000-8000-000000000044","locationName":"Đường Xuân Diệu, Cầu Thị Nại và Bán đảo Phương Mai, TP. Quy Nhơn","startsAt":"2026-06-13 20:30:00.000000","endsAt":"2026-06-14 10:00:00.000000","frequency":"Thường niên vào trung tuần tháng 6","slug":"vnexpress-marathon-sparkling-quy-nhon","bannerUrl":"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000020', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000020';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000020', 'vi', 'Giải chạy VnExpress Marathon Sparkling Quy Nhơn', 'Cung đường chạy đón bình minh tuyệt đẹp\nCác runner được sải bước trên cung đường biển Xuân Diệu lộng gió, vượt qua dốc cầu Thị Nại ngắm nhìn mặt trời mọc rực đỏ trên đầm nước lợ và xuyên qua những cánh đồng quạt gió khổng lồ trên bán đảo Phương Mai.', 'Giải chạy marathon mùa hè quy mô gần 10.000 vận động viên trong và ngoài nước đón bình minh rực rỡ trên cây cầu vượt biển Thị Nại huyền thoại.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000020', '70000000-0000-4000-8000-000000000020', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000020', '40000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000044', '2026-06-13 20:30:00.000000', '2026-06-14 10:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ hội Đổ giàn An Thái (Đất Võ An Nhơn)
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000021', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80&asset=le-hoi-do-gian-an-thai-an-nhon', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-hoi-do-gian-an-thai-an-nhon', 256)), 'Bảo tàng Tỉnh Bình Định & UBND TX. An Nhơn', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000021', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000021', '40000000-0000-4000-8000-000000000021', 1, 'PUBLISHED', 'Bảo tàng Tỉnh Bình Định & UBND TX. An Nhơn', '{"placeId":"30000000-0000-4000-8000-000000000045","locationName":"Chùa Bà An Thái, Xã Nhơn Phúc, Thị xã An Nhơn, Tỉnh Bình Định","startsAt":"2026-08-26 01:00:00.000000","endsAt":"2026-08-28 14:00:00.000000","frequency":"Tổ chức vào rằm tháng 7 âm lịch các năm có kỳ cúng đàn lớn","slug":"le-hoi-do-gian-an-thai-an-nhon","bannerUrl":"https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000021', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000021';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000021', 'vi', 'Lễ hội Đổ giàn An Thái (Đất Võ An Nhơn)', 'Hội tranh tài thượng võ độc nhất vô nhị\nLễ hội Đổ giàn An Thái dựng một giàn tre cao hơn chục mét, trên đặt con heo quay nguyên con làm vật cúng tế. Sau hiệu lệnh, các võ sĩ đại diện cho các võ đường danh tiếng cùng nhau trổ tài leo trèo, dùng thế võ cản phá đối phương để tranh lấy vật phẩm mang về tế tổ.', 'Lễ hội tranh tài thượng võ kịch tính nhất Bình Định, nơi các võ sĩ tinh nhuệ từ các lò võ so tài mưu trí và sức mạnh để tranh lấy heo quay trên giàn cao.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000021', '70000000-0000-4000-8000-000000000021', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000021', '40000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000045', '2026-08-26 01:00:00.000000', '2026-08-28 14:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ hội Đua thuyền truyền thống Gò Bồi
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000022', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80&asset=le-hoi-dua-thuyen-go-boi-tuy-phuoc', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-hoi-dua-thuyen-go-boi-tuy-phuoc', 256)), 'UBND Huyện Tuy Phước & Báo Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000022', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000022', '40000000-0000-4000-8000-000000000022', 1, 'PUBLISHED', 'UBND Huyện Tuy Phước & Báo Bình Định', '{"placeId":"30000000-0000-4000-8000-000000000036","locationName":"Sông Gò Bồi, Xã Phước Hòa, Huyện Tuy Phước, Tỉnh Bình Định","startsAt":"2026-02-18 01:00:00.000000","endsAt":"2026-02-19 10:00:00.000000","frequency":"Thường niên vào chiều mùng 2 Tết Nguyên Đán","slug":"le-hoi-dua-thuyen-go-boi-tuy-phuoc","bannerUrl":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000022', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000022';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000022', 'vi', 'Lễ hội Đua thuyền truyền thống Gò Bồi', 'Rộn rã hội đua thuyền mừng xuân mới\nHàng năm cứ vào chiều mùng 2 Tết, khúc sông Gò Bồi lại rộn vang tiếng chiêng trống và tiếng reo hò cổ vũ của hàng vạn người dân. Các nội dung thi đấu bao gồm đua thuyền rồng, đua thuyền câu và bắt vịt trên sông vui nhộn.', 'Ngày hội sông nước đầu xuân rộn rã trên sông Gò Bồi - quê ngoại nhà thơ Xuân Diệu, quy tụ các tay chèo xuất sắc từ các vạn chài ven đầm Thị Nại.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000022', '70000000-0000-4000-8000-000000000022', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000022', '40000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000036', '2026-02-18 01:00:00.000000', '2026-02-19 10:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Chương trình Đêm Võ đài Xứ Nẫu Bình Định
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000023', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80&asset=dem-vo-dai-xu-nau-binh-dinh', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('dem-vo-dai-xu-nau-binh-dinh', 256)), 'Trung tâm Võ thuật Cổ truyền Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000023', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000023', '40000000-0000-4000-8000-000000000023', 1, 'PUBLISHED', 'Trung tâm Võ thuật Cổ truyền Bình Định', '{"placeId":"30000000-0000-4000-8000-000000000034","locationName":"Quảng trường Nguyễn Tất Thành, Thành phố Quy Nhơn, Tỉnh Bình Định","startsAt":"2026-07-04 12:30:00.000000","endsAt":"2026-07-05 15:30:00.000000","frequency":"Định kỳ tối thứ Bảy và Chủ nhật hàng tuần trong mùa du lịch","slug":"dem-vo-dai-xu-nau-binh-dinh","bannerUrl":"https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000023', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000023';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000023', 'vi', 'Chương trình Đêm Võ đài Xứ Nẫu Bình Định', 'Võ đài đối kháng truyền thống sống động\nChương trình Đêm Võ đài tái hiện nét sinh hoạt văn hóa võ thuật cổ truyền độc đáo của người Bình Định. Khán giả được chứng kiến các trận thi đấu đối kháng gay cấn theo luật võ cổ truyền và thưởng thức tiếng trống giục giã mang đậm hào khí Tây Sơn.', 'Sân chơi thi đấu võ đài đối kháng kịch tính của các võ sĩ võ cổ truyền Bình Định, kết hợp biểu diễn bài quyền, binh khí phục vụ du khách và người dân.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000023', '70000000-0000-4000-8000-000000000023', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000023', '40000000-0000-4000-8000-000000000023', '30000000-0000-4000-8000-000000000034', '2026-07-04 12:30:00.000000', '2026-07-05 15:30:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

-- [Event] Lễ hội Văn hóa Ẩm thực & Chợ đêm Xứ Nẫu Bình Định
INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('70000000-0000-4000-8000-000000000024', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80&asset=le-hoi-am-thuc-cho-dem-xu-nau', 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('le-hoi-am-thuc-cho-dem-xu-nau', 256)), 'Hiệp hội Du lịch Bình Định & Sở Công thương Bình Định', 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '10000000-0000-4000-8000-000000000001', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('40000000-0000-4000-8000-000000000024', 'EVENT', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('41000000-0000-4000-8000-000000000024', '40000000-0000-4000-8000-000000000024', 1, 'PUBLISHED', 'Hiệp hội Du lịch Bình Định & Sở Công thương Bình Định', '{"placeId":"30000000-0000-4000-8000-000000000034","locationName":"Phố ẩm thực Ngô Văn Sở và Đường Xuân Diệu, TP. Quy Nhơn, Tỉnh Bình Định","startsAt":"2026-06-01 01:00:00.000000","endsAt":"2026-06-05 16:00:00.000000","frequency":"Thường niên vào đầu tháng 6","slug":"le-hoi-am-thuc-cho-dem-xu-nau","bannerUrl":"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80","imageUrl":"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);
UPDATE content_items SET published_revision_id = '41000000-0000-4000-8000-000000000024', visibility = 'PUBLIC' WHERE id = '40000000-0000-4000-8000-000000000024';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('41000000-0000-4000-8000-000000000024', 'vi', 'Lễ hội Văn hóa Ẩm thực & Chợ đêm Xứ Nẫu Bình Định', 'Thế giới ẩm thực Xứ Nẫu phong phú\nẨm thực Bình Định mang đậm hương vị đậm đà miền biển và sự khéo léo của người dân đất võ. Du khách được tự tay gói bánh ít lá gai, nếm thử nem chua Chợ Huyện nướng than hồng, thưởng thức tô bún cá sứa thanh ngọt và nhâm nhi chén rượu Bàu Đá cay nồng nức tiếng.', 'Ngày hội tinh hoa ẩm thực Xứ Nẫu tôn vinh các món ngon danh tiếng: Bánh ít lá gai, Bánh hỏi lòng heo, Nem Chợ Huyện, Chả ram tôm đất, Bún chả cá và Rượu Bàu Đá.')
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);
INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('41000000-0000-4000-8000-000000000024', '70000000-0000-4000-8000-000000000024', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('40000000-0000-4000-8000-000000000024', '40000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000034', '2026-06-01 01:00:00.000000', '2026-06-05 16:00:00.000000', 'SCHEDULED')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);

COMMIT;
-- Hoan tat import du lieu.