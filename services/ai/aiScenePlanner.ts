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
  'prompt_window',
  'calendar_grid',
  'milestone_ladder',
  'script_bubble',
  'roadmap',
  'vertical_roadmap',
  'workflow',
  'vs_battle',
  'metric_pill',
  'newspaper_headline',
  'stamp_badge',
  'supporting_note',
  'hook',
];

export function normalizeVisualLayout(input?: string): VisualLayoutType {
  if (!input) return 'full_bleed_visual';
  const clean = input.trim();
  switch (clean) {
    case 'fullImage':
    case 'fullClip':
    case 'full_bleed_visual':
      return 'full_bleed_visual';
    case 'broll_overlay':
      return 'broll_overlay';
    case 'fullscreen_statement':
      return 'fullscreen_statement';
    case 'splitImageText':
    case 'side_by_side':
    case 'split_screen':
      return 'split_screen';
    case 'image_text':
      return 'image_text';
    case 'cardIconKeyword':
    case 'card_concept':
      return 'card_concept';
    case 'sticky_note':
    case 'note':
    case 'memo':
      return 'sticky_note';
    case 'numbered_steps':
    case 'steps':
    case 'process_steps':
      return 'numbered_steps';
    case 'social_post':
    case 'tweet':
    case 'post_card':
      return 'social_post';
    case 'chat_dialogue':
    case 'chat':
    case 'dialogue':
    case 'conversation':
      return 'chat_dialogue';
    case 'vector_concept':
    case 'vector_drawing':
    case 'illustration':
      return 'vector_concept';
    case 'search_discovery':
    case 'search_bar':
    case 'typing_search':
      return 'search_discovery';
    case 'donut_breakdown':
    case 'donut_chart':
    case 'pareto':
      return 'donut_breakdown';
    case 'bigKeyword':
    case 'big_typography':
      return 'big_typography';
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
    case 'timeline':
    case 'roadmap':
    case 'milestone':
      return 'timeline';
    case 'chapterTitle':
    case 'chapter_title':
      return 'chapter_title';
    case 'screenshot_highlight':
    case 'web_mockup':
      return 'screenshot_highlight';
    case 'workflow':
    case 'pipeline':
    case 'automation':
      return 'workflow' as any;
    case 'goal_target':
    case 'allocation':
    case 'salary_target':
      return 'goal_target' as any;
    case 'prompt':
    case 'prompt_window':
    case 'code_prompt':
    case 'ai_prompt':
      return 'prompt_window';
    case 'calendar':
    case 'calendar_grid':
    case 'time_block':
    case 'schedule':
      return 'calendar_grid';
    case 'milestone':
    case 'milestone_ladder':
    case 'ladder':
    case 'staircase':
    case 'progression':
      return 'milestone_ladder';
    case 'script_bubble':
    case 'script':
    case 'message':
    case 'outreach':
      return 'script_bubble';
    case 'vs_battle':
    case 'comparison_battle':
    case 'battle_card':
    case 'vs':
      return 'vs_battle';
    case 'metric_pill':
    case 'growth_stat':
    case 'metric_stat':
      return 'metric_pill';
    case 'newspaper_headline':
    case 'breaking_news':
    case 'headline_card':
      return 'newspaper_headline';
    case 'stamp_badge':
    case 'verified_badge':
    case 'stamp':
      return 'stamp_badge';
    case 'supporting_note':
    case 'note_card':
    case 'editorial_note':
      return 'supporting_note';
    case 'vertical_roadmap':
      return 'vertical_roadmap';
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
    .map((w) => w.replace(/[^\p{L}\p{N}$%₹]/gu, '').trim())
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

export const VisualLayoutTypeSchema = z.enum([
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
  'donut_breakdown',
  'sticky_note',
  'numbered_steps',
  'social_post',
  'chat_dialogue',
  'vector_concept',
  'search_discovery',
  'broll_overlay',
  'prompt_window',
  'calendar_grid',
  'milestone_ladder',
  'script_bubble',
  'roadmap',
  'vertical_roadmap',
  'workflow',
  'vs_battle',
  'metric_pill',
  'newspaper_headline',
  'stamp_badge',
  'supporting_note',
  'hook',
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
  englishMeaning: z.string().optional().default(''),
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

  // Visual Graphics Metadata
  chartItems: z.array(z.object({
    label: z.string(),
    value: z.number(),
    formattedValue: z.string().optional(),
    color: z.string().optional(),
  })).optional(),
  donutSlices: z.array(z.object({
    label: z.string(),
    value: z.number(),
    color: z.string().optional(),
  })).optional(),
  chatMessages: z.array(z.object({
    sender: z.enum(['left', 'right']),
    text: z.string(),
  })).optional(),
  searchQuery: z.string().optional(),
  vectorDrawingId: z.string().optional(),
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
  // YouTube high-retention industry benchmark: visual cuts every 3.5 - 4.2 seconds
  const MAX_SHOT_DURATION = 4.2;

  // 1. Enforce Max Shot Duration <= 4.2 seconds by splitting longer narration into snappy visual cuts
  for (let i = 0; i < rawScenes.length; i++) {
    const scene = rawScenes[i];
    const duration = Math.max(1, scene.duration || (scene.narrationSegment.endSeconds ? scene.narrationSegment.endSeconds - scene.narrationSegment.startSeconds : 4));

    if (duration > MAX_SHOT_DURATION) {
      const parts = Math.ceil(duration / MAX_SHOT_DURATION);
      const partDuration = Math.round((duration / parts) * 10) / 10;
      const words = (scene.narrationSegment.text || '').split(/\s+/).filter(Boolean);
      const wordsPerPart = Math.max(1, Math.ceil(words.length / parts));

      let currentStart = scene.narrationSegment.startSeconds;

      for (let p = 0; p < parts; p++) {
        const partEnd = Math.min(
          scene.narrationSegment.endSeconds || (scene.narrationSegment.startSeconds + duration),
          currentStart + partDuration
        );
        const partWords = words.slice(p * wordsPerPart, (p + 1) * wordsPerPart);
        const partText = partWords.join(' ') || scene.narrationSegment.text;

        // Alternate visual layouts across snappy cuts: Vector Concept <-> Split Screen
        const subLayout: VisualLayoutType = p % 2 === 0 ? 'vector_concept' : 'split_screen';

        const emphasis = extractKeywordEmphasis(partText, 2);
        const beatSearchQuery = emphasis.length > 0 ? emphasis.join(' ') : partText.slice(0, 30);

        processedScenes.push({
          ...scene,
          sceneNumber: processedScenes.length + 1,
          sceneType: p === 0 ? scene.sceneType : 'emphasis',
          layoutType: subLayout,
          duration: Math.max(1, partEnd - currentStart),
          narrationSegment: {
            text: partText,
            startSeconds: currentStart,
            endSeconds: partEnd,
          },
          heading: p === 0 ? generateCleanConceptHeading(scene.heading) : generateCleanConceptHeading(partText),
          supportingText: p === 0 ? generateCleanTakeaway(scene.supportingText || scene.narrationSegment?.text || '', scene.heading) : generateCleanTakeaway(partText, scene.heading),
          highlightedWords: emphasis.length > 0 ? emphasis : scene.highlightedWords,
          brollSearchQuery: beatSearchQuery,
          visualAssetRequirement: beatSearchQuery,
          visualIntent: `cinematic b-roll for ${beatSearchQuery}`,
          transition: p === 0 ? scene.transition : 'cut', // Fast cinematic cut within split beats
          SFX: p === 0 ? scene.SFX : 'woosh',
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

  // 2. Soft Repetition Preference: Allow up to 2 consecutive scenes of same layout for narrative flow,
  // but prevent 3 in a row.
  for (let i = 2; i < processedScenes.length; i++) {
    const current = processedScenes[i];
    const prev1 = processedScenes[i - 1];
    const prev2 = processedScenes[i - 2];

    if (current.layoutType === prev1.layoutType && current.layoutType === prev2.layoutType) {
      // Divert 3rd repetition to complementary explanatory layout (vector storytelling or typography)
      if (current.layoutType === 'full_bleed_visual' || current.layoutType === 'vector_concept') {
        current.layoutType = 'big_typography';
      } else if (current.layoutType === 'big_typography') {
        current.layoutType = 'supporting_note';
      } else {
        current.layoutType = 'vector_concept';
      }
    }

    // Strict Chart Evidence Validation: If data_visualization or donut_breakdown lacks valid numbers,
    // gracefully route to vector_concept or supporting_note instead of fabricating fake percentages or crashing.
    if (current.layoutType === 'data_visualization') {
      const hasValidChart = current.chartItems && current.chartItems.length >= 2 && current.chartItems.every(c => c.value > 0);
      if (!hasValidChart) {
        current.layoutType = 'vector_concept';
      }
    } else if (current.layoutType === 'donut_breakdown') {
      const hasValidDonut = current.donutSlices && current.donutSlices.length >= 2 && current.donutSlices.every(s => s.value > 0);
      if (!hasValidDonut) {
        current.layoutType = 'vector_concept';
      }
    } else if (current.layoutType === 'sticky_note') {
      const noteLength = (current.supportingText || current.heading || '').split(/\s+/).length;
      if (noteLength > 25) {
        current.layoutType = 'supporting_note';
      }
    }
  }

  for (let i = 0; i < processedScenes.length; i++) {
    const current = processedScenes[i];
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
      layoutType = 'hook';
      sfx = 'rise';
    } else if (hasRealMetric && typographyAnalysis.statData?.value) {
      layoutType = 'stat_card';
      sfx = 'hit';
    } else if (text.toLowerCase().includes(' vs ') || text.toLowerCase().includes('versus') || text.toLowerCase().includes('instead of')) {
      layoutType = 'comparison';
      sfx = 'hit';
    } else if (typographyAnalysis.layoutMode === 'list' && typographyAnalysis.listItems && typographyAnalysis.listItems.length >= 2) {
      layoutType = 'checklist';
      sfx = 'pop';
    } else if (/roadmap|milestone|step by step|timeline|path|journey/i.test(text)) {
      layoutType = 'roadmap';
      sfx = 'pop';
    } else if (/workflow|pipeline|automation|process|system|funnel/i.test(text)) {
      layoutType = 'workflow';
      sfx = 'pop';
    } else if (seg.isChapterStart && seg.id > 1) {
      layoutType = 'chapter_title';
      sfx = 'rise';
    } else {
      // SVG-First & Kinetic Typography Cadence (90%+ explanatory visual share)
      const svgLayoutCadence: VisualLayoutType[] = [
        'vector_concept',
        'big_typography',
        'vector_concept',
        'supporting_note',
        'vector_concept',
        'numbered_steps',
      ];
      layoutType = svgLayoutCadence[i % svgLayoutCadence.length];
      sfx = 'woosh';
    }

    if ((sfx as string) === 'none' && i % 4 === 0) {
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
      const prompt = `You are an elite motion graphics art director and visual storyboard director for high-retention 9:16 Vertical Shorts (YouTube Shorts, Instagram Reels, TikTok, Vox/Magnates style).

Analyze these pre-cut narration segments and plan the visual storyboard for each segment.

CRITICAL 9:16 VERTICAL MOTION GRAPHICS & SVG RULES:
1. SVG-FIRST STORYTELLING: SVGs and vector graphics must be substantial, full-canvas storytelling elements — NOT tiny icons! Prioritize animated diagrams, flowcharts, timelines, comparisons, funnels, and process maps.
2. DYNAMIC VISUAL PACING: Create visual variety across scenes. Prioritize:
   - 'vector_concept': FULL-BLEED animated SVG diagrams (flowcharts, mind maps, funnels, feedback cycles, timelines, hierarchy pyramids).
   - 'roadmap': Multi-stage timeline or step-by-step milestone progression.
   - 'workflow': Process automation pipeline or system architecture.
   - 'comparison': Side-by-side contrast (before vs after, old vs new, problem vs solution).
   - 'data_visualization' / 'stat_card': Data charts and high-impact metrics.
   - 'numbered_steps' / 'checklist': Sequential steps, pillars, or action points.
   - 'split_screen' / 'card_concept': Kinetic typography cards with geometric accents.
3. REPETITION PREVENTION: Never repeat the exact same layout 3 times in a row. Previous layouts: ${JSON.stringify(prevLayouts)}.
4. METRIC & CHART RIGOR:
   - Use 'data_visualization' ONLY when 2 or more related comparison numbers are explicitly discussed. Provide "chartItems": [{"label": "Before", "value": 10}, {"label": "After", "value": 50}].
   - Use 'donut_breakdown' ONLY for proportional distributions (e.g. 80/20 rule). Provide "donutSlices": [{"label": "Core", "value": 80}, {"label": "Rest", "value": 20}].
   - Use 'stat_card' for single standalone metrics (e.g. $10M, 85%, 3.5x).
   - If NO real numbers exist in the spoken text, DO NOT choose a chart or stat layout!
5. STORYTELLING & UI RIGOR:
   - Use 'social_post' ONLY when narration quotes a tweet or post.
   - Use 'chat_dialogue' ONLY when narration describes a conversation. Provide "chatMessages".
   - Use 'sticky_note' for a punchy mental rule, caution, or memo (<= 20 words).
   - Use 'quote' for memorable quotes or powerful mindset takeaways.
6. CHAPTER HEADERS: If isChapterStart is true and segmentId > 1, use 'chapter_title' layout with 'rise' SFX.
7. EMPHASIS KEYWORDS: For every scene, choose 1 or 2 punchy, highest-impact keywords in "highlightedWords" for kinetic text glow.
8. SFX PACING: Use 'whoosh' on cuts, 'pop' on concepts/reveals, 'rise' on chapter headers, 'hit' on key stats.
9. MULTI-LANGUAGE TRANSLATION: If the narration segment is in Hindi, Hinglish, or regional languages, provide the exact English translation in "englishMeaning".

Available Visual Layout Types (Vertical 9:16 Canvas):
- vector_concept (native 9:16 full-screen animated SVG diagrams: flowchart, funnel, mind map, cycle loop, timeline)
- roadmap (step-by-step milestone progression ladder)
- workflow (process pipeline or system workflow diagram)
- comparison (versus, before vs after, pros vs cons side-by-side)
- split_screen (editorial split with kinetic text and visual accents)
- chapter_title (cinematic chapter header with title)
- stat_card (strictly for a single real metric with number: e.g. $10M, 85%, 3.5x)
- data_visualization (comparison bar chart: requires 2+ explicit numbers in text)
- donut_breakdown (proportional ring: 80/20 rule or allocation breakdown)
- sticky_note (skewed paper memo with tape for punchy rules)
- numbered_steps (vertical 3-step numbered progression card)
- checklist (bullet items, pillars)
- quote (memorable quotes or powerful mindset takeaways)
- social_post (quoted tweet/post from speech)
- chat_dialogue (two-message exchange)
- search_discovery (search bar with typed query)

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
      "englishMeaning": "Accurate English translation of spoken sentence",
      "highlightedWords": ["keyword1"],
      "visualAssetRequirement": "Stock b-roll visual description in English",
      "brollSearchQuery": "english stock keywords (e.g. cuckoo bird tree)",
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
        if (seg.isChapterStart && seg.id > 1) chosenLayout = 'chapter_title';
        else if (hasRealMetric && typographyAnalysis.statData?.value) chosenLayout = 'stat_card';
        else if (typographyAnalysis.layoutMode === 'list' && typographyAnalysis.listItems && typographyAnalysis.listItems.length >= 2) chosenLayout = 'checklist';
        else {
          chosenLayout = sIdx % 2 === 0 ? 'full_bleed_visual' : 'split_screen';
        }
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
        englishMeaning: decision?.englishMeaning || '',
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

export type FacelessStickerEvent = {
  id: string;
  stickerId: string;
  start: number;
  end: number;
  position?: 'top-right' | 'top-left' | 'center-right' | 'center-left' | 'bottom-right';
};

/**
 * Generates context-aware 3D presenter and animated sticker events for faceless long video.
 * Analyzes speech narration sentiment, keywords, and scene pacing.
 */
/**
 * Faceless videos strictly do NOT use 3D cartoon avatar presenters.
 * 3D cartoon avatars are reserved exclusively for Compare Explainer.
 */
export function generateFacelessStickerEvents(_scenes: SceneBlueprintItem[]): FacelessStickerEvent[] {
  return [];
}
