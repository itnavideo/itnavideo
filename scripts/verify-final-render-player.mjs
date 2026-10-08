import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function verifyRender() {
  console.log('=== Verifying Final Rendered Video Player on Production ===');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto('https://www.itnavideo.com/login', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'itnavideo@gmail.com');
    await page.fill('input[type="password"]', 'ItnavideoTest2026!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    await page.goto('https://www.itnavideo.com/dashboard/auto-caption', { waitUntil: 'networkidle' });

    const fileInput = page.locator('input[type="file"]').first();
    const testVideoPath = path.resolve('test_video.mp4');
    await fileInput.setInputFiles(testVideoPath);
    await page.waitForTimeout(3000);

    const renderBtn = page.locator('button:has-text("Style & Transcribe Clip")').first();
    await renderBtn.click({ force: true });

    // Poll until ready
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(4000);
      const videoCount = await page.locator('video').count();
      if (videoCount > 0) {
        const videoSrc = await page.locator('video').first().getAttribute('src');
        const downloadBtn = page.locator('button:has-text("Download High Resolution MP4")');
        console.log(`✓ Video element found! src = "${videoSrc}"`);
        console.log(`✓ Download button count = ${await downloadBtn.count()}`);
        await page.screenshot({ path: 'scratch/e2e-verified-video-player.png' });
        console.log('Saved scratch/e2e-verified-video-player.png');
        break;
      }
    }
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
}

verifyRender();
