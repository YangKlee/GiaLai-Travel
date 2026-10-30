/**
 * LiteSpeed / cPanel Node.js startup bridge.
 *
 * LiteSpeed runner (/usr/local/lsws/fcgi-bin/lsnode.js) boots apps using CommonJS require().
 * When package.json has "type": "module", requiring a .js file causes ERR_REQUIRE_ESM.
 *
 * This .cjs file acts as a CommonJS bridge that loads environment variables,
 * diagnoses database connection into db-debug.log, and dynamically imports src/server.js.
 */

const fs = require('node:fs');
const path = require('node:path');

// 1. Luôn đọc file .env và cập nhật thẳng vào process.env
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = val;
      }
    }
  } catch (err) {
    console.warn('Could not parse .env file:', err.message);
  }
}

// 2. Chẩn đoán kết nối MySQL và ghi vào db-debug.log để dễ dàng kiểm tra trên hosting
try {
  const mysql = require('mysql2');
  const dbHost = process.env.DB_HOST || '127.0.0.1';
  const dbPort = Number(process.env.DB_PORT) || 3306;
  const dbUser = process.env.DB_USER || '';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || '';
  const dbSsl = process.env.DB_SSL === 'true';

  let logContent = `=== CHẨN ĐOÁN KẾT NỐI DATABASE (${new Date().toLocaleString('vi-VN')}) ===\n`;
  logContent += `Cấu hình đang nhận: Host=${dbHost}, Port=${dbPort}, User=${dbUser}, DB=${dbName}, SSL=${dbSsl}\n`;

  const connection = mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    connectTimeout: 5000,
    ssl: dbSsl ? { rejectUnauthorized: false } : undefined,
  });

  connection.connect((err) => {
    if (err) {
      logContent += `TRẠNG THÁI: THẤT BẠI ❌\n`;
      logContent += `Mã lỗi (Code): ${err.code}\n`;
      logContent += `Chi tiết lỗi: ${err.message}\n`;
      logContent += `\n--- NGUYÊN NHÂN & CÁCH SỬA ---\n`;
      if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        logContent += `-> Sai MẬT KHẨU hoặc User '${dbUser}' chưa được gán quyền vào Database '${dbName}' trên cPanel!\n`;
        logContent += `-> Cách sửa: Vào cPanel > MySQL Databases > Kéo xuống 'Add User to Database' > Chọn user & db > Bấm Add > Tích ALL PRIVILEGES > Save.\n`;
      } else if (err.code === 'ECONNREFUSED') {
        logContent += `-> Không kết nối được đến cổng ${dbPort} tại ${dbHost}.\n`;
        logContent += `-> Cách sửa: Thử đổi DB_HOST=localhost hoặc DB_HOST=127.0.0.1 trong file .env.\n`;
      } else if (err.code === 'ER_BAD_DB_ERROR') {
        logContent += `-> Database '${dbName}' không tồn tại trên hosting!\n`;
        logContent += `-> Cách sửa: Kiểm tra lại tên database chính xác trong cPanel MySQL Databases.\n`;
      } else if (err.code === 'HANDSHAKE_SSL_ERROR' || err.message.includes('SSL')) {
        logContent += `-> Lỗi kết nối SSL. Đảm bảo đặt DB_SSL=false trong file .env.\n`;
      }
    } else {
      logContent += `TRẠNG THÁI: KẾT NỐI THÀNH CÔNG 100% ✅\n`;
      logContent += `Cơ sở dữ liệu '${dbName}' sẵn sàng hoạt động!\n`;
      connection.end();
    }
    try {
      fs.writeFileSync(path.resolve(__dirname, 'db-debug.log'), logContent, 'utf8');
    } catch {}
  });
} catch (e) {
  console.warn('Could not run DB diagnostic:', e.message);
}

// 3. Khởi chạy server chính thức
(async () => {
  try {
    await import('./src/server.js');
  } catch (error) {
    console.error('Fatal error starting server via index.cjs:', error);
    process.exit(1);
  }
})();
