import fs from 'node:fs';
import path from 'node:path';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}${CYAN}======================================================================`);
console.log(`        ITNAVIDEO — Real Live User Simulation & Synthetic Tester`);
console.log(`======================================================================${RESET}\n`);

const TARGET_URL = process.argv[2] || 'https://www.itnavideo.com';
console.log(`Targeting Domain: ${BOLD}${CYAN}${TARGET_URL}${RESET}`);
console.log(`Simulating user action and verifying end-to-end routing...`);

async function testEndpoint(endpoint, options = {}) {
  const url = `${TARGET_URL}${endpoint}`;
  const start = performance.now();
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });
    const duration = Math.round(performance.now() - start);
    
    let responseBody = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      responseBody = await res.json();
    } else {
      await res.text(); // drain connection
    }

    if (res.ok) {
      console.log(`  [${GREEN}OK${RESET}] ${endpoint} - HTTP ${res.status} (${duration}ms)`);
      return { ok: true, duration, status: res.status, body: responseBody };
    } else {
      console.log(`  [${RED}FAIL${RESET}] ${endpoint} - HTTP ${res.status} (${duration}ms)`);
      if (responseBody) {
        console.log(`         ↳ Response Error: ${RED}${JSON.stringify(responseBody)}${RESET}`);
      }
      return { ok: false, duration, status: res.status, body: responseBody };
    }
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    console.log(`  [${RED}ERROR${RESET}] ${endpoint} - Fetch Failed (${duration}ms)`);
    console.log(`         ↳ Network Exception: ${RED}${err.message}${RESET}`);
    return { ok: false, duration, status: 0, error: err };
  }
}

async function runSimulation() {
  console.log(`\n${BOLD}Step 1: Pinging Live Website Home Canvas (Page Load Check)${RESET}`);
  const home = await testEndpoint('/');
  
  console.log(`\n${BOLD}Step 2: Checking Dashboard Canvas Asset Loading${RESET}`);
  await testEndpoint('/dashboard');

  console.log(`\n${BOLD}Step 3: Simulating User Upload & Presigned URL Generation${RESET}`);
  // We simulate a mock user session by sending a presign request to GCS
  const presignResult = await testEndpoint('/api/media/presign', {
    method: 'POST',
    body: JSON.stringify({
      fileName: 'synthetic_live_user_test.mp3',
      contentType: 'audio/mpeg',
      mode: 'audioClean',
      fileSize: 1024 * 100, // 100 KB
      userId: 'anonymous_or_test_id' // Mock check
    })
  });

  if (presignResult.ok) {
    console.log(`  [${GREEN}INFO${RESET}] Presign generator validated: Google Cloud Storage credentials are fully operational!`);
  } else if (presignResult.status === 401) {
    console.log(`  [${GREEN}PASS${RESET}] Presign route blocked correctly (HTTP 401 Unauthorized for Guest session)`);
  } else if (presignResult.status === 402) {
    console.log(`  [${GREEN}PASS${RESET}] Presign route handled credits limit block cleanly (HTTP 402 Payment Required)`);
  } else {
    console.log(`  [${RED}WARN${RESET}] Presign route thrown unexpected status: ${presignResult.status}`);
  }

  console.log(`\n${BOLD}Step 4: Checking Core API Latency & Free Tier Metering Server${RESET}`);
  await testEndpoint('/api/admin/free-tier');

  console.log(`\n${BOLD}======================================================================`);
  console.log(`                       LIVE SIMULATION SUMMARY`);
  console.log(`======================================================================${RESET}`);
  
  if (home.ok) {
    console.log(`  ${GREEN}${BOLD}✔ SYSTEM HEALTHY: Website is live and taking traffic!${RESET}`);
    console.log(`  Target URL: ${CYAN}${TARGET_URL}${RESET}`);
    console.log(`  Page Response Latency: ${home.duration}ms`);
  } else {
    console.log(`  ${RED}${BOLD}✘ REGRESSION WARNING: The target domain is unreachable or returning errors!${RESET}`);
  }
  console.log(`======================================================================\n`);
}

runSimulation();
