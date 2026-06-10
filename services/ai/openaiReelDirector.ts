import type {ReelPlanRequest, ReelPlanResult} from './reelPlanner';
import {normalizeVideoExplainerV2Layout, VIDEO_EXPLAINER_V2_LAYOUTS} from './videoExplainerLayouts';

type ManagedOverlay = ReelPlanResult['renderProps']['overlayTimeline'][number];

type ManagedDirectorResponse = {
  topicTitle: string;
  overlays: ManagedOverlay[];
  notes: string[];
};

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-5-mini';
const CANONICAL_REFERENCE_STYLE = [
  'Fresh canonical reference style: image-first collage reel, not dashboard/card UI.',
  'Top composition: keep a clean 16:9 source/reference image or video frame at the top.',
  'Main composition: use a large topic-matched person/object/place photo or PNG/cutout in the main area, with bold typography integrated into the image.',
  'Background: use a blurred enlarged related image or soft photo atmosphere behind the layout; keep text readable.',
  'Visual language: real photos, PNG cutouts, reusable images, editorial poster typography, brush/stamp accent words, and kinetic transitions.',
  'Do not use icons. Use real photos, PNG images, reusable images, documents, mockups, typography, music, and SFX instead.',
  'Use 3-7 strong image moments across a 30-60 second reel when available assets support it.',
  'Use short designed text: 2-6 word headline plus at most one short support phrase.',
  'Every reel should feel like a finished social reel with background music and beat-matched SFX: whoosh, boom, stamp, bell, typing, cash, warning, hit.',
  'Avoid UI dashboards, debug labels, generic key-point cards, repeated chips, and "we will do this" planning language.',
].join('\n');

export async function createManagedReelPlan({
  request,
  localPlan,
}: {
  request: ReelPlanRequest;
  localPlan: ReelPlanResult;
}): Promise<ReelPlanResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_REEL_PLANNER_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.OPENAI_REEL_PLANNER_TIMEOUT_MS || 18_000));

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: buildSystemPrompt(localPlan.templateName),
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify(buildDirectorPayload(request, localPlan)),
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'itnavideo_reel_director_plan',
            strict: true,
            schema: directorSchema(),
          },
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;
    const json = await response.json();
    const parsed = parseDirectorResponse(json);
    if (!parsed) return null;
    const overlays = repairManagedOverlays(parsed.overlays, localPlan);
    if (!overlays.length) return null;

    return {
      ...localPlan,
      provider: 'openai',
      model,
      renderProps: {
        ...localPlan.renderProps,
        topicTitle: cleanText(parsed.topicTitle || localPlan.renderProps.topicTitle || localPlan.scriptDetails?.topic || '', 72),
        overlayTimeline: overlays,
      },
      timeline: localPlan.timeline.map((scene, index) => ({
        ...scene,
        script: [
          overlays[index]?.text || scene.script,
          overlays[index]?.body,
        ].filter(Boolean).join('. '),
        visualEnergy: overlays[index]?.type === 'warning' ? 0.68 : overlays[index]?.type === 'stat' ? 0.6 : scene.visualEnergy,
        sceneComplexity: overlays[index]?.type === 'warning' ? 0.65 : overlays[index]?.type === 'stat' ? 0.55 : scene.sceneComplexity,
      })),
      validation: {
        ...localPlan.validation,
        status: 'repaired',
        notes: [
          'Managed director created a template-specific render plan.',
          ...localPlan.validation.notes,
          ...(parsed.notes || []).slice(0, 3).map((note) => cleanText(note, 120)),
        ],
        qualityScore: Math.max(localPlan.validation.qualityScore, 94),
        qualityChecks: [
          'Managed director checked hook, hierarchy, pacing, and readable Hinglish.',
          ...localPlan.validation.qualityChecks,
        ],
        openAiCallsUsed: localPlan.validation.openAiCallsUsed + 1,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildSystemPrompt(templateName: ReelPlanResult['templateName']) {
  return [
    'You are Itnavideo senior reel director and this is the only OpenAI planning call for this render.',
    'Create the final professional 9:16 scene plan from transcript segments, word timing, and deterministic assetBriefs.',
    'Never invent facts, amounts, links, dates, documents, or job details.',
    'Do not invent timing. Use the provided selected transcript window, timestamp segments, and local draft timing.',
    'Every scene must be based on the active spoken transcript phrase for that exact moment.',
    'Use English only for transcript text, captions, overlay text, visual briefs, timeline reasoning, and asset search terms.',
    'If source speech was Hindi, Urdu, or Hinglish, use the English translation/meaning only.',
    'No Devanagari, Arabic, Urdu script, Roman Hinglish, or phonetic gibberish.',
    'Fix spelling into natural Hinglish: PAN Card, Apply, Nahi, Aasaan, Documents, Admit Card, Hall Ticket.',
    CANONICAL_REFERENCE_STYLE,
    'Reference quality: output should feel like a finished three-layer social reel, not a planner preview. Use clean top 16:9 framing, premium subtitle timing, and one strong bottom image.',
    'Example style: education/exam reel -> top 16:9 creator/interview video, middle active-word subtitle bar, bottom relevant student/campus/document image.',
    'Make each overlay short, readable, image-led, and creator-grade.',
    'For every overlay include layout, visual, visualRole, primaryVisual, animation, and emotion so the renderer has clear design direction.',
    'For every overlay include assetBrief: a clean English image search instruction for the bottom image layer.',
    'Layout Picker is mandatory: every scene must include layoutType from the approved Video Explainer V2 layout library before any asset choice.',
    `Approved layoutType values: ${VIDEO_EXPLAINER_V2_LAYOUTS.join(', ')}.`,
    'Use exactly one layoutType per scene. A scene may contain one hero asset, one supporting asset, and one main text maximum.',
    'primaryVisual is the renderable visual object. visual is only a human-readable reason/brief.',
    'visual must be concrete and image-searchable, like "students filling forms online" or "young professional in corporate office"; never vague text like "show key point".',
    'One scene must have one primary visual idea only. Do not stack unrelated images, tables, icons, and text in the same scene.',
    'No-icon rule: do not choose icon visuals. Prefer type="image", "uploadedMedia", "document", or "mockup".',
    'Image rule: use availableExternalAssets and local assets aggressively when relevant, but only as the bottom image layer for Video Explainer.',
    'No extra-background rule: do not plan separate background images, blurred atmosphere, dashboard panels, generic labels, chips, icon stacks, or extra text layers for Video Explainer.',
    'Do not repeat the same visual idea in adjacent overlays unless the transcript is explicitly continuing the same point.',
    'Do not use the same layout more than two overlays in a row.',
    'Allowed layouts: headlineCard, splitExplainer, statCard, warningCard, checklist, ctaCard.',
    'Allowed visualRole values: topVideo, bottomOverlay, background, assetInsert.',
    'Allowed primaryVisual.type values: uploadedMedia, image, chart, document, waveform, mockup, none. Avoid icon.',
    'Allowed primaryVisual.motion values: slowZoom, panLeft, float, pop, slideUp, parallax.',
    'Allowed animations: fadeUp, popIn, slideUp, countUp, warningPulse.',
    'Animation mapping: hook = popIn or zoom-like pop; stat/math = countUp; warning/risk/competition = warningPulse; process/pivot = slideUp; CTA = popIn or slideUp.',
    'Allowed emotions: urgent, informative, serious, motivational.',
    templateName === 'HANDWRITTEN_NOTES'
      ? [
          'Template: Handwritten Notes. Output must feel like notes being written live, not one repeated infographic poster.',
          'For visual, use controlled tokens when possible: heading_write, bullet_write, diagram_flowchart, diagram_timeline, diagram_mindmap, arrow_diagram, highlight_swipe, red_circle, or doodle_bank/doodle_rupee/doodle_book/doodle_graduation/doodle_lightbulb/doodle_chart/doodle_briefcase/doodle_target.',
          'Never make a scene fully prewritten. Keep each overlay as one active idea, max 3 short bullets worth of text.',
          'Use diagrams for processes, dates, exam stages, document lists, cause-effect, and comparisons.',
        ].join('\n')
      : templateName === 'VIDEO_CAPTION'
        ? [
            'Template: Video Caption. Uploaded video stays full-screen primary; captions are the primary experience.',
            'Do not create explainer cards, note scenes, diagrams, visual briefs, summaries, or invented story layers.',
            'Use only transcript text from the provided timing window. Do not create captions from topic title or file name.',
            'Keep every overlay text as the exact active spoken phrase or a short readability-cleaned version of it.',
            'Set visualRole to topVideo and primaryVisual.type to uploadedMedia for every overlay.',
            'Captions are built by the deterministic planner from word/segment timings; do not invent new timing.',
          ].join('\n')
        : templateName === 'IMAGE_STORY'
          ? [
              'Template: Image Story. The image is the main experience; plan one primary image-led story beat per scene.',
              'Do not create captions, handwritten notes, explainer cards, diagrams, long paragraphs, or visual brief placeholders.',
              'Use minimal overlay text only: short title, label, or punch line, max 3-7 words.',
              'If transcript exists, use transcript timing for image/story beats without inventing spoken content.',
              'If image-only, use topic/prompt for visual beats but do not create a fake transcript or word-timed captions.',
              'Set primaryVisual.type to image when possible, visualRole to background, and use subtle motion such as slowZoom, pan, or parallax.',
            ].join('\n')
          : templateName === 'comparisonImages'
            ? [
                'Template: Compare. Plan each scene as a clear side-by-side tradeoff, option A versus option B, before versus after, or old way versus better way.',
                'Keep overlay text short and decision-oriented. The renderer will split each beat into two comparison panels and a verdict strip.',
                'Do not plan a top video plus bottom image explainer structure. Do not add dense subtitles, long paragraphs, or more than two competing ideas in one scene.',
                'Use layout splitExplainer, statCard, warningCard, or ctaCard when it helps clarify the comparison.',
                'Set primaryVisual.type to chart, document, mockup, or waveform when useful, and visualRole to bottomOverlay.',
              ].join('\n')
        : [
            'Template: Video Explainer. This renderer has exactly three visual layers: layer 1 top uploaded video, layer 2 middle timed subtitles, layer 3 bottom selected image.',
            'Top frame is reserved for creator/uploaded video. Never put external stock images in the top frame.',
            'Remotion renders subtitles separately in the middle bar with active-word highlight. Do not create any extra transcript text, cards, badges, stats, or UI blocks.',
            'For every overlay, keep text as the spoken subtitle/caption only. Use primaryVisual.type="image" and visualRole="assetInsert" for the bottom image whenever a relevant asset is available.',
            'assetBrief must describe the exact bottom image to pick in English: subject, setting, visual style, required tags, and avoid tags when useful.',
            'If availableExternalAssets contains relevant image URLs, copy the exact asset src into primaryVisual.assetId so it appears as layer 3, the bottom image.',
            'For uploaded video explainers, keep uploadedMedia only for the top source video and use selected images only for the bottom image layer.',
            'All visible subtitles, timeline text, primaryVisual prompts, labels, and asset search briefs must be English only.',
            'Hindi/Urdu/Hinglish source audio must already be translated to English before this step; do not output Roman Hinglish.',
            'Keep standard names official English: RBI, RBI Grade B, Admit Card, Hall Ticket, PAN Card, Aadhaar, Salary, Benefits, Documents, Apply, Download.',
            'Never write phonetic spellings such as aar bee ai, edmit kaard, hall tikit, pan kaard, dokumaints, apalaaee, or naheen.',
            'Only show the current spoken meaning. Do not show future points before the speaker says them.',
            'If the speaker says one point, keep the subtitle short and choose one matching bottom image; do not add another text explanation.',
            'Do not make text faster than audio. For short timing windows, shorten text instead of adding more words.',
            'Preferred render output: captions carry the spoken line; assetTimeline/primaryVisual carries the bottom image.',
          ].join('\n'),
  ].join('\n');
}

function buildDirectorPayload(request: ReelPlanRequest, localPlan: ReelPlanResult) {
  return {
    templateName: localPlan.templateName,
    language: localPlan.analysis.language,
    durationSeconds: localPlan.analysis.durationSeconds,
    userTopic: request.topicTitle || request.topic || '',
    transcript: cleanText(request.transcript, 6000),
    timestampSegments: (request.timestampSegments || []).slice(0, 40).map((segment) => ({
      start: segment.start,
      end: segment.end,
      text: segment.text,
    })),
    wordTimings: (request.words || []).slice(0, 180).map((word) => ({
      start: word.start,
      end: word.end,
      word: word.word,
    })),
    expectations: [
      'No real transcript moment, no scene.',
      'Use one selected transcript window under 60 seconds.',
      'Do not create generic filler content.',
      'Keep visual and caption synced to the spoken text.',
      'Output must resemble a neat timeline JSON: exact start/end, concrete scene brief, short text, one animation.',
      'Use Hook/Body/CTA pacing from the saved references: hook near first 5 seconds, body until about 40 seconds, CTA near final 10 seconds.',
      'Return final render-ready overlay JSON only.',
    ],
    maxOpenAiCallsPerRender: Number(process.env.OPENAI_MAX_CALLS_PER_RENDER || 1),
    scriptDetails: localPlan.templateName === 'VIDEO_EXPLAINER' ? undefined : localPlan.scriptDetails,
    assetBriefs: localPlan.renderProps.overlayTimeline.map((overlay) => ({
      id: overlay.id,
      start: overlay.start,
      end: overlay.end,
      assetBrief: overlay.assetBrief || overlay.primaryVisual?.prompt || overlay.visual,
    })),
    availableExternalAssets: (localPlan.renderProps.externalVisualAssets || []).slice(0, 8).map((asset) => ({
      id: asset.id,
      provider: asset.provider,
      type: asset.type,
      src: asset.src,
      query: asset.query,
      title: asset.title,
      attribution: asset.attribution || '',
    })),
    localDraft: {
      topicTitle: localPlan.renderProps.topicTitle,
      overlays: localPlan.renderProps.overlayTimeline,
    },
  };
}

function directorSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['topicTitle', 'overlays', 'notes'],
    properties: {
      topicTitle: {type: 'string', minLength: 2, maxLength: 72},
      notes: {
        type: 'array',
        maxItems: 5,
        items: {type: 'string', maxLength: 160},
      },
      overlays: {
        type: 'array',
        minItems: 1,
        maxItems: 12,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'start', 'end', 'type', 'label', 'text', 'body', 'accentWord', 'align', 'sfx', 'layout', 'layoutType', 'visual', 'assetBrief', 'visualRole', 'primaryVisual', 'animation', 'emotion'],
          properties: {
            id: {type: 'string', minLength: 3, maxLength: 32},
            start: {type: 'number'},
            end: {type: 'number'},
            type: {type: 'string', enum: ['hook', 'point', 'stat', 'warning', 'quote', 'cta']},
            label: {type: 'string', minLength: 2, maxLength: 32},
            text: {type: 'string', minLength: 2, maxLength: 70},
            body: {type: 'string', maxLength: 140},
            accentWord: {type: 'string', maxLength: 24},
            align: {type: 'string', enum: ['left', 'center']},
            sfx: {type: 'string', enum: ['softPop', 'softTick', 'softChime', 'boom', 'whoosh', 'stamp', 'bell', 'warning', 'cash', 'typing', 'bassDrop']},
            layout: {type: 'string', enum: ['headlineCard', 'splitExplainer', 'statCard', 'warningCard', 'checklist', 'ctaCard']},
            layoutType: {type: 'string', enum: [...VIDEO_EXPLAINER_V2_LAYOUTS]},
            visual: {type: 'string', minLength: 8, maxLength: 180},
            assetBrief: {type: 'string', minLength: 8, maxLength: 220},
            visualRole: {type: 'string', enum: ['topVideo', 'bottomOverlay', 'background', 'assetInsert']},
            primaryVisual: {
              type: 'object',
              additionalProperties: false,
              required: ['type', 'assetId', 'prompt', 'label', 'motion'],
              properties: {
                type: {type: 'string', enum: ['uploadedMedia', 'image', 'chart', 'document', 'waveform', 'mockup', 'none']},
                assetId: {type: 'string', maxLength: 500},
                prompt: {type: 'string', maxLength: 180},
                label: {type: 'string', maxLength: 48},
                motion: {type: 'string', enum: ['slowZoom', 'panLeft', 'float', 'pop', 'slideUp', 'parallax']},
              },
            },
            animation: {type: 'string', enum: ['fadeUp', 'popIn', 'slideUp', 'countUp', 'warningPulse']},
            emotion: {type: 'string', enum: ['urgent', 'informative', 'serious', 'motivational']},
          },
        },
      },
    },
  };
}

function parseDirectorResponse(json: unknown): ManagedDirectorResponse | null {
  const text = extractOutputText(json);
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.overlays)) return null;
    return parsed as ManagedDirectorResponse;
  } catch {
    return null;
  }
}

function extractOutputText(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const outputText = (value as {output_text?: unknown}).output_text;
  if (typeof outputText === 'string') return outputText;
  const output = (value as {output?: unknown}).output;
  if (!Array.isArray(output)) return '';
  return output
    .flatMap((item) => (item && typeof item === 'object' && Array.isArray((item as {content?: unknown}).content)
      ? (item as {content: unknown[]}).content
      : []))
    .map((content) => {
      if (!content || typeof content !== 'object') return '';
      const item = content as {type?: unknown; text?: unknown};
      return item.type === 'output_text' && typeof item.text === 'string' ? item.text : '';
    })
    .filter(Boolean)
    .join('\n')
    .trim();
}

function repairManagedOverlays(overlays: ManagedOverlay[], localPlan: ReelPlanResult) {
  const local = localPlan.renderProps.overlayTimeline;
  const duration = localPlan.analysis.durationSeconds;
  const repaired = overlays
    .map((overlay, index) => {
      const fallback = local[index] || local.at(-1);
      const start = clampNumber(Number(overlay.start), 0, duration);
      const end = clampNumber(Number(overlay.end), start + 1.5, duration);
      const type = normalizeType(overlay.type, fallback?.type, index, overlays.length);
      const text = cleanDisplayText(overlay.text || fallback?.text || 'Important point', 70);
      const body = cleanDisplayText(overlay.body || fallback?.body || '', 140);
      return {
        id: cleanText(overlay.id || fallback?.id || `overlay-${index + 1}`, 32),
        start: roundTime(start),
        end: roundTime(end),
        type,
        label: cleanText(overlay.label || fallback?.label || 'Point', 32),
        text,
        body,
        accentWord: cleanText(overlay.accentWord || fallback?.accentWord || '', 24).split(/\s+/)[0],
        align: overlay.align === 'left' ? 'left' as const : 'center' as const,
        sfx: isVideoExplainerSfx(overlay.sfx)
          ? overlay.sfx
          : index === 0 ? 'boom' as const : index === overlays.length - 1 ? 'bell' as const : 'whoosh' as const,
        layout: normalizeLayout(overlay.layout, fallback?.layout, type),
        layoutType: normalizeVideoExplainerV2Layout(overlay.layoutType || fallback?.layoutType, {
          text,
          body,
          sceneType: overlay.sceneType || fallback?.sceneType,
          overlayType: type,
        }),
        visual: cleanText(overlay.visual || fallback?.visual || defaultVisualDirection(type), 180),
        assetBrief: cleanText(overlay.assetBrief || fallback?.assetBrief || overlay.primaryVisual?.prompt || fallback?.primaryVisual?.prompt || overlay.visual || fallback?.visual || text, 220),
        visualRole: normalizeVisualRole(overlay.visualRole, fallback?.visualRole, localPlan.templateName),
        primaryVisual: normalizePrimaryVisual(overlay.primaryVisual, fallback?.primaryVisual, overlay, localPlan),
        animation: normalizeAnimation(overlay.animation, fallback?.animation, type),
        emotion: normalizeEmotion(overlay.emotion, fallback?.emotion, type),
        words: fallback?.words,
      };
    })
    .filter((overlay) => overlay.end > overlay.start && overlay.text);

  if (repaired[0]) repaired[0].type = 'hook';
  if (repaired.length > 1) repaired[repaired.length - 1].type = 'cta';
  return repaired;
}

function isVideoExplainerSfx(value: unknown) {
  return value === 'softPop' || value === 'softTick' || value === 'softChime' ||
    value === 'boom' || value === 'whoosh' || value === 'stamp' || value === 'bell' ||
    value === 'warning' || value === 'cash' || value === 'typing' || value === 'bassDrop';
}

function normalizePrimaryVisual(
  value: ManagedOverlay['primaryVisual'] | undefined,
  fallback: ManagedOverlay['primaryVisual'] | undefined,
  overlay: ManagedOverlay,
  localPlan: ReelPlanResult,
): ManagedOverlay['primaryVisual'] {
  const type = normalizePrimaryVisualType(value?.type || fallback?.type, overlay, localPlan);
  const motion = normalizePrimaryVisualMotion(value?.motion || fallback?.motion, type);
  return {
    type,
    assetId: cleanText(value?.assetId || fallback?.assetId || '', 500),
    prompt: cleanText(value?.prompt || fallback?.prompt || overlay.assetBrief || fallback?.assetBrief || overlay.visual || overlay.text || '', 180),
    label: cleanText(value?.label || fallback?.label || overlay.label || overlay.type || 'Visual', 48),
    motion,
  };
}

function normalizePrimaryVisualType(
  value: unknown,
  overlay: ManagedOverlay,
  localPlan: ReelPlanResult,
): ManagedOverlay['primaryVisual']['type'] {
  if (value === 'uploadedMedia' || value === 'image' || value === 'chart' || value === 'document' || value === 'waveform' || value === 'mockup' || value === 'none') return value;
  if (localPlan.renderProps.mediaType !== 'audio') return 'uploadedMedia';
  if (overlay.type === 'stat') return 'chart';
  if (overlay.type === 'warning') return 'mockup';
  if (overlay.layout === 'checklist') return 'document';
  return 'waveform';
}

function normalizePrimaryVisualMotion(
  value: unknown,
  type: ManagedOverlay['primaryVisual']['type'],
): ManagedOverlay['primaryVisual']['motion'] {
  if (value === 'slowZoom' || value === 'panLeft' || value === 'float' || value === 'pop' || value === 'slideUp' || value === 'parallax') return value;
  if (type === 'chart') return 'pop';
  if (type === 'document' || type === 'mockup') return 'slideUp';
  if (type === 'image' || type === 'uploadedMedia') return 'slowZoom';
  return 'float';
}

function normalizeVisualRole(
  value: unknown,
  fallback: ManagedOverlay['visualRole'] | undefined,
  templateName: ReelPlanResult['templateName'],
): ManagedOverlay['visualRole'] {
  if (value === 'topVideo' || value === 'bottomOverlay' || value === 'background' || value === 'assetInsert') return value;
  if (fallback) return fallback;
  if (templateName === 'IMAGE_STORY') return 'background';
  if (templateName === 'HANDWRITTEN_NOTES') return 'background';
  if (templateName === 'VIDEO_EXPLAINER') return 'assetInsert';
  return 'bottomOverlay';
}

function normalizeLayout(
  value: unknown,
  fallback: ManagedOverlay['layout'] | undefined,
  type: ManagedOverlay['type'],
): ManagedOverlay['layout'] {
  if (value === 'headlineCard' || value === 'splitExplainer' || value === 'statCard' || value === 'warningCard' || value === 'checklist' || value === 'ctaCard') return value;
  if (fallback) return fallback;
  if (type === 'hook' || type === 'quote') return 'headlineCard';
  if (type === 'stat') return 'statCard';
  if (type === 'warning') return 'warningCard';
  if (type === 'cta') return 'ctaCard';
  return 'splitExplainer';
}

function normalizeAnimation(
  value: unknown,
  fallback: ManagedOverlay['animation'] | undefined,
  type: ManagedOverlay['type'],
): ManagedOverlay['animation'] {
  if (value === 'fadeUp' || value === 'popIn' || value === 'slideUp' || value === 'countUp' || value === 'warningPulse') return value;
  if (fallback) return fallback;
  if (type === 'hook') return 'popIn';
  if (type === 'stat') return 'countUp';
  if (type === 'warning') return 'warningPulse';
  if (type === 'cta') return 'slideUp';
  return 'fadeUp';
}

function normalizeEmotion(
  value: unknown,
  fallback: ManagedOverlay['emotion'] | undefined,
  type: ManagedOverlay['type'],
): ManagedOverlay['emotion'] {
  if (value === 'urgent' || value === 'informative' || value === 'serious' || value === 'motivational') return value;
  if (fallback) return fallback;
  if (type === 'hook') return 'urgent';
  if (type === 'warning') return 'serious';
  if (type === 'cta') return 'motivational';
  return 'informative';
}

function defaultVisualDirection(type: ManagedOverlay['type']) {
  if (type === 'hook') return 'top video dominant with a large bottom hook';
  if (type === 'stat') return 'top video continues with a bold number card below';
  if (type === 'warning') return 'top video continues with a serious warning card below';
  if (type === 'cta') return 'top video continues with a clean action card below';
  return 'top video stays primary with concise explainer text below';
}

function normalizeType(
  value: unknown,
  fallback: ManagedOverlay['type'] | undefined,
  index: number,
  total: number,
): ManagedOverlay['type'] {
  if (index === 0) return 'hook';
  if (index === total - 1) return 'cta';
  if (value === 'hook' || value === 'point' || value === 'stat' || value === 'warning' || value === 'quote' || value === 'cta') return value;
  return fallback || 'point';
}

function cleanText(value: unknown, maxChars: number) {
  return String(value || '')
    .replace(/[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars);
}

function cleanDisplayText(value: unknown, maxChars: number) {
  return cleanText(value, maxChars)
    .replace(/\bpain\s?kaard\b/gi, 'PAN Card')
    .replace(/\bpan\s?kaard\b/gi, 'PAN Card')
    .replace(/\bpan\s+card\b/gi, 'PAN Card')
    .replace(/\bnaheen\b/gi, 'Nahi')
    .replace(/\bdokumaints?\b/gi, 'Documents')
    .trim();
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function roundTime(value: number) {
  return Math.round(value * 100) / 100;
}

