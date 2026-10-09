/**
 * whiteboardPlanner.ts
 * Whiteboard Video AI planner — Gemini 2.0 Flash + deterministic fallback.
 *
 * KEY DESIGN CHANGE (v2):
 *   - Gemini NO LONGER outputs startTime / endTime / focusStartTime / focusEndTime.
 *   - Gemini outputs per-point: text, boardIndex, wordStartIndex, wordEndIndex, icon, drawingId, focusType.
 *   - All timing is computed HERE from real Groq word-level timestamps.
 *   - buildWhiteboardSegments() replaces buildCompareCaptionsFromGroq for whiteboard only.
 *   - Single shared constants from lib/whiteboard/whiteboardConstants.ts.
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
import type { ReelWord, ReelTranscriptSegment } from './reelPlanner';

// ── Public types ──────────────────────────────────────────────────────────────

export type WhiteboardPoint = {
  text: string;
  title?: string;
  /** Frame-exact start: when full text becomes visible (computed from word timestamps). */
  startTime: number;
  /** Frame-exact end: last word of this point finishes. */
  endTime: number;
  /** Yellow highlighter start (= startTime, synced to speech). */
  focusStartTime: number;
  /** Yellow highlighter end. */
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
  source: 'gemini' | 'deterministic';
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
};

// ── Internal Gemini-only point shape (no timing) ─────────────────────────────

type GeminiPoint = {
  text: string;
  title?: string;
  boardIndex: number;
  /** Index into `words` array: first spoken word of this phrase. */
  wordStartIndex: number;
  /** Index into `words` array: last spoken word of this phrase (inclusive). */
  wordEndIndex: number;
  icon: string;
  drawingId?: string;
  focusType: 'circle' | 'underline' | 'box' | 'arrow' | 'highlight';
  bulletType?: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
  markerColor?: string;
  isHighlight?: boolean;
};

// ── Colors ────────────────────────────────────────────────────────────────────

const COLORS = {
  title: '#0F172A',
  blue: '#1E40AF',
  green: '#065F46',
  red: '#991B1B',
  grey: '#475569',
};
const POINT_COLORS = [COLORS.blue, COLORS.green, COLORS.red];

// ── Step 1: Dedicated sentence-boundary segment builder ───────────────────────

/**
 * buildWhiteboardSegments()
 * Dedicated replacement for buildCompareCaptionsFromGroq — whiteboard only.
 * Groups words by sentence boundary (. ! ?) and natural pause (> 0.45s).
 * Returns sentence-level chunks, each with the full words[] array for timing lookup.
 */
export function buildWhiteboardSegments(
  words: ReelWord[],
  durationSeconds: number
): Array<{ start: number; end: number; text: string; words: ReelWord[] }> {
  const cleaned = words
    .filter(w => typeof w.word === 'string' && w.word.trim() && Number.isFinite(w.start) && Number.isFinite(w.end))
    .map(w => ({ word: w.word.trim(), start: Math.max(0, Number(w.start)), end: Math.max(Number(w.start) + 0.08, Number(w.end)) }));

  if (!cleaned.length) return [];

  const PAUSE_GAP = 0.45; // seconds
  const MAX_SENTENCE_WORDS = 18;

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

/**
 * computePointTiming()
 * Given a point's wordStartIndex / wordEndIndex, look up the actual timestamps
 * from the words array. Falls back gracefully if indices are out of range.
 */
function computePointTiming(
  wordStartIndex: number,
  wordEndIndex: number,
  words: ReelWord[],
  durationSeconds: number
): { startTime: number; endTime: number; focusStartTime: number; focusEndTime: number } {
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

function condenseToWhiteboardPhrase(text: string): string {
  if (!text) return '';
  const cleaned = text
    .replace(/^(one of the|we need to|make sure to|you have to|it is important to|trying to|basically|actually|in order to|the first step is to|always remember to)\s+/i, '')
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

export function wrapWhiteboardText(text: string, charsPerLine: number = WB_MAX_CHARS_PER_LINE, maxLines: number = WB_MAX_LINES_PER_POINT): string {
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

/**
 * validateWhiteboardLayout()
 * Uses shared constants to check if content fits.
 * maxTextRows = WB_MAX_POINTS_PER_BOARD * (WB_MAX_LINES_PER_POINT + 1) + title rows + conclusion rows.
 */
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

    // Each board has a max of WB_MAX_POINTS_PER_BOARD points
    if (boardPoints.length > WB_MAX_POINTS_PER_BOARD) {
      isValid = false;
      issues.push(`Board ${bIdx}: ${boardPoints.length} points > max ${WB_MAX_POINTS_PER_BOARD}. Excess will be split.`);
    }

    // Estimate row usage: title (1-2 rows) + spacing + points (up to 2 lines + 1 spacing each) + conclusion (2 rows)
    const titleWrapped = wrapWhiteboardText(title, WB_MAX_CHARS_PER_LINE, 2);
    const titleRows = countLines(titleWrapped);
    const onLastBoard = bIdx === maxBoardIndex;
    const concRows = (onLastBoard && conclusion) ? countLines(wrapWhiteboardText(conclusion, WB_MAX_CHARS_PER_LINE, 2)) + 1 : 0;

    const pointRows = boardPoints.slice(0, WB_MAX_POINTS_PER_BOARD).reduce((sum, p) => {
      const wrapped = wrapWhiteboardText(p.text, WB_MAX_CHARS_PER_LINE, WB_MAX_LINES_PER_POINT);
      return sum + countLines(wrapped) + 1; // +1 for spacing
    }, 0);

    // Max rows = 2 title + 1 spacing + 3*(2 lines + 1 spacing) + 2 conclusion = ~14
    const maxRows = 14;
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

// ── Step 5: Auto-fix — split boards if overflow ───────────────────────────────

/**
 * autoFixWhiteboardLayout()
 * If a board has >3 points, splits into new boards.
 * If points have no valid timing (fallback), distributes evenly.
 * Does NOT use transform-scale — instead limits to 3 points per board.
 */
export function autoFixWhiteboardLayout(
  title: string,
  points: WhiteboardPoint[],
  conclusion: string,
  durationSeconds: number
): { points: WhiteboardPoint[]; conclusionTime: number } {
  console.log('[WB_LAYOUT_FIXER] Starting layout fix, input points:', points.length);

  // 1. Shorten any point > WB_MAX_WORDS_PER_POINT words
  const condensed = points.map(p => ({
    ...p,
    text: condenseToWhiteboardPhrase(p.text),
  }));

  // 2. Re-distribute boardIndex so no board has > WB_MAX_POINTS_PER_BOARD
  const totalBoards = Math.ceil(condensed.length / WB_MAX_POINTS_PER_BOARD);
  const fixed: WhiteboardPoint[] = condensed.map((p, idx) => {
    const newBoardIndex = Math.floor(idx / WB_MAX_POINTS_PER_BOARD);

    // Only fix timing if it looks like placeholder data (0/0 or identical times)
    const timingValid =
      Number.isFinite(p.startTime) &&
      Number.isFinite(p.endTime) &&
      p.endTime > p.startTime + 0.1 &&
      p.focusStartTime >= 0 &&
      p.focusEndTime > p.focusStartTime;

    if (timingValid) {
      return { ...p, boardIndex: newBoardIndex };
    }

    // Fallback timing: distribute evenly within board window
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
  console.log('[WB_LAYOUT_FIXER] Done. Output boards:', totalBoards, 'points:', fixed.length);
  return { points: fixed, conclusionTime };
}

// ── Step 6: Deterministic fallback planner ────────────────────────────────────

export function planDeterministicWhiteboard(input: WhiteboardPlanInput): WhiteboardPlan {
  const duration = Math.max(8, Number(input.durationSeconds) || 30);
  const words = input.words || [];

  const scriptLang = input.transcript && /[\u0600-\u06FF]/.test(input.transcript)
    ? { language: 'ur' as const, direction: 'rtl' as const }
    : input.transcript && /[\u0900-\u097F]/.test(input.transcript)
    ? { language: 'hi' as const, direction: 'ltr' as const }
    : { language: 'en' as const, direction: 'ltr' as const };

  // Use sentence-level segments (already built by caller)
  const segments = input.segments.length > 0 ? input.segments : [{ start: 0, end: duration, text: input.transcript }];

  // Group segments into boards of max WB_MAX_POINTS_PER_BOARD
  const totalPoints = Math.min(segments.length, 9); // max 3 boards × 3 points
  const selectedSegments = segments.slice(0, totalPoints);

  const title = input.topicTitle || (scriptLang.language === 'ur' ? 'اہم نکات' : 'Key Insights');

  const points: WhiteboardPoint[] = selectedSegments.map((seg, idx) => {
    const boardIndex = Math.floor(idx / WB_MAX_POINTS_PER_BOARD);
    const iconName = ['lightbulb', 'brain', 'target', 'star', 'rocket', 'checkmark', 'chart', 'trophy', 'heart'][idx % 9];
    const drawingDef = resolveVectorDrawing(seg.text);

    // Compute timing from actual word timestamps if available
    const segWords = words.filter(w => w.start >= seg.start - 0.1 && w.end <= seg.end + 0.1);
    const tStart = segWords.length > 0 ? Math.max(0, segWords[0].start - WB_REVEAL_LEAD_SECONDS) : seg.start;
    const tEnd = segWords.length > 0 ? Math.min(duration, Math.max(segWords[segWords.length - 1].end, tStart + WB_MIN_DISPLAY_SECONDS)) : Math.max(seg.end, seg.start + WB_MIN_DISPLAY_SECONDS);

    return {
      text: condenseToWhiteboardPhrase(seg.text),
      startTime: +(tStart.toFixed(3)),
      endTime: +(tEnd.toFixed(3)),
      focusStartTime: +(tStart.toFixed(3)),
      focusEndTime: +(tEnd.toFixed(3)),
      markerColor: POINT_COLORS[idx % POINT_COLORS.length],
      bulletType: (idx % 3 === 0 ? 'check' : 'arrow') as WhiteboardPoint['bulletType'],
      isHighlight: idx % 3 === 2,
      icon: iconName,
      iconUrl: resolveWhiteboardIcon(iconName),
      drawingId: drawingDef.id,
      boardIndex,
      focusType: 'highlight' as const,
    };
  });

  const plan: WhiteboardPlan = {
    title,
    titleColor: COLORS.title,
    layoutType: 'cards',
    language: scriptLang.language,
    direction: scriptLang.direction,
    points,
    conclusion: scriptLang.language === 'ur' ? 'سبق مکمل ہوا۔' : 'Key insight unlocked.',
    conclusionTime: +(Math.max(1, duration - 1.5).toFixed(3)),
    source: 'deterministic',
  };

  const diag = validateWhiteboardLayout(plan.title, plan.points, plan.conclusion);
  if (!diag.isValid) {
    console.warn('[WB_PLANNER] Deterministic plan has layout issues:', diag.issues);
    const fixed = autoFixWhiteboardLayout(plan.title, plan.points, plan.conclusion, duration);
    plan.points = fixed.points;
    plan.conclusionTime = fixed.conclusionTime;
  }

  return plan;
}

// ── Step 7: Gemini planner ────────────────────────────────────────────────────

export async function planWhiteboardVideo(input: WhiteboardPlanInput): Promise<WhiteboardPlan> {
  const apiKey = input.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('[WB_PLANNER] No API key — using deterministic planner');
    return planDeterministicWhiteboard(input);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const duration = Math.max(8, Number(input.durationSeconds) || 30);
    const words = input.words || [];

    // Build a word index summary for Gemini: each word has its index and text
    const wordIndexSummary = words
      .map((w, i) => `[${i}]"${w.word}"(${w.start.toFixed(2)}s)`)
      .join(' ');

    const segmentSummary = input.segments
      .map((s, i) => `[Seg ${i}] ${s.start.toFixed(2)}s–${s.end.toFixed(2)}s: "${s.text}"`)
      .join('\n');

    // ── Gemini system prompt (timing-free) ────────────────────────────────
    const systemPrompt = `You are an elite whiteboard video director for 9:16 vertical (1080×1920) reels.

AUDIO DURATION: ${duration}s
TOPIC: "${input.topicTitle || 'Explainer'}"
TOTAL WORDS IN TRANSCRIPT: ${words.length}

TRANSCRIPT SEGMENTS (sentence-level, with timestamps):
${segmentSummary}

WORD INDEX (use these indices to anchor your points to real speech):
${wordIndexSummary.slice(0, 2000)}${wordIndexSummary.length > 2000 ? '…(truncated)' : ''}

CRITICAL RULES:
1. OUTPUT ZERO timing fields (no startTime, endTime, focusStartTime, focusEndTime).
   Timing is computed in code from wordStartIndex / wordEndIndex.

2. For each point, set:
   - wordStartIndex: index of the FIRST word in the transcript that is about this point.
   - wordEndIndex: index of the LAST word in the transcript that is about this point.
   These MUST be valid indices into the word array above.

3. text: 2–5 words MAX. Punchy headline. NO full sentences.
   Examples: "Build First ❌", "Talk to Customers ✓", "40% Revenue Surge 📈", "Focus Is Everything"

4. boardIndex: 0 for content in first half, 1 for second half, 2 if needed (>60s audio only).
   MAX 3 points per board.

5. Pick icon from: lightbulb, brain, money, clock, book, rocket, heart, trophy, target, shield, chart, star, checkmark, question, fire

6. Pick drawingId from: character_doctor, character_business_leader, character_thinking, character_celebration,
   medical_ecg_pulse, medical_pill_capsule, medical_dna_helix,
   business_growth_chart, business_target_bullseye, business_handshake,
   process_step_curved_arrow, process_funnel_filter,
   science_atom_orbit, science_beaker_flask, science_lightbulb_idea,
   comparison_cross_error, comparison_checkmark_success

7. Language detection:
   - Urdu/Arabic script → "language": "ur", "direction": "rtl"
   - Hindi/Devanagari → "language": "hi", "direction": "ltr"
   - Otherwise → "language": "en", "direction": "ltr"

8. layoutType: "quiz" if voiceover asks questions, "table" if comparing names/rows, "cards" otherwise.

OUTPUT (ONLY valid JSON, NO markdown fences):
{
  "title": "2-4 word punchy header",
  "titleColor": "#0F172A",
  "layoutType": "cards",
  "language": "en",
  "direction": "ltr",
  "points": [
    {
      "text": "Punchy 2-5 word phrase",
      "boardIndex": 0,
      "wordStartIndex": 3,
      "wordEndIndex": 8,
      "icon": "lightbulb",
      "drawingId": "science_lightbulb_idea",
      "focusType": "highlight",
      "bulletType": "check",
      "markerColor": "#1E40AF",
      "isHighlight": false
    }
  ],
  "tableRows": [],
  "quiz": null,
  "conclusion": "Short memorable takeaway"
}`;

    let cleanJson = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [systemPrompt],
        config: { responseMimeType: 'application/json' },
      });
      cleanJson = (response.text?.trim() || '').replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    } catch (sdkErr) {
      console.warn('[WB_PLANNER] SDK call failed, trying REST:', sdkErr);
      const restRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );
      if (!restRes.ok) throw new Error(`Gemini REST ${restRes.status}`);
      const data = await restRes.json();
      cleanJson = (data?.candidates?.[0]?.content?.parts?.[0]?.text || '')
        .replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    const result = JSON.parse(cleanJson);

    const detectedLang: 'ur' | 'hi' | 'en' = result.language || (
      input.transcript && /[\u0600-\u06FF]/.test(input.transcript) ? 'ur' : 'en'
    );
    const detectedDir: 'rtl' | 'ltr' = result.direction || (detectedLang === 'ur' ? 'rtl' : 'ltr');

    // ── Map Gemini points → full WhiteboardPoint with real timing ──────────
    const geminiPoints: GeminiPoint[] = (result.points || []);
    const validatedPoints: WhiteboardPoint[] = geminiPoints.map((p, i) => {
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
        bulletType: ((p.bulletType as WhiteboardPoint['bulletType']) || 'check'),
        isHighlight: Boolean(p.isHighlight),
        icon: iconKey,
        iconUrl: resolveWhiteboardIcon(iconKey),
        drawingId: drawingDef.id,
        boardIndex: Math.max(0, Number(p.boardIndex) || 0),
        focusType: ((p.focusType as WhiteboardPoint['focusType']) || 'highlight'),
      };
    });

    // ── Validate & auto-fix ───────────────────────────────────────────────
    const initialPlan: WhiteboardPlan = {
      title: String(result.title || input.topicTitle || (detectedLang === 'ur' ? 'اہم معلومات' : 'Key Insights')),
      titleColor: COLORS.title,
      layoutType: (result.layoutType as WhiteboardPlan['layoutType']) || 'cards',
      language: detectedLang,
      direction: detectedDir,
      points: validatedPoints.length > 0 ? validatedPoints : planDeterministicWhiteboard(input).points,
      tableRows: Array.isArray(result.tableRows) && result.tableRows.length > 0
        ? result.tableRows.map((r: { label?: string; value?: string; subValue?: string; icon?: string; startTime?: number; endTime?: number }) => ({
            label: String(r.label || ''),
            value: String(r.value || ''),
            subValue: r.subValue ? String(r.subValue) : undefined,
            iconUrl: resolveWhiteboardIcon(r.icon || 'star'),
            startTime: Number(r.startTime || 0),
            endTime: Number(r.endTime || duration),
          }))
        : undefined,
      quiz: result.quiz || undefined,
      conclusion: String(result.conclusion || (detectedLang === 'ur' ? 'مکمل' : 'Complete.')),
      conclusionTime: +(Math.max(1, duration - 1.5).toFixed(3)),
      source: 'gemini',
    };

    const diag = validateWhiteboardLayout(initialPlan.title, initialPlan.points, initialPlan.conclusion);
    if (!diag.isValid) {
      console.warn('[WB_PLANNER] Gemini plan has layout issues:', diag.issues);
      const fixed = autoFixWhiteboardLayout(initialPlan.title, initialPlan.points, initialPlan.conclusion, duration);
      initialPlan.points = fixed.points;
      initialPlan.conclusionTime = fixed.conclusionTime;
    }

    return initialPlan;
  } catch (err) {
    console.error('[WB_PLANNER] Gemini failed, falling back to deterministic:', err);
    return planDeterministicWhiteboard(input);
  }
}
