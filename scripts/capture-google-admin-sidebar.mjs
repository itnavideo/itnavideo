import { chromium } from '@playwright/test';
import path from 'path';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  // 1. Desktop Dashboard with new Google Admin style left menu
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    isMobile: false,
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
  await desktopPage.waitForTimeout(1000);
  const desktopPath = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections\\dashboard_google_admin_sidebar.png';
  await desktopPage.screenshot({ path: desktopPath });
  console.log('Saved:', desktopPath);
  await desktopCtx.close();

  // 2. Mobile Dashboard with drawer opened
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
  await mobilePage.waitForTimeout(800);

  // Click hamburger button to open drawer
  const menuBtn = mobilePage.locator('button[aria-label="Open Navigation Menu"]').first();
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await mobilePage.waitForTimeout(600);
  }

  const mobilePath = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections\\dashboard_mobile_sidebar_open.png';
  await mobilePage.screenshot({ path: mobilePath });
  console.log('Saved:', mobilePath);
  await mobileCtx.close();

  await browser.close();
  console.log('Capture completed!');
}

run();

