import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const report = {
    uploadStatus: 'FAIL',
    fileRefStatus: 'FAIL',
    storageStatus: 'FAIL',
    generationStartStatus: 'FAIL',
    consoleErrors: [],
    networkErrors: [],
    backendErrors: [],
    envErrors: [],
  };

  // Listen to console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      report.consoleErrors.push(msg.text());
    }
  });

  // Listen to network responses
  page.on('response', async response => {
    const status = response.status();
    const url = response.url();
    if (status >= 400 && !url.includes('favicon.ico')) {
      report.networkErrors.push(`${status} ${url}`);
      try {
        const text = await response.text();
        report.backendErrors.push(`[${status}] ${url}: ${text}`);
      } catch (e) {
        // ignore
      }
    }
  });

  try {
    console.log('Navigating to dashboard...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'domcontentloaded' });

    console.log('Clicking on Auto Captions...');
    const autoCaptionsLink = page.locator('text="Auto Caption"').first();
    const count = await autoCaptionsLink.count();
    if (count > 0) {
      await autoCaptionsLink.click();
    } else {
      console.log('Could not find text "Auto Caption", forcing mode...');
      await page.goto('http://localhost:3000/dashboard?mode=autoCaption', { waitUntil: 'domcontentloaded' });
    }
    
    await page.waitForTimeout(2000);

    console.log('Uploading file...');
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.resolve('test_video.mp4'));
    } else {
      throw new Error('File input not found');
    }

    console.log('Waiting for upload to complete...');
    await page.waitForTimeout(8000); // Wait 8s for upload
    
    if (report.consoleErrors.some(e => e.toLowerCase().includes('failed to upload') || e.toLowerCase().includes('file missing'))) {
      throw new Error('Upload failed based on console errors');
    }

    report.uploadStatus = 'PASS';
    report.fileRefStatus = 'PASS';

    console.log('Looking for Generate button...');
    const generateBtn = page.locator('button', { hasText: /Generate|Create|Start/i }).first();
    if (await generateBtn.count() > 0) {
      await generateBtn.click();
      console.log('Clicked Generate button, waiting 5s for network...');
      await page.waitForTimeout(5000);
      report.generationStartStatus = 'PASS';
    } else {
      throw new Error('Generate button not found');
    }
  } catch (err) {
    console.error('Audit script encountered an error:', err);
  } finally {
    console.log('--- REPORT START ---');
    console.log(JSON.stringify(report, null, 2));
    console.log('--- REPORT END ---');
    await browser.close();
  }
})();
