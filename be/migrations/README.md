# Migration baseline

`../schema.sql` khởi tạo một lần trên DB mới. Scaffold không tự import schema khi
start và không tự sửa CSDL hosting. `npm run db:check -w be` kiểm tra kết nối và
danh sách bảng/view, không đối chiếu cột/index/constraint.

Trước migration đầu tiên: đối chiếu schema thực tế, backup DB+media; bổ sung
runner có sổ version/checksum, lock và tài khoản DDL riêng theo BE-03; ghi nhận
baseline hiện có thay vì import lại; thử trên bản sao riêng và ghi cách phục hồi.

Chưa có migration runner tự động. BE-03 chưa hoàn thành chỉ vì có scaffold.
