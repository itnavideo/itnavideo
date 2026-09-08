/**
 * Upload all reusable/direct assets to S3 and update assets.json with S3 URLs.
 * Usage: node scripts/upload-assets-to-s3.mjs
 */
import {readFileSync, writeFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import path from 'node:path';
import {S3Client, PutObjectCommand, HeadObjectCommand} from '@aws-sdk/client-s3';
import {config} from 'dotenv';

// Load .env.local
config({path: path.resolve(process.cwd(), '.env.local')});

const BUCKET = process.env.REMOTION_LAMBDA_BUCKET_NAME || 'remotionlambda-apsouth1-m59wp9dklj';
const REGION = process.env.AWS_REGION || 'ap-south-1';
const S3_PREFIX = 'assets/';

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const ASSET_DIR = path.resolve(process.cwd(), 'public/assets');
const ASSETS_JSON = path.resolve(process.cwd(), 'public/assets/assets.json');

function getMimeType(ext) {
  const map = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.mp4': 'video/mp4'};
  return map[ext.toLowerCase()] || 'application/octet-stream';
}

async function fileExistsOnS3(key) {
  try {
    await s3.send(new HeadObjectCommand({Bucket: BUCKET, Key: key}));
    return true;
  } catch { return false; }
}

async function uploadFile(localPath, s3Key) {
  const body = readFileSync(localPath);
  const ext = path.extname(localPath);
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    Body: body,
    ContentType: getMimeType(ext),
    CacheControl: 'public, max-age=31536000',
  }));
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${s3Key}`;
}

function collectFiles(dir, prefix = '') {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    if (statSync(full).isDirectory()) {
      files.push(...collectFiles(full, rel));
    } else if (/\.(png|jpe?g|webp|gif|svg)$/i.test(name)) {
      files.push({localPath: full, relativePath: rel});
    }
  }
  return files;
}

async function main() {
  console.log(`Bucket: ${BUCKET} | Region: ${REGION}`);
  console.log(`Asset dir: ${ASSET_DIR}`);

  // Collect all image files
  const reusableImages = collectFiles(path.join(ASSET_DIR, 'reusable/images'), 'reusable/images');
  const reusableBg = collectFiles(path.join(ASSET_DIR, 'reusable/backgrounds'), 'reusable/backgrounds');
  const directImages = collectFiles(path.join(ASSET_DIR, 'direct'), 'direct');
  
  const allFiles = [...reusableImages, ...reusableBg, ...directImages];
  console.log(`\nFiles to upload: ${allFiles.length}`);
  console.log(`  Reusable images: ${reusableImages.length}`);
  console.log(`  Reusable backgrounds: ${reusableBg.length}`);
  console.log(`  Direct/one-time: ${directImages.length}`);

  // Upload
  let uploaded = 0, skipped = 0, failed = 0;
  const urlMap = new Map(); // relativePath -> s3Url

  for (const file of allFiles) {
    const s3Key = `${S3_PREFIX}${file.relativePath}`;
    try {
      const exists = await fileExistsOnS3(s3Key);
      if (exists) {
        skipped++;
        urlMap.set(file.relativePath, `https://${BUCKET}.s3.${REGION}.amazonaws.com/${s3Key}`);
        if (skipped % 50 === 0) process.stdout.write(`  [skip ${skipped}]`);
        continue;
      }
      const url = await uploadFile(file.localPath, s3Key);
      urlMap.set(file.relativePath, url);
      uploaded++;
      if (uploaded % 10 === 0) process.stdout.write(`  [${uploaded}]`);
    } catch (err) {
      failed++;
      console.error(`\n  FAILED: ${file.relativePath} - ${err.message}`);
    }
  }

  console.log(`\n\nUpload complete: ${uploaded} new, ${skipped} already existed, ${failed} failed`);

  // Update assets.json
  if (existsSync(ASSETS_JSON)) {
    const json = JSON.parse(readFileSync(ASSETS_JSON, 'utf-8'));
    let updated = 0;
    for (const asset of json.assets) {
      const file = asset.file || asset.src?.replace('/assets/', '');
      if (file && urlMap.has(file)) {
        asset.storage = asset.storage || {};
        asset.storage.provider = 's3';
        asset.storage.awsKey = `${S3_PREFIX}${file}`;
        asset.storage.publicUrl = urlMap.get(file);
        asset.src = urlMap.get(file);
        updated++;
      }
    }
    writeFileSync(ASSETS_JSON, JSON.stringify(json, null, 2));
    console.log(`\nassets.json updated: ${updated} assets now have S3 URLs`);
  }
}

main().catch((err) => { console.error('Upload failed:', err); process.exit(1); });
