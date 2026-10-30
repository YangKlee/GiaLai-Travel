/**
 * Script khởi tạo các tài khoản test cho tất cả các Role trong hệ thống GiaLaiTravel
 * Các Roles: ADMIN, B2G, CONTRIBUTOR, PARTNER, TOURIST (bao gồm Standard & Premium VIP)
 * Sử dụng đúng thuật toán scrypt chuẩn của be/src/shared/password.js để đăng nhập được ngay.
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from '../../be/src/shared/password.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DATA_DIR = path.resolve(__dirname, '..');

// Mật khẩu test chung (>= 12 ký tự theo schema credentials)
export const DEFAULT_TEST_PASSWORD = 'GiaLai@2026Test';

export const testAccounts = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    email: 'portal@gialai.gov.vn',
    displayName: 'Cổng Thông Tin Du Lịch (Admin)',
    phone: '02693824256',
    role: 'ADMIN',
    roleName: 'Quản trị viên cổng thông tin',
    description: 'Tài khoản admin hệ thống kiêm tác giả biên soạn nội dung chính thống.'
  },
  {
    id: '10000000-0000-4000-8000-000000000099',
    email: 'admin@gialai.gov.vn',
    displayName: 'Quản trị viên Hệ thống (Admin)',
    phone: '0901234001',
    role: 'ADMIN',
    roleName: 'Quản trị viên toàn hệ thống',
    description: 'Toàn quyền kiểm duyệt nội dung, quản lý người dùng, phân quyền, cấu hình hệ thống và xem audit log.'
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    email: 'b2g@gialai.gov.vn',
    displayName: 'Sở Du Lịch & Cơ Quan Quản Lý',
    phone: '0901234002',
    role: 'B2G',
    roleName: 'Cơ quan quản lý nhà nước (B2G)',
    description: 'Xem các báo cáo chỉ số mật độ du khách, thống kê du lịch địa phương tuân thủ quy chuẩn riêng tư.',
    regions: [
      '20000000-0000-4000-8000-000000000001', // TP. Pleiku
      '20000000-0000-4000-8000-000000000002', // Chư Păh
      '20000000-0000-4000-8000-000000000008', // TX. An Khê
      '20000000-0000-4000-8000-000000000018'  // TP. Quy Nhơn
    ]
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    email: 'contributor@gialai.gov.vn',
    displayName: 'Nguyễn Văn Biên (Cộng tác viên Xúc tiến)',
    phone: '0901234003',
    role: 'CONTRIBUTOR',
    roleName: 'Cộng tác viên nội dung',
    description: 'Tạo bản thảo bài viết, đề xuất địa điểm, sự kiện mới, gửi duyệt nội dung.'
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    email: 'partner@gialai.gov.vn',
    displayName: 'Trần Thị Lan (Chủ Homestay Biển Hồ Xanh)',
    phone: '0901234004',
    role: 'PARTNER',
    roleName: 'Chủ đối tác dịch vụ (Partner Owner)',
    description: 'Quản lý thông tin cơ sở đối tác, đăng ký dịch vụ lưu trú, trải nghiệm, mở bán slot dịch vụ.',
    partnerRole: 'OWNER'
  },
  {
    id: '10000000-0000-4000-8000-000000000005',
    email: 'partner.staff@gialai.gov.vn',
    displayName: 'Lê Hoàng Long (Nhân viên Homestay)',
    phone: '0901234005',
    role: 'PARTNER',
    roleName: 'Nhân viên đối tác dịch vụ (Partner Staff)',
    description: 'Xác nhận đặt chỗ của du khách, kiểm tra dịch vụ tại cơ sở.',
    partnerRole: 'STAFF'
  },
  {
    id: '10000000-0000-4000-8000-000000000006',
    email: 'tourist@gialai.gov.vn',
    displayName: 'Trần Du Khách (Khách tiêu chuẩn)',
    phone: '0901234006',
    role: 'TOURIST',
    roleName: 'Khách du lịch tiêu chuẩn (Standard)',
    description: 'Tìm kiếm địa điểm, lên lịch trình du lịch cá nhân, đánh giá trải nghiệm.'
  },
  {
    id: '10000000-0000-4000-8000-000000000007',
    email: 'premium.tourist@gialai.gov.vn',
    displayName: 'Phạm Hoàng Nam (Hội viên VIP Premium)',
    phone: '0901234007',
    role: 'TOURIST',
    roleName: 'Khách du lịch cao cấp (VIP Premium)',
    description: 'Tài khoản đã đăng ký gói Premium 1 năm: tải bản đồ offline, audio guide thuyết minh, không quảng cáo.',
    isPremium: true
  }
];

async function seedTestAccounts() {
  console.log('🚀 Đang tạo mật khẩu mã hóa scrypt cho các tài khoản test...');
  const passwordHash = await hashPassword(DEFAULT_TEST_PASSWORD);
  console.log(`✓ Mật khẩu: "${DEFAULT_TEST_PASSWORD}"`);
  console.log(`✓ Hash scrypt: ${passwordHash.substring(0, 35)}...`);

  // 1. Tạo file SQL độc lập: test_accounts.sql
  const sqlLines = [];
  sqlLines.push('-- ==============================================================================');
  sqlLines.push('-- GiaLaiTravel Test Accounts Script');
  sqlLines.push('-- Danh sach tai khoan test cho tat ca cac Role trong he thong');
  sqlLines.push(`-- Mat khau chung cho tat ca tai khoan: ${DEFAULT_TEST_PASSWORD}`);
  sqlLines.push('-- ==============================================================================');
  sqlLines.push('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;');
  sqlLines.push("SET time_zone = '+00:00';");
  sqlLines.push('');
  sqlLines.push('START TRANSACTION;');
  sqlLines.push('');

  // Cơ sở đối tác dịch vụ mẫu
  const partnerId = '70000000-0000-4000-8000-000000000001';
  const partnerRevisionId = '71000000-0000-4000-8000-000000000001';
  const partnerAdminId = testAccounts[0].id;

  sqlLines.push('-- Cơ sở đối tác dịch vụ mẫu (Homestay Biển Hồ Xanh)');
  sqlLines.push(`INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('${partnerId}', 'PARTNER', 'DRAFT', '${partnerAdminId}', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);`);

  sqlLines.push(`INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('${partnerRevisionId}', '${partnerId}', 1, 'PUBLISHED', 'Cổng Thông Tin Du Lịch', '{"name":"Homestay Biển Hồ Xanh","address":"Xã Biển Hồ, TP. Pleiku"}', '${partnerAdminId}', '${partnerAdminId}', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED';`);

  sqlLines.push(`UPDATE content_items SET published_revision_id = '${partnerRevisionId}', visibility = 'PUBLIC' WHERE id = '${partnerId}';`);

  sqlLines.push(`INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('${partnerRevisionId}', 'vi', 'Homestay Biển Hồ Xanh', 'Dịch vụ lưu trú homestay sinh thái ven Biển Hồ Pleiku', 'Homestay Biển Hồ Xanh')
ON DUPLICATE KEY UPDATE title = VALUES(title);`);

  sqlLines.push(`INSERT INTO partners (id, content_id, status, contact_email, contact_phone, created_at)
VALUES ('${partnerId}', '${partnerId}', 'ACTIVE', 'partner@gialai.gov.vn', '02693888999', NOW(6))
ON DUPLICATE KEY UPDATE status = 'ACTIVE';`);
  sqlLines.push('');

  for (const acc of testAccounts) {
    sqlLines.push(`-- [Role: ${acc.role}] ${acc.displayName} (${acc.email})`);
    sqlLines.push(`INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('${acc.id}', '${acc.email}', '${passwordHash}', '${acc.displayName}', '${acc.phone}', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  phone = VALUES(phone),
  status = 'ACTIVE';`);

    sqlLines.push(`INSERT INTO user_roles (user_id, role_code)
VALUES ('${acc.id}', '${acc.role}')
ON DUPLICATE KEY UPDATE role_code = VALUES(role_code);`);

    // Gán vùng cho B2G
    if (acc.regions && acc.regions.length > 0) {
      for (const regId of acc.regions) {
        sqlLines.push(`INSERT INTO user_region_scopes (user_id, region_id)
VALUES ('${acc.id}', '${regId}')
ON DUPLICATE KEY UPDATE region_id = VALUES(region_id);`);
      }
    }

    // Gán thành viên đối tác
    if (acc.partnerRole) {
      sqlLines.push(`INSERT INTO partner_members (partner_id, user_id, membership_role)
VALUES ('${partnerId}', '${acc.id}', '${acc.partnerRole}')
ON DUPLICATE KEY UPDATE membership_role = VALUES(membership_role);`);
    }

    // Gán gói Premium cho VIP Tourist
    if (acc.isPremium) {
      const orderId = '60000000-0000-4000-8000-000000000001';
      const entitlementId = '80000000-0000-4000-8000-000000000001';
      const yearlyPlanVersionId = 'ba4c8f0f-c5eb-4636-99a4-d2dcd010d030';

      sqlLines.push(`INSERT INTO purchase_orders (id, buyer_id, plan_version_id, amount_vnd, status, expires_at, idempotency_key, created_at)
VALUES ('${orderId}', '${acc.id}', '${yearlyPlanVersionId}', 199000, 'SUCCEEDED', DATE_ADD(NOW(6), INTERVAL 30 MINUTE), 'seed-premium-order-0001', NOW(6))
ON DUPLICATE KEY UPDATE status = 'SUCCEEDED';`);

      sqlLines.push(`INSERT INTO entitlements (id, user_id, plan_version_id, purchase_order_id, starts_at, ends_at, auto_renew, created_at)
VALUES ('${entitlementId}', '${acc.id}', '${yearlyPlanVersionId}', '${orderId}', NOW(6), DATE_ADD(NOW(6), INTERVAL 1 YEAR), 0, NOW(6))
ON DUPLICATE KEY UPDATE ends_at = DATE_ADD(NOW(6), INTERVAL 1 YEAR), auto_renew = 0;`);
    }

    sqlLines.push('');
  }

  sqlLines.push('COMMIT;');
  sqlLines.push('-- Hoan tat khoi tao tai khoan test.');

  const sqlFilePath = path.join(ROOT_DATA_DIR, 'test_accounts.sql');
  fs.writeFileSync(sqlFilePath, sqlLines.join('\n'), 'utf-8');
  console.log(`✓ Đã xuất file SQL tài khoản test: ${sqlFilePath}`);

  // 2. Chèn trực tiếp vào CSDL MySQL local nếu có thể
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'gialaitravel',
      multipleStatements: true
    });
    await conn.query(sqlLines.join('\n'));
    console.log('✓ Đã cập nhật thành công các tài khoản test trực tiếp vào database MySQL "gialaitravel"!');
    await conn.end();
  } catch (err) {
    console.warn('⚠️ Không thể kết nối trực tiếp MySQL, file SQL đã được lưu lại để import thủ công:', err.message);
  }

  // 3. Xuất file JSON thông tin tài khoản test để ứng dụng hoặc QA tra cứu
  const jsonPath = path.join(ROOT_DATA_DIR, 'metadata', 'test_accounts.json');
  fs.writeFileSync(jsonPath, JSON.stringify({
    defaultPassword: DEFAULT_TEST_PASSWORD,
    accounts: testAccounts.map(a => ({
      email: a.email,
      password: DEFAULT_TEST_PASSWORD,
      displayName: a.displayName,
      role: a.role,
      roleName: a.roleName,
      description: a.description
    }))
  }, null, 2), 'utf-8');
  console.log(`✓ Đã lưu danh sách tài khoản JSON tại: ${jsonPath}`);
}

seedTestAccounts().catch(err => {
  console.error('Lỗi khi tạo tài khoản test:', err);
  process.exit(1);
});
