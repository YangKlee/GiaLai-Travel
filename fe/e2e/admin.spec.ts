import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { APP_PATHS } from '../src/constants/path';
import type { AdminUser, AdminUserInput } from '../src/features/admin/types/users';

test('quản trị có URL riêng và CRUD người dùng', async ({ page }, testInfo) => {
  const admin: AdminUser = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'admin@example.test',
    displayName: 'Quản trị viên',
    roles: ['ADMIN'],
    phone: null,
    status: 'ACTIVE',
    createdAt: '2026-10-30T08:00:00Z',
    updatedAt: '2026-10-30T08:00:00Z',
  };
  let users = [admin];
  const requests: string[] = [];
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/api/v1/auth/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/status')) await route.fulfill({ json: { data: { enabled: true } } });
    else if (path.endsWith('/refresh'))
      await route.fulfill({
        json: {
          data: { accessToken: 'test-token', tokenType: 'Bearer', expiresIn: 900, user: admin },
        },
      });
    else await route.fulfill({ json: { data: { user: admin } } });
  });
  await page.route('**/api/v1/admin/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    requests.push(url.pathname);
    if (url.pathname.includes('/users')) {
      const id = url.pathname.split('/users/')[1];
      if (request.method() === 'POST') {
        const input = request.postDataJSON() as AdminUserInput;
        const created = { ...admin, ...input, id: '22222222-2222-4222-8222-222222222222' };
        users.push(created);
        await route.fulfill({ status: 201, json: { data: created } });
      } else if (request.method() === 'PUT') {
        const input = request.postDataJSON() as AdminUserInput;
        users = users.map((user) => (user.id === id ? { ...user, ...input } : user));
        await route.fulfill({ json: { data: users.find((user) => user.id === id) } });
      } else if (request.method() === 'DELETE') {
        users = users.filter((user) => user.id !== id);
        await route.fulfill({ json: { data: { id, deleted: true } } });
      } else {
        const q = url.searchParams.get('q')?.toLowerCase() ?? '';
        const data = users.filter(
          (user) => user.displayName.toLowerCase().includes(q) || user.email?.includes(q),
        );
        await route.fulfill({
          json: { data, meta: { page: 1, pageSize: 20, total: data.length, totalPages: 1 } },
        });
      }
    } else if (url.pathname.endsWith('/meta')) {
      await route.fulfill({
        json: { data: { regions: [], places: [], partners: [], mediaAssets: [] } },
      });
    } else {
      await route.fulfill({
        json: { data: [], meta: { page: 1, pageSize: 50, total: 0, totalPages: 0 } },
      });
    }
  });
  await page.goto(APP_PATHS.ADMIN_USERS);
  await expect(page.getByRole('heading', { name: 'Quản trị người dùng' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Xóa Quản trị viên' })).toBeDisabled();
  await page.getByRole('button', { name: 'Thêm người dùng', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Tên hiển thị').fill('Du khách mới');
  await dialog.getByLabel('Email', { exact: true }).fill('visitor@example.test');
  await dialog.getByLabel('Mật khẩu', { exact: true }).fill('Strong password 123');
  await dialog.getByRole('button', { name: 'Tạo người dùng' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('cell', { name: 'Du khách mới', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Sửa Du khách mới' }).click();
  await dialog.getByLabel('Tên hiển thị').fill('Du khách đã sửa');
  await dialog.getByRole('combobox', { name: 'Trạng thái' }).selectOption('LOCKED');
  await dialog.getByRole('button', { name: 'Lưu thay đổi' }).click();
  await expect(page.getByRole('cell', { name: 'Du khách đã sửa', exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('admin-users.png'), fullPage: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByLabel('Tìm người dùng').fill('không tồn tại');
  await page.getByRole('button', { name: 'Tìm kiếm' }).click();
  await expect(page.getByText('Không tìm thấy người dùng phù hợp.')).toBeVisible();
  await page.getByLabel('Tìm người dùng').fill('');
  await page.getByRole('button', { name: 'Tìm kiếm' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Xóa Du khách đã sửa' }).click();
  await expect(page.getByRole('cell', { name: 'Du khách đã sửa', exact: true })).toHaveCount(0);

  for (const [path, heading] of [
    [APP_PATHS.ADMIN, 'Quản trị nội dung & Hàng đợi duyệt'],
    [APP_PATHS.ADMIN_PLACES, 'Quản lý địa điểm'],
    [APP_PATHS.ADMIN_EVENTS, 'Quản lý sự kiện & banner'],
    [APP_PATHS.ADMIN_BOOKINGS, 'Quản lý đặt chỗ & hoa hồng'],
    [APP_PATHS.ADMIN_ISSUES, 'Báo lỗi & góp ý'],
    [APP_PATHS.ADMIN_AUDIT, 'Nhật ký kiểm toán'],
  ]) {
    requests.length = 0;
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible();
    if (path === APP_PATHS.ADMIN_PLACES) {
      expect(
        requests.some(
          (url) => url.endsWith('/contents') || url.endsWith('/events') || url.endsWith('/users'),
        ),
      ).toBe(false);
      await page.reload();
      await expect(
        page.getByRole('heading', { level: 1, name: heading, exact: true }),
      ).toBeVisible();
    }
  }
  expect(errors).toEqual([]);
});
