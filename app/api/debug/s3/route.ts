import {NextResponse} from 'next/server';
import {HeadBucketCommand, S3Client} from '@aws-sdk/client-s3';

const clean = (value?: string) => (value || '').trim();

export async function GET() {
  const region = clean(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION) || 'ap-south-1';
  const bucket = clean(process.env.REMOTION_LAMBDA_BUCKET_NAME || process.env.AWS_ASSET_BUCKET);
  const accessKeyId = clean(process.env.AWS_ACCESS_KEY_ID);
  const secretAccessKey = clean(process.env.AWS_SECRET_ACCESS_KEY);

  const client = new S3Client({
    region,
    credentials: accessKeyId && secretAccessKey
      ? {accessKeyId, secretAccessKey}
      : undefined,
  });

  try {
    await client.send(new HeadBucketCommand({Bucket: bucket}));

    return NextResponse.json({
      ok: true,
      region,
      bucket,
      hasAccessKey: Boolean(accessKeyId),
      hasSecretKey: Boolean(secretAccessKey),
      accessKeyPrefix: accessKeyId ? accessKeyId.slice(0, 4) + '...' + accessKeyId.slice(-4) : '',
      message: 'S3 bucket access OK from production runtime',
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      region,
      bucket,
      hasAccessKey: Boolean(accessKeyId),
      hasSecretKey: Boolean(secretAccessKey),
      accessKeyPrefix: accessKeyId ? accessKeyId.slice(0, 4) + '...' + accessKeyId.slice(-4) : '',
      error: error instanceof Error ? error.message : String(error),
    }, {status: 500});
  }
}
