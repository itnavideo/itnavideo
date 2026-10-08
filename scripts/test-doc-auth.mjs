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
if (tokenData.access_token) {
  console.log('SUCCESS: Obtained Google OAuth2 Access Token!');
  
  const docId = '1bJkaF6OAysRQUNnxSusLKsjRCs0mGJhsjE2m1fyeC1U';
  const docRes = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  
  const docJson = await docRes.json();
  if (docRes.ok) {
    console.log('SUCCESS: Connected to Google Doc:', docJson.title);
  } else {
    console.error('ERROR connecting to Google Doc:', docJson);
  }
} else {
  console.error('Failed to get token:', tokenData);
}
