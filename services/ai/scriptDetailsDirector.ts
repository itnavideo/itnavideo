import type {ScriptDetails, ScriptDetailBlockType} from './scriptDetails';
import {
  handwrittenNotesRequiredPlanningOrder,
  handwrittenNotesSystemPromptRules,
} from './handwrittenNotesScriptDetails';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-5-mini';
const VIDEO_REFERENCE_STYLE = [
  'Fresh canonical reference format:',
  'Make image-first collage reels like editorial social posters in motion, not dashboard/card UI.',
  'Top: clean 16:9 source/reference image or video frame.',
  'Main: large topic-matched photo/PNG/cutout with bold typography integrated into the image.',
  'Background: blurred enlarged related image or soft photo atmosphere.',
  'Use normal photos, reusable images, PNG cutouts, typography, music, and SFX.',
  'No icons as a planning strategy. Avoid icon-led scenes.',
  'On-screen text must be compact and designed: 2-6 word headlines, brush/stamp/accent typography when useful, no transcript paragraphs.',
  'For Hinglish, use natural English + Roman Hinglish: official keywords preserved, support phrases clean and short.',
].join('\n');

export async function createManagedScriptDetails({
  transcript,
  timestampSegments,
  topicTitle,
  renderLanguage,
  templateName,
  fallback,
}: {
  transcript: string;
  timestampSegments: Array<{start: number; end: number; text: string}>;
  topicTitle?: string;
  renderLanguage: 'english' | 'hinglish';
  templateName?: string;
  fallback: ScriptDetails;
}): Promise<ScriptDetails | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const cleanTranscript = cleanSourceTranscript(transcript, 8000);
  const wordCount = countWords(cleanTranscript);
  const model = process.env.OPENAI_SCRIPT_DETAILS_MODEL || process.env.OPENAI_REEL_PLANNER_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.OPENAI_SCRIPT_DETAILS_TIMEOUT_MS || 18_000));

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
            content: [{type: 'input_text', text: buildSystemPrompt(renderLanguage, templateName)}],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify({
                  topicTitle: topicTitle || fallback.topic,
                  analysisLanguage: 'english',
                  finalRenderLanguage: renderLanguage,
                  templateName: templateName || 'VIDEO_EXPLAINER',
                  wordCount,
                  sourceTranscriptForMeaning: cleanTranscript,
                  timestampSegments: timestampSegments.slice(0, 50),
                  fallbackFacts: fallback,
                  requiredPlanningOrder: [
                    '1. Convert the complete source transcript into a normal full English script and store it in sourceScript.',
                    '2. Use the English sourceScript and wordCount to decide useful video details, asset briefs, and visual moments.',
                    '3. Decide imageUsagePolicy: minimum, maximum, and recommended image count for this script.',
                    '4. Create imageSelectionPlan: exact image needs, tags, avoid tags, timing, priority, and fallback if no good image exists.',
                    templateName === 'HANDWRITTEN_NOTES'
                      ? '5. Act as CreativeDirector: create timeline JSON with exact note actions, diagrams, doodles, image/icon/SFX/music needs, and English displayText/body for reasoning.'
                      : '5. Create videoUsePlan timing JSON with English displayText/body for asset reasoning.',
                    ...(templateName === 'HANDWRITTEN_NOTES'
                      ? handwrittenNotesRequiredPlanningOrder(renderLanguage)
                      : templateName === 'VIDEO_EXPLAINER' || !templateName
                        ? videoExplainerRequiredPlanningOrder()
                        : ['5A. For non-notes templates, keep each item as one clear scene.']),
                    renderLanguage === 'hinglish'
                      ? templateName === 'HANDWRITTEN_NOTES'
                        ? '6. Only at the final render-text step, create Hybrid English + Hinglish renderText/renderBody: English keywords/points, Hinglish support text.'
                        : templateName === 'VIDEO_EXPLAINER' || !templateName
                          ? '6. Only at the final render-text step, create Hybrid English + Hinglish renderText/renderBody: official English keywords, clean Hinglish support text.'
                          : '6. Only at the final render-text step, translate each planned scene into clean Roman Hinglish in renderText/renderBody.'
                      : '6. Keep final renderText/renderBody in clean English because the source speech is English.',
                  ],
                }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'itnavideo_script_details',
            strict: true,
            schema: scriptDetailsSchema(),
          },
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;
    const parsed = parseResponse(await response.json());
    if (!parsed) return null;

    return repairScriptDetails(parsed, fallback, cleanTranscript, wordCount);
  } finally {
    clearTimeout(timeout);
  }
}

function buildSystemPrompt(renderLanguage: 'english' | 'hinglish', templateName?: string) {
  const isHandwrittenNotes = templateName === 'HANDWRITTEN_NOTES';
  const isVideoExplainer = templateName === 'VIDEO_EXPLAINER' || !templateName;
  return [
    'You are Itnavideo script analyst. This step happens after transcription and before render JSON.',
    'Follow this exact pipeline order. Do not skip steps.',
    'STEP 1: Read the complete source transcript and total word count.',
    'STEP 2: Create sourceScript as a normal full English script/translation of the entire transcript meaning.',
    'STEP 3: Use only the English sourceScript for understanding the topic, picking video details, and deciding assets/visuals.',
    'STEP 4: Decide imageUsagePolicy before choosing assets: minImages, maxImages, recommendedImages, reason, and selectionRules.',
    'STEP 5: Study the English script and create imageSelectionPlan. It must say exactly which images are needed, when, why, required tags, avoid tags, and fallback if no accurate image exists.',
    'STEP 6: Create videoUsePlan timing JSON that says what appears from 0-5s, 5-8s, etc. Use the transcript timing as guidance.',
    'STEP 7: Only after planning, create final renderText/renderBody in the requested final render language.',
    VIDEO_REFERENCE_STYLE,
    'Reference output style: clean image-first timeline JSON. Each item has start, end, one concrete photo/PNG scene idea, short headline typography, animation, music/SFX direction, and image search text.',
    'Editing reference: top 16:9 frame stays clean; lower/main area changes with large real images or cutouts; typography appears over the image, not inside generic UI cards.',
    'Audio reference: every Video Explainer needs background music direction and beat-matched SFX like whoosh, boom, stamp, bell, typing, cash, warning, or hit.',
    'Background policy: default to topic-matched real-world image as blurred/dark scene atmosphere when it helps context. If no strong match exists, use premium photo/texture fallback. Never request sharp busy backgrounds behind small text.',
    'Make videoUsePlan as neat as that reference: no doubt, no vague generic cards, no repeated filler, one current spoken idea per timing window.',
    'All analysis fields must be English: sourceScript, summary, keyPoints, avoidRepeats, detailBlocks, assetBriefs, displayText, body, assetSearchText, sourceText.',
    'sourceScript must be full English prose, not Roman Hinglish, not keywords, and not a summary.',
    'For every videoUsePlan item, assetSearchText is the per-scene assetBrief. It must be a clean English image search instruction: exact subject, setting, required visual tags, avoid tags, and what the bottom image should show.',
    'Bad assetSearchText: "money image" or repeated subtitle text. Good: "Reserve Bank of India entrance plaque, official central bank building, finance news context, avoid logos and unreadable text".',
    isHandwrittenNotes
      ? 'For Handwritten Notes, summary is internal only. Do not use summary to replace the original script, shorten the message, or create new visible text.'
      : 'summary is internal only and must not invent facts.',
    'wordCount must match the provided source transcript word count.',
    isVideoExplainer
      ? 'For Video Explainer, renderText and renderBody must be clean English only. This keeps subtitles, timeline JSON, and asset tags in one language.'
      : renderLanguage === 'hinglish' && isHandwrittenNotes
      ? 'For Handwritten Notes, renderText and renderBody must use Hybrid English + Hinglish because source speech is Hindi/Urdu/Hinglish.'
      : renderLanguage === 'hinglish'
        ? 'renderText and renderBody must be clean Roman Hinglish because source speech is Hindi/Urdu/Hinglish.'
      : 'renderText and renderBody must be clean English because source speech is English.',
    isVideoExplainer
      ? 'For Video Explainer renderText/renderBody, use normal readable English. Never use Roman Hinglish or translated phonetics.'
      : renderLanguage === 'hinglish' && isHandwrittenNotes
      ? 'For Handwritten Notes hybrid render text, keep main keywords/points in English and write short support phrases in natural Hinglish. Example: renderText "Exam Date", renderBody "11 April ko exam hai".'
      : renderLanguage === 'hinglish'
        ? 'For Hinglish renderText/renderBody, use natural spelling like Salary, Benefits, Nahi, Aasani, Documents, Apply. Never phonetic broken words.'
      : 'For English renderText/renderBody, keep normal readable English. Do not convert English speech into Hinglish.',
    'Decide what can be used in the video. Do not merely extract keywords.',
    'For imageUsagePolicy: do not choose one image per sentence. For a 60s image-first Video Explainer usually recommend 4-7 images; for a 30s one recommend 3-5 images. For Handwritten Notes recommend 0-2 reference/support images. Always keep minImages <= recommendedImages <= maxImages.',
    'imageUsagePolicy must explain why that count is enough for this script and when to avoid images.',
    'imageSelectionPlan must be deeply semantic. Bad: "money image". Good: "Indian bank counter with customer and teller, trust, real branch, no logo, no text".',
    'Each imageSelectionPlan item must map to a real script moment and must include requiredTags and avoidTags.',
    'Do not ask for generic stock images, random motivational images, icons as visuals, watermarks, logos, or unreadable text.',
    isHandwrittenNotes
      ? 'Create a CreativeDirector timeline that says what note element, diagram, doodle, image/icon fallback, SFX, and music direction appears at each timing window before final render-language translation.'
      : 'Create a concise English content plan that says what should appear at each timing window before final render-language translation.',
    ...(isHandwrittenNotes
      ? handwrittenNotesSystemPromptRules(renderLanguage)
      : isVideoExplainer
        ? videoExplainerSystemPromptRules()
      : [
          'For non-notes templates, each videoUsePlan item can be a full scene card.',
          'Use readable scene windows based on transcript pacing.',
          'Choose layout and visual normally for the active template.',
          'Avoid requesting unsupported freehand drawing.',
          'Use template-native visuals.',
          'Use the available template structure for visual variety.',
          'Do not overcrowd scenes.',
          'Use visual/sourceText to describe the best visual support for the scene.',
          'Create diagrams only when useful.',
        ]),
    'For every videoUsePlan item, choose layout, visual, animation, and emotion so the renderer can create non-repetitive premium reel scenes.',
    'For every videoUsePlan item, visual must be a concrete image/scene brief, not an abstract instruction. Good: "massive crowd outside exam center"; bad: "show hook visually".',
    'On-screen renderText should be short like timeline JSON text: 2-7 words preferred. renderBody may add one support line only when needed.',
    'Do not use the same layout more than 2 times in a row.',
    'Never invent websites, fees, dates, documents, steps, or claims.',
    'If the script is not a how-to process, keep processSteps empty. Do not force Step 1/2/3.',
    'Never use Hindi, Urdu, Arabic, or Devanagari script in any field.',
    'Avoid repeating the same idea in multiple cards. Each videoUsePlan item must have a different purpose.',
  ].join('\n');
}

function videoExplainerRequiredPlanningOrder() {
  return [
    '5A. For Video Explainer, each videoUsePlan item must represent only the current spoken meaning for that timing window.',
    '5B. Do not write future points before the speaker says them. Never pull later script details into an earlier overlay.',
    '5C. This Video Explainer template has exactly three render layers: top uploaded video, middle timed subtitles, bottom selected image.',
    '5D. Do not plan bottom cards, badges, stats, icons, background scenes, or extra explanatory text layers.',
    '5E. Keep renderText as the current spoken subtitle meaning only. Keep renderBody empty or minimal because the middle subtitle bar owns text.',
    '5F. Final Video Explainer text, timeline JSON, assetSearchText, and image needs must be English only, even when source audio was Hindi/Urdu/Hinglish.',
  ];
}

function videoExplainerSystemPromptRules() {
  return [
    'For Video Explainer, top uploaded video is layer 1, middle active-word subtitles are layer 2, and one selected bottom image is layer 3.',
    'Remotion rule: subtitles are rendered as the separate middle subtitle layer. Do not create a second transcript paragraph anywhere else.',
    'Do not plan shadcn cards, stat cards, badges, alert cards, comparison pills, benefits lists, CTA cards, icons, or UI panels for this template.',
    'Use timestampSegments as the source of truth. Only show the point that is being spoken at that time.',
    'Do not make text faster than audio. If a segment is short, shorten text instead of squeezing many words.',
    'Never show future facts, future steps, future dates, or future examples early.',
    'For every videoUsePlan item, renderText should match the current subtitle meaning and image needs should describe the bottom image only.',
    'Standard names must stay official English: RBI, RBI Grade B, Admit Card, Hall Ticket, PAN Card, Aadhaar, Salary, Benefits, Documents, Apply, Download.',
    'Never write phonetic spellings such as aar bee ai, edmit kaard, hall tikit, pan kaard, dokumaints, apalaaee, naheen.',
    'Avoid subtitle repeat in body. Bad: renderText and renderBody both restate the spoken sentence. Good: renderText carries the phrase; imageNeed describes the bottom visual.',
    'Each overlay must have one purpose only: hook, date, fee, document, action, warning, proof, or CTA.',
    'Final visible Video Explainer text must be English only. Translate Hindi/Urdu/Hinglish meaning into English before planning captions or image needs.',
  ];
}

function scriptDetailsSchema() {
  const blockTypeEnum = ['processList', 'websiteBox', 'amountBox', 'documentList', 'dateBox', 'warningBox', 'factBox'];
  return {
    type: 'object',
    additionalProperties: false,
    required: [
      'topic',
      'summary',
      'intent',
      'wordCount',
      'sourceScript',
      'originalScript',
      'keyPoints',
      'avoidRepeats',
      'assetBriefs',
      'imageUsagePolicy',
      'imageSelectionPlan',
      'processSteps',
      'websites',
      'amounts',
      'documents',
      'dates',
      'warnings',
      'detailBlocks',
      'videoUsePlan',
    ],
    properties: {
      topic: {type: 'string', minLength: 2, maxLength: 90},
      summary: {type: 'string', minLength: 4, maxLength: 220},
      intent: {type: 'string', enum: ['apply', 'download', 'check', 'learn', 'prepare', 'general']},
      wordCount: {type: 'number'},
      sourceScript: {type: 'string', minLength: 4, maxLength: 8000},
      originalScript: {type: 'string', minLength: 4, maxLength: 8000},
      keyPoints: {type: 'array', maxItems: 8, items: {type: 'string', maxLength: 140}},
      avoidRepeats: {type: 'array', maxItems: 8, items: {type: 'string', maxLength: 140}},
      assetBriefs: {
        type: 'array',
        maxItems: 12,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'timing', 'searchText', 'visualType', 'priority', 'usage', 'title'],
          properties: {
            id: {type: 'string', minLength: 3, maxLength: 48},
            timing: {type: 'string', minLength: 3, maxLength: 32},
            searchText: {type: 'string', minLength: 4, maxLength: 160},
            visualType: {type: 'string', enum: ['editorial_photo', 'video_clip', 'screenshot', 'icon_callout', 'notes_doodle', 'typography']},
            priority: {type: 'string', enum: ['high', 'medium', 'low']},
            usage: {type: 'string', enum: ['background', 'supporting', 'mainVisual', 'overlay']},
            title: {type: 'string', minLength: 2, maxLength: 70},
          },
        },
      },
      imageUsagePolicy: {
        type: 'object',
        additionalProperties: false,
        required: ['minImages', 'maxImages', 'recommendedImages', 'reason', 'selectionRules'],
        properties: {
          minImages: {type: 'number'},
          maxImages: {type: 'number'},
          recommendedImages: {type: 'number'},
          reason: {type: 'string', minLength: 8, maxLength: 220},
          selectionRules: {
            type: 'array',
            minItems: 2,
            maxItems: 6,
            items: {type: 'string', minLength: 4, maxLength: 140},
          },
        },
      },
      imageSelectionPlan: {
        type: 'array',
        maxItems: 10,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'timing', 'scenePurpose', 'imageNeed', 'bestMatchDescription', 'requiredTags', 'avoidTags', 'assetType', 'priority', 'fallbackVisual', 'reason'],
          properties: {
            id: {type: 'string', minLength: 3, maxLength: 48},
            timing: {type: 'string', minLength: 3, maxLength: 32},
            scenePurpose: {type: 'string', enum: ['hook', 'proof', 'process', 'warning', 'cta', 'context']},
            imageNeed: {type: 'string', minLength: 4, maxLength: 100},
            bestMatchDescription: {type: 'string', minLength: 8, maxLength: 180},
            requiredTags: {type: 'array', minItems: 2, maxItems: 8, items: {type: 'string', minLength: 2, maxLength: 40}},
            avoidTags: {type: 'array', maxItems: 8, items: {type: 'string', minLength: 2, maxLength: 40}},
            assetType: {type: 'string', enum: ['editorial_photo', 'cinematic_image', 'screenshot', 'generated_image', 'template_visual']},
            priority: {type: 'string', enum: ['high', 'medium', 'low']},
            fallbackVisual: {type: 'string', enum: ['typography_card', 'clean_icon_callout', 'notes_card', 'skip_image']},
            reason: {type: 'string', minLength: 8, maxLength: 180},
          },
        },
      },
      processSteps: {type: 'array', maxItems: 8, items: {type: 'string', maxLength: 100}},
      websites: {type: 'array', maxItems: 6, items: {type: 'string', maxLength: 80}},
      amounts: {type: 'array', maxItems: 6, items: {type: 'string', maxLength: 60}},
      documents: {type: 'array', maxItems: 8, items: {type: 'string', maxLength: 80}},
      dates: {type: 'array', maxItems: 8, items: {type: 'string', maxLength: 80}},
      warnings: {type: 'array', maxItems: 6, items: {type: 'string', maxLength: 140}},
      detailBlocks: {
        type: 'array',
        maxItems: 8,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'type', 'title', 'items', 'sourceText'],
          properties: {
            id: {type: 'string', minLength: 3, maxLength: 48},
            type: {type: 'string', enum: blockTypeEnum},
            title: {type: 'string', minLength: 2, maxLength: 48},
            items: {type: 'array', minItems: 1, maxItems: 6, items: {type: 'string', maxLength: 100}},
            sourceText: {type: 'string', maxLength: 220},
          },
        },
      },
      videoUsePlan: {
        type: 'array',
        minItems: 1,
        maxItems: 12,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'start', 'end', 'purpose', 'detailType', 'layout', 'visual', 'animation', 'emotion', 'title', 'displayText', 'body', 'renderText', 'renderBody', 'assetSearchText', 'sourceText'],
          properties: {
            id: {type: 'string', minLength: 3, maxLength: 48},
            start: {type: 'number'},
            end: {type: 'number'},
            purpose: {type: 'string', enum: ['hook', 'date', 'proof', 'warning', 'action', 'cta', 'point']},
            detailType: {type: 'string', enum: blockTypeEnum},
            layout: {type: 'string', enum: ['hookCard', 'statCard', 'warningCard', 'splitExplainer', 'checklistCard', 'quoteCard', 'ctaCard']},
            visual: {type: 'string', maxLength: 80},
            animation: {type: 'string', enum: ['popIn', 'fadeUp', 'slideUp', 'countUp', 'pulse', 'none']},
            emotion: {type: 'string', enum: ['urgent', 'informative', 'serious', 'motivational', 'neutral']},
            title: {type: 'string', minLength: 2, maxLength: 70},
            displayText: {type: 'string', minLength: 2, maxLength: 90},
            body: {type: 'string', maxLength: 150},
            renderText: {type: 'string', minLength: 2, maxLength: 90},
            renderBody: {type: 'string', maxLength: 150},
            assetSearchText: {type: 'string', maxLength: 220},
            sourceText: {type: 'string', maxLength: 220},
          },
        },
      },
    },
  };
}

function parseResponse(json: unknown): ScriptDetails | null {
  const text = extractOutputText(json);
  if (!text) return null;
  try {
    return JSON.parse(text) as ScriptDetails;
  } catch {
    return null;
  }
}

function repairScriptDetails(
  parsed: ScriptDetails,
  fallback: ScriptDetails,
  originalScript: string,
  wordCount: number,
): ScriptDetails {
  const topic = cleanText(parsed.topic || fallback.topic, 90);
  const summary = cleanText(parsed.summary || fallback.summary, 220);
  const intent = normalizeIntent(parsed.intent, fallback.intent);
  const detailBlocks = (parsed.detailBlocks || fallback.detailBlocks || [])
    .map((block, index) => ({
      id: cleanId(block.id || `script-detail-${index + 1}`),
      type: normalizeBlockType(block.type),
      title: cleanText(block.title || 'Detail', 48),
      items: unique((block.items || []).map((item) => cleanText(item, 100))).slice(0, 6),
      sourceText: cleanText(block.sourceText || '', 220),
    }))
    .filter((block) => block.items.length);
  const duration = Math.max(...(parsed.videoUsePlan || []).map((item) => Number(item.end) || 0), 1);
  const videoUsePlan = (parsed.videoUsePlan || [])
    .map((item, index) => {
      const start = clamp(Number(item.start), 0, duration);
      const end = clamp(Number(item.end), start + 1.2, duration);
      return {
        id: cleanId(item.id || `script-use-${index + 1}`),
        start,
        end,
        purpose: normalizePurpose(item.purpose, index, parsed.videoUsePlan?.length || 1),
        detailType: normalizeBlockType(item.detailType),
        layout: normalizePlanLayout(item.layout, item.purpose, item.detailType, index, parsed.videoUsePlan?.length || 1),
        visual: cleanText(item.visual || defaultPlanVisual(item.purpose, item.detailType), 80),
        animation: normalizePlanAnimation(item.animation, item.purpose, item.detailType),
        emotion: normalizePlanEmotion(item.emotion, item.purpose),
        title: cleanText(item.title || item.displayText || 'Point', 70),
        displayText: cleanText(item.displayText || item.title || 'Point', 90),
        body: cleanText(item.body || '', 150),
        renderText: cleanText(item.renderText || item.displayText || item.title || 'Point', 90),
        renderBody: cleanText(item.renderBody || item.body || '', 150),
        assetSearchText: cleanText(item.assetSearchText || item.displayText || item.sourceText || '', 220),
        sourceText: cleanText(item.sourceText || '', 220),
      };
    })
    .filter((item) => item.end > item.start && item.displayText);

  return {
    ...fallback,
    topic,
    summary,
    intent,
    wordCount,
    sourceScript: normalizeEnglishSourceScript(parsed.sourceScript, fallback.sourceScript || originalScript),
    originalScript,
    keyPoints: unique((parsed.keyPoints || fallback.keyPoints || []).map((item) => cleanText(item, 140))).slice(0, 8),
    avoidRepeats: unique((parsed.avoidRepeats || []).map((item) => cleanText(item, 140))).slice(0, 8),
    assetBriefs: (parsed.assetBriefs || [])
      .map((item) => ({
        id: cleanId(item.id || 'asset-brief'),
        timing: cleanText(item.timing || '', 32),
        searchText: cleanText(item.searchText || '', 160),
        visualType: normalizeVisualType(item.visualType),
        priority: normalizeAssetPriority(item.priority),
        usage: normalizeAssetUsage(item.usage),
        title: cleanText(item.title || '', 70),
      }))
      .filter((item) => item.searchText),
    imageUsagePolicy: normalizeImageUsagePolicy(parsed.imageUsagePolicy, fallback.imageUsagePolicy, videoUsePlan.length),
    imageSelectionPlan: normalizeImageSelectionPlan(parsed.imageSelectionPlan, fallback.imageSelectionPlan),
    processSteps: unique((parsed.processSteps || []).map((item) => cleanText(item, 100))).slice(0, 8),
    websites: unique((parsed.websites || []).map((item) => cleanText(item, 80))).slice(0, 6),
    amounts: unique((parsed.amounts || []).map((item) => cleanText(item, 60))).slice(0, 6),
    documents: unique((parsed.documents || []).map((item) => cleanText(item, 80))).slice(0, 8),
    dates: unique((parsed.dates || []).map((item) => cleanText(item, 80))).slice(0, 8),
    warnings: unique((parsed.warnings || []).map((item) => cleanText(item, 140))).slice(0, 6),
    detailBlocks,
    videoUsePlan,
    planningSource: 'ai',
  };
}

function normalizeImageSelectionPlan(
  value: ScriptDetails['imageSelectionPlan'] | undefined,
  fallback: ScriptDetails['imageSelectionPlan'] | undefined,
): NonNullable<ScriptDetails['imageSelectionPlan']> {
  return (value || fallback || [])
    .map((item, index) => ({
      id: cleanId(item.id || `image-need-${index + 1}`),
      timing: cleanText(item.timing || '', 32),
      scenePurpose: normalizeImageScenePurpose(item.scenePurpose),
      imageNeed: cleanText(item.imageNeed || item.bestMatchDescription || '', 100),
      bestMatchDescription: cleanText(item.bestMatchDescription || item.imageNeed || '', 180),
      requiredTags: unique((item.requiredTags || []).map((tag) => cleanText(tag, 40))).slice(0, 8),
      avoidTags: unique((item.avoidTags || []).map((tag) => cleanText(tag, 40))).slice(0, 8),
      assetType: normalizeImageAssetType(item.assetType),
      priority: normalizeAssetPriority(item.priority),
      fallbackVisual: normalizeFallbackVisual(item.fallbackVisual),
      reason: cleanText(item.reason || 'This visual supports a specific script moment.', 180),
    }))
    .filter((item) => item.imageNeed && item.bestMatchDescription && item.requiredTags.length >= 2)
    .slice(0, 10);
}

function normalizeImageScenePurpose(value: unknown): NonNullable<ScriptDetails['imageSelectionPlan']>[number]['scenePurpose'] {
  if (value === 'hook' || value === 'proof' || value === 'process' || value === 'warning' || value === 'cta' || value === 'context') return value;
  return 'context';
}

function normalizeImageAssetType(value: unknown): NonNullable<ScriptDetails['imageSelectionPlan']>[number]['assetType'] {
  if (value === 'editorial_photo' || value === 'cinematic_image' || value === 'screenshot' || value === 'generated_image' || value === 'template_visual') return value;
  return 'editorial_photo';
}

function normalizeFallbackVisual(value: unknown): NonNullable<ScriptDetails['imageSelectionPlan']>[number]['fallbackVisual'] {
  if (value === 'typography_card' || value === 'clean_icon_callout' || value === 'notes_card' || value === 'skip_image') return value;
  return 'typography_card';
}

function normalizeImageUsagePolicy(
  value: ScriptDetails['imageUsagePolicy'] | undefined,
  fallback: ScriptDetails['imageUsagePolicy'] | undefined,
  plannedSceneCount: number,
): NonNullable<ScriptDetails['imageUsagePolicy']> {
  const defaultMax = Math.max(1, Math.min(8, plannedSceneCount || 6));
  const minImages = clamp(Math.round(Number(value?.minImages ?? fallback?.minImages ?? 1)), 0, defaultMax);
  const maxImages = clamp(Math.round(Number(value?.maxImages ?? fallback?.maxImages ?? defaultMax)), Math.max(1, minImages), 10);
  const recommendedImages = clamp(
    Math.round(Number(value?.recommendedImages ?? fallback?.recommendedImages ?? Math.ceil((minImages + maxImages) / 2))),
    minImages,
    maxImages,
  );
  const selectionRules = unique((value?.selectionRules || fallback?.selectionRules || [])
    .map((item) => cleanText(item, 140)))
    .slice(0, 6);
  return {
    minImages,
    maxImages,
    recommendedImages,
    reason: cleanText(value?.reason || fallback?.reason || 'Use images only when they clearly support the script meaning.', 220),
    selectionRules: selectionRules.length >= 2
      ? selectionRules
      : [
          'Use images only for scenes with clear visual meaning.',
          'If an accurate image is unavailable, use typography or a content card.',
        ],
  };
}

function normalizeEnglishSourceScript(value: unknown, fallback: string) {
  const source = cleanText(value, 8000);
  if (source.split(/\s+/).filter(Boolean).length >= 18) return source;
  return cleanText(fallback, 8000);
}

function normalizeVisualType(value: unknown): NonNullable<ScriptDetails['assetBriefs']>[number]['visualType'] {
  if (
    value === 'editorial_photo' ||
    value === 'video_clip' ||
    value === 'screenshot' ||
    value === 'icon_callout' ||
    value === 'notes_doodle' ||
    value === 'typography'
  ) return value;
  return 'typography';
}

function normalizeAssetPriority(value: unknown): NonNullable<ScriptDetails['assetBriefs']>[number]['priority'] {
  if (value === 'high' || value === 'medium' || value === 'low') return value;
  return 'medium';
}

function normalizeAssetUsage(value: unknown): NonNullable<ScriptDetails['assetBriefs']>[number]['usage'] {
  if (value === 'background' || value === 'supporting' || value === 'mainVisual' || value === 'overlay') return value;
  return 'supporting';
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

function normalizeIntent(value: unknown, fallback: ScriptDetails['intent']): ScriptDetails['intent'] {
  if (value === 'apply' || value === 'download' || value === 'check' || value === 'learn' || value === 'prepare' || value === 'general') return value;
  return fallback;
}

function normalizeBlockType(value: unknown): ScriptDetailBlockType {
  if (
    value === 'processList' ||
    value === 'websiteBox' ||
    value === 'amountBox' ||
    value === 'documentList' ||
    value === 'dateBox' ||
    value === 'warningBox' ||
    value === 'factBox'
  ) return value;
  return 'factBox';
}

function normalizePurpose(value: unknown, index: number, total: number): NonNullable<ScriptDetails['videoUsePlan']>[number]['purpose'] {
  if (index === 0) return 'hook' as const;
  if (index === total - 1) return 'cta' as const;
  if (value === 'date' || value === 'proof' || value === 'warning' || value === 'action' || value === 'point') return value;
  return 'point' as const;
}

function normalizePlanLayout(
  value: unknown,
  purpose: unknown,
  detailType: unknown,
  index: number,
  total: number,
): NonNullable<ScriptDetails['videoUsePlan']>[number]['layout'] {
  if (
    value === 'hookCard' ||
    value === 'statCard' ||
    value === 'warningCard' ||
    value === 'splitExplainer' ||
    value === 'checklistCard' ||
    value === 'quoteCard' ||
    value === 'ctaCard'
  ) return value;
  if (index === 0 || purpose === 'hook') return 'hookCard';
  if (index === total - 1 || purpose === 'cta') return 'ctaCard';
  if (purpose === 'warning' || detailType === 'warningBox') return 'warningCard';
  if (purpose === 'date' || detailType === 'dateBox' || detailType === 'amountBox') return 'statCard';
  if (detailType === 'processList' || detailType === 'documentList') return 'checklistCard';
  if (purpose === 'proof') return 'quoteCard';
  return 'splitExplainer';
}

function normalizePlanAnimation(
  value: unknown,
  purpose: unknown,
  detailType: unknown,
): NonNullable<ScriptDetails['videoUsePlan']>[number]['animation'] {
  if (value === 'popIn' || value === 'fadeUp' || value === 'slideUp' || value === 'countUp' || value === 'pulse' || value === 'none') return value;
  if (purpose === 'hook') return 'popIn';
  if (purpose === 'date' || detailType === 'dateBox' || detailType === 'amountBox') return 'countUp';
  if (purpose === 'warning' || detailType === 'warningBox') return 'pulse';
  if (purpose === 'cta') return 'slideUp';
  return 'fadeUp';
}

function normalizePlanEmotion(
  value: unknown,
  purpose: unknown,
): NonNullable<ScriptDetails['videoUsePlan']>[number]['emotion'] {
  if (value === 'urgent' || value === 'informative' || value === 'serious' || value === 'motivational' || value === 'neutral') return value;
  if (purpose === 'hook') return 'urgent';
  if (purpose === 'warning') return 'serious';
  if (purpose === 'cta') return 'motivational';
  if (purpose === 'proof' || purpose === 'point') return 'informative';
  return 'neutral';
}

function defaultPlanVisual(purpose: unknown, detailType: unknown) {
  if (purpose === 'hook') return 'large hook with dominant visual';
  if (purpose === 'date' || detailType === 'dateBox') return 'date or deadline emphasis';
  if (detailType === 'amountBox') return 'amount or fee emphasis';
  if (purpose === 'warning' || detailType === 'warningBox') return 'warning callout';
  if (detailType === 'processList') return 'step checklist';
  if (detailType === 'documentList') return 'document checklist';
  if (purpose === 'cta') return 'final action card';
  return 'clean explainer text';
}

function cleanText(value: unknown, maxChars: number) {
  return String(value || '')
    .replace(/[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars);
}

function cleanSourceTranscript(value: unknown, maxChars: number) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars);
}

function cleanId(value: string) {
  return cleanText(value, 48).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'script-detail';
}

function countWords(value: string) {
  return cleanSourceTranscript(value, 20_000).split(/\s+/).filter(Boolean).length;
}

function unique(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values.filter(Boolean)) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
