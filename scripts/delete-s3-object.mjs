// scripts/delete-s3-object.mjs
import crypto from 'node:crypto';
import { loadEnvLocal } from './load-env-local.mjs';

loadEnvLocal();

const REGION = process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || 'us-east-1';
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET = process.env.REMOTION_LAMBDA_BUCKET_NAME || 'remotionlambda-useast1-2zq6twaok1';

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto.createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  return kSigning;
}

export async function deleteS3Object(key) {
  if (!key) return;
  const cleanKey = key.replace(/^\/+/, '');
  const host = `${BUCKET}.s3.${REGION}.amazonaws.com`;
  const endpoint = `https://${host}/${encodeURI(cleanKey)}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = crypto.createHash('sha256').update('').digest('hex');
  const canonicalUri = '/' + cleanKey.split('/').map(encodeURIComponent).join('/');
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = `DELETE\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${REGION}/s3/aws4_request`;
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

  const signingKey = getSignatureKey(SECRET_KEY, dateStamp, REGION, 's3');
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const authHeader = `${algorithm} Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  console.log(`🗑  [AWS S3] Deleting s3://${BUCKET}/${cleanKey}...`);
  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'host': host,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash,
      'Authorization': authHeader,
    },
  });

  if (res.status === 204 || res.status === 200) {
    console.log(`✅ [AWS S3] Successfully deleted s3://${BUCKET}/${cleanKey}`);
    return true;
  } else {
    const text = await res.text();
    console.warn(`⚠️ [AWS S3] Delete returned HTTP ${res.status}:`, text);
    return false;
  }
}
