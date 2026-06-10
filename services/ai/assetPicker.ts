import {readFileSync} from 'node:fs';
import path from 'node:path';
import type {ScriptDetails} from './scriptDetails';

type IndexedAsset = {
  id: string;
  src: string;
  type: 'image' | 'video' | 'audio' | 'font';
  kind?: string;
  scope?: string;
  category: string;
  title: string;
  tags: string[];
  keywords?: string[];
  detailedDescription?: string;
  visualDifference?: string;
  style?: string | null;
  useCase?: string | null;
  use_case?: string | null;
  embeddingRef?: string | null;
  useFor: string[];
  avoidFor: string[];
  qualityScore: number;
  needsLabel: boolean;
  safeToUse: boolean;
};

export type AssetTimelineItem = {
  id: string;
  overlayId?: string;
  start: number;
  end: number;
  src: string;
  title: string;
  kind: 'image' | 'icon' | 'background' | 'frame';
  category: string;
  tags: string[];
  role: 'background' | 'supporting' | 'primary';
  motion: 'slowZoom' | 'panLeft' | 'float' | 'pop' | 'parallax';
  frameText?: string;
  frameReason?: 'scene-frame' | 'missing-image' | 'low-confidence-image' | 'image-limit';
  frameType?: RemotionFrameType;
  frameValue?: string;
  frameLabel?: string;
  frameItems?: string[];
};

type AssetIndex = {
  assets?: IndexedAsset[];
};

type AssetEmbeddingIndex = {
  model?: string;
  items?: Record<string, {
    assetFile?: string;
    text?: string;
    embedding?: number[];
  }>;
};

type AssetIntent = 'finance' | 'government_exam' | 'tech_ai' | 'self_improvement' | 'news_document' | 'career_business' | 'education' | 'general';
type RemotionFrameType =
  | 'BigNumberReveal'
  | 'QuestionFrame'
  | 'AlertCard'
  | 'StatisticCounter'
  | 'MoneyGrowthGraph'
  | 'ComparisonCard'
  | 'TimelineFrame'
  | 'ChecklistFrame'
  | 'QuoteCard'
  | 'InfoCard'
  | 'CTAFrame'
  | 'BreakingNewsBanner'
  | 'RedAlertCard'
  | 'MythFact'
  | 'MoneyCounter'
  | 'SalaryCounter'
  | 'ProfitMeter'
  | 'ROIChart'
  | 'StockCandleChart'
  | 'SavingsMeter'
  | 'RevenueCounter'
  | 'RevenueGraph'
  | 'BudgetBreakdown'
  | 'PriceReveal'
  | 'PercentageMeter'
  | 'ScoreReveal'
  | 'RankReveal'
  | 'Countdown'
  | 'DeadlineTimer'
  | 'ProgressCircle'
  | 'ProgressBar'
  | 'TrendLine'
  | 'RoadmapFrame'
  | 'ProcessFlow'
  | 'StepLadder'
  | 'ApplicationFlow'
  | 'ExamRoadmap'
  | 'CareerPath'
  | 'MilestonePath'
  | 'WorkflowChain'
  | 'DecisionTree'
  | 'RankingList'
  | 'TopBenefits'
  | 'RequirementsList'
  | 'DocumentList'
  | 'MistakeList'
  | 'TipsList'
  | 'ActionList'
  | 'FeatureList'
  | 'DoDontList'
  | 'BeforeAfter'
  | 'ProsCons'
  | 'ChoiceSplit'
  | 'PlanComparison'
  | 'SalaryComparison'
  | 'FeatureComparison'
  | 'FunnelFrame'
  | 'LeadMagnet'
  | 'ConversionFlow'
  | 'SubscribeCTA'
  | 'SaveCTA'
  | 'CommentCTA'
  | 'FollowCTA';

const REMOTION_FRAME_TYPES: RemotionFrameType[] = [
  'BigNumberReveal',
  'QuestionFrame',
  'AlertCard',
  'StatisticCounter',
  'MoneyGrowthGraph',
  'ComparisonCard',
  'TimelineFrame',
  'ChecklistFrame',
  'QuoteCard',
  'InfoCard',
  'CTAFrame',
  'BreakingNewsBanner',
  'RedAlertCard',
  'MythFact',
  'MoneyCounter',
  'SalaryCounter',
  'ProfitMeter',
  'ROIChart',
  'StockCandleChart',
  'SavingsMeter',
  'RevenueCounter',
  'RevenueGraph',
  'BudgetBreakdown',
  'PriceReveal',
  'PercentageMeter',
  'ScoreReveal',
  'RankReveal',
  'Countdown',
  'DeadlineTimer',
  'ProgressCircle',
  'ProgressBar',
  'TrendLine',
  'RoadmapFrame',
  'ProcessFlow',
  'StepLadder',
  'ApplicationFlow',
  'ExamRoadmap',
  'CareerPath',
  'MilestonePath',
  'WorkflowChain',
  'DecisionTree',
  'RankingList',
  'TopBenefits',
  'RequirementsList',
  'DocumentList',
  'MistakeList',
  'TipsList',
  'ActionList',
  'FeatureList',
  'DoDontList',
  'BeforeAfter',
  'ProsCons',
  'ChoiceSplit',
  'PlanComparison',
  'SalaryComparison',
  'FeatureComparison',
  'FunnelFrame',
  'LeadMagnet',
  'ConversionFlow',
  'SubscribeCTA',
  'SaveCTA',
  'CommentCTA',
  'FollowCTA',
];

let cachedAssets: IndexedAsset[] | null = null;
let cachedEmbeddings: AssetEmbeddingIndex | null = null;

export function matchAssetsForScript(scriptDetails: ScriptDetails, limit = 8) {
  const assets = readUnifiedAssets().filter((asset) => asset.safeToUse && !asset.needsLabel && isVisualPickAsset(asset));
  if (!assets.length) return [];

  const queryTokens = tokenize([
    scriptDetails.topic,
    scriptDetails.summary,
    ...(scriptDetails.keyPoints || []),
    ...(scriptDetails.assetBriefs || []).map((brief) => `${brief.title} ${brief.searchText}`),
    ...(scriptDetails.imageSelectionPlan || []).map((item) => [
      item.imageNeed,
      item.bestMatchDescription,
      ...(item.requiredTags || []),
    ].join(' ')),
    ...(scriptDetails.detailBlocks || []).flatMap((block) => [block.title, ...block.items]),
  ].join(' '));

  return assets
    .map((asset) => ({asset, score: scoreAsset(asset, queryTokens)}))
    .filter((item) => item.score >= MIN_RELEVANCE_SCORE)
    .sort((a, b) => b.score - a.score || b.asset.qualityScore - a.asset.qualityScore)
    .slice(0, limit)
    .map(({asset}) => `asset: ${asset.title} (${asset.kind || asset.type}, ${asset.category}) -> ${asset.src}`);
}

export async function buildAssetTimelineForOverlays(
  scriptDetails: ScriptDetails,
  overlays: Array<{
    id?: string;
    start: number;
    end: number;
    type?: string;
    text?: string;
    body?: string;
    visual?: string;
    assetBrief?: string;
    frameType?: string;
    frameText?: string;
    frameLabel?: string;
    frameValue?: string;
    frameItems?: string[];
    visualPlanReason?: string;
    visualRole?: string;
    primaryVisual?: {assetId?: string; label?: string; type?: string; motion?: string; prompt?: string};
  }>,
  limit = 8,
): Promise<AssetTimelineItem[]> {
  if (!overlays.length) return [];

  const overlayQueries = overlays.map((overlay) => buildOverlayQuery(scriptDetails, overlay));
  const timeline: AssetTimelineItem[] = [];

  for (const [index, overlay] of overlays.entries()) {
    if (timeline.length >= limit) break;
    const overlayQuery = overlayQueries[index] || buildOverlayQuery(scriptDetails, overlay);
    const assetIntent = detectAssetIntent(overlayQuery);
    timeline.push(buildRemotionFrameTimelineItem({
      overlay,
      index,
      assetIntent,
      reason: 'scene-frame',
    }));
  }

  return timeline;
}

export function readUnifiedAssets() {
  if (cachedAssets) return cachedAssets;
  cachedAssets = [
    ...readAssetIndex(path.join(process.cwd(), 'public', 'assets', 'assets.json')),
    ...readAssetIndex(path.join(process.cwd(), 'lib', 'generated', 'reusable-assets.json')),
    ...readAssetIndex(path.join(process.cwd(), 'public', 'visuals', 'asset-index.json')),
  ].filter((asset, index, list) => list.findIndex((item) => item.id === asset.id || item.src === asset.src) === index);
  return cachedAssets;
}

function readAssetEmbeddings() {
  if (cachedEmbeddings) return cachedEmbeddings;
  try {
    cachedEmbeddings = JSON.parse(readFileSync(path.join(process.cwd(), 'public', 'assets', 'asset-embeddings.json'), 'utf8')) as AssetEmbeddingIndex;
  } catch {
    cachedEmbeddings = {items: {}};
  }
  return cachedEmbeddings;
}

const MIN_RELEVANCE_SCORE = 6;
const MIN_DIRECT_IMAGE_SCORE = 14;
function readAssetIndex(indexPath: string) {
  try {
    const parsed = JSON.parse(readFileSync(indexPath, 'utf8')) as AssetIndex;
    return Array.isArray(parsed.assets) ? parsed.assets : [];
  } catch {
    return [];
  }
}

function isVisualPickAsset(asset: IndexedAsset) {
  if (asset.type !== 'image' && asset.type !== 'video') return false;
  if (asset.kind === 'icon') return false;
  return !['font', 'sound-effect', 'background-music'].includes(asset.kind || '');
}

function roleBoost(asset: IndexedAsset, overlayType?: string) {
  if (overlayType === 'warning' && (asset.category === 'warning' || asset.category === 'alert')) return 4;
  if (overlayType === 'stat' && (asset.category === 'money' || asset.category === 'business' || asset.category === 'finance')) return 3;
  if (overlayType === 'hook' && (asset.kind === 'background' || asset.kind === 'image')) return 2;
  return 0;
}

function roleForOverlay(overlayType: string | undefined, index: number, visualRole?: string): AssetTimelineItem['role'] {
  // VIDEO_EXPLAINER is a strict three-layer render:
  // 1) uploaded top video, 2) middle subtitles, 3) bottom image.
  // Asset timeline items therefore feed only the bottom image layer.
  if (visualRole === 'supporting') return 'supporting';
  if (overlayType === 'stat' || overlayType === 'warning') return 'supporting';
  return 'primary';
}

function motionForAsset(asset: IndexedAsset, index: number): AssetTimelineItem['motion'] {
  return 'slowZoom';
}

function normalizeMotion(value: string | undefined): AssetTimelineItem['motion'] {
  if (value === 'slowZoom' || value === 'panLeft' || value === 'float' || value === 'pop' || value === 'parallax') return value;
  return 'slowZoom';
}

function scoreAsset(asset: IndexedAsset, queryTokens: Set<string>) {
  const assetTokens = tokenize([
    asset.id,
    asset.title,
    asset.kind,
    asset.scope,
    asset.category,
    asset.detailedDescription,
    asset.visualDifference,
    asset.style || '',
    asset.useCase || '',
    asset.use_case || '',
    ...(asset.tags || []),
    ...(asset.keywords || []),
    ...(asset.useFor || []),
  ].join(' '));

  let score = 0;
  for (const token of assetTokens) {
    if (queryTokens.has(token)) score += token.length > 5 ? 3 : 1;
  }
  if (queryTokens.has(asset.category)) score += 4;
  if (asset.embeddingRef) score += 0.75;
  return score + Math.max(0, Math.min(100, asset.qualityScore || 0)) / 100;
}

function findAssetBySrc(assets: IndexedAsset[], src: string) {
  const normalized = normalizeAssetSrc(src);
  return assets.find((asset) => normalizeAssetSrc(asset.src) === normalized || normalizeAssetSrc(asset.id) === normalized);
}

function normalizeAssetSrc(value: string) {
  return String(value || '').trim().replace(/^\/public\//, '/').replace(/^public\//, '/').toLowerCase();
}

function cleanAssetText(value: unknown) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function detectAssetIntent(text: string): AssetIntent {
  const value = String(text || '').toLowerCase();
  if (/\b(ai|artificial intelligence|automation|agent|chatgpt|openai|software|developer|coding|dashboard|saas|app|tech|algorithm)\b/.test(value)) return 'tech_ai';
  if (/\b(exam|student|study|class|course|lesson|teacher|ssc|upsc|rbi|ibps|job vacancy|recruitment|government job|admit card|result)\b/.test(value)) return 'government_exam';
  if (/\b(rupee|cash|bank|salary|money|income|profit|revenue|loan|saving|investment|finance|price|fee|budget|payment|cost|bonus|currency)\b/.test(value)) return 'finance';
  if (/\b(policy|official|document|form|report|notice|announcement|deadline|website|portal|certificate|application)\b/.test(value)) return 'news_document';
  if (/\b(career|business|startup|office|client|meeting|manager|founder|professional|team|workplace|executive)\b/.test(value)) return 'career_business';
  if (/\b(confidence|mindset|habit|focus|stand out|success|motivation|goal|discipline|self|personal brand|creator|content|lifestyle|routine)\b/.test(value)) return 'self_improvement';
  if (/\b(learn|learning|training|notebook|whiteboard|planner|workshop)\b/.test(value)) return 'education';
  return 'general';
}

function isAssetCompatibleWithIntent(asset: IndexedAsset, intent: AssetIntent, queryText: string) {
  if (intent === 'general') return true;
  const assetText = assetSearchText(asset);
  const query = String(queryText || '').toLowerCase();
  const hasExplicit = (pattern: RegExp) => pattern.test(query);
  const assetHas = (pattern: RegExp) => pattern.test(assetText);

  if (intent === 'self_improvement') {
    if (assetHas(/\b(rupee|cash|bank|loan|coin|jewelry|gold|airport|delivery|server|dashboard|code|rural|traffic)\b/) && !hasExplicit(/\b(rupee|cash|bank|loan|coin|jewelry|gold|airport|delivery|server|dashboard|code|rural|traffic)\b/)) return false;
    return assetHas(/\b(creator|content|office|professional|executive|walking|planning|notebook|whiteboard|study|student|meeting|focus|laptop|team|workshop|success|business|career|lifestyle)\b/);
  }
  if (intent === 'finance') {
    if (assetHas(/\b(jewelry|gold necklace|airport|delivery|creator whiteboard|student night|ai dashboard)\b/) && !hasExplicit(/\b(jewelry|gold|airport|delivery|student|ai)\b/)) return false;
    return assetHas(/\b(rupee|cash|bank|coin|finance|salary|payment|budget|calculator|money|income|report|bonus|currency)\b/);
  }
  if (intent === 'government_exam') {
    if (assetHas(/\b(jewelry|airport|delivery|luxury|salary bonus|cash counting)\b/) && !hasExplicit(/\b(jewelry|airport|delivery|salary|cash)\b/)) return false;
    return assetHas(/\b(exam|student|study|notebook|government|official|document|form|campus|class|learning|recruitment|rbi|ibps|ssc|upsc)\b/);
  }
  if (intent === 'tech_ai') {
    if (assetHas(/\b(rupee|cash|bank|jewelry|gold|airport|delivery|exam crowd)\b/) && !hasExplicit(/\b(rupee|cash|bank|jewelry|gold|airport|delivery|exam)\b/)) return false;
    return assetHas(/\b(ai|technology|developer|laptop|dashboard|software|automation|server|coding|app|digital|analytics)\b/);
  }
  if (intent === 'news_document') {
    if (assetHas(/\b(jewelry|airport|delivery|party|celebration)\b/) && !hasExplicit(/\b(jewelry|airport|delivery|party|celebration)\b/)) return false;
    return assetHas(/\b(document|form|paper|report|notice|official|desk|planner|calendar|website|portal|government|news|policy)\b/);
  }
  if (intent === 'career_business') {
    if (assetHas(/\b(rupee|cash|jewelry|airport|delivery|exam crowd)\b/) && !hasExplicit(/\b(rupee|cash|jewelry|airport|delivery|exam)\b/)) return false;
    return assetHas(/\b(office|business|professional|executive|meeting|team|laptop|workplace|client|creator|planning|career)\b/);
  }
  if (intent === 'education') {
    return assetHas(/\b(student|study|notebook|whiteboard|learning|planner|course|class|workshop|training|education)\b/);
  }
  return true;
}

function intentBoost(asset: IndexedAsset, intent: AssetIntent, queryText: string) {
  if (intent === 'general') return 0;
  const assetText = assetSearchText(asset);
  const queryTokens = tokenize(queryText);
  const intentKeywords = INTENT_KEYWORDS[intent] || [];
  const keywordHits = intentKeywords.reduce((sum, token) => sum + (assetText.includes(token) ? 1 : 0), 0);
  const exactHits = intentKeywords.reduce((sum, token) => sum + (queryTokens.has(token) && assetText.includes(token) ? 2 : 0), 0);
  return Math.min(12, keywordHits * 1.7 + exactHits);
}

function pickFallbackAssetForIntent(assets: IndexedAsset[], intent: AssetIntent, used: Set<string>) {
  const preferred = FALLBACK_ASSET_SRCS[intent] || FALLBACK_ASSET_SRCS.general;
  for (const src of preferred) {
    const asset = findAssetBySrc(assets, src);
    if (asset && !used.has(asset.id)) return asset;
  }
  return assets
    .filter((asset) => !used.has(asset.id) && isAssetCompatibleWithIntent(asset, intent, intent))
    .sort((a, b) => b.qualityScore - a.qualityScore)[0];
}

function buildRemotionFrameTimelineItem({
  overlay,
  index,
  assetIntent,
  reason,
}: {
  overlay: {
    id?: string;
    start: number;
    end: number;
    type?: string;
    text?: string;
    body?: string;
    visual?: string;
    assetBrief?: string;
    frameType?: string;
    frameText?: string;
    frameLabel?: string;
    frameValue?: string;
    frameItems?: string[];
    visualPlanReason?: string;
    visualRole?: string;
    primaryVisual?: {prompt?: string; label?: string};
  };
  index: number;
  assetIntent: AssetIntent;
  reason: NonNullable<AssetTimelineItem['frameReason']>;
}): AssetTimelineItem {
  const sourceText = [
    overlay.assetBrief,
    overlay.primaryVisual?.prompt,
    overlay.primaryVisual?.label,
    overlay.visual,
    overlay.text,
    overlay.body,
  ].filter(Boolean).join(' ');
  const frameText = cleanAssetText(overlay.frameText) || buildFrameKeyword(sourceText);
  const frameType = normalizeRemotionFrameType(overlay.frameType) || selectRemotionFrameType({overlay, index, assetIntent, sourceText});
  const frameValue = cleanAssetText(overlay.frameValue) || extractFrameValue(sourceText);
  const frameLabel = cleanAssetText(overlay.frameLabel) || buildFrameLabel(sourceText, frameText, frameType);
  const frameItems = normalizeFrameItems(overlay.frameItems) || extractFrameItems(sourceText, frameType);

  return {
    id: `frame-${overlay.id || index}`,
    overlayId: overlay.id,
    start: overlay.start,
    end: overlay.end,
    src: '',
    title: frameText,
    kind: 'frame',
    category: assetIntent,
    tags: ['remotion-frame', reason, ...(overlay.visualPlanReason ? ['visual-planner'] : [])],
    role: roleForOverlay(overlay.type, index, overlay.visualRole),
    motion: 'slowZoom',
    frameText,
    frameReason: reason,
    frameType,
    frameValue,
    frameLabel,
    frameItems,
  };
}

function normalizeRemotionFrameType(value: unknown): RemotionFrameType | '' {
  const text = cleanAssetText(value);
  return REMOTION_FRAME_TYPES.includes(text as RemotionFrameType) ? text as RemotionFrameType : '';
}

function normalizeFrameItems(value: unknown) {
  if (!Array.isArray(value)) return null;
  const items = value
    .map((item) => cleanAssetText(item))
    .filter(Boolean)
    .slice(0, 5);
  return items.length ? items : null;
}

function selectRemotionFrameType({
  overlay,
  index,
  assetIntent,
  sourceText,
}: {
  overlay: {type?: string};
  index: number;
  assetIntent: AssetIntent;
  sourceText: string;
}): RemotionFrameType {
  const value = sourceText.toLowerCase();
  if (/\b(subscribe)\b/.test(value)) return 'SubscribeCTA';
  if (/\b(save|bookmark)\b/.test(value)) return 'SaveCTA';
  if (/\b(comment|reply)\b/.test(value)) return 'CommentCTA';
  if (/\b(follow)\b/.test(value)) return 'FollowCTA';
  if (overlay.type === 'cta' || /\b(share|download|try now|start now)\b/.test(value)) return 'CTAFrame';
  if (/\b(breaking|latest|news|update)\b/.test(value)) return 'BreakingNewsBanner';
  if (overlay.type === 'warning' || /\b(warning|alert|risk|avoid|danger|failed|problem)\b/.test(value)) return 'RedAlertCard';
  if (/\b(mistake|wrong|error|galti)\b/.test(value)) return 'MistakeList';
  if (overlay.type === 'quote' || /["“”]/.test(sourceText) || /\b(success comes|consistency|mindset|discipline)\b/.test(value)) return 'QuoteCard';
  if (/\b(myth|fact)\b/.test(value)) return 'MythFact';
  if (/\b(before|after)\b/.test(value)) return 'BeforeAfter';
  if (/\b(pros|cons|advantage|disadvantage)\b/.test(value)) return 'ProsCons';
  if (/\b(plan|pricing|lite|pro)\b/.test(value)) return 'PlanComparison';
  if (/\b(salary).*\b(vs|compare|comparison)\b|\b(vs|versus|compare|comparison).*\bsalary\b/.test(value)) return 'SalaryComparison';
  if (/\b(vs|versus|compare|comparison|private job|government job)\b/.test(value)) return 'ComparisonCard';
  if (/\b(funnel|lead|conversion|sales)\b/.test(value)) return 'FunnelFrame';
  if (/\b(application|apply|approval|form submit)\b/.test(value)) return 'ApplicationFlow';
  if (/\b(exam|prelims|mains|interview|selection)\b/.test(value)) return 'ExamRoadmap';
  if (/\b(career path|promotion|job path)\b/.test(value)) return 'CareerPath';
  if (/\b(step|process|flow|roadmap|timeline|milestone|workflow|chain)\b/.test(value)) return 'ProcessFlow';
  if (/\b(top \d|ranking|rank)\b/.test(value)) return 'RankingList';
  if (/\b(benefits|advantages)\b/.test(value)) return 'TopBenefits';
  if (/\b(requirements|eligibility)\b/.test(value)) return 'RequirementsList';
  if (/\b(documents|papers|certificate|id proof)\b/.test(value)) return 'DocumentList';
  if (/\b(tips|hacks|ways)\b/.test(value)) return 'TipsList';
  if (/\b(checklist|points|things|reasons)\b/.test(value)) return 'ChecklistFrame';
  if (assetIntent === 'finance' && /[₹$]|\b\d+(?:,\d+)*\b|\b(percent|salary|profit|revenue|income|roi|growth)\b/.test(value)) {
    if (/\b(salary)\b/.test(value)) return 'SalaryCounter';
    if (/\b(profit)\b/.test(value)) return 'ProfitMeter';
    if (/\b(roi|return)\b/.test(value)) return 'ROIChart';
    if (/\b(stock|market|trading|intraday)\b/.test(value)) return 'StockCandleChart';
    if (/\b(saving|savings)\b/.test(value)) return 'SavingsMeter';
    if (/\b(revenue|income)\b/.test(value)) return 'RevenueGraph';
    if (/%|percent/.test(value)) return 'PercentageMeter';
    return /\b(growth|investment)\b/.test(value) ? 'MoneyGrowthGraph' : 'MoneyCounter';
  }
  if (assetIntent === 'government_exam' || assetIntent === 'education') {
    return /\b(prelims|mains|interview|selection|roadmap|exam process)\b/.test(value) ? 'ExamRoadmap' : 'ChecklistFrame';
  }
  if (index === 0 || overlay.type === 'hook') {
    if (/\?|\b(why|how|what|can|should)\b/.test(value)) return 'QuestionFrame';
    if (/[₹$]|\b\d+(?:,\d+)*\b|%/.test(value)) return 'BigNumberReveal';
    return 'InfoCard';
  }
  return 'InfoCard';
}

function extractFrameValue(value: string) {
  const match = value.match(/(?:₹|rs\.?|inr|\$)?\s?\d[\d,]*(?:\.\d+)?\s?(?:%|percent|crore|lakh|k|m|million|billion)?/i);
  return match?.[0]?.replace(/\s+/g, ' ').trim().toUpperCase() || '';
}

function buildFrameLabel(sourceText: string, frameText: string, frameType: RemotionFrameType) {
  if (frameType === 'MoneyGrowthGraph') return 'Growth';
  if (frameType === 'StatisticCounter' || frameType === 'BigNumberReveal') {
    return buildFrameKeyword(sourceText.replace(extractFrameValue(sourceText), '')).replace(frameText, '').trim() || 'Key Number';
  }
  if (frameType === 'ComparisonCard') return 'Comparison';
  if (frameType === 'TimelineFrame') return 'Roadmap';
  if (frameType === 'ChecklistFrame') return 'Checklist';
  if (frameType === 'AlertCard') return 'Needs Attention';
  if (frameType === 'CTAFrame') return 'Next Step';
  if (frameType === 'QuestionFrame') return 'Question';
  return 'Explainer';
}

function extractFrameItems(value: string, frameType: RemotionFrameType) {
  const cleaned = value
    .replace(/\b(create|vertical|portrait|image|scene|show|with|modern|indian|premium|explainer|bottom|layer)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const rawItems = cleaned
    .split(/(?:\n|,|;|→|->|↓|\||\bthen\b|\bvs\b|\bversus\b)/i)
    .map((item) => item.replace(/^\d+[\).\s-]*/, '').trim())
    .filter((item) => item.split(/\s+/).length <= 5)
    .filter((item) => item.length > 2)
    .filter((item) => !/^(the|and|for|with|from|this|that)$/i.test(item));
  const limit = frameType === 'ComparisonCard' ? 2 : frameType === 'TimelineFrame' ? 4 : 5;
  const items = rawItems.slice(0, limit);
  if (frameType === 'TimelineFrame' && items.length < 3) return ['Start', buildFrameKeyword(value), 'Result'];
  if (frameType === 'ComparisonCard' && items.length < 2) return ['Before', 'After'];
  if (frameType === 'ChecklistFrame' && items.length < 3) return ['Point 1', buildFrameKeyword(value), 'Action'];
  return items;
}

function buildFrameKeyword(value: string) {
  const cleaned = String(value || '')
    .replace(/[^a-zA-Z0-9₹$% ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned
    .split(/\s+/)
    .map((word) => word.replace(/^[^a-zA-Z0-9₹$%]+|[^a-zA-Z0-9₹$%]+$/g, ''))
    .filter((word) => word.length > 2 || /^[₹$%]?\d/.test(word))
    .filter((word) => !FRAME_STOP_WORDS.has(word.toLowerCase()));
  const preferred = words.filter((word) => /[A-Z0-9₹$%]/.test(word[0] || '') || word.length > 5);
  const picked = (preferred.length ? preferred : words).slice(0, 2);
  return (picked.length ? picked : ['KEY', 'POINT']).join(' ').toUpperCase();
}

function assetSearchText(asset: IndexedAsset) {
  return [
    asset.id,
    asset.src,
    asset.title,
    asset.kind,
    asset.scope,
    asset.category,
    asset.detailedDescription,
    asset.visualDifference,
    asset.style || '',
    asset.useCase || '',
    asset.use_case || '',
    ...(asset.tags || []),
    ...(asset.keywords || []),
    ...(asset.useFor || []),
    ...(asset.avoidFor || []),
  ].join(' ').toLowerCase();
}

const INTENT_KEYWORDS: Record<AssetIntent, string[]> = {
  finance: ['rupee', 'cash', 'bank', 'coin', 'finance', 'salary', 'payment', 'budget', 'calculator', 'money', 'income', 'report'],
  government_exam: ['exam', 'student', 'study', 'notebook', 'government', 'official', 'document', 'form', 'campus', 'recruitment'],
  tech_ai: ['ai', 'technology', 'developer', 'laptop', 'dashboard', 'software', 'automation', 'coding', 'digital', 'analytics'],
  self_improvement: ['creator', 'content', 'office', 'professional', 'executive', 'planning', 'notebook', 'whiteboard', 'focus', 'success', 'career'],
  news_document: ['document', 'form', 'paper', 'report', 'notice', 'official', 'desk', 'planner', 'calendar', 'website', 'portal'],
  career_business: ['office', 'business', 'professional', 'executive', 'meeting', 'team', 'laptop', 'workplace', 'client', 'career'],
  education: ['student', 'study', 'notebook', 'whiteboard', 'learning', 'planner', 'course', 'class', 'workshop', 'training'],
  general: [],
};

const FALLBACK_ASSET_SRCS: Record<AssetIntent, string[]> = {
  self_improvement: [
    '/assets/reusable/images/executive-walking-sunlit-lobby.png',
    '/assets/reusable/images/woman-silhouette-office-sunset-view.png',
    '/assets/reusable/images/content-creator-whiteboard-sticky-grid-vertical.png',
    '/assets/reusable/images/blank-stationery-desk-planner-portrait.png',
    '/assets/reusable/images/student-night-study-desk-notebook.png',
  ],
  career_business: [
    '/assets/reusable/images/executive-walking-sunlit-lobby.png',
    '/assets/reusable/images/content-creator-whiteboard-sticky-grid-vertical.png',
    '/assets/reusable/images/woman-silhouette-office-sunset-view.png',
    '/assets/reusable/images/night-developer-ai-dashboard-laptop.png',
  ],
  finance: [
    '/assets/reusable/images/bank-counter-customer-document-coin-stack.png',
    '/assets/reusable/images/stacked-rupee-coins-calculator-calendar-desk.png',
    '/assets/reusable/images/rupee-coin-growth-stacks-vertical.png',
    '/assets/reusable/images/rupee-coins-calculator-notebook-desk.png',
    '/assets/reusable/images/mobile-payment-rupee-handheld.png',
  ],
  government_exam: [
    '/assets/direct/images/exam-crowd-outside-exam-center.png',
    '/assets/reusable/images/student-night-study-desk-notebook.png',
    '/assets/reusable/images/blank-stationery-desk-planner-portrait.png',
    '/assets/reusable/images/content-creator-whiteboard-sticky-grid-vertical.png',
  ],
  education: [
    '/assets/reusable/images/student-night-study-desk-notebook.png',
    '/assets/reusable/images/content-creator-whiteboard-sticky-grid-vertical.png',
    '/assets/reusable/images/blank-stationery-desk-planner-portrait.png',
  ],
  tech_ai: [
    '/assets/reusable/images/night-developer-ai-dashboard-laptop.png',
    '/assets/reusable/images/content-creator-whiteboard-sticky-grid-vertical.png',
  ],
  news_document: [
    '/assets/reusable/images/blank-stationery-desk-planner-portrait.png',
    '/assets/reusable/images/stacked-rupee-coins-calculator-calendar-desk.png',
    '/assets/reusable/images/content-creator-whiteboard-sticky-grid-vertical.png',
  ],
  general: [
    '/assets/reusable/images/executive-walking-sunlit-lobby.png',
    '/assets/reusable/images/content-creator-whiteboard-sticky-grid-vertical.png',
    '/assets/reusable/images/blank-stationery-desk-planner-portrait.png',
  ],
};

function buildOverlayQuery(
  scriptDetails: ScriptDetails,
  overlay: {
    type?: string;
    text?: string;
    body?: string;
    visual?: string;
    assetBrief?: string;
    frameType?: string;
    frameText?: string;
    frameLabel?: string;
    frameValue?: string;
    frameItems?: string[];
    visualPlanReason?: string;
    primaryVisual?: {prompt?: string; label?: string};
  },
) {
  return [
    overlay.assetBrief,
    overlay.primaryVisual?.prompt,
    overlay.primaryVisual?.label,
    overlay.frameType,
    overlay.frameText,
    overlay.frameLabel,
    overlay.frameValue,
    ...(overlay.frameItems || []),
    overlay.visualPlanReason,
    scriptDetails.topic,
    scriptDetails.summary,
    ...(scriptDetails.keyPoints || []).slice(0, 6),
    overlay.type,
    overlay.text,
    overlay.body,
    overlay.visual,
  ].filter(Boolean).join('\n').slice(0, 3000);
}

async function embedQueries(queries: string[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !queries.length) return [];
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_ASSET_EMBEDDING_MODEL || 'text-embedding-3-small',
        input: queries,
      }),
    });
    if (!response.ok) return [];
    const json = await response.json() as {data?: Array<{embedding?: number[]}>};
    return (json.data || []).map((item) => Array.isArray(item.embedding) ? item.embedding : null);
  } catch {
    return [];
  }
}

function semanticBoost(asset: IndexedAsset, queryEmbedding: number[] | null, embeddings: AssetEmbeddingIndex) {
  if (!queryEmbedding?.length || !asset.embeddingRef) return 0;
  const assetEmbedding = embeddings.items?.[asset.embeddingRef]?.embedding;
  if (!assetEmbedding?.length) return 0;
  const similarity = cosineSimilarity(queryEmbedding, assetEmbedding);
  if (!Number.isFinite(similarity)) return 0;
  return Math.max(0, similarity - 0.18) * 22;
}

function cosineSimilarity(a: number[], b: number[]) {
  const length = Math.min(a.length, b.length);
  if (!length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let index = 0; index < length; index += 1) {
    const left = Number(a[index] || 0);
    const right = Number(b[index] || 0);
    dot += left * right;
    normA += left * left;
    normB += right * right;
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function tokenize(value: string) {
  return new Set(
    String(value || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter((token) => token.length > 2)
      .filter((token) => !STOP_WORDS.has(token)),
  );
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
  'preview',
]);

const FRAME_STOP_WORDS = new Set([
  ...STOP_WORDS,
  'show',
  'shows',
  'image',
  'exact',
  'topic',
  'scene',
  'indian',
  'modern',
  'clean',
  'with',
  'from',
  'about',
  'bottom',
  'layer',
  'visual',
  'should',
  'must',
  'context',
  'setting',
  'person',
  'people',
]);
