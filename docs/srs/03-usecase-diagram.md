# Use case diagram

## 1. Danh mục use case

| UC | Tên | Tác nhân chính | GĐ | FR |
| --- | --- | --- | --- | --- |
| UC-01 | Đăng ký, đăng nhập và khôi phục tài khoản | Khách vãng lai | 1 | 01 |
| UC-02 | Khám phá địa điểm và dịch vụ | Khách vãng lai | 1 | 03-04,11 |
| UC-03 | Tạo lịch bằng AI | Du khách | 1 | 05 |
| UC-04 | Tùy chỉnh lịch trình | Du khách | 1 | 06 |
| UC-05 | Quản lý lịch đã lưu | Du khách | 1 | 07 |
| UC-06 | Tải và xem lịch offline | Du khách | 1 | 08 |
| UC-07 | Nghe audio | Khách vãng lai | 1/2 | 09,19 |
| UC-08 | Xem, thêm sự kiện vào lịch | Khách / Du khách | 1/2 | 10,25 |
| UC-09 | Gửi yêu cầu đặt dịch vụ | Du khách | 1 | 11 |
| UC-10 | Xử lý đơn và ghi nhận hoàn thành | Quản trị; đối tác ở GĐ2 | 1/2 | 12,14 |
| UC-11 | Thanh toán giả lập đơn dịch vụ | Du khách | 1 | 13 |
| UC-12 | Hủy đơn và hoàn tiền giả lập | Du khách | 1 | 14 |
| UC-13 | Báo lỗi và theo dõi xử lý | Du khách / Quản trị | 1 | 16 |
| UC-14 | Quản trị nội dung và cấu hình | Quản trị | 1/2 | 17-19,25 |
| UC-15 | Mua premium và tải gói nâng cao | Du khách | 2 | 20-21 |
| UC-16 | Chatbot và cá nhân hóa | Du khách | 2 | 22 |
| UC-17 | Xem tình hình và nhận gợi ý đổi lịch | Du khách | 2 | 23-24 |
| UC-18 | Tự phục vụ đối tác/cộng tác viên | Đối tác / Cộng tác viên | 2 | 26 |
| UC-19 | Quảng cáo và chương trình thưởng | Quản trị / Du khách | 2 | 28-29 |
| UC-20 | Gói đối tác và hoa hồng mô phỏng | Đối tác / Quản trị | 2 | 27 |
| UC-21 | Xem và xuất báo cáo | Đối tác / B2G | 2 | 30 |
| UC-22 | Hồ sơ, quyền dữ liệu và thông báo | Du khách | 1/2 | 02,15 |

## 2. UML - Giai đoạn 1

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle
actor "Khách vãng lai" as Guest
actor "Du khách có tài khoản" as Tourist
actor "Quản trị viên" as Admin
actor "Dịch vụ AI" as AI
actor "Dịch vụ bản đồ/tuyến" as Maps
actor "Dịch vụ thư tài khoản" as Mail
Tourist --|> Guest
rectangle "GiaLaiGo - Web - GĐ1" {
  usecase "UC-01\nTài khoản" as U1
  usecase "UC-02\nKhám phá" as U2
  usecase "UC-03\nTạo lịch AI" as U3
  usecase "UC-04\nTùy chỉnh lịch" as U4
  usecase "UC-05\nQuản lý lịch" as U5
  usecase "UC-06\nLịch offline" as U6
  usecase "UC-07\nNghe audio" as U7
  usecase "UC-08\nSự kiện" as U8
  usecase "UC-09\nYêu cầu đặt dịch vụ" as U9
  usecase "UC-10\nXử lý đơn" as U10
  usecase "UC-11\nThanh toán giả lập" as U11
  usecase "UC-12\nHủy và hoàn giả lập" as U12
  usecase "UC-13\nBáo lỗi" as U13
  usecase "UC-14\nQuản trị" as U14
  usecase "UC-22\nHồ sơ và thông báo" as U22
}
Guest -- U1
Guest -- U2
Guest -- U7
Guest -- U8
Tourist -- U3
Tourist -- U4
Tourist -- U5
Tourist -- U6
Tourist -- U8
Tourist -- U9
Tourist -- U11
Tourist -- U12
Tourist -- U13
Tourist -- U22
Admin -- U10
Admin -- U13
Admin -- U14
AI -- U3
Maps -- U2
Maps -- U3
Maps -- U4
Mail -- U1
@enduml
```

## 3. UML - Giai đoạn 2 bổ sung

```plantuml
@startuml
left to right direction
actor "Du khách" as Tourist
actor "Quản trị viên" as Admin
actor "Đối tác" as Partner
actor "Cộng tác viên" as Contributor
actor "Người xem báo cáo B2G" as Agency
actor "Dịch vụ AI" as AI
actor "Nguồn thời tiết" as Weather
actor "Nguồn sự kiện" as Events
rectangle "GiaLaiGo - Web - GĐ2" {
  usecase "UC-15\nPremium và gói offline" as U15
  usecase "UC-16\nChatbot, cá nhân hóa" as U16
  usecase "UC-17\nTình hình và đổi lịch" as U17
  usecase "UC-18\nCổng đối tác/cộng tác viên" as U18
  usecase "UC-19\nQuảng cáo và thưởng" as U19
  usecase "UC-20\nGói đối tác, hoa hồng" as U20
  usecase "UC-21\nBáo cáo" as U21
  usecase "UC-10\nXử lý đơn thuộc đối tác" as U10
  usecase "UC-14\nDuyệt, cấu hình, đồng bộ" as U14
}
Tourist -- U15
Tourist -- U16
Tourist -- U17
Tourist -- U19
Partner -- U18
Partner -- U20
Partner -- U21
Partner -- U10
Contributor -- U18
Agency -- U21
Admin -- U14
Admin -- U19
Admin -- U20
AI -- U16
AI -- U17
Weather -- U17
Events -- U14
@enduml
```

## 4. Cách hiểu quan hệ

- Du khách có tài khoản kế thừa quyền đọc công khai của khách vãng lai. Đối tác, cộng tác viên và B2G có vai trò riêng; có tài khoản không đồng nghĩa được quyền du khách hoặc quản trị tự động.
- Các đường liền là tương tác, không biểu thị thứ tự thực hiện.
- Đăng nhập là tiền điều kiện của các chức năng có dữ liệu riêng; không vẽ `include` đăng nhập ở mọi use case vì mỗi lần thao tác không bắt buộc đăng nhập lại.
- Thanh toán là bước riêng chỉ thực hiện khi đơn đã duyệt, không phải phần bắt buộc của việc gửi yêu cầu đặt. Vì vậy không vẽ `include` từ UC-09 sang UC-11.
- Thanh toán giả lập là chức năng bên trong hệ thống; không có tác nhân “cổng thanh toán thật”. Chi tiết thứ tự nằm ở sequence diagram.
