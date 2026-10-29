# Use case details

## Quy ước chung

Luồng ghi “máy chủ kiểm tra” bao gồm xác thực, quyền theo sở hữu/phạm vi và đầu vào. Thông báo lỗi không được tiết lộ dữ liệu người khác. Mọi use case có ghi dữ liệu phải giữ dữ liệu cũ nếu giao dịch thất bại. Tiền điều kiện “đăng nhập” áp dụng cho tài khoản còn hoạt động. ID FR tham chiếu tệp 01; các ngưỡng kiểm thử tham chiếu tệp 02.

## UC-01 - Đăng ký, đăng nhập và khôi phục tài khoản

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1 / FR-01 |
| Tác nhân / kích hoạt | Khách vãng lai chọn chức năng tài khoản |
| Tiền điều kiện | Truy cập web có mạng; chưa có phiên hoặc muốn đổi phiên |
| Hậu điều kiện | Tài khoản hoặc phiên được tạo; hoặc liên kết đặt lại được gửi an toàn |

**Luồng chính - đăng ký/đăng nhập:** (1) Khách nhập email, mật khẩu. (2) Máy chủ chuẩn hóa email và kiểm tra hợp lệ. (3) Đăng ký thì kiểm tra duy nhất và lưu mật khẩu đã băm; đăng nhập thì xác minh tài khoản. (4) Tạo phiên và mở trang du khách.

**Luồng thay thế:** chọn quên mật khẩu → nhập email → hệ thống luôn trả cùng thông báo → nếu hợp lệ gửi liên kết một lần → khách đặt mật khẩu mới → vô hiệu hóa token và phiên cũ. Đăng xuất vô hiệu hóa phiên và xóa cache riêng trên thiết bị.

**Ngoại lệ/nghiệm thu:** email trùng không tạo tài khoản thứ hai; sai mật khẩu/khóa tài khoản không có phiên; token đã dùng/hết hạn bị từ chối; vượt hạn thử bị giới hạn theo NFR-09. Dịch vụ thư lỗi không hiển thị đã gửi thành công thực tế trong log vận hành.

## UC-02 - Khám phá địa điểm và dịch vụ

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1 / FR-03,04,11 |
| Tác nhân / kích hoạt | Khách tìm kiếm hoặc mở một địa điểm/dịch vụ |
| Tiền điều kiện | Có nội dung công bố; cần mạng cho tìm kiếm mới |
| Hậu điều kiện | Hiển thị dữ liệu công khai, không phát sinh đơn |

**Luồng chính:** (1) Nhập từ khóa/chọn bộ lọc. (2) Hệ thống tìm nội dung công bố trong phạm vi. (3) Hiển thị danh sách và vị trí. (4) Khách mở chi tiết, xem giá/đơn vị, giờ, nguồn, ngày cập nhật, dịch vụ liên quan và liên hệ công khai.

**Thay thế/lỗi:** không có kết quả → gợi ý bỏ bớt bộ lọc; từ chối quyền vị trí → nhập vị trí thủ công; bản đồ lỗi → vẫn xem danh sách; địa điểm đã ẩn → báo không còn khả dụng. **Nghiệm thu:** nội dung chưa duyệt không xuất hiện; giá chưa biết không hiển thị 0đ.

## UC-03 - Tạo lịch bằng AI thật

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1 / FR-05 |
| Tác nhân / kích hoạt | Du khách chọn tạo lịch |
| Tiền điều kiện | Đăng nhập, có mạng, có POI được duyệt và dịch vụ AI được cấu hình |
| Hậu điều kiện | Có bản lịch đề xuất đã kiểm tra để xem/sửa; chưa tự lưu, chưa đặt dịch vụ |
| Sequence | SEQ-01 |

**Luồng chính:**

1. Nhập ngày đi, số ngày, số người, ngân sách cả đoàn, điểm xuất phát, phương tiện, sở thích.
2. Máy chủ kiểm tra số dương, ngày hợp lệ, cấu hình giới hạn và phạm vi.
3. Lấy POI công bố và thông tin tuyến/giờ/giá; gửi dữ liệu tối thiểu tới AI.
4. AI trả cấu trúc lịch; máy chủ kiểm tra ID, thời gian, chi phí, ràng buộc và dữ liệu tuyến.
5. Hiển thị bản đề xuất theo ngày, tổng ước tính, nguồn và cảnh báo thông tin thiếu.
6. Du khách chuyển sang UC-04 hoặc UC-05 nếu muốn giữ lịch.

**Thay thế/lỗi:** đầu vào không đủ → yêu cầu bổ sung; không có lịch thỏa ngân sách → báo lý do, đề nghị sửa; AI trả POI giả/kết quả sai → từ chối; timeout → báo thử lại, không thay lịch cũ; thiếu tuyến kiểm chứng → không khẳng định lịch chắc chắn khả thi. **Nghiệm thu:** không tự nâng ngân sách; chỉ POI đã duyệt được chấp nhận; đạt NFR-02/20 trên tập đo.

## UC-04 - Tùy chỉnh lịch trình

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1 / FR-06 |
| Tác nhân / kích hoạt | Du khách sửa lịch đề xuất hoặc lịch của mình |
| Tiền điều kiện | Đăng nhập, có mạng, có bản lịch được phép sửa |
| Hậu điều kiện | Bản nháp cập nhật đã kiểm tra hoặc bản trước được giữ |
| Sequence | SEQ-02 |

**Luồng chính:** (1) Thêm/xóa/đổi điểm, di chuyển điểm bằng kéo-thả/nút, đổi thời lượng/phương tiện. (2) Gửi thay đổi và phiên bản gốc. (3) Tính lại chặng bị ảnh hưởng, giờ đến/đi và chi phí. (4) Hiển thị khác biệt và cảnh báo. (5) Người dùng xác nhận lưu qua UC-05.

**Thay thế/lỗi:** điểm đóng cửa, trùng giờ hoặc vượt ngân sách → chỉ rõ xung đột, chưa cho lưu là lịch hợp lệ; phiên bản đã thay đổi ở tab khác → yêu cầu tải lại/so sánh, không ghi đè; mất mạng → giữ bản đang xem, báo cần kết nối. **Nghiệm thu:** đổi thứ tự phải đổi cả thời gian chặng tương ứng, không chỉ thứ tự giao diện; không sửa đơn dịch vụ liên quan.

## UC-05 - Quản lý lịch đã lưu

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1 / FR-07 |
| Tác nhân / kích hoạt | Du khách lưu hoặc quản lý danh sách chuyến |
| Tiền điều kiện | Đăng nhập; tạo/sửa/xóa cần mạng |
| Hậu điều kiện | Lịch có chủ sở hữu và phiên bản, hoặc lịch được xóa |

**Luồng chính:** (1) Chọn lưu lịch đã kiểm tra và đặt tên. (2) Kiểm tra sở hữu, ràng buộc và phiên bản. (3) Lưu lịch. (4) Mở danh sách/chi tiết, đổi tên, sao chép hoặc yêu cầu xóa. (5) Xóa phải xác nhận, xóa cả bản offline tương ứng trên thiết bị khi đồng bộ được.

**Lỗi/nghiệm thu:** API ID của người khác bị từ chối; lưu trùng do retry không tạo nhiều bản không chủ ý; xóa lịch không hủy đơn. Khi mở bản offline cũ của lịch đã xóa từ thiết bị khác, lần kết nối sau phải đồng bộ trạng thái xóa.

## UC-06 - Tải và xem lịch offline cơ bản

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1 / FR-08 |
| Tác nhân / kích hoạt | Du khách chọn tải offline hoặc mở lại khi mất mạng |
| Tiền điều kiện | Tải: đăng nhập và có mạng; xem: cùng tài khoản/thiết bị còn dữ liệu và quyền đọc cục bộ chưa bị đăng xuất |
| Hậu điều kiện | Bản đọc offline hoàn chỉnh hoặc thông báo không đủ dữ liệu |
| Sequence | SEQ-03 |

**Luồng chính:** (1) Chọn lịch đã lưu. (2) Xem phạm vi, phiên bản và dung lượng. (3) Tải app shell, lịch và thông tin POI vào vùng tạm. (4) Kiểm tra đủ tệp/phiên bản rồi chuyển trạng thái Sẵn sàng. (5) Khi offline mở bản cục bộ và hiển thị thời điểm tải.

**Lỗi/nghiệm thu:** tải gián đoạn/hết quota → báo lỗi, giữ gói hoàn chỉnh cũ; chưa từng tải → hướng dẫn kết nối; cache bị xóa → báo cần tải lại; đăng xuất → không còn dữ liệu riêng để tài khoản khác đọc qua ứng dụng. Offline không cho sửa, đặt, trả tiền hoặc gọi AI.

## UC-07 - Nghe thuyết minh

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1/2 / FR-09,19 |
| Tác nhân / kích hoạt | Khách chọn audio của địa điểm |
| Tiền điều kiện | Audio công bố, có mạng; GĐ2 có thể dùng gói tải trước hợp lệ |
| Hậu điều kiện | Audio được phát hoặc lỗi được giải thích |

**Luồng chính:** chọn địa điểm → chọn ngôn ngữ có sẵn → phát/dừng/tua và xem bản chép lời. **Thay thế:** GĐ1 chỉ Việt; GĐ2 thiếu bản dịch báo rõ và đề nghị bản Việt; nội dung premium chưa có quyền → mời xem quyền lợi, không tự mua; lỗi audio → giữ văn bản. **Nghiệm thu:** không tự phát âm thanh ngay khi mở trang; ngôn ngữ hiển thị đúng bản thu.

## UC-08 - Xem và thêm sự kiện

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1/2 / FR-10,25 |
| Tác nhân / kích hoạt | Khách xem lịch sự kiện; du khách chọn thêm vào chuyến |
| Tiền điều kiện | Sự kiện công bố; thêm vào lịch cần đăng nhập và mạng |
| Hậu điều kiện | Xem chi tiết hoặc thêm điểm dừng có kiểm tra thời gian |

**Luồng chính:** lọc ngày/khu vực → xem giờ, địa điểm, nguồn, lần cập nhật và trạng thái → chọn lịch đích → hệ thống kiểm tra ngày và tính lại qua UC-04 → lưu. **Lỗi/nghiệm thu:** sự kiện hủy/ngoài ngày đi không thêm như hoạt động hợp lệ; thay đổi nguồn không tự ghi đè lịch của khách; GĐ2 lỗi đồng bộ không xóa toàn bộ sự kiện đã công bố.

## UC-09 - Gửi yêu cầu đặt dịch vụ

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1 / FR-11 |
| Tác nhân / kích hoạt | Du khách chọn dịch vụ và yêu cầu đặt |
| Tiền điều kiện | Đăng nhập, mạng, dịch vụ công bố; giờ bắt đầu cách hiện tại >24h30; số lượng hợp lệ |
| Hậu điều kiện | Đơn CHO_DUYET, giá và quy tắc được chụp; chưa giữ tồn/thu tiền |
| Sequence | SEQ-04 |

**Luồng chính:** (1) Chọn thời gian/số lượng. (2) Nhập liên hệ cần thiết. (3) Máy chủ tính giá từ dữ liệu dịch vụ. (4) Khách xem tổng tiền, chính sách và nhãn giả lập. (5) Xác nhận; hệ thống tạo mã đơn, hạn duyệt +24h và thông báo.

**Lỗi/nghiệm thu:** số lượng không còn khả dụng hoặc giờ quá gần → từ chối, không tạo đơn; dữ liệu giá thay đổi trước gửi → hiển thị giá mới để xác nhận lại; retry cùng yêu cầu không tạo đơn thứ hai; mỗi đơn chỉ một dịch vụ.

## UC-10 - Duyệt đơn và ghi nhận hoàn thành

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1/2 / FR-12,14 |
| Tác nhân / kích hoạt | Quản trị; GĐ2 đối tác xử lý đơn thuộc mình |
| Tiền điều kiện | Đăng nhập đúng quyền, đơn đúng trạng thái, còn hạn |
| Hậu điều kiện | CHO_THANH_TOAN, TU_CHOI hoặc HOAN_THANH; thay đổi được ghi log |
| Sequence | SEQ-04,08 |

**Luồng duyệt:** mở đơn → kiểm tra dịch vụ/tồn/thời gian → chọn chấp nhận → khóa/kiểm tra đơn và giữ tồn nguyên tử → đặt hạn trả tiền +30 phút → thông báo khách.

**Thay thế:** từ chối phải có lý do; đơn quá 24h → HET_HAN; thiếu tồn khi duyệt → không chuyển sang chờ trả tiền, cho từ chối có lý do. **Luồng hoàn thành:** sau giờ kết thúc, người có quyền ghi nhận đã phục vụ cho đơn DA_XAC_NHAN → HOAN_THANH → GĐ2 ghi hoa hồng một lần.

**Nghiệm thu:** hai đơn tranh suất cuối chỉ một đơn được duyệt; đối tác không xử lý đơn khác; không hoàn thành đơn đã hủy hoặc chưa thanh toán.

## UC-11 - Thanh toán giả lập

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1 / FR-13 |
| Tác nhân / kích hoạt | Du khách trả tiền cho đơn đã duyệt |
| Tiền điều kiện | Đăng nhập, sở hữu đơn CHO_THANH_TOAN, chưa hết 30 phút và còn tồn giữ |
| Hậu điều kiện | Ghi lần thử; thành công chuyển đơn DA_XAC_NHAN đúng một lần |
| Sequence | SEQ-05 |

**Luồng chính:** (1) Mở đơn và xem số tiền/hạn từ máy chủ. (2) Chọn mô phỏng thành công/thất bại/hủy. (3) Gửi mã đơn, mã lần thử và khóa chống lặp. (4) Máy chủ kiểm tra quyền, khóa đơn, kiểm tra hạn và lấy số tiền đúng. (5) Thành công ghi thanh toán và xác nhận đơn trong cùng giao dịch; thông báo khách.

**Lỗi/nghiệm thu:** thất bại/hủy lần thử vẫn để đơn chờ trong hạn; hết hạn thì HET_HAN, nhả tồn; retry sau khi phản hồi bị mất trả lại kết quả đã ghi; giả số tiền không thay giá; không có nhập thẻ/OTP hoặc thu tiền thật.

## UC-12 - Hủy đơn và hoàn giả lập

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1 / FR-14 |
| Tác nhân / kích hoạt | Du khách chọn hủy đơn của mình |
| Tiền điều kiện | Đăng nhập, đơn chưa bắt đầu sử dụng và chưa ở trạng thái kết thúc |
| Hậu điều kiện | DA_HUY; trả tồn đã giữ; có hoàn giả lập 100% nếu đã trả |
| Sequence | SEQ-06 |

**Luồng chính:** mở đơn → xem chính sách và số tiền hoàn → xác nhận → máy chủ khóa đơn/kiểm tra giờ → ghi hủy, nhả tồn và hoàn giả lập nếu cần trong giao dịch → thông báo kết quả.

**Lỗi/nghiệm thu:** từ đúng giờ bắt đầu trở đi không cho tự hủy; yêu cầu lặp trả cùng kết quả, không hoàn lần hai; nếu thanh toán và hủy chạy cạnh tranh, trạng thái cuối phải nhất quán và không vừa hủy vừa giữ tiền giả lập; lỗi ghi hoàn rollback thao tác hủy.

## UC-13 - Báo lỗi nội dung

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1/2 / FR-16,29 |
| Tác nhân / kích hoạt | Du khách phát hiện thông tin sai; quản trị xử lý |
| Tiền điều kiện | Đăng nhập; nội dung tham chiếu tồn tại hoặc đã từng công bố |
| Hậu điều kiện | Phiếu có trạng thái, phản hồi và lịch sử; GĐ2 có thể nhận thưởng |

**Luồng chính:** chọn báo lỗi → nhập loại/mô tả → tạo phiếu Mới → quản trị nhận và xác minh → sửa qua luồng duyệt nội dung nếu đúng → chấp nhận/từ chối phiếu kèm lý do → thông báo người gửi. **Lỗi/nghiệm thu:** nội dung báo cáo không tự xuất bản; khách chỉ đọc phiếu của mình; cùng lỗi không được nhận thưởng nhiều lần; phiếu không hợp lệ không phát sinh thưởng.

## UC-14 - Quản trị nội dung, tài khoản và cấu hình

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1/2 / FR-17,18,19,25 |
| Tác nhân / kích hoạt | Quản trị mở cổng vận hành |
| Tiền điều kiện | Có quyền tương ứng; có mạng |
| Hậu điều kiện | Nội dung/cấu hình có phiên bản và dấu vết người thay đổi |
| Sequence | SEQ-07 |

**Luồng nội dung:** tạo/sửa địa điểm, sự kiện, audio, hồ sơ đối tác hoặc dịch vụ → lưu nháp → kiểm tra nguồn, tọa độ, giá/đơn vị, tài nguyên và phạm vi → gửi duyệt → duyệt/công bố hoặc từ chối có lý do. Bản sửa không thay công khai trước khi duyệt. Cho ẩn nội dung nhưng giữ tham chiếu của đơn/lịch cũ.

**Luồng quản trị khác:** cấp/thu hồi vai trò và phạm vi, khóa tài khoản, quản lý tồn, cấu hình thời hạn/quyền gói theo ngày hiệu lực. GĐ2 cấu hình bản dịch và nguồn API sự kiện, chạy đồng bộ, xem lỗi/trùng trước khi công bố. **Nghiệm thu:** thiếu quyền bị từ chối phía máy chủ; mọi thay đổi có log; lỗi đồng bộ không xóa dữ liệu tốt.

## UC-15 - Premium và offline nâng cao

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 2 / FR-20,21 |
| Tác nhân / kích hoạt | Du khách chọn nâng cấp hoặc tải gói |
| Tiền điều kiện | Đăng nhập, có mạng để mua/tải/xác minh quyền; gói được cấp phép offline |
| Hậu điều kiện | Quyền premium đúng hạn; gói hoàn chỉnh có thể xem offline |
| Sequence | SEQ-09 |

**Luồng chính:** chọn tháng 49.000đ hoặc năm 199.000đ → xem ngày hiệu lực/quyền lợi → thanh toán giả lập thành công → cấp/nối hạn quyền một lần → chọn vùng/ngôn ngữ → kiểm tra dung lượng → tải và xác minh toàn vẹn → xem bản đồ/audio offline. Không tự gia hạn; premium không thấy quảng cáo.

**Lỗi/nghiệm thu:** mua thất bại không cấp quyền; tải lỗi giữ bản cũ; hết hạn khóa phần premium, vẫn mở lịch cá nhân và POI cơ bản; bằng chứng quyền không xác minh được thì yêu cầu kết nối; không gọi xem bản đồ là định tuyến offline.

## UC-16 - Chatbot và cá nhân hóa

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 2 / FR-22 |
| Tác nhân / kích hoạt | Du khách hỏi chatbot hoặc xem đề xuất |
| Tiền điều kiện | Đăng nhập và có mạng; sử dụng lịch sử hành vi chỉ khi có đồng ý |
| Hậu điều kiện | Câu trả lời/gợi ý có căn cứ, không tự tạo đơn hoặc đổi lịch |

**Luồng chính:** nhập câu hỏi → truy xuất nội dung đã duyệt → AI trả câu trả lời kèm liên kết nguồn → khách mở địa điểm hoặc tự chọn thêm vào lịch. Cá nhân hóa dùng sở thích và phần lịch sử được phép, có mục rút đồng ý. **Lỗi/nghiệm thu:** không có nguồn thì báo chưa có thông tin; rút đồng ý ngừng dùng hành vi cho đề xuất mới; chỉ dẫn độc hại trong hội thoại không cấp quyền hoặc đọc lịch người khác.

## UC-17 - Thời tiết, mật độ và gợi ý đổi lịch

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 2 / FR-23,24 |
| Tác nhân / kích hoạt | Du khách mở tình hình chuyến hoặc hệ thống có cập nhật |
| Tiền điều kiện | Có lịch, có mạng, có nguồn thời tiết/trạng thái điểm; dữ liệu mật độ nếu đủ |
| Hậu điều kiện | Hiển thị dữ liệu có thời điểm; chỉ tạo bản lịch mới khi khách đồng ý |
| Sequence | SEQ-10 |

**Luồng chính:** lấy dữ liệu theo vị trí/ngày → đánh giá mưa/điểm đóng cửa → đưa phương án thay thế đã kiểm tra → hiển thị khác biệt/chi phí và cảnh báo đơn đã đặt → khách chấp nhận → lưu phiên bản mới. Hiển thị mật độ kèm thời gian và độ tin cậy khi đủ dữ liệu.

**Lỗi/nghiệm thu:** khách bỏ qua thì lịch giữ nguyên; API lỗi hoặc dữ liệu quá cũ phải báo; thiếu dữ liệu mật độ hiển thị “chưa đủ dữ liệu”; không tự hủy dịch vụ hoặc bịa tình trạng thời tiết/đóng cửa.

## UC-18 - Cổng đối tác/cộng tác viên

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 2 / FR-26 |
| Tác nhân / kích hoạt | Đối tác hoặc cộng tác viên đăng nhập cổng riêng |
| Tiền điều kiện | Vai trò và phạm vi đã được quản trị cấp |
| Hậu điều kiện | Bản nháp/chờ duyệt hoặc đơn/tồn thuộc phạm vi được cập nhật |

**Luồng chính:** đối tác tạo/sửa hồ sơ/dịch vụ/tồn của mình, gửi duyệt; xem và duyệt đơn theo UC-10. Cộng tác viên soạn nội dung, đính nguồn, gửi duyệt và xem phản hồi. **Lỗi/nghiệm thu:** không tự công bố nếu chưa duyệt; không đọc đơn hoặc sửa dịch vụ khác; giảm tồn dưới số đã cam kết bị từ chối; giao dịch cũ giữ giá chụp.

## UC-19 - Quảng cáo, giới thiệu và thưởng báo lỗi

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 2 / FR-28,29 |
| Tác nhân / kích hoạt | Quản trị cấu hình chiến dịch; du khách tham gia |
| Tiền điều kiện | Quản trị có quyền; người nhận thưởng có tài khoản hợp lệ |
| Hậu điều kiện | Chiến dịch có hiệu lực hoặc quyền lợi được cấp một lần |

**Luồng chính:** quản trị cấu hình thời gian, vị trí, ngân sách mô phỏng, điều kiện và quyền lợi → duyệt/kích hoạt → hiển thị quảng cáo gắn nhãn hoặc xét sự kiện đủ điều kiện thưởng → ghi sổ và cấp quyền. Giới thiệu chỉ tính sau điều kiện cấu hình, không ngay khi mở liên kết; báo lỗi chỉ thưởng sau xác minh.

**Lỗi/nghiệm thu:** premium không có quảng cáo; không có đồng ý hành vi chỉ được quảng cáo theo ngữ cảnh; tự giới thiệu/trùng sự kiện không được thưởng; chiến dịch hết hạn dừng hiển thị; quảng cáo không đưa điểm đóng cửa vào lịch hợp lệ.

## UC-20 - Gói đối tác và hoa hồng mô phỏng

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 2 / FR-27 |
| Tác nhân / kích hoạt | Đối tác mua gói; quản trị cấu hình hoặc hoàn tất đơn |
| Tiền điều kiện | Có quyền đối tác; gói/giá có phiên bản; thanh toán vẫn giả lập |
| Hậu điều kiện | Quyền gói cập nhật hoặc có bản ghi hoa hồng mô phỏng |

**Luồng chính:** xem gói cơ bản/tiêu chuẩn/pro → chọn gói có cấu hình rõ → thanh toán mock → áp dụng quyền/hạn mức. Khi đơn HOAN_THANH, ghi hoa hồng theo tỷ lệ chụp, mặc định 10%, một lần; đối tác xem số liệu riêng. **Lỗi/nghiệm thu:** mua thất bại không cấp quyền; hết hạn gói không xóa đơn/lịch sử; không hủy đơn đã hoàn thành; thay tỷ lệ mới không đổi khoản cũ; không có lệnh chuyển tiền thật.

## UC-21 - Báo cáo tổng hợp và xuất CSV

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 2 / FR-30 |
| Tác nhân / kích hoạt | Đối tác hoặc B2G chọn báo cáo |
| Tiền điều kiện | Đăng nhập, có quyền và phạm vi dữ liệu được cấp |
| Hậu điều kiện | Hiển thị/xuất dữ liệu đúng phạm vi, ghi log xuất |

**Luồng chính:** chọn khoảng ngày/khu vực/chỉ số → máy chủ áp quyền → tổng hợp và ẩn nhóm nhỏ → hiển thị đơn vị/phạm vi/thời điểm → xuất CSV nếu yêu cầu. Đối tác xem đơn, doanh thu và hoa hồng của mình; B2G chỉ xem xu hướng tổng hợp, không xem hồ sơ khách.

**Lỗi/nghiệm thu:** thiếu dữ liệu hiển thị trạng thái rỗng; cấm xuất dữ liệu cá nhân và suy ngược nhóm nhỏ; bộ lọc ngoài phạm vi bị từ chối; giá trị CSV không thực thi như công thức khi mở bằng bảng tính.

## UC-22 - Hồ sơ, dữ liệu cá nhân và thông báo

| Thuộc tính | Nội dung |
| --- | --- |
| GĐ / FR | 1/2 / FR-02,15 |
| Tác nhân / kích hoạt | Du khách mở hồ sơ hoặc trung tâm thông báo |
| Tiền điều kiện | Đăng nhập, có mạng cho cập nhật và dữ liệu mới |
| Hậu điều kiện | Hồ sơ/đồng ý được cập nhật, yêu cầu dữ liệu được ghi hoặc thông báo được đánh dấu đã đọc |

**Luồng chính:** xem/sửa hồ sơ và sở thích; chọn đồng ý hoặc rút đồng ý cá nhân hóa; xem thông báo của mình và mở đối tượng liên quan; gửi yêu cầu xuất/xóa sau bước xác minh chủ tài khoản. Hệ thống ghi phiếu, xử lý và phản hồi theo chính sách lưu trữ.

**Lỗi/nghiệm thu:** liên kết thông báo vẫn phải kiểm tra quyền; dữ liệu tài khoản khác không xuất hiện; yêu cầu xóa không âm thầm hủy đơn đang hoạt động, phải giải thích dữ liệu đang cần giữ và cách xử lý; GĐ1 chưa theo dõi hành vi cho AI nâng cao dù có trường quản lý đồng ý.
