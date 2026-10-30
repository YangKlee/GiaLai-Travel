import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { isolatedDatabase } from './database-helper.js';
import { createApp } from '../src/app.js';
import { createMailAdapter } from '../src/adapters/index.js';
import { createDemoCatalogRepository } from '../demo/catalog.repository.js';

const requireFe = createRequire(new URL('../../fe/package.json', import.meta.url));
const { chromium, expect } = requireFe('@playwright/test');
const { default: AxeBuilder } = requireFe('@axe-core/playwright');

test('Auth browser/MariaDB: register, login, reload/refresh across tabs, logout, recovery and accessible forms', { timeout: 90000 }, async () => {
  // Route constants are read through Vite below so Node 20 never needs a TS loader.
  const cleanup = [];
  let server; let vite; let browser;
  const base = 'http://127.0.0.1:5180';
  try {
    const { database } = await isolatedDatabase({ after: (work) => cleanup.push(work) });
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const auth = { privateKey, publicKeys: new Map([['browser', publicKey]]), kid: 'browser', issuer: 'browser-api', audience: 'browser-web',
      secure: false, origins: [base], accessSeconds: 900, sessionMilliseconds: 7 * 86400_000, resetMilliseconds: 15 * 60_000 };
    const mail = createMailAdapter({ mode: 'outbox' });
    server = createApp({ database, auth, mail, catalogRepository: createDemoCatalogRepository() }).listen(0, '127.0.0.1');
    await once(server, 'listening');
    vite = spawn(process.execPath, [join(dirname(requireFe.resolve('vite/package.json')), 'bin/vite.js'), '--host', '127.0.0.1', '--port', '5180'], {
      cwd: fileURLToPath(new URL('../../fe/', import.meta.url)), stdio: 'pipe',
      env: { ...process.env, API_PROXY_TARGET: `http://127.0.0.1:${server.address().port}` },
    });
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (vite.exitCode !== null) throw new Error('Auth browser Vite server failed to start');
      try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* starting */ }
      await delay(100);
    }
    assert.ok(ready, 'Vite did not start');
    browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    // Vite transforms the same centralized paths used by the app and FE tests.
    await page.goto(base);
    const paths = await page.evaluate(async () => {
      const module = await import('/src/constants/path.ts');
      return {
        REGISTER: module.APP_PATHS.REGISTER,
        LOGIN: module.APP_PATHS.LOGIN,
        FORGOT_PASSWORD: module.APP_PATHS.FORGOT_PASSWORD,
        RESET_PASSWORD: module.APP_PATHS.RESET_PASSWORD,
        ACCOUNT: module.APP_PATHS.ACCOUNT,
        EXPLORE: module.APP_PATHS.EXPLORE,
      };
    });
    const email = `browser-${randomUUID()}@example.test`; const password = 'Browser integration password 🌿';
    const displayName = 'Du khách kiểm thử';
    await page.goto(base + paths.REGISTER);
    await page.getByLabel('Tên hiển thị', { exact: true }).fill(displayName);
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Mật khẩu', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
    await expect(page.getByText('Tài khoản đã được tạo. Bạn có thể đăng nhập ngay.')).toBeVisible();
    async function signIn(target) {
      await target.getByLabel('Email', { exact: true }).fill(email);
      await target.getByLabel('Mật khẩu', { exact: true }).fill(password);
      await target.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
      await expect(target.getByRole('heading', { name: 'Tài khoản của tôi', exact: true })).toBeVisible();
    }
    await signIn(page);
    const screenshots = fileURLToPath(new URL('../../fe/test-results/auth/', import.meta.url));
    mkdirSync(screenshots, { recursive: true });
    await page.screenshot({ path: join(screenshots, 'account-desktop.png'), fullPage: true });
    assert.deepEqual((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations, []);
    const cookie = (await context.cookies()).find((item) => item.name === 'gialai_refresh');
    assert.ok(cookie.httpOnly); assert.equal(cookie.path, '/api/v1/auth');
    const stored = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }));
    assert.ok(!stored.includes(password)); assert.ok(!stored.includes(cookie.value)); assert.ok(!stored.includes('accessToken'));
    const second = await context.newPage();
    await second.goto(base + paths.ACCOUNT);
    await expect(second.getByRole('heading', { name: 'Tài khoản của tôi', exact: true })).toBeVisible();
    await Promise.all([page.reload(), second.reload()]);
    for (const tab of [page, second]) await expect(tab.getByRole('heading', { name: 'Tài khoản của tôi', exact: true })).toBeVisible();
    assert.equal(await database.models.AuditLogs.count({ where: { action: 'AUTH_REFRESH_REUSE' } }), 0);
    await page.goto(base + paths.EXPLORE);
    await page.getByRole('button', { name: 'Thêm vào chuyến đi: Biển Hồ', exact: true }).click();
    await page.getByRole('link', { name: 'Tài khoản', exact: true }).click();
    await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click();
    await expect(page.getByRole('heading', { name: /Một Gia Lai/ })).toBeVisible();
    await expect(page.locator('.draft-bar')).toHaveCount(0);
    await expect(second.getByRole('heading', { name: 'Vui lòng đăng nhập lại', exact: true })).toBeVisible();
    await second.reload();
    await expect(second.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
    await second.goto(base + paths.LOGIN + '?returnTo=https://evil.example');
    await signIn(second);
    assert.equal(new URL(second.url()).pathname, paths.ACCOUNT);
    let attempts = 0;
    await second.route('**/api/v1/auth/me', async (route) => {
      if (++attempts === 1) await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: { code: 'ACCESS_TOKEN_EXPIRED', message: 'Expired' } }) });
      else await route.continue();
    });
    await second.evaluate(async () => { const api = await import('/src/services/api.ts'); await api.get('/api/v1/auth/me'); });
    assert.equal(attempts, 2);
    await second.unroute('**/api/v1/auth/me');
    let expired = 0; let refreshes = 0;
    await second.route('**/api/v1/auth/me', async (route) => {
      if (++expired <= 4) await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: { code: 'ACCESS_TOKEN_EXPIRED', message: 'Expired' } }) });
      else await route.continue();
    });
    await second.route('**/api/v1/auth/refresh', async (route) => { refreshes++; await route.continue(); });
    await second.evaluate(async () => {
      const api = await import('/src/services/api.ts');
      await Promise.all(Array.from({ length: 4 }, () => api.get('/api/v1/auth/me')));
    });
    assert.equal(refreshes, 1); assert.equal(expired, 8);
    await second.unroute('**/api/v1/auth/me'); await second.unroute('**/api/v1/auth/refresh');
    // Server rotates successfully, but the browser loses the response: require login.
    await second.route('**/api/v1/auth/me', async (route) => route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: { code: 'ACCESS_TOKEN_EXPIRED', message: 'Expired' } }) }));
    await second.route('**/api/v1/auth/refresh', async (route) => { await route.fetch(); await route.abort(); });
    const failed = await second.evaluate(async () => {
      const api = await import('/src/services/api.ts');
      try { await api.get('/api/v1/auth/me'); return false; } catch { return true; }
    });
    assert.ok(failed);
    await expect(second.getByRole('heading', { name: 'Vui lòng đăng nhập lại', exact: true })).toBeVisible();
    await second.unroute('**/api/v1/auth/me'); await second.unroute('**/api/v1/auth/refresh');
    await second.reload();
    await expect(second.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
    await signIn(second);
    await second.route('**/api/v1/auth/logout', (route) => route.abort());
    await second.getByRole('button', { name: 'Đăng xuất', exact: true }).click();
    await expect(second.getByText(/Máy chủ chưa xác nhận đăng xuất/)).toBeVisible();
    await second.unroute('**/api/v1/auth/logout');
    await second.reload();
    await expect(second.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
    const guest = await browser.newContext({ viewport: { width: 360, height: 800 } });
    const mobile = await guest.newPage();
    await mobile.goto(base + paths.LOGIN);
    await expect(mobile.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
    assert.deepEqual((await new AxeBuilder({ page: mobile }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations, []);
    assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await mobile.screenshot({ path: join(screenshots, 'login-mobile.png'), fullPage: true });
    await mobile.getByRole('link', { name: 'Đăng ký ngay', exact: true }).click();
    await mobile.getByLabel('Tên hiển thị', { exact: true }).fill(displayName);
    await mobile.getByLabel('Email', { exact: true }).fill(email);
    await mobile.getByLabel('Mật khẩu', { exact: true }).fill(password);
    await mobile.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click();
    await expect(mobile.getByRole('alert')).toContainText('Email này đã được đăng ký.');
    await expect(mobile.getByLabel('Email', { exact: true })).toHaveAttribute('aria-invalid', 'true');
    assert.deepEqual((await new AxeBuilder({ page: mobile }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations, []);

    // Password reset browser flow: uniform message, URL token stripping, session revocation and login with new password.
    await mobile.goto(base + paths.LOGIN);
    await mobile.getByRole('link', { name: 'Quên mật khẩu?', exact: true }).click();
    await expect(mobile.getByRole('heading', { name: 'Quên mật khẩu', exact: true })).toBeVisible();
    assert.deepEqual((await new AxeBuilder({ page: mobile }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations, []);
    await mobile.getByLabel('Email', { exact: true }).fill(email);
    await mobile.getByRole('button', { name: 'Gửi liên kết đặt lại', exact: true }).click();
    await expect(mobile.getByRole('status')).toContainText('Nếu email tồn tại trong hệ thống');
    assert.equal(mail.outbox.length, 1);

    const resetLink = mail.outbox[0].resetUrl;
    const rawToken = new URL(resetLink).searchParams.get('token');
    await mobile.goto(resetLink);
    await expect(mobile.getByRole('heading', { name: 'Đặt lại mật khẩu', exact: true })).toBeVisible();
    assert.ok(!mobile.url().includes(rawToken), 'Reset token must be stripped from URL bar');
    assert.deepEqual((await new AxeBuilder({ page: mobile }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations, []);

    const nextPassword = 'Reset browser password 🌿';
    await mobile.getByLabel('Mật khẩu mới', { exact: true }).fill(nextPassword);
    await mobile.getByRole('button', { name: 'Cập nhật mật khẩu', exact: true }).click();
    await expect(mobile.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
    await expect(mobile.getByRole('status')).toContainText('Mật khẩu đã được đặt lại');
    await mobile.getByLabel('Email', { exact: true }).fill(email);
    await mobile.getByLabel('Mật khẩu', { exact: true }).fill(nextPassword);
    await mobile.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(mobile.getByRole('heading', { name: 'Tài khoản của tôi', exact: true })).toBeVisible();
  } finally {
    await browser?.close();
    if (vite && vite.exitCode === null) { const exited = once(vite, 'exit'); vite.kill(); await exited; }
    if (server) await new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); });
    for (const work of cleanup.reverse()) await work();
  }
});
