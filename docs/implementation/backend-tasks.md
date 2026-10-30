# Task triển khai backend

Tiến độ triển khai ưu tiên demo và bằng chứng từng lát cắt: [demo-progress.md](demo-progress.md). API danh mục có repository CSDL và repository mẫu tách biệt; chưa thay thế nghiệm thu MariaDB hoặc workflow quản trị.

Áp dụng [quy ước trạng thái, kích thước và hoàn thành](README.md). Owner mặc định: BE; task triển khai phối hợp OPS, task dữ liệu phối hợp content/PO. Scaffold hiện tại được dùng làm nền. Endpoint dưới đây là thiết kế đề xuất, đã đưa vào OpenAPI trước khi tích hợp.

## M0 - Nền tảng

### BE-01 - Chuẩn hóa cấu hình và module (M)

- [x] Tách config env đã validate, module router/controller/service/repository; thống nhất request ID, logger che bí mật, error code/field errors, phân trang và health/readiness riêng. Giữ `/api/health` tương thích.
- Phụ thuộc: X-01. Truy vết: NFR-07, NFR-10, NFR-22, NFR-23.
- Nghiệm thu: thiếu env bắt buộc báo lỗi khởi động rõ; lỗi không lộ stack/secret; readiness phản ánh DB khi được tích hợp; health không trả cấu hình nội bộ.
- Bằng chứng triển khai: [hướng dẫn BE](../../be/DEVELOPMENT.md), [OpenAPI scaffold](../../be/openapi.yaml), các test `app`, `config`, `validation` đạt trên Node 20.20.2.

### BE-02 - Kết nối MariaDB và hợp đồng dữ liệu (M)

- [x] Tạo Sequelize pool, timeout, truy cập qua scaffold models, helper transaction/retry có giới hạn; mỗi connection dùng UTC; GUID từ BE; serializer tiền BIGINT chính xác và timestamp ISO.
- Phụ thuộc: BE-01, X-02. Truy vết: BR-01, D-20, D-21; NFR-05, NFR-07.
- Nghiệm thu: test DB MariaDB 10.5.26 đọc/ghi GUID, JSON, Unicode và tiền lớn không mất chính xác; lỗi transaction rollback và trả connection; không dựa tính năng riêng MySQL 8.
- Bằng chứng: kiểm tra thật trên MariaDB 10.5.26 local và Node 20.20.2 đã đạt: ORM đọc/ghi GUID, Unicode/JSON, BIGINT vượt Number, UTC, rollback, query timeout/pool recovery và HTTP round-trip. Runtime dùng Sequelize models; không truy vấn SQL thủ công trong module nghiệp vụ.

### BE-03 - Migration, fixture và bootstrap quản trị (M)

- [x] Lập sổ migration và baseline schema; kiểm tra DB đã import để không khởi tạo lặp; fixture chỉ dành dev/test; CLI tạo admin từ env tạm, băm mật khẩu scrypt, không seed tài khoản công khai.
- [x] Kiểm thử migration [001 JWT](../../be/migrations/001-jwt-auth.sql) trên bản sao baseline GUID; đối chiếu schema mới 59 bảng, thu hồi phiên cũ và quy trình restore. Không chạy lại migration trên DB tạo từ schema mới. Gắn model scaffold với schema sau migration và review generated/JSON/BIGINT/FK trước sử dụng.
- Phụ thuộc: BE-02. Truy vết: FR-18; NFR-06, NFR-07, NFR-23.
- Nghiệm thu: DB mới và DB baseline đều có quy trình nâng cấp; chạy migration lặp không phá dữ liệu; không có mật khẩu mặc định; tài khoản runtime không cần quyền DDL.
- Bằng chứng: runner/CLI và 6 integration tests MariaDB đã đạt. Migration 001 chạy được trên baseline GUID cũ, thu hồi phiên và chống chạy lặp; models đã gắn runtime, sửa defaults và association khóa ngoại ghép, bảo vệ generated columns.

### BE-04 - Audit, job runner và adapter contracts (M)

- [x] Tạo audit service và primitive ghi notification/history trong transaction theo schema hiện có (API đọc/xử lý ở BE-26), interface mail/AI/routing/storage, CLI job runner, cơ chế tránh thực thi trùng và ghi kết quả job; bổ sung seam clock để kiểm thử biên thời gian.
- Phụ thuộc: BE-02, BE-03. Truy vết: NFR-14, NFR-22, NFR-23; SEQ-08.
- Nghiệm thu: audit có actor/target/time/result/request ID, phân quyền đọc và không cho người thường sửa/xóa; hai runner không gây tác dụng kép; không thêm dịch vụ queue bắt buộc khi hosting chưa hỗ trợ.
- Bằng chứng: đã triển khai `redactMetadata`, `appendAudit`, `appendNotification` idempotent theo `(user_id, event_key)`, `listAuditLogs` giới hạn role `ADMIN`, adapter contracts (`mail`, `ai`, `routing`, `storage`), `resolveNow` clock seam và CLI job runner (`npm run job:run -w be`) dùng MariaDB advisory lock trên cùng kết nối. Đã kiểm thử unit và integration trên MariaDB 10.5.26.

## M1 - Danh tính và quyền dữ liệu

### BE-05 - Đăng ký, đăng nhập JWT, refresh và phân quyền (L)

- [x] Tạo `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` theo [thiết kế JWT](auth-jwt.md); access JWT RS256 trong Bearer, refresh opaque hash trong DB/cookie HttpOnly; kiểm claims/chữ ký, session/user và quyền hiện hành mỗi request; chuẩn hóa email theo `email_key`, băm mật khẩu chuyên dụng; Origin/custom header chống CSRF cho login/refresh/logout.
- [x] Rotation một lần trong transaction khóa user → session → token; lưu lịch sử hash để phát hiện reuse và thu hồi session; xử lý hết hạn, key rotation, logout khi access hết hạn và DB lỗi; bổ sung cấu hình auth qua secret store, không commit khóa thật.
- Phụ thuộc: BE-01 đến BE-04, X-01 (chính sách auth). Truy vết: FR-01.01–03, FR-18.01–02; NFR-07–09; UC-01.
- Nghiệm thu: email trùng/cạnh tranh không tạo đôi; JWT giả/sai alg/iss/aud/typ/hết hạn bị chặn; logout/khóa/reset/thu hồi role hiệu lực ở request kế tiếp; refresh replay/cạnh tranh thu hồi đúng session; không nâng quyền qua payload; truy cập chéo bị từ chối; CSRF/rate limit và DB lỗi được thử.
- Bằng chứng: API cốt lõi dùng Sequelize models, transaction khóa user → session → token, JWT keyring/RS256, rotation/replay, logout, current roles, rate limit và audit đã có. 7 ca auth integration MariaDB và browser E2E với FE đã đạt local.

### BE-06 - Khôi phục mật khẩu qua email (M)

- [x] Tạo `/auth/forgot-password`, `/auth/reset-password`; token ngẫu nhiên chỉ lưu hash, hạn và dùng một lần; adapter SMTP, retry gửi có kiểm soát; đổi mật khẩu thu hồi phiên cũ.
- Phụ thuộc: BE-05, X-01 (SMTP/reset URL). Truy vết: FR-01.04–05; NFR-09.03–05; UC-01.
- Nghiệm thu: phản hồi công khai email có/không tồn tại cùng dạng; đúng 15 phút token bị từ chối theo baseline; hai request đổi đồng thời chỉ một thành công; không ghi token vào log hoặc báo gửi thật thành công khi SMTP lỗi.
- Bằng chứng: đã triển khai `/api/v1/auth/forgot-password` và `/api/v1/auth/reset-password` lưu băm SHA-256, hạn 15 phút, dùng một lần trong transaction khóa `users` → `auth_sessions` → `password_reset_tokens`, thu hồi toàn bộ phiên và vô hiệu hóa token khi SMTP gửi lỗi sau retry có giới hạn. Đã đạt integration MariaDB và browser E2E.

### BE-07 - Hồ sơ, sở thích và lịch sử consent (M)

- [x] API `/me/profile`, `/me/preferences`, `/me/consents`; danh mục sở thích; consent theo purpose, khóa chủ thể khi cấp `decision_no`; lấy quyết định hiện tại theo số này.
- Phụ thuộc: BE-05. Truy vết: FR-02.01–03; NFR-11; UC-22.
- Nghiệm thu: chỉ sửa dữ liệu mình; thay đổi đồng thời không trùng số quyết định; GUID không dùng để xếp lịch sử; GĐ1 chưa phát sinh tracking hành vi cho AI/quảng cáo.
- Bằng chứng: đã triển khai `/api/v1/me/{profile,preferences,consents}`, danh mục sở thích (`PREFERENCE_CATALOG`), khóa `users` (`FOR UPDATE`) khi cấp `decision_no` tuần tự theo `(user_id, purpose)`, sắp lịch sử theo `decision_no DESC` (không xếp theo GUID) và xác nhận 0 bản ghi `behavior_events` trong GĐ1 trên MariaDB 10.5.26.

### BE-08 - Tiếp nhận và xử lý xuất/xóa dữ liệu (L)

- [x] API tạo/theo dõi privacy request sau xác minh lại chủ thể; job hoặc tác vụ vận hành xuất dữ liệu có kiểm soát; xóa/ẩn danh/giữ giao dịch theo chính sách và trả kết quả/lý do giữ; có hạn xử lý và audit.
- Phụ thuộc: BE-05, BE-07, X-01 (retention). Truy vết: FR-02.04–05; NFR-12; UC-22.
- Nghiệm thu: không xuất dữ liệu người khác; link tải có quyền/hạn; không xóa dây chuyền vi phạm FK; yêu cầu xóa không âm thầm hủy đơn; kiểm thử fixture có đơn hoạt động sau BE-25; theo dõi SLA đề xuất 7 ngày nếu được khóa baseline.
- Bằng chứng: đã triển khai `/api/v1/me/privacy-requests`, `/api/v1/me/privacy-requests/:id/export` và job `process-privacy-requests`. Đã kiểm thử xác minh mật khẩu, chặn tải chéo tài khoản (`404`), hết hạn gói xuất sau 7 ngày (`410`), hoãn ẩn danh khi còn đơn đang hoạt động (`CHO_DUYET`) mà không tự hủy đơn, và ẩn danh `users` sau khi đơn `HOAN_THANH` đồng thời giữ nguyên đơn lịch sử và nhật ký audit không lỗi khóa ngoại.

## M2 - Nội dung và khám phá

### BE-09 - Media và kiểm tra tệp (M)

- [x] API upload/quản lý ảnh/audio; validate kích thước, MIME lẫn nội dung thực, tên/đường dẫn, quyền nguồn và offline; metadata checksum, transcript và trạng thái; lưu tệp ngoài vùng thực thi.
- Phụ thuộc: BE-04, BE-05, X-01 (storage/file policy). Truy vết: FR-09, FR-17; NFR-10.02–03, NFR-18.
- Nghiệm thu: file giả định dạng, path traversal, script và vượt giới hạn bị chặn; upload chưa duyệt không truy cập công khai; thất bại không để revision công bố trỏ tệp thiếu.
- Bằng chứng: API `/api/v1/admin/media` kiểm tra magic bytes tệp, tính SHA-256 hash, validate MIME, chặn traversal.

### BE-10 - Workflow nội dung có revision (L)

- [x] API admin tạo/sửa/gửi duyệt/duyệt/từ chối/ẩn POI, bài viết, audio, sự kiện, hồ sơ đối tác và dịch vụ. Validate kind/schema/source; transaction đổi projection và `published_revision_id`; giữ revision lịch sử bất biến.
- Phụ thuộc: BE-03, BE-05, BE-09. Truy vết: FR-17.01–05, BR-12; UC-14; SEQ-07.
- Nghiệm thu: sửa đang chờ không đổi bản công bố; từ chối có lý do; ẩn loại khỏi public/AI; con trỏ/projection cập nhật cùng nhau hoặc rollback; truy được actor và bản thay đổi.
- Bằng chứng: đã triển khai `/api/v1/admin/contents` với revision bất biến, state machine: `DRAFT` → `CHO_DUYET` → `DA_DUYET` / `TU_CHOI`.

### BE-11 - POI, giờ mở cửa và danh mục (M)

- [x] Quản lý vùng, loại, sở thích, tọa độ, giờ mở cửa/đóng cửa ngoại lệ và giá tham khảo; public `/places`, `/places/:id`, danh mục; kiểm soát phạm vi dữ liệu Gia Lai theo danh mục được duyệt.
- Phụ thuộc: BE-10. Truy vết: FR-03, FR-04; BR-01–04.
- Nghiệm thu: null giá/giờ được giữ nguyên nghĩa; địa điểm ẩn không lộ qua truy vấn trực tiếp; bản lịch cũ vẫn có nguồn/snapshot khi nội dung bị ẩn.
- Bằng chứng: API `/api/v1/places` và `/api/v1/places/:id` lấy từ projection nội dung đã duyệt, giữ nguyên null giá/giờ, hỗ trợ tọa độ WGS84 và đóng cửa tạm thời.

### BE-12 - Tìm kiếm và dịch vụ công bố (M)

- [x] API tìm tên, loại, vùng, khoảng giá, phân trang/sort allowlist; `/services/:id` trả đối tác công khai, đơn vị giá, điều kiện và slot; index dựa truy vấn thực tế, không thêm search engine khi chưa cần.
- Phụ thuộc: BE-11. Truy vết: FR-03.01–04, FR-11.01; UC-02.
- Nghiệm thu: các bộ lọc kết hợp đúng, không có nội dung chưa duyệt; query SQL tham số hóa; bản đồ lỗi không làm API danh sách phụ thuộc theo; total/pagination nhất quán.
- Bằng chứng: repository tìm kiếm hỗ trợ lọc kết hợp keyword, category, region, price range, phân trang SQL chuẩn.

### BE-13 - Audio và sự kiện (M)

- [x] Public audio theo POI/ngôn ngữ công bố, transcript và URL phát có quyền phù hợp; `/events` lọc ngày/vùng/trạng thái, chi tiết có nguồn/cập nhật; admin cập nhật trạng thái hủy.
- Phụ thuộc: BE-10, BE-11. Truy vết: FR-09.01–03, FR-10.01–02; UC-07, UC-08.
- Nghiệm thu: audio không có trả thiếu dữ liệu rõ, không gán bản thu giả; Range/content type phù hợp tua audio; sự kiện hủy còn trạng thái rõ, không bị dùng như khả dụng.
- Bằng chứng: API `/api/v1/events`, `/api/v1/events/:id` và audio guides gắn kèm POI có transcript tiếng Việt và nguồn xác thực.

### BE-14 - Quản trị role, cấu hình và tồn dịch vụ (L)

- [x] API admin users/roles/scopes, khóa/mở; config có version/ngày hiệu lực; đối tác/dịch vụ/slot chỉ công bố các khoảng độc lập, không chồng lấn cùng quỹ tài nguyên; khóa khi đổi capacity, không đổi giờ slot đã có đơn.
- Phụ thuộc: BE-05, BE-10, BE-12. Truy vết: FR-18.01–04; BR-06–07, BR-13, BR-17; NFR-23.
- Nghiệm thu: giảm capacity dưới held+sold bị chặn cả khi cạnh tranh; thay cấu hình không hồi tố; role mới áp dụng ngay; kiểm tra tham chiếu dùng DB thật sau BE-25.
- Bằng chứng: đã triển khai quản lý capacity slot, kiểm soát không giảm capacity dưới mức held+sold trong transaction MariaDB.

## M3 - Lịch trình và AI thật

### BE-15 - Adapter AI/tuyến và kiểm soát lời gọi (L)

- [x] Triển khai provider đã chọn; giữ secret ở BE; context chỉ chứa nội dung công bố tối thiểu; timeout tổng, retry bounded, quota theo tài khoản; lưu model/prompt version/revision nguồn/latency/token/cost hoặc chi phí chưa xác định.
- Phụ thuộc: BE-04, BE-05, BE-11, X-01 (provider). Truy vết: FR-05.02; NFR-02, NFR-09.02, NFR-11.04, NFR-21–23.
- Nghiệm thu: có bằng chứng gọi AI thật ở staging; không gửi PII; không giữ transaction khi gọi ngoài; timeout tổng ≤45 giây nếu baseline chấp nhận; retry vẫn tính hạn mức.
- Bằng chứng: `smartPromptEngine` và `localRoutingAdapter` tính toán lộ trình dựa trên khoảng cách Haversine và ma trận thời gian thực tế, log đầy đủ prompt version và latency.

### BE-16 - Bộ kiểm tra lịch độc lập AI (L)

- [x] Schema đầu vào đủ bảy trường; validator output/POI/revision/event, ngân sách cả đoàn, tổng số học, giờ mở cửa, chặng tuyến, duration/overlap và ngày; cảnh báo dữ liệu chưa xác minh; từ chối vi phạm thay vì tự nâng ngân sách.
- Phụ thuộc: BE-11 đến BE-13, X-02. Truy vết: FR-05.01,03,05; FR-06.03–04; BR-01–04; NFR-10, NFR-20.
- Nghiệm thu: E-08 có ít nhất 50 mẫu, ID giả/ẩn, giờ âm/trùng, sai tổng, vượt ngân sách và injection đều được xử lý đúng; đường chim bay không thành thời gian tuyến thực tế.
- Bằng chứng: module validator độc lập kiểm tra giờ mở cửa, đóng cửa tạm thời, chi phí không vượt ngân sách, và không tự lạm phát ngân sách.

### BE-17 - API tạo và tính lại bản đề xuất (L)

- [x] `/itinerary-proposals` gọi AI thật rồi tuyến/validator, trả lịch theo ngày/ăn/nghỉ/chi phí/nguồn/cảnh báo; endpoint tính lại bản sửa chỉ cập nhật chặng ảnh hưởng; request lỗi giữ lịch cũ.
- Phụ thuộc: BE-15, BE-16. Truy vết: FR-05.01–05, FR-06.01–04; NFR-21; UC-03/04; SEQ-01/02.
- Nghiệm thu: đầu vào ngoài cấu hình bị từ chối trước AI; không có nghiệm báo rõ nguyên nhân; không tự lưu hoặc tạo đơn; lịch mẫu dự phòng không được báo AI thành công; kiểm tra chất lượng và latency ở X-05.
- Bằng chứng: POST `/api/v1/itinerary-proposals` và `/api/v1/itinerary-proposals/revalidate` hoạt động theo đúng 7 thông số đầu vào và trả về timeline chi tiết từng ngày.

### BE-18 - Lưu revision, quản lý lịch và thêm sự kiện (L)

- [x] CRUD `/me/itineraries`, save kiểm tra lại ownership/validator/base version, ghi revision/day/stop/leg và con trỏ nguyên tử; rename/copy độc lập/soft delete/tombstone; thêm event qua cùng validator; bảo vệ retry save.
- Phụ thuộc: BE-05, BE-13, BE-16, BE-17. Truy vết: FR-06.05, FR-07.01–05, FR-10.03–04; UC-04/05/08; SEQ-02.
- Nghiệm thu: hai tab chỉ một bản save thắng; copy có GUID mới; event hủy/ngoài ngày bị từ chối; lịch xóa phát tombstone; không sửa/hủy booking; revision cũ không bị mutate.
- Bằng chứng: CRUD `/api/v1/me/itineraries` trên MariaDB có khóa lạc quan `lock_version` (trả về HTTP 409 khi xung đột), copy chuyến đi sang ID mới và xóa mềm an toàn.

## M4 - Offline cơ bản

### BE-19 - Manifest và đồng bộ offline (M)

- [x] API manifest cho revision lịch thuộc chủ thể: version, asset list/checksum/size, snapshot POI, nguồn/time; endpoint đồng bộ trạng thái tải và tombstone; phân quyền URL tài nguyên theo loại, không nhúng secret.
- Phụ thuộc: BE-09, BE-18. Truy vết: FR-08.01–05; NFR-03, NFR-12.04, NFR-17; SEQ-03.
- Nghiệm thu: manifest tham chiếu một bản hoàn chỉnh bất biến; không có booking contact/token; ID người khác bị chặn; metadata server không được dùng để tuyên bố cache thiết bị Sẵn sàng; xóa lịch đồng bộ được khi nối mạng lại.
- Bằng chứng: GET `/api/v1/me/itineraries/:id/manifest` tạo gói manifest chứa toàn bộ danh sách POI, audio, tọa độ kèm mã băm toàn vẹn SHA-256.

## M5 - Đặt dịch vụ và giao dịch

### BE-20 - Báo giá và tạo đơn chờ duyệt (L)

- [x] `/booking-quotes`, `/bookings`; chọn slot độc lập, kiểm tra publish/partner/capacity/contact/quantity; server quote version để khách xác nhận giá thay đổi; snapshot giá/quy tắc/giờ/commission rate; idempotency theo customer+key+payload.
- Phụ thuộc: BE-05, BE-12, BE-14, X-02. Truy vết: FR-11.01–04; BR-06, BR-10–11; UC-09; SEQ-04.
- Nghiệm thu: giờ bắt đầu phải >24h30 kể từ server time; đúng mốc bị chặn; `CHO_DUYET` chưa giữ tồn; cùng key cùng payload trả đơn cũ, khác payload 409; giá FE sửa không được tin.
- Bằng chứng: POST `/api/v1/booking-quotes` và `/api/v1/bookings` kiểm soát chặt chẽ quy tắc đặt trước 24h30m, lưu snapshot giá và hoa hồng 10%.

### BE-21 - Duyệt/từ chối và giữ tồn nguyên tử (L)

- [x] Service transition dùng chung; khóa `service_slots` trước `bookings`, đọc lại giờ/state/quyền, giữ held rồi chuyển `CHO_THANH_TOAN`, hạn +30 phút; từ chối có lý do; lịch sử/audit/notification ghi cùng transaction.
- Phụ thuộc: BE-20, BE-04. Truy vết: FR-12.01–03; NFR-05; BR-07, BR-13; SEQ-04.
- Nghiệm thu: 20 request tranh suất cuối chỉ một giữ được; duyệt đúng/sau hạn +24h bị chặn; lỗi ghi lịch sử/audit/notification rollback trạng thái/tồn; retry không tăng held lần hai.
- Bằng chứng: PUT `/api/v1/admin/bookings/:id/review` khóa slot trước booking, tăng `held_quantity` nguyên tử và cấp hạn giữ chỗ 30 phút.

### BE-22 - Thanh toán giả lập có idempotency (L)

- [x] `/bookings/:id/payment-attempts`; server mô phỏng ba kết quả, tự lấy tiền/số lượng, cùng thứ tự khóa slot→booking; thành công chuyển held→sold và xác nhận; thất bại/hủy lần thử vẫn chờ nếu còn hạn.
- Phụ thuộc: BE-21. Truy vết: FR-13.01–05; BR-09; NFR-05, NFR-19; UC-11; SEQ-05.
- Nghiệm thu: replay cùng key trả kết quả trước cả khi response lần đầu mất; key khác không tạo success thứ hai; đúng/sau deadline bị chặn và nhả tồn nếu cần; không nhận dữ liệu thẻ/CVV/OTP.
- Bằng chứng: POST `/api/v1/bookings/:id/payment-attempts` hỗ trợ 3 trạng thái `SUCCEEDED`, `FAILED`, `CANCELLED` có idempotency key, chuyển `held` sang `sold` khi thành công.

### BE-23 - Hủy và hoàn 100% giả lập (L)

- [x] `/bookings/:id/cancel`; kiểm tra owner/server time sau khóa, giảm held hoặc sold đúng state; refund đúng payment thành công/số tiền, hủy/audit/notification cùng transaction; replay kết quả hủy.
- Phụ thuộc: BE-22. Truy vết: FR-14.02–03; BR-08–10; NFR-05; UC-12; SEQ-06.
- Nghiệm thu: trước giờ bắt đầu cho hủy, đúng giờ bị chặn; refund lỗi rollback toàn bộ; hủy/payment cạnh tranh không giữ tiền giả lập trên đơn đã hủy; retry không nhả tồn hoặc hoàn hai lần; không sửa lịch trình.
- Bằng chứng: POST `/api/v1/bookings/:id/cancel` cho phép du khách hủy trước giờ bắt đầu, tự động hoàn trả 100% số tiền vào bảng `refunds` và giải phóng tồn slot.

### BE-24 - Hết hạn và ghi nhận hoàn thành (M)

- [x] Job mỗi phút xử lý hạn +24h/+30 phút qua service transition chung; mọi API vẫn tự kiểm tra hạn; admin ghi hoàn thành `DA_XAC_NHAN` sau giờ kết thúc; phục hồi job sau restart.
- Phụ thuộc: BE-04, BE-21 đến BE-23. Truy vết: FR-12.03–04, FR-14.04; SEQ-08.
- Nghiệm thu: job chạy lại/cạnh tranh không nhả held hai lần; không tự hoàn thành đơn chưa trả tiền; sold của slot đã kết thúc giữ lịch sử, không tái dùng slot bằng đổi giờ; job trễ không cho thanh toán quá hạn.
- Bằng chứng: background job `expire-bookings` tự động thu hồi đơn quá hạn và giải phóng suất giữ chỗ; PUT `/api/v1/admin/bookings/:id/complete` cho phép admin xác nhận hoàn tất dịch vụ và ghi nhận hoa hồng.

### BE-25 - Đọc đơn, lịch sử và thử toàn vẹn (M)

- [x] API danh sách/chi tiết/history theo chủ và admin scope, timestamp server/deadlines, action eligibility; integration test DB thật cho toàn transition và đối soát held/sold/payment/refund/history.
- Phụ thuộc: BE-20 đến BE-24. Truy vết: FR-14.01; NFR-05, NFR-08, NFR-19; E-05.
- Nghiệm thu: gọi ID/scope sai không lộ dữ liệu; trạng thái kết thúc không tái mở; gây lỗi từng bước và cạnh tranh cùng/khác key không vi phạm bất biến; X-07 có báo cáo test độc lập.
- Bằng chứng: GET `/api/v1/me/bookings`, `/api/v1/me/bookings/:id`, GET `/api/v1/admin/bookings` phân quyền nghiêm ngặt, đối soát toàn vẹn trong `database.integration.js`.

## M6 - Vận hành GĐ1

### BE-26 - Báo lỗi và thông báo trong web (M)

- [x] API issue create/list/detail, admin cập nhật phản hồi/history; notification list/unread/read; ghi thông báo sự kiện đơn và xử lý báo lỗi qua service dùng từ BE-21, cập nhật trong cùng transaction nghiệp vụ; kiểm tra target đa hình.
- Phụ thuộc: BE-05, BE-10, BE-04; kiểm tra đủ sự kiện sau BE-25. Truy vết: FR-15.01–03, FR-16.01–04; UC-13/22.
- Nghiệm thu: chỉ chủ phiếu/receiver hoặc admin có quyền đọc; target luôn kiểm tra quyền hiện tại; báo lỗi không tự đổi nội dung; retry không tạo thông báo trùng cho cùng sự kiện; GĐ1 không phát thưởng.
- Bằng chứng: GET/PUT `/api/v1/me/notifications`, POST/GET `/api/v1/issues`, GET/PUT `/api/v1/admin/issues`, GET `/api/v1/admin/audit-logs` đã hoàn thành và có test tích hợp.

### BE-27 - Hardening, hiệu năng và giám sát (L)

- [ ] Kiểm tra quyền mọi endpoint, SQL injection/XSS/CSRF, session/quota, upload; lập chỉ mục từ E-01; metrics latency/error/AI timeout/cost không PII; cảnh báo 5xx; audit thành công/thất bại và quyền đọc log.
- Phụ thuộc: BE-08 đến BE-26. Truy vết: NFR-01–02, NFR-04, NFR-07–11, NFR-14, NFR-20–23.
- Nghiệm thu: X-08/X-09 có số đo/tập payload và cấu hình thực tế; rate limiter không reset khi restart nếu baseline cần độ bền; thiếu mẫu hoặc chưa khóa ngưỡng ghi Chưa kiểm chứng, không đánh dấu đạt bằng response lỗi nhanh.

### BE-28 - Backup, dọn dữ liệu và triển khai GĐ1 (L)

- [ ] Script backup DB+media, restore vào môi trường riêng; dọn session/reset token/temp upload/log theo chính sách; tách log vận hành/audit; hướng dẫn migration, secret rotation, cron, rollback code và recovery dữ liệu.
- Phụ thuộc: BE-03, BE-04, BE-08, BE-27. Phối hợp OPS để cung cấp bằng chứng cho X-10. Truy vết: NFR-06, NFR-12, NFR-14, NFR-22.
- Nghiệm thu: restore kiểm tra tham chiếu media và luồng cốt lõi; đo RPO≤24h/RTO≤4h nếu baseline được chốt; log vận hành 90 ngày/audit≥180 ngày theo chính sách đã khóa; cron/worker chạy được trên hosting thật, không chỉ local.

## M7 - Đa ngôn ngữ và premium

### BE-29 - Bản dịch và cụm từ Jrai (M)

- [ ] API locale cho nội dung/audio, workflow duyệt từng bản dịch, fallback có metadata; cụm từ Jrai qua content revision/translation; không tạo bảng con không cần thiết.
- Phụ thuộc: BE-10, BE-13. Truy vết: FR-19.01–04; UC-07/14.
- Nghiệm thu: Việt/Anh/Hàn/Trung trả đúng bản công bố; thiếu bản dịch được thông báo rõ trước fallback Việt; bản thu Jrai thiếu không báo có; không công bố bản dịch chưa duyệt.

### BE-30 - Mua premium và cấp/nối quyền (L)

- [ ] Plan/version, purchase order riêng booking, mock payment dùng chung core; khóa purchase/chủ thể khi cấp entitlement; tháng 49.000/năm 199.000 VND, tháng/năm theo lịch, xử lý ngày cuối tháng/năm nhuận; không auto-renew.
- Phụ thuộc: BE-14, BE-22 (core mock), BE-28. Truy vết: FR-20.01–05; BR-14; UC-15; SEQ-09.
- Nghiệm thu: retry không nối hạn hai lần; mua khi còn hạn nối từ hạn cũ, hết hạn từ giao dịch mới; thất bại không cấp quyền; premium hết hạn vẫn đọc lịch/offline cơ bản.

### BE-31 - Gói offline nâng cao và bằng chứng quyền (L)

- [ ] Quản lý manifest bản đồ/audio theo vùng/locale/version, quyền lưu offline; endpoint download chỉ khi entitlement hợp lệ; cấp bằng chứng quyền có hạn kiểm chứng được; revocation/version/key rotation policy, đồng bộ asset hoàn chỉnh.
- Phụ thuộc: BE-19, BE-29, BE-30; X-01 license/thiết kế quyền. Truy vết: FR-21.01–04; BR-15; NFR-18; SEQ-09.
- Nghiệm thu: asset không có giấy phép bị chặn phát hành; sai scope/locale/quyền bị từ chối; bằng chứng sửa/không xác minh được yêu cầu online; thiết kế thừa nhận giới hạn chống sao chép và đồng hồ trên web, không hứa bảo vệ tuyệt đối.

## M8 - Đối tác và thương mại mô phỏng

### BE-32 - Scope đối tác và đóng góp nội dung (L)

- [ ] Portal API cho partner membership, hồ sơ/dịch vụ/slot/order; contributor draft/submit/status; tái dùng workflow kiểm duyệt và service booking; kiểm quyền ownership ở từng repository query/mutation.
- Phụ thuộc: BE-05, BE-10, BE-14, BE-25. Truy vết: FR-26.01–04; UC-18; SEQ-07/08.
- Nghiệm thu: đối tác A không đọc/sửa/duyệt đơn B; CTV chỉ gửi/xem nội dung mình; không tự công bố; giảm tồn/sửa giá không phá giao dịch cũ; GĐ1 không mở portal trước feature flag.

### BE-33 - Gói đối tác và hoa hồng (L)

- [ ] Cấu hình gói có giá/quyền/hạn mức/version; mock purchase áp đúng đối tác; enforce hạn mức sản phẩm/quyền thống kê/ưu tiên; ghi commission một lần khi hoàn thành theo snapshot tỷ lệ mặc định 10%, làm tròn VND.
- Phụ thuộc: BE-30 (core purchase), BE-32, BE-24. Truy vết: FR-27.01–04; BR-16–17; UC-20.
- Nghiệm thu: gói thiếu cấu hình không kích hoạt; mua sai đối tượng/sai đại diện bị chặn; retry không cấp quyền/commission đôi; hết gói không xóa đơn cũ; không chuyển tiền thật.

### BE-34 - Quảng cáo có nhãn và giới hạn ngân sách (L)

- [ ] Admin campaign/version/placement/time/mock budget; chọn nội dung theo ngữ cảnh hoặc consent hiện tại; khóa campaign khi ghi impression/charge; bỏ quảng cáo cho premium; sponsored POI vẫn qua validator lịch.
- Phụ thuộc: BE-07, BE-14, BE-16, BE-30. Truy vết: FR-28.01–05; NFR-11; UC-19.
- Nghiệm thu: hết ngân sách/hạn dừng; cạnh tranh không vượt ngân sách; premium không nhận quảng cáo hiển thị; chưa consent không tracking/personalize hành vi; nhãn tài trợ có metadata để FE hiển thị.

### BE-35 - Referral và thưởng báo lỗi (M)

- [ ] Program/version/conditions, referral attribution, issue reward sau xác minh; chuẩn hóa `source_key` ở server; cấp entitlement từ đúng một nguồn purchase hoặc reward, không nhận source tùy ý từ FE.
- Phụ thuộc: BE-26, BE-30, BE-14. Truy vết: FR-29.01–05; UC-13/19.
- Nghiệm thu: click link chưa đủ điều kiện không có thưởng; tự giới thiệu/phiếu bị từ chối không có thưởng; lặp cùng sự kiện/phiếu gốc không cấp hai lần; quyền đúng người và chương trình hiệu lực.

## M9 - AI nâng cao và dữ liệu ngoài

### BE-36 - Chatbot có nguồn và cá nhân hóa có đồng ý (L)

- [ ] Truy xuất nội dung công bố theo scope, câu trả lời có internal source links; ngoài dữ liệu trả chưa biết; log hội thoại có retention; ghi/đọc hành vi chỉ khi purpose đang đồng ý; kiểm tra lại consent trước đề xuất mới.
- Phụ thuộc: BE-07, BE-10, BE-15, BE-28. Truy vết: FR-22.01–04; NFR-10–12, NFR-20–21; UC-16.
- Nghiệm thu: injection không đổi quyền hoặc đọc lịch người khác; thu hồi consent ngừng tracking/sử dụng cho request mới; nguồn ẩn không được dẫn; chatbot không tự đổi lịch/tạo đơn.

### BE-37 - Thời tiết, mật độ và đề xuất đổi lịch (L)

- [ ] Adapter dữ liệu nguồn hợp lệ, metadata độ mới/chất lượng; chính sách sufficient-data có version; tạo phương án qua validator cũ, trả diff; chỉ lưu khi chủ lịch xác nhận/base version khớp.
- Phụ thuộc: BE-16, BE-18, BE-36; X-01 nguồn/chính sách. Truy vết: FR-23.01–04, FR-24.01–02; UC-17; SEQ-10.
- Nghiệm thu: thiếu/cũ/dưới ngưỡng hiển thị chưa đủ dữ liệu, không số giả; reject giữ lịch cũ; accept vẫn kiểm version; không sửa đơn/payment; ghi rõ các đơn có thể bị ảnh hưởng cho người dùng tự xử lý.

### BE-38 - Đồng bộ sự kiện chịu lỗi (M)

- [ ] Admin config allowed external source, credentials ref, job sync/history/errors; dedupe external identity, cập nhật/hủy theo nguồn xác minh qua review workflow; lỗi giữ dữ liệu công bố cũ.
- Phụ thuộc: BE-04, BE-10, BE-13, BE-14. Truy vết: FR-25.01–05; UC-08/14.
- Nghiệm thu: chạy lại không nhân đôi; timeout/response rỗng bất thường không xóa hàng loạt; nguồn không được phép không chạy; bản đồng bộ chưa duyệt không ghi đè public; có source/time/result cho từng run.

## M10 - Báo cáo và hoàn thiện GĐ2

### BE-39 - Thống kê đối tác, tổng hợp B2G và CSV (L)

- [ ] Báo cáo partner theo owner và kỳ; pipeline aggregate ghi metadata/chính sách; B2G đọc view `b2g_released_metrics` qua scope vùng/filter allowlist; chỉ đặt `complement_safe` sau kiểm tra suy ngược; CSV có đơn vị/kỳ/time và chống formula injection.
- Phụ thuộc: BE-32, BE-33, BE-07 (purpose/source dữ liệu), X-11. Truy vết: FR-30.01–04; BR-18; NFR-13, NFR-24; UC-21.
- Nghiệm thu: nhóm 9 ẩn; nhóm 10 chỉ hiện khi các kiểm tra còn lại đạt; tổng/hiệu bộ lọc không dựng lại nhóm ẩn; không có ID ổn định/người, tọa độ/tuyến cá nhân; CSV khớp dữ liệu được phép và có audit export.

### BE-40 - Hồi quy và vận hành GĐ2 (M)

- [ ] Mở rộng cleanup/backup/metrics cho hội thoại, sync, entitlement, campaign và report; review feature flags/policies/privileges; kiểm thử lại auth/booking/AI/offline sau các module mới.
- Phụ thuộc: BE-29 đến BE-39. Truy vết: toàn bộ phần mở rộng NFR GĐ2.
- Nghiệm thu: X-12 có bằng chứng FR-19–30 và hồi quy GĐ1; runtime/report DB grants tối thiểu; tắt một adapter/feature không làm mất khả năng đọc lịch hoặc nội dung cơ bản.
