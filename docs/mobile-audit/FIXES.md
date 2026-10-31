# Các mục tối ưu đã thực hiện — 31/10/2026

- Form AI dùng cột có thể co, nhóm chọn điểm xuất phát xuống dòng; sửa radio nhận nhầm kiểu ô nhập văn bản.
- Hero gọn, ẩn tiêu đề lặp trên điện thoại; tìm kiếm luôn hiện, khu vực/sắp xếp/giá nằm trong panel details gốc của trình duyệt, có số bộ lọc và nút áp dụng/xóa. Ảnh thẻ trên mobile cao 140px.
- Lưu bản nháp bằng localStorage, schema phiên bản 1; tách demo/live, kiểm tra dữ liệu đọc lại, loại trùng và giới hạn 12 điểm. Vẫn dùng được trong bộ nhớ khi storage bị chặn/đầy. Đăng xuất tài khoản đang đăng nhập vẫn xóa bản nháp theo hành vi cũ; refresh thất bại của khách chưa đăng nhập không còn xóa bản nháp.
- Đơn đặt trỏ về đường dẫn đơn đặt; loader dẫn khách chưa đăng nhập tới đăng nhập. Vì vậy chỉ mục Đăng nhập sáng tại trang đăng nhập.
- Ẩn khối giới thiệu đăng nhập/đăng ký trên mobile; form hiển thị đầu tiên.
- Chữ Travel dùng primary-hover để tăng tương phản.
- Nhận diện các URL stock đã có trong bộ seed, dùng artwork theo danh mục thay cho ảnh gán sai; ảnh do người quản trị cung cấp riêng vẫn hiển thị. Chưa bổ sung ảnh chụp thực tế mới và chưa sửa dữ liệu production.
- Backend suy ra COMPLETED khi đến giờ kết thúc, giữ nguyên CANCELLED; lọc trạng thái trước phân trang, thống nhất danh sách/chi tiết/các sự kiện ở địa điểm. Frontend phân biệt Sắp diễn ra/Đang diễn ra/Đã kết thúc theo mốc ISO có múi giờ. Thay đổi backend cần deploy cùng frontend để bộ lọc trạng thái đúng.

## Kiểm chứng

- Backend: 27/27 test đạt.
- Frontend: 38/38 test đạt, có kiểm tra lưu/khôi phục bản nháp, dữ liệu lỗi, refresh khách, trạng thái sự kiện và ảnh stock.
- Lint và production build đạt.
- Kiểm tra trình duyệt ở 320, 360, 390, 430px: các ô nhập/nút form AI không vượt viewport; bản nháp giữ 1 điểm sau reload; trang đăng nhập có 1 mục active; chọn sắp xếp được lưu vào URL.
- Kịch bản verify-all.cjs dùng bản build local để thay tài nguyên trong phiên trình duyệt riêng, đọc API deploy, chặn service worker. Không thay đổi hosting. Xem fixes-results.json và các ảnh *-fixed.png.
- Kiểm thử tích hợp MariaDB đã thử nhưng không thể chạy: ECONNREFUSED 127.0.0.1:3307. Chưa xác minh tích hợp với cơ sở dữ liệu kiểm thử.
- Chưa thử Safari/iPhone thật, bàn phím ảo hoặc đo Core Web Vitals.

Chưa commit hay deploy.

Kết quả đo cuối: ở 390×844, thẻ đầu tiên bắt đầu y≈502px (trước sửa ≈972px), tiêu đề bắt đầu y≈698px. Ở 320px, tiêu đề bắt đầu y≈720px. Lượt axe trên trang khám phá với bộ lọc đang áp dụng: không ghi nhận vi phạm trong các nhóm WCAG 2 A/AA, 2.1 AA và 2.2 AA. Đây là kiểm tra tự động, không thay thế kiểm thử điện thoại thật.
