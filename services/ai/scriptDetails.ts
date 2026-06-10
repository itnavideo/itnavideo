import type {VisualPlan} from './visualPlanner';

export type ScriptDetailBlockType =
  | 'processList'
  | 'websiteBox'
  | 'amountBox'
  | 'documentList'
  | 'dateBox'
  | 'warningBox'
  | 'factBox';

export type ScriptDetailBlock = {
  id: string;
  type: ScriptDetailBlockType;
  title: string;
  items: string[];
  sourceText: string;
};

export type ScriptVideoUsePlanItem = {
  id: string;
  start: number;
  end: number;
  purpose: 'hook' | 'date' | 'proof' | 'warning' | 'action' | 'cta' | 'point';
  detailType: ScriptDetailBlockType;
  layout: 'hookCard' | 'statCard' | 'warningCard' | 'splitExplainer' | 'checklistCard' | 'quoteCard' | 'ctaCard';
  visual: string;
  animation: 'popIn' | 'fadeUp' | 'slideUp' | 'countUp' | 'pulse' | 'none';
  emotion: 'urgent' | 'informative' | 'serious' | 'motivational' | 'neutral';
  title: string;
  displayText: string;
  body: string;
  renderText?: string;
  renderBody?: string;
  assetSearchText?: string;
  sourceText: string;
};

export type AssetBrief = {
  id: string;
  timing: string;
  searchText: string;
  visualType: 'editorial_photo' | 'video_clip' | 'screenshot' | 'icon_callout' | 'notes_doodle' | 'typography';
  priority: 'high' | 'medium' | 'low';
  usage: 'background' | 'supporting' | 'mainVisual' | 'overlay';
  title: string;
};

export type ImageUsagePolicy = {
  minImages: number;
  maxImages: number;
  recommendedImages: number;
  reason: string;
  selectionRules: string[];
};

export type ImageSelectionPlanItem = {
  id: string;
  timing: string;
  scenePurpose: 'hook' | 'proof' | 'process' | 'warning' | 'cta' | 'context';
  imageNeed: string;
  bestMatchDescription: string;
  requiredTags: string[];
  avoidTags: string[];
  assetType: 'editorial_photo' | 'cinematic_image' | 'screenshot' | 'generated_image' | 'template_visual';
  priority: 'high' | 'medium' | 'low';
  fallbackVisual: 'typography_card' | 'clean_icon_callout' | 'notes_card' | 'skip_image';
  reason: string;
};

export type ScriptDetails = {
  topic: string;
  summary: string;
  intent: 'apply' | 'download' | 'check' | 'learn' | 'prepare' | 'general';
  wordCount?: number;
  sourceScript?: string;
  originalScript?: string;
  keyPoints?: string[];
  avoidRepeats?: string[];
  assetBriefs?: AssetBrief[];
  imageUsagePolicy?: ImageUsagePolicy;
  imageSelectionPlan?: ImageSelectionPlanItem[];
  videoUsePlan?: ScriptVideoUsePlanItem[];
  visualPlan?: VisualPlan;
  planningSource?: 'rules' | 'ai';
  processSteps: string[];
  websites: string[];
  amounts: string[];
  documents: string[];
  dates: string[];
  warnings: string[];
  detailBlocks: ScriptDetailBlock[];
};

const DOCUMENT_TERMS: Record<string, string> = {
  'aadhaar card': 'Aadhaar Card',
  'aadhar card': 'Aadhaar Card',
  'pan card': 'PAN Card',
  passport: 'Passport',
  'voter id': 'Voter ID',
  'driving licence': 'Driving Licence',
  'driving license': 'Driving Licence',
  photo: 'Photo',
  photograph: 'Photo',
  signature: 'Signature',
  'address proof': 'Address Proof',
  'id proof': 'ID Proof',
  'identity proof': 'Identity Proof',
  'income proof': 'Income Proof',
  'bank statement': 'Bank Statement',
  'bank passbook': 'Bank Passbook',
  marksheet: 'Marksheet',
  'admit card': 'Admit Card',
  'hall ticket': 'Hall Ticket',
  certificate: 'Certificate',
  'mobile number': 'Mobile Number',
  'email id': 'Email ID',
};

const TEXT_FIXES: Array<[RegExp, string]> = [
  [/\bpain\s?kaard\b/gi, 'PAN Card'],
  [/\bpan\s?kaard\b/gi, 'PAN Card'],
  [/\bpan\s+card\b/gi, 'PAN Card'],
  [/\baadhaar\b/gi, 'Aadhaar'],
  [/\baadhar\b/gi, 'Aadhaar'],
  [/\bapalaa?ee\b/gi, 'Apply'],
  [/\bapplye\b/gi, 'Apply'],
  [/\baply\b/gi, 'Apply'],
  [/\bnaheen\b/gi, 'Nahi'],
  [/\bnahin\b/gi, 'Nahi'],
  [/\baasaan hee se\b/gi, 'Aasani se'],
  [/\baasaanii\b/gi, 'Aasani'],
  [/\bdokumaints?\b/gi, 'Documents'],
  [/\bdakuments?\b/gi, 'Documents'],
  [/\bdakument\b/gi, 'Document'],
  [/\bdob\b/gi, 'DOB'],
  [/\bemail id\b/gi, 'Email ID'],
  [/\bvoter id\b/gi, 'Voter ID'],
  [/\bid proof\b/gi, 'ID Proof'],
  [/\bitr\b/gi, 'ITR'],
  [/\bnsdl\b/gi, 'NSDL'],
  [/\butiitsl\b/gi, 'UTIITSL'],
];

const WARNING_KEYWORDS = /\b(deadline|last date|galti|mistake|avoid|nahi|nahin|warning|dhyan|careful|required|mandatory|reject|problem|risk)\b/i;
const PROCESS_KEYWORDS = /\b(apply|download|fill|submit|upload|register|login|verify|check|pay|select|choose|open|visit|click|enter|print|save)\b/i;
const INTENT_RULES: Array<[ScriptDetails['intent'], RegExp]> = [
  ['apply', /\b(apply|application|form bhar|registration|register)\b/i],
  ['download', /\b(download|hall ticket|admit card|receipt|pdf)\b/i],
  ['check', /\b(check|status|result|verify|track)\b/i],
  ['prepare', /\b(exam|mock|practice|preparation|syllabus|study)\b/i],
  ['learn', /\b(kaise|how to|explain|samjho|learn|guide)\b/i],
];

export function extractScriptDetails(input: {
  transcript: string;
  topicTitle?: string;
  segments?: Array<{text: string}>;
}): ScriptDetails {
  const source = cleanText([
    input.transcript || '',
    ...(input.segments || []).map((segment) => segment.text),
  ].join(' '));
  const sentences = splitSentences(source);
  const websites = unique(sentences.flatMap(extractWebsitesFromText)).slice(0, 5);
  const amounts = unique(sentences.flatMap(extractAmountsFromText)).slice(0, 6);
  const documents = unique(sentences.flatMap(extractDocumentsFromText)).slice(0, 10);
  const dates = unique(sentences.flatMap(extractDatesFromText)).slice(0, 8);
  const warnings = sentences
    .filter((sentence) => WARNING_KEYWORDS.test(sentence))
    .map((sentence) => trimWords(sentence, 18))
    .slice(0, 4);
  const processSteps = buildProcessSteps(sentences);
  const topic = makeTopic(input.topicTitle || '', source);
  const summary = trimWords(sentences.find((sentence) => sentence.length > 24) || source, 18);
  const intent = detectIntent(source);
  const imageUsagePolicy = buildImageUsagePolicy({
    durationSeconds: input.segments?.length
      ? Math.max(...input.segments.map((segment) => Number((segment as {end?: unknown}).end) || 0), 0)
      : 0,
    sentenceCount: sentences.length,
    hasProcess: processSteps.length > 0,
  });

  return {
    topic,
    summary,
    intent,
    wordCount: source.split(/\s+/).filter(Boolean).length,
    sourceScript: source,
    originalScript: source,
    keyPoints: sentences.map((sentence) => trimWords(sentence, 14)).slice(0, 6),
    avoidRepeats: [],
    assetBriefs: [],
    imageUsagePolicy,
    imageSelectionPlan: [],
    videoUsePlan: [],
    planningSource: 'rules',
    processSteps,
    websites,
    amounts,
    documents,
    dates,
    warnings,
    detailBlocks: buildDetailBlocks({sentences, processSteps, websites, amounts, documents, dates, warnings}),
  };
}

function buildImageUsagePolicy({
  durationSeconds,
  sentenceCount,
  hasProcess,
}: {
  durationSeconds: number;
  sentenceCount: number;
  hasProcess: boolean;
}): ImageUsagePolicy {
  const estimatedScenes = Math.max(1, Math.min(10, Math.ceil((durationSeconds || sentenceCount * 5 || 20) / 6)));
  const minImages = Math.max(1, Math.min(4, Math.floor(estimatedScenes * 0.45)));
  const maxImages = Math.max(minImages, Math.min(8, hasProcess ? estimatedScenes : estimatedScenes + 1));
  const recommendedImages = Math.max(minImages, Math.min(maxImages, hasProcess ? Math.ceil(estimatedScenes * 0.7) : Math.ceil(estimatedScenes * 0.6)));
  return {
    minImages,
    maxImages,
    recommendedImages,
    reason: hasProcess
      ? 'Process-based scripts need enough images for key steps, but not one random image per sentence.'
      : 'Use images only for strong visual moments; keep other moments as typography or cards.',
    selectionRules: [
      'Use one image only when it directly supports the scene meaning.',
      'Do not repeat the same image for unrelated points.',
      'Prefer specific real-world visuals over generic icons or abstract backgrounds.',
      'If no accurate image exists, use typography or a clean content card instead.',
    ],
  };
}

function buildDetailBlocks({
  sentences,
  processSteps,
  websites,
  amounts,
  documents,
  dates,
  warnings,
}: {
  sentences: string[];
  processSteps: string[];
  websites: string[];
  amounts: string[];
  documents: string[];
  dates: string[];
  warnings: string[];
}): ScriptDetailBlock[] {
  const blocks: ScriptDetailBlock[] = [];
  if (processSteps.length) {
    blocks.push({
      id: 'script-detail-process',
      type: 'processList',
      title: 'Process steps',
      items: processSteps.slice(0, 5),
      sourceText: findSource(sentences, PROCESS_KEYWORDS),
    });
  }
  if (websites.length) {
    blocks.push({
      id: 'script-detail-website',
      type: 'websiteBox',
      title: 'Website',
      items: websites,
      sourceText: findSource(sentences, /\b(website|site|portal|www|\.com|\.in|\.org|\.gov)\b/i),
    });
  }
  if (amounts.length) {
    blocks.push({
      id: 'script-detail-amount',
      type: 'amountBox',
      title: 'Amount',
      items: amounts,
      sourceText: findSource(sentences, /\b(₹|rs|rupees|fee|fees|charge|payment|amount|cost|price)\b/i),
    });
  }
  if (documents.length) {
    blocks.push({
      id: 'script-detail-documents',
      type: 'documentList',
      title: 'Documents',
      items: documents,
      sourceText: findSource(sentences, /\b(document|documents|proof|card|photo|signature|certificate)\b/i),
    });
  }
  if (dates.length) {
    blocks.push({
      id: 'script-detail-dates',
      type: 'dateBox',
      title: 'Important dates',
      items: dates,
      sourceText: findSource(sentences, /\b(date|deadline|last|exam|april|may|june|july|august|september|october|november|december|january|february|march)\b/i),
    });
  }
  if (warnings.length) {
    blocks.push({
      id: 'script-detail-warning',
      type: 'warningBox',
      title: 'Important warning',
      items: warnings,
      sourceText: warnings[0] || '',
    });
  }
  return blocks;
}

function buildProcessSteps(sentences: string[]) {
  const directSteps = sentences
    .filter((sentence) => PROCESS_KEYWORDS.test(sentence))
    .map((sentence) => trimWords(removeFillerStart(sentence), 12))
    .filter(Boolean);

  return unique(directSteps).slice(0, 6);
}

function extractWebsitesFromText(value: string) {
  const matches = value.match(/\b(?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9-]*(?:\.[a-z]{2,})+(?:\/[^\s,]*)?/gi) || [];
  return matches
    .map((item) => item.replace(/^https?:\/\//i, '').replace(/[),.;:]+$/g, '').toLowerCase())
    .filter((item) => !/^\d+\.\d+$/.test(item));
}

function extractAmountsFromText(value: string) {
  const matches = value.match(/\b(?:₹|rs\.?|rupees|inr|\$)\s?[\d,.]+(?:\s?(?:lakh|crore|k|thousand|million))?\b|[\d,.]+\s?(?:rupees|rs\.?|inr|₹|\$|lakh|crore)\b/gi) || [];
  return matches.map((item) => normalizeAmount(item));
}

function extractDocumentsFromText(value: string) {
  const lower = value.toLowerCase();
  return Object.entries(DOCUMENT_TERMS)
    .filter(([term]) => lower.includes(term))
    .map(([, label]) => label);
}

function extractDatesFromText(value: string) {
  const dates = value.match(/\b(?:\d{1,2}(?:st|nd|rd|th)?\s+)?(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+\d{2,4}|\b\d{1,2}\s+(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\b|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/gi) || [];
  return dates.map((item) => item.replace(/\s+/g, ' ').trim());
}

function detectIntent(source: string): ScriptDetails['intent'] {
  for (const [intent, pattern] of INTENT_RULES) {
    if (pattern.test(source)) return intent;
  }
  return 'general';
}

function makeTopic(topicTitle: string, source: string) {
  const title = cleanText(topicTitle);
  if (title) return titleCase(trimWords(title, 8));
  const firstSentence = splitSentences(source)[0] || source;
  return titleCase(trimWords(removeFillerStart(firstSentence), 7)) || 'Video topic';
}

function findSource(sentences: string[], pattern: RegExp) {
  return sentences.find((sentence) => pattern.test(sentence)) || '';
}

function splitSentences(value: string) {
  return cleanText(value)
    .split(/(?<=[.!?])\s+|\s{2,}|[\n\r]+/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 3);
}

function cleanText(value: string) {
  const normalized = TEXT_FIXES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), String(value || ''));
  return normalized.replace(/\s+/g, ' ').trim();
}

function removeFillerStart(value: string) {
  return cleanText(value)
    .replace(/^(toh|to|so|ab|dekho|friends|dosto|bhai|hello|guys|aaj|is video me)\b[\s,.-]*/i, '')
    .trim();
}

function normalizeAmount(value: string) {
  return value
    .replace(/\brs\.?\b/gi, 'Rs')
    .replace(/\brupees\b/gi, 'rupees')
    .replace(/\s+/g, ' ')
    .trim();
}

function trimWords(value: string, maxWords: number) {
  const words = cleanText(value).split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return `${words.slice(0, maxWords).join(' ')}...`;
}

function unique(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values.map((item) => cleanText(item)).filter(Boolean)) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function titleCase(value: string) {
  return cleanText(value).replace(/\w\S*/g, (word) => {
    if (/^[A-Z0-9]{2,}$/.test(word)) return word;
    if (/^(pan|itr|dob|id|nsdl|utiitsl)$/i.test(word)) return word.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}
