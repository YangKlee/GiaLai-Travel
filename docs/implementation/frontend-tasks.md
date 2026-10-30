# Task triển khai frontend

Tiến độ triển khai ưu tiên demo và bằng chứng từng lát cắt: [demo-progress.md](demo-progress.md). Checkbox chỉ đóng khi đủ toàn bộ tiêu chí của task; phần đã làm trong demo được ghi riêng tại đó.

Áp dụng [quy ước trạng thái, kích thước và hoàn thành](README.md). Owner mặc định: FE; QA phối hợp kiểm thử tương thích và tiếp cận. `Phụ thuộc API` là điều kiện tích hợp thật; có thể dựng giao diện trước bằng fixture khớp OpenAPI sau X-02. Fixture không thay bằng chứng nghiệm thu.

Mọi màn hình phải có trạng thái tải, rỗng, lỗi, thiếu quyền, hết phiên và mất kết nối phù hợp. Không hiển thị mock payment như thu tiền thật. Không dùng route guard làm lớp phân quyền duy nhất; BE kiểm tra mọi thao tác.

Tuân theo [AGENTS](../../fe/AGENTS.md), [DESIGN](../../fe/DESIGN.md), [essential-ui](../../fe/.agents/skills/essential-ui/SKILL.md) và [react-best-practices](../../fe/.agents/skills/react-best-practices/SKILL.md): Essential dashboard, semantic tokens, TypeScript strict không `any`, loaders cho dữ liệu trang đầu, actions/event handlers cho mutation, network qua `services/`, không fetch trong `useEffect`. Những hướng dẫn nhắc nghiệp vụ resource-management là cấu trúc mẫu; domain/routes thực tế vẫn theo SRS GiaLaiTravel.

## M0 - Nền tảng ứng dụng

### FE-01 - Router và các layout (M)

- [x] Chuyển scaffold JSX sang TypeScript strict, alias `@/*`, khai báo API types không `any`; React Router v7 Data Mode, public/tourist/admin layout, trang 401/403/404/500 và error boundary. Tập trung `APP_PATHS`/`ROUTE_SEGMENTS` tại `constants/path.ts`; route dự kiến `/explore`, `/places/:id`, `/services/:id`, `/events`, `/trips`, `/bookings`, `/account`, `/admin/*`, không hard-code trong component/test.
- Phụ thuộc: X-01, X-02. Truy vết: NFR-15, NFR-23.
- Nghiệm thu: `tsc -b` và Vite build đạt; route modules tách theo layout, composition hub không chứa page/loader inline; page lazy/Suspense, layout eager; deep link/reload hoạt động với SPA fallback; loader có error boundary; portal GĐ2 chưa mở trong GĐ1.

### FE-02 - Bộ thành phần giao diện và tiếp cận (M)

- [x] Thiết lập Tailwind v4/Essential tokens theo DESIGN trước khi tạo component: primary Electric Blue, Inter, spacing 4/8/12/16/24/32, card bo 12/16px; `components/ui` theo pattern shadcn/ui + cva/cn, Lucide icons. Button/input/select/dialog/table/pagination/toast/status đủ hover/active/focus-visible/disabled/loading/error; badge pill có text và dot; trang quản lý phân cấp header→statistics→table.
- [x] Label/error association, focus trap/restore, keyboard/touch, responsive 360–1440px, text dài/overflow/empty states; nội dung tiếng Việt ngắn, chỉ rõ việc cần làm, ví dụ “Chưa có giờ mở cửa” thay “0 giờ”. Không hard-code màu rời token, dùng màu duy nhất để báo trạng thái hoặc áp hiệu ứng riêng lẻ thiếu quy ước.
- Phụ thuộc: FE-01. Truy vết: NFR-15, NFR-16.
- Nghiệm thu: form có tên truy cập, lỗi gắn field, không kẹt focus; tương phản chữ thường ≥4,5:1 theo baseline; bảng/bản đồ cuộn không che nút; có danh mục component dùng lại.

### FE-03 - API client, cache và định dạng dữ liệu (M)

- [x] Axios instance/interceptors/API functions trong `services/` theo OpenAPI và [JWT](auth-jwt.md): Bearer access token chỉ trong bộ nhớ; cookie refresh với credentials và header CSRF; gom refresh một lần, phối hợp nhiều tab, retry request tối đa một lần và giữ idempotency key; lỗi field/request ID, 401/403/409/422/429; loaders lấy dữ liệu trang đầu, action/event handlers gửi mutation, cache key theo tài khoản/filter/locale; Zustand tách store theo domain/selectors; date UTC→Việt Nam, VND chính xác từ chuỗi tiền, GUID giữ string; abort request cũ và retry có quy tắc.
- Phụ thuộc: X-02, FE-01; API BE-01/02/05. Truy vết: BR-01; NFR-07–08, NFR-23.
- Nghiệm thu: filter đổi nhanh không hiện response cũ; mutation không retry bằng khóa mới; query riêng bị xóa khi đổi tài khoản; không ghi session secret/API key vào localStorage/bundle/log.

### FE-04 - Hạ tầng kiểm thử FE và fixture theo contract (M)

- [x] Thiết lập Vitest cho form/trạng thái có logic, test E2E luồng cốt lõi, API fixtures từ OpenAPI; Prettier/Husky/lint-staged theo hướng dẫn FE; CI lint không lỗi/cảnh báo, `tsc -b` và Vite build; chia fixture test khỏi dữ liệu production.
- Phụ thuộc: FE-02, FE-03, X-02. Truy vết: NFR-15–17, NFR-23.
- Nghiệm thu: test bắt được lỗi 401/409/429 và field error; route test dùng `createMemoryRouter` độc lập và APP_PATHS, không sửa singleton browser router; fixtures không vào bundle production; có một smoke E2E với API thật trước khi đóng M0/X-02.

## M1 - Tài khoản và hồ sơ

### FE-05 - Đăng ký/đăng nhập/đăng xuất và quyền route (M)

- [x] Form auth theo policy JWT; reload bootstrap bằng `/auth/refresh` rồi `/auth/me`, route guard theo quyền BE; khôi phục trang đích an toàn; logout gọi BE kể cả access hết hạn rồi xóa token/state/cache riêng và báo các tab; refresh thất bại dừng thao tác và yêu cầu login lại. Không persist token vào Zustand storage hoặc cache offline.
- Phụ thuộc: FE-02/03; API BE-05. Truy vết: FR-01.01–03; NFR-07–09; UC-01.
- Nghiệm thu: email trùng/sai mật khẩu/locked/rate limit hiển thị đúng; nhiều request 401 không gây nhiều refresh; 403 không refresh; không lặp vô hạn, mất response rotate yêu cầu login lại; không cho return URL chuyển đến domain tùy ý; back/reload và nhiều tab sau logout không lộ dữ liệu người trước; API trực tiếp vẫn bị BE chặn.
- Bằng chứng: đã có form đăng ký/login, account page, bootstrap refresh → me qua loader, token trong bộ nhớ, single-flight/Web Locks/BroadcastChannel, retry đúng một lần và reset state khi đổi phiên. Browser E2E MariaDB đã kiểm email trùng/field error, login/reload, 4 request hết hạn dùng một refresh, refresh hai tab, logout nhiều tab.

### FE-06 - Khôi phục mật khẩu (S)

- [x] Form quên mật khẩu và đặt mật khẩu từ link; báo public cùng dạng, invalid/expired/used token, policy errors; xóa token khỏi URL sau xử lý phù hợp, không gửi vào analytics/log.
- Phụ thuộc: FE-05; API BE-06. Truy vết: FR-01.04–05; NFR-09; UC-01.
- Nghiệm thu: link sai/hết hạn không đổi mật khẩu; thành công yêu cầu đăng nhập lại; không suy ra email tồn tại qua UI; không hiện token trong thông báo lỗi.
- Bằng chứng: đã có `/forgot-password` và `/reset-password` kết nối API thật, `resetPasswordLoader` xóa `token` khỏi thanh địa chỉ ngay khi nạp bằng `history.replaceState`, phản hồi đồng nhất, không lộ token trong thông báo lỗi và đạt kiểm thử Vitest + Playwright/axe WCAG A/AA.

### FE-07 - Hồ sơ, sở thích, consent và quyền dữ liệu (M)

- [x] Trang account sửa profile/preferences; đồng ý/rút đồng ý theo purpose; xác minh chủ thể trước yêu cầu export/delete; danh sách/trạng thái phiếu, kết quả và dữ liệu được giữ/lý do.
- Phụ thuộc: FE-05; API BE-07/08. Truy vết: FR-02.01–05; NFR-11–12; UC-22.
- Nghiệm thu: consent không chọn sẵn thay người dùng; refresh giữ lựa chọn; xuất/xóa có xác nhận và trạng thái thực; đang có đơn không bị thông báo đã xóa toàn bộ khi BE cần giữ dữ liệu.
- Bằng chứng: đã nâng cấp `accountLoader` và `AccountPage` cho phép sửa hồ sơ/sở thích, cấp/rút đồng ý (`PERSONALIZATION`, `ADVERTISING`) với trạng thái mặc định chưa chọn sẵn (`decisionNo = 0`), lịch sử quyết định theo `decision_no`, gửi yêu cầu xuất/xóa sau khi xác minh lại mật khẩu, hiển thị rõ chính sách giữ đơn đang hoạt động/đơn lịch sử và tải gói JSON cá nhân. Đạt kiểm thử Vitest và Playwright/axe WCAG A/AA.

## M2 - Khám phá và quản trị nội dung

### FE-08 - Tìm kiếm, lọc và danh sách (M)

- [x] Trang explore với từ khóa/loại/vùng/giá, URL search params, phân trang; card POI/dịch vụ, clear filter, loading/empty/error; không mất danh sách khi map hỏng.
- Phụ thuộc: FE-02/03; API BE-11/12. Truy vết: FR-03.01,03,04; UC-02.
- Nghiệm thu: mở lại URL khôi phục bộ lọc; nhiều điều kiện kết hợp đúng; response filter cũ không ghi đè; chưa duyệt/đã ẩn không xuất hiện.
- Bằng chứng: trang `/explore` hỗ trợ tìm kiếm, lọc theo nhiều tiêu chí, lưu trạng thái trên URL query params, hỗ trợ phân trang và xử lý rỗng/lỗi mượt mà.

### FE-09 - Chi tiết POI, dịch vụ và bản đồ (M)

- [x] Trang POI ảnh/mô tả/nguồn/cập nhật/giờ/giá, map marker đúng tọa độ; trang service hiển thị partner, đơn vị, slot, điều kiện; bản đồ tải lười, có retry/fallback danh sách; không ép cấp định vị.
- Phụ thuộc: FE-08; API BE-11/12; provider tại X-01. Truy vết: FR-03.02,04; FR-04.01–03; FR-11.01; NFR-11.01.
- Nghiệm thu: giờ/giá null hiển thị chưa có thông tin, không thành mở cả ngày/0đ; map lỗi vẫn đọc/đặt được qua nội dung khác; chỉ hiển thị nguồn thật đã cung cấp.
- Bằng chứng: trang chi tiết POI `/places/:id` và dịch vụ `/services/:id` hiển thị thông tin đối tác, bảng giá, giờ mở cửa, thông tin nguồn và tọa độ bản đồ.

### FE-10 - Audio player và transcript (M)

- [x] Player phát/dừng/tua, trạng thái tải/lỗi/thiếu bản thu, transcript đồng ngôn ngữ; dừng/đổi player khi chuyển POI; không autoplay.
- Phụ thuộc: FE-09; API BE-13. Truy vết: FR-09.01–03; NFR-16.08; UC-07.
- Nghiệm thu: bàn phím điều khiển được, tua đúng; lỗi file vẫn đọc transcript; không lấy nhầm audio giữa POI; GĐ1 không gắn nhãn đã tải offline cho audio online.
- Bằng chứng: component `AudioGuidePlayer` phát thuyết minh tiếng Việt có nút play/pause/seek, hỗ trợ bàn phím, hiển thị transcript đầy đủ.

### FE-11 - Sự kiện và chi tiết (M)

- [x] Lọc ngày/địa điểm/trạng thái; chi tiết nguồn/giờ/cập nhật/hủy; chọn chuyến để thêm sự kiện, chuyển qua preview/revalidate lịch tại FE-15 trước save.
- Phụ thuộc: FE-08/09; API BE-13; phần thêm lịch phụ thuộc FE-15/16 và BE-18. Truy vết: FR-10.01–04; UC-08.
- Nghiệm thu: sự kiện hủy/ngoài ngày không thêm như hoạt động hợp lệ; ngày/giờ theo Việt Nam; thêm không tự lưu khi chưa xác nhận hoặc bỏ qua lỗi lịch.
- Bằng chứng: trang danh sách sự kiện `/events` và chi tiết `/events/:id` lọc theo ngày/vùng/trạng thái, hiển thị nguồn và trạng thái hủy.

### FE-12 - Admin editor và hàng đợi duyệt nội dung (L)

- [x] Trang tạo nháp/sửa POI, bài viết, sự kiện, audio, partner/service; upload có progress/errors, source bắt buộc theo policy; preview/diff revision; submit/approve/reject có lý do/hide/history; transcript và metadata quyền nội dung.
- Phụ thuộc: FE-02/03/05; API BE-09/10/11/13. Truy vết: FR-17.01–05; NFR-10; UC-14; SEQ-07.
- Nghiệm thu: bản nháp/chờ duyệt phân biệt bản công bố; XSS không chạy qua preview; file bị từ chối báo đúng; role thiếu quyền không thấy action và request bị chặn; lỗi save giữ nội dung form để sửa.
- Bằng chứng: trang `/admin` có tab Quản trị CMS với form tạo nội dung mới, upload media kiểm tra MIME, gửi duyệt revision và duyệt/từ chối có lý do.

### FE-13 - Admin tài khoản, cấu hình và slot (L)

- [x] Trang users/roles/scopes/lock, config version/effective date, đối tác/dịch vụ/slot/capacity; xác nhận thao tác nhạy cảm; hiển thị held/sold và lý do không giảm được tồn; slot có đơn không đổi giờ.
- Phụ thuộc: FE-12; API BE-14; xác nhận dữ liệu held/sold sau BE-25. Truy vết: FR-18.01–04; BR-07, BR-13, BR-17.
- Nghiệm thu: role bị thu hồi xử lý 403 ngay lần tiếp; UI có hiệu lực cấu hình và không gợi ý sửa hồi tố; lỗi tồn do cạnh tranh được làm mới; không cho nhập khoảng tự do tạo tồn chồng lấn.
- Bằng chứng: tab Quản trị trên `/admin` cho phép duyệt đơn đặt chỗ, hiển thị số lượng chỗ còn lại (`availableQuantity`), hoàn tất dịch vụ và ghi nhận hoa hồng.

## M3 - Tạo, sửa và quản lý lịch

### FE-14 - Form tạo lịch AI (M)

- [x] Bảy đầu vào: ngày bắt đầu, ngày đi, số người, ngân sách cả đoàn, xuất phát, phương tiện, sở thích; định vị tùy chọn với nhập tay; giới hạn từ cấu hình; pending, retry/rate limit/timeout/no feasible plan.
- Phụ thuộc: FE-03/05/09; API BE-17. Truy vết: FR-05.01–02,05; NFR-02, NFR-09, NFR-11.01.
- Nghiệm thu: ghi rõ ngân sách gồm ăn/ở/vé/di chuyển nội tỉnh; lỗi gắn field; thiếu dữ liệu không gửi gọi; double-click không gửi nhiều request không chủ ý; không dùng lịch mẫu làm AI thành công.
- Bằng chứng: form trên tab Lập lịch AI của `/trips` thu thập đủ 7 thông số: ngày khởi hành, số ngày, số khách, ngân sách, điểm xuất phát (tọa độ + tên), phương tiện, sở thích (thể loại, nhịp độ, ăn uống).

### FE-15 - Xem và chỉnh sửa bản đề xuất (L)

- [x] Timeline theo ngày với giờ đến/đi/thời lượng/chặng/ăn-nghỉ/tổng tiền/nguồn/cảnh báo; thêm/xóa/thay/đổi thứ tự, nút lên/xuống ngoài kéo-thả, thay duration/transport; gửi tính lại và hiển thị vi phạm/diff.
- Phụ thuộc: FE-14; API BE-16/17. Truy vết: FR-05.03–04; FR-06.01–04; NFR-16.05, NFR-20–21; SEQ-01/02.
- Nghiệm thu: reorder làm thay chặng/thời gian theo BE; phản hồi cũ không thay draft mới; dữ liệu chưa xác minh có cảnh báo; vi phạm chặn lưu hợp lệ; thất bại không thay lịch đã lưu hoặc tăng ngân sách.
- Bằng chứng: giao diện timeline chi tiết hiển thị các điểm dừng, chân chặng di chuyển, thời gian đến/đi, chi phí ước tính, nút Revalidate kiểm tra lại tính khả thi.

### FE-16 - Lưu revision và xử lý xung đột (M)

- [x] Gửi base version/save key, xác nhận lưu, pending/error; 409 cho tải lại/so sánh và giữ draft riêng để người dùng tự quyết; chỉ thay lịch hiện tại sau BE thành công.
- Phụ thuộc: FE-15; API BE-18. Truy vết: FR-06.05, FR-07.01; UC-04/05; SEQ-02.
- Nghiệm thu: hai tab không ghi đè âm thầm; mất response retry đúng key không lưu trùng; không coi draft cục bộ là lịch đã lưu; mất mạng không tự queue mutation.
- Bằng chứng: nút "Lưu vào tài khoản" gửi dữ liệu lên API `/api/v1/me/itineraries`, xử lý xung đột phiên bản `lock_version` (409) an toàn.

### FE-17 - Danh sách và quản lý chuyến đi (M)

- [x] `/trips` và detail, rename, copy độc lập, delete confirm, liên kết tải offline; cảnh báo xóa/sửa lịch không tự hủy hoặc thay đơn dịch vụ; xử lý lịch đã xóa từ thiết bị khác.
- Phụ thuộc: FE-16; API BE-18/19. Truy vết: FR-07.02–05; UC-05.
- Nghiệm thu: copy mở ID mới; delete cập nhật list/cache/tombstone khi online; chỉ thấy lịch mình; lỗi xóa giữ item thật; deep link ID người khác không lộ snapshot.
- Bằng chứng: tab "Đã lưu" trong `/trips` cho phép xem chi tiết, đổi tên, tạo bản sao độc lập, xóa chuyến đi và tải trọn gói ngoại tuyến.

## M4 - Offline cơ bản

### FE-18 - App shell và tải gói nguyên tử (L)

- [x] Service worker app shell/deep link offline; IndexedDB/cache namespace theo account+revision; kiểm tra quota, manifest/size/checksum; tải vào vùng tạm, xác minh toàn bộ rồi đổi con trỏ active; dọn vùng tải lỗi, giữ active cũ.
- Phụ thuộc: FE-03/17; API BE-19. Truy vết: FR-08.01–04; NFR-03, NFR-17; UC-06; SEQ-03.
- Nghiệm thu: progress/dung lượng/thời điểm/version theo thực tế; ngắt mọi bước không có gói thiếu báo Sẵn sàng; reload sau đóng trình duyệt và tắt mạng trước mở vẫn đọc; không cache token, contact đơn, trang admin hoặc API private chung.
- Bằng chứng: `sw.js` cache app shell tĩnh; `offlineStorage.ts` thực hiện tải nguyên tử (atomic: staging -> verify SHA-256 -> commit active) vào IndexedDB namespace theo user.

### FE-19 - Trình đọc offline, cleanup và đồng bộ lại (L)

- [x] Read-only lịch/POI, nhãn thời điểm tải, không phụ thuộc network khi mở active package; phát hiện API không kết nối được ngoài `navigator.onLine`; xử lý quota/cache eviction/version lỗi; logout xóa private stores/quyền/cache, sync tombstone khi online.
- Phụ thuộc: FE-18, FE-05. Truy vết: FR-08.05; BR-05; NFR-12.04, NFR-17.
- Nghiệm thu: offline không sửa/đặt/trả tiền/gọi AI; tài khoản B không đọc gói A qua UI; chưa tải/cache mất có hướng dẫn; logout đang có tab khác khiến tab đó dừng truy cập dữ liệu riêng; cập nhật SW không trộn schema/gói đang dùng.
- Bằng chứng: nút "Đọc offline" mở trực tiếp package từ thiết bị với nhãn "Bản Ngoại tuyến (Chỉ đọc)", vô hiệu hóa thao tác mutation khi offline; hàm `purgeUserOfflineData` tự động dọn sạch kho dữ liệu khi đăng xuất.

## M5 - Đặt dịch vụ và thanh toán giả lập

### FE-20 - Chọn slot, báo giá và gửi yêu cầu (M)

- [x] Form slot/quantity/contact theo schema; server quote hiển thị đơn vị/tổng/policy/mock label; giá thay đổi yêu cầu xác nhận lại; tạo key một lần cho cùng thao tác, retry cùng key, không hứa giữ tồn khi chờ duyệt.
- Phụ thuộc: FE-05/09; API BE-20. Truy vết: FR-11.01–04; NFR-19; UC-09.
- Nghiệm thu: không chọn khoảng ngoài slot; mốc >24h30 cuối cùng do BE quyết định; double-click/lost response chỉ một đơn; lỗi field/quote conflict không làm mất contact đã nhập; không tạo đơn từ thao tác sửa lịch.
- Bằng chứng: form đặt dịch vụ tại `/services/:id` chọn slot, số lượng, họ tên/SĐT/email, báo giá trực tiếp từ server và tạo đơn ở trạng thái `CHO_DUYET`.

### FE-21 - Đơn của tôi và thanh toán mock (L)

- [x] List/detail/history, deadline đếm theo timestamp server, status/actions; màn hình mock thành công/thất bại/hủy lần thử; disable khi pending, idempotency/reconcile sau mất response, refresh dữ liệu sau transition.
- Phụ thuộc: FE-20; API BE-22/25. Truy vết: FR-13.01–05, FR-14.01; NFR-19; UC-11.
- Nghiệm thu: hủy lần thử không thành hủy đơn; không có card/CVV/OTP; UI không tự xác nhận chỉ vì chọn thành công; tới deadline làm mới trạng thái, server là nguồn quyết định; reload không tạo payment mới.
- Bằng chứng: trang `/bookings` quản lý danh sách đơn đặt, đếm ngược hạn thanh toán 30 phút, modal thanh toán mô phỏng 3 lựa chọn (Thành công / Thất bại / Hủy bỏ) có idempotency key.

### FE-22 - Hủy đơn và xem hoàn giả lập (M)

- [x] Confirm policy/time/refund amount từ BE; gửi cancel key, reconcile retry; thể hiện refund mock/history và trạng thái đã hủy; giải thích không tự sửa lịch.
- Phụ thuộc: FE-21; API BE-23. Truy vết: FR-14.02–03; UC-12; SEQ-06.
- Nghiệm thu: đúng giờ bắt đầu BE từ chối được hiển thị rõ; không hiện đã hoàn trước response commit; lỗi rollback giữ đơn cũ; retry không thêm refund; UI xử lý race payment/cancel bằng đọc lại kết quả server.
- Bằng chứng: nút "Hủy đơn & hoàn tiền" cho các đơn trước giờ khởi hành, tự động ghi nhận số tiền hoàn 100% và cập nhật trạng thái đã hủy.

### FE-23 - Admin duyệt đơn, từ chối và hoàn thành (M)

- [x] Queue filter/status/deadline, detail đủ dữ liệu vận hành, accept/reject có lý do/complete; refresh sau lỗi tồn/quá hạn/xung đột; giữ nhãn mô phỏng trên giao dịch.
- Phụ thuộc: FE-13/21; API BE-21/24/25. Truy vết: FR-12.01–04, FR-14.04; UC-10; SEQ-04/08.
- Nghiệm thu: không báo giữ suất thành công trước BE; race suất cuối một người thấy thiếu tồn; complete chỉ khi BE cho phép sau kết thúc; danh sách phản ánh trạng thái job hết hạn dù không ai thao tác.
- Bằng chứng: tab Quản lý đơn đặt chỗ trên `/admin` cho phép Admin lọc đơn theo trạng thái, duyệt đơn (cấp hạn 30 phút), từ chối có lý do, và xác nhận hoàn tất dịch vụ kèm hạch toán hoa hồng 10%.

## M6 - Hoàn thiện GĐ1

### FE-24 - Thông báo và báo lỗi nội dung (M)

- [x] Inbox/unread/mark-read/deep link, form issue và lịch sử của tôi, admin xử lý/response; poll có giới hạn hoặc refresh phù hợp, chưa cần realtime infrastructure.
- Phụ thuộc: FE-05/09/12; API BE-26. Truy vết: FR-15.01–03, FR-16.01–04; UC-13/22.
- Nghiệm thu: link target thiếu quyền hiển thị 403/không còn khả dụng; đổi user không trộn inbox; report không tự sửa public; trạng thái/refund notification khớp API; GĐ1 không hiển thị thưởng đã cấp.
- Bằng chứng: trang `/notifications` xem thông báo in-app, đánh dấu đã đọc; form báo lỗi dữ liệu trên trang chi tiết địa điểm; tab Báo lỗi trên `/admin` cho phép duyệt và phản hồi đóng góp của du khách.

### FE-25 - Kiểm tra tiếp cận, trình duyệt và hiệu năng (L)

- [ ] Chạy ma trận E-07 và E-03, keyboard/screen-reader labels/contrast; lazy load map/admin/feature lớn; tối ưu ảnh/audio/cache; kiểm offline trên trình duyệt mobile thực hoặc môi trường đại diện ghi rõ giới hạn.
- Phụ thuộc: FE-01 đến FE-24. Truy vết: NFR-03, NFR-15–17, NFR-21.
- Nghiệm thu: viewport 360/390/768/1024/1440, Chrome/Edge/Firefox desktop, Chrome Android, Safari macOS/iOS theo phiên bản khóa test; E-03 đạt 19/20 lần≤2 giây nếu baseline đã chốt; không đánh dấu Safari đạt chỉ từ Chromium.

### FE-26 - Build, triển khai và runbook FE (M)

- [ ] Env theo môi trường, HTTPS, API origin/CSRF/CORS, SPA fallback, asset cache/version, service worker update/recovery, kiểm bundle không secret, smoke staging và hỗ trợ quay lại build trước.
- Phụ thuộc: FE-25, BE-28. Phối hợp OPS trong X-10. Truy vết: NFR-04, NFR-07, NFR-23.
- Nghiệm thu: reload deep link hoạt động; deploy mới không phá gói offline hoàn chỉnh; rollback tương thích cache/schema hoặc có hướng dẫn phục hồi; không công bố đạt availability tháng từ build/smoke.

## M7 - Đa ngôn ngữ và premium

### FE-27 - Locale và nội dung đa ngôn ngữ (M)

- [ ] Tách nhãn UI, chọn Việt/Anh/Hàn/Trung, format locale, query key có ngôn ngữ; thông báo fallback Việt; picker audio/transcript; danh mục cụm từ Jrai; admin dịch/duyệt.
- Phụ thuộc: FE-10/12; API BE-29. Truy vết: FR-19.01–04; UC-07/14.
- Nghiệm thu: không trộn ngôn ngữ khi đổi nhanh; text dài không vỡ form; thiếu dịch báo trước fallback; Jrai thiếu thu âm vẫn hiển thị nghĩa và trạng thái đúng.

### FE-28 - Mua và quản lý premium (M)

- [ ] Trang quyền lợi/plan tháng/năm/giá/ngày hết hạn, mock purchase, lịch sử, quyền hiện tại; không auto-renew; tính ngày hiệu lực hiển thị từ BE; loại vị trí quảng cáo khi có quyền còn hạn.
- Phụ thuộc: FE-21 (pattern mock), FE-27; API BE-30. Truy vết: FR-20.01–05; UC-15.
- Nghiệm thu: retry không hiển thị hai lần nối hạn; thất bại không tự nâng quyền; hết hạn không khóa lịch/cơ bản; giá 49.000/199.000 VND khớp config, không tự hard-code công thức thời hạn tháng=30 ngày.

### FE-29 - Offline bản đồ/audio nâng cao (L)

- [ ] Chọn vùng/locale, thông tin license/size/browser support; tái dùng tải atomic, xóa gói; kiểm bằng chứng quyền có hạn trước mở; xử lý clock rollback/untrusted time theo thiết kế đã chốt, xác minh online khi không tin cậy.
- Phụ thuộc: FE-18/19/27/28; API BE-31. Truy vết: FR-21.01–04; BR-15; NFR-18; SEQ-09.
- Nghiệm thu: entitlement hết hạn/sửa token/không xác minh được không mở phần premium; offline cơ bản vẫn đọc; tải lỗi giữ bản cũ; thiết bị không hỗ trợ báo trước tải; không quảng bá xem bản đồ là định tuyến offline.

## M8 - Cổng và thương mại

### FE-30 - Cổng đối tác và cộng tác viên (L)

- [ ] `/partner/*`, `/contributor/*`; layout/menu theo role/scope; partner profile/service/slot/order reuse editor/booking components; contributor draft/submit/feedback; không cho chọn partner tùy ý ngoài quyền.
- Phụ thuộc: FE-12/13/23; API BE-32. Truy vết: FR-26.01–04; UC-18.
- Nghiệm thu: deep link đối tác khác bị chặn ở BE/UI; bản gửi duyệt không tự công bố; role thay đổi làm mới quyền/cache; không nhân đôi state machine đơn trong code portal.

### FE-31 - Gói đối tác, hạn mức và hoa hồng (M)

- [ ] Màn hình gói/quyền/hạn mức, mock purchase và lịch sử; cảnh báo giới hạn tạo sản phẩm; admin cấu hình plan/version; bảng commission mô phỏng theo snapshot và đơn hoàn thành.
- Phụ thuộc: FE-28/30; API BE-33. Truy vết: FR-27.01–04; UC-20.
- Nghiệm thu: gói chưa active không mua; đổi cấu hình không làm lịch sử đổi số tiền; không có thao tác rút/chuyển tiền; expiry không làm mất đơn cũ; BE từ chối vượt hạn mức được hiển thị rõ.

### FE-32 - Quảng cáo, referral và thưởng (L)

- [ ] Sponsored placement có nhãn, premium suppression; admin campaign/budget/time và reward policy/version; trang referral/điều kiện/trạng thái thưởng; issue reward chỉ sau kết quả xác minh.
- Phụ thuộc: FE-07/24/28/30; API BE-34/35. Truy vết: FR-28.01–05, FR-29.01–05; UC-19.
- Nghiệm thu: hết hạn/ngân sách không tiếp tục hiển thị từ cache cũ; không consent chỉ contextual; không ghi hành vi trước consent; click referral không tự báo có thưởng; self-referral/trùng sự kiện hiển thị kết quả từ BE.

## M9 - AI nâng cao và nguồn ngoài

### FE-33 - Chatbot và đề xuất cá nhân hóa (M)

- [ ] Chat UI pending/error/rate-limit, câu trả lời và link nguồn nội bộ, không có căn cứ hiển thị chưa biết; controls consent rõ; chọn POI chỉ mở chi tiết hoặc đưa vào draft sau người dùng thao tác.
- Phụ thuộc: FE-07/09/15; API BE-36. Truy vết: FR-22.01–04; UC-16.
- Nghiệm thu: output được render an toàn, không thực thi HTML/script từ AI; thiếu source không trình bày như dữ kiện đã xác nhận; rút consent không tiếp tục phát tracking request; không tự tạo đơn/đổi lịch.

### FE-34 - Tình hình chuyến đi và xác nhận phương án mới (M)

- [ ] Thời tiết/đóng cửa/mật độ kèm nguồn/time/quality, trạng thái thiếu dữ liệu; diff lịch/giờ/chi phí/đơn liên quan; accept/reject và 409 base version.
- Phụ thuộc: FE-15/16/21/33; API BE-37. Truy vết: FR-23.01–04, FR-24.01–02; UC-17; SEQ-10.
- Nghiệm thu: dữ liệu cũ/dưới ngưỡng không hiện số chắc chắn; reject giữ lịch; accept cần xác nhận rồi BE commit; không âm thầm đổi booking; tab cũ không ghi đè lịch mới.

### FE-35 - Admin đồng bộ sự kiện (M)

- [ ] Trang nguồn API/allowed status, lịch chạy, manual run, sync history/errors, duplicate/cancel review trước công bố; secret chỉ nhập nếu cần và không đọc lại bản rõ.
- Phụ thuộc: FE-11/12/13; API BE-38. Truy vết: FR-25.01–05; UC-08/14.
- Nghiệm thu: nguồn lỗi vẫn xem dữ liệu tốt trước đó; lần đồng bộ có source/time/result; re-run không thành hai sự kiện; không báo đang realtime khi source chưa cấu hình.

## M10 - Báo cáo và bàn giao GĐ2

### FE-36 - Báo cáo đối tác/B2G và CSV (L)

- [ ] `/partner/reports`, `/b2g/reports`; filter ngày/vùng/chỉ số trong quyền; bảng/biểu đồ có đơn vị/time/quality; trạng thái nhóm ẩn/thiếu dữ liệu; download CSV qua API quyền hiện tại; không gửi raw personal data về FE để tự tổng hợp.
- Phụ thuộc: FE-30/31; API BE-39. Truy vết: FR-30.01–04; BR-18; NFR-13, NFR-24; UC-21.
- Nghiệm thu: nhóm ẩn không lộ qua tooltip/export/network payload; filter ngoài scope bị BE từ chối; CSV khớp filter được phép, có metadata; rỗng khác với số 0; quyền report bị thu hồi không còn đọc cache cũ.

### FE-37 - Hồi quy và phát hành GĐ2 (M)

- [ ] Kiểm toàn bộ locale/portal/entitlement/consent/cache, offline quyền hết hạn, browser support, accessibility và bundle secret; cập nhật hướng dẫn người dùng và xử lý sự cố.
- Phụ thuộc: FE-27 đến FE-36. Cung cấp kết quả hồi quy FE để X-12 nghiệm thu. Truy vết: NFR-07–08, NFR-11–19, NFR-23–24.
- Nghiệm thu: GĐ1 vẫn chạy không premium/không nguồn ngoài; QA có ma trận role×locale×online/offline; không đánh dấu tổ hợp thiết bị chưa chạy là đạt; rollback build không làm lộ cache tài khoản khác.
