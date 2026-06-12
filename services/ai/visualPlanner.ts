import type {ScriptDetails, ScriptVideoUsePlanItem} from './scriptDetails';

export type VisualPlannerFrameType =
  | 'InfoCard'
  | 'QuestionFrame'
  | 'ChecklistFrame'
  | 'TimelineFrame'
  | 'ComparisonCard'
  | 'BigNumberReveal'
  | 'MoneyGrowthGraph'
  | 'AlertCard'
  | 'QuoteCard'
  | 'CTAFrame'
  | 'DocumentList'
  | 'RequirementsList'
  | 'ApplicationFlow'
  | 'ProcessFlow'
  | 'BeforeAfter'
  | 'TipsList'
  | 'SaveCTA'
  | 'FollowCTA'
  | 'CommentCTA';

export type VisualPlanScene = {
  id: string;
  start: number;
  end: number;
  scriptText: string;
  spokenMeaning: string;
  showWhat: string;
  whyMatchesScript: string;
  visualType: 'question' | 'stat' | 'checklist' | 'timeline' | 'comparison' | 'warning' | 'quote' | 'cta' | 'concept' | 'ACCUMULATIVE_FLOWCHART' | 'STEP_BY_STEP_LIST' | 'COMPARISON_SPLIT' | 'WARNING_RISK_MAP' | 'SIMPLE_STAT_CARD';
  frameType: VisualPlannerFrameType;
  frameText: string;
  frameLabel: string;
  frameItems: string[];
  frameValue?: string;
  assetSearchText: string;
  sfx?: 'softPop' | 'softTick' | 'softChime' | 'boom' | 'whoosh' | 'stamp' | 'bell' | 'warning' | 'cash' | 'typing' | 'bassDrop';
  animation?: 'fadeUp' | 'popIn' | 'slideUp' | 'countUp' | 'warningPulse';
  emotion?: 'urgent' | 'informative' | 'serious' | 'motivational';
};

export type VisualPlan = {
  source: 'visual-planner';
  version: 1;
  durationSeconds: number;
  scenes: VisualPlanScene[];
  notes: string[];
};

type VisualPlanInput = {
  scriptDetails: ScriptDetails;
  segments: Array<{start: number; end: number; text: string}>;
  durationSeconds: number;
  topicTitle?: string;
};

type SceneSeed = {
  id: string;
  start: number;
  end: number;
  purpose?: ScriptVideoUsePlanItem['purpose'];
  detailType?: ScriptVideoUsePlanItem['detailType'];
  title?: string;
  body?: string;
  visual?: string;
  assetSearchText?: string;
  sourceText: string;
};

export function buildVisualPlan({
  durationSeconds,
  scriptDetails,
  segments,
  topicTitle,
}: VisualPlanInput): VisualPlan {
  const topic = cleanPlannerText(topicTitle || scriptDetails.topic || 'Video Explainer');
  const seeds = buildSceneSeeds(scriptDetails, segments, durationSeconds);
  const scenes = seeds.map((seed, index) => {
    const scriptText = cleanPlannerText(seed.sourceText || [seed.title, seed.body].filter(Boolean).join(' '));
    const fullText = cleanPlannerText([
      seed.title,
      seed.body,
      seed.visual,
      seed.assetSearchText,
      scriptText,
      topic,
    ].filter(Boolean).join(' '));
    const visualType = detectVisualType(fullText, seed, index, seeds.length);
    const frameType = selectFrameType(visualType, fullText, seed, index, seeds.length);
    const frameValue = extractValue(fullText);
    const frameText = buildFrameText(seed.title || scriptText || topic, frameValue);
    const frameItems = buildFrameItems({
      frameType,
      scriptText,
      seed,
      topic,
      frameText,
    });

    return {
      id: seed.id || `visual-scene-${String(index + 1).padStart(2, '0')}`,
      start: roundPlannerTime(seed.start),
      end: roundPlannerTime(Math.max(seed.start + 1.2, seed.end)),
      scriptText,
      spokenMeaning: buildSpokenMeaning(scriptText, visualType),
      showWhat: buildShowWhat(visualType, frameType, frameText, frameItems, frameValue),
      whyMatchesScript: buildWhyMatchesScript(visualType, scriptText),
      visualType,
      frameType,
      frameText,
      frameLabel: buildFrameLabel(visualType, frameType),
      frameItems,
      ...(frameValue ? {frameValue} : {}),
      assetSearchText: buildAssetSearchText(topic, visualType, frameType, scriptText, seed),
      sfx: selectSfx(visualType, index, seeds.length, fullText),
      animation: selectAnimation(visualType, frameType),
      emotion: selectEmotion(visualType, index),
    } satisfies VisualPlanScene;
  });

  return {
    source: 'visual-planner',
    version: 1,
    durationSeconds: roundPlannerTime(durationSeconds),
    scenes,
    notes: [
      `Visual Planner converted ${scenes.length} transcript windows into scene-matched frame decisions.`,
      'Planner output is deterministic and follows transcript timing instead of fixed visual delays.',
    ],
  };
}

function buildSceneSeeds(
  scriptDetails: ScriptDetails,
  segments: Array<{start: number; end: number; text: string}>,
  durationSeconds: number,
): SceneSeed[] {
  const plan = scriptDetails.videoUsePlan || [];
  if (plan.length) {
    return plan
      .filter((item) => item.end > item.start)
      .map((item, index) => ({
        id: item.id || `scene-${String(index + 1).padStart(2, '0')}`,
        start: item.start,
        end: item.end,
        purpose: item.purpose,
        detailType: item.detailType,
        title: item.renderText || item.displayText || item.title,
        body: item.renderBody || item.body,
        visual: item.visual,
        assetSearchText: item.assetSearchText,
        sourceText: item.sourceText || [item.title, item.body].filter(Boolean).join(' '),
      }));
  }

  const cleaned = segments
    .filter((segment) => segment.end > segment.start && cleanPlannerText(segment.text))
    .map((segment, index) => ({
      id: `scene-${String(index + 1).padStart(2, '0')}`,
      start: segment.start,
      end: segment.end,
      sourceText: cleanPlannerText(segment.text),
    }));
  if (cleaned.length) return cleaned;

  return [{
    id: 'scene-01',
    start: 0,
    end: Math.max(3, durationSeconds || 6),
    sourceText: cleanPlannerText(scriptDetails.sourceScript || scriptDetails.summary || scriptDetails.topic || 'Key point'),
  }];
}

function detectVisualType(
  text: string,
  seed: SceneSeed,
  index: number,
  total: number,
): VisualPlanScene['visualType'] {
  const value = text.toLowerCase();

  const hasMoneyOrNumbers =
    /[₹$]|\b\d[\d,]*(?:\.\d+)?\s?(?:%|percent|crore|lakh|k|m|million|billion|rs|rupees)?\b/.test(value);

  const hasFinanceFlow =
    /\b(loan|emi|interest|investment|invest|sip|fd|mutual fund|return|profit|salary|income|revenue|roi|score|rank|down payment|payment|amount|price|cost)\b/.test(value);

  const hasBranchLogic =
    /\b(split|branch|remaining|left|right|option|path|if|then|else|because|cause|effect|result|total|minus|plus|compare|vs|versus)\b/.test(value);

  const hasProcess =
    /\b(step|process|timeline|roadmap|flow|apply|register|login|submit|upload|verify|first|second|third|then|next|after that|finally)\b/.test(value);

  const hasComparison =
    /\b(vs|versus|compare|comparison|difference|before|after|pros|cons|myth|fact|better|which one)\b/.test(value);

  const hasWarning =
    /\b(warning|alert|risk|avoid|mistake|galti|danger|reject|rejection|problem|deadline|last date|careful|fraud|scam|loss|fake)\b/.test(value);

  const hasChecklist =
    seed.detailType === 'documentList' ||
    /\b(document|documents|papers|certificate|id proof|requirements|eligibility|checklist|points|tips|reasons|need|required)\b/.test(value);

  if (
    index === total - 1 ||
    seed.purpose === 'cta' ||
    /\b(follow|save|comment|share|subscribe|download|try now|start now|call to action)\b/.test(value)
  ) {
    return 'cta';
  }

  if (seed.purpose === 'warning' || hasWarning) {
    return 'WARNING_RISK_MAP';
  }

  if (hasComparison) {
    return 'COMPARISON_SPLIT';
  }

  if ((hasMoneyOrNumbers && hasFinanceFlow && hasBranchLogic) || (hasMoneyOrNumbers && hasProcess && hasFinanceFlow)) {
    return 'ACCUMULATIVE_FLOWCHART';
  }

  if (hasProcess) {
    return 'STEP_BY_STEP_LIST';
  }

  if (hasChecklist) {
    return 'checklist';
  }

  if (seed.purpose === 'proof' || hasMoneyOrNumbers || hasFinanceFlow) {
    return 'SIMPLE_STAT_CARD';
  }

  if (seed.purpose === 'hook' || index === 0 || /\?|\b(why|how|what|kaise|kya)\b/.test(value)) {
    return 'question';
  }

  if (/["“”]/.test(text)) return 'quote';

  return 'concept';
}

function selectFrameType(
  visualType: VisualPlanScene['visualType'],
  text: string,
  seed: SceneSeed,
  index: number,
  total: number,
): VisualPlannerFrameType {
  const value = text.toLowerCase();

  if (visualType === 'ACCUMULATIVE_FLOWCHART') return 'ProcessFlow';
  if (visualType === 'STEP_BY_STEP_LIST') return /\b(apply|application|form|submit|upload|register)\b/.test(value) ? 'ApplicationFlow' : 'ProcessFlow';
  if (visualType === 'COMPARISON_SPLIT') return /\bbefore|after\b/.test(value) ? 'BeforeAfter' : 'ComparisonCard';
  if (visualType === 'WARNING_RISK_MAP') return 'AlertCard';
  if (visualType === 'SIMPLE_STAT_CARD') return /\b(growth|profit|revenue|income|roi|stock|market|investment|return)\b/.test(value) ? 'MoneyGrowthGraph' : 'BigNumberReveal';

  if (visualType === 'cta') {
    if (/\bfollow\b/.test(value)) return 'FollowCTA';
    if (/\bcomment|reply\b/.test(value)) return 'CommentCTA';
    if (/\bsave|bookmark\b/.test(value)) return 'SaveCTA';
    return 'CTAFrame';
  }

  if (visualType === 'warning') return 'AlertCard';
  if (visualType === 'comparison') return /\bbefore|after\b/.test(value) ? 'BeforeAfter' : 'ComparisonCard';
  if (visualType === 'timeline') return /\b(apply|application|form|submit|upload|register)\b/.test(value) ? 'ApplicationFlow' : 'ProcessFlow';

  if (visualType === 'checklist') {
    if (seed.detailType === 'documentList' || /\bdocument|papers|certificate|id proof\b/.test(value)) return 'DocumentList';
    if (/\brequirements|eligibility|required\b/.test(value)) return 'RequirementsList';
    if (/\btips|hacks|ways\b/.test(value)) return 'TipsList';
    return 'ChecklistFrame';
  }

  if (visualType === 'stat') return /\b(growth|profit|revenue|income|roi|stock|market|investment)\b/.test(value) ? 'MoneyGrowthGraph' : 'BigNumberReveal';
  if (visualType === 'quote') return 'QuoteCard';
  if (visualType === 'question') return 'QuestionFrame';
  if (index === total - 1) return 'CTAFrame';

  return 'InfoCard';
}

function buildFrameItems({
  frameText,
  frameType,
  scriptText,
  seed,
  topic,
}: {
  frameText: string;
  frameType: VisualPlannerFrameType;
  scriptText: string;
  seed: SceneSeed;
  topic: string;
}) {
  const source = cleanPlannerText([seed.body, seed.title, scriptText].filter(Boolean).join(' '));
  const raw = splitPlannerItems(source);
  const limit = frameType === 'ComparisonCard' || frameType === 'BeforeAfter' ? 2 : frameType === 'TimelineFrame' || frameType === 'ProcessFlow' || frameType === 'ApplicationFlow' ? 4 : 5;
  const items = raw.slice(0, limit);
  if ((frameType === 'ComparisonCard' || frameType === 'BeforeAfter') && items.length < 2) return ['Before', 'After'];
  if (frameType === 'ProcessFlow' || frameType === 'TimelineFrame' || frameType === 'ApplicationFlow') {
    if (items.length >= 3) return items;
    return uniquePlannerItems(['Start', frameText, 'Result']).slice(0, 4);
  }
  if (isListFrame(frameType) && items.length < 3) {
    return uniquePlannerItems([frameText, topic, 'Next action']).slice(0, 5);
  }
  return items.length ? items : [frameText];
}

function splitPlannerItems(value: string) {
  const cleaned = cleanPlannerText(value)
    .replace(/\b(create|vertical|portrait|image|scene|show|with|modern|indian|premium|explainer|bottom|layer)\b/gi, ' ');
  const parts = cleaned
    .split(/(?:\n|,|;|->|=>|\||\bthen\b|\bnext\b|\bvs\b|\bversus\b|(?<=[.!?])\s+)/i)
    .map((item) => item.replace(/^\d+[\).\s-]*/, '').trim())
    .filter((item) => item.split(/\s+/).length <= 7)
    .filter((item) => item.length > 2);
  return uniquePlannerItems(parts).slice(0, 6);
}

function buildFrameText(value: string, frameValue: string) {
  if (frameValue) return frameValue;
  const words = cleanPlannerText(value)
    .replace(/[^a-zA-Z0-9₹$% ]+/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 || /^[₹$%]?\d/.test(word))
    .filter((word) => !STOP_WORDS.has(word.toLowerCase()));
  const preferred = words.filter((word) => word.length > 5 || /[A-Z0-9₹$%]/.test(word[0] || ''));
  return ((preferred.length ? preferred : words).slice(0, 2).join(' ') || 'KEY POINT').toUpperCase();
}

function buildFrameLabel(visualType: VisualPlanScene['visualType'], frameType: VisualPlannerFrameType) {
  if (frameType === 'DocumentList') return 'DOCUMENTS';
  if (frameType === 'RequirementsList') return 'REQUIRED';
  if (visualType === 'question') return 'QUESTION';
  if (visualType === 'stat') return 'KEY NUMBER';
  if (visualType === 'timeline') return 'ROADMAP';
  if (visualType === 'comparison') return 'comparisonImages';
  if (visualType === 'warning') return 'ALERT';
  if (visualType === 'cta') return 'NEXT STEP';
  return 'EXPLAINER';
}

function buildSpokenMeaning(scriptText: string, visualType: VisualPlanScene['visualType']) {
  const prefix = visualType === 'stat'
    ? 'This line is explaining a measurable number'
    : visualType === 'timeline'
      ? 'This line is explaining a sequence'
      : visualType === 'checklist'
        ? 'This line is listing what matters'
        : visualType === 'warning'
          ? 'This line warns the viewer'
          : 'This line introduces the key idea';
  return `${prefix}: ${trimPlannerWords(scriptText, 14)}`;
}

function buildShowWhat(
  visualType: VisualPlanScene['visualType'],
  frameType: VisualPlannerFrameType,
  frameText: string,
  items: string[],
  value?: string,
) {
  if (value) return `Show ${value} as the hero number with ${frameText} context.`;
  if (visualType === 'timeline') return `Show a ${items.length}-step frame: ${items.join(' -> ')}.`;
  if (visualType === 'checklist') return `Show a checklist frame with ${items.join(', ')}.`;
  if (visualType === 'comparison') return `Show a comparison frame for ${items.slice(0, 2).join(' vs ')}.`;
  return `Show a ${frameType} focused on ${frameText}.`;
}

function buildWhyMatchesScript(visualType: VisualPlanScene['visualType'], scriptText: string) {
  return `${visualType} frame matches this script window because the spoken line says: ${trimPlannerWords(scriptText, 12)}.`;
}

function buildAssetSearchText(
  topic: string,
  visualType: VisualPlanScene['visualType'],
  frameType: VisualPlannerFrameType,
  scriptText: string,
  seed: SceneSeed,
) {
  return cleanPlannerText([
    topic,
    `${visualType} ${frameType}`,
    seed.assetSearchText,
    seed.visual,
    trimPlannerWords(scriptText, 18),
    'clear explanatory frame, no decorative background animation',
  ].filter(Boolean).join(', ')).slice(0, 260);
}

function selectSfx(
  visualType: VisualPlanScene['visualType'],
  index: number,
  total: number,
  text: string,
): NonNullable<VisualPlanScene['sfx']> {
  if (index === 0) return 'boom';
  if (index === total - 1 || visualType === 'cta') return 'bell';
  if (visualType === 'warning') return 'warning';
  if (visualType === 'stat' && /[₹$]|\b(cash|money|salary|profit|revenue)\b/i.test(text)) return 'cash';
  if (visualType === 'timeline' || visualType === 'checklist') return 'softTick';
  return 'whoosh';
}

function selectAnimation(
  visualType: VisualPlanScene['visualType'],
  frameType: VisualPlannerFrameType,
): NonNullable<VisualPlanScene['animation']> {
  if (visualType === 'stat' || frameType === 'BigNumberReveal') return 'countUp';
  if (visualType === 'warning') return 'warningPulse';
  if (visualType === 'question') return 'popIn';
  return 'fadeUp';
}

function selectEmotion(visualType: VisualPlanScene['visualType'], index: number): NonNullable<VisualPlanScene['emotion']> {
  if (visualType === 'warning' || index === 0) return 'urgent';
  if (visualType === 'cta') return 'motivational';
  if (visualType === 'stat' || visualType === 'comparison') return 'serious';
  return 'informative';
}

function extractValue(value: string) {
  const match = value.match(/(?:₹|rs\.?|inr|\$)?\s?\d[\d,]*(?:\.\d+)?\s?(?:%|percent|crore|lakh|k|m|million|billion)?/i);
  return match?.[0]?.replace(/\s+/g, ' ').trim().toUpperCase() || '';
}

function isListFrame(frameType: VisualPlannerFrameType) {
  return ['ChecklistFrame', 'DocumentList', 'RequirementsList', 'TipsList'].includes(frameType);
}

function uniquePlannerItems(items: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const item of items.map((value) => trimPlannerWords(value, 5)).filter(Boolean)) {
    const key = item.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

function trimPlannerWords(value: string, maxWords: number) {
  return cleanPlannerText(value).split(/\s+/).filter(Boolean).slice(0, maxWords).join(' ');
}

function cleanPlannerText(value: unknown) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

function roundPlannerTime(value: number) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'this',
  'that',
  'from',
  'into',
  'your',
  'video',
  'reel',
  'scene',
  'visual',
  'image',
  'show',
  'shows',
  'should',
  'must',
  'bottom',
  'layer',
  'indian',
  'modern',
  'clean',
  'context',
  'topic',
  'about',
  'people',
  'person',
]);




