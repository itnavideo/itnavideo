/**
 * Upload a single marketing/intro video to the Itnavideo S3 bucket using
 * multipart streaming (safe for 100MB+ files, unlike a plain PutObject).
 *
 * Usage:
 *   node scripts/upload-intro-video.mjs "C:/Users/Akram Editor Studio/Downloads/km_20260716_1080p_30f_20260716_231244.mp4"
 *
 * Optional env overrides:
 *   INTRO_VIDEO_KEY   -> S3 object key (default: public/marketing/itnavideo-intro-2026.mp4)
 *   INTRO_VIDEO_ACL   -> "public-read" | "" (default: public-read; empty falls back to bucket default)
 */
import {createReadStream, statSync, existsSync} from 'node:fs';
import path from 'node:path';
import {S3Client} from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage';
import {config} from 'dotenv';

config({path: path.resolve(process.cwd(), '.env.local')});

const BUCKET = process.env.REMOTION_LAMBDA_BUCKET_NAME || process.env.AWS_ASSET_BUCKET;
const REGION = process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || 'ap-south-1';
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const DEFAULT_KEY = 'public/marketing/itnavideo-intro-2026.mp4';
const KEY = process.env.INTRO_VIDEO_KEY || DEFAULT_KEY;
const ACL = process.env.INTRO_VIDEO_ACL ?? 'public-read';

function fail(message) {
  console.error(`\n[intro-upload] ${message}\n`);
  process.exit(1);
}

const localPath = process.argv[2];
if (!localPath) fail('Please pass the local video path as the first argument.');
if (!existsSync(localPath)) fail(`File not found: ${localPath}`);
if (!BUCKET) fail('REMOTION_LAMBDA_BUCKET_NAME (or AWS_ASSET_BUCKET) is not set in .env.local');
if (!ACCESS_KEY || !SECRET_KEY) fail('AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY missing in .env.local');

const stats = statSync(localPath);
console.log(`[intro-upload] Bucket: ${BUCKET} (${REGION})`);
console.log(`[intro-upload] Object key: ${KEY}`);
console.log(`[intro-upload] Local file: ${localPath}`);
console.log(`[intro-upload] Size: ${(stats.size / (1024 * 1024)).toFixed(1)} MB`);

const client = new S3Client({
  region: REGION,
  credentials: {accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY},
});

async function uploadWithConfig({withAcl}) {
  const stream = createReadStream(localPath);
  const uploader = new Upload({
    client,
    params: {
      Bucket: BUCKET,
      Key: KEY,
      Body: stream,
      ContentType: 'video/mp4',
      CacheControl: 'public, max-age=31536000, immutable',
      ...(withAcl && ACL ? {ACL} : {}),
    },
    queueSize: 3,
    partSize: 8 * 1024 * 1024,
    leavePartsOnError: false,
  });

  uploader.on('httpUploadProgress', (progress) => {
    if (!progress.total) return;
    const pct = ((progress.loaded / progress.total) * 100).toFixed(1);
    process.stdout.write(`\r[intro-upload] ${pct}% (${(progress.loaded / (1024 * 1024)).toFixed(1)} MB / ${(progress.total / (1024 * 1024)).toFixed(1)} MB)   `);
  });

  await uploader.done();
  console.log('');
}

async function main() {
  try {
    await uploadWithConfig({withAcl: true});
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/AccessControlListNotSupported|AccessDenied|Bucket does not allow ACLs/i.test(message)) {
      console.log('\n[intro-upload] Bucket blocks public-read ACL. Retrying without ACL (bucket policy will decide access).');
      await uploadWithConfig({withAcl: false});
    } else {
      throw error;
    }
  }

  const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${KEY}`;
  console.log(`[intro-upload] ✅ Uploaded.\n[intro-upload] Public URL: ${publicUrl}`);
}

main().catch((err) => {
  console.error('\n[intro-upload] Upload failed:', err.message || err);
  process.exit(1);
});
