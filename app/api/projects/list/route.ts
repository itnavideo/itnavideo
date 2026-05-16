import { NextRequest, NextResponse } from 'next/server';
import { listUserProjectsFromServer } from '@/services/supabase/projectStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')?.trim();
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const projects = await listUserProjectsFromServer(userId);
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('Project list failed:', error);
    return NextResponse.json(
      { error: 'Project list failed', details: error.message || 'Unknown error' },
      { status: 500 },
    );
  }
}
