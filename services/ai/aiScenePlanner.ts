import { z } from 'zod';
import {
  NarrativeSceneType,
  VisualLayoutType,
  SceneBlueprintItem,
  FullVideoSceneBlueprint,
} from './sceneBlueprintTypes';
import { planVisualAssetsForSentence, generateCleanConceptHeading, generateCleanTakeaway } from './assetPlanner';
import {
  analyzeTypographyContent,
  TypographyLayoutMode,
} from '../typography/responsiveLayoutEngine';
import {
  buildDeterministicSentenceTimeline,
  type TimelineSegment,
  type RawSegmentInput,
} from './sentenceTimelineBuilder';

export type TranscriptChunk = {
  text: string;
  start: number;
  end: number;
  words?: Array<{ word: string; start: number; end: number }>;
};

export type ScenePlannerOptions = {
  title?: string;
  headingFont?: string;
  bodyFont?: string;
  backgroundTheme?: string;
};

export const ALL_VISUAL_LAYOUTS: VisualLayoutType[] = [
  'full_bleed_visual',
  'chapter_title',
  'card_concept',
  'big_typography',
  'stat_card',
  'split_screen',
  'image_text',
  'screenshot_highlight',
  'comparison',
  'timeline',
  'checklist',
  'quote',
  'numbered_point',
  'fullscreen_statement',
  'data_visualization',
  'broll_overlay',
];

export function normalizeVisualLayout(input?: string): VisualLayoutType {
  if (!input) return 'full_bleed_visual';
  const clean = input.trim();
  switch (clean) {
    case 'fullImage':
    case 'fullClip':
    case 'full_bleed_visual':
    case 'fullscreen_statement':
      return 'full_bleed_visual';
    case 'broll_overlay':
      return 'broll_overlay';
    case 'splitImageText':
    case 'side_by_side':
    case 'split_screen':
    case 'image_text':
    case 'cardIconKeyword':
    case 'card_concept':
    case 'bigKeyword':
    case 'big_typography':
      return 'full_bleed_visual';
    case 'quote':
      return 'quote';
    case 'iconList':
    case 'checklist':
      return 'checklist';
    case 'stat':
    case 'stat_card':
      return 'stat_card';
    case 'chart':
    case 'diagram':
    case 'data_visualization':
      return 'data_visualization';
    case 'comparison':
      return 'comparison';
    case 'chapterTitle':
    case 'chapter_title':
      return 'chapter_title';
    case 'screenshot_highlight':
    case 'web_mockup':
      return 'screenshot_highlight';
    case 'image_text':
      return 'image_text';
    default:
      return 'full_bleed_visual';
  }
}

// Common stop words to exclude when picking kinetic emphasis keywords
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'is', 'was', 'are', 'were', 'been', 'be', 'has', 'have', 'had', 'do', 'does', 'did',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'that', 'this', 'these', 'those', 'it', 'its', 'you', 'your', 'we', 'our', 'he',
  'his', 'she', 'her', 'they', 'their', 'them', 'who', 'which', 'what', 'where', 'when',
  'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't',
  // Hinglish common stop words
  'mein', 'ka', 'ki', 'ke', 'se', 'ko', 'par', 'aur', 'yeh', 'woh', 'hai', 'hain',
  'tha', 'the', 'thi', 'kar', 'raha', 'rahe', 'rahi', 'nahi', 'na', 'toh', 'bhi',
  'ab', 'jab', 'tab', 'kya', 'kyu', 'kaise', 'hum', 'aap', 'tum', 'unka', 'inka',
  'apna', 'apne', 'apni', 'hoga', 'hogi', 'hoge', 'karo', 'kare', 'karein'
]);

/**
 * Extracts 1-2 punchy kinetic keywords from a narration phrase for word emphasis
 */
export function extractKeywordEmphasis(text: string, count: number = 2): string[] {
  if (!text) return [];
  const rawWords = text
    .split(/\s+/)
    .map((w) => w.replace(/[^\w$%₹]/g, '').trim())
    .filter(Boolean);

  if (rawWords.length === 0) return [];
  if (rawWords.length <= count) return rawWords;

  // Score candidate words
  const candidates = rawWords.map((word) => {
    const lower = word.toLowerCase();
    let score = 0;
    if (STOP_WORDS.has(lower)) {
      score -= 100;
    }
    // High value for currency and stats
    if (/[0-9$%₹]/.test(word)) score += 50;
    // Proper nouns or capitalized words
    if (/^[A-Z][a-z]+/.test(word)) score += 20;
    // Informative word length bonus
    score += Math.min(15, word.length * 2);

    return { word, score };
  });

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, count).map((c) => c.word);
}

// ── ZOD SCHEMAS FOR STRICT GEMINI BLUEPRINT VALIDATION ──
const NarrativeSceneTypeSchema = z.enum([
  'hook',
  'context',
  'main_point',
  'explanation',
  'example_stat',
  'emphasis',
  'transition',
  'next_point',
]);

const VisualLayoutTypeSchema = z.enum([
  'full_bleed_visual',
  'chapter_title',
  'card_concept',
  'big_typography',
  'stat_card',
  'split_screen',
  'image_text',
  'screenshot_highlight',
  'comparison',
  'timeline',
  'checklist',
  'quote',
  'numbered_point',
  'fullscreen_statement',
  'data_visualization',
  'broll_overlay',
]);

const SceneBlueprintItemSchema = z.object({
  sceneNumber: z.number().int().positive().optional().default(1),
  sceneType: NarrativeSceneTypeSchema.optional().default('main_point'),
  layoutType: VisualLayoutTypeSchema.optional().default('full_bleed_visual'),
  duration: z.number().positive(),
  narrationSegment: z.object({
    text: z.string(),
    startSeconds: z.number(),
    endSeconds: z.number().optional(),
  }),
  heading: z.string().optional().default('KEY INSIGHT'),
  supportingText: z.string().optional().default(''),
  highlightedWords: z.array(z.string()).optional().default([]),
  visualAssetRequirement: z.string().optional().default(''),
  visualIntent: z.string().optional().default(''),
  brollSearchQuery: z.string().optional().default(''),
  background: z.string().optional().default('studio-white'),
  fontHierarchy: z
    .object({
      headingFont: z.string().optional().default('Montserrat'),
      bodyFont: z.string().optional().default('Plus Jakarta Sans'),
    })
    .optional()
    .default({ headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' }),
  animation: z.string().optional().default('slow_zoom_in'),
  SFX: z.enum(['pop', 'woosh', 'whoosh', 'chime', 'rise', 'hit', 'ding', 'none']).optional().default('none'),
  transition: z.enum(['cut', 'dissolve', 'crossfade', 'zoom', 'wipe', 'slide', 'whip', 'fade_to_black']).optional().default('cut'),
  statValue: z.string().optional(),
  statLabel: z.string().optional(),
  quoteAuthor: z.string().optional(),
  listItems: z.array(z.string()).optional(),
  chartValuePercent: z.number().optional(),
  numberBadge: z.number().optional(),
});

export const FullVideoBlueprintSchema = z.object({
  title: z.string().optional().default('Professional Faceless Video'),
  overallNarrativeMood: z.string().optional().default('High Engagement Dynamic Presentation'),
  totalDurationSeconds: z.number().positive().optional().default(60),
  totalScenes: z.number().int().positive().optional().default(1),
  scenes: z.array(SceneBlueprintItemSchema).min(1),
});

/**
 * Editorial Pacing Engine (Phase 1 Rules):
 * 1. Max Shot: 8 seconds (subdivide longer segments into snappy visual beats).
 * 2. Anti-Repetition: Never repeat the exact same layout twice consecutively.
 * 3. Graphic Cadence: Every 4 to 5 image scenes, inject a non-image graphic (stat, chart, quote, checklist).
 * 4. Keyword Emphasis: 1-2 kinetic highlighted words per scene.
 * 5. Cut Frequency: 60% simple cuts, chapter changes whip/zoom.
 */
export function enforceEditorialPacingRules(
  blueprint: FullVideoSceneBlueprint,
  options: ScenePlannerOptions = {}
): FullVideoSceneBlueprint {
  if (!blueprint || !Array.isArray(blueprint.scenes) || blueprint.scenes.length === 0) {
    return blueprint;
  }

  const rawScenes = blueprint.scenes;
  const processedScenes: SceneBlueprintItem[] = [];
  const MAX_SHOT_DURATION = 8.0;

  // 1. Enforce Max Shot Duration <= 8 seconds by splitting longer scenes into snappy multi-beats
  for (let i = 0; i < rawScenes.length; i++) {
    const scene = rawScenes[i];
    const duration = Math.max(1, scene.duration || (scene.narrationSegment.endSeconds ? scene.narrationSegment.endSeconds - scene.narrationSegment.startSeconds : 5));

    if (duration > MAX_SHOT_DURATION) {
      const parts = Math.ceil(duration / MAX_SHOT_DURATION);
      const partDuration = Math.round((duration / parts) * 10) / 10;
      const words = (scene.narrationSegment.text || '').split(/\s+/).filter(Boolean);
      const wordsPerPart = Math.ceil(words.length / parts);

      let currentStart = scene.narrationSegment.startSeconds;

      for (let p = 0; p < parts; p++) {
        const partEnd = Math.min(
          scene.narrationSegment.endSeconds || (scene.narrationSegment.startSeconds + duration),
          currentStart + partDuration
        );
        const partWords = words.slice(p * wordsPerPart, (p + 1) * wordsPerPart);
        const partText = partWords.join(' ') || scene.narrationSegment.text;

        // Alternate layouts for split beats (e.g. Beat 1: Full-Bleed Visual, Beat 2: Stat / Graphic)
        let subLayout: VisualLayoutType = scene.layoutType;
        if (p % 2 === 1) {
          if (subLayout === 'full_bleed_visual' || subLayout === 'split_screen') {
            subLayout = 'stat_card';
          } else {
            subLayout = 'full_bleed_visual';
          }
        }

        const emphasis = extractKeywordEmphasis(partText, 2);

        processedScenes.push({
          ...scene,
          sceneNumber: processedScenes.length + 1,
          sceneType: p === 0 ? scene.sceneType : 'emphasis',
          layoutType: subLayout,
          duration: partDuration,
          narrationSegment: {
            text: partText,
            startSeconds: currentStart,
            endSeconds: partEnd,
          },
          heading: p === 0 ? generateCleanConceptHeading(scene.heading) : generateCleanConceptHeading(partText),
          supportingText: p === 0 ? generateCleanTakeaway(scene.supportingText || scene.narrationSegment?.text || '', scene.heading) : generateCleanTakeaway(partText, scene.heading),
          highlightedWords: emphasis.length > 0 ? emphasis : scene.highlightedWords,
          transition: p === 0 ? scene.transition : 'cut', // Fast cut within split beats
          SFX: p === 0 ? scene.SFX : 'pop',
        });

        currentStart = partEnd;
      }
    } else {
      const emphasis = (scene.highlightedWords && scene.highlightedWords.length > 0)
        ? scene.highlightedWords
        : extractKeywordEmphasis(scene.narrationSegment?.text || scene.heading, 2);

      processedScenes.push({
        ...scene,
        sceneNumber: processedScenes.length + 1,
        duration,
        highlightedWords: emphasis,
      });
    }
  }

  // 2. Enforce Anti-Repetition (No consecutive same layout) & Graphic Diversity (1 non-image per 4-5 scenes)
  const imageLayouts = new Set<VisualLayoutType>([
    'full_bleed_visual',
    'image_text',
    'split_screen',
    'card_concept',
    'broll_overlay',
    'screenshot_highlight',
  ]);
  const nonImageLayoutPool: VisualLayoutType[] = [
    'stat_card',
    'checklist',
    'quote',
    'data_visualization',
    'big_typography',
    'chapter_title',
  ];

  let consecutiveImageCount = 0;

  for (let i = 0; i < processedScenes.length; i++) {
    const current = processedScenes[i];
    const prev = i > 0 ? processedScenes[i - 1] : null;

    // Rule: Same layout type lagatar 2 baar nahi
    if (prev && current.layoutType === prev.layoutType) {
      if (imageLayouts.has(current.layoutType)) {
        // Swap to contrasting graphic layout
        current.layoutType = nonImageLayoutPool[(i + 1) % nonImageLayoutPool.length];
      } else {
        // Swap to cinematic full-bleed visual or split screen
        current.layoutType = i % 2 === 0 ? 'full_bleed_visual' : 'split_screen';
      }
    }

    // Track consecutive image scenes
    if (imageLayouts.has(current.layoutType)) {
      consecutiveImageCount++;
      // Rule: Har 4-5 scenes mein ek non-image scene zaroor hona chahiye
      if (consecutiveImageCount >= 4) {
        current.layoutType = nonImageLayoutPool[(i * 3) % nonImageLayoutPool.length];
        consecutiveImageCount = 0;
      }
    } else {
      consecutiveImageCount = 0;
    }

    // Enrich layout metadata if converted to specialized graphic layout
    if (current.layoutType === 'stat_card' && !current.statValue) {
      current.statValue = current.highlightedWords[0] ? `${current.highlightedWords[0].toUpperCase()}` : '98.4%';
      current.statLabel = current.heading || 'KEY PERFORMANCE METRIC';
    } else if (current.layoutType === 'checklist' && (!current.listItems || current.listItems.length < 2)) {
      current.listItems = [
        current.heading || 'Primary strategic driver',
        current.supportingText || 'Key execution milestone',
        'Long-term sustainable outcome',
      ];
    } else if (current.layoutType === 'quote' && !current.quoteAuthor) {
      current.quoteAuthor = undefined;
    } else if (current.layoutType === 'data_visualization' && !current.chartValuePercent) {
      current.chartValuePercent = Math.min(95, 60 + ((i * 11) % 35));
    }

    // Transition & SFX polish:
    // Long-form retention: 60% simple cuts, chapter changes whip/zoom
    if (i === 0) {
      current.transition = 'zoom';
      current.SFX = 'rise';
    } else if (current.layoutType === 'chapter_title' || current.sceneType === 'transition') {
      current.transition = 'zoom';
      current.SFX = 'rise';
    } else if (current.layoutType === 'stat_card' || current.layoutType === 'data_visualization') {
      current.transition = 'cut';
      current.SFX = 'hit';
    } else if (current.layoutType === 'checklist') {
      current.transition = 'slide';
      current.SFX = 'pop';
    } else if (i === processedScenes.length - 1) {
      current.transition = 'fade_to_black';
      current.SFX = 'none';
    } else {
      // 70% simple cuts, 30% dissolves
      current.transition = i % 3 === 0 ? 'dissolve' : 'cut';
      if (i % 4 === 0 && current.SFX === 'none') {
        current.SFX = 'woosh';
      }
    }
  }

  const finalDuration = processedScenes.reduce((acc, s) => acc + s.duration, 0);

  return {
    title: blueprint.title || options.title || 'Professional Faceless Video',
    overallNarrativeMood: blueprint.overallNarrativeMood || 'High Engagement Dynamic Presentation',
    totalDurationSeconds: Math.round(finalDuration),
    totalScenes: processedScenes.length,
    scenes: processedScenes,
  };
}

/**
 * Deterministic local parser that converts transcript chunks into a structured
 * 12-stage narrative Scene Blueprint JSON fallback using the sentence timeline engine.
 * 
 * Guarantee: "Time code decide kare, AI nahi."
 */
export function buildDeterministicSceneBlueprint(
  transcript: TranscriptChunk[],
  options: ScenePlannerOptions = {}
): FullVideoSceneBlueprint {
  if (!transcript || transcript.length === 0) {
    return {
      title: options.title || 'Untitled Video',
      overallNarrativeMood: 'Professional Explainer',
      totalDurationSeconds: 0,
      totalScenes: 0,
      scenes: [],
    };
  }

  const timelineSegments = buildDeterministicSentenceTimeline(transcript);
  const headingFont = options.headingFont || 'Montserrat';
  const bodyFont = options.bodyFont || 'Plus Jakarta Sans';
  const backgroundTheme = options.backgroundTheme || 'midnight-mesh';

  const scenes: SceneBlueprintItem[] = [];

  for (let i = 0; i < timelineSegments.length; i++) {
    const seg = timelineSegments[i];
    const text = seg.text.trim();
    const assetPlan = planVisualAssetsForSentence(text);
    const typographyAnalysis = analyzeTypographyContent(text);

    let layoutType: VisualLayoutType = 'full_bleed_visual';
    let sfx: 'pop' | 'woosh' | 'whoosh' | 'chime' | 'rise' | 'hit' | 'ding' | 'none' = 'none';

    // ── High-Engagement Full-Bleed Scene Architecture ──
    // All image/media scenes use 100% FULL SCREEN (1920x1080 Edge-to-Edge) per founder directive
    const hasRealMetric = /(\$|€|£|₹)\s*\d+|\b\d+(?:\.\d+)?\s*(%|percent|x|times|crore|lakh|million|billion)\b/i.test(text);

    if (i === 0) {
      layoutType = 'full_bleed_visual';
      sfx = 'rise';
    } else if (hasRealMetric && typographyAnalysis.statData?.value) {
      layoutType = 'stat_card';
      sfx = 'hit';
    } else if (text.toLowerCase().includes(' vs ') || text.toLowerCase().includes('versus') || text.toLowerCase().includes('instead of')) {
      layoutType = 'comparison';
      sfx = 'hit';
    } else if (typographyAnalysis.layoutMode === 'list' && typographyAnalysis.listItems && typographyAnalysis.listItems.length >= 3) {
      layoutType = 'checklist';
      sfx = 'pop';
    } else {
      // 100% of image/video scenes are Full Bleed Cinematic B-Roll (Zero PPT box feeling)
      layoutType = 'full_bleed_visual';
      sfx = i % 3 === 0 ? 'woosh' : 'none';
    }

    if (sfx === 'none' && i % 4 === 0) {
      sfx = 'woosh';
    }

    const keywords = (assetPlan.highlightedWords && assetPlan.highlightedWords.length > 0)
      ? assetPlan.highlightedWords
      : extractKeywordEmphasis(text, 2);

    scenes.push({
      sceneNumber: seg.id,
      sceneType: seg.isChapterStart && seg.id > 1 ? 'hook' : 'main_point',
      layoutType,
      duration: seg.duration,
      narrationSegment: {
        text,
        startSeconds: seg.start,
        endSeconds: seg.end,
      },
      heading: generateCleanConceptHeading(text),
      supportingText: typographyAnalysis.suggestedSupportingText || assetPlan.suggestedSupportingText || generateCleanTakeaway(text, ''),
      highlightedWords: keywords,
      visualAssetRequirement: assetPlan.brollSearchQuery || '',
      visualIntent: assetPlan.visualIntent || 'cinematic visual',
      brollSearchQuery: assetPlan.brollSearchQuery || '',
      background: backgroundTheme,
      fontHierarchy: {
        headingFont,
        bodyFont,
      },
      animation: assetPlan.motion || 'slow_zoom_in',
      SFX: sfx,
      transition: seg.isChapterStart ? 'zoom' : i % 3 === 0 ? 'dissolve' : 'cut',
      typographyTreatment: typographyAnalysis.layoutMode,
      listItems: typographyAnalysis.listItems,
      statValue: (hasRealMetric && typographyAnalysis.statData?.value) ? typographyAnalysis.statData.value : undefined,
      statLabel: (hasRealMetric && typographyAnalysis.statData?.value) ? (typographyAnalysis.statData.label || typographyAnalysis.suggestedHeading) : undefined,
      statTrend: typographyAnalysis.statData?.trend,
      quoteAuthor: typographyAnalysis.quoteData?.author || undefined,
      numberBadge: seg.chapterNumber,
      chartValuePercent: Math.min(95, 60 + ((i * 7) % 35)),
    });
  }

  const rawBlueprint: FullVideoSceneBlueprint = {
    title: options.title || 'Professional Faceless Video',
    overallNarrativeMood: 'High Engagement Dynamic Presentation',
    totalDurationSeconds: Math.round(timelineSegments[timelineSegments.length - 1].end - timelineSegments[0].start),
    totalScenes: scenes.length,
    scenes,
  };

  return enforceEditorialPacingRules(rawBlueprint, options);
}

/**
 * Main AI Scene Planner function.
 * 
 * Strict Architecture:
 * 1. Timeline is constructed 100% deterministically in code (zero AI for timecodes).
 * 2. Segments are chunked into chapters (10-12 segments per call) to support up to 10 minutes seamlessly.
 * 3. AI ONLY decides creative visual layout, heading, keyword emphasis, and SFX cue.
 * 4. Code maps AI decisions directly back to the exact frame-accurate audio timestamps.
 */
export async function generateStructuredSceneBlueprint(
  transcript: TranscriptChunk[],
  options: ScenePlannerOptions = {}
): Promise<FullVideoSceneBlueprint> {
  if (!transcript || transcript.length === 0) {
    return buildDeterministicSceneBlueprint(transcript, options);
  }

  // 1. Build frame-accurate sentence timeline strictly in code
  const timelineSegments = buildDeterministicSentenceTimeline(transcript);
  if (timelineSegments.length === 0) {
    return buildDeterministicSceneBlueprint(transcript, options);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return buildDeterministicSceneBlueprint(transcript, options);
  }

  const headingFont = options.headingFont || 'Montserrat';
  const bodyFont = options.bodyFont || 'Plus Jakarta Sans';
  const backgroundTheme = options.backgroundTheme || 'purple-vignette';

  // 2. Chapter-wise chunking (10-12 segments per batch to stay within token limits for 10-minute videos)
  const CHUNK_SIZE = 12;
  const chunkCount = Math.ceil(timelineSegments.length / CHUNK_SIZE);
  const plannedScenes: SceneBlueprintItem[] = [];
  let prevLayouts: string[] = ['full_bleed_visual'];

  for (let c = 0; c < chunkCount; c++) {
    const chunkSegments = timelineSegments.slice(c * CHUNK_SIZE, (c + 1) * CHUNK_SIZE);
    const chunkDecisions: Map<number, any> = new Map();

    try {
      const prompt = `You are an elite YouTube director and motion graphics art director for high-retention faceless explainer videos (Vox, Johnny Harris, Magnates Media style).

Analyze these pre-cut narration segments and assign the best visual layout, keywords, and sound effect for each segment.

CRITICAL EDITORIAL RULES:
1. FULL-BLEED VISUALS (PRIMARY): At least 40% of scenes MUST use 'full_bleed_visual' with subtle continuous Ken Burns pan/zoom (alternating between stock video clips and images).
2. CLEAN LAYOUTS (NO UI JUNK): Avoid adding micro-icons, fake browser window controls, or meta-badges around images/cards. Keep overlays strictly clean and minimal.
3. NO CONSECUTIVE DUPLICATES: Never assign the exact same layout type 2 times in a row. Previous layouts were: ${JSON.stringify(prevLayouts)}.
4. SCENE VARIETY: Every 4 to 5 scenes, you MUST inject at least one high-impact non-image graphic scene (stat_card, checklist, quote, comparison, data_visualization, big_typography).
5. CHAPTER HEADERS: If isChapterStart is true, use 'chapter_title' layout with 'rise' SFX.
6. EMPHASIS KEYWORDS: For every scene, choose 1 or 2 punchy, highest-impact keywords in "highlightedWords" for kinetic text glow / handwriting marker draw.
7. SFX PACING: Use 'whoosh' on ~1/3 of cuts, 'pop' on text/checklist items, 'rise' on chapter headers, 'hit' on key stats. Use 'none' on ordinary scenes.

Available Visual Layout Types:
- full_bleed_visual (90%+ of video: full-screen 1920x1080 cinematic video/photo with continuous pan/zoom Ken Burns motion and clean contrast headline)
- chapter_title (cinematic chapter header with chapter number and big title)
- stat_card (strictly for real metrics with numbers: e.g. $10M, 85%, 3.5x)
- checklist (bullet items, 3 pillars, steps)
- comparison (versus, before vs after, pros vs cons)

Segments to plan:
${JSON.stringify(chunkSegments.map((s) => ({ segmentId: s.id, text: s.text, isChapterStart: s.isChapterStart, chapterNumber: s.chapterNumber })), null, 2)}

Return a strict JSON object with this EXACT structure:
{
  "scenes": [
    {
      "segmentId": 1,
      "layoutType": "full_bleed_visual",
      "heading": "COMPLETE CONCEPT TITLE (2-4 WORDS, E.G. 'FINANCIAL FREEDOM', NEVER END IN 'AND'/'FOR'/'JUST')",
      "supportingText": "Crisp 4-6 word takeaway concept",
      "highlightedWords": ["keyword1"],
      "visualAssetRequirement": "Stock b-roll visual description",
      "brollSearchQuery": "stock search query",
      "sfx": "whoosh",
      "statValue": "+37%",
      "statLabel": "Annual Growth",
      "quoteAuthor": "Author Name"
    }
  ]
}`;

      const modelName = (process.env.GEMINI_MODEL || 'gemini-flash-latest').trim();
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (Array.isArray(parsed?.scenes)) {
            parsed.scenes.forEach((sc: any) => {
              if (sc?.segmentId) {
                chunkDecisions.set(sc.segmentId, sc);
              }
            });
          }
        }
      }
    } catch (chunkErr) {
      console.warn(`[AIScenePlanner] Chapter batch ${c + 1}/${chunkCount} AI error, using deterministic rules:`, chunkErr);
    }

    // Merge AI decisions with the EXACT deterministic timecodes
    chunkSegments.forEach((seg, sIdx) => {
      const decision = chunkDecisions.get(seg.id);
      const text = seg.text;
      const assetPlan = planVisualAssetsForSentence(text);
      const typographyAnalysis = analyzeTypographyContent(text);

      const hasRealMetric = /(\$|€|£|₹)\s*\d+|\b\d+(?:\.\d+)?\s*(%|percent|x|times|crore|lakh|million|billion)\b/i.test(text);

      let chosenLayout: VisualLayoutType = decision
        ? normalizeVisualLayout(decision.layoutType || decision.layout)
        : 'full_bleed_visual';
      if (!decision) {
        // Fallback decision for this segment
        if (seg.isChapterStart) chosenLayout = 'chapter_title';
        else if (hasRealMetric && typographyAnalysis.statData?.value) chosenLayout = 'stat_card';
        else if (typographyAnalysis.layoutMode === 'list' && typographyAnalysis.listItems && typographyAnalysis.listItems.length >= 3) chosenLayout = 'checklist';
        else chosenLayout = 'full_bleed_visual';
      }

      const safeStatVal = (hasRealMetric && (decision?.statValue || typographyAnalysis.statData?.value))
        ? (decision?.statValue || typographyAnalysis.statData?.value)
        : undefined;
      const safeStatLbl = safeStatVal ? (decision?.statLabel || typographyAnalysis.statData?.label) : undefined;

      const keywords = (decision?.highlightedWords && decision.highlightedWords.length > 0)
        ? decision.highlightedWords
        : extractKeywordEmphasis(text, 2);

      let sfx = decision?.sfx || 'none';
      if (sfx === 'none') {
        if (seg.isChapterStart) sfx = 'rise';
        else if (chosenLayout === 'stat_card') sfx = 'hit';
        else if (sIdx % 4 === 0) sfx = 'woosh';
      }

      plannedScenes.push({
        sceneNumber: seg.id,
        sceneType: seg.isChapterStart && seg.id > 1 ? 'hook' : 'main_point',
        layoutType: chosenLayout,
        duration: seg.duration,
        narrationSegment: {
          text: seg.text,
          startSeconds: seg.start,
          endSeconds: seg.end,
        },
        heading: generateCleanConceptHeading(decision?.heading || text),
        supportingText: decision?.supportingText || typographyAnalysis.suggestedSupportingText || assetPlan.suggestedSupportingText || generateCleanTakeaway(text, ''),
        highlightedWords: keywords,
        visualAssetRequirement: decision?.visualAssetRequirement || assetPlan.brollSearchQuery || '',
        visualIntent: decision?.visualAssetRequirement || assetPlan.visualIntent || 'cinematic visual',
        brollSearchQuery: decision?.brollSearchQuery || decision?.visualAssetRequirement || assetPlan.brollSearchQuery || '',
        background: backgroundTheme,
        fontHierarchy: { headingFont, bodyFont },
        animation: 'slow_zoom_in',
        SFX: sfx,
        transition: seg.isChapterStart ? 'zoom' : sIdx % 3 === 0 ? 'dissolve' : 'cut',
        statValue: safeStatVal,
        statLabel: safeStatLbl,
        quoteAuthor: decision?.quoteAuthor || typographyAnalysis.quoteData?.author,
        listItems: decision?.listItems || typographyAnalysis.listItems,
        chartValuePercent: decision?.chartValuePercent || Math.min(95, 60 + ((seg.id * 7) % 35)),
        numberBadge: seg.chapterNumber,
      });

      prevLayouts.push(chosenLayout);
      if (prevLayouts.length > 3) prevLayouts.shift();
    });
  }

  const rawBlueprint: FullVideoSceneBlueprint = {
    title: options.title || 'Professional Faceless Video',
    overallNarrativeMood: 'High Engagement Dynamic Presentation',
    totalDurationSeconds: Math.round(timelineSegments[timelineSegments.length - 1].end - timelineSegments[0].start),
    totalScenes: plannedScenes.length,
    scenes: plannedScenes,
  };

  return enforceEditorialPacingRules(rawBlueprint, options);
}
