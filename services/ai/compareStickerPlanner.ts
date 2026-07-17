export type StickerPlanSegment = {start: number; end: number; pose: string; reason: string};

export type StickerPlanInput = {
  transcript: string;
  segments: Array<{start: number; end: number; text: string}>;
  leftTitle: string;
  rightTitle: string;
  durationSeconds: number;
};

export type StickerPlanResult = {plan: StickerPlanSegment[]; source: 'fallback'};

const POSES = {
  welcome: 'sticker_welcome_intro_explainer', left: 'sticker_pointing_left_side_explainer', right: 'sticker_pointing_right_side_explainer',
  comparing: 'sticker_comparing_both_sides_explainer', thinking: 'sticker_thinking_analysis_explainer', explaining: 'sticker_general_explaining_key_point',
  warning: 'sticker_warning_issue_explainer', surprised: 'sticker_questioning_surprised_explainer', success: 'sticker_success_conclusion_explainer',
} as const;

const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}\s?]/gu, ' ').replace(/\s+/g, ' ').trim();
const mentions = (text: string, title: string) => {
  const words = normalize(title).split(' ').filter((word) => word.length >= 3);
  const target = normalize(text);
  return Boolean(words.length && (target.includes(normalize(title)) || words.some((word) => target.includes(word))));
};

const poseFor = (text: string, leftTitle: string, rightTitle: string, previous?: string) => {
  const value = normalize(text);
  const left = mentions(value, leftTitle);
  const right = mentions(value, rightTitle);
  if (left && right) return POSES.comparing;
  if (/\?|\b(question|confus|doubt|kaunsa|konsa|kya farq|kya difference|why|how)\b/i.test(value)) return POSES.surprised;
  if (/\b(risk|problem|mistake|warning|issue|loss|avoid|danger|galti|nuksan)\b/i.test(value)) return POSES.warning;
  if (/\b(final|conclusion|winner|best|recommend|yaad rakho|remember|result)\b/i.test(value)) return POSES.success;
  if (left) return POSES.left;
  if (right) return POSES.right;
  if (/\b(vs|versus|compare|comparison|difference|both|dono|between|tradeoff)\b/i.test(value)) return POSES.comparing;
  if (/\b(feature|benefit|advantage|reason|because|rule|important|matlab|means)\b/i.test(value)) return POSES.explaining;
  return previous || POSES.thinking;
};

export async function planCompareStickers(input: StickerPlanInput): Promise<StickerPlanResult> {
  const duration = Math.max(1, input.durationSeconds);
  const source = input.segments.filter((segment) => Number.isFinite(segment.start) && Number.isFinite(segment.end) && segment.end > segment.start);
  const plan: StickerPlanSegment[] = [];
  const add = (start: number, end: number, pose: string, reason: string) => {
    const previous = plan.at(-1);
    if (previous && previous.pose === pose && start <= previous.end + 0.2) { previous.end = Math.max(previous.end, end); return; }
    plan.push({start: Math.max(0, start), end: Math.min(duration, end), pose, reason});
  };
  if (source[0]?.start < 2) add(0, Math.min(2.2, source[0].end), POSES.welcome, 'Opening');
  for (const segment of source) add(segment.start, segment.end, poseFor(segment.text, input.leftTitle, input.rightTitle, plan.at(-1)?.pose), 'Narration intent');
  return {plan: plan.filter((segment) => segment.end > segment.start), source: 'fallback'};
}
