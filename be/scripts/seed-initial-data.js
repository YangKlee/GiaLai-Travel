import mysql from 'mysql2/promise';
import { loadConfig } from '../src/config/env.js';
import { demoPlaces } from '../demo/places.js';

const config = loadConfig();
const dbConfig = config.database;

async function seed() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    multipleStatements: true,
  });

  console.log(`Bắt đầu nạp dữ liệu mẫu vào database "${dbConfig.database}"...`);

  try {
    // Tìm một user hợp lệ làm creator
    const [users] = await connection.query(`SELECT id FROM users LIMIT 1;`);
    let creatorId;
    if (users.length > 0) {
      creatorId = users[0].id;
    } else {
      creatorId = '10000000-0000-4000-8000-000000000001';
      await connection.query(
        `INSERT IGNORE INTO users (id, email, email_key, password_hash, display_name, status, created_at, updated_at)
         VALUES (?, 'admin@gialai.gov.vn', 'admin@gialai.gov.vn', 'hash_mock', 'Quản trị viên Gia Lai', 'ACTIVE', NOW(), NOW());`,
        [creatorId]
      );
    }

    // 1. Thêm Regions
    const regions = [
      { id: '20000000-0000-4000-8000-000000000001', code: 'PLEIKU', name: 'TP. Pleiku & Lân cận', phase: 1 },
      { id: '20000000-0000-4000-8000-000000000002', code: 'CHUPAH', name: 'Huyện Chư Păh & Biển Hồ', phase: 1 },
    ];

    for (const r of regions) {
      await connection.query(
        `INSERT INTO regions (id, code, name, phase)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);`,
        [r.id, r.code, r.name, r.phase]
      );
    }
    console.log('✓ Đã nạp danh mục vùng (regions).');

    // 2. Thêm Places và Content Revisions từ demoPlaces
    for (let i = 0; i < demoPlaces.length; i++) {
      const p = demoPlaces[i];
      const contentId = p.id;
      const revisionId = `30000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`;
      const translationId = `40000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`;

      // 1. Insert Content Item ban đầu là DRAFT
      await connection.query(
        `INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
         VALUES (?, 'PLACE', 'DRAFT', ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE updated_at = NOW();`,
        [contentId, creatorId]
      );

      // 2. Insert Content Revision (PUBLISHED)
      await connection.query(
        `INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
         VALUES (?, ?, 1, 'PUBLISHED', 'Cổng Thông tin Du lịch Tỉnh Gia Lai', ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE status = 'PUBLISHED';`,
        [revisionId, contentId, JSON.stringify({ category: p.category }), creatorId, creatorId]
      );

      // 3. Update published_revision_id và chuyển visibility thành PUBLIC
      await connection.query(
        `UPDATE content_items SET published_revision_id = ?, visibility = 'PUBLIC' WHERE id = ?;`,
        [revisionId, contentId]
      );

      // Insert Content Translation (vi)
      await connection.query(
        `INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
         VALUES (?, 'vi', ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body);`,
        [revisionId, p.title, p.description || `${p.title} - Điểm đến tuyệt đẹp của Gia Lai.`, p.title]
      );

      // Insert Place
      await connection.query(
        `INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
           content_id = VALUES(content_id),
           region_id = VALUES(region_id),
           category = VALUES(category),
           latitude = VALUES(latitude),
           longitude = VALUES(longitude),
           reference_price_vnd = VALUES(reference_price_vnd),
           typical_duration_minutes = VALUES(typical_duration_minutes),
           updated_at = NOW();`,
        [
          p.id,
          contentId,
          p.region?.id || '20000000-0000-4000-8000-000000000001',
          p.category,
          p.latitude || 13.9833,
          p.longitude || 108.0000,
          p.referencePriceVnd ? BigInt(p.referencePriceVnd) : null,
          p.typicalDurationMinutes || 60,
        ]
      );

      // Insert Opening Hours
      if (p.openingHours && p.openingHours.length > 0) {
        for (let day = 0; day <= 6; day++) {
          const hId = `50000000-0000-4000-8000-${String(i * 7 + day + 1).padStart(12, '0')}`;
          await connection.query(
            `INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
             VALUES (?, ?, ?, '07:00:00', '18:00:00', 0)
             ON DUPLICATE KEY UPDATE opens_at = '07:00:00', closes_at = '18:00:00';`,
            [hId, p.id, day]
          );
        }
      }
    }

    console.log(`✓ Đã nạp thành công ${demoPlaces.length} địa điểm du lịch Gia Lai vào CSDL!`);
  } catch (error) {
    console.error('Lỗi khi nạp dữ liệu:', error);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

seed();
