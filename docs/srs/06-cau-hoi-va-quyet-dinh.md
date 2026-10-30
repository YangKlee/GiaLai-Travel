# Câu hỏi và sổ quyết định

**Ngày xác nhận:** 29/10/2026.<br>
**Nguồn quyết định:** câu trả lời của chủ sản phẩm trong cuộc trò chuyện.<br>
**Trạng thái:** đã giải quyết các câu hỏi ảnh hưởng đến phạm vi và luồng nghiệp vụ chính. Các ngưỡng kỹ thuật và cấu hình thương mại được phân biệt ở mục 3.

## 1. Quyết định đã thống nhất

| Mã | Điểm cần làm rõ từ PDF | Quyết định đã xác nhận | Tài liệu bị ảnh hưởng |
| --- | --- | --- | --- |
| D-01 | Toàn bộ tầm nhìn hay MVP? | Đặc tả toàn bộ tính năng trong PDF, chia giai đoạn chức năng để triển khai | Tệp 01, phạm vi GĐ1/GĐ2 |
| D-02 | Mobile hay web? | Chỉ triển khai web, dùng được trên điện thoại; không làm ứng dụng native trong phạm vi này | FR-01 đến FR-30, NFR-15 |
| D-03 | Thanh toán thật hay giả? | Mọi thanh toán/hoàn tiền/gói/hoa hồng đều mô phỏng, không thu/chuyển tiền thật | FR-13,14,20,27 |
| D-04 | Đặt tức thời hay chờ xác nhận? | Khách gửi yêu cầu, quản trị duyệt, khách trả tiền giả lập, đơn mới được xác nhận; GĐ2 đối tác xử lý đơn của mình | FR-11 đến FR-14,26 |
| D-05 | Giới hạn địa lý và Măng Đen? | GĐ1 chưa đưa Măng Đen vào dữ liệu; giữ phạm vi Gia Lai, liên vùng để sau | FR-03 đến FR-05 |
| D-06 | Offline miễn phí hay premium? | Miễn phí xem lịch đã lưu và POI trong chuyến; GĐ1 chỉ đọc, sửa cần mạng. Bản đồ/audio tải trước thuộc premium GĐ2 | FR-08,20,21 |
| D-07 | AI thật hay lịch mẫu? | GĐ1 có AI thật tạo lịch. Chatbot, cá nhân hóa theo hành vi, thời tiết và dự báo mật độ để giai đoạn sau | FR-05,22-24 |
| D-08 | Giao diện và audio ngôn ngữ nào? | GĐ1 tiếng Việt; GĐ2 bổ sung Anh/Hàn/Trung và cụm từ giao tiếp Jrai | FR-09,19 |
| D-09 | Đầu vào và đơn vị ngân sách? | Ngày bắt đầu, số ngày, số người, ngân sách cả đoàn gồm ăn/ở/vé/di chuyển nội tỉnh, xuất phát, phương tiện và sở thích; không tự tăng ngân sách | FR-05; BR-02 đến BR-04 |
| D-10 | Quyền khách chưa đăng nhập? | Được xem/tìm địa điểm, sự kiện và nghe audio miễn phí. Tạo/lưu lịch và đặt dịch vụ cần đăng nhập | FR-01,03,05,07,09-11 |
| D-11 | Đăng nhập và cổng vận hành? | Email + mật khẩu. GĐ1 quản trị nhập/duyệt nội dung, quản lý đối tác và đơn; cổng đối tác/cộng tác viên riêng ở GĐ2 | FR-01,17,18,26 |
| D-12 | Hạn xử lý đơn? | Duyệt trong 24 giờ, trả tiền trong 30 phút sau duyệt; nhận yêu cầu phải còn đủ cửa sổ này trước giờ dùng; mốc có thể cấu hình | BR-06,07 |
| D-13 | Hủy và hoàn tiền? | Trước giờ bắt đầu được hủy miễn phí, hoàn giả lập toàn bộ nếu đã thanh toán; không tự hủy từ lúc bắt đầu sử dụng | FR-14; BR-08 |
| D-14 | Giá và gia hạn premium? | 49.000đ/tháng hoặc 199.000đ/năm, không tự gia hạn; thêm bản đồ/audio offline, bỏ quảng cáo; hết hạn vẫn giữ lịch và offline cơ bản | FR-20,21 |
| D-15 | Cổng đối tác/cộng tác viên/B2G? | Đối tác tự quản lý dịch vụ/đơn thuộc mình; cộng tác viên gửi quản trị duyệt; B2G chỉ xem/xuất CSV tổng hợp | FR-26,30 |
| D-16 | Gói đối tác, quảng cáo, thưởng? | Quyền lợi/giá/điều kiện do quản trị cấu hình. Hoa hồng mặc định 10%, ghi nhận mô phỏng khi dịch vụ hoàn thành, không chuyển tiền | FR-27 đến FR-29 |
| D-17 | Giới hạn của AI nâng cao? | Chatbot dựa nội dung duyệt; hành vi chỉ dùng khi có đồng ý; đổi lịch do thời tiết/đóng cửa phải cho khách xác nhận; mật độ thiếu dữ liệu thì báo chưa đủ | FR-22 đến FR-24 |
| D-18 | Nguồn sự kiện và thông báo? | GĐ1 quản trị nhập/cập nhật; tự động đồng bộ khi có API ở GĐ2. Thông báo nghiệp vụ trong web, chưa cần SMS/email/push | FR-10,15,25 |
| D-19 | Chỉ tiêu kỹ thuật ngoài PDF? | Cho phép người soạn đề xuất, thông số có thể cấu hình/điều chỉnh | Tệp 02 và chi tiết kỹ thuật BR |
| D-20 | Hệ quản trị cho schema backend? | Ban đầu chọn MySQL 8; sau lỗi import, chủ sản phẩm xác nhận hosting thực tế là MariaDB 10.5.26. Điều chỉnh schema theo môi trường hosting, giữ file tại `be/schema.sql` | Tệp 07; schema và hướng dẫn backend |
| D-21 | Kiểu và cách sinh ID? | Tất cả ID/tham chiếu ID là string GUID do backend sinh, lưu CHAR(36); bỏ AUTO_INCREMENT. Giữ kiểu số cho tiền, dung lượng, bộ đếm và số phiên bản | Tệp 07; schema và hướng dẫn backend |
| D-22 | Cơ chế đăng nhập? | Chủ sản phẩm xác nhận 30/10/2026: dùng JWT. Access JWT + refresh token xoay vòng, phiên DB thu hồi được; TTL/thuật toán/cookie là baseline kỹ thuật đề xuất trong [thiết kế auth](../implementation/auth-jwt.md) | FR-01; NFR-07–09; class diagram; schema; task BE/FE và X-03 |

Email khôi phục tài khoản trong UC-01 là giao tiếp phục vụ bảo mật tài khoản, tách với thông báo nghiệp vụ đơn đặt/sự kiện ở D-18. Không suy ra yêu cầu gửi email marketing.

## 2. Diễn giải bổ sung để đặc tả nhất quán

Các chi tiết sau là thiết kế yêu cầu do người soạn cụ thể hóa, không ghi thành câu trả lời nguyên văn của chủ sản phẩm:

- Đơn chờ duyệt chưa giữ tồn; khi duyệt giữ nguyên tử; hết hạn hoặc hủy nhả tồn để tránh duyệt trùng.
- Một đơn đặt một dịch vụ/khoảng sử dụng; nhiều dịch vụ tạo các đơn độc lập; lịch trình và đơn không tự sửa lẫn nhau.
- Giá và chính sách chụp theo đơn; đổi giá sau đặt không hồi tố.
- Tại đúng giờ bắt đầu không còn quyền tự hủy; tại đúng thời điểm hết hạn không được tiếp tục thanh toán.
- Lịch sửa có phiên bản, dữ liệu offline tải theo manifest và chỉ công bố bản tải hoàn chỉnh.
- Premium mua thêm nối hạn; tháng/năm theo lịch và xử lý ngày cuối tháng; quyền offline có hạn, phải xác minh khi không đáng tin.
- Chính sách quà tặng/gói đối tác/quảng cáo là cấu hình có phiên bản thay vì giả định đã có mức giá hoặc định mức chính thức.

Đây là các lựa chọn để tài liệu triển khai được; nếu thay đổi phải cập nhật đồng thời BR, use case và sequence liên quan.

## 3. Các giá trị và phụ thuộc cần hiệu chỉnh khi triển khai

Không có câu hỏi phạm vi chính đang bỏ ngỏ. Các mục sau là đầu vào cấu hình/thiết kế, chưa được trình bày như cam kết vận hành đã đo:

| Mục | Trạng thái / cách xử lý |
| --- | --- |
| Nhà cung cấp AI và bản đồ/tuyến | Chưa chỉ định hãng; lựa chọn khi thiết kế. Nghiệm thu phải dùng AI thật và dữ liệu tuyến có căn cứ; không coi danh sách GPT/VinAI/FPT AI/Map4D/Google trong PDF là lựa chọn đã ký |
| Dữ liệu audio, bản dịch, quyền ảnh và bản đồ offline | Phải có nội dung được cấp quyền; thiếu dữ liệu phải hiển thị đúng, không cam kết đã sản xuất đủ kho nội dung |
| Nguồn thời tiết, API sự kiện, độ mới và mật độ | GĐ2 chỉ tích hợp nguồn được phép; chưa có API không giả định đồng bộ thời gian thực; ngưỡng đủ dữ liệu/độ mới cần kiểm chứng theo nguồn |
| Chỉ tiêu tải/khả dụng/lưu dữ liệu | Đề xuất ở tệp 02, hiệu chỉnh trên pilot; không phải số liệu đã chạy thử |
| Giá, hạn mức gói đối tác; chiến dịch quảng cáo/thưởng | Quản trị cấu hình trước khi kích hoạt, theo D-16; không hard-code mức chưa được chọn |
| Báo cáo B2G và thương mại dữ liệu | Chỉ số cơ bản đã mô tả; ngưỡng nhóm đề xuất ≥10. Ký hợp đồng, chia sẻ và thương mại hóa cần phạm vi riêng, không có trong bàn giao chức năng xuất tổng hợp |
| Chính sách lưu trữ/xóa và nghĩa vụ pháp lý | SRS có mục tiêu quyền riêng tư; cần đối chiếu thực tế trước vận hành, không coi trích dẫn pháp luật trong PDF là đánh giá pháp lý hiện hành |

## 4. Giới hạn nguồn đã kiểm tra

- Đã đọc cả 12 trang PDF và kiểm tra ảnh render; các nội dung nền tảng, sản phẩm, doanh thu và rủi ro đều được đối chiếu.
- Mục 2.2 PDF nhắc ảnh/clip sản phẩm đính kèm, nhưng không có các tệp bổ sung đó trong thư mục dự án lúc đọc. Không dựng yêu cầu giao diện từ tệp chưa có.
- `be` và `fe` chưa có mã nguồn để đối chiếu tại thời điểm soạn. SRS không áp đặt framework, cấu trúc API hoặc giả định tính năng đã triển khai.
- Các số liệu thị trường/sự kiện/địa lý trong PDF dùng làm bối cảnh của ý tưởng; tài liệu này không xác minh độc lập các số liệu đó.
