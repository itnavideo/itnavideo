/**
 * Responsive Typography & Text Layout Intelligence Engine (16:9 Widescreen / 1920x1080)
 * 
 * Rules:
 * - 1920x1080 Safe Area: Margins ~120-160px X, ~80-120px Y (Default: 140px X, 100px Y)
 * - Controlled Reading Width: Max 1000-1200px for full-stage, Max 680-740px for split-screen (Never stretch to 1800px)
 * - Dynamic Font Scaling: Ranges per layout mode, never unreadable small text floor
 * - Balanced Line Wrapping: Prevents orphans/widows and avoids awkward long single lines
 * - Layout Modes: 'stat' | 'quote' | 'list' | 'headline' | 'short_sentence' | 'paragraph' | 'split'
 * - Multi-Visual-Beat Splitting: Converts long multi-clause text into high-impact sequential visual beats
 */

export type TypographyLayoutMode =
  | 'stat'
  | 'quote'
  | 'list'
  | 'headline'
  | 'short_sentence'
  | 'paragraph'
  | 'split';

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface SafeAreaConfig {
  marginX: number;
  marginY: number;
  maxWidth: number;
  maxHeight: number;
}

export const CANVAS_1080P: CanvasDimensions = {
  width: 1920,
  height: 1080,
};

export const SAFE_AREA_1080P: SafeAreaConfig = {
  marginX: 140, // 120-160px safe margin
  marginY: 100, // 80-120px safe margin
  maxWidth: 1640,
  maxHeight: 880,
};

export interface TypographyRange {
  min: number;
  max: number;
  lineHeight: number;
  letterSpacing: string;
  maxContainerWidth: number;
}

export const TYPOGRAPHY_RANGES: Record<TypographyLayoutMode, TypographyRange> = {
  stat: {
    min: 96,
    max: 150,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    maxContainerWidth: 1100,
  },
  headline: {
    min: 64,
    max: 110,
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
    maxContainerWidth: 1200,
  },
  short_sentence: {
    min: 44,
    max: 64,
    lineHeight: 1.25,
    letterSpacing: '-0.015em',
    maxContainerWidth: 1150,
  },
  paragraph: {
    min: 28,
    max: 42,
    lineHeight: 1.5,
    letterSpacing: 'normal',
    maxContainerWidth: 1000, // Controlled width: never 1800px!
  },
  quote: {
    min: 44,
    max: 72,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    maxContainerWidth: 1100,
  },
  list: {
    min: 28,
    max: 40,
    lineHeight: 1.35,
    letterSpacing: 'normal',
    maxContainerWidth: 1100,
  },
  split: {
    min: 36,
    max: 56,
    lineHeight: 1.2,
    letterSpacing: '-0.015em',
    maxContainerWidth: 720,
  },
};

export interface ContentAnalysisResult {
  layoutMode: TypographyLayoutMode;
  wordCount: number;
  sentenceCount: number;
  charCount: number;
  statData?: {
    value: string;
    label: string;
    trend?: 'up' | 'down' | 'neutral';
  };
  quoteData?: {
    quote: string;
    author: string;
  };
  listItems?: string[];
  suggestedHeading: string;
  suggestedSupportingText: string;
  hasMultipleBeats: boolean;
  visualBeats?: VisualBeat[];
}

export interface VisualBeat {
  beatNumber: number;
  layoutMode: TypographyLayoutMode;
  heading: string;
  supportingText?: string;
  statValue?: string;
  statLabel?: string;
  listItems?: string[];
  quoteAuthor?: string;
  estimatedDurationSec: number;
}

export interface ComputedTypographyLayout {
  layoutMode: TypographyLayoutMode;
  fontSize: number;
  lineHeight: number;
  letterSpacing: string;
  containerWidth: number;
  lines: string[];
  safeArea: SafeAreaConfig;
  statData?: {
    value: string;
    label: string;
    labelFontSize: number;
  };
  listItems?: string[];
  quoteAuthor?: string;
}

/**
 * Natural line wrapping that balances line lengths and eliminates orphan/widow words.
 */
export function balanceLineWraps(text: string, maxCharsPerLine: number): string[] {
  const clean = text.trim().replace(/\s+/g, ' ');
  if (!clean) return [];

  const words = clean.split(' ');
  if (words.length <= 3) return [clean];

  const totalChars = clean.length;
  const estimatedLines = Math.max(1, Math.ceil(totalChars / maxCharsPerLine));
  if (estimatedLines === 1 && totalChars <= maxCharsPerLine) {
    return [clean];
  }

  const targetCharsPerLine = Math.ceil(totalChars / estimatedLines);
  const lines: string[] = [];
  let currentWords: string[] = [];
  let currentLen = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wouldBeLen = currentLen + (currentLen > 0 ? 1 : 0) + word.length;

    // Remaining words check to avoid 1 lonely dangling word on the last line
    const remainingWords = words.length - i;
    if (wouldBeLen > targetCharsPerLine && currentWords.length > 0 && remainingWords > 1) {
      lines.push(currentWords.join(' '));
      currentWords = [word];
      currentLen = word.length;
    } else {
      currentWords.push(word);
      currentLen = wouldBeLen;
    }
  }

  if (currentWords.length > 0) {
    // If the last line has only 1 tiny word and previous line has > 3 words, borrow a word to balance
    if (currentWords.length === 1 && lines.length > 0) {
      const prevLine = lines[lines.length - 1].split(' ');
      if (prevLine.length >= 3) {
        const stolen = prevLine.pop();
        lines[lines.length - 1] = prevLine.join(' ');
        currentWords.unshift(stolen!);
      }
    }
    lines.push(currentWords.join(' '));
  }

  return lines;
}

/**
 * Detects numbers, currency, percentages, views, metrics in text.
 */
function extractStatistic(text: string): { value: string; label: string; trend?: 'up' | 'down' | 'neutral' } | null {
  // Regex to detect values like: $5 billion, $500k, 78%, 3.5x, 10M, 100k views, 5.2 crore
  const statRegex = /(?:\$|€|£|₹)?\s*\b\d+(?:[.,]\d+)?\s*(?:billion|million|trillion|crore|lakh|k|m|b|%|x|times|views|subscribers|users|dollars|rupees)?\b/i;
  const match = text.match(statRegex);

  if (match && match[0].trim().length >= 2) {
    const rawVal = match[0].trim();
    // Only consider it a stat if it has a currency symbol, metric, or percentage, or prominent number
    const isProminent =
      /[$€£₹%]/.test(rawVal) ||
      /\b(billion|million|trillion|crore|lakh|k|m|b|x|views|subscribers|users)\b/i.test(rawVal) ||
      /^\d+([.,]\d+)?%?$/.test(rawVal);

    if (isProminent) {
      let statValue = rawVal.toUpperCase();
      if (!statValue.startsWith('$') && text.includes('$')) {
        statValue = '$' + statValue;
      }
      
      // Clean label by removing the stat value from the sentence
      let label = text.replace(match[0], '').replace(/[.,;:!?]+$/, '').trim();
      label = label.replace(/\s+/g, ' ');
      // Shorten label if too long for clean stat card
      const labelWords = label.split(' ');
      if (labelWords.length > 12) {
        label = labelWords.slice(0, 10).join(' ') + '...';
      }

      return {
        value: statValue,
        label: label || 'Key Performance Metric',
        trend: /growth|increase|surge|rise|record|high/i.test(text) ? 'up' : /drop|decrease|fall|decline|loss/i.test(text) ? 'down' : 'neutral',
      };
    }
  }
  return null;
}

/**
 * Detects lists, bullets, or multi-point enumerations in text.
 */
function extractListItems(text: string): string[] | null {
  // Check for bullet characters or numbered prefixes: 1. 2. or • -
  if (text.includes('\n') && (text.includes('•') || text.includes('-') || /\d+\.\s/.test(text))) {
    const lines = text.split('\n')
      .map((l) => l.replace(/^[\s•\-\d.)]+/, '').trim())
      .filter((l) => l.length > 2);
    if (lines.length >= 2 && lines.length <= 6) return lines;
  }

  // Check for clause patterns: "by automating repetitive tasks, improving decision-making, and helping companies..."
  const listMatch = text.match(/(?:by|including|such as|for example)\s+([A-Za-z0-9\s,\-–—]+(?:and\s+[A-Za-z0-9\s\-–—]+)?)/i);
  if (listMatch) {
    const rawMatch = listMatch[1].replace(/[.!?;]+$/, '');
    const clauses = rawMatch
      .split(/,\s*|\s+and\s+/i)
      .map((c) => c.trim())
      .filter((c) => c.length >= 3 && c.split(' ').length <= 8);
    if (clauses.length >= 2 && clauses.length <= 6) {
      // Capitalize first letter of each item
      return clauses.map((c) => c.charAt(0).toUpperCase() + c.slice(1));
    }
  }

  return null;
}

/**
 * Content Analysis & Layout Classifier
 */
export function analyzeTypographyContent(text: string, options: { isSplitVisual?: boolean } = {}): ContentAnalysisResult {
  const clean = text.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = clean.length;
  const sentenceCount = (clean.match(/[^.!?]+[.!?]+/g) || [clean]).length;

  if (options.isSplitVisual) {
    return {
      layoutMode: 'split',
      wordCount,
      sentenceCount,
      charCount,
      suggestedHeading: words.slice(0, 5).join(' ').toUpperCase(),
      suggestedSupportingText: clean,
      hasMultipleBeats: false,
    };
  }

  // 1. Check for Statistic
  const stat = extractStatistic(clean);
  if (stat && wordCount <= 22) {
    return {
      layoutMode: 'stat',
      wordCount,
      sentenceCount,
      charCount,
      statData: stat,
      suggestedHeading: stat.value,
      suggestedSupportingText: stat.label,
      hasMultipleBeats: false,
    };
  }

  // 2. Check for Quote
  const isQuote = (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith('“') && clean.endsWith('”')) ||
    /\bsaid\b|\bstated\b|\bquoted\b|\baccording to\b/i.test(clean);
  if (isQuote && wordCount >= 5 && wordCount <= 28) {
    let author = 'Key Insight';
    const authorMatch = clean.match(/according to\s+([A-Za-z\s]+)/i);
    if (authorMatch) author = authorMatch[1].trim();
    return {
      layoutMode: 'quote',
      wordCount,
      sentenceCount,
      charCount,
      quoteData: {
        quote: clean.replace(/^["“]|["”]$/g, '').trim(),
        author,
      },
      suggestedHeading: '“' + clean.replace(/^["“]|["”]$/g, '').trim() + '”',
      suggestedSupportingText: author,
      hasMultipleBeats: false,
    };
  }

  // 3. Check for Lists / Multi-clause enumerations
  const listItems = extractListItems(clean);
  if (listItems && listItems.length >= 3) {
    // Check if there is an overarching thesis/intro
    const introPart = clean.split(/(?:by|including|such as|for example)/i)[0].trim();
    const beats: VisualBeat[] = [];
    if (introPart && introPart.split(/\s+/).length >= 4) {
      beats.push({
        beatNumber: 1,
        layoutMode: 'headline',
        heading: introPart,
        estimatedDurationSec: Math.max(2, Math.round(introPart.split(/\s+/).length * 0.35)),
      });
      beats.push({
        beatNumber: 2,
        layoutMode: 'list',
        heading: 'KEY PILLARS',
        listItems,
        estimatedDurationSec: Math.max(3, Math.round(listItems.length * 1.2)),
      });
    }

    return {
      layoutMode: 'list',
      wordCount,
      sentenceCount,
      charCount,
      listItems,
      suggestedHeading: introPart || 'KEY TAKEAWAYS',
      suggestedSupportingText: listItems.join(' • '),
      hasMultipleBeats: beats.length > 1,
      visualBeats: beats.length > 1 ? beats : undefined,
    };
  }

  // 4. Word-count treatment mapping
  if (wordCount <= 3) {
    return {
      layoutMode: 'headline',
      wordCount,
      sentenceCount,
      charCount,
      suggestedHeading: clean.toUpperCase(),
      suggestedSupportingText: '',
      hasMultipleBeats: false,
    };
  }

  if (wordCount <= 8) {
    return {
      layoutMode: 'headline',
      wordCount,
      sentenceCount,
      charCount,
      suggestedHeading: clean,
      suggestedSupportingText: '',
      hasMultipleBeats: false,
    };
  }

  if (wordCount <= 16) {
    return {
      layoutMode: 'short_sentence',
      wordCount,
      sentenceCount,
      charCount,
      suggestedHeading: words.slice(0, 4).join(' ').toUpperCase(),
      suggestedSupportingText: clean,
      hasMultipleBeats: false,
    };
  }

  // Long text (> 16 words): check if multi-beat split is beneficial
  if (wordCount > 20) {
    // Complex sentence with distinct clauses
    const clauses = clean.split(/[,;:]\s+/).filter((c) => c.trim().length > 10);
    if (clauses.length >= 2) {
      const beats: VisualBeat[] = [
        {
          beatNumber: 1,
          layoutMode: 'headline',
          heading: clauses[0].trim(),
          estimatedDurationSec: Math.max(2, Math.round(clauses[0].split(/\s+/).length * 0.35)),
        },
        {
          beatNumber: 2,
          layoutMode: 'short_sentence',
          heading: clauses.slice(1).join(', ').trim(),
          estimatedDurationSec: Math.max(2, Math.round(clauses.slice(1).join(' ').split(/\s+/).length * 0.35)),
        },
      ];
      return {
        layoutMode: 'paragraph',
        wordCount,
        sentenceCount,
        charCount,
        suggestedHeading: words.slice(0, 5).join(' ').toUpperCase(),
        suggestedSupportingText: clean,
        hasMultipleBeats: true,
        visualBeats: beats,
      };
    }
  }

  return {
    layoutMode: 'paragraph',
    wordCount,
    sentenceCount,
    charCount,
    suggestedHeading: words.slice(0, 5).join(' ').toUpperCase(),
    suggestedSupportingText: clean,
    hasMultipleBeats: false,
  };
}

/**
 * Computes exact responsive typography properties, font size, container dimensions,
 * and balanced lines for a 1920x1080 canvas.
 */
export function computeResponsiveLayout(
  text: string,
  options: {
    modeOverride?: TypographyLayoutMode;
    isSplitVisual?: boolean;
    availableWidth?: number;
    availableHeight?: number;
  } = {}
): ComputedTypographyLayout {
  const analysis = analyzeTypographyContent(text, { isSplitVisual: options.isSplitVisual });
  const layoutMode = options.modeOverride || analysis.layoutMode;
  const range = TYPOGRAPHY_RANGES[layoutMode] || TYPOGRAPHY_RANGES.headline;

  const containerWidth = options.availableWidth
    ? Math.min(options.availableWidth, range.maxContainerWidth)
    : range.maxContainerWidth;

  // Maximum character width calculation based on font size estimate
  // At ~60px, ~22 chars fit in 1100px. At ~32px, ~45 chars fit.
  let targetFontSize = range.max;
  const wordCount = analysis.wordCount;

  if (layoutMode === 'headline') {
    if (wordCount <= 3) {
      targetFontSize = Math.min(range.max, 110);
    } else if (wordCount <= 6) {
      targetFontSize = Math.round(range.min + (range.max - range.min) * 0.6); // ~88px
    } else {
      targetFontSize = range.min; // ~64px
    }
  } else if (layoutMode === 'short_sentence') {
    if (wordCount <= 10) {
      targetFontSize = Math.min(range.max, 58);
    } else {
      targetFontSize = range.min; // ~44px
    }
  } else if (layoutMode === 'paragraph') {
    if (wordCount <= 22) {
      targetFontSize = 38;
    } else {
      targetFontSize = range.min; // 28px
    }
  } else if (layoutMode === 'stat') {
    targetFontSize = range.max; // 150px
  } else if (layoutMode === 'quote') {
    targetFontSize = wordCount > 15 ? range.min : range.max;
  } else if (layoutMode === 'split') {
    targetFontSize = wordCount > 8 ? range.min : range.max;
  }

  // Calculate approximate characters per line for natural balance
  const avgCharWidth = targetFontSize * 0.58;
  const maxCharsPerLine = Math.max(12, Math.floor(containerWidth / avgCharWidth));

  let lines = balanceLineWraps(text, maxCharsPerLine);

  // Height overflow check: if lines * lineHeight exceeds safe height, scale down font
  const maxAllowedHeight = options.availableHeight || SAFE_AREA_1080P.maxHeight - 120;
  let simulatedHeight = lines.length * targetFontSize * range.lineHeight;

  while (simulatedHeight > maxAllowedHeight && targetFontSize > range.min) {
    targetFontSize = Math.max(range.min, targetFontSize - 4);
    const updatedAvgCharWidth = targetFontSize * 0.58;
    const updatedMaxChars = Math.max(12, Math.floor(containerWidth / updatedAvgCharWidth));
    lines = balanceLineWraps(text, updatedMaxChars);
    simulatedHeight = lines.length * targetFontSize * range.lineHeight;
  }

  return {
    layoutMode,
    fontSize: Math.round(targetFontSize),
    lineHeight: range.lineHeight,
    letterSpacing: range.letterSpacing,
    containerWidth,
    lines,
    safeArea: SAFE_AREA_1080P,
    statData: analysis.statData
      ? {
          value: analysis.statData.value,
          label: analysis.statData.label,
          labelFontSize: Math.max(24, Math.min(34, Math.round(targetFontSize * 0.28))),
        }
      : undefined,
    listItems: analysis.listItems,
    quoteAuthor: analysis.quoteData?.author,
  };
}
