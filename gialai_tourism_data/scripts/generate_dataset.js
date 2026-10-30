/**
 * Generator script for Gia Lai & Binh Dinh Tourism Dataset
 * Tự động xuất:
 * 1. Các bài viết HTML chi tiết (articles/places/*.html và articles/events/*.html) cho cả Gia Lai & Bình Định
 * 2. File metadata JSON (metadata/regions.json, metadata/places.json, metadata/events.json)
 * 3. File SQL import hoàn chỉnh:
 *    - import_gialai_tourism.sql (toàn bộ 28 Regions, 55 Places, 24 Events của Gia Lai & Bình Định)
 *    - import_binhdinh_tourism.sql (file riêng dành cho Bình Định)
 * 4. File README.md tổng hợp và hướng dẫn sử dụng
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { placesData as giaLaiPlacesData } from './places_data.js';
import { eventsData as giaLaiEventsData } from './events_data.js';
import { binhDinhRegionsData, binhDinhPlacesData } from './binhdinh_places_data.js';
import { binhDinhEventsData } from './binhdinh_events_data.js';
import { placeBanners, eventBanners } from './banner_mapping.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DATA_DIR = path.resolve(__dirname, '..');

// ========================================================
// 1. DANH MỤC CÁC ĐƠN VỊ HÀNH CHÍNH (GIA LAI & BÌNH ĐỊNH)
// ========================================================
export const giaLaiRegionsData = [
  { id: '20000000-0000-4000-8000-000000000001', code: 'PLEIKU', name: 'Thành phố Pleiku (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000002', code: 'CHUPAH', name: 'Huyện Chư Păh (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000003', code: 'KBANG', name: 'Huyện Kbang (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000004', code: 'DAKDOA', name: 'Huyện Đak Đoa (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000005', code: 'CHUSE', name: 'Huyện Chư Sê (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000006', code: 'IAGRAI', name: 'Huyện Ia Grai (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000007', code: 'MANGYANG', name: 'Huyện Mang Yang (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000008', code: 'ANKHE', name: 'Thị xã An Khê (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000009', code: 'AYUNPA', name: 'Thị xã Ayun Pa (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000010', code: 'PHUTHIEN', name: 'Huyện Phú Thiện (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000011', code: 'CHUPRONG', name: 'Huyện Chư Prông (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000012', code: 'DUCCO', name: 'Huyện Đức Cơ (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000013', code: 'KROENGPA', name: 'Huyện Krông Pa (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000014', code: 'KONGCHRO', name: 'Huyện Kông Chro (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000015', code: 'DAKPO', name: 'Huyện Đak Pơ (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000016', code: 'IAPA', name: 'Huyện Ia Pa (Gia Lai)', phase: 1 },
  { id: '20000000-0000-4000-8000-000000000017', code: 'CHUPUH', name: 'Huyện Chư Pưh (Gia Lai)', phase: 1 }
];

const allRegionsData = [...giaLaiRegionsData, ...binhDinhRegionsData];
const allPlacesData = [...giaLaiPlacesData, ...binhDinhPlacesData];
const allEventsData = [...giaLaiEventsData, ...binhDinhEventsData];

// Helper: Escape SQL string literals
function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
}

// Helper: HTML styling template
const HTML_STYLE = `
    :root {
      --primary: #0284c7;
      --primary-light: #e0f2fe;
      --text: #1f2937;
      --text-muted: #4b5563;
      --bg: #f9fafb;
      --card-bg: #ffffff;
      --border: #e5e7eb;
      --accent: #b45309;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.7;
      color: var(--text);
      background-color: var(--bg);
      padding: 24px 16px;
    }
    .article-container {
      max-width: 860px;
      margin: 0 auto;
      background: var(--card-bg);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid var(--border);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 9999px;
      background: var(--primary-light);
      color: var(--primary);
      margin-bottom: 16px;
    }
    .badge.event {
      background: #fef3c7;
      color: var(--accent);
    }
    h1 {
      font-size: 2.25rem;
      font-weight: 800;
      color: #111827;
      line-height: 1.25;
      margin-bottom: 16px;
    }
    .lead {
      font-size: 1.15rem;
      color: var(--text-muted);
      margin-bottom: 28px;
      font-style: italic;
      border-left: 4px solid var(--primary);
      padding-left: 16px;
    }
    .quick-facts {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 36px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    .fact-item {
      display: flex;
      flex-direction: column;
    }
    .fact-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .fact-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: #0f172a;
    }
    .content-section {
      margin-bottom: 32px;
    }
    .content-section h2 {
      font-size: 1.45rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #f1f5f9;
    }
    .content-section p {
      margin-bottom: 16px;
      text-align: justify;
      color: #334155;
    }
    .article-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed var(--border);
      font-size: 0.875rem;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }
    .banner-wrapper {
      width: 100%;
      height: 380px;
      margin-bottom: 24px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      background-color: #f1f5f9;
    }
    .hero-banner {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;
    }
    .hero-banner:hover {
      transform: scale(1.02);
    }
    @media (max-width: 640px) {
      .article-container { padding: 20px; }
      h1 { font-size: 1.75rem; }
      .quick-facts { grid-template-columns: 1fr; }
      .banner-wrapper { height: 220px; }
    }
`;

// Helper: Render HTML Place
function renderPlaceHtml(place) {
  const bannerUrl = placeBanners[place.slug] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
  const sectionsHtml = place.sections.map(s => `
      <section class="content-section">
        <h2>${s.title}</h2>
        <p>${s.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>
      </section>
  `).join('\n');

  const formattedPrice = place.referencePriceVnd === 0 ? 'Miễn phí vé vào cổng' : `${place.referencePriceVnd.toLocaleString('vi-VN')} VNĐ/người`;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${place.name} | Cẩm Nang Du Lịch</title>
  <meta name="description" content="${place.summary.replace(/"/g, '&quot;')}">
  <style>
${HTML_STYLE}
  </style>
</head>
<body>
  <article class="article-container">
    <header>
      <span class="badge">${place.category}</span>
      <h1>${place.name}</h1>
      <p class="lead">${place.summary}</p>
    </header>

    <div class="banner-wrapper">
      <img class="hero-banner" src="${bannerUrl}" alt="${place.name}" loading="lazy" />
    </div>

    <div class="quick-facts">
      <div class="fact-item">
        <span class="fact-label">📍 Địa chỉ</span>
        <span class="fact-value">${place.address}</span>
      </div>
      <div class="fact-item">
        <span class="fact-label">🧭 Tọa độ GPS</span>
        <span class="fact-value">${place.latitude.toFixed(6)}, ${place.longitude.toFixed(6)}</span>
      </div>
      <div class="fact-item">
        <span class="fact-label">⏰ Giờ mở cửa</span>
        <span class="fact-value">${place.openingHours.opens} - ${place.openingHours.closes}</span>
      </div>
      <div class="fact-item">
        <span class="fact-label">🎟️ Giá vé tham khảo</span>
        <span class="fact-value">${formattedPrice}</span>
      </div>
      <div class="fact-item">
        <span class="fact-label">⏳ Thời gian tham quan</span>
        <span class="fact-value">Khoảng ${place.typicalDurationMinutes} phút</span>
      </div>
      <div class="fact-item">
        <span class="fact-label">🌤️ Thời điểm lý tưởng</span>
        <span class="fact-value">${place.bestTime}</span>
      </div>
    </div>

    <div class="article-body">
${sectionsHtml}
    </div>

    <footer class="article-footer">
      <div><strong>Nguồn dữ liệu:</strong> ${place.source}</div>
      <div><strong>Đơn vị biên soạn:</strong> Cổng Thông Tin Xúc Tiến Du Lịch</div>
    </footer>
  </article>
</body>
</html>`;
}

// Helper: Render HTML Event
function renderEventHtml(event) {
  const bannerUrl = eventBanners[event.slug] || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80';
  const sectionsHtml = event.sections.map(s => `
      <section class="content-section">
        <h2>${s.title}</h2>
        <p>${s.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>
      </section>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${event.title} | Lễ Hội & Sự Kiện</title>
  <meta name="description" content="${event.summary.replace(/"/g, '&quot;')}">
  <style>
${HTML_STYLE}
  </style>
</head>
<body>
  <article class="article-container">
    <header>
      <span class="badge event">SỰ KIỆN & LỄ HỘI</span>
      <h1>${event.title}</h1>
      <p class="lead">${event.summary}</p>
    </header>

    <div class="banner-wrapper">
      <img class="hero-banner" src="${bannerUrl}" alt="${event.title}" loading="lazy" />
    </div>

    <div class="quick-facts">
      <div class="fact-item">
        <span class="fact-label">📍 Địa điểm tổ chức</span>
        <span class="fact-value">${event.locationName}</span>
      </div>
      <div class="fact-item">
        <span class="fact-label">📅 Thời gian dự kiến</span>
        <span class="fact-value">${event.startsAt.substring(0, 10)} đến ${event.endsAt.substring(0, 10)}</span>
      </div>
      <div class="fact-item">
        <span class="fact-label">🔄 Tần suất tổ chức</span>
        <span class="fact-value">${event.frequency}</span>
      </div>
      <div class="fact-item">
        <span class="fact-label">📌 Trạng thái sự kiện</span>
        <span class="fact-value">${event.eventStatus === 'SCHEDULED' ? 'Đã lên kế hoạch (Sắp diễn ra)' : event.eventStatus}</span>
      </div>
    </div>

    <div class="article-body">
${sectionsHtml}
    </div>

    <footer class="article-footer">
      <div><strong>Nguồn dữ liệu:</strong> ${event.source}</div>
      <div><strong>Đơn vị tổ chức & bảo trợ:</strong> Ban Quản lý Du lịch & Lễ hội Địa phương</div>
    </footer>
  </article>
</body>
</html>`;
}

// Function sinh SQL theo danh sách dữ liệu
function generateSql(regions, places, events, titleComment) {
  const sqlLines = [];
  sqlLines.push('-- ==============================================================================');
  sqlLines.push(`-- ${titleComment}`);
  sqlLines.push('-- Tuong thich hoan toan voi be/schema.sql (MariaDB 10.5+ / MySQL 8.0+)');
  sqlLines.push(`-- Bao gom: ${regions.length} Regions, ${places.length} Places, ${events.length} Events`);
  sqlLines.push('-- ==============================================================================');
  sqlLines.push('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;');
  sqlLines.push("SET time_zone = '+00:00';");
  sqlLines.push("SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';");
  sqlLines.push('');
  sqlLines.push('START TRANSACTION;');
  sqlLines.push('');

  const creatorId = '10000000-0000-4000-8000-000000000001';
  sqlLines.push('-- 1. TAI KHOAN QUAN TRI BIEN SOAN & KIEM DUYET NOI DUNG');
  sqlLines.push(`INSERT INTO users (id, email, password_hash, display_name, phone, status, created_at, updated_at)
VALUES ('${creatorId}', 'portal@gialai.gov.vn', '$2b$10$DemoHashForTourismDatasetSeedOnly12345678901234567890', 'Cổng Thông Tin Du Lịch Liên Vùng', '02693824256', 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), status = 'ACTIVE';`);
  sqlLines.push('');

  sqlLines.push(`-- 2. DANH MUC CAC DON VI HANH CHINH (${regions.length} VUNG/HUYEN/THI)`);
  for (const r of regions) {
    sqlLines.push(`INSERT INTO regions (id, code, name, phase)
VALUES ('${r.id}', '${r.code}', ${escapeSql(r.name)}, ${r.phase})
ON DUPLICATE KEY UPDATE name = VALUES(name), phase = VALUES(phase);`);
  }
  sqlLines.push('');

  sqlLines.push(`-- 3. DANH SACH DIA DIEM DU LICH TIEU BIEU (${places.length} PLACES)`);
  for (const p of places) {
    const bannerUrl = placeBanners[p.slug] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
    const placeIndex = parseInt(p.id.slice(-4), 10) || 1;
    const assetId = `60000000-0000-4000-8000-${String(placeIndex).padStart(12, '0')}`;
    const assetStorageKey = bannerUrl.includes('?') ? `${bannerUrl}&asset=${p.slug}` : `${bannerUrl}?asset=${p.slug}`;
    const fullBody = p.sections.map(s => `${s.title}\n${s.content}`).join('\n\n');
    const payload = JSON.stringify({
      category: p.category,
      latitude: p.latitude,
      longitude: p.longitude,
      address: p.address,
      referencePriceVnd: p.referencePriceVnd,
      typicalDurationMinutes: p.typicalDurationMinutes,
      slug: p.slug,
      bannerUrl: bannerUrl,
      imageUrl: bannerUrl
    });

    sqlLines.push(`-- [Place] ${p.name}`);
    sqlLines.push(`INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('${assetId}', ${escapeSql(assetStorageKey)}, 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('${p.slug}', 256)), ${escapeSql(p.source)}, 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '${creatorId}', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);`);

    sqlLines.push(`INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('${p.contentId}', 'PLACE', 'DRAFT', '${creatorId}', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);`);

    sqlLines.push(`INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('${p.revisionId}', '${p.contentId}', 1, 'PUBLISHED', ${escapeSql(p.source)}, ${escapeSql(payload)}, '${creatorId}', '${creatorId}', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);`);

    sqlLines.push(`UPDATE content_items SET published_revision_id = '${p.revisionId}', visibility = 'PUBLIC' WHERE id = '${p.contentId}';`);

    sqlLines.push(`INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('${p.revisionId}', 'vi', ${escapeSql(p.name)}, ${escapeSql(fullBody)}, ${escapeSql(p.summary)})
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);`);

    sqlLines.push(`INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('${p.revisionId}', '${assetId}', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);`);

    const refPriceSql = p.referencePriceVnd === null ? 'NULL' : p.referencePriceVnd;
    sqlLines.push(`INSERT INTO places (id, content_id, region_id, category, latitude, longitude, reference_price_vnd, typical_duration_minutes, updated_at)
VALUES ('${p.id}', '${p.contentId}', '${p.regionId}', '${p.category}', ${p.latitude}, ${p.longitude}, ${refPriceSql}, ${p.typicalDurationMinutes}, NOW(6))
ON DUPLICATE KEY UPDATE
  region_id = VALUES(region_id),
  category = VALUES(category),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  reference_price_vnd = VALUES(reference_price_vnd),
  typical_duration_minutes = VALUES(typical_duration_minutes),
  updated_at = NOW(6);`);

    for (let day = 0; day <= 6; day++) {
      const hourId = `50000000-0000-4000-8000-${String(placeIndex * 10 + day).padStart(12, '0')}`;
      sqlLines.push(`INSERT INTO place_opening_hours (id, place_id, weekday, opens_at, closes_at, crosses_midnight)
VALUES ('${hourId}', '${p.id}', ${day}, '${p.openingHours.opens}', '${p.openingHours.closes}', 0)
ON DUPLICATE KEY UPDATE opens_at = VALUES(opens_at), closes_at = VALUES(closes_at);`);
    }
    sqlLines.push('');
  }

  sqlLines.push(`-- 4. DANH SACH SU KIEN & LE HOI (${events.length} EVENTS)`);
  for (const e of events) {
    const bannerUrl = eventBanners[e.slug] || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80';
    const eventIndex = parseInt(e.id.slice(-4), 10) || 1;
    const assetId = `70000000-0000-4000-8000-${String(eventIndex).padStart(12, '0')}`;
    const assetStorageKey = bannerUrl.includes('?') ? `${bannerUrl}&asset=${e.slug}` : `${bannerUrl}?asset=${e.slug}`;
    const fullBody = e.sections.map(s => `${s.title}\n${s.content}`).join('\n\n');
    const payload = JSON.stringify({
      placeId: e.placeId,
      locationName: e.locationName,
      startsAt: e.startsAt,
      endsAt: e.endsAt,
      frequency: e.frequency,
      slug: e.slug,
      bannerUrl: bannerUrl,
      imageUrl: bannerUrl
    });

    sqlLines.push(`-- [Event] ${e.title}`);
    sqlLines.push(`INSERT INTO media_assets (id, storage_key, media_type, mime_type, byte_size, sha256, source_reference, license_note, offline_allowed, uploaded_by, created_at)
VALUES ('${assetId}', ${escapeSql(assetStorageKey)}, 'IMAGE', 'image/jpeg', 204800, UNHEX(SHA2('${e.slug}', 256)), ${escapeSql(e.source)}, 'Unsplash Free Commercial License / Du Lịch Xúc Tiến', 1, '${creatorId}', NOW(6))
ON DUPLICATE KEY UPDATE storage_key = VALUES(storage_key);`);

    sqlLines.push(`INSERT INTO content_items (id, kind, visibility, created_by, created_at, updated_at)
VALUES ('${e.contentId}', 'EVENT', 'DRAFT', '${creatorId}', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE updated_at = NOW(6);`);

    sqlLines.push(`INSERT INTO content_revisions (id, content_id, revision_no, status, source_reference, payload, submitted_by, reviewed_by, reviewed_at, created_at)
VALUES ('${e.revisionId}', '${e.contentId}', 1, 'PUBLISHED', ${escapeSql(e.source)}, ${escapeSql(payload)}, '${creatorId}', '${creatorId}', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'PUBLISHED', payload = VALUES(payload);`);

    sqlLines.push(`UPDATE content_items SET published_revision_id = '${e.revisionId}', visibility = 'PUBLIC' WHERE id = '${e.contentId}';`);

    sqlLines.push(`INSERT INTO content_translations (revision_id, language_code, title, body, transcript)
VALUES ('${e.revisionId}', 'vi', ${escapeSql(e.title)}, ${escapeSql(fullBody)}, ${escapeSql(e.summary)})
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), transcript = VALUES(transcript);`);

    sqlLines.push(`INSERT INTO content_media (revision_id, asset_id, sort_order)
VALUES ('${e.revisionId}', '${assetId}', 1)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);`);

    sqlLines.push(`INSERT INTO events (id, content_id, place_id, starts_at, ends_at, event_status)
VALUES ('${e.id}', '${e.contentId}', '${e.placeId}', '${e.startsAt}', '${e.endsAt}', '${e.eventStatus}')
ON DUPLICATE KEY UPDATE
  place_id = VALUES(place_id),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  event_status = VALUES(event_status);`);
    sqlLines.push('');
  }

  sqlLines.push('COMMIT;');
  sqlLines.push('-- Hoan tat import du lieu.');
  return sqlLines.join('\n');
}

// ==========================================
// MAIN PROCESS
// ==========================================
async function main() {
  console.log('🚀 Bắt đầu quá trình tạo bộ dữ liệu Du lịch Gia Lai & Bình Định...');

  const placesDir = path.join(ROOT_DATA_DIR, 'articles', 'places');
  const eventsDir = path.join(ROOT_DATA_DIR, 'articles', 'events');
  const metadataDir = path.join(ROOT_DATA_DIR, 'metadata');

  fs.mkdirSync(placesDir, { recursive: true });
  fs.mkdirSync(eventsDir, { recursive: true });
  fs.mkdirSync(metadataDir, { recursive: true });

  // 1. Tạo các file HTML địa điểm (55 địa điểm)
  console.log(`📝 Đang xuất ${allPlacesData.length} bài viết HTML địa điểm (30 Gia Lai + 25 Bình Định)...`);
  for (const place of allPlacesData) {
    const filePath = path.join(placesDir, `${place.slug}.html`);
    const htmlContent = renderPlaceHtml(place);
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
  }

  // 2. Tạo các file HTML sự kiện (24 sự kiện)
  console.log(`📝 Đang xuất ${allEventsData.length} bài viết HTML sự kiện (12 Gia Lai + 12 Bình Định)...`);
  for (const event of allEventsData) {
    const filePath = path.join(eventsDir, `${event.slug}.html`);
    const htmlContent = renderEventHtml(event);
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
  }

  // 3. Xuất Metadata JSON
  console.log('📦 Đang xuất metadata JSON tổng hợp...');
  const enrichedPlaces = allPlacesData.map(p => ({
    ...p,
    bannerUrl: placeBanners[p.slug] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    imageUrl: placeBanners[p.slug] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  }));

  const enrichedEvents = allEventsData.map(e => ({
    ...e,
    bannerUrl: eventBanners[e.slug] || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    imageUrl: eventBanners[e.slug] || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
  }));

  const enrichedBinhDinhPlaces = binhDinhPlacesData.map(p => ({
    ...p,
    bannerUrl: placeBanners[p.slug] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    imageUrl: placeBanners[p.slug] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  }));

  const enrichedBinhDinhEvents = binhDinhEventsData.map(e => ({
    ...e,
    bannerUrl: eventBanners[e.slug] || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    imageUrl: eventBanners[e.slug] || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
  }));

  fs.writeFileSync(path.join(metadataDir, 'regions.json'), JSON.stringify(allRegionsData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(metadataDir, 'places.json'), JSON.stringify(enrichedPlaces, null, 2), 'utf-8');
  fs.writeFileSync(path.join(metadataDir, 'events.json'), JSON.stringify(enrichedEvents, null, 2), 'utf-8');

  // Metadata riêng của Bình Định
  fs.writeFileSync(path.join(metadataDir, 'binhdinh_regions.json'), JSON.stringify(binhDinhRegionsData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(metadataDir, 'binhdinh_places.json'), JSON.stringify(enrichedBinhDinhPlaces, null, 2), 'utf-8');
  fs.writeFileSync(path.join(metadataDir, 'binhdinh_events.json'), JSON.stringify(enrichedBinhDinhEvents, null, 2), 'utf-8');

  // 4. Tạo các file SQL import
  console.log('💾 Đang tạo file import SQL...');
  // File tổng hợp cả Gia Lai & Bình Định
  const fullSql = generateSql(allRegionsData, allPlacesData, allEventsData, 'Gia Lai & Binh Dinh Tourism Dataset Full Import');
  const fullSqlPath = path.join(ROOT_DATA_DIR, 'import_gialai_tourism.sql');
  fs.writeFileSync(fullSqlPath, fullSql, 'utf-8');
  console.log(`✓ Đã xuất thành công: ${fullSqlPath} (Tất cả Gia Lai + Bình Định)`);

  // File riêng cho Bình Định
  const binhDinhSql = generateSql(binhDinhRegionsData, binhDinhPlacesData, binhDinhEventsData, 'Binh Dinh Tourism Dataset Standalone Import');
  const binhDinhSqlPath = path.join(ROOT_DATA_DIR, 'import_binhdinh_tourism.sql');
  fs.writeFileSync(binhDinhSqlPath, binhDinhSql, 'utf-8');
  console.log(`✓ Đã xuất thành công: ${binhDinhSqlPath} (Chỉ riêng Bình Định)`);

  // 5. Cập nhật README.md
  console.log('📄 Đang cập nhật README.md...');
  const readmeContent = `# BỘ DỮ LIỆU DU LỊCH & SỰ KIỆN LIÊN VÙNG GIA LAI & BÌNH ĐỊNH

> **Trục liên kết du lịch "Rừng Vàng - Biển Bạc":** Kết nối cao nguyên bazan hùng vĩ Gia Lai (Tây Sơn Thượng Đạo) với miền duyên hải xứ võ Quy Nhơn - Bình Định (Tây Sơn Hạ Đạo) qua tuyến Quốc lộ 19 huyền thoại.  
> **Nguồn công khai chính thống:** Cổng thông tin điện tử tỉnh Gia Lai (\`gialai.gov.vn\`), Sở Du lịch Bình Định (\`dulich.binhdinh.gov.vn\`), Cổng TTĐT tỉnh Bình Định (\`binhdinh.gov.vn\`), Báo Gia Lai, Báo Bình Định, Bảo tàng Quang Trung, Ban Quản lý VQG Kon Ka Kinh và các khu di tích danh thắng.

---

## 📂 1. Cấu Trúc Thư Mục Dữ Liệu

\`\`\`
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
\`\`\`

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

Các file SQL đã được thiết kế tuân thủ 100% ràng buộc của \`be/schema.sql\`:

### Nhập toàn bộ dữ liệu (Gia Lai + Bình Định):
\`\`\`bash
mysql --default-character-set=utf8mb4 -u root -p gialaitravel < gialai_tourism_data/import_gialai_tourism.sql
\`\`\`

### Hoặc chỉ nhập riêng Bình Định:
\`\`\`bash
mysql --default-character-set=utf8mb4 -u root -p gialaitravel < gialai_tourism_data/import_binhdinh_tourism.sql
\`\`\`

### Qua giao diện phpMyAdmin / cPanel:
Mở database \`gialaitravel\` -> chọn tab **Import** -> Chọn file \`import_gialai_tourism.sql\` (hoặc \`import_binhdinh_tourism.sql\`) và bấm **Go**.
`;

  fs.writeFileSync(path.join(ROOT_DATA_DIR, 'README.md'), readmeContent, 'utf-8');
  console.log('✓ Đã cập nhật thành công README.md');
  console.log('🎉 Hoàn tất thành công toàn bộ việc bổ sung dữ liệu Du lịch Bình Định!');
}

main().catch(err => {
  console.error('❌ Lỗi khi sinh dữ liệu:', err);
  process.exit(1);
});
