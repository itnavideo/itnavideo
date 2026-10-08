import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

async function getGcpAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const credPath = path.join(process.cwd(), 'gcp-credentials.json');
  if (!fs.existsSync(credPath)) {
    console.error('gcp-credentials.json missing');
    return null;
  }

  const key = JSON.parse(fs.readFileSync(credPath, 'utf8'));
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: key.client_email,
    sub: key.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
  };

  const toBase64Url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsignedToken = `${toBase64Url(header)}.${toBase64Url(payload)}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsignedToken);
  const signature = sign.sign(key.private_key, 'base64url');
  const jwt = `${unsignedToken}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await res.json();
  return tokenData.access_token || null;
}

async function runPhase1() {
  console.log('=== PHASE 1: STANDALONE IMAGEN 3 GENERATION TEST ===');
  const token = await getGcpAccessToken();
  if (!token) {
    console.error('❌ Failed to obtain GCP Access Token');
    process.exit(1);
  }
  console.log('✓ Token acquired for project: geometric-hull-501707-m2');

  const prompts = [
    'cinematic shot of a luxury modern living room, 8k, photorealistic',
    'close-up shot of a technician holding an HVAC repair invoice in a sunlit room, 8k, photorealistic'
  ];

  const region = 'us-east4';
  const model = 'imagen-3.0-generate-002';
  const url = `https://${region}-aiplatform.googleapis.com/v1/projects/geometric-hull-501707-m2/locations/${region}/publishers/google/models/${model}:predict`;

  for (let i = 0; i < prompts.length; i++) {
    console.log(`\nTesting Image ${i + 1}: "${prompts[i]}"`);
    console.log(`Target URL: ${url}`);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{ prompt: prompts[i] }],
          parameters: { sampleCount: 1, aspectRatio: '16:9', addWatermark: false },
        }),
      });

      console.log(`HTTP Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
        if (b64) {
          console.log(`✅ Image ${i + 1} SUCCESS! Byte length: ${(b64.length / 1024).toFixed(1)} KB`);
        } else {
          console.warn(`⚠️ HTTP 200 but predictions[0].bytesBase64Encoded missing:`, JSON.stringify(data, null, 2));
        }
      } else {
        const errText = await res.text();
        console.log(`❌ Error Response Payload:\n${errText}`);
      }
    } catch (err) {
      console.error(`Exception during Image ${i + 1} call:`, err.message);
    }
  }
}

runPhase1();
