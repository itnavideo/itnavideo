import { z } from 'zod';
import {
  NarrativeSceneType,
  VisualLayoutType,
  MotionAnimationPreset,
  SceneBlueprintItem,
  FullVideoSceneBlueprint,
} from './sceneBlueprintTypes';
import { planVisualAssetsForSentence, generateCleanConceptHeading, generateCleanTakeaway } from './assetPlanner';
import {
  analyzeTypographyContent,
} from '../typography/responsiveLayoutEngine';
import {
  buildDeterministicSentenceTimeline,
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
  aspectRatio?: '16:9' | '9:16';
  videoType?: 'facelessVideo' | 'facelessShorts';
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
  'donut_breakdown',
  'sticky_note',
  'numbered_steps',
  'social_post',
  'chat_dialogue',
  'vector_concept',
  'drawing_story',
  'search_discovery',
  'broll_overlay',
  'prompt_window',
  'calendar_grid',
  'milestone_ladder',
  'script_bubble',
  'roadmap',
  'vertical_roadmap',
  'horizontal_process',
  'process_steps',
  'workflow',
  'goal_target',
  'ecosystem',
  'vs_battle',
  'metric_pill',
  'newspaper_headline',
  'stamp_badge',
  'supporting_note',
  'story_character_desk',
  'product_mockup_flow',
  'before_after_transformation',
  'creator_celebration',
  'hook',
];

export function normalizeVisualLayout(input?: string): VisualLayoutType {
  if (!input) return 'vector_concept';
  const clean = input.trim();
  switch (clean) {
    case 'hook':
      return 'hook';
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
      return 'numbered_steps';
    case 'horizontal_process':
    case 'process_steps':
    case '5_step_process':
      return 'horizontal_process';
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
    case 'drawing_story':
    case 'sketch_story':
      return 'drawing_story';
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
      return 'timeline';
    case 'roadmap':
      return 'roadmap';
    case 'chapterTitle':
    case 'chapter_title':
      return 'chapter_title';
    case 'screenshot_highlight':
    case 'web_mockup':
      return 'screenshot_highlight';
    case 'workflow':
    case 'pipeline':
    case 'automation':
      return 'workflow';
    case 'goal_target':
    case 'allocation':
    case 'salary_target':
      return 'goal_target';
    case 'ecosystem':
    case 'framework':
      return 'ecosystem';
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
    case 'story_character_desk':
    case 'character_desk':
      return 'story_character_desk';
    case 'product_mockup_flow':
    case 'interface_mockup':
      return 'product_mockup_flow';
    case 'before_after_transformation':
    case 'before_after':
    case 'transformation':
      return 'before_after_transformation';
    case 'creator_celebration':
    case 'celebration':
      return 'creator_celebration';
    default:
      return 'vector_concept';
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

  const candidates = rawWords.map((word) => {
    const lower = word.toLowerCase();
    let score = 0;
    if (STOP_WORDS.has(lower)) {
      score -= 100;
    }
    if (/[0-9$%₹]/.test(word)) score += 50;
    if (/^[A-Z][a-z]+/.test(word)) score += 20;
    score += Math.min(15, word.length * 2);

    return { word, score };
  });

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, count).map((c) => c.word);
}

const FALLBACK_VECTOR_DRAWING_ROTATION = [
  'dream_big_vision',
  'story_home_workspace',
  'character_journey_walking',
  'mindset_focus_lane',
  'concept_zero_to_one',
  'character_business_leader',
  'story_journey_road',
  'character_burning_passion',
  'business_target_bullseye',
  'character_thinking',
];

export function resolveVectorDrawingIdFromText(
  text: string,
  sceneIndex: number,
  explicitId?: string,
  prevDrawingId?: string
): string {
  if (explicitId && explicitId.trim() && explicitId !== prevDrawingId) {
    return explicitId.trim();
  }
  const rawText = (text || '').toLowerCase();
  let matched = '';
  if (/zero|shunya|start|shuruat|kadam|first step|scratch|zero se|beginning/i.test(rawText)) {
    matched = 'concept_zero_to_one';
  } else if (/money|paisa|paise|rupee|capital|resource|fund|salary|investment|kharcha|wealth/i.test(rawText)) {
    matched = 'money_growth_coins';
  } else if (/passion|junoon|fire|drive|energy|grit|mehnat|hard work|consistency|aage badhte|moving forward/i.test(rawText)) {
    matched = 'character_burning_passion';
  } else if (/compare|comparison|tulna|focus|distraction|apni tulna|others|lane/i.test(rawText)) {
    matched = 'mindset_focus_lane';
  } else if (/dream|sapna|vision|bada|reach|summit|mountain|star|hope|ambition/i.test(rawText)) {
    matched = 'dream_big_vision';
  } else if (/struggle|burden|challenge|hardship|mushkil|obstacle|heavy|tough|effort|fail|failure|asafalta|bar bar/i.test(rawText)) {
    matched = 'character_struggling_burden';
  } else if (/village|cottage|roots|childhood|rural|basti|gao/i.test(rawText)) {
    matched = 'story_village_house';
  } else if (/city|skyline|building|corporate|downtown|shahar/i.test(rawText)) {
    matched = 'story_city_buildings';
  } else if (/road|highway|path|journey|future|rasta|safar|direction/i.test(rawText)) {
    matched = 'story_journey_road';
  } else if (/walk|traveler|moving|alone|stride|chalna|began|started|hustle/i.test(rawText)) {
    matched = 'character_journey_walking';
  } else if (/desk|laptop|study|late night|workspace|writing|code|skills|learning|seekhna/i.test(rawText)) {
    matched = 'story_home_workspace';
  } else if (/win|celebrat|success|victory|taraqqi|result|growth|achieve|safalta/i.test(rawText)) {
    matched = 'character_celebration';
  } else if (/doctor|medical|clinic|hospital|dawa|cure/i.test(rawText)) {
    matched = 'character_doctor';
  } else if (/business|founder|ceo|leader|pitch|deal|entrepreneur|company/i.test(rawText)) {
    matched = 'character_business_leader';
  } else if (/chart|profit|sales|revenue|scale|metric/i.test(rawText)) {
    matched = 'business_growth_chart';
  } else if (/target|goal|aim|mission|manzil/i.test(rawText)) {
    matched = 'business_target_bullseye';
  } else if (/deal|partner|agreement|trust|handshake/i.test(rawText)) {
    matched = 'business_handshake';
  }

  if (matched && matched !== prevDrawingId) {
    return matched;
  }

  // Rotate through diverse storytelling illustrations so the same character is never repeated back-to-back
  for (let offset = 0; offset < FALLBACK_VECTOR_DRAWING_ROTATION.length; offset++) {
    const candidate = FALLBACK_VECTOR_DRAWING_ROTATION[(sceneIndex + offset) % FALLBACK_VECTOR_DRAWING_ROTATION.length];
    if (candidate !== prevDrawingId) {
      return candidate;
    }
  }
  return 'dream_big_vision';
}

export function extractComparisonItemsFromText(
  text: string,
  heading?: string,
  supportingText?: string
): { left: string; right: string } | undefined {
  const source = (text || '').trim();
  const vsParts = source.split(/\b(?:versus|vs\.?|compared to|compared with|instead of|rather than)\b/i);
  if (vsParts.length >= 2) {
    const left = generateCleanConceptHeading(vsParts[0]) || 'Option A';
    const right = generateCleanConceptHeading(vsParts.slice(1).join(' ')) || 'Option B';
    return { left, right };
  }
  const fromTo = source.match(/\bfrom\s+(.{2,45}?)\s+to\s+(.{2,45}?)(?=[.!?,;]|$)/i);
  if (fromTo) {
    return {
      left: generateCleanConceptHeading(fromTo[1]) || 'Before',
      right: generateCleanConceptHeading(fromTo[2]) || 'After',
    };
  }
  if (heading && supportingText) {
    return {
      left: generateCleanConceptHeading(heading),
      right: generateCleanConceptHeading(supportingText),
    };
  }
  return undefined;
}

export function extractStructuredStepsFromText(text: string, fallbackHeading?: string): string[] {
  const source = (text || '').trim();
  if (!source) return [];

  // Try splitting on sequence markers or punctuation clauses
  const rawParts = source
    .split(/(?:\b(?:first|second|third|fourth|next|then|finally|step\s*\d+)\b[:,.-]?|[,;•]|(?:\s+and\s+)|(?:\s+aur\s+)|(?:\s+phir\s+))/i)
    .map((p) => p.replace(/[.!?]+$/g, '').trim())
    .filter((p) => p.split(/\s+/).length >= 2);

  if (rawParts.length >= 2) {
    return rawParts.slice(0, 4).map((p) => {
      const words = p.split(/\s+/).slice(0, 7).join(' ');
      return words.charAt(0).toUpperCase() + words.slice(1);
    });
  }

  // Fallback: split sentence into 3 concise phrase beats
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length >= 6) {
    const chunkSize = Math.ceil(words.length / 3);
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      const slice = words.slice(i, i + chunkSize).join(' ').replace(/[.!?]+$/g, '');
      if (slice) chunks.push(slice.charAt(0).toUpperCase() + slice.slice(1));
    }
    if (chunks.length >= 2) return chunks.slice(0, 4);
  }

  return fallbackHeading ? [fallbackHeading, source] : [source];
}

export function deriveCategoryPillForScene(layoutType: VisualLayoutType, sceneType: NarrativeSceneType): string {
  switch (layoutType) {
    case 'hook':
      return 'CORE HOOK';
    case 'chapter_title':
      return 'NEW CHAPTER';
    case 'comparison':
    case 'vs_battle':
    case 'before_after_transformation':
      return 'HEAD TO HEAD';
    case 'stat_card':
    case 'metric_pill':
    case 'data_visualization':
    case 'donut_breakdown':
      return 'DATA INSIGHT';
    case 'roadmap':
    case 'vertical_roadmap':
    case 'horizontal_process':
    case 'process_steps':
    case 'numbered_steps':
    case 'milestone_ladder':
      return 'STEP BY STEP';
    case 'workflow':
    case 'product_mockup_flow':
      return 'SYSTEM FLOW';
    case 'checklist':
    case 'ecosystem':
      return 'KEY PILLARS';
    case 'quote':
      return 'MINDSET SHIFT';
    case 'goal_target':
      return 'TARGET PLAN';
    default:
      return sceneType === 'example_stat' ? 'REAL EXAMPLE' : 'KEY INSIGHT';
  }
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
  'drawing_story',
  'search_discovery',
  'broll_overlay',
  'prompt_window',
  'calendar_grid',
  'milestone_ladder',
  'script_bubble',
  'roadmap',
  'vertical_roadmap',
  'horizontal_process',
  'process_steps',
  'workflow',
  'goal_target',
  'ecosystem',
  'vs_battle',
  'metric_pill',
  'newspaper_headline',
  'stamp_badge',
  'supporting_note',
  'story_character_desk',
  'product_mockup_flow',
  'before_after_transformation',
  'creator_celebration',
  'hook',
]);

const SceneBlueprintItemSchema = z.object({
  sceneNumber: z.number().int().positive().optional().default(1),
  sceneType: NarrativeSceneTypeSchema.optional().default('main_point'),
  layoutType: VisualLayoutTypeSchema.optional().default('vector_concept'),
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
  categoryPill: z.string().optional(),
  statValue: z.string().optional(),
  statLabel: z.string().optional(),
  statTrend: z.enum(['up', 'down', 'neutral']).optional(),
  quoteAuthor: z.string().optional(),
  comparisonItems: z.object({
    left: z.string(),
    right: z.string(),
  }).optional(),
  listItems: z.array(z.string()).optional(),
  timelineSteps: z.array(z.string()).optional(),
  checklistItems: z.array(z.string()).optional(),
  chartValuePercent: z.number().optional(),
  numberBadge: z.union([z.number(), z.string()]).optional(),

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
 * Scene-by-Scene Blueprint Validator & Enricher:
 * - Preserves natural sentence-by-sentence scene boundaries (NO arbitrary 4s/7s mid-sentence chopping).
 * - Ensures every scene has complete structured data for its chosen layoutType.
 * - Prevents consecutive repetition of the exact same layout or vector illustration.
 */
export function enforceEditorialPacingRules(
  blueprint: FullVideoSceneBlueprint,
  options: ScenePlannerOptions = {}
): FullVideoSceneBlueprint {
  if (!blueprint || !Array.isArray(blueprint.scenes) || blueprint.scenes.length === 0) {
    return blueprint;
  }

  const processedScenes: SceneBlueprintItem[] = [];
  let prevDrawingId: string | undefined;

  for (let i = 0; i < blueprint.scenes.length; i++) {
    const scene = { ...blueprint.scenes[i] };
    const text = scene.narrationSegment?.text || '';
    const duration = Math.max(
      1,
      scene.duration ||
        (scene.narrationSegment?.endSeconds
          ? scene.narrationSegment.endSeconds - scene.narrationSegment.startSeconds
          : 4)
    );

    scene.sceneNumber = i + 1;
    scene.duration = Math.round(duration * 100) / 100;

    // 1. Ensure keyword emphasis exists
    if (!scene.highlightedWords || scene.highlightedWords.length === 0) {
      scene.highlightedWords = extractKeywordEmphasis(text || scene.heading, 2);
    }

    // 2. Anti-Repetition: Prevent 3 identical layouts in a row
    if (i >= 2) {
      const prev1 = processedScenes[i - 1];
      const prev2 = processedScenes[i - 2];
      if (scene.layoutType === prev1.layoutType && scene.layoutType === prev2.layoutType) {
        if (scene.layoutType === 'vector_concept' || scene.layoutType === 'drawing_story') {
          scene.layoutType = 'split_screen';
        } else if (scene.layoutType === 'split_screen') {
          scene.layoutType = 'supporting_note';
        } else {
          scene.layoutType = 'vector_concept';
        }
      }
    }

    // 3. Validate Chart & Stat evidence — never show empty or fake charts
    if (scene.layoutType === 'data_visualization') {
      const hasValidChart =
        scene.chartItems && scene.chartItems.length >= 2 && scene.chartItems.every((c) => c.value > 0);
      if (!hasValidChart) {
        scene.layoutType = scene.statValue ? 'stat_card' : 'vector_concept';
      }
    } else if (scene.layoutType === 'donut_breakdown') {
      const hasValidDonut =
        scene.donutSlices && scene.donutSlices.length >= 2 && scene.donutSlices.every((s) => s.value > 0);
      if (!hasValidDonut) {
        scene.layoutType = scene.statValue ? 'stat_card' : 'vector_concept';
      }
    } else if (scene.layoutType === 'sticky_note') {
      const noteLength = (scene.supportingText || scene.heading || '').split(/\s+/).length;
      if (noteLength > 25) {
        scene.layoutType = 'supporting_note';
      }
    }

    // 4. Populate structured layout fields if missing
    if (
      (scene.layoutType === 'comparison' ||
        scene.layoutType === 'vs_battle' ||
        scene.layoutType === 'before_after_transformation') &&
      !scene.comparisonItems
    ) {
      scene.comparisonItems = extractComparisonItemsFromText(text, scene.heading, scene.supportingText);
    }

    if (
      scene.layoutType === 'roadmap' ||
      scene.layoutType === 'vertical_roadmap' ||
      scene.layoutType === 'horizontal_process' ||
      scene.layoutType === 'process_steps' ||
      scene.layoutType === 'numbered_steps' ||
      scene.layoutType === 'checklist' ||
      scene.layoutType === 'milestone_ladder' ||
      scene.layoutType === 'workflow'
    ) {
      const existingSteps =
        (scene.listItems && scene.listItems.length >= 2 ? scene.listItems : undefined) ||
        (scene.timelineSteps && scene.timelineSteps.length >= 2 ? scene.timelineSteps : undefined) ||
        (scene.checklistItems && scene.checklistItems.length >= 2 ? scene.checklistItems : undefined);
      const resolvedSteps = existingSteps || extractStructuredStepsFromText(text, scene.heading);
      scene.listItems = resolvedSteps;
      scene.timelineSteps = scene.timelineSteps || resolvedSteps;
      scene.checklistItems = scene.checklistItems || resolvedSteps;
    }

    // 5. Ensure distinct vectorDrawingId so illustrations never repeat back-to-back
    scene.vectorDrawingId = resolveVectorDrawingIdFromText(
      `${scene.heading || ''} ${scene.supportingText || ''} ${text}`,
      i,
      scene.vectorDrawingId,
      prevDrawingId
    );
    prevDrawingId = scene.vectorDrawingId;

    // 6. Category Pill
    if (!scene.categoryPill) {
      scene.categoryPill = deriveCategoryPillForScene(scene.layoutType, scene.sceneType);
    }

    // 7. Transitions & SFX polish
    if (i === 0) {
      scene.transition = 'zoom';
      scene.SFX = 'rise';
    } else if (scene.layoutType === 'chapter_title' || scene.sceneType === 'transition') {
      scene.transition = 'zoom';
      scene.SFX = 'rise';
    } else if (
      scene.layoutType === 'stat_card' ||
      scene.layoutType === 'metric_pill' ||
      scene.layoutType === 'data_visualization' ||
      scene.layoutType === 'comparison' ||
      scene.layoutType === 'vs_battle'
    ) {
      scene.transition = 'cut';
      scene.SFX = 'hit';
    } else if (
      scene.layoutType === 'checklist' ||
      scene.layoutType === 'numbered_steps' ||
      scene.layoutType === 'roadmap' ||
      scene.layoutType === 'horizontal_process'
    ) {
      scene.transition = 'slide';
      scene.SFX = 'pop';
    } else if (i === blueprint.scenes.length - 1) {
      scene.transition = 'fade_to_black';
      scene.SFX = 'none';
    } else {
      scene.transition = i % 3 === 0 ? 'dissolve' : 'cut';
      if (i % 3 === 0 && scene.SFX === 'none') {
        scene.SFX = 'woosh';
      }
    }

    processedScenes.push(scene);
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
 * Scene-by-Scene Blueprint JSON fallback using the natural sentence timeline engine.
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
  const backgroundTheme = options.backgroundTheme || 'studio-white';
  const isShorts = options.aspectRatio === '9:16' || options.videoType === 'facelessShorts';

  const scenes: SceneBlueprintItem[] = [];
  let prevDrawingId: string | undefined;

  for (let i = 0; i < timelineSegments.length; i++) {
    const seg = timelineSegments[i];
    const text = seg.text.trim();
    const assetPlan = planVisualAssetsForSentence(text);
    const typographyAnalysis = analyzeTypographyContent(text);

    let layoutType: VisualLayoutType = 'vector_concept';
    let sceneType: NarrativeSceneType = 'main_point';
    let sfx: 'pop' | 'woosh' | 'whoosh' | 'chime' | 'rise' | 'hit' | 'ding' | 'none' = 'none';

    const hasRealMetric = /(\$|€|£|₹)\s*\d+|\b\d+(?:\.\d+)?\s*(%|percent|x|times|crore|lakh|million|billion)\b/i.test(text);

    if (i === 0) {
      layoutType = 'hook';
      sceneType = 'hook';
      sfx = 'rise';
    } else if (seg.isChapterStart && seg.id > 1) {
      layoutType = 'chapter_title';
      sceneType = 'transition';
      sfx = 'rise';
    } else if (hasRealMetric && typographyAnalysis.statData?.value) {
      layoutType = i % 2 === 0 ? 'stat_card' : 'metric_pill';
      sceneType = 'example_stat';
      sfx = 'hit';
    } else if (/\b(?:versus|vs\.?|compared to|instead of|rather than)\b/i.test(text)) {
      layoutType = i % 2 === 0 ? 'comparison' : 'vs_battle';
      sceneType = 'explanation';
      sfx = 'hit';
    } else if (/\b(?:from\s+.+\s+to\s+|before\s+and\s+after|transformation)\b/i.test(text)) {
      layoutType = isShorts ? 'comparison' : 'before_after_transformation';
      sceneType = 'explanation';
      sfx = 'hit';
    } else if (/salary|emergency fund|50\/30\/20|allocation|sip|savings rate|budget/i.test(text)) {
      layoutType = 'goal_target';
      sceneType = 'example_stat';
      sfx = 'pop';
    } else if (/roadmap|milestone|step by step|timeline|career path|progression/i.test(text)) {
      layoutType = isShorts ? 'vertical_roadmap' : 'roadmap';
      sceneType = 'explanation';
      sfx = 'pop';
    } else if (/workflow|pipeline|automation|system|funnel|process/i.test(text)) {
      layoutType = isShorts ? 'workflow' : 'horizontal_process';
      sceneType = 'explanation';
      sfx = 'pop';
    } else if (typographyAnalysis.layoutMode === 'list' && typographyAnalysis.listItems && typographyAnalysis.listItems.length >= 2) {
      layoutType = i % 2 === 0 ? 'checklist' : 'numbered_steps';
      sceneType = 'main_point';
      sfx = 'pop';
    } else if (typographyAnalysis.layoutMode === 'quote') {
      layoutType = 'quote';
      sceneType = 'emphasis';
      sfx = 'chime';
    } else {
      const variedCadence: VisualLayoutType[] = isShorts
        ? ['vector_concept', 'split_screen', 'supporting_note', 'vector_concept', 'numbered_steps', 'big_typography']
        : ['drawing_story', 'split_screen', 'supporting_note', 'vector_concept', 'horizontal_process', 'big_typography'];
      layoutType = variedCadence[i % variedCadence.length];
      sceneType = i === timelineSegments.length - 1 ? 'next_point' : 'main_point';
      sfx = 'woosh';
    }

    const keywords =
      assetPlan.highlightedWords && assetPlan.highlightedWords.length > 0
        ? assetPlan.highlightedWords
        : extractKeywordEmphasis(text, 2);

    const heading = generateCleanConceptHeading(text);
    const supportingText =
      typographyAnalysis.suggestedSupportingText ||
      assetPlan.suggestedSupportingText ||
      generateCleanTakeaway(text, '');

    const comparisonItems =
      layoutType === 'comparison' || layoutType === 'vs_battle' || layoutType === 'before_after_transformation'
        ? extractComparisonItemsFromText(text, heading, supportingText)
        : undefined;

    const structuredSteps =
      layoutType === 'roadmap' ||
      layoutType === 'vertical_roadmap' ||
      layoutType === 'horizontal_process' ||
      layoutType === 'workflow' ||
      layoutType === 'checklist' ||
      layoutType === 'numbered_steps'
        ? typographyAnalysis.listItems && typographyAnalysis.listItems.length >= 2
          ? typographyAnalysis.listItems
          : extractStructuredStepsFromText(text, heading)
        : typographyAnalysis.listItems;

    const vectorDrawingId = resolveVectorDrawingIdFromText(text, i, undefined, prevDrawingId);
    prevDrawingId = vectorDrawingId;

    scenes.push({
      sceneNumber: seg.id,
      sceneType,
      layoutType,
      duration: seg.duration,
      narrationSegment: {
        text,
        startSeconds: seg.start,
        endSeconds: seg.end,
      },
      heading,
      supportingText,
      categoryPill: deriveCategoryPillForScene(layoutType, sceneType),
      highlightedWords: keywords,
      visualAssetRequirement: assetPlan.brollSearchQuery || '',
      visualIntent: assetPlan.visualIntent || 'cinematic visual',
      brollSearchQuery: assetPlan.brollSearchQuery || '',
      background: backgroundTheme,
      fontHierarchy: {
        headingFont,
        bodyFont,
      },
      animation: (assetPlan.motion as MotionAnimationPreset) || 'slow_zoom_in',
      SFX: sfx,
      transition: seg.isChapterStart ? 'zoom' : i % 3 === 0 ? 'dissolve' : 'cut',
      typographyTreatment: typographyAnalysis.layoutMode,
      listItems: structuredSteps,
      timelineSteps: structuredSteps,
      checklistItems: structuredSteps,
      comparisonItems,
      vectorDrawingId,
      statValue: hasRealMetric && typographyAnalysis.statData?.value ? typographyAnalysis.statData.value : undefined,
      statLabel:
        hasRealMetric && typographyAnalysis.statData?.value
          ? typographyAnalysis.statData.label || typographyAnalysis.suggestedHeading
          : undefined,
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
 * Main AI Scene-by-Scene Planner function.
 *
 * Strict Architecture:
 * 1. Natural sentence-by-sentence timeline is constructed 100% deterministically in code (zero AI for timecodes, no forced 4s/7s mid-sentence splits).
 * 2. Tailors visual layout selection to either 16:9 Long-Form Widescreen (`facelessVideo`, up to 5 min) or 9:16 Vertical Shorts (`facelessShorts`, up to 90s).
 * 3. Generates a rich, detailed Scene-by-Scene JSON blueprint (headings, takeaways, comparison pairs, step lists, charts, vector drawing IDs, category pills, SFX).
 * 4. Maps AI decisions directly onto exact frame-accurate sentence timestamps.
 */
export async function generateStructuredSceneBlueprint(
  transcript: TranscriptChunk[],
  options: ScenePlannerOptions = {}
): Promise<FullVideoSceneBlueprint> {
  if (!transcript || transcript.length === 0) {
    return buildDeterministicSceneBlueprint(transcript, options);
  }

  // 1. Build natural sentence-by-sentence timeline strictly in code
  const isShorts = options.aspectRatio === '9:16' || options.videoType === 'facelessShorts';
  const timelineSegments = buildDeterministicSentenceTimeline(transcript, {
    minDurationSeconds: isShorts ? 2.0 : 2.5,
    maxDurationSeconds: isShorts ? 10.0 : 14.0,
    chapterDurationSeconds: isShorts ? 45.0 : 70.0,
  });

  if (timelineSegments.length === 0) {
    return buildDeterministicSceneBlueprint(transcript, options);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return buildDeterministicSceneBlueprint(transcript, options);
  }

  const headingFont = options.headingFont || 'Montserrat';
  const bodyFont = options.bodyFont || 'Plus Jakarta Sans';
  const backgroundTheme = options.backgroundTheme || 'studio-white';

  // 2. Chapter-wise chunking (10-12 segments per batch to support up to 5-minute 16:9 videos cleanly)
  const CHUNK_SIZE = 12;
  const chunkCount = Math.ceil(timelineSegments.length / CHUNK_SIZE);
  const plannedScenes: SceneBlueprintItem[] = [];
  let prevLayouts: string[] = [];
  let prevDrawingId: string | undefined;

  const formatLabel = isShorts
    ? '9:16 Vertical Shorts (1080x1920, up to 90 seconds, fast-paced vertical storytelling)'
    : '16:9 Widescreen Long-Form YouTube Documentary/Explainer (1920x1080, up to 5 minutes, Vox / Johnny Harris / MagnatesMedia style)';

  for (let c = 0; c < chunkCount; c++) {
    const chunkSegments = timelineSegments.slice(c * CHUNK_SIZE, (c + 1) * CHUNK_SIZE);
    const chunkDecisions: Map<number, any> = new Map();

    try {
      const prompt = `You are an elite motion graphics art director and storyboard architect for ${formatLabel}.

Analyze each spoken narration sentence below and return a rich, detailed SCENE-BY-SCENE JSON blueprint where every scene visually explains the exact meaning of that sentence.

CRITICAL SCENE-BY-SCENE DIRECTION RULES:
1. NATURAL SCENE MATCHING: Each segment is a complete spoken thought. Pick the single best visual layoutType and populate its exact structured data fields so the screen visually proves what the speaker is saying.
2. VISUAL VARIETY & ANTI-REPETITION: Never repeat the same layoutType 3 times in a row. Previous layouts used: ${JSON.stringify(prevLayouts)}.
3. LAYOUT SELECTION GUIDE (${isShorts ? '9:16 Vertical Canvas' : '16:9 Widescreen Canvas'}):
   - 'hook': Use ONLY for segmentId 1 (the opening hook of the video).
   - 'chapter_title': Use when isChapterStart is true and segmentId > 1.
   - 'drawing_story' / 'vector_concept': Two-column (16:9) or full-canvas (9:16) animated vector illustration + bold editorial headline. Choose a matching "vectorDrawingId" from:
     ["concept_zero_to_one", "money_growth_coins", "character_burning_passion", "mindset_focus_lane", "dream_big_vision", "character_struggling_burden", "story_village_house", "story_city_buildings", "story_journey_road", "character_journey_walking", "story_home_workspace", "character_celebration", "character_doctor", "character_business_leader", "business_growth_chart", "business_target_bullseye", "business_handshake", "character_thinking"].
   - 'comparison' / 'vs_battle' / 'before_after_transformation': Use when contrasting two ideas, old vs new, before vs after, or mistake vs solution. MUST provide "comparisonItems": {"left": "Old / Problem", "right": "New / Solution"}.
   - 'horizontal_process' / 'roadmap' / 'vertical_roadmap' / 'numbered_steps' / 'milestone_ladder': Use when explaining steps, stages, a journey, or a progression. MUST provide "listItems": ["Step 1...", "Step 2...", "Step 3..."] (2 to 4 concise items).
   - 'workflow' / 'product_mockup_flow': Use when explaining a system, pipeline, mechanism, or how a process works. Provide "listItems" (3-4 nodes).
   - 'checklist' / 'ecosystem': Use when listing multiple benefits, rules, or pillars. Provide "listItems" (3-4 concise points).
   - 'goal_target': Use when discussing financial targets, budget splits (50/30/20), salary allocation, or specific goals.
   - 'stat_card' / 'metric_pill': Use ONLY when a real number/percentage/currency is spoken in the segment. Provide "statValue" (e.g. "85%", "₹10 Lakh", "3.5x") and "statLabel".
   - 'data_visualization': Use ONLY when 2 or more numbers are compared in the segment. Provide "chartItems": [{"label": "2020", "value": 20, "formattedValue": "20%"}, {"label": "2025", "value": 80, "formattedValue": "80%"}].
   - 'donut_breakdown': Use ONLY for proportional splits (e.g. 80/20 rule). Provide "donutSlices": [{"label": "Core", "value": 80}, {"label": "Rest", "value": 20}].
   - 'quote': Use for powerful mindset quotes or golden rules.
   - 'supporting_note' / 'sticky_note': Use for a key takeaway memo, warning, or mental note.
   - 'chat_dialogue' / 'script_bubble': Use when narration quotes a message or conversation.
   - 'split_screen' / 'card_concept' / 'big_typography': Use for bold editorial statements and kinetic typography emphasis.
4. LANGUAGE & COPY:
   - Write "heading" (2-5 punchy words), "supportingText" (6-12 word crystal-clear takeaway), and "categoryPill" (2-3 word badge like "KEY STRATEGY", "CASE STUDY", "STEP BY STEP") in clean English.
   - If the spoken segment is in Hindi or Hinglish, provide its accurate English meaning in "englishMeaning".
   - Choose 1-2 impact words from the heading/text in "highlightedWords".

Segments to plan:
${JSON.stringify(
  chunkSegments.map((s) => ({
    segmentId: s.id,
    durationSeconds: s.duration,
    text: s.text,
    isChapterStart: s.isChapterStart,
    chapterNumber: s.chapterNumber,
  })),
  null,
  2
)}

Return a strict JSON object with this EXACT structure:
{
  "scenes": [
    {
      "segmentId": 1,
      "sceneType": "main_point",
      "layoutType": "drawing_story",
      "categoryPill": "CORE INSIGHT",
      "heading": "BUILD REAL LEVERAGE",
      "supportingText": "Focus on scalable systems instead of trading hours for money.",
      "englishMeaning": "Accurate English meaning of the spoken sentence",
      "highlightedWords": ["LEVERAGE", "systems"],
      "vectorDrawingId": "character_business_leader",
      "comparisonItems": { "left": "Trading Time", "right": "Scalable Systems" },
      "listItems": ["Identify bottleneck", "Automate workflow", "Scale output"],
      "statValue": "85%",
      "statLabel": "Efficiency Gain",
      "statTrend": "up",
      "chartItems": [{ "label": "Manual", "value": 20, "formattedValue": "20%" }, { "label": "Automated", "value": 85, "formattedValue": "85%" }],
      "donutSlices": [{ "label": "High Impact", "value": 80 }, { "label": "Low Impact", "value": 20 }],
      "quoteAuthor": "",
      "sfx": "whoosh",
      "transition": "cut"
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
                chunkDecisions.set(Number(sc.segmentId), sc);
              }
            });
          }
        }
      }
    } catch (chunkErr) {
      console.warn(`[AIScenePlanner] Chapter batch ${c + 1}/${chunkCount} AI error, using deterministic rules:`, chunkErr);
    }

    // Merge AI scene-by-scene JSON decisions with exact deterministic sentence timestamps
    chunkSegments.forEach((seg, sIdx) => {
      const decision = chunkDecisions.get(seg.id);
      const text = seg.text;
      const assetPlan = planVisualAssetsForSentence(text);
      const typographyAnalysis = analyzeTypographyContent(text);

      const hasRealMetric = /(\$|€|£|₹)\s*\d+|\b\d+(?:\.\d+)?\s*(%|percent|x|times|crore|lakh|million|billion)\b/i.test(text);

      let chosenLayout: VisualLayoutType = decision
        ? normalizeVisualLayout(decision.layoutType || decision.layout)
        : 'vector_concept';

      if (!decision) {
        if (seg.id === 1) chosenLayout = 'hook';
        else if (seg.isChapterStart && seg.id > 1) chosenLayout = 'chapter_title';
        else if (hasRealMetric && typographyAnalysis.statData?.value) chosenLayout = 'stat_card';
        else if (/\b(?:versus|vs\.?|compared to|instead of|rather than)\b/i.test(text)) chosenLayout = 'comparison';
        else if (typographyAnalysis.layoutMode === 'list' && typographyAnalysis.listItems && typographyAnalysis.listItems.length >= 2) chosenLayout = 'checklist';
        else {
          const fallbackCadence: VisualLayoutType[] = isShorts
            ? ['vector_concept', 'split_screen', 'supporting_note', 'numbered_steps']
            : ['drawing_story', 'split_screen', 'supporting_note', 'horizontal_process'];
          chosenLayout = fallbackCadence[sIdx % fallbackCadence.length];
        }
      }

      const sceneType: NarrativeSceneType =
        seg.id === 1
          ? 'hook'
          : seg.isChapterStart && seg.id > 1
          ? 'transition'
          : (decision?.sceneType as NarrativeSceneType) || 'main_point';

      const safeStatVal =
        hasRealMetric && (decision?.statValue || typographyAnalysis.statData?.value)
          ? String(decision?.statValue || typographyAnalysis.statData?.value)
          : undefined;
      const safeStatLbl = safeStatVal
        ? String(decision?.statLabel || typographyAnalysis.statData?.label || '')
        : undefined;

      const heading = generateCleanConceptHeading(decision?.heading || text);
      const supportingText =
        decision?.supportingText ||
        typographyAnalysis.suggestedSupportingText ||
        assetPlan.suggestedSupportingText ||
        generateCleanTakeaway(text, '');

      const keywords =
        Array.isArray(decision?.highlightedWords) && decision.highlightedWords.length > 0
          ? decision.highlightedWords.map(String)
          : extractKeywordEmphasis(text, 2);

      const aiListItems = Array.isArray(decision?.listItems) && decision.listItems.length >= 2
        ? decision.listItems.map(String)
        : Array.isArray(decision?.timelineSteps) && decision.timelineSteps.length >= 2
        ? decision.timelineSteps.map(String)
        : Array.isArray(decision?.checklistItems) && decision.checklistItems.length >= 2
        ? decision.checklistItems.map(String)
        : typographyAnalysis.listItems;

      const aiComparisonItems =
        decision?.comparisonItems &&
        typeof decision.comparisonItems.left === 'string' &&
        typeof decision.comparisonItems.right === 'string' &&
        decision.comparisonItems.left.trim() &&
        decision.comparisonItems.right.trim()
          ? {
              left: decision.comparisonItems.left.trim(),
              right: decision.comparisonItems.right.trim(),
            }
          : extractComparisonItemsFromText(text, heading, supportingText);

      const aiChartItems =
        Array.isArray(decision?.chartItems) && decision.chartItems.length >= 2
          ? decision.chartItems
              .map((ci: any) => ({
                label: String(ci?.label || ''),
                value: Number(ci?.value || 0),
                formattedValue: ci?.formattedValue ? String(ci.formattedValue) : undefined,
                color: ci?.color ? String(ci.color) : undefined,
              }))
              .filter((ci: any) => ci.label && ci.value > 0)
          : undefined;

      const aiDonutSlices =
        Array.isArray(decision?.donutSlices) && decision.donutSlices.length >= 2
          ? decision.donutSlices
              .map((ds: any) => ({
                label: String(ds?.label || ''),
                value: Number(ds?.value || 0),
                color: ds?.color ? String(ds.color) : undefined,
              }))
              .filter((ds: any) => ds.label && ds.value > 0)
          : undefined;

      const aiChatMessages =
        Array.isArray(decision?.chatMessages) && decision.chatMessages.length >= 2
          ? decision.chatMessages
              .map((cm: any) => ({
                sender: (cm?.sender === 'right' ? 'right' : 'left') as 'left' | 'right',
                text: String(cm?.text || ''),
              }))
              .filter((cm: any) => cm.text)
          : undefined;

      const resolvedDrawingId = resolveVectorDrawingIdFromText(
        `${heading} ${supportingText} ${text}`,
        plannedScenes.length,
        decision?.vectorDrawingId,
        prevDrawingId
      );
      prevDrawingId = resolvedDrawingId;

      let sfx = decision?.sfx || 'none';
      if (sfx === 'none') {
        if (seg.isChapterStart) sfx = 'rise';
        else if (chosenLayout === 'stat_card' || chosenLayout === 'comparison' || chosenLayout === 'vs_battle') sfx = 'hit';
        else if (sIdx % 3 === 0) sfx = 'woosh';
      }

      plannedScenes.push({
        sceneNumber: seg.id,
        sceneType,
        layoutType: chosenLayout,
        duration: seg.duration,
        narrationSegment: {
          text: seg.text,
          startSeconds: seg.start,
          endSeconds: seg.end,
        },
        heading,
        supportingText,
        categoryPill: decision?.categoryPill || deriveCategoryPillForScene(chosenLayout, sceneType),
        highlightedWords: keywords,
        visualAssetRequirement: decision?.visualAssetRequirement || assetPlan.brollSearchQuery || '',
        visualIntent: decision?.visualAssetRequirement || assetPlan.visualIntent || 'cinematic visual',
        englishMeaning: decision?.englishMeaning || '',
        brollSearchQuery: decision?.brollSearchQuery || decision?.visualAssetRequirement || assetPlan.brollSearchQuery || '',
        background: backgroundTheme,
        fontHierarchy: { headingFont, bodyFont },
        animation: (decision?.animation as MotionAnimationPreset) || 'slow_zoom_in',
        SFX: sfx,
        transition: seg.isChapterStart ? 'zoom' : sIdx % 3 === 0 ? 'dissolve' : 'cut',
        statValue: safeStatVal,
        statLabel: safeStatLbl,
        statTrend: decision?.statTrend || typographyAnalysis.statData?.trend,
        quoteAuthor: decision?.quoteAuthor || typographyAnalysis.quoteData?.author,
        comparisonItems: aiComparisonItems,
        listItems: aiListItems,
        timelineSteps: aiListItems,
        checklistItems: aiListItems,
        chartItems: aiChartItems,
        donutSlices: aiDonutSlices,
        chatMessages: aiChatMessages,
        searchQuery: decision?.searchQuery ? String(decision.searchQuery) : undefined,
        vectorDrawingId: resolvedDrawingId,
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
 * Faceless videos strictly do NOT use 3D cartoon avatar presenters.
 * 3D cartoon avatars are reserved exclusively for Compare Explainer.
 */
export function generateFacelessStickerEvents(_scenes: SceneBlueprintItem[]): FacelessStickerEvent[] {
  return [];
}
