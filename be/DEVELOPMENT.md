# Phát triển backend

Runtime: Node.js 20.20.2, Express 5, ES modules. Tại thư mục gốc chạy `npm ci`;
tạo `be/.env` theo `be/.env.example` nếu chưa có, sau đó `npm run dev:be`.
Không copy đè `.env` đã được cấu hình. Không commit thông tin truy cập CSDL.

## Cấu trúc

```text
src/config/       Kiểm tra env, logger có che bí mật
src/middleware/   Request ID, validation error, error handler
src/routes/       Mount module API
src/modules/      Module nghiệp vụ, hiện có health
src/shared/       AppError, validation, pagination, GUID và tiền VND
src/db/           Pool UTC, truy vấn tham số hóa, transaction
scripts/          Lệnh vận hành, kiểm tra DB chỉ đọc
test/             Test node:test, không gọi hosting trong bộ test mặc định
migrations/       Hướng dẫn baseline; chưa có migration runner
openapi.yaml      Contract endpoint đã triển khai
```

Route gọi controller; service chứa nghiệp vụ/transaction; repository chứa SQL
tham số hóa. Chỉ thêm module khi triển khai chức năng tương ứng, xem
[backlog](../docs/implementation/backend-tasks.md) và [quy ước module](src/modules/README.md).

## HTTP contract

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
Phần auth/CSRF/session, audit nghiệp vụ, migration runner và chức năng FR vẫn
triển khai theo backlog; scaffold không mở CRUD mẫu hay tự import CSDL.
