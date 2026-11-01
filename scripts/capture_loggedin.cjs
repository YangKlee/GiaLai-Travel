const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'slides', 'screenshots');

async function captureLoggedIn() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  console.log('Navigating to Login...');
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"], input[name="email"]', 'khanhduong18072005@gmail.com');
  await page.fill('input[type="password"], input[name="password"]', 'Y@ngKlee18072005');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_login_filled.png') });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
    page.click('button[type="submit"]')
  ]);
  await page.waitForTimeout(2000);
  console.log('Logged in URL:', page.url());

  // 1. Account page
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_account_profile.png') });

  // 2. Trips page logged in
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/trips', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_trips_logged_in.png') });

  // 3. Bookings page
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/bookings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_bookings.png') });

  // 4. Notifications page
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/notifications', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '11_notifications.png') });

  // 5. Admin page check
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('Admin URL:', page.url());
  await page.screenshot({ path: path.join(OUTPUT_DIR, '12_admin_dashboard.png') });

  // If admin accessible, check admin places, bookings, users
  if (!page.url().includes('403') && !page.url().includes('login')) {
    await page.goto('https://gialaitravel.yangkleeserver.io.vn/admin/places', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '13_admin_places.png') });

    await page.goto('https://gialaitravel.yangkleeserver.io.vn/admin/bookings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '14_admin_bookings.png') });
  }

  // Also let's capture the AI Trip Planner interaction!
  console.log('Capturing AI Trip Planner...');
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/trips', { waitUntil: 'networkidle' });
  // Let's see what buttons or inputs are on the trips page
  const tripFormButtons = await page.locator('button').allInnerTexts();
  console.log('Trip page buttons:', tripFormButtons);

  await browser.close();
  console.log('Capture complete!');
}

captureLoggedIn().catch(console.error);
