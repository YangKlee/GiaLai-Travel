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

Commit nền tảng FE: `43a487c`; API khám phá: `8b9f47f`; demo xuyên FE/BE: `4aec204`; chuyển runtime sang scaffold Sequelize: `ca59920`; migration/integration/bootstrap: `8b5baf4`; audit/jobs & khôi phục mật khẩu: `b22ba80`. Tài liệu cấu trúc ban đầu: `57a8d9c`.

## Đối chiếu backlog

- FE-01: có public, auth và tourist/account layouts, route loaders và TypeScript strict. Admin chưa mở chức năng quản trị. SPA fallback trên hosting sẽ kiểm tra khi triển khai.
- FE-02: đã có tokens, font Inter tự host, Button/Badge và layout responsive. Các component form/table/dialog và kiểm tra tiếp cận đầy đủ sẽ bổ sung theo tính năng sử dụng.
- FE-03: Axios xử lý lỗi/AbortSignal, access trong bộ nhớ, gom refresh một lần, Web Locks/BroadcastChannel, retry access-expired đúng một lần, bỏ response của tài khoản cũ và reset state khi logout/đổi user. VND dùng BigInt, ngày VN, URL nguồn chỉ HTTP(S). Cache/offline private và mutation nghiệp vụ chưa triển khai.
- FE-04: có Vitest/Testing Library, memory router độc lập, E2E khám phá và E2E tài khoản với MariaDB thật. Đã có Prettier, `format:check` và CI có job DB/browser auth; git hooks còn tiếp tục. Chưa chạy workflow trên GitHub runner.
- BE-04: đã có `redactMetadata`, `appendAudit`, `appendNotification` idempotent theo `(user_id, event_key)`, `listAuditLogs` chỉ dành cho `ADMIN`, adapter contracts (`mail`, `ai`, `routing`, `storage`), `resolveNow` clock seam và CLI job runner (`cleanup-expired-auth`, `process-privacy-requests`) dùng MariaDB advisory lock trên cùng kết nối. Chưa cấu hình cron trên hosting thật.
- BE-05/FE-05 & BE-06/FE-06: luồng tài khoản cốt lõi và khôi phục mật khẩu đã tích hợp. Kiểm chữ ký/claims, trạng thái user/session/quyền hiện hành, replay/concurrent refresh, logout, lỗi DB/rollback, rate limit, reload/multi-tab, unsafe return URL, mất phản hồi rotate/logout, không lưu token vào browser storage, phản hồi công khai đồng nhất khi quên mật khẩu, hạn 15 phút, dùng một lần khi cạnh tranh, thu hồi toàn bộ phiên khi đặt lại mật khẩu và xóa token khỏi URL trình duyệt đã được thử. Chưa có giao diện quản trị hoặc toàn bộ nghiệm thu X-03/SMTP thật trên hosting.
- BE-07/08 & FE-07: đã tích hợp `/api/v1/me/{profile,preferences,consents,privacy-requests,privacy-requests/:id/export}` và trang `/account`. Consent mặc định chưa chọn sẵn (`decisionNo = 0`), khóa chủ thể khi cấp `decision_no` tuần tự chống trùng khi gửi đồng thời, sắp lịch sử theo `decision_no DESC`, không ghi `behavior_events` ở GĐ1. Yêu cầu xuất/xóa xác minh lại mật khẩu, chặn mở trùng (`409`), tải gói JSON kiểm quyền chủ sở hữu và hạn 7 ngày (`410`), yêu cầu xóa khi còn đơn hoạt động (`CHO_DUYET`/`DA_XAC_NHAN`) chỉ ghi nhận chờ mà không tự hủy đơn; khi đơn hoàn tất (`HOAN_THANH`), job ẩn danh thông tin nhận dạng của `users` nhưng giữ nguyên đơn lịch sử và audit.
- FE-08/09: có khám phá, lọc tên/loại/vùng/giá, sort, phân trang, empty/error và detail POI. Bản đồ mở bằng liên kết OpenStreetMap khi có tọa độ; chưa nhúng bản đồ, chưa có dịch vụ/slot. Minh họa dùng Lucide/CSS cục bộ, chưa dùng ảnh du lịch có bản quyền.
- FE-17: mới có bản nháp thao tác thêm/xóa/đổi thứ tự/đổi tên, tối đa 12 điểm. Dữ liệu trong bộ nhớ, tách demo/live, reload xóa; chưa có lưu revision, ownership, AI/validator hoặc CRUD lịch phía BE.
- BE-11/12: API POI dùng Sequelize associations/filters; đã kiểm HTTP round-trip và publication gates trên MariaDB thật. Chưa có workflow quản trị, dịch vụ/slot và ngoại lệ đóng cửa.
- Các checkbox gốc giữ nguyên khi chưa đáp ứng toàn bộ tiêu chí nghiệm thu.

## Giới hạn

Chưa nghiệm thu hosting/HTTPS, restore backup hosting, AI thật, offline hoặc giao dịch. MariaDB/auth đã kiểm local; không có thao tác ghi/import lên CSDL hosting. Danh mục demo có `dataset: demo`. `dev:demo` không cần DB; `dev:demo:auth` dùng `.env.demo-auth` riêng để lưu tài khoản trong DB local, danh mục vẫn là mẫu. Cả hai chỉ bind loopback và từ chối production.

Playwright kiểm Chromium desktop 1440px, viewport iPhone 13 và form auth 360px; chưa kiểm Safari/iOS thật. Ảnh kiểm tra nằm trong `fe/test-results/` (Git ignore). Kiểm tra tiếp cận tự động không thay thế screen reader/keyboard QA thủ công.

Đã quét axe theo WCAG A/AA ở các trang khám phá, chi tiết và bản nháp rỗng tại 360px, không có vi phạm được phát hiện tự động; không thay thế kiểm tra screen reader thủ công. Giữ màu thương hiệu `#256EFF`; màu hành động `#1D63ED` và màu chữ xanh đậm `#1755CC` đáp ứng tương phản chữ nhỏ trên nền đang dùng (màu gốc với chữ trắng chỉ 4,42:1).

## Thứ tự tiếp tục

1. Đã kiểm CSDL dev/test biệt lập, migration và bootstrap; bổ sung nghiệm thu restore/grants môi trường triển khai cho BE-03. CI đã có job MariaDB integration.
2. Mốc M1 (tài khoản, khôi phục mật khẩu, hồ sơ, sở thích, consent tuần tự, xuất/xóa dữ liệu cá nhân và job runner BE-04/05/06/07/08, FE-05/06/07) đã hoàn thành trên MariaDB local và trình duyệt.
3. Tiếp theo: workflow quản trị nội dung có revision, media và dữ liệu có nguồn (BE-09/10/11/12/13/14, FE-10/11/12/13) để thay bộ mẫu bằng nội dung công bố.
4. Validator/tuyến/AI thật và lưu revision (BE-15–18, FE-14–17), sau đó đặt dịch vụ và mock payment.

Mỗi mốc tiếp tục commit độc lập sau kiểm tra. Chưa đánh dấu các task lớn là DONE chỉ dựa trên bản demo.
