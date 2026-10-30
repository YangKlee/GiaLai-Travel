# Cấu trúc dự án GiaLai Travel

Tài liệu mô tả cấu trúc mã nguồn backend (BE), frontend (FE) và tài liệu dùng chung tại thời điểm khởi tạo, ngày 30/10/2026. Các mục **hiện có** phản ánh mã nguồn trong repository; các mục **định hướng** mô tả cách tổ chức khi triển khai tiếp.

## 1. Tổng quan

Dự án là monorepo dùng **npm workspaces**, gồm hai workspace `be` và `fe`. Cài dependency tại thư mục gốc bằng `npm ci`; `package-lock.json` ở gốc quản lý dependency cho cả hai.

| Thành phần | Công nghệ hiện có | Vai trò |
| --- | --- | --- |
| Runtime | Node.js 20.20.2, JavaScript ES modules | Chạy backend và công cụ phát triển frontend |
| Backend | Express 5, Zod, Pino, Helmet, CORS | HTTP API, validation, logging và middleware |
| CSDL | MariaDB/MySQL qua `mysql2/promise` | Pool kết nối, truy vấn tham số hóa, transaction |
| Models | Sequelize 6, `sequelize-auto` | Model và quan hệ sinh từ metadata CSDL; chưa tích hợp vào runtime API |
| Frontend | React 19, Vite 8, CSS thuần | SPA và màn hình kiểm tra kết nối backend |
| Kiểm tra | `node:test` cho BE; ESLint và Vite build cho FE | Kiểm thử backend, kiểm tra và đóng gói frontend |

## 2. Cấu trúc thư mục gốc hiện có

```text
GiaLai-Travel/
├── be/                       # Workspace backend
├── fe/                       # Workspace frontend
├── docs/                     # Yêu cầu, thiết kế và kế hoạch triển khai
│   ├── srs/                  # SRS, use case, sequence và class diagram
│   ├── implementation/       # Backlog BE/FE, tích hợp, nghiệm thu, thiết kế JWT
│   └── Phụ LỤC.pdf           # Tài liệu phụ lục
├── .gitignore                # Quy tắc loại trừ file khỏi Git
├── .node-version             # Phiên bản Node.js
├── .nvmrc                    # Phiên bản Node.js cho nvm
├── package.json              # Khai báo workspaces và lệnh dùng chung
├── package-lock.json         # Khóa dependency cho monorepo
├── README.md                 # Hướng dẫn chạy nhanh
└── PROJECT_STRUCTURE.md      # Tài liệu cấu trúc dự án
```

`node_modules/` được tạo sau khi cài dependency. `fe/dist/` là đầu ra build frontend; các thư mục này không phải mã nguồn cần chỉnh sửa.

## 3. Backend — `be/`

### Cấu trúc hiện có

```text
be/
├── src/
│   ├── server.js                    # Đọc config, tạo DB, chạy/dừng HTTP server
│   ├── app.js                       # Tạo Express app và gắn middleware/router
│   ├── config/
│   │   ├── env.js                   # Đọc và kiểm tra biến môi trường
│   │   └── logger.js                # Khởi tạo logger Pino
│   ├── db/
│   │   ├── database.js              # Pool mysql2, UTC, execute và transaction
│   │   └── models/
│   │       ├── init-models.js       # Khởi tạo Sequelize models và quan hệ
│   │       └── *.js                 # Models theo bảng: users, bookings, places...
│   ├── middleware/
│   │   ├── request-context.js       # Request ID và log theo request
│   │   └── error-handler.js         # Xử lý route không tồn tại và lỗi HTTP
│   ├── routes/
│   │   └── index.js                # Router API tổng
│   ├── modules/
│   │   ├── README.md               # Quy ước tổ chức module nghiệp vụ
│   │   └── health/
│   │       └── health.controller.js # Liveness và readiness CSDL
│   └── shared/
│       ├── app-error.js             # Kiểu lỗi ứng dụng
│       ├── identifiers.js           # Tiện ích GUID
│       ├── money.js                 # Tiện ích tiền VND
│       ├── pagination.js            # Tiện ích phân trang
│       └── validation.js            # Validation dùng chung
├── scripts/
│   ├── check-database.js            # Kiểm tra kết nối và cấu trúc DB, chỉ đọc
│   └── scaffold-models.js           # Sinh Sequelize models từ DB hiện có
├── test/
│   ├── app.test.js                  # Kiểm thử HTTP app
│   ├── config.test.js               # Kiểm thử cấu hình
│   ├── database.test.js             # Kiểm thử lớp truy cập DB
│   └── validation.test.js           # Kiểm thử validation và tiện ích
├── migrations/
│   ├── README.md                    # Hướng dẫn áp dụng migration
│   └── 001-jwt-auth.sql             # Migration cấu trúc xác thực JWT
├── .env.example                     # Mẫu cấu hình backend
├── package.json                     # Dependency và scripts backend
├── schema.sql                       # Schema khởi tạo CSDL
├── openapi.yaml                     # Hợp đồng API đã triển khai
├── DEVELOPMENT.md                   # Hướng dẫn phát triển backend
└── README.md                        # Thiết kế CSDL và quy tắc dữ liệu
```

### Luồng khởi động và xử lý request

1. `server.js` đọc cấu hình, tạo logger và pool CSDL, sau đó khởi tạo app và HTTP server.
2. `app.js` gắn request context, Helmet, CORS và JSON parser trước router `/api`.
3. `routes/index.js` chuyển request đến controller tương ứng.
4. Middleware cuối xử lý route không tồn tại và chuẩn hóa lỗi.

Hiện có `GET /api/health`, `GET /api/ready` và các alias `/api/v1/health`, `/api/v1/ready`. Health kiểm tra ứng dụng còn hoạt động; readiness kiểm tra truy cập CSDL. API nghiệp vụ như đăng nhập, khám phá, lịch trình và đặt dịch vụ chưa được triển khai.

Runtime hiện dùng `src/db/database.js` qua `mysql2/promise`. Việc có Sequelize models hoặc migration JWT chưa có nghĩa API đã dùng ORM hoặc đã có chức năng xác thực. Chưa có migration runner tự động.

### Định hướng tổ chức module nghiệp vụ

Khi triển khai chức năng, thêm module trong `src/modules/<module>/` theo nhu cầu:

```text
<module>/
├── <module>.routes.js        # Method/path và middleware
├── <module>.schema.js        # Zod schema kiểm tra đầu vào
├── <module>.controller.js    # Nhận request, gọi service, trả HTTP response
├── <module>.service.js       # Quyền truy cập, nghiệp vụ và transaction
└── <module>.repository.js    # Truy vấn SQL tham số hóa
```

Các nhóm dự kiến gồm `auth`, `users`, `privacy`, `content`, `media`, `catalog`, `events`, `itineraries`, `ai`, `offline`, `bookings`, `payments`, `notifications`, `issues`, `admin`; các module giai đoạn sau theo backlog. `adapters/` và `jobs/` chỉ bổ sung khi có tích hợp ngoài hoặc tác vụ nền thực tế.

Service điều phối transaction qua lớp DB dùng chung; repository nhận executor của transaction khi cần ghi nhiều bảng. Quy ước chi tiết tại [modules/README.md](be/src/modules/README.md).

## 4. Frontend — `fe/`

### Cấu trúc hiện có

```text
fe/
├── src/
│   ├── main.jsx              # Mount React vào #root, bật StrictMode, import CSS
│   ├── App.jsx               # Trang khởi tạo và gọi API health
│   └── styles.css            # CSS toàn cục cho màn hình khởi tạo
├── .env.example              # Mẫu API_PROXY_TARGET và VITE_API_BASE_URL
├── index.html                # HTML entry chứa #root
├── vite.config.js            # React plugin, cổng dev và proxy /api
├── eslint.config.js          # Quy tắc kiểm tra JavaScript/React
├── package.json              # Dependency và scripts frontend
├── AGENTS.md                 # Quy ước và kiến trúc mục tiêu cho FE
└── DESIGN.md                 # Đặc tả thiết kế giao diện
```

Luồng chạy: `index.html` → `src/main.jsx` → `src/App.jsx`. Màn hình hiện tại gọi `/api/health` để hiển thị trạng thái kết nối backend. Dev server Vite chạy cổng `5173`, chuyển tiếp `/api` đến backend cổng `3000` theo mặc định.

### Định hướng mở rộng

`AGENTS.md` và kế hoạch triển khai định hướng TypeScript strict, Tailwind CSS v4, component theo pattern shadcn/ui, Lucide, React Router v7, Axios và Zustand. **Các công nghệ này chưa được khai báo trong dependency frontend hiện tại.**

```text
fe/src/
├── assets/                   # Ảnh, biểu tượng, font
├── components/
│   ├── ui/                   # Button, Input, Card và component nền tảng
│   └── common/               # Component dùng chung giữa các tính năng
├── features/
│   └── <feature>/
│       ├── components/       # Component riêng của tính năng
│       ├── hooks/            # Hook riêng của tính năng
│       ├── pages/            # Trang gắn với route
│       └── types/            # Kiểu dữ liệu của tính năng
├── layouts/                  # Khung trang dùng chung
├── routes/                   # Router tổng, route modules, loader, Suspense
├── services/                 # HTTP client và các hàm gọi API
├── store/                    # Zustand stores theo domain
├── constants/                # APP_PATHS, ROUTE_SEGMENTS và hằng số
├── utils/                    # Hàm xử lý ngày, tiền, validation, class CSS
└── index.css                 # Tailwind và design tokens khi chuyển đổi
```

Đây là cấu trúc mục tiêu, chưa phải các thư mục đã có. Khi chuyển đổi, dữ liệu ban đầu của trang lấy qua route loader; mutation qua event handler hoặc router action; network call tập trung tại `services/`. Mã khởi tạo hiện vẫn gọi health bằng `fetch` trong `useEffect`.

## 5. Kết nối BE và FE

```text
Trình duyệt → Vite :5173 → proxy /api → Express :3000 → MariaDB/MySQL
```

| Cấu hình | Nơi cấu hình | Ý nghĩa |
| --- | --- | --- |
| `PORT` | `be/.env` | Cổng HTTP backend, mặc định 3000 |
| `CLIENT_ORIGIN` | `be/.env` | Origin frontend được CORS cho phép |
| `DB_*` | `be/.env` | Thông tin kết nối và tùy chọn CSDL |
| `API_PROXY_TARGET` | `fe/.env` | Đích proxy `/api` của Vite trong môi trường dev |
| `VITE_API_BASE_URL` | `fe/.env` | Base URL dùng trong trình duyệt; để trống để gọi cùng origin |

Khi triển khai, phục vụ `fe/dist/` qua static hosting và chuyển tiếp `/api` tới BE, hoặc đặt `VITE_API_BASE_URL` trước khi build rồi cấu hình CORS tương ứng. Các biến `VITE_*` công khai trong bundle frontend.

## 6. Lệnh thường dùng

Chạy từ thư mục gốc repository:

| Lệnh | Chức năng |
| --- | --- |
| `npm ci` | Cài dependency theo lockfile cho cả BE và FE |
| `npm run dev` | Chạy đồng thời backend và frontend |
| `npm run dev:be` | Chạy backend ở chế độ watch |
| `npm run dev:fe` | Chạy Vite dev server |
| `npm start` | Chạy backend |
| `npm test` | Chạy bộ test backend |
| `npm run lint` | Chạy ESLint frontend |
| `npm run build` | Build frontend vào `fe/dist/` |
| `npm run preview -w fe` | Xem thử bản build frontend |
| `npm run db:check -w be` | Kiểm tra kết nối và tên bảng/view trong CSDL |
| `npm run db:scaffold -w be` | Sinh Sequelize models từ metadata CSDL |

Lần đầu chạy local, tạo `be/.env` và `fe/.env` từ các file `.env.example` tương ứng nếu chưa có, sau đó điền cấu hình CSDL hợp lệ. Lệnh scaffold không tự ghi đè thư mục models đã tồn tại; xem [DEVELOPMENT.md](be/DEVELOPMENT.md) trước khi sinh lại.

## 7. Tài liệu liên quan

- [README dự án](README.md): yêu cầu môi trường và hướng dẫn chạy nhanh.
- [Phát triển backend](be/DEVELOPMENT.md): cấu hình, HTTP contract và công cụ CSDL.
- [Thiết kế CSDL](be/README.md): schema và quy tắc giao dịch/dữ liệu.
- [Quy ước frontend](fe/AGENTS.md) và [thiết kế giao diện](fe/DESIGN.md).
- [SRS](docs/srs/README.md): yêu cầu chức năng, phi chức năng và sơ đồ.
- [Kế hoạch triển khai](docs/implementation/README.md): kiến trúc mục tiêu và milestone.
- [Task backend](docs/implementation/backend-tasks.md), [task frontend](docs/implementation/frontend-tasks.md) và [tích hợp/nghiệm thu](docs/implementation/integration-and-acceptance.md).
