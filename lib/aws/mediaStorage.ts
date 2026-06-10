import {GetObjectCommand, PutBucketLifecycleConfigurationCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

export const TEMP_MEDIA_UPLOAD_PREFIX = 'uploads/raw/';
export const TEMP_MEDIA_RENDER_PREFIX = 'renders/final/';
export const TEMP_MEDIA_EXPIRATION_DAYS = 2;

export function getAwsRegion() {
  return clean(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION) || 'ap-south-1';
}

export function getTemporaryMediaBucket() {
  return clean(process.env.REMOTION_LAMBDA_BUCKET_NAME || process.env.AWS_ASSET_BUCKET);
}

export function getS3Client() {
  const accessKeyId = clean(process.env.AWS_ACCESS_KEY_ID);
  const secretAccessKey = clean(process.env.AWS_SECRET_ACCESS_KEY);

  return new S3Client({
    region: getAwsRegion(),
    credentials: accessKeyId && secretAccessKey ? {accessKeyId, secretAccessKey} : undefined,
  });
}

export async function createUploadUrl({
  contentType,
  fileName,
  mode,
  userId,
}: {
  contentType: string;
  fileName: string;
  mode: 'audio' | 'video' | 'image';
  userId: string;
}) {
  const bucket = requiredBucket();
  const safeFileName = sanitizeFileName(fileName);
  const key = `${TEMP_MEDIA_UPLOAD_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-${mode}-${safeFileName}`;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getS3Client(), command, {expiresIn: 15 * 60});
  return {bucket, key, uploadUrl};
}

export async function uploadTemporaryMediaObject({
  body,
  contentType,
  fileName,
  mode,
  userId,
  purpose = 'processed',
}: {
  body: Uint8Array;
  contentType: string;
  fileName: string;
  mode: 'audio' | 'video' | 'image';
  userId: string;
  purpose?: string;
}) {
  const bucket = requiredBucket();
  const safeFileName = sanitizeFileName(fileName);
  const key = `${TEMP_MEDIA_UPLOAD_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-${sanitizeSegment(purpose)}-${mode}-${safeFileName}`;
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return {bucket, key};
}

export async function createReadUrl(key: string, expiresInSeconds = 60 * 60 * 3) {
  const bucket = requiredBucket();
  const command = new GetObjectCommand({Bucket: bucket, Key: key});
  return getSignedUrl(getS3Client(), command, {expiresIn: expiresInSeconds});
}

export async function applyTemporaryMediaLifecycle() {
  const bucket = requiredBucket();
  await getS3Client().send(
    new PutBucketLifecycleConfigurationCommand({
      Bucket: bucket,
      LifecycleConfiguration: {
        Rules: [
          {
            ID: 'itnavideo-delete-temp-user-uploads-after-48h',
            Status: 'Enabled',
            Filter: {Prefix: TEMP_MEDIA_UPLOAD_PREFIX},
            Expiration: {Days: TEMP_MEDIA_EXPIRATION_DAYS},
            AbortIncompleteMultipartUpload: {DaysAfterInitiation: 1},
            NoncurrentVersionExpiration: {NoncurrentDays: TEMP_MEDIA_EXPIRATION_DAYS},
          },
          {
            ID: 'itnavideo-delete-temp-final-renders-after-48h',
            Status: 'Enabled',
            Filter: {Prefix: TEMP_MEDIA_RENDER_PREFIX},
            Expiration: {Days: TEMP_MEDIA_EXPIRATION_DAYS},
            AbortIncompleteMultipartUpload: {DaysAfterInitiation: 1},
            NoncurrentVersionExpiration: {NoncurrentDays: TEMP_MEDIA_EXPIRATION_DAYS},
          },
        ],
      },
    }),
  );
  return {bucket, expirationDays: TEMP_MEDIA_EXPIRATION_DAYS};
}

function requiredBucket() {
  const bucket = getTemporaryMediaBucket();
  if (!bucket) {
    throw new Error('Secure upload storage is not configured yet.');
  }
  return bucket;
}

function sanitizeFileName(value: string) {
  const cleanName = value
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
  return cleanName || 'upload.bin';
}

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'anonymous';
}

function clean(value?: string) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}
