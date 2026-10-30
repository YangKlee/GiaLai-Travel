import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:5181', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } },
    },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: [
    {
      command: `"${process.execPath}" ../be/demo/server.js`,
      url: 'http://127.0.0.1:3002/api/health',
      reuseExistingServer: false,
      env: { NODE_ENV: 'test', PORT: '3002' },
    },
    {
      command: `"${process.execPath}" ../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5181`,
      url: 'http://127.0.0.1:5181',
      env: { API_PROXY_TARGET: 'http://127.0.0.1:3002' },
      reuseExistingServer: false,
    },
  ],
});
