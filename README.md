# GiaLai Travel

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

Chỉ copy `.env.example` lần đầu, tránh ghi đè cấu hình đã có. Các giá trị mặc định cho phép chạy local ngay cả khi chưa tạo `.env`.

- Frontend: http://localhost:5173
- Backend: http://localhost:3000/api/health
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

API khởi tạo hiện có `GET /api/health`, phản ánh trạng thái HTTP server.
Chưa kết nối CSDL hoặc triển khai các chức năng nghiệp vụ; xem [tài liệu CSDL](be/README.md).
