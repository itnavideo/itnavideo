import {NextResponse} from 'next/server';
import {getRenderProgress, type AwsRegion} from '@remotion/lambda/client';
import {recordRenderUsageFromServer, releaseReservedRenderUsageFromServer} from '@/services/billing/renderAccess';
import {createReadUrl} from '@/lib/aws/mediaStorage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const renderId = url.searchParams.get('renderId') || '';
  const bucketName = url.searchParams.get('bucketName') || process.env.REMOTION_LAMBDA_BUCKET_NAME || '';
  const userId = clean(url.searchParams.get('userId') || '');
  const mode = clean(url.searchParams.get('mode') || '');
  const title = clean(url.searchParams.get('title') || '');
  const attempt = Math.max(0, parseInt(url.searchParams.get('attempt') || '0', 10));
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
      skipLambdaInvocation: true,
    });
    const renderErrors = progress.errors || [];
    const hasOutput = Boolean(progress.outputFile);
    const missingOutput = Boolean(progress.done && !hasOutput && renderErrors.length === 0);
    const hasFatalError = Boolean(
      (progress as any).fatalErrorTimestamp != null ||
      (progress.done && (renderErrors.length > 0 || missingOutput)) ||
      renderErrors.some((e: any) => e.isFatal && e.willRetry === false)
    );
    const isTerminalFailure = Boolean(userId && hasFatalError);

    const diagnostics = [
      `Mode: ${mode || 'unknown'}`,
      `Progress: ${Math.round((progress.overallProgress || 0) * 100)}%`,
      `Done: ${Boolean(progress.done)}`,
      `Output: ${hasOutput ? 'yes' : 'no'}`,
      `Workers invoked: ${progress.lambdasInvoked || 0}`,
      `Fatal error: ${hasFatalError ? 'yes' : 'no'}`,
      progress.costs ? `Costs: ${JSON.stringify(progress.costs).slice(0, 160)}` : '',
      renderErrors[0]?.message ? `Worker log: ${renderErrors[0].message.slice(0, 220)}` : '',
      missingOutput ? 'Raw error: render completed without an output file' : '',
    ].filter(Boolean);
    let usageWarning = '';
    if (progress.done && userId && !hasFatalError && hasOutput) {
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
    } else if (isTerminalFailure) {
      try {
        await releaseReservedRenderUsageFromServer({userId, renderId});
      } catch (error) {
        usageWarning = error instanceof Error ? error.message : 'Could not release reserved usage.';
        console.error('Render usage release failed:', error);
      }
    }
    const currentRenderState = hasFatalError ? 'error' : progress.done && hasOutput ? 'done' : 'rendering';
    if (mode === 'longVideoPromo' || hasFatalError) {
      console.log('[RENDER_STATUS_CHECK]', {
        renderId,
        state: currentRenderState,
        progress: progress.overallProgress || 0,
        done: progress.done,
        output: hasOutput,
        workers: progress.lambdasInvoked || 0,
        fatal: hasFatalError,
        firstError: renderErrors[0]?.message || (missingOutput ? 'MISSING_OUTPUT_FILE' : ''),
      });
    }

    let outputFile = progress.outputFile;
    if (progress.done && progress.outKey) {
      try {
        outputFile = await createReadUrl(progress.outKey, 48 * 60 * 60);
      } catch (signErr) {
        console.warn('Could not presign outKey, falling back to progress.outputFile:', signErr);
      }
    }

    return NextResponse.json({
      ok: true,
      state: currentRenderState,
      renderId,
      bucketName,
      done: progress.done,
      progress: progress.overallProgress || 0,
      outputFile,
      outputSizeInBytes: progress.outputSizeInBytes,
      isRetrying: !hasFatalError && renderErrors.length > 0,
      errors: hasFatalError ? [
        ...renderErrors.map((error) => ({
          message: sanitizeUserFacingStatus(error.message || ''),
          reason: error.message || '',
        })),
        ...(missingOutput ? [{
          message: 'Render finished but the MP4 was not created. Please retry.',
          reason: 'MISSING_OUTPUT_FILE',
        }] : []),
      ] : [],
      diagnostics,
      usageWarning: usageWarning || undefined,
      renderWorkersInvoked: progress.lambdasInvoked || 0,
      costs: progress.costs || null,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    const rawErrorMessage = error instanceof Error ? error.message : String(error || '');
    const message = sanitizeUserFacingStatus(rawErrorMessage);
    const isTransient = isTemporaryRenderCapacityMessage(message) || isTransientProgressError(rawErrorMessage, attempt);

    if (!isTransient) {
      console.error('Fatal render progress read error:', error);
      return NextResponse.json({
        ok: false,
        state: 'error',
        renderId,
        bucketName,
        error: message,
        errors: [{ message }],
        debug:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                errorMessage: rawErrorMessage,
                region,
                functionName,
                hasRenderId: Boolean(renderId),
                hasBucketName: Boolean(bucketName),
              },
      }, { status: 500 });
    }

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
              errorMessage: rawErrorMessage,
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
  if (/nosuchkey|specified key does not exist/i.test(normalized)) {
    return 'Render job did not initialize in time or was cancelled. Your uploaded media is safe, please retry.';
  }
  if (/rate exceeded|too many requests|toomanyrequests|concurrent.*limit|concurrency.*limit|limit exceeded|throttl/i.test(normalized)) {
    return 'Render engine is warming up or processing previous tasks. Your upload stays selected, please retry in a moment.';
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
  const norm = String(value || '').toLowerCase();
  return (
    norm.includes('warming up') ||
    norm.includes('traffic is high') ||
    norm.includes('throttl') ||
    norm.includes('rate exceeded') ||
    norm.includes('too many requests')
  );
}

function isTransientProgressError(rawError: unknown, attempt: number = 0): boolean {
  const msg = (rawError instanceof Error ? rawError.message : String(rawError || '')).toLowerCase();
  // S3 NoSuchKey is expected during the first 10-25 seconds (attempts 0-10) before Remotion Lambda writes progress.json
  // After ~12 attempts (> 30s), a missing progress.json indicates the Lambda coordinator failed to start
  if (msg.includes('nosuchkey') || msg.includes('specified key does not exist')) {
    return attempt < 12;
  }
  if (msg.includes('network') || msg.includes('econnreset') || msg.includes('etimedout') || msg.includes('socket hang up')) return true;
  return false;
}

