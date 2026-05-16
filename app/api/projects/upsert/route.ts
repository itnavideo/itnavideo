import { NextRequest, NextResponse } from 'next/server';
import { upsertUserProjectFromServer } from '@/services/supabase/projectStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = sanitizeString(body.userId);
    const project = isPlainObject(body.project) ? body.project : body.patch;
    const projectId = sanitizeString(body.projectId || body.jobId || project?.id);

    if (!userId || !projectId || !isPlainObject(project)) {
      return NextResponse.json({ error: 'userId, projectId, and project are required' }, { status: 400 });
    }

    const saved = await upsertUserProjectFromServer(userId, projectId, project as Record<string, unknown>);
    return NextResponse.json({ success: true, project: saved });
  } catch (error: any) {
    console.error('Project upsert failed:', error);
    return NextResponse.json(
      { error: 'Project upsert failed', details: error.message || 'Unknown error' },
      { status: 500 },
    );
  }
}

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
