import { chromium } from 'playwright';

async function inspectLogin() {
  console.log('Inspecting production login page...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto('https://www.itnavideo.com/login', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'scratch/login-inspect.png' });
    console.log('Saved scratch/login-inspect.png');

    const formText = await page.textContent('body');
    console.log('Login page snippet:', formText.substring(0, 500).replace(/\n+/g, ' '));

    const inputs = await page.locator('input').all();
    console.log(`Found ${inputs.length} input elements on login page.`);
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute('type');
      const placeholder = await inputs[i].getAttribute('placeholder');
      const name = await inputs[i].getAttribute('name');
      console.log(`Input ${i}: type="${type}", placeholder="${placeholder}", name="${name}"`);
    }

  } catch (err) {
    console.error('Error inspecting login:', err);
  } finally {
    await browser.close();
  }
}

inspectLogin();
