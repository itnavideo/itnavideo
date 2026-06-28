import {NextResponse} from 'next/server';
import {getRenderProgress, type AwsRegion} from '@remotion/lambda/client';
import {recordRenderUsageFromServer} from '@/services/billing/renderAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const renderId = url.searchParams.get('renderId') || '';
  const bucketName = url.searchParams.get('bucketName') || process.env.REMOTION_LAMBDA_BUCKET_NAME || '';
  const userId = clean(url.searchParams.get('userId') || '');
  const mode = clean(url.searchParams.get('mode') || '');
  const title = clean(url.searchParams.get('title') || '');
  const functionName = clean(process.env.REMOTION_LAMBDA_FUNCTION_NAME);
  const region = readAwsRegion(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION);

  if (!renderId || !bucketName) {
    return NextResponse.json({ok: false, error: 'renderId and bucketName are required.'}, {status: 400});
  }
  if (!functionName) {
    return NextResponse.json({ok: false, error: 'The render system is not configured yet.'}, {status: 503});
  }

  try {
    const progress = await getRenderProgress({
      region,
      functionName,
      bucketName,
      renderId,
      logLevel: 'info',
    });
    let usageWarning = '';
    if (progress.done && userId) {
      try {
        await recordRenderUsageFromServer({
          userId,
          renderId,
          createdAt: new Date(),
          mode,
          title,
        });
      } catch (error) {
        usageWarning = error instanceof Error ? error.message : 'Could not record usage.';
        console.error('Render usage write failed:', error);
      }
    }

    return NextResponse.json({
      ok: true,
      state: (progress.errors || []).length ? 'error' : progress.done ? 'done' : 'rendering',
      renderId,
      bucketName,
      done: progress.done,
      progress: progress.overallProgress || 0,
      outputFile: progress.outputFile,
      outputSizeInBytes: progress.outputSizeInBytes,
      errors: (progress.errors || []).map((error) => ({
        message: sanitizeUserFacingStatus(error.message || ''),
      })),
      usageWarning: usageWarning || undefined,
      renderWorkersInvoked: progress.lambdasInvoked || 0,
      costs: progress.costs || null,
    });
  } catch (error) {
    const message = sanitizeUserFacingStatus(error instanceof Error ? error.message : 'Could not read render progress.');
    if (isTemporaryRenderCapacityMessage(message)) {
      return NextResponse.json({
        ok: true,
        state: 'rendering',
        renderId,
        bucketName,
        done: false,
        progress: 0,
        outputFile: null,
        errors: [],
        message: 'Render is still processing. Checking again shortly.',
        transient: true,
      });
    }

    console.error('Render progress read failed:', error);
    return NextResponse.json({
      ok: true,
      state: 'rendering',
      renderId,
      bucketName,
      done: false,
      progress: 0,
      outputFile: null,
      errors: [],
      message: 'Render is still processing. Checking again shortly.',
      transient: true,
      debug:
        process.env.NODE_ENV === 'production'
          ? undefined
          : {
              errorMessage: error instanceof Error ? error.message : String(error),
              region,
              functionName,
              hasRenderId: Boolean(renderId),
              hasBucketName: Boolean(bucketName),
            },
    });
  }
}

function clean(value?: string) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}

function readAwsRegion(value?: string): AwsRegion {
  return (clean(value) || 'ap-south-1') as AwsRegion;
}

function sanitizeUserFacingStatus(value: string) {
  const source = String(value || '');
  const normalized = source.toLowerCase();
  if (/rate exceeded|too many requests|toomanyrequests|concurr|limit exceeded|throttl/.test(normalized)) {
    return 'Render traffic is high right now. Your upload stays selected, so please retry in a minute.';
  }
  if (/timed out|timeout|chunks are missing|missing chunks|main function/i.test(source)) {
    return 'Render took too long with the current workload. Please try again; the render has been split into smaller parts now.';
  }

  return source
    .replace(/\s+at\s+[\s\S]*$/i, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\b(?:REMOTION|GROQ|OPENAI|AWS|S3|FFMPEG)[A-Z0-9_]*\b/g, 'render system')
    .replace(/\bGroq\b/gi, 'transcription service')
    .replace(/\bAWS Lambda\b/gi, 'render system')
    .replace(/\bAWS\b/gi, 'render')
    .replace(/\bLambda\b/gi, 'render system')
    .replace(/\bRemotion\b/gi, 'video renderer')
    .replace(/\bS3\b/gi, 'secure storage')
    .replace(/\bffmpeg\b/gi, 'media processor')
    .replace(/\bOpenAI\b/gi, 'AI planner')
    .trim() || 'Something went wrong. Please try again.';
}

function isTemporaryRenderCapacityMessage(value: string) {
  return value === 'Render traffic is high right now. Your upload stays selected, so please retry in a minute.';
}

