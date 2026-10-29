# Tổng quan và yêu cầu chức năng

## 1. Mục tiêu và phạm vi

GiaLaiGo giúp du khách khám phá Gia Lai, lập và tự điều chỉnh lịch trình có căn cứ, tiếp cận nội dung văn hóa, sử dụng thông tin đã tải khi mất mạng và đặt dịch vụ địa phương. SRS bao quát tầm nhìn trong PDF, triển khai dưới dạng **web responsive**, gồm hai giai đoạn chức năng.

| Giai đoạn | Phạm vi |
| --- | --- |
| GĐ1 - nền tảng | Web du khách và quản trị; tiếng Việt; tài khoản email; danh mục điểm đến/dịch vụ; AI thật tạo lịch; sửa/lưu lịch; offline cơ bản chỉ đọc; audio trực tuyến; sự kiện nhập quản trị; báo lỗi; đặt dịch vụ chờ duyệt; thanh toán/hủy/hoàn tiền giả lập; thông báo trong web |
| GĐ2 - mở rộng | Cổng đối tác/cộng tác viên/B2G; Việt/Anh/Hàn/Trung, cụm từ Jrai; premium, gói đối tác, quảng cáo và thưởng; bản đồ/audio tải trước; chatbot, cá nhân hóa theo hành vi, thời tiết và ước tính mật độ; tích hợp nguồn sự kiện khi có API; báo cáo tổng hợp |
| Lộ trình địa lý | GĐ1 chỉ dữ liệu Gia Lai, chưa đưa Măng Đen vào; mở rộng liên vùng/toàn quốc theo lộ trình kinh doanh sau khi có bộ dữ liệu được duyệt |

GĐ1/GĐ2 ở đây là phân kỳ chức năng đã thống nhất, không phải cam kết thời gian “năm 1/năm 2-3” trong PDF. Địa giới và tọa độ được quản trị quản lý trong bộ dữ liệu; không suy ra địa giới từ lời mô tả của AI.

Không thuộc phạm vi bàn giao hiện tại: ứng dụng native iOS/Android; thu/chi/hoàn tiền thật; đặt vé máy bay; định tuyến từng chặng bằng giọng nói; triển khai toàn quốc ngay; ký hợp đồng B2G, tự động bán dữ liệu cho bên ngoài. SRS có chức năng báo cáo tổng hợp để phục vụ mô hình B2G; việc thương mại hóa dữ liệu cần thỏa thuận riêng.

## 2. Thuật ngữ

| Thuật ngữ | Nghĩa |
| --- | --- |
| Địa điểm/POI | Điểm tham quan, ăn uống, lưu trú hoặc trải nghiệm có mã, vị trí và thông tin đã duyệt |
| Lịch trình | Chuyến đi của người dùng, gồm ngày và các điểm dừng có giờ đến/đi, chi phí, chặng di chuyển |
| Đơn đặt | Yêu cầu sử dụng một dịch vụ cụ thể tại thời gian và số lượng xác định; độc lập với lịch trình |
| Mock | Mô phỏng kết quả thanh toán/hoàn tiền; không nhập dữ liệu thẻ hoặc kết nối thu tiền |
| Gói offline | Bản sao có phiên bản của dữ liệu được phép lưu trên trình duyệt để đọc khi mất mạng |
| Tồn khả dụng | Số chỗ/phòng/suất phục vụ còn lại của một dịch vụ trong một khoảng thời gian |
| Nội dung đã duyệt | Bản nội dung được quản trị cho phép công bố, có nguồn và thời điểm cập nhật |

## 3. Tác nhân và quyền

| Tác nhân | Giai đoạn | Quyền chính |
| --- | --- | --- |
| Khách vãng lai | 1 | Tìm/xem địa điểm, dịch vụ, sự kiện; nghe audio miễn phí; đăng ký/đăng nhập |
| Du khách có tài khoản | 1 | Quyền khách vãng lai; tạo/sửa/lưu lịch; tải offline; đặt/hủy; xem đơn và thông báo; quản lý dữ liệu cá nhân |
| Quản trị viên | 1 | Quản lý tài khoản/quyền, địa điểm/nội dung/audio/sự kiện, đối tác/dịch vụ/tồn; duyệt đơn; xử lý báo lỗi và cấu hình |
| Đối tác địa phương | 2 | Quản lý hồ sơ, dịch vụ, tồn và đơn thuộc đối tác mình; mua gói; xem thống kê của mình |
| Cộng tác viên | 2 | Soạn và gửi nội dung/đề xuất cập nhật; xem trạng thái duyệt của nội dung mình gửi |
| Người xem báo cáo B2G | 2 | Xem/xuất báo cáo tổng hợp theo phạm vi được cấp; không truy xuất hồ sơ cá nhân |
| Dịch vụ AI/bản đồ/thời tiết/nguồn sự kiện | 1/2 | Hệ thống bên ngoài cung cấp dữ liệu hoặc kết quả; không phải người dùng có quyền quản trị |

Premium là quyền lợi bổ sung của tài khoản du khách, không phải vai trò quản trị. Các giao diện đều nằm trong nền tảng web. GĐ1 quản trị vận hành thay đối tác/cộng tác viên; GĐ2 bổ sung quyền tự phục vụ theo sở hữu.

## 4. Đặc tả yêu cầu chức năng

### 4.1. Cơ sở và quy tắc diễn đạt

Phần này áp dụng cách xây dựng yêu cầu có định danh, rõ nghĩa, đơn nhất và kiểm chứng được theo định hướng của [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html). [IEEE 830-1998](https://standards.ieee.org/ieee/830/1222/) là tài liệu SRS tiền nhiệm đã được thay thế. Bố cục bảng dưới đây là quy ước của dự án, không phải mẫu bảng bắt buộc do IEEE quy định.

- Mỗi mã `FR-xx.yy` xác định một yêu cầu có thể kiểm chứng độc lập; câu quy phạm bắt đầu bằng “Hệ thống phải”.
- `FR-xx` là mã nhóm giữ lại để tương thích tham chiếu use case; tham chiếu nhóm bao hàm tất cả yêu cầu con.
- Mỗi nhóm ghi giai đoạn, use case, nguồn và lý do cần yêu cầu. Mã `D-xx` tham chiếu [sổ quyết định](06-cau-hoi-va-quyet-dinh.md); số trang PDF là số trang vật lý.
- Mức bắt buộc: tất cả yêu cầu con phải được đáp ứng khi bàn giao giai đoạn được gán; GĐ2 không phải điều kiện bàn giao GĐ1.
- Cột kiểm chứng mô tả kết quả mong đợi; phương pháp mặc định là kiểm thử chức năng, gồm trường hợp hợp lệ và không hợp lệ.
- FR xác định hành vi quan sát được. Các ngưỡng chất lượng và ràng buộc bảo mật ở tệp 02; BR ở mục 5 là điều kiện nghiệp vụ áp dụng.
- Nguồn “bổ sung vận hành” chỉ chi tiết cụ thể hóa của người soạn, không được hiểu là câu trả lời nguyên văn hoặc tính năng đã tồn tại.
- Phạm vi chỉnh sửa này là hai phần yêu cầu; không tuyên bố chứng nhận tuân thủ toàn bộ quy trình tiêu chuẩn.

**Quy ước dữ liệu để kiểm chứng:**

| Đối tượng | Điều kiện được dùng khi phát biểu “hợp lệ” |
| --- | --- |
| Tài khoản | Email bắt buộc, được bộ kiểm tra cú pháp email của ứng dụng chấp nhận và duy nhất sau chuẩn hóa. Chính sách mật khẩu phải có phiên bản cấu hình trước nghiệm thu; không coi mọi chuỗi không rỗng là mật khẩu hợp lệ. Bộ thử phải có trường hợp ngay dưới, tại và trên từng giới hạn được cấu hình. |
| Tạo lịch | Đủ bảy trường đã nêu trong FR-05.01; số ngày và số người là số nguyên dương; ngân sách là số nguyên VND dương; ngày có định dạng xác định và quy đổi được theo BR-01; xuất phát xác định được vị trí; phương tiện và sở thích thuộc danh mục cấu hình. Giới hạn tối đa theo cấu hình và hồ sơ tải NFR-02, không tự coi là chính sách thương mại cố định. |
| Lịch trình | Đáp ứng BR-02 đến BR-04. Mỗi điểm dừng có ID POI được phép; khoảng thời gian, chi phí và chặng tuyến phải qua kiểm tra độc lập với AI. |
| Đơn đặt | Số lượng là số nguyên dương; giờ kết thúc sau giờ bắt đầu; khoảng sử dụng thuộc lịch phục vụ công bố; còn số lượng khả dụng; thời gian nhận đơn thỏa BR-06. Liên hệ bắt buộc có tên và ít nhất một phương thức liên hệ được kiểm tra theo schema dịch vụ. |
| Nội dung và tệp | Thỏa schema từng loại nội dung, trạng thái BR-12 và chính sách tệp có phiên bản; bản công bố phải có nguồn. Trường tùy chọn thiếu được hiển thị theo FR-04.03. |
| Tham số thương mại GĐ2 | Giá, thời hạn, hạn mức, điều kiện thưởng, độ mới dữ liệu và tiêu chí đủ dữ liệu phải có giá trị cùng phiên bản hiệu lực trước khi kích hoạt tính năng tương ứng. |

Các chính sách mật khẩu, schema liên hệ/tệp và tham số GĐ2 là đầu vào cấu hình thiết kế cần ghi nhận trước nghiệm thu, chưa được tự gán thành quyết định kinh doanh của chủ sản phẩm. Yêu cầu phụ thuộc một chính sách chưa có phiên bản chỉ được ghi “chưa đủ điều kiện kiểm chứng”, không được đánh dấu đạt. Cụm “người có quyền” luôn chỉ vai trò và phạm vi đã định nghĩa ở mục 3, BR-13 và NFR-08.

### 4.2. Yêu cầu chi tiết

#### FR-01 - Tài khoản

**Giai đoạn:** 1. **Liên kết:** UC-01. **Nguồn/lý do:** D-10, D-11; bổ sung vận hành; đáp ứng tài khoản trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-01.01 | Hệ thống phải tạo tài khoản với email duy nhất khi khách gửi thông tin đăng ký hợp lệ. | Email chưa tồn tại tạo được một tài khoản; email trùng bị từ chối. |
| FR-01.02 | Hệ thống phải cấp phiên đăng nhập khi email và mật khẩu khớp với một tài khoản đang hoạt động. | Tài khoản hợp lệ nhận phiên; sai thông tin hoặc bị khóa không nhận phiên. |
| FR-01.03 | Hệ thống phải vô hiệu hóa phiên hiện tại khi người dùng đăng xuất. | Yêu cầu dùng lại phiên đã đăng xuất bị từ chối. |
| FR-01.04 | Hệ thống phải gửi liên kết đặt lại mật khẩu tới email của tài khoản khi nhận yêu cầu khôi phục hợp lệ. | Liên kết được gửi tới đúng địa chỉ; phản hồi công khai tuân thủ NFR-09. |
| FR-01.05 | Hệ thống phải thay mật khẩu khi nhận mật khẩu mới hợp lệ kèm token khôi phục còn hiệu lực và chưa sử dụng. | Token hợp lệ đổi được mật khẩu; token sai, hết hạn hoặc đã dùng bị từ chối. |

#### FR-02 - Hồ sơ và quyền dữ liệu

**Giai đoạn:** 1. **Liên kết:** UC-22. **Nguồn/lý do:** PDF tr.12; D-17; đáp ứng hồ sơ và quyền dữ liệu trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-02.01 | Hệ thống phải cho du khách cập nhật hồ sơ của chính mình. | Thay đổi được lưu cho đúng chủ tài khoản. |
| FR-02.02 | Hệ thống phải cho du khách lưu sở thích du lịch của chính mình. | Sở thích đọc lại sau đăng nhập khớp dữ liệu đã lưu. |
| FR-02.03 | Hệ thống phải lưu lựa chọn đồng ý sử dụng hành vi cho cá nhân hóa của du khách. | Lựa chọn đồng ý hoặc rút đồng ý có trạng thái và thời điểm. |
| FR-02.04 | Hệ thống phải tiếp nhận yêu cầu xuất dữ liệu cá nhân từ chủ tài khoản đã được xác minh. | Yêu cầu có mã theo dõi và chỉ chứa phạm vi dữ liệu của chủ thể. |
| FR-02.05 | Hệ thống phải tiếp nhận yêu cầu xóa dữ liệu cá nhân từ chủ tài khoản đã được xác minh. | Yêu cầu được ghi nhận; dữ liệu cần giữ theo chính sách được giải thích theo NFR-12. |

#### FR-03 - Tìm kiếm địa điểm và dịch vụ

**Giai đoạn:** 1. **Liên kết:** UC-02. **Nguồn/lý do:** PDF tr.5-6; D-05; đáp ứng tìm kiếm địa điểm và dịch vụ trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-03.01 | Hệ thống phải trả danh sách nội dung công bố khớp từ khóa tên và các bộ lọc loại, khu vực, khoảng giá do khách chọn. | Kết quả thỏa đồng thời bộ lọc đã chọn; nội dung chưa duyệt không xuất hiện. |
| FR-03.02 | Hệ thống phải hiển thị các địa điểm có tọa độ trong kết quả tìm kiếm trên bản đồ. | Vị trí trên bản đồ khớp tọa độ lưu trong dữ liệu. |
| FR-03.03 | Hệ thống phải thông báo không có kết quả khi không có nội dung khớp truy vấn. | Danh sách rỗng có thông báo và hướng dẫn đổi bộ lọc. |
| FR-03.04 | Hệ thống phải duy trì khả năng xem danh sách tìm kiếm khi dịch vụ bản đồ không khả dụng. | Giả lập lỗi bản đồ không làm mất danh sách. |

#### FR-04 - Chi tiết địa điểm

**Giai đoạn:** 1. **Liên kết:** UC-02. **Nguồn/lý do:** PDF tr.6,8,12; đáp ứng chi tiết địa điểm trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-04.01 | Hệ thống phải hiển thị bản chi tiết công bố gồm mã, tên, tọa độ, mô tả, ảnh, nguồn và thời điểm cập nhật của địa điểm được chọn. | Các trường hiển thị khớp phiên bản công bố. |
| FR-04.02 | Hệ thống phải hiển thị giờ mở cửa và giá tham khảo theo dữ liệu đã được duyệt. | Giờ, giá và đơn vị khớp dữ liệu nguồn. |
| FR-04.03 | Hệ thống phải ghi rõ chưa có thông tin cho trường giờ mở cửa hoặc giá chưa được cung cấp. | Giá trống không bị trình bày thành 0đ; giờ trống không thành mở cả ngày. |

#### FR-05 - Tạo lịch trình bằng AI

**Giai đoạn:** 1. **Liên kết:** UC-03. **Nguồn/lý do:** PDF tr.5-6,8; D-07, D-09; đáp ứng tạo lịch trình bằng ai trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-05.01 | Hệ thống phải kiểm tra bộ đầu vào tạo lịch gồm ngày bắt đầu, số ngày, số người, ngân sách cả đoàn, điểm xuất phát, phương tiện và sở thích theo BR-02 đến BR-04. | Thiếu trường hoặc dữ liệu ngoài miền hợp lệ bị báo tại trường tương ứng. |
| FR-05.02 | Hệ thống phải sử dụng dịch vụ AI thật để tạo bản lịch đề xuất từ đầu vào hợp lệ và tập POI đã duyệt. | Có bằng chứng gọi AI; lịch mẫu không được báo là kết quả AI thành công. |
| FR-05.03 | Hệ thống phải kiểm tra lịch do AI trả về theo BR-03 và BR-04 trước khi chấp nhận làm bản đề xuất. | Lịch có ID lạ, trùng giờ hoặc vi phạm ràng buộc bị từ chối. |
| FR-05.04 | Hệ thống phải trình bày bản đề xuất theo ngày với giờ đến, giờ đi, thời gian tham quan, chặng di chuyển, nơi ăn/nghỉ và tổng chi phí ước tính. | Các trường của bản đề xuất được hiển thị đầy đủ và nhất quán. |
| FR-05.05 | Hệ thống phải thông báo ràng buộc không đáp ứng được khi không tạo được lịch hợp lệ trong ngân sách đã nhập. | Đầu vào không khả thi không sinh lịch được chấp nhận và không bị tự nâng ngân sách. |

#### FR-06 - Tùy chỉnh lịch trình

**Giai đoạn:** 1. **Liên kết:** UC-04. **Nguồn/lý do:** PDF tr.6; D-06; đáp ứng tùy chỉnh lịch trình trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-06.01 | Hệ thống phải cho du khách sửa các điểm dừng trong bản lịch được phép sửa bằng thao tác thêm, xóa, thay điểm hoặc đổi thứ tự. | Mỗi thao tác cho kết quả đúng trên bản nháp; có cách đổi thứ tự ngoài kéo-thả. |
| FR-06.02 | Hệ thống phải cho du khách thay đổi thời lượng dừng và phương tiện của bản lịch được phép sửa. | Giá trị mới được phản ánh trong bản nháp. |
| FR-06.03 | Hệ thống phải tính lại các chặng bị ảnh hưởng khi bản lịch được chỉnh sửa. | Giờ đến/đi, khoảng cách, thời lượng và tổng ước tính phản ánh thay đổi. |
| FR-06.04 | Hệ thống phải hiển thị các vi phạm BR-03 trước khi cho lưu bản lịch sửa như một lịch hợp lệ. | Không lưu được bản lịch còn vi phạm; bản đã lưu trước đó không bị thay đổi. |
| FR-06.05 | Hệ thống phải từ chối ghi đè lịch khi phiên bản gốc của yêu cầu sửa khác phiên bản hiện tại. | Sửa từ tab cũ trả xung đột và yêu cầu tải lại. |

#### FR-07 - Quản lý lịch đã lưu

**Giai đoạn:** 1. **Liên kết:** UC-05. **Nguồn/lý do:** D-10; hỗ trợ FR-05, FR-06; đáp ứng quản lý lịch đã lưu trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-07.01 | Hệ thống phải lưu bản lịch hợp lệ theo chủ tài khoản và phiên bản khi du khách xác nhận lưu. | Lịch đọc lại khớp nội dung đã xác nhận và có chủ sở hữu. |
| FR-07.02 | Hệ thống phải cho du khách xem danh sách và chi tiết các lịch của chính mình. | Tài khoản chỉ đọc được tập lịch thuộc quyền của mình. |
| FR-07.03 | Hệ thống phải cho du khách đổi tên lịch thuộc sở hữu của mình. | Tên mới xuất hiện khi đọc lại lịch. |
| FR-07.04 | Hệ thống phải tạo bản sao độc lập khi du khách yêu cầu sao chép lịch của mình. | Bản sao có mã mới; sửa bản sao không đổi bản gốc. |
| FR-07.05 | Hệ thống phải xóa lịch thuộc sở hữu sau khi du khách xác nhận xóa. | Lịch không còn trong danh sách; các đơn dịch vụ không tự bị hủy. |

#### FR-08 - Offline cơ bản

**Giai đoạn:** 1. **Liên kết:** UC-06. **Nguồn/lý do:** PDF tr.6,8; D-06; đáp ứng offline cơ bản trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-08.01 | Hệ thống phải cho du khách tải miễn phí bản chỉ đọc của lịch đã lưu và POI trong lịch. | Gói hoàn chỉnh mở được khi tắt mạng trên cùng thiết bị. |
| FR-08.02 | Hệ thống phải hiển thị tiến độ, dung lượng ước tính, thời điểm tải và trạng thái của gói offline. | Giá trị trạng thái tương ứng với các mốc thực tế của lần tải. |
| FR-08.03 | Hệ thống phải chỉ chuyển gói mới sang Sẵn sàng sau khi kiểm tra đủ tài nguyên theo phiên bản gói. | Ngắt tải giữa chừng không tạo gói Sẵn sàng. |
| FR-08.04 | Hệ thống phải giữ gói hoàn chỉnh đang có khi tải bản cập nhật thất bại. | Sau lần cập nhật lỗi vẫn đọc được bản cũ. |
| FR-08.05 | Hệ thống phải từ chối thao tác sửa lịch từ chế độ offline GĐ1. | Thao tác sửa được thông báo cần mạng; bản đã lưu không đổi. |

#### FR-09 - Audio guide

**Giai đoạn:** 1. **Liên kết:** UC-07. **Nguồn/lý do:** PDF tr.6; D-08; đáp ứng audio guide trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-09.01 | Hệ thống phải cho khách phát, dừng và tua bản audio tiếng Việt đã công bố của địa điểm. | Các điều khiển tác động đúng bản thu được chọn. |
| FR-09.02 | Hệ thống phải hiển thị bản chép lời tương ứng với audio được chọn. | Văn bản khớp địa điểm và ngôn ngữ của bản thu. |
| FR-09.03 | Hệ thống phải thông báo khi bản thu không tồn tại hoặc không tải được. | Lỗi audio có thông báo; nội dung văn bản vẫn truy cập được. |

#### FR-10 - Sự kiện

**Giai đoạn:** 1. **Liên kết:** UC-08. **Nguồn/lý do:** PDF tr.6; D-18; đáp ứng sự kiện trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-10.01 | Hệ thống phải cho khách lọc sự kiện công bố theo ngày, địa điểm và trạng thái. | Kết quả chỉ gồm sự kiện khớp các bộ lọc. |
| FR-10.02 | Hệ thống phải hiển thị nguồn và thời điểm cập nhật trên chi tiết sự kiện. | Thông tin hiển thị khớp bản dữ liệu công bố. |
| FR-10.03 | Hệ thống phải cho du khách thêm sự kiện vào lịch thuộc sở hữu nếu sự kiện phù hợp thời gian chuyến đi. | Điểm dừng mới được kiểm tra theo FR-06 trước khi lưu. |
| FR-10.04 | Hệ thống phải từ chối thêm sự kiện đã hủy như một hoạt động khả dụng. | Sự kiện hủy không được thêm thành điểm dừng hợp lệ. |

#### FR-11 - Yêu cầu đặt dịch vụ

**Giai đoạn:** 1. **Liên kết:** UC-02, UC-09. **Nguồn/lý do:** PDF tr.6,8; D-04, D-12; đáp ứng yêu cầu đặt dịch vụ trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-11.01 | Hệ thống phải hiển thị hồ sơ đối tác, giá theo đơn vị, thời gian khả dụng và điều kiện đặt của dịch vụ công bố. | Thông tin hiển thị khớp dịch vụ đang có hiệu lực. |
| FR-11.02 | Hệ thống phải tạo đơn CHO_DUYET khi du khách xác nhận yêu cầu thỏa BR-06, BR-10 và dữ liệu số lượng, liên hệ hợp lệ. | Đơn có mã và hạn duyệt; đầu vào không hợp lệ không tạo đơn. |
| FR-11.03 | Hệ thống phải lưu bản chụp giá và quy tắc áp dụng tại thời điểm tạo đơn. | Thay giá cấu hình sau đó không đổi đơn đã tạo. |
| FR-11.04 | Hệ thống phải trả lại đơn đã tạo khi nhận lại cùng một yêu cầu với khóa chống lặp đã xử lý. | Gửi lại cùng khóa không tạo thêm đơn. |

#### FR-12 - Xử lý yêu cầu đặt

**Giai đoạn:** 1. **Liên kết:** UC-10. **Nguồn/lý do:** D-04, D-12; GĐ2 mở rộng theo FR-26; đáp ứng xử lý yêu cầu đặt trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-12.01 | Hệ thống phải chuyển đơn còn hạn từ CHO_DUYET sang CHO_THANH_TOAN khi người có quyền chấp nhận và giữ đủ tồn theo BR-07. | Chấp nhận thành công tạo đúng một phần tồn giữ và hạn thanh toán +30 phút. |
| FR-12.02 | Hệ thống phải chuyển đơn CHO_DUYET sang TU_CHOI khi người có quyền từ chối kèm lý do. | Đơn bị từ chối có lý do, người xử lý và thời điểm. |
| FR-12.03 | Hệ thống phải chuyển đơn chưa được duyệt sang HET_HAN khi hết hạn 24 giờ theo BR-06. | Duyệt tại hoặc sau hạn bị từ chối. |
| FR-12.04 | Hệ thống phải giải phóng tồn giữ của đơn CHO_THANH_TOAN khi đơn hết hạn thanh toán. | Đơn thành HET_HAN và tồn khả dụng được trả đúng số lượng. |

#### FR-13 - Thanh toán đơn giả lập

**Giai đoạn:** 1. **Liên kết:** UC-11. **Nguồn/lý do:** D-03, D-04; đáp ứng thanh toán đơn giả lập trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-13.01 | Hệ thống phải cung cấp lựa chọn mô phỏng thành công, thất bại hoặc hủy lần thử cho chủ đơn đủ điều kiện thanh toán. | Đơn sai chủ, sai trạng thái hoặc hết hạn không được thực hiện thanh toán. |
| FR-13.02 | Hệ thống phải xác định số tiền thanh toán từ bản chụp giá của đơn ở máy chủ. | Số tiền trình duyệt sửa không thay giá giao dịch. |
| FR-13.03 | Hệ thống phải chuyển đơn sang DA_XAC_NHAN khi một lần thanh toán mock thành công trước hạn. | Có một bản ghi thành công tương ứng với trạng thái xác nhận. |
| FR-13.04 | Hệ thống phải giữ đơn ở CHO_THANH_TOAN khi lần thử thất bại hoặc bị hủy mà đơn vẫn còn hạn. | Hủy lần thử không thành hủy đơn. |
| FR-13.05 | Hệ thống phải trả lại kết quả đã ghi khi nhận lại cùng khóa thanh toán. | Retry không tạo giao dịch thành công thứ hai. |

#### FR-14 - Vòng đời đơn và hoàn tiền

**Giai đoạn:** 1. **Liên kết:** UC-10, UC-12. **Nguồn/lý do:** D-13; đáp ứng vòng đời đơn và hoàn tiền trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-14.01 | Hệ thống phải cho du khách xem lịch sử các đơn thuộc tài khoản của mình. | Không có đơn của tài khoản khác trong kết quả. |
| FR-14.02 | Hệ thống phải chuyển đơn đủ điều kiện sang DA_HUY khi chủ đơn xác nhận hủy theo BR-08. | Hủy trước giờ bắt đầu được chấp nhận; từ giờ bắt đầu bị từ chối. |
| FR-14.03 | Hệ thống phải ghi hoàn tiền giả lập toàn bộ số tiền đã trả khi hủy hợp lệ một đơn đã thanh toán. | Số tiền hoàn khớp giao dịch thành công và chỉ ghi một lần. |
| FR-14.04 | Hệ thống phải chuyển đơn DA_XAC_NHAN sang HOAN_THANH khi người có quyền ghi nhận đã phục vụ sau giờ kết thúc. | Đơn chưa trả tiền, đã hủy hoặc chưa kết thúc không được hoàn thành. |

#### FR-15 - Thông báo trong web

**Giai đoạn:** 1. **Liên kết:** UC-22. **Nguồn/lý do:** D-18; đáp ứng thông báo trong web trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-15.01 | Hệ thống phải tạo thông báo cho chủ thể liên quan khi có kết quả duyệt, từ chối, hết hạn, thanh toán, hủy đơn hoặc xử lý báo lỗi. | Mỗi sự kiện hợp lệ sinh thông báo đúng tài khoản. |
| FR-15.02 | Hệ thống phải cho người nhận đánh dấu thông báo của mình là đã đọc. | Trạng thái đã đọc được lưu và đọc lại được. |
| FR-15.03 | Hệ thống phải kiểm tra quyền trên đối tượng đích khi người dùng mở liên kết từ thông báo. | Liên kết không bỏ qua kiểm tra sở hữu hoặc phạm vi. |

#### FR-16 - Báo lỗi nội dung

**Giai đoạn:** 1. **Liên kết:** UC-13. **Nguồn/lý do:** PDF tr.11; đáp ứng báo lỗi nội dung trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-16.01 | Hệ thống phải tiếp nhận báo lỗi có loại lỗi, mô tả và tham chiếu nội dung từ du khách đăng nhập. | Báo lỗi hợp lệ có mã theo dõi; trường bắt buộc thiếu bị từ chối. |
| FR-16.02 | Hệ thống phải cho quản trị cập nhật trạng thái xử lý và phản hồi của báo lỗi. | Lịch sử có người xử lý, trạng thái và phản hồi. |
| FR-16.03 | Hệ thống phải chỉ cho người gửi xem báo lỗi của mình ngoài các tài khoản có quyền xử lý. | Truy cập phiếu của người khác bị từ chối. |
| FR-16.04 | Hệ thống phải giữ nội dung công khai nguyên trạng cho tới khi bản sửa được duyệt. | Gửi báo lỗi không tự thay thông tin địa điểm hoặc sự kiện. |

#### FR-17 - Nội dung và kiểm duyệt

**Giai đoạn:** 1. **Liên kết:** UC-14. **Nguồn/lý do:** PDF tr.8,10-11; D-11; đáp ứng nội dung và kiểm duyệt trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-17.01 | Hệ thống phải cho quản trị tạo bản nháp của địa điểm, bài viết, audio, sự kiện, hồ sơ đối tác và dịch vụ. | Mỗi loại nội dung có bản nháp không xuất hiện công khai. |
| FR-17.02 | Hệ thống phải cho quản trị sửa nội dung theo quy trình phiên bản BR-12. | Bản sửa chờ duyệt không thay bản công bố cũ. |
| FR-17.03 | Hệ thống phải cho quản trị duyệt hoặc từ chối bản nội dung đang chờ duyệt. | Chỉ bản được duyệt chuyển sang Công bố; từ chối có lý do. |
| FR-17.04 | Hệ thống phải loại nội dung chưa công bố hoặc đã ẩn khỏi tìm kiếm công khai và tập dữ liệu AI. | Không truy xuất được các bản này qua các kênh công khai. |
| FR-17.05 | Hệ thống phải lưu lịch sử thay đổi của từng phiên bản nội dung. | Truy xuất được người thay đổi, thời điểm và bản nội dung. |

#### FR-18 - Quản trị vận hành

**Giai đoạn:** 1. **Liên kết:** UC-14. **Nguồn/lý do:** D-11, D-19; đáp ứng quản trị vận hành trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-18.01 | Hệ thống phải cho quản trị được cấp quyền cập nhật vai trò và phạm vi dữ liệu của tài khoản. | Quyền mới được áp dụng cho yêu cầu tiếp theo. |
| FR-18.02 | Hệ thống phải cho quản trị được cấp quyền khóa hoặc mở khóa tài khoản. | Tài khoản bị khóa không tiếp tục truy cập chức năng yêu cầu đăng nhập. |
| FR-18.03 | Hệ thống phải cho quản trị cập nhật tồn dịch vụ mà không giảm dưới số lượng đã cam kết. | Giảm tồn dưới phần giữ hoặc đã bán bị từ chối. |
| FR-18.04 | Hệ thống phải cho quản trị cập nhật tham số nghiệp vụ theo phiên bản và ngày hiệu lực. | Giao dịch mới dùng cấu hình có hiệu lực; giao dịch cũ giữ bản chụp. |

#### FR-19 - Đa ngôn ngữ

**Giai đoạn:** 2. **Liên kết:** UC-07, UC-14. **Nguồn/lý do:** PDF tr.6,10; D-08; đáp ứng đa ngôn ngữ trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-19.01 | Hệ thống phải cho người dùng chọn giao diện tiếng Việt, Anh, Hàn hoặc Trung. | Các nhãn giao diện được hiển thị theo ngôn ngữ được chọn. |
| FR-19.02 | Hệ thống phải hiển thị bài viết và audio theo bản dịch đã công bố của ngôn ngữ được chọn. | Nội dung không bị gắn sai ngôn ngữ. |
| FR-19.03 | Hệ thống phải thông báo thiếu bản dịch trước khi dùng nội dung tiếng Việt thay thế. | Người dùng phân biệt được bản dịch và bản thay thế. |
| FR-19.04 | Hệ thống phải cung cấp danh mục cụm từ giao tiếp Jrai kèm nghĩa và bản thu khi bản thu đã công bố. | Cụm từ có nghĩa; bản thu không tồn tại không được báo là có. |

#### FR-20 - Quyền premium

**Giai đoạn:** 2. **Liên kết:** UC-15. **Nguồn/lý do:** PDF tr.8; D-14; đáp ứng quyền premium trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-20.01 | Hệ thống phải cung cấp gói premium 49.000 VND/tháng và 199.000 VND/năm. | Giá và thời hạn trên trang mua khớp cấu hình gói. |
| FR-20.02 | Hệ thống phải cấp hoặc nối hạn premium theo BR-14 sau thanh toán giả lập thành công. | Một giao dịch cấp quyền một lần; thất bại không cấp quyền. |
| FR-20.03 | Hệ thống phải tắt gia hạn tự động của gói premium. | Hết hạn không phát sinh thanh toán hoặc gia hạn tự động. |
| FR-20.04 | Hệ thống phải loại quảng cáo khỏi giao diện của tài khoản premium còn hạn. | Không có vị trí quảng cáo hiển thị với quyền còn hiệu lực. |
| FR-20.05 | Hệ thống phải giữ quyền đọc lịch cá nhân và offline cơ bản khi premium hết hạn. | Hết hạn không xóa hoặc khóa nội dung cơ bản. |

#### FR-21 - Gói offline nâng cao

**Giai đoạn:** 2. **Liên kết:** UC-15. **Nguồn/lý do:** PDF tr.6; D-06, D-14; đáp ứng gói offline nâng cao trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-21.01 | Hệ thống phải cho tài khoản premium còn hạn tải gói bản đồ và audio theo khu vực, ngôn ngữ. | Gói được chọn khớp vùng/ngôn ngữ; tài khoản không có quyền không tải được. |
| FR-21.02 | Hệ thống phải cho người dùng xóa gói offline nâng cao trên thiết bị của mình. | Gói đã xóa không còn chiếm tài nguyên do ứng dụng quản lý. |
| FR-21.03 | Hệ thống phải chỉ thay bản offline nâng cao đang dùng sau khi bản cập nhật hoàn chỉnh vượt kiểm tra toàn vẹn. | Tải lỗi không thay gói đang hoạt động. |
| FR-21.04 | Hệ thống phải xác minh quyền premium theo BR-15 trước khi mở tài nguyên offline nâng cao. | Quyền hết hạn bị khóa; quyền không xác minh được yêu cầu kết nối. |

#### FR-22 - Chatbot và cá nhân hóa

**Giai đoạn:** 2. **Liên kết:** UC-16. **Nguồn/lý do:** PDF tr.6,12; D-17; đáp ứng chatbot và cá nhân hóa trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-22.01 | Hệ thống phải tạo câu trả lời chatbot dựa trên nội dung đã duyệt. | Bộ kiểm thử không nhận thông tin được khẳng định ngoài căn cứ truy xuất. |
| FR-22.02 | Hệ thống phải gắn liên kết nguồn nội bộ cho thông tin được dùng trong câu trả lời chatbot. | Liên kết mở đúng nội dung công bố liên quan. |
| FR-22.03 | Hệ thống phải thông báo chưa có thông tin khi không tìm được căn cứ cho câu hỏi. | Câu hỏi ngoài dữ liệu không được trả như sự thật đã xác nhận. |
| FR-22.04 | Hệ thống phải chỉ dùng hành vi cá nhân cho đề xuất khi tài khoản đang có lựa chọn đồng ý. | Rút đồng ý khiến các đề xuất mới không dùng lịch sử hành vi. |

#### FR-23 - Gợi ý thay đổi lịch

**Giai đoạn:** 2. **Liên kết:** UC-17. **Nguồn/lý do:** PDF tr.6,12; D-17; đáp ứng gợi ý thay đổi lịch trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-23.01 | Hệ thống phải lấy dự báo thời tiết và trạng thái đóng cửa có nguồn cho các điểm trong lịch được phép truy cập. | Dữ liệu được gắn nguồn và thời điểm quan sát/cập nhật. |
| FR-23.02 | Hệ thống phải tạo phương án thay thế thỏa ràng buộc lịch khi phát hiện điều kiện ảnh hưởng chuyến đi và đủ dữ liệu. | Phương án vượt kiểm tra FR-05, FR-06 trước khi đề xuất. |
| FR-23.03 | Hệ thống phải cho du khách xem khác biệt giữa lịch hiện tại và phương án thay thế. | Các thay đổi điểm, giờ và chi phí được thể hiện trước xác nhận. |
| FR-23.04 | Hệ thống phải chỉ áp dụng phương án sau khi chủ lịch xác nhận. | Bỏ qua đề xuất giữ lịch cũ; áp dụng không tự sửa đơn hoặc thanh toán. |

#### FR-24 - Ước tính mật độ khách

**Giai đoạn:** 2. **Liên kết:** UC-17. **Nguồn/lý do:** PDF tr.6; D-17; đáp ứng ước tính mật độ khách trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-24.01 | Hệ thống phải hiển thị ước tính mật độ kèm phạm vi, thời điểm và chất lượng dữ liệu khi dữ liệu đáp ứng chính sách đủ dữ liệu đang có hiệu lực. | Kết quả có metadata và bản chính sách được áp dụng. |
| FR-24.02 | Hệ thống phải hiển thị chưa đủ dữ liệu thay cho một con số khi dữ liệu không đạt chính sách đủ dữ liệu. | Dữ liệu dưới ngưỡng không tạo ước tính số giả. |

#### FR-25 - Đồng bộ sự kiện

**Giai đoạn:** 2. **Liên kết:** UC-08, UC-14. **Nguồn/lý do:** PDF tr.6; D-18; đáp ứng đồng bộ sự kiện trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-25.01 | Hệ thống phải đồng bộ sự kiện từ nguồn API được quản trị cấu hình và có quyền sử dụng. | Nguồn chưa được cho phép không được thực thi đồng bộ. |
| FR-25.02 | Hệ thống phải nhận dạng sự kiện trùng để cập nhật cùng bản ghi thay vì tạo bản công khai lặp. | Đồng bộ lặp cùng dữ liệu không nhân đôi sự kiện. |
| FR-25.03 | Hệ thống phải cập nhật trạng thái hủy theo dữ liệu nguồn đã được xác minh. | Sự kiện nguồn hủy được đánh dấu tương ứng. |
| FR-25.04 | Hệ thống phải lưu nguồn và thời điểm của mỗi lần đồng bộ. | Lịch sử truy được lần nhập và lỗi tương ứng. |
| FR-25.05 | Hệ thống phải giữ dữ liệu công bố đang có khi nguồn đồng bộ lỗi. | API lỗi không gây xóa hàng loạt sự kiện. |

#### FR-26 - Cổng đối tác và cộng tác viên

**Giai đoạn:** 2. **Liên kết:** UC-10, UC-18. **Nguồn/lý do:** PDF tr.8,10; D-15; đáp ứng cổng đối tác và cộng tác viên trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-26.01 | Hệ thống phải cho đối tác quản lý hồ sơ, dịch vụ và tồn thuộc phạm vi đối tác được cấp. | Truy cập dữ liệu đối tác khác bị từ chối. |
| FR-26.02 | Hệ thống phải cho đối tác xử lý đơn thuộc mình theo FR-12 và FR-14. | Quy tắc hạn, tồn, trạng thái không thay đổi so với quản trị. |
| FR-26.03 | Hệ thống phải cho cộng tác viên tạo và gửi bản nội dung của mình để duyệt. | Nội dung gửi có người soạn và trạng thái Chờ duyệt. |
| FR-26.04 | Hệ thống phải yêu cầu phê duyệt của quản trị trước khi công bố bản sửa hồ sơ hoặc nội dung do đối tác, cộng tác viên gửi. | Người gửi không tự công bố bản chờ duyệt. |

#### FR-27 - Gói đối tác và hoa hồng

**Giai đoạn:** 2. **Liên kết:** UC-20. **Nguồn/lý do:** PDF tr.8; D-16; đáp ứng gói đối tác và hoa hồng trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-27.01 | Hệ thống phải cho quản trị cấu hình giá, hạn mức và quyền lợi của gói đối tác theo phiên bản. | Mỗi gói được kích hoạt có cấu hình và ngày hiệu lực. |
| FR-27.02 | Hệ thống phải áp dụng quyền gói đối tác sau khi thanh toán giả lập mua gói thành công. | Thành công áp quyền đúng gói; thất bại không thay quyền. |
| FR-27.03 | Hệ thống phải giới hạn số sản phẩm và quyền thống kê, ưu tiên hiển thị theo gói đối tác còn hiệu lực. | Vượt hạn mức bị từ chối; quyền trả về khớp cấu hình gói. |
| FR-27.04 | Hệ thống phải ghi hoa hồng mô phỏng một lần khi đơn hoàn thành theo BR-16. | Số tiền đúng tỷ lệ chụp, mặc định 10%; xử lý lại không ghi khoản thứ hai. |

#### FR-28 - Quảng cáo

**Giai đoạn:** 2. **Liên kết:** UC-19. **Nguồn/lý do:** PDF tr.8; D-16, D-17; đáp ứng quảng cáo trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-28.01 | Hệ thống phải cho quản trị cấu hình chiến dịch quảng cáo với vị trí, thời gian và ngân sách mô phỏng. | Chiến dịch lưu đủ tham số và phiên bản. |
| FR-28.02 | Hệ thống phải gắn nhãn tài trợ cho mỗi nội dung quảng cáo được hiển thị. | Mọi vị trí quảng cáo phân biệt được với đề xuất thông thường. |
| FR-28.03 | Hệ thống phải dừng hiển thị chiến dịch ngoài thời hạn hoặc hết ngân sách mô phỏng. | Hai điều kiện giới hạn được kiểm tra trước hiển thị. |
| FR-28.04 | Hệ thống phải chỉ cá nhân hóa quảng cáo theo hành vi khi người dùng đã đồng ý. | Không đồng ý chỉ nhận nội dung theo ngữ cảnh. |
| FR-28.05 | Hệ thống phải áp dụng cùng ràng buộc khả dụng của địa điểm khi dùng nội dung tài trợ trong đề xuất lịch. | Nội dung tài trợ không vượt kiểm tra giờ, ngân sách hoặc trạng thái. |

#### FR-29 - Giới thiệu và thưởng báo lỗi

**Giai đoạn:** 2. **Liên kết:** UC-13, UC-19. **Nguồn/lý do:** PDF tr.9,11; D-16; đáp ứng giới thiệu và thưởng báo lỗi trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-29.01 | Hệ thống phải cho quản trị cấu hình điều kiện và quyền lợi của chương trình giới thiệu hoặc báo lỗi. | Chương trình có phiên bản điều kiện trước khi kích hoạt. |
| FR-29.02 | Hệ thống phải ghi nhận người giới thiệu khi sự kiện giới thiệu thỏa điều kiện chương trình. | Chỉ mở liên kết chưa đủ điều kiện không được cấp thưởng. |
| FR-29.03 | Hệ thống phải cấp quyền lợi báo lỗi sau khi quản trị xác nhận phiếu đáp ứng điều kiện thưởng. | Phiếu bị từ chối không được thưởng. |
| FR-29.04 | Hệ thống phải cấp tối đa một lần thưởng cho cùng sự kiện đủ điều kiện. | Retry hoặc báo lỗi lặp không tạo thêm thưởng. |
| FR-29.05 | Hệ thống phải từ chối thưởng tự giới thiệu. | Người giới thiệu và người được giới thiệu trùng tài khoản không nhận thưởng. |

#### FR-30 - Báo cáo

**Giai đoạn:** 2. **Liên kết:** UC-21. **Nguồn/lý do:** PDF tr.8-9; D-15; đáp ứng báo cáo trong phạm vi đã chọn.

| Mã yêu cầu | Phát biểu yêu cầu | Tiêu chí kiểm chứng |
| --- | --- | --- |
| FR-30.01 | Hệ thống phải cho đối tác xem thống kê đơn, doanh thu và hoa hồng mô phỏng thuộc đối tác mình. | Số liệu khớp các đơn trong phạm vi và khoảng ngày chọn. |
| FR-30.02 | Hệ thống phải cho B2G xem lượt sử dụng, điểm đến quan tâm và xu hướng theo vùng, thời gian ở dạng tổng hợp. | Không có hồ sơ, lịch hoặc tọa độ của từng cá nhân. |
| FR-30.03 | Hệ thống phải áp dụng NFR-13 trước khi hiển thị hoặc xuất báo cáo B2G. | Nhóm nhỏ và dữ liệu định danh không xuất hiện. |
| FR-30.04 | Hệ thống phải cho người được cấp quyền xuất báo cáo đã lọc dưới dạng CSV. | Tệp khớp tập dữ liệu được phép xem và thỏa NFR-24. |

## 5. Quy tắc nghiệp vụ

| Mã | Quy tắc |
| --- | --- |
| BR-01 | Thời gian hiển thị và hạn nghiệp vụ dùng múi giờ Asia/Ho_Chi_Minh; thời gian lưu máy chủ phải mang múi giờ hoặc quy đổi được. Tiền là số nguyên VND. |
| BR-02 | Ngân sách là cho cả đoàn, gồm ăn/ở/vé/di chuyển nội tỉnh; không gồm chi phí đến Gia Lai. Giá lịch trình là ước tính, không phải báo giá đơn đặt. Không tự tăng ngân sách. |
| BR-03 | Một lịch hợp lệ không trùng giờ, không có thời lượng/khoảng cách âm, nằm trong ngày đi và thỏa giờ mở cửa được biết. Thông tin chưa biết phải có cảnh báo; lịch thiếu dữ liệu không được khẳng định chắc chắn khả thi. |
| BR-04 | AI chỉ tham chiếu ID địa điểm đã duyệt trong phạm vi cho phép. Máy chủ kiểm tra schema, ID, giờ, đường đi và chi phí; kết quả không đạt bị từ chối hoặc yêu cầu sửa. Không đưa thẳng nội dung AI vào lịch đã lưu. |
| BR-05 | Tạo/sửa lịch cần mạng; offline GĐ1 chỉ đọc dữ liệu đã tải hoàn chỉnh. Không hứa AI, tồn dịch vụ, sự kiện hay thời tiết thời gian thực khi offline. |
| BR-06 | Chỉ nhận yêu cầu có giờ bắt đầu cách thời điểm gửi **hơn 24 giờ 30 phút**. Hạn duyệt là thời điểm gửi +24 giờ; không duyệt đúng hạn thì đơn hết hạn. |
| BR-07 | Đơn chờ duyệt chưa giữ tồn. Khi duyệt kiểm tra/giữ tồn trong cùng giao dịch, hạn trả tiền = lúc duyệt +30 phút; hết hạn chưa thành công phải nhả tồn. Đơn đã thanh toán giữ phần tồn đã bán cho tới khi hủy hoặc hoàn thành kỳ sử dụng. |
| BR-08 | Hủy hợp lệ khi thời gian máy chủ < giờ bắt đầu; hoàn giả lập 100% nếu đã trả; không phí hủy. Không cho tự hủy từ giờ bắt đầu trở đi hoặc khi đơn đã hoàn thành. Mọi thao tác lặp lại phải cho cùng kết quả, không hoàn nhiều lần. |
| BR-09 | Kết quả thanh toán do máy chủ mô phỏng; không tin trạng thái hoặc số tiền do trình duyệt tự gửi. Thanh toán sau hạn bị từ chối; không khôi phục tồn từ giao dịch đến muộn. |
| BR-10 | Một đơn tương ứng một dịch vụ và một khoảng sử dụng; nhiều dịch vụ tạo các đơn độc lập. Thay lịch trình không tự đổi/hủy đơn, thay đơn không tự viết lại lịch. |
| BR-11 | Giá và điều kiện được chụp lúc gửi đơn. Khi cần thay giá/thời gian phải hủy và đặt lại, không sửa âm thầm đơn đang chờ. |
| BR-12 | Nội dung đi qua Nháp → Chờ duyệt → Công bố hoặc Từ chối; được Ẩn sau công bố. Bản sửa nội dung công bố không thay bản đang hiển thị cho tới khi được duyệt. |
| BR-13 | GĐ1 chỉ quản trị xử lý đơn/nội dung; GĐ2 cấp quyền đối tác theo sở hữu và cộng tác viên theo nội dung mình tạo. Phân quyền kiểm tra ở máy chủ. |
| BR-14 | Premium tháng có hiệu lực từ thanh toán tới cùng thời điểm ngày tương ứng tháng sau; nếu thiếu ngày thì lấy ngày cuối tháng. Gói năm tương tự. Mua thêm khi còn hạn nối từ ngày hết hạn; hết hạn không tự trừ tiền. |
| BR-15 | Quyền premium offline dựa trên bằng chứng quyền có hạn được máy chủ cấp. Giờ hệ thống không đáng tin hoặc không xác minh được hạn thì yêu cầu kết nối để xác minh; lịch và nội dung offline cơ bản vẫn mở. |
| BR-16 | Hoa hồng = giá dịch vụ của đơn × tỷ lệ đã chụp khi đặt, làm tròn đến VND; mặc định 10%; chỉ ghi một lần khi hoàn thành. Không có chuyển tiền/đối soát ngân hàng thật. |
| BR-17 | Giá gói đối tác, hạn mức, quyền lợi thưởng và cấu hình quảng cáo là tham số quản trị; phải có phiên bản và ngày hiệu lực, không áp dụng hồi tố giao dịch cũ. |
| BR-18 | Báo cáo B2G chỉ tổng hợp, ẩn nhóm quá nhỏ; không coi việc bỏ email là đủ ẩn danh. Ngưỡng nhóm đề xuất nằm ở NFR-13. |

BR-06, BR-10/11/14-18 cụ thể hóa cách thực hiện các quy tắc đã thống nhất. Các giá trị kỹ thuật được đánh dấu đề xuất ở tệp 02 để điều chỉnh trong thiết kế chi tiết.

## 6. Trạng thái nghiệp vụ

### 6.1. Đơn đặt

| Trạng thái | Chuyển hợp lệ |
| --- | --- |
| CHO_DUYET | CHO_THANH_TOAN khi duyệt/giữ tồn thành công; TU_CHOI nếu từ chối; HET_HAN nếu quá 24h; DA_HUY nếu khách hủy |
| CHO_THANH_TOAN | DA_XAC_NHAN khi thanh toán giả lập thành công trước hạn; HET_HAN nếu quá hạn; DA_HUY nếu khách hủy |
| DA_XAC_NHAN | DA_HUY và tạo bản hoàn giả lập khi hủy hợp lệ; HOAN_THANH khi quản trị/đối tác ghi nhận đã phục vụ sau giờ kết thúc |
| TU_CHOI / HET_HAN / DA_HUY / HOAN_THANH | Trạng thái kết thúc; không tái mở bằng thao tác của khách |

Thanh toán có trạng thái riêng: CHO_KET_QUA, THANH_CONG, THAT_BAI, DA_HUY_LAN_THU. Hoàn tiền có trạng thái riêng HOAN_GIA_LAP_THANH_CONG. Hủy lần thử thanh toán khác với hủy đơn. Nếu hoàn giả lập chưa ghi được, toàn bộ giao dịch hủy phải rollback để tránh hiển thị đã hoàn khi chưa có bản ghi.

### 6.2. Lịch trình và offline

Lịch trình: Đang đề xuất → Bản nháp đã kiểm tra → Đã lưu. Một bản sửa chỉ thay bản đã lưu sau khi kiểm tra và lưu thành công; số phiên bản ngăn ghi đè từ tab cũ.

Gói offline: Chưa tải → Đang tải → Sẵn sàng hoặc Lỗi. Khi cập nhật, bản Sẵn sàng cũ được giữ tới khi bản mới kiểm tra toàn vẹn thành công. Dữ liệu trình duyệt có thể bị người dùng hoặc trình duyệt xóa; lần mở sau phải báo cần tải lại.

## 7. Dữ liệu và giao diện ngoài

| Nhóm dữ liệu | Thành phần tối thiểu |
| --- | --- |
| Tài khoản | ID, email, mật khẩu đã băm, trạng thái, vai trò/phạm vi, sở thích, lựa chọn đồng ý |
| Nội dung | ID POI/sự kiện/audio, bản dịch, nguồn, tọa độ, giá/đơn vị, giờ mở cửa, trạng thái, phiên bản |
| Lịch trình | Chủ sở hữu, đầu vào, ngày/điểm dừng/chặng đi, ước tính, cảnh báo, phiên bản |
| Dịch vụ/đơn | Đối tác, khoảng khả dụng, tồn, giá chụp, người đặt, thời gian, trạng thái, hạn duyệt/trả tiền |
| Thanh toán | Mã đơn/gói, mã lần thử, số tiền từ máy chủ, kết quả mock, khóa chống lặp, bản hoàn giả lập |
| Quyền lợi | Loại gói, ngày bắt đầu/kết thúc, phiên bản quyền, sự kiện thưởng và hoa hồng mô phỏng |
| Vận hành | Báo lỗi, thông báo, nhật ký duyệt/cấu hình, nhật ký truy cập quản trị, dữ liệu tổng hợp |

- AI gọi từ máy chủ; đầu vào tối thiểu hóa, không gửi email/mật khẩu/thông tin liên hệ đặt dịch vụ.
- Bản đồ cần tọa độ và thời lượng tuyến thực tế từ nhà cung cấp hoặc dữ liệu tuyến đã kiểm chứng; khoảng cách đường chim bay không được ghi là thời gian đi thực tế.
- Dữ liệu tuyến thiếu/hết hạn phải có cảnh báo, không tự thay bằng con số AI phỏng đoán.
- Kho trình duyệt lưu app shell và gói offline có phân vùng tài khoản; đăng xuất xóa dữ liệu riêng và quyền đã cache trên thiết bị đó.
- Không tích hợp cổng thu tiền thật; màn hình, chứng từ và báo cáo ghi rõ “giả lập”.
- Sự kiện 244 là dữ liệu bối cảnh của năm 2026 trong PDF, không phải hằng số hoặc cam kết có API đồng bộ.

## 8. Truy vết nguồn → yêu cầu → use case

| Nguồn PDF | FR | UC |
| --- | --- | --- |
| Tr.1-2,5-6,8: lịch trình AI và tùy chỉnh | 05-07 | 03-05 |
| Tr.6,8: offline, audio | 08-09,19-21 | 06-07,15 |
| Tr.6: sự kiện và AI nâng cao | 10,22-25 | 08,16-17 |
| Tr.6,8,10: cộng đồng, dịch vụ, thanh toán | 11-15,26-27 | 09-12,18,20 |
| Tr.8-9: premium, quảng cáo, B2G và dữ liệu tổng hợp | 20,27-30 | 15,19-21 |
| Tr.9,11: giới thiệu, báo lỗi, kiểm duyệt | 16-17,26,29 | 13-14,18-19 |
| Tr.10-12: dữ liệu, quyền kiểm soát, vận hành | 01-02,18 | 01,22 |

Chi tiết UC và sequence liên quan nằm ở tệp 04-05. Các FR bổ sung từ trao đổi được truy vết qua tệp 06.
