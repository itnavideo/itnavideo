import { readFileSync } from 'fs';
import * as crypto from 'crypto';

async function testGcpRegions() {
  try {
    const key = JSON.parse(readFileSync('gcp-credentials.json', 'utf8'));
    const token = await getAccessToken(key);

    const regions = ['us-central1', 'us-east4', 'europe-west1', 'asia-east1', 'asia-south1'];
    const models = [
      'imagen-3.0-generate-002',
      'imagen-3.0-generate-001',
      'imagen-3.0-fast-generate-001',
      'imagegeneration@006',
      'imagegeneration@005',
    ];

    for (const region of regions) {
      for (const model of models) {
        const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${key.project_id}/locations/${region}/publishers/google/models/${model}:predict`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [{ prompt: 'Cinematic photo of a modern high tech audio studio' }],
            parameters: { sampleCount: 1, aspectRatio: '16:9' },
          }),
        });

        if (res.ok) {
          console.log(`🎉 FOUND WORKING MODEL & REGION! Region: ${region}, Model: ${model}`);
          const text = await res.text();
          console.log('Sample output length:', text.length);
          return;
        } else if (res.status !== 404) {
          const errText = await res.text();
          console.log(`Region: ${region} | Model: ${model} Error (${res.status}):`, errText.slice(0, 200));
        } else {
          console.log(`Region: ${region} | Model: ${model} => 404 NOT FOUND`);
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

async function getAccessToken(key) {
  const now = Math.floor(Date.now() / 1000);
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
  const data = await res.json();
  return data.access_token;
}

testGcpRegions();
