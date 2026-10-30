# Kế hoạch triển khai GiaLaiTravel

Ngày lập: 29/10/2026; cập nhật JWT: 30/10/2026. Đường cơ sở: SRS 1.5 và scaffold Express/React hiện tại.
Trạng thái: kế hoạch đề xuất để triển khai, không phải báo cáo tính năng đã hoàn thành.

## 1. Cách sử dụng

| Tài liệu | Mục đích |
| --- | --- |
| [Kế hoạch này](README.md) | Phạm vi, kiến trúc, thứ tự triển khai, phụ thuộc và điều kiện bàn giao |
| [Thiết kế JWT](auth-jwt.md) | Access/refresh token, vòng đời phiên, API và migration |
| [Task backend](backend-tasks.md) | Backlog Express, CSDL, AI, giao dịch và tác vụ nền |
| [Task frontend](frontend-tasks.md) | Backlog React cho khách, du khách, quản trị và các cổng GĐ2 |
| [Tích hợp và nghiệm thu](integration-and-acceptance.md) | Task dùng chung, kịch bản kiểm thử, phát hành và vận hành |
| [Ma trận truy vết](traceability.md) | Liên kết từng FR con và nhóm NFR với task thực hiện/nghiệm thu |

Nguồn chính: [FR và BR](../srs/01-tong-quan-va-yeu-cau-chuc-nang.md), [NFR và hồ sơ E-01 đến E-08](../srs/02-yeu-cau-phi-chuc-nang.md), [danh mục UC](../srs/03-usecase-diagram.md), [chi tiết UC](../srs/04-usecase-details.md), [sequence](../srs/05-sequence-diagram.md), [quyết định D-01 đến D-21](../srs/06-cau-hoi-va-quyet-dinh.md), [class diagram](../srs/07-class-diagram.md), [schema](../../be/schema.sql) và [hợp đồng giao dịch](../../be/README.md).

SRS và quyết định đã xác nhận được ưu tiên khi khác đề cương PDF. Tên module, endpoint, thư viện bổ sung và cách chia milestone dưới đây là đề xuất kỹ thuật, trừ quy ước FE được chỉ định tại [fe/AGENTS.md](../../fe/AGENTS.md), [fe/DESIGN.md](../../fe/DESIGN.md), [essential-ui](../../fe/.agents/skills/essential-ui/SKILL.md) và [react-best-practices](../../fe/.agents/skills/react-best-practices/SKILL.md). Không sửa phạm vi SRS bằng cách thay backlog; thay đổi nghiệp vụ phải cập nhật tài liệu nguồn và ma trận truy vết cùng lúc.

## 2. Hiện trạng và khoảng cách

Đã có npm workspaces; Node.js 20.20.2; Express 5 với `GET /api/health`, CORS, JSON/error middleware và test API cơ bản; React 19/Vite với trang khởi tạo, proxy, ESLint và build. Schema đã mô tả cả hai giai đoạn, GUID dạng string và hosting MariaDB 10.5.26. Tài liệu CSDL có ghi kết quả kiểm thử DDL trước đây; kết quả này không thay cho kiểm thử backend sắp triển khai.

Đã có pool mysql2, transaction, readiness, db:check và lệnh scaffold Sequelize; kết nối hosting hiện ETIMEDOUT, chưa sinh model. Chưa có đăng nhập JWT, chức năng nghiệp vụ, AI thật, router ứng dụng, cổng quản trị, service worker, kho offline hoặc pipeline triển khai. Không đánh dấu hoàn thành task chỉ vì có bảng SQL hoặc màn hình khởi tạo. Schema khởi tạo đã cập nhật JWT cho DB mới; DB baseline GUID dùng migration `001-jwt-auth.sql` sau backup/đối chiếu. Không import lại file khởi tạo lên CSDL đang có dữ liệu.

## 3. Phạm vi bàn giao

| Giai đoạn | Bắt buộc | Điều kiện nghiệm thu chính |
| --- | --- | --- |
| GĐ1 | FR-01 đến FR-18; web responsive tiếng Việt cho khách/du khách/quản trị; AI thật tạo lịch; sửa/lưu lịch; offline cơ bản; audio online; sự kiện nhập quản trị; đặt/duyệt/trả tiền/hủy/hoàn giả lập; thông báo, báo lỗi, quyền dữ liệu | Hoàn tất X-01 đến X-10; từng FR con có bằng chứng; các NFR áp dụng GĐ1 được kiểm tra theo baseline đã khóa |
| GĐ2 | FR-19 đến FR-30 và mở rộng các luồng GĐ1: đa ngôn ngữ, premium, offline nâng cao, chatbot, điều kiện chuyến đi, đồng bộ sự kiện, đối tác/cộng tác viên, thương mại mô phỏng, báo cáo | Hoàn tất X-11, X-12; hồi quy GĐ1; đủ quyền nội dung, nguồn API, cấu hình thương mại và dữ liệu kiểm chứng cho từng tính năng |

Không nằm trong kế hoạch: ứng dụng native; thanh toán hoặc chuyển tiền thật; vé máy bay; định tuyến offline bằng giọng nói; mở toàn quốc; ký hợp đồng hoặc bán dữ liệu B2G. GĐ1 chỉ dùng tập dữ liệu Gia Lai đã duyệt, chưa thêm Măng Đen. Không tự suy ra địa giới từ tên tỉnh hoặc đầu ra AI.

## 4. Kiến trúc triển khai đề xuất

### Backend

Giữ một ứng dụng Express theo module nghiệp vụ, dùng chung CSDL để bảo đảm transaction. Phân lớp `routes → validation/auth → controller → service → repository`; controller chỉ chuyển đổi HTTP, service quyết định nghiệp vụ, repository chứa truy vấn tham số hóa. Tách adapter AI/tuyến/email/storage để thay nhà cung cấp mà không sửa state machine đơn đặt.

```text
be/src/
  app.js, server.js
  config/            # Kiểm tra env và cấu hình khởi động
  db/                # Pool, transaction, migrations
  middleware/        # Auth, scope, CSRF, rate limit, request ID, lỗi
  modules/
    auth/ users/ privacy/ content/ media/ catalog/ events/
    itineraries/ ai/ offline/ bookings/ payments/
    notifications/ issues/ admin/
    plans/ entitlements/ partners/ ads/ rewards/ reports/
  adapters/          # AI, routing, mail, storage, weather, event feeds
  jobs/              # Hết hạn đơn, dọn dữ liệu, đồng bộ, tổng hợp
be/test/             # Unit, API và integration MariaDB
```

Runtime hiện dùng `mysql2/promise`; đã có Sequelize/sequelize-auto để reverse engineer, chưa thay repository runtime. Migration SQL cần sổ phiên bản. D-22 xác nhận đăng nhập dùng JWT access RS256 qua Bearer và refresh opaque xoay vòng trong cookie HttpOnly/Secure; DB giữ phiên để thu hồi ngay. Baseline đề xuất access 15 phút, phiên refresh tối đa 7 ngày; kiểm session/user/quyền mỗi request và CSRF cho endpoint cookie. Xem [thiết kế JWT](auth-jwt.md); X-01 chốt domain/keyring/TTL trước code auth. Tác vụ chạy bằng CLI/cron hoặc worker độc lập, dùng chung service nghiệp vụ, không phụ thuộc việc người dùng mở web.

### Frontend

Scaffold hiện là React JavaScript/Vite. Theo hướng dẫn FE hiện có, M0 có task chuyển sang TypeScript strict, bổ sung Tailwind CSS v4, Essential tokens, component theo pattern shadcn/ui, Lucide, React Router v7 Data Mode, Axios và Zustand v5 theo domain. Chốt phiên bản thực sự tương thích Node 20.20.2 ở X-01 trước khi thêm dependency; không coi stack này đã được cài đặt chỉ vì có trong `AGENTS.md`.

Dữ liệu trang đầu lấy bằng route loader và `useLoaderData`, mutation qua event handler hoặc router action; mọi network call đi qua `services/`, không fetch trong `useEffect`. Không cần thêm TanStack Query vào baseline này. Draft lịch, session state và cache dữ liệu tách theo domain, dùng selector để tránh render thừa. Dùng `React.lazy`/Suspense ở cấp trang, layout shell giữ eager và mỗi route loader có error boundary.

```text
fe/src/
  components/ui/     # Thành phần Essential theo pattern shadcn/ui
  components/common/ # Thành phần dùng chung
  features/          # Auth, explore, itinerary, booking, profile...
  layouts/           # Public, tourist, admin và portal shells
  routes/            # Router composition, route modules, loaders
  services/          # Axios, API calls; module offline có thể nằm tại đây
  store/             # Zustand theo domain, selector cụ thể
  constants/         # APP_PATHS, ROUTE_SEGMENTS và status
  utils/             # cn, GUID, money, date, locale, permissions
  index.css          # Tailwind và semantic tokens
```

Feature offline có thể tổ chức tại `features/offline` và logic lưu tại `services/offline` theo cấu trúc FE. Cache riêng chia theo tài khoản/revision; app shell được cache riêng. Service worker không cache chung mọi phản hồi API hoặc trang quản trị. Sự tồn tại metadata `offline_downloads` ở máy chủ không chứng minh trình duyệt còn dữ liệu. GĐ1 không có hàng đợi ghi offline.

### Hợp đồng giữa BE và FE

- Giữ `GET /api/health` hiện có; các endpoint nghiệp vụ đề xuất dưới `/api/v1`. Chốt OpenAPI và ví dụ lỗi trước khi FE tích hợp.
- Tất cả ID là string GUID chữ thường; BE sinh bằng `randomUUID()`. Không suy ra thứ tự từ GUID; dùng thời gian, số phiên bản hoặc `decision_no` theo dữ liệu.
- CSDL lưu UTC `DATETIME(6)`, kết nối đặt `time_zone = '+00:00'`; API dùng ISO 8601 có múi giờ; FE hiển thị `Asia/Ho_Chi_Minh`. Giờ mở cửa là giờ địa phương, không tự dịch như timestamp UTC.
- Tiền là số nguyên VND. Chốt biểu diễn API là chuỗi thập phân cho trường BIGINT tiền để tránh mất chính xác qua JSON/JavaScript; FE định dạng bằng tiện ích chung, BE tính bằng số nguyên chính xác. Không trả JavaScript `BigInt` trực tiếp trong JSON.
- Lỗi đề xuất `{ error: { code, message, fields?, requestId } }`; phân biệt 401, 403, 404, 409, 422, 429 và lỗi phụ thuộc. FE không hiển thị stack trace.
- Ghi lịch phải gửi phiên bản gốc; xung đột trả 409. Retry đơn/payment/mua gói sử dụng khóa chống lặp gắn chủ thể, đích và payload; cùng khóa khác payload trả 409.
- Mutation thất bại giữ dữ liệu trước. Không tự retry một giao dịch bằng khóa mới khi chưa biết lần trước đã commit hay chưa.
- Mỗi response có hạn nghiệp vụ cần đủ timestamp từ máy chủ; countdown FE chỉ hỗ trợ hiển thị, BE vẫn kiểm tra sau khi lấy khóa.

## 5. Thứ tự triển khai và milestone

Mỗi milestone là một lát cắt có thể chạy và trình diễn. Chỉ bắt đầu phần phụ thuộc khi hợp đồng đầu vào đã ổn định; FE có thể dùng fixture theo OpenAPI để dựng UI trong lúc BE phát triển. Fixture không được dùng làm bằng chứng AI thật hoặc giao dịch thật đã tích hợp.

| Mốc | GĐ | Task BE | Task FE | Task chung | Đầu ra và điều kiện chuyển mốc |
| --- | --- | --- | --- | --- | --- |
| M0 - Thiết kế và nền tảng | 1 | BE-01 đến BE-04 | FE-01 đến FE-04 | X-01, X-02 | ADR, OpenAPI, MariaDB dev/test, migration, API client, layout và CI kiểm tra được |
| M1 - Tài khoản và quyền | 1 | BE-05 đến BE-08 | FE-05 đến FE-07 | X-03 | Đăng ký/login JWT/refresh/logout/khôi phục, rotation và thu hồi phiên, scope, hồ sơ/consent/privacy chạy xuyên suốt |
| M2 - Nội dung và khám phá | 1 | BE-09 đến BE-14 | FE-08 đến FE-13 | X-04 | Quản trị tạo/duyệt nội dung; khách tìm/xem/audio/sự kiện; AI chỉ đọc tập công bố |
| M3 - Lịch trình AI | 1 | BE-15 đến BE-18 | FE-14 đến FE-17 | X-05 | AI thật, tuyến có căn cứ, validator độc lập, sửa/lưu có revision; không phát sinh đơn |
| M4 - Offline cơ bản | 1 | BE-19 | FE-18, FE-19 | X-06 | Tắt mạng trước mở vẫn đọc lịch/POI; tải lỗi giữ bản cũ; logout xóa cache riêng |
| M5 - Giao dịch dịch vụ | 1 | BE-20 đến BE-25 | FE-20 đến FE-23 | X-07 | Toàn bộ state machine, giữ tồn/nhả tồn, deadline, retry, hủy/hoàn, hoàn thành đạt thử cạnh tranh |
| M6 - Vận hành và bàn giao GĐ1 | 1 | BE-26 đến BE-28 | FE-24 đến FE-26 | X-08 đến X-10 | Báo lỗi/thông báo, security, tải, restore, UAT, runbook; đủ tiêu chí GĐ1 |
| M7 - Quyền nâng cao và nội dung quốc tế | 2 | BE-29 đến BE-31 | FE-27 đến FE-29 | X-11 (phần quyền/offline) | Đa ngôn ngữ, premium mock, nối hạn, gói offline có giấy phép và quyền có hạn |
| M8 - Cổng đối tác và thương mại | 2 | BE-32 đến BE-35 | FE-30 đến FE-32 | X-11 (phần cổng/thương mại) | Scope đối tác/CTV, gói đối tác, hoa hồng, quảng cáo và thưởng đúng điều kiện |
| M9 - AI nâng cao và nguồn ngoài | 2 | BE-36 đến BE-38 | FE-33 đến FE-35 | X-11 (phần AI/nguồn ngoài) | Chatbot có nguồn, consent hiện tại, thời tiết/mật độ không giả, đồng bộ chịu lỗi |
| M10 - Báo cáo và bàn giao GĐ2 | 2 | BE-39, BE-40 | FE-36, FE-37 | X-12 | Báo cáo/CSV an toàn, chống suy ngược B2G, hồi quy GĐ1 và vận hành GĐ2 |

Đường phụ thuộc chính: `M0 → M1 → M2 → M3 → M4 → M6` và `M2 → M5 → M6`; sau M6, M7/M8/M9 có thể phân công đồng thời theo phụ thuộc từng task; M10 cần báo cáo đối tác từ M8 và pipeline dữ liệu hợp lệ. Cấu hình/log/audit ở M0–M1 phải được dùng ngay trong các module; M6 là mốc kiểm tra tổng thể, không phải lúc mới thêm bảo mật.

## 6. Đầu vào phải chốt và cách xử lý khi thiếu

| Đầu vào | Trách nhiệm | Hạn cần có | Khi chưa có |
| --- | --- | --- | --- |
| Khả năng hosting Node 20.20.2, cron/worker, outbound HTTPS/SMTP, storage, HTTPS | Người vận hành + BE | X-01 trước M0 đóng | Ghi giới hạn hạ tầng; chọn phương án chạy job ngoài process web; chưa cam kết tải/khả dụng |
| Chính sách mật khẩu, session, upload, retention/xóa, giới hạn tạo lịch | Chủ sản phẩm + BE/QA | Trước nghiệm thu M1/M2 | Đưa bản đề xuất có phiên bản vào cấu hình; yêu cầu liên quan để Chưa kiểm chứng đến khi baseline được chốt |
| Tài khoản SMTP/sender và tên miền reset | Người vận hành | BE-06 | Test adapter trong CI, nghiệm thu gửi mail bằng môi trường thử; không gán gửi thật thành công từ mock |
| Nhà cung cấp AI/tuyến, quota, chi phí, quyền sử dụng | Chủ sản phẩm + BE | Trước BE-15/BE-17 tích hợp thật | Viết adapter/contract test; M3 chưa đạt khi không có bằng chứng AI thật và tuyến phù hợp |
| POI/giá/giờ/địa giới, sự kiện, ảnh/audio/transcript có nguồn | Người quản lý nội dung + quản trị | M2 và trước tập thử M3 | Chỉ dùng fixture biệt lập trong test; nội dung thiếu có nhãn, không tự seed dữ liệu thật giả |
| License tải bản đồ/audio và ma trận trình duyệt hỗ trợ | Người quản lý nội dung + FE/BE | Trước BE-31/FE-29 | Khóa phát hành gói đó, vẫn triển khai offline cơ bản |
| Giá/quyền gói đối tác, chiến dịch/thưởng; chính sách độ mới/mật độ | Chủ sản phẩm + quản trị | Trước kích hoạt M8/M9 | Giữ tính năng chưa kích hoạt; không hard-code giá/ngưỡng thương mại chưa chốt |
| Nguồn thời tiết/sự kiện được phép và bộ thử suy ngược B2G | BE/QA + chủ dữ liệu | M9/M10 | Adapter chưa cấu hình trả thiếu dữ liệu; không giả dữ liệu thời gian thực hoặc tự bật `complement_safe` |

Không có câu hỏi phạm vi chính cần mở lại. Các đầu vào trên là cấu hình/thiết kế triển khai theo SRS, không phải yêu cầu xin xác nhận lại web/AI/thanh toán giả lập.

## 7. Ước lượng và phân công

Mỗi task có vai trò chịu trách nhiệm, milestone, phụ thuộc và kích thước: S = 0,5–1 ngày công; M = 1–2; L = 2–4. Là ước lượng sơ bộ cho một người có kinh nghiệm, gồm code, review và test ở phạm vi task; chưa gồm chờ nhà cung cấp, sản xuất nội dung, vận hành theo dõi một tháng hoặc thay đổi phạm vi. Task L cần tách issue con nếu vượt 4 ngày.

Chưa có số người/năng lực và ngày khởi công nên không gán ngày hoàn thành. Sau X-01/X-02, ước lượng lại bằng dữ liệu thực tế và lập sprint 1–2 tuần theo khả năng đội. Vai trò đề xuất: BE chịu API/CSDL/job, FE chịu UI/offline, QA chịu test và truy vết, OPS chịu triển khai/backup, PO/content chịu dữ liệu và cấu hình. Nếu một người kiêm nhiều vai trò thì cộng khối lượng công việc, không coi các luồng làm đồng thời là rút ngắn tự động.

## 8. Quy tắc hoàn thành task và milestone

Task bắt đầu ở `TODO`; đổi `IN_PROGRESS`, `BLOCKED` kèm đầu vào thiếu, `IN_REVIEW`, rồi `DONE`. Checkbox chỉ đánh khi có bằng chứng đáp ứng tiêu chí. `DONE` cần code được review, contract/schema cập nhật nếu thay đổi, test đúng rủi ro, migration/rollback nếu cần và liên kết PR/kết quả kiểm chứng. Không viết test chỉ lặp lại implementation; ưu tiên quyền truy cập, bất biến, biên thời gian và luồng người dùng.

Mỗi yêu cầu con có trạng thái riêng: Chưa làm / Đang làm / Đạt / Không đạt / Chưa kiểm chứng, kèm build, dữ liệu thử, phiên bản chính sách, người kiểm tra và bằng chứng. Một task hoàn thành không tự làm toàn bộ FR/NFR liên quan đạt. Chỉ số khả dụng theo tháng phải có đủ cửa sổ đo; chạy smoke test không chứng minh 99,5%.

Rủi ro ưu tiên: sai giữ tồn do cạnh tranh; lộ dữ liệu do scope/cache; lịch AI không khả thi; thiếu quyền dữ liệu offline; job không chạy trên hosting; thiếu nội dung có nguồn; báo cáo suy ngược nhóm nhỏ. Các rủi ro này có task và cổng nghiệm thu riêng ở tài liệu tích hợp.
