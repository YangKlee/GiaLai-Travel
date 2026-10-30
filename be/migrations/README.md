# Migration baseline và runner

Đã có runner với named lock theo database, SHA-256 của nguồn và sổ
`schema_migrations` (ngoài 59 bảng ứng dụng). Không chạy migration khi start API.
`RUNNING`/`FAILED`, checksum thay đổi hoặc version không nhận diện sẽ chặn chạy tiếp;
DDL có thể đã commit một phần, phải restore hoặc đối chiếu thủ công trong maintenance.

Chạy từ thư mục gốc, kết nối DB qua `be/.env`. Lệnh ghi bắt buộc có
`MIGRATION_DB_USER` và `MIGRATION_DB_PASSWORD` cho tài khoản DDL riêng:

```powershell
npm run db:migrate -w be -- status
npm run db:migrate -w be -- init
npm run db:migrate -w be -- baseline current
npm run db:migrate -w be -- baseline legacy-guid
npm run db:migrate -w be -- up
```

Chọn **một** cách khởi đầu: `init` chỉ cho DB rỗng; DB đã import schema mới dùng
`baseline current`; DB GUID 58 bảng cũ dùng `baseline legacy-guid` rồi `up`.
Baseline kiểm inventory bảng, view báo cáo và cấu trúc auth/generated quan trọng;
không thay thế việc diff đầy đủ schema đã tùy biến. `up` chạy lặp không áp lại migration.
Không tự reset sổ hoặc chạy lại DDL sau lỗi. Runtime dùng Sequelize models; SQL
schema/migration và kiểm tra metadata phục vụ nâng cấp được quản lý riêng.

`../schema.sql` khởi tạo một lần trên DB mới. Scaffold không tự import schema khi
start và không tự sửa CSDL hosting. `npm run db:check -w be` kiểm tra kết nối và
danh sách bảng/view, không đối chiếu cột/index/constraint.

Trước migration đầu tiên: đối chiếu schema thực tế, backup DB+media; bổ sung
runner có sổ version/checksum, lock và tài khoản DDL riêng theo BE-03; ghi nhận
baseline hiện có thay vì import lại; thử trên bản sao riêng và ghi cách phục hồi.

Runner đã kiểm trên MariaDB 10.5.26 local: DB rỗng, baseline hiện tại, nâng baseline
GUID cũ, thu hồi phiên, chạy lặp, checksum sai, trạng thái gián đoạn và khóa đồng thời.
Backup/restore hosting và quyền DDL/runtime thực tế vẫn cần nghiệm thu môi trường triển khai.

## 001 - JWT và refresh token

`001-jwt-auth.sql` nâng baseline GUID 58 bảng lên 59 bảng theo D-22:
tạo `auth_refresh_tokens`, thu hồi mọi phiên cũ và bỏ `auth_sessions.token_hash`.
DB mới import schema hiện tại thì không chạy migration này.

Trước khi chạy: backup có kiểm chứng restore; đối chiếu `SHOW CREATE TABLE
auth_sessions` với baseline cũ (có `token_hash BINARY(32) NOT NULL UNIQUE`, GUID),
xác nhận chưa có `auth_refresh_tokens`; dừng ứng dụng/job ghi auth trong maintenance.
Thử trên bản sao MariaDB 10.5.26 trước, dùng tài khoản DDL riêng và ghi version/checksum.
Migration không chuyển đổi token cũ sang JWT; người dùng phải đăng nhập lại.

DDL tự commit, file chỉ chạy một lần. Nếu lỗi giữa chừng, kiểm tra bước đã hoàn
thành thay vì chạy lại nguyên file; giữ maintenance đến khi schema nhất quán.
Sau chạy kiểm đủ 59 bảng, FK session, unique hash, CHECK expiry/used_at, và không
còn cột token_hash trong auth_sessions; thử login/refresh/replay/logout khi BE-05 có.
Rollback bằng bản backup đã kiểm restore trong maintenance cùng phiên bản code
tương ứng; không tái kích hoạt token cũ hay chạy lệnh xóa bảng tự động để rollback.
Chưa thực thi migration trên hosting; kết nối hiện bị ETIMEDOUT.
