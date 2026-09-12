export const TEMP_MEDIA_UPLOAD_PREFIX = 'uploads/raw/';
export const TEMP_MEDIA_RENDER_PREFIX = 'renders/final/';
export const TEMP_MEDIA_EXPIRATION_DAYS = 2;

function isGcpStorage() {
  const provider = clean(process.env.STORAGE_PROVIDER).toLowerCase();
  if (provider === 'aws') return false;
  return true;
}

function getGcpWorkerUrl() {
  return clean(process.env.GCP_RENDER_WORKER_URL || 'http://34.100.147.84:8080').replace(/\/+$/, '');
}

export function getAwsRegion() {
  return clean(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION) || 'ap-south-1';
}

export function getTemporaryMediaBucket() {
  if (isGcpStorage()) {
    return clean(process.env.GCS_BUCKET_NAME) || 'itnavideo-media-assets';
  }
  return clean(process.env.REMOTION_LAMBDA_BUCKET_NAME || process.env.AWS_ASSET_BUCKET);
}

export async function getS3Client() {
  const {S3Client} = await import('@aws-sdk/client-s3');
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
  if (isGcpStorage()) {
    const workerUrl = getGcpWorkerUrl();
    const resp = await fetch(`${workerUrl}/api/storage/upload-url`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({fileName, contentType, mode, userId}),
    });
    if (!resp.ok) {
      throw new Error(`Failed to generate cloud upload URL: ${await resp.text()}`);
    }
    const data = await resp.json();
    return {bucket: data.bucket, key: data.key, uploadUrl: data.uploadUrl};
  }

  const {PutObjectCommand} = await import('@aws-sdk/client-s3');
  const {getSignedUrl} = await import('@aws-sdk/s3-request-presigner');
  const bucket = requiredBucket();
  const safeFileName = sanitizeFileName(fileName);
  const key = `${TEMP_MEDIA_UPLOAD_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-${mode}-${safeFileName}`;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const client = await getS3Client();
  const uploadUrl = await getSignedUrl(client, command, {expiresIn: 15 * 60});
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
  if (isGcpStorage()) {
    const {bucket, key, uploadUrl} = await createUploadUrl({
      contentType,
      fileName,
      mode,
      userId,
    });
    const putResp = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {'Content-Type': contentType},
      body: body,
    });
    if (!putResp.ok) {
      throw new Error(`Failed to upload media to cloud bucket: ${putResp.statusText}`);
    }
    return {bucket, key};
  }

  const {PutObjectCommand} = await import('@aws-sdk/client-s3');
  const bucket = requiredBucket();
  const safeFileName = sanitizeFileName(fileName);
  const key = `${TEMP_MEDIA_UPLOAD_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-${sanitizeSegment(purpose)}-${mode}-${safeFileName}`;
  const client = await getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return {bucket, key};
}

export async function createReadUrl(key: string, expiresInSeconds = 48 * 60 * 60) {
  if (isGcpStorage()) {
    const workerUrl = getGcpWorkerUrl();
    const resp = await fetch(`${workerUrl}/api/storage/read-url?key=${encodeURIComponent(key)}`);
    if (!resp.ok) {
      throw new Error(`Failed to generate cloud read URL: ${await resp.text()}`);
    }
    const data = await resp.json();
    return data.readUrl;
  }

  const {GetObjectCommand} = await import('@aws-sdk/client-s3');
  const {getSignedUrl} = await import('@aws-sdk/s3-request-presigner');
  const bucket = requiredBucket();
  const command = new GetObjectCommand({Bucket: bucket, Key: key});
  const client = await getS3Client();
  return getSignedUrl(client, command, {expiresIn: expiresInSeconds});
}

export async function applyTemporaryMediaLifecycle() {
  if (isGcpStorage()) {
    return {bucket: getTemporaryMediaBucket(), expirationDays: TEMP_MEDIA_EXPIRATION_DAYS};
  }

  const {PutBucketLifecycleConfigurationCommand} = await import('@aws-sdk/client-s3');
  const bucket = requiredBucket();
  const client = await getS3Client();
  await client.send(
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
