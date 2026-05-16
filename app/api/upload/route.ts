import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 min limit for larger video uploads

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = String(formData.get('folder') || 'itnavideo/uploads');

    if (!file) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary config missing' }, { status: 500 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    // Signature params exactly wahi hone chahiye jo niche append honge
    const signature = signCloudinaryParams({ folder, timestamp }, apiSecret);

    const uploadForm = new FormData();
    uploadForm.append('file', file); // ArrayBuffer ki zaroorat nahi, direct file object use karein (Faster)
    uploadForm.append('api_key', apiKey);
    uploadForm.append('timestamp', String(timestamp));
    uploadForm.append('folder', folder);
    uploadForm.append('signature', signature);

    // Resource type 'auto' video/audio/image sab handle kar leta hai
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        body: uploadForm,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Cloudinary error');
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      duration: result.duration, // Render logic ke liye duration kaam aayegi
      resourceType: result.resource_type,
    });

  } catch (error: any) {
    console.error('[Upload API Error]:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}

function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(payload + apiSecret).digest('hex');
}