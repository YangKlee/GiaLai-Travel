const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  
  page.on('response', async res => {
    if (res.url().includes('/api/')) {
      console.log('API Response:', res.status(), res.url());
      try {
        const text = await res.text();
        console.log('Body:', text.slice(0, 300));
      } catch (e) {}
    }
  });

  await page.goto('https://gialaitravel.yangkleeserver.io.vn/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"], input[name="email"]', 'khanhduong18072005@gmaiil.com');
  await page.fill('input[type="password"], input[name="password"]', 'Y@ngKlee18072005');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  console.log('Final URL:', page.url());
  const errorMsg = await page.locator('[role="alert"], .text-red-500, .text-destructive, .error, p').allInnerTexts();
  console.log('Text contents around:', errorMsg.filter(t => t.toLowerCase().includes('lỗi') || t.toLowerCase().includes('mật') || t.toLowerCase().includes('sai') || t.toLowerCase().includes('thành công') || t.toLowerCase().includes('email')));
  await browser.close();
})();
