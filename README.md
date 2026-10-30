# GiaLai Travel

Tài liệu: [Cấu trúc dự án BE/FE](PROJECT_STRUCTURE.md) · [Tiến độ demo](docs/implementation/demo-progress.md) · [SRS](docs/srs/README.md) · [Kế hoạch và task triển khai BE/FE](docs/implementation/README.md).

Backend Express 5 (JavaScript) và frontend React 19 (TypeScript strict, Vite), dùng npm workspaces.

## Chạy demo trước

```powershell
npm ci
npm run dev:demo
```

Mở http://localhost:5173: tìm/lọc/phân trang địa điểm → xem chi tiết → thêm điểm vào chuyến đi → đổi tên, sắp xếp và xóa điểm trong bản nháp.

Demo không cần `.env` hoặc CSDL; API mẫu chạy cổng 3000, chỉ bind loopback. Nội dung/giá/thời lượng có nhãn mẫu, chưa xác minh để hướng dẫn du lịch. Bản nháp chỉ nằm trong bộ nhớ phiên mở trang, tải lại sẽ xóa; chưa có tài khoản, AI, lưu lịch lên máy chủ hoặc giao dịch. Chưa có ảnh du lịch được cấp phép nên dùng minh họa biểu tượng cục bộ. Nếu máy có `fe/.env`, để trống `VITE_API_BASE_URL` và trỏ `API_PROXY_TARGET` đến `http://localhost:3000` khi chạy demo.

### Demo có tài khoản

Khi MariaDB local đang chạy tại `127.0.0.1:3307`:

```powershell
npm run setup:demo:auth
npm run dev:demo:auth
```

Setup tạo DB mới, user CSDL runtime chỉ có DML, khóa RSA và `be/.env.demo-auth` riêng
(Git ignore); không load hoặc ghi đè `.env` hosting. Có thể đặt `DEMO_DB_PORT/USER/PASSWORD`
qua env nếu cấu hình quản trị local khác. Setup từ chối ghi đè file cấu hình đã có.
Mở http://localhost:5173/register để tạo tài khoản thật trong DB local, rồi đăng nhập.
Danh mục địa điểm vẫn là mẫu; chưa có lưu lịch lên tài khoản. Dừng demo cũ trước khi
chạy chế độ này vì dùng cùng cổng 3000/5173. Chi tiết tại [thiết kế auth](docs/implementation/auth-jwt.md).

## Yêu cầu

- Node.js **20.20.2**, được khai báo trong `.nvmrc`, `.node-version` và `engines`.
- npm đi kèm Node.js.
- Nếu dùng nvm: `nvm install 20.20.2` rồi `nvm use 20.20.2`.

## Chạy local

Tại thư mục gốc repository:

```powershell
npm ci
Copy-Item be/.env.example be/.env
Copy-Item fe/.env.example fe/.env
npm run dev
```

Chỉ copy `.env.example` lần đầu, tránh ghi đè cấu hình đã có. Backend yêu cầu cấu hình `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` hợp lệ trong `be/.env`; file mẫu chỉ chứa giá trị minh họa. Xem [hướng dẫn backend](be/DEVELOPMENT.md).

- Frontend: http://localhost:5173
- Backend: http://localhost:3000/api/health
- Kiểm tra DB qua HTTP: http://localhost:3000/api/ready (503 nếu không kết nối được).
- Kiểm tra kết nối và tên bảng/view: `npm run db:check -w be` (chỉ đọc).
- Chạy riêng: `npm run dev:be` hoặc `npm run dev:fe`.
- Thay đổi `PORT` của backend thì cập nhật `API_PROXY_TARGET` tương ứng ở frontend.

## Kiểm tra và build

```powershell
npm test
npm run lint
npm run build
npm exec -w fe -- playwright install chromium
npm run test:e2e
npm run test:integration
npm run test:e2e:auth
```

`npm start` chạy backend. `npm run preview -w fe` xem thử bản build frontend.
`npm test` chạy BE và FE unit tests; `npm run test:be` hoặc `npm run test:fe` chạy riêng.
E2E khám phá dùng API demo/Vite tại cổng 3002/5181. E2E tài khoản dùng MariaDB test
biệt lập và Vite cổng 5180; cần MariaDB local trước khi chạy. Kiểm Chromium desktop/mobile,
chưa thay thế Safari/iOS thật. Workflow [Demo checks](.github/workflows/ci.yml) có job
format/lint/unit/build/E2E và job MariaDB 10.5.26/integration/auth browser. Định dạng FE
bằng `npm run format -w fe`, kiểm tra bằng `npm run format:check -w fe`.
Khi triển khai, phục vụ `fe/dist` bằng static hosting, chuyển tiếp `/api` đến backend
hoặc cấu hình `VITE_API_BASE_URL` trước khi build và `CLIENT_ORIGIN` ở backend.
Các biến `VITE_*` công khai trong trình duyệt, không chứa bí mật.

## Cấu trúc

```text
be/
  src/app.js       # Express app, routes và middleware
  src/server.js    # Khởi động HTTP server
  test/           # Kiểm thử API bằng node:test
  schema.sql      # Schema CSDL hiện có
  README.md       # Tài liệu CSDL
fe/
  src/            # React app
  vite.config.ts  # Dev server, proxy API và Vitest
docs/             # Tài liệu nghiệp vụ hiện có
```

BE đã có config, logger, middleware, health/readiness, pool MariaDB UTC, helper transaction và API danh mục/POI công bố. FE có khám phá, chi tiết và bản nháp chuyến đi.
Repository Sequelize đã được kiểm tra tích hợp trên MariaDB 10.5.26 local. Có migration
runner, CLI bootstrap admin và luồng đăng ký/login/refresh/logout/account BE/FE. Reset mật khẩu,
hồ sơ, quản trị nội dung, AI và giao dịch tiếp tục theo backlog.
Xem [hướng dẫn backend](be/DEVELOPMENT.md) và [tài liệu CSDL](be/README.md).
