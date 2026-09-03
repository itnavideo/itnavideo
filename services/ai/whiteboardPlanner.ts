import { GoogleGenAI } from '@google/genai';

export type WhiteboardPoint = {
  text: string;
  startTime: number;      // When it is written on the board (seconds)
  endTime: number;        // When it finishes writing (seconds)
  focusStartTime: number; // When the narrator speaks about it (for drawing circles/underlines)
  focusEndTime: number;   // When the focus ends
  markerColor: string;
  bulletType: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
  isHighlight?: boolean;
  icon?: 'arrow' | 'checkmark' | 'lightbulb' | 'star' | 'circle' | 'none';
  boardIndex: number;     // Multi-scene board clears support: 0, 1, or 2
  focusType: 'circle' | 'underline' | 'box' | 'arrow';
};

export type WhiteboardPlan = {
  title: string;
  titleColor: string;
  points: WhiteboardPoint[];
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

  // 2. Decide target board count based on total points
  // If points count is > 4, we divide them across 3-4 boards to ensure maximum spaciousness!
  const totalPoints = cleanedPoints.length;
  const boardCount = totalPoints > 9 ? 4 : totalPoints > 4 ? 3 : totalPoints > 2 ? 2 : 1;
  console.log(`[LAYOUT_AUTO_FIXER] Distributing ${totalPoints} points across ${boardCount} boards/pages.`);

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
        text: `Key business insight ${i + 1}`,
      }));

  const points: WhiteboardPoint[] = [];
  const title = input.topicTitle || 'Strategy Session';

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

    points.push({
      text: segment.text.slice(0, 48),
      startTime: Number(startTime.toFixed(2)),
      endTime: Number(endTime.toFixed(2)),
      focusStartTime: Number(focusStartTime.toFixed(2)),
      focusEndTime: Number(focusEndTime.toFixed(2)),
      markerColor: POINT_COLORS[index % POINT_COLORS.length],
      bulletType: index % 3 === 0 ? 'check' : 'arrow',
      isHighlight: index % 3 === 2,
      icon: index % 2 === 0 ? 'lightbulb' : 'checkmark',
      boardIndex,
      focusType: FOCUS_TYPES[index % FOCUS_TYPES.length],
    });
  });

  const plan: WhiteboardPlan = {
    title,
    titleColor: COLORS.title,
    points,
    conclusion: 'Action items unlocked.',
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
 * Gemini-powered premium boardroom whiteboard planner.
 * Organizes transcript into 2-3 strategic phases (boards), pre-renders writing,
 * and overlays precise hand-drawn highlights synced with voice timing.
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

    const systemPrompt = `You are an elite corporate strategy consultant and visual storyboard director.
You are planning a professional boardroom whiteboard explainer video.

TOPIC TITLE: "${input.topicTitle || 'Consulting Session'}"
VIDEO DURATION: ${duration} seconds

TRANSCRIPT SEGMENTS WITH TIMESTAMPS:
${segmentDetails}

CRITICAL WHITEBOARD WORKFLOW DIRECTIVES:
1. Divide the script into 2 or maximum 3 logical strategic boards (represented by boardIndex: 0, 1, or 2).
   - Board 0 (Active 0s to ~35% of duration)
   - Board 1 (Active ~35% to ~70% of duration)
   - Board 2 (Active ~70% to end of duration)
2. Keep ONLY 2 to 3 key strategic points per board for beautiful, spacious, high-end boardroom spacing. Never overload a board.
3. Rapid Setup Phase (Writing):
   - At the beginning of each board, all text of that board MUST be written rapidly within the first 1.5 seconds.
   - For Board i (starts at time boardStart), set point.startTime = boardStart + 0.5 + offset, and point.endTime = point.startTime + 0.7.
   - This ensures the board structure appears rapidly and remains completely stable while being explained.
4. Voiceover Focus Windows:
   - Match focusStartTime and focusEndTime exactly to the transcript segment timestamps when that specific point is explained.
5. Select a professional focusType for each point:
   - 'circle': draws a sleek hand-drawn marker circle around the point.
   - 'underline': draws a clean corporate marker underline.
   - 'box': wraps the point in a clean hand-drawn strategic box.
   - 'arrow': draws an arrow pointing to the point.
6. Design Aesthetic:
   - Strictly corporate consulting board. NO school classroom feeling. NO cartoon doodles.
   - Use professional bullet types: 'check' for strategies/tips, 'arrow' for flows, 'star' for highlights.
   - Alternate marker colors: deep boardroom navy ('#1E40AF'), crimson ('#991B1B'), teal ('#065F46').

OUTPUT SCHEMA (Return ONLY valid JSON):
{
  "title": "A short, punchy, high-end master session title",
  "titleColor": "#0F172A",
  "points": [
    {
      "text": "Extremely concise boardroom bullet (max 6 words)",
      "startTime": 0.6,
      "endTime": 1.3,
      "focusStartTime": 1.5,
      "focusEndTime": 7.2,
      "markerColor": "#1E40AF",
      "bulletType": "check",
      "icon": "lightbulb",
      "boardIndex": 0,
      "focusType": "circle",
      "isHighlight": true
    }
  ],
  "conclusion": "A final 1-line strategy action takeaway",
  "conclusionTime": 28.5
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [systemPrompt],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const cleanJson = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    const result = JSON.parse(cleanJson);

    // Validate and fix output timing boundaries
    const validatedPoints = (result.points || []).map((p: any, i: number) => {
      const boardIndex = typeof p.boardIndex === 'number' ? p.boardIndex : 0;
      const boardStart = (boardIndex * duration) / Math.max(1, result.points.length / 3);

      return {
        text: String(p.text || '').slice(0, 48),
        startTime: Number(Math.max(0, Number(p.startTime) || (boardStart + 0.5 + i * 0.4)).toFixed(2)),
        endTime: Number(Math.min(duration, Number(p.endTime) || (boardStart + 1.2 + i * 0.4)).toFixed(2)),
        focusStartTime: Number(Math.max(0, Number(p.focusStartTime) || 0).toFixed(2)),
        focusEndTime: Number(Math.min(duration, Number(p.focusEndTime) || duration).toFixed(2)),
        markerColor: String(p.markerColor || COLORS.blue),
        bulletType: (p.bulletType as any) || 'check',
        isHighlight: Boolean(p.isHighlight),
        icon: (p.icon as any) || 'checkmark',
        boardIndex,
        focusType: (p.focusType as any) || 'circle',
      };
    });

    const initialPlan: WhiteboardPlan = {
      title: String(result.title || input.topicTitle || 'Strategy Session'),
      titleColor: COLORS.title,
      points: validatedPoints,
      conclusion: String(result.conclusion || 'Session Complete.'),
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
