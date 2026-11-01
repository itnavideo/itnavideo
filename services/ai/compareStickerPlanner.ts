/**
 * Compare Explainer AI Pose & Direction Planner
 *
 * Dynamically plans character presenter poses based on the actual spoken script / narration.
 * No arbitrary 1-2 second fixed slices. Poses follow the speaker's sentence flow:
 * - Option A / Left Subject discussion -> pointing left
 * - Option B / Right Subject discussion -> pointing right
 * - Side-by-side trade-off / contrast -> comparing both
 * - Doubts, questions, prices, analysis -> thinking
 * - Drawbacks, traps, heating, warnings -> warning
 * - Verdict, winner declaration, outro -> success celebration
 */

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
  apiKey?: string;
};

export type StickerPlanResult = {
  plan: StickerPlanSegment[];
  source: 'gemini' | 'script-semantic';
};

export const POSES = {
  welcome: 'sticker_welcome_intro_explainer',
  left: 'sticker_pointing_left_side_explainer',
  right: 'sticker_pointing_right_side_explainer',
  comparing: 'sticker_comparing_both_sides_explainer',
  thinking: 'sticker_thinking_analysis_explainer',
  explaining: 'sticker_general_explaining_key_point',
  warning: 'sticker_warning_issue_explainer',
  surprised: 'sticker_questioning_surprised_explainer',
  success: 'sticker_success_conclusion_explainer',
} as const;

function clean(val: string): string {
  return val.toLowerCase().replace(/[^\p{L}\p{N}\s?]/gu, ' ').replace(/\s+/g, ' ').trim();
}

function matchesTopic(text: string, title: string): boolean {
  const normText = clean(text);
  const normTitle = clean(title);
  if (!normTitle) return false;
  if (normText.includes(normTitle)) return true;
  const words = normTitle.split(' ').filter((w) => w.length >= 3);
  return words.some((w) => normText.includes(w));
}

function classifySentencePose(
  text: string,
  leftTitle: string,
  rightTitle: string,
  index: number,
  total: number,
  previousPose?: string
): { pose: string; reason: string } {
  const norm = clean(text);
  const mentionsLeft = matchesTopic(norm, leftTitle);
  const mentionsRight = matchesTopic(norm, rightTitle);

  // 1. First sentence is typically introduction / welcome hook
  if (index === 0 && (norm.includes('welcome') || norm.includes('hello') || norm.includes('aaj') || norm.includes('today') || norm.includes('compare'))) {
    return { pose: POSES.welcome, reason: 'Introductory script hook' };
  }

  // 2. Winner / Conclusion in script
  if (/\b(winner|verdict|recommend|faisla|best option|clear winner|khareed lo|buy this|chuna|final choice|conclusion)\b/i.test(norm)) {
    return { pose: POSES.success, reason: 'Announcing verdict or winner in script' };
  }

  // 3. Drawback / Warning / Risk / Trap in script
  if (/\b(risk|problem|mistake|warning|issue|loss|avoid|danger|galti|nuksan|drawback|cons|kharab|heating|bekaar|mat lena|dhyan rakhna|dhyan rahe|drain|slow|lag|worst)\b/i.test(norm)) {
    return { pose: POSES.warning, reason: 'Highlighting drawback or warning in script' };
  }

  // 4. Mentions both subjects in a single sentence -> Comparing both
  if (mentionsLeft && mentionsRight) {
    return { pose: POSES.comparing, reason: 'Direct comparison between both subjects' };
  }

  // 5. Explicitly speaking about Option A (Left)
  if (mentionsLeft) {
    return { pose: POSES.left, reason: `Explaining ${leftTitle}` };
  }

  // 6. Explicitly speaking about Option B (Right)
  if (mentionsRight) {
    return { pose: POSES.right, reason: `Explaining ${rightTitle}` };
  }

  // 7. General comparison / contrast keywords
  if (/\b(vs|versus|compare|comparison|difference|farq|dono me|tradeoff|dusri taraf|on the other hand|while)\b/i.test(norm)) {
    return { pose: POSES.comparing, reason: 'Comparative narration' };
  }

  // 8. Question / Curiosity / Doubt
  if (/\?|\b(question|confus|doubt|which one|kaunsa|konsa|kya farq|why|how|kaise)\b/i.test(norm)) {
    return { pose: POSES.surprised, reason: 'Posing comparison question' };
  }

  // 9. Analysis / Calculation / Thinking
  if (/\b(price|pricing|cost|worth|think|analyse|specs|camera|battery|display|processor|performance|return|interest|roi)\b/i.test(norm)) {
    return { pose: POSES.thinking, reason: 'Feature or financial analysis' };
  }

  // 10. Continuity: maintain previous pose if topic is ongoing, else neutral explanation
  return { pose: previousPose || POSES.explaining, reason: 'Continuing script flow' };
}

/**
 * AI Script Director using Gemini Flash
 */
async function planWithGemini(input: StickerPlanInput): Promise<StickerPlanSegment[] | null> {
  const apiKey = input.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `You are a professional video director for a 9:16 vertical comparison reel.
We have two subjects:
- Left Option (Card A): "${input.leftTitle}"
- Right Option (Card B): "${input.rightTitle}"

Here are the spoken script segments with exact audio timestamps:
${JSON.stringify(input.segments.map((s, idx) => ({ index: idx, start: s.start, end: s.end, text: s.text })))}

Analyze what the speaker is saying in each sentence. Assign the most fitting presenter pose based ONLY on script content:
- "sticker_welcome_intro_explainer": Opening hook or topic introduction
- "sticker_pointing_left_side_explainer": Speaker is talking about Option A / Left ("${input.leftTitle}")
- "sticker_pointing_right_side_explainer": Speaker is talking about Option B / Right ("${input.rightTitle}")
- "sticker_comparing_both_sides_explainer": Speaker is directly contrasting or comparing both
- "sticker_thinking_analysis_explainer": Speaker is analyzing specs, prices, or asking rhetorical questions
- "sticker_warning_issue_explainer": Speaker highlights a flaw, drawback, heating issue, caution, or negative
- "sticker_success_conclusion_explainer": Speaker announces the winner, final recommendation, or verdict

Return ONLY valid JSON matching this schema:
[
  { "start": number, "end": number, "pose": string, "reason": string }
]
Do not add markdown formatting or extra text.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    return parsed
      .map((item) => ({
        start: Number(item.start) || 0,
        end: Number(item.end) || 0,
        pose: String(item.pose || POSES.thinking),
        reason: String(item.reason || 'AI Script Direction'),
      }))
      .filter((s) => s.end > s.start && s.start < input.durationSeconds);
  } catch (err) {
    console.warn('[COMPARE_STICKER_PLANNER] Gemini script planning fallback:', err);
    return null;
  }
}

/**
 * Main Planner:
 * Uses Gemini AI script director first, falls back to deep script-semantic sentence grouping.
 * Never uses fixed 1-2 sec time intervals!
 */
export async function planCompareStickers(input: StickerPlanInput): Promise<StickerPlanResult> {
  const duration = Math.max(1, input.durationSeconds);
  const source = input.segments.filter(
    (s) => Number.isFinite(s.start) && Number.isFinite(s.end) && s.end > s.start && s.text?.trim()
  );

  if (source.length === 0) {
    return {
      plan: [{ start: 0, end: duration, pose: POSES.welcome, reason: 'Empty narration' }],
      source: 'script-semantic',
    };
  }

  // 1. Try Gemini script director
  const geminiPlan = await planWithGemini(input);
  if (geminiPlan && geminiPlan.length > 0) {
    return { plan: geminiPlan, source: 'gemini' };
  }

  // 2. Deterministic Semantic Script Parser (Sentence & Idea Flow)
  const plan: StickerPlanSegment[] = [];
  let previousPose: string | undefined = undefined;

  for (let i = 0; i < source.length; i++) {
    const seg = source[i];
    const { pose, reason } = classifySentencePose(
      seg.text,
      input.leftTitle,
      input.rightTitle,
      i,
      source.length,
      previousPose
    );

    // Merge consecutive segments with the same pose for a natural visual hold
    const last = plan.at(-1);
    if (last && last.pose === pose && seg.start <= last.end + 0.3) {
      last.end = Math.max(last.end, seg.end);
    } else {
      plan.push({
        start: Math.max(0, seg.start),
        end: Math.min(duration, seg.end),
        pose,
        reason,
      });
    }
    previousPose = pose;
  }

  // Ensure start covers 0
  if (plan.length > 0 && plan[0].start > 0 && plan[0].start < 0.5) {
    plan[0].start = 0;
  }

  return {
    plan: plan.filter((s) => s.end > s.start),
    source: 'script-semantic',
  };
}

export type CompareScene = {
  sceneNumber: number;
  id: string;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  stage: 'hook_intro' | 'left_focus' | 'right_focus' | 'versus_battle' | 'analysis' | 'warning' | 'verdict';
  heading: string;
  narrationSnippet: string;
  activeFocus: 'left' | 'right' | 'both';
  stickerPose: string;
  highlightSide?: 'left' | 'right';
  reason?: string;
};

export function buildCompareScenes(params: {
  stickerPlan: StickerPlanSegment[];
  leftTitle: string;
  rightTitle: string;
  durationSeconds: number;
  captions?: Array<{ start: number; end: number; text: string }>;
  winner?: 'left' | 'right' | 'none' | string;
}): CompareScene[] {
  const { stickerPlan, leftTitle, rightTitle, durationSeconds, captions = [], winner = 'none' } = params;
  const totalDuration = Math.max(1, durationSeconds);

  if (!stickerPlan || stickerPlan.length === 0) {
    return [
      {
        sceneNumber: 1,
        id: 'compare-scene-1',
        startSeconds: 0,
        endSeconds: totalDuration,
        durationSeconds: totalDuration,
        stage: 'versus_battle',
        heading: `${leftTitle} vs ${rightTitle}`,
        narrationSnippet: captions[0]?.text || 'Head-to-head showdown',
        activeFocus: 'both',
        stickerPose: POSES.comparing,
        reason: 'Single comparison scene fallback',
      },
    ];
  }

  return stickerPlan.map((segment, idx) => {
    const sceneNumber = idx + 1;
    const dur = Math.max(0.1, Number((segment.end - segment.start).toFixed(2)));
    
    // Find matching captions within this segment window
    const relevantCaptions = captions.filter(
      (c) => c.start >= segment.start - 0.2 && c.end <= segment.end + 0.3
    );
    const narrationSnippet = relevantCaptions.map((c) => c.text).join(' ') || segment.reason || '';

    let stage: CompareScene['stage'] = 'versus_battle';
    let activeFocus: CompareScene['activeFocus'] = 'both';
    let heading = `${leftTitle} vs ${rightTitle}`;
    let highlightSide: 'left' | 'right' | undefined = undefined;

    if (segment.pose === POSES.welcome || idx === 0) {
      stage = 'hook_intro';
      activeFocus = 'both';
      heading = `${leftTitle} vs ${rightTitle}`;
    } else if (segment.pose === POSES.left) {
      stage = 'left_focus';
      activeFocus = 'left';
      heading = leftTitle;
      highlightSide = 'left';
    } else if (segment.pose === POSES.right) {
      stage = 'right_focus';
      activeFocus = 'right';
      heading = rightTitle;
      highlightSide = 'right';
    } else if (segment.pose === POSES.warning) {
      stage = 'warning';
      activeFocus = 'both';
      heading = 'Key Watchouts';
    } else if (segment.pose === POSES.thinking) {
      stage = 'analysis';
      activeFocus = 'both';
      heading = 'Deep Comparison';
    } else if (segment.pose === POSES.success || idx === stickerPlan.length - 1) {
      stage = 'verdict';
      activeFocus = winner === 'left' ? 'left' : winner === 'right' ? 'right' : 'both';
      heading = winner === 'left' ? `${leftTitle} Wins!` : winner === 'right' ? `${rightTitle} Wins!` : 'Final Verdict';
      highlightSide = winner === 'left' ? 'left' : winner === 'right' ? 'right' : undefined;
    }

    return {
      sceneNumber,
      id: `compare-scene-${sceneNumber}`,
      startSeconds: Number(segment.start.toFixed(2)),
      endSeconds: Number(segment.end.toFixed(2)),
      durationSeconds: dur,
      stage,
      heading,
      narrationSnippet,
      activeFocus,
      stickerPose: segment.pose,
      highlightSide,
      reason: segment.reason,
    };
  });
}

