# Migration baseline

`../schema.sql` khởi tạo một lần trên DB mới. Scaffold không tự import schema khi
start và không tự sửa CSDL hosting. `npm run db:check -w be` kiểm tra kết nối và
danh sách bảng/view, không đối chiếu cột/index/constraint.

Trước migration đầu tiên: đối chiếu schema thực tế, backup DB+media; bổ sung
runner có sổ version/checksum, lock và tài khoản DDL riêng theo BE-03; ghi nhận
baseline hiện có thay vì import lại; thử trên bản sao riêng và ghi cách phục hồi.

Chưa có migration runner tự động. BE-03 chưa hoàn thành chỉ vì có scaffold.

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
