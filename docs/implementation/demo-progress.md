# Tiến độ bản demo

Ưu tiên theo yêu cầu: hình thành sản phẩm demo chạy được trước, commit từng mốc quan trọng. Demo đầu tiên đi theo luồng khám phá → chi tiết địa điểm → chọn điểm vào bản nháp chuyến đi; sau đó mới mở rộng tài khoản, quản trị, AI và giao dịch theo backlog.

## Các mốc

| Mốc | Phạm vi | Trạng thái |
| --- | --- | --- |
| D1 — Nền tảng FE | TypeScript strict, alias, Router Data Mode, route modules, lazy pages, error pages, Essential tokens, Button/Badge, Vitest | Đã triển khai; lint, build và 2 route tests đạt trên Node 20.20.2 |
| D2 — API khám phá | Contract, danh mục, tìm/lọc/phân trang và chi tiết POI; repository CSDL và server demo tách riêng | Đã triển khai; bộ 16 test BE (gồm kiểm tra OpenAPI) đạt trên Node 20.20.2 |
| D3 — Demo xuyên FE/BE | Trang khám phá, chi tiết, bản nháp chuyến đi và kiểm tra tích hợp | Tiếp theo |

## Đối chiếu backlog

- FE-01: hoàn thành phần nền tảng public router/TypeScript; admin chưa mở do chưa có auth, chưa tạo shell tài khoản giả. SPA fallback trên hosting sẽ kiểm tra khi triển khai.
- FE-02: đã có tokens, font Inter tự host, Button/Badge và layout responsive. Các component form/table/dialog và kiểm tra tiếp cận đầy đủ sẽ bổ sung theo tính năng sử dụng.
- FE-04: có Vitest, Testing Library và kiểm tra route bằng memory router độc lập. CI/E2E và tooling định dạng sẽ bổ sung ở mốc tiếp theo.
- BE-11/12: có API đọc danh mục/POI, giá, giờ, lọc và phân trang; chỉ đọc bản công bố tiếng Việt, vùng giai đoạn 1. Chưa có workflow quản trị, dịch vụ/slot, ngoại lệ đóng cửa hoặc bằng chứng tích hợp MariaDB thật. Test SQL chỉ xác minh binding và điều kiện truy vấn, không thay thế integration DB.
- Các checkbox gốc giữ nguyên khi chưa đáp ứng toàn bộ tiêu chí nghiệm thu.

## Giới hạn

Chưa nghiệm thu hạ tầng hosting, tích hợp MariaDB, xác thực, AI thật, offline hoặc giao dịch. Dữ liệu demo tại `be/demo/` tách khỏi runtime production; mọi response danh mục có `dataset: demo`. Không tự ghi/import lên CSDL hosting. Server demo không load `.env`, chỉ bind loopback và từ chối chạy khi `NODE_ENV=production`; readiness vẫn báo DB chưa kết nối.
