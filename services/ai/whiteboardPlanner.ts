/**
 * AI Whiteboard Planner
 *
 * Takes a transcript and produces a structured whiteboard plan:
 * - 1 title (3-5 words)
 * - 5-7 key points (max 7 words each)
 * - Marker colors assigned based on content role
 * - Timing synced to speech
 * - 1 conclusion line
 *
 * Rules for professional output:
 * - Title: max 4 words, describes the topic
 * - Points: max 7 words, short & punchy (whiteboard style)
 * - Colors: blue (info), green (tip/positive), red (warning/important), black (neutral)
 * - Spacing: minimum 4s between points
 * - Max 6 visible lines at once (prevents overcrowding)
 * - Conclusion: max 5 words, bold takeaway
 */

import { GoogleGenAI } from '@google/genai';

// ── Types ─────────────────────────────────────────────────────────────────────

export type WhiteboardPoint = {
  text: string;
  startTime: number;
  endTime: number;
  markerColor: string;
  bulletType: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
  isHighlight?: boolean;
  icon?: string;
};

export type WhiteboardPlan = {
  title: string;
  titleColor: string;
  points: WhiteboardPoint[];
  conclusion: string;
  conclusionTime: number;
  source: 'gemini' | 'fallback';
};

export type WhiteboardPlanInput = {
  transcript: string;
  segments: Array<{ start: number; end: number; text: string }>;
  durationSeconds: number;
  topicTitle?: string;
};

// ── Color palette ─────────────────────────────────────────────────────────────

const COLORS = {
  title: '#1E3A5F',
  blue: '#2563EB',
  red: '#DC2626',
  green: '#16A34A',
  black: '#1F2937',
};

// Rotate through these for regular points
const POINT_COLORS = [COLORS.blue, COLORS.green, COLORS.blue, COLORS.green, COLORS.blue, COLORS.green, COLORS.blue];

// Default icon rotation when Gemini doesn't specify
const ICON_ROTATION = ['arrow', 'checkmark', 'lightbulb', 'star', 'circle', 'arrow', 'checkmark'];

// ── Main planner ──────────────────────────────────────────────────────────────

export async function planWhiteboardVideo(input: WhiteboardPlanInput): Promise<WhiteboardPlan> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.warn('[WHITEBOARD_PLANNER] No Gemini API key, using fallback.');
    return buildFallbackPlan(input);
  }

  try {
    const plan = await callGeminiPlanner(input, apiKey);
    if (plan.points.length >= 3) {
      return plan;
    }
    console.warn('[WHITEBOARD_PLANNER] Gemini returned too few points, using fallback.');
    return buildFallbackPlan(input);
  } catch (error) {
    console.warn('[WHITEBOARD_PLANNER] Gemini failed, using fallback:', error);
    return buildFallbackPlan(input);
  }
}

// ── Gemini call ───────────────────────────────────────────────────────────────

async function callGeminiPlanner(input: WhiteboardPlanInput, apiKey: string): Promise<WhiteboardPlan> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = [
    'You are a professional whiteboard content designer for short-form 9:16 educational video reels.',
    '',
    'TASK: Extract the most important points from this speech to write on a whiteboard.',
    '',
    'TRANSCRIPT (duration: ' + input.durationSeconds.toFixed(0) + 's):',
    input.transcript.slice(0, 2500),
    '',
    'STRICT RULES:',
    '1. Title: max 4 words. Topic summary. Example: "Meta Ads Playbook"',
    '2. Points: 5-7 points maximum. Each point max 7 words. Think marker bullet style.',
    '3. Each point has a startTime (when speaker mentions it). Minimum 4 seconds gap between points.',
    '4. First point starts at 3.5-4 seconds (after title appears).',
    '5. Last point must complete before ' + Math.max(10, input.durationSeconds - 6).toFixed(0) + ' seconds.',
    '6. Mark exactly 1 point as "highlight" (the most important one — will be red).',
    '7. Add a conclusion (max 5 words) — appears after all points.',
    '8. bulletType: "number" for step-by-step, "check" for tips/rules, "bullet" for general lists.',
    '9. icon: one of "arrow", "checkmark", "lightbulb", "star", "circle" — pick the most relevant for each point.',
    '10. Keep text SHORT. Not full sentences. Whiteboard notes style.',
    '11. DO NOT repeat the title in points. Each point must be different.',
    '',
    'OUTPUT FORMAT (JSON only, no markdown, no explanation):',
    '{"title":"Topic Here","points":[{"text":"Short point","startTime":4,"bulletType":"number","highlight":false,"icon":"arrow"}],"conclusion":"Key takeaway","conclusionTime":' + Math.max(15, input.durationSeconds - 5).toFixed(0) + '}',
  ].join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { temperature: 0.25, maxOutputTokens: 1200 },
  });

  const text = (response.text || '').trim();
  const jsonStr = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(jsonStr);

  if (!parsed.title || !Array.isArray(parsed.points) || parsed.points.length < 3) {
    throw new Error('Invalid whiteboard plan from Gemini');
  }

  const points: WhiteboardPoint[] = parsed.points
    .filter((p: any) => typeof p.text === 'string' && p.text.length > 0)
    .slice(0, 7)
    .map((p: any, i: number) => ({
      text: String(p.text).slice(0, 50),
      startTime: Math.max(3.5, Number(p.startTime) || (3.5 + i * 5)),
      endTime: Math.max((Number(p.startTime) || (3.5 + i * 5)) + 3, Number(p.endTime) || 0),
      markerColor: p.highlight ? COLORS.red : POINT_COLORS[i % POINT_COLORS.length],
      bulletType: (['number', 'bullet', 'check', 'arrow', 'star'].includes(p.bulletType) ? p.bulletType : 'number') as WhiteboardPoint['bulletType'],
      isHighlight: Boolean(p.highlight),
      icon: (['arrow', 'checkmark', 'lightbulb', 'star', 'circle'].includes(p.icon) ? p.icon : ICON_ROTATION[i % ICON_ROTATION.length]) as string,
    }));

  // Ensure minimum 4s spacing
  for (let i = 1; i < points.length; i++) {
    if (points[i].startTime - points[i - 1].startTime < 4) {
      points[i].startTime = points[i - 1].startTime + 4;
    }
  }

  const conclusionTime = Number(parsed.conclusionTime) || (points.length ? points[points.length - 1].startTime + 5 : input.durationSeconds - 5);

  return {
    title: String(parsed.title).slice(0, 30),
    titleColor: COLORS.title,
    points,
    conclusion: String(parsed.conclusion || 'Remember this!').slice(0, 35),
    conclusionTime: Math.min(conclusionTime, input.durationSeconds - 3),
    source: 'gemini',
  };
}

// ── Fallback deterministic planner ────────────────────────────────────────────

function buildFallbackPlan(input: WhiteboardPlanInput): WhiteboardPlan {
  const { segments, durationSeconds, topicTitle } = input;

  const title = topicTitle
    ? topicTitle.split(/\s+/).slice(0, 4).join(' ')
    : segments[0]?.text.split(/\s+/).slice(0, 4).join(' ') || 'Key Points';

  // Pick segments with enough text, extract first 6-7 words
  const usable = segments
    .filter((s) => s.text.trim().split(/\s+/).length >= 4)
    .slice(0, 6);

  const spacing = Math.max(4, (durationSeconds - 10) / (usable.length + 1));

  const points: WhiteboardPoint[] = usable.map((seg, i) => {
    const words = seg.text.trim().split(/\s+/).slice(0, 7);
    const startTime = Math.max(3.5, seg.start || (4 + i * spacing));
    return {
      text: words.join(' ').slice(0, 45),
      startTime: Math.min(startTime, durationSeconds - 8),
      endTime: Math.min(startTime + 4, durationSeconds - 4),
      markerColor: POINT_COLORS[i % POINT_COLORS.length],
      bulletType: 'number' as const,
      isHighlight: i === Math.floor(usable.length / 2), // middle point is highlight
      icon: ICON_ROTATION[i % ICON_ROTATION.length],
    };
  });

  // Mark the highlight red
  const highlightIndex = points.findIndex((p) => p.isHighlight);
  if (highlightIndex >= 0) {
    points[highlightIndex].markerColor = COLORS.red;
  }

  const lastPointTime = points.length ? points[points.length - 1].startTime : durationSeconds - 8;
  const conclusionTime = Math.min(lastPointTime + 5, durationSeconds - 3);

  return {
    title: title.slice(0, 28),
    titleColor: COLORS.title,
    points,
    conclusion: 'Remember this!',
    conclusionTime,
    source: 'fallback',
  };
}
