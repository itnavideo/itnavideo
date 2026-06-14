import type { ScriptDetails } from './scriptDetails';

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
  const safeDuration = Math.max(1, Number(durationSeconds) || 30);
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


