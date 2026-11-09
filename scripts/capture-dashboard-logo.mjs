import { chromium } from '@playwright/test';
import path from 'path';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  // 1. Desktop Dashboard
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    isMobile: false,
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
  await desktopPage.waitForTimeout(1000);
  const desktopPath = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections\\dashboard_desktop_logo.png';
  await desktopPage.screenshot({ path: desktopPath });
  console.log('Saved:', desktopPath);
  await desktopCtx.close();

  // 2. Mobile Dashboard
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
  await mobilePage.waitForTimeout(1000);
  const mobilePath = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections\\dashboard_mobile_logo.png';
  await mobilePage.screenshot({ path: mobilePath });
  console.log('Saved:', mobilePath);
  await mobileCtx.close();

  // 3. Mobile Homepage / Navbar
  const homeMobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });
  const homeMobilePage = await homeMobileCtx.newPage();
  await homeMobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await homeMobilePage.waitForTimeout(1000);
  const homePath = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections\\homepage_mobile_logo.png';
  await homeMobilePage.screenshot({ path: homePath });
  console.log('Saved:', homePath);
  await homeMobileCtx.close();

  await browser.close();
  console.log('All logo screenshots captured!');
}

run();

