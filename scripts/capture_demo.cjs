const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'slides', 'screenshots');

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  console.log('1. Navigating to Home...');
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_home_hero.png'), fullPage: false });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_home_full.png'), fullPage: true });

  console.log('2. Navigating to Explore...');
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/explore', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_explore.png'), fullPage: false });

  // Click on first place card if available
  const firstCard = page.locator('a[href^="/places/"]').first();
  if (await firstCard.count() > 0) {
    const href = await firstCard.getAttribute('href');
    console.log('3. Navigating to Place Detail:', href);
    await page.goto('https://gialaitravel.yangkleeserver.io.vn' + href, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_place_detail.png'), fullPage: false });
  }

  console.log('4. Navigating to Events...');
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/events', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_events.png'), fullPage: false });

  console.log('5. Navigating to Trips / Planner...');
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/trips', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_trips_planner.png'), fullPage: false });

  console.log('6. Navigating to Services...');
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/services', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_services.png'), fullPage: false });

  console.log('7. Navigating to Login...');
  await page.goto('https://gialaitravel.yangkleeserver.io.vn/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_login_page.png'), fullPage: false });

  console.log('7b. Logging in...');
  try {
    await page.fill('input[type="email"], input[name="email"]', 'khanhduong18072005@gmaiil.com');
    await page.fill('input[type="password"], input[name="password"]', 'Y@ngKlee18072005');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07b_login_filled.png'), fullPage: false });
    
    await Promise.all([
      page.waitForNavigation({ timeout: 15000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    await page.waitForTimeout(3000);
    console.log('Logged in URL:', page.url());
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08_logged_in_dashboard.png'), fullPage: false });

    // Check account page
    await page.goto('https://gialaitravel.yangkleeserver.io.vn/account', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '09_account_page.png'), fullPage: false });

    // Check if user has access to /admin
    await page.goto('https://gialaitravel.yangkleeserver.io.vn/admin', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);
    if (!page.url().includes('403') && !page.url().includes('login')) {
      console.log('Admin accessible!');
      await page.screenshot({ path: path.join(OUTPUT_DIR, '10_admin_page.png'), fullPage: false });
    }
  } catch (err) {
    console.error('Login error:', err);
  }

  // Also capture mobile view of Home and Planner
  console.log('8. Capturing mobile viewport screenshots...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('https://gialaitravel.yangkleeserver.io.vn/', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, 'm_01_home.png') });

  await mobilePage.goto('https://gialaitravel.yangkleeserver.io.vn/trips', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, 'm_02_trips.png') });

  await mobilePage.goto('https://gialaitravel.yangkleeserver.io.vn/explore', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, 'm_03_explore.png') });

  await browser.close();
  console.log('Screenshots captured successfully in', OUTPUT_DIR);
}

run().catch(console.error);
