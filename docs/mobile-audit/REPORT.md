# Kiểm thử giao diện điện thoại và kế hoạch tối ưu

Ngày: 31/10/2026 (Asia/Saigon)
Bản deploy: https://gialaitravel.yangkleeserver.io.vn

## Phạm vi và phương pháp

Kiểm thử trực tiếp bằng Playwright trên Microsoft Edge/Chromium, chế độ cảm ứng và viewport điện thoại. Chụp ảnh và chạy axe ở 390×844; kiểm tra bố cục các trang /explore, /events, /trips, /login, /register ở 320, 360, 390 và 430px (cao 844px). Kiểm tra thêm trang chủ, chi tiết điểm đến, biểu mẫu AI, menu và URL /services. Đối chiếu mã nguồn hiện tại; chưa xác minh commit đang deploy trùng hoàn toàn workspace.

Không tạo tài khoản, đặt chỗ, gọi tạo lịch trình AI hoặc sửa dữ liệu server. Chưa kiểm thử trên iPhone Safari/Android thật, bàn phím ảo, xoay màn hình, thanh trình duyệt động hoặc mạng di động chậm. Chưa đo Lighthouse/Core Web Vitals; không kết luận về tốc độ thực tế từ lần kiểm thử này.

## Kết quả đã xác nhận

| Hạng mục | Kết quả |
|---|---|
| Bố cục 5 trang × 4 chiều rộng | Không tăng scrollWidth quá viewport; chưa đủ để kết luận không cắt nội dung |
| Tìm “Biển Hồ” | Trả 2 thẻ; URL lưu truy vấn; reload giữ từ khóa |
| Mở chi tiết từ kết quả | Mở đúng Biển Hồ Chè & Hàng Thông Trăm Tuổi |
| Thêm điểm → Chuyến đi qua thanh điều hướng | Có 1 điểm trong bản nháp |
| Tải lại Chuyến đi | Bản nháp trở về 0 điểm |
| Ảnh danh sách | 12/12 ảnh tải được sau khi cuộn; khoảng trắng trong ảnh chụp toàn trang ban đầu có phần do lazy loading |
| Cỡ chữ input/select trên 5 trang | 16px ở các chiều rộng đã đo |
| axe, 6 trang có layout chính | Mỗi trang có lỗi color-contrast tại .text-primary trong logo: 4.41:1, yêu cầu 4.5:1 |
| Lỗi JavaScript trong lượt tương tác | Không ghi nhận pageerror; không phải bằng chứng toàn bộ API đều hoạt động |
| /services | Hiển thị giao diện 404; chưa thấy đây là mục điều hướng công khai, nên chưa xếp là lỗi tính năng |

## Vấn đề và ưu tiên

### P1 — Biểu mẫu AI bị cắt bên phải

Ở 390px, card “Thông số chuyến đi” kéo tới x≈414.8px; input/form tới x≈393.8px. Ảnh ai-form.png cho thấy nút, ô nhập và nội dung sát/cắt mép phải. documentElement.scrollWidth vẫn là 390px nên phép kiểm tra overflow hiện có bỏ sót lỗi này.

Sửa grid/flex con để co được (min-width:0), điều chỉnh cột và nhóm nút theo chiều rộng khả dụng; cho nhãn dài xuống dòng. Kiểm tra các kích thước cố định và style inline trong TripsPage.tsx. Không dùng ẩn overflow làm cách xử lý chính.

Nghiệm thu: mọi input, nhãn và CTA nằm trọn trong viewport ở 320–430px, cả tab AI và bản nháp; thao tác được với bàn phím mở.

### P1 — Điểm đến xuất hiện quá muộn

Đầu thẻ đầu tiên tại /explore: y≈1027 (320px), 972 (360/390px), 916 (430px), đều dưới màn hình cao 844px. Hero, tiêu đề và bộ lọc chiếm phần lớn vùng xem ban đầu. Header cũng có hai nút đăng nhập/đăng ký xuống dòng ở 390px.

Rút hero còn tiêu đề ngắn và mô tả một dòng trên mobile. Giữ ô tìm kiếm và nút “Bộ lọc”; đưa khu vực, giá, sắp xếp vào panel mở theo yêu cầu, hiển thị số bộ lọc đã chọn và nút xóa. Thu gọn header còn menu, thương hiệu và một điểm vào tài khoản. Giữ danh mục cuộn ngang nhưng thêm gợi ý còn nội dung.

Nghiệm thu: ở 390×844, thấy ít nhất ảnh và tiêu đề của thẻ đầu tiên khi chưa cuộn; tìm kiếm vẫn giữ URL, bộ lọc và thao tác quay lại.

### P1 — Bản nháp mất sau tải lại

Điều hướng trong ứng dụng giữ 1 điểm; reload trả về 0. Mã useTripDraftStore.ts xác nhận dữ liệu chỉ lưu trong bộ nhớ. Đây là hành vi hiện tại nhưng gây rủi ro mất công chọn điểm khi dùng điện thoại.

Lưu bản nháp công khai xuống thiết bị với phiên bản dữ liệu; kiểm tra dữ liệu cũ/lỗi, tách demo/live, giới hạn 12 điểm và có nút xóa. Thống nhất cách chuyển bản nháp khi đăng nhập. Chỉ lưu thông tin điểm đến cần thiết.

Nghiệm thu: thêm, đổi tên, sắp xếp, reload và mở lại vẫn giữ bản nháp; dữ liệu lỗi không làm sập trang.

### P2 — Điều hướng gây nhầm và menu cần hoàn thiện

Tại /login, cả “Đơn đặt” và “Đăng nhập” cùng active vì cùng trỏ tới /login khi chưa đăng nhập. Menu đang dùng nhãn “Thu gọn thanh menu” ngay cả ở trạng thái đóng trên điện thoại; mã nguồn chưa có aria-expanded/aria-controls ở nút mở. Khi mở menu, body overflow vẫn visible: cần kiểm tra và khóa cuộn nền, quản lý focus và Escape.

Nghiệm thu: tối đa một mục active đúng ngữ cảnh; nút mở/đóng có nhãn và trạng thái đúng; đóng menu trả focus về nút mở; không tương tác vào nền khi menu mở.

### P2 — Đăng nhập có quá nhiều nội dung trước form

Ở 390px, khối giới thiệu cao khoảng 240px; liên kết hỗ trợ ở dưới vùng xem đầu. Thu gọn hoặc ẩn khối giới thiệu trên mobile; ưu tiên tiêu đề, email, mật khẩu và CTA. Kiểm tra safe area và bàn phím trước khi thay đổi thanh điều hướng dưới.

Nghiệm thu: form và thông báo lỗi dễ đọc; CTA và liên kết hỗ trợ có thể cuộn tới khi mở bàn phím; vùng bấm mục tiêu 44×44px cho thao tác chính.

### P2 — Tương phản logo và nội dung ảnh

Điều chỉnh màu chữ Travel theo token để đạt tương phản tối thiểu 4.5:1 ở cỡ chữ hiện tại. Không cần đổi toàn bộ màu thương hiệu nếu chỉ cần token chữ phù hợp.

Ảnh chụp trang chủ cho thấy thẻ Bảo tàng Quang Trung dùng ảnh máy bay, Biển Hồ dùng ảnh biển. Cần rà soát ánh xạ ảnh và thay ảnh đúng địa điểm; dùng fallback trung tính khi chưa có ảnh xác thực. Đây là vấn đề nội dung, không phải lỗi tải ảnh.

### P2 — Trạng thái sự kiện không khớp thời gian

/events hiển thị “Sắp diễn ra” cho các sự kiện có ngày tháng 3–5/2026, đã qua so với 31/10/2026. Kiểm tra quy tắc trạng thái theo ngày kết thúc và múi giờ; mặc định ưu tiên sự kiện sắp tới, có bộ lọc xem đã diễn ra.

## Lộ trình đề xuất

1. **Đợt 1, 1–2 ngày:** sửa cắt form AI, active navigation, tương phản logo; bổ sung kiểm tra phần tử vượt viewport thay vì chỉ đo scrollWidth. Kiểm tra ngay 320/360/390/430px.
2. **Đợt 2, 2–3 ngày:** thu gọn trang khám phá, header và trang đăng nhập; panel bộ lọc có quản lý focus; hoàn thiện menu, safe area và kích thước vùng bấm.
3. **Đợt 3, 1–2 ngày:** lưu bản nháp trên thiết bị; rà ảnh và trạng thái sự kiện; kiểm tra luồng tìm → lọc → chi tiết → thêm → sửa bản nháp → reload.
4. **Đợt 4, khoảng 1 ngày:** kiểm thử iPhone Safari và Android Chrome thật, bàn phím, xoay ngang, mạng chậm; đo Lighthouse và tải ảnh trước khi quyết định tối ưu bundle/ảnh. Mục tiêu đo thực địa khi đủ dữ liệu: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.

Ước lượng 5–8 ngày công cho một người, phụ thuộc phạm vi sửa form AI và khả năng cung cấp ảnh đúng địa điểm. Đây là dự kiến, chưa phải cam kết tiến độ.

## Bằng chứng và khả năng chạy lại

- home.png, login.png, detail.png, trip-filled.png, ai-form.png, menu.png: ảnh chụp bản deploy.
- results.json: nội dung trang, ảnh và kết quả axe.
- interactions.json: ma trận viewport, tìm kiếm, deep link, biểu mẫu AI. Hai dòng draft ban đầu dùng điều hướng tải trang mới nên không dùng để kết luận thao tác thêm bị lỗi.
- draft.json: kiểm tra lại bằng điều hướng nội bộ, xác nhận 1 điểm trước và 0 điểm sau reload.
- extra.json: tọa độ phần tử bị cắt, ảnh sau cuộn và trạng thái menu.
- audit.cjs, interactions.cjs, extra.cjs, draft.cjs: kịch bản đã chạy, cần Playwright/axe và Edge.

Chưa sửa mã giao diện hay deploy. Báo cáo này phân biệt kết quả đo, nhận xét giao diện và đề xuất cần nghiệm thu tiếp.
