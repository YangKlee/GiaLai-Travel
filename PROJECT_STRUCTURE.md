# Cấu trúc dự án GiaLai Travel

Tài liệu mô tả cấu trúc mã nguồn backend (BE), frontend (FE) và tài liệu dùng chung, cập nhật theo mốc demo ngày 30/10/2026. Các mục **hiện có** phản ánh mã nguồn trong repository; các mục **định hướng** mô tả cách tổ chức khi triển khai tiếp.

## 1. Tổng quan

Dự án là monorepo dùng **npm workspaces**, gồm hai workspace `be` và `fe`. Cài dependency tại thư mục gốc bằng `npm ci`; `package-lock.json` ở gốc quản lý dependency cho cả hai.

| Thành phần | Công nghệ hiện có | Vai trò |
| --- | --- | --- |
| Runtime | Node.js 20.20.2, ES modules | Chạy backend và công cụ phát triển frontend |
| Backend | Express 5, Zod, Pino, Helmet, CORS | HTTP API, validation, logging và middleware |
| CSDL | MariaDB/MySQL qua Sequelize 6, driver mysql2 | Pool kết nối UTC và Sequelize transactions |
| Models | Sequelize 6, `sequelize-auto` | 59 scaffold models và associations dùng trực tiếp trong runtime |
| Frontend | React 19, TypeScript 6, Vite 8, React Router 7 | SPA khám phá, chi tiết và bản nháp chuyến đi |
| Giao diện và dữ liệu FE | Tailwind 4, Inter, Lucide, cva/cn, Axios, Zustand 5 | Essential tokens, API client và state theo domain |
| Kiểm tra | `node:test`, Vitest/Testing Library, Playwright, ESLint, `tsc -b`/Vite | Unit, API, E2E desktop/mobile và build |

## 2. Cấu trúc thư mục gốc hiện có

```text
GiaLai-Travel/
├── .github/workflows/ci.yml   # Format, lint, unit, build và E2E demo
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
├── demo/                            # Danh mục mẫu; server-auth dùng DB local cho tài khoản
├── src/
│   ├── server.js                    # Đọc config, tạo DB, chạy/dừng HTTP server
│   ├── app.js                       # Tạo Express app và gắn middleware/router
│   ├── config/
│   │   ├── env.js                   # Đọc và kiểm tra biến môi trường
│   │   ├── auth.js                  # Cấu hình JWT/RSA keyring và cookie
│   │   ├── key-files.js             # Sinh khóa local, từ chối ghi đè
│   │   └── logger.js                # Khởi tạo logger Pino
│   ├── db/
│   │   ├── database.js              # Sequelize instance/pool UTC và transaction
│   │   ├── model-runtime.js         # Model subclasses và chuẩn hóa default timestamp
│   │   ├── migrations.js            # Ledger, baseline, checksum và khóa migration
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
│   │   ├── catalog/                # Routes/schema/controller/service/repository POI
│   │   ├── auth/                   # Models auth, JWT, rotation/replay và bootstrap admin
│   │   └── health/
│   │       └── health.controller.js # Liveness và readiness CSDL
│   └── shared/
│       ├── app-error.js             # Kiểu lỗi ứng dụng
│       ├── identifiers.js           # Tiện ích GUID
│       ├── money.js                 # Tiện ích tiền VND
│       ├── pagination.js            # Tiện ích phân trang
│       └── validation.js            # Validation dùng chung
├── scripts/
│   ├── migrate.js                   # CLI status/init/baseline/up
│   ├── bootstrap-admin.js           # Tạo admin từ env tạm
│   ├── setup-demo-auth.js           # Dựng demo tài khoản với DB local riêng
│   ├── auth-keys.js                 # Sinh khóa RSA local
│   ├── check-database.js            # Kiểm tra kết nối và cấu trúc DB, chỉ đọc
│   └── scaffold-models.js           # Sinh Sequelize models từ DB hiện có
├── test/
│   ├── app.test.js                  # Kiểm thử HTTP app
│   ├── config.test.js               # Kiểm thử cấu hình
│   ├── database.test.js             # Kiểm thử lớp truy cập DB
│   ├── catalog.test.js              # API danh mục, validation, lỗi DB và SQL binding
│   ├── contract.test.js             # Cú pháp và references OpenAPI
│   └── validation.test.js           # Kiểm thử validation và tiện ích
├── integration/                     # MariaDB, migration, ORM/auth và browser E2E
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

Hiện có health/readiness, API khám phá `/api/v1/catalog`, `/api/v1/places`, `/api/v1/places/:id`
và tài khoản `/api/v1/auth/{status,register,login,refresh,logout,me}`. Auth dùng Sequelize
models, access JWT RS256 và refresh cookie HttpOnly; quyền/session hiện hành kiểm từ DB.
Lưu lịch trình và đặt dịch vụ chưa triển khai.

Runtime dùng Sequelize và các models đã scaffold. Repository nghiệp vụ dùng model APIs/associations; service truyền Sequelize transaction khi ghi nhiều bảng. Không viết query SQL thủ công trong module nghiệp vụ, không gọi `sync()` khi chạy app. Tình trạng migration và xác thực theo [tiến độ](docs/implementation/demo-progress.md).

`be/demo/server.js` dùng cùng router/service/validation và contract với runtime CSDL, nhưng inject repository mẫu từ `be/demo/`. Chế độ này chỉ chạy khi gọi `dev:demo`, không load `.env`, không ghi DB và trả `dataset: demo`. Runtime CSDL không tự fallback sang mẫu khi lỗi; repository SQL còn cần nghiệm thu MariaDB thật.

### Định hướng tổ chức module nghiệp vụ

Khi triển khai chức năng, thêm module trong `src/modules/<module>/` theo nhu cầu:

```text
<module>/
├── <module>.routes.js        # Method/path và middleware
├── <module>.schema.js        # Zod schema kiểm tra đầu vào
├── <module>.controller.js    # Nhận request, gọi service, trả HTTP response
├── <module>.service.js       # Quyền truy cập, nghiệp vụ và transaction
└── <module>.repository.js    # Sequelize model APIs, associations và bộ lọc ORM
```

Các nhóm dự kiến gồm `auth`, `users`, `privacy`, `content`, `media`, `catalog`, `events`, `itineraries`, `ai`, `offline`, `bookings`, `payments`, `notifications`, `issues`, `admin`; các module giai đoạn sau theo backlog. `adapters/` và `jobs/` chỉ bổ sung khi có tích hợp ngoài hoặc tác vụ nền thực tế.

Service điều phối transaction qua lớp DB dùng chung; repository nhận executor của transaction khi cần ghi nhiều bảng. Quy ước chi tiết tại [modules/README.md](be/src/modules/README.md).

## 4. Frontend — `fe/`

### Cấu trúc hiện có

```text
fe/
├── src/
│   ├── main.tsx              # Mount RouterProvider, StrictMode, font Inter và CSS
│   ├── index.css             # Tailwind v4, Essential tokens và CSS responsive
│   ├── components/
│   │   ├── ui/               # Button (cva/cn), Badge
│   │   └── common/           # Loading và nhãn dữ liệu demo
│   ├── constants/path.ts     # APP_PATHS và ROUTE_SEGMENTS
│   ├── layouts/              # Main/Auth/Tourist/Error layouts, eager imports
│   ├── routes/               # Router composition, route modules, loaders, Suspense
│   ├── features/
│   │   ├── explore/          # Trang danh sách/chi tiết, card, kiểu dữ liệu API
│   │   ├── trips/            # Bản nháp chuyến đi trong phiên mở trang
│   │   ├── errors/           # Trang 401/403/404/500 và lỗi loader
│   │   └── auth/             # Form đăng ký/login và account page
│   ├── services/             # Axios client, API danh mục và fixture chỉ dùng test
│   ├── store/                # Zustand bản nháp; tách dữ liệu demo/live
│   ├── utils/                # cn, tiền VND chính xác, ngày VN, kiểm URL nguồn
│   └── test-setup.ts          # Setup Testing Library/Vitest
├── e2e/                      # Playwright test luồng thực với API demo
├── .env.example              # Mẫu API_PROXY_TARGET và VITE_API_BASE_URL
├── index.html                # HTML entry chứa #root
├── vite.config.ts            # React/Tailwind plugins, alias, proxy và Vitest
├── playwright.config.ts      # Desktop/mobile Chromium, tự chạy API demo và Vite
├── tsconfig*.json            # TypeScript strict và alias @/*
├── eslint.config.js          # Quy tắc kiểm tra TypeScript/React
├── package.json              # Dependency và scripts frontend
├── AGENTS.md                 # Quy ước và kiến trúc mục tiêu cho FE
└── DESIGN.md                 # Đặc tả thiết kế giao diện
```

Luồng chạy: `index.html` → `src/main.tsx` → RouterProvider → layout → trang lazy. Route loader gọi API qua `services/` trước khi render; các request nhận AbortSignal để hủy khi điều hướng. Loader lỗi đi qua error boundary. Dev server Vite chạy cổng `5173`, chuyển tiếp `/api` đến backend cổng `3000` theo mặc định.

Các route đã mở: `/explore`, `/places/:id`, `/trips`, `/login`, `/register`, `/account`;
`/` chuyển sang khám phá. `/admin/*` chưa mở tính năng quản trị. Zustand giữ bản nháp và
user trong bộ nhớ; access token ở services memory, refresh trong cookie HttpOnly.
Logout/đổi user xóa state và thông báo tab khác, không phát tán token. Reload xóa bản
nháp; phiên tài khoản bootstrap qua refresh → me khi hợp lệ.

### Định hướng mở rộng

Đã thiết lập TypeScript strict, Tailwind v4, Lucide, React Router v7, Axios và Zustand. Các module tài khoản, quản trị, AI, offline, dịch vụ/đặt chỗ và bộ UI mở rộng tiếp tục theo `AGENTS.md`/backlog. Cấu trúc mở rộng dự kiến:

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

Chỉ tạo thêm `assets/`, layouts, domain stores, hooks/types và các component khi có tính năng tương ứng. Dữ liệu ban đầu của trang lấy qua route loader; mutation qua event handler hoặc router action; network call tập trung tại `services/`. Không fetch trong `useEffect`.

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
| `npm run dev:demo` | Chạy FE và API mẫu tách biệt, không cần CSDL |
| `npm run setup:demo:auth` / `npm run dev:demo:auth` | Khởi tạo rồi chạy demo tài khoản thật trên DB local |
| `npm run dev:be` | Chạy backend ở chế độ watch |
| `npm run dev:fe` | Chạy Vite dev server |
| `npm start` | Chạy backend |
| `npm test` | Chạy BE và FE unit tests |
| `npm run test:be` / `npm run test:fe` | Chạy riêng từng workspace |
| `npm run test:e2e` | Playwright tự chạy API demo và Vite, kiểm tra desktop/mobile |
| `npm run test:integration` / `npm run test:e2e:auth` | Kiểm MariaDB thật và browser account/multi-tab |
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
- [Tiến độ demo](docs/implementation/demo-progress.md): phạm vi hoàn thành, bằng chứng kiểm tra và task tiếp theo.
- [Task backend](docs/implementation/backend-tasks.md), [task frontend](docs/implementation/frontend-tasks.md) và [tích hợp/nghiệm thu](docs/implementation/integration-and-acceptance.md).
