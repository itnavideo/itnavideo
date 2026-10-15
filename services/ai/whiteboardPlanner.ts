/**
 * whiteboardPlanner.ts
 * Whiteboard Video AI Planner — Groq Qwen 2.5/3.8 + Gemini Fallback + Semantic Rule Planner.
 *
 * KEY HIGHLIGHTS:
 *   - Strictly 9:16 vertical (1080×1920) reels up to 90 seconds.
 *   - AI Content Understanding: Analyzes audio transcription, identifies key conceptual milestones.
 *   - Scene Planning: Divides video into sequential boards (scenes) with max 3 points per board.
 *   - Spoken Timing Synchronization: Anchors each point to real speech timestamps via wordStartIndex / wordEndIndex.
 *   - Procedural Vector Drawings & Hand-Drawn Icons for authentic whiteboard storytelling.
 */

import { GoogleGenAI } from '@google/genai';
import { resolveWhiteboardIcon } from '@/lib/whiteboard/icons';
import { resolveVectorDrawing, WHITEBOARD_VECTOR_DRAWINGS } from '@/lib/whiteboard/vectorDrawings';
import {
  WB_MAX_POINTS_PER_BOARD,
  WB_MAX_WORDS_PER_POINT,
  WB_MAX_LINES_PER_POINT,
  WB_MAX_CHARS_PER_LINE,
  WB_REVEAL_LEAD_SECONDS,
  WB_MIN_DISPLAY_SECONDS,
} from '@/lib/whiteboard/whiteboardConstants';
import type { ReelWord } from './reelPlanner';

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

export type WhiteboardPlan = {
  title: string;
  titleColor: string;
  layoutType: 'cards' | 'table' | 'quiz' | 'hook';
  language: 'ur' | 'hi' | 'en';
  direction: 'rtl' | 'ltr';
  points: WhiteboardPoint[];
  tableRows?: WhiteboardTableRow[];
  quiz?: WhiteboardQuiz;
  conclusion: string;
  conclusionTime: number;
  source: 'groq-qwen' | 'gemini' | 'deterministic';
  aspectRatio: '9:16';
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
      iconUrl: resolveWhiteboardIcon(iconName),
      drawingId: drawingDef.id,
      boardIndex,
      focusType: (idx % 2 === 0 ? 'highlight' : 'underline') as WhiteboardPoint['focusType'],
    };
  });

  const plan: WhiteboardPlan = {
    title,
    titleColor: COLORS.title,
    layoutType: 'cards',
    language: scriptLang.language,
    direction: scriptLang.direction,
    points,
    conclusion: scriptLang.language === 'ur' ? 'سبق مکمل ہوا۔' : 'Key takeaway unlocked.',
    conclusionTime: +(Math.max(1, duration - 1.5).toFixed(3)),
    source: 'deterministic',
    aspectRatio: '9:16',
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

  const prompt = `You are an elite Whiteboard Video Director creating a high-retention 9:16 vertical (1080×1920) whiteboard video.

AUDIO DURATION: ${duration}s
TARGET BOARDS: ${targetBoards} sequential boards (scenes). Max 3 points per board.
TRANSCRIPT:
"${input.transcript}"

WORD INDEX (anchor points to speech via wordStartIndex and wordEndIndex):
${wordIndexSummary.slice(0, 3000)}

DIRECTOR RULES:
1. Understand the core educational/story message.
2. Structure the video into ${targetBoards} sequential scenes (boardIndex 0 to ${targetBoards - 1}).
3. For each point:
   - "text": A punchy visual headline (3 to 6 words max). Clean, complete thoughts. NEVER cut-off or broken fragments.
   - "wordStartIndex": index of first word where this concept is spoken.
   - "wordEndIndex": index of last word where this concept is spoken.
   - "boardIndex": 0 to ${targetBoards - 1}.
   - "drawingId": Pick the best procedural vector drawing:
     'science_lightbulb_idea' | 'business_growth_chart' | 'business_target_bullseye' |
     'character_celebration' | 'comparison_cross_error' | 'comparison_checkmark_success' |
     'character_thinking' | 'business_handshake' | 'process_step_curved_arrow' |
     'medical_ecg_pulse' | 'science_atom_orbit' | 'character_business_leader'
   - "icon": 'lightbulb' | 'chart' | 'target' | 'star' | 'checkmark' | 'rocket' | 'trophy' | 'brain' | 'fire'
   - "focusType": 'highlight' | 'circle' | 'underline' | 'box'
   - "markerColor": '#1E3A8A' (Navy) | '#0F766E' (Emerald) | '#B91C1C' (Crimson) | '#D97706' (Amber)
   - "bulletType": 'number' | 'check' | 'arrow' | 'star'
4. "title": A striking, professional 2 to 4 word whiteboard title.
5. "conclusion": A memorable 3 to 5 word final takeaway.
6. Language detection:
   - Urdu script -> "language": "ur", "direction": "rtl"
   - Hindi script -> "language": "hi", "direction": "ltr"
   - Otherwise -> "language": "en", "direction": "ltr"

OUTPUT ONLY VALID JSON:
{
  "title": "Master Your Money",
  "titleColor": "#0F172A",
  "language": "en",
  "direction": "ltr",
  "points": [
    {
      "text": "Know What To Do",
      "boardIndex": 0,
      "wordStartIndex": 0,
      "wordEndIndex": 16,
      "drawingId": "science_lightbulb_idea",
      "icon": "lightbulb",
      "focusType": "highlight",
      "markerColor": "#1E3A8A",
      "bulletType": "number"
    }
  ],
  "conclusion": "Freedom To Choose Life"
}`;

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

  const prompt = `You are an elite Whiteboard Video Director creating a 9:16 vertical (1080×1920) whiteboard video.
Duration: ${duration}s.
Transcript: "${input.transcript}"
Word index: ${wordIndexSummary.slice(0, 2500)}

Plan 2 to 3 boards. Max 3 points per board.
Output strictly JSON matching:
{
  "title": "Title",
  "points": [
    { "text": "Punchy 3-5 word phrase", "boardIndex": 0, "wordStartIndex": 0, "wordEndIndex": 5, "drawingId": "science_lightbulb_idea", "icon": "lightbulb", "focusType": "highlight", "markerColor": "#1E3A8A", "bulletType": "number" }
  ],
  "conclusion": "Takeaway"
}`;

  const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-2.5-flash'];
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
      iconUrl: resolveWhiteboardIcon(iconKey),
      drawingId: drawingDef.id,
      boardIndex: Math.max(0, Number(p.boardIndex) || 0),
      focusType: ((p.focusType as WhiteboardPoint['focusType']) || 'highlight'),
    };
  });

  const plan: WhiteboardPlan = {
    title: String(result.title || input.topicTitle || (detectedLang === 'ur' ? 'اہم معلومات' : 'Key Insights')),
    titleColor: COLORS.title,
    layoutType: 'cards',
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

  return plan;
}
