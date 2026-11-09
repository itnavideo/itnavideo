import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections';

const sampleAudio = path.resolve('public/assets/reusable/testing1.mp3');
const sampleImg1 = path.resolve('public/og-image.png');
const sampleImg2 = path.resolve('public/icon-512.png');

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080, isMobile: false },
  { name: 'laptop', width: 1280, height: 800, isMobile: false },
  { name: 'tablet', width: 768, height: 1024, isMobile: true },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];

async function run() {
  console.log('Capturing Live Step 4 with Assets loaded...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Inspecting Step 4 on ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      deviceScaleFactor: 2
    });

    const page = await context.newPage();
    await page.goto('http://localhost:3000/dashboard/image-to-video', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    // 1. Upload audio
    const audioInput = page.locator('input[type="file"][accept*="audio"]').first();
    if (await audioInput.count()) {
      await audioInput.setInputFiles(sampleAudio);
      console.log('Uploaded audio');
    }

    // 2. Upload images
    const imageInput = page.locator('input[type="file"][accept*="image"]').first();
    if (await imageInput.count()) {
      await imageInput.setInputFiles([sampleImg1, sampleImg2]);
      console.log('Uploaded images');
    }

    await page.waitForTimeout(1000);

    // 3. Jump to Step 4
    const step4Btn = page.locator('nav[aria-label="Studio Steps"] button').nth(3);
    if (await step4Btn.isVisible()) {
      await step4Btn.click();
    } else {
      const mobileStep4 = page.locator('div[title*="Step 4"]').first();
      if (await mobileStep4.isVisible()) {
        await mobileStep4.click();
      }
    }

    await page.waitForTimeout(1500);

    // Capture Full Page Step 4
    const step4ActivePath = path.join(ARTIFACT_DIR, `${vp.name}_step4_active_studio.png`);
    await page.screenshot({ path: step4ActivePath, fullPage: true });
    console.log(`Saved: ${step4ActivePath}`);

    // If mobile, also capture the timeline region specifically
    if (vp.isMobile) {
      const timelineLocator = page.locator('text=Multitrack Timeline').first();
      if (await timelineLocator.isVisible()) {
        await timelineLocator.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        const mobileTimelinePath = path.join(ARTIFACT_DIR, `${vp.name}_step4_timeline_focus.png`);
        await page.screenshot({ path: mobileTimelinePath });
        console.log(`Saved: ${mobileTimelinePath}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('\nStep 4 capture completed!');
}

run();

