-- ==============================================================================
-- GiaLaiTravel Test Accounts Script
-- Danh sach tai khoan test cho tat ca cac Role trong he thong
-- Mat khau chung cho tat ca tai khoan: GiaLai@2026Test
-- ==============================================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET time_zone = '+00:00';

START TRANSACTION;

-- Cơ sở đối tác dịch vụ mẫu (Homestay Biển Hồ Xanh)
INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('70000000-0000-4000-8000-000000000001', 'PARTNER', 'DRAFT', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);
INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('71000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000001', 1, 'PUBLISHED', 'Cổng Thông Tin Du Lịch', '{"name":"Homestay Biển Hồ Xanh","address":"Xã Biển Hồ, TP. Pleiku"}', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED';
UPDATE content_items SET published_revision_id = '71000000-0000-4000-8000-000000000001', visibility = 'PUBLIC' WHERE id = '70000000-0000-4000-8000-000000000001';
INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('71000000-0000-4000-8000-000000000001', 'vi', 'Homestay Biển Hồ Xanh', 'Dịch vụ lưu trú homestay sinh thái ven Biển Hồ Pleiku', 'Homestay Biển Hồ Xanh')
ON DUPLICATE KEY UPDATE title = VALUES(title);
INSERT INTO partners (id, content_id, status, contact_email, contact_phone, created_at)
VALUES ('70000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000001', 'ACTIVE', 'partner@gialai.gov.vn', '02693888999', NOW(6))
ON DUPLICATE KEY UPDATE status = 'ACTIVE';

-- [Role: ADMIN] Cổng Thông Tin Du Lịch (Admin) (portal@gialai.gov.vn)
INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('10000000-0000-4000-8000-000000000001', 'portal@gialai.gov.vn', 'scrypt$131072$8$1$uFsa5hzzFXokav3zcGgvrA$vg7PaDfMayMqW5SQ3s_0QA3oMrGwy8wRSekn23M7I35_m4OWhOysUz1Uhj-_-MgIAyWhCramusRK2mEs8APxzw', 'Cổng Thông Tin Du Lịch (Admin)', '02693824256', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  phone = VALUES(phone),
  status = 'ACTIVE';
INSERT INTO user_roles (user_id, role_code)
VALUES ('10000000-0000-4000-8000-000000000001', 'ADMIN')
ON DUPLICATE KEY UPDATE role_code = VALUES(role_code);

-- [Role: ADMIN] Quản trị viên Hệ thống (Admin) (admin@gialai.gov.vn)
INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('10000000-0000-4000-8000-000000000099', 'admin@gialai.gov.vn', 'scrypt$131072$8$1$uFsa5hzzFXokav3zcGgvrA$vg7PaDfMayMqW5SQ3s_0QA3oMrGwy8wRSekn23M7I35_m4OWhOysUz1Uhj-_-MgIAyWhCramusRK2mEs8APxzw', 'Quản trị viên Hệ thống (Admin)', '0901234001', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  phone = VALUES(phone),
  status = 'ACTIVE';
INSERT INTO user_roles (user_id, role_code)
VALUES ('10000000-0000-4000-8000-000000000099', 'ADMIN')
ON DUPLICATE KEY UPDATE role_code = VALUES(role_code);

-- [Role: B2G] Sở Du Lịch & Cơ Quan Quản Lý (b2g@gialai.gov.vn)
INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('10000000-0000-4000-8000-000000000002', 'b2g@gialai.gov.vn', 'scrypt$131072$8$1$uFsa5hzzFXokav3zcGgvrA$vg7PaDfMayMqW5SQ3s_0QA3oMrGwy8wRSekn23M7I35_m4OWhOysUz1Uhj-_-MgIAyWhCramusRK2mEs8APxzw', 'Sở Du Lịch & Cơ Quan Quản Lý', '0901234002', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  phone = VALUES(phone),
  status = 'ACTIVE';
INSERT INTO user_roles (user_id, role_code)
VALUES ('10000000-0000-4000-8000-000000000002', 'B2G')
ON DUPLICATE KEY UPDATE role_code = VALUES(role_code);
INSERT INTO user_region_scopes (user_id, region_id)
VALUES ('10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001')
ON DUPLICATE KEY UPDATE region_id = VALUES(region_id);
INSERT INTO user_region_scopes (user_id, region_id)
VALUES ('10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002')
ON DUPLICATE KEY UPDATE region_id = VALUES(region_id);
INSERT INTO user_region_scopes (user_id, region_id)
VALUES ('10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000008')
ON DUPLICATE KEY UPDATE region_id = VALUES(region_id);
INSERT INTO user_region_scopes (user_id, region_id)
VALUES ('10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000018')
ON DUPLICATE KEY UPDATE region_id = VALUES(region_id);

-- [Role: CONTRIBUTOR] Nguyễn Văn Biên (Cộng tác viên Xúc tiến) (contributor@gialai.gov.vn)
INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('10000000-0000-4000-8000-000000000003', 'contributor@gialai.gov.vn', 'scrypt$131072$8$1$uFsa5hzzFXokav3zcGgvrA$vg7PaDfMayMqW5SQ3s_0QA3oMrGwy8wRSekn23M7I35_m4OWhOysUz1Uhj-_-MgIAyWhCramusRK2mEs8APxzw', 'Nguyễn Văn Biên (Cộng tác viên Xúc tiến)', '0901234003', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  phone = VALUES(phone),
  status = 'ACTIVE';
INSERT INTO user_roles (user_id, role_code)
VALUES ('10000000-0000-4000-8000-000000000003', 'CONTRIBUTOR')
ON DUPLICATE KEY UPDATE role_code = VALUES(role_code);

-- [Role: PARTNER] Trần Thị Lan (Chủ Homestay Biển Hồ Xanh) (partner@gialai.gov.vn)
INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('10000000-0000-4000-8000-000000000004', 'partner@gialai.gov.vn', 'scrypt$131072$8$1$uFsa5hzzFXokav3zcGgvrA$vg7PaDfMayMqW5SQ3s_0QA3oMrGwy8wRSekn23M7I35_m4OWhOysUz1Uhj-_-MgIAyWhCramusRK2mEs8APxzw', 'Trần Thị Lan (Chủ Homestay Biển Hồ Xanh)', '0901234004', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  phone = VALUES(phone),
  status = 'ACTIVE';
INSERT INTO user_roles (user_id, role_code)
VALUES ('10000000-0000-4000-8000-000000000004', 'PARTNER')
ON DUPLICATE KEY UPDATE role_code = VALUES(role_code);
INSERT INTO partner_members (partner_id, user_id, membership_role)
VALUES ('70000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000004', 'OWNER')
ON DUPLICATE KEY UPDATE membership_role = VALUES(membership_role);

-- [Role: PARTNER] Lê Hoàng Long (Nhân viên Homestay) (partner.staff@gialai.gov.vn)
INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('10000000-0000-4000-8000-000000000005', 'partner.staff@gialai.gov.vn', 'scrypt$131072$8$1$uFsa5hzzFXokav3zcGgvrA$vg7PaDfMayMqW5SQ3s_0QA3oMrGwy8wRSekn23M7I35_m4OWhOysUz1Uhj-_-MgIAyWhCramusRK2mEs8APxzw', 'Lê Hoàng Long (Nhân viên Homestay)', '0901234005', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  phone = VALUES(phone),
  status = 'ACTIVE';
INSERT INTO user_roles (user_id, role_code)
VALUES ('10000000-0000-4000-8000-000000000005', 'PARTNER')
ON DUPLICATE KEY UPDATE role_code = VALUES(role_code);
INSERT INTO partner_members (partner_id, user_id, membership_role)
VALUES ('70000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 'STAFF')
ON DUPLICATE KEY UPDATE membership_role = VALUES(membership_role);

-- [Role: TOURIST] Trần Du Khách (Khách tiêu chuẩn) (tourist@gialai.gov.vn)
INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('10000000-0000-4000-8000-000000000006', 'tourist@gialai.gov.vn', 'scrypt$131072$8$1$uFsa5hzzFXokav3zcGgvrA$vg7PaDfMayMqW5SQ3s_0QA3oMrGwy8wRSekn23M7I35_m4OWhOysUz1Uhj-_-MgIAyWhCramusRK2mEs8APxzw', 'Trần Du Khách (Khách tiêu chuẩn)', '0901234006', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  phone = VALUES(phone),
  status = 'ACTIVE';
INSERT INTO user_roles (user_id, role_code)
VALUES ('10000000-0000-4000-8000-000000000006', 'TOURIST')
ON DUPLICATE KEY UPDATE role_code = VALUES(role_code);

-- [Role: TOURIST] Phạm Hoàng Nam (Hội viên VIP Premium) (premium.tourist@gialai.gov.vn)
INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('10000000-0000-4000-8000-000000000007', 'premium.tourist@gialai.gov.vn', 'scrypt$131072$8$1$uFsa5hzzFXokav3zcGgvrA$vg7PaDfMayMqW5SQ3s_0QA3oMrGwy8wRSekn23M7I35_m4OWhOysUz1Uhj-_-MgIAyWhCramusRK2mEs8APxzw', 'Phạm Hoàng Nam (Hội viên VIP Premium)', '0901234007', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  phone = VALUES(phone),
  status = 'ACTIVE';
INSERT INTO user_roles (user_id, role_code)
VALUES ('10000000-0000-4000-8000-000000000007', 'TOURIST')
ON DUPLICATE KEY UPDATE role_code = VALUES(role_code);
INSERT INTO purchase_orders (id, buyer_id, plan_version_id, amount_vnd, status, expires_at, idempotency_key, created_at)
VALUES ('60000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000007', 'ba4c8f0f-c5eb-4636-99a4-d2dcd010d030', 199000, 'SUCCEEDED', DATE_ADD(NOW(6), INTERVAL 30 MINUTE), 'seed-premium-order-0001', NOW(6))
ON DUPLICATE KEY UPDATE status = 'SUCCEEDED';
INSERT INTO entitlements (id, user_id, plan_version_id, purchase_order_id, starts_at, ends_at, auto_renew, created_at)
VALUES ('80000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000007', 'ba4c8f0f-c5eb-4636-99a4-d2dcd010d030', '60000000-0000-4000-8000-000000000001', NOW(6), DATE_ADD(NOW(6), INTERVAL 1 YEAR), 0, NOW(6))
ON DUPLICATE KEY UPDATE ends_at = DATE_ADD(NOW(6), INTERVAL 1 YEAR), auto_renew = 0;

COMMIT;
-- Hoan tat khoi tao tai khoan test.