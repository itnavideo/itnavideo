import {S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3';
import {loadEnvLocal} from './load-env-local.mjs';

loadEnvLocal();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  console.error('Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY in .env.local');
  process.exit(1);
}

const sourceBucket = 'remotionlambda-apsouth1-m59wp9dklj';
const sourceRegion = 'ap-south-1';

const targetBucket = 'remotionlambda-useast1-2zq6twaok1';
const targetRegion = 'us-east-1';

const s3Source = new S3Client({
  region: sourceRegion,
  credentials: {accessKeyId, secretAccessKey},
});

const s3Target = new S3Client({
  region: targetRegion,
  credentials: {accessKeyId, secretAccessKey},
});

async function main() {
  console.log(`Scanning source bucket: ${sourceBucket} (${sourceRegion})...`);
  
  let continuationToken = undefined;
  let allObjects = [];

  do {
    const listRes = await s3Source.send(
      new ListObjectsV2Command({
        Bucket: sourceBucket,
        ContinuationToken: continuationToken,
      })
    );

    if (listRes.Contents) {
      allObjects.push(...listRes.Contents);
    }
    continuationToken = listRes.NextContinuationToken;
  } while (continuationToken);

  console.log(`Found total ${allObjects.length} objects in source bucket.`);

  if (allObjects.length === 0) {
    console.log('Source bucket is already empty. Nothing to copy.');
    return;
  }

  // Filter for image/media files or all assets
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.mp3', '.wav', '.mp4'];
  const filesToTransfer = allObjects.filter((obj) => {
    const key = obj.Key || '';
    // Skip remotion temporary bundle / chunk files if desired, or copy assets
    return imageExtensions.some((ext) => key.toLowerCase().endsWith(ext)) || key.startsWith('assets/') || key.startsWith('images/') || key.startsWith('uploads/');
  });

  console.log(`Found ${filesToTransfer.length} media/image files to transfer to ${targetBucket} (${targetRegion}):`);
  filesToTransfer.forEach((f) => console.log(` - ${f.Key} (${(f.Size / 1024).toFixed(1)} KB)`));

  if (filesToTransfer.length === 0) {
    console.log('No specific image files found, listing all objects:');
    allObjects.slice(0, 20).forEach((f) => console.log(` - ${f.Key} (${(f.Size / 1024).toFixed(1)} KB)`));
    console.log('\nDo you want to copy all objects?');
  }

  let transferred = 0;
  for (const file of filesToTransfer) {
    const key = file.Key;
    console.log(`Transferring: ${key}...`);

    const getRes = await s3Source.send(
      new GetObjectCommand({
        Bucket: sourceBucket,
        Key: key,
      })
    );

    const streamToBuffer = async (stream) => {
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    };

    const bodyBuffer = await streamToBuffer(getRes.Body);

    await s3Target.send(
      new PutObjectCommand({
        Bucket: targetBucket,
        Key: key,
        Body: bodyBuffer,
        ContentType: getRes.ContentType,
      })
    );

    transferred++;
    console.log(`✅ [${transferred}/${filesToTransfer.length}] Transferred: ${key}`);
  }

  console.log(`\n🎉 Completed transfer of ${transferred} files from ${sourceBucket} to ${targetBucket}!`);
}

main().catch((err) => {
  console.error('Transfer failed:', err);
  process.exit(1);
});
