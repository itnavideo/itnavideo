import {PutBucketLifecycleConfigurationCommand, S3Client} from '@aws-sdk/client-s3';
import {loadEnvLocal} from './load-env-local.mjs';

loadEnvLocal();

const region = clean(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION) || 'ap-south-1';
const bucket = clean(process.env.REMOTION_LAMBDA_BUCKET_NAME || process.env.AWS_ASSET_BUCKET);
const expirationDays = 2;

if (!bucket) {
  throw new Error('Missing REMOTION_LAMBDA_BUCKET_NAME. Configure a dedicated temporary media bucket first.');
}

const accessKeyId = clean(process.env.AWS_ACCESS_KEY_ID);
const secretAccessKey = clean(process.env.AWS_SECRET_ACCESS_KEY);
const s3 = new S3Client({
  region,
  credentials: accessKeyId && secretAccessKey ? {accessKeyId, secretAccessKey} : undefined,
});

await s3.send(
  new PutBucketLifecycleConfigurationCommand({
    Bucket: bucket,
    LifecycleConfiguration: {
      Rules: [
        {
          ID: 'itnavideo-delete-temp-user-uploads-after-48h',
          Status: 'Enabled',
          Filter: {Prefix: 'uploads/raw/'},
          Expiration: {Days: expirationDays},
          AbortIncompleteMultipartUpload: {DaysAfterInitiation: 1},
          NoncurrentVersionExpiration: {NoncurrentDays: expirationDays},
        },
        {
          ID: 'itnavideo-delete-temp-final-renders-after-48h',
          Status: 'Enabled',
          Filter: {Prefix: 'renders/final/'},
          Expiration: {Days: expirationDays},
          AbortIncompleteMultipartUpload: {DaysAfterInitiation: 1},
          NoncurrentVersionExpiration: {NoncurrentDays: expirationDays},
        },
      ],
    },
  }),
);

process.stdout.write(`Applied lifecycle to ${bucket}: uploads/raw/ and renders/final/ expire after ${expirationDays} days.\n`);

function clean(value) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}
