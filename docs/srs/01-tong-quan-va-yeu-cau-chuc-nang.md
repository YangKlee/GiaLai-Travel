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

## 4. Yêu cầu chức năng

Mỗi hàng là một nhóm yêu cầu có tiêu chí kiểm chứng. “Xác nhận” là các trao đổi ngày 29/10/2026 đã được ghi ở tệp 06.

| Mã | GĐ | Yêu cầu và kết quả phải kiểm chứng được | Nguồn |
| --- | --- | --- | --- |
| FR-01 | 1 | Đăng ký bằng email duy nhất và mật khẩu; đăng nhập/đăng xuất; yêu cầu đặt lại mật khẩu bằng liên kết dùng một lần, có hạn. Từ chối tài khoản bị khóa, email trùng và token hết hạn. | Xác nhận; bổ sung vận hành |
| FR-02 | 1 | Quản lý hồ sơ, sở thích và lựa chọn đồng ý cá nhân hóa; cho gửi yêu cầu xuất/xóa dữ liệu tài khoản. Chỉ chủ tài khoản hoặc người có quyền xử lý được truy cập. | PDF tr.12; xác nhận |
| FR-03 | 1 | Tìm kiếm địa điểm/dịch vụ theo tên, loại, khu vực và khoảng giá; xem danh sách/bản đồ. Không có kết quả phải trả trạng thái rỗng có gợi ý đổi bộ lọc. | PDF tr.5-6 |
| FR-04 | 1 | Chi tiết địa điểm có mã, tên, tọa độ, mô tả, ảnh, nguồn, thời điểm cập nhật, giờ mở cửa và giá tham khảo nếu có; phân biệt “chưa có thông tin” với miễn phí/mở cả ngày. | PDF tr.6,8,12 |
| FR-05 | 1 | Nhận ngày bắt đầu, số ngày, số người, ngân sách cả đoàn, điểm xuất phát, phương tiện và sở thích; gọi AI thật tạo lịch theo ngày dựa trên POI đã duyệt. Trả giờ đến/đi, thời gian tham quan, chặng đi, nơi ăn/nghỉ và tổng chi phí ước tính. | PDF tr.5-6,8; xác nhận |
| FR-06 | 1 | Người dùng được thêm/xóa/đổi điểm, kéo-thả thứ tự, đổi thời gian dừng và phương tiện; tính lại các chặng bị ảnh hưởng, thời gian và ngân sách. Hiển thị xung đột trước khi lưu, giữ bản trước nếu cập nhật thất bại. | PDF tr.6 |
| FR-07 | 1 | Lưu lịch theo tài khoản, xem danh sách/chi tiết, đổi tên, tạo bản sao và xóa lịch sau xác nhận. Không cho xem/sửa lịch riêng của tài khoản khác. | Xác nhận; hỗ trợ FR-05/06 |
| FR-08 | 1 | Tải bản chỉ đọc của lịch đã lưu và thông tin POI trong lịch để dùng offline miễn phí; hiển thị tiến độ, dung lượng ước tính, thời điểm tải và trạng thái sẵn sàng. Gói tải lỗi không thay bản hoàn chỉnh trước đó. | PDF tr.6,8; xác nhận |
| FR-09 | 1 | Chọn và phát/dừng/tua audio tiếng Việt trực tuyến theo địa điểm; hiển thị bản chép lời và thông báo nếu không có bản thu hoặc tải thất bại. | PDF tr.6; xác nhận |
| FR-10 | 1 | Xem/lọc sự kiện theo ngày, địa điểm, trạng thái; xem nguồn và lần cập nhật; thêm sự kiện phù hợp ngày đi vào lịch. Sự kiện bị hủy không được coi là hoạt động khả dụng. | PDF tr.6; xác nhận |
| FR-11 | 1 | Xem hồ sơ đối tác, dịch vụ, giá theo đơn vị, lịch khả dụng và điều kiện đặt; tạo đơn cho một dịch vụ/thời điểm/số lượng với thông tin liên hệ. Chụp giá và quy tắc tại thời điểm đặt. | PDF tr.6,8; xác nhận |
| FR-12 | 1 | Quản trị duyệt hoặc từ chối yêu cầu; ghi người xử lý, thời điểm, lý do từ chối. Khi duyệt phải kiểm tra và giữ tồn nguyên tử; tạo hạn thanh toán 30 phút; hết thời hạn phải trả tồn. | Xác nhận |
| FR-13 | 1 | Thanh toán giả lập cho đơn chờ thanh toán: chọn thành công/thất bại/hủy. Kiểm tra quyền, số tiền và trạng thái phía máy chủ; thành công xác nhận đơn đúng một lần; thất bại/hủy lần thử không tự hủy đơn còn hạn. | Xác nhận |
| FR-14 | 1 | Xem lịch sử đơn; hủy trước giờ sử dụng; nếu đã trả thì ghi hoàn tiền giả lập toàn bộ. Hết giờ sử dụng không cho khách tự hủy. Quản trị ghi nhận hoàn thành dịch vụ để kết thúc đơn. | Xác nhận |
| FR-15 | 1 | Tạo thông báo trong web khi duyệt/từ chối/hết hạn/thanh toán/hủy đơn hoặc có kết quả báo lỗi; lưu trạng thái đã đọc và liên kết tới đối tượng mà người xem có quyền. | Xác nhận |
| FR-16 | 1 | Du khách đăng nhập gửi báo lỗi nội dung kèm loại lỗi, mô tả, tham chiếu địa điểm/sự kiện; quản trị tiếp nhận, xử lý, phản hồi và đóng; báo lỗi không tự sửa nội dung công khai. | PDF tr.11 |
| FR-17 | 1 | Quản trị tạo/sửa/ẩn và duyệt địa điểm, bài viết, audio, sự kiện, hồ sơ đối tác và dịch vụ; lưu lịch sử thay đổi. Nội dung chưa duyệt không vào kết quả công khai hoặc dữ liệu AI. | PDF tr.8,10-11; xác nhận |
| FR-18 | 1 | Quản trị quản lý vai trò, trạng thái tài khoản, phạm vi dữ liệu, tồn dịch vụ và tham số nghiệp vụ; tài khoản thông thường không được gọi API quản trị. | Xác nhận; hỗ trợ vận hành |
| FR-19 | 2 | Cung cấp giao diện, nội dung và audio Việt/Anh/Hàn/Trung; cụm từ giao tiếp Jrai có nghĩa và bản thu nếu có. Thiếu bản dịch phải báo và dùng bản Việt, không trình bày bản Việt như đã dịch. | PDF tr.6,10; xác nhận |
| FR-20 | 2 | Mua premium giả lập 49.000đ/tháng hoặc 199.000đ/năm, không tự gia hạn; theo dõi hạn quyền lợi. Premium cho gói bản đồ/audio offline và bỏ quảng cáo; hết hạn không mất lịch cá nhân hoặc offline cơ bản. | PDF tr.8; xác nhận |
| FR-21 | 2 | Tải/xóa/cập nhật gói bản đồ và audio theo khu vực/ngôn ngữ; chỉ công bố gói hoàn chỉnh; kiểm tra quyền premium khi mở. Xem bản đồ offline không đồng nghĩa có tính tuyến offline. | PDF tr.6; xác nhận |
| FR-22 | 2 | Chatbot trả lời từ nội dung đã duyệt, dẫn nguồn nội bộ và báo khi không có căn cứ; cá nhân hóa theo sở thích, lịch sử được phép dùng và lựa chọn đồng ý; cho rút đồng ý. | PDF tr.6,12; xác nhận |
| FR-23 | 2 | Lấy dự báo thời tiết, cảnh báo đóng cửa và gợi ý lịch thay thế; cho xem khác biệt và chỉ áp dụng sau khi khách chấp nhận. Không thay đơn đặt hoặc thanh toán khi đổi lịch. | PDF tr.6,12; xác nhận |
| FR-24 | 2 | Hiển thị ước tính mật độ khách kèm thời gian/phạm vi và chất lượng dữ liệu; nếu không đủ dữ liệu thì trả “chưa đủ dữ liệu”, không bịa số lượng. | PDF tr.6; xác nhận |
| FR-25 | 2 | Nhập/đồng bộ sự kiện từ nguồn đã cấu hình nếu có API được phép dùng; nhận dạng trùng, cập nhật/hủy đúng sự kiện, lưu nguồn và lần đồng bộ; lỗi không xóa dữ liệu hợp lệ đang có. | PDF tr.6; xác nhận |
| FR-26 | 2 | Đối tác quản lý hồ sơ, dịch vụ, tồn và đơn của mình; cộng tác viên gửi nội dung; quản trị phê duyệt trước công bố. Đối tác duyệt đơn theo cùng quy tắc FR-12, không truy cập đối tác khác. | PDF tr.8,10; xác nhận |
| FR-27 | 2 | Cấu hình/mua gói đối tác bằng thanh toán giả lập; áp dụng hạn mức sản phẩm, ưu tiên hiển thị và thống kê theo gói; ghi hoa hồng mô phỏng mặc định 10% trên giá dịch vụ khi đơn hoàn thành. | PDF tr.8; xác nhận |
| FR-28 | 2 | Quản trị cấu hình chiến dịch quảng cáo, vị trí, thời hạn và ngân sách mô phỏng; gắn nhãn tài trợ, không vượt ràng buộc lịch và không hiển thị cho premium; cá nhân hóa quảng cáo phải theo đồng ý của người dùng. | PDF tr.8; xác nhận |
| FR-29 | 2 | Cấu hình thưởng giới thiệu và báo lỗi; ghi người giới thiệu hợp lệ hoặc báo lỗi được chấp nhận; cấp quyền lợi một lần theo sự kiện đủ điều kiện, không thưởng tự giới thiệu hoặc cùng báo lỗi nhiều lần. | PDF tr.9,11; xác nhận |
| FR-30 | 2 | Đối tác xem số đơn/doanh thu/hoa hồng mô phỏng của mình; B2G xem số lượt sử dụng, điểm đến quan tâm và xu hướng theo vùng/thời gian ở mức tổng hợp, xuất CSV theo quyền; không xuất danh tính, lịch riêng hay vị trí cá nhân. | PDF tr.8-9; xác nhận |

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
