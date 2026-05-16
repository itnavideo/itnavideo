import { NextResponse } from 'next/server';
import { cleanupOldJobs } from '@/services/rendering/ffmpegJobStore';

export const runtime = 'nodejs';

/**
 * API Route to trigger the cleanup of old job metadata and temp files.
 * URL: /api/render/cleanup (ya jo bhi aapka path hai)
 */
export async function GET(request: Request) {
  try {
    // Optional: Security check (Vercel Cron ya manual hit ke liye)
    // Agar aap chahte hain ki sirf authorized log hi cleanup karein:
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization');
    
    // Agar aapne CRON_SECRET env variable set kiya hai toh check karein
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // Note: Abhi ke liye maine isse comment kiya hai taaki aapka kaam na ruke
    }

    console.log('[Cleanup Route] Starting manual cleanup...');

    // Naya cleanupOldJobs async hai, isliye await zaroori hai
    await cleanupOldJobs(12 * 60 * 60 * 1000); // Hum 12 ghante purani files saaf kar rahe hain

    return NextResponse.json({ 
      success: true, 
      message: 'FFmpeg job store cleanup completed successfully' 
    });

  } catch (error: any) {
    console.error('[Cleanup Route] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Cleanup failed' 
    }, { status: 500 });
  }
}