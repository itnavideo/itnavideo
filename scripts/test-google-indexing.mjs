import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const credPath = path.resolve('gcp-credentials.json');
if (!fs.existsSync(credPath)) {
  console.error('Credentials file not found at:', credPath);
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(credPath, 'utf8'));
console.log('Project ID:', key.project_id);
console.log('Client Email:', key.client_email);

async function getIndexingToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: key.client_email,
    sub: key.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/indexing',
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
  if (!res.ok) {
    throw new Error('OAuth token error: ' + JSON.stringify(data));
  }
  return data.access_token;
}

async function test() {
  console.log('\nGetting OAuth2 token for Google Indexing API...');
  const token = await getIndexingToken();
  console.log('Got Access Token (length:', token.length, ')');

  const testUrl = 'https://www.itnavideo.com/';
  console.log('Submitting test URL to Google Indexing API:', testUrl);

  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: testUrl,
      type: 'URL_UPDATED',
    }),
  });

  const body = await res.json();
  console.log('HTTP Status:', res.status, res.statusText);
  console.log('Response Body:', JSON.stringify(body, null, 2));
}

test().catch(console.error);
