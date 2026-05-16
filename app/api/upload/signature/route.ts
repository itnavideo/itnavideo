import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // 1. JSON Parse Safety
    const body = await request.json().catch(() => ({}));
    const folder = String(body.folder || 'itnavideo/uploads');
    
    // 2. Env Check (Early Exit)
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("[Signature] Missing Cloudinary ENV variables");
      return NextResponse.json({ error: 'Cloudinary server-side config missing' }, { status: 500 });
    }

    // 3. Cloudinary logic: Timestamp aur Signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Cloudinary ko signature ke liye exact params chahiye hote hain jo upload ke waqt use honge
    const paramsToSign = {
      folder,
      timestamp,
      // upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, // Agar preset signed hai toh ise on karein
    };

    const signature = signCloudinaryParams(paramsToSign, apiSecret);

    return NextResponse.json({
      success: true,
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
    });

  } catch (error: any) {
    console.error("[Signature Error]:", error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature', details: error.message },
      { status: 500 },
    );
  }
}

/**
 * Cloudinary Signature Generator
 * Important: Params must be sorted alphabetically
 */
function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  return crypto
    .createHash('sha1')
    .update(payload + apiSecret)
    .digest('hex');
}