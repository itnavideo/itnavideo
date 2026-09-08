import {NextResponse} from 'next/server';
import {
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const clean = (value?: string) => (value || '').trim();

export async function GET() {
  const region = clean(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION) || 'ap-south-1';
  const bucket = clean(process.env.REMOTION_LAMBDA_BUCKET_NAME || process.env.AWS_ASSET_BUCKET);
  const accessKeyId = clean(process.env.AWS_ACCESS_KEY_ID);
  const secretAccessKey = clean(process.env.AWS_SECRET_ACCESS_KEY);
  const key = `debug/production-s3-test-${Date.now()}.txt`;

  const client = new S3Client({
    region,
    credentials: accessKeyId && secretAccessKey
      ? {accessKeyId, secretAccessKey}
      : undefined,
  });

  try {
    await client.send(new HeadBucketCommand({Bucket: bucket}));

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: 'itnavideo production s3 signed url test',
      ContentType: 'text/plain',
    }));

    await client.send(new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    }));

    const signedReadUrl = await getSignedUrl(
      client,
      new GetObjectCommand({Bucket: bucket, Key: key}),
      {expiresIn: 60 * 10},
    );

    const fetchResult = await fetch(signedReadUrl);
    const fetchText = await fetchResult.text();

    return NextResponse.json({
      ok: fetchResult.ok,
      region,
      bucket,
      key,
      hasAccessKey: Boolean(accessKeyId),
      hasSecretKey: Boolean(secretAccessKey),
      accessKeyPrefix: accessKeyId ? accessKeyId.slice(0, 4) + '...' + accessKeyId.slice(-4) : '',
      signedFetchStatus: fetchResult.status,
      signedFetchOk: fetchResult.ok,
      signedFetchPreview: fetchText.slice(0, 180),
      message: fetchResult.ok
        ? 'S3 PutObject + HeadObject + signed GET fetch OK from production runtime'
        : 'Signed GET fetch failed from production runtime',
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      region,
      bucket,
      key,
      hasAccessKey: Boolean(accessKeyId),
      hasSecretKey: Boolean(secretAccessKey),
      accessKeyPrefix: accessKeyId ? accessKeyId.slice(0, 4) + '...' + accessKeyId.slice(-4) : '',
      error: error instanceof Error ? error.message : String(error),
    }, {status: 500});
  }
}
