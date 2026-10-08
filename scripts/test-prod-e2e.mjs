import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function runE2ETest() {
  console.log('=== Starting E2E Production Test for Auto Captions ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('API') || msg.text().includes('Render')) {
      console.log('PAGE LOG:', msg.text());
    }
  });
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  try {
    // 1. Go to Login page
    const loginUrl = 'https://www.itnavideo.com/login';
    console.log(`1. Navigating to ${loginUrl}...`);
    await page.goto(loginUrl, { waitUntil: 'networkidle', timeout: 60000 });

    console.log('2. Logging in with confirmed credentials...');
    await page.fill('input[type="email"]', 'itnavideo@gmail.com');
    await page.fill('input[type="password"]', 'ItnavideoTest2026!');

    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();

    await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(3000);
    console.log(`   Authenticated! Current URL: ${page.url()}`);

    // 3. Navigate directly to Auto Captions studio
    const studioUrl = 'https://www.itnavideo.com/dashboard/auto-caption';
    console.log(`3. Navigating to Auto Captions studio: ${studioUrl}...`);
    await page.goto(studioUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.screenshot({ path: 'scratch/e2e-03-studio-loaded.png' });

    // 4. Locate file input
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 15000 });
    console.log('   ✓ File input found on Auto Captions page!');

    const testVideoPath = path.resolve('test_video.mp4');
    console.log(`4. Uploading test video (${fs.statSync(testVideoPath).size} bytes)...`);
    await fileInput.setInputFiles(testVideoPath);

    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'scratch/e2e-04-file-uploaded.png' });

    // 5. Select Style Card ("Viral")
    console.log('5. Selecting "Viral" visual caption style card...');
    const viralCard = page.locator('button:has-text("Viral")').first();
    if (await viralCard.isVisible()) {
      await viralCard.click();
      console.log('   Selected Viral style card.');
    }
    await page.screenshot({ path: 'scratch/e2e-05-style-selected.png' });

    // 6. Click Generate / Transcribe button
    console.log('6. Triggering "Style & Transcribe Clip"...');
    const renderBtn = page.locator('button:has-text("Style & Transcribe Clip"), button:has-text("Generate Reel")').first();
    await renderBtn.waitFor({ state: 'visible', timeout: 15000 });

    const isDisabled = await renderBtn.getAttribute('disabled');
    console.log(`   Render button status: ${isDisabled !== null ? 'DISABLED' : 'ENABLED'}`);

    if (isDisabled !== null) {
      console.log('   Waiting for button to become enabled...');
      await page.waitForTimeout(3000);
    }

    console.log('   Clicking Render button...');
    await renderBtn.click({ force: true });

    // 7. Monitor job completion
    console.log('7. Monitoring render job completion (up to 3 minutes)...');
    const startTime = Date.now();
    let completed = false;
    let failureMsg = null;

    while (Date.now() - startTime < 180000) {
      await page.waitForTimeout(5000);
      const text = await page.textContent('body');

      if (text.includes('Captions Styled') || text.includes('Ready for Export') || text.includes('Download High Resolution')) {
        completed = true;
        console.log('   ✓ RENDER COMPLETE! Final video ready on page.');
        break;
      }
      if (text.includes('Render Error') || text.includes('Technical Diagnostics') || text.includes('Failed to transcribe')) {
        failureMsg = 'Error banner/diagnostics displayed on UI';
        console.error('   × Failure detected on screen!');
        break;
      }
      console.log(`   ...Progress (${Math.round((Date.now() - startTime) / 1000)}s)...`);
    }

    await page.screenshot({ path: 'scratch/e2e-06-final-result.png' });
    console.log('Saved scratch/e2e-06-final-result.png');

    if (completed) {
      console.log('=== E2E PRODUCTION TEST SUCCESSFUL! ===');
    } else {
      console.error(`=== E2E PRODUCTION TEST FAILED: ${failureMsg || 'Timeout'} ===`);
    }

  } catch (err) {
    console.error('E2E EXCEPTION:', err);
    await page.screenshot({ path: 'scratch/e2e-error.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
}

runE2ETest();
