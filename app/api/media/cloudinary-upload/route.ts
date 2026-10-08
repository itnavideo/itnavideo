import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getClientIp, checkRateLimit } from '@/services/rateLimit/inMemoryRateLimiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dhouh9idx',
  api_key: process.env.CLOUDINARY_API_KEY || '972395946869552',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'wSwqFlvlj0DhvMA5yEXyjlt8uMo',
});

const MAX_IMAGE_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit({
    key: `cloudinary-upload:${ip}`,
    limit: 60,
    windowMs: 15 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many upload attempts. Please try again shortly.' },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'user-uploads/compare';

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No image file provided.' }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { ok: false, error: 'Image file is too large. Maximum allowed is 25MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      format: string;
      width: number;
      height: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Cloudinary upload returned empty result'));
          } else {
            resolve(result as any);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      ok: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error) {
    console.error('[CLOUDINARY_UPLOAD_ERROR]', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to upload image to Cloudinary.',
      },
      { status: 500 }
    );
  }
}
