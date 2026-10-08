import { GoogleGenAI } from '@google/genai';
import { resolveWhiteboardIcon, WHITEBOARD_ICONS, WhiteboardIconName } from '@/lib/whiteboard/icons';
import { resolveVectorDrawing, WHITEBOARD_VECTOR_DRAWINGS } from '@/lib/whiteboard/vectorDrawings';

export type WhiteboardPoint = {
  text: string;
  title?: string;
  startTime: number;      // When it is written on the board (seconds)
  endTime: number;        // When it finishes writing (seconds)
  focusStartTime: number; // When the narrator speaks about it (for drawing circles/underlines/highlight)
  focusEndTime: number;   // When the focus ends
  markerColor: string;
  bulletType: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
  isHighlight?: boolean;
  icon?: string;
  iconUrl?: string;       // Direct Cloudinary CDN URL for doodle icon
  drawingId?: string;     // Procedural SVG vector drawing ID
  boardIndex: number;     // Multi-scene board clears support: 0, 1, or 2
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
  segments: Array<{start: number; end: number; text: string}>;
  durationSeconds: number;
  topicTitle?: string;
  boardStyle?: string;
  apiKey?: string;
};

const COLORS = {
  title: '#0F172A',      // Corporate dark charcoal
  blue: '#1E40AF',       // Premium boardroom Navy
  red: '#991B1B',        // Deep corporate Crimson
  green: '#065F46',      // Slate Teal
  grey: '#475569',
};

const POINT_COLORS = [COLORS.blue, COLORS.green, COLORS.blue];
const FOCUS_TYPES: Array<WhiteboardPoint['focusType']> = ['circle', 'underline', 'box', 'arrow'];

// ── Layout Simulation & Validation Helpers ─────────────────────────────────────

type BoardGeometry = {
  maxPoints: number;
  maxTextRows: number;
  maxCharsPerLine: number;
};

// Simplified corporate-luxury geometry (matching template.tsx exactly)
const BOARD_GEOMETRY: BoardGeometry = {
  maxPoints: 4,
  maxTextRows: 9,
  maxCharsPerLine: 28,
};

function countLines(text: string): number {
  return text ? text.split('\n').length : 0;
}

function condenseToWhiteboardPhrase(text: string): string {
  if (!text) return '';
  const cleaned = text
    .replace(/^(one of the|we need to|make sure to|you have to|it is important to|trying to|basically|actually|in order to|the first step is to|always remember to)\s+/i, '')
    .trim();
  const words = cleaned.split(/\s+/);
  if (words.length <= 5) return cleaned;
  return words.slice(0, 5).join(' ');
}

function clampText(text: string, maxChars: number): string {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`;
}

function splitLongToken(token: string, charsPerLine: number): string[] {
  if (token.length <= charsPerLine) return [token];
  const parts: string[] = [];
  for (let i = 0; i < token.length; i += charsPerLine) {
    parts.push(token.slice(i, i + charsPerLine));
  }
  return parts;
}

function wrapWhiteboardText(text: string, charsPerLine: number, maxLines: number): string {
  const words = clampText(text, charsPerLine * maxLines)
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => splitLongToken(word, charsPerLine));
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

  const rendered = lines.join('\n');
  return rendered || clampText(text, charsPerLine);
}

export type LayoutDiagnostic = {
  isValid: boolean;
  issues: string[];
  boardDiagnostics: Array<{
    boardIndex: number;
    pointCount: number;
    usedRows: number;
    scale: number;
    truncatedPointsCount: number;
    clampedWordsCount: number;
  }>;
};

export function validateWhiteboardLayout(
  title: string,
  points: WhiteboardPoint[],
  conclusion: string
): LayoutDiagnostic {
  const issues: string[] = [];
  const boardDiagnostics: any[] = [];
  let isValid = true;

  // Group points by board index
  const pointsByBoard: Record<number, WhiteboardPoint[]> = {};
  points.forEach((p) => {
    const idx = p.boardIndex ?? 0;
    if (!pointsByBoard[idx]) pointsByBoard[idx] = [];
    pointsByBoard[idx].push(p);
  });

  const maxBoardIndex = Math.max(0, ...points.map((p) => p.boardIndex ?? 0));

  for (let bIdx = 0; bIdx <= maxBoardIndex; bIdx++) {
    const boardPoints = pointsByBoard[bIdx] || [];
    const titleText = wrapWhiteboardText(title || 'Strategy Session', BOARD_GEOMETRY.maxCharsPerLine, 2);
    const pointCharsPerLine = Math.max(16, BOARD_GEOMETRY.maxCharsPerLine - 5); // 23

    // Check if points are truncated
    const truncatedPointsCount = Math.max(0, boardPoints.length - BOARD_GEOMETRY.maxPoints);
    if (truncatedPointsCount > 0) {
      isValid = false;
      issues.push(`Board ${bIdx} has too many points (${boardPoints.length} > max ${BOARD_GEOMETRY.maxPoints}), causing ${truncatedPointsCount} points to be truncated!`);
    }

    const displayPoints = boardPoints.slice(0, BOARD_GEOMETRY.maxPoints).map((point) => {
      const displayText = wrapWhiteboardText(point.text, pointCharsPerLine, 2);
      return {
        ...point,
        displayText,
        lineCount: countLines(displayText),
      };
    });

    const conclusionText = (bIdx === maxBoardIndex && conclusion)
      ? wrapWhiteboardText(conclusion, BOARD_GEOMETRY.maxCharsPerLine, 2)
      : '';

    const usedRows = countLines(titleText) + 1 + displayPoints.reduce((total, p) => total + p.lineCount + 1, 0) + (conclusionText ? 2 : 0);
    const scale = Math.max(0.78, Math.min(1, BOARD_GEOMETRY.maxTextRows / Math.max(BOARD_GEOMETRY.maxTextRows, usedRows)));

    // Check if scale is too small (< 0.80 means text gets small and hard to read)
    if (scale < 0.80) {
      isValid = false;
      issues.push(`Board ${bIdx} is cramped, scale is too small (${scale.toFixed(2)} < 0.80), text will look too small.`);
    }

    // Check if any point text has ellipsis indicating clamp
    let clampedWordsCount = 0;
    displayPoints.forEach((p) => {
      if (p.displayText.includes('…')) {
        clampedWordsCount++;
      }
    });
    if (clampedWordsCount > 0) {
      isValid = false;
      issues.push(`Board ${bIdx} has ${clampedWordsCount} points that are too long and got clamped with '…'.`);
    }

    boardDiagnostics.push({
      boardIndex: bIdx,
      pointCount: boardPoints.length,
      usedRows,
      scale,
      truncatedPointsCount,
      clampedWordsCount,
    });
  }

  return {
    isValid,
    issues,
    boardDiagnostics,
  };
}

export function autoFixWhiteboardLayout(
  title: string,
  points: WhiteboardPoint[],
  conclusion: string,
  durationSeconds: number
): { points: WhiteboardPoint[]; conclusionTime: number } {
  console.log('[LAYOUT_AUTO_FIXER] Starting whiteboard layout improvement...');

  // 1. Simplify & Shorten individual points (maximum 5 words, clear, concise)
  const cleanedPoints = points.map((p) => {
    let cleanText = p.text.trim();
    const words = cleanText.split(/\s+/);
    if (words.length > 5 || cleanText.length > 32) {
      // Shorten deterministically to the first 5 words
      cleanText = words.slice(0, 5).join(' ');
      console.log(`[LAYOUT_AUTO_FIXER] Shortened text: "${p.text}" -> "${cleanText}"`);
    }
    return {
      ...p,
      text: cleanText,
    };
  });

  // 2. Decide target board count based on total points and duration (up to 3 min / 180s)
  // Max 3-4 points per board with smooth multi-board auto-erase
  const totalPoints = cleanedPoints.length;
  let targetBoards = totalPoints > 15 ? 5 : totalPoints > 11 ? 4 : totalPoints > 7 ? 3 : totalPoints > 3 ? 2 : 1;
  if (durationSeconds > 120 && targetBoards < 4) targetBoards = Math.max(targetBoards, 4);
  else if (durationSeconds > 60 && targetBoards < 3) targetBoards = Math.max(targetBoards, 3);
  else if (durationSeconds > 30 && targetBoards < 2) targetBoards = Math.max(targetBoards, 2);
  const boardCount = Math.min(6, targetBoards);
  console.log(`[LAYOUT_AUTO_FIXER] Distributing ${totalPoints} points across ${boardCount} boards/pages (${durationSeconds}s duration).`);

  // 3. Distribute points evenly across the boards
  const pointsPerBoard = Math.ceil(totalPoints / boardCount);
  const fixedPoints: WhiteboardPoint[] = cleanedPoints.map((p, index) => {
    const boardIndex = Math.min(boardCount - 1, Math.floor(index / pointsPerBoard));
    const boardStart = (boardIndex * durationSeconds) / boardCount;
    const boardEnd = ((boardIndex + 1) * durationSeconds) / boardCount;

    // Order of this point on its board
    const orderOnBoard = index % pointsPerBoard;

    // Rapid Setup Phase (all text on the board written in first 1.5 seconds)
    const startTime = boardStart + 0.5 + orderOnBoard * 0.4;
    const endTime = startTime + 0.6;

    // Make sure focus window is well-aligned
    let focusStartTime = p.focusStartTime;
    let focusEndTime = p.focusEndTime;

    // Focus window must start after the board is set up and complete before board erases
    if (focusStartTime < startTime + 0.5) {
      focusStartTime = startTime + 0.6;
    }
    if (focusEndTime <= focusStartTime) {
      focusEndTime = focusStartTime + 2.5;
    }
    if (focusStartTime > boardEnd - 1.0) {
      focusStartTime = Math.max(boardStart + 1.2, boardEnd - 3.5);
      focusEndTime = boardEnd - 0.2;
    }
    if (focusEndTime > boardEnd) {
      focusEndTime = boardEnd - 0.2;
    }

    return {
      ...p,
      boardIndex,
      startTime: Number(startTime.toFixed(2)),
      endTime: Number(endTime.toFixed(2)),
      focusStartTime: Number(focusStartTime.toFixed(2)),
      focusEndTime: Number(focusEndTime.toFixed(2)),
    };
  });

  const conclusionTime = Number((durationSeconds - 1.5).toFixed(2));
  console.log(`[LAYOUT_AUTO_FIXER] Layout successfully validated and fixed! Points adjusted:`, fixedPoints.length);

  return {
    points: fixedPoints,
    conclusionTime,
  };
}

/**
 * Deterministic multi-board fallback planner.
 * Breaks segments into 2-3 boards, schedules rapid writing, and matches speech focus windows.
 */
export function planDeterministicWhiteboard(input: WhiteboardPlanInput): WhiteboardPlan {
  const duration = Math.max(8, Number(input.durationSeconds) || 30);
  const rawSegments = (input.segments || [])
    .map((s) => ({
      start: Math.max(0, Number(s.start) || 0),
      end: Math.min(duration, Number(s.end) || duration),
      text: s.text.trim(),
    }))
    .filter((s) => s.text.split(/\s+/).length >= 2);

  const scriptLang = input.transcript && /[\u0600-\u06FF]/.test(input.transcript)
    ? { language: 'ur' as const, direction: 'rtl' as const }
    : input.transcript && /[\u0900-\u097F]/.test(input.transcript)
    ? { language: 'hi' as const, direction: 'ltr' as const }
    : { language: 'en' as const, direction: 'ltr' as const };

  // Group into 2 or 3 boards depending on duration
  const boardCount = duration > 45 ? 3 : duration > 20 ? 2 : 1;
  const pointsPerBoard = 3;
  const totalPointsCount = Math.min(boardCount * pointsPerBoard, rawSegments.length || 1);

  // If we have no raw segments, synthesize some
  const segmentsToUse = rawSegments.length >= totalPointsCount
    ? rawSegments.slice(0, totalPointsCount)
    : Array.from({ length: totalPointsCount }, (_, i) => ({
        start: (i * duration) / totalPointsCount,
        end: ((i + 1) * duration) / totalPointsCount - 0.5,
        text: `Key takeaway ${i + 1}`,
      }));

  const points: WhiteboardPoint[] = [];
  const title = input.topicTitle || (scriptLang.language === 'ur' ? 'اہم نکات' : 'Key Insights');

  segmentsToUse.forEach((segment, index) => {
    const boardIndex = Math.min(boardCount - 1, Math.floor(index / pointsPerBoard));
    const boardStart = (boardIndex * duration) / boardCount;
    
    // Rapid writing setup at the start of each board
    const writeOffset = (index % pointsPerBoard) * 0.4;
    const startTime = boardStart + 0.6 + writeOffset;
    const endTime = startTime + 0.8;

    // Focus window matches spoken segment
    const focusStartTime = segment.start;
    const focusEndTime = segment.end;
    const iconName = index % 4 === 0 ? 'lightbulb' : index % 4 === 1 ? 'brain' : index % 4 === 2 ? 'target' : 'star';
    const drawingDef = resolveVectorDrawing(segment.text);

    points.push({
      text: condenseToWhiteboardPhrase(segment.text),
      startTime: Number(startTime.toFixed(2)),
      endTime: Number(endTime.toFixed(2)),
      focusStartTime: Number(focusStartTime.toFixed(2)),
      focusEndTime: Number(focusEndTime.toFixed(2)),
      markerColor: POINT_COLORS[index % POINT_COLORS.length],
      bulletType: index % 3 === 0 ? 'check' : 'arrow',
      isHighlight: index % 3 === 2,
      icon: iconName,
      iconUrl: resolveWhiteboardIcon(iconName),
      drawingId: drawingDef.id,
      boardIndex,
      focusType: 'highlight',
    });
  });

  const plan: WhiteboardPlan = {
    title,
    titleColor: COLORS.title,
    layoutType: 'cards',
    language: scriptLang.language,
    direction: scriptLang.direction,
    points,
    conclusion: scriptLang.language === 'ur' ? 'سبق مکمل ہوا۔' : 'Key insight unlocked.',
    conclusionTime: duration - 1.5,
    source: 'deterministic',
  };

  const diag = validateWhiteboardLayout(plan.title, plan.points, plan.conclusion);
  if (!diag.isValid) {
    console.log('[WHITEBOARD_PLANNER] Deterministic plan has layout issues:', diag.issues);
    const fixed = autoFixWhiteboardLayout(plan.title, plan.points, plan.conclusion, duration);
    plan.points = fixed.points;
    plan.conclusionTime = fixed.conclusionTime;
  }

  return plan;
}

/**
 * Gemini-powered universal 9:16 whiteboard planner.
 * Dynamically classifies ANY topic (Urdu, Hindi, English, Islamic quiz, names/meanings,
 * business tips, health advice, motivational facts) into the optimal 9:16 layout
 * and syncs spoken karaoke highlighter marker with voiceover timing.
 */
export async function planWhiteboardVideo(input: WhiteboardPlanInput): Promise<WhiteboardPlan> {
  const apiKey = input.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('[WHITEBOARD_PLANNER] No API key, using premium deterministic planner');
    return planDeterministicWhiteboard(input);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const duration = Math.max(8, Number(input.durationSeconds) || 30);
    const segmentDetails = input.segments
      .map((s, i) => `[Segment ${i}] ${s.start.toFixed(2)}s to ${s.end.toFixed(2)}s: "${s.text}"`)
      .join('\n');

    const systemPrompt = `You are an elite visual whiteboard video director specializing in 9:16 vertical short-form reels (TikTok, YouTube Shorts, Instagram Reels).
You are planning a dynamic whiteboard explainer for ANY arbitrary topic.

AUDIO DURATION: ${duration} seconds
TOPIC HINT: "${input.topicTitle || 'Dynamic Explainer'}"

TRANSCRIPT WITH SPOKEN TIMESTAMPS:
${segmentDetails}

CRITICAL ARCHITECTURE DIRECTIVES:
1. KEY PHRASE EXTRACTION & VISUAL CONDENSATION (ABSOLUTE MANDATE):
   - NEVER output full conversational sentences onto the whiteboard.
   - The narrator SPEAKS the full sentence; the whiteboard MUST ILLUSTRATE it as concise, high-impact micro-phrases (2 to 5 words max).
   - Extract the core punchy insight, contrast, or framework with visual markers (✓, ❌, 💡, 🚀, 📈, ➔).
   - Real-World Transformation Examples:
     * Spoken: "One of the biggest mistakes new entrepreneurs make is trying to build everything before talking to customers."
       ➔ Title: "BIGGEST MISTAKE"
       ➔ Point 1: "Build First ❌" (markerColor: "#B91C1C", icon: "question", focusType: "box")
       ➔ Point 2: "Talk to Customers First ✓" (markerColor: "#0F766E", icon: "target", focusType: "highlight")
     * Spoken: "If you want financial freedom, stop buying depreciating liabilities and start investing in cash flow assets."
       ➔ Title: "WEALTH RULE"
       ➔ Point 1: "Liabilities ❌" (markerColor: "#B91C1C", icon: "money")
       ➔ Point 2: "Cash Flow Assets ✓" (markerColor: "#0F766E", icon: "chart")
     * Spoken: "There are three steps to building a successful business: first idea, then validation, and finally product."
       ➔ Title: "3 STEPS TO SCALE"
       ➔ Point 1: "01 Idea 💡" (icon: "lightbulb")
       ➔ Point 2: "02 Validate ✓" (icon: "checkmark")
       ➔ Point 3: "03 Build 🚀" (icon: "rocket")
     * Spoken: "Revenue increased by over 40% after implementing automated marketing funnels."
       ➔ Title: "GROWTH SECRET"
       ➔ Point 1: "Automated Funnels 🚀" (icon: "rocket")
       ➔ Point 2: "40% Surge in Revenue 📈" (icon: "chart", focusType: "highlight")

2. DETECT LANGUAGE & SCRIPT:
   - If audio transcript is Urdu or Arabic script, set "language": "ur", "direction": "rtl". Keep all titles and bullet points in authentic Urdu (Nastaliq style).
   - If audio transcript is Hindi (Devanagari script), set "language": "hi", "direction": "ltr".
   - Otherwise, set "language": "en", "direction": "ltr".

3. CHOOSE THE BEST 9:16 LAYOUT TYPE ("layoutType"):
   - "quiz": Use when the voiceover asks questions, tests knowledge, or presents trivia with choices.
   - "table": Use when comparing attributes, items, names with meanings (structured 2-4 column rows).
   - "cards": (Default) 3 to 4 floating visual cards for advice, rules, habits, health tips, science facts, or step-by-step guides.
   - "hook": For a single high-impact quote, shocking statistic, or dramatic mindset hook.

4. CONTENT-DRIVEN DYNAMIC VISUAL SELECTION (AI Intelligence Rules):
   AI must automatically classify narration beats and pick the optimal visual layout:
   a) PARAGRAPH / CORE INSIGHT: Short punchy key statement + 1 high-impact icon (e.g., text: "Focus Is Everything", icon: "target").
   b) BULLET POINTS / CHECKLIST: Numbered or checked bullets (bulletType: "check" or "bullet").
   c) STEPS / FRAMEWORK: "Step 01: IDEA 💡", "Step 02: VALIDATE ✓", "Step 03: BUILD 🚀".
   d) COMPARISON: "A vs B" format split into two contrast points (e.g. "OLD: Manual ❌" vs "NEW: AI Speed ✓").
   e) STATISTIC / METRIC: Big focal number callout + trend (e.g. text: "40% REVENUE SURGE 📈", icon: "chart").
   f) PROCESS / FLOW: Step progression "INPUT ➔ PROCESS ➔ RESULT" (bulletType: "arrow").
   g) DEFINITION: "TERM ↓ Short 3-word meaning" with focus underline.
   h) QUESTION / HOOK: "BIG QUESTION?" then reveal key answer on focus time (icon: "question").
   i) STORY / EXAMPLE: Highlight words + relevant doodle illustration (e.g., icon: "rocket" or "trophy").

5. PROCEDURAL VECTOR DRAWING SELECTION ("drawingId"):
   For each point or scene beat, select the best matching hand-drawn vector drawing:
   - Characters: 'character_doctor', 'character_business_leader', 'character_thinking', 'character_celebration'
   - Medical: 'medical_ecg_pulse', 'medical_pill_capsule', 'medical_dna_helix'
   - Business & Finance: 'business_growth_chart', 'business_target_bullseye', 'business_handshake'
   - Process & Steps: 'process_step_curved_arrow', 'process_funnel_filter'
   - Science & Education: 'science_atom_orbit', 'science_beaker_flask', 'science_lightbulb_idea'
   - Comparison: 'comparison_cross_error', 'comparison_checkmark_success'

6. REAL-TIME SPOKEN YELLOW HIGHLIGHTER & DRAWING TIMING:
   - "startTime" is when the stroke reveal starts drawing the card.
   - "focusStartTime" and "focusEndTime" MUST correspond to the exact transcript timestamps when that specific point is spoken by the narrator.
   - Set "focusType": "highlight" (or "circle" / "box" for emphasis).
   - The whiteboard will render an animated semi-transparent yellow highlighter marker box behind the spoken phrase as the voiceover talks.

7. 9:16 VERTICAL CANVAS SAFETY:
   - Keep titles short and punchy (max 2-4 words, e.g. "BIGGEST MISTAKE", "3 RULES", "SCALE SECRET").
   - Keep each point text strictly concise (max 2-5 punchy words).
   - Max 3-4 points per board. If duration is > 35s, spread points across boardIndex: 0 and 1.

OUTPUT SCHEMA (Return ONLY valid JSON):
{
  "title": "Short punchy header",
  "titleColor": "#0F172A",
  "layoutType": "cards" | "table" | "quiz" | "hook",
  "language": "ur" | "hi" | "en",
  "direction": "rtl" | "ltr",
  "points": [
    {
      "title": "Short Card Title (optional)",
      "text": "Core spoken point or bullet",
      "startTime": 0.6,
      "endTime": 1.4,
      "focusStartTime": 1.5,
      "focusEndTime": 6.8,
      "markerColor": "#1E40AF",
      "bulletType": "check",
      "icon": "brain",
      "drawingId": "character_doctor",
      "boardIndex": 0,
      "focusType": "highlight",
      "isHighlight": true
    }
  ],
  "tableRows": [ // Only if layoutType === "table"
    {
      "label": "Column/Row Name",
      "value": "Detail or meaning",
      "subValue": "Lucky stone or number (optional)",
      "icon": "star",
      "startTime": 2.0,
      "endTime": 7.0
    }
  ],
  "quiz": { // Only if layoutType === "quiz"
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 1,
    "explanation": "Why this is correct",
    "questionStart": 1.0,
    "timerStart": 6.0,
    "revealStart": 11.0
  },
  "conclusion": "Final memorable takeaway line",
  "conclusionTime": ${Math.max(1, duration - 2)}
}`;

    let cleanJson = '';
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [systemPrompt],
        config: {
          responseMimeType: 'application/json',
        },
      });
      const text = response.text?.trim() || '';
      cleanJson = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    } catch (sdkErr) {
      console.warn('[WHITEBOARD_PLANNER] SDK call failed, falling back to direct REST API:', sdkErr);
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
      if (!restRes.ok) {
        throw new Error(`Gemini REST failed: ${restRes.status} ${await restRes.text()}`);
      }
      const data = await restRes.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }
    const result = JSON.parse(cleanJson);

    // Detect language fallback if Gemini didn't specify
    const detectedLang = result.language || (input.transcript && /[\u0600-\u06FF]/.test(input.transcript) ? 'ur' : 'en');
    const detectedDir = result.direction || (detectedLang === 'ur' ? 'rtl' : 'ltr');

    // Validate and attach Cloudinary icon URLs and Vector Drawing IDs
    const validatedPoints = (result.points || []).map((p: any, i: number) => {
      const boardIndex = typeof p.boardIndex === 'number' ? p.boardIndex : 0;
      const boardStart = (boardIndex * duration) / Math.max(1, (result.points?.length || 3) / 3);
      const iconKey = String(p.icon || 'lightbulb').toLowerCase().trim();
      const drawingDef = p.drawingId && WHITEBOARD_VECTOR_DRAWINGS[p.drawingId]
        ? WHITEBOARD_VECTOR_DRAWINGS[p.drawingId]
        : resolveVectorDrawing(`${p.title || ''} ${p.text || ''} ${iconKey}`);

      return {
        title: p.title ? String(p.title) : undefined,
        text: String(p.text || '').slice(0, 60),
        startTime: Number(Math.max(0, Number(p.startTime) || (boardStart + 0.5 + i * 0.4)).toFixed(2)),
        endTime: Number(Math.min(duration, Number(p.endTime) || (boardStart + 1.2 + i * 0.4)).toFixed(2)),
        focusStartTime: Number(Math.max(0, Number(p.focusStartTime) || 0).toFixed(2)),
        focusEndTime: Number(Math.min(duration, Number(p.focusEndTime) || duration).toFixed(2)),
        markerColor: String(p.markerColor || (i % 2 === 0 ? COLORS.blue : COLORS.green)),
        bulletType: (p.bulletType as any) || 'check',
        isHighlight: Boolean(p.isHighlight),
        icon: iconKey,
        iconUrl: resolveWhiteboardIcon(iconKey),
        drawingId: drawingDef.id,
        boardIndex,
        focusType: (p.focusType as any) || 'highlight',
      };
    });

    const validatedTableRows = Array.isArray(result.tableRows)
      ? result.tableRows.map((r: any) => ({
          label: String(r.label || ''),
          value: String(r.value || ''),
          subValue: r.subValue ? String(r.subValue) : undefined,
          iconUrl: resolveWhiteboardIcon(r.icon || 'star'),
          startTime: Number(r.startTime || 0),
          endTime: Number(r.endTime || duration),
        }))
      : undefined;

    const initialPlan: WhiteboardPlan = {
      title: String(result.title || input.topicTitle || (detectedLang === 'ur' ? 'اہم معلومات' : 'Executive Insights')),
      titleColor: COLORS.title,
      layoutType: result.layoutType || 'cards',
      language: detectedLang,
      direction: detectedDir,
      points: validatedPoints.length > 0 ? validatedPoints : planDeterministicWhiteboard(input).points,
      tableRows: validatedTableRows,
      quiz: result.quiz,
      conclusion: String(result.conclusion || (detectedLang === 'ur' ? 'مکمل' : 'Complete')),
      conclusionTime: Number(Math.min(duration, Number(result.conclusionTime) || (duration - 1.5)).toFixed(2)),
      source: 'gemini',
    };

    const diag = validateWhiteboardLayout(initialPlan.title, initialPlan.points, initialPlan.conclusion);
    if (!diag.isValid) {
      console.log('[WHITEBOARD_PLANNER] Gemini-generated plan has layout issues:', diag.issues);
      const fixed = autoFixWhiteboardLayout(initialPlan.title, initialPlan.points, initialPlan.conclusion, duration);
      initialPlan.points = fixed.points;
      initialPlan.conclusionTime = fixed.conclusionTime;
    }

    return initialPlan;
  } catch (error) {
    console.error('[WHITEBOARD_PLANNER] Gemini planning failed, falling back:', error);
    return planDeterministicWhiteboard(input);
  }
}
