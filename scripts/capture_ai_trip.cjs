const { chromium } = require('playwright');
const path = require('path');
const OUTPUT_DIR = path.join(__dirname, '..', 'slides', 'screenshots');

async function testAITrip() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  const page = await context.newPage();

  // Login
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"], input[name="email"]', 'khanhduong18072005@gmail.com');
  await page.fill('input[type="password"], input[name="password"]', 'Y@ngKlee18072005');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]')
  ]);

  // Go to trips
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/trips', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click AI button
  console.log('Clicking "Tạo lịch trình AI" or "Nhờ AI gợi ý"...');
  const aiBtn = page.locator('button:has-text("Tạo lịch trình AI"), button:has-text("Nhờ AI gợi ý lộ trình hoàn toàn")').first();
  if (await aiBtn.count() > 0) {
    await aiBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05b_ai_form_modal.png') });
    console.log('AI form modal captured!');

    // Let's see inputs in the form
    const formLabels = await page.locator('form label, dialog label, .modal label').allInnerTexts();
    console.log('Form labels:', formLabels);

    // Try submitting if possible or fill in reasonable demo inputs
    // Check if there is a submit button in the modal
    const submitBtn = page.locator('button[type="submit"]:has-text("Tạo"), button:has-text("Gợi ý"), button:has-text("Bắt đầu")').last();
    if (await submitBtn.count() > 0) {
      console.log('Submitting AI trip request...');
      await submitBtn.click();
      await page.waitForTimeout(6000);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '05c_ai_trip_generated.png') });
      console.log('Generated trip screenshot captured!');
    }
  }

  // Also capture Admin sections: Admin content, places, users
  console.log('Capturing Admin sections...');
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/admin/places', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '13_admin_places_manager.png') });

  await page.goto('https://gialaitravel.yangkleeserver.io.vn/admin/events', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '14_admin_events_manager.png') });

  await page.goto('https://gialaitravel.yangkleeserver.io.vn/admin/bookings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '15_admin_bookings_manager.png') });

  await page.goto('https://gialaitravel.yangkleeserver.io.vn/admin/users', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '16_admin_users_manager.png') });

  await browser.close();
  console.log('Done capturing AI & Admin!');
}

testAITrip().catch(console.error);
