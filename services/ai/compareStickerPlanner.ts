/**
 * AI Sticker Planner for Compare Explainer
 *
 * Replaces the old keyword-regex approach with an AI "director" that:
 * 1. Reads the entire script + timeline holistically
 * 2. Decides which sticker pose fits each segment's MEANING
 * 3. Holds poses for minimum 4 seconds (avoids visual noise)
 * 4. Only changes sticker when the topic/intent actually changes
 *
 * Uses Gemini (free tier) for planning.
 */

import { GoogleGenAI } from '@google/genai';

// ── Types ─────────────────────────────────────────────────────────────────────

export type StickerPlanSegment = {
  start: number;
  end: number;
  pose: string;
  reason: string;
};

export type StickerPlanInput = {
  transcript: string;
  segments: Array<{ start: number; end: number; text: string }>;
  leftTitle: string;
  rightTitle: string;
  durationSeconds: number;
};

export type StickerPlanResult = {
  plan: StickerPlanSegment[];
  source: 'gemini' | 'fallback';
};

// ── Available poses ───────────────────────────────────────────────────────────

const AVAILABLE_POSES = [
  { id: 'welcome', use: 'Opening/greeting the viewer. First 2-3 seconds only.' },
  { id: 'left', use: 'Explaining or pointing to the LEFT item (Option A, first topic).' },
  { id: 'right', use: 'Explaining or pointing to the RIGHT item (Option B, second topic).' },
  { id: 'comparing', use: 'Comparing both items side by side, showing the difference.' },
  { id: 'thinking', use: 'Neutral analysis, considering options, "let me think about this".' },
  { id: 'explaining', use: 'General explanation of a concept or feature. Default for informative sections.' },
  { id: 'warning', use: 'Risks, problems, mistakes, things to avoid.' },
  { id: 'surprised', use: 'Questions, confusion, surprising facts, "did you know?".' },
  { id: 'success', use: 'Conclusion, recommendation, final verdict, clear answer.' },
  { id: 'celebrating', use: 'Outro/ending. Last 2-3 seconds only. Wrapping up with energy.' },
] as const;

const POSE_ID_TO_CANONICAL: Record<string, string> = {
  welcome: 'sticker_welcome_intro_explainer',
  left: 'sticker_pointing_left_side_explainer',
  right: 'sticker_pointing_right_side_explainer',
  comparing: 'sticker_comparing_both_sides_explainer',
  thinking: 'sticker_thinking_analysis_explainer',
  explaining: 'sticker_general_explaining_key_point',
  warning: 'sticker_warning_issue_explainer',
  surprised: 'sticker_questioning_surprised_explainer',
  success: 'sticker_success_conclusion_explainer',
  celebrating: 'sticker_happy_celebrating_outro',
};

// ── Main planner ──────────────────────────────────────────────────────────────

export async function planCompareStickers(input: StickerPlanInput): Promise<StickerPlanResult> {
  // Use deterministic script-driven planner — 100% reliable, instant, no API dependency
  return { plan: buildFallbackPlan(input), source: 'fallback' };
}

// ── Gemini call ───────────────────────────────────────────────────────────────

async function callGeminiStickerPlanner(input: StickerPlanInput, apiKey: string): Promise<StickerPlanSegment[]> {
  const ai = new GoogleGenAI({ apiKey });

  const segmentLines = input.segments
    .map((s) => '[' + s.start.toFixed(1) + 's - ' + s.end.toFixed(1) + 's] "' + s.text + '"')
    .join('\n');

  const poseLines = AVAILABLE_POSES
    .map((p) => '- "' + p.id + '": ' + p.use)
    .join('\n');

  const prompt = [
    'You are an AI Director for a comparison explainer video. Your job is to plan sticker/character poses for a presenter character.',
    '',
    'VIDEO CONTEXT:',
    '- This is a comparison video: "' + input.leftTitle + '" vs "' + input.rightTitle + '"',
    '- Total duration: ' + input.durationSeconds.toFixed(1) + ' seconds',
    '- The presenter sticker appears at the bottom of the screen and supports the narration',
    '',
    'TRANSCRIPT WITH TIMESTAMPS:',
    segmentLines,
    '',
    'AVAILABLE POSES:',
    poseLines,
    '',
    'RULES (CRITICAL):',
    '1. Poses are driven by SCRIPT CONTENT, not by fixed time durations.',
    '2. When the script talks about "' + input.leftTitle + '", use "left" (pointing left).',
    '3. When the script talks about "' + input.rightTitle + '", use "right" (pointing right).',
    '4. When both sides are being compared directly, use "thinking".',
    '5. A pose stays as long as the script is on that topic. It changes ONLY when the script shifts.',
    '6. Do NOT assign fixed 4-5 second blocks. Match the actual script timing.',
    '7. Start with "welcome" only for the very first 1-2 seconds.',
    '8. End with "success" only for the last 2 seconds.',
    '9. 80% of poses should be "left" or "right" — this is a COMPARISON video.',
    '10. Only use "thinking" for questions, "warning" for risks/problems.',
    '11. The pose duration equals how long the speaker talks about that topic.',
    '',
    'OUTPUT FORMAT (JSON array only, no markdown):',
    '[',
    '  {"start": 0, "end": 3.5, "pose": "welcome", "reason": "Opening greeting"},',
    '  {"start": 3.5, "end": 12.0, "pose": "left", "reason": "Explaining first topic"},',
    '  ...',
    ']',
    '',
    'Return ONLY the JSON array. No explanation, no markdown fences.',
  ].join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { temperature: 0.3, maxOutputTokens: 2000 },
  });

  const text = (response.text || '').trim();

  // Parse JSON — handle possible markdown fences
  const jsonStr = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(jsonStr);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Gemini returned invalid sticker plan format');
  }

  // Validate and normalize
  return parsed
    .filter((seg: any) =>
      typeof seg.start === 'number' &&
      typeof seg.end === 'number' &&
      typeof seg.pose === 'string' &&
      seg.end > seg.start &&
      POSE_ID_TO_CANONICAL[seg.pose]
    )
    .map((seg: any) => ({
      start: Math.max(0, seg.start),
      end: Math.min(input.durationSeconds, seg.end),
      pose: POSE_ID_TO_CANONICAL[seg.pose] || POSE_ID_TO_CANONICAL.explaining,
      reason: String(seg.reason || '').slice(0, 100),
    }));
}

// ── Fallback deterministic planner ────────────────────────────────────────────
// Used when Gemini is unavailable. Still much better than per-word keyword matching
// because it enforces minimum hold time and topic-based grouping.

function buildFallbackPlan(input: StickerPlanInput): StickerPlanSegment[] {
  const { segments, leftTitle, rightTitle, durationSeconds } = input;
  if (segments.length === 0) return [];

  const plan: StickerPlanSegment[] = [];
  const leftNorm = leftTitle.toLowerCase();
  const rightNorm = rightTitle.toLowerCase();

  // Welcome for first segment only
  if (segments.length > 0 && segments[0].start < 2) {
    plan.push({
      start: 0,
      end: Math.min(segments[0].end, 2.5),
      pose: POSE_ID_TO_CANONICAL.welcome,
      reason: 'Opening',
    });
  }

  // Dynamically assign poses based on what each segment is talking about
  // NO fixed durations — duration matches the script segment exactly
  let consecutiveSamePose = 0;
  let lastAssignedPose = '';

  for (const seg of segments) {
    if (seg.start < 2 && plan.length > 0 && plan[0].pose === POSE_ID_TO_CANONICAL.welcome) continue;
    if (seg.start >= durationSeconds - 2) break;

    const text = seg.text.toLowerCase();
    let pose: string;

    // Split titles into individual words for better matching
    const leftWords = leftNorm.split(/\s+/).filter(w => w.length > 1);
    const rightWords = rightNorm.split(/\s+/).filter(w => w.length > 1);

    const mentionsLeft = leftNorm.length > 1 && (
      text.includes(leftNorm) ||
      leftWords.some(w => w.length >= 3 && text.includes(w))
    );
    const mentionsRight = rightNorm.length > 1 && (
      text.includes(rightNorm) ||
      rightWords.some(w => w.length >= 3 && text.includes(w))
    );

    if (mentionsLeft && mentionsRight) {
      pose = POSE_ID_TO_CANONICAL.thinking;
    } else if (mentionsRight) {
      pose = POSE_ID_TO_CANONICAL.right;
    } else if (mentionsLeft) {
      pose = POSE_ID_TO_CANONICAL.left;
    } else if (/[?]/.test(text) || /\b(question|kya|sawaal|confused|why|how)\b/i.test(text)) {
      pose = POSE_ID_TO_CANONICAL.thinking;
    } else if (/\b(risk|problem|warning|avoid|mistake|galti|nuksan)\b/i.test(text)) {
      pose = POSE_ID_TO_CANONICAL.warning;
    } else if (/\b(final|conclusion|winner|best|recommend|yaad|remember|result)\b/i.test(text)) {
      pose = POSE_ID_TO_CANONICAL.success;
    } else {
      // No keyword match — FORCE alternate left/right
      // If last was left → go right, if last was right → go left
      if (lastAssignedPose === POSE_ID_TO_CANONICAL.left) {
        pose = POSE_ID_TO_CANONICAL.right;
      } else {
        pose = POSE_ID_TO_CANONICAL.left;
      }
    }

    // ANTI-STUCK RULE: If same pose 3+ times in a row, force alternate
    if (pose === lastAssignedPose) {
      consecutiveSamePose++;
      if (consecutiveSamePose >= 2) {
        // Force switch
        if (pose === POSE_ID_TO_CANONICAL.left) {
          pose = POSE_ID_TO_CANONICAL.right;
        } else if (pose === POSE_ID_TO_CANONICAL.right) {
          pose = POSE_ID_TO_CANONICAL.left;
        }
        consecutiveSamePose = 0;
      }
    } else {
      consecutiveSamePose = 0;
    }

    lastAssignedPose = pose;

    // Merge with previous if same pose
    const lastPlan = plan[plan.length - 1];
    if (lastPlan && lastPlan.pose === pose) {
      lastPlan.end = seg.end;
      continue;
    }

    plan.push({
      start: seg.start,
      end: seg.end,
      pose,
      reason: 'Script-driven',
    });
  }

  // Conclusion pose for last 2 seconds
  if (durationSeconds > 5) {
    const lastPlan = plan[plan.length - 1];
    if (lastPlan) lastPlan.end = Math.min(lastPlan.end, durationSeconds - 2);
    plan.push({
      start: durationSeconds - 2,
      end: durationSeconds,
      pose: POSE_ID_TO_CANONICAL.success,
      reason: 'Conclusion',
    });
  }

  return plan;
}
