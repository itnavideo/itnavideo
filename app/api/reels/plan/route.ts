import { NextResponse } from 'next/server';
import { createReelPlan, REEL_TEMPLATE_REGISTRY, type ReelPlanRequest, type ReelPlanResult, type ReelTemplateName, type ReelTranscriptSegment } from '@/services/ai/reelPlanner';
import { checkRateLimit, getClientIp } from '@/services/rateLimit/inMemoryRateLimiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT = 8;
const VIDEO_EXPLAINER_MAX_SECONDS = 60;

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit({
    key: `reels-plan:${ip}`,
    limit: getRateLimit(),
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Too many reel planning requests. Please try again shortly.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid JSON body.',
      },
      { status: 400 },
    );
  }

  const input = normalizeBody(body);
  if (!input) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Only Explainer Video is available right now. Send transcript text for the explainer plan.',
      },
      { status: 400 },
    );
  }

  try {
    const plan = await createReelPlan(input);
    return NextResponse.json(
      {
        ok: true,
        maxOutputSeconds: VIDEO_EXPLAINER_MAX_SECONDS,
        durationPolicy: 'The reel plan is capped at 1 minute.',
        plan: sanitizePlanForClient(plan),
      },
      {
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: sanitizeUserFacingStatus(error instanceof Error ? error.message : 'Could not create reel plan.'),
      },
      { status: 500 },
    );
  }
}

function normalizeBody(body: unknown): ReelPlanRequest | null {
  if (!isRecord(body)) return null;

  const template = normalizeTemplate(body.template);
  if (body.template && template !== 'VIDEO_EXPLAINER' && template !== 'comparisonImages') {
    return null;
  }
  const transcript = typeof body.transcript === 'string' ? body.transcript.trim() : '';
  const prompt = readOptionalString(body.prompt) || readOptionalString(body.topic) || readOptionalString(body.topicTitle);
  const transcriptRequirement = REEL_TEMPLATE_REGISTRY[template].transcriptRequirement;
  if (!transcript && transcriptRequirement === 'required') return null;
  if (!transcript && template === 'IMAGE_STORY' && !prompt) return null;

  return {
    transcript: transcript || prompt || '',
    words: normalizeWords(body.words),
    timestampSegments: normalizeTimestampSegments(body.timestampSegments || body.segments),
    durationSeconds: readOptionalNumber(body.durationSeconds),
    topic: readOptionalString(body.topic) || prompt,
    topicTitle: readOptionalString(body.topicTitle),
    emotion: readOptionalString(body.emotion),
    mediaType: readMediaType(body.mediaType, template),
    languageHint: readLanguageHint(body.language || body.displayLanguage || body.typographyLanguage),
    template,
    design: readOptionalString(body.design),
    visualMode: readOptionalString(body.visualMode) || REEL_TEMPLATE_REGISTRY[template].plannerMode,
    selectedAssets: normalizeSelectedAssets(body.selectedAssets),
    constraints: normalizeStringArray(body.constraints),
    dryRun: body.dryRun === true || !process.env.OPENAI_API_KEY,
  };
}

function normalizeWords(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const words = value
    .map((item) => {
      if (!isRecord(item)) return null;
      const word = readOptionalString(item.word);
      const start = readTimestampNumber(item.start);
      const end = readTimestampNumber(item.end);
      if (!word || start === undefined || end === undefined) return null;
      return { word, start, end };
    })
    .filter((item): item is { word: string; start: number; end: number } => Boolean(item));

  return words.length ? words : undefined;
}

function normalizeTimestampSegments(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const segments = value
    .map((item) => {
      if (!isRecord(item)) return null;
      const text = readOptionalString(item.text);
      const start = readTimestampNumber(item.start);
      const end = readTimestampNumber(item.end);
      const id = typeof item.id === 'string' || typeof item.id === 'number' ? item.id : undefined;
      if (!text || start === undefined || end === undefined) return null;
      const segment: ReelTranscriptSegment = { start, end, text };
      if (id !== undefined) segment.id = id;
      return segment;
    })
    .filter((item): item is ReelTranscriptSegment => item !== null);

  return segments.length ? segments : undefined;
}

function normalizeSelectedAssets(value: unknown) {
  if (!isRecord(value)) return undefined;
  const assets: Record<string, string[]> = {};
  for (const [key, list] of Object.entries(value)) {
    const normalizedList = normalizeStringArray(list);
    if (normalizedList?.length) assets[key] = normalizedList;
  }
  return Object.keys(assets).length ? assets : undefined;
}

function readLanguageHint(value: unknown): ReelPlanRequest['languageHint'] {
  const normalized = (readOptionalString(value) || '').toLowerCase();
  if (!normalized || normalized.includes('auto')) return undefined;
  if (normalized.includes('hindi') || normalized.includes('urdu') || normalized.includes('hinglish')) return 'hinglish';
  if (normalized.includes('english')) return 'english';
  return undefined;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const items = value.map((item) => String(item).trim()).filter(Boolean).slice(0, 80);
  return items.length ? items : undefined;
}

function readMediaType(value: unknown, template: unknown): ReelPlanRequest['mediaType'] {
  const normalizedTemplate = (readOptionalString(template) || '').toLowerCase();
  if (normalizedTemplate.includes('handwriting') || normalizedTemplate.includes('notes')) return 'audio';
  if (normalizedTemplate.includes('image') || normalizedTemplate.includes('photo') || normalizedTemplate.includes('story')) return 'image';
  if (normalizedTemplate.includes('comparisonImages')) return 'audio';
  const normalized = (readOptionalString(value) || '').toLowerCase();
  if (normalized.includes('image')) return 'image';
  if (normalized.includes('audio')) return 'audio';
  return 'video';
}

function normalizeTemplate(value: unknown): ReelTemplateName {
  const normalized = (readOptionalString(value) || '').toLowerCase();
  if (normalized.includes('comparisonImages') || normalized.includes('comparison') || /\bvs\b/.test(normalized)) return 'comparisonImages';
  if (normalized.includes('handwriting') || normalized.includes('notes')) return 'HANDWRITTEN_NOTES';
  if (normalized.includes('caption') || normalized.includes('subtitle')) return 'VIDEO_CAPTION';
  if (normalized.includes('image') || normalized.includes('photo') || normalized.includes('story')) return 'IMAGE_STORY';
  return 'VIDEO_EXPLAINER';
}

function readOptionalString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readOptionalNumber(value: unknown) {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined;
}

function readTimestampNumber(value: unknown) {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : undefined;
}

function getRateLimit() {
  const value = Number(process.env.REEL_PLAN_RATE_LIMIT);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_RATE_LIMIT;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function sanitizePlanForClient(plan: ReelPlanResult) {
  const clientPlan = JSON.parse(JSON.stringify(plan)) as Record<string, unknown>;
  const validation = isRecord(clientPlan.validation) ? {...clientPlan.validation} : undefined;
  const rawProvider = String(clientPlan.provider || '');

  clientPlan.provider = rawProvider === 'local' ? 'local' : 'managed';
  clientPlan.model = rawProvider === 'local' ? 'local-fallback' : 'managed-planner';
  clientPlan.template = plan.template;
  clientPlan.templateName = plan.templateName;

  const renderProps = isRecord(clientPlan.renderProps) ? {...clientPlan.renderProps} : undefined;
  if (renderProps) {
    renderProps.template = plan.template;
    renderProps.templateName = plan.templateName;
    clientPlan.renderProps = renderProps;
  }

  if (validation) {
    validation.warnings = Array.isArray(validation.warnings)
      ? validation.warnings.map((warning) => sanitizeUserFacingStatus(String(warning || '')))
      : [];
    validation.notes = Array.isArray(validation.notes)
      ? validation.notes.map((note) => sanitizeUserFacingStatus(String(note || '')))
      : [];
    validation.pipeline = Array.isArray(validation.pipeline)
      ? validation.pipeline.map((step) => {
          if (!isRecord(step)) return step;
          return {
            ...step,
            detail: sanitizeUserFacingStatus(String(step.detail || '')),
          };
        })
      : [];
    validation.qualityChecks = Array.isArray(validation.qualityChecks)
      ? validation.qualityChecks.map((check) => sanitizeUserFacingStatus(String(check || '')))
      : [];
    validation.qualityFindings = Array.isArray(validation.qualityFindings)
      ? validation.qualityFindings.map((finding) => {
          if (!isRecord(finding)) return finding;
          return {
            ...finding,
            message: sanitizeUserFacingStatus(String(finding.message || '')),
            suggestion: sanitizeUserFacingStatus(String(finding.suggestion || '')),
          };
        })
      : [];
    if (typeof validation.renderBlockReason === 'string') {
      validation.renderBlockReason = sanitizeUserFacingStatus(validation.renderBlockReason);
    }
    validation.plannerCallsUsed = Number(validation.openAiCallsUsed || 0);
    delete validation.openAiCallsUsed;
    clientPlan.validation = validation;
  }

  return clientPlan;
}

function sanitizeUserFacingStatus(value: string) {
  const source = String(value || '');
  const normalized = source.toLowerCase();
  if (/rate exceeded|too many requests|toomanyrequests|concurr|limit exceeded|throttl/.test(normalized)) {
    return 'Planning capacity is busy right now. Please wait a minute and try again.';
  }
  if (/timed out|timeout/.test(normalized)) {
    return 'Planning took too long. Please try again with a shorter script.';
  }

  return source
    .replace(/\s+at\s+[\s\S]*$/i, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\b(?:HANDWRITING_NOTES_REEL|HANDWRITTEN_NOTES|NOTES)\b/g, 'Handwritten Notes')
    .replace(/\bVIDEO[-_]EXPLAINER\b/gi, 'Video Explainer')
    .replace(/\b(?:REMOTION|GROQ|OPENAI|AWS|S3|FFMPEG)[A-Z0-9_]*\b/g, 'render system')
    .replace(/\bGroq\b/gi, 'transcription service')
    .replace(/\bAWS Lambda\b/gi, 'render system')
    .replace(/\bAWS\b/gi, 'render')
    .replace(/\bLambda\b/gi, 'render system')
    .replace(/\bRemotion\b/gi, 'video renderer')
    .replace(/\bS3\b/gi, 'secure storage')
    .replace(/\bffmpeg\b/gi, 'media processor')
    .replace(/\bOpenAI\b/gi, 'AI planner')
    .trim() || 'Could not create reel plan.';
}

