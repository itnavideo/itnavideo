import { chromium } from '@playwright/test';

async function test() {
  console.log('Launching Chrome to connect to http://localhost:3000...');
  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    console.log('Navigating to http://localhost:3000/dashboard/image-to-video...');
    const response = await page.goto('http://localhost:3000/dashboard/image-to-video', {
      timeout: 10000,
      waitUntil: 'networkidle'
    }).catch(e => {
      console.log('Direct goto result:', e.message);
      return null;
    });

    if (response) {
      console.log('Got response status:', response.status());
      const title = await page.title();
      console.log('Page title:', title);
    }
    await browser.close();
  } catch (err) {
    console.error('Test error:', err.message);
  }
}

test();

