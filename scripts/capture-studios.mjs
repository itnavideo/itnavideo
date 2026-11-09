import { chromium } from '@playwright/test';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5
  });
  const page = await ctx.newPage();

  await page.goto('http://localhost:3000/dashboard/auto-caption', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);

  // 1. Click "Try Sample Clip" so media is loaded
  const sampleBtn = page.locator('button:has-text("Try Sample Clip")').first();
  if (await sampleBtn.isVisible()) {
    await sampleBtn.click();
    await page.waitForTimeout(600);
  }

  // 2. Click "Continue to Step 2: Music & Audio"
  const step2Btn = page.locator('button:has-text("Continue to Step 2")').first();
  if (await step2Btn.isVisible()) {
    await step2Btn.click();
    await page.waitForTimeout(600);
  }
  const step2Path = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections\\auto_caption_step2.png';
  await page.screenshot({ path: step2Path });
  console.log('Saved Step 2 screenshot:', step2Path);

  // 3. Click "Continue to Step 3: Caption Style"
  const step3Btn = page.locator('button:has-text("Continue to Step 3")').first();
  if (await step3Btn.isVisible()) {
    await step3Btn.click();
    await page.waitForTimeout(600);
  }
  const step3Path = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections\\auto_caption_step3.png';
  await page.screenshot({ path: step3Path });
  console.log('Saved Step 3 screenshot:', step3Path);

  // 4. Click "Continue to Step 4: Live Studio Monitor"
  const step4Btn = page.locator('button:has-text("Continue to Step 4")').first();
  if (await step4Btn.isVisible()) {
    await step4Btn.click();
    await page.waitForTimeout(800);
  }
  const step4Path = 'C:\\Users\\Akram Editor Studio\\.gemini\\antigravity\\brain\\579bfa17-30c9-431a-9b21-a73bbfbde464\\ui_inspections\\auto_caption_step4.png';
  await page.screenshot({ path: step4Path });
  console.log('Saved Step 4 screenshot:', step4Path);

  await browser.close();
  console.log('All steps captured successfully!');
}

run().catch(console.error);
