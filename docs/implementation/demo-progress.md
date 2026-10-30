# Tiến độ bản demo

Ưu tiên theo yêu cầu: hình thành sản phẩm demo chạy được trước, commit từng mốc quan trọng. Demo đầu tiên đi theo luồng khám phá → chi tiết địa điểm → chọn điểm vào bản nháp chuyến đi; sau đó mới mở rộng tài khoản, quản trị, AI và giao dịch theo backlog.

## Các mốc

| Mốc | Phạm vi | Trạng thái |
| --- | --- | --- |
| D1 — Nền tảng FE | TypeScript strict, alias, Router Data Mode, route modules, lazy pages, error pages, Essential tokens, Button/Badge, Vitest | Đã triển khai; lint, build và 2 route tests đạt trên Node 20.20.2 |
| D2 — API khám phá | Contract, danh mục, tìm/lọc/phân trang và chi tiết POI; repository CSDL và server demo tách riêng | Đã triển khai; bộ 16 test BE (gồm kiểm tra OpenAPI) đạt trên Node 20.20.2 |
| D3 — Demo xuyên FE/BE | Trang khám phá, chi tiết, bản nháp chuyến đi và kiểm tra tích hợp | Đã triển khai; 7 unit tests FE, 10 E2E Chromium desktop/mobile, lint và TypeScript/Vite build đạt trên Node 20.20.2 |
| D4 — CI | GitHub Actions cài dependency theo lockfile, format/lint/unit/build/E2E trên Node từ `.nvmrc` | Đã thêm workflow; các lệnh đạt local, chưa chạy trên GitHub runner |
| D5 — Nền tảng CSDL thật | Sequelize runtime từ scaffold, migration ledger/lock/checksum, CLI admin, MariaDB integration và CI database job | 15 unit tests BE và 6 integration tests đạt trên MariaDB 10.5.26/Node 20.20.2; CI runner chưa chạy |
| D6 — Tài khoản BE/FE | Đăng ký/login/refresh/logout/me; JWT RS256, cookie HttpOnly, CORS/CSRF/rate limit, form/account page, multi-tab và demo local có tài khoản | 16 unit BE, 8 unit FE, 13 integration MariaDB, browser E2E tài khoản và lint/build/format đạt local |
| D7 — Audit, Jobs & Khôi phục mật khẩu | Audit redaction, notification idempotency, adapter contracts (mail/AI/routing/storage), CLI job runner có advisory lock, clock seam và `/auth/forgot-password`, `/auth/reset-password` BE/FE | 18 unit BE, 9 unit FE, 15 integration MariaDB, browser E2E khôi phục mật khẩu (xóa token khỏi URL, axe WCAG A/AA) đạt local |
| D8 — Hồ sơ, Consent & Quyền dữ liệu | `/me/profile`, `/me/preferences`, `/me/consents` (khóa chủ thể cấp `decision_no` tuần tự, mặc định chưa đồng ý) và `/me/privacy-requests` (xác minh lại mật khẩu, gói xuất JSON có hạn 7 ngày, job ẩn danh bảo vệ đơn đang hoạt động) trên BE/FE | 18 unit BE, 10 unit FE, 16 integration MariaDB, browser E2E hồ sơ/consent/export và lint/build/format đạt local |
| D9 — Quản trị nội dung & Duyệt CMS | Workflow revision bất biến (`/api/v1/admin/contents`), kiểm duyệt media (MIME, chống traversal/script/magic bytes), kiểm tra nguồn công bố bắt buộc, đóng cửa tạm thời, thuyết minh âm thanh tiếng Việt, sự kiện và dịch vụ đối tác/slots trên BE/FE | 18 unit BE, 11 unit FE, 17 integration MariaDB, 10 E2E Playwright và lint/build/format đạt local |
| D10 — Gợi ý lịch trình AI & Chuyến đi đã lưu | Đề xuất lịch trình thông minh từ 7 thông số (`/api/v1/itinerary-proposals`), kiểm tra độc lập giờ mở cửa/đóng cửa tạm thời/chi phí/tuyến đường (`routingAdapter`), cảnh báo vượt ngân sách, revalidate, lưu/quản lý lịch trình MariaDB (`/api/v1/me/itineraries`) có khóa lạc quan `lock_version` (409) và sao chép/xóa mềm trên BE/FE | 18 unit BE, 12 unit FE, 18 integration MariaDB, 10 E2E Playwright và lint/build/format đạt local |
| D11 — Đặt dịch vụ & Thanh toán mô phỏng | Báo giá live (`/api/v1/booking-quotes`), đặt dịch vụ (`/api/v1/bookings`) ở trạng thái `CHO_DUYET`, kiểm soát thời hạn đặt trước tối thiểu 24h30m, duyệt/từ chối của ADMIN (`/api/v1/admin/bookings/:id/review`) giữ chỗ slot trong 30 phút (`CHO_THANH_TOAN`), luồng thanh toán mô phỏng du khách (`SUCCEEDED`/`FAILED`/`CANCELLED`), hủy đơn hoàn tiền 100% mô phỏng (`refunds`), ADMIN xác nhận hoàn tất sau khi kết thúc dịch vụ (`HOAN_THANH`) và hạch toán hoa hồng 10% (`commissions`), background job `expire-bookings` tự động thu hồi chỗ quá hạn; UI đặt dịch vụ tại `/services/:id`, danh sách quản lý đơn đặt tại `/bookings`, tab quản lý đặt chỗ/hoa hồng trên trang Quản trị `/admin` | 18 unit BE, 13 unit FE, 19 integration MariaDB, 10 E2E Playwright, 1 E2E auth browser, 0 lint warnings và clean build đạt local |

Commit nền tảng FE: `43a487c`; API khám phá: `8b9f47f`; demo xuyên FE/BE: `4aec204`; chuyển runtime sang scaffold Sequelize: `ca59920`; migration/integration/bootstrap: `8b5baf4`; audit/jobs & khôi phục mật khẩu: `b22ba80`; hồ sơ & consent: `dabde15`; CMS revision & media/events/services: `04b816d`; tài liệu D9: `8e36c28`; AI đề xuất lịch trình & CRUD chuyến đi: `f57bc3d`.

## Đối chiếu backlog

- FE-01: có public, auth và tourist/account layouts, route loaders và TypeScript strict. Đã mở chức năng quản trị `/admin` và quản lý đơn đặt chỗ `/bookings`. SPA fallback trên hosting sẽ kiểm tra khi triển khai.
- FE-02: đã có tokens, font Inter tự host, Button/Badge và layout responsive (không tràn 360px). Component modal/confirm và tiếp cận được kiểm tra WCAG tự động qua Axe.
- FE-03: Axios xử lý lỗi/AbortSignal, access trong bộ nhớ, gom refresh một lần, Web Locks/BroadcastChannel, retry access-expired đúng một lần, bỏ response của tài khoản cũ và reset state khi logout/đổi user. VND dùng BigInt, ngày VN, URL nguồn chỉ HTTP(S).
- FE-04: có Vitest/Testing Library, memory router độc lập, E2E khám phá và E2E tài khoản với MariaDB thật. Đã có Prettier, `format:check` và CI có job DB/browser auth.
- BE-04: đã có `redactMetadata`, `appendAudit`, `appendNotification` idempotent theo `(user_id, event_key)`, `listAuditLogs` chỉ dành cho `ADMIN`, adapter contracts (`mail`, `ai`, `routing`, `storage`), `resolveNow` clock seam và CLI job runner (`cleanup-expired-auth`, `process-privacy-requests`, `expire-bookings`) dùng MariaDB advisory lock trên cùng kết nối.
- BE-05/FE-05 & BE-06/FE-06: luồng tài khoản cốt lõi và khôi phục mật khẩu đã tích hợp và kiểm thử đầy đủ.
- BE-07/08 & FE-07: hồ sơ, sở thích, consent tuần tự, quyền riêng tư xuất/xóa dữ liệu cá nhân theo GDPR/Nghị định 13/2023.
- BE-09..13 & FE-09..12: CMS revision workflow bất biến, kiểm duyệt media nghiêm ngặt, thuyết minh âm thanh, sự kiện, dịch vụ và khung giờ đối tác.
- BE-15..18 & FE-14..17: đề xuất lịch trình AI từ 7 tham số, bộ kiểm tra độc lập (giờ mở cửa, đóng cửa, tuyến đường, ngân sách không lạm phát ngầm), revalidate và CRUD lịch trình MariaDB có khóa lạc quan `lock_version` (409), sao chép/xóa mềm.
- BE-14, BE-20..25 & FE-13, FE-20..23: báo giá trực tiếp, đặt dịch vụ ở trạng thái `CHO_DUYET`, kiểm soát hạn 24h30m, duyệt/giữ chỗ 30 phút, thanh toán mô phỏng (`SUCCEEDED`/`FAILED`/`CANCELLED`), hủy đơn hoàn tiền 100% mô phỏng, hoàn tất đơn sau thời điểm kết thúc và hạch toán hoa hồng 10%, cùng background job `expire-bookings`.

## Giới hạn

Chưa nghiệm thu hosting/HTTPS, restore backup hosting, AI bên ngoài thật (đang dùng smart prompt-engine adapter và local routing adapter), offline Service Worker/PWA. Toàn bộ logic nghiệp vụ, giao dịch, tính toán hoa hồng, hoàn tiền, kiểm duyệt nội dung và tài khoản đã được xác minh toàn diện trên MariaDB 10.5.26 cục bộ và trình duyệt E2E Playwright.

## Chuẩn bị cho lần chạy agent kế tiếp

1. **Các mốc đã hoàn tất (D1 -> D11)**:
   - Nền tảng FE, API khám phá, CSDL MariaDB thật, Xác thực/Tài khoản, Audit/Jobs/Reset password, Hồ sơ & Privacy/Consent, CMS Revision & Dịch vụ/Khung giờ, AI Đề xuất lịch trình & CRUD Chuyến đi, Đặt dịch vụ & Thanh toán mô phỏng.
   - Kiểm thử hiện tại: **18 BE unit tests**, **13 FE unit tests**, **19 MariaDB integration tests**, **10 Playwright E2E tests**, **1 E2E browser auth test**, **0 lint warnings**, **clean build**.
2. **Nhiệm vụ còn lại cho lần chạy kế tiếp (M6 & M7)**:
   - **M6 — Offline Cache & PWA / Lưu trữ ngoại tuyến (FE-18..19)**:
     - Cấu hình Service Worker / Workbox: cache tĩnh (assets, fonts, shell) và cache dữ liệu danh mục địa điểm, bản đồ ngoại tuyến khi mất sóng trên cao nguyên.
     - Khả năng xem lại lịch trình đã lưu khi thiết bị offline (`NetworkFirst` với IndexedDB/CacheStorage fallback).
   - **M7 — Bảng điều khiển kiểm toán & Giám sát hệ thống (BE-26, FE-24)**:
     - Giao diện tra cứu nhật ký kiểm toán `/admin/audit-logs` với bộ lọc loại hành động (`targetType`, `action`, `actorId`, khoảng thời gian) và ẩn thông tin nhạy cảm.
     - Trình xem báo cáo thống kê: tỷ lệ duyệt đơn đặt chỗ, tổng hoa hồng đối tác, số lượng yêu cầu AI theo tháng.
   - **Đóng gói & Hướng dẫn triển khai Production (X-01..05)**:
     - Dockerfile đa tầng cho BE và FE, docker-compose với MariaDB cấu hình production, migration tự động khi khởi động.
     - Kiểm tra khôi phục bản sao lưu dữ liệu và kịch bản rollback an toàn.
