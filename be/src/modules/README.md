# Module nghiệp vụ

Đã triển khai `health`: liveness và readiness CSDL. Thêm module theo backlog
`docs/implementation/backend-tasks.md`: auth/users/privacy, content/media/catalog/events,
itineraries/ai/offline, bookings/payments, notifications/issues/admin rồi GĐ2.

Mỗi module khi có chức năng thật gồm route/schema/controller/service/repository
theo nhu cầu. Route khai báo method/path và middleware; controller chuyển HTTP;
service kiểm quyền, nghiệp vụ và transaction; repository dùng Sequelize models
đã scaffold trong `src/db/models/`, associations và các toán tử ORM; schema dùng
Zod. Truyền Sequelize transaction vào mọi model call tham gia cùng giao dịch.
Không viết SQL thủ công trong module nghiệp vụ hoặc dùng `literal()` để ghép query.

Không mở CRUD rỗng hoặc trả dữ liệu mẫu như tính năng đã hoàn thành. Đơn/tồn khóa
slot trước booking; không giữ transaction khi gọi AI/API ngoài. Không tạo pool
riêng cho từng module. Secret luôn ở BE.
