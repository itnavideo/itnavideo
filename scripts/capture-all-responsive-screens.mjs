import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080, isMobile: false },
  { name: 'laptop', width: 1280, height: 800, isMobile: false },
  { name: 'tablet', width: 768, height: 1024, isMobile: true },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];

async function run() {
  console.log('Starting Responsive UI Screenshot Capture...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Inspecting on ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ---`);
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

    await page.waitForTimeout(1000);

    // 1. Step 1: Upload Step
    const step1Path = path.join(ARTIFACT_DIR, `${vp.name}_step1_upload.png`);
    await page.screenshot({ path: step1Path, fullPage: true });
    console.log(`Saved: ${step1Path}`);

    // 2. Step 2: Music / Soundtrack Step
    try {
      // Find step 2 button in nav
      const step2Btn = page.locator('nav[aria-label="Studio Steps"] button').nth(1);
      if (await step2Btn.isVisible()) {
        await step2Btn.click();
      } else {
        // Mobile progress bar or button
        const mobileStep2 = page.locator('div[title*="Step 2"]').first();
        if (await mobileStep2.isVisible()) {
          await mobileStep2.click();
        }
      }
      await page.waitForTimeout(800);
      const step2Path = path.join(ARTIFACT_DIR, `${vp.name}_step2_music.png`);
      await page.screenshot({ path: step2Path, fullPage: true });
      console.log(`Saved: ${step2Path}`);
    } catch (e) {
      console.warn(`Step 2 click error on ${vp.name}:`, e.message);
    }

    // 3. Step 3: Style & Motion Step
    try {
      const step3Btn = page.locator('nav[aria-label="Studio Steps"] button').nth(2);
      if (await step3Btn.isVisible()) {
        await step3Btn.click();
      } else {
        const mobileStep3 = page.locator('div[title*="Step 3"]').first();
        if (await mobileStep3.isVisible()) {
          await mobileStep3.click();
        }
      }
      await page.waitForTimeout(800);
      const step3Path = path.join(ARTIFACT_DIR, `${vp.name}_step3_style.png`);
      await page.screenshot({ path: step3Path, fullPage: true });
      console.log(`Saved: ${step3Path}`);
    } catch (e) {
      console.warn(`Step 3 click error on ${vp.name}:`, e.message);
    }

    // 4. Step 4: Timeline Studio Step
    try {
      const step4Btn = page.locator('nav[aria-label="Studio Steps"] button').nth(3);
      if (await step4Btn.isVisible()) {
        await step4Btn.click();
      } else {
        const mobileStep4 = page.locator('div[title*="Step 4"]').first();
        if (await mobileStep4.isVisible()) {
          await mobileStep4.click();
        }
      }
      await page.waitForTimeout(1000);
      const step4Path = path.join(ARTIFACT_DIR, `${vp.name}_step4_timeline.png`);
      await page.screenshot({ path: step4Path, fullPage: true });
      console.log(`Saved: ${step4Path}`);

      // Also take view of bottom timeline specifically if on mobile/tablet
      if (vp.isMobile) {
        const timelineEl = page.locator('text=Multitrack Timeline').first();
        if (await timelineEl.isVisible()) {
          await timelineEl.scrollIntoViewIfNeeded();
          await page.waitForTimeout(400);
          const step4TimelineZoomPath = path.join(ARTIFACT_DIR, `${vp.name}_step4_timeline_scrolled.png`);
          await page.screenshot({ path: step4TimelineZoomPath });
          console.log(`Saved: ${step4TimelineZoomPath}`);
        }
      }
    } catch (e) {
      console.warn(`Step 4 click error on ${vp.name}:`, e.message);
    }

    await context.close();
  }

  await browser.close();
  console.log('\nAll Responsive UI Screenshots captured successfully!');
}

run();

