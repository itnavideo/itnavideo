import { NextRequest, NextResponse } from 'next/server';
import {
  type FfmpegJobRecord,
  type UserProjectRecord,
  listFfmpegJobsForUserFromServer,
  listUserProjectsFromServer,
} from '@/services/supabase/projectStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')?.trim();
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const [projects, renderJobs] = await Promise.all([
      listUserProjectsFromServer(userId),
      listFfmpegJobsForUserFromServer(userId).catch((error) => {
        console.warn('Project list live render status merge skipped:', error);
        return [];
      }),
    ]);

    return NextResponse.json({ projects: mergeProjectsWithRenderJobs(projects, renderJobs) });
  } catch (error: any) {
    console.error('Project list failed:', error);
    return NextResponse.json(
      { error: 'Project list failed', details: error.message || 'Unknown error' },
      { status: 500 },
    );
  }
}

function mergeProjectsWithRenderJobs(
  projects: UserProjectRecord[],
  renderJobs: FfmpegJobRecord[],
): UserProjectRecord[] {
  if (!renderJobs.length) return projects;

  const jobByProjectId = new Map(renderJobs.map((job) => [job.jobId, job]));

  return projects.map((project) => {
    const renderJob = jobByProjectId.get(project.id);
    if (!renderJob) return project;

    const progress = Math.max(Number(project.progress) || 0, Number(renderJob.progress) || 0);
    const base: UserProjectRecord = {
      ...project,
      progress,
      updatedAt: renderJob.updatedAt || project.updatedAt,
    };

    switch (renderJob.status) {
      case 'ready':
        return {
          ...base,
          status: 'Video ready',
          progress: 100,
          videoUrl: renderJob.videoUrl || project.videoUrl,
          renderUrl: renderJob.videoUrl || project.renderUrl,
          error: undefined,
        };
      case 'error':
        return {
          ...base,
          status: 'Needs retry',
          error: renderJob.error || renderJob.message || project.error,
        };
      case 'uploading':
        return { ...base, status: 'Saving final video' };
      case 'rendering':
        return { ...base, status: 'Rendering MP4' };
      case 'processing':
        return { ...base, status: 'Processing video' };
      case 'queued':
        return { ...base, status: 'Queued for video generation' };
      default:
        return base;
    }
  });
}
