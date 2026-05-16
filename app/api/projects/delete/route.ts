import { NextRequest, NextResponse } from 'next/server';
import { deleteUserProjectFromServer } from '@/services/supabase/projectStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = sanitizeString(body.userId);
    const projectId = sanitizeString(body.projectId || body.jobId);

    if (!userId || !projectId) {
      return NextResponse.json({ error: 'userId and projectId are required' }, { status: 400 });
    }

    await deleteUserProjectFromServer(userId, projectId);

    return NextResponse.json({
      success: true,
      deleted: true,
      projectId,
    });
  } catch (error: any) {
    console.error('Project delete failed:', error);
    return NextResponse.json(
      { error: 'Project delete failed', details: error.message || 'Unknown error' },
      { status: 500 },
    );
  }
}

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
