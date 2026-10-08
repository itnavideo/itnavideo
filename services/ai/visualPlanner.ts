import type { ScriptDetails } from './scriptDetails';
import { GoogleGenAI } from '@google/genai';
import { readEnrichedStockAssets } from './assetPicker';

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
  | 'TipsList';

export type InfographicNode = {
  id: string;
  stepNumber: number;
  title: string;
  shortLabel: string;
  icon: string;
  startSecond: number;
  endSecond: number;
  role: 'hook' | 'problem' | 'reason' | 'example' | 'solution' | 'cta';
};

export type VisualPlanScene = {
  id: string;
  start: number;
  end: number;
  scriptText: string;
  spokenMeaning: string;
  showWhat: string;
  whyMatchesScript?: string;
  visualType:
    | 'ACCUMULATIVE_FLOWCHART'
    | 'STEP_BY_STEP_LIST'
    | 'COMPARISON_SPLIT'
    | 'WARNING_RISK_MAP'
    | 'SIMPLE_STAT_CARD'
    | 'CONCEPT_CARD'
    | 'CHECKLIST';
  frameType: VisualPlannerFrameType;
  frameText: string;
  frameLabel: string;
  frameItems: string[];
  frameValue?: string;
  assetSearchText: string;
  sfx?: 'softPop' | 'softTick' | 'softChime' | 'boom' | 'whoosh' | 'stamp' | 'warning' | 'cash';
  animation?: 'fadeUp' | 'popIn' | 'slideUp' | 'countUp' | 'warningPulse';
  emotion?: 'urgent' | 'informative' | 'serious' | 'motivational';
  activeNodeId?: string;
};

export type VisualPlan = {
  source: 'visual-planner';
  version: 2;
  durationSeconds: number;

  /**
   * Global bottom infographic structure.
   * Renderer should keep previous nodes visible and glow activeNodeId.
   */
  infographicNodes: InfographicNode[];

  /**
   * Timeline scenes mapped to infographicNodes.
   */
  scenes: VisualPlanScene[];

  notes: string[];
};

type VisualPlanInput = {
  scriptDetails: ScriptDetails;
  segments: Array<{ start: number; end: number; text: string }>;
  durationSeconds: number;
  topicTitle?: string;
};

const round2 = (value: number) => Math.round(value * 100) / 100;

const cleanText = (value: unknown, fallback = '') =>
  String(value || fallback)
    .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u097F]/g, '')
    .replace(/\s+/g, ' ')
    .trim() || fallback;

const limitWords = (value: string, maxWords: number, maxChars: number) =>
  cleanText(value)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxWords)
    .join(' ')
    .slice(0, maxChars)
    .trim();

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function buildVisualPlan({
  durationSeconds,
  scriptDetails,
  segments,
  topicTitle,
}: VisualPlanInput): VisualPlan {
  const safeDuration = Math.max(1, Number(durationSeconds) || 60);
  const topic = cleanText(topicTitle || scriptDetails.topic || 'Video Explainer');

  const safeSegments = repairSegments(segments, safeDuration);

  /**
   * PASS 1:
   * Full script analysis.
   * Pehle poori kahani ko samjho, phir bottom tree nodes banao.
   */
  const fullScript = cleanText(
    [
      topic,
      scriptDetails.summary,
      scriptDetails.sourceScript,
      safeSegments.map((segment) => segment.text).join(' '),
    ]
      .filter(Boolean)
      .join(' '),
  );

  const storyBlueprint = analyzeFullScriptBlueprint(fullScript, safeDuration, safeSegments);

  /**
   * PASS 2:
   * Har timeline segment ko correct node se link karo.
   */
  const scenes = safeSegments.map((segment, index) => {
    const scriptText = cleanText(segment.text);
    const activeNode = getActiveNode(storyBlueprint, segment.start, index);

    const visualType = determineVisualTypeFromText(scriptText, index, activeNode.role);
    const frameType = determineFrameType(visualType, scriptText, activeNode.role);
    const items = buildFrameItems(scriptText, activeNode);

    return {
      id: `scene-${String(index + 1).padStart(2, '0')}`,
      start: round2(segment.start),
      end: round2(segment.end),
      scriptText,
      spokenMeaning: buildSpokenMeaning(scriptText, activeNode),
      showWhat: buildShowWhat(scriptText, activeNode),
      whyMatchesScript: buildWhyMatchesScript(scriptText, activeNode, visualType),
      visualType,
      frameType,
      frameText: activeNode.title.toUpperCase(),
      frameLabel: activeNode.shortLabel,
      frameItems: items,
      frameValue: extractStatValue(scriptText),
      assetSearchText: buildAssetSearchText(topic, scriptText, activeNode),
      sfx: pickSfx(index, visualType, activeNode.role),
      animation: pickAnimation(visualType, activeNode.role),
      emotion: pickEmotion(scriptText, activeNode.role),
      activeNodeId: activeNode.id,
    } satisfies VisualPlanScene;
  });

  return {
    source: 'visual-planner',
    version: 2,
    durationSeconds: round2(safeDuration),
    infographicNodes: storyBlueprint,
    scenes,
    notes: [
      'Two-pass visual planning enabled.',
      'Pass 1 analyzes full script and creates global infographicNodes.',
      'Pass 2 maps every timeline scene to activeNodeId.',
      'Bottom visual renderer should keep previous nodes visible and glow the active node.',
      'Visible text cleaned to English/Roman Hinglish only.',
    ],
  };
}

function repairSegments(
  segments: Array<{ start: number; end: number; text: string }>,
  durationSeconds: number,
): Array<{ start: number; end: number; text: string }> {
  const cleaned = (segments || [])
    .map((segment, index) => {
      const start = clamp(Number(segment.start) || 0, 0, durationSeconds);
      const end = clamp(Number(segment.end) || start + 2, start + 0.2, durationSeconds);

      return {
        start,
        end,
        text: cleanText(segment.text, `Point ${index + 1}`),
      };
    })
    .filter((segment) => segment.end > segment.start && segment.text);

  if (cleaned.length) return cleaned;

  return [
    {
      start: 0,
      end: durationSeconds,
      text: 'Upload your video and Itnavideo creates a clean visual explainer reel.',
    },
  ];
}

/**
 * PASS 1: Full script to global node structure.
 * This is not just sentence timeline.
 * It first decides the full story structure.
 */
function analyzeFullScriptBlueprint(
  fullScript: string,
  durationSeconds: number,
  segments: Array<{ start: number; end: number; text: string }>,
): InfographicNode[] {
  const lower = fullScript.toLowerCase();

  const hasWarning = /\b(warning|risk|danger|alert|fraud|scam|galti|mistake|problem|issue)\b/i.test(lower);
  const hasMoney = /\b(money|salary|income|loan|emi|bank|rbi|price|profit|loss|cash|payment)\b/i.test(lower);
  const hasCareer = /\b(job|career|exam|student|course|apply|interview|salary|skills)\b/i.test(lower);
  const hasCompare = /\b(vs|compare|comparison|difference|better|instead|whereas|jabki)\b/i.test(lower);
  const hasSteps = /\b(step|process|first|second|third|kaise|how to|apply|start)\b/i.test(lower);

  const nodeCount = decideNodeCount(durationSeconds, segments.length, {
    hasWarning,
    hasCompare,
    hasSteps,
  });

  const roles = decideRoles(nodeCount, {
    hasWarning,
    hasCompare,
    hasSteps,
  });

  const boundaries = buildSmartBoundaries(durationSeconds, nodeCount, segments);

  return roles.map((role, index) => {
    const startSecond = boundaries[index]?.start ?? (durationSeconds / nodeCount) * index;
    const endSecond = boundaries[index]?.end ?? durationSeconds;

    const textBlock = segments
      .filter((segment) => segment.start >= startSecond - 0.5 && segment.start <= endSecond + 0.5)
      .map((segment) => segment.text)
      .join(' ');

    const title = buildSmartTitle(textBlock || fullScript, role, index, {
      hasMoney,
      hasCareer,
      hasCompare,
      hasWarning,
    });

    return {
      id: `node_step_${index + 1}`,
      stepNumber: index + 1,
      title,
      shortLabel: buildShortLabel(title, role),
      icon: pickIcon(role, {
        hasMoney,
        hasCareer,
        hasCompare,
        hasWarning,
        hasSteps,
      }),
      startSecond: round2(startSecond),
      endSecond: round2(index === roles.length - 1 ? durationSeconds : endSecond),
      role,
    };
  });
}

function decideNodeCount(
  durationSeconds: number,
  segmentCount: number,
  flags: { hasWarning: boolean; hasCompare: boolean; hasSteps: boolean },
) {
  if (durationSeconds <= 18) return 3;
  // VIDEO_EXPLAINER should not become COMPARE template
  // if (flags.hasCompare) return 3;
  if (flags.hasWarning || flags.hasSteps) return 4;
  if (durationSeconds >= 45 && segmentCount >= 8) return 5;
  return 4;
}

function decideRoles(
  nodeCount: number,
  flags: { hasWarning: boolean; hasCompare: boolean; hasSteps: boolean },
): InfographicNode['role'][] {
  if (false && flags.hasCompare) {
    return ['hook', 'problem', 'reason', 'solution'].slice(0, nodeCount) as InfographicNode['role'][];
  }

  if (flags.hasWarning) {
    return ['hook', 'problem', 'warning', 'solution', 'cta']
      .filter((role): role is InfographicNode['role'] =>
        ['hook', 'problem', 'warning', 'solution', 'cta'].includes(role),
      )
      .slice(0, nodeCount);
  }

  if (flags.hasSteps) {
    return ['hook', 'reason', 'example', 'solution', 'cta'].slice(0, nodeCount) as InfographicNode['role'][];
  }

  return ['hook', 'problem', 'reason', 'solution', 'cta'].slice(0, nodeCount) as InfographicNode['role'][];
}

function buildSmartBoundaries(
  durationSeconds: number,
  nodeCount: number,
  segments: Array<{ start: number; end: number; text: string }>,
) {
  if (!segments.length) {
    return Array.from({ length: nodeCount }).map((_, index) => ({
      start: (durationSeconds / nodeCount) * index,
      end: (durationSeconds / nodeCount) * (index + 1),
    }));
  }

  const boundaries: Array<{ start: number; end: number }> = [];
  const segmentsPerNode = Math.max(1, Math.ceil(segments.length / nodeCount));

  for (let i = 0; i < nodeCount; i++) {
    const firstSegment = segments[i * segmentsPerNode];
    const nextSegment = segments[(i + 1) * segmentsPerNode];

    const start = i === 0 ? 0 : firstSegment?.start ?? (durationSeconds / nodeCount) * i;
    const end =
      i === nodeCount - 1
        ? durationSeconds
        : nextSegment?.start ?? (durationSeconds / nodeCount) * (i + 1);

    boundaries.push({
      start: clamp(start, 0, durationSeconds),
      end: clamp(end, start + 0.5, durationSeconds),
    });
  }

  return boundaries;
}

function getActiveNode(nodes: InfographicNode[], second: number, sceneIndex: number) {
  const match =
    [...nodes]
      .reverse()
      .find((node) => second >= node.startSecond && second <= node.endSecond) || nodes[sceneIndex % nodes.length];

  return match || nodes[0];
}

function buildSmartTitle(
  text: string,
  role: InfographicNode['role'],
  index: number,
  flags: {
    hasMoney: boolean;
    hasCareer: boolean;
    hasCompare: boolean;
    hasWarning: boolean;
  },
) {
  const lower = text.toLowerCase();

  if (role === 'hook') {
    if (false && flags.hasCompare) return 'Difference';
    if (flags.hasMoney) return 'Money Point';
    if (flags.hasCareer) return 'Career Point';
    return 'Main Idea';
  }

  if (role === 'problem') {
    if (flags.hasWarning) return 'Main Risk';
    if (/\b(problem|issue|mistake|galti)\b/i.test(lower)) return 'Problem';
    return 'Core Issue';
  }

  if (role === 'reason') {
    if (/\b(why|because|reason|kyun)\b/i.test(lower)) return 'Reason';
    return 'Why It Matters';
  }

  if (role === 'example') return 'Example';
  if (role === 'solution') return 'Solution';
  if (role === 'cta') return 'Next Step';

  const meaningfulWords = cleanText(text)
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .filter((word) => !['this', 'that', 'with', 'from', 'your', 'have', 'will', 'they', 'about'].includes(word.toLowerCase()));

  return (meaningfulWords.slice(0, 2).join(' ') || `Step ${index + 1}`).slice(0, 20);
}

function buildShortLabel(title: string, role: InfographicNode['role']) {
  const fallback: Record<InfographicNode['role'], string> = {
    hook: 'Start here',
    problem: 'Problem area',
    reason: 'Why it matters',
    example: 'Simple example',
    solution: 'Best action',
    cta: 'Final step',
  };

  return limitWords(title || fallback[role], 4, 28);
}

function pickIcon(
  role: InfographicNode['role'],
  flags: {
    hasMoney: boolean;
    hasCareer: boolean;
    hasCompare: boolean;
    hasWarning: boolean;
    hasSteps: boolean;
  },
) {
  if (role === 'hook') return 'Sparkles';
  if (role === 'problem') return flags.hasWarning ? 'AlertTriangle' : 'CircleHelp';
  if (role === 'reason') return 'Brain';
  if (role === 'example') return flags.hasMoney ? 'Banknote' : 'FileText';
  if (role === 'solution') return flags.hasCareer ? 'BriefcaseBusiness' : 'CheckCircle';
  if (role === 'cta') return 'MousePointerClick';
  return 'CircleDot';
}

function determineVisualTypeFromText(
  text: string,
  index: number,
  role: InfographicNode['role'],
): VisualPlanScene['visualType'] {
  const low = text.toLowerCase();

  if (index === 0 || role === 'hook') return 'CONCEPT_CARD';
  if (role === 'cta' || role === 'solution') return 'CHECKLIST';
  if (/\b(warning|risk|alert|danger|fraud|scam|galti|mistake)\b/.test(low)) return 'WARNING_RISK_MAP';
  if (/\\b(vs|compare|comparison|difference|better|jabki)\\b/.test(low)) return 'ACCUMULATIVE_FLOWCHART';
  if (/\b(percent|%|₹|\$|lakh|crore|salary|emi|profit|loss|number)\b/.test(low)) return 'SIMPLE_STAT_CARD';
  if (/\b(step|process|first|second|third|apply|start|kaise|how)\b/.test(low)) return 'STEP_BY_STEP_LIST';

  return 'ACCUMULATIVE_FLOWCHART';
}

function determineFrameType(
  visualType: VisualPlanScene['visualType'],
  text: string,
  role: InfographicNode['role'],
): VisualPlannerFrameType {
  if (visualType === 'WARNING_RISK_MAP') return 'AlertCard';
  if (visualType === 'COMPARISON_SPLIT') return 'ProcessFlow';
  if (visualType === 'SIMPLE_STAT_CARD') return 'BigNumberReveal';
  if (visualType === 'STEP_BY_STEP_LIST') return 'ProcessFlow';
  if (role === 'solution' || role === 'cta') return 'ChecklistFrame';

  const low = text.toLowerCase();
  if (/\b(document|form|apply|application|requirement)\b/.test(low)) return 'ApplicationFlow';
  if (/\b(tips|tip|remember)\b/.test(low)) return 'TipsList';

  return 'ProcessFlow';
}

function buildFrameItems(text: string, node: InfographicNode) {
  const parts = cleanText(text)
    .split(/[,.|;]+/)
    .map((item) => limitWords(item, 5, 44))
    .filter(Boolean)
    .slice(0, 3);

  if (parts.length) return parts;

  return [node.shortLabel, node.title].filter(Boolean).slice(0, 2);
}

function buildSpokenMeaning(text: string, node: InfographicNode) {
  return limitWords(`This part explains ${node.title}: ${text}`, 14, 120);
}

function buildShowWhat(text: string, node: InfographicNode) {
  return limitWords(`${node.title} visual: ${text}`, 10, 90);
}


function buildWhyMatchesScript(
  text: string,
  node: InfographicNode,
  visualType: VisualPlanScene['visualType'],
) {
  return limitWords(
    `Full-script planner mapped this spoken part to ${node.title} using ${visualType}.`,
    16,
    140,
  );
}
function buildAssetSearchText(topic: string, text: string, node: InfographicNode) {
  return cleanText(
    `${topic}, ${node.role}, ${node.title}, ${limitWords(text, 8, 80)}, clean educational infographic icon, no clutter`,
  ).slice(0, 180);
}

function pickSfx(
  index: number,
  visualType: VisualPlanScene['visualType'],
  role: InfographicNode['role'],
): VisualPlanScene['sfx'] {
  if (index === 0) return 'boom';
  if (visualType === 'WARNING_RISK_MAP') return 'warning';
  if (visualType === 'SIMPLE_STAT_CARD') return 'cash';
  if (role === 'solution' || role === 'cta') return 'softChime';
  return 'softTick';
}

function pickAnimation(
  visualType: VisualPlanScene['visualType'],
  role: InfographicNode['role'],
): VisualPlanScene['animation'] {
  if (visualType === 'SIMPLE_STAT_CARD') return 'countUp';
  if (visualType === 'WARNING_RISK_MAP') return 'warningPulse';
  if (role === 'solution' || role === 'cta') return 'popIn';
  return 'fadeUp';
}

function pickEmotion(text: string, role: InfographicNode['role']): VisualPlanScene['emotion'] {
  const low = text.toLowerCase();

  if (role === 'solution' || role === 'cta') return 'motivational';
  if (/\b(warning|risk|danger|alert|fraud|scam|loss)\b/.test(low)) return 'urgent';
  if (role === 'problem') return 'serious';

  return 'informative';
}

function extractStatValue(text: string) {
  const match = cleanText(text).match(/(₹\s?\d+[\d,.]*|\$\s?\d+[\d,.]*|\d+%|\d+\s?(lakh|crore|k|m|million|billion))/i);
  return match?.[0];
}

export interface ImageToVideoSceneOutput {
  id: string;
  startSeconds: number;
  endSeconds: number;
  imageUrl: string;
  sceneType: 'image' | 'typography';
  text?: string;
  title?: string;
  typographyPrimary?: string;
  typographySecondary?: string;
  typographyAccent?: string;
  cameraMotion: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down';
  transition: 'hard-cut' | 'dissolve' | 'push-left' | 'push-right';
}

export interface SemanticImageTimelineInput {
  words: Array<{ word: string; start: number; end: number }>;
  totalDuration: number;
  uploadedImages: Array<{ url: string; targetPhrase?: string; title?: string }>;
  stockAssets?: Array<{ id: string; url: string; title?: string; tags?: string[] }>;
  userPrompt?: string;
  visualStyle?: string;
}

export function planSemanticImageToVideoTimeline(
  input: SemanticImageTimelineInput
): ImageToVideoSceneOutput[] {
  const {
    words = [],
    totalDuration,
    uploadedImages = [],
    stockAssets = [],
    userPrompt = '',
  } = input;

  const safeTotalDuration = Math.max(1, Number(totalDuration) || 10);
  const promptLower = (userPrompt || '').toLowerCase();

  // Pacing Rules:
  // MIN_IMAGE_DURATION = 1.8s
  // MAX_IMAGE_DURATION = 4.2s
  const isFastPaced = promptLower.includes('fast') || promptLower.includes('quick') || promptLower.includes('rapid') || promptLower.includes('cut');
  const targetBeatDuration = isFastPaced ? 2.2 : 3.0;
  const MIN_IMAGE_DURATION = 1.8;
  const MAX_IMAGE_DURATION = 4.2;
  const COOLDOWN_SECONDS = 35.0;

  // 1. Build Time Beats (Gapless: 0 to safeTotalDuration)
  const beats: Array<{ startSeconds: number; endSeconds: number; text: string }> = [];

  if (words.length > 0) {
    let currentStart = 0;
    let currentWords: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const wordText = String(w.word || '').trim();
      const wordStart = Number(w.start) || 0;
      const wordEnd = Number(w.end) || wordStart + 0.3;

      if (currentWords.length === 0) {
        currentStart = Math.min(currentStart, wordStart);
      }
      currentWords.push(wordText);

      const durSoFar = wordEnd - currentStart;
      const isLastWord = i === words.length - 1;
      const isSentenceBreak = /[.!?]$/.test(wordText) || (i < words.length - 1 && (Number(words[i + 1].start) - wordEnd) > 0.35);

      if ((durSoFar >= MIN_IMAGE_DURATION && isSentenceBreak) || durSoFar >= MAX_IMAGE_DURATION || isLastWord) {
        beats.push({
          startSeconds: currentStart,
          endSeconds: isLastWord ? Math.max(wordEnd, safeTotalDuration) : wordEnd,
          text: currentWords.join(' '),
        });
        currentStart = wordEnd;
        currentWords = [];
      }
    }

    if (beats.length > 0 && beats[beats.length - 1].endSeconds < safeTotalDuration) {
      beats[beats.length - 1].endSeconds = safeTotalDuration;
    }
  } else {
    const count = Math.max(1, Math.ceil(safeTotalDuration / targetBeatDuration));
    const step = safeTotalDuration / count;
    for (let i = 0; i < count; i++) {
      beats.push({
        startSeconds: i * step,
        endSeconds: i === count - 1 ? safeTotalDuration : (i + 1) * step,
        text: '',
      });
    }
  }

  // Guarantee gapless tiling (beat[i].endSeconds === beat[i+1].startSeconds)
  for (let i = 0; i < beats.length - 1; i++) {
    beats[i + 1].startSeconds = beats[i].endSeconds;
  }
  if (beats.length > 0) {
    beats[0].startSeconds = 0;
    beats[beats.length - 1].endSeconds = safeTotalDuration;
  }

  const motions: Array<'zoom-in' | 'pan-left' | 'zoom-out' | 'pan-right' | 'pan-up' | 'pan-down'> = [
    'zoom-in', 'pan-left', 'zoom-out', 'pan-right', 'pan-up', 'pan-down'
  ];
  const transitions: Array<'hard-cut' | 'dissolve' | 'push-left' | 'push-right'> = [
    'dissolve', 'push-left', 'hard-cut', 'push-right'
  ];

  // 2. Asset Cooldown & Anti-Repetition Tracking
  const lastUsedTimeMap = new Map<string, number>();
  let lastAssignedAsset = '';

  const validUploaded = uploadedImages.filter((img) => img && img.url);
  const validStock = stockAssets.filter((st) => st && st.url);

  const scenes: ImageToVideoSceneOutput[] = [];

  for (let idx = 0; idx < beats.length; idx++) {
    const beat = beats[idx];
    const beatText = beat.text.toLowerCase();
    const currentTime = beat.startSeconds;

    let chosenUrl = '';
    let chosenSceneType: 'image' | 'typography' = 'image';
    let chosenTitle = `Scene ${idx + 1}`;
    let typographyPrimary = '';
    let typographySecondary = '';
    let typographyAccent = '';

    const isAssetEligible = (identifier: string): boolean => {
      if (!identifier) return false;
      if (identifier === lastAssignedAsset) return false;
      const lastUsed = lastUsedTimeMap.get(identifier);
      if (lastUsed !== undefined && (currentTime - lastUsed) < COOLDOWN_SECONDS) {
        return false;
      }
      return true;
    };

    // A. Check for targetPhrase match in uploaded images
    for (const userImg of validUploaded) {
      if (userImg.targetPhrase && userImg.targetPhrase.trim().length > 0) {
        const phraseNorm = userImg.targetPhrase.toLowerCase().trim();
        if (beatText.includes(phraseNorm) && isAssetEligible(userImg.url)) {
          chosenUrl = userImg.url;
          chosenTitle = userImg.title || userImg.targetPhrase;
          break;
        }
      }
    }

    // B. Check for unused / eligible uploaded image
    if (!chosenUrl && validUploaded.length > 0) {
      for (const userImg of validUploaded) {
        if (isAssetEligible(userImg.url)) {
          chosenUrl = userImg.url;
          chosenTitle = userImg.title || `Uploaded Visual ${idx + 1}`;
          break;
        }
      }
    }

    // C. Check for eligible stock asset matching beat text or prompt
    if (!chosenUrl && validStock.length > 0) {
      for (const stock of validStock) {
        if (isAssetEligible(stock.url)) {
          chosenUrl = stock.url;
          chosenTitle = stock.title || `Stock Asset ${idx + 1}`;
          break;
        }
      }
    }

    // D. Fallback to Typography scene if no eligible image is available
    if (!chosenUrl) {
      chosenSceneType = 'typography';
      const wordsArr = beat.text.split(/\s+/).filter((w) => w.length > 2);
      if (wordsArr.length > 0) {
        typographyPrimary = wordsArr.slice(0, 3).join(' ').toUpperCase();
        typographyAccent = 'HIGHLIGHT';
        typographySecondary = beat.text.slice(0, 60);
      } else {
        typographyPrimary = 'KEY INSIGHT';
        typographyAccent = 'INSIGHT';
        typographySecondary = 'Core Visual Beat';
      }
      chosenTitle = 'Typography Insight';
    } else {
      lastUsedTimeMap.set(chosenUrl, beat.endSeconds);
      lastAssignedAsset = chosenUrl;
    }

    scenes.push({
      id: `scene-${String(idx + 1).padStart(2, '0')}`,
      startSeconds: Math.round(beat.startSeconds * 100) / 100,
      endSeconds: Math.round(beat.endSeconds * 100) / 100,
      imageUrl: chosenSceneType === 'image' ? chosenUrl : '',
      sceneType: chosenSceneType,
      text: beat.text,
      title: chosenTitle,
      typographyPrimary,
      typographySecondary,
      typographyAccent,
      cameraMotion: motions[idx % motions.length],
      transition: transitions[idx % transitions.length],
    });
  }

  return scenes;
}

/* ============================================================================
 * VISUAL INTELLIGENCE PIPELINE (APPROVED TARGET ARCHITECTURE)
 * ============================================================================ */

export interface VisualSubBeat {
  subBeatId: string;
  text: string;
  startSeconds: number;
  endSeconds: number;
  visualIntent: string;
  detailedVisualDescription: string;
  requiredObjects: string[];
  requiredActions: string[];
  context: string;
  emotionMood: string;
  quantityScale: 'small_amount' | 'moderate' | 'large_abundance' | 'irrelevant';
  positiveConcepts: string[];
  strongDisqualifiers: string[];
  softPenalties: string[];
  confidenceRequirement: number;
}

export interface CandidateAssetScore {
  assetId: string;
  url: string;
  title: string;
  sourceType: 'stock' | 'upload';
  stage1Score: number;
  stage2Score?: number;
  confidence?: number;
  reasoning?: string;
  disqualifiedReason?: string;
  rawRecord: any;
}

/**
 * Gemini Call 1: Multi-Beat Semantic Visual Intent Planner
 */
export async function generateVisualSceneIntents(
  fullTranscript: string,
  beats: Array<{ startSeconds: number; endSeconds: number; text: string }>
): Promise<VisualSubBeat[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || beats.length === 0) {
    return generateFallbackSubBeats(beats);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert AI Video Director & Visual Intelligence Planner.
Analyze the full spoken video transcript:
"${fullTranscript}"

And these timestamped spoken scene beats:
${JSON.stringify(beats, null, 2)}

For EACH beat, determine if the sentence/phrase contains MULTIPLE distinct visual actions or clauses.
If a beat contains multiple actions, split it into 2 or 3 distinct sub-beats with proportional timestamps.

For EACH sub-beat, extract the DEEP VISUAL INTENT and CONTEXTUAL REQUIREMENTS.
Do NOT perform surface keyword matching. Understand the emotional tone, financial scale, and contextual meaning.

For example:
- "He struggled because he had very little money."
  -> visualIntent: "financial hardship / low income"
  -> quantityScale: "small_amount"
  -> positiveConcepts: ["financial_hardship", "empty_wallet", "poverty", "few_coins", "broke"]
  -> strongDisqualifiers (MUST AVOID): ["wealth", "rich", "luxury", "cash_piles", "millionaire", "stacks_of_money", "mansion"]
  -> softPenalties: ["office_building", "corporate_suit"]

- "He lost his job, struggled to pay rent, and eventually started working two jobs."
  -> Split into 3 sub-beats:
     Sub-Beat 1: "He lost his job" (job loss, packing desk, pink slip)
     Sub-Beat 2: "struggled to pay rent" (financial hardship, unpaid bills)
     Sub-Beat 3: "and eventually started working two jobs." (tired night shift worker, exhaustion)

Return ONLY a strict JSON object with a "subBeats" array:
{
  "subBeats": [
    {
      "subBeatId": "beat-01",
      "text": "spoken segment",
      "startSeconds": 0.0,
      "endSeconds": 2.5,
      "visualIntent": "financial hardship",
      "detailedVisualDescription": "Anxious person counting a few small coins on a wooden table.",
      "requiredObjects": ["wallet", "coins", "table"],
      "requiredActions": ["looking at empty wallet", "counting change"],
      "context": "financial_hardship",
      "emotionMood": "worried",
      "quantityScale": "small_amount",
      "positiveConcepts": ["empty_wallet", "few_coins", "poverty", "low_money"],
      "strongDisqualifiers": ["wealth", "rich", "luxury", "cash_piles", "millionaire"],
      "softPenalties": ["corporate_office"],
      "confidenceRequirement": 60
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    if (Array.isArray(parsed.subBeats) && parsed.subBeats.length > 0) {
      return parsed.subBeats;
    }
  } catch (err) {
    console.warn('[VISUAL_PLANNER] Gemini Intent Planner failed, using deterministic sub-beats:', err instanceof Error ? err.message : err);
  }

  return generateFallbackSubBeats(beats);
}

function generateFallbackSubBeats(
  beats: Array<{ startSeconds: number; endSeconds: number; text: string }>
): VisualSubBeat[] {
  return beats.map((b, idx) => {
    const textLower = b.text.toLowerCase();
    const isLittleMoney = textLower.includes('little money') || textLower.includes('broke') || textLower.includes('empty wallet') || textLower.includes('poverty') || textLower.includes('struggle');
    const isWealth = textLower.includes('wealth') || textLower.includes('rich') || textLower.includes('millionaire') || textLower.includes('cash pile');

    // Extract high-precision keywords (> 3 chars, exclude common filler words)
    const stopWords = new Set(['the', 'and', 'for', 'that', 'this', 'with', 'from', 'they', 'them', 'were', 'had', 'have', 'been', 'about', 'over', 'under', 'into', 'some']);
    const preciseKeywords = textLower
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !stopWords.has(w));

    return {
      subBeatId: `beat-${idx + 1}`,
      text: b.text,
      startSeconds: b.startSeconds,
      endSeconds: b.endSeconds,
      visualIntent: isLittleMoney ? 'financial hardship' : isWealth ? 'wealth abundance' : 'specific scene context',
      detailedVisualDescription: b.text,
      requiredObjects: [],
      requiredActions: [],
      context: isLittleMoney ? 'financial_hardship' : isWealth ? 'wealth_abundance' : 'general',
      emotionMood: isLittleMoney ? 'anxious' : 'cinematic',
      quantityScale: isLittleMoney ? 'small_amount' : isWealth ? 'large_abundance' : 'moderate',
      positiveConcepts: preciseKeywords,
      strongDisqualifiers: isLittleMoney
        ? ['wealth', 'rich', 'luxury', 'cash_piles', 'millionaire']
        : isWealth
        ? ['little_money', 'empty_wallet', 'poverty', 'broke']
        : [],
      softPenalties: [],
      confidenceRequirement: 65,
    };
  });
}

/**
 * Stage 1: Local Candidate Retrieval with Tiered Penalty System
 */
export function retrieveCandidatesForSubBeat(
  subBeat: VisualSubBeat,
  allAssets: any[],
  cooldownMap: Map<string, number>,
  lastAssetUrl: string
): CandidateAssetScore[] {
  const scores: CandidateAssetScore[] = [];

  for (const asset of allAssets) {
    const url = asset.url || asset.src || asset.originalUrl;
    if (!url) continue;

    // Cooldown check (35s)
    if (url === lastAssetUrl) continue;
    const lastUsed = cooldownMap.get(url);
    if (lastUsed !== undefined && (subBeat.startSeconds - lastUsed) < 35.0) {
      continue;
    }

    const titleLower = (asset.title || asset.descriptiveFilename || '').toLowerCase();
    const posConcepts = (asset.positiveConcepts || asset.keywords || asset.positiveTags || []).map((t: string) => String(t).toLowerCase());
    const assetDisqualifiers = (asset.tierDisqualifiers || asset.negativeTags || asset.negativeThemes || []).map((t: string) => String(t).toLowerCase());
    const assetCategory = (asset.category || asset.visualCategory || '').toLowerCase();
    const assetContext = (asset.context || '').toLowerCase();
    const assetScale = asset.quantityScale || 'moderate';
    const assetMood = (asset.emotionMood || asset.mood || '').toLowerCase();

    let stage1Score = 0;
    let hardDisqualified = false;
    let disqualifiedReason = '';

    // A. Check Strong Disqualifiers (HARD PENALTY: -100)
    for (const disq of subBeat.strongDisqualifiers) {
      const disqNorm = disq.toLowerCase().replace(/_/g, ' ');
      const matchInPos = posConcepts.some((p: string) => p.includes(disqNorm) || disqNorm.includes(p));
      const matchInTitle = titleLower.includes(disqNorm);
      const matchInCat = assetCategory.includes(disqNorm);

      if (matchInPos || matchInTitle || matchInCat) {
        hardDisqualified = true;
        disqualifiedReason = `Matched strong disqualifier "${disq}"`;
        break;
      }
    }

    // A2. Check Missing Specific Subject Nouns (HARD PENALTY: -100)
    const textLower = subBeat.text.toLowerCase();
    const explicitSubjects = ['jet', 'yacht', 'subway', 'microscope', 'diner', 'vault', 'bacteria', 'ruins'];
    for (const subj of explicitSubjects) {
      if (textLower.includes(subj)) {
        const matchesSubj = titleLower.includes(subj) || posConcepts.some((p: string) => p.includes(subj));
        if (!matchesSubj) {
          hardDisqualified = true;
          disqualifiedReason = `Missing explicit subject "${subj}"`;
          break;
        }
      }
    }

    if (hardDisqualified) {
      continue; // Hard eliminate from stage 1 candidates
    }

    // B. Check Soft Penalties (-25)
    for (const soft of subBeat.softPenalties) {
      const softNorm = soft.toLowerCase().replace(/_/g, ' ');
      if (titleLower.includes(softNorm) || posConcepts.some((p: string) => p.includes(softNorm))) {
        stage1Score -= 25;
      }
    }

    // C. Positive Concept Overlap (+35 max)
    let conceptHits = 0;
    for (const concept of subBeat.positiveConcepts) {
      const cNorm = concept.toLowerCase();
      if (cNorm.length > 2 && (posConcepts.some((p: string) => p.includes(cNorm) || cNorm.includes(p)) || titleLower.includes(cNorm))) {
        conceptHits++;
      }
    }

    const hasContextMatch = Boolean(subBeat.context && assetContext && subBeat.context === assetContext);

    // STRICT REJECTION: Must have at least 1 positive concept hit or direct context match
    if (conceptHits === 0 && !hasContextMatch) {
      continue; // Filter out completely unrelated assets
    }

    stage1Score += Math.min(35, conceptHits * 12);

    // D. Context Match (+20)
    if (hasContextMatch) {
      stage1Score += 20;
    } else if (subBeat.context && posConcepts.some((p: string) => p.includes(subBeat.context.toLowerCase()))) {
      stage1Score += 12;
    }

    // D2. Required Objects Check (-35 penalty if required objects are missing)
    if (Array.isArray(subBeat.requiredObjects) && subBeat.requiredObjects.length > 0) {
      const hasRequiredObject = subBeat.requiredObjects.some((reqObj) => {
        const rNorm = String(reqObj).toLowerCase().replace(/_/g, ' ');
        return rNorm.length > 2 && (titleLower.includes(rNorm) || posConcepts.some((p: string) => p.includes(rNorm)));
      });
      if (!hasRequiredObject) {
        stage1Score -= 35; // Severe penalty for missing explicit required objects
      }
    }

    // E. Quantity Scale Match (+15)
    if (subBeat.quantityScale && assetScale && subBeat.quantityScale === assetScale) {
      stage1Score += 15;
    } else if (subBeat.quantityScale !== 'irrelevant' && assetScale !== 'irrelevant' && subBeat.quantityScale !== assetScale) {
      stage1Score -= 15; // Mismatch scale penalty
    }

    // F. Emotion / Mood Match (+10)
    if (subBeat.emotionMood && assetMood && subBeat.emotionMood === assetMood) {
      stage1Score += 10;
    }

    // G. Quality Score (+9 max)
    const quality = asset.qualityScore || 80;
    stage1Score += Math.round(quality / 10);

    // STRICT THRESHOLD: Must achieve at least 45 Stage 1 score (meaning genuine concept & context match)
    if (stage1Score >= 45) {
      scores.push({
        assetId: asset.assetId || asset.id || url,
        url,
        title: asset.title || asset.descriptiveFilename || 'Visual Asset',
        sourceType: asset.sourceType || (asset.originalUrl ? 'upload' : 'stock'),
        stage1Score,
        rawRecord: asset,
      });
    }
  }

  // Sort candidates by stage1Score descending and return top 5
  return scores.sort((a, b) => b.stage1Score - a.stage1Score).slice(0, 5);
}

/**
 * Stage 2: Gemini Multimodal Visual Reranker (Single Batch Call)
 */
export async function rerankCandidatesWithGemini(
  subBeats: VisualSubBeat[],
  candidatesMap: Map<string, CandidateAssetScore[]>
): Promise<Map<string, CandidateAssetScore>> {
  const finalAssignments = new Map<string, CandidateAssetScore>();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    // Fallback: pick Top Stage 1 candidate for each sub-beat
    subBeats.forEach((sb) => {
      const cands = candidatesMap.get(sb.subBeatId) || [];
      if (cands.length > 0) {
        finalAssignments.set(sb.subBeatId, { ...cands[0], confidence: Math.min(100, cands[0].stage1Score) });
      }
    });
    return finalAssignments;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const payload = subBeats.map((sb) => ({
      subBeatId: sb.subBeatId,
      text: sb.text,
      visualIntent: sb.visualIntent,
      detailedVisualDescription: sb.detailedVisualDescription,
      quantityScale: sb.quantityScale,
      strongDisqualifiers: sb.strongDisqualifiers,
      candidates: (candidatesMap.get(sb.subBeatId) || []).map((c) => ({
        assetId: c.assetId,
        title: c.title,
        sourceType: c.sourceType,
        stage1Score: c.stage1Score,
      })),
    }));

    const prompt = `You are an expert AI Visual Reranker for professional video editing.
You are given visual sub-beats and top candidate assets for each beat.

Evaluate the candidates for EACH sub-beat based on:
1. Semantic Match (35%): Does the asset communicate the true visual meaning?
2. Visual Context & Setting (20%)
3. Quantity & Scale (15%): Does "little money" match a few coins rather than stacks of cash?
4. Strong Disqualifiers (-100%): Does the candidate contain any forbidden elements?

Candidates payload:
${JSON.stringify(payload, null, 2)}

Return ONLY a strict JSON object:
{
  "rerankedResults": [
    {
      "subBeatId": "beat-01",
      "bestAssetId": "assetId",
      "matchScore": 92,
      "confidence": 95,
      "reasoning": "Direct match for financial hardship and empty wallet."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (Array.isArray(parsed.rerankedResults)) {
      parsed.rerankedResults.forEach((res: any) => {
        const cands = candidatesMap.get(res.subBeatId) || [];
        const matchedCand = cands.find((c) => c.assetId === res.bestAssetId);
        const matchScore = Number(res.matchScore || res.confidence || 0);

        if (matchedCand && matchScore >= 65) {
          finalAssignments.set(res.subBeatId, {
            ...matchedCand,
            stage2Score: matchScore,
            confidence: matchScore,
            reasoning: res.reasoning || 'Gemini visual rerank selection',
          });
        }
      });
    }
  } catch (err) {
    console.warn('[VISUAL_RERANKER] Gemini reranker call failed, using Stage 1 top candidates:', err instanceof Error ? err.message : err);
  }

  // Ensure sub-beats with no candidate >= 65 remain unassigned (triggering Typography Fallback)
  return finalAssignments;
}

/**
 * Main Async Entry Point: Full Visual Intelligence Pipeline
 */
export async function planVisualIntelligenceTimeline(
  input: SemanticImageTimelineInput
): Promise<ImageToVideoSceneOutput[]> {
  const {
    words = [],
    totalDuration,
    uploadedImages = [],
    stockAssets = [],
    userPrompt = '',
  } = input;

  const safeTotalDuration = Math.max(1, Number(totalDuration) || 10);
  const fullTranscript = words.map((w) => w.word).join(' ').trim();

  // 1. Initial Time Beats
  const rawBeats: Array<{ startSeconds: number; endSeconds: number; text: string }> = [];
  if (words.length > 0) {
    let currentStart = 0;
    let currentWords: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const wordText = String(w.word || '').trim();
      const wordStart = Number(w.start) || 0;
      const wordEnd = Number(w.end) || wordStart + 0.3;

      if (currentWords.length === 0) currentStart = Math.min(currentStart, wordStart);
      currentWords.push(wordText);

      const durSoFar = wordEnd - currentStart;
      const isLastWord = i === words.length - 1;
      const isSentenceBreak = /[.!?]$/.test(wordText) || (i < words.length - 1 && (Number(words[i + 1].start) - wordEnd) > 0.35);

      if ((durSoFar >= 1.8 && isSentenceBreak) || durSoFar >= 4.2 || isLastWord) {
        rawBeats.push({
          startSeconds: currentStart,
          endSeconds: isLastWord ? Math.max(wordEnd, safeTotalDuration) : wordEnd,
          text: currentWords.join(' '),
        });
        currentStart = wordEnd;
        currentWords = [];
      }
    }
  } else {
    rawBeats.push({ startSeconds: 0, endSeconds: safeTotalDuration, text: userPrompt || 'Visual Story' });
  }

  // 2. Gemini Call 1: Multi-Beat Semantic Intent Planner
  const subBeats = await generateVisualSceneIntents(fullTranscript, rawBeats);

  // Load Unified Assets Pool (Pre-indexed stock + uploaded images)
  const enrichedStock = readEnrichedStockAssets();
  const allPool = [...uploadedImages.map((u, idx) => ({ ...u, id: `upload-${idx + 1}`, sourceType: 'upload' })), ...enrichedStock];

  // 3. Stage 1 Local Search for Candidates
  const candidatesMap = new Map<string, CandidateAssetScore[]>();
  const cooldownMap = new Map<string, number>();
  let lastAssetUrl = '';

  subBeats.forEach((sb) => {
    const cands = retrieveCandidatesForSubBeat(sb, allPool, cooldownMap, lastAssetUrl);
    candidatesMap.set(sb.subBeatId, cands);
  });

  // 4. Stage 2 Gemini Multimodal Visual Reranker
  const finalAssignments = await rerankCandidatesWithGemini(subBeats, candidatesMap);

  const motions: Array<'zoom-in' | 'pan-left' | 'zoom-out' | 'pan-right' | 'pan-up' | 'pan-down'> = [
    'zoom-in', 'pan-left', 'zoom-out', 'pan-right', 'pan-up', 'pan-down'
  ];
  const transitions: Array<'hard-cut' | 'dissolve' | 'push-left' | 'push-right'> = [
    'dissolve', 'push-left', 'hard-cut', 'push-right'
  ];

  // 5. Build Final Timeline Scenes with Calibrated Decision Matrix
  const scenes: ImageToVideoSceneOutput[] = [];

  for (let idx = 0; idx < subBeats.length; idx++) {
    const sb = subBeats[idx];
    const assignment = finalAssignments.get(sb.subBeatId);
    const confidence = assignment?.confidence || 0;

    let chosenUrl = '';
    let chosenSceneType: 'image' | 'typography' = 'image';
    let chosenTitle = `Scene ${idx + 1}`;
    let typographyPrimary = '';
    let typographySecondary = '';
    let typographyAccent = '';

    const isNumericRequirement = /\b(\d+%|\$\d+|\d+x|statistics|percent)\b/i.test(sb.text);

    // STRICT CALIBRATED DECISION MATRIX
    if (assignment && confidence >= 65 && !isNumericRequirement) {
      // Tier 1 / Tier 2: Excellent or Good Contextual Image Match
      chosenUrl = assignment.url;
      chosenTitle = assignment.title;
      cooldownMap.set(chosenUrl, sb.endSeconds);
      lastAssetUrl = chosenUrl;
    } else {
      // NO_SUITABLE_ASSET or Weak Match (< 65%): Deliberate Typography / Graphic Fallback
      chosenSceneType = 'typography';
      const wordsArr = sb.text.split(/\s+/).filter((w) => w.length > 2);
      typographyPrimary = wordsArr.slice(0, 3).join(' ').toUpperCase() || 'KEY INSIGHT';
      typographyAccent = 'INSIGHT';
      typographySecondary = sb.text.slice(0, 60);
      chosenTitle = 'Typography Insight';
    }

    scenes.push({
      id: `scene-${String(idx + 1).padStart(2, '0')}`,
      startSeconds: Math.round(sb.startSeconds * 100) / 100,
      endSeconds: Math.round(sb.endSeconds * 100) / 100,
      imageUrl: chosenSceneType === 'image' ? chosenUrl : '',
      sceneType: chosenSceneType,
      text: sb.text,
      title: chosenTitle,
      typographyPrimary,
      typographySecondary,
      typographyAccent,
      cameraMotion: motions[idx % motions.length],
      transition: transitions[idx % transitions.length],
    });
  }

  return scenes;
}



