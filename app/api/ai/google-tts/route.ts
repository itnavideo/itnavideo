import { NextRequest } from 'next/server';
import { GET as handleGet, POST as handlePost } from '@/app/api/ai/tts/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return handleGet();
}

export async function POST(req: NextRequest) {
  return handlePost(req);
}
