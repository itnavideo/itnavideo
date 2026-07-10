import {PutBucketCorsCommand, S3Client} from '@aws-sdk/client-s3';
import {loadEnvLocal} from './load-env-local.mjs';

loadEnvLocal();

const region = clean(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION) || 'ap-south-1';
const bucket = clean(process.env.REMOTION_LAMBDA_BUCKET_NAME || process.env.AWS_ASSET_BUCKET);
const siteUrl = clean(process.env.NEXT_PUBLIC_SITE_URL);
const extraOrigins = clean(process.env.S3_UPLOAD_ALLOWED_ORIGINS)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!bucket) {
  throw new Error('Missing REMOTION_LAMBDA_BUCKET_NAME. Configure a dedicated temporary media bucket first.');
}

const allowedOrigins = Array.from(
  new Set([
    '*',
    ...siteOrigins(siteUrl),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...extraOrigins,
  ].filter(Boolean)),
);

if (!allowedOrigins.length) {
  throw new Error('Missing NEXT_PUBLIC_SITE_URL or S3_UPLOAD_ALLOWED_ORIGINS for S3 upload CORS.');
}

const accessKeyId = clean(process.env.AWS_ACCESS_KEY_ID);
const secretAccessKey = clean(process.env.AWS_SECRET_ACCESS_KEY);
const s3 = new S3Client({
  region,
  credentials: accessKeyId && secretAccessKey ? {accessKeyId, secretAccessKey} : undefined,
});

await s3.send(
  new PutBucketCorsCommand({
    Bucket: bucket,
    CORSConfiguration: {
      CORSRules: [
        {
          ID: 'itnavideo-browser-presigned-upload',
          AllowedOrigins: allowedOrigins,
          AllowedMethods: ['PUT', 'GET', 'HEAD'],
          AllowedHeaders: ['*'],
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3000,
        },
      ],
    },
  }),
);

process.stdout.write(`Applied browser upload CORS to ${bucket} for: ${allowedOrigins.join(', ')}\n`);

function clean(value) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}

function siteOrigins(value) {
  if (!value) return [];
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    return [`${url.protocol}//${host}`, `${url.protocol}//www.${host}`];
  } catch {
    return [value];
  }
}
