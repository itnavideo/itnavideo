// scripts/upload-missing-stickers.mjs
// Native Node.js S3 SigV4 uploader (Zero external dependencies)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const region = 'us-east-1';
const bucket = 'remotionlambda-useast1-2zq6twaok1';
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

function hmac(key, string) {
  return crypto.createHmac('sha256', key).update(string).digest();
}

function hash(string) {
  return crypto.createHash('sha256').update(string).digest('hex');
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = hmac('AWS4' + key, dateStamp);
  const kRegion = hmac(kDate, regionName);
  const kService = hmac(kRegion, serviceName);
  const kSigning = hmac(kService, 'aws4_request');
  return kSigning;
}

async function putS3Object(s3Key, fileBuffer, contentType = 'image/png') {
  const endpoint = `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = hash(fileBuffer);
  const canonicalUri = '/' + s3Key.split('/').map(encodeURIComponent).join('/');
  const canonicalHeaders = `content-type:${contentType}\nhost:${bucket}.s3.${region}.amazonaws.com\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = `PUT\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${dateStamp}/${region}/s3/aws4_request\n${hash(canonicalRequest)}`;
  
  const signingKey = getSignatureKey(secretKey, dateStamp, region, 's3');
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKey}/${dateStamp}/${region}/s3/aws4_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Host': `${bucket}.s3.${region}.amazonaws.com`,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash,
      'Authorization': authorizationHeader,
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`S3 PUT failed ${res.status}: ${errText}`);
  }

  console.log(`✅ Uploaded to https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`);
}

async function run() {
  const localSticker = path.resolve('public/assets/stickman/3d-presenter-man/teacher-welcome.png');
  const fileBuffer = fs.readFileSync(localSticker);

  console.log('Uploading stickman-explainer.png to required Lambda site locations...');
  await putS3Object('sites/itnavideo-render-30fps/public/visuals/stickers/stickman-explainer.png', fileBuffer);
  await putS3Object('sites/itnavideo-render-30fps/visuals/stickers/stickman-explainer.png', fileBuffer);

  const stickerFiles = [
    'teacher-left.png',
    'teacher-right.png',
    'teacher-success.png',
    'teacher-thinking.png',
    'teacher-warning.png',
    'teacher-welcome.png',
  ];

  for (const f of stickerFiles) {
    const p = path.resolve('public/assets/stickman/3d-presenter-man', f);
    if (fs.existsSync(p)) {
      const buf = fs.readFileSync(p);
      await putS3Object(`sites/itnavideo-render-30fps/public/visuals/stickers/${f}`, buf);
      await putS3Object(`sites/itnavideo-render-30fps/visuals/stickers/${f}`, buf);
      await putS3Object(`sites/itnavideo-render-30fps/assets/stickman/3d-presenter-man/${f}`, buf);
    }
  }

  console.log('\n🎉 ALL STICKER ASSETS SYNCED TO S3 LAMBDA SITE!');
}

run().catch(console.error);
