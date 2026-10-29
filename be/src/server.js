import { createApp } from './app.js';

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT phải là số nguyên từ 1 đến 65535.');
}

const app = createApp({ clientOrigin: process.env.CLIENT_ORIGIN });
const server = app.listen(port, (error) => {
  if (error) {
    console.error(error);
    process.exitCode = 1;
    return;
  }
  console.log(`GiaLai Travel API: http://localhost:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
