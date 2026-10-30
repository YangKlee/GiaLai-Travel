import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AppError } from '../shared/app-error.js';

export function createR2Storage({
  accountId = process.env.R2_ACCOUNT_ID,
  accessKeyId = process.env.R2_ACCESS_KEY_ID,
  secretAccessKey = process.env.R2_SECRET_ACCESS_KEY,
  bucketName = process.env.R2_BUCKET_NAME || 'gialai-travel',
  publicUrl = process.env.R2_PUBLIC_URL,
} = {}) {
  const isR2Configured = Boolean(accountId && accessKeyId && secretAccessKey);
  let s3Client = null;

  if (isR2Configured) {
    s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return {
    isConfigured: isR2Configured,
    async uploadImage({ buffer, mimeType, originalName, folder = 'events' }) {
      if (!buffer || buffer.length === 0) {
        throw new AppError(422, 'INVALID_FILE', 'Dữ liệu tệp không hợp lệ hoặc rỗng.');
      }
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedMimes.includes(mimeType)) {
        throw new AppError(
          422,
          'INVALID_FILE_TYPE',
          'Chỉ chấp nhận tệp hình ảnh (JPEG, PNG, WEBP, GIF).',
        );
      }

      if (buffer.length > 10 * 1024 * 1024) {
        throw new AppError(422, 'FILE_TOO_LARGE', 'Kích thước ảnh tối đa cho phép là 10MB.');
      }

      const ext =
        path.extname(originalName || '').toLowerCase() ||
        (mimeType === 'image/png' ? '.png' : mimeType === 'image/webp' ? '.webp' : '.jpg');
      const sanitizedBase = path
        .basename(originalName || 'banner', ext)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 40);
      const key = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizedBase}${ext}`;

      if (isR2Configured && s3Client) {
        try {
          const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
          });
          await s3Client.send(command);

          const baseDomain = publicUrl
            ? publicUrl.replace(/\/$/, '')
            : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com`;
          const finalUrl = `${baseDomain}/${key}`;

          return {
            url: finalUrl,
            key,
            provider: 'cloudflare-r2',
            byteSize: buffer.length,
            mimeType,
          };
        } catch (err) {
          throw new AppError(
            502,
            'R2_UPLOAD_FAILED',
            `Không thể tải tệp lên Cloudflare R2: ${err.message}`,
          );
        }
      }

      // Local fallback mode when R2 credentials are not set
      const localUploadDir = path.resolve(process.cwd(), '.local', 'uploads', folder);
      fs.mkdirSync(localUploadDir, { recursive: true });
      const localFilePath = path.join(localUploadDir, path.basename(key));
      fs.writeFileSync(localFilePath, buffer);

      const localUrl = `/uploads/${key}`;
      return {
        url: localUrl,
        key,
        provider: 'local-fallback',
        byteSize: buffer.length,
        mimeType,
      };
    },
  };
}
