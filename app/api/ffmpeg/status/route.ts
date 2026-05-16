import { NextRequest, NextResponse } from 'next/server';
import { getFfmpegJob } from '@/services/rendering/ffmpegJobStore';

export const runtime = 'nodejs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');

    if (!userId || !jobId) {
      return NextResponse.json({ error: 'userId and jobId are required' }, { status: 400, headers: corsHeaders });
    }

    // CRITICAL FIX: Add 'await' because getFfmpegJob is now an async function
    const job = await getFfmpegJob(userId, jobId);

    if (!job) {
      // Agar job nahi milti, toh 404 bhejna sahi hai taaki frontend polling handle kar sake
      return NextResponse.json({ 
        status: 'not_found', 
        message: 'Job status not available yet' 
      }, { status: 404, headers: corsHeaders });
    }

    // Success response with job data
    return NextResponse.json(job, { headers: corsHeaders });

  } catch (error: any) {
    console.error('FFmpeg status check error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch status',
      details: error.message 
    }, { status: 500, headers: corsHeaders });
  }
}