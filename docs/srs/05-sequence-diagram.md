# Sequence diagram

Các participant là **trách nhiệm logic**, không bắt buộc tách thành microservice. CSDL có thể được dùng chung nếu giao dịch và quyền được bảo đảm. Bộ thanh toán mock nằm trong hệ thống; không có cổng thanh toán thật. Các khối `critical` mô tả yêu cầu nguyên tử/khóa, không quy định công nghệ CSDL cụ thể.

## SEQ-01 - Tạo lịch AI thật (UC-03)

```mermaid
sequenceDiagram
    autonumber
    actor K as Du khách
    participant W as Web
    participant A as API lịch trình
    participant D as Kho nội dung
    participant M as Dịch vụ tuyến
    participant L as Nhà cung cấp AI
    K->>W: Nhập ngày, đoàn, ngân sách, xuất phát, phương tiện, sở thích
    W->>A: Yêu cầu tạo lịch và phiên đăng nhập
    A->>A: Kiểm tra đầu vào, phạm vi, hạn mức
    alt Đầu vào không hợp lệ
        A-->>W: Lỗi trường hoặc hạn mức
    else Đầu vào hợp lệ
        A->>D: Lấy POI công bố, giờ mở cửa, giá, nguồn
        D-->>A: Bộ dữ liệu được phép dùng
        A->>L: Tạo lịch với schema và ID cho phép, không gửi danh tính
        alt AI lỗi hoặc timeout
            L-->>A: Lỗi hoặc hết thời gian
            A-->>W: Chưa tạo được lịch, cho thử lại
        else Có kết quả AI
            L-->>A: Lịch có cấu trúc
            A->>A: Kiểm tra schema và ID POI
            alt Cấu trúc hoặc ID sai
                A-->>W: Không chấp nhận kết quả AI
            else Cấu trúc hợp lệ
                A->>M: Lấy tuyến giữa các điểm và thời lượng
                M-->>A: Tuyến đã kiểm chứng hoặc lỗi dữ liệu
                A->>A: Tính lại giờ, chi phí và kiểm tra ràng buộc
                alt Không khả thi hoặc thiếu dữ liệu bắt buộc
                    A-->>W: Báo lý do, đề nghị sửa đầu vào hoặc dữ liệu
                else Đạt kiểm tra
                    A-->>W: Bản đề xuất, chi phí, nguồn, cảnh báo
                    W-->>K: Xem và chọn sửa hoặc lưu
                end
            end
        end
    end
    Note over A,D: Chưa tự lưu lịch và chưa tạo đơn dịch vụ
```

## SEQ-02 - Tùy chỉnh và lưu có phiên bản (UC-04/05)

```mermaid
sequenceDiagram
    autonumber
    actor K as Du khách
    participant W as Web
    participant A as API lịch trình
    participant M as Dịch vụ tuyến
    participant D as CSDL
    K->>W: Đổi thứ tự, điểm hoặc thời lượng
    W->>A: Bản sửa và phiên bản gốc
    A->>D: Kiểm tra sở hữu và phiên bản
    D-->>A: Lịch hiện tại
    alt Phiên bản xung đột hoặc không có quyền
        A-->>W: Từ chối, yêu cầu tải lại nếu xung đột
    else Được phép sửa
        A->>M: Tính các chặng bị ảnh hưởng
        M-->>A: Kết quả tuyến
        A->>A: Kiểm tra giờ mở cửa, ngân sách và trùng giờ
        alt Có vi phạm
            A-->>W: Danh sách xung đột, giữ bản đã lưu
        else Hợp lệ
            A-->>W: Bản nháp và khác biệt
            K->>W: Xác nhận lưu
            W->>A: Lưu bản sửa, phiên bản gốc
            critical Lưu có kiểm tra phiên bản
                A->>D: Kiểm tra lại và cập nhật phiên bản nếu chưa đổi
                D-->>A: Thành công hoặc xung đột
            end
            A-->>W: Lịch mới hoặc thông báo cần tải lại
        end
    end
    Note over A,D: Không thay đổi các đơn đã đặt
```

## SEQ-03 - Tải và xem offline cơ bản (UC-06)

```mermaid
sequenceDiagram
    autonumber
    actor K as Du khách
    participant W as Web
    participant A as API
    participant C as Kho cục bộ trình duyệt
    K->>W: Chọn tải lịch offline
    W->>A: Lấy manifest lịch của tài khoản
    A-->>W: Phiên bản, danh sách tệp, dung lượng, dữ liệu
    W->>C: Kiểm tra quota và ghi vào vùng tạm
    alt Thiếu quota hoặc ngắt mạng
        W->>C: Hủy vùng tạm
        W-->>K: Tải lỗi, giữ bản hoàn chỉnh trước
    else Đã tải đủ
        W->>W: Kiểm tra toàn vẹn và phiên bản
        W->>C: Đổi gói đang dùng sang bản hoàn chỉnh
        W-->>K: Sẵn sàng offline và thời điểm tải
    end
    Note over K,C: Sau đó thiết bị mất mạng
    K->>W: Mở lịch
    W->>C: Đọc bản hoàn chỉnh đúng tài khoản
    alt Có dữ liệu cục bộ hợp lệ
        C-->>W: Lịch và POI
        W-->>K: Chỉ đọc, hiển thị trạng thái offline
    else Chưa tải hoặc cache bị xóa
        C-->>W: Không có gói
        W-->>K: Cần kết nối và tải lại
    end
```

Gói cơ bản không chứa dữ liệu liên hệ đặt dịch vụ, mật khẩu hoặc token quản trị. Mở lại offline phụ thuộc app shell và dữ liệu còn trên trình duyệt; đăng xuất xóa dữ liệu riêng của tài khoản khỏi thiết bị.

## SEQ-04 - Đặt và duyệt, giữ tồn (UC-09/10)

```mermaid
sequenceDiagram
    autonumber
    actor K as Du khách
    participant W as Web
    participant A as API đặt dịch vụ
    participant D as CSDL
    actor Q as Quản trị hoặc đối tác GĐ2
    K->>W: Chọn dịch vụ, giờ, số lượng, liên hệ
    W->>A: Yêu cầu báo giá
    A->>D: Đọc dịch vụ, giá và tồn
    D-->>A: Dữ liệu hiện hành
    A-->>W: Tổng tiền và chính sách giả lập
    K->>W: Xác nhận gửi yêu cầu
    W->>A: Gửi đơn và khóa chống lặp
    A->>A: Kiểm tra giá, thời gian còn hơn 24h30, quyền
    A->>D: Tạo CHO_DUYET, chụp giá, hạn duyệt +24h
    D-->>A: Mã đơn
    A-->>W: Đã gửi, chưa giữ tồn
    Q->>A: Mở đơn và chấp nhận hoặc từ chối
    critical Kiểm tra trạng thái và giữ tồn nguyên tử
        A->>D: Khóa đơn, kiểm tra quyền và hạn duyệt
        alt Đã quá hạn
            A->>D: Chuyển HET_HAN
        else Người xử lý từ chối
            A->>D: Chuyển TU_CHOI và lưu lý do
        else Chấp nhận và đủ tồn
            A->>D: Giữ tồn, CHO_THANH_TOAN, hạn +30 phút
        else Không đủ tồn
            A->>D: Giữ CHO_DUYET, ghi kết quả kiểm tra lỗi
        end
    end
    A-->>Q: Kết quả xử lý
    A->>D: Ghi thông báo và nhật ký
    Note over Q,D: GĐ1 chỉ quản trị, GĐ2 đối tác chỉ xử lý đơn của mình
```

Nếu không đủ tồn, người xử lý có thể từ chối đơn với lý do; hệ thống không tự xác nhận, không tự đổi dịch vụ/giá. Mọi nhánh phải kiểm tra trạng thái đang chờ duyệt để thao tác lặp không tạo giữ tồn lần hai.

## SEQ-05 - Thanh toán mock và retry (UC-11)

```mermaid
sequenceDiagram
    autonumber
    actor K as Du khách
    participant W as Web
    participant A as API thanh toán
    participant P as Bộ thanh toán mock
    participant D as CSDL
    K->>W: Chọn kết quả mô phỏng
    W->>A: Mã đơn, kết quả thử, khóa chống lặp
    critical Khóa và xử lý đúng một lần
        A->>D: Kiểm tra quyền, khóa, trạng thái, hạn, số tiền
        alt Khóa đã có kết quả
            D-->>A: Kết quả trước đó
        else Đã hết hạn
            A->>D: HET_HAN và nhả tồn nếu còn giữ
        else Đơn còn được thanh toán
            A->>P: Mô phỏng với số tiền từ máy chủ
            P-->>A: Thành công hoặc thất bại hoặc hủy lần thử
            alt Thành công
                A->>D: Ghi lần thử và DA_XAC_NHAN trong giao dịch
            else Thất bại hoặc hủy lần thử
                A->>D: Ghi lần thử, giữ CHO_THANH_TOAN khi còn hạn
            end
        end
    end
    A-->>W: Trạng thái đơn và lần thử
    W-->>K: Hiển thị kết quả giả lập
    Note over W,D: Nếu mất phản hồi, gửi lại cùng khóa để lấy kết quả cũ
    Note over P,D: Không gọi ngân hàng và không nhận dữ liệu thẻ
```

Không giữ giao dịch CSDL mở trong lúc chờ API thanh toán thật; ở đây mock là thao tác nội bộ nhanh. Nếu thay bằng cổng thật trong tương lai phải thiết kế lại webhook, đối soát và bù trừ ngoài phạm vi SRS này.

## SEQ-06 - Hủy và hoàn giả lập (UC-12)

```mermaid
sequenceDiagram
    autonumber
    actor K as Du khách
    participant W as Web
    participant A as API đặt dịch vụ
    participant D as CSDL
    K->>W: Xem số tiền hoàn và xác nhận hủy
    W->>A: Mã đơn và khóa chống lặp
    critical Hủy, hoàn và trả tồn cùng giao dịch
        A->>D: Khóa đơn, kiểm tra sở hữu và giờ máy chủ
        alt Đã hủy bởi cùng yêu cầu
            D-->>A: Kết quả hủy cũ
        else Đã bắt đầu hoặc đơn kết thúc khác
            A->>A: Từ chối tự hủy
        else Có thể hủy
            opt Đã thanh toán giả lập
                A->>D: Ghi hoàn giả lập 100% đúng một lần
            end
            A->>D: Đánh dấu DA_HUY và trả tồn nếu có
            A->>D: Ghi log và thông báo
        end
    end
    A-->>W: Kết quả và số tiền hoàn giả lập
    W-->>K: Hiển thị kết quả
```

Lỗi ghi bất kỳ phần nào trong giao dịch phải rollback. Các yêu cầu hủy/thanh toán cạnh tranh kiểm tra lại trạng thái sau khi khóa để không sinh kết quả mâu thuẫn.

## SEQ-07 - Nội dung đóng góp và kiểm duyệt (UC-13/14/18)

```mermaid
sequenceDiagram
    autonumber
    actor N as Người soạn được cấp quyền
    participant A as API nội dung
    participant D as CSDL
    actor Q as Quản trị
    N->>A: Gửi nội dung hoặc bản sửa kèm nguồn
    A->>A: Kiểm tra quyền, dữ liệu và tệp
    A->>D: Lưu bản CHO_DUYET, giữ bản công bố cũ
    A-->>N: Mã bản gửi
    Q->>A: Xem bản chờ và quyết định
    alt Nội dung đạt kiểm tra
        A->>D: Công bố phiên bản mới, ghi người duyệt và thời gian
        A->>D: Cập nhật chỉ mục tìm kiếm và dữ liệu AI
    else Cần sửa hoặc không hợp lệ
        A->>D: TU_CHOI và lý do, giữ bản công bố cũ
    end
    A-->>Q: Kết quả duyệt
    A-->>N: Trạng thái và phản hồi
    Note over N,Q: GĐ1 người soạn là quản trị, GĐ2 thêm đối tác/cộng tác viên
```

Báo lỗi của du khách tạo phiếu riêng, không trực tiếp trở thành bản sửa nội dung. Quản trị xác minh rồi thực hiện luồng trên; thưởng GĐ2 chỉ sau khi phiếu được chấp nhận.

## SEQ-08 - Hết hạn và hoàn thành đơn (UC-10/11)

```mermaid
sequenceDiagram
    autonumber
    participant J as Tác vụ hạn định
    participant A as Nghiệp vụ đơn
    participant D as CSDL
    actor Q as Quản trị hoặc đối tác GĐ2
    J->>A: Tìm đơn đã tới hạn
    loop Từng đơn chờ
        critical Kiểm tra lại và chuyển đúng một lần
            A->>D: Khóa đơn và đọc giờ/trạng thái hiện tại
            alt CHO_DUYET đã quá 24h
                A->>D: HET_HAN, log và thông báo
            else CHO_THANH_TOAN đã hết 30 phút
                A->>D: HET_HAN, nhả tồn, log và thông báo
            else Đơn đã đổi trạng thái
                A->>A: Không cập nhật
            end
        end
    end
    Q->>A: Ghi nhận đã phục vụ
    critical Hoàn thành và hoa hồng
        A->>D: Kiểm tra quyền, DA_XAC_NHAN và đã qua giờ kết thúc
        alt Đủ điều kiện
            A->>D: HOAN_THANH và log
            opt GĐ2
                A->>D: Ghi hoa hồng mô phỏng theo tỷ lệ chụp, một lần
            end
        else Không đủ điều kiện
            A->>A: Từ chối, không ghi hoa hồng
        end
    end
    A-->>Q: Kết quả
```

Tác vụ đề xuất chạy mỗi phút; kể cả chưa chạy, API thanh toán/duyệt vẫn so hạn bằng giờ máy chủ, không cho đơn quá hạn tiếp tục. Tồn được quản lý theo khoảng sử dụng; kết thúc khoảng sử dụng không làm mất lịch sử bán.

## SEQ-09 - Mua premium và dùng offline (UC-15, GĐ2)

```mermaid
sequenceDiagram
    autonumber
    actor K as Du khách
    participant W as Web
    participant A as API quyền lợi
    participant P as Bộ thanh toán mock
    participant D as CSDL
    participant C as Kho cục bộ
    K->>W: Chọn gói tháng hoặc năm
    W->>A: Yêu cầu mua và khóa chống lặp
    A->>D: Lấy giá, phiên bản gói và hạn hiện tại
    A->>P: Thực hiện thanh toán mô phỏng
    P-->>A: Kết quả
    alt Thành công
        A->>D: Ghi giao dịch và cấp/nối quyền đúng một lần
        A-->>W: Quyền có hạn và danh sách gói được tải
        K->>W: Chọn vùng và ngôn ngữ
        W->>A: Kiểm tra quyền và lấy manifest
        A-->>W: Gói được phép và bằng chứng quyền có hạn
        W->>C: Tải tạm, kiểm tra, thay gói khi hoàn chỉnh
        Note over K,C: Khi mất mạng
        W->>C: Đọc gói và kiểm tra hạn quyền
        alt Còn hạn và kiểm tra được
            C-->>W: Bản đồ hoặc audio
            W-->>K: Mở nội dung premium
        else Hết hạn hoặc quyền không xác minh được
            W-->>K: Khóa phần premium hoặc yêu cầu kết nối xác minh
            Note over W,C: Lịch và POI offline cơ bản vẫn đọc được
        end
    else Thất bại hoặc hủy lần thử
        A-->>W: Không cấp thêm quyền
    end
```

Cấp quyền/mua gói cũng phải kiểm tra khóa chống lặp trước khi xử lý; một thanh toán không nối hạn nhiều lần. Lựa chọn lưu offline trên web không tạo cam kết chống sao chép tuyệt đối.

## SEQ-10 - Gợi ý đổi lịch do điều kiện thực tế (UC-17, GĐ2)

```mermaid
sequenceDiagram
    autonumber
    actor K as Du khách
    participant W as Web
    participant A as API gợi ý
    participant T as Nguồn thời tiết
    participant D as Kho lịch và nội dung
    participant L as AI và bộ kiểm tra
    K->>W: Mở tình hình chuyến
    W->>A: Yêu cầu cho lịch thuộc tài khoản
    A->>D: Lấy lịch, trạng thái điểm và dữ liệu tổng hợp
    D-->>A: Dữ liệu được phép và phiên bản lịch
    A->>T: Lấy dự báo theo vùng và ngày
    T-->>A: Dự báo kèm thời điểm hoặc lỗi
    alt Thiếu hoặc dữ liệu quá cũ
        A-->>W: Chưa có dữ liệu tin cậy, giữ lịch hiện tại
    else Cần phương án thay thế
        A->>L: Tạo và kiểm tra phương án theo ràng buộc cũ
        L-->>A: Bản thay thế hợp lệ hoặc lý do không khả thi
        A-->>W: Khác biệt, nguồn, cảnh báo các đơn liên quan
        alt Du khách đồng ý
            K->>W: Áp dụng phương án
            W->>A: Xác nhận và phiên bản gốc
            A->>D: Kiểm tra lại sở hữu/phiên bản, lưu bản mới
            A-->>W: Kết quả lưu hoặc xung đột
        else Du khách bỏ qua
            K->>W: Giữ lịch cũ
        end
    else Không cần đổi lịch
        A-->>W: Tình hình và ước tính mật độ nếu đủ dữ liệu
    end
    Note over A,D: Không tự sửa/hủy đơn dịch vụ hoặc thay đổi thanh toán
```

## Truy vết và phạm vi biểu diễn

| Sequence | UC chính | Trọng tâm kiểm chứng |
| --- | --- | --- |
| 01 | 03 | AI thật, chỉ dữ liệu duyệt, kiểm tra ràng buộc |
| 02 | 04-05 | Tính lại và chống ghi đè lịch |
| 03 | 06 | Tải nguyên vẹn và chỉ đọc offline |
| 04 | 09-10 | Đơn chờ, hạn duyệt, giữ tồn |
| 05 | 11 | Mock thành công/thất bại/hủy lần thử, retry |
| 06 | 12 | Hủy trước giờ và hoàn đúng một lần |
| 07 | 13-14,18 | Kiểm duyệt và phiên bản nội dung |
| 08 | 10-11,20 | Hết hạn, nhả tồn, hoàn thành và hoa hồng |
| 09 | 15 | Quyền premium, mua mock và tải nâng cao |
| 10 | 17 | Nguồn thời gian thực và quyền quyết định của khách |

Các UC đọc đơn giản, quản lý tài khoản, chương trình thưởng và báo cáo được mô tả bằng luồng ở tệp 04; không cần một sequence riêng cho từng thao tác CRUD. Sequence không quy định tên endpoint, bảng CSDL hay framework.
