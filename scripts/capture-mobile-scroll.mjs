import { chromium } from '@playwright/test';
import path from 'path';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/dashboard/image-to-video', { waitUntil: 'networkidle' });
  await page.locator('input[type="file"][accept*="audio"]').first().setInputFiles('public/assets/reusable/testing1.mp3');
  await page.locator('input[type="file"][accept*="image"]').first().setInputFiles(['public/og-image.png', 'public/icon-512.png']);
  await page.waitForTimeout(1000);
  
  const step4 = page.locator('div[title*="Step 4"]').first();
  if (await step4.isVisible()) await step4.click();
  await page.waitForTimeout(1500);

  // Scroll main container to bottom
  await page.evaluate(() => {
    // Look for scrollable main
    const mains = Array.from(document.querySelectorAll('main'));
    for (const m of mains) {
      if (m.scrollHeight > m.clientHeight) {
        m.scrollTop = m.scrollHeight;
      }
    }
  });
  await page.waitForTimeout(600);

  const savePath = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections\\mobile_step4_bottom_scroll.png';
  await page.screenshot({ path: savePath });
  console.log('Saved mobile bottom scroll!');
  await browser.close();
}

run();
