# Tiến độ bản demo

Ưu tiên theo yêu cầu: hình thành sản phẩm demo chạy được trước, commit từng mốc quan trọng. Demo đầu tiên đi theo luồng khám phá → chi tiết địa điểm → chọn điểm vào bản nháp chuyến đi; sau đó mới mở rộng tài khoản, quản trị, AI và giao dịch theo backlog.

## Các mốc

| Mốc | Phạm vi | Trạng thái |
| --- | --- | --- |
| D1 — Nền tảng FE | TypeScript strict, alias, Router Data Mode, route modules, lazy pages, error pages, Essential tokens, Button/Badge, Vitest | Đã triển khai; lint, build và 2 route tests đạt trên Node 20.20.2 |
| D2 — API khám phá | Contract, danh mục, tìm/lọc/phân trang và chi tiết POI; repository CSDL và server demo tách riêng | Đã triển khai; bộ 16 test BE (gồm kiểm tra OpenAPI) đạt trên Node 20.20.2 |
| D3 — Demo xuyên FE/BE | Trang khám phá, chi tiết, bản nháp chuyến đi và kiểm tra tích hợp | Đã triển khai; 7 unit tests FE, 10 E2E Chromium desktop/mobile, lint và TypeScript/Vite build đạt trên Node 20.20.2 |
| D4 — CI | GitHub Actions cài dependency theo lockfile, format/lint/unit/build/E2E trên Node từ `.nvmrc` | Đã thêm workflow; các lệnh đạt local, chưa chạy trên GitHub runner |
| D5 — Nền tảng CSDL thật | Sequelize runtime từ scaffold, migration ledger/lock/checksum, CLI admin, MariaDB integration và CI database job | 15 unit tests BE và 6 integration tests đạt trên MariaDB 10.5.26/Node 20.20.2; CI runner chưa chạy |

Commit nền tảng FE: `43a487c`; API khám phá: `8b9f47f`; demo xuyên FE/BE: `4aec204`. Tài liệu cấu trúc ban đầu: `57a8d9c`.

## Đối chiếu backlog

- FE-01: hoàn thành phần nền tảng public router/TypeScript; admin chưa mở do chưa có auth, chưa tạo shell tài khoản giả. SPA fallback trên hosting sẽ kiểm tra khi triển khai.
- FE-02: đã có tokens, font Inter tự host, Button/Badge và layout responsive. Các component form/table/dialog và kiểm tra tiếp cận đầy đủ sẽ bổ sung theo tính năng sử dụng.
- FE-03: Axios public read client xử lý lỗi chuẩn, hủy request qua AbortSignal; formatter VND dùng BigInt, ngày theo Việt Nam và URL nguồn chỉ HTTP(S). Chưa có auth/refresh/cache dữ liệu riêng.
- FE-04: có Vitest/Testing Library và memory router độc lập; E2E dùng API demo thật, kiểm tra tìm kiếm/URL/phân trang, detail/deep link/reload, bản nháp và phục hồi lỗi mạng. Đã có Prettier, `format:check` và workflow CI; git hooks còn tiếp tục. Chưa chạy workflow trên GitHub runner, chưa có smoke với DB thật.
- FE-08/09: có khám phá, lọc tên/loại/vùng/giá, sort, phân trang, empty/error và detail POI. Bản đồ mở bằng liên kết OpenStreetMap khi có tọa độ; chưa nhúng bản đồ, chưa có dịch vụ/slot. Minh họa dùng Lucide/CSS cục bộ, chưa dùng ảnh du lịch có bản quyền.
- FE-17: mới có bản nháp thao tác thêm/xóa/đổi thứ tự/đổi tên, tối đa 12 điểm. Dữ liệu trong bộ nhớ, tách demo/live, reload xóa; chưa có lưu revision, ownership, AI/validator hoặc CRUD lịch phía BE.
- BE-11/12: có API đọc danh mục/POI, giá, giờ, lọc và phân trang; chỉ đọc bản công bố tiếng Việt, vùng giai đoạn 1. Chưa có workflow quản trị, dịch vụ/slot, ngoại lệ đóng cửa hoặc bằng chứng tích hợp MariaDB thật. Test SQL chỉ xác minh binding và điều kiện truy vấn, không thay thế integration DB.
- Các checkbox gốc giữ nguyên khi chưa đáp ứng toàn bộ tiêu chí nghiệm thu.

## Giới hạn

Chưa nghiệm thu hạ tầng hosting, tích hợp MariaDB, xác thực, AI thật, offline hoặc giao dịch. Dữ liệu demo tại `be/demo/` tách khỏi runtime production; mọi response danh mục có `dataset: demo`. Không tự ghi/import lên CSDL hosting. Server demo không load `.env`, chỉ bind loopback và từ chối chạy khi `NODE_ENV=production`; readiness vẫn báo DB chưa kết nối.

Playwright kiểm Chromium desktop 1440px và viewport iPhone 13 bằng Chromium; chưa kiểm Safari/iOS thật. Ảnh kiểm tra nằm trong `fe/test-results/` (Git ignore). Unit tests SQL không chứng minh truy vấn chạy đúng trên MariaDB thật.

Đã quét axe theo WCAG A/AA ở các trang khám phá, chi tiết và bản nháp rỗng tại 360px, không có vi phạm được phát hiện tự động; không thay thế kiểm tra screen reader thủ công. Giữ màu thương hiệu `#256EFF`; màu hành động `#1D63ED` và màu chữ xanh đậm `#1755CC` đáp ứng tương phản chữ nhỏ trên nền đang dùng (màu gốc với chữ trắng chỉ 4,42:1).

## Thứ tự tiếp tục

1. Đã kiểm CSDL dev/test biệt lập, migration và bootstrap; bổ sung nghiệm thu restore/grants môi trường triển khai cho BE-03. CI đã có job MariaDB integration.
2. Auth JWT/refresh/thu hồi phiên và UI tài khoản (BE-04/05, FE-03/05); lưu lịch phải theo danh tính thật.
3. Workflow quản trị nội dung và dữ liệu có nguồn (BE-09/10/11, FE-12) để thay bộ mẫu bằng nội dung công bố.
4. Validator/tuyến/AI thật và lưu revision (BE-15–18, FE-14–17), sau đó đặt dịch vụ và mock payment.

Mỗi mốc tiếp tục commit độc lập sau kiểm tra. Chưa đánh dấu các task lớn là DONE chỉ dựa trên bản demo.
