# Thiết kế đăng nhập JWT

Ngày cập nhật: 30/10/2026. D-22 xác nhận dùng JWT; các thời hạn và lựa chọn kỹ thuật
dưới đây là baseline đề xuất cho BE-05/FE-05, chưa phải chức năng đã triển khai.

## Token và xác thực

- Access token là JWT ký RS256, hạn 15 phút; claims bắt buộc `sub` (user GUID),
  `sid` (session GUID), `jti`, `iss`, `aud`, `iat`, `exp`; header `typ=at+jwt`,
  `kid` chỉ tra keyring nội bộ. Allowlist RS256, kiểm chữ ký, issuer, audience,
  loại token và hạn; từ chối `none`, thuật toán khác, claim thiếu/sai kiểu, thời
  điểm phát hành tương lai ngoài sai lệch cho phép 30 giây. Không đọc URL khóa
  tùy ý từ header. Không chứa mật khẩu, dữ liệu liên hệ hoặc quyền làm nguồn quyết định.
- FE giữ access token trong bộ nhớ, gửi `Authorization: Bearer ...`; không lưu
  token trong localStorage, sessionStorage, IndexedDB, service worker, URL hoặc log.
- Refresh token là chuỗi opaque từ CSPRNG ít nhất 32 byte, không phải JWT; lưu
  SHA-256 trong `auth_refresh_tokens`. Cookie production `HttpOnly; Secure;
  SameSite=Lax; Path=/api/v1/auth`, không đặt Domain. Phiên hết hạn tuyệt đối
  sau 7 ngày, rotate không gia hạn phiên. Nếu triển khai khác site phải chốt
  SameSite=None/Secure và CORS credentials với origin cụ thể ở X-01.
- Mỗi API được bảo vệ kiểm tra DB: `sid` thuộc `sub`, phiên chưa thu hồi/chưa hết
  hạn, user ACTIVE; tải role/owner/scope hiện hành. Logout, khóa tài khoản và
  thay đổi quyền có hiệu lực từ request kế tiếp dù JWT còn hạn. DB lỗi trả 503,
  không cho truy cập dựa riêng vào chữ ký JWT.
- Cấu hình auth cần bổ sung khi code: issuer, audience, keyring/kid, private key
  qua secret store hoặc file ngoài repo, TTL, origin/cookie policy; không seed
  khóa thật vào SQL hay `.env.example`. Rotation giữ public key cũ đủ hạn access
  token; sự cố lộ khóa phải thu hồi phiên liên quan và loại khóa bị lộ.

## Hợp đồng API dự kiến

Tất cả nằm dưới `/api/v1`; phải bổ sung OpenAPI trong X-02 trước tích hợp.

| Endpoint | Hành vi |
| --- | --- |
| POST `/auth/register` | Tạo tài khoản, không tự đăng nhập; trả 201, sau đó login |
| POST `/auth/login` | Kiểm mật khẩu/trạng thái/rate limit; tạo session + refresh token trong transaction; trả accessToken, tokenType=Bearer, expiresIn=900, user và đặt cookie refresh |
| POST `/auth/refresh` | Nhận cookie, xoay refresh một lần, trả access token mới và cookie mới |
| POST `/auth/logout` | Thu hồi session của cookie refresh kể cả access đã hết hạn; xóa cookie với cùng Path; lặp lại vẫn trả 204 |
| GET `/auth/me` | Yêu cầu Bearer; trả user và quyền hiện hành |

Response chứa token dùng `Cache-Control: no-store`. Login/refresh/logout kiểm
Origin allowlist chính xác và bắt buộc custom header `X-CSRF-Protection: 1`;
từ chối Origin thiếu/null/khác, CORS không wildcard, preflight chỉ cho origin
và header đã cấu hình. Login cũng áp dụng để tránh login CSRF. Các API nghiệp vụ
chỉ nhận Bearer, không dùng refresh cookie như credential. Sai/mất/hết hạn access
trả 401 với code riêng `ACCESS_TOKEN_EXPIRED`; thiếu quyền trả 403. Refresh sai,
hết hạn, đã dùng hoặc session revoked trả 401 và xóa cookie.

## Rotation, replay và cạnh tranh

Tra hash để tìm session, sau đó transaction khóa user → session → refresh token
theo cùng thứ tự với khóa tài khoản/reset password. Đọc lại và kiểm tra thời hạn
sau khóa. Đánh dấu `used_at` và insert hash token mới cùng transaction; JWT mới
có `exp` không vượt `auth_sessions.expires_at`. Commit rồi mới gửi cookie/token.
Phát hiện token đã dùng phải commit thu hồi toàn bộ session đó rồi trả 401,
không throw làm rollback việc thu hồi. Token không tồn tại không thu hồi phiên khác.
Lưu hash đã dùng đến hết hạn tuyệt đối của session để phát hiện replay.

FE gom các 401 hết hạn vào một refresh promise; phối hợp nhiều tab bằng khóa
Web Locks khi hỗ trợ và thông báo logout qua BroadcastChannel, không phát tán
token qua channel. Không tự refresh vô hạn hoặc refresh khi 403. Hai refresh cùng
token: một rotate thành công, request còn lại làm session bị thu hồi theo chính
sách nghiêm ngặt; trình duyệt không phối hợp được yêu cầu đăng nhập lại. Mất
response rotate cũng đăng nhập lại, không tự dùng token cũ. Sau refresh, chỉ gửi
lại request một lần; mutation giữ nguyên idempotency key và payload.

Logout thu hồi phiên hiện tại. Reset mật khẩu/khóa/ẩn danh tài khoản thu hồi tất
cả phiên trong transaction. Cleanup xóa refresh tokens trước session sau khi hết
hạn và theo retention, không xóa sớm hash đã dùng của phiên còn hiệu lực.

## CSDL và nghiệm thu

`auth_sessions` giữ vòng đời phiên; `auth_refresh_tokens` giữ lịch sử rotation,
unique hash, FK session và thời điểm dùng. Ràng buộc expiry của token không vượt
session và tối đa một token chưa dùng mỗi phiên được service bảo đảm dưới khóa.
Không lưu access JWT trong DB, không dùng password reset token làm refresh token.
DB mới dùng `be/schema.sql`; DB cũ dùng migration
`be/migrations/001-jwt-auth.sql` sau kiểm tra baseline/backup. Migration buộc
đăng nhập lại mọi phiên cũ; chưa chạy trên hosting.

BE-05/FE-03/FE-05/X-03 phải kiểm: JWT giả chữ ký/sai alg/iss/aud/typ/hết hạn,
session revoked/user locked/role bị thu hồi, refresh một lần và replay/cạnh tranh,
logout khi access hết hạn, reset thu hồi tất cả phiên, CSRF/CORS, reload/multi-tab,
DB lỗi, mất response và token không lọt log/cache/storage.

Tham khảo kỹ thuật: [JWT BCP – RFC 8725](https://www.rfc-editor.org/rfc/rfc8725.html)
và nguyên tắc rotation/replay trong [RFC 9700 §4.14](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14).
Việc áp dụng rotation ở đây không có nghĩa dự án triển khai OAuth server.
