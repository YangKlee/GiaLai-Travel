# Phát triển backend

Runtime: Node.js 20.20.2, Express 5, ES modules. Tại thư mục gốc chạy `npm ci`;
tạo `be/.env` theo `be/.env.example` nếu chưa có, sau đó `npm run dev:be`.
Không copy đè `.env` đã được cấu hình. Không commit thông tin truy cập CSDL.

MySQL local có thể dùng `DB_PASSWORD=` rỗng khi `NODE_ENV=development/test`
và `DB_HOST=localhost/127.0.0.1/::1`. Vẫn phải khai báo biến; production hoặc
host khác bắt buộc mật khẩu không rỗng. CLI scaffold báo `stage` để phân biệt
lỗi cấu hình, kết nối, metadata và ghi file.

## Cấu trúc

```text
src/config/       Kiểm tra env, logger có che bí mật
src/middleware/   Request ID, validation error, error handler
src/routes/       Mount module API
src/modules/      Module nghiệp vụ, hiện có health
src/shared/       AppError, validation, pagination, GUID và tiền VND
src/db/           Sequelize, scaffold models, pool UTC và transaction
scripts/          Lệnh vận hành, kiểm tra DB chỉ đọc
test/             Test node:test, không gọi hosting trong bộ test mặc định
migrations/       Hướng dẫn baseline; chưa có migration runner
openapi.yaml      Contract endpoint đã triển khai
```

Route gọi controller; service chứa nghiệp vụ/transaction; repository dùng Sequelize
models đã scaffold (`findOne`, `findAll`, `create`, `update`, associations). Không viết
SQL thủ công trong nghiệp vụ. Chỉ thêm module khi triển khai chức năng tương ứng, xem
[backlog](../docs/implementation/backend-tasks.md) và [quy ước module](src/modules/README.md).

## HTTP contract

- API khám phá: `GET /api/v1/catalog`, `/api/v1/places` và `/api/v1/places/:id`; bộ lọc, response và giới hạn theo [OpenAPI](openapi.yaml). Chỉ trả POI công bố, revision được duyệt và bản dịch tiếng Việt thuộc vùng giai đoạn 1; thiếu nội dung trả rỗng/404, lỗi DB trả 503. Chưa có API dịch vụ/slot hoặc ngoại lệ đóng cửa.
- Demo độc lập: tại gốc chạy `npm run dev:demo`. Server `be/demo/server.js` không kết nối DB, không load `.env`, không tự fallback từ server thật; response có `dataset: demo`. Dữ liệu mẫu không xác minh giờ, giá, tọa độ hoặc nguồn du lịch. Dùng `npm run dev` cho backend CSDL thật.

- `GET /api/health` và `/api/v1/health`: liveness, giữ response cũ tương thích FE.
- `GET /api/ready` và `/api/v1/ready`: 200 khi kết nối DB được, 503 khi chưa được.
  Readiness không chứng minh đủ schema hoặc đủ quyền nghiệp vụ.
- Lỗi: `{ error: { code, message, fields?, requestId } }`, request ID do máy chủ sinh.
- JSON sai: 400; quá 1 MB: 413; schema sai: 422; route không có: 404.
- Phân trang chuẩn: `page` từ 1, `pageSize` mặc định 20, tối đa 100. API danh sách
  khi được triển khai trả `data` và `meta: { page, pageSize, total, totalPages }`.
- GUID trả dạng string; tiền VND trả chuỗi số nguyên để giữ chính xác BIGINT.
  Các utility mới chưa được coi là module nghiệp vụ đã hoàn thành.

`CLIENT_ORIGIN` là một origin hoặc danh sách phân cách dấu phẩy, không có path.
`TRUST_PROXY_HOPS=0` mặc định; chỉ đổi số hop khi đã xác định reverse proxy.
Logger không ghi request body/query/header; lỗi SQL thô không được đưa vào log
HTTP. Production cần HTTPS tại reverse proxy và secret riêng theo môi trường.

## Kiểm tra

`npm test` chạy toàn bộ test BE. Dùng đúng Node.js 20.20.2 khi kiểm tra/phát triển.
Phần auth JWT/refresh/CSRF theo [thiết kế](../docs/implementation/auth-jwt.md), audit nghiệp vụ, migration runner và chức năng FR vẫn
triển khai theo backlog; scaffold không mở CRUD mẫu hay tự import CSDL.

## CSDL

`npm run db:check -w be` dùng Sequelize để kiểm tra kết nối, version, danh sách bảng/view
và đối chiếu tên bảng với scaffold models. Lệnh chỉ đọc; không tự import hoặc sửa DB.
`DB_SSL=true` bật xác minh TLS; `DB_SSL_CA` tùy chọn trỏ tới CA PEM khi hosting yêu cầu.

### Sinh Sequelize model từ DB hiện có

Đã thêm Sequelize và `sequelize-auto` để reverse engineer các bảng và quan hệ
từ metadata của DB. Chạy từ thư mục gốc với cấu hình `be/.env`:

```powershell
npm run db:scaffold -w be
```

Để dùng đúng cấu hình trong `be/.env.example`:

```powershell
node --env-file=be/.env.example be/scripts/scaffold-models.js
```

Model ES modules và `init-models.js` được sinh vào `be/src/db/models/`.
Lệnh chỉ đọc cấu trúc DB, không import `schema.sql`, không gọi `sync()` và
không sinh model cho view báo cáo. Nếu thư mục output đã có, lệnh dừng để
tránh ghi đè; hãy di chuyển bản cũ trước khi sinh lại. Runtime khởi tạo models qua
`init-models.js`; `prepare-generated-models.js` giữ bước chuẩn bị runtime sau mỗi lần scaffold.
Lệnh bỏ qua bảng sổ migration. Không gọi `sync()` hoặc `sync({ alter: true })`.

Một Sequelize instance quản lý pool UTF-8/UTC, `BIGINT`/`DECIMAL` dạng string và tắt
multiple statements. Models của từng instance có subclass riêng, không bị bind
nhầm khi mở nhiều database. Chuỗi default `CURRENT_TIMESTAMP(6)` từ scaffold được
chuyển thành biểu thức ORM UTC; các cột generated bị chặn ghi. Association sai do
scaffold khóa ngoại ghép được loại bỏ; ownership revision kiểm tra bằng association
và điều kiện ORM, đồng thời vẫn có ràng buộc DB.

Nghiệp vụ nhiều bảng dùng `database.transaction(async (transaction) => ...)`, truyền
`{ transaction }` vào model call. Sequelize transaction dùng REPEATABLE READ.
Deadlock/lock timeout chỉ retry khi gọi rõ `maxRetries` (0–3) và callback chỉ chứa
thao tác DB an toàn khi lặp. Mất phản hồi COMMIT có kết quả chưa xác định nên helper
không tự replay; module nghiệp vụ phải hòa giải bằng khóa idempotency.

Kiểm tra hosting hiện trả `ETIMEDOUT` trên cổng 3306 từ máy phát triển. Chưa xác
minh tài khoản, quyền truy cập hoặc schema thực tế. Cần phía hosting cho phép
Remote MySQL từ IP máy phát triển và xác nhận đúng host/port; nếu BE chạy cùng
hosting, dùng địa chỉ MySQL nội bộ do nhà cung cấp cấp. Không tự đổi sang localhost
trên máy phát triển. Readiness trả 503 trong lúc DB không kết nối được.
