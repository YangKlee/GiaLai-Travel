# Module nghiệp vụ

Đã triển khai `health`: liveness và readiness CSDL. Thêm module theo backlog
`docs/implementation/backend-tasks.md`: auth/users/privacy, content/media/catalog/events,
itineraries/ai/offline, bookings/payments, notifications/issues/admin rồi GĐ2.

Mỗi module khi có chức năng thật gồm route/schema/controller/service/repository
theo nhu cầu. Route khai báo method/path và middleware; controller chuyển HTTP;
service kiểm quyền, nghiệp vụ và transaction; repository chỉ chứa SQL tham số hóa;
schema dùng Zod. Repository nhận transaction executor khi ghi nhiều bảng.

Không mở CRUD rỗng hoặc trả dữ liệu mẫu như tính năng đã hoàn thành. Đơn/tồn khóa
slot trước booking; không giữ transaction khi gọi AI/API ngoài. Không tạo pool
riêng cho từng module. Secret luôn ở BE.
