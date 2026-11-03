/**
 * whiteboardPlanner.ts
 * Whiteboard Animation AI Planner — Groq Qwen 2.5/3.8 + Gemini Fallback + Semantic Rule Planner.
 *
 * KEY HIGHLIGHTS:
 *   - Strictly 9:16 vertical (1080×1920) reels up to 90 seconds.
 *   - AI Content Understanding: Analyzes audio transcription, identifies key conceptual milestones.
 *   - Scene Planning: Divides video into sequential boards (scenes) with max 3 points per board.
 *   - Spoken Timing Synchronization: Anchors each point to real speech timestamps via wordStartIndex / wordEndIndex.
 *   - Procedural Vector Drawings & Hand-Drawn Icons for authentic whiteboard storytelling.
 */

import { GoogleGenAI } from '@google/genai';
import { resolveVectorDrawing, WHITEBOARD_VECTOR_DRAWINGS } from '@/lib/whiteboard/vectorDrawings';
import { WhiteboardAssetLedger, METAPHOR_MAP, WHITEBOARD_PALETTES } from './whiteboardLedger';
import {
  WB_MAX_POINTS_PER_BOARD,
  WB_MAX_WORDS_PER_POINT,
  WB_MAX_LINES_PER_POINT,
  WB_MAX_CHARS_PER_LINE,
  WB_REVEAL_LEAD_SECONDS,
  WB_MIN_DISPLAY_SECONDS,
} from '@/lib/whiteboard/whiteboardConstants';
import type { ReelWord } from './reelPlanner';
import { buildWhiteboardPrompt } from './prompts/whiteboard.prompt';

// ── Public types ──────────────────────────────────────────────────────────────

export type WhiteboardPoint = {
  text: string;
  title?: string;
  /** Frame-exact start: when full text becomes visible (computed from word timestamps). */
  startTime: number;
  /** Frame-exact end: last word of this point finishes. */
  endTime: number;
  /** Spoken focus start (= startTime, synced to speech). */
  focusStartTime: number;
  /** Spoken focus end. */
  focusEndTime: number;
  markerColor: string;
  bulletType: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
  isHighlight?: boolean;
  icon?: string;
  iconUrl?: string;
  drawingId?: string;
  boardIndex: number;
  focusType: 'circle' | 'underline' | 'box' | 'arrow' | 'highlight';
};

export type WhiteboardTableRow = {
  label: string;
  value: string;
  subValue?: string;
  iconUrl?: string;
  startTime: number;
  endTime: number;
};

export type WhiteboardQuiz = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  questionStart: number;
  timerStart: number;
  revealStart: number;
};

export interface InfographicBracketItem {
  label: string;
  icon: 'medical_emergency' | 'car_repairs' | 'graduation_cap' | 'future_house' | 'growth_chart' | 'lightbulb_idea' | 'handshake_deal' | string;
}

export interface InfographicBottomCard {
  label: string;
  icon: 'emergency_siren' | 'wealth_plant' | 'target_bullseye' | 'character_happy' | 'lightbulb_idea' | 'growth_chart' | string;
}

export interface WhiteboardStoryInfographicProps {
  titlePrefix?: string;
  titleAccent?: string;
  thoughtText?: string;
  bracketHeader?: string;
  bracketItems?: InfographicBracketItem[];
  centerStatement?: string;
  heroLabel?: string;
  heroType?: string;
  sideNote?: string;
  bottomSubhead?: string;
  bottomCards?: InfographicBottomCard[];
  showHand?: boolean;
}

export type WhiteboardArchetype =
  | 'split_story'          // side-by-side: drawing left, bold colored text right (Master Explainer)
  | 'hero_center'          // one big visual, title above, short label below
  | 'stat_callout'         // huge number plus 1-2 side notes
  | 'split_comparison'     // top vs bottom with VS marker
  | 'step_ladder'          // 3-5 steps alternating left and right
  | 'hub_spoke'            // center concept with 3-5 spokes
  | 'keyword_slam'         // one huge kinetic word with small doodle
  | 'before_after'         // two states with arrow between them
  | 'checklist'            // ticks drawn one by one
  | 'cycle_loop'           // 3-4 nodes with circular arrows
  | 'funnel_pyramid'       // stages narrowing down
  | 'character_bubble'     // character with speech/thought bubble
  | 'chart_scene';         // hand-drawn bar or line chart

export type HeroModality = 'kinetic_keyword' | 'illustrative_doodle' | 'structured_diagram' | 'hand_drawn_chart';

export interface VisualIntent {
  beatIndex: number;
  role: 'hook' | 'problem' | 'explain' | 'example' | 'comparison' | 'stat' | 'steps' | 'cta';
  takeaway: string;
  type: 'concept' | 'process' | 'comparison' | 'stat' | 'story' | 'quote';
  entities: string[];
  action: string;
  emotion: string;
  metaphors: string[];
  soundOffTest: string;
}

export interface WhiteboardExplanationLine {
  text: string;
  highlightWord?: string;
  highlightColor?: string;
}

export interface WhiteboardScene {
  id: string;
  sceneIndex: number;
  startTime: number;
  endTime: number;
  duration: number;
  timeLabel?: string;
  explanationLines?: WhiteboardExplanationLine[];
  archetype: WhiteboardArchetype;
  modality: HeroModality;
  visualIntent: VisualIntent;
  headline: string;
  label?: string;
  heroVisual: {
    drawingId: string;
    label?: string;
    metaphor?: string;
    scale?: number;
  };
  supportingItems?: Array<{
    id: string;
    text: string;
    drawingId?: string;
    subText?: string;
    isHighlight?: boolean;
  }>;
  statData?: {
    number: string;
    metric: string;
    trend?: 'up' | 'down' | 'neutral';
    context: string;
  };
  comparisonData?: {
    leftTitle: string;
    leftItem: string;
    leftIcon?: string;
    rightTitle: string;
    rightItem: string;
    rightIcon?: string;
  };
  chartData?: {
    type: 'bar' | 'line';
    labels: string[];
    values: number[];
    unit?: string;
  };
  transition: 'erase_wipe' | 'element_exit' | 'camera_pan' | 'match_cut';
  accentColor: string;
}

export type WhiteboardPlan = {
  title: string;
  titleColor: string;
  layoutType: 'cards' | 'table' | 'quiz' | 'hook' | 'infographic';
  infographicData?: WhiteboardStoryInfographicProps;
  showHand?: boolean;
  language: 'ur' | 'hi' | 'en';
  direction: 'rtl' | 'ltr';
  points: WhiteboardPoint[];
  tableRows?: WhiteboardTableRow[];
  quiz?: WhiteboardQuiz;
  conclusion: string;
  conclusionTime: number;
  source: 'groq-qwen' | 'gemini' | 'deterministic';
  aspectRatio: '9:16';
  scenes?: WhiteboardScene[];
  assetLedgerSummary?: any;
};

export type WhiteboardPlanInput = {
  transcript: string;
  /** Sentence-level segments from buildWhiteboardSegments() */
  segments: Array<{ start: number; end: number; text: string }>;
  /** Word-level timestamps from Groq Whisper (required for real timing). */
  words: ReelWord[];
  durationSeconds: number;
  topicTitle?: string;
  boardStyle?: string;
  apiKey?: string;
  aspectRatio?: '9:16';
};

// ── Internal LLM point shape ──────────────────────────────────────────────────

type RawLLMPoint = {
  text: string;
  title?: string;
  boardIndex: number;
  wordStartIndex: number;
  wordEndIndex: number;
  icon?: string;
  drawingId?: string;
  focusType?: 'circle' | 'underline' | 'box' | 'arrow' | 'highlight';
  bulletType?: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
  markerColor?: string;
  isHighlight?: boolean;
};

// ── Corporate Marker Colors ───────────────────────────────────────────────────

const COLORS = {
  title: '#0F172A',
  blue: '#1E3A8A',    // Executive Navy
  green: '#0F766E',   // Boardroom Emerald
  red: '#B91C1C',     // Vivid Crimson
  amber: '#D97706',   // Amber Gold
  grey: '#475569',
};
const POINT_COLORS = [COLORS.blue, COLORS.green, COLORS.red, COLORS.amber];

// ── Step 1: Dedicated sentence-boundary segment builder ───────────────────────

export function buildWhiteboardSegments(
  words: ReelWord[],
  durationSeconds: number
): Array<{ start: number; end: number; text: string; words: ReelWord[] }> {
  const cleaned = words
    .filter(w => typeof w.word === 'string' && w.word.trim() && Number.isFinite(w.start) && Number.isFinite(w.end))
    .map(w => ({ word: w.word.trim(), start: Math.max(0, Number(w.start)), end: Math.max(Number(w.start) + 0.08, Number(w.end)) }));

  if (!cleaned.length) return [];

  const PAUSE_GAP = 0.45; // seconds
  const MAX_SENTENCE_WORDS = 16;

  const result: Array<{ start: number; end: number; text: string; words: ReelWord[] }> = [];
  let group: typeof cleaned = [];

  const flush = () => {
    if (!group.length) return;
    result.push({
      start: group[0].start,
      end: Math.max(group[group.length - 1].end, group[0].start + 0.3),
      text: group.map(w => w.word).join(' '),
      words: group,
    });
    group = [];
  };

  for (const w of cleaned) {
    if (group.length) {
      const last = group[group.length - 1];
      const endsClause = /[.!?,;]$/.test(last.word);
      const pause = w.start - last.end;
      const tooLong = group.length >= MAX_SENTENCE_WORDS;

      if (endsClause || pause > PAUSE_GAP || tooLong) flush();
    }
    group.push(w);
  }
  flush();

  return result;
}

// ── Step 1.5: Segment script into beats (12-25 words, 5-10 seconds per beat) ──
export function segmentScriptIntoBeats(
  words: ReelWord[],
  durationSeconds: number
): Array<{ beatIndex: number; start: number; end: number; text: string; words: ReelWord[] }> {
  if (!words || !words.length) return [];

  const beats: Array<{ beatIndex: number; start: number; end: number; text: string; words: ReelWord[] }> = [];
  const TARGET_WORDS_PER_BEAT = 18; // 12-25 words target (~6-8 seconds at 2.5 wps)
  const MIN_WORDS_PER_BEAT = 10;

  let currentWords: ReelWord[] = [];
  let beatIndex = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    currentWords.push(w);

    const isLastWord = i === words.length - 1;
    const hasEnoughWords = currentWords.length >= TARGET_WORDS_PER_BEAT;
    const isPunctuationBreak = /[.!?]$/.test(w.word.trim()) && currentWords.length >= MIN_WORDS_PER_BEAT;
    const nextWordPause = words[i + 1] ? Number(words[i + 1].start) - Number(w.end) > 0.4 : false;

    if (isLastWord || isPunctuationBreak || (hasEnoughWords && nextWordPause) || currentWords.length >= 26) {
      const bStart = Number(currentWords[0].start);
      const bEnd = Number(currentWords[currentWords.length - 1].end);
      beats.push({
        beatIndex: beatIndex++,
        start: +(bStart.toFixed(3)),
        end: +(Math.max(bEnd, bStart + 1.2).toFixed(3)),
        text: currentWords.map(cw => cw.word).join(' '),
        words: [...currentWords],
      });
      currentWords = [];
    }
  }

  return beats;
}

export function formatSecondsToTimer(sec: number): string {
  const m = Math.floor(Math.max(0, sec) / 60);
  const s = Math.floor(Math.max(0, sec) % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function extractExplanationLinesFromBeat(
  text: string,
  accentColor: string = '#2563EB'
): WhiteboardExplanationLine[] {
  if (!text || !text.trim()) return [];

  const cleaned = text.replace(/\s+/g, ' ').trim();
  const rawParts = cleaned
    .split(/(?<=[.!?])\s+|(?<=[,;])\s+(?=[A-Za-z0-9])/i)
    .map(p => p.trim())
    .filter(p => p.length >= 4);

  const lines: string[] = [];
  if (rawParts.length >= 2) {
    lines.push(rawParts[0]);
    lines.push(rawParts[1]);
    if (rawParts.length >= 3 && rawParts[2].length <= 40) {
      lines.push(rawParts[2]);
    }
  } else {
    const words = cleaned.split(/\s+/).filter(Boolean);
    if (words.length <= 6) {
      lines.push(words.join(' '));
    } else {
      const splitAt = Math.ceil(words.length / 2);
      lines.push(words.slice(0, splitAt).join(' '));
      lines.push(words.slice(splitAt).join(' '));
    }
  }

  const highlightColors = ['#DC2626', '#059669', '#D97706', accentColor];

  return lines.slice(0, 3).map((lineText, idx) => {
    const candidates = lineText
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length >= 4 && !/^(with|from|that|this|have|been|they|will|what|when|your|more|some|also)$/i.test(w));

    candidates.sort((a, b) => b.length - a.length);
    const highlightWord = candidates[0] || '';
    const highlightColor = highlightColors[idx % highlightColors.length];

    return {
      text: lineText,
      highlightWord,
      highlightColor,
    };
  });
}

export interface WhiteboardConceptBreakdown {
  character?: string;
  place?: string;
  timeContext?: string;
  action?: string;
  frequency?: string;
}

export function extractConceptBreakdown(text: string): WhiteboardConceptBreakdown {
  const lower = text.toLowerCase();
  const breakdown: WhiteboardConceptBreakdown = {};

  if (/\b(boy|student|ladka|teen|kid|bacha|son|brother)\b/i.test(lower)) {
    breakdown.character = 'Boy (Student)';
  } else if (/\b(girl|ladki|daughter|sister|female|woman)\b/i.test(lower)) {
    breakdown.character = 'Girl (Student)';
  } else if (/\b(doctor|physician|surgeon|nurse|dr)\b/i.test(lower)) {
    breakdown.character = 'Doctor';
  } else if (/\b(ceo|founder|leader|businessman|manager|executive)\b/i.test(lower)) {
    breakdown.character = 'Executive Leader';
  }

  if (/\b(college|university|campus|school|classes)\b/i.test(lower)) {
    breakdown.place = 'College, Home';
  } else if (/\b(office|company|workplace|desk)\b/i.test(lower)) {
    breakdown.place = 'Office, Home';
  } else if (/\b(hospital|clinic)\b/i.test(lower)) {
    breakdown.place = 'Hospital, Clinic';
  } else if (/\b(home|house|ghar)\b/i.test(lower)) {
    breakdown.place = 'Home';
  }

  if (/\b(evening|shaam|after college|after work|sunset|pm|6pm)\b/i.test(lower)) {
    breakdown.timeContext = 'After College, Evening';
  } else if (/\b(morning|subah|early|sunrise|am)\b/i.test(lower)) {
    breakdown.timeContext = 'Early Morning';
  } else if (/\b(night|raat|late)\b/i.test(lower)) {
    breakdown.timeContext = 'Night';
  }

  if (/\b(study|studies|studying|padhai|padhna|read|learn|exam)\b/i.test(lower)) {
    breakdown.action = 'Study';
  } else if (/\b(work|working|job|mehnat|code|build)\b/i.test(lower)) {
    breakdown.action = 'Work / Build';
  } else if (/\b(save|invest|budget|savings)\b/i.test(lower)) {
    breakdown.action = 'Save / Invest';
  }

  if (/\b(every day|daily|rozana|har roz|har shaam|every evening|consistently)\b/i.test(lower)) {
    breakdown.frequency = 'Every Day (Daily Consistency)';
  }

  return breakdown;
}

// ── Step 1.6: Dynamic 2-Pass Visual Intent & Archetype Scene Builder ─────────
export function buildDynamicWhiteboardScenes(
  words: ReelWord[],
  transcript: string,
  durationSeconds: number,
  topicTitle?: string
): { scenes: WhiteboardScene[]; ledgerSummary: any } {
  const beats = segmentScriptIntoBeats(words, durationSeconds);
  const ledger = new WhiteboardAssetLedger(words.length + Math.round(durationSeconds));
  const scenes: WhiteboardScene[] = [];
  const totalBeats = Math.max(1, beats.length);
  const conceptBreakdown = extractConceptBreakdown(transcript);

  beats.forEach((beat, bIdx) => {
    const lower = beat.text.toLowerCase();
    const duration = +(Math.max(3, beat.end - beat.start).toFixed(3));
    const timeLabel = `STEP ${bIdx + 1} (${formatSecondsToTimer(beat.start)} - ${formatSecondsToTimer(beat.end)})`;
    const explanationLines = extractExplanationLinesFromBeat(beat.text, ledger.selectedPalette.accent);

    // 1. Role detection
    let role: VisualIntent['role'] = 'explain';
    if (bIdx === 0) role = 'hook';
    else if (bIdx === 1) role = 'problem';
    else if (bIdx === totalBeats - 1) role = 'cta';
    else if (/\b(vs|versus|instead of|compared to|difference|better than)\b/.test(lower)) role = 'comparison';
    else if (/\b(\d+|percent|%|million|billion|k|double|triple|rate)\b/.test(lower)) role = 'stat';
    else if (/\b(first|second|third|step|then|finally|phase|method)\b/.test(lower)) role = 'steps';
    else if (/\b(for example|like|instance|imagine|suppose|every day|after)\b/.test(lower)) role = 'example';

    // 2. Concrete Metaphor Extraction
    let matchedMetaphorKey = '';
    let heroDrawingId = 'character_thinking';

    for (const [key, variants] of Object.entries(METAPHOR_MAP)) {
      if (lower.includes(key)) {
        matchedMetaphorKey = key;
        const candidateAssets = variants.map(v => ({ id: v, familyId: key, score: 90 }));
        heroDrawingId = ledger.selectBestAsset(candidateAssets, bIdx);
        break;
      }
    }

    if (!matchedMetaphorKey) {
      // Semantic fallback matching via vector drawings
      const matchedDef = resolveVectorDrawing(beat.text);
      heroDrawingId = ledger.selectBestAsset(
        [{ id: matchedDef.id, familyId: matchedDef.category, score: 75 }],
        bIdx
      );
    }

    // 3. Archetype Selection with Pacing Rules
    let candidateArchetypes: WhiteboardArchetype[] = ['hero_center', 'hub_spoke'];
    let modality: HeroModality = 'illustrative_doodle';

    if (role === 'hook') {
      candidateArchetypes = ['keyword_slam', 'hero_center'];
      modality = 'kinetic_keyword';
    } else if (role === 'stat') {
      candidateArchetypes = ['stat_callout', 'chart_scene'];
      modality = 'hand_drawn_chart';
    } else if (role === 'comparison') {
      candidateArchetypes = ['split_comparison', 'before_after'];
      modality = 'structured_diagram';
    } else if (role === 'steps') {
      candidateArchetypes = ['step_ladder', 'checklist'];
      modality = 'structured_diagram';
    } else if (role === 'problem') {
      candidateArchetypes = ['character_bubble', 'hero_center'];
      modality = 'illustrative_doodle';
    } else if (role === 'cta') {
      candidateArchetypes = ['keyword_slam', 'hero_center'];
      modality = 'kinetic_keyword';
    }

    const archetype = ledger.pickDiverseArchetype(candidateArchetypes, totalBeats, bIdx);
    ledger.recordUsage(heroDrawingId, matchedMetaphorKey || 'general', undefined, archetype);

    // 4. Headline generation (max 4-5 punchy words, never repeating subtitle verbatim)
    const headlineWords = beat.text.split(/\s+/).slice(0, 4).join(' ');
    const headline = condenseToWhiteboardPhrase(headlineWords) || `Key Step ${bIdx + 1}`;

    // 5. Stat data extraction if stat archetype
    const numMatch = beat.text.match(/(\$?\d+[\d,.]*%?|\d+\s*(?:percent|x|k|m))/i);
    const bigStat = numMatch ? numMatch[1] : '85%';

    // 6. Transition selection (marker erase wipe every 3-4 scenes, element exit for internal steps)
    const transition: WhiteboardScene['transition'] =
      bIdx % 3 === 0 && bIdx > 0
        ? 'erase_wipe'
        : bIdx % 2 === 0
        ? 'element_exit'
        : 'camera_pan';

    const visualIntent: VisualIntent = {
      beatIndex: bIdx,
      role,
      takeaway: headline,
      type: role === 'stat' ? 'stat' : role === 'comparison' ? 'comparison' : 'concept',
      entities: [matchedMetaphorKey || 'concept'],
      action: role === 'steps' ? 'progress' : role === 'comparison' ? 'contrast' : 'reveal',
      emotion: role === 'problem' ? 'tension' : 'clarity',
      metaphors: [matchedMetaphorKey || heroDrawingId],
      soundOffTest: `${headline} represented by ${heroDrawingId}`,
    };

    scenes.push({
      id: `wb-scene-${bIdx}`,
      sceneIndex: bIdx,
      startTime: beat.start,
      endTime: beat.end,
      duration,
      timeLabel,
      explanationLines,
      archetype,
      modality,
      visualIntent,
      headline,
      heroVisual: {
        drawingId: heroDrawingId,
        label: headline,
        metaphor: matchedMetaphorKey,
        scale: 1,
      },
      supportingItems: explanationLines.slice(0, 2).map((line, li) => ({
        id: `item-${li}`,
        text: line.text,
        drawingId: li === 0 ? heroDrawingId : 'process_step_curved_arrow',
        isHighlight: li === 0,
      })),
      statData: archetype === 'stat_callout' || archetype === 'chart_scene' ? {
        number: bigStat,
        metric: beat.text.split(/\s+/).slice(0, 3).join(' '),
        trend: 'up',
        context: beat.text.slice(0, 40),
      } : undefined,
      comparisonData: archetype === 'split_comparison' || archetype === 'before_after' ? {
        leftTitle: 'Traditional',
        leftItem: beat.text.split(/\s+/).slice(0, 4).join(' '),
        leftIcon: 'comparison_cross_error',
        rightTitle: 'With AI',
        rightItem: beat.text.split(/\s+/).slice(-4).join(' '),
        rightIcon: 'comparison_checkmark_success',
      } : undefined,
      chartData: archetype === 'chart_scene' ? {
        type: 'bar',
        labels: ['Before', 'Now', 'After'],
        values: [20, 55, 95],
        unit: '%',
      } : undefined,
      transition,
      accentColor: ledger.selectedPalette.accent,
    });
  });

  return { scenes, ledgerSummary: ledger.getSummary() };
}


// ── Step 2: Compute timing from word indices ──────────────────────────────────

function computePointTiming(
  wordStartIndex: number,
  wordEndIndex: number,
  words: ReelWord[],
  durationSeconds: number
): { startTime: number; endTime: number; focusStartTime: number; focusEndTime: number } {
  if (!words.length) {
    return { startTime: 0, endTime: durationSeconds, focusStartTime: 0, focusEndTime: durationSeconds };
  }

  const safeStart = Math.max(0, Math.min(wordStartIndex, words.length - 1));
  const safeEnd = Math.max(safeStart, Math.min(wordEndIndex, words.length - 1));

  const firstWord = words[safeStart];
  const lastWord = words[safeEnd];

  const focusStart = Math.max(0, Number(firstWord?.start ?? 0) - WB_REVEAL_LEAD_SECONDS);
  const focusEnd = Math.min(durationSeconds, Math.max(Number(lastWord?.end ?? durationSeconds), focusStart + WB_MIN_DISPLAY_SECONDS));

  return {
    startTime: +(focusStart.toFixed(3)),
    endTime: +(focusEnd.toFixed(3)),
    focusStartTime: +(focusStart.toFixed(3)),
    focusEndTime: +(focusEnd.toFixed(3)),
  };
}

// ── Step 3: Text validation & cleanup ────────────────────────────────────────

export function condenseToWhiteboardPhrase(text: string): string {
  if (!text) return '';
  const cleaned = text
    .replace(/^(one of the|we need to|make sure to|you have to|it is important to|trying to|basically|actually|in order to|the first step is to|always remember to|so here is why|let's talk about)\s+/i, '')
    .trim();
  const words = cleaned.split(/\s+/);
  return words.length <= WB_MAX_WORDS_PER_POINT ? cleaned : words.slice(0, WB_MAX_WORDS_PER_POINT).join(' ');
}

function clampText(text: string, maxChars: number): string {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`;
}

function splitLongToken(token: string, charsPerLine: number): string[] {
  if (token.length <= charsPerLine) return [token];
  const parts: string[] = [];
  for (let i = 0; i < token.length; i += charsPerLine) parts.push(token.slice(i, i + charsPerLine));
  return parts;
}

export function wrapWhiteboardText(
  text: string,
  charsPerLine: number = WB_MAX_CHARS_PER_LINE,
  maxLines: number = WB_MAX_LINES_PER_POINT
): string {
  const words = clampText(text, charsPerLine * maxLines)
    .split(/\s+/)
    .filter(Boolean)
    .flatMap(w => splitLongToken(w, charsPerLine));
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= charsPerLine || !current) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);

  return lines.join('\n') || clampText(text, charsPerLine);
}

function countLines(text: string): number {
  return text ? text.split('\n').length : 0;
}

// ── Step 4: Layout validation & fit check ─────────────────────────────────────

export type LayoutDiagnostic = {
  isValid: boolean;
  issues: string[];
  boardDiagnostics: Array<{
    boardIndex: number;
    pointCount: number;
    usedRows: number;
    exceedsLimit: boolean;
  }>;
};

export function validateWhiteboardLayout(
  title: string,
  points: WhiteboardPoint[],
  conclusion: string
): LayoutDiagnostic {
  const issues: string[] = [];
  const boardDiagnostics: LayoutDiagnostic['boardDiagnostics'] = [];
  let isValid = true;

  const pointsByBoard: Record<number, WhiteboardPoint[]> = {};
  points.forEach(p => {
    const idx = p.boardIndex ?? 0;
    if (!pointsByBoard[idx]) pointsByBoard[idx] = [];
    pointsByBoard[idx].push(p);
  });

  const maxBoardIndex = Math.max(0, ...points.map(p => p.boardIndex ?? 0));

  for (let bIdx = 0; bIdx <= maxBoardIndex; bIdx++) {
    const boardPoints = pointsByBoard[bIdx] || [];

    if (boardPoints.length > WB_MAX_POINTS_PER_BOARD) {
      isValid = false;
      issues.push(`Board ${bIdx}: ${boardPoints.length} points > max ${WB_MAX_POINTS_PER_BOARD}. Excess will be split.`);
    }

    const titleWrapped = wrapWhiteboardText(title, WB_MAX_CHARS_PER_LINE, 2);
    const titleRows = countLines(titleWrapped);
    const onLastBoard = bIdx === maxBoardIndex;
    const concRows = (onLastBoard && conclusion) ? countLines(wrapWhiteboardText(conclusion, WB_MAX_CHARS_PER_LINE, 2)) + 1 : 0;

    const pointRows = boardPoints.slice(0, WB_MAX_POINTS_PER_BOARD).reduce((sum, p) => {
      const wrapped = wrapWhiteboardText(p.text, WB_MAX_CHARS_PER_LINE, WB_MAX_LINES_PER_POINT);
      return sum + countLines(wrapped) + 1;
    }, 0);

    const maxRows = 12;
    const usedRows = titleRows + 1 + pointRows + concRows;
    const exceedsLimit = usedRows > maxRows;

    if (exceedsLimit) {
      isValid = false;
      issues.push(`Board ${bIdx}: ${usedRows} rows > ${maxRows}. Content will overflow.`);
    }

    boardDiagnostics.push({ boardIndex: bIdx, pointCount: boardPoints.length, usedRows, exceedsLimit });
  }

  return { isValid, issues, boardDiagnostics };
}

// ── Step 5: Auto-fix layout ───────────────────────────────────────────────────

export function autoFixWhiteboardLayout(
  title: string,
  points: WhiteboardPoint[],
  conclusion: string,
  durationSeconds: number
): { points: WhiteboardPoint[]; conclusionTime: number } {
  const condensed = points.map(p => ({
    ...p,
    text: condenseToWhiteboardPhrase(p.text),
  }));

  const totalBoards = Math.ceil(condensed.length / WB_MAX_POINTS_PER_BOARD);
  const fixed: WhiteboardPoint[] = condensed.map((p, idx) => {
    const newBoardIndex = Math.floor(idx / WB_MAX_POINTS_PER_BOARD);

    const timingValid =
      Number.isFinite(p.startTime) &&
      Number.isFinite(p.endTime) &&
      p.endTime > p.startTime + 0.1 &&
      p.focusStartTime >= 0 &&
      p.focusEndTime > p.focusStartTime;

    if (timingValid) {
      return { ...p, boardIndex: newBoardIndex };
    }

    const boardDuration = durationSeconds / Math.max(1, totalBoards);
    const boardStart = newBoardIndex * boardDuration;
    const orderInBoard = idx % WB_MAX_POINTS_PER_BOARD;
    const segDuration = boardDuration / WB_MAX_POINTS_PER_BOARD;
    const t0 = boardStart + orderInBoard * segDuration;
    const t1 = Math.min(durationSeconds, t0 + Math.max(WB_MIN_DISPLAY_SECONDS, segDuration - 0.2));

    return {
      ...p,
      boardIndex: newBoardIndex,
      startTime: +(t0.toFixed(3)),
      endTime: +(t1.toFixed(3)),
      focusStartTime: +(t0.toFixed(3)),
      focusEndTime: +(t1.toFixed(3)),
    };
  });

  const conclusionTime = +(Math.max(1, durationSeconds - 1.5).toFixed(3));
  return { points: fixed, conclusionTime };
}

// ── Step 5.5: Rich 2D Storyboard Infographic Data Generator ─────────────────

export function planWhiteboardInfographicData(
  transcript: string,
  topicTitle?: string,
  durationSeconds: number = 30
): WhiteboardStoryInfographicProps {
  const cleanText = (transcript || '').toLowerCase();
  const rawTitle = (topicTitle || '').trim();

  // Helper to split a phrase or title into prefix + accent
  const splitTitle = (text: string, defaultPrefix: string, defaultAccent: string) => {
    if (!text) return { prefix: defaultPrefix, accent: defaultAccent };
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= 2) return { prefix: words[0] || defaultPrefix, accent: words.slice(1).join(' ') || defaultAccent };
    const midpoint = Math.max(1, Math.floor(words.length / 2));
    return {
      prefix: words.slice(0, midpoint).join(' '),
      accent: words.slice(midpoint).join(' '),
    };
  };

  // 1. Finance / Wealth / Savings / Money
  if (/(money|save|saving|invest|wealth|finance|rupee|dollar|cash|paisa|budget|fund|debt)/i.test(cleanText)) {
    const titles = splitTitle(rawTitle, 'Why You Should', 'Save Money?');
    return {
      titlePrefix: titles.prefix,
      titleAccent: titles.accent,
      thoughtText: 'What if an unexpected expense hits tomorrow?',
      bracketHeader: 'Life has uncertainties...',
      bracketItems: [
        { label: 'Medical emergencies', icon: 'medical_emergency' },
        { label: 'Car & home repairs', icon: 'car_repairs' },
        { label: 'Future goals & family', icon: 'future_house' },
      ],
      centerStatement: 'Saving early gives you unstoppable security.',
      heroLabel: 'SAVINGS',
      heroType: 'savings_jar',
      sideNote: 'It gives you freedom and peace of mind.',
      bottomSubhead: 'Small steps today... Big wealth tomorrow.',
      bottomCards: [
        { label: 'Handle emergencies', icon: 'emergency_siren' },
        { label: 'Grow your wealth', icon: 'wealth_plant' },
        { label: 'Achieve your goals', icon: 'target_bullseye' },
        { label: 'Less daily stress', icon: 'character_happy' },
      ],
      showHand: true,
    };
  }

  // 2. Health / Fitness / Diet / Lifestyle
  if (/(health|fitness|doctor|medicine|workout|hospital|body|diet|sleep|stress|mental|habit)/i.test(cleanText)) {
    const titles = splitTitle(rawTitle, 'How To Protect', 'Your Health?');
    return {
      titlePrefix: titles.prefix,
      titleAccent: titles.accent,
      thoughtText: 'Why do small bad habits compound into sickness?',
      bracketHeader: 'Daily hidden health risks...',
      bracketItems: [
        { label: 'Sudden emergencies', icon: 'medical_emergency' },
        { label: 'Chronic burnout', icon: 'character_thinking' },
        { label: 'Vital energy drops', icon: 'lightbulb_idea' },
      ],
      centerStatement: 'Prioritizing your daily health prevents costly breakdowns.',
      heroLabel: 'HEALTH',
      heroType: 'medical_emergency',
      sideNote: 'Your health is your greatest compounding asset.',
      bottomSubhead: 'Consistent care today... Vibrant energy tomorrow.',
      bottomCards: [
        { label: 'Prevent emergencies', icon: 'emergency_siren' },
        { label: 'Boost daily vitality', icon: 'growth_chart' },
        { label: 'Reach fitness goals', icon: 'target_bullseye' },
        { label: 'Peace of mind', icon: 'character_happy' },
      ],
      showHand: true,
    };
  }

  // 3. Business / Sales / Marketing / Growth / Scale
  if (/(business|startup|client|sales|growth|marketing|scale|revenue|profit|team|product|customer)/i.test(cleanText)) {
    const titles = splitTitle(rawTitle, 'How To Scale', 'Your Business?');
    return {
      titlePrefix: titles.prefix,
      titleAccent: titles.accent,
      thoughtText: 'What is the bottleneck keeping us from scaling?',
      bracketHeader: 'Every founder faces hurdles...',
      bracketItems: [
        { label: 'Consistent client leads', icon: 'target_bullseye' },
        { label: 'Predictable delivery', icon: 'growth_chart' },
        { label: 'Strategic partnerships', icon: 'handshake_deal' },
      ],
      centerStatement: 'Automating the core workflow unlocks predictable scale.',
      heroLabel: 'GROWTH',
      heroType: 'growth_chart',
      sideNote: 'Consistency compounds faster than sudden luck.',
      bottomSubhead: 'Strategic systems today... Market leadership tomorrow.',
      bottomCards: [
        { label: 'Fix bottlenecks', icon: 'emergency_siren' },
        { label: 'Compound revenue', icon: 'wealth_plant' },
        { label: 'Hit annual targets', icon: 'target_bullseye' },
        { label: 'Delighted clients', icon: 'character_happy' },
      ],
      showHand: true,
    };
  }

  // 4. Learning / Education / Skills / Books / Discipline
  if (/(study|learn|skill|student|exam|focus|discipline|time|book|reading|knowledge|college)/i.test(cleanText)) {
    const titles = splitTitle(rawTitle, 'How To Master', 'Deep Focus?');
    return {
      titlePrefix: titles.prefix,
      titleAccent: titles.accent,
      thoughtText: 'Why is it so easy to get distracted and procrastinate?',
      bracketHeader: 'Common focus traps to eliminate...',
      bracketItems: [
        { label: 'Notification friction', icon: 'lightbulb_idea' },
        { label: 'Lack of daily routines', icon: 'target_bullseye' },
        { label: 'Vague milestone tracking', icon: 'graduation_cap' },
      ],
      centerStatement: 'Daily focused repetition beats irregular motivation bursts.',
      heroLabel: 'MASTERY',
      heroType: 'graduation_cap',
      sideNote: 'Deep focus is a superpower you build each morning.',
      bottomSubhead: 'Clear routines today... Lifelong mastery tomorrow.',
      bottomCards: [
        { label: 'Beat distractions', icon: 'emergency_siren' },
        { label: 'Grow your skills', icon: 'wealth_plant' },
        { label: 'Hit your dreams', icon: 'target_bullseye' },
        { label: 'True confidence', icon: 'character_happy' },
      ],
      showHand: true,
    };
  }

  // 5. Universal Adaptive Fallback
  const defaultTitle = splitTitle(rawTitle, 'The Power Of', 'Clear Action');
  const sentences = (transcript || '')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  const item1 = sentences[0] ? sentences[0].slice(0, 24) : 'First key principle';
  const item2 = sentences[1] ? sentences[1].slice(0, 24) : 'Building momentum';
  const item3 = sentences[2] ? sentences[2].slice(0, 24) : 'Long term impact';

  return {
    titlePrefix: defaultTitle.prefix,
    titleAccent: defaultTitle.accent,
    thoughtText: 'What is the most important step to take next?',
    bracketHeader: 'Key principles to understand...',
    bracketItems: [
      { label: item1, icon: 'lightbulb_idea' },
      { label: item2, icon: 'growth_chart' },
      { label: item3, icon: 'target_bullseye' },
    ],
    centerStatement: sentences[3] ? sentences[3].slice(0, 48) : 'Clear intentional action unlocks massive results.',
    heroLabel: 'STRATEGY',
    heroType: 'lightbulb_idea',
    sideNote: 'Simple systems executed consistently create real change.',
    bottomSubhead: 'Small steps today... Extraordinary results tomorrow.',
    bottomCards: [
      { label: 'Overcome hurdles', icon: 'emergency_siren' },
      { label: 'Compound progress', icon: 'wealth_plant' },
      { label: 'Achieve the goal', icon: 'target_bullseye' },
      { label: 'Fulfillment & joy', icon: 'character_happy' },
    ],
    showHand: true,
  };
}

// ── Step 6: Semantic Deterministic Fallback Planner ───────────────────────────

export function planDeterministicWhiteboard(input: WhiteboardPlanInput): WhiteboardPlan {
  const duration = Math.max(8, Number(input.durationSeconds) || 30);
  const words = input.words || [];

  const scriptLang = input.transcript && /[\u0600-\u06FF]/.test(input.transcript)
    ? { language: 'ur' as const, direction: 'rtl' as const }
    : input.transcript && /[\u0900-\u097F]/.test(input.transcript)
    ? { language: 'hi' as const, direction: 'ltr' as const }
    : { language: 'en' as const, direction: 'ltr' as const };

  const segments = input.segments.length > 0 ? input.segments : [{ start: 0, end: duration, text: input.transcript }];

  // Determine target board count: <= 30s -> 2 boards, > 30s -> 2-3 boards
  const maxBoards = duration <= 35 ? 2 : Math.min(3, Math.ceil(duration / 25));
  const pointsPerBoard = 2;
  const totalTargetPoints = Math.min(segments.length, maxBoards * pointsPerBoard);
  const stride = Math.max(1, Math.floor(segments.length / Math.max(1, totalTargetPoints)));

  const selectedSegments: typeof segments = [];
  for (let i = 0; i < segments.length && selectedSegments.length < totalTargetPoints; i += stride) {
    selectedSegments.push(segments[i]);
  }

  const title = input.topicTitle || (scriptLang.language === 'ur' ? 'اہم نکات' : 'Key Insights');

  const points: WhiteboardPoint[] = selectedSegments.map((seg, idx) => {
    const boardIndex = Math.min(maxBoards - 1, Math.floor(idx / pointsPerBoard));
    const iconName = ['lightbulb', 'chart', 'target', 'star', 'rocket', 'checkmark', 'brain', 'trophy'][idx % 8];
    const drawingDef = resolveVectorDrawing(seg.text);

    const segWords = words.filter(w => w.start >= seg.start - 0.1 && w.end <= seg.end + 0.1);
    const tStart = segWords.length > 0 ? Math.max(0, segWords[0].start - WB_REVEAL_LEAD_SECONDS) : seg.start;
    const tEnd = segWords.length > 0
      ? Math.min(duration, Math.max(segWords[segWords.length - 1].end, tStart + WB_MIN_DISPLAY_SECONDS))
      : Math.max(seg.end, seg.start + WB_MIN_DISPLAY_SECONDS);

    return {
      text: condenseToWhiteboardPhrase(seg.text),
      startTime: +(tStart.toFixed(3)),
      endTime: +(tEnd.toFixed(3)),
      focusStartTime: +(tStart.toFixed(3)),
      focusEndTime: +(tEnd.toFixed(3)),
      markerColor: POINT_COLORS[idx % POINT_COLORS.length],
      bulletType: (idx % 2 === 0 ? 'number' : 'check') as WhiteboardPoint['bulletType'],
      isHighlight: idx % 2 === 1,
      icon: iconName,
      drawingId: drawingDef.id,
      boardIndex,
      focusType: (idx % 2 === 0 ? 'highlight' : 'underline') as WhiteboardPoint['focusType'],
    };
  });

  const infographicData = planWhiteboardInfographicData(input.transcript, input.topicTitle, duration);
  const { scenes, ledgerSummary } = buildDynamicWhiteboardScenes(words, input.transcript, duration, input.topicTitle);

  const plan: WhiteboardPlan = {
    title,
    titleColor: COLORS.title,
    layoutType: 'infographic',
    infographicData,
    showHand: true,
    language: scriptLang.language,
    direction: scriptLang.direction,
    points,
    conclusion: scriptLang.language === 'ur' ? 'سبق مکمل ہوا۔' : 'Key takeaway unlocked.',
    conclusionTime: +(Math.max(1, duration - 1.5).toFixed(3)),
    source: 'deterministic',
    aspectRatio: '9:16',
    scenes,
    assetLedgerSummary: ledgerSummary,
  };

  const diag = validateWhiteboardLayout(plan.title, plan.points, plan.conclusion);
  if (!diag.isValid) {
    const fixed = autoFixWhiteboardLayout(plan.title, plan.points, plan.conclusion, duration);
    plan.points = fixed.points;
    plan.conclusionTime = fixed.conclusionTime;
  }

  return plan;
}

// ── Step 7: Master AI Planner (Groq Qwen/OSS -> Gemini -> Deterministic) ──────

export async function planWhiteboardVideo(input: WhiteboardPlanInput): Promise<WhiteboardPlan> {
  const duration = Math.max(8, Number(input.durationSeconds) || 30);
  const words = input.words || [];
  const transcript = input.transcript || '';

  // 1. Try Groq Cloud LLM First (Lightning Fast, JSON-mode, High Intelligence)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey && transcript) {
    try {
      console.log('[WB_PLANNER] Generating whiteboard director blueprint via Groq Cloud LLM...');
      const planned = await callGroqWhiteboardDirector(input, groqKey);
      if (planned && planned.points && planned.points.length > 0) {
        console.log(`[WB_PLANNER] Groq director succeeded: ${planned.points.length} points across boards`);
        return planned;
      }
    } catch (groqErr) {
      console.warn('[WB_PLANNER] Groq director LLM failed, trying Gemini:', groqErr);
    }
  }

  // 2. Try Gemini Fallback
  const geminiKey = input.apiKey || process.env.GEMINI_API_KEY;
  if (geminiKey && transcript) {
    try {
      console.log('[WB_PLANNER] Trying Gemini director fallback...');
      const planned = await callGeminiWhiteboardDirector(input, geminiKey);
      if (planned && planned.points && planned.points.length > 0) {
        return planned;
      }
    } catch (geminiErr) {
      console.warn('[WB_PLANNER] Gemini director fallback failed:', geminiErr);
    }
  }

  // 3. Robust Semantic Deterministic Fallback
  console.log('[WB_PLANNER] Falling back to semantic deterministic planner');
  return planDeterministicWhiteboard(input);
}

// ── Groq LLM Director Implementation ─────────────────────────────────────────

async function callGroqWhiteboardDirector(input: WhiteboardPlanInput, apiKey: string): Promise<WhiteboardPlan | null> {
  const duration = Math.max(8, Number(input.durationSeconds) || 30);
  const words = input.words || [];

  const wordIndexSummary = words
    .map((w, i) => `[${i}]"${w.word}"(${Number(w.start).toFixed(2)}s)`)
    .join(' ');

  const targetBoards = duration <= 35 ? 2 : Math.min(3, Math.ceil(duration / 25));

  const prompt = buildWhiteboardPrompt({
    transcript: input.transcript,
    durationSeconds: duration,
    wordIndexSummary: wordIndexSummary.slice(0, 3000),
    fontPersonality: input.boardStyle,
    showHand: true,
  });

  // Candidate models on Groq
  const models = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
  let jsonString = '';

  for (const model of models) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        jsonString = data?.choices?.[0]?.message?.content || '';
        if (jsonString) break;
      }
    } catch (e) {
      console.warn(`[WB_PLANNER] Groq model ${model} error:`, e);
    }
  }

  if (!jsonString) return null;

  return parseAndValidatePlan(jsonString, input, words, duration, 'groq-qwen');
}

// ── Gemini LLM Director Fallback ──────────────────────────────────────────────

async function callGeminiWhiteboardDirector(input: WhiteboardPlanInput, apiKey: string): Promise<WhiteboardPlan | null> {
  const duration = Math.max(8, Number(input.durationSeconds) || 30);
  const words = input.words || [];

  const wordIndexSummary = words
    .map((w, i) => `[${i}]"${w.word}"(${Number(w.start).toFixed(2)}s)`)
    .join(' ');

  const prompt = buildWhiteboardPrompt({
    transcript: input.transcript,
    durationSeconds: duration,
    wordIndexSummary: wordIndexSummary.slice(0, 2500),
    fontPersonality: input.boardStyle,
    showHand: true,
  });

  const candidateModels = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
  let jsonString = '';

  for (const model of candidateModels) {
    try {
      const restRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );
      if (restRes.ok) {
        const data = await restRes.json();
        jsonString = (data?.candidates?.[0]?.content?.parts?.[0]?.text || '')
          .replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        if (jsonString) break;
      }
    } catch (e) {
      console.warn(`[WB_PLANNER] Gemini model ${model} error:`, e);
    }
  }

  if (!jsonString) return null;

  return parseAndValidatePlan(jsonString, input, words, duration, 'gemini');
}

// ── Shared Plan Parser & Validator ────────────────────────────────────────────

function parseAndValidatePlan(
  jsonString: string,
  input: WhiteboardPlanInput,
  words: ReelWord[],
  duration: number,
  source: 'groq-qwen' | 'gemini'
): WhiteboardPlan {
  const result = JSON.parse(jsonString);

  const detectedLang: 'ur' | 'hi' | 'en' = result.language || (
    input.transcript && /[\u0600-\u06FF]/.test(input.transcript) ? 'ur' :
    input.transcript && /[\u0900-\u097F]/.test(input.transcript) ? 'hi' : 'en'
  );
  const detectedDir: 'rtl' | 'ltr' = result.direction || (detectedLang === 'ur' ? 'rtl' : 'ltr');

  const rawPoints: RawLLMPoint[] = Array.isArray(result.points) ? result.points : [];
  const validatedPoints: WhiteboardPoint[] = rawPoints.map((p, i) => {
    const wsi = Math.max(0, Math.min(Number(p.wordStartIndex) || 0, words.length - 1));
    const wei = Math.max(wsi, Math.min(Number(p.wordEndIndex) || wsi, words.length - 1));

    const timing = computePointTiming(wsi, wei, words, duration);

    const iconKey = String(p.icon || 'lightbulb').toLowerCase().trim();
    const drawingDef = (p.drawingId && WHITEBOARD_VECTOR_DRAWINGS[p.drawingId])
      ? WHITEBOARD_VECTOR_DRAWINGS[p.drawingId]
      : resolveVectorDrawing(`${p.text || ''} ${iconKey}`);

    return {
      text: condenseToWhiteboardPhrase(String(p.text || '')),
      title: p.title ? String(p.title) : undefined,
      ...timing,
      markerColor: String(p.markerColor || POINT_COLORS[i % POINT_COLORS.length]),
      bulletType: ((p.bulletType as WhiteboardPoint['bulletType']) || (i % 2 === 0 ? 'number' : 'check')),
      isHighlight: Boolean(p.isHighlight || i % 2 === 1),
      icon: iconKey,
      drawingId: drawingDef.id,
      boardIndex: Math.max(0, Number(p.boardIndex) || 0),
      focusType: ((p.focusType as WhiteboardPoint['focusType']) || 'highlight'),
    };
  });

  const rawInfo = result.infographic || result.infographicData;
  let infographicData: WhiteboardStoryInfographicProps | undefined;

  if (rawInfo && typeof rawInfo === 'object') {
    infographicData = {
      titlePrefix: String(rawInfo.titlePrefix || 'Why You Should'),
      titleAccent: String(rawInfo.titleAccent || 'Save & Grow?'),
      thoughtText: String(rawInfo.thoughtText || 'What if I need resources later?'),
      bracketHeader: String(rawInfo.bracketHeader || 'Key factors to consider...'),
      bracketItems: Array.isArray(rawInfo.bracketItems) && rawInfo.bracketItems.length > 0
        ? rawInfo.bracketItems.map((item: any) => ({
            label: String(item.label || 'Key Insight'),
            icon: String(item.icon || 'lightbulb_idea'),
          }))
        : undefined,
      centerStatement: String(rawInfo.centerStatement || 'Consistent actions create lasting results.'),
      heroLabel: String(rawInfo.heroLabel || 'STRATEGY'),
      heroType: String(rawInfo.heroType || 'growth_chart'),
      sideNote: String(rawInfo.sideNote || 'It gives you freedom and clarity.'),
      bottomSubhead: String(rawInfo.bottomSubhead || 'Small steps today... Big benefits tomorrow.'),
      bottomCards: Array.isArray(rawInfo.bottomCards) && rawInfo.bottomCards.length > 0
        ? rawInfo.bottomCards.map((c: any) => ({
            label: String(c.label || 'Action Takeaway'),
            icon: String(c.icon || 'target_bullseye'),
          }))
        : undefined,
      showHand: true,
    };
  } else {
    infographicData = planWhiteboardInfographicData(input.transcript, input.topicTitle, duration);
  }

  const chosenLayout: WhiteboardPlan['layoutType'] =
    result.layoutType === 'cards' || result.layoutType === 'table' || result.layoutType === 'quiz'
      ? result.layoutType
      : 'infographic';

  const plan: WhiteboardPlan = {
    title: String(result.title || input.topicTitle || (detectedLang === 'ur' ? 'اہم معلومات' : 'Key Insights')),
    titleColor: COLORS.title,
    layoutType: chosenLayout,
    infographicData,
    showHand: true,
    language: detectedLang,
    direction: detectedDir,
    points: validatedPoints.length > 0 ? validatedPoints : planDeterministicWhiteboard(input).points,
    conclusion: String(result.conclusion || (detectedLang === 'ur' ? 'مکمل' : 'Key takeaway unlocked.')),
    conclusionTime: +(Math.max(1, duration - 1.5).toFixed(3)),
    source,
    aspectRatio: '9:16',
  };

  const diag = validateWhiteboardLayout(plan.title, plan.points, plan.conclusion);
  if (!diag.isValid) {
    const fixed = autoFixWhiteboardLayout(plan.title, plan.points, plan.conclusion, duration);
    plan.points = fixed.points;
    plan.conclusionTime = fixed.conclusionTime;
  }

  // ── MANDATORY SCENE GUARANTEE ─────────────────────────────────────────────
  // Rule: every single whiteboard video MUST have scenes. No exceptions.
  if (Array.isArray(result.scenes) && result.scenes.length > 0) {
    // LLM returned scenes — normalize and validate each one
    plan.scenes = result.scenes.map((s: any, idx: number) => {
      const stepDuration = duration / Math.max(1, result.scenes.length);
      const startTime = +( (idx * stepDuration).toFixed(2) );
      const endTime = +( Math.min(duration, (idx + 1) * stepDuration).toFixed(2) );
      const timeLabel = s.timeLabel || `STEP ${idx + 1} (${formatSecondsToTimer(startTime)} - ${formatSecondsToTimer(endTime)})`;

      // Resolve the drawingId — always fall back to semantic resolution if missing
      const rawDrawingId = s.heroVisual?.drawingId || '';
      const drawingDef = (rawDrawingId && WHITEBOARD_VECTOR_DRAWINGS[rawDrawingId])
        ? WHITEBOARD_VECTOR_DRAWINGS[rawDrawingId]
        : resolveVectorDrawing(`${s.headline || ''} ${s.heroVisual?.label || ''}`);

      // Guarantee explanationLines are NEVER empty — extract from headline if needed
      let explLines: WhiteboardExplanationLine[] = [];
      if (Array.isArray(s.explanationLines) && s.explanationLines.length > 0) {
        explLines = s.explanationLines.map((el: any) => ({
          text: String(el.text || s.headline || ''),
          highlightWord: el.highlightWord || undefined,
          highlightColor: el.highlightColor || (idx % 2 === 0 ? '#1E40AF' : '#DC2626'),
        }));
      } else {
        // Build from headline — always produce at least 1 line
        explLines = extractExplanationLinesFromBeat(
          s.headline || `Step ${idx + 1}`,
          idx % 2 === 0 ? '#1E40AF' : '#DC2626'
        );
      }

      return {
        id: `wb-scene-${idx}`,
        sceneIndex: idx,
        startTime,
        endTime,
        duration: +( (endTime - startTime).toFixed(2) ),
        timeLabel,
        archetype: (s.archetype || 'split_story') as WhiteboardArchetype,
        modality: 'illustrative_doodle' as const,
        visualIntent: {
          beatIndex: idx,
          role: idx === 0 ? 'hook' : idx === result.scenes.length - 1 ? 'cta' : 'explain' as const,
          takeaway: s.headline || 'Key Step',
          type: 'concept' as const,
          entities: [drawingDef.id],
          action: 'explain',
          emotion: 'clarity',
          metaphors: [drawingDef.id],
          soundOffTest: s.headline || 'Key Step',
        },
        headline: String(s.headline || `Step ${idx + 1}`).toUpperCase(),
        explanationLines: explLines,
        heroVisual: {
          drawingId: drawingDef.id,
          label: s.heroVisual?.label || s.headline || 'Step',
          scale: 1,
        },
        transition: idx % 3 === 0 && idx > 0 ? 'erase_wipe' : 'camera_pan' as const,
        accentColor: idx % 2 === 0 ? COLORS.blue : '#DC2626',
      };
    });
  } else {
    // LLM did NOT return scenes — build them deterministically from transcript beats
    // This is the guaranteed fallback that always produces complete per-scene JSON
    console.log('[WB_PLANNER] LLM returned no scenes — building scenes deterministically from transcript beats');
    const { scenes: builtScenes, ledgerSummary } = buildDynamicWhiteboardScenes(words, input.transcript, duration, input.topicTitle);
    plan.scenes = builtScenes;
    plan.assetLedgerSummary = ledgerSummary;
  }

  return plan;
}

