export const VIDEO_EXPLAINER_V2_LAYOUTS = [
  'character_hero',
  'big_statistic',
  'checklist',
  'step_process',
  'timeline',
  'comparison',
  'before_after',
  'progress_bar',
  'quote_card',
  'document_card',
  'phone_mockup',
  'dashboard_card',
  'graph_layout',
  'alert_layout',
  'question_hook',
  'feature_grid',
  'money_showcase',
  'roadmap',
  'ranking',
  'cta_layout',
] as const;

export type VideoExplainerV2LayoutType = typeof VIDEO_EXPLAINER_V2_LAYOUTS[number];

export const VIDEO_EXPLAINER_V2_LAYOUT_SET = new Set<string>(VIDEO_EXPLAINER_V2_LAYOUTS);

export function pickVideoExplainerV2Layout({
  text,
  body,
  sceneType,
  overlayType,
}: {
  text?: string;
  body?: string;
  sceneType?: string;
  overlayType?: string;
}): VideoExplainerV2LayoutType {
  const source = [sceneType, overlayType, text, body].filter(Boolean).join(' ').toLowerCase();

  if (overlayType === 'hook' || /\b(question|why|kya|kaise|hook|secret)\b/.test(source)) return 'question_hook';
  if (overlayType === 'cta' || /\b(follow|save|share|comment|subscribe)\b/.test(source)) return 'cta_layout';
  if (overlayType === 'warning' || /\b(warning|alert|danger|risk|mistake|avoid|panic|fail)\b/.test(source)) return 'alert_layout';
  if (/\b(salary|income|money|earning|earn|rupee|rs\.?|₹|price|cost|fee|amount)\b/.test(source)) return 'money_showcase';
  if (overlayType === 'stat' || /\b(percent|percentage|growth|rate|selection|ratio|score|marks|rank|number|lakh|crore|%|\d)\b/.test(source)) return 'big_statistic';
  if (/\b(step|process|how to|kaise|apply|fill|submit|download)\b/.test(source)) return 'step_process';
  if (/\b(timeline|journey|prelims|mains|interview|round|stage|phase)\b/.test(source)) return 'timeline';
  if (/\b(vs|versus|compare|comparison|government|private|before|after)\b/.test(source)) return 'comparison';
  if (/\b(before|after|transform|change|improve)\b/.test(source)) return 'before_after';
  if (/\b(progress|preparation|complete|daily|target|practice)\b/.test(source)) return 'progress_bar';
  if (/\b(document|notification|admit card|hall ticket|certificate|form|pdf)\b/.test(source)) return 'document_card';
  if (/\b(app|website|portal|phone|mobile|login)\b/.test(source)) return 'phone_mockup';
  if (/\b(graph|chart|analytics|trend)\b/.test(source)) return 'graph_layout';
  if (/\b(benefit|feature|advantage|requirement|eligibility|checklist)\b/.test(source)) return 'checklist';
  if (/\b(top\s?\d|ranking|rank|#1|#2|#3)\b/.test(source)) return 'ranking';
  if (/\b(student|doctor|employee|founder|creator|person|candidate)\b/.test(source)) return 'character_hero';
  return 'character_hero';
}

export function normalizeVideoExplainerV2Layout(value: unknown, fallback: Parameters<typeof pickVideoExplainerV2Layout>[0]) {
  if (typeof value === 'string' && VIDEO_EXPLAINER_V2_LAYOUT_SET.has(value)) {
    return value as VideoExplainerV2LayoutType;
  }
  return pickVideoExplainerV2Layout(fallback);
}
