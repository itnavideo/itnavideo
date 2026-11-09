import { chromium } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections';

const sampleAudio = path.resolve('public/assets/reusable/testing1.mp3');
const sampleImg1 = path.resolve('public/og-image.png');
const sampleImg2 = path.resolve('public/icon-512.png');

async function testScroll() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  await page.goto('http://localhost:3000/dashboard/image-to-video', {
    waitUntil: 'networkidle'
  });

  await page.locator('input[type="file"][accept*="audio"]').first().setInputFiles(sampleAudio);
  await page.locator('input[type="file"][accept*="image"]').first().setInputFiles([sampleImg1, sampleImg2]);
  await page.waitForTimeout(800);

  // Jump to step 4
  await page.locator('div[title*="Step 4"]').first().click();
  await page.waitForTimeout(1000);

  // Scroll down in main to see Middle Toolbar and Timeline
  await page.evaluate(() => {
    const scrollable = document.querySelector('main.overflow-y-auto') || document.querySelectorAll('main')[1];
    if (scrollable) {
      console.log('Found scrollable element, scrollHeight:', scrollable.scrollHeight);
      scrollable.scrollTop = 500;
    }
  });
  await page.waitForTimeout(500);
  const midPath = path.join(ARTIFACT_DIR, 'mobile_step4_scrolled_middle.png');
  await page.screenshot({ path: midPath });
  console.log('Saved:', midPath);

  // Scroll all the way to bottom to inspect Multitrack Timeline on Mobile
  await page.evaluate(() => {
    const scrollable = document.querySelector('main.overflow-y-auto') || document.querySelectorAll('main')[1];
    if (scrollable) {
      scrollable.scrollTop = scrollable.scrollHeight;
    }
  });
  await page.waitForTimeout(500);
  const bottomPath = path.join(ARTIFACT_DIR, 'mobile_step4_scrolled_bottom.png');
  await page.screenshot({ path: bottomPath });
  console.log('Saved:', bottomPath);

  await browser.close();
}

testScroll();
