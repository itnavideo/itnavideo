import fs from 'node:fs';
import crypto from 'node:crypto';

const creds = JSON.parse(fs.readFileSync('gcp-credentials.json', 'utf8'));

const now = Math.floor(Date.now() / 1000);
const header = { alg: 'RS256', typ: 'JWT' };
const payload = {
  iss: creds.client_email,
  sub: creds.client_email,
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 3600,
  scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive'
};

function base64url(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const unsignedToken = `${base64url(header)}.${base64url(payload)}`;
const sign = crypto.createSign('RSA-SHA256');
sign.update(unsignedToken);
const signature = sign.sign(creds.private_key, 'base64')
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

const jwt = `${unsignedToken}.${signature}`;

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
});

const tokenData = await tokenRes.json();
const docId = '1bJkaF6OAysRQUNnxSusLKsjRCs0mGJhsjE2m1fyeC1U';

const testRes = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${tokenData.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    requests: [
      {
        addTab: {
          tabProperties: {
            title: "ENV & Secrets Safe Vault"
          }
        }
      }
    ]
  })
});

const testJson = await testRes.json();
console.log('addTab response:', testJson);
