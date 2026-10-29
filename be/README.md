# Cơ sở dữ liệu GiaLaiGo

## 1. Tệp và điều kiện

- [schema.sql](schema.sql): cấu trúc MySQL cho cả GĐ1 và GĐ2, gồm 58 bảng và một view báo cáo B2G.
- [Class diagram](../docs/srs/07-class-diagram.md): các lớp miền nghiệp vụ và ánh xạ sang từng bảng.
- Môi trường hosting đã xác nhận: **MariaDB 10.5.26**. Schema dùng `utf8mb4_unicode_ci`, InnoDB và cú pháp dùng chung với MySQL 8.0.16+. Không dùng collation `utf8mb4_0900_*`.
- Trên MariaDB, kiểu JSON là alias của LONGTEXT và có kiểm tra JSON hợp lệ theo [tài liệu MariaDB](https://mariadb.com/docs/server/reference/data-types/string-data-types/json). Việc sửa collation không đồng nghĩa tương thích MySQL 5.7, nơi các CHECK trong file không được thực thi đầy đủ.
- Tạo CSDL và cấp quyền qua cPanel trước khi import. Tài khoản chạy DDL cần quyền tạo bảng, index, khóa ngoại và view trong CSDL đó; file không tự tạo hoặc đổi CSDL.
- File khởi tạo dùng một lần trên CSDL mới; không phải migration chạy lặp. Không có lệnh xóa bảng, xóa CSDL hoặc tắt kiểm tra khóa ngoại. MySQL tự commit DDL, vì vậy lỗi giữa chừng không rollback toàn bộ cấu trúc.

Thư mục backend hiện có tên `be` trong repository; `schema.sql` được đặt tại đây theo yêu cầu. Chưa chọn framework hoặc ORM.

## 2. Cách chạy

PowerShell, sau khi có MySQL client trong PATH:

```powershell
mysql --host=127.0.0.1 --port=3306 --user=TEN_USER --password --default-character-set=utf8mb4 --database=TEN_DATABASE --execute="SOURCE D:/GiaLai-Travel/be/schema.sql"
```

Điều chỉnh đường dẫn, user và tên database theo môi trường của bạn. Client sẽ hỏi mật khẩu; không ghi mật khẩu vào file hoặc command.

Trên hosting cPanel/phpMyAdmin:

1. Tạo database và user trong cPanel, cấp quyền cho user trên database đó. Tên thực tế có thể có tiền tố tài khoản, ví dụ `taikhoan_gialaigo`.
2. Mở phpMyAdmin, chọn đúng database **rỗng** ở cột bên trái.
3. Chọn Import/Nhập, tải `schema.sql` bản mới và thực thi. File sử dụng database đã chọn, không có `CREATE DATABASE` hoặc `USE gialaigo`.
4. Không import lại vào một database đã có một phần bảng; nếu lần trước đã chạy tới các lệnh CREATE TABLE, kiểm tra cấu trúc hiện có trước khi xử lý tiếp. Không xóa dữ liệu thật để thử import.

Với lỗi `#1273` dừng ngay tại lệnh `SET NAMES` đầu file, lần import đó chưa thực hiện lệnh tạo bảng nào. Hãy tải lại file đã sửa trước khi import.

Kiểm tra cấu trúc sau khởi tạo:

```sql
SELECT VERSION();
SELECT COUNT(*) AS table_count
FROM information_schema.tables
WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE';

SELECT table_name
FROM information_schema.views
WHERE table_schema = DATABASE();
```

Kết quả mong đợi: 58 bảng và view `b2g_released_metrics`. Khởi tạo không tạo user đăng nhập ứng dụng, không có mật khẩu mặc định, không có dữ liệu du khách/địa điểm giả. Chỉ seed vai trò, tham số đã thống nhất và giá premium. Gói đối tác để chưa kích hoạt cho tới khi có cấu hình thương mại.

## 3. Quy ước dữ liệu

| Quy ước | Cách dùng |
| --- | --- |
| Thời gian | `DATETIME(6)` lưu UTC; mỗi kết nối backend đặt `SET time_zone = '+00:00'`. Chỉ chuyển sang Asia/Ho_Chi_Minh khi trình bày. Giờ mở cửa địa điểm là TIME theo giờ Việt Nam. |
| Tiền | Số nguyên VND bằng `BIGINT UNSIGNED`; chi phí nhà cung cấp AI có thể dùng phần lẻ trong số liệu nội bộ. Không dùng FLOAT cho tiền. |
| Mã trạng thái | Booking giữ tên trạng thái trong SRS; các miền khác có ENUM riêng, không dùng lẫn trạng thái. |
| JSON | Dùng cho snapshot, cấu hình, manifest và dữ liệu nhà cung cấp. Quan hệ cốt lõi, số lượng, tiền và thời gian có cột riêng để kiểm tra. |
| Bí mật | Chỉ lưu hash token; mật khẩu đã băm bằng thuật toán phù hợp. Khóa API thật ở secret store; `api_secret_ref` chỉ là tham chiếu. |
| Email duy nhất | `email_key` là cột sinh `LOWER(TRIM(email))` dùng collation binary và UNIQUE. Không phân biệt hoa/thường khi đăng ký, đồng thời không gộp chữ có dấu với chữ không dấu. Backend không tự ghi cột sinh. |
| JSON trên MariaDB | MariaDB lưu kiểu JSON dưới dạng LONGTEXT có kiểm tra hợp lệ; ứng dụng phải kiểm tra schema dữ liệu, không dựa vào định dạng nhị phân JSON riêng của MySQL. |
| Phiên bản | Revision nội dung/lịch đã dùng phải bất biến; kiểm soát cập nhật qua tầng nghiệp vụ và quyền CSDL. |
| Xóa dữ liệu | Các FK mặc định RESTRICT, không xóa dây chuyền giao dịch. Backend xử lý ẩn/xóa mềm, thu hồi, ẩn danh và dọn dữ liệu theo chính sách. |
| GĐ2 | Bảng có sẵn không có nghĩa tính năng đã được bật. Việc mở tính năng và quyền theo giai đoạn nằm ở ứng dụng. |

## 4. Hợp đồng giao dịch cần triển khai trong backend

Schema không chứa stored procedure/trigger thực thi state machine. Không được dùng các lệnh UPDATE đơn lẻ ngoài giao dịch để mô phỏng các luồng dưới đây.

### 4.1. Thứ tự khóa chung

Với mọi thao tác ảnh hưởng đơn và tồn: xác định slot của đơn, bắt đầu transaction, khóa dòng `service_slots` bằng `SELECT ... FOR UPDATE`, sau đó khóa dòng `bookings`. Đọc lại và kiểm tra trạng thái sau khi khóa. Các luồng dùng cùng thứ tự khóa; deadlock/lock timeout phải rollback và thử lại có giới hạn với cùng khóa chống lặp.

Lấy giờ máy chủ sau khi có khóa để so thời hạn. Không tin đồng hồ trình duyệt. Không giữ transaction đang mở trong lúc chờ AI hoặc nhà cung cấp bên ngoài.

### 4.2. Tạo và duyệt đơn

1. Tạo đơn: kiểm tra tài khoản, dịch vụ công bố/đối tác hoạt động, slot còn phục vụ, số lượng và liên hệ. Giờ dùng phải cách lúc gửi hơn tổng thời gian duyệt + thanh toán mặc định 24h30. Chụp giá/quy tắc/giờ từ máy chủ; tạo `CHO_DUYET`, chưa tăng held.
2. Duyệt: khóa theo thứ tự chung; kiểm tra quyền, trạng thái và hạn duyệt; bảo đảm slot và dịch vụ không đổi. Tăng `held_quantity` khi `held_quantity + sold_quantity + quantity <= capacity`.
3. Trong cùng transaction, chuyển `CHO_THANH_TOAN`, đặt hạn +30 phút từ lúc duyệt, ghi lịch sử, audit và thông báo. Thiếu tồn không được chuyển trạng thái.
4. Từ chối lưu lý do, người duyệt và thời gian; hết hạn duyệt chuyển `HET_HAN`, không tự giữ tồn.

Khóa UNIQUE `(customer_id, idempotency_key)` chống tạo đơn trùng. Khi khóa đã tồn tại phải kiểm tra cùng payload; cùng khóa nhưng khác yêu cầu trả xung đột, không trả kết quả của một thao tác khác.

### 4.3. Thanh toán giả lập

1. Kiểm tra chủ đơn; khóa slot rồi đơn; nếu khóa idempotency đã có thì đối chiếu chủ thể/đích/payload rồi trả kết quả cũ.
2. Chỉ nhận `CHO_THANH_TOAN` còn hạn; số tiền lấy từ `bookings.total_vnd`.
3. Thành công: thêm `payment_attempts`, giảm held và tăng sold đúng số lượng, chuyển `DA_XAC_NHAN`, ghi lịch sử/audit/thông báo trong cùng transaction.
4. Thất bại hoặc hủy lần thử: ghi lần thử, giữ trạng thái chờ khi đơn còn hạn. Hết hạn phải kết thúc đơn và nhả held; không xác nhận giao dịch đến muộn.
5. UNIQUE trên cột sinh chỉ chặn lần thành công thứ hai; backend vẫn phải xác minh số tiền, trạng thái và quyền.

`payment_attempts` dùng cho cả đơn dịch vụ và đơn mua gói; CHECK yêu cầu đúng một đích. Không nhận thông tin thẻ/CVV/OTP và không gọi ngân hàng.

### 4.4. Hủy, hết hạn và hoàn thành

- Hủy trước giờ bắt đầu: khóa slot/đơn, kiểm tra lại state và giờ; giảm held nếu chờ trả tiền, giảm sold nếu đã trả. Nếu có payment thành công, tạo refund mock đúng 100% số đã trả và chuyển `DA_HUY` trong cùng transaction. Lỗi bất kỳ bước nào phải rollback toàn bộ.
- Tác vụ hết hạn đề xuất chạy mỗi phút, nhưng mọi API vẫn tự kiểm tra hạn. Tác vụ chỉ nhả held của đơn còn ở `CHO_THANH_TOAN`; không nhả lại khi đơn đã xử lý.
- Hoàn thành chỉ sau giờ kết thúc với đơn đã xác nhận; GĐ2 thêm `commissions` đúng một lần theo giá và tỷ lệ chụp. Sold giữ như lịch sử bán của slot đã kết thúc; slot không được tái sử dụng bằng cách đổi giờ.
- Hủy/hoàn không tự sửa lịch trình. Retry không tạo nhiều refund hoặc nhiều hoa hồng.

### 4.5. Mua gói, thưởng và quảng cáo

- Khóa đơn mua và chủ thể quyền khi cấp/nối hạn. Kiểm tra plan đúng đối tượng, version có giá, gói hoạt động và người mua được quyền đại diện đối tác. Ghi payment mock, trạng thái mua và entitlement cùng transaction.
- Một entitlement phải có đúng một nguồn: purchase thành công hoặc reward hợp lệ. FK không tự chứng minh người nhận là đúng người hay nguồn đã thành công; backend phải kiểm tra.
- Mua thêm nối từ hạn hiện tại nếu còn hiệu lực; xử lý tháng/năm theo BR-14, không tự gia hạn.
- Thưởng: `source_key` tính ở máy chủ theo sự kiện chuẩn hóa hoặc báo lỗi gốc đã xác minh. Kiểm tra người nhận và điều kiện trước khi ghi; UNIQUE chống cấp lại cùng sự kiện.
- Quảng cáo: khóa campaign khi ghi charge, cập nhật spent và impression trong cùng transaction; dừng khi hết hạn/ngân sách. Kiểm tra premium và consent trước hiển thị.

### 4.6. Kiểm duyệt, AI, offline và báo cáo

- Kiểm duyệt khóa content, xác minh kind/schema/source và trạng thái revision; cập nhật projection cùng con trỏ công bố trong một transaction. SQL chỉ bảo đảm con trỏ thuộc đúng đối tượng.
- Lưu lịch tạo revision/ngày/điểm/chặng rồi đổi con trỏ hiện tại bằng kiểm tra `lock_version`. Kiểm tra POI đúng revision, sự kiện đúng địa điểm, giờ/tuyến/ngân sách và sở hữu trước ghi.
- Asset audio, quyền lưu offline, manifest hoàn chỉnh và quyền premium phải kiểm tra trước công bố/tải. Trạng thái tải trên máy chủ là metadata đồng bộ, không chứng minh thiết bị hiện còn cache.
- Consent phải đúng chủ thể, đúng mục đích, là lựa chọn hiện tại và đang đồng ý. Việc rút đồng ý phải ngừng sử dụng hành vi cho đề xuất mới.
- B2G chỉ qua API áp scope vùng và view đã lọc; không cấp quyền đọc bảng hành vi, người dùng hoặc aggregate gốc. Ngưỡng 10 là mức sàn đề xuất; cờ `complement_safe` chỉ được bật sau kiểm tra suy ngược.

## 5. Quyền CSDL và vận hành

Tách tài khoản migration khỏi tài khoản chạy ứng dụng. Khi triển khai, cấp quyền tối thiểu theo vai trò máy chủ; tài khoản ghi audit chỉ có quyền INSERT cần thiết, tài khoản báo cáo không có quyền đọc dữ liệu cá nhân. Schema không tạo tài khoản CSDL hoặc ghi mật khẩu triển khai.

NFR về sao lưu, thu hồi phiên, giới hạn đăng nhập/AI, thời hạn lưu dữ liệu và mã hóa đường truyền cần được triển khai ngoài DDL. Chạy schema thành công chưa đồng nghĩa toàn bộ SRS đã được thực hiện.

## 6. Kết quả kiểm tra thiết kế

Ngày 29/10/2026, schema đã được nạp thành công trên MySQL Community Server 8.0.46 trong môi trường tạm riêng: 58 bảng, 113 khóa ngoại, 71 CHECK và một view. Đã chạy đạt 35 ca kiểm tra dữ liệu, gồm email trùng, khóa ngoại sai, tồn vượt sức chứa, sai tổng tiền, thanh toán trùng/đích sai, hoàn lặp, con trỏ revision sai chủ, tuyến khác ngày, tự giới thiệu, gia hạn tự động và lọc báo cáo nhóm nhỏ. Dữ liệu thử đã rollback.

Sau khi xác nhận hosting dùng MariaDB, bản collation tương thích đã được nạp thành công trên **MariaDB 10.5.26** trong môi trường thử riêng: vẫn đủ 58 bảng, 113 khóa ngoại và một view. MariaDB ghi nhận 89 CHECK, gồm cả kiểm tra JSON do hệ quản trị sinh thêm. Đã chạy đạt 36 ca kiểm tra, bổ sung trường hợp email phân biệt có dấu/không dấu mà vẫn chặn trùng hoa/thường; toàn bộ fixture đã rollback. Đây là kiểm tra trên cùng phiên bản máy chủ với hosting, không phải thao tác trực tiếp trên database hosting.

Đã kiểm tra cú pháp 7 khối class diagram và ánh xạ đủ 58 bảng. Đây là kiểm tra DDL và bất biến dữ liệu, chưa phải kiểm thử tích hợp backend, phân quyền API, tải đồng thời hoặc toàn bộ NFR.
