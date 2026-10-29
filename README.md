# GiaLai Travel

Tài liệu: [SRS](docs/srs/README.md) · [Kế hoạch và task triển khai BE/FE](docs/implementation/README.md).

Backend Express 5 và frontend React 19 (JavaScript, Vite), dùng npm workspaces.

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
```

`npm start` chạy backend. `npm run preview -w fe` xem thử bản build frontend.
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
  vite.config.js  # Dev server và proxy API
docs/             # Tài liệu nghiệp vụ hiện có
```

Scaffold BE đã có config, logger, middleware, health/readiness, pool MariaDB UTC và helper transaction.
Kết nối hosting hiện chưa xác minh được do timeout cổng 3306; chưa triển khai chức năng nghiệp vụ.
Xem [hướng dẫn backend](be/DEVELOPMENT.md) và [tài liệu CSDL](be/README.md).
