const { chromium } = require('playwright');
const path = require('path');
const OUTPUT_DIR = path.join(__dirname, '..', 'slides', 'screenshots');

async function testDraftAndAI() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  const page = await context.newPage();

  // Login
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'khanhduong18072005@gmail.com');
  await page.fill('input[name="password"]', 'Y@ngKlee18072005');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]')
  ]);

  // Go to explore and add a couple places to trip draft
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/explore', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Look for "Thêm vào chuyến đi" or "+" buttons on explore cards
  const addButtons = page.locator('button:has-text("Thêm vào chuyến đi"), button:has-text("Thêm vào lịch trình"), button[title*="Thêm"]');
  const count = await addButtons.count();
  console.log('Add buttons count:', count);
  if (count > 0) {
    await addButtons.nth(0).click().catch(console.error);
    await page.waitForTimeout(500);
    if (count > 1) {
      await addButtons.nth(1).click().catch(console.error);
      await page.waitForTimeout(500);
    }
    if (count > 2) {
      await addButtons.nth(2).click().catch(console.error);
      await page.waitForTimeout(500);
    }
  }

  // Go to trips to see the draft
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/trips', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05d_trips_with_draft.png') });
  console.log('Trips with draft captured!');

  await browser.close();
}

testDraftAndAI().catch(console.error);
