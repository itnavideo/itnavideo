import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Phase 1 Audit - Auto Captions', async ({ page }) => {
  test.setTimeout(120000);
  const testVideoPath = path.join(__dirname, 'test.mp4');
  
  const report = {
    uploadStatus: 'PENDING',
    fileReferenceStatus: 'PENDING',
    storageStatus: 'PENDING',
    generationStartStatus: 'PENDING',
    consoleErrors: [] as string[],
    networkErrors: [] as string[],
    backendErrors: [] as string[],
    envErrors: [] as string[],
    requestsSent: [] as string[],
  };

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      report.consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
    } else {
      console.log(`[BROWSER] ${msg.text()}`);
    }
  });

  page.on('request', req => {
    if (req.url().includes('/api/')) {
      report.requestsSent.push(`${req.method()} ${req.url()}`);
    }
  });

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('/api/media/presign') || url.includes('/api/reels/jobs') || url.includes('/storage/')) {
      if (!res.ok()) {
        report.networkErrors.push(`${res.request().method()} ${url} - ${res.status()}`);
        try {
          const text = await res.text();
          report.backendErrors.push(`URL: ${url} | Resp: ${text}`);
        } catch(e) {}
        
        if (url.includes('/api/media/presign')) report.uploadStatus = 'FAIL';
        if (url.includes('/api/reels/jobs')) report.generationStartStatus = 'FAIL';
      } else {
        if (url.includes('/api/media/presign')) {
          report.uploadStatus = 'PASS';
        }
        if (url.includes('google') || url.includes('aws') || url.includes('supabase') || url.includes('storage')) {
           // presign upload itself
           report.storageStatus = 'PASS';
        }
        if (url.includes('/api/reels/jobs')) {
          report.generationStartStatus = 'PASS';
          try {
             const text = await res.text();
             console.log('[BROWSER JOB RESP]', text);
          } catch(e) {}
        }
      }
    }
  });

  console.log('Navigating to page...');
  await page.goto('http://localhost:3000/dashboard/auto-caption', { timeout: 60000 });
  
  await page.waitForSelector('h1:has-text("Auto Caption")');

  console.log('Uploading test.mp4...');
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles(testVideoPath);

  await page.waitForTimeout(2000);
  
  const generateButton = await page.locator('button:has-text("Generate Reel"), button:has-text("Style & Transcribe Clip")').first();
  
  if (await generateButton.isVisible()) {
    report.fileReferenceStatus = 'PASS';
  } else {
    report.fileReferenceStatus = 'FAIL';
  }

  console.log('Clicking generate...');
  await generateButton.click();
  
  // Wait up to 15 seconds to see what API calls happen
  await page.waitForTimeout(15000);

  fs.writeFileSync('audit-report.json', JSON.stringify(report, null, 2));
  console.log('Audit complete, report saved.');
});
