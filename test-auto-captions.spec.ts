import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Auto Captions E2E Workflow', async ({ page }) => {
  test.setTimeout(300000); // 5 minutes timeout for slow compilation
  const testVideoPath = path.join(__dirname, 'test_speech.mp3');

  // Go to page
  console.log('Navigating to page...');
  await page.goto('http://localhost:3000/dashboard/auto-caption', { timeout: 120000 });

  console.log('Checking auth logic...');
  await page.waitForSelector('h1:has-text("Auto Caption")');

  console.log('Uploading file...');
  // Find file input and set file
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles(testVideoPath);

  console.log('Waiting for upload and start render button...');
  const generateButton = await page.locator('button:has-text("Generate Reel"), button:has-text("Style & Transcribe Clip")').first();
  await expect(generateButton).toBeVisible();

  console.log('Clicking start render button...');
  await generateButton.click();

  console.log('Waiting for render to finish...');
  // Now we need to wait for the result
  // The UI will show Progress / Working ...
  // It should reach "Ready"
  await expect(page.locator('text=Captions Styled & Synced!')).toBeVisible({ timeout: 120000 });

  console.log('Verify video is ready');
  const videoElement = await page.locator('video');
  await expect(videoElement).toBeVisible();

  console.log('Check download link');
  const downloadButton = await page.locator('button:has-text("Download High Resolution MP4")');
  await expect(downloadButton).toBeVisible();

  console.log('E2E Test Passed!');
});
