# Tích hợp, kiểm thử và nghiệm thu

Owner: BE/FE là người thực hiện kỹ thuật; QA kiểm chứng độc lập theo rủi ro; OPS phụ trách môi trường và vận hành; PO/content chịu trách nhiệm dữ liệu và chính sách. Kích thước S/M/L theo [kế hoạch](README.md). Tất cả task chưa hoàn thành.

## Task dùng chung

### X-01 - Khóa thiết kế, chính sách và khả năng hạ tầng (M, M0)

- [ ] BE+FE+OPS ghi ADR: modular monolith, driver/migration, JWT theo D-22 và [thiết kế auth](auth-jwt.md), keyring/rotation/TTL, refresh cookie/CSRF/domain, serialization tiền/time, storage/upload, job/cron và cách giữ bí mật. Kiểm Node 20.20.2, MariaDB 10.5.26, outbound HTTPS/SMTP, TLS, quota file/process trên hosting.
- [ ] PO/QA ghi phiên bản password/session/file/retention/giới hạn lịch, nhà cung cấp và license; các đề xuất NFR chưa chốt giữ nhãn đề xuất. Ghi đầu vào/owner/hạn cần có; riêng provider/license GĐ2 có thể bổ sung trước mốc sử dụng.
- Phụ thuộc: không có. Nghiệm thu: có ADR, policy registry, danh sách dependency chưa có và phương án hosting chạy job; không lấy việc có cPanel làm bằng chứng cron/worker/SMTP đã hoạt động.

### X-02 - OpenAPI, contract, môi trường và CI (L, M0)

Chia hai bước để tránh phụ thuộc vòng: **X-02a** chốt contract ban đầu sau X-01, trước BE-02/FE-03; **X-02b** hoàn thiện CI và kiểm round-trip sau BE-01/02, FE-01/03. Các task ghi phụ thuộc X-02 hiểu là X-02a nếu cần contract để bắt đầu, X-02b nếu cần kiểm chứng tích hợp. Mỗi milestone tiếp tục bổ sung contract trước khi code tính năng tương ứng, không yêu cầu thiết kế hết mọi endpoint GĐ2 ngay tại M0.

- [ ] BE+FE lập OpenAPI cho routes/request/response/status/error, role/scope, money/date/GUID, pagination, CSRF, idempotency payload conflict, version conflict, timestamps/action eligibility; fixture cho thành công/lỗi/empty/offline. Đặt file contract trong repo khi triển khai.
- [ ] QA+OPS tạo dev/test/staging tách DB/secret/media; CI đúng Node 20.20.2: install lockfile, BE tests, FE lint/build, DB integration; thêm FE/E2E khi có hạ tầng test. Dữ liệu tải lớn chỉ dùng ở môi trường đo.
- Phụ thuộc: X-01, BE-01/02, FE-01/03. Nghiệm thu: ít nhất health/readiness và một contract round-trip dùng DB test hoạt động; không deploy hay thay dữ liệu hosting để chạy test; schema thay đổi có migration/recovery note.

### X-03 - Nghiệm thu danh tính và quyền dữ liệu (M, M1)

- [ ] QA chạy đăng ký email trùng/Unicode/case, login fail/locked, JWT sai chữ ký/alg/iss/aud/typ/claims/hết hạn, refresh rotation/replay/cạnh tranh/mất response, logout replay khi access còn/hết hạn, reset sai/hết hạn/đã dùng/cạnh tranh và thu hồi tất cả session, CSRF/CORS, role thu hồi, DB lỗi, profile/consent/privacy ownership; kiểm token không vào storage/log/cache.
- [ ] BE+FE ghi bằng chứng email adapter thật ở staging, rate-limit boundaries, logout multi-tab/cache; xuất/xóa cần chạy lại với dữ liệu booking sau M5.
- Phụ thuộc: BE-05 đến BE-08, FE-05 đến FE-07. Nghiệm thu: UC-01/22 có kết quả hợp lệ và ngoại lệ; không suy ra đã đáp ứng SLA dữ liệu 7 ngày chỉ vì tạo được phiếu.

### X-04 - Nghiệm thu nội dung và dữ liệu đầu vào (M, M2)

- [ ] Content+QA chuẩn bị tập POI/dịch vụ/event/audio có nguồn/quyền/giờ/giá và các trường null; trạng thái nháp/chờ/công bố/ẩn; test sửa revision và rollback projection.
- [ ] FE+BE trình diễn admin duyệt → public search/detail/audio/events; map fail vẫn có list, audio fail vẫn transcript; slot không chồng lấn cùng tài nguyên; bộ lọc/role/source đúng.
- Phụ thuộc: BE-09 đến BE-14, FE-08 đến FE-13 (trừ phần thêm event vào lịch). Nghiệm thu: public và bộ dữ liệu AI chỉ đọc bản công bố; content lead xác nhận tập dữ liệu được phép dùng; thiếu nội dung không được bù bằng mô tả AI tự bịa.

### X-05 - Nghiệm thu AI và sửa/lưu lịch (L, M3)

- [ ] QA lập E-08 ≥50 mẫu độc lập; E-02 ≥100 đầu vào khả thi, thử không khả thi/timeout và concurrency; ghi provider/model/prompt/version/route sources/quota/cost và raw timing không PII.
- [ ] Thử đủ bảy input, AI ID giả/ẩn, route thiếu, trùng giờ/sai giá/vượt ngân sách/injection; thêm event hủy/ngoài chuyến; sửa/copy/delete/two-tab conflict; AI lỗi không tạo booking hoặc đổi lịch trước.
- Phụ thuộc: BE-15 đến BE-18, FE-11 (thêm event), FE-14 đến FE-17, X-04. Nghiệm thu: AI thật có evidence; 100% lịch chấp nhận vượt validator; nếu khóa baseline, ≥95/100 lịch khả thi trong 30 giây và không request chờ quá 45 giây; không loại timeout khỏi mẫu để đạt tỷ lệ.

### X-06 - Nghiệm thu offline cơ bản (L, M4)

- [ ] QA thử E-03: gói 7 ngày/35 POI, ≥20 lần mở mỗi thiết bị đại diện desktop/mobile, đóng browser rồi tắt mạng trước mở. Thử ngắt download từng bước, thiếu quota, cache eviction, checksum sai, version sai, cập nhật SW.
- [ ] Thử A logout→B login, nhiều tab, lịch bị xóa từ thiết bị khác rồi reconnect, API down dù thiết bị vẫn có mạng; chặn mọi mutation offline; kiểm không lưu contact booking/session secret/admin response.
- Phụ thuộc: BE-19, FE-18/19. Nghiệm thu: tải dang dở không Sẵn sàng, bản tốt cũ còn đọc; cache riêng được xóa khi logout; mở offline không chờ response mạng; mục tiêu ≥19/20 lần≤2 giây chỉ đánh đạt sau đo.

### X-07 - Nghiệm thu state machine và cạnh tranh giao dịch (L, M5)

- [ ] QA+BE chạy MariaDB thật theo E-05: ≥20 request tranh suất cuối, cùng/khác key, approve/pay/expire/cancel race; tiêm lỗi sau từng bước ghi; kiểm state, held/sold, payment/refund, history/audit/notification sau mỗi ca.
- [ ] BE+FE chạy xuyên khách đặt→admin duyệt→mock payment→hủy/hoàn hoặc hoàn thành; giá thay đổi cần xác nhận lại; response mất/reload/retry không tạo tác dụng kép; thử đơn sai chủ và mọi chuyển trạng thái cấm.
- Phụ thuộc: BE-20 đến BE-25, FE-20 đến FE-23; BE-26/FE-24 kiểm đủ thông báo ở X-08. Nghiệm thu: các bất biến bên dưới không vi phạm; có report test cạnh tranh/rollback, không chỉ test mock repository.

### X-08 - Hoàn thiện vận hành, privacy và bảo mật (L, M6)

- [ ] QA thử notification target quyền hiện tại, issue ownership/moderation, admin role/scope/config, privacy export/delete với đơn hoạt động, cache logout; kiểm SQL injection/XSS/CSRF/upload/rate limits/secret leakage/prompt injection.
- [ ] BE+OPS kiểm audit success/failure, job cleanup giữ log đúng loại, grants runtime/migration/report, secret rotation; thống nhất retention với tập giao dịch phải giữ trước khi bật xóa tự động.
- Phụ thuộc: X-03 đến X-07, BE-26/27, FE-24. Nghiệm thu: yêu cầu NFR-07–12/14 áp dụng có bằng chứng; không còn lỗi quyền/toàn vẹn mức nghiêm trọng chưa xử lý; policy chưa có version ghi Chưa kiểm chứng.

### X-09 - Đo tải, tương thích và khả năng tiếp cận (L, M6)

- [ ] QA/OPS chạy E-01: 100 phiên, 50 req/s 80% đọc/20% ghi, tối đa 5 AI song song, DB 1.000 POI/500 dịch vụ/100 event/10.000 đơn; warmup 5 phút, đo 15 phút, đa dạng truy vấn. Dữ liệu tải là fixture biệt lập, không phải nội dung công bố production.
- [ ] QA/FE kiểm E-07 và keyboard/labels/focus/contrast/audio transcript; lưu browser/OS thực tế và viewport 360/390/768/1024/1440. OPS thử lỗi provider, metric không PII, cảnh báo >5% API 5xx/5 phút ở lần đánh giá kế tiếp tối đa 1 phút nếu baseline áp dụng.
- Phụ thuộc: BE-27, FE-25, X-08. Nghiệm thu: báo p95 đúng định nghĩa SRS, API đọc≤2s/ghi≤3s theo baseline; báo cả lỗi/timeout/tổng mẫu; các tổ hợp chưa kiểm tra giữ Chưa kiểm chứng; ghi nhận sai khác môi trường đo với hosting.

### X-10 - Restore, UAT và phát hành GĐ1 (L, M6)

- [ ] OPS+BE restore DB+media vào môi trường riêng, đo RPO/RTO và chạy lại auth/content/lịch/booking. Lập runbook deploy/migration/backup/job/rollback, smoke sau deploy; PO+QA ký biên bản từng FR con.
- [ ] FE kiểm HTTPS/deep links/SW version/recovery. OPS bật probe E-04 mỗi phút: web+login+read trong 10 giây; lưu lịch sử backup tối đa 24h và availability theo tháng. Phát hành staging trước, production theo quy trình repo/tổ chức khi đến bước triển khai.
- Phụ thuộc: BE-28, FE-26, X-09. Nghiệm thu: GĐ1 hoàn chỉnh, restore đạt RPO≤24h/RTO≤4h nếu baseline chốt; UAT không còn lỗi chặn luồng; availability 99,5% chỉ ghi đạt khi đủ tháng đo, có thể phát hành pilot với trạng thái đang đo được ghi rõ.

### X-11 - Nghiệm thu các lát cắt GĐ2 (L mỗi lát cắt, M7/M8/M9)

- [ ] X-11a (BE-29–31/FE-27–29): locale/fallback/Jrai, premium 49.000/199.000, retry cấp quyền, nối hạn cuối tháng/năm nhuận, không auto-renew; license, download atomic, proof bị sửa/clock rollback/expiry/browser unsupported; cơ bản vẫn mở.
- [ ] X-11b (BE-32–35/FE-30–32): partner A/B/CTV scope, workflow duyệt, quota plan/expiry, commission một lần, campaign race/hết ngân sách/premium/consent, self-referral/duplicate reward. Giá/điều kiện chưa cấu hình thì không kích hoạt.
- [ ] X-11c (BE-36–38/FE-33–35): chatbot có nguồn/ngoài dữ liệu/injection, consent trước/sau rút và trong race; thời tiết cũ/nguồn lỗi/mật độ dưới ngưỡng; diff/accept/reject/conflict; sync lặp/hủy/lỗi không xóa public tốt.
- Phụ thuộc: X-10 và task tương ứng từng lát cắt. Owner: QA+BE+FE, PO/content xác nhận nguồn/config. Nghiệm thu: mỗi lát có report độc lập; chứng minh mở rộng không phá GĐ1; không đợi toàn M9 mới nghiệm thu phần M7/M8 đã đủ.

### X-12 - B2G, CSV, hồi quy và phát hành GĐ2 (L, M10)

- [ ] QA kiểm group 9/10, tổng/chênh lệch giữa bộ lọc, phạm vi vùng, dữ liệu không có định danh ổn định/tuyến/tọa độ riêng; `complement_safe` chỉ từ pipeline đã review. Thử CSV bắt đầu `=`, `+`, `-`, `@`, ghi phần mềm/phiên bản mở tệp.
- [ ] Chạy role×locale×online/offline, regression auth/booking/AI/offline GĐ1, load/restore mở rộng khi dữ liệu/job mới ảnh hưởng; PO/OPS duyệt bằng chứng và runbook GĐ2, probe sau phát hành.
- Phụ thuộc: X-11a/b/c, BE-39/40, FE-36/37. Nghiệm thu: FR-19–30 và mở rộng NFR có trạng thái/bằng chứng; CSV khớp màn hình và scope; không cho B2G SELECT bảng gốc hoặc đưa dữ liệu cá nhân về FE để tổng hợp.

## Bất biến giao dịch cần kiểm chứng

| Bất biến | Ca kiểm thử tối thiểu |
| --- | --- |
| `held + sold <= capacity`, không âm | Duyệt 20 đơn tranh một suất; giảm capacity đồng thời; pay/cancel/expire race |
| Chờ duyệt chưa giữ tồn | Tạo nhiều đơn hợp lệ, đối chiếu held chưa tăng; chỉ duyệt thành công mới tăng |
| Một success/booking và một refund/payment | Retry cùng key, khác key, mất response, hai tab và gọi đồng thời |
| Trạng thái/tồn/payment/refund/history/audit/notification nguyên tử | Tiêm lỗi sau mỗi bước ghi, kiểm không có commit một phần |
| Mọi thao tác ảnh hưởng đơn/tồn khóa cùng thứ tự | Review SQL: slot→booking; test deadlock rollback/retry bounded cùng key |
| Đồng hồ máy chủ quyết định | FE clock sai, job dừng, API vẫn từ chối tại mốc hạn; thời gian đọc sau khóa |
| Lịch/đơn độc lập | Sửa/xóa/đổi lịch không hủy đơn; hủy đơn không sửa lịch |
| Nội dung/lịch đã dùng không bị mutate | Công bố bản mới hoặc sửa lịch tạo revision mới, snapshot cũ giữ nguyên |

## Bộ thử biên thời gian

| Quy tắc | Trước mốc | Đúng mốc / sau mốc |
| --- | --- | --- |
| Bắt đầu dịch vụ cách lúc gửi 24h30 | Chưa đủ, từ chối | Đúng 24h30 vẫn từ chối; lớn hơn mới nhận |
| Hạn duyệt = gửi +24h | Cho duyệt nếu đủ điều kiện | Từ chối duyệt, hết hạn |
| Hạn trả tiền = duyệt +30 phút | Cho thử mock nếu đúng chủ/state | Từ chối xác nhận, nhả held đúng một lần |
| Giờ bắt đầu sử dụng | Cho tự hủy nếu state hợp lệ | Không cho tự hủy |
| Giờ kết thúc sử dụng | Chưa cho hoàn thành | Chỉ sau giờ kết thúc mới cho hoàn thành theo UC-10 |
| Reset token = cấp +15 phút | Token chưa dùng được chấp nhận | Từ chối tại/sau hạn |
| Premium hết hạn | Mở quyền nâng cao nếu chứng minh hợp lệ | Khóa nâng cao; offline cơ bản vẫn đọc |

Dùng clock có thể điều khiển cho test service, xác nhận thêm SQL/API integration; không để CI chờ 24 giờ hoặc sửa giờ máy dùng chung. Thêm cuối tháng, năm nhuận, UTC qua ngày Việt Nam và thời điểm lấy khóa bị chậm.

## Hồ sơ bằng chứng và điều kiện đóng giai đoạn

Mỗi kết quả ghi: ID yêu cầu con, task/test case, commit/build, môi trường/Node/DB/browser, dữ liệu và phiên bản policy/provider/prompt, bước tái hiện, kết quả mong đợi/thực tế, số đo/ảnh/log đã che bí mật, người kiểm tra/ngày và lỗi còn mở. Log/ảnh có PII phải được giới hạn truy cập, không commit vào repo công khai.

Chỉ đánh dấu Đạt khi chạy kiểm chứng đúng điều kiện. Chưa đủ dữ liệu/nguồn/license/hạ tầng hoặc chưa đủ cửa sổ đo ghi Chưa kiểm chứng và chỉ ra owner đầu vào; không thay bằng đạt có điều kiện ngầm. Từng FR con trong [ma trận](traceability.md) cần được gắn testcase khi bắt đầu milestone tương ứng.

Không cần code mới để hoàn thành bộ kế hoạch này. Khi triển khai thật, mỗi task có thể thành issue/PR nhỏ; tách X-11 thành ba issue độc lập và task L thành subtask nếu quá 4 ngày công.
