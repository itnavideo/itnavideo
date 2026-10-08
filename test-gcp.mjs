import { readFileSync } from 'fs';
import * as crypto from 'crypto';

async function testGcpDirect() {
  try {
    const key = JSON.parse(readFileSync('gcp-credentials.json', 'utf8'));
    console.log('Service Account Email:', key.client_email);
    console.log('Project ID:', key.project_id);

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

    const tokenData = await res.json();
    if (!tokenData.access_token) {
      console.error('JWT Token Exchange Failed:', tokenData);
      return;
    }

    const token = tokenData.access_token;
    console.log('Successfully acquired GCP Access Token:', token.slice(0, 25) + '...');

    // Now test Vertex AI Imagen 3 call
    const models = [
      'imagen-3.0-generate-002',
      'imagen-3.0-generate-001',
      'imagen-3.0-fast-generate-001',
    ];

    for (const model of models) {
      const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${key.project_id}/locations/us-central1/publishers/google/models/${model}:predict`;
      console.log(`\n========================================`);
      console.log(`Calling Vertex AI Imagen: ${model}`);
      console.log(`========================================`);

      const imgRes = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{ prompt: 'Cinematic photo of a modern high tech audio studio' }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '16:9',
            safetySetting: 'block_only_high',
            personGeneration: 'allow_adult',
            addWatermark: false,
          },
        }),
      });

      console.log(`HTTP Status Code: ${imgRes.status} ${imgRes.statusText}`);
      const bodyText = await imgRes.text();
      if (imgRes.ok) {
        console.log(`✅ SUCCESS! ${model} generated a valid image!`);
      } else {
        console.log(`❌ ERROR Body from Vertex AI (${model}):`);
        console.log(bodyText);
      }
    }
  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

testGcpDirect();
