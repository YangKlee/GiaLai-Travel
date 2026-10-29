import express from 'express';
import cors from 'cors';

export function createApp({ clientOrigin = 'http://localhost:5173' } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'gialai-travel-api' });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: { message: 'Không tìm thấy API.' } });
  });

  // Express nhận diện middleware xử lý lỗi qua đủ bốn tham số.
  app.use((error, _req, res, _next) => {
    const status = error.status >= 400 && error.status < 500 ? error.status : 500;
    if (status === 500) console.error(error);
    res.status(status).json({
      error: { message: status === 500 ? 'Lỗi máy chủ.' : 'Yêu cầu không hợp lệ.' },
    });
  });

  return app;
}
