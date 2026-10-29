# Yêu cầu phi chức năng

## 1. Cơ sở và quy ước đặc tả

Phần này dùng cùng quy tắc yêu cầu đơn nhất, có định danh và có thể kiểm chứng ở mục 4.1 của [tệp yêu cầu chức năng](01-tong-quan-va-yeu-cau-chuc-nang.md), tham chiếu [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html). Các yêu cầu được tổ chức theo thuộc tính chất lượng và ràng buộc vận hành.

- `NFR-xx` là nhóm tương thích các tham chiếu hiện có; `NFR-xx.yy` là yêu cầu con dùng khi thiết kế và nghiệm thu.
- Mỗi phát biểu “Hệ thống phải…” xác định một thuộc tính hoặc ràng buộc; cột kiểm chứng xác định điều kiện đạt.
- Phương pháp: **T** = kiểm thử; **I** = kiểm tra tài liệu/cấu hình/dữ liệu; **D** = trình diễn có kịch bản; **A** = phân tích kết quả đo.
- Mỗi yêu cầu bắt buộc trong giai đoạn áp dụng **sau khi được đưa vào đường cơ sở nghiệm thu**. Các ngưỡng hiệu năng, tải, lưu trữ và cảnh báo hiện là **đề xuất kỹ thuật theo D-19**, chưa phải cam kết vận hành đã được đo hoặc phê duyệt riêng.
- Những ràng buộc đã xác nhận như thanh toán giả lập, quyền theo sở hữu, offline chỉ đọc và đồng ý cá nhân hóa vẫn có hiệu lực theo sổ quyết định.
- Ràng buộc xử lý bảo mật bổ sung và cơ chế vận hành là phần cụ thể hóa của người soạn; không được gán thành phát biểu nguyên văn của chủ sản phẩm.
- Thông số E-01 đến E-08 tạo một hồ sơ đo đề xuất; khi hiệu chỉnh phải ghi phiên bản và lý do, không thay ngưỡng sau khi đo chỉ để đánh dấu đạt.

## 2. Điều kiện và phép đo dùng chung

| Hồ sơ | Điều kiện kiểm chứng |
| --- | --- |
| E-01 - API nội bộ | Môi trường tương đương triển khai thử, cấu hình phần cứng/phần mềm được ghi trong biên bản. 100 phiên đã đăng nhập phát tổng 50 yêu cầu API không dùng AI mỗi giây, phân bổ 80% đọc/20% ghi; song song tối đa 5 yêu cầu AI đang xử lý. CSDL: 1.000 POI, 500 dịch vụ, 100 sự kiện, 10.000 đơn. Làm nóng 5 phút, đo 15 phút; dùng dữ liệu và bộ lọc đa dạng, không chỉ lặp một phản hồi cache. |
| E-02 - AI | Ít nhất 100 đầu vào khả thi có lịch đáp án kiểm chứng, chuyến tối đa 7 ngày, 5 điểm/ngày, 20 người; tối đa 5 yêu cầu AI đồng thời. Dùng AI thật và dữ liệu tuyến được phép. Ghi nhà cung cấp, model, phiên bản prompt và độ trễ phụ thuộc. Thử riêng dữ liệu không khả thi và timeout. |
| E-03 - offline | Gói hoàn chỉnh tối thiểu 7 ngày, 35 POI; thử ít nhất 20 lần mở mỗi thiết bị đại diện desktop/mobile, gồm mở lại sau đóng trình duyệt, tắt mạng trước khi mở. Ghi CPU, RAM, hệ điều hành và trình duyệt. Đo từ thao tác mở tới khi nội dung lịch và điều khiển đọc hiển thị. |
| E-04 - khả dụng | Probe độc lập mỗi phút kiểm tra luồng truy cập web, đăng nhập thử và đọc nội dung trong tối đa 10 giây. Một phút chỉ khả dụng nếu toàn bộ phép kiểm tra đạt. A = số phút khả dụng / tổng phút của tháng × 100%; tính cả bảo trì có ảnh hưởng. Lỗi hệ thống đo phải được ghi riêng để biên bản không suy diễn thiếu mẫu thành đạt. |
| E-05 - cạnh tranh | Ít nhất 20 yêu cầu tranh một suất cuối; thử duyệt, trả tiền, hết hạn và hủy chạy đồng thời; thử lặp cùng khóa và khác khóa; gây lỗi tại các bước ghi giao dịch. Đối chiếu đơn, tồn, thanh toán, hoàn và nhật ký sau mỗi ca. |
| E-06 - phục hồi | Khôi phục vào môi trường riêng từ bộ sao lưu thực tế. Tạo mốc dữ liệu trước sự cố để xác định RPO; tính RTO từ thời điểm công bố sự cố thử tới khi các luồng cốt lõi hoàn tất được. Kiểm tra tham chiếu tệp cùng CSDL. |
| E-07 - tương thích | Chrome/Edge/Firefox trên desktop; Chrome Android; Safari macOS/iOS, thuộc hai phiên bản ổn định gần nhất khi khóa kế hoạch kiểm thử. Ghi phiên bản thực tế. Kiểm tra viewport 360, 390, 768, 1024, 1440 pixel CSS và thay đổi kích thước giữa các mốc. Luồng cốt lõi: đăng nhập, khám phá, tạo/sửa/lưu lịch, xem offline, đặt/duyệt/trả tiền/hủy giả lập. |
| E-08 - chất lượng AI | Ít nhất 50 trường hợp: lịch đúng, ID giả, nội dung chưa duyệt, trùng giờ, thời lượng âm, sai tổng giá, vượt ngân sách, dữ liệu tuyến thiếu và chỉ dẫn độc hại. Có kết quả mong đợi độc lập với đầu ra AI; ghi số mẫu từng loại. |

**Định nghĩa đo:** p95 dùng thứ hạng gần nhất sau khi sắp thời lượng tăng dần, tại vị trí `ceil(0,95 × n)`. Thời gian API tính từ lúc máy chủ nhận yêu cầu tới khi gửi xong phản hồi, gồm thời gian chờ xử lý; riêng NFR-02 gồm cả AI, bản đồ và xác thực kết quả. Yêu cầu hợp lệ phát sinh lỗi hoặc hết thời gian được tính là mẫu không đạt, không bị loại khỏi thống kê. Báo cáo phải kèm tổng mẫu, tỷ lệ thành công, lỗi và timeout; không dùng phản hồi lỗi nhanh để đạt mục tiêu độ trễ.

RPO là khoảng mất dữ liệu tối đa; RTO là thời gian khôi phục tối đa. Các giới hạn ngày/điểm/người trong E-02 là hồ sơ tải đề xuất, không tự bổ sung giới hạn thương mại cố định cho người dùng.

## 3. Yêu cầu chi tiết

### NFR-01 - Hiệu năng API

**Giai đoạn:** 1. **Truy vết:** FR-03, FR-06, FR-07, FR-11 đến FR-14. **Nguồn/trạng thái:** Đề xuất kỹ thuật. **Điều kiện:** E-01.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-01.01 | Hệ thống phải trả phản hồi cho ít nhất 95% yêu cầu đọc API nội bộ trong thời gian không quá 2 giây dưới tải E-01. | T | p95 của tập yêu cầu đọc không vượt 2 giây. |
| NFR-01.02 | Hệ thống phải hoàn tất ít nhất 95% yêu cầu ghi nghiệp vụ không dùng AI trong thời gian không quá 3 giây dưới tải E-01. | T | p95 của tập ghi không vượt 3 giây. |

### NFR-02 - Hiệu năng tạo lịch AI

**Giai đoạn:** 1. **Truy vết:** FR-05. **Nguồn/trạng thái:** PDF tr.8: mục tiêu 30 giây; cách đo/timeout là đề xuất. **Điều kiện:** E-02.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-02.01 | Hệ thống phải trả bản lịch AI hợp lệ cho ít nhất 95% yêu cầu tạo lịch khả thi trong thời gian không quá 30 giây dưới E-02. | T | Ít nhất 95/100 yêu cầu khả thi trả lịch vượt kiểm tra trong 30 giây. |
| NFR-02.02 | Hệ thống phải kết thúc một yêu cầu tạo lịch bằng phản hồi thành công hoặc lỗi trong thời gian không quá 45 giây. | T | Không yêu cầu nào còn chờ sau 45 giây trong tập thử timeout. |
| NFR-02.03 | Hệ thống phải báo lỗi giới hạn đầu vào trước khi gọi AI nếu đầu vào vượt miền cấu hình tạo lịch. | T | Đầu vào ngoài miền không sinh lượt gọi AI và có thông báo cụ thể. |

### NFR-03 - Hiệu năng offline

**Giai đoạn:** 1. **Truy vết:** FR-08. **Nguồn/trạng thái:** D-06; ngưỡng là đề xuất. **Điều kiện:** E-03.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-03.01 | Hệ thống phải hiển thị nội dung lịch đã tải trong thời gian không quá 2 giây ở ít nhất 95% lần mở offline dưới E-03. | T | Ít nhất 19/20 lần mở hoàn tất trong 2 giây. |
| NFR-03.02 | Hệ thống phải cho phép đọc gói offline Sẵn sàng mà không phụ thuộc phản hồi mạng. | T | Tắt mạng trước khi mở không chặn hiển thị lịch và POI đã tải. |

### NFR-04 - Khả dụng và suy giảm dịch vụ

**Giai đoạn:** 1. **Truy vết:** FR-03 đến FR-05, FR-07 đến FR-10. **Nguồn/trạng thái:** Đề xuất kỹ thuật. **Điều kiện:** E-04.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-04.01 | Hệ thống phải đạt tỷ lệ khả dụng máy chủ ít nhất 99,5% trong mỗi tháng vận hành được đo theo E-04. | A | Số phút khả dụng chia tổng số phút của tháng đạt ít nhất 0,995. |
| NFR-04.02 | Hệ thống phải tiếp tục cung cấp nội dung công bố khi dịch vụ AI hoặc bản đồ bị lỗi mà kho nội dung nội bộ vẫn hoạt động. | T | Gây lỗi phụ thuộc không làm mất chức năng đọc nội dung nội bộ. |
| NFR-04.03 | Hệ thống phải thông báo trạng thái suy giảm khi chức năng phụ thuộc dịch vụ ngoài không thực hiện được. | T | Lỗi phụ thuộc có thông báo; không báo hoàn tất thành công giả. |

### NFR-05 - Toàn vẹn giao dịch

**Giai đoạn:** 1. **Truy vết:** FR-11 đến FR-14. **Nguồn/trạng thái:** BR-07 đến BR-09; cách thử là đề xuất. **Điều kiện:** E-05.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-05.01 | Hệ thống phải duy trì tồn khả dụng không âm sau mọi tổ hợp thao tác đặt, duyệt, hết hạn và hủy. | T | Tập cạnh tranh E-05 không tạo tồn âm hoặc bán vượt tồn. |
| NFR-05.02 | Hệ thống phải áp dụng cập nhật trạng thái đơn và biến động tồn liên quan như một thay đổi nguyên tử. | T | Gây lỗi giữa các bước dẫn tới cùng hoàn tất hoặc cùng rollback. |
| NFR-05.03 | Hệ thống phải ghi tối đa một kết quả thanh toán thành công cho cùng nghĩa vụ thanh toán của đơn. | T | Retry cùng hoặc khác khóa không tạo khoản thành công thứ hai cho đơn đã xác nhận. |
| NFR-05.04 | Hệ thống phải ghi tối đa một khoản hoàn giả lập cho cùng giao dịch thành công bị hủy. | T | Hủy lặp hoặc xử lý cạnh tranh không tạo khoản hoàn thứ hai. |

### NFR-06 - Sao lưu và khôi phục

**Giai đoạn:** 1. **Truy vết:** FR-01, FR-07, FR-11 đến FR-14, FR-17. **Nguồn/trạng thái:** Đề xuất kỹ thuật. **Điều kiện:** E-06.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-06.01 | Hệ thống phải tạo bản sao lưu CSDL với khoảng cách giữa hai bản thành công không quá 24 giờ. | I | Lịch sử sao lưu chứng minh khoảng cách tối đa 24 giờ. |
| NFR-06.02 | Hệ thống phải hỗ trợ phục hồi dữ liệu với RPO không quá 24 giờ. | T | Điểm dữ liệu phục hồi cách thời điểm sự cố giả lập không quá 24 giờ. |
| NFR-06.03 | Hệ thống phải hỗ trợ khôi phục các luồng cốt lõi với RTO không quá 4 giờ. | T | Từ khi công bố sự cố tới khi luồng cốt lõi hoạt động lại không quá 4 giờ. |
| NFR-06.04 | Hệ thống phải khôi phục được tài nguyên nội dung tương ứng với tham chiếu dữ liệu trong bản phục hồi. | T | Bản phục hồi không có tham chiếu ảnh/audio công bố bị mất do thiếu sao lưu. |

### NFR-07 - Bảo vệ truyền tin và bí mật

**Giai đoạn:** 1. **Truy vết:** FR-01, FR-05, FR-17. **Nguồn/trạng thái:** PDF tr.12; bổ sung kỹ thuật. **Điều kiện:** Môi trường triển khai.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-07.01 | Hệ thống phải sử dụng HTTPS cho truy cập web và API công khai. | I | Không truyền nội dung hoặc thông tin đăng nhập qua kết nối HTTP không mã hóa. |
| NFR-07.02 | Hệ thống phải lưu mật khẩu dưới dạng băm một chiều có salt bằng thuật toán chuyên dụng cho mật khẩu. | I | Không có mật khẩu rõ; cấu hình thuật toán và salt được ghi trong thiết kế bảo mật. |
| NFR-07.03 | Hệ thống phải giữ khóa bí mật của nhà cung cấp AI và API ở phía máy chủ. | I | Không tìm thấy khóa trong bundle trình duyệt hoặc phản hồi gửi khách. |
| NFR-07.04 | Hệ thống phải loại mật khẩu, token phiên và khóa API khỏi log. | I | Kiểm tra log của ca thành công/lỗi không có các giá trị bí mật đã dùng thử. |

### NFR-08 - Kiểm soát truy cập

**Giai đoạn:** 1; quyền đối tác/B2G ở GĐ2. **Truy vết:** FR-01, FR-02, FR-07, FR-18, FR-26, FR-30. **Nguồn/trạng thái:** D-10, D-11, D-15. **Điều kiện:** Ma trận vai trò và sở hữu.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-08.01 | Hệ thống phải kiểm tra vai trò và phạm vi sở hữu ở mọi yêu cầu API truy cập dữ liệu riêng hoặc quản trị. | T | Mọi ca truy cập chéo tài khoản, đối tác hoặc sai vai trò bị từ chối. |
| NFR-08.02 | Hệ thống phải từ chối phiên đã bị vô hiệu hóa do đăng xuất hoặc khóa tài khoản. | T | Gửi lại phiên cũ không truy cập được API cần đăng nhập. |
| NFR-08.03 | Hệ thống phải từ chối yêu cầu thay đổi trạng thái giả mạo nguồn khi dùng cơ chế phiên dựa trên cookie. | T | Ca CSRF từ nguồn không được phép không thay đổi dữ liệu. |

### NFR-09 - Giới hạn lạm dụng và khôi phục tài khoản

**Giai đoạn:** 1. **Truy vết:** FR-01, FR-05. **Nguồn/trạng thái:** Bổ sung vận hành; ngưỡng là đề xuất. **Điều kiện:** Cửa sổ thời gian trượt theo tài khoản.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-09.01 | Hệ thống phải chặn thử đăng nhập tiếp theo sau 5 lần thất bại của cùng tài khoản trong 15 phút. | T | Lần thứ 6 trong cửa sổ bị giới hạn; sau cửa sổ được thử lại. |
| NFR-09.02 | Hệ thống phải giới hạn mỗi tài khoản ở tối đa 10 yêu cầu tạo lịch được nhận trong một giờ. | T | Yêu cầu thứ 11 trong cửa sổ bị từ chối trước khi gọi AI. |
| NFR-09.03 | Hệ thống phải từ chối token đặt lại mật khẩu khi thời gian đã qua kể từ lúc cấp đạt 15 phút. | T | Token tại hoặc sau hạn không đổi được mật khẩu. |
| NFR-09.04 | Hệ thống phải từ chối token đặt lại mật khẩu đã được sử dụng thành công. | T | Dùng lại token không đổi được mật khẩu lần hai. |
| NFR-09.05 | Hệ thống phải trả cùng dạng thông báo công khai cho yêu cầu khôi phục email có và không tồn tại. | T | Không phân biệt được sự tồn tại email qua mã trạng thái hoặc nội dung thông báo. |

### NFR-10 - Kiểm tra đầu vào và ranh giới AI

**Giai đoạn:** 1; chatbot ở GĐ2. **Truy vết:** FR-05, FR-16, FR-17, FR-22. **Nguồn/trạng thái:** BR-04; bổ sung kỹ thuật. **Điều kiện:** Tập dữ liệu không tin cậy.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-10.01 | Hệ thống phải từ chối dữ liệu đầu vào không phù hợp schema hoặc miền giá trị của thao tác. | T | Các trường sai kiểu, thiếu bắt buộc hoặc ngoài miền không thay đổi dữ liệu. |
| NFR-10.02 | Hệ thống phải từ chối tệp upload không đáp ứng chính sách loại, kích thước và nội dung tệp được cấu hình. | T | Tệp sai chính sách bị từ chối trước công bố. |
| NFR-10.03 | Hệ thống phải vô hiệu hóa nội dung có thể thực thi trong các trường văn bản hiển thị từ dữ liệu người dùng hoặc AI. | T | Payload chèn script không chạy khi đọc nội dung. |
| NFR-10.04 | Hệ thống phải ngăn dữ liệu truy xuất hoặc hội thoại thay đổi quyền truy cập và lệnh vận hành của ứng dụng. | T | Tập prompt injection không đọc được dữ liệu trái quyền hoặc kích hoạt tác vụ ngoài phạm vi. |

### NFR-11 - Giảm thiểu dữ liệu và đồng ý

**Giai đoạn:** 1; hành vi/quảng cáo ở GĐ2. **Truy vết:** FR-02, FR-05, FR-22, FR-28. **Nguồn/trạng thái:** PDF tr.12; D-17. **Điều kiện:** Trước và sau thay đổi đồng ý.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-11.01 | Hệ thống phải cho nhập điểm xuất phát thủ công khi người dùng không cấp quyền định vị thiết bị. | T | Từ chối định vị không chặn tạo lịch có đầu vào nhập tay. |
| NFR-11.02 | Hệ thống phải chỉ thu thập hành vi cho cá nhân hóa hoặc quảng cáo sau khi người dùng đồng ý với mục đích đó. | T | Trước đồng ý không phát sinh bản ghi hành vi phục vụ các mục đích này. |
| NFR-11.03 | Hệ thống phải ngừng sử dụng hành vi cho các đề xuất mới khi người dùng rút đồng ý. | T | Yêu cầu đề xuất sau rút đồng ý không dùng lịch sử hành vi. |
| NFR-11.04 | Hệ thống phải loại email, mật khẩu và thông tin liên hệ đặt dịch vụ khỏi dữ liệu gửi nhà cung cấp AI. | I | Kiểm tra payload outbound không có các trường hoặc giá trị định danh tương ứng. |

### NFR-12 - Lưu trữ, xuất và xóa dữ liệu

**Giai đoạn:** 1. **Truy vết:** FR-02, FR-22. **Nguồn/trạng thái:** PDF tr.12; thời gian là đề xuất. **Điều kiện:** Chính sách dữ liệu được phê duyệt.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-12.01 | Hệ thống phải xác minh chủ thể trước khi thực hiện yêu cầu xuất hoặc xóa dữ liệu cá nhân. | T | Yêu cầu chưa xác minh không xuất hoặc xóa dữ liệu. |
| NFR-12.02 | Hệ thống phải trả kết quả xử lý yêu cầu xuất hoặc xóa trong 7 ngày kể từ khi yêu cầu được xác minh và tiếp nhận. | A | Chênh lệch thời điểm trả kết quả và tiếp nhận không quá 7 ngày. |
| NFR-12.03 | Hệ thống phải xóa log vận hành quá 90 ngày theo tác vụ dọn dẹp định kỳ hàng ngày. | I | Sau tác vụ không có log vận hành vượt hạn; audit log áp dụng NFR-14. |
| NFR-12.04 | Hệ thống phải xóa dữ liệu riêng đã cache của tài khoản trên thiết bị khi tài khoản đăng xuất trên thiết bị đó. | T | Tài khoản tiếp theo không đọc được cache riêng qua ứng dụng. |
| NFR-12.05 | Hệ thống phải tách dữ liệu giao dịch buộc giữ theo chính sách khỏi hồ sơ được xóa. | I | Bản xử lý xóa chỉ giữ tập giao dịch có căn cứ trong chính sách. |
| NFR-12.06 | Hệ thống phải giải thích tập dữ liệu chưa xóa và lý do giữ trong kết quả xử lý yêu cầu xóa. | T | Phản hồi đối chiếu được với dữ liệu còn lưu. |

### NFR-13 - Bảo vệ dữ liệu báo cáo B2G

**Giai đoạn:** 2. **Truy vết:** FR-30. **Nguồn/trạng thái:** D-15; ngưỡng là đề xuất. **Điều kiện:** Tập nhóm nhỏ và truy vấn suy ngược.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-13.01 | Hệ thống phải loại định danh cá nhân và lịch trình của từng người khỏi báo cáo B2G. | I | Không có email, điện thoại, tọa độ cá nhân, ID ổn định theo người hoặc tuyến riêng trong màn hình và CSV. |
| NFR-13.02 | Hệ thống phải ẩn kết quả nhóm có ít hơn 10 tài khoản riêng biệt trong báo cáo B2G. | T | Nhóm 9 người bị ẩn; nhóm 10 chỉ xuất hiện nếu đạt các kiểm tra còn lại. |
| NFR-13.03 | Hệ thống phải ngăn suy ra số liệu nhóm đã ẩn qua tổng hoặc hiệu giữa các bộ lọc được cung cấp. | T | Tập truy vấn kiểm thử không tái tạo được nhóm nhỏ đã ẩn. |

### NFR-14 - Nhật ký kiểm toán

**Giai đoạn:** 1; mở rộng theo GĐ2. **Truy vết:** FR-12 đến FR-14, FR-17, FR-18, FR-30. **Nguồn/trạng thái:** Bổ sung vận hành; thời gian là đề xuất. **Điều kiện:** Sự kiện quản trị/đơn/thanh toán/cấu hình.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-14.01 | Hệ thống phải ghi mỗi sự kiện kiểm toán với thời gian, chủ thể, đối tượng, kết quả và mã tương quan. | I | Đối chiếu sự kiện thử thành công/thất bại có đủ trường, đã che bí mật theo NFR-07. |
| NFR-14.02 | Hệ thống phải giới hạn quyền đọc nhật ký kiểm toán theo vai trò được cấp. | T | Tài khoản không có quyền không đọc được log. |
| NFR-14.03 | Hệ thống phải ngăn người dùng thường sửa hoặc xóa nhật ký kiểm toán. | T | Gọi trực tiếp thao tác sửa/xóa bằng tài khoản thường bị từ chối. |
| NFR-14.04 | Hệ thống phải lưu nhật ký kiểm toán ít nhất 180 ngày. | I | Chính sách lưu và kiểm thử theo thời gian bảo toàn log trong khoảng này. |

### NFR-15 - Tương thích web

**Giai đoạn:** 1. **Truy vết:** Các luồng GĐ1. **Nguồn/trạng thái:** D-02; ma trận là đề xuất. **Điều kiện:** E-07.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-15.01 | Hệ thống phải cho thực hiện các luồng cốt lõi trên các tổ hợp trình duyệt và hệ điều hành thuộc E-07. | D | Từng tổ hợp hoàn tất được các luồng đã nêu. |
| NFR-15.02 | Hệ thống phải hiển thị đủ nội dung và điều khiển luồng cốt lõi tại chiều rộng viewport từ 360 đến 1440 pixel CSS. | D | Các mốc E-07 không có điều khiển bị che hoặc không thao tác được; vùng bảng/bản đồ được phép cuộn. |

### NFR-16 - Khả năng tiếp cận

**Giai đoạn:** 1. **Truy vết:** FR-01, FR-05, FR-06, FR-09, FR-11 đến FR-14. **Nguồn/trạng thái:** Bổ sung chất lượng trải nghiệm. **Điều kiện:** Luồng cốt lõi E-07.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-16.01 | Hệ thống phải gắn nhãn xác định được bằng công nghệ hỗ trợ cho mỗi trường nhập liệu trong luồng cốt lõi. | I | Công cụ kiểm tra và đọc nhãn không gặp trường thiếu tên. |
| NFR-16.02 | Hệ thống phải gắn thông báo lỗi với trường nhập liệu gây lỗi. | D | Người dùng xác định được trường và lỗi cần sửa. |
| NFR-16.03 | Hệ thống phải cho hoàn tất luồng cốt lõi bằng bàn phím. | D | Không cần chuột để hoàn tất các luồng và không mắc kẹt focus. |
| NFR-16.04 | Hệ thống phải hiển thị dấu focus trên điều khiển đang được chọn bằng bàn phím. | D | Quan sát được focus ở mọi bước thao tác. |
| NFR-16.05 | Hệ thống phải cung cấp điều khiển lên/xuống thay thế thao tác kéo-thả điểm dừng. | T | Đổi thứ tự lịch bằng các nút cho kết quả tương đương kéo-thả. |
| NFR-16.06 | Hệ thống phải duy trì tương phản ít nhất 4,5:1 cho chữ thường trong luồng cốt lõi. | I | Công cụ đo không phát hiện chữ thường dưới ngưỡng. |
| NFR-16.07 | Hệ thống phải biểu thị trạng thái bằng thông tin ngoài màu sắc. | I | Xem đơn sắc vẫn phân biệt được trạng thái và lỗi. |
| NFR-16.08 | Hệ thống phải cung cấp bản chép lời cho audio đã công bố. | I | Mỗi bản audio công bố có nội dung văn bản tương ứng. |

### NFR-17 - Độ tin cậy dữ liệu offline

**Giai đoạn:** 1; gói nâng cao ở GĐ2. **Truy vết:** FR-08, FR-21. **Nguồn/trạng thái:** D-06; bổ sung kỹ thuật. **Điều kiện:** Ngắt mạng, thiếu quota, cache bị xóa.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-17.01 | Hệ thống phải hiển thị trạng thái offline khi không thể kết nối tới API. | T | Mất mạng hoặc API không kết nối được có nhãn trạng thái rõ. |
| NFR-17.02 | Hệ thống phải phân vùng dữ liệu offline riêng theo tài khoản và phiên bản gói. | T | Đổi tài khoản không đọc nhầm gói riêng; cập nhật không trộn phiên bản. |
| NFR-17.03 | Hệ thống phải giữ gói chưa hoàn tất ở trạng thái khác Sẵn sàng. | T | Ngắt tải ở mọi bước không tạo gói đọc thiếu nhưng báo hoàn chỉnh. |
| NFR-17.04 | Hệ thống phải thông báo nguyên nhân khi không mở được gói do thiếu quota, cache bị xóa hoặc phiên bản không hợp lệ. | T | Từng lỗi có thông báo và hướng dẫn tải lại/giải phóng dung lượng phù hợp. |
| NFR-17.05 | Hệ thống phải hiển thị thời điểm tải của dữ liệu đang đọc offline. | D | Người xem phân biệt được bản tải trước với dữ liệu cập nhật trực tiếp. |

### NFR-18 - Ràng buộc phân phối nội dung offline

**Giai đoạn:** 2. **Truy vết:** FR-19, FR-21. **Nguồn/trạng thái:** D-06; phụ thuộc quyền dữ liệu. **Điều kiện:** Kho bản đồ/audio nâng cao.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-18.01 | Hệ thống phải chỉ phát hành gói offline có quyền lưu trên thiết bị theo nguồn dữ liệu được cấp phép. | I | Mỗi gói được phát hành có hồ sơ quyền offline tương ứng. |
| NFR-18.02 | Hệ thống phải cung cấp thông tin nguồn và quyền sử dụng cho gói bản đồ hoặc audio được tải. | I | Metadata gói có nguồn và thông tin quyền. |
| NFR-18.03 | Hệ thống phải thông báo tính năng không được hỗ trợ trước khi tải nếu môi trường trình duyệt không đáp ứng điều kiện gói. | T | Trình duyệt không hỗ trợ không bắt đầu tải rồi báo thành công. |

### NFR-19 - Minh bạch thanh toán giả lập

**Giai đoạn:** 1; mua gói ở GĐ2. **Truy vết:** FR-11, FR-13, FR-14, FR-20, FR-27. **Nguồn/trạng thái:** D-03. **Điều kiện:** Mọi giao diện giao dịch.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-19.01 | Hệ thống phải hiển thị giá theo đơn vị, tổng tiền và nhãn giả lập trước khi người dùng xác nhận giao dịch. | D | Người dùng thấy đủ thông tin trước thao tác xác nhận. |
| NFR-19.02 | Hệ thống phải hiển thị hạn thanh toán cho đơn đang CHO_THANH_TOAN. | D | Giờ hạn khớp dữ liệu máy chủ. |
| NFR-19.03 | Hệ thống phải không thu thập số thẻ, CVV hoặc OTP ngân hàng trong luồng thanh toán giả lập. | I | Không có trường nhập, payload hoặc dữ liệu lưu các thông tin này. |

### NFR-20 - Tính hợp lệ của kết quả AI

**Giai đoạn:** 1; chatbot/gợi ý ở GĐ2. **Truy vết:** FR-05, FR-06, FR-22, FR-23. **Nguồn/trạng thái:** BR-03, BR-04; tập thử là đề xuất. **Điều kiện:** E-08.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-20.01 | Hệ thống phải chỉ chấp nhận lịch có tất cả ID POI thuộc tập công bố được phép sử dụng. | T | 100% lịch được chấp nhận trong E-08 không có ID ngoài tập. |
| NFR-20.02 | Hệ thống phải từ chối lịch có giờ âm, trùng giờ hoặc tổng giá sai số học. | T | Mọi mẫu chứa lỗi loại này trong E-08 đều bị từ chối. |
| NFR-20.03 | Hệ thống phải cảnh báo giá hoặc tuyến chưa được xác minh trước khi người dùng chấp nhận bản lịch. | T | Mẫu thiếu căn cứ không bị thể hiện là dữ liệu đã xác minh. |

### NFR-21 - Khả năng chịu lỗi nhà cung cấp

**Giai đoạn:** 1; mở rộng theo GĐ2. **Truy vết:** FR-05, FR-06, FR-07, FR-23. **Nguồn/trạng thái:** PDF tr.12; bổ sung kỹ thuật. **Điều kiện:** Lỗi AI/bản đồ và gián đoạn phản hồi.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-21.01 | Hệ thống phải giữ bản lịch đã lưu khi yêu cầu AI hoặc tuyến thất bại. | T | Lịch trước và sau lỗi khớp nội dung, phiên bản. |
| NFR-21.02 | Hệ thống phải không tạo đơn dịch vụ do lỗi hoặc retry yêu cầu tạo lịch. | T | Số đơn không đổi sau tập gây lỗi và retry AI. |
| NFR-21.03 | Hệ thống phải báo lỗi thay vì gắn nhãn AI thành công cho dữ liệu mẫu dự phòng. | T | Lỗi nhà cung cấp không trả lịch mẫu dưới trạng thái thành công. |
| NFR-21.04 | Hệ thống phải áp dụng giới hạn NFR-09 cho các yêu cầu thử lại AI. | T | Thử lại vượt cửa sổ bị giới hạn như yêu cầu mới. |

### NFR-22 - Giám sát vận hành

**Giai đoạn:** 1. **Truy vết:** FR-05 và API nội bộ. **Nguồn/trạng thái:** Bổ sung vận hành; ngưỡng là đề xuất. **Điều kiện:** Cửa sổ quan sát 5 phút.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-22.01 | Hệ thống phải ghi số liệu độ trễ, tỷ lệ lỗi, timeout và chi phí theo lượt gọi AI. | I | Đối chiếu lượt gọi thử có đủ metric hoặc chi phí chưa xác định được ghi rõ. |
| NFR-22.02 | Hệ thống phải phát cảnh báo khi tỷ lệ phản hồi API 5xx vượt 5% trong cửa sổ 5 phút. | T | Tạo tập lỗi trên ngưỡng sinh cảnh báo tại kỳ đánh giá tiếp theo, tối đa 1 phút. |
| NFR-22.03 | Hệ thống phải loại dữ liệu định danh cá nhân khỏi nhãn metric. | I | Metric không có email, điện thoại hoặc nội dung lịch riêng. |

### NFR-23 - Khả năng thay đổi và bảo trì

**Giai đoạn:** 1; gói/đa ngôn ngữ ở GĐ2. **Truy vết:** FR-18, FR-19, FR-20, FR-27 đến FR-29. **Nguồn/trạng thái:** D-16, D-19; ràng buộc bảo trì. **Điều kiện:** Kiểm tra cấu hình và kiến trúc.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-23.01 | Hệ thống phải cho thay đổi ngôn ngữ, giá gói, hoa hồng, thời hạn và quyền gói qua cấu hình có lịch sử. | T | Thay cấu hình không cần sửa quy tắc nghiệp vụ trong mã nguồn. |
| NFR-23.02 | Hệ thống phải bảo toàn cấu hình chụp của giao dịch cũ sau khi cấu hình mới có hiệu lực. | T | Đổi cấu hình không làm đổi đơn hoặc khoản đã ghi. |
| NFR-23.03 | Hệ thống phải cô lập giao tiếp nhà cung cấp AI và bản đồ khỏi quy tắc nghiệp vụ nội bộ. | I | Thay bộ kết nối thử nghiệm không phải thay logic đơn đặt, tồn hoặc tính giá. |

### NFR-24 - Chất lượng tệp xuất

**Giai đoạn:** 2. **Truy vết:** FR-30. **Nguồn/trạng thái:** D-15; bổ sung kỹ thuật. **Điều kiện:** Xuất CSV đối tác/B2G.

| Mã yêu cầu | Phát biểu yêu cầu | Phương pháp | Tiêu chí đạt |
| --- | --- | --- | --- |
| NFR-24.01 | Hệ thống phải ghi tên chỉ số, đơn vị, khoảng thời gian và thời điểm tạo trong tệp báo cáo xuất. | I | Tệp xuất chứa đủ metadata đối chiếu với màn hình. |
| NFR-24.02 | Hệ thống phải vô hiệu hóa giá trị CSV có thể bị phần mềm bảng tính thực thi như công thức. | T | Các giá trị thử bắt đầu bằng =, +, -, @ hiển thị như dữ liệu khi mở bằng phần mềm thử đã ghi phiên bản. |

## 4. Quản lý nghiệm thu và thay đổi

1. Chốt phiên bản hồ sơ đo, cấu hình triển khai và tập dữ liệu trước kiểm thử; ghi riêng ngưỡng đề xuất nào được đưa vào đường cơ sở nghiệm thu.
2. Lập biên bản theo từng mã yêu cầu con: phương pháp, điều kiện thực tế, bằng chứng, kết quả đo và đạt/không đạt/chưa kiểm chứng. Không đánh dấu đạt cho yêu cầu chưa chạy phép kiểm chứng.
3. Kiểm thử GĐ1 chỉ bao gồm các yêu cầu áp dụng GĐ1; khi bàn giao GĐ2 phải chạy thêm phần mở rộng và kiểm tra hồi quy quyền, đơn, AI và offline.
4. Thời hạn giữ log vận hành 90 ngày không áp dụng cho nhật ký kiểm toán 180 ngày. Chính sách xóa dữ liệu cá nhân cần thống nhất với tập dữ liệu giao dịch buộc giữ trước vận hành.
5. Các ngưỡng đủ dữ liệu mật độ, độ mới thời tiết và nguồn sự kiện được cấu hình theo nhà cung cấp ở GĐ2. Chức năng chưa được nghiệm thu định lượng nếu chưa có chính sách phiên bản và tập thử ngưỡng tương ứng; không dùng “đủ dữ liệu” như điều kiện tùy ý.
6. Tài liệu không xác nhận nghĩa vụ pháp lý hiện hành hoặc tuân thủ toàn bộ quy trình IEEE; phần này đặc tả chất lượng và ràng buộc để kiểm chứng trong dự án.
