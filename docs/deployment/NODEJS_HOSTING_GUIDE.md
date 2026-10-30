# Hướng Dẫn Triển Khai GiaLai Travel Lên Hosting Node.js

Tài liệu này hướng dẫn chi tiết cách đưa toàn bộ hệ thống **GiaLai Travel** lên môi trường **Hosting chạy Node.js** (cPanel / DirectAdmin / CloudLinux Node.js Selector hoặc VPS Linux dùng PM2) mà **hoàn toàn không cần Docker**.

---

## 1. Kiến Trúc Triển Khai Trên Hosting

Hệ thống được thiết kế để có thể chạy theo mô hình **Single-Origin (Tất cả trong 1)**:
* **Backend Node.js** (`be`): Lắng nghe cổng HTTP (ví dụ `3000`), xử lý các yêu cầu API tại `/api/*`.
* **Frontend React** (`fe`): Được biên dịch tĩnh vào thư mục `fe/dist`. Backend Node.js sẽ phục vụ trực tiếp các file tĩnh này và điều hướng toàn bộ route SPA (`/explore`, `/trips`, `/bookings`, `/admin`) về `index.html`.
* **Cơ sở dữ liệu**: MySQL hoặc MariaDB có sẵn trên cPanel/Hosting.

> **Lợi ích**: Bạn chỉ cần 1 tên miền duy nhất (ví dụ `https://gialaitravel.vn`), không gặp lỗi CORS chéo domain, cookie bảo mật HttpOnly hoạt động hoàn hảo 100%.

---

## 2. Các Bước Chuẩn Bị Trước Khi Upload

### Bước 1: Build mã nguồn Frontend
Trên máy tính phát triển của bạn (local), mở terminal tại thư mục gốc dự án và chạy:
```bash
npm run build
```
Lệnh này sẽ biên dịch toàn bộ mã TypeScript và Vite của frontend vào thư mục `fe/dist`.

### Bước 2: Tạo cặp khóa mã hóa JWT RS256
Chạy lệnh sau để sinh cặp khóa ký token bảo mật:
```bash
npm run auth:keys -w be
```
Lệnh sẽ in ra màn hình cặp khóa `JWT_PRIVATE_KEY` và `JWT_PUBLIC_KEY`. Hãy lưu lại để điền vào file `.env` trên hosting.

---

## 3. Hướng Dẫn Triển Khai Trên cPanel (Node.js App Selector)

Hầu hết các nhà cung cấp hosting (như AZDIGI, Vietnix, Hostinger, HawkHost, v.v.) đều hỗ trợ **Setup Node.js App** trong cPanel.

### Bước 1: Tạo Database MySQL trên cPanel
1. Vào cPanel $\rightarrow$ **MySQL® Databases**.
2. Tạo database mới: ví dụ `cpaneluser_gialai`.
3. Tạo user mới và gán mật khẩu mạnh.
4. Gán User vào Database với quyền **ALL PRIVILEGES**.

### Bước 2: Upload mã nguồn lên Hosting
1. Đóng gói mã nguồn thành file `.zip` (loại trừ thư mục `node_modules`).
2. Vào **File Manager** trên cPanel, tải file zip lên thư mục ngoài `public_html` (ví dụ: `/home/cpaneluser/gialai-travel`).
3. Giải nén file zip.

### Bước 3: Tạo ứng dụng Node.js trong cPanel
1. Vào mục **Setup Node.js App** trong cPanel.
2. Nhấn nút **Create Application**:
   - **Node.js version**: Chọn `20.x` (hoặc `18.x`, `22.x`).
   - **Application mode**: `Production`.
   - **Application root**: `gialai-travel` (thư mục vừa giải nén).
   - **Application startup file**: `be/src/server.js`.
   - **Application URL**: Chọn tên miền của bạn (ví dụ `gialaitravel.vn`).
3. Nhấn **Create**.
4. Sau khi tạo xong, cuộn xuống mục **Configuration files** hoặc mở terminal cPanel để chạy:
   ```bash
   npm install --omit=dev
   ```

### Bước 4: Cấu hình biến môi trường `.env`
Tạo file `.env` nằm trong thư mục `be/.env` (hoặc cấu hình tại mục **Environment variables** trong giao diện Node.js App của cPanel):

```ini
NODE_ENV=production
PORT=3000

# Thông tin CSDL MySQL của cPanel
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpaneluser_gialai
DB_USER=cpaneluser_gialaiuser
DB_PASSWORD=Mat_Khau_Database_Vua_Tao

# Tên miền website
CLIENT_ORIGIN=https://gialaitravel.vn

# Bật phục vụ Frontend tĩnh trực tiếp từ Node.js
SERVE_STATIC=true
STATIC_DIR=../fe/dist

# Proxy của cPanel Nginx/Apache
TRUST_PROXY_HOPS=1
LOG_LEVEL=info

# Khóa JWT RS256 vừa tạo ở Bước 2
JWT_KEY_ID=gialai-prod-1
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
```

### Bước 5: Chạy Migration khởi tạo CSDL
Trong Terminal của cPanel (hoặc qua SSH):
```bash
cd /home/cpaneluser/gialai-travel
npm run db:migrate -w be
```
Lệnh này sẽ tự động tạo đầy đủ bảng, chỉ mục và migration ledger mà không làm mất dữ liệu.

Tạo tài khoản Quản trị viên (ADMIN) đầu tiên:
```bash
ADMIN_EMAIL=admin@gialaitravel.vn ADMIN_PASSWORD=MatKhauAdminCucManh123! npm run admin:create -w be
```

### Bước 6: Khởi động lại ứng dụng
Quay lại trang **Setup Node.js App** trong cPanel và nhấn nút **Restart**. Trang web của bạn đã hoạt động tại `https://gialaitravel.vn`.

---

## 4. Hướng Dẫn Triển Khai Trên VPS Linux (Ubuntu / PM2)

Nếu bạn thuê một VPS Linux (DigitalOcean, Linode, Vultr, v.v.):

### Bước 1: Cài đặt Node.js 20 và PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### Bước 2: Clone mã nguồn và cài đặt dependencies
```bash
git clone <URL_REPO_CUA_BAN> /var/www/gialai-travel
cd /var/www/gialai-travel
npm install
npm run build
```

### Bước 3: Cấu hình `.env` và Migrate CSDL
Tạo file `/var/www/gialai-travel/be/.env` tương tự mẫu ở mục 3.4.
Sau đó chạy:
```bash
npm run db:migrate -w be
ADMIN_EMAIL=admin@gialaitravel.vn ADMIN_PASSWORD=MatKhauAdminCucManh123! npm run admin:create -w be
```

### Bước 4: Khởi chạy bằng PM2
Tại thư mục gốc `/var/www/gialai-travel`:
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Bước 5: Cấu hình Nginx làm Reverse Proxy
Tạo file `/etc/nginx/sites-available/gialaitravel.vn`:
```nginx
server {
    server_name gialaitravel.vn;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Kích hoạt và cài SSL Let's Encrypt:
```bash
sudo ln -s /etc/nginx/sites-available/gialaitravel.vn /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d gialaitravel.vn
```

---

## 5. Cấu Hình CronJob Chạy Tác Vụ Ngầm (Background Jobs)

Hệ thống có background job tự động thu hồi đơn đặt quá hạn 30 phút (`expire-bookings`) và xử lý yêu cầu quyền riêng tư (`process-privacy-requests`).

Trong mục **Cron Jobs** của cPanel (hoặc `crontab -e` trên Linux), thêm dòng sau để chạy mỗi 5 phút một lần:
```bash
*/5 * * * * cd /home/cpaneluser/gialai-travel/be && node scripts/run-jobs.js expire-bookings >> /dev/null 2>&1
```

---

## 6. Danh Sách Kiểm Tra Sau Triển Khai (Post-Deploy Checklist)

- [ ] Truy cập `https://gialaitravel.vn/api/health` trả về `{"status":"pass"}`.
- [ ] Mở trang chủ xem được danh sách địa điểm khám phá và chi tiết POI.
- [ ] Thử đăng ký tài khoản mới và đăng nhập.
- [ ] Thử tính năng Lập lịch trình AI và Lưu chuyến đi vào CSDL.
- [ ] Thử tải gói ngoại tuyến và ngắt mạng để kiểm tra chế độ Offline.
- [ ] Đăng nhập tài khoản Quản trị tại `/login` và vào trang `/admin` để kiểm tra hàng đợi duyệt CMS, đơn đặt dịch vụ và nhật ký kiểm toán Audit Log.
