import { z } from 'zod';
import {
  searchS3AssetCatalog,
  formatAssetCatalogForPrompt,
  getCatalogAssetById,
  type S3CatalogAsset,
} from '@/services/ai/assetCatalogMatcher';
import { deriveSceneComposition } from '@/services/ai/compositionDeriver';
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
import { matchComponentForScene } from './componentMatcher';
import { getGroqApiKeys, fetchGroqWithFailover } from './groqKeyPool';
import { callVertexGemini } from '@/services/ai/googleCloudService';

export type TranscriptChunk = {
  text: string;
  start: number;
  end: number;
  words?: Array<{ word: string; start: number; end: number }>;
};

export type ScenePlannerOptions = {
  title?: string;
  fontFamily?: string;
  accentFont?: string;
  headingFont?: string;
  bodyFont?: string;
  backgroundTheme?: string;
  aspectRatio?: '16:9' | '9:16';
  videoType?: 'facelessVideo' | 'facelessShorts';
  creatorStyle?: string;
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
  'curved_roadmap',
  'circular_org_chart',
  'horizontal_shelves',
  'scorecard_dashboard',
  'table_of_contents',
  'mission_vision',
  'medical_infographic',
  'rough_notation',
  'lottie_motion',
  'code_diff',
  'three_globe',
  'map_flyover',
  'kinetic_kit',
  'hook',
];

export function normalizeVisualLayout(input?: string): VisualLayoutType {
  if (!input) return 'card_concept';
  const clean = input.trim();
  const norm = clean.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Direct Canonical PascalCase (01_LAYOUT_CATALOG.md)
  if (norm.includes('curvedroadmap') || norm === 'curvedroadmap') return 'curved_roadmap';
  if (norm.includes('orgchart') || norm.includes('circularorg') || norm === 'circularorgchart') return 'circular_org_chart';
  if (norm.includes('horizontalshelves') || norm.includes('shelves') || norm.includes('tierstack') || norm === 'horizontalshelves') return 'horizontal_shelves';
  if (norm.includes('scorecard') || norm.includes('kpidashboard') || norm === 'scorecarddashboard') return 'scorecard_dashboard';
  if (norm.includes('tableofcontent') || norm.includes('agenda') || norm === 'tableofcontents') return 'table_of_contents';
  if (norm.includes('missionvision') || norm.includes('visionmission') || norm === 'missionvision') return 'mission_vision';
  if (norm.includes('medical') || norm.includes('clinical') || norm.includes('clinicalvitals') || norm === 'medicalinfographic') return 'medical_infographic';
  if (norm.includes('roughnotation') || norm.includes('handdrawn') || norm === 'rough') return 'rough_notation';
  if (norm.includes('lottiemotion') || norm === 'lottie') return 'lottie_motion';
  if (norm.includes('codediff') || norm.includes('codeupgrade') || norm === 'diff') return 'code_diff';
  if (norm.includes('threeglobe') || norm.includes('globe3d') || norm === 'globe') return 'three_globe';
  if (norm.includes('mapflyover') || norm.includes('routemap') || norm === 'flyover') return 'map_flyover';
  if (norm.includes('kinetickit') || norm.includes('kineticword') || norm === 'kinetic') return 'kinetic_kit';
  if (norm.includes('statscene') || norm === 'stat' || norm === 'statcard' || norm === 'metricpill' || norm === 'metricstat') return 'stat_card';
  if (norm.includes('comparisonscene') || norm === 'comparison' || norm === 'vsbattle' || norm === 'battlecard' || norm === 'vs') return 'comparison';
  if (norm.includes('horizontalprocess') || norm.includes('processsteps') || norm === '5stepprocess' || norm === 'steps' || norm === 'numberedsteps') return 'horizontal_process';
  if (norm.includes('workflowscene') || norm === 'workflow' || norm === 'pipeline' || norm === 'automation' || norm === 'productmockupflow') return 'workflow';
  if (norm.includes('roadmapscene') || norm === 'roadmap' || norm === 'timeline' || norm === 'milestoneladder') return 'roadmap';
  if (norm.includes('cardconceptscene') || norm === 'cardconcept' || norm === 'cardiconkeyword' || norm === 'card') return 'card_concept';
  if (norm.includes('listscene') || norm === 'checklist' || norm === 'iconlist' || norm === 'list') return 'checklist';
  if (norm.includes('chartscene') || norm === 'datavisualization' || norm === 'chart' || norm === 'diagram') return 'data_visualization';
  if (norm.includes('hooktypographyscene') || norm === 'hookscene' || norm === 'hook') return 'hook';
  if (norm.includes('quotescene') || norm === 'quote') return 'quote';
  if (norm.includes('chaptertitlescene') || norm === 'chaptertitle' || norm === 'chapter') return 'chapter_title';
  if (norm.includes('drawingstoryscene') || norm === 'drawingstory' || norm === 'sketchstory') return 'drawing_story';
  if (norm.includes('definitionscene') || norm === 'definition' || norm === 'supportingnote' || norm === 'notecard') return 'supporting_note';
  if (norm.includes('outroscene') || norm === 'outro' || norm === 'conclusion' || norm === 'creatorcelebration') return 'creator_celebration';
  if (norm.includes('typographyscene') || norm === 'bigtypography' || norm === 'fullscreenstatement') return 'big_typography';
  if (norm.includes('uimockup') || norm === 'screenshothighlight' || norm === 'webmockup') return 'screenshot_highlight';
  if (norm.includes('beforeafter') || norm === 'transformation') return 'before_after_transformation';
  if (norm.includes('donubreakdown') || norm.includes('donut')) return 'donut_breakdown';
  if (norm.includes('goaltarget') || norm === 'allocation') return 'goal_target';
  if (norm.includes('calendargrid') || norm === 'calendar') return 'calendar_grid';
  if (norm.includes('promptwindow') || norm === 'prompt') return 'prompt_window';

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
    case 'curved_roadmap':
      return 'curved_roadmap';
    case 'circular_org_chart':
      return 'circular_org_chart';
    case 'horizontal_shelves':
      return 'horizontal_shelves';
    case 'scorecard_dashboard':
      return 'scorecard_dashboard';
    case 'table_of_contents':
      return 'table_of_contents';
    case 'mission_vision':
      return 'mission_vision';
    case 'medical_infographic':
      return 'medical_infographic';
    default:
      return 'card_concept';
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
  if (/restaurant|kitchen|food|cooking|chef|dining|meal/i.test(rawText)) {
    matched = 'character_business_leader';
  } else if (/delivery|driver|drivers|scooter|fleet|courier/i.test(rawText)) {
    matched = 'story_journey_road';
  } else if (/website|app|online|channel|direct/i.test(rawText)) {
    matched = 'story_home_workspace';
  } else if (/zero|shunya|start|shuruat|kadam|first step|scratch|zero se|beginning/i.test(rawText)) {
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

  // 1. "Instead of X, Y" pattern
  const insteadMatch = source.match(/^instead\s+of\s+(.+?),\s*(?:restaurants\s+can|businesses\s+can|you\s+can|we\s+can|they\s+can|simply)?\s*(.+)$/i);
  if (insteadMatch) {
    const leftText = insteadMatch[1].replace(/[.!?]+$/g, '').trim();
    const rightText = insteadMatch[2].replace(/[.!?]+$/g, '').trim();
    const leftTitle = deriveFactualHeadingFromSentence(leftText) || 'Traditional Method';
    const rightTitle = deriveFactualHeadingFromSentence(rightText) || 'Modern Approach';
    return {
      left: `${leftTitle} • ${leftText}`,
      right: `${rightTitle} • ${rightText}`,
    };
  }

  // 3. Explicit "X versus Y" / "X vs Y" / "rather than"
  const vsParts = source.split(/\b(?:versus|vs\.?|compared to|compared with|rather than)\b/i);
  if (vsParts.length >= 2 && vsParts[0].trim().length >= 3) {
    const left = deriveFactualHeadingFromSentence(vsParts[0]) || 'Option A';
    const right = deriveFactualHeadingFromSentence(vsParts.slice(1).join(' ')) || 'Option B';
    return { left, right };
  }

  const fromTo = source.match(/\bfrom\s+(.{2,45}?)\s+to\s+(.{2,45}?)(?=[.!?,;]|$)/i);
  if (fromTo) {
    return {
      left: deriveFactualHeadingFromSentence(fromTo[1]) || 'Before',
      right: deriveFactualHeadingFromSentence(fromTo[2]) || 'After',
    };
  }

  if (heading && supportingText && heading !== supportingText) {
    return {
      left: deriveFactualHeadingFromSentence(heading),
      right: deriveFactualHeadingFromSentence(supportingText),
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
      const cleanP = p.replace(/^(?:this means|means|which means|namely|such as|including)\s+/i, '').trim();
      const words = cleanP.split(/\s+/).slice(0, 7).join(' ');
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
    case 'curved_roadmap':
      return 'EXECUTION ROADMAP';
    case 'circular_org_chart':
      return 'ORGANIZATIONAL ORBIT';
    case 'horizontal_shelves':
      return 'ARCHITECTURE STACK';
    case 'scorecard_dashboard':
      return 'EXECUTIVE SCORECARD';
    case 'table_of_contents':
      return 'AGENDA ROADMAP';
    case 'mission_vision':
      return 'STRATEGIC COMPASS';
    case 'medical_infographic':
      return 'CLINICAL MONITOR';
    default:
      return sceneType === 'example_stat' ? 'REAL EXAMPLE' : 'KEY INSIGHT';
  }
}

/**
 * Derives the core communicative job ("Script ka Kaam") of a given segment.
 * Ensures every scene explains a deliberate rhetorical mental model.
 */
export function deriveRhetoricalPurpose(text: string, layout: VisualLayoutType, sceneNum: number): string {
  if (sceneNum === 1) return 'High-Impact Hook & Curiosity Trap';
  if (layout === 'comparison' || layout === 'vs_battle' || layout === 'before_after_transformation') {
    return 'Dichotomy / Contrasting Competing Paradigms';
  }
  if (layout === 'stat_card' || layout === 'scorecard_dashboard' || layout === 'data_visualization') {
    return 'Quantifiable Proof / Financial Impact Metric';
  }
  if (layout === 'horizontal_process' || layout === 'workflow' || layout === 'process_steps') {
    return 'Sequential Multi-Step Execution Pipeline';
  }
  if (layout === 'curved_roadmap' || layout === 'roadmap' || layout === 'vertical_roadmap') {
    return 'Long-Term Horizon / Multi-Phase Evolution';
  }
  if (layout === 'horizontal_shelves' || layout === 'circular_org_chart' || layout === 'ecosystem') {
    return 'Layered System Architecture / Hub Network';
  }
  if (layout === 'quote') {
    return 'Mindset Axiom / First-Principles Philosophy';
  }
  if (layout === 'checklist') {
    return 'Actionable Rule Checklist / Tactical Pillars';
  }
  if (layout === 'search_discovery' || layout === 'prompt_window') {
    return 'Root Cause Inquiry / Direct Search Exploration';
  }
  return 'Mental Model / Conceptual Framework Explanation';
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
  'curved_roadmap',
  'circular_org_chart',
  'horizontal_shelves',
  'scorecard_dashboard',
  'table_of_contents',
  'mission_vision',
  'medical_infographic',
  'library_overlay',
  'hook',
]);

const SceneBlueprintItemSchema = z.object({
  sceneNumber: z.number().int().positive().optional().default(1),
  sceneType: NarrativeSceneTypeSchema.optional().default('main_point'),
  layoutType: VisualLayoutTypeSchema.optional().default('vector_concept'),
  rhetoricalPurpose: z.string().optional(),
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
      bodyFont: z.string().optional().default('Montserrat'),
    })
    .optional()
    .default({ headingFont: 'Montserrat', bodyFont: 'Montserrat' }),
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

  // S3 Curated Asset Assignment Metadata (server-side enriched, not AI-generated)
  assignedAssetId: z.string().optional().default(''),
  assetUrl: z.string().optional().default(''),
  assetTitle: z.string().optional().default(''),
  assetStyle: z.string().optional().default(''),

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

  // Autonomous Motion Graphic Library Component Overlay
  overlayComponent: z.object({
    componentId: z.string(),
    name: z.string().optional(),
    category: z.string().optional(),
    props: z.record(z.string(), z.any()).optional(),
    cinematic: z.boolean().optional(),
    scale: z.number().optional(),
    placement: z.enum(['center', 'lower-third', 'split-right', 'split-left']).optional(),
  }).optional(),
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

    // 1. Scene 1 is always the HookTypographyScene; Final scene is OutroScene
    if (i === 0) {
      scene.layoutType = 'hook';
      scene.sceneType = 'hook';
      if (!scene.highlightedWords || scene.highlightedWords.length === 0) {
        scene.highlightedWords = extractKeywordEmphasis(text || scene.heading, 2);
      }
    } else if (i === blueprint.scenes.length - 1 && blueprint.scenes.length >= 3) {
      const isOutroSubscribe = /\b(subscribe|channel|follow|like this video|bell icon)\b/i.test(text);
      scene.layoutType = isOutroSubscribe ? 'creator_celebration' : 'fullscreen_statement';
      scene.sceneType = 'next_point';
    } else if (!scene.highlightedWords || scene.highlightedWords.length === 0) {
      scene.highlightedWords = extractKeywordEmphasis(text || scene.heading, 2);
    }

    // 2. Anti-Repetition: ZERO consecutive identical layouts (Rule 2.1)
    if (i >= 1) {
      const prev = processedScenes[i - 1];
      if (scene.layoutType === prev.layoutType) {
        const canonicalAlternatives: VisualLayoutType[] = [
          'curved_roadmap',
          'scorecard_dashboard',
          'horizontal_shelves',
          'circular_org_chart',
          'mission_vision',
          'card_concept',
          'horizontal_process',
          'comparison',
          'checklist',
          'stat_card',
          'workflow',
        ];
        const nextAlt = canonicalAlternatives.find((alt) => alt !== prev.layoutType && (i < 2 || alt !== processedScenes[i - 2]?.layoutType)) || 'card_concept';
        scene.layoutType = nextAlt;
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

    // 3B. Autonomous Motion Graphic Library Component Matcher (1,282 Components)
    // Only attach overlayComponent on generic scenes (never overwrite structured comparison/stat/process layouts)
    if (
      i > 0 &&
      i < blueprint.scenes.length - 1 &&
      !scene.overlayComponent &&
      (scene.layoutType === 'card_concept' || scene.layoutType === 'vector_concept')
    ) {
      const match = matchComponentForScene(text, scene.heading, 4.2);
      if (match) {
        scene.overlayComponent = {
          componentId: match.componentId,
          name: match.name,
          category: match.category,
          props: match.props,
          cinematic: true,
          scale: 1.0,
          placement: 'center',
        };
        scene.layoutType = 'library_overlay';
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

    // 5b. Guard against weak generic boilerplate headings or verbatim transcript echoes
    const rawH = String(scene.heading || '').trim();
    if (!rawH || /^(?:key insight|important point|summary|overview|note|point|concept|strategy|tip|conclusion)$/i.test(rawH) || rawH.split(/\s+/).length < 2) {
      scene.heading = deriveFactualHeadingFromSentence(text);
    }
    const rawS = String(scene.supportingText || '').trim();
    if (rawS && rawS.toLowerCase() === text.toLowerCase()) {
      scene.supportingText = generateCleanTakeaway(text, scene.heading);
    }

    // 6. Category Pill
    if (!scene.categoryPill) {
      scene.categoryPill = deriveCategoryPillForScene(scene.layoutType, scene.sceneType);
    }

    // 6b. Always derive (or re-derive) composition AFTER layout has been normalised/mutated by rules 2-4.
    // Unconditional so that anti-repetition layout swaps don't leave a stale composition.
    scene.composition = deriveSceneComposition(
      scene.layoutType,
      Boolean(scene.assetUrl || scene.assignedAssetId)
    );

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
    totalDurationSeconds: Number(finalDuration.toFixed(3)),
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

  const isShorts = options.aspectRatio === '9:16' || options.videoType === 'facelessShorts';
  const primaryFont = options.fontFamily || options.headingFont || options.bodyFont || 'Montserrat';
  const headingFont = primaryFont;
  const bodyFont = primaryFont;
  const backgroundTheme = options.backgroundTheme || 'studio-white';
  const timelineSegments = buildDeterministicSentenceTimeline(transcript, {
    minDurationSeconds: isShorts ? 2.0 : 2.5,
    maxDurationSeconds: isShorts ? 10.0 : 18.0,
  });

  // Pre-search S3 asset catalog so deterministic fallback also gets real assets
  const fullText = transcript.map((t) => t.text).join(' ');
  const deterministicAssets = searchS3AssetCatalog(fullText, { maxResults: isShorts ? 20 : 36 });
  const deterministicUsedIds = new Set<string>();

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

    const hasRealMetric = /(\$|€|£|₹)\s*\d+|\b\d+(?:\.\d+)?\s*(%|percent|x|times|crore|lakh|million|billion)\b|thousands?\s+of\s+dollars|save\s+money/i.test(text);

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
      const variedCadence: VisualLayoutType[] = [
        'curved_roadmap',
        'scorecard_dashboard',
        'horizontal_shelves',
        'circular_org_chart',
        'mission_vision',
        'card_concept',
        'horizontal_process',
        'workflow',
        'checklist',
        'comparison',
        'stat_card',
      ];
      layoutType = variedCadence[i % variedCadence.length];
      sceneType = i === timelineSegments.length - 1 ? 'next_point' : 'main_point';
      sfx = 'woosh';
    }

    // Autonomous Motion Graphic Library Matching (1,282 Components)
    const compMatch = i > 0 ? matchComponentForScene(text, undefined, 3.0) : null;
    const overlayComponent = compMatch ? {
      componentId: compMatch.componentId,
      name: compMatch.name,
      category: compMatch.category,
      props: compMatch.props,
      cinematic: true,
      scale: 1.0,
      placement: 'center' as const,
    } : undefined;

    if (overlayComponent) {
      layoutType = 'library_overlay';
    }

    const keywords =
      assetPlan.highlightedWords && assetPlan.highlightedWords.length > 0
        ? assetPlan.highlightedWords
        : extractKeywordEmphasis(text, 2);

    const heading = generateCleanConceptHeading(text);
    let rawTakeaway =
      (typographyAnalysis as any).suggestedSupportingText ||
      assetPlan.suggestedSupportingText ||
      generateCleanTakeaway(text, '');

    // Rule 7: Never duplicate the narration sentence in the supporting text card
    const supportingText =
      rawTakeaway && rawTakeaway.toLowerCase() !== text.toLowerCase() && rawTakeaway.length <= 65
        ? rawTakeaway
        : undefined;

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

    // S3 asset assignment for deterministic path (matches visible-asset layouts)
    let deterministicAssetUrl: string | undefined;
    let deterministicAssetId: string | undefined;
    let deterministicAssetTitle: string | undefined;
    let deterministicAssetStyle: string | undefined;
    if (layoutType === 'card_concept' || layoutType === 'image_text' || layoutType === 'full_bleed_visual') {
      const candidate = deterministicAssets.find((a) => !deterministicUsedIds.has(a.id));
      if (candidate) {
        deterministicUsedIds.add(candidate.id);
        deterministicAssetId = candidate.id;
        deterministicAssetUrl = candidate.absoluteUrl;
        deterministicAssetTitle = candidate.title;
        deterministicAssetStyle = candidate.style;
      }
    }

    // Derive canvas composition plan
    const deterministicComposition = deriveSceneComposition(layoutType, Boolean(deterministicAssetUrl));

    scenes.push({
      sceneNumber: seg.id,
      sceneType,
      layoutType,
      rhetoricalPurpose: deriveRhetoricalPurpose(text, layoutType, seg.id),
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
      typographyTreatment: typographyAnalysis.layoutMode as any,
      listItems: structuredSteps,
      timelineSteps: structuredSteps,
      checklistItems: structuredSteps,
      comparisonItems,
      vectorDrawingId,
      assignedAssetId: deterministicAssetId,
      assetUrl: deterministicAssetUrl,
      assetTitle: deterministicAssetTitle,
      assetStyle: deterministicAssetStyle,
      composition: deterministicComposition,
      overlayComponent,
      statValue:
        hasRealMetric && typographyAnalysis.statData?.value
          ? typographyAnalysis.statData.value
          : (/\bthousands?\s+of\s+dollars\b/i.test(text) ? '$0' : (/\bsave\s+money\b/i.test(text) ? '100%' : (/\bcosts?\b/i.test(text) ? 'LOW RISK' : undefined))),
      statLabel:
        hasRealMetric && typographyAnalysis.statData?.value
          ? typographyAnalysis.statData.label || (typographyAnalysis as any).suggestedHeading
          : (/\bthousands?\s+of\s+dollars\b/i.test(text) ? 'DRIVER SALARIES' : (/\bsave\s+money\b/i.test(text) ? 'ON-DEMAND ACCESS' : (/\bcosts?\b/i.test(text) ? 'PREDICTABLE MARGINS' : undefined))),
      statTrend: (typographyAnalysis.statData as any)?.trend,
      quoteAuthor: (typographyAnalysis as any).quoteData?.author || undefined,
      numberBadge: seg.chapterNumber,
      chartValuePercent: Math.min(95, 60 + ((i * 7) % 35)),
    });
  }

  const rawBlueprint: FullVideoSceneBlueprint = {
    title: options.title || 'Professional Faceless Video',
    overallNarrativeMood: 'High Engagement Dynamic Presentation',
    totalDurationSeconds: Number((timelineSegments[timelineSegments.length - 1].end - timelineSegments[0].start).toFixed(3)),
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
/**
 * Shared LLM JSON Caller (Groq primary -> Gemini fallback)
 * Used by both Stage 1 (Scene Structure Outline) and Stage 2 (Independent Per-Scene Visual Plan).
 */
async function callPlannerLLMJson(
  prompt: string,
  systemPrompt: string,
  groqApiKey?: string,
  // geminiApiKey is kept in signature for backward-compat but Gemini now routes through Vertex AI
  _geminiApiKey?: string
): Promise<any | null> {
  let rawText: string | null = null;

  // — Provider 1: Groq (Key #1 → Key #2 failover handled inside fetchGroqWithFailover) —
  if (groqApiKey || getGroqApiKeys().length > 0) {
    try {
      const groqRes = await fetchGroqWithFailover(
        'https://api.groq.com/openai/v1/chat/completions',
        (key) => ({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        }),
        '[AIScenePlanner]'
      );
      if (groqRes.ok) {
        const groqData = await groqRes.json();
        rawText = groqData?.choices?.[0]?.message?.content || null;
      } else {
        console.warn('[AIScenePlanner] All Groq keys failed with status:', groqRes.status);
      }
    } catch (groqErr) {
      console.warn('[AIScenePlanner] Groq failover exhausted, attempting Vertex AI Gemini:', groqErr);
    }
  }

  // — Provider 2: Vertex AI Gemini (uses Google Cloud Credits via service account / ADC) —
  // This deliberately bypasses the AI Studio key (GEMINI_API_KEY) which has its own separate quota.
  // Vertex AI charges against the GCP project (geometric-hull-501707-m2) where ~$402 credits remain.
  if (!rawText) {
    const vertexModel = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
    try {
      const vertexText = await callVertexGemini({
        prompt,
        systemPrompt,
        model: vertexModel,
        temperature: 0.2,
        responseSchema: { type: 'object' },
      });
      if (vertexText) {
        rawText = vertexText;
      } else {
        // Try fallback Vertex model
        const fallbackModel = (process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.0-flash').trim();
        if (fallbackModel !== vertexModel) {
          const fallbackText = await callVertexGemini({
            prompt,
            systemPrompt,
            model: fallbackModel,
            temperature: 0.2,
            responseSchema: { type: 'object' },
          });
          if (fallbackText) rawText = fallbackText;
        }
      }
    } catch (vertexErr) {
      console.warn('[AIScenePlanner] Vertex AI Gemini call failed:', vertexErr);
    }
  }

  // — All providers exhausted: throw structured error (never return boilerplate/null) —
  if (!rawText) {
    throw new Error(
      'AI_PROVIDER_EXHAUSTED: All AI providers (Groq Key #1, Groq Key #2, Vertex AI Gemini) failed. ' +
      'Please click Retry — no credits were used.'
    );
  }

  try {
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error(
      'AI_PROVIDER_EXHAUSTED: AI response could not be parsed as JSON. Please click Retry — no credits were used.'
    );
  }
}

function deriveFactualHeadingFromSentence(text: string): string {
  const stop = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'that', 'this', 'these', 'those',
    'here', 'heres', 'there', 'where', 'when', 'what', 'which', 'who', 'how', 'why',
    'can', 'could', 'will', 'would', 'should', 'have', 'has', 'had', 'are', 'is', 'was',
    'were', 'be', 'been', 'being', 'to', 'of', 'in', 'on', 'at', 'by', 'from', 'into',
    'their', 'your', 'our', 'they', 'you', 'we', 'it', 'its', 'just', 'simply', 'instead', 'means',
  ]);
  const words = String(text || '')
    .replace(/[^a-zA-Z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !stop.has(w.toLowerCase().replace(/'/g, '')));
  const picked = words.slice(0, 3);
  return picked.length >= 2 ? picked.join(' ').toUpperCase() : 'KEY SCENE INSIGHT';
}

function resolveSubjectNaturalColors(
  text: string,
  backgroundTheme: string,
  aiPrimary?: string,
  aiSecondary?: string
): { primary: string; secondary: string } {
  const bg = (backgroundTheme || 'solid-white').toLowerCase();
  const isDarkBg =
    bg.includes('dark') ||
    bg.includes('black') ||
    bg.includes('navy') ||
    bg.includes('midnight') ||
    bg.includes('charcoal') ||
    bg.includes('purple-vignette') ||
    bg === '#000000' ||
    bg === '#0f172a' ||
    bg === '#18181b';

  const isValidHex = (c?: string) => typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c.trim());
  if (isValidHex(aiPrimary) && isValidHex(aiSecondary)) {
    return { primary: aiPrimary!.trim(), secondary: aiSecondary!.trim() };
  }

  const lower = text.toLowerCase();
  if (/\b(plant|tree|leaf|forest|nature|garden|farm|soil|organic|eco|green)\b/.test(lower)) {
    return isDarkBg
      ? { primary: '#4ADE80', secondary: '#D97706' }
      : { primary: '#15803D', secondary: '#92400E' };
  }
  if (/\b(video|edit|timeline|premiere|render|camera|studio|software|code|terminal|app)\b/.test(lower)) {
    return isDarkBg
      ? { primary: '#38BDF8', secondary: '#FBBF24' }
      : { primary: '#1E293B', secondary: '#D97706' };
  }
  if (/\b(money|invest|wealth|gold|profit|revenue|bank|cash|coin|stock)\b/.test(lower)) {
    return isDarkBg
      ? { primary: '#FBBF24', secondary: '#34D399' }
      : { primary: '#B45309', secondary: '#047857' };
  }
  if (/\b(health|medical|brain|body|sleep|water|heart|science|lab)\b/.test(lower)) {
    return isDarkBg
      ? { primary: '#2DD4BF', secondary: '#60A5FA' }
      : { primary: '#0F766E', secondary: '#0369A1' };
  }
  if (/\b(warning|danger|mistake|risk|loss|avoid|error|fail)\b/.test(lower)) {
    return isDarkBg
      ? { primary: '#F87171', secondary: '#FBBF24' }
      : { primary: '#DC2626', secondary: '#B45309' };
  }
  return isDarkBg
    ? { primary: '#F59E0B', secondary: '#38BDF8' }
    : { primary: '#C2410C', secondary: '#0369A1' };
}

/**
 * Generates an elite, high-retention video blueprint using a 2-Stage Per-Scene Architecture:
 * 1. Builds a deterministic sentence-accurate timeline (zero artificial chopping).
 * 2. STAGE 1 (AI Content Structure Outline): Decides each scene's layoutType, itemCount, and rhetoricalPurpose.
 * 3. STAGE 2 (Independent Per-Scene Visual Plan in parallel batches): Generates small, focused JSON per scene.
 * 4. STAGE 3 (Deterministic Template Mapper): Maps each scene's AI decision dynamically onto Remotion templates.
 */
export async function generateStructuredSceneBlueprint(
  transcript: TranscriptChunk[],
  options: ScenePlannerOptions = {}
): Promise<FullVideoSceneBlueprint> {
  if (!transcript || transcript.length === 0) {
    throw new Error('AI_PLANNING_FAILED: Transcript is empty. Please retry — no credits were used.');
  }

  // 1. Build natural sentence-by-sentence timeline strictly in code (zero artificial 3-6s chopping)
  const isShorts = options.aspectRatio === '9:16' || options.videoType === 'facelessShorts';
  const timelineSegments = buildDeterministicSentenceTimeline(transcript, {
    minDurationSeconds: 2.5,
    maxDurationSeconds: isShorts ? 10.0 : 18.0,
    chapterDurationSeconds: isShorts ? 45.0 : 70.0,
  });

  if (timelineSegments.length === 0) {
    throw new Error('AI_PLANNING_FAILED: Could not segment spoken narration. Please retry — no credits were used.');
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const groqApiKey = getGroqApiKeys()[0];
  if (!geminiApiKey && !groqApiKey) {
    throw new Error('AI_PLANNING_FAILED: No AI scene planning provider keys configured.');
  }

  const primaryFont = options.fontFamily || options.headingFont || options.bodyFont || 'Montserrat';
  const headingFont = primaryFont;
  const bodyFont = primaryFont;
  const backgroundTheme = options.backgroundTheme || 'studio-white';

  // 1.5. Pre-search S3 Asset Catalog for the entire transcript
  const fullTranscriptText = transcript.map((t) => t.text).join(' ');
  const availableS3Assets = searchS3AssetCatalog(fullTranscriptText, {
    maxResults: isShorts ? 20 : 36,
  });
  const usedAssetIds = new Set<string>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 1: LIGHTWEIGHT AI CONTENT STRUCTURE OUTLINE
  // Decides layoutType, itemCount, and rhetoricalPurpose per scene before building JSON
  // ═══════════════════════════════════════════════════════════════════════════
  const formatLabel = isShorts
    ? '9:16 Vertical Shorts (1080x1920, fast-paced vertical storytelling)'
    : '16:9 Widescreen YouTube Explainer (1920x1080, Vox / Johnny Harris style)';

  const outlineMap = new Map<number, { layoutType: VisualLayoutType; itemCount: number; rhetoricalPurpose: string }>();

  const creatorDirective =
    options.creatorStyle === 'sara-finance'
      ? `\nCREATOR STYLE (Sara Finance): Use punchy ALL-CAPS 2-4 word headlines, favor high-contrast stat_card, comparison, checklist, and card_concept layouts, and highlight exact dollar figures or key action phrases.`
      : options.creatorStyle === 'ali-abdaal'
        ? `\nCREATOR STYLE (Ali Abdaal): Use warm, calm editorial phrasing, favor card_concept, numbered_steps, and horizontal_process layouts with clean breathing room.`
        : '';

  try {
    const outlinePrompt = `You are an elite documentary video director for ${formatLabel}.${creatorDirective}
For each narration segment below, decide ONLY the content structure — do NOT write full scene copy yet:
1. "rhetoricalPurpose": What this segment communicates (e.g. "Contrasting old vs new", "Quantifying ROI", "3-step workflow", "Core mindset quote").
2. "layoutType": Choose the BEST fitting template from:
   - "hook" (ONLY segmentId 1)
   - "chapter_title" (ONLY when isChapterStart is true and segmentId > 1)
   - "stat_card" (1 hero number/metric)
   - "comparison" or "before_after_transformation" (2 contrasting sides)
   - "horizontal_process" | "workflow" | "curved_roadmap" (3-5 sequential steps/milestones)
   - "scorecard_dashboard" | "data_visualization" (2-5 quantitative metrics/bars)
   - "horizontal_shelves" | "circular_org_chart" | "checklist" (2-5 list items/pillars/tiers)
   - "quote" (mindset axiom)
   - "card_concept" | "drawing_story" (single visual concept)
   RULE: NEVER pick the same layoutType twice in a row.
3. "itemCount": How many items this scene's narration naturally contains (0 for hook/card_concept/quote/drawing_story, 1 for stat_card, 2 for comparison/before_after_transformation, 2-5 for checklist/horizontal_process/workflow/curved_roadmap/data_visualization/horizontal_shelves).

Segments:
${JSON.stringify(
  timelineSegments.map((s) => ({
    segmentId: s.id,
    durationSeconds: s.duration,
    isChapterStart: s.isChapterStart,
    text: s.text,
  })),
  null,
  2
)}

Return strict JSON:
{
  "outlines": [
    { "segmentId": 1, "rhetoricalPurpose": "...", "layoutType": "hook", "itemCount": 0 }
  ]
}`;

    const outlineParsed = await callPlannerLLMJson(
      outlinePrompt,
      'You are an expert video structure planner. Always respond in valid JSON.',
      groqApiKey,
      geminiApiKey
    );

    if (Array.isArray(outlineParsed?.outlines)) {
      outlineParsed.outlines.forEach((o: any) => {
        if (o?.segmentId) {
          outlineMap.set(Number(o.segmentId), {
            layoutType: normalizeVisualLayout(o.layoutType),
            itemCount: Math.max(0, Math.min(6, Number(o.itemCount ?? 0) || 0)),
            rhetoricalPurpose: String(o.rhetoricalPurpose || '').trim(),
          });
        }
      });
    }
  } catch (outlineErr) {
    console.warn('[AIScenePlanner] Stage 1 outline error, falling back to per-scene defaults:', outlineErr);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 2: INDEPENDENT PER-SCENE VISUAL PLAN (Batched Parallel Execution)
  // Each scene gets its own small, independent JSON call — never one massive monolithic JSON
  // ═══════════════════════════════════════════════════════════════════════════
  const BATCH_CONCURRENCY = 2;
  const INTER_BATCH_DELAY_MS = 250;
  const plannedScenes: SceneBlueprintItem[] = [];
  let prevLayouts: string[] = [];
  let prevDrawingId: string | undefined;
  let aiSucceededScenesCount = 0;

  for (let bStart = 0; bStart < timelineSegments.length; bStart += BATCH_CONCURRENCY) {
    if (bStart > 0) {
      await new Promise((resolve) => setTimeout(resolve, INTER_BATCH_DELAY_MS));
    }
    const batchSegments = timelineSegments.slice(bStart, bStart + BATCH_CONCURRENCY);

    // Filter unused S3 assets so parallel scenes in this batch don't duplicate visuals
    const batchAssetSlice = availableS3Assets.filter((a) => !usedAssetIds.has(a.id)).slice(0, 18);
    const batchAssetPromptText = formatAssetCatalogForPrompt(batchAssetSlice);

    const batchDecisions = await Promise.all(
      batchSegments.map(async (seg) => {
        const outline = outlineMap.get(seg.id);
        const targetLayout = outline?.layoutType || (seg.id === 1 ? 'hook' : seg.isChapterStart ? 'chapter_title' : 'card_concept');
        const targetItemCount = outline?.itemCount ?? 3;
        const targetPurpose = outline?.rhetoricalPurpose || '';

        const singleScenePrompt = `You are planning ONLY Scene #${seg.id} for ${formatLabel}.

Scene #${seg.id} Context:
- Spoken Narration (${seg.duration}s): "${seg.text}"
- Suggested Layout Template: "${targetLayout}"
- Target Item Count: ${targetItemCount}
- Communication Purpose: "${targetPurpose}"
- Selected Canvas Background: "${backgroundTheme}"

Rules:
1. "heading": Punchy 2-5 word headline (NEVER "KEY INSIGHT", "IMPORTANT POINT", "SUMMARY", or "OVERVIEW").
2. "supportingText": Crisp 6-12 word takeaway — NEVER echo the exact spoken narration text.
3. "highlightedWords": 1-2 impact words from the headline/narration.
4. Natural Subject-Matched Colors ("accentColor", "secondaryColor" as 6-digit hex):
   - Use realistic, subject-appropriate colors (e.g. green #15803D/#4ADE80 for plants/nature, brown #92400E for soil/coffee, dark studio #1E293B for video-editing/UI, gold #D97706 for finance, teal #0F766E for health) instead of generic website brand colors.
   - Ensure high contrast against "${backgroundTheme}" so nothing blends into or disappears on the background.
5. Populate the exact fields needed for "${targetLayout}" with ${targetItemCount > 0 ? targetItemCount : 'appropriate'} items:
   - If stat_card/scorecard_dashboard: include "statValue" (e.g. "$10K", "85%", "3X") and "statLabel".
   - If comparison/before_after_transformation: include "comparisonItems": { "left": "...", "right": "..." }.
   - If checklist/horizontal_process/workflow/curved_roadmap/horizontal_shelves/circular_org_chart: include "listItems" array with EXACTLY ${Math.max(2, Math.min(5, targetItemCount || 3))} concise items.
   - If data_visualization: include "chartItems" array with ${Math.max(2, Math.min(5, targetItemCount || 3))} items ({ "label": "...", "value": 80, "formattedValue": "80%" }).
   - If card_concept/image_text: pick the best matching "assignedAssetId" from the S3 assets below (or "" if none fits).
6. If narration is Hindi/Hinglish, provide English meaning in "englishMeaning".

Available Unused Visual Assets:
${batchAssetPromptText}

Return strict JSON for ONLY this single scene:
{
  "segmentId": ${seg.id},
  "rhetoricalPurpose": "${targetPurpose || 'Explain key point clearly'}",
  "sceneType": "${seg.id === 1 ? 'hook' : seg.isChapterStart ? 'transition' : 'main_point'}",
  "layoutType": "${targetLayout}",
  "heading": "BUILD REAL LEVERAGE",
  "supportingText": "Focus on scalable systems instead of trading hours.",
  "englishMeaning": "",
  "highlightedWords": ["LEVERAGE"],
  "accentColor": "#15803D",
  "secondaryColor": "#92400E",
  "assignedAssetId": "",
  "vectorDrawingId": "character_business_leader",
  "comparisonItems": { "left": "Old Way", "right": "New System" },
  "listItems": [],
  "statValue": "",
  "statLabel": "",
  "statTrend": "up",
  "chartItems": [],
  "donutSlices": [],
  "quoteAuthor": "",
  "sfx": "whoosh",
  "animation": "slow_zoom_in"
}`;

        const parsed = await callPlannerLLMJson(
          singleScenePrompt,
          'You are an expert motion graphics scene designer. Respond with valid JSON for a single video scene.',
          groqApiKey,
          geminiApiKey
        );

        return { seg, outline, decision: parsed };
      })
    );

    // ═════════════════════════════════════════════════════════════════════════
    // STAGE 3: DETERMINISTIC TEMPLATE MAPPER & DYNAMIC INSTANCE CREATION
    // ═════════════════════════════════════════════════════════════════════════
    batchDecisions.forEach(({ seg, outline, decision }, sIdx) => {
      const hasValidHeading =
        typeof decision?.heading === 'string' &&
        decision.heading.trim().split(/\s+/).length >= 2 &&
        !/^(?:key insight|important point|summary|overview|note|point|concept|strategy|tip|conclusion)$/i.test(
          decision.heading.trim()
        );
      const hasValidSupporting =
        typeof decision?.supportingText === 'string' && decision.supportingText.trim().split(/\s+/).length >= 3;
      if (decision && hasValidHeading && hasValidSupporting) {
        aiSucceededScenesCount += 1;
      }
      const text = seg.text;
      const assetPlan = planVisualAssetsForSentence(text);
      const typographyAnalysis = analyzeTypographyContent(text);
      const hasRealMetric = /(\$|€|£|₹)\s*\d+|\b\d+(?:\.\d+)?\s*(%|percent|x|times|crore|lakh|million|billion)\b/i.test(text);

      let chosenLayout: VisualLayoutType = decision?.layoutType
        ? normalizeVisualLayout(decision.layoutType)
        : outline?.layoutType || 'vector_concept';

      const aiRhetoricalPurpose = String(decision?.rhetoricalPurpose || outline?.rhetoricalPurpose || '').trim();

      // Editorial Intelligence Guardrails
      if ((hasRealMetric || /metric|proof|revenue|profit|cost|numbers|roi|\bpercent\b/i.test(aiRhetoricalPurpose)) && (chosenLayout === 'vector_concept' || chosenLayout === 'card_concept' || chosenLayout === 'drawing_story' || !decision)) {
        chosenLayout = 'stat_card';
      } else if ((/\b(?:versus|vs\.?|compared to|instead of|rather than|better than|traditionally)\b/i.test(text) || /contrast|dichotomy|versus|vs|difference|compare/i.test(aiRhetoricalPurpose)) && (chosenLayout === 'vector_concept' || chosenLayout === 'card_concept' || !decision)) {
        chosenLayout = isShorts ? 'comparison' : 'before_after_transformation';
      } else if ((/\b(?:step\s*\d+|first|second|third|finally|workflow|process steps|roadmap)\b/i.test(text) || /process|sequence|workflow|steps|roadmap|pipeline/i.test(aiRhetoricalPurpose)) && (chosenLayout === 'vector_concept' || chosenLayout === 'card_concept' || !decision)) {
        chosenLayout = isShorts ? 'workflow' : 'horizontal_process';
      }

      if (!decision && !outline) {
        if (seg.id === 1) chosenLayout = 'hook';
        else if (seg.isChapterStart && seg.id > 1) chosenLayout = 'chapter_title';
        else if (hasRealMetric && typographyAnalysis.statData?.value) chosenLayout = 'stat_card';
        else if (/\b(?:versus|vs\.?|compared to|instead of|rather than)\b/i.test(text)) chosenLayout = 'comparison';
        else if (typographyAnalysis.layoutMode === 'list' && typographyAnalysis.listItems && typographyAnalysis.listItems.length >= 2) chosenLayout = 'checklist';
        else {
          const fallbackCadence: VisualLayoutType[] = isShorts
            ? ['card_concept', 'supporting_note', 'numbered_steps', 'stat_card']
            : ['card_concept', 'stat_card', 'horizontal_process', 'comparison', 'workflow', 'checklist', 'roadmap', 'quote'];
          chosenLayout = fallbackCadence[(bStart + sIdx) % fallbackCadence.length];
        }
      }

      // Prevent consecutive duplicate layouts (except hook/chapter_title)
      const lastLayout = prevLayouts[prevLayouts.length - 1];
      if (lastLayout && chosenLayout === lastLayout && chosenLayout !== 'hook' && chosenLayout !== 'chapter_title') {
        chosenLayout = chosenLayout === 'card_concept' ? 'checklist' : 'card_concept';
      }

      const resolvedRhetoricalPurpose = aiRhetoricalPurpose || deriveRhetoricalPurpose(text, chosenLayout, seg.id);

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

      const rawHeading = String(decision?.heading || '').trim();
      const isWeakHeading =
        !rawHeading ||
        /^(?:key insight|important point|summary|overview|note|point|concept|strategy|tip|conclusion)$/i.test(rawHeading) ||
        rawHeading.split(/\s+/).length < 2;

      const heading = isWeakHeading
        ? deriveFactualHeadingFromSentence(text)
        : rawHeading.toUpperCase();

      let rawSupporting = String(
        decision?.supportingText ||
        (typographyAnalysis as any).suggestedSupportingText ||
        assetPlan.suggestedSupportingText ||
        ''
      ).trim();

      if (!rawSupporting || rawSupporting.toLowerCase() === text.toLowerCase()) {
        rawSupporting = generateCleanTakeaway(text, heading);
      }
      const supportingText = rawSupporting;

      const keywords =
        Array.isArray(decision?.highlightedWords) && decision.highlightedWords.length > 0
          ? decision.highlightedWords.map(String)
          : extractKeywordEmphasis(text, 2);

      // Respect AI-decided itemCount dynamically (clamped safely to 2..6 for multi-item templates)
      const rawListItems = Array.isArray(decision?.listItems) && decision.listItems.length >= 2
        ? decision.listItems.map(String)
        : Array.isArray(decision?.timelineSteps) && decision.timelineSteps.length >= 2
          ? decision.timelineSteps.map(String)
          : Array.isArray(decision?.checklistItems) && decision.checklistItems.length >= 2
            ? decision.checklistItems.map(String)
            : typographyAnalysis.listItems;

      const maxDynamicItems = outline?.itemCount && outline.itemCount >= 2 ? Math.min(6, outline.itemCount) : 5;
      const aiListItems = Array.isArray(rawListItems) ? rawListItems.slice(0, maxDynamicItems) : undefined;

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
            .slice(0, maxDynamicItems)
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
        else if ((bStart + sIdx) % 3 === 0) sfx = 'woosh';
      }

      let assignedId = String(decision?.assignedAssetId || '').trim();
      let matchedAsset = assignedId && !usedAssetIds.has(assignedId) ? getCatalogAssetById(assignedId) : null;

      if (!matchedAsset && (chosenLayout === 'card_concept' || chosenLayout === 'image_text' || chosenLayout === 'full_bleed_visual')) {
        const candidate = availableS3Assets.find((a) => !usedAssetIds.has(a.id));
        if (candidate) {
          matchedAsset = candidate;
          assignedId = candidate.id;
        }
      }

      if (matchedAsset) {
        usedAssetIds.add(matchedAsset.id);
      }

      const derivedComposition = deriveSceneComposition(
        chosenLayout,
        Boolean(matchedAsset),
        decision?.composition
      );

      const subjectPalette = resolveSubjectNaturalColors(
        `${heading} ${supportingText} ${text}`,
        backgroundTheme,
        decision?.accentColor,
        decision?.secondaryColor
      );

      plannedScenes.push({
        sceneNumber: seg.id,
        sceneType,
        layoutType: chosenLayout,
        rhetoricalPurpose: resolvedRhetoricalPurpose,
        duration: seg.duration,
        accentColor: subjectPalette.primary,
        secondaryColor: subjectPalette.secondary,
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
        transition: seg.isChapterStart ? 'zoom' : (bStart + sIdx) % 3 === 0 ? 'dissolve' : 'cut',
        statValue: safeStatVal,
        statLabel: safeStatLbl,
        statTrend: decision?.statTrend || (typographyAnalysis.statData as any)?.trend,
        quoteAuthor: decision?.quoteAuthor || (typographyAnalysis as any).quoteData?.author,
        comparisonItems: aiComparisonItems,
        listItems: aiListItems,
        timelineSteps: aiListItems,
        checklistItems: aiListItems,
        chartItems: aiChartItems,
        donutSlices: aiDonutSlices,
        chatMessages: aiChatMessages,
        searchQuery: decision?.searchQuery ? String(decision.searchQuery) : undefined,
        vectorDrawingId: resolvedDrawingId,
        assignedAssetId: assignedId || undefined,
        assetUrl: matchedAsset ? matchedAsset.absoluteUrl : undefined,
        assetTitle: matchedAsset ? matchedAsset.title : undefined,
        assetStyle: matchedAsset ? matchedAsset.style : undefined,
        composition: derivedComposition,
        chartValuePercent: decision?.chartValuePercent || Math.min(95, 60 + ((seg.id * 7) % 35)),
        numberBadge: seg.chapterNumber,
      });

      prevLayouts.push(chosenLayout);
      if (prevLayouts.length > 3) prevLayouts.shift();
    });
  }

  const minRequiredAiScenes = Math.max(1, Math.ceil(timelineSegments.length * 0.6));
  if (aiSucceededScenesCount < minRequiredAiScenes) {
    throw new Error(
      `AI_PLANNING_FAILED: Only ${aiSucceededScenesCount}/${timelineSegments.length} scenes passed AI validation across Groq & Gemini. Please click Retry — no credits were used.`
    );
  }

  const rawBlueprint: FullVideoSceneBlueprint = {
    title: options.title || 'Professional Faceless Video',
    overallNarrativeMood: 'High Engagement Dynamic Presentation',
    totalDurationSeconds: Number((timelineSegments[timelineSegments.length - 1].end - timelineSegments[0].start).toFixed(3)),
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
