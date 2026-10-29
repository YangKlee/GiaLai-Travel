# SRS - GiaLaiGo

**Phiên bản:** 1.4 - ID dạng string GUID, tương thích hosting MariaDB 10.5.26.<br>
**Ngày soạn:** 29/10/2026.<br>
**Ngôn ngữ:** Tiếng Việt.<br>
**Nguồn chính:** [Đề cương ý tưởng, dự án khởi nghiệp](../Phụ%20LỤC.pdf), 12 trang.

Tài liệu đặc tả yêu cầu phần mềm (SRS) chuyển ý tưởng GiaLaiGo thành yêu cầu có thể triển khai và nghiệm thu. GiaLaiGo là nền tảng đồng hành du lịch, lấy lịch trình linh hoạt, nội dung địa phương và kết nối cộng đồng làm trọng tâm.

Phạm vi và các quy tắc chính đã được chủ sản phẩm xác nhận qua trao đổi ngày 29/10/2026: **web, AI thật tạo lịch, thanh toán giả lập**, đặc tả toàn bộ tầm nhìn theo hai giai đoạn chức năng. GĐ1 tiếng Việt, có offline cơ bản miễn phí; GĐ2 bổ sung premium, đa ngôn ngữ và các chức năng nâng cao. Quyết định được ghi trong [sổ quyết định](06-cau-hoi-va-quyet-dinh.md).

## Cấu trúc tài liệu

| Tệp | Nội dung |
| --- | --- |
| [01-tong-quan-va-yeu-cau-chuc-nang.md](01-tong-quan-va-yeu-cau-chuc-nang.md) | Phạm vi, thuật ngữ, tác nhân, yêu cầu chức năng, quy tắc nghiệp vụ và truy vết nguồn |
| [02-yeu-cau-phi-chuc-nang.md](02-yeu-cau-phi-chuc-nang.md) | Hiệu năng, bảo mật, khả dụng, offline, khả năng vận hành và tiêu chí đo |
| [03-usecase-diagram.md](03-usecase-diagram.md) | Sơ đồ use case UML và danh mục use case |
| [04-usecase-details.md](04-usecase-details.md) | Tiền điều kiện, luồng chính, ngoại lệ, hậu điều kiện và nghiệm thu |
| [05-sequence-diagram.md](05-sequence-diagram.md) | Tương tác tuần tự của các luồng nghiệp vụ chính |
| [06-cau-hoi-va-quyet-dinh.md](06-cau-hoi-va-quyet-dinh.md) | Các câu hỏi cần trả lời, tác động và lịch sử quyết định |
| [07-class-diagram.md](07-class-diagram.md) | Class diagram theo nhóm, ánh xạ lớp sang bảng và ranh giới bảo đảm dữ liệu |
| [be/schema.sql](../../be/schema.sql) | Khởi tạo cấu trúc MariaDB 10.5.26/MySQL 8.0.16+ trong database đã chọn |
| [be/README.md](../../be/README.md) | Cách chạy schema và hợp đồng giao dịch backend |

## Quy ước đọc

- `FR-xx`: yêu cầu chức năng; `NFR-xx`: yêu cầu phi chức năng; `BR-xx`: quy tắc nghiệp vụ; `UC-xx`: use case; `SEQ-xx`: sơ đồ tuần tự; `Q-xx`: câu hỏi chưa chốt.
- Từ phiên bản 1.1, `FR-xx` và `NFR-xx` là mã nhóm; từng yêu cầu kiểm chứng độc lập dùng mã con `FR-xx.yy` hoặc `NFR-xx.yy`. Tham chiếu mã nhóm trong use case và sequence vẫn bao hàm các yêu cầu con của nhóm đó.
- **Nguồn PDF**: có căn cứ trực tiếp trong ý tưởng; phạm vi bàn giao theo cột GĐ.
- **Xác nhận**: được chủ sản phẩm đồng ý trong trao đổi, được ưu tiên khi khác mô tả ban đầu trong PDF.
- **Đề xuất kỹ thuật**: ngưỡng/chi tiết do người soạn bổ sung theo quyền đề xuất đã được đồng ý; cần hiệu chỉnh khi chọn hạ tầng và chạy pilot.
- Từ “phải” biểu thị điều kiện nghiệm thu của tính năng trong giai đoạn tương ứng; tính năng GĐ2 không phải điều kiện bàn giao GĐ1.
- Các số liệu thị trường, tên đối tác, nhà cung cấp công nghệ, giá dự kiến trong PDF là bối cảnh/đề xuất kinh doanh; không chứng minh đã có hợp đồng, API hay cấu hình vận hành.

## Hiển thị sơ đồ

Use case dùng khối mã `plantuml` để thể hiện đúng tác nhân, biên hệ thống và quan hệ UML. Sequence và class diagram dùng `mermaid`. Trình xem Markdown cần hỗ trợ các định dạng tương ứng; nếu chưa hỗ trợ, nội dung mã sơ đồ vẫn nằm đầy đủ trong tài liệu. Không cần gửi dữ liệu lên dịch vụ render công khai để đọc đặc tả.

## Trạng thái và sử dụng

1. Dùng cột GĐ trong yêu cầu và danh mục use case để lập phạm vi bàn giao, không hiểu toàn bộ tầm nhìn là phải làm ngay.
2. Dùng FR/BR làm đầu vào thiết kế giao diện, API và dữ liệu; dùng UC/sequence và NFR để lập kịch bản nghiệm thu.
3. Chọn nhà cung cấp AI/bản đồ và hiệu chỉnh chỉ tiêu kỹ thuật theo thử nghiệm trước khi cam kết vận hành.
4. Các tham số gói đối tác/quảng cáo/thưởng để quản trị cấu hình theo quyết định đã thống nhất; không cần tự bịa giá thương mại để xây dựng chức năng.
