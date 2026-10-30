-- ==============================================================================
-- Binh Dinh Tourism Dataset Standalone Import
-- Tuong thich hoan toan voi be/schema.sql (MariaDB 10.5+ / MySQL 8.0+)
-- Bao gom: 11 Regions, 25 Places, 12 Events
-- ==============================================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET time_zone = '+00:00';
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

START TRANSACTION;

-- 1. TAI KHOAN QUAN TRI BIEN SOAN & KIEM DUYET NOI DUNG
INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('10000000-0000-4000-8000-000000000001', 'portal@gialai.gov.vn', '$2b$10$DemoHashForTourismDatasetSeedOnly12345678901234567890', 'Cổng Thông Tin Du Lịch Liên Vùng', '02693824256', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), status = 'ACTIVE';

-- 2. DANH MUC CAC DON VI HANH CHINH (11 VUNG/HUYEN/THI)
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

-- 3. DANH SACH DIA DIEM DU LICH TIEU BIEU (25 PLACES)
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

-- 4. DANH SACH SU KIEN & LE HOI (12 EVENTS)
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