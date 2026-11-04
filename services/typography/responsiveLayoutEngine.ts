// services/typography/responsiveLayoutEngine.ts
// Universal Responsive Typography Engine for Faceless Video & Remotion Scenes

export type TypographyLayoutMode = 'stat' | 'quote' | 'headline' | 'list' | 'body' | 'dialogue';

export interface ResponsiveLayoutResult {
  layoutMode: TypographyLayoutMode;
  fontSize: number;
  containerWidth: number;
  lineHeight: number;
  letterSpacing: string;
  statData?: {
    value?: string;
    label?: string;
  };
  listItems?: string[];
  quoteAuthor?: string;
}

export function analyzeTypographyContent(text: string): {
  layoutMode: TypographyLayoutMode;
  statData?: { value?: string; label?: string };
  listItems?: string[];
  quoteAuthor?: string;
} {
  const clean = text.trim();

  // 1. Detect Stat numbers ($100K, 85%, 500+, 10x)
  const statRegex = /((?:[\$€£₹]\s*)?\d+(?:\.\d+)?(?:\s*(?:k|m|b|%|x|cr|lakh|percent|times|million|billion))?[\+]?)/i;
  const statMatch = clean.match(statRegex);
  if (statMatch && statMatch[1] && statMatch[1].length >= 2) {
    const val = statMatch[1].trim();
    const lbl = clean.replace(val, '').trim().replace(/^[:\-–—,\s]+|[:\-–—,\s]+$/g, '');
    return {
      layoutMode: 'stat',
      statData: {
        value: val,
        label: lbl || undefined,
      },
    };
  }

  // 2. Detect Bullet/Numbered Lists
  if (/^(?:\d+[\.\)]\s+|[-*•]\s+)/m.test(clean)) {
    const items = clean
      .split(/\r?\n|;\s+/)
      .map((s) => s.replace(/^(?:\d+[\.\)]\s+|[-*•]\s+)/, '').trim())
      .filter(Boolean);
    if (items.length >= 2) {
      return {
        layoutMode: 'list',
        listItems: items,
      };
    }
  }

  // 3. Detect Quotes
  if (/^["'“].*["'”]/s.test(clean) || /\b(?:said|stated|wrote)\b/i.test(clean)) {
    const authorMatch = clean.match(/(?:—|--|-)\s*([A-Z][a-zA-Z\s\.]+)/);
    return {
      layoutMode: 'quote',
      quoteAuthor: authorMatch ? authorMatch[1].trim() : undefined,
    };
  }

  // 4. Headline vs Body based on length
  const wordCount = clean.split(/\s+/).length;
  if (wordCount <= 8) {
    return { layoutMode: 'headline' };
  }

  return { layoutMode: 'body' };
}

export function computeResponsiveLayout(
  text: string,
  options?: {
    modeOverride?: TypographyLayoutMode;
    availableWidth?: number;
    availableHeight?: number;
  }
): ResponsiveLayoutResult {
  const analysis = analyzeTypographyContent(text);
  const mode = options?.modeOverride || analysis.layoutMode;
  const availW = options?.availableWidth || 1400;

  let fontSize = 48;
  let containerWidth = Math.min(availW, 1200);
  let lineHeight = 1.25;
  let letterSpacing = '-0.02em';

  switch (mode) {
    case 'stat':
      fontSize = 96;
      containerWidth = Math.min(availW, 900);
      lineHeight = 1.05;
      letterSpacing = '-0.04em';
      break;
    case 'headline':
      fontSize = 64;
      containerWidth = Math.min(availW, 1100);
      lineHeight = 1.15;
      letterSpacing = '-0.03em';
      break;
    case 'quote':
      fontSize = 44;
      containerWidth = Math.min(availW, 1000);
      lineHeight = 1.35;
      letterSpacing = '-0.01em';
      break;
    case 'list':
      fontSize = 38;
      containerWidth = Math.min(availW, 1100);
      lineHeight = 1.4;
      letterSpacing = 'normal';
      break;
    case 'body':
    default:
      fontSize = 42;
      containerWidth = Math.min(availW, 1200);
      lineHeight = 1.3;
      letterSpacing = '-0.01em';
      break;
  }

  return {
    layoutMode: mode,
    fontSize,
    containerWidth,
    lineHeight,
    letterSpacing,
    statData: analysis.statData,
    listItems: analysis.listItems,
    quoteAuthor: analysis.quoteAuthor,
  };
}

