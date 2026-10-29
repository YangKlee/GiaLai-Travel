# Yêu cầu phi chức năng

Các ngưỡng dưới đây là **mục tiêu kỹ thuật đề xuất**, theo quyền đề xuất được chủ sản phẩm đồng ý. Mốc 30 giây tạo lịch xuất phát từ PDF trang 8. Cần kiểm chứng bằng dữ liệu và hạ tầng pilot trước khi dùng làm cam kết cung cấp dịch vụ.

## 1. Hiệu năng, khả dụng và dữ liệu

| Mã | GĐ | Yêu cầu / ngưỡng đề xuất | Cách kiểm chứng |
| --- | --- | --- | --- |
| NFR-01 | 1 | Với 100 phiên người dùng hoạt động đồng thời, tối đa 5 yêu cầu AI đồng thời: p95 API đọc nội bộ ≤2 giây; p95 lưu/sửa nghiệp vụ không tính AI ≤3 giây. Dữ liệu đo: 1.000 POI, 500 dịch vụ, 100 sự kiện, 10.000 đơn. | Kiểm thử tải 15 phút sau 5 phút làm nóng; ghi p95, lỗi và số mẫu; không tính thời gian người dùng suy nghĩ |
| NFR-02 | 1 | p95 tạo lịch AI ≤30 giây với chuyến ≤7 ngày, ≤5 điểm/ngày, nhóm ≤20 người; timeout toàn yêu cầu 45 giây. Thời gian tính cả AI/bản đồ/kiểm tra, đo từ khi máy chủ nhận đầu vào hợp lệ đến trả kết quả. | Đo ≥100 yêu cầu đại diện, báo tỷ lệ lịch hợp lệ và timeout; đầu vào ngoài cấu hình phải báo rõ thay vì treo |
| NFR-03 | 1 | Khi cache cục bộ đã sẵn sàng, p95 mở lịch offline ≤2 giây trên thiết bị kiểm thử; không gọi mạng mới được hiển thị nội dung đã tải. | Thử chế độ máy bay, đóng/mở lại trình duyệt; ít nhất 20 lần mở trên máy/điện thoại pilot |
| NFR-04 | 1 | Mục tiêu khả dụng máy chủ 99,5% mỗi tháng, tính cả bảo trì có ảnh hưởng người dùng. API bên ngoài lỗi phải trả trạng thái suy giảm thay vì làm hỏng chức năng nội dung đã có. | Probe mỗi phút từ điểm đo độc lập; tính phút phục vụ được/tổng phút; báo riêng lỗi phụ thuộc |
| NFR-05 | 1 | Không âm tồn, không xác nhận thanh toán/hoàn tiền hai lần; cập nhật đơn và tồn có giao dịch nguyên tử. | Thử 20 yêu cầu cạnh tranh cho một suất, retry cùng khóa và cuộc đua hết hạn/thanh toán/hủy |
| NFR-06 | 1 | Sao lưu CSDL tối thiểu hàng ngày, mục tiêu RPO ≤24 giờ và RTO ≤4 giờ; tệp nội dung được quản lý phiên bản/sao lưu tương ứng. | Phục hồi thử trên môi trường riêng, kiểm tra tài khoản/lịch/đơn/thanh toán và liên kết tài nguyên |

Giới hạn số ngày/điểm/người là đề xuất để có tập đo cụ thể, phải cấu hình thay vì gắn cố định trong nghiệp vụ. Dữ liệu lớn hơn mục tiêu pilot cần lập lại kế hoạch tải. p95 nghĩa là ít nhất 95% mẫu đo không vượt ngưỡng.

## 2. Bảo mật và quyền riêng tư

| Mã | Yêu cầu / ngưỡng đề xuất | Cách kiểm chứng |
| --- | --- | --- |
| NFR-07 | Toàn bộ truy cập công khai dùng HTTPS; mật khẩu băm có salt bằng thuật toán chuyên dụng; bí mật AI/API chỉ ở máy chủ; không ghi mật khẩu/token vào log. | Kiểm tra cấu hình, kho mã, bản ghi và phản hồi API |
| NFR-08 | Kiểm tra quyền theo vai trò và sở hữu ở mọi API dữ liệu riêng/quản trị. Phiên phải bị vô hiệu hóa khi đăng xuất hoặc khóa tài khoản; bảo vệ chống giả mạo yêu cầu nếu dùng cookie. | Thử truy cập chéo tài khoản/đối tác, dùng token cũ, gọi trực tiếp API quản trị |
| NFR-09 | Hạn chế thử đăng nhập và gọi AI; mặc định đề xuất 5 lần đăng nhập thất bại/15 phút/tài khoản và 10 lần tạo lịch/giờ/tài khoản. Token đặt lại mật khẩu dùng một lần, hạn 15 phút; phản hồi không tiết lộ email có tồn tại. | Thử vượt hạn, tái dùng token, token hết hạn và phân tích thông báo lỗi |
| NFR-10 | Kiểm tra đầu vào, đầu ra AI, tệp upload và nội dung HTML; không thực thi mã/URL do AI cung cấp; dữ liệu nguồn/chat là dữ liệu, không được thay lệnh hệ thống hoặc quyền truy cập. | Thử payload chèn mã, ID POI giả, chỉ dẫn độc hại trong nguồn và tệp sai định dạng |
| NFR-11 | Thu thập tối thiểu; vị trí thiết bị là tùy chọn và có thể nhập điểm xuất phát thủ công. Theo dõi hành vi dùng cho cá nhân hóa/quảng cáo chỉ sau đồng ý, cho rút lại; không gửi danh tính sang AI. | Kiểm tra lưu lượng mạng, trạng thái trước/sau rút đồng ý và dữ liệu lưu |
| NFR-12 | Quy trình xuất/xóa dữ liệu kiểm tra chủ thể yêu cầu; bản đề xuất: xử lý ≤7 ngày, lưu log vận hành 90 ngày, xóa cache riêng khi đăng xuất. Giao dịch cần giữ theo chính sách được duyệt phải tách khỏi hồ sơ đã xóa và giải thích trong phản hồi. | Kiểm thử yêu cầu xóa/xuất, xác minh dữ liệu và tác vụ dọn dẹp; không xuất dữ liệu người khác |
| NFR-13 | GĐ2 báo cáo B2G không chứa định danh hoặc tuyến cá nhân; mặc định ẩn nhóm có <10 tài khoản riêng biệt và ngăn suy ra nhóm nhỏ qua tổng/chênh lệch bộ lọc. Cấm xuất email, điện thoại, tọa độ cá nhân hoặc ID ổn định theo người. | Kiểm tra CSV, bộ lọc và các truy vấn có thể suy ngược; đánh giá rủi ro tái nhận dạng trước khi cấp quyền |
| NFR-14 | Nhật ký quản trị/đặt dịch vụ/thanh toán/cấu hình phải có thời gian, người thực hiện, đối tượng, kết quả, mã tương quan; không cho người dùng thường sửa. Mục tiêu lưu 180 ngày và giới hạn người xem. | Đối chiếu log của giao dịch thành công/thất bại; thử sửa log và đọc không có quyền |

Các khoảng lưu dữ liệu là đề xuất kỹ thuật, chưa thay cho chính sách lưu trữ được rà soát riêng. SRS không đưa ra kết luận pháp lý về văn bản được đề cập trong PDF.

## 3. Trải nghiệm, tương thích và offline

| Mã | Yêu cầu | Cách kiểm chứng |
| --- | --- | --- |
| NFR-15 | Web dùng được ở chiều rộng 360-1440 px trên Chrome/Edge/Firefox và Safari thuộc hai phiên bản ổn định gần nhất tại thời điểm kiểm thử; ghi phiên bản thực tế vào biên bản. | Ma trận trình duyệt desktop/mobile, thử luồng tạo lịch và đặt dịch vụ |
| NFR-16 | Luồng cốt lõi có nhãn trường, lỗi gắn trường, focus nhìn thấy, điều khiển bằng bàn phím; kéo-thả có nút thay thế “lên/xuống”; audio có bản chép lời. Không chỉ dùng màu để báo trạng thái. | Kiểm tra bàn phím, độ tương phản mục tiêu 4,5:1 cho chữ thường, kiểm tra bằng công cụ và người kiểm thử |
| NFR-17 | Mất mạng phải có trạng thái rõ; gói tải chưa xong không được báo sẵn sàng; cache có phiên bản và tách theo tài khoản. Thông báo nếu hết quota, bị xóa cache hoặc nội dung đã cũ. | Ngắt mạng giữa tải, hết dung lượng, đăng xuất/đổi tài khoản và trình duyệt xóa cache |
| NFR-18 | GĐ2 bản đồ/audio chỉ tải khi được nhà cung cấp cho phép lưu offline; có thông tin nguồn và quyền sử dụng. Nếu trình duyệt/thiết bị không hỗ trợ thì thông báo giới hạn trước khi tải. | Kiểm tra hợp đồng/quyền dữ liệu và thử tính năng trên ma trận trình duyệt |
| NFR-19 | Giá, tổng tiền, hạn thanh toán và nhãn “giả lập” phải xuất hiện trước xác nhận; không yêu cầu số thẻ, CVV hoặc OTP ngân hàng. | Kiểm tra giao diện, API và dữ liệu lưu của mọi luồng thanh toán |

## 4. Chất lượng AI và khả năng vận hành

| Mã | Yêu cầu | Cách kiểm chứng |
| --- | --- | --- |
| NFR-20 | 100% lịch được chấp nhận chỉ dùng POI có thật trong tập đã duyệt; không chấp nhận ID lạ, giờ âm, trùng giờ hoặc tính giá sai số học. Giá/tuyến chưa xác minh phải được báo. | Tập nghiệm thu ≥50 trường hợp gồm đầu vào không khả thi và đầu ra AI sai; kiểm tra bộ xác thực độc lập với AI |
| NFR-21 | Timeout hoặc nhà cung cấp lỗi không làm mất lịch đã lưu, không tự tạo đơn và không trả lịch mẫu dưới nhãn AI thành công. Cho thử lại an toàn, có giới hạn. | Giả lập lỗi AI/bản đồ và reload trình duyệt trong lúc xử lý |
| NFR-22 | Có thống kê độ trễ, tỷ lệ lỗi, timeout và chi phí/lượt gọi AI; cảnh báo khi lỗi 5xx >5% trong 5 phút, không đưa thông tin cá nhân vào metric. | Gây lỗi có kiểm soát, kiểm tra cảnh báo và dashboard vận hành |
| NFR-23 | Ngôn ngữ, giá gói, tỷ lệ hoa hồng, thời hạn và quyền gói quản lý bằng cấu hình có lịch sử; adapter nhà cung cấp tách khỏi quy tắc nghiệp vụ. | Thay cấu hình ở môi trường thử và xác minh giao dịch cũ không đổi |
| NFR-24 | CSV xuất theo quyền phải có nhãn trường, đơn vị, khoảng thời gian và thời điểm tạo; vô hiệu hóa giá trị có thể bị phần mềm bảng tính hiểu là công thức. | Mở CSV bằng phần mềm bảng tính với các trường bắt đầu bằng =, +, -, @ |

## 5. Điều kiện nghiệm thu chung

1. Kiểm tra từng tiêu chí của FR thuộc giai đoạn bàn giao, gồm trường hợp lỗi và truy cập trái quyền.
2. Kiểm thử xuyên suốt: tạo lịch AI → sửa → lưu → tải → xem offline; đặt → duyệt → trả tiền giả lập → hủy/hoàn; thử cạnh tranh tồn và retry.
3. Ghi môi trường, dữ liệu, thời gian đo và kết quả thực tế của các NFR đã chốt cho pilot. Không ghi “đạt” chỉ vì chưa thấy lỗi khi thao tác thủ công.
4. GĐ2 bổ sung kiểm thử hết hạn premium khi offline, bản dịch thiếu, nguồn thời tiết/sự kiện gián đoạn và báo cáo nhóm nhỏ.
