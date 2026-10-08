import { readFileSync } from 'fs';
import * as crypto from 'crypto';

async function testGcpV1Beta1() {
  try {
    const key = JSON.parse(readFileSync('gcp-credentials.json', 'utf8'));
    const token = await getAccessToken(key);

    const apiVersions = ['v1', 'v1beta1'];
    const models = [
      'imagen-3.0-generate-002',
      'imagen-3.0-generate-001',
      'imagen-3.0-fast-generate-001',
      'imagegeneration@006',
    ];

    for (const ver of apiVersions) {
      for (const model of models) {
        const url = `https://us-central1-aiplatform.googleapis.com/${ver}/projects/${key.project_id}/locations/us-central1/publishers/google/models/${model}:predict`;
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

        console.log(`API: ${ver} | Model: ${model} => Status: ${res.status}`);
        if (res.ok) {
          console.log(`🎉 SUCCESS WITH ${ver} AND ${model}!`);
          return;
        } else if (res.status !== 404) {
          const errText = await res.text();
          console.log(`Error (${res.status}):`, errText.slice(0, 300));
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

testGcpV1Beta1();
