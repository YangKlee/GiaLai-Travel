const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  
  page.on('response', async res => {
    if (res.url().includes('/api/auth/login')) {
      console.log('Login Response:', res.status());
      try {
        const text = await res.text();
        console.log('Body:', text);
      } catch (e) {}
    }
  });

  await page.goto('https://gialaitravel.yangkleeserver.io.vn/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"], input[name="email"]', 'khanhduong18072005@gmail.com');
  await page.fill('input[type="password"], input[name="password"]', 'Y@ngKlee18072005');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);
  console.log('Final URL with gmail.com:', page.url());
  await browser.close();
})();
