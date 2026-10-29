# Câu hỏi và sổ quyết định

**Trạng thái:** đang chờ chủ sản phẩm trả lời. Không coi việc chưa có phản hồi là đồng ý với đề xuất.

## 1. Các câu hỏi cần chốt trước

| Mã | Nội dung cần làm rõ | Căn cứ / điểm chưa rõ | Ảnh hưởng |
| --- | --- | --- | --- |
| Q-01 | SRS cho toàn bộ tầm nhìn hay MVP? Những tính năng nào thuộc lần bàn giao đầu? | PDF vừa nêu tính năng cốt lõi, vừa nêu nhiều nguồn doanh thu và mở rộng 5 năm | Toàn bộ phạm vi và ưu tiên |
| Q-02 | Làm web, Android, iOS hay cả ba? Có giao diện riêng cho đối tác, cộng tác viên, kiểm duyệt viên, quản trị và B2G không? | Trang 9 có mobile và web; chưa mô tả cổng vận hành | Tác nhân, giao diện, offline, kiểm thử |
| Q-03 | Kết nối dịch vụ chỉ là xem liên hệ, gửi yêu cầu chờ xác nhận hay đặt tức thời? Loại dịch vụ nào được đặt? | Trang 6 ghi “đặt trực tiếp”, chưa có quy trình | Đơn đặt, lịch trống, xác nhận, tránh trùng |
| Q-04 | Có thanh toán trong bản đầu không? Cổng nào, thanh toán toàn bộ hay đặt cọc? Hạn thanh toán và chính sách hủy/hoàn tiền thế nào? | Trang 10 liệt kê nhiều cổng, chưa lựa chọn | Tích hợp, trạng thái giao dịch, hoàn tiền |
| Q-05 | Hoa hồng 10-15% áp dụng khi nào, ai trả, đối soát và trả tiền cho đối tác thế nào? | Trang 8 chỉ có khoảng tỷ lệ | Giá, doanh thu, báo cáo và đối soát |
| Q-06 | Măng Đen có nằm trong bộ dữ liệu giai đoạn đầu không? Phạm vi giới hạn theo địa giới hay tuyến du lịch liên vùng? | Trang 2, 5 giới hạn Gia Lai; trang 6, 10 nhiều lần đưa Măng Đen vào danh sách | Bộ dữ liệu và kiểm tra phạm vi AI |
| Q-07 | Offline miễn phí gồm gì? Premium bổ sung bản đồ, audio, dung lượng hay số chuyến? Hết hạn premium có được mở gói đã tải không? | Trang 6 coi offline là cốt lõi; trang 8 bán “offline đầy đủ” | Phân quyền nội dung và trải nghiệm mất mạng |
| Q-08 | AI thật hay lịch trình mẫu trong bản đầu? Có chatbot, cá nhân hóa theo hành vi, gợi ý đổi lịch do mưa/đóng cửa và dự báo mật độ khách không? | Trang 6 liệt kê nhiều mức AI, chưa chia giai đoạn | Tích hợp, dữ liệu, chi phí, nghiệm thu |
| Q-09 | Giao diện, bài viết và audio hỗ trợ ngôn ngữ nào ngay? Tiếng Jrai chỉ là cụm từ hay có cả thuyết minh? | Trang 6 nói Việt/Anh/Hàn/Trung và cụm từ Jrai; trang 10-11 mô tả khác nhau | Biên dịch, nội dung, kiểm thử |
| Q-10 | Có thể dùng các mục tiêu kỹ thuật đề xuất trong tệp 02 để bạn duyệt không? Quy mô pilot dự kiến bao nhiêu người dùng đồng thời? | Chỉ có mốc tạo lịch 30 giây ở trang 8 | Hiệu năng, hạ tầng, chi phí |

Các câu Q-01 đến Q-10 được gom thành 5 câu hỏi trong cuộc trò chuyện để tiện trả lời. Sau khi nhận câu trả lời sẽ hỏi tiếp các chi tiết còn ảnh hưởng tới đặc tả, thay vì tự suy diễn.

## 2. Câu hỏi nghiệp vụ tiếp theo

Chỉ cần chốt những câu thuộc tính năng được chọn trong Q-01.

| Mã | Câu hỏi | Đề xuất để thảo luận, chưa phải quyết định |
| --- | --- | --- |
| Q-11 | Khách chưa đăng nhập được làm gì? Đăng nhập bằng email, số điện thoại hay tài khoản mạng xã hội? | Cho xem nội dung công khai; chốt sau quyền tạo/lưu lịch |
| Q-12 | Ngân sách tính theo người hay cả đoàn? Có bao gồm di chuyển đến Gia Lai, ăn, ở và vé? Số người, ngày đi, phương tiện có bắt buộc không? | Tách chi phí ước tính theo hạng mục, ghi rõ đơn vị |
| Q-13 | Khi AI không tìm được lịch thỏa ngân sách/giờ mở cửa, cho phép lịch có cảnh báo hay bắt buộc người dùng sửa đầu vào? | Không tự nới ngân sách; đề nghị người dùng đổi ràng buộc |
| Q-14 | Offline cho phép chỉ xem hay cả sửa lịch? Có định tuyến offline không? Đồng bộ nhiều thiết bị giải quyết xung đột thế nào? | Phân biệt xem bản đồ với tính tuyến; không hứa định tuyến offline khi chưa có dữ liệu |
| Q-15 | Ai nhập và kiểm duyệt địa điểm, bài viết, audio, hồ sơ đối tác và sự kiện? Có quy trình xác minh đối tác không? | Nội dung công khai đi qua trạng thái chờ duyệt |
| Q-16 | Sự kiện và thời tiết lấy từ API nào hay nhập thủ công? Bao lâu cập nhật? Có quyền sử dụng dữ liệu bản đồ để tải offline không? | Lưu nguồn và thời điểm cập nhật; hiển thị khi dữ liệu cũ |
| Q-17 | Có gói premium, gói đối tác, quảng cáo, giới thiệu bạn bè và thưởng báo lỗi trong bản đầu không? Quyền lợi và mức giá chính thức là gì? | Không hard-code mức giá dự kiến trong PDF |
| Q-18 | Báo cáo B2G cần chỉ số gì, ai được xem, có xuất tệp không? Mức tổng hợp tối thiểu và thời gian lưu dữ liệu là bao nhiêu? | Chỉ cung cấp số liệu tổng hợp; chưa thiết kế xuất dữ liệu cá nhân |
| Q-19 | Có thông báo trong ứng dụng, email, push hay SMS? Có đánh giá dịch vụ hoặc chỉ báo lỗi nội dung? | Không suy ra chức năng đánh giá từ hoạt động review marketing |
| Q-20 | Thời gian lưu tài khoản, lịch sử AI, vị trí, báo cáo lỗi, giao dịch và yêu cầu xóa dữ liệu? | Chốt theo nhu cầu thực tế và chính sách được phê duyệt |

## 3. Nhật ký quyết định

| Mã quyết định | Ngày | Câu hỏi liên quan | Quyết định của chủ sản phẩm | Trạng thái |
| --- | --- | --- | --- | --- |
| - | 29/10/2026 | Q-01 đến Q-20 | Chưa nhận câu trả lời | Chờ xác nhận |

## 4. Lưu ý về nguồn

- Không có ảnh/clip sản phẩm bổ sung trong thư mục dự án, dù mục 2.2 của PDF nhắc đến tệp đính kèm.
- Chưa có mã nguồn hoặc tài liệu kỹ thuật trong `be` và `fe` tại thời điểm đọc, nên chưa xác định stack, API hoặc khả năng đã có.
- Tài liệu ghi lại các mục tiêu bảo vệ dữ liệu từ ý tưởng; không xác nhận tính đầy đủ hay hiệu lực hiện tại của các văn bản pháp luật được PDF viện dẫn. Việc chốt nghĩa vụ pháp lý cần bước đối chiếu riêng nếu tính năng xử lý dữ liệu/thu tiền được chọn.
