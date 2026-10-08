import { chromium } from './node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:/Users/user/.gemini/antigravity/brain/b03acda8-f233-4598-ace4-3f4769056922/scratch/screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function getWorkingUrl() {
  const ports = [3000, 3001];
  for (const port of ports) {
    const url = `http://localhost:${port}/dashboard/image-to-video`;
    try {
      console.log(`Checking ${url}...`);
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok || res.status === 200 || res.status === 307 || res.status === 302) {
        console.log(`Found active server at ${url}`);
        return url;
      }
    } catch (e) {
      console.log(`Port ${port} not responding: ${e.message}`);
    }
  }
  return 'http://localhost:3000/dashboard/image-to-video';
}

async function runAudit() {
  const targetUrl = await getWorkingUrl();

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop Audit
  console.log('Navigating Desktop View (1280x900)...');
  const contextDesktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await contextDesktop.newPage();
  
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_studio_step1.png'), fullPage: true });
  console.log('Saved 01_desktop_studio_step1.png');

  // Click through steps in Stepper mode
  // Step 2
  const step2Btn = page.locator('button:has-text("Step 02")').first();
  if (await step2Btn.isVisible()) {
    await step2Btn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_desktop_studio_step2.png'), fullPage: true });
    console.log('Saved 02_desktop_studio_step2.png');
  }

  // Step 3
  const step3Btn = page.locator('button:has-text("Step 03")').first();
  if (await step3Btn.isVisible()) {
    await step3Btn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_desktop_studio_step3.png'), fullPage: true });
    console.log('Saved 03_desktop_studio_step3.png');
  }

  // Step 4
  const step4Btn = page.locator('button:has-text("Step 04")').first();
  if (await step4Btn.isVisible()) {
    await step4Btn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_desktop_studio_step4.png'), fullPage: true });
    console.log('Saved 04_desktop_studio_step4.png');
  }

  // Switch to All Steps View
  const allStepsBtn = page.locator('button:has-text("All Steps")').first();
  if (await allStepsBtn.isVisible()) {
    await allStepsBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_desktop_studio_all_steps.png'), fullPage: true });
    console.log('Saved 05_desktop_studio_all_steps.png');
  }

  // Switch to Your Videos / Projects tab
  const projectsTabBtn = page.locator('button:has-text("Your Videos")').first();
  if (await projectsTabBtn.isVisible()) {
    await projectsTabBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_desktop_projects_tab.png'), fullPage: true });
    console.log('Saved 06_desktop_projects_tab.png');
  }

  // 2. Mobile Audit
  console.log('Navigating Mobile View (375x812)...');
  const contextMobile = await browser.newContext({ viewport: { width: 375, height: 812 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1' });
  const pageMobile = await contextMobile.newPage();
  
  await pageMobile.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageMobile.waitForTimeout(4000);
  await pageMobile.screenshot({ path: path.join(SCREENSHOT_DIR, '07_mobile_studio_step1.png'), fullPage: true });
  console.log('Saved 07_mobile_studio_step1.png');

  await browser.close();
  console.log('Browser audit screenshots saved successfully to', SCREENSHOT_DIR);
}

runAudit().catch(err => {
  console.error('Audit script error:', err);
  process.exit(1);
});
