# SRS - GiaLaiGo

**Phiên bản:** 0.1 - bản nháp phân tích nguồn, chờ xác nhận phạm vi.  
**Ngày soạn:** 29/10/2026.  
**Ngôn ngữ:** Tiếng Việt.  
**Nguồn chính:** [Đề cương ý tưởng, dự án khởi nghiệp](../Phụ%20LỤC.pdf), 12 trang.

Tài liệu đặc tả yêu cầu phần mềm (SRS) chuyển ý tưởng GiaLaiGo thành yêu cầu có thể triển khai và nghiệm thu. GiaLaiGo là nền tảng đồng hành du lịch, lấy lịch trình linh hoạt, nội dung địa phương và kết nối cộng đồng làm trọng tâm.

> Chưa phải bản SRS được phê duyệt. Các yêu cầu từ PDF mô tả tầm nhìn sản phẩm; việc xuất hiện trong SRS chưa đồng nghĩa với cam kết làm trong phiên bản đầu. Câu hỏi còn mở nằm trong [sổ quyết định](06-cau-hoi-va-quyet-dinh.md).

## Cấu trúc tài liệu

| Tệp | Nội dung |
| --- | --- |
| [01-tong-quan-va-yeu-cau-chuc-nang.md](01-tong-quan-va-yeu-cau-chuc-nang.md) | Phạm vi, thuật ngữ, tác nhân, yêu cầu chức năng, quy tắc nghiệp vụ và truy vết nguồn |
| [02-yeu-cau-phi-chuc-nang.md](02-yeu-cau-phi-chuc-nang.md) | Hiệu năng, bảo mật, khả dụng, offline, khả năng vận hành và tiêu chí đo |
| [03-usecase-diagram.md](03-usecase-diagram.md) | Sơ đồ use case UML và danh mục use case |
| [04-usecase-details.md](04-usecase-details.md) | Tiền điều kiện, luồng chính, ngoại lệ, hậu điều kiện và nghiệm thu |
| [05-sequence-diagram.md](05-sequence-diagram.md) | Tương tác tuần tự của các luồng nghiệp vụ chính |
| [06-cau-hoi-va-quyet-dinh.md](06-cau-hoi-va-quyet-dinh.md) | Các câu hỏi cần trả lời, tác động và lịch sử quyết định |

## Quy ước đọc

- `FR-xx`: yêu cầu chức năng; `NFR-xx`: yêu cầu phi chức năng; `BR-xx`: quy tắc nghiệp vụ; `UC-xx`: use case; `SEQ-xx`: sơ đồ tuần tự; `Q-xx`: câu hỏi chưa chốt.
- **Nguồn PDF**: có căn cứ trực tiếp trong ý tưởng, vẫn cần phân bổ phiên bản.
- **Đề xuất**: bổ sung để hệ thống vận hành rõ ràng, chưa được chủ sản phẩm xác nhận.
- **Chờ chốt**: không được tự chuyển thành yêu cầu bắt buộc khi triển khai.
- Từ “phải” trong một yêu cầu chỉ có hiệu lực sau khi yêu cầu và phạm vi phiên bản đó được duyệt.
- Các số liệu thị trường, tên đối tác, nhà cung cấp công nghệ, giá dự kiến trong PDF là bối cảnh/đề xuất kinh doanh; không chứng minh đã có hợp đồng, API hay cấu hình vận hành.

## Hiển thị sơ đồ

Use case dùng khối mã `plantuml` để thể hiện đúng tác nhân, biên hệ thống và quan hệ UML. Sequence dùng `mermaid`. Trình xem Markdown cần hỗ trợ các định dạng tương ứng; nếu chưa hỗ trợ, nội dung mã sơ đồ vẫn nằm đầy đủ trong tài liệu. Không cần gửi dữ liệu lên dịch vụ render công khai để đọc đặc tả.

## Điều kiện chốt SRS

1. Chủ sản phẩm trả lời các câu hỏi về phạm vi và quy tắc nghiệp vụ trong tệp 06.
2. Cập nhật nhất quán FR, NFR, use case và sequence theo câu trả lời.
3. Chốt các ngưỡng nghiệm thu và môi trường đo; phân bổ tính năng theo phiên bản.
4. Kiểm tra lại truy vết và đổi trạng thái phiên bản thành đã phê duyệt.
