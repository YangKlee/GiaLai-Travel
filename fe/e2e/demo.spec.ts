import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { APP_PATHS } from '../src/constants/path';

test('khám phá → chi tiết → thêm và sắp xếp bản nháp', async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto(APP_PATHS.HOME);
  await expect(page.getByRole('heading', { name: /Một Gia Lai/ })).toBeVisible();
  await expect(page.getByText('Bản demo · Dữ liệu mẫu.')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('explore.png'), fullPage: true });
  await page.getByRole('link', { name: 'Biển Hồ', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Biển Hồ', exact: true })).toBeVisible();
  await expect(page.getByText('Chưa có giá tham khảo')).toBeVisible();
  await page.getByRole('button', { name: 'Thêm vào chuyến đi: Biển Hồ', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Đã chọn Biển Hồ', exact: true })).toBeDisabled();
  await page.getByRole('link', { name: 'Xem bản nháp chuyến đi' }).click();
  await expect(page.locator('.trip-stops > li')).toHaveCount(1);
  await page.getByRole('link', { name: 'Thêm điểm đến', exact: true }).click();
  await page.getByRole('link', { name: 'Văn hóa', exact: true }).click();
  await page
    .getByRole('button', { name: 'Thêm vào chuyến đi: Chùa Minh Thành', exact: true })
    .click();
  await page.getByRole('link', { name: 'Xem bản nháp (2)', exact: true }).click();
  await expect(page.locator('.trip-stops > li')).toHaveCount(2);
  await page.getByRole('textbox', { name: 'Tên bản nháp' }).fill('Chuyến đi cuối tuần');
  await expect(page.getByRole('heading', { name: 'Chuyến đi cuối tuần' })).toBeVisible();
  await page.getByRole('button', { name: 'Đưa Chùa Minh Thành lên', exact: true }).click();
  await expect(page.locator('.trip-stops > li').first()).toContainText('Chùa Minh Thành');
  await page.screenshot({ path: testInfo.outputPath('trip.png'), fullPage: true });
  await page.getByRole('button', { name: 'Bỏ Biển Hồ', exact: true }).click();
  await expect(page.locator('.trip-stops > li')).toHaveCount(1);
  await expect(page.locator('.trip-stops')).not.toContainText('Biển Hồ');
  expect(pageErrors).toEqual([]);
});

test('tìm kiếm, bộ lọc và phân trang được giữ trên URL', async ({ page }) => {
  await page.goto(APP_PATHS.EXPLORE);
  await page.getByRole('textbox', { name: 'Tên địa điểm' }).fill('Biển Hồ');
  await page.getByRole('button', { name: 'Tìm kiếm', exact: true }).click();
  await expect(page.locator('.place-card')).toHaveCount(1);
  await expect(page).toHaveURL(/q=Bi%E1%BB%83n/);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Tên địa điểm' })).toHaveValue('Biển Hồ');
  await page.getByRole('link', { name: 'Xóa bộ lọc', exact: true }).click();
  await expect(page.locator('.place-card')).toHaveCount(6);
  await page.getByRole('link', { name: 'Trang sau', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator('.place-card')).toHaveCount(2);
  await page.getByRole('link', { name: 'Thiên nhiên', exact: true }).click();
  await expect(page).not.toHaveURL(/page=2/);
  await expect(page.locator('.place-card')).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('deep link, reload và địa điểm không tồn tại', async ({ page }, testInfo) => {
  await page.goto(APP_PATHS.place('10000000-0000-4000-8000-000000000003'));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Chùa Minh Thành', exact: true })).toBeVisible();
  await expect(page.getByText('0 ₫', { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('detail.png'), fullPage: true });
  await page.goto(APP_PATHS.place('10000000-0000-4000-8000-000000000099'));
  await expect(page.getByRole('heading', { name: 'Chưa tìm thấy trang này' })).toBeVisible();
});

test('bộ lọc sai và lỗi mạng có đường phục hồi', async ({ page }) => {
  await page.goto(`${APP_PATHS.EXPLORE}?minPrice=100&maxPrice=1`);
  await expect(page.getByRole('heading', { name: 'Bộ lọc chưa hợp lệ' })).toBeVisible();
  await page.getByRole('link', { name: 'Xóa bộ lọc và khám phá lại' }).click();
  await expect(page.locator('.place-card')).toHaveCount(6);
  await page.route('**/api/v1/**', (route) => route.abort());
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Chưa tải được nội dung' })).toBeVisible();
  await page.unroute('**/api/v1/**');
  await page.getByRole('button', { name: 'Thử lại' }).click();
  await expect(page.locator('.place-card')).toHaveCount(6);
});

test('các trang demo đạt kiểm tra tiếp cận tự động và không tràn ở 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of [
    APP_PATHS.EXPLORE,
    APP_PATHS.place('10000000-0000-4000-8000-000000000003'),
    APP_PATHS.TRIPS,
  ]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});
