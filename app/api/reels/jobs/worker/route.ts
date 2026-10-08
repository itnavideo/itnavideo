import { NextResponse } from 'next/server';
import { updateJobStage } from '@/lib/queue/jobStore';
import { transcribeMediaWithGeminiFallback } from '@/services/ai/geminiTranscription';
import { renderMediaOnLambda } from '@remotion/lambda/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let jobId = '';
  try {
    const body = await request.json();
    jobId = body.jobId;
    const payload = body.payload || {};

    if (!jobId) {
      return NextResponse.json({ ok: false, error: 'jobId is required' }, { status: 400 });
    }

    // Stage 1: Audio Extraction
    await updateJobStage(jobId, {
      stage: 'extracting_audio',
      stageMessage: 'Extracting clean 16kHz audio...',
      progressPercent: 15,
    });

    // Stage 2: Speech Transcription (Groq Whisper with Gemini Fallback)
    await updateJobStage(jobId, {
      stage: 'transcribing',
      stageMessage: 'Transcribing speech with Groq Whisper...',
      progressPercent: 35,
    });
    
    let transcriptData: any = null;
    if (payload.mediaUrl) {
      transcriptData = await transcribeMediaWithGeminiFallback(payload.mediaUrl);
    }

    // Stage 3: AI Scene Planning & S3 B-Roll Matcher
    await updateJobStage(jobId, {
      stage: 'directing_scenes',
      stageMessage: 'AI Director matching scenes with S3 B-roll...',
      progressPercent: 50,
    });

    // Stage 4: Dispatch to AWS Remotion Lambda
    await updateJobStage(jobId, {
      stage: 'dispatching_lambda',
      stageMessage: 'Spinning up AWS Lambda Chromium workers...',
      progressPercent: 60,
    });

    const region = (process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || 'ap-south-1') as any;
    const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME || '';
    const serveUrl = process.env.REMOTION_SERVE_URL || '';

    if (!functionName) {
      throw new Error('REMOTION_LAMBDA_FUNCTION_NAME is not configured.');
    }

    const lambdaResult = await renderMediaOnLambda({
      region,
      functionName,
      serveUrl,
      codec: 'h264',
      composition: payload.templateName || 'AUTO_CAPTION_GENERATOR',
      inputProps: {
        ...(payload.inputProps || {}),
        transcript: transcriptData,
      },
      framesPerLambda: payload.framesPerLambda || 300,
    });

    // Stage 5: Hand off rendering to Lambda
    await updateJobStage(jobId, {
      stage: 'rendering',
      stageMessage: 'Rendering 1080p Full HD MP4 on AWS Lambda...',
      progressPercent: 65,
      renderId: lambdaResult.renderId,
      bucketName: lambdaResult.bucketName,
    });

    return NextResponse.json({
      ok: true,
      jobId,
      renderId: lambdaResult.renderId,
      bucketName: lambdaResult.bucketName,
    });
  } catch (err: any) {
    console.error(`[JOB_WORKER_ERROR] Job ${jobId} failed:`, err);
    if (jobId) {
      await updateJobStage(jobId, {
        stage: 'failed',
        stageMessage: 'Job failed during background processing.',
        error: err.message || 'Unknown processing error',
      });
    }
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
