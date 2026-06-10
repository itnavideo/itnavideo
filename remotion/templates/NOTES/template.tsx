import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BadgeIndianRupee,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CreditCard,
  GraduationCap,
  Landmark,
  Lightbulb,
  Pencil,
  PiggyBank,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  WalletCards,
} from 'lucide-react';
import {Fragment, type CSSProperties} from 'react';

export const TEMPLATE_NAME = 'HANDWRITTEN_NOTES';
export const COMPOSITION_ID = 'HANDWRITTEN-NOTES';

type OverlayType = 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta';
type NoteSceneType =
  | 'noteTitleScene'
  | 'bulletLessonScene'
  | 'flowchartScene'
  | 'timelineScene'
  | 'mindmapScene'
  | 'comparisonNotesScene'
  | 'checklistScene'
  | 'definitionScene'
  | 'summaryBoxScene'
  | 'mistakeCorrectionScene'
  | 'formulaBoxScene'
  | 'comparisonTableScene'
  | 'timelineStripScene'
  | 'documentChecklistScene'
  | 'examDateCardScene'
  | 'prosConsScene'
  | 'stepLadderScene'
  | 'beforeAfterScene'
  | 'calendarReminderScene'
  | 'rankedListScene'
  | 'quoteNoteScene';
type NoteVisualToken =
  | 'heading_write'
  | 'bullet_write'
  | 'diagram_flowchart'
  | 'diagram_timeline'
  | 'diagram_mindmap'
  | 'formula_box'
  | 'comparison_table'
  | 'timeline_strip'
  | 'document_checklist'
  | 'exam_date_card'
  | 'mind_map'
  | 'pros_cons_table'
  | 'step_ladder'
  | 'flowchart_box'
  | 'before_after_box'
  | 'calendar_reminder'
  | 'ranked_list'
  | 'quote_card'
  | 'effect_bracket'
  | 'effect_checkmark'
  | 'effect_xmark'
  | 'arrow_diagram'
  | 'highlight_swipe'
  | 'red_circle';
type NoteRevealItem = {
  text: string;
  start: number;
  end: number;
  token: NoteVisualToken;
};
type NoteItem = {
  text: string;
  emphasis?: string;
  icon?: 'check' | 'dot' | 'warning' | 'star' | 'number';
};
type NoteDiagram = {
  type: 'flowchart' | 'timeline' | 'mindmap' | 'comparison';
  nodes: string[];
  activeNode?: string;
};
type NoteAnnotation = {
  type: 'highlight_swipe' | 'red_circle' | 'arrow_diagram' | 'underline' | 'side_note';
  targetText: string;
  label?: string;
};

type NotesOverlayItem = {
  id?: string;
  start: number;
  end: number;
  type?: OverlayType;
  label?: string;
  text: string;
  body?: string;
  accentWord?: string;
  align?: 'left' | 'center';
  visual?: string;
  sceneType?: NoteSceneType;
  noteItems?: NoteItem[];
  diagram?: NoteDiagram;
  annotations?: NoteAnnotation[];
  revealPlan?: NoteRevealItem[];
  sfx?: 'softPop' | 'softTick' | 'softChime';
};

type ScriptDetailBlock = {
  id: string;
  type:
    | 'processList'
    | 'websiteBox'
    | 'amountBox'
    | 'documentList'
    | 'dateBox'
    | 'warningBox'
    | 'factBox';
  title: string;
  items: string[];
  sourceText: string;
};

type ScriptDetails = {
  topic: string;
  summary: string;
  intent: string;
  keyPoints?: string[];
  processSteps: string[];
  websites: string[];
  amounts: string[];
  documents: string[];
  dates: string[];
  warnings: string[];
  detailBlocks: ScriptDetailBlock[];
};

type BackgroundMusicMood =
  | 'ambient'
  | 'corporate'
  | 'motivational'
  | 'tech'
  | 'study'
  | 'finance'
  | 'motivation'
  | 'news'
  | 'ai'
  | 'documentary'
  | 'viral';

type ReelProps = {
  brand?: string;
  topicTitle?: string;
  template?: typeof TEMPLATE_NAME;
  templateName?: typeof TEMPLATE_NAME;
  design?: string;
  mediaType: 'audio' | 'video';
  mediaSrc?: string;
  mediaTrimStartSeconds?: number;
  durationSeconds?: number;
  backgroundMusic?: boolean;
  backgroundMusicMood?: BackgroundMusicMood;
  backgroundMusicSrc?: string;
  backgroundMusicVolume?: number;
  overlayTimeline?: NotesOverlayItem[];
  scriptDetails?: ScriptDetails;
};

export const fps = 24;
export const width = 1080;
export const height = 1920;
const maxDurationSeconds = 60;
const NOTE_SAFE_TOP = 120;
const NOTE_SAFE_BOTTOM = 320;
const NOTE_SAFE_RIGHT = 140;
const NOTE_SAFE_LEFT = 72;

// Advanced Animation System for Handwritten Notes
// Features:
// - Word-by-word reveal animations
// - Smart text pacing control
// - Visual hierarchy with color coding
// - Drawing effects (arrows, circles, underlines)
// - Professional transitions and emphasis

const INK_COLORS = {
  heading: '#111827',
  body: '#1d4ed8',
  accent: '#b91c1c',
  muted: 'rgba(31, 58, 95, 0.66)',
  highlight: '#fbbf24',
  white: '#ffffff',
  paper: '#ffffff',
};

const ANIMATION_TIMINGS = {
  wordReveal: 0.075,
  lineReveal: 0.2,
  charReveal: 0.032,
  transitionIn: 0.26,
  transitionOut: 0.22,
  emphasis: 0.34,
};

function getWordAnimationTiming(wordIndex: number, startFrame: number, fpsValue: number = fps) {
  const frameDelay = ANIMATION_TIMINGS.wordReveal * fpsValue;
  const wordStartFrame = startFrame + wordIndex * frameDelay;
  const wordEndFrame = wordStartFrame + frameDelay * 1.7;

  return {
    startFrame: wordStartFrame,
    endFrame: wordEndFrame,
    duration: frameDelay,
  };
}

function createWordRevealSequence(text: string, startFrame: number, fpsValue: number = fps) {
  const words = text.split(' ');
  return words.map((word, index) => ({
    word,
    ...getWordAnimationTiming(index, startFrame, fpsValue),
  }));
}

function getWordOpacity(frame: number, startFrame: number, endFrame: number): number {
  if (frame < startFrame) return 0;
  if (frame > endFrame) return 1;
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return easeOutCubic(progress);
}

function easeOutCubic(value: number) {
  const t = clamp(value, 0, 1);
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(value: number) {
  const t = clamp(value, 0, 1);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getNoteExitOpacity(frame: number, endFrame: number, duration: number) {
  if (frame < endFrame - duration) return 1;
  if (frame >= endFrame) return 0;
  return interpolate(frame, [endFrame - duration, endFrame], [1, 0.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function getEmphasisScale(frame: number, startFrame: number, duration: number): number {
  if (frame < startFrame) return 1;
  if (frame > startFrame + duration) return 1;

  const progress = (frame - startFrame) / duration;
  return 1 + Math.sin(progress * Math.PI) * 0.05;
}

function getDrawingRotation(frame: number, startFrame: number, duration: number): number {
  if (frame < startFrame) return 0;
  if (frame > startFrame + duration) return 0;

  const progress = (frame - startFrame) / duration;
  return Math.sin(progress * Math.PI) * 2;
}

function getStrokeDashOffset(
  frame: number,
  startFrame: number,
  duration: number,
  totalLength: number = 100,
): number {
  if (frame < startFrame) return totalLength;
  if (frame > startFrame + duration) return 0;

  const progress = (frame - startFrame) / duration;
  return interpolate(progress, [0, 1], [totalLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function getSlideInX(frame: number, startFrame: number, duration: number, distance: number = 50): number {
  if (frame < startFrame) return -distance;
  if (frame > startFrame + duration) return 0;

  return interpolate(frame, [startFrame, startFrame + duration], [-distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function getFadeScaleEntrance(frame: number, startFrame: number, duration: number) {
  if (frame < startFrame) return {opacity: 0, scale: 0.92};
  if (frame > startFrame + duration) return {opacity: 1, scale: 1};

  const progress = easeOutCubic((frame - startFrame) / duration);
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    scale: interpolate(progress, [0, 1], [0.92, 1]),
  };
}

function getBounceY(frame: number, startFrame: number, duration: number, bounceHeight: number = 10): number {
  if (frame < startFrame) return 0;
  if (frame > startFrame + duration) return 0;

  const progress = (frame - startFrame) / duration;
  return Math.sin(progress * Math.PI * 2) * bounceHeight * (1 - progress);
}

function getColorTransition(
  frame: number,
  startFrame: number,
  duration: number,
  fromColor: string,
  toColor: string,
): string {
  if (frame < startFrame) return fromColor;
  if (frame > startFrame + duration) return toColor;

  const progress = (frame - startFrame) / duration;
  const from = hexToRgb(fromColor);
  const to = hexToRgb(toColor);

  if (!from || !to) return toColor;

  const r = Math.round(interpolate(progress, [0, 1], [from.r, to.r]));
  const g = Math.round(interpolate(progress, [0, 1], [from.g, to.g]));
  const b = Math.round(interpolate(progress, [0, 1], [from.b, to.b]));

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): {r: number; g: number; b: number} | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getHandwritingStroke(frame: number, startFrame: number, duration: number, pathLength: number = 100) {
  const dashOffset = getStrokeDashOffset(frame, startFrame, duration, pathLength);

  return {
    strokeDasharray: pathLength,
    strokeDashoffset: dashOffset,
  };
}

function getHookAnimation(frame: number, startFrame: number, duration: number): {opacity: number; scale: number} {
  const {opacity, scale} = getFadeScaleEntrance(frame, startFrame, duration);
  return {opacity, scale};
}

function getHighlightAnimation(frame: number, startFrame: number, duration: number) {
  if (frame < startFrame) return {opacity: 0, width: '0%'};
  if (frame > startFrame + duration) return {opacity: 0.3, width: '100%'};

  const progress = (frame - startFrame) / duration;
  return {
    opacity: interpolate(progress, [0, 1], [0, 0.3]),
    width: `${progress * 100}%`,
  };
}

function getUnderlineAnimation(frame: number, startFrame: number, duration: number) {
  if (frame < startFrame) return {width: '0%', opacity: 0};
  if (frame > startFrame + duration) return {width: '100%', opacity: 1};

  const progress = (frame - startFrame) / duration;
  return {
    width: `${progress * 100}%`,
    opacity: interpolate(progress, [0, 1], [0, 1]),
  };
}

function getCircleAnimation(frame: number, startFrame: number, duration: number) {
  if (frame < startFrame) return {scale: 0, opacity: 0};
  if (frame > startFrame + duration) return {scale: 1, opacity: 0.8};

  const progress = (frame - startFrame) / duration;
  return {
    scale: interpolate(progress, [0, 1], [0.3, 1]),
    opacity: interpolate(progress, [0, 1], [0, 0.8]),
  };
}

function getArrowAnimation(frame: number, startFrame: number, duration: number) {
  if (frame < startFrame) return {rotation: -45, opacity: 0};
  if (frame > startFrame + duration) return {rotation: 0, opacity: 1};

  const progress = (frame - startFrame) / duration;
  return {
    rotation: interpolate(progress, [0, 1], [-45, 0]),
    opacity: interpolate(progress, [0, 1], [0, 1]),
  };
}

// Advanced Layout System for 9:16 Vertical Reels
// Features:
// - Smart spacing and centering
// - Visual hierarchy management
// - Safe zone calculations
// - Responsive text sizing
// - Balanced element distribution

const VIDEO_DIMENSIONS = {
  width,
  height,
  aspectRatio: 9 / 16,
};

const SAFE_ZONES = {
  top: NOTE_SAFE_TOP,
  bottom: NOTE_SAFE_BOTTOM,
  left: NOTE_SAFE_LEFT,
  right: NOTE_SAFE_RIGHT,
  horizontal: NOTE_SAFE_LEFT + NOTE_SAFE_RIGHT,
  vertical: NOTE_SAFE_TOP + NOTE_SAFE_BOTTOM,
};

const CONTENT_AREA = {
  width: VIDEO_DIMENSIONS.width - SAFE_ZONES.horizontal,
  height: VIDEO_DIMENSIONS.height - SAFE_ZONES.vertical,
  x: SAFE_ZONES.left,
  y: SAFE_ZONES.top,
};

const FONT_SIZES = {
  heroTitle: 108,
  heading1: 72,
  heading2: 56,
  heading3: 48,
  body: 36,
  bodyLarge: 42,
  bodySmall: 32,
  label: 28,
  caption: 24,
  emphasis: 44,
  highlight: 40,
};

const LINE_HEIGHTS = {
  tight: 1.1,
  normal: 1.3,
  relaxed: 1.5,
  loose: 1.8,
};

const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

const COLOR_HIERARCHY = {
  primary: '#0d9488',
  secondary: '#1e3a8a',
  accent: '#991b1b',
  highlight: '#fbbf24',
  muted: 'rgba(31, 58, 95, 0.66)',
  background: '#ffffff',
};

function getCenterX(textWidth: number, containerWidth: number = CONTENT_AREA.width): number {
  return SAFE_ZONES.left + (containerWidth - textWidth) / 2;
}

function getBalancedVerticalPositions(elementCount: number, totalHeight: number = CONTENT_AREA.height): number[] {
  if (elementCount === 0) return [];
  if (elementCount === 1) return [SAFE_ZONES.top + totalHeight / 2];

  const positions: number[] = [];
  const spacing = totalHeight / (elementCount + 1);

  for (let i = 1; i <= elementCount; i++) {
    positions.push(SAFE_ZONES.top + spacing * i);
  }

  return positions;
}

function getResponsiveFontSize(
  text: string,
  maxFontSize: number = FONT_SIZES.heading1,
  minFontSize: number = FONT_SIZES.bodyLarge,
): number {
  const textLength = text.length;

  if (textLength < 20) return maxFontSize;
  if (textLength < 40) return maxFontSize - 8;
  if (textLength < 60) return maxFontSize - 16;
  if (textLength < 100) return maxFontSize - 24;

  return Math.max(minFontSize, maxFontSize - 32);
}

function getTextDimensions(
  text: string,
  fontSize: number,
  fontFamily: string = 'NOTES_Poppins, Arial, sans-serif',
  maxWidth: number = CONTENT_AREA.width,
): {width: number; height: number; lines: number} {
  void fontFamily;
  const charWidth = fontSize * 0.5;
  const estimatedWidth = text.length * charWidth;
  const lines = Math.ceil(estimatedWidth / maxWidth);
  const lineHeight = fontSize * LINE_HEIGHTS.normal;

  return {
    width: Math.min(estimatedWidth, maxWidth),
    height: lines * lineHeight,
    lines,
  };
}

function createBalancedLayout(
  elements: Array<{text: string; fontSize: number}>,
  containerHeight: number = CONTENT_AREA.height,
) {
  const positions = getBalancedVerticalPositions(elements.length, containerHeight);

  return elements.map((element, index) => {
    const dimensions = getTextDimensions(element.text, element.fontSize);

    return {
      ...element,
      x: getCenterX(dimensions.width),
      y: positions[index],
      ...dimensions,
    };
  });
}

function getTextColor(type: 'heading' | 'body' | 'warning' | 'highlight' | 'muted' = 'body'): string {
  const colorMap = {
    heading: COLOR_HIERARCHY.primary,
    body: COLOR_HIERARCHY.secondary,
    warning: COLOR_HIERARCHY.accent,
    highlight: COLOR_HIERARCHY.highlight,
    muted: COLOR_HIERARCHY.muted,
  };

  return colorMap[type];
}

function getBoxBackgroundColor(type: 'highlight' | 'warning' | 'info' | 'success' = 'highlight'): string {
  const colorMap = {
    highlight: 'rgba(251, 191, 36, 0.15)',
    warning: 'rgba(153, 27, 27, 0.1)',
    info: 'rgba(13, 148, 136, 0.1)',
    success: 'rgba(34, 197, 94, 0.1)',
  };

  return colorMap[type];
}

function getPadding(size: 'sm' | 'md' | 'lg' = 'md') {
  const paddingMap = {
    sm: {top: SPACING.sm, right: SPACING.md, bottom: SPACING.sm, left: SPACING.md},
    md: {top: SPACING.md, right: SPACING.lg, bottom: SPACING.md, left: SPACING.lg},
    lg: {top: SPACING.lg, right: SPACING.xl, bottom: SPACING.lg, left: SPACING.xl},
  };

  return paddingMap[size];
}

function getBorderRadius(size: 'sm' | 'md' | 'lg' = 'md'): number {
  const radiusMap = {
    sm: 8,
    md: 12,
    lg: 16,
  };

  return radiusMap[size];
}

function createGridLayout(itemCount: number, containerWidth: number = CONTENT_AREA.width, gapSize: number = SPACING.lg) {
  const columns = itemCount <= 2 ? itemCount : Math.ceil(Math.sqrt(itemCount));
  const rows = Math.ceil(itemCount / columns);
  const itemWidth = (containerWidth - gapSize * (columns - 1)) / columns;
  const positions: Array<{x: number; y: number; width: number}> = [];

  for (let i = 0; i < itemCount; i++) {
    const row = Math.floor(i / columns);
    const col = i % columns;

    positions.push({
      x: SAFE_ZONES.left + col * (itemWidth + gapSize),
      y: SAFE_ZONES.top + row * (itemWidth + gapSize),
      width: itemWidth,
    });
  }

  return {positions, columns, rows, itemWidth};
}

function getOptimalLineBreaks(text: string, maxCharsPerLine: number = 50): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + word).length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  });

  if (currentLine) lines.push(currentLine.trim());

  return lines;
}

function getShadowStyle(level: 1 | 2 | 3 = 1): string {
  const shadowMap = {
    1: '0 2px 4px rgba(0, 0, 0, 0.1)',
    2: '0 4px 8px rgba(0, 0, 0, 0.15)',
    3: '0 8px 16px rgba(0, 0, 0, 0.2)',
  };

  return shadowMap[level];
}

function getAnimationDuration(text: string, baseSpeed: number = 15): number {
  return Math.max(0.5, text.length / baseSpeed);
}

type DrawingEffectProps = {
  type: 'arrow' | 'circle' | 'underline' | 'highlight' | 'bracket';
  startFrame: number;
  duration: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
};

const AnimatedUnderline = ({
  startFrame,
  duration,
  x,
  y,
  width,
  color = INK_COLORS.accent,
  strokeWidth = 3,
  opacity = 1,
}: {
  startFrame: number;
  duration: number;
  x: number;
  y: number;
  width: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}) => {
  const frame = useCurrentFrame();
  const animation = getUnderlineAnimation(frame, startFrame, duration);
  const widthProgress = Number.parseFloat(animation.width) / 100;

  return (
    <svg
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height: strokeWidth + 4,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <line
        x1="0"
        y1={strokeWidth / 2 + 2}
        x2={width * 0.98}
        y2={strokeWidth / 2 + 4}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{
          opacity: animation.opacity * opacity,
          strokeDasharray: width,
          strokeDashoffset: (1 - widthProgress) * width,
        }}
      />
      <line
        x1="8"
        y1={strokeWidth / 2 + 7}
        x2={width * 0.92}
        y2={strokeWidth / 2 + 5}
        stroke={color}
        strokeWidth={Math.max(1, strokeWidth * 0.55)}
        strokeLinecap="round"
        style={{
          opacity: animation.opacity * opacity * 0.42,
          strokeDasharray: width,
          strokeDashoffset: (1 - widthProgress) * width,
        }}
      />
    </svg>
  );
};

const AnimatedCircle = ({
  startFrame,
  duration,
  x,
  y,
  radius,
  color = INK_COLORS.accent,
  strokeWidth = 2,
  opacity = 1,
}: {
  startFrame: number;
  duration: number;
  x: number;
  y: number;
  radius: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}) => {
  const frame = useCurrentFrame();
  const animation = getCircleAnimation(frame, startFrame, duration);
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      style={{
        position: 'absolute',
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        style={{
          opacity: animation.opacity * opacity,
          transform: `scale(${animation.scale})`,
          transformOrigin: `${radius}px ${radius}px`,
          strokeDasharray: circumference,
          strokeDashoffset: (1 - animation.scale) * circumference,
        }}
      />
    </svg>
  );
};

const AnimatedArrow = ({
  startFrame,
  duration,
  x,
  y,
  direction = 'right',
  color = INK_COLORS.accent,
  strokeWidth = 3,
  length = 40,
  opacity = 1,
}: {
  startFrame: number;
  duration: number;
  x: number;
  y: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  color?: string;
  strokeWidth?: number;
  length?: number;
  opacity?: number;
}) => {
  const frame = useCurrentFrame();
  const animation = getArrowAnimation(frame, startFrame, duration);

  const getArrowPath = () => {
    const arrowSize = 12;
    switch (direction) {
      case 'right':
        return `M 0 0 L ${length} 0 M ${length} 0 L ${length - arrowSize} -${arrowSize} M ${length} 0 L ${length - arrowSize} ${arrowSize}`;
      case 'left':
        return `M ${length} 0 L 0 0 M 0 0 L ${arrowSize} -${arrowSize} M 0 0 L ${arrowSize} ${arrowSize}`;
      case 'down':
        return `M 0 0 L 0 ${length} M 0 ${length} L -${arrowSize} ${length - arrowSize} M 0 ${length} L ${arrowSize} ${length - arrowSize}`;
      case 'up':
        return `M 0 ${length} L 0 0 M 0 0 L -${arrowSize} ${arrowSize} M 0 0 L ${arrowSize} ${arrowSize}`;
      default:
        return '';
    }
  };

  return (
    <svg
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: direction === 'left' || direction === 'right' ? length + 20 : 30,
        height: direction === 'up' || direction === 'down' ? length + 20 : 30,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <path
        d={getArrowPath()}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: animation.opacity * opacity,
          transform: `rotate(${animation.rotation}deg)`,
          transformOrigin: '0 0',
          filter: 'drop-shadow(2px 1px 0 rgba(15,118,110,0.08))',
        }}
      />
    </svg>
  );
};

const AnimatedHighlight = ({
  startFrame,
  duration,
  x,
  y,
  width,
  height,
  color = INK_COLORS.highlight,
  opacity = 0.3,
}: {
  startFrame: number;
  duration: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  opacity?: number;
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;
  const settledOpacity = opacity;
  if (frame > startFrame + duration) {
    return (
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
          background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.55), ${color})`,
          opacity: settledOpacity,
          borderRadius: 4,
          transform: 'rotate(-1.4deg)',
          pointerEvents: 'none',
        }}
      />
    );
  }

  const progress = easeOutCubic((frame - startFrame) / duration);
  const animatedWidth = width * progress;
  const pulse = 1 + Math.sin(progress * Math.PI) * 0.08;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: animatedWidth,
        height,
        background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.68), ${color})`,
        opacity: opacity * (0.72 + progress * 0.28),
        borderRadius: 4,
        transform: `rotate(-1.4deg) scaleY(${pulse})`,
        transformOrigin: 'left center',
        pointerEvents: 'none',
      }}
    />
  );
};

const AnimatedBracket = ({
  startFrame,
  duration,
  x,
  y,
  width,
  height,
  type = 'square',
  color = INK_COLORS.accent,
  strokeWidth = 2,
  opacity = 1,
}: {
  startFrame: number;
  duration: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'square' | 'curly' | 'angle';
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}) => {
  const frame = useCurrentFrame();
  const progress = easeOutCubic(Math.max(0, Math.min(1, (frame - startFrame) / duration)));

  const getBracketPath = () => {
    const margin = 8;
    const animatedHeight = height * progress;

    switch (type) {
      case 'square':
        return `
          M ${margin} 0 L 0 0 L 0 ${animatedHeight} L ${margin} ${animatedHeight}
          M ${width - margin} 0 L ${width} 0 L ${width} ${animatedHeight} L ${width - margin} ${animatedHeight}
        `;
      case 'curly':
        return `
          M 0 ${animatedHeight / 3} Q -8 ${animatedHeight / 2} 0 ${(animatedHeight * 2) / 3}
          M ${width} ${animatedHeight / 3} Q ${width + 8} ${animatedHeight / 2} ${width} ${(animatedHeight * 2) / 3}
        `;
      case 'angle':
        return `
          M ${margin} 0 L 0 ${animatedHeight / 2} L ${margin} ${animatedHeight}
          M ${width - margin} 0 L ${width} ${animatedHeight / 2} L ${width - margin} ${animatedHeight}
        `;
      default:
        return '';
    }
  };

  return (
    <svg
      style={{
        position: 'absolute',
        left: x - 10,
        top: y,
        width: width + 20,
        height,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <path
        d={getBracketPath()}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      />
    </svg>
  );
};

const AnimatedCheckmark = ({
  startFrame,
  duration,
  x,
  y,
  size = 30,
  color = INK_COLORS.accent,
  strokeWidth = 3,
  opacity = 1,
}: {
  startFrame: number;
  duration: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}) => {
  const frame = useCurrentFrame();
  const progress = easeOutCubic(Math.max(0, Math.min(1, (frame - startFrame) / duration)));
  const pathLength = 50;
  const offset = pathLength * (1 - progress);

  return (
    <svg
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <path
        d={`M ${size * 0.3} ${size * 0.6} L ${size * 0.5} ${size * 0.8} L ${size * 0.8} ${size * 0.3}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity,
          strokeDasharray: pathLength,
          strokeDashoffset: offset,
        }}
      />
    </svg>
  );
};

const AnimatedXMark = ({
  startFrame,
  duration,
  x,
  y,
  size = 30,
  color = INK_COLORS.accent,
  strokeWidth = 3,
  opacity = 1,
}: {
  startFrame: number;
  duration: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}) => {
  const frame = useCurrentFrame();
  const progress = easeOutCubic(Math.max(0, Math.min(1, (frame - startFrame) / duration)));
  const pathLength = 50;
  const offset = pathLength * (1 - progress);

  return (
    <svg
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <path
        d={`M ${size * 0.2} ${size * 0.2} L ${size * 0.8} ${size * 0.8} M ${size * 0.8} ${size * 0.2} L ${size * 0.2} ${size * 0.8}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity,
          strokeDasharray: pathLength,
          strokeDashoffset: offset,
        }}
      />
    </svg>
  );
};

const DrawingEffect = ({
  type,
  startFrame,
  duration,
  color,
  strokeWidth = 2,
  opacity = 1,
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  direction = 'right',
}: DrawingEffectProps) => {
  switch (type) {
    case 'underline':
      return (
        <AnimatedUnderline
          startFrame={startFrame}
          duration={duration}
          x={x}
          y={y}
          width={width}
          color={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );
    case 'circle':
      return (
        <AnimatedCircle
          startFrame={startFrame}
          duration={duration}
          x={x}
          y={y}
          radius={width / 2}
          color={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );
    case 'arrow':
      return (
        <AnimatedArrow
          startFrame={startFrame}
          duration={duration}
          x={x}
          y={y}
          direction={direction}
          color={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
          length={width}
        />
      );
    case 'highlight':
      return (
        <AnimatedHighlight
          startFrame={startFrame}
          duration={duration}
          x={x}
          y={y}
          width={width}
          height={height}
          color={color}
          opacity={opacity}
        />
      );
    case 'bracket':
      return (
        <AnimatedBracket
          startFrame={startFrame}
          duration={duration}
          x={x}
          y={y}
          width={width}
          height={height}
          color={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );
    default:
      return null;
  }
};

const fontFaces = `
@font-face {
  font-family: NOTES_Poppins;
  src: url("${staticFile('assets/reusable/fonts/Poppins/Poppins-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: NOTES_Poppins;
  src: url("${staticFile('assets/reusable/fonts/Poppins/Poppins-Bold.ttf')}") format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: NOTES_Kalam;
  src: url("${staticFile('assets/reusable/fonts/Kalam/Kalam-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: NOTES_Kalam;
  src: url("${staticFile('assets/reusable/fonts/Kalam/Kalam-Bold.ttf')}") format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: NOTES_Caveat;
  src: url("${staticFile('assets/reusable/fonts/Caveat/Caveat-Variable.ttf')}") format('truetype');
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: NOTES_HandTitle;
  src: url("${staticFile('assets/reusable/fonts/Patrick_Hand/PatrickHand-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: NOTES_HandNote;
  src: url("${staticFile('assets/reusable/fonts/Kalam/Kalam-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: NOTES_Marker;
  src: url("${staticFile('assets/reusable/fonts/Caveat/Caveat-Variable.ttf')}") format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
`;
const audioCueSources: Partial<Record<NonNullable<NotesOverlayItem['sfx']>, string>> = {
  softPop: staticFile('assets/reusable/sound-effects/pop-soft.wav'),
  softTick: staticFile('assets/reusable/sound-effects/digital-tick.wav'),
  softChime: staticFile('assets/reusable/sound-effects/success-chime.wav'),
};
const handwritingSfxSources: Partial<Record<'write' | 'effect' | 'page', string>> = {};
const backgroundMusicSources: Partial<Record<NonNullable<ReelProps['backgroundMusicMood']>, string>> = {};
backgroundMusicSources.ambient = staticFile('assets/reusable/background-music/documentary-light.mp3');
backgroundMusicSources.corporate = staticFile('assets/reusable/background-music/corporate-inspire.mp3');
backgroundMusicSources.motivational = staticFile('assets/reusable/background-music/rise-again.mp3');
backgroundMusicSources.tech = staticFile('assets/reusable/background-music/digital-future.mp3');
backgroundMusicSources.study = staticFile('assets/reusable/background-music/study-motivation.mp3');
backgroundMusicSources.finance = staticFile('assets/reusable/background-music/wealth-building.mp3');
backgroundMusicSources.motivation = staticFile('assets/reusable/background-music/rise-again.mp3');
backgroundMusicSources.news = staticFile('assets/reusable/background-music/information-brief.mp3');
backgroundMusicSources.ai = staticFile('assets/reusable/background-music/digital-future.mp3');
backgroundMusicSources.documentary = staticFile('assets/reusable/background-music/documentary-light.mp3');
backgroundMusicSources.viral = staticFile('assets/reusable/background-music/high-energy-beat.mp3');

const stylesheet = `
:root {
  --paper: #FFFFFF;
  --ink: #111827;
  --muted: rgba(17, 24, 39, 0.62);
  --soft: rgba(29, 78, 216, 0.08);
  --teal: #1D4ED8;
  --teal-dark: #1E3A8A;
  --gold: #FBBF24;
  --note: #FFF1A8;
  --red: #B91C1C;
  --blue-ink: #1D4ED8;
  --heading-ink: #111827;
  --important-ink: #B91C1C;
  --sketch-ink: #1D4ED8;
  --shadow: rgba(52, 44, 24, 0.18);
}
.notes-root {
  --unsafe-top: ${NOTE_SAFE_TOP}px;
  --unsafe-bottom: ${NOTE_SAFE_BOTTOM}px;
  --safe-right: ${NOTE_SAFE_RIGHT}px;
  --safe-left: ${NOTE_SAFE_LEFT}px;
  --content-width: ${CONTENT_AREA.width}px;
  --content-height: ${CONTENT_AREA.height}px;
  --layout-gap: ${SPACING.xl}px;
  --note-padding-top: ${SPACING.sm}px;
  --note-padding-right: ${SPACING.md}px;
  --note-padding-bottom: ${SPACING.md}px;
  --note-padding-left: 0px;
  --note-radius: ${getBorderRadius('md')}px;
  background:
    radial-gradient(circle at 18% 10%, rgba(17,24,39,0.045), transparent 26%),
    linear-gradient(135deg, #e7dfcf, #f5efe3 42%, #ded6c5);
  color: var(--ink);
  font-family: NOTES_Poppins, Arial, sans-serif;
}
.paper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 0;
  background:
    radial-gradient(circle at 18% 12%, rgba(251,191,36,0.045), transparent 26%),
    radial-gradient(circle at 88% 72%, rgba(29,78,216,0.035), transparent 30%),
    #f6f0e4;
  border: none;
  box-shadow: none;
}
.paper.paper-clean {
  --paper: rgba(252,248,240,0.98);
}
.paper.paper-glass {
  --paper: rgba(246,252,249,0.96);
}
.paper.paper-editorial {
  --paper: rgba(252,246,235,0.98);
}
.paper.paper-premium {
  --paper: rgba(248,249,252,0.98);
}
.paper::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 140px;
  background: linear-gradient(180deg, rgba(255,255,255,0.65), transparent);
  pointer-events: none;
  display: none;
}
.paper::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(rgba(17,24,39,0.035) 0.7px, transparent 0.9px),
    linear-gradient(90deg, rgba(255,255,255,0.36), transparent 50%, rgba(17,24,39,0.025));
  background-size: 18px 18px, 100% 100%;
  opacity: 0.55;
  pointer-events: none;
  display: block;
}
.page-content {
  position: absolute;
  z-index: 1;
  top: ${CONTENT_AREA.y + SPACING.xl}px;
  right: ${SAFE_ZONES.right - SPACING.xxl}px;
  bottom: ${SAFE_ZONES.bottom - SPACING.xxl}px;
  left: ${CONTENT_AREA.x}px;
  height: auto;
  box-sizing: border-box;
  overflow: hidden;
  border: 1.5px solid rgba(17, 24, 39, 0.14);
  border-radius: 18px;
  padding: 34px 30px 36px;
  background:
    linear-gradient(90deg, rgba(185,28,28,0.10) 0 2px, transparent 2px 100%) 48px 0 / 100% 100% no-repeat,
    repeating-linear-gradient(180deg, rgba(255,255,255,0.22) 0 53px, rgba(29,78,216,0.10) 54px, rgba(255,255,255,0.22) 56px),
    radial-gradient(circle at 20% 10%, rgba(255,255,255,0.45), transparent 40%),
    #fffaf0;
  box-shadow: 0 34px 80px rgba(17,24,39,0.22), 0 6px 0 rgba(17,24,39,0.035);
}
.page-content::before {
  content: "";
  position: absolute;
  left: -2px;
  top: 0;
  bottom: 0;
  width: 34px;
  background:
    radial-gradient(circle at 18px 42px, rgba(31,58,95,0.16) 0 4px, transparent 5px),
    radial-gradient(circle at 18px 132px, rgba(31,58,95,0.13) 0 4px, transparent 5px),
    radial-gradient(circle at 18px 222px, rgba(31,58,95,0.13) 0 4px, transparent 5px),
    radial-gradient(circle at 18px 312px, rgba(31,58,95,0.13) 0 4px, transparent 5px);
  background-repeat: repeat-y;
  background-size: 34px 360px;
  opacity: 0.7;
  pointer-events: none;
}
.page-content::after {
  content: "";
  position: absolute;
  right: 20px;
  top: 18px;
  width: 86px;
  height: 86px;
  background: linear-gradient(135deg, rgba(255,255,255,0.08) 0 48%, rgba(31,58,95,0.10) 49%, rgba(255,255,255,0.78) 52%);
  border-radius: 0 0 0 18px;
  opacity: 0.62;
  transform: rotate(1deg);
  pointer-events: none;
}
.sticky {
  border-radius: 10px;
  background: rgba(255, 232, 160, 0.88);
  box-shadow: 7px 10px 0 rgba(18,24,38,0.08);
  color: #121826;
  font-family: NOTES_Kalam, cursive;
  font-size: 30px;
  font-weight: 700;
  padding: 14px 24px 10px;
  transform: rotate(1deg);
}
.topic-banner {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 58px 0 18px 124px;
  border: 3px solid var(--gold);
  border-radius: 999px;
  background: rgba(255,255,255,0.82);
  box-shadow: 5px 6px 0 rgba(248,198,61,0.18);
  color: #0d3f3d;
  font-family: NOTES_Kalam, cursive;
  font-size: 34px;
  font-weight: 700;
  padding: 10px 28px 8px;
}
.hero-title {
  position: relative;
  max-width: 830px;
  margin-left: 48px;
  color: #111;
  font-family: NOTES_HandTitle, NOTES_Kalam, cursive;
  font-size: 108px;
  font-weight: 700;
  line-height: 0.88;
  letter-spacing: 0;
  text-transform: uppercase;
}
.hero-title::before {
  content: "";
  position: absolute;
  left: -24px;
  right: 18px;
  top: 46%;
  height: 52px;
  z-index: -1;
  border-radius: 999px;
  background: rgba(248,198,61,0.82);
  transform: rotate(-1deg);
}
.hero-subtitle {
  margin: 16px 0 0 68px;
  color: var(--teal);
  font-family: NOTES_HandNote, NOTES_Kalam, cursive;
  font-size: 62px;
  font-weight: 700;
  line-height: 0.98;
}
.teal-line {
  width: 520px;
  height: 8px;
  margin: 18px 0 0 78px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--teal), rgba(7,143,135,0.08));
}
.intro-card {
  position: relative;
  display: grid;
  grid-template-columns: 82px 1fr;
  gap: 24px;
  min-height: 182px;
  margin: 52px 28px 0 48px;
  border: 2px solid rgba(7,143,135,0.72);
  border-radius: 24px;
  background: rgba(255,255,255,0.82);
  box-shadow: 10px 12px 0 rgba(248,198,61,0.16);
  padding: 28px 32px;
}
.pin {
  position: absolute;
  left: 24px;
  top: -34px;
  color: var(--red);
  font-size: 58px;
  transform: rotate(-18deg);
}
.check-badge {
  display: grid;
  width: 78px;
  height: 78px;
  place-items: center;
  align-self: center;
  border-radius: 999px;
  background: radial-gradient(circle at 28% 24%, #17c8bd, var(--teal-dark));
  color: white;
  font-size: 48px;
  font-weight: 600;
}
.intro-text {
  color: rgba(18,24,38,0.90);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 35px;
  font-weight: 500;
  line-height: 1.42;
}
.intro-text strong {
  color: var(--teal-dark);
  font-weight: 600;
}
.intro-text .accent,
.hero-subtitle .accent {
  color: var(--teal-dark);
  font-weight: 600;
}
.highlight {
  display: inline;
  border-radius: 8px;
  background: rgba(248,198,61,0.64);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0 6px;
}
.content-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.82fr;
  gap: 40px;
  margin: 56px 28px 0 48px;
  align-items: start;
}
.section-label {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  white-space: nowrap;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--teal-dark), var(--teal));
  color: #fff;
  font-family: NOTES_Kalam, cursive;
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  padding: 14px 24px 10px;
  box-shadow: 0 10px 0 rgba(7,143,135,0.12);
}
.steps {
  display: grid;
  gap: 16px;
  margin-top: 24px;
}
.step-row {
  display: grid;
  grid-template-columns: 54px 58px 1fr;
  gap: 16px;
  align-items: center;
  min-height: 84px;
  border-bottom: 2px dotted rgba(7,143,135,0.34);
  padding-bottom: 14px;
}
.step-num {
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  border-radius: 999px;
  background: var(--teal);
  color: #fff;
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 25px;
  font-weight: 600;
}
.step-icon {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 2px solid rgba(18,24,38,0.18);
  border-radius: 999px;
  background: rgba(255,255,255,0.78);
  color: #111;
}
.step-text {
  color: rgba(18,24,38,0.88);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 29px;
  font-weight: 500;
  line-height: 1.28;
}
.side-card {
  position: relative;
  min-height: 470px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255,241,178,0.96), rgba(255,246,206,0.96));
  box-shadow: 12px 14px 0 rgba(18,24,38,0.10);
  padding: 34px 34px 30px;
}
.side-card::before {
  content: "";
  position: absolute;
  left: 34%;
  top: -20px;
  width: 150px;
  height: 42px;
  border-radius: 6px;
  background: rgba(7,143,135,0.35);
}
.side-title {
  color: #111;
  font-family: NOTES_Kalam, cursive;
  font-size: 42px;
  font-weight: 700;
  line-height: 1;
}
.side-title::after {
  content: "";
  display: block;
  width: 72%;
  height: 5px;
  margin-top: 10px;
  border-radius: 999px;
  background: var(--gold);
}
.side-list {
  display: grid;
  gap: 20px;
  margin-top: 30px;
}
.side-item {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 14px;
  align-items: start;
  color: rgba(18,24,38,0.88);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 28px;
  font-weight: 500;
  line-height: 1.28;
}
.mini-check {
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 999px;
  background: rgba(7,143,135,0.12);
  color: var(--teal-dark);
  font-size: 14px;
  font-weight: 700;
  margin-top: 4px;
}
.info-card {
  display: none;
}
.summary-card {
  position: absolute;
  left: 126px;
  right: 70px;
  bottom: 72px;
  display: grid;
  grid-template-columns: 62px 1fr 76px;
  gap: 20px;
  align-items: center;
  border: 2px dashed rgba(18,24,38,0.30);
  border-radius: 20px;
  background: rgba(255,255,255,0.72);
  padding: 22px 32px;
}
.summary-heart {
  color: var(--red);
  font-size: 42px;
}
.summary-text {
  color: rgba(18,24,38,0.90);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 29px;
  font-weight: 500;
  line-height: 1.32;
}
.summary-check {
  display: grid;
  width: 70px;
  height: 70px;
  place-items: center;
  border: 5px solid var(--teal);
  border-radius: 999px;
  color: var(--teal);
  font-size: 46px;
  font-weight: 600;
}
.doodle {
  position: absolute;
  z-index: 1;
  color: var(--teal);
  font-family: NOTES_Kalam, cursive;
  font-weight: 700;
  pointer-events: none;
}
.bulb {
  left: 125px;
  top: 158px;
  color: var(--gold);
  font-size: 70px;
}
.arrow-curve {
  right: 70px;
  top: 160px;
  color: #111;
  font-size: 86px;
  transform: rotate(25deg);
}
.star {
  right: 92px;
  top: 590px;
  color: var(--gold);
  font-size: 72px;
}
.progress {
  position: absolute;
  left: 232px;
  right: 232px;
  bottom: 44px;
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(18,24,38,0.12);
}
.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--gold), var(--teal));
}
.layout-corner-memo .sticky {
  transform: rotate(-2.2deg);
}
.layout-corner-memo .topic-banner {
  margin: 42px 0 12px 12px;
  border-radius: 18px;
  transform: rotate(-1deg);
}
.layout-corner-memo .hero-title {
  margin-left: 0;
  max-width: 780px;
}
.layout-corner-memo .hero-title::before {
  left: 18px;
  right: -110px;
  top: 58%;
  height: 36px;
  transform: rotate(1.4deg);
}
.layout-corner-memo .hero-subtitle {
  margin-left: 22px;
}
.layout-corner-memo .teal-line {
  margin-left: 26px;
  width: 430px;
}
.layout-corner-memo .intro-card {
  min-height: 164px;
  margin: 36px 288px 0 0;
  grid-template-columns: 1fr;
  padding: 28px 40px;
}
.layout-corner-memo .check-badge {
  position: absolute;
  right: -38px;
  top: 42px;
  width: 74px;
  height: 74px;
}
.layout-corner-memo .content-grid {
  grid-template-columns: 0.82fr 1.05fr;
  gap: 34px;
  margin: 44px 28px 0 0;
}
.layout-corner-memo .content-grid > div:first-child {
  grid-column: 2;
}
.layout-corner-memo .side-card {
  grid-column: 1;
  grid-row: 1;
  min-height: 448px;
  transform-origin: top left;
}
.layout-corner-memo .section-label {
  border-radius: 999px 16px 999px 16px;
}
.layout-corner-memo .bulb {
  left: 820px;
  top: 302px;
}
.layout-corner-memo .arrow-curve {
  right: 126px;
  top: 462px;
  transform: rotate(78deg);
}
.layout-corner-memo .star {
  right: 806px;
  top: 822px;
}
.layout-side-rail {
  padding: 52px 72px 54px 132px;
}
.layout-side-rail .sticky {
  border-radius: 999px;
  transform: rotate(0.8deg);
}
.layout-side-rail .topic-banner {
  margin: 52px 0 14px 0;
  border-radius: 14px 999px 999px 14px;
}
.layout-side-rail .hero-title {
  margin-left: 34px;
  max-width: 700px;
  transform: rotate(-0.8deg);
}
.layout-side-rail .hero-title::before {
  left: -42px;
  right: 60px;
  top: 42%;
  height: 46px;
  border-radius: 10px 999px 999px 10px;
}
.layout-side-rail .hero-subtitle {
  margin-left: 38px;
}
.layout-side-rail .intro-card {
  margin: 46px 46px 0 18px;
  border-style: dashed;
  box-shadow: 0 0 0 8px rgba(255,255,255,0.42), 10px 12px 0 rgba(18,24,38,0.08);
}
.layout-side-rail .content-grid {
  grid-template-columns: 1fr 0.66fr;
  gap: 28px;
  margin: 42px 46px 0 18px;
}
.layout-side-rail .side-card {
  min-height: 376px;
  padding: 30px 30px 26px;
}
.layout-side-rail .side-title::after {
  width: 88%;
}
.layout-side-rail .side-list {
  grid-template-columns: 1fr;
  gap: 14px;
  margin-top: 24px;
}
.layout-side-rail .side-item {
  font-size: 25px;
  line-height: 1.22;
}
.layout-side-rail .info-card {
  display: none;
}
.layout-side-rail .summary-card {
  left: 154px;
  right: 86px;
}
.layout-side-rail .bulb {
  left: 842px;
  top: 154px;
}
.layout-side-rail .arrow-curve {
  right: 760px;
  top: 588px;
  transform: rotate(146deg);
}
.layout-side-rail .star {
  right: 96px;
  top: 782px;
}
.layout-index-board .topic-banner {
  margin: 48px 0 16px 400px;
  border-radius: 999px 22px 999px 22px;
}
.layout-index-board .hero-title {
  margin-left: 92px;
  max-width: 760px;
  text-align: center;
}
.layout-index-board .hero-title::before {
  left: -12px;
  right: -16px;
  top: 50%;
  height: 42px;
  transform: rotate(-0.6deg);
}
.layout-index-board .hero-subtitle {
  margin-left: 0;
  text-align: center;
}
.layout-index-board .teal-line {
  margin-left: 254px;
  width: 390px;
}
.layout-index-board .intro-card {
  margin: 42px 74px 0 74px;
  border-radius: 34px 18px 34px 18px;
}
.layout-index-board .content-grid {
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 48px 58px 0 58px;
}
.layout-index-board .step-row {
  grid-template-columns: 48px 1fr;
}
.layout-index-board .step-icon {
  display: none;
}
.layout-index-board .side-card {
  border-radius: 34px 18px 26px 20px;
}
.layout-index-board .bulb {
  left: 114px;
  top: 242px;
}
.layout-index-board .arrow-curve {
  right: 76px;
  top: 336px;
  transform: rotate(28deg);
}
.layout-index-board .star {
  right: 824px;
  top: 658px;
}
.scene-board {
  position: relative;
  height: 100%;
}
.notes-page-mode .scene-main {
  display: none !important;
}
.page-notes {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  justify-items: start;
  gap: var(--layout-gap, 30px);
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}
.page-notes.is-reel-canvas {
  align-content: stretch;
  gap: 0;
  min-height: calc(100% + 120px);
  padding: 22px 0 40px;
}
.page-notes.is-reel-canvas .page-note {
  width: min(980px, 100%);
  min-height: 360px;
  border-radius: 16px 12px 20px 14px;
  padding: 34px 34px 38px 18px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.72)),
    repeating-linear-gradient(90deg, rgba(31,58,95,0.018) 0 1px, transparent 1px 12px);
  clip-path: polygon(0 2%, 5% 0, 12% 1.3%, 20% 0, 30% 1.6%, 42% 0.4%, 53% 1.5%, 66% 0, 77% 1.2%, 88% 0.2%, 100% 1.4%, 99% 97%, 93% 100%, 82% 98.6%, 72% 100%, 60% 98.2%, 49% 99.6%, 37% 98.4%, 26% 100%, 14% 98.7%, 4% 100%, 0 97%);
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.075), 5px 7px 0 rgba(15,118,110,0.035);
}
.page-notes.is-reel-canvas .page-note.is-sticky-note {
  background:
    linear-gradient(180deg, rgba(255,246,180,0.94), rgba(255,238,150,0.82)),
    repeating-linear-gradient(180deg, transparent 0 48px, rgba(121,85,10,0.04) 49px, transparent 50px);
  box-shadow: 0 18px 34px rgba(92,64,10,0.10), 6px 8px 0 rgba(251,191,36,0.16);
}
.page-notes.is-reel-canvas .page-note.is-sticky-note:nth-child(2n) {
  background:
    linear-gradient(180deg, rgba(225,246,255,0.92), rgba(205,238,255,0.80)),
    repeating-linear-gradient(180deg, transparent 0 48px, rgba(31,58,95,0.04) 49px, transparent 50px);
}
.page-notes.is-reel-canvas .page-note.is-sticky-note:nth-child(3n) {
  background:
    linear-gradient(180deg, rgba(255,232,232,0.92), rgba(255,218,224,0.78)),
    repeating-linear-gradient(180deg, transparent 0 48px, rgba(190,18,60,0.035) 49px, transparent 50px);
}
.paper-fold {
  position: absolute;
  right: 0;
  top: 0;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(255,255,255,0.02) 0 50%, rgba(31,58,95,0.13) 51%, rgba(255,255,255,0.82) 56%);
  border-radius: 0 0 0 14px;
  opacity: 0.78;
  pointer-events: none;
  z-index: 5;
}
.note-tape {
  position: absolute;
  left: 44%;
  top: -18px;
  width: 146px;
  height: 34px;
  border-radius: 3px;
  background: repeating-linear-gradient(45deg, rgba(255,255,255,0.74) 0 9px, rgba(255,245,190,0.74) 10px 18px);
  box-shadow: 0 4px 8px rgba(15,23,42,0.08);
  opacity: 0.72;
  transform: rotate(-2deg);
  pointer-events: none;
  z-index: 6;
}
.note-scribble {
  position: absolute;
  right: 28px;
  bottom: 22px;
  width: 112px;
  height: 42px;
  opacity: 0.28;
  pointer-events: none;
  z-index: 1;
}
.note-scribble::before,
.note-scribble::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 14px;
  border-bottom: 4px solid currentColor;
  border-radius: 50%;
  transform: rotate(-8deg);
}
.note-scribble::after {
  top: 13px;
  left: 20px;
  right: 12px;
  transform: rotate(6deg);
}
.page-notes.is-reel-canvas .page-note.is-priority-hero {
  width: min(1040px, 100%);
  min-height: 720px;
  padding-top: 96px;
  padding-bottom: 72px;
}
.page-notes.is-reel-canvas .page-note.is-priority-major {
  width: min(1000px, 100%);
  min-height: 520px;
}
.page-notes.is-reel-canvas .page-note.is-priority-medium {
  width: min(900px, 94%);
  min-height: 360px;
}
.page-notes.is-reel-canvas .page-note.is-priority-support {
  width: min(780px, 86%);
  min-height: 260px;
  padding-top: 24px;
  padding-bottom: 26px;
  opacity: 0.92;
}
.page-notes.is-reel-canvas .page-note.is-priority-hero .page-note-title {
  font-size: 102px;
  max-width: 960px;
}
.page-notes.is-reel-canvas .page-note.is-priority-major .page-note-title {
  font-size: 74px;
  max-width: 900px;
}
.page-notes.is-reel-canvas .page-note.is-priority-medium .page-note-title {
  font-size: 58px;
  max-width: 800px;
}
.page-notes.is-reel-canvas .page-note.is-priority-support .page-note-title {
  font-size: 44px;
  max-width: 700px;
}
.page-notes.is-reel-canvas .page-note.is-priority-hero .page-note-body,
.page-notes.is-reel-canvas .page-note.is-priority-major .page-note-body {
  font-size: 46px;
}
.page-notes.is-reel-canvas .page-note.is-priority-support .page-note-body {
  font-size: 32px;
}
.page-notes.is-reel-canvas .page-note.is-active-focus {
  z-index: 12;
  filter: saturate(1.12) contrast(1.04);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.12), 7px 9px 0 rgba(251,191,36,0.12);
}
.page-notes.is-reel-canvas .page-note.is-background-note {
  filter: saturate(0.82) contrast(0.92);
}
.page-notes.is-reel-canvas .page-note.is-background-note .page-note-title,
.page-notes.is-reel-canvas .page-note.is-background-note .page-note-body,
.page-notes.is-reel-canvas .page-note.is-background-note .note-structure-visual,
.page-notes.is-reel-canvas .page-note.is-background-note .page-note-support {
  opacity: 0.48;
}
.page-notes.is-reel-canvas .page-note.is-active-focus::after {
  content: "";
  position: absolute;
  inset: -28px -22px;
  z-index: -1;
  border-radius: 34px 22px 38px 24px;
  background: radial-gradient(circle at 38% 30%, rgba(251,191,36,0.22), transparent 58%);
  opacity: var(--focus-glow, 0.85);
  pointer-events: none;
}
.focus-scribble {
  position: absolute;
  left: 18px;
  top: 18px;
  z-index: 7;
  color: var(--important-ink);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 38px;
  line-height: 1;
  opacity: var(--focus-mark, 0);
  transform: rotate(-12deg);
  pointer-events: none;
}
.focus-arrow {
  position: absolute;
  right: 32px;
  top: 42px;
  z-index: 7;
  width: 116px;
  height: 44px;
  opacity: var(--focus-mark, 0);
  pointer-events: none;
}
.focus-arrow::before {
  content: "";
  position: absolute;
  left: 0;
  right: 20px;
  top: 22px;
  border-bottom: 5px solid var(--important-ink);
  border-radius: 50%;
  transform: rotate(-8deg);
}
.focus-arrow::after {
  content: "";
  position: absolute;
  right: 11px;
  top: 12px;
  width: 24px;
  height: 24px;
  border-right: 5px solid var(--important-ink);
  border-bottom: 5px solid var(--important-ink);
  transform: rotate(-42deg);
}
.marker-nib {
  position: absolute;
  z-index: 8;
  width: 54px;
  height: 22px;
  border-radius: 8px 3px 3px 8px;
  background: linear-gradient(90deg, #121826, #2f3a48 72%, var(--gold) 73%);
  box-shadow: 0 4px 8px rgba(15,23,42,0.10);
  opacity: var(--marker-nib, 0);
  transform: translateX(var(--marker-x, 0px)) rotate(-5deg);
  pointer-events: none;
}
.note-stamp {
  position: absolute;
  right: 44px;
  bottom: 42px;
  z-index: 8;
  display: grid;
  min-width: 132px;
  height: 64px;
  place-items: center;
  border: 5px solid currentColor;
  border-radius: 10px;
  color: var(--important-ink);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 28px;
  line-height: 1;
  opacity: var(--stamp, 0);
  transform: rotate(-9deg) scale(var(--stamp-scale, 0.82));
  pointer-events: none;
}
.motion-checkbox {
  position: absolute;
  left: 24px;
  bottom: 36px;
  z-index: 8;
  width: 58px;
  height: 58px;
  border: 5px solid var(--heading-ink);
  border-radius: 12px;
  background: rgba(255,255,255,0.58);
  opacity: var(--checkbox, 0);
  transform: rotate(-4deg) scale(var(--checkbox-scale, 0.9));
  pointer-events: none;
}
.motion-checkbox::after {
  content: "";
  position: absolute;
  left: 12px;
  top: 16px;
  width: 28px;
  height: 16px;
  border-left: 6px solid var(--heading-ink);
  border-bottom: 6px solid var(--heading-ink);
  transform: rotate(-45deg) scaleX(var(--check-draw, 0));
  transform-origin: left bottom;
}
.side-note-chip {
  position: absolute;
  right: 26px;
  top: 112px;
  z-index: 8;
  max-width: 210px;
  border: 3px solid var(--blue-ink);
  border-radius: 12px;
  background: rgba(255,255,255,0.72);
  color: var(--blue-ink);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.08;
  opacity: var(--side-note, 0);
  padding: 10px 12px;
  transform: rotate(3deg) translateY(calc((1 - var(--side-note, 0)) * 10px));
  pointer-events: none;
}
.ranking-badge {
  position: absolute;
  left: -18px;
  top: -18px;
  z-index: 8;
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  border: 5px solid var(--important-ink);
  border-radius: 999px;
  background: #fff;
  color: var(--important-ink);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 34px;
  line-height: 1;
  opacity: var(--rank, 0);
  transform: rotate(-8deg) scale(var(--rank-scale, 0.82));
  pointer-events: none;
}
.correction-mark {
  position: absolute;
  right: 28px;
  top: 26px;
  z-index: 8;
  color: var(--important-ink);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 46px;
  line-height: 1;
  opacity: var(--correction, 0);
  transform: rotate(-10deg) scale(var(--correction-scale, 0.86));
  pointer-events: none;
}
.keyword-box {
  position: absolute;
  left: 128px;
  top: 24px;
  z-index: 1;
  width: min(560px, 70%);
  height: 94px;
  border: 4px solid rgba(29,78,216,0.36);
  border-radius: 14px 10px 18px 12px;
  opacity: var(--keyword-box, 0);
  transform: rotate(-1deg) scaleX(var(--keyword-box, 0));
  transform-origin: left center;
  pointer-events: none;
}
.page-flip {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  perspective: 1200px;
  overflow: hidden;
}
.page-flip-sheet {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(190,18,60,0.07) 0 2px, transparent 2px 100%) 74px 0 / 100% 100% no-repeat,
    repeating-linear-gradient(180deg, #fff 0 54px, rgba(31,58,95,0.045) 55px, #fff 56px);
  box-shadow: -24px 0 44px rgba(15,23,42,0.12);
  transform-origin: right center;
  opacity: var(--page-flip-opacity, 0);
  transform: rotateY(var(--page-flip-rot, -90deg)) translateX(var(--page-flip-x, 0px));
}
.page-notes.is-reel-canvas .page-note + .page-note {
  margin-top: -62px;
}
.page-notes.is-reel-canvas .page-note:nth-child(2n) {
  margin-left: 74px;
  transform: rotate(1.2deg);
}
.page-notes.is-reel-canvas .page-note:nth-child(3n) {
  margin-left: 18px;
  transform: rotate(-1deg);
}
.page-notes.is-reel-canvas .page-note:nth-child(1) {
  z-index: 4;
}
.page-notes.is-reel-canvas .page-note:nth-child(2) {
  z-index: 3;
}
.page-notes.is-reel-canvas .page-note:nth-child(3) {
  z-index: 2;
}
.page-notes.is-reel-canvas .page-note-title {
  font-size: 60px;
  max-width: 820px;
}
.page-notes.is-reel-canvas .page-note-body {
  font-size: 44px;
  max-width: 830px;
}
.page-notes.is-reel-canvas .note-structure-visual {
  font-size: 34px;
  min-height: 92px;
}
.page-notes.is-reel-canvas.is-sparse .page-note {
  min-height: 520px;
}
.page-notes.is-reel-canvas.is-sparse .page-note:first-child {
  min-height: 720px;
}
.page-notes.is-reel-canvas.is-spread .page-note {
  min-height: 430px;
}
.page-content {
  transform-origin: 50% 38%;
  will-change: transform, opacity;
  backface-visibility: hidden;
}
.page-theme-1 .page-note:first-child {
  margin-left: 26px;
}
.page-theme-1 .page-note.is-step-ladder,
.page-theme-1 .page-note.is-timeline-strip {
  min-height: 310px;
}
.page-theme-2 .page-note.is-warning,
.page-theme-2 .page-note.is-before-after {
  min-height: 290px;
}
.page-theme-3 .page-note.is-quote-note,
.page-theme-3 .page-note.is-action:last-child {
  min-height: 330px;
}
.page-notes.is-sparse {
  gap: 0;
}
.page-notes.is-spread {
  align-content: stretch;
  min-height: calc(100% - 12px);
}
.page-notes.is-spread .page-note {
  min-height: 360px;
}
.page-notes.is-airy {
  align-content: stretch;
  padding-bottom: 40px;
}
.page-notes.is-airy .page-note {
  min-height: 460px;
}
.page-notes.is-packed {
  gap: 16px;
}
.page-notes.is-packed .page-note {
  min-height: 116px;
}
.page-notes.is-dense {
  gap: 22px;
}
.page-notes.is-sparse .page-note {
  min-height: 520px;
}
.page-notes.is-sparse .page-note-title {
  font-size: 66px;
}
.page-notes.is-sparse .page-note-body {
  font-size: 46px;
  max-width: 900px;
}
.page-notes.is-sparse .page-note:first-child .page-note-title {
  font-size: 92px;
}
.page-notes.is-sparse .page-note.is-date .page-note-title,
.page-notes.is-sparse .page-note.is-money .page-note-title {
  font-size: 58px;
}
.page-note {
  position: relative;
  display: grid;
  grid-template-columns: 118px 1fr;
  gap: 16px 26px;
  min-height: 138px;
  width: 100%;
  padding: var(--note-padding-top, 12px) var(--note-padding-right, 16px) var(--note-padding-bottom, 16px) var(--note-padding-left, 0);
  border-radius: var(--note-radius, 12px);
  transform-origin: left center;
}
.page-note-title {
  position: relative;
  grid-column: 2;
  width: fit-content;
  max-width: 800px;
  color: var(--heading-ink);
  font-family: NOTES_Marker, NOTES_Caveat, NOTES_Kalam, cursive;
  font-size: 48px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.05;
}
.page-note-title,
.page-note-body {
  z-index: 2;
}
.advanced-word {
  display: inline-block;
  font-weight: inherit;
  text-shadow: 0 0 0.35px currentColor;
  will-change: opacity, transform;
}
.page-note:first-child .page-note-title {
  grid-column: 1 / -1;
  color: var(--heading-ink);
  font-family: NOTES_Marker, NOTES_Caveat, NOTES_Kalam, cursive;
  font-size: 66px;
  margin-top: 0;
}
.page-theme-0 .page-note.is-hero:first-child {
  min-height: 430px;
  align-content: center;
  padding-top: 120px;
}
.page-theme-0 .page-note.is-hero:first-child .page-note-title {
  max-width: 930px;
  color: var(--important-ink);
  font-size: 92px;
  line-height: 0.98;
  transform: rotate(-1deg);
}
.page-theme-0 .page-note.is-hero:first-child .page-note-title::after {
  content: "?";
  position: absolute;
  right: -88px;
  top: -32px;
  color: rgba(190,18,60,0.42);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 118px;
  transform: rotate(9deg);
}
.page-theme-0 .page-note.is-hero:first-child .page-note-title .writing-wrap::before {
  content: "";
  position: absolute;
  left: -12px;
  right: -22px;
  bottom: 2px;
  height: 24px;
  border-radius: 999px;
  background: rgba(251,191,36,0.72);
  transform: rotate(-2deg);
  z-index: -1;
}
.page-theme-0 .page-note.is-hero:first-child .page-note-body {
  display: none;
}
.page-note-body {
  grid-column: 2;
  max-width: 800px;
  color: var(--blue-ink);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 38px;
  font-weight: 600;
  line-height: 1.30;
  text-shadow: none;
}
.page-note.is-date .page-note-title,
.page-note.is-money .page-note-title {
  display: inline-block;
  width: fit-content;
  max-width: 760px;
  border: none;
  border-radius: 0;
  padding: 0;
  color: var(--important-ink);
  font-family: NOTES_Marker, NOTES_Caveat, NOTES_Kalam, cursive;
  font-size: 54px;
  font-weight: 700;
  line-height: 1.05;
}
.page-note.is-date .page-note-title .writing-wrap::before,
.page-note.is-money .page-note-title .writing-wrap::before {
  opacity: 0;
}
.page-note.is-warning .page-note-title {
  color: var(--important-ink);
}
.page-note.is-warning .page-note-body {
  border-left: 6px solid rgba(190,18,60,0.52);
  padding-left: 20px;
}
.page-note.is-formula {
  grid-template-columns: 96px 1fr;
  border: 2px solid rgba(15,118,110,0.22);
  background: rgba(13,148,136,0.06);
  padding-left: 18px;
}
.page-note.is-formula .page-note-title::before {
  content: "ƒ";
  position: absolute;
  left: -96px;
  top: 4px;
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border: 3px solid rgba(15,118,110,0.42);
  border-radius: 14px;
  color: var(--heading-ink);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 42px;
}
.page-note.is-comparison {
  grid-template-columns: 96px 1fr;
  border-left: 6px solid rgba(31,58,138,0.28);
  background: linear-gradient(90deg, rgba(31,58,138,0.06), transparent 72%);
}
.page-note.is-comparison::before {
  content: "vs";
  position: absolute;
  left: 36px;
  top: 42px;
  color: rgba(31,58,138,0.52);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 42px;
  transform: rotate(-8deg);
}
.page-note.is-comparison .page-note-body {
  display: inline-block;
  border-top: 2px dashed rgba(31,58,138,0.22);
  padding-top: 10px;
}
.page-note.is-timeline-strip {
  border-bottom: 2px solid rgba(15,118,110,0.20);
}
.page-note.is-timeline-strip::before {
  content: "";
  position: absolute;
  left: 102px;
  right: 72px;
  bottom: 12px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(15,118,110,0.12), rgba(15,118,110,0.58), rgba(190,18,60,0.32));
}
.page-note.is-timeline-strip .page-note-title::after {
  content: "";
  position: absolute;
  left: 0;
  right: auto;
  bottom: -34px;
  width: 14px;
  height: 14px;
  border: 3px solid var(--heading-ink);
  border-radius: 999px;
  background: #fff;
}
.page-note.is-document-list {
  border: 2px dashed rgba(31,58,138,0.18);
  background: rgba(255,255,255,0.72);
}
.page-note.is-document-list .page-note-body {
  color: var(--blue-ink);
}
.page-note.is-document-list .page-note-title::before {
  content: "✓";
  position: absolute;
  left: -78px;
  top: 8px;
  color: var(--heading-ink);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 42px;
}
.page-note.is-exam-date {
  border: 2px solid rgba(190,18,60,0.20);
  background: rgba(190,18,60,0.055);
}
.page-note.is-exam-date .page-note-title {
  color: var(--important-ink);
}
.page-note.is-mind-map {
  border-left: 5px solid rgba(15,118,110,0.22);
  background: radial-gradient(circle at 18% 32%, rgba(251,191,36,0.12), transparent 30%), rgba(255,255,255,0.64);
}
.page-note.is-pros-cons,
.page-note.is-before-after {
  background: linear-gradient(90deg, rgba(15,118,110,0.055), rgba(31,58,138,0.045));
}
.page-note.is-step-ladder {
  border: 2px solid rgba(15,118,110,0.16);
  background: linear-gradient(180deg, rgba(13,148,136,0.09), transparent);
  padding-top: 28px;
  padding-bottom: 28px;
}
.page-note.is-step-ladder .note-structure-visual {
  align-items: flex-end;
  gap: 14px;
  min-height: 86px;
  font-size: 31px;
}
.page-note.is-flowchart-box {
  border: 2px solid rgba(31,58,138,0.14);
  background: rgba(31,58,138,0.04);
}
.page-note.is-calendar-reminder {
  border: 2px solid rgba(190,18,60,0.18);
  background: linear-gradient(180deg, rgba(190,18,60,0.055), rgba(255,255,255,0.65));
}
.page-note.is-ranked-list {
  border-left: 6px solid rgba(251,191,36,0.52);
}
.page-note.is-quote-note {
  border-left: 6px solid rgba(15,118,110,0.26);
  background: rgba(251,191,36,0.075);
  min-height: 250px;
  align-content: center;
}
.page-note.is-before-after .note-structure-visual,
.page-note.is-pros-cons .note-structure-visual,
.page-note.is-timeline-strip .note-structure-visual,
.page-note.is-document-list .note-structure-visual {
  min-height: 76px;
  font-size: 30px;
}
.page-note.is-before-after .visual-pill,
.page-note.is-step-ladder .visual-pill,
.page-note.is-timeline-strip .visual-pill {
  min-height: 48px;
  padding: 9px 18px 7px;
}
.page-note.is-quote-note .page-note-title::before {
  content: "“";
  position: absolute;
  left: -76px;
  top: -14px;
  color: rgba(15,118,110,0.28);
  font-family: Georgia, serif;
  font-size: 86px;
  line-height: 1;
}
.page-note.is-bracket {
  background: rgba(15,118,110,0.045);
}
.note-structure-visual {
  grid-column: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 760px;
  min-height: 44px;
  color: var(--heading-ink);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 29px;
  font-weight: 600;
  line-height: 1;
}
.page-note:first-child .note-structure-visual {
  grid-column: 1;
}
.note-structure-visual .visual-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  border: 2px solid rgba(15,118,110,0.22);
  border-radius: 999px;
  background: rgba(255,255,255,0.68);
  padding: 6px 14px 4px;
  text-shadow: 0 0 0.25px currentColor;
}
.note-structure-visual .visual-arrow {
  color: rgba(31,58,138,0.52);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 34px;
}
.note-structure-visual.is-comparison .visual-pill {
  min-width: 150px;
  border-color: rgba(31,58,138,0.22);
}
.note-structure-visual.is-formula .visual-pill:first-child {
  color: var(--important-ink);
  border-color: rgba(190,18,60,0.22);
}
.note-structure-visual.is-docs {
  flex-wrap: wrap;
}
.note-structure-visual.is-docs .visual-pill::before {
  content: "✓";
  margin-right: 8px;
  color: var(--heading-ink);
}
.note-structure-visual.is-exam .visual-pill {
  border-color: rgba(190,18,60,0.24);
  color: var(--important-ink);
  background: rgba(190,18,60,0.06);
}
.note-structure-visual.is-ladder .visual-pill {
  border-radius: 10px;
  transform: translateY(calc(var(--i, 0) * -6px));
}
.note-structure-visual.is-ranked .visual-pill,
.note-structure-visual .visual-pill.is-rank {
  border-color: rgba(251,191,36,0.44);
  background: rgba(255,248,215,0.78);
}
.note-structure-visual .visual-pill.is-positive {
  border-color: rgba(15,118,110,0.30);
  background: rgba(13,148,136,0.08);
}
.note-structure-visual .visual-pill.is-negative {
  border-color: rgba(190,18,60,0.24);
  background: rgba(190,18,60,0.055);
  color: var(--important-ink);
}
.note-structure-visual .visual-pill.is-step {
  border-radius: 12px;
  min-width: 116px;
}
.note-structure-visual .visual-pill.is-branch {
  border-radius: 18px 999px 999px 18px;
}
.note-structure-visual .visual-pill.is-date-chip {
  border-color: rgba(190,18,60,0.28);
  color: var(--important-ink);
  background: rgba(190,18,60,0.055);
}
.note-structure-visual .visual-pill.is-quote {
  max-width: 720px;
  border-color: rgba(15,118,110,0.18);
  border-radius: 14px;
  background: rgba(255,248,215,0.72);
}
.page-note:nth-child(2n) {
  margin-left: 42px;
}
.page-note:nth-child(3n) {
  margin-left: 0;
}
.page-note:first-child {
  grid-template-columns: 1fr;
  min-height: 164px;
  margin-left: 0;
}
.page-note:first-child .page-note-body {
  grid-column: 1;
  max-width: 900px;
  font-size: 38px;
}
.page-note:first-child .page-note-support {
  grid-column: 1;
  grid-row: auto;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-height: 70px;
}
.page-note-support {
  grid-column: 1;
  grid-row: 1 / span 2;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  min-height: 112px;
  color: var(--sketch-ink);
  opacity: var(--support, 0);
}
.page-note.is-hero .page-note-support {
  display: none;
}
.page-note-doodle {
  display: inline-grid;
  width: 100px;
  height: 90px;
  place-items: center;
  border: none;
  border-radius: 0;
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  transform: rotate(-5deg);
}
.page-note-doodle .sketch-drawing {
  width: 100px;
  height: 88px;
  overflow: visible;
  filter: drop-shadow(0 2px 0 rgba(15,118,110,0.06));
}
.page-note-doodle .sketch-drawing.is-important {
  color: var(--important-ink);
}
.sketch-label {
  fill: currentColor;
  stroke: none;
  font-family: NOTES_Kalam, NOTES_HandTitle, cursive;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0;
}
.page-note-doodle .controlled-doodle {
  position: static;
  width: auto;
  height: auto;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: currentColor;
}
.page-note.is-date .page-note-support,
.page-note.is-money .page-note-support {
  color: var(--important-ink);
}
.page-note.is-action .page-note-support {
  color: var(--teal);
}
.page-note.is-warning .page-note-support {
  color: var(--important-ink);
}
.page-note-arrow {
  display: none;
  width: 74px;
  height: 34px;
  border-bottom: 5px solid currentColor;
  border-right: 5px solid currentColor;
  border-radius: 0 0 22px 0;
  transform: skewX(-16deg) rotate(-8deg);
}
.page-note.is-arrow .page-note-arrow {
  display: block;
}
.page-number {
  position: absolute;
  right: 0;
  bottom: 6px;
  color: rgba(30,58,138,0.10);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.12em;
  display: none;
}
.scene-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.scene-chip {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  max-width: 470px;
  border: 2px solid rgba(7,143,135,0.32);
  border-radius: 999px;
  background: rgba(255,255,255,0.86);
  box-shadow: 5px 7px 0 rgba(18,24,38,0.07);
  color: var(--teal-dark);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 27px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  padding: 10px 18px 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scene-main {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 24px;
  margin-top: 54px;
}
.scene-title-wrap {
  position: relative;
}
.scene-title {
  position: relative;
  z-index: 1;
  max-width: 820px;
  color: #121212;
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 84px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.02;
  min-height: 1.02em;
}
.main-title {
  max-width: 820px;
}
.scene-title .accent {
  position: relative;
  display: inline-block;
  color: #10131a;
  padding: 0 10px 0 8px;
  z-index: 1;
}
.scene-title .accent::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 9%;
  height: 0.42em;
  z-index: -1;
  border-radius: 999px;
  background: rgba(248,198,61,0.82);
  transform: rotate(-1.2deg);
}
.scene-title-wrap::before {
  content: "";
  position: absolute;
  left: -18px;
  top: 54%;
  width: min(760px, 92%);
  height: 28px;
  z-index: 0;
  border-radius: 999px;
  background: rgba(248,198,61,0.56);
  transform: rotate(-1.2deg);
}
.scene-body {
  max-width: 790px;
  color: rgba(18,24,38,0.88);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 38px;
  font-weight: 650;
  line-height: 1.26;
  min-height: 96px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(18,24,38,0.10);
}
.body-note {
  max-width: 790px;
}
.scene-body strong,
.scene-body .accent {
  position: relative;
  display: inline-block;
  color: #111827;
  font-weight: 400;
  padding: 0 5px;
  z-index: 1;
}
.scene-body .accent::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 3px;
  height: 0.52em;
  z-index: -1;
  border-radius: 8px;
  background: rgba(248,198,61,0.66);
  transform: rotate(-1deg);
}
.note-card {
  position: relative;
  border: none;
  border-radius: 24px;
  background: rgba(255,255,255,0.96);
  box-shadow: none;
  padding: 28px 32px;
}
.bullet-card {
  min-height: 246px;
}
.scene-list {
  display: grid;
  gap: 14px;
}
.scene-list-item {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 14px;
  align-items: start;
  color: rgba(18,24,38,0.88);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 34px;
  font-weight: 650;
  line-height: 1.08;
  min-height: 38px;
}
.scene-list-mark {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 999px;
  background: var(--teal);
  color: #fff;
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-top: 4px;
}
.scene-side-note {
  border: 1px solid rgba(18,24,38,0.10);
  border-radius: 22px;
  background: rgba(255,255,255,0.90);
  box-shadow: 0 14px 34px rgba(18,24,38,0.08);
  padding: 22px 24px;
}
.side-note {
  min-height: 168px;
}
.scene-side-note.is-warning {
  border-color: rgba(239,101,85,0.24);
  background: rgba(255,247,246,0.92);
}
.scene-side-title {
  color: #111827;
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.3px;
  line-height: 1.12;
}
.scene-side-title::after {
  content: "";
  display: block;
  width: 44px;
  height: 4px;
  margin-top: 12px;
  border-radius: 999px;
  background: var(--teal);
}
.scene-side-note.is-warning .scene-side-title::after {
  background: var(--red);
}
.scene-side-note.is-warning .mini-check {
  background: rgba(239,101,85,0.12);
  color: var(--red);
}
.scene-side-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}
.scene-side-item {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 10px;
  align-items: start;
  color: rgba(18,24,38,0.82);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 27px;
  font-weight: 650;
  line-height: 1.08;
  min-height: 30px;
}
.study-space-fill {
  display: none !important;
  grid-template-columns: 1fr 0.9fr;
  gap: 14px;
  width: min(820px, 100%);
  min-height: 382px;
  border-radius: 24px;
  background: rgba(255,255,255,0.42);
  box-shadow: inset 0 0 0 1px rgba(18,24,38,0.05);
  padding: 18px;
}
.board-card {
  position: relative;
  display: grid;
  align-content: start;
  min-height: 112px;
  border: 1px solid rgba(18,24,38,0.09);
  border-radius: 18px;
  background: rgba(255,255,255,0.82);
  box-shadow: 0 8px 18px rgba(18,24,38,0.05);
  padding: 16px 18px;
}
.board-card.is-highlight {
  background: linear-gradient(180deg, rgba(255,243,178,0.95), rgba(255,250,221,0.92));
}
.board-card.is-flow {
  position: relative;
  background: linear-gradient(180deg, rgba(229,250,247,0.94), rgba(255,255,255,0.88));
}
.board-card.is-red-circle {
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,246,238,0.92));
}
.board-card.is-revision {
  grid-column: 1 / 3;
  min-height: 86px;
  grid-template-columns: 128px 1fr 64px;
  align-items: center;
  column-gap: 14px;
  background: rgba(255,255,255,0.9);
}
.revision-chip {
  display: inline-grid;
  height: 40px;
  place-items: center;
  border-radius: 999px;
  background: rgba(7,143,135,0.12);
  color: var(--teal-dark);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.revision-arrow {
  color: var(--red);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 50px;
  line-height: 1;
  transform: rotate(-10deg);
}
.board-label {
  color: rgba(18,24,38,0.52);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.board-text {
  margin-top: 9px;
  color: rgba(18,24,38,0.88);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 31px;
  font-weight: 650;
  line-height: 1.04;
}
.board-card.is-highlight .board-text {
  position: relative;
  display: inline-block;
  width: fit-content;
  max-width: 100%;
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 38px;
  color: #121212;
  z-index: 1;
}
.board-card.is-highlight .board-text::before {
  content: "";
  position: absolute;
  left: -8px;
  right: -8px;
  bottom: 5px;
  height: 0.55em;
  border-radius: 999px;
  background: rgba(248,198,61,0.85);
  transform: scaleX(var(--draw, 1)) rotate(-1.5deg);
  transform-origin: left center;
  opacity: var(--draw, 1);
  z-index: -1;
}
.board-card.is-red-circle .board-text {
  position: relative;
  display: inline-block;
  width: fit-content;
  max-width: 100%;
  color: var(--red);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 36px;
  z-index: 1;
}
.board-card.is-red-circle .board-text::after {
  content: "";
  position: absolute;
  left: -16px;
  right: -16px;
  top: -8px;
  bottom: -8px;
  border: 4px solid rgba(239,101,85,0.78);
  border-radius: 52% 48% 45% 55%;
  opacity: var(--draw, 1);
  transform: rotate(-7deg) scale(var(--draw, 1));
  pointer-events: none;
  z-index: -1;
}
.board-diagram {
  display: grid;
  justify-items: center;
  align-items: center;
  gap: 5px;
  margin-top: 16px;
  color: var(--teal-dark);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 23px;
  font-weight: 700;
}
.board-diagram.timeline {
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: relative;
}
.board-diagram.timeline::before {
  content: "";
  position: absolute;
  left: 24px;
  right: 24px;
  top: 50%;
  height: 4px;
  border-radius: 999px;
  background: rgba(7,143,135,0.24);
}
.board-diagram.timeline .board-node {
  min-width: 74px;
  z-index: 1;
}
.board-diagram.timeline .board-arrow {
  display: none;
}
.board-diagram.mindmap {
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
}
.board-diagram.mindmap .board-node:first-child {
  grid-column: 1 / 4;
  justify-self: center;
  background: rgba(255,240,174,0.82);
  border-color: rgba(248,198,61,0.55);
}
.board-diagram.mindmap .board-arrow {
  display: none;
}
.board-diagram.comparison {
  grid-template-columns: 1fr 1fr;
  width: 100%;
}
.board-diagram.comparison .board-arrow {
  display: none;
}
.board-node {
  display: inline-grid;
  min-width: 112px;
  place-items: center;
  border-radius: 999px;
  background: rgba(255,255,255,0.72);
  border: 2px solid rgba(7,143,135,0.34);
  padding: 8px 14px 6px;
}
.board-arrow {
  color: rgba(18,24,38,0.58);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 34px;
  line-height: 1;
  transform: rotate(90deg);
}
.board-doodle {
  position: absolute;
  right: 28px;
  top: -14px;
  color: rgba(7,143,135,0.24);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 48px;
  transform: rotate(8deg);
}
.board-mini-doodle {
  position: absolute;
  right: 18px;
  bottom: 8px;
  color: rgba(7,143,135,0.28);
  font-family: NOTES_Marker, NOTES_Kalam, cursive;
  font-size: 42px;
  transform: rotate(-12deg);
}
.controlled-doodle {
  position: absolute;
  right: 16px;
  top: 14px;
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 2px solid rgba(7,143,135,0.22);
  border-radius: 18px;
  background: rgba(255,255,255,0.62);
  color: var(--teal-dark);
  transform: rotate(3deg);
}
.controlled-doodle svg {
  filter: drop-shadow(0 4px 0 rgba(7,143,135,0.08));
}
.diagram-type-chip {
  position: absolute;
  right: 14px;
  top: 12px;
  border-radius: 999px;
  background: rgba(7,143,135,0.12);
  color: var(--teal-dark);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 5px 10px;
  text-transform: uppercase;
}
.scene-title-wrap::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -14px;
  width: min(520px, 76%);
  height: 5px;
  border-radius: 999px;
  background: rgba(239,101,85,0.72);
  transform: rotate(-1.2deg);
}
.scene-layout-hero .scene-title-wrap::after {
  left: 50%;
  transform: translateX(-50%) rotate(-1.2deg);
}
.writing-cursor {
  position: absolute;
  left: var(--write-pct, 0%);
  top: 50%;
  display: inline-block;
  width: 13px;
  height: 13px;
  margin-left: 6px;
  transform: translateY(-35%) rotate(-18deg);
  border-radius: 999px;
  background: #111;
  box-shadow: 10px 8px 0 -5px rgba(7,143,135,0.95);
  display: none;
}
.writing-mask {
  position: relative;
  z-index: 1;
  display: inline-block;
  clip-path: inset(0 var(--unwrite, 0%) 0 0);
}
.writing-wrap {
  position: relative;
  display: inline-block;
}
.page-note-title .writing-wrap::before {
  content: "";
  position: absolute;
  left: -14px;
  right: -20px;
  top: 58%;
  height: 0.36em;
  z-index: 0;
  border-radius: 999px 46% 999px 52%;
  background: linear-gradient(90deg, rgba(248,198,61,0.18), rgba(248,198,61,0.70) 18%, rgba(248,198,61,0.56) 82%, rgba(248,198,61,0.08));
  clip-path: polygon(1% 24%, 98% 5%, 100% 76%, 2% 92%);
  opacity: var(--mark, 0);
  transform: scaleX(var(--mark, 0)) rotate(-1.2deg);
  transform-origin: left center;
}
.page-note:not(.is-hero):not(.is-keyword) .page-note-title .writing-wrap::before {
  opacity: 0;
}
.notes-debug {
  position: absolute;
  left: 26px;
  bottom: 26px;
  z-index: 20;
  max-width: 410px;
  border-radius: 10px;
  background: rgba(18, 24, 38, 0.78);
  color: rgba(255,255,255,0.92);
  font-family: NOTES_Poppins, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.35;
  padding: 12px 14px;
  pointer-events: none;
}
@media (max-width: 720px) {
  .notes-root {
    --safe-right: 42px;
    --safe-left: 42px;
  }
}
.scene-progress {
  display: none;
  position: absolute;
  left: 120px;
  right: 120px;
  bottom: 18px;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(18,24,38,0.12);
}
.scene-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--gold), var(--teal));
}
.scene-layout-hero .scene-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 64px;
  text-align: center;
}
.scene-layout-hero .scene-title {
  max-width: 820px;
  font-size: 90px;
}
.scene-layout-hero .scene-title-wrap::before {
  left: 50%;
  width: 760px;
  transform: translateX(-50%) rotate(-1.2deg);
}
.scene-layout-hero .note-card {
  max-width: 800px;
}
.scene-layout-hero .scene-side-note {
  display: none;
}
.scene-layout-content .scene-main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 42px;
}
.scene-layout-content .scene-title {
  font-size: 74px;
}
.scene-layout-content .note-card {
  max-width: 850px;
}
.scene-layout-content .scene-body {
  font-size: 30px;
}
.scene-layout-content .scene-side-note {
  display: grid;
  grid-template-columns: 0.3fr 1fr;
  align-items: start;
  max-width: 850px;
  margin-top: 8px;
}
.scene-layout-content .scene-side-list {
  grid-template-columns: repeat(2, 1fr);
  margin-top: 0;
}
.scene-layout-side .scene-main {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  align-items: start;
  margin-top: 46px;
}
.scene-layout-side .scene-title {
  font-size: 76px;
}
.scene-layout-side .scene-side-note {
  grid-column: 2;
  grid-row: 1 / span 3;
}
`;

export const defaultProps: ReelProps = {
  brand: '',
  templateName: TEMPLATE_NAME,
  mediaType: 'audio',
  durationSeconds: 14,
  topicTitle: 'Handwritten Notes',
  backgroundMusic: true,
  backgroundMusicMood: 'ambient',
  backgroundMusicVolume: 0.018,
  overlayTimeline: [
    {
      start: 0,
      end: 7,
      type: 'hook',
      text: 'Clear notes from voice',
      body: 'Upload voiceover. The reel writes the main idea as neat notes.',
      accentWord: 'notes',
      sfx: 'softPop',
    },
    {
      start: 7,
      end: 14,
      type: 'point',
      text: 'Explain one idea',
      body: 'Topic ko clear points me todkar yaad rakhna aasaan hota hai.',
      accentWord: 'idea',
      sfx: 'softTick',
    },
  ],
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const layoutVariants = [
  {
    layoutClass: '',
    paperClass: 'paper-clean',
    stickyLabel: 'Quick Handwriting',
    topicLabel: 'Topic Note',
    titleDelta: 0,
  },
  {
    layoutClass: '',
    paperClass: 'paper-glass',
    stickyLabel: 'Smart Handwriting',
    topicLabel: 'Focus topic',
    titleDelta: -6,
  },
  {
    layoutClass: '',
    paperClass: 'paper-editorial',
    stickyLabel: 'Study Brief',
    topicLabel: 'Key point',
    titleDelta: -4,
  },
  {
    layoutClass: '',
    paperClass: 'paper-premium',
    stickyLabel: 'Creator Handwriting',
    topicLabel: 'Quick recap',
    titleDelta: -2,
  },
] as const;

const paletteVariants = [
  {teal: '#1D4ED8', tealDark: '#1E3A8A', gold: '#FBBF24', note: '#FFF1A8', red: '#B91C1C', paper: '#FFFFFF'},
  {teal: '#1D4ED8', tealDark: '#1E3A8A', gold: '#FBBF24', note: '#FFF1A8', red: '#B91C1C', paper: '#FFFFFF'},
  {teal: '#1D4ED8', tealDark: '#1E3A8A', gold: '#FBBF24', note: '#FFF1A8', red: '#B91C1C', paper: '#FFFFFF'},
  {teal: '#1D4ED8', tealDark: '#1E3A8A', gold: '#FBBF24', note: '#FFF1A8', red: '#B91C1C', paper: '#FFFFFF'},
] as const;

function getVisualSystem(props: ReelProps, activeOverlay?: NotesOverlayItem) {
  const design = cleanText(props.design || '').toLowerCase();
  const seed = hashString([
    props.topicTitle,
    props.scriptDetails?.topic,
    props.scriptDetails?.summary,
    props.mediaSrc,
    activeOverlay?.text,
  ].filter(Boolean).join('|'));
  const presetIndex = /exam|study|notes/.test(design)
    ? 2
    : /career|business|professional/.test(design)
      ? 3
      : /minimal|simple/.test(design)
        ? 0
        : /cinematic|advanced|creator/.test(design)
          ? 1
          : seed % layoutVariants.length;
  const paletteIndex = /exam|deadline|date/.test(design)
    ? 2
    : /career|business|professional/.test(design)
      ? 3
      : /minimal|simple/.test(design)
        ? 0
        : Math.floor(seed / 7) % paletteVariants.length;
  const layout = layoutVariants[presetIndex];
  const palette = paletteVariants[paletteIndex];
  return {
    ...layout,
    style: {
      '--paper': palette.paper,
      '--teal': palette.teal,
      '--teal-dark': palette.tealDark,
      '--gold': palette.gold,
      '--note': palette.note,
      '--red': palette.red,
    } as CSSProperties,
  };
}

function getSceneVariant(activeOverlay: NotesOverlayItem | undefined) {
  if (activeOverlay?.type === 'hook' || activeOverlay?.sceneType === 'noteTitleScene') return 'scene-layout-hero';
  if (
    activeOverlay?.type === 'stat' ||
    activeOverlay?.type === 'warning' ||
    activeOverlay?.type === 'cta' ||
    activeOverlay?.sceneType === 'timelineScene' ||
    activeOverlay?.sceneType === 'mindmapScene' ||
    activeOverlay?.sceneType === 'mistakeCorrectionScene' ||
    activeOverlay?.sceneType === 'summaryBoxScene' ||
    activeOverlay?.sceneType === 'formulaBoxScene' ||
    activeOverlay?.sceneType === 'comparisonTableScene' ||
    activeOverlay?.sceneType === 'timelineStripScene' ||
    activeOverlay?.sceneType === 'documentChecklistScene' ||
    activeOverlay?.sceneType === 'examDateCardScene'
  ) return 'scene-layout-side';
  return 'scene-layout-content';
}

function getSceneChip(activeOverlay: NotesOverlayItem | undefined, props: ReelProps) {
  if (activeOverlay?.type === 'hook') return 'Aaj ka topic';
  if (activeOverlay?.type === 'stat') return 'Important detail';
  if (activeOverlay?.type === 'warning') return 'Dhyan rakhein';
  if (activeOverlay?.type === 'cta') return 'Quick recap';
  const block = pickBlock(props, activeOverlay);
  if (block?.title) return block.title;
  return activeOverlay?.label || 'Study note';
}

function getSceneBullets(
  activeOverlay: NotesOverlayItem | undefined,
  steps: string[],
  sideItems: string[],
  sceneBody?: string,
) {
  const bodyItems = splitBody(activeOverlay?.body);
  const source = bodyItems.length > 1 ? bodyItems : steps.length ? steps : sideItems.length ? sideItems : bodyItems;
  const lines = uniqueReadableLines(source);
  const filtered = lines.filter((item) => !isSameMessage(item, sceneBody || ''));
  return (filtered.length ? filtered : lines)
    .map((item) => limitWords(item, 8, 72))
    .slice(0, 3);
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

function sanitizeRomanText(input: unknown) {
  return String(input || '')
    .replace(/[\u0600-\u06FF]+/g, ' ')
    .replace(/[\u0750-\u077F]+/g, ' ')
    .replace(/[\u08A0-\u08FF]+/g, ' ')
    .replace(/[\u0900-\u097F]+/g, ' ');
}

const cleanText = (value: unknown, fallback = '') =>
  correctKnownSpellings(sanitizeRomanText(value || fallback))
    .replace(/\s+/g, ' ')
    .trim();

const limitWords = (value: unknown, maxWords: number, maxChars: number) => cleanText(value)
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, maxWords)
  .join(' ')
  .slice(0, maxChars);

const WEAK_NOTE_WORDS = new Set([
  'a',
  'an',
  'and',
  'aur',
  'ab',
  'but',
  'hai',
  'hain',
  'is',
  'it',
  'kuch',
  'mein',
  'me',
  'of',
  'or',
  'so',
  'the',
  'to',
  'ye',
  'yeh',
]);

function normalizeMeaningKey(value: string) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isWeakNoteText(value: string) {
  const text = normalizeMeaningKey(value);
  if (!text) return true;
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 3 && /^(kuch|aur|ye|yeh|ab|so|then)\b/.test(text)) return true;
  return words.length <= 1 && WEAK_NOTE_WORDS.has(words[0]);
}

function isDuplicateNoteText(title: string, body: string) {
  const titleKey = normalizeMeaningKey(title);
  const bodyKey = normalizeMeaningKey(body);
  if (!titleKey || !bodyKey) return false;
  return titleKey === bodyKey || titleKey.includes(bodyKey) || bodyKey.includes(titleKey);
}

function cleanNoteBody(title: string, body: string, maxChars: number) {
  const value = trimLine(correctKnownSpellings(cleanText(body)), maxChars);
  if (isWeakNoteText(value) || isDuplicateNoteText(title, value)) return '';
  return value;
}

const normalizeOverlay = (item: NotesOverlayItem): NotesOverlayItem => ({
  ...item,
  start: Math.max(0, Number(item.start) || 0),
  end: Math.max(0, Number(item.end) || 0),
  text: limitWords(item.text || 'Main idea', 6, 64),
  body: splitBody(item.body || '').map((line) => limitWords(line, 6, 52)).slice(0, 2).join(' | '),
  accentWord: cleanText(item.accentWord || '', '').split(/\s+/)[0] || undefined,
  visual: normalizeNoteToken(item.visual, item),
  sceneType: normalizeNoteSceneType(item.sceneType, item),
  noteItems: normalizeNoteItems(item.noteItems, item),
  diagram: normalizeNoteDiagram(item.diagram, item),
  annotations: normalizeNoteAnnotations(item.annotations, item),
  revealPlan: normalizeRevealPlan(item.revealPlan, item),
  sfx: item.sfx,
});

function normalizeNoteToken(value: unknown, item: NotesOverlayItem): NoteVisualToken {
  if (
    value === 'heading_write' ||
    value === 'bullet_write' ||
    value === 'diagram_flowchart' ||
    value === 'diagram_timeline' ||
    value === 'diagram_mindmap' ||
    value === 'formula_box' ||
    value === 'comparison_table' ||
    value === 'timeline_strip' ||
    value === 'document_checklist' ||
    value === 'exam_date_card' ||
    value === 'mind_map' ||
    value === 'pros_cons_table' ||
    value === 'step_ladder' ||
    value === 'flowchart_box' ||
    value === 'before_after_box' ||
    value === 'calendar_reminder' ||
    value === 'ranked_list' ||
    value === 'quote_card' ||
    value === 'effect_bracket' ||
    value === 'effect_checkmark' ||
    value === 'effect_xmark' ||
    value === 'arrow_diagram' ||
    value === 'highlight_swipe' ||
    value === 'red_circle'
  ) return value;
  const source = cleanText([value, item.text, item.body].filter(Boolean).join(' ')).toLowerCase();
  if (/formula|equation|calculation|eligibility|ratio|percentage|interest|salary|fee|amount|marks|score/.test(source)) return 'formula_box';
  if (/compare|comparison|versus|\bvs\b|difference|before|after|old|new|option/.test(source)) return 'comparison_table';
  if (/timeline strip|sequence|schedule|phase|stage|step by step|first|second|third/.test(source)) return 'timeline_strip';
  if (/document|documents|aadhaar|pan card|photo|signature|certificate|upload|id proof|address proof/.test(source)) return 'document_checklist';
  if (/exam date|admit card|hall ticket|deadline|result date|last date|important date/.test(source)) return 'exam_date_card';
  if (/mind ?map|types|category|categories|benefits|branches/.test(source)) return 'mind_map';
  if (/pros|cons|advantages|disadvantages|benefit|drawback/.test(source)) return 'pros_cons_table';
  if (/step ladder|levels?|stage|rank|growth path|progress/.test(source)) return 'step_ladder';
  if (/flowchart box|cause|effect|leads to|because|result/.test(source)) return 'flowchart_box';
  if (/before|after|old|new|then|now/.test(source)) return 'before_after_box';
  if (/calendar|reminder|date|deadline|exam|admit card|result/.test(source)) return 'calendar_reminder';
  if (/ranked|top \d|priority|order|first priority/.test(source)) return 'ranked_list';
  if (/quote|motivation|believe|yakeen|confidence/.test(source)) return 'quote_card';
  if (/bracket|group|requirements|required/.test(source)) return 'effect_bracket';
  if (/checkmark|check mark|done|practice|apply|submit|download|save/.test(source)) return 'effect_checkmark';
  if (/\bx mark\b|xmark|mistake|avoid|wrong|error/.test(source)) return 'effect_xmark';
  if (/timeline|date|deadline|year|month|day|schedule|202\d/.test(source)) return 'diagram_timeline';
  if (/mind ?map|types|category|benefits|documents/.test(source)) return 'diagram_mindmap';
  if (/flow|process|steps|apply|submit|download|training|posting|selection/.test(source)) return 'diagram_flowchart';
  if (item.type === 'warning') return 'red_circle';
  if (item.type === 'stat') return 'highlight_swipe';
  if (item.type === 'hook') return 'heading_write';
  return 'bullet_write';
}

function normalizeNoteSceneType(value: unknown, item: NotesOverlayItem): NoteSceneType {
  if (
    value === 'noteTitleScene' ||
    value === 'bulletLessonScene' ||
    value === 'flowchartScene' ||
    value === 'timelineScene' ||
    value === 'mindmapScene' ||
    value === 'comparisonNotesScene' ||
    value === 'checklistScene' ||
    value === 'definitionScene' ||
    value === 'summaryBoxScene' ||
    value === 'mistakeCorrectionScene' ||
    value === 'formulaBoxScene' ||
    value === 'comparisonTableScene' ||
    value === 'timelineStripScene' ||
    value === 'documentChecklistScene' ||
    value === 'examDateCardScene' ||
    value === 'prosConsScene' ||
    value === 'stepLadderScene' ||
    value === 'beforeAfterScene' ||
    value === 'calendarReminderScene' ||
    value === 'rankedListScene' ||
    value === 'quoteNoteScene'
  ) return value;
  const token = normalizeNoteToken(item.visual, item);
  if (item.type === 'hook') return 'noteTitleScene';
  if (item.type === 'cta') return 'summaryBoxScene';
  if (item.type === 'warning' || token === 'red_circle') return 'mistakeCorrectionScene';
  if (token === 'formula_box') return 'formulaBoxScene';
  if (token === 'comparison_table') return 'comparisonTableScene';
  if (token === 'timeline_strip') return 'timelineStripScene';
  if (token === 'document_checklist') return 'documentChecklistScene';
  if (token === 'exam_date_card') return 'examDateCardScene';
  if (token === 'mind_map') return 'mindmapScene';
  if (token === 'pros_cons_table') return 'prosConsScene';
  if (token === 'step_ladder') return 'stepLadderScene';
  if (token === 'flowchart_box') return 'flowchartScene';
  if (token === 'before_after_box') return 'beforeAfterScene';
  if (token === 'calendar_reminder') return 'calendarReminderScene';
  if (token === 'ranked_list') return 'rankedListScene';
  if (token === 'quote_card') return 'quoteNoteScene';
  if (token === 'diagram_timeline') return 'timelineScene';
  if (token === 'diagram_mindmap') return 'mindmapScene';
  if (token === 'diagram_flowchart' || token === 'arrow_diagram') return 'flowchartScene';
  if (item.type === 'stat') return 'definitionScene';
  if (item.body && splitBody(item.body).length > 1) return 'checklistScene';
  return 'bulletLessonScene';
}

function normalizeNoteItems(value: unknown, item: NotesOverlayItem): NoteItem[] {
  const fromValue = Array.isArray(value)
    ? value.map<NoteItem | null>((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        const record = entry as Record<string, unknown>;
        const text = limitWords(record.text || '', 8, 72);
        if (!text) return null;
        const noteItem: NoteItem = {
          text,
          emphasis: limitWords(record.emphasis || '', 3, 24) || undefined,
          icon: record.icon === 'check' || record.icon === 'dot' || record.icon === 'warning' || record.icon === 'star' || record.icon === 'number'
            ? record.icon
            : undefined,
        };
        return noteItem;
      }).filter((entry): entry is NoteItem => Boolean(entry))
    : [];
  if (fromValue.length) return fromValue.slice(0, 3);
  const bodyItems = splitBody(item.body).map((text, index) => ({
    text: limitWords(text, 8, 72),
    icon: item.type === 'warning' ? 'warning' as const : index === 0 ? 'number' as const : 'check' as const,
  })).filter((entry) => entry.text);
  if (bodyItems.length) return bodyItems.slice(0, 3);
  return [{text: limitWords(item.text || 'Main idea', 8, 72), icon: item.type === 'warning' ? 'warning' : 'dot'}];
}

function normalizeNoteDiagram(value: unknown, item: NotesOverlayItem): NoteDiagram {
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const nodes = Array.isArray(record.nodes)
      ? record.nodes.map((node) => limitWords(node, 4, 28)).filter(Boolean).slice(0, 5)
      : [];
    if (nodes.length >= 2) {
      const type = record.type === 'timeline' || record.type === 'mindmap' || record.type === 'comparison' || record.type === 'flowchart'
        ? record.type
        : normalizeDiagramType(item);
      return {
        type,
        nodes,
        activeNode: limitWords(record.activeNode || '', 4, 28) || undefined,
      };
    }
  }
  const textNodes = extractConceptDiagram({text: [item.text, item.body, item.visual].filter(Boolean).join(' '), activeOverlay: item}) ||
    normalizeNoteItems(undefined, item).map((entry) => entry.text);
  return {
    type: normalizeDiagramType(item),
    nodes: textNodes.map((node) => limitWords(node, 4, 28)).filter(Boolean).slice(0, 5),
    activeNode: item.accentWord,
  };
}

function normalizeDiagramType(item: NotesOverlayItem): NoteDiagram['type'] {
  const token = normalizeNoteToken(item.visual, item);
  if (token === 'diagram_timeline') return 'timeline';
  if (token === 'diagram_mindmap') return 'mindmap';
  if (token === 'comparison_table' || token === 'pros_cons_table' || token === 'before_after_box') return 'comparison';
  if (token === 'timeline_strip' || token === 'exam_date_card' || token === 'calendar_reminder' || token === 'step_ladder' || token === 'ranked_list') return 'timeline';
  if (token === 'mind_map') return 'mindmap';
  if (/\b(compare|versus|vs|difference)\b/i.test([item.text, item.body].filter(Boolean).join(' '))) return 'comparison';
  return 'flowchart';
}

function normalizeNoteAnnotations(value: unknown, item: NotesOverlayItem): NoteAnnotation[] {
  const annotations = Array.isArray(value)
    ? value.map<NoteAnnotation | null>((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        const record = entry as Record<string, unknown>;
        const type = record.type === 'highlight_swipe' || record.type === 'red_circle' || record.type === 'arrow_diagram' || record.type === 'underline' || record.type === 'side_note'
          ? record.type
          : null;
        const targetText = limitWords(record.targetText || '', 4, 36);
        if (!type || !targetText) return null;
        const annotation: NoteAnnotation = {
          type,
          targetText,
          label: limitWords(record.label || '', 5, 48) || undefined,
        };
        return annotation;
      }).filter((entry): entry is NoteAnnotation => Boolean(entry))
    : [];
  if (annotations.length) return annotations.slice(0, 3);
  const token = normalizeNoteToken(item.visual, item);
  const targetText = limitWords(item.accentWord || extractNumberOrDuration([item.text, item.body].join(' ')) || extractHighlightWord(item.text) || item.text, 4, 36);
  if (token === 'red_circle') return [{type: 'red_circle', targetText}];
  if (token === 'arrow_diagram') return [{type: 'arrow_diagram', targetText, label: 'connect'}];
  if (token === 'highlight_swipe' || item.type === 'stat') return [{type: 'highlight_swipe', targetText}];
  return [{type: 'underline', targetText}];
}

function normalizeRevealPlan(value: unknown, item: NotesOverlayItem): NoteRevealItem[] {
  const duration = Math.max(1, Number(item.end) - Number(item.start));
  const fromValue = Array.isArray(value)
    ? value.map((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        const record = entry as Record<string, unknown>;
        const token = normalizeNoteToken(record.token, item);
        const text = limitWords(record.text || '', 8, 72);
        const start = Number(record.start);
        const end = Number(record.end);
        if (!text || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
        return {text, start, end, token};
      }).filter((entry): entry is NoteRevealItem => Boolean(entry))
    : [];
  if (fromValue.length) return fromValue.slice(0, 8);
  const items = [
    {text: limitWords(item.text || 'Main idea', 8, 84), token: 'heading_write' as const},
    ...normalizeNoteItems(item.noteItems, item).map((entry) => ({text: entry.text, token: 'bullet_write' as const})),
    ...normalizeNoteAnnotations(item.annotations, item).map((entry) => ({text: entry.targetText, token: entry.type === 'underline' || entry.type === 'side_note' ? 'highlight_swipe' as const : entry.type as NoteVisualToken})),
  ].filter((entry) => entry.text).slice(0, 8);
  const step = duration / Math.max(1, items.length);
  return items.map((entry, index) => ({
    ...entry,
    start: Math.round((index * step) * 100) / 100,
    end: Math.round(Math.min(duration, (index + 0.85) * step) * 100) / 100,
  }));
}

function repairNotesSceneVariation(items: NotesOverlayItem[]): NotesOverlayItem[] {
  let lastScene: NoteSceneType | undefined;
  let repeatCount = 0;
  const fallbackScenes: Array<{sceneType: NoteSceneType; visual: NoteVisualToken}> = [
    {sceneType: 'bulletLessonScene', visual: 'bullet_write'},
    {sceneType: 'flowchartScene', visual: 'diagram_flowchart'},
    {sceneType: 'definitionScene', visual: 'highlight_swipe'},
    {sceneType: 'summaryBoxScene', visual: 'red_circle'},
    {sceneType: 'documentChecklistScene', visual: 'document_checklist'},
    {sceneType: 'timelineStripScene', visual: 'timeline_strip'},
    {sceneType: 'formulaBoxScene', visual: 'formula_box'},
    {sceneType: 'comparisonTableScene', visual: 'comparison_table'},
  ];

  const varied = items.map((item, index) => {
    const sceneType = item.sceneType || normalizeNoteSceneType(undefined, item);
    repeatCount = sceneType === lastScene ? repeatCount + 1 : 1;
    lastScene = sceneType;
    if (repeatCount <= 2) return item;

    const replacement = fallbackScenes[index % fallbackScenes.length];
    repeatCount = 1;
    lastScene = replacement.sceneType;
    return {
      ...item,
      sceneType: replacement.sceneType,
      visual: replacement.visual,
    };
  });
  return enhanceNoteRhythm(varied);
}

function enhanceNoteRhythm(items: NotesOverlayItem[]): NotesOverlayItem[] {
  const lastIndex = items.length - 1;
  return items.map((item, index) => {
    const source = cleanText([item.text, item.body, item.visual].filter(Boolean).join(' ')).toLowerCase();
    const next: NotesOverlayItem = {...item};
    if (index === 0) {
      return {
        ...next,
        type: 'hook',
        sceneType: 'noteTitleScene',
        visual: 'heading_write',
        accentWord: item.accentWord || extractHighlightWord(item.text) || undefined,
      };
    }
    if (index === lastIndex) {
      return {
        ...next,
        type: item.type === 'warning' ? item.type : 'cta',
        sceneType: source.includes('reject') || source.includes('nahi') ? 'beforeAfterScene' : 'quoteNoteScene',
        visual: source.includes('reject') || source.includes('nahi') ? 'before_after_box' : 'quote_card',
      };
    }
    if (item.type === 'warning' || /mistake|avoid|wrong|nahi|response|reject|risk/.test(source)) {
      return {
        ...next,
        sceneType: /reject|response|nahi/.test(source) ? 'beforeAfterScene' : 'mistakeCorrectionScene',
        visual: /reject|response|nahi/.test(source) ? 'before_after_box' : 'effect_xmark',
      };
    }
    if (index === 2 || /skill|growth|improve|better|career|strong/.test(source)) {
      return {...next, sceneType: 'stepLadderScene', visual: 'step_ladder'};
    }
    if (index === 4 || /degree|before|after|compare|vs/.test(source)) {
      return {...next, sceneType: 'beforeAfterScene', visual: 'before_after_box'};
    }
    if (index === 6 || /daily|practice|continue|process|step/.test(source)) {
      return {...next, sceneType: 'timelineStripScene', visual: 'timeline_strip'};
    }
    if (index === 8 || /document|resume|checklist|ready|apply|submit/.test(source)) {
      return {...next, sceneType: 'documentChecklistScene', visual: 'document_checklist'};
    }
    return next;
  });
}

function findRevealItem(
  item: NotesOverlayItem | undefined,
  token: NoteVisualToken,
  occurrence = 0,
) {
  const matches = item?.revealPlan?.filter((entry) => entry.token === token) || [];
  return matches[occurrence] || matches[0];
}

function revealProgress(
  item: NotesOverlayItem | undefined,
  token: NoteVisualToken,
  localFrame: number,
  fallbackStartFrame: number,
  fallbackDurationFrames: number,
  occurrence = 0,
) {
  const reveal = findRevealItem(item, token, occurrence);
  if (!reveal) return clamp((localFrame - fallbackStartFrame) / Math.max(1, fallbackDurationFrames), 0, 1);
  const startFrame = Math.max(0, reveal.start * fps);
  const endFrame = Math.max(startFrame + 1, reveal.end * fps);
  return clamp((localFrame - startFrame) / Math.max(1, endFrame - startFrame), 0, 1);
}

function revealStartFrame(
  item: NotesOverlayItem | undefined,
  token: NoteVisualToken,
  fallbackStartFrame: number,
) {
  const reveal = findRevealItem(item, token);
  return reveal ? Math.max(0, Math.round(reveal.start * fps)) : fallbackStartFrame;
}

const getActiveItem = <T extends {start: number; end: number}>(items: T[], time: number) =>
  items.find((item) => time >= item.start && time < item.end) || items.find((item) => time < item.end) || items.at(-1);

type NotesPageGroup = {
  pageIndex: number;
  startIndex: number;
  endIndex: number;
  items: NotesOverlayItem[];
};

function paginateNotes(items: NotesOverlayItem[]): NotesPageGroup[] {
  const groups: NotesPageGroup[] = [];
  let pageItems: NotesOverlayItem[] = [];
  let pageStartIndex = 0;
  let occupancy = 0;
  const maxOccupancy = 0.68;
  const maxItemsPerPage = 3;

  items.forEach((item, index) => {
    const itemOccupancy = estimateNoteOccupancy(item, pageItems.length === 0);
    const token = normalizeNoteToken(item.visual, item);
    const isStructuredMoment = token === 'step_ladder' ||
      token === 'before_after_box' ||
      token === 'quote_card' ||
      token === 'document_checklist' ||
      token === 'timeline_strip' ||
      token === 'comparison_table' ||
      token === 'pros_cons_table' ||
      token === 'exam_date_card';
    const shouldBreakForRhythm =
      pageItems.length > 0 &&
      (pageItems.length >= maxItemsPerPage ||
        occupancy + itemOccupancy > maxOccupancy ||
        (index === 1 && pageItems[0]?.type === 'hook') ||
        (isStructuredMoment && pageItems.length >= 2));
    if (
      shouldBreakForRhythm
    ) {
      groups.push({
        pageIndex: groups.length,
        startIndex: pageStartIndex,
        endIndex: index - 1,
        items: pageItems,
      });
      pageItems = [];
      pageStartIndex = index;
      occupancy = 0;
    }
    pageItems.push(item);
    occupancy += itemOccupancy;
  });

  if (pageItems.length) {
    groups.push({
      pageIndex: groups.length,
      startIndex: pageStartIndex,
      endIndex: items.length - 1,
      items: pageItems,
    });
  }

  return groups;
}

function estimateNoteOccupancy(item: NotesOverlayItem, isFirstOnPage: boolean) {
  const title = cleanText(item.text);
  const body = cleanText(item.body || '');
  const token = normalizeNoteToken(item.visual, item);
  const structured = token === 'formula_box' ||
    token === 'comparison_table' ||
    token === 'timeline_strip' ||
    token === 'document_checklist' ||
    token === 'exam_date_card' ||
    token === 'mind_map' ||
    token === 'pros_cons_table' ||
    token === 'step_ladder' ||
    token === 'flowchart_box' ||
    token === 'before_after_box' ||
    token === 'calendar_reminder' ||
    token === 'ranked_list' ||
    token === 'quote_card';
  const titleLines = Math.max(1, Math.ceil(title.length / (isFirstOnPage ? 22 : 28)));
  const bodyLines = body ? Math.max(1, Math.ceil(body.length / 42)) : 0;
  return clamp(0.08 + titleLines * 0.04 + bodyLines * 0.035 + (structured ? 0.045 : 0), isFirstOnPage ? 0.18 : 0.11, structured ? 0.28 : 0.24);
}

const getDurationSeconds = (props: ReelProps) => {
  const overlayEnd = Math.max(0, ...(props.overlayTimeline || []).map((item) => Number(item.end) || 0));
  const requested = Number(props.durationSeconds) || 0;
  return clamp(Math.ceil(Math.max(requested, overlayEnd, 1)), 1, maxDurationSeconds);
};

const renderTitle = (text: string, accentWord?: string) => {
  if (!accentWord) return text;
  const normalizedAccent = accentWord.toLowerCase().replace(/[^a-z0-9]+/g, '');
  return text.split(/(\s+)/).map((part, index) => {
    const normalizedPart = part.toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (normalizedPart !== normalizedAccent) return part;
    return (
      <span className="accent" key={`${part}-${index}`}>
        {part}
      </span>
    );
  });
};

const renderWritingText = (text: string, progress: number, accentWord?: string, showCursor = true) => {
  const source = cleanText(text);
  if (!source) return null;
  const writeProgress = clamp(progress, 0, 1);
  const visibleText = revealReadableWords(source, writeProgress);
  const cursorVisible = false && showCursor && progress > 0 && progress < 1;
  return (
    <span
      className="writing-wrap"
      style={{
        '--write-pct': `${writeProgress * 100}%`,
        '--unwrite': '0%',
      } as CSSProperties}
    >
      <span className="writing-mask">{renderTitle(visibleText, accentWord)}</span>
      {cursorVisible ? <span className="writing-cursor" /> : null}
    </span>
  );
};

const renderAdvancedWritingText = ({
  text,
  frame,
  startFrame,
  accentWord,
}: {
  text: string;
  frame: number;
  startFrame: number;
  accentWord?: string;
}) => {
  const source = cleanText(text);
  if (!source) return null;
  const normalizedAccent = cleanText(accentWord || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const sequence = createWordRevealSequence(source, startFrame, fps);

  return (
    <span className="writing-wrap">
      <span className="writing-mask">
        {sequence.map(({word, startFrame: wordStartFrame, endFrame}, index) => {
          const opacity = getWordOpacity(frame, wordStartFrame, endFrame);
          const normalizedWord = word.toLowerCase().replace(/[^a-z0-9]+/g, '');
          const isAccent = normalizedAccent && normalizedWord === normalizedAccent;
          const pressure = 0.88 + ((hashString(`${word}-${index}`) % 17) / 100);
          const baseline = ((hashString(`${index}-${word}-y`) % 7) - 3) * 0.55;
          const rotate = ((hashString(`${word}-${index}-r`) % 9) - 4) * 0.22;
          return (
            <Fragment key={`${word}-${index}`}>
              <span
                className={`advanced-word${isAccent ? ' accent' : ''}`}
                style={{
                  opacity,
                  color: isAccent ? INK_COLORS.accent : undefined,
                  filter: `saturate(${pressure})`,
                  transform: `translateY(${(1 - opacity) * 4 + baseline}px) rotate(${rotate}deg) scale(${0.985 + opacity * 0.015})`,
                }}
              >
                {word}
              </span>
              {index < sequence.length - 1 ? ' ' : null}
            </Fragment>
          );
        })}
      </span>
    </span>
  );
};

function revealReadableWords(value: string, progress: number) {
  const source = cleanText(value);
  if (!source) return '';
  const amount = clamp(progress, 0, 1);
  if (amount >= 0.98) return source;
  if (amount <= 0) return '';
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return source;
  const eased = amount < 0.5 ? 2 * amount * amount : 1 - Math.pow(-2 * amount + 2, 2) / 2;
  const minWords = words.length > 2 ? 2 : 1;
  const visibleWords = clamp(Math.ceil(words.length * eased), minWords, words.length);
  return words.slice(0, visibleWords).join(' ');
}

function revealText(value: string, progress: number) {
  const source = cleanText(value);
  if (!source) return '';
  const amount = clamp(progress, 0, 1);
  const eased = amount < 0.5 ? 2 * amount * amount : 1 - Math.pow(-2 * amount + 2, 2) / 2;
  const visibleChars = Math.max(amount > 0 ? 1 : 0, Math.ceil(source.length * eased));
  return source.slice(0, visibleChars);
}

const splitBody = (body?: string) => {
  const source = cleanText(body || '');
  if (!source) return [];
  const pieces = source
    .split(/\s+\|\s+|(?<=[.!?])\s+|,\s+/)
    .map((item) => item.replace(/[.!?]+$/g, '').trim())
    .filter(Boolean);
  return (pieces.length ? pieces : [source]).slice(0, 3);
};

function uniqueReadableLines(items: string[]) {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const item of items.map((value) => cleanText(value)).filter(Boolean)) {
    const key = item.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    lines.push(item);
  }
  return lines;
}

function isSameMessage(a: string, b: string) {
  const left = cleanText(a).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const right = cleanText(b).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (!left || !right) return false;
  return left === right || left.includes(right) || right.includes(left);
}

const SPELLING_FIXES: Array<[RegExp, string]> = [
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

function correctKnownSpellings(value: string) {
  return SPELLING_FIXES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function getSummary(props: ReelProps, activeOverlay?: NotesOverlayItem) {
  return cleanText(
    props.scriptDetails?.summary ||
      activeOverlay?.body ||
      'Important points ko short notes me yaad rakho.',
  );
}

function getHeroTitle(props: ReelProps, activeOverlay?: NotesOverlayItem) {
  const title = cleanText(props.topicTitle || props.scriptDetails?.topic || activeOverlay?.text || 'Handwritten Notes');
  const applyIndex = title.search(/\b(apply|kaise|download|check|status|admit|hall ticket)\b/i);
  const main = applyIndex > 2 ? title.slice(0, applyIndex).trim() : title;
  return main.split(/\s+/).slice(0, 3).join(' ');
}

function getHeroSubtitle(props: ReelProps, activeOverlay?: NotesOverlayItem) {
  const title = cleanText(props.topicTitle || '');
  const match = title.match(/\b(apply|download|check|status|kaise|kare|admit card|hall ticket)\b[\s\S]*/i);
  if (match?.[0] && match[0].length < title.length) return titleCaseQuestion(match[0]);
  return cleanText(activeOverlay?.text || 'Important Points').slice(0, 44);
}

function pickBlock(props: ReelProps, activeOverlay?: NotesOverlayItem): ScriptDetailBlock | null {
  const blocks = props.scriptDetails?.detailBlocks || [];
  const label = cleanText(activeOverlay?.label || '').toLowerCase();
  const text = cleanText([activeOverlay?.text, activeOverlay?.body].filter(Boolean).join(' ')).toLowerCase();
  return blocks.find((block) => {
    const title = block.title.toLowerCase();
    if (label && (label.includes(title) || title.includes(label))) return true;
    return block.items.some((item) => text.includes(item.toLowerCase()));
  }) || null;
}

function getSteps(props: ReelProps, activeOverlay?: NotesOverlayItem, block?: ScriptDetailBlock | null) {
  if (block?.type === 'processList') return block.items;
  return splitBody(activeOverlay?.body).length ? splitBody(activeOverlay?.body) : [activeOverlay?.text || 'Main point'];
}

function getSideBlock(
  props: ReelProps,
  activeBlock?: ScriptDetailBlock | null,
  activeOverlay?: NotesOverlayItem,
  overlayIndex = 0,
): ScriptDetailBlock {
  if (activeBlock && activeBlock.type !== 'processList') return activeBlock;
  const blocks = (props.scriptDetails?.detailBlocks || [])
    .filter((block) => block.items.length && block.id !== activeBlock?.id && block.type !== 'processList');
  const preferredTypes =
    activeOverlay?.type === 'stat'
      ? ['amountBox', 'dateBox', 'websiteBox']
      : activeOverlay?.type === 'warning'
        ? ['warningBox', 'documentList', 'dateBox']
        : ['documentList', 'websiteBox', 'amountBox', 'dateBox', 'warningBox', 'factBox'];
  const ranked = [
    ...preferredTypes.flatMap((type) => blocks.filter((block) => block.type === type)),
    ...blocks,
  ];
  const uniqueRanked = ranked.filter((block, index) => ranked.findIndex((item) => item.id === block.id) === index);
  const preferred = uniqueRanked.length ? uniqueRanked[overlayIndex % uniqueRanked.length] : null;
  if (preferred) return preferred;

  const overlayPoints = splitBody(activeOverlay?.body)
    .map((item) => trimLine(correctKnownSpellings(item), 34))
    .filter(Boolean);

  return {
    id: 'fallback-points',
    type: 'factBox',
    title: activeOverlay?.type === 'warning' ? 'Dhyan Rakho' : 'Quick Points',
    items: overlayPoints.length
      ? overlayPoints
      : [cleanText(activeOverlay?.text || props.topicTitle || 'Important point')],
    sourceText: '',
  };
}

function getSceneLead(
  props: ReelProps,
  activeOverlay?: NotesOverlayItem,
  activeBlock?: ScriptDetailBlock | null,
  summary = '',
) {
  if (activeOverlay?.type === 'hook') return summary;
  if (activeBlock?.type === 'processList') return 'Process ko step-by-step follow karein.';
  if (activeBlock?.type === 'websiteBox') return 'Official portal detail yahan important hai.';
  if (activeBlock?.type === 'amountBox') return 'Fee aur payment detail clearly note karein.';
  if (activeBlock?.type === 'documentList') return 'Required documents pehle se ready rakhein.';
  if (activeBlock?.type === 'dateBox') return 'Dates aur deadline miss na karein.';
  if (activeBlock?.type === 'warningBox') return 'Yeh point ignore karna risky ho sakta hai.';
  const bodyItems = splitBody(activeOverlay?.body);
  if (bodyItems.length > 1) return 'Neeche ke points dhyan se dekhein.';
  return cleanText(activeOverlay?.body || props.scriptDetails?.summary || summary);
}

type PageSketchKind =
  | 'rbiOffice'
  | 'examPaper'
  | 'admitCard'
  | 'calendarSheet'
  | 'clockSheet'
  | 'moneySlip'
  | 'practiceSheet'
  | 'warningNote'
  | 'targetNote';

function getPageNoteDoodle(item: NotesOverlayItem): PageSketchKind | null {
  const text = cleanText([item.text, item.body].filter(Boolean).join(' ')).toLowerCase();
  if (/\brbi\b|bank|banking|finance|monetary/.test(text)) return 'rbiOffice';
  if (/\bexam|prelims|mains|paper|test date\b/.test(text)) return 'examPaper';
  if (/\b(11|5-8|5 to 8|date|deadline|april|january|february|march|may|june|july|august|september|october|november|december)\b/.test(text)) {
    return 'calendarSheet';
  }
  if (/\b(time|countdown|hour|minute|before|pehle|expected)\b/.test(text)) return 'clockSheet';
  if (/\b(admit card|hall ticket|document|download)\b/.test(text)) return 'admitCard';
  if (/\b(fee|salary|amount|rupee|rs|inr|payment|bank|loan|money)\b/.test(text)) {
    return 'moneySlip';
  }
  if (/\b(book|study|mock|test|practice|topic|training|class|course)\b/.test(text)) {
    return 'practiceSheet';
  }
  if (item.type === 'warning') return 'warningNote';
  if (item.type === 'cta') return 'targetNote';
  return null;
}

function PageNoteSketch({item}: {item: NotesOverlayItem}) {
  const kind = getPageNoteDoodle(item);
  if (!kind) return null;
  return <HandDrawnSketch kind={kind} />;
}

function HandDrawnSketch({kind}: {kind: PageSketchKind}) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 4.2,
  };
  if (kind === 'rbiOffice') {
    return (
      <svg className="sketch-drawing" viewBox="0 0 110 92" aria-hidden="true">
        <path {...common} d="M15 74 C28 76, 79 75, 95 74" />
        <path {...common} d="M24 34 L55 16 L87 34" />
        <path {...common} d="M31 36 C43 38, 68 38, 80 36" />
        <path {...common} d="M34 40 L34 70 M48 40 L48 70 M63 40 L63 70 M78 40 L78 70" />
        <path {...common} d="M26 70 C39 72, 74 72, 87 70" />
        <path {...common} d="M39 29 C49 30, 62 30, 72 29" />
        <text x="42" y="58" className="sketch-label">RBI</text>
      </svg>
    );
  }
  if (kind === 'examPaper') {
    return (
      <svg className="sketch-drawing" viewBox="0 0 110 92" aria-hidden="true">
        <path {...common} d="M29 13 C44 10, 68 12, 84 15 C86 31, 86 59, 82 78 C66 82, 43 81, 25 76 C22 55, 23 31, 29 13Z" />
        <path {...common} d="M38 29 C50 28, 63 29, 75 30" />
        <path {...common} d="M38 43 C49 42, 66 43, 74 44" />
        <path {...common} d="M38 57 C49 56, 61 57, 70 58" />
        <path {...common} d="M29 18 C38 22, 74 20, 83 18" />
        <text x="36" y="23" className="sketch-label">EXAM</text>
      </svg>
    );
  }
  if (kind === 'admitCard') {
    return (
      <svg className="sketch-drawing" viewBox="0 0 110 92" aria-hidden="true">
        <path {...common} d="M19 24 C38 20, 75 21, 92 25 C93 40, 92 61, 88 74 C70 77, 38 76, 20 72 C16 57, 16 38, 19 24Z" />
        <path {...common} d="M30 39 C43 38, 55 38, 67 39" />
        <path {...common} d="M30 52 C48 51, 68 52, 79 53" />
        <path {...common} d="M74 34 C80 34, 84 39, 83 45 C77 46, 73 43, 74 34Z" />
        <path {...common} d="M72 61 C79 57, 85 58, 89 64" />
        <text x="27" y="32" className="sketch-label">CARD</text>
      </svg>
    );
  }
  if (kind === 'calendarSheet') {
    return (
      <svg className="sketch-drawing is-important" viewBox="0 0 110 92" aria-hidden="true">
        <path {...common} d="M23 24 C39 21, 72 22, 88 25 C90 42, 88 61, 84 76 C67 78, 40 78, 24 74 C21 58, 20 40, 23 24Z" />
        <path {...common} d="M25 38 C42 39, 68 38, 87 39" />
        <path {...common} d="M36 16 L36 29 M74 16 L74 29" />
        <path {...common} d="M39 52 L49 52 M61 52 L72 52 M39 65 L49 65 M61 65 L72 65" />
        <text x="43" y="70" className="sketch-label">DATE</text>
      </svg>
    );
  }
  if (kind === 'clockSheet') {
    return (
      <svg className="sketch-drawing" viewBox="0 0 110 92" aria-hidden="true">
        <path {...common} d="M55 20 C76 20, 88 36, 85 55 C82 74, 64 83, 45 77 C28 72, 20 55, 25 39 C30 27, 41 20, 55 20Z" />
        <path {...common} d="M55 32 L55 51 L69 58" />
        <path {...common} d="M35 22 L27 14 M75 22 L83 14" />
        <text x="37" y="72" className="sketch-label">TIME</text>
      </svg>
    );
  }
  if (kind === 'moneySlip') {
    return (
      <svg className="sketch-drawing is-important" viewBox="0 0 110 92" aria-hidden="true">
        <path {...common} d="M18 30 C39 24, 75 25, 94 31 C92 47, 94 61, 90 73 C68 76, 40 75, 18 70 C22 56, 20 43, 18 30Z" />
        <path {...common} d="M36 38 C50 36, 64 38, 76 40" />
        <path {...common} d="M36 55 C47 54, 57 55, 68 56" />
        <text x="43" y="63" className="sketch-label">Rs</text>
      </svg>
    );
  }
  if (kind === 'practiceSheet') {
    return (
      <svg className="sketch-drawing" viewBox="0 0 110 92" aria-hidden="true">
        <path {...common} d="M28 15 C45 12, 72 13, 85 16 C88 35, 87 58, 82 76 C63 80, 42 79, 26 73 C23 54, 23 33, 28 15Z" />
        <path {...common} d="M38 35 L45 42 L58 29" />
        <path {...common} d="M63 36 C69 35, 76 36, 80 37" />
        <path {...common} d="M38 56 L45 63 L58 50" />
        <path {...common} d="M63 57 C69 56, 76 57, 80 58" />
      </svg>
    );
  }
  if (kind === 'warningNote') {
    return (
      <svg className="sketch-drawing is-important" viewBox="0 0 110 92" aria-hidden="true">
        <path {...common} d="M55 18 C65 35, 80 58, 88 74 C68 78, 42 78, 22 74 C31 57, 44 34, 55 18Z" />
        <path {...common} d="M55 39 L55 56" />
        <path {...common} d="M55 66 L56 66" />
      </svg>
    );
  }
  return (
    <svg className="sketch-drawing" viewBox="0 0 110 92" aria-hidden="true">
      <path {...common} d="M55 18 C77 18, 91 34, 88 54 C85 73, 68 83, 48 79 C30 75, 20 60, 24 41 C28 26, 40 19, 55 18Z" />
      <path {...common} d="M37 49 C47 43, 58 40, 74 37" />
      <path {...common} d="M66 30 L76 37 L69 48" />
    </svg>
  );
}

function getPageNoteClass(item: NotesOverlayItem, index: number) {
  const text = cleanText([item.text, item.body].filter(Boolean).join(' ')).toLowerCase();
  const visual = normalizeNoteToken(item.visual, item);
  const sceneType = item.sceneType || normalizeNoteSceneType(undefined, item);
  const classes = ['page-note'];
  if (index === 0 || item.type === 'hook') classes.push('is-hero', 'is-keyword');
  if (sceneType === 'formulaBoxScene' || visual === 'formula_box') classes.push('is-formula');
  if (sceneType === 'comparisonTableScene' || visual === 'comparison_table') classes.push('is-comparison');
  if (sceneType === 'timelineStripScene' || visual === 'timeline_strip') classes.push('is-timeline-strip', 'is-arrow');
  if (sceneType === 'documentChecklistScene' || visual === 'document_checklist') classes.push('is-document-list', 'is-document');
  if (sceneType === 'examDateCardScene' || visual === 'exam_date_card') classes.push('is-exam-date', 'is-date', 'is-keyword');
  if (sceneType === 'mindmapScene' || visual === 'mind_map') classes.push('is-mind-map');
  if (sceneType === 'prosConsScene' || visual === 'pros_cons_table') classes.push('is-pros-cons', 'is-comparison');
  if (sceneType === 'stepLadderScene' || visual === 'step_ladder') classes.push('is-step-ladder', 'is-arrow');
  if (sceneType === 'flowchartScene' || visual === 'flowchart_box') classes.push('is-flowchart-box', 'is-arrow');
  if (sceneType === 'beforeAfterScene' || visual === 'before_after_box') classes.push('is-before-after', 'is-comparison');
  if (sceneType === 'calendarReminderScene' || visual === 'calendar_reminder') classes.push('is-calendar-reminder', 'is-date');
  if (sceneType === 'rankedListScene' || visual === 'ranked_list') classes.push('is-ranked-list');
  if (sceneType === 'quoteNoteScene' || visual === 'quote_card') classes.push('is-quote-note', 'is-keyword');
  if (visual === 'effect_bracket') classes.push('is-bracket');
  if (visual === 'effect_checkmark') classes.push('is-action');
  if (visual === 'effect_xmark') classes.push('is-warning');
  if (/\b(11|5-8|5 to 8|date|deadline|april|january|february|march|may|june|july|august|september|october|november|december)\b/.test(text)) {
    classes.push('is-date');
  }
  if (/\b(admit card|hall ticket|document|download)\b/.test(text)) {
    classes.push('is-document');
  }
  if (/\b(fee|salary|amount|rupee|rs|inr|payment|bank|loan|money)\b/.test(text)) {
    classes.push('is-money');
  }
  if (/\b(mock|test|practice|continue|download|apply|submit|save|check)\b/.test(text)) {
    classes.push('is-action');
  }
  if (item.type === 'warning' || /\b(warning|mistake|avoid|urgent|dhyan|risk|waste)\b/.test(text)) {
    classes.push('is-warning');
  }
  if (/\b(next|then|after|before|selection|training|posting|process|step)\b/.test(text)) {
    classes.push('is-arrow');
  }
  if (/\b(exam date|salary|fee|deadline|result)\b/.test(text)) {
    classes.push('is-keyword');
  }
  return classes.join(' ');
}

function renderNoteStructureVisual(noteClassName: string, nodes: string[], fallback: string) {
  const cleanNodes = uniqueReadableLines(nodes.map((node) => trimLine(node, 18))).filter(Boolean).slice(0, 4);
  const items = cleanNodes.length ? cleanNodes : [fallback];
  if (noteClassName.includes('is-formula')) {
    return (
      <>
        <span className="visual-pill">{trimLine(items[0] || 'Skill', 12)}</span>
        <span className="visual-arrow">+</span>
        <span className="visual-pill">{trimLine(items[1] || 'Practice', 12)}</span>
        <span className="visual-arrow">=</span>
        <span className="visual-pill">{trimLine(items[2] || 'Result', 12)}</span>
      </>
    );
  }
  if (noteClassName.includes('is-timeline-strip')) {
    return items.slice(0, 4).map((item, index) => (
      <Fragment key={`${item}-${index}`}>
        <span className="visual-pill">{trimLine(item, 12)}</span>
        {index < Math.min(items.length, 4) - 1 ? <span className="visual-arrow">→</span> : null}
      </Fragment>
    ));
  }
  if (noteClassName.includes('is-document-list')) {
    return items.slice(0, 3).map((item, index) => (
      <span className="visual-pill" key={`${item}-${index}`}>{trimLine(item, 14)}</span>
    ));
  }
  if (noteClassName.includes('is-exam-date')) {
    return (
      <>
        <span className="visual-pill">{trimLine(items[0] || fallback, 16)}</span>
        <span className="visual-arrow">★</span>
      </>
    );
  }
  if (noteClassName.includes('is-pros-cons')) {
    return (
      <>
        <span className="visual-pill is-positive">{trimLine(items[0] || 'Pro', 12)}</span>
        <span className="visual-arrow">/</span>
        <span className="visual-pill is-negative">{trimLine(items[1] || 'Con', 12)}</span>
      </>
    );
  }
  if (noteClassName.includes('is-before-after')) {
    return (
      <>
        <span className="visual-pill">{trimLine(items[0] || 'Before', 12)}</span>
        <span className="visual-arrow">→</span>
        <span className="visual-pill">{trimLine(items[1] || 'After', 12)}</span>
      </>
    );
  }
  if (noteClassName.includes('is-step-ladder')) {
    return items.slice(0, 4).map((item, index) => (
      <span className="visual-pill is-step" key={`${item}-${index}`}>{index + 1}. {trimLine(item, 11)}</span>
    ));
  }
  if (noteClassName.includes('is-ranked-list')) {
    return items.slice(0, 4).map((item, index) => (
      <span className="visual-pill is-rank" key={`${item}-${index}`}>#{index + 1} {trimLine(item, 11)}</span>
    ));
  }
  if (noteClassName.includes('is-calendar-reminder')) {
    return (
      <>
        <span className="visual-pill is-date-chip">{trimLine(items[0] || fallback, 14)}</span>
        <span className="visual-arrow">!</span>
      </>
    );
  }
  if (noteClassName.includes('is-mind-map')) {
    return items.slice(0, 4).map((item, index) => (
      <span className="visual-pill is-branch" key={`${item}-${index}`}>{trimLine(item, 12)}</span>
    ));
  }
  if (noteClassName.includes('is-flowchart-box')) {
    return items.slice(0, 4).map((item, index) => (
      <Fragment key={`${item}-${index}`}>
        <span className="visual-pill">{trimLine(item, 12)}</span>
        {index < Math.min(items.length, 4) - 1 ? <span className="visual-arrow">→</span> : null}
      </Fragment>
    ));
  }
  if (noteClassName.includes('is-quote-note')) {
    return <span className="visual-pill is-quote">"{trimLine(items[0] || fallback, 24)}"</span>;
  }
  if (noteClassName.includes('is-comparison')) {
    const left = items[0] || 'Before';
    const right = items[1] || items[0] || 'After';
    return (
      <>
        <span className="visual-pill">{trimLine(left, 14)}</span>
        <span className="visual-arrow">vs</span>
        <span className="visual-pill">{trimLine(right, 14)}</span>
      </>
    );
  }
  return null;
}

function titleCaseQuestion(value: string) {
  const text = cleanText(value).replace(/\?+$/g, '');
  return `${text.replace(/\w\S*/g, (word) => {
    if (/^[A-Z0-9]{2,}$/.test(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  })}?`;
}

type ControlledDoodleKey =
  | 'bank'
  | 'atm'
  | 'rupee'
  | 'creditCard'
  | 'wallet'
  | 'piggyBank'
  | 'book'
  | 'pencil'
  | 'graduation'
  | 'lightbulb'
  | 'trophy'
  | 'growth'
  | 'chart'
  | 'briefcase'
  | 'target'
  | 'rocket';

type ControlledDiagramType = 'flowchart' | 'timeline' | 'mindmap';

const doodleIconMap = {
  bank: Landmark,
  atm: CreditCard,
  rupee: BadgeIndianRupee,
  creditCard: CreditCard,
  wallet: WalletCards,
  piggyBank: PiggyBank,
  book: BookOpen,
  pencil: Pencil,
  graduation: GraduationCap,
  lightbulb: Lightbulb,
  trophy: Trophy,
  growth: BarChart3,
  chart: BarChart3,
  briefcase: BriefcaseBusiness,
  target: Target,
  rocket: Rocket,
} as const;

function ControlledDoodle({doodle}: {doodle: ControlledDoodleKey}) {
  const Icon = doodleIconMap[doodle];
  return (
    <span className="controlled-doodle">
      <Icon size={38} strokeWidth={2.3} />
    </span>
  );
}

function getStudyBoard(props: ReelProps, activeOverlay: NotesOverlayItem | undefined, sceneTitle: string, sceneBody: string, bullets: string[], sideItems: string[]) {
  const topic = trimLine(props.scriptDetails?.topic || props.topicTitle || sceneTitle || 'Topic', 24);
  const firstBullet = bullets.find(Boolean) || sideItems.find(Boolean) || sceneBody || sceneTitle;
  const fact = trimLine(correctKnownSpellings(firstBullet), 42);
  const highlightSource = activeOverlay?.accentWord || extractHighlightWord(sceneTitle) || extractHighlightWord(sceneBody) || topic;
  const highlight = trimLine(correctKnownSpellings(highlightSource), 22);
  const formulaSource =
    extractNumberOrDuration([sceneTitle, sceneBody, ...bullets, ...sideItems].join(' ')) ||
    props.scriptDetails?.amounts?.[0] ||
    props.scriptDetails?.dates?.[0] ||
    props.scriptDetails?.websites?.[0] ||
    'Key Point';
  const formula = trimLine(correctKnownSpellings(formulaSource), 34);
  const diagram = extractConceptDiagram({
    text: [sceneTitle, sceneBody, ...bullets, ...sideItems, activeOverlay?.text, activeOverlay?.body].filter(Boolean).join(' '),
    activeOverlay,
  });
  const contextText = [props.scriptDetails?.topic, props.topicTitle, sceneTitle, sceneBody, ...bullets, ...sideItems, activeOverlay?.visual].filter(Boolean).join(' ');
  const middle = activeOverlay?.type === 'warning'
    ? 'Check'
    : activeOverlay?.type === 'stat'
      ? 'Proof'
      : 'Understand';
  const revisionSource =
    bullets.find((item) => !isSameMessage(item, fact)) ||
    sideItems.find((item) => !isSameMessage(item, fact)) ||
    props.scriptDetails?.keyPoints?.find((item) => !isSameMessage(item, fact)) ||
    sceneBody ||
    'Revise before next step';
  const arrowLabel =
    activeOverlay?.type === 'warning'
      ? 'avoid mistake'
      : activeOverlay?.type === 'cta'
        ? 'do this next'
        : 'remember this';
  return {
    topic,
    fact,
    highlight,
    formula,
    revision: trimLine(correctKnownSpellings(revisionSource), 44),
    arrowLabel,
    doodle: pickControlledDoodle(contextText),
    diagramType: pickControlledDiagramType(contextText, activeOverlay),
    diagram: diagram || [trimLine(topic, 12), middle, 'Action'],
  };
}

function pickControlledDoodle(value: string): ControlledDoodleKey {
  const source = cleanText(value).toLowerCase();
  if (/\batm\b/.test(source)) return 'atm';
  if (/\brbi\b|bank|banking|branch|loan|finance|monetary/.test(source)) return 'bank';
  if (/rupee|salary|fee|payment|amount|money|₹|rs\.?|income|profit/.test(source)) return 'rupee';
  if (/card|debit|credit|pan card|admit card|hall ticket/.test(source)) return 'creditCard';
  if (/wallet|cash/.test(source)) return 'wallet';
  if (/saving|sip|investment|mutual fund/.test(source)) return 'piggyBank';
  if (/book|study|notes|syllabus|chapter/.test(source)) return 'book';
  if (/write|form|fill|signature|pencil/.test(source)) return 'pencil';
  if (/college|student|exam|education|training|classroom|course/.test(source)) return 'graduation';
  if (/idea|tip|remember|important|concept/.test(source)) return 'lightbulb';
  if (/rank|success|selection|selected|achievement/.test(source)) return 'trophy';
  if (/growth|promotion|career|increase/.test(source)) return 'growth';
  if (/chart|data|graph|percentage|percent|%/.test(source)) return 'chart';
  if (/job|office|business|work/.test(source)) return 'briefcase';
  if (/target|goal|prepare|preparation/.test(source)) return 'target';
  if (/startup|launch|viral/.test(source)) return 'rocket';
  return 'lightbulb';
}

function pickControlledDiagramType(value: string, activeOverlay?: NotesOverlayItem): ControlledDiagramType {
  const source = [value, activeOverlay?.visual].filter(Boolean).join(' ').toLowerCase();
  if (/timeline|date|deadline|year|month|day|schedule|202\d/.test(source)) return 'timeline';
  if (/mind ?map|types|category|categories|benefits|documents/.test(source)) return 'mindmap';
  return 'flowchart';
}

function extractHighlightWord(value: string) {
  return cleanText(value)
    .split(/\s+/)
    .find((word) => word.length >= 4 && !/^(this|that|with|from|your|have|karna|kaise|important|point)$/i.test(word));
}

function extractNumberOrDuration(value: string) {
  const source = cleanText(value);
  const match = source.match(/\b(?:₹\s*)?\d+(?:[.,]\d+)?\s*(?:months?|days?|years?|hours?|minutes?|lakh|crore|%|rs\.?|rupees?)?\b/i);
  return match?.[0]?.trim();
}

function extractConceptDiagram({
  text,
  activeOverlay,
}: {
  text: string;
  activeOverlay?: NotesOverlayItem;
}) {
  const source = cleanText(text);
  const lower = source.toLowerCase();

  if (/\brbi\b/.test(lower) && /inflation|mahanga/.test(lower)) return ['RBI', 'Interest Rate', 'Inflation'];
  if (/\brbi\b/.test(lower) && /monetary policy/.test(lower)) return ['RBI', 'Policy', 'Economy'];
  if (/selection|select/.test(lower) && /training/.test(lower)) return ['Selection', 'Training', /posting/.test(lower) ? 'Posting' : 'Job Role'];
  if (/apply|application|form/.test(lower)) {
    if (/upload/.test(lower)) return ['Apply', 'Upload', /submit/.test(lower) ? 'Submit' : 'Verify'];
    if (/payment|fee|pay/.test(lower)) return ['Form', 'Fee', 'Submit'];
    return ['Open Portal', 'Fill Form', 'Submit'];
  }
  if (/download/.test(lower) && /admit card|hall ticket/.test(lower)) return ['Login', 'Admit Card', 'Download'];
  if (/salary|growth|promotion/.test(lower)) return ['Job', 'Salary', 'Growth'];
  if (/document|aadhaar|photo|signature/.test(lower)) return ['Documents', 'Verify', 'Submit'];
  if (activeOverlay?.type === 'warning') return ['Mistake', 'Check', 'Safe'];

  const concepts = source
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9₹]/g, ''))
    .filter((word) => word.length >= 4 && !/^(this|that|with|from|your|have|will|because|important|point|kaise|karna|karein)$/i.test(word));
  const unique = Array.from(new Set(concepts)).slice(0, 3);
  if (unique.length >= 3) return unique.map((item) => trimLine(titleCaseQuestion(item).replace(/\?$/g, ''), 14));

  return null;
}

const DiagramRenderer = ({
  diagram,
  localFrame,
  startFrame,
}: {
  diagram: NoteDiagram;
  localFrame: number;
  startFrame: number;
}) => {
  const nodes = (diagram.nodes.length ? diagram.nodes : ['Idea', 'Proof', 'Action']).slice(0, 5);
  return (
    <div className={`board-diagram ${diagram.type}`}>
      {nodes.map((node, index) => {
        const nodeProgress = clamp((localFrame - startFrame - index * 8) / 14, 0, 1);
        return (
          <Fragment key={`${node}-${index}`}>
            <span
              className="board-node"
              style={{
                opacity: nodeProgress,
                transform: `translateY(${(1 - nodeProgress) * 8}px) scale(${0.92 + nodeProgress * 0.08})`,
              }}
            >
              {trimLine(node, 18)}
            </span>
            {index < nodes.length - 1 ? (
              <span
                className="board-arrow"
                style={{
                  opacity: clamp((localFrame - startFrame - index * 8 - 8) / 10, 0, 1),
                }}
              >
                →
              </span>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
};

function getCueForNote(item: NotesOverlayItem, index: number, total: number) {
  const token = normalizeNoteToken(item.visual, item);
  if (item.sfx) return item.sfx;
  if (index === 0 || item.type === 'hook') return 'softPop';
  if (index === total - 1 || item.type === 'cta' || token === 'quote_card') return 'softChime';
  if (item.type === 'warning' || token === 'effect_xmark' || token === 'red_circle') return 'softPop';
  return 'softTick';
}

const WritingSoundLayer = ({item, index}: {item: NotesOverlayItem; index: number}) => {
  const startFrame = Math.max(0, Math.round(item.start * fps));
  const durationFrames = Math.max(20, Math.round((item.end - item.start) * fps));
  const textLength = cleanText([item.text, item.body].filter(Boolean).join(' ')).length;
  const tickCount = clamp(Math.ceil(textLength / 14), 2, 7);
  const spacing = Math.max(5, Math.floor(Math.min(durationFrames * 0.62, 52) / tickCount));
  const volume = index === 0 ? 0.026 : 0.018;
  if (!handwritingSfxSources.write) return null;
  return (
    <>
      {Array.from({length: tickCount}).map((_, tickIndex) => (
        <Sequence
          durationInFrames={8}
          from={startFrame + 3 + tickIndex * spacing}
          key={`write-${item.id || item.start}-${tickIndex}`}
        >
          <Audio src={handwritingSfxSources.write!} volume={volume * (tickIndex % 2 === 0 ? 1 : 0.72)} />
        </Sequence>
      ))}
    </>
  );
};

const SoundCueLayer = ({items, pages}: {items: NotesOverlayItem[]; pages: NotesPageGroup[]}) => (
  <>
    {items.map((item, index) => {
      const cue = getCueForNote(item, index, items.length);
      const token = normalizeNoteToken(item.visual, item);
      const startFrame = Math.max(0, Math.round(item.start * fps));
      const effectFrame = startFrame + Math.min(34, Math.max(12, Math.round((item.end - item.start) * fps * 0.34)));
      const cueSource = audioCueSources[cue];
      return (
        <Fragment key={`${item.id || item.start}-sound`}>
          <WritingSoundLayer item={item} index={index} />
          {cueSource ? (
            <Sequence durationInFrames={18} from={startFrame}>
              <Audio src={cueSource} volume={cue === 'softChime' ? 0.052 : 0.038} />
            </Sequence>
          ) : null}
          {handwritingSfxSources.effect && (token === 'highlight_swipe' ||
            token === 'red_circle' ||
            token === 'effect_checkmark' ||
            token === 'effect_xmark' ||
            token === 'quote_card' ||
            token === 'before_after_box') ? (
            <Sequence durationInFrames={14} from={effectFrame}>
              <Audio src={handwritingSfxSources.effect} volume={token === 'effect_xmark' ? 0.032 : 0.028} />
            </Sequence>
          ) : null}
        </Fragment>
      );
    })}
    {handwritingSfxSources.page ? pages.slice(1).map((page) => (
      <Sequence
        durationInFrames={20}
        from={Math.max(0, Math.round((page.items[0]?.start || 0) * fps))}
        key={`page-sound-${page.pageIndex}`}
      >
        <Audio src={handwritingSfxSources.page!} volume={0.045} />
      </Sequence>
    )) : null}
  </>
);

const SourceAudio = ({mediaSrc, trimStart}: {mediaSrc?: string; trimStart?: number}) => {
  const src = resolveMediaSrc(mediaSrc);
  if (!src) return null;
  return <Audio src={src} startFrom={Math.max(0, Math.round((trimStart || 0) * fps))} />;
};

const BackgroundMusicLayer = ({
  enabled,
  mood,
  src,
  volume,
}: {
  enabled?: boolean;
  mood?: ReelProps['backgroundMusicMood'];
  src?: string;
  volume?: number;
}) => {
  if (enabled === false) return null;
  const musicSrc = resolveMediaSrc(src) || backgroundMusicSources[mood || 'ambient'];
  if (!musicSrc) return null;
  return <Audio loop src={musicSrc} volume={clamp(Number(volume ?? 0.026), 0, 0.07)} />;
};

const PageFlipLayer = ({pages}: {pages: NotesPageGroup[]}) => {
  const frame = useCurrentFrame();
  const activeTransition = pages.slice(1).find((page) => {
    const startFrame = Math.round((page.items[0]?.start || 0) * fps);
    return frame >= startFrame - 8 && frame <= startFrame + 18;
  });
  if (!activeTransition) return null;
  const startFrame = Math.round((activeTransition.items[0]?.start || 0) * fps);
  const progress = easeInOutCubic(clamp((frame - (startFrame - 8)) / 26, 0, 1));
  const opacity = Math.sin(progress * Math.PI);
  return (
    <div
      className="page-flip"
      style={{
        '--page-flip-opacity': opacity,
        '--page-flip-rot': `${interpolate(progress, [0, 1], [-8, -115])}deg`,
        '--page-flip-x': `${interpolate(progress, [0, 1], [0, -86])}px`,
      } as CSSProperties}
    >
      <div className="page-flip-sheet" />
    </div>
  );
};

export const Notes = (props: ReelProps) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const time = frame / fps;
  const overlays = repairNotesSceneVariation(
    (props.overlayTimeline?.length ? props.overlayTimeline : defaultProps.overlayTimeline || [])
      .map(normalizeOverlay)
      .filter((item) => item.end > item.start && item.text),
  );
  const activeOverlay = getActiveItem(overlays, time) || overlays[0];
  const overlayIndex = Math.max(0, overlays.findIndex((item) => item === activeOverlay));
  const notePages = paginateNotes(overlays);
  const activePage = notePages.find((page) => overlayIndex >= page.startIndex && overlayIndex <= page.endIndex) || notePages[0];
  const currentPageIndex = activePage?.pageIndex || 0;
  const pageLocalFrame = Math.max(0, frame - Math.round((activePage?.items[0]?.start || 0) * fps));
  const pageIn = easeOutCubic(clamp(pageLocalFrame / 14, 0, 1));
  const indexOnPage = activePage ? Math.max(0, overlayIndex - activePage.startIndex) : 0;
  const currentPageItems = activePage
    ? activePage.items.slice(0, overlayIndex - activePage.startIndex + 1)
    : overlays.slice(0, overlayIndex + 1);
  const localFrame = Math.max(0, frame - Math.round((activeOverlay?.start || 0) * fps));
  const introProgress = clamp(localFrame / 18, 0, 1);
  const activeBlock = pickBlock(props, activeOverlay);
  const steps = getSteps(props, activeOverlay, activeBlock).slice(0, 6);
  const sideBlock = getSideBlock(props, activeBlock, activeOverlay, overlayIndex);
  const sideItems = sideBlock.items.slice(0, 6);
  const totalProgress = clamp(frame / Math.max(1, durationInFrames - 1), 0, 1);
  const heroTitle = getHeroTitle(props, activeOverlay);
  const heroSubtitle = getHeroSubtitle(props, activeOverlay);
  const summary = getSummary(props, activeOverlay);
  const visual = getVisualSystem(props, activeOverlay);
  const sceneVariant = getSceneVariant(activeOverlay);
  const sceneTitle = activeOverlay?.type === 'hook'
    ? heroTitle
    : cleanText(activeOverlay?.text || heroSubtitle || heroTitle).split(/\s+/).slice(0, 8).join(' ');
  const sceneBody = getSceneLead(props, activeOverlay, activeBlock, summary);
  const noteItemBullets = activeOverlay?.noteItems?.map((item) => item.text).filter(Boolean) || [];
  const sceneBullets = noteItemBullets.slice(0, 3);
  const studyBoard = getStudyBoard(props, activeOverlay, sceneTitle, sceneBody, sceneBullets, sideItems);
  const noteDiagram = activeOverlay?.diagram || {
    type: studyBoard.diagramType,
    nodes: studyBoard.diagram,
    activeNode: studyBoard.highlight,
  } as NoteDiagram;
  const showSceneChip = false;
  const sceneChip = showSceneChip ? getSceneChip(activeOverlay, props) : '';
  const titleSize = clamp(getResponsiveFontSize(sceneTitle, FONT_SIZES.heading1, FONT_SIZES.heading3) + visual.titleDelta, 52, 84);
  const shouldRenderBody = Boolean(cleanText(sceneBody));
  const shouldRenderBullets = sceneBullets.length > 0;
  const shouldRenderSideNote = false;
  const pageLayout = createBalancedLayout(
    currentPageItems.map((item, index) => ({
      text: cleanText([item.text, item.body].filter(Boolean).join(' ')),
      fontSize: index === 0 ? FONT_SIZES.heading1 : FONT_SIZES.heading3,
    })),
    CONTENT_AREA.height - SPACING.xxxl,
  );
  const firstPageLayoutY = pageLayout[0]?.y || SAFE_ZONES.top;
  const secondPageLayoutY = pageLayout[1]?.y || firstPageLayoutY + SPACING.xxl;
  const balancedGap = currentPageItems.length <= 1
    ? SPACING.xxl
    : clamp(Math.round((secondPageLayoutY - firstPageLayoutY) * 0.24), SPACING.lg, SPACING.xxl);
  const gridLayout = createGridLayout(Math.max(1, Math.min(currentPageItems.length, 4)), CONTENT_AREA.width, SPACING.lg);
  const pagePadding = getPadding(currentPageItems.length <= 2 ? 'lg' : 'md');
  const pageOccupancy = currentPageItems.reduce((total, item, index) => total + estimateNoteOccupancy(item, index === 0), 0);
  const pageNotesClass = [
    'page-notes',
    'is-reel-canvas',
    `page-theme-${currentPageIndex % 4}`,
    currentPageItems.length <= 3 ? 'is-sparse' : '',
    currentPageItems.length >= 2 && currentPageItems.length <= 4 ? 'is-spread' : '',
    currentPageItems.length >= 5 ? 'is-dense' : '',
    pageOccupancy < 0.54 ? 'is-airy' : '',
    pageOccupancy > 0.78 ? 'is-packed' : '',
  ].filter(Boolean).join(' ');
  const activeDurationFrames = Math.max(36, Math.round(((activeOverlay?.end || time + 2) - (activeOverlay?.start || time)) * fps));
  const activeProgress = clamp(localFrame / activeDurationFrames, 0, 1);
  const activeToken = activeOverlay ? normalizeNoteToken(activeOverlay.visual, activeOverlay) : 'bullet_write';
  const writingZoom = 1.14 + easeInOutCubic(activeProgress) * 0.095;
  const continuousTime = frame / fps;
  const driftX = Math.sin(continuousTime * 0.72) * 34 + Math.sin(continuousTime * 0.23) * 18;
  const driftY = Math.cos(continuousTime * 0.55) * 42 + Math.sin(continuousTime * 0.18) * 24;
  const driftZoom = 1 + Math.sin(continuousTime * 0.38) * 0.035 + Math.sin(continuousTime * 0.17) * 0.025;
  const hookPunch = activeOverlay?.type === 'hook' ? Math.sin(clamp(localFrame / 18, 0, 1) * Math.PI) * 0.075 : 0;
  const emphasisPunch = activeToken === 'highlight_swipe' || activeToken === 'quote_card' || activeToken === 'before_after_box'
    ? Math.sin(clamp((localFrame - 12) / 18, 0, 1) * Math.PI) * 0.028
    : 0;
  const warningTilt = activeOverlay?.type === 'warning' || activeToken === 'effect_xmark'
    ? Math.sin(clamp((localFrame - 8) / 22, 0, 1) * Math.PI) * -1.25
    : 0;
  const notebookTilt = -2.2 + Math.sin(continuousTime * 0.2) * 0.45;
  const cameraEase = easeInOutCubic(clamp(localFrame / 18, 0, 1));
  const focusX = ((indexOnPage % 2 === 0 ? 62 : -74) - indexOnPage * 28) * cameraEase;
  const focusY = (activeOverlay?.type === 'hook' ? 82 : 124 - indexOnPage * 245) * cameraEase;
  const cameraX = clamp(focusX + driftX, -180, 150);
  const cameraY = clamp(focusY + driftY, -540, 180);
  const pageScale = (1.02 + pageIn * 0.03) * (writingZoom + hookPunch + emphasisPunch) * driftZoom;
  const pageOpacity = pageIn;
  const titleWriteFrames = clamp(Math.round(activeDurationFrames * (shouldRenderBody ? 0.34 : 0.58)), 22, 58);
  const bodyStartFrame = titleWriteFrames + 6;
  const bodyWriteFrames = clamp(Math.round(activeDurationFrames * 0.42), 24, 78);
  const titleProgress = revealProgress(activeOverlay, 'heading_write', localFrame, 0, titleWriteFrames);
  const bodyProgress = revealProgress(activeOverlay, 'bullet_write', localFrame, bodyStartFrame, bodyWriteFrames);
  const bulletStartFrame = shouldRenderBody ? bodyStartFrame + bodyWriteFrames + 8 : titleWriteFrames + 10;
  const bulletStepFrames = clamp(Math.round(activeDurationFrames * 0.18), 18, 34);
  const bulletWriteFrames = clamp(Math.round(activeDurationFrames * 0.22), 18, 42);
  const sideStartFrame = bulletStartFrame + Math.max(1, sceneBullets.length) * bulletStepFrames + 8;
  const sideTitleProgress = clamp((localFrame - sideStartFrame) / 18, 0, 1);
  const highlightProgress = revealProgress(activeOverlay, 'highlight_swipe', localFrame, 78, 16);
  const redCircleProgress = revealProgress(activeOverlay, 'red_circle', localFrame, 104, 18);
  const diagramToken = noteDiagram.type === 'timeline'
    ? 'diagram_timeline'
    : noteDiagram.type === 'mindmap'
      ? 'diagram_mindmap'
      : 'diagram_flowchart';
  const diagramStartFrame = revealStartFrame(activeOverlay, diagramToken, 74);
  const debugEnabled = process.env.NODE_ENV !== 'production';

  return (
    <AbsoluteFill className="notes-root">
      <style>{fontFaces}</style>
      <style>{stylesheet}</style>
      <BackgroundMusicLayer
        enabled={props.backgroundMusic}
        mood={props.backgroundMusicMood}
        src={props.backgroundMusicSrc}
        volume={props.backgroundMusicVolume}
      />
      <SourceAudio mediaSrc={props.mediaSrc} trimStart={props.mediaTrimStartSeconds} />
      <SoundCueLayer items={overlays} pages={notePages} />
      <div className={`paper ${visual.paperClass}`} style={visual.style}>
        <PageFlipLayer pages={notePages} />
        <div
          className={`page-content ${visual.layoutClass}`}
          style={{
            '--layout-gap': `${balancedGap}px`,
            '--note-padding-top': `${pagePadding.top}px`,
            '--note-padding-right': `${pagePadding.right}px`,
            '--note-padding-bottom': `${pagePadding.bottom}px`,
            '--note-padding-left': `${pagePadding.left}px`,
            '--note-radius': `${getBorderRadius(currentPageItems.length <= 2 ? 'lg' : 'md')}px`,
            opacity: pageOpacity,
            transform: `translate3d(${cameraX}px, ${cameraY}px, 0) rotate(${notebookTilt + warningTilt}deg) scale(${pageScale})`,
          } as CSSProperties}
        >
          <div className={`scene-board notes-page-mode ${sceneVariant}`}>
            <div className="scene-top">
              {showSceneChip ? (
                <div className="scene-chip">
                  <Sparkles size={28} strokeWidth={2.4} />
                  {trimLine(sceneChip, 28)}
                </div>
              ) : null}
            </div>

            <div
              className={pageNotesClass}
              style={{
                '--grid-item-width': `${gridLayout.itemWidth}px`,
              } as CSSProperties}
            >
              {currentPageItems.map((item, index) => {
                const itemStartFrame = Math.round(item.start * fps);
                const itemLocalFrame = Math.max(0, frame - itemStartFrame);
                const itemDurationFrames = Math.max(36, Math.round((item.end - item.start) * fps));
                const baseNoteClassName = getPageNoteClass(item, index);
                const itemToken = normalizeNoteToken(item.visual, item);
                const itemSceneType = item.sceneType || normalizeNoteSceneType(undefined, item);
                const isStructuredNote = itemToken === 'step_ladder' ||
                  itemToken === 'before_after_box' ||
                  itemToken === 'quote_card' ||
                  itemToken === 'document_checklist' ||
                  itemToken === 'timeline_strip' ||
                  itemToken === 'comparison_table' ||
                  itemToken === 'pros_cons_table' ||
                  itemToken === 'formula_box' ||
                  itemToken === 'exam_date_card' ||
                  itemSceneType === 'mistakeCorrectionScene';
                const priorityClass = index === 0 && (item.type === 'hook' || currentPageIndex === 0)
                  ? 'is-priority-hero'
                  : item === activeOverlay || isStructuredNote
                    ? 'is-priority-major'
                    : index === 1
                      ? 'is-priority-medium'
                      : 'is-priority-support';
                const focusClass = item === activeOverlay ? 'is-active-focus' : 'is-background-note';
                const paperClass = priorityClass === 'is-priority-medium' || priorityClass === 'is-priority-support'
                  ? 'is-sticky-note'
                  : 'is-torn-paper';
                const noteClassName = `${baseNoteClassName} ${priorityClass} ${paperClass} ${focusClass}`;
                const globalNoteIndex = activePage ? activePage.startIndex + index : index;
                const viralCycle = globalNoteIndex % 4;
                const forceHighlight = item === activeOverlay;
                const forceCircle = item === activeOverlay && viralCycle === 1;
                const forceTick = item === activeOverlay && viralCycle === 2;
                const forceArrow = item === activeOverlay && viralCycle === 3;
                const rawItemTitle = cleanText(item.text).split(/\s+/).slice(0, index === 0 ? 5 : 6).join(' ');
                const itemTitle = getOptimalLineBreaks(rawItemTitle, index === 0 ? 18 : 24).join(' ');
                const rawItemBody = cleanNoteBody(itemTitle, item.body || '', noteClassName.includes('is-date') ? 42 : 74);
                const itemBody = getOptimalLineBreaks(rawItemBody, noteClassName.includes('is-date') ? 28 : 38).join(' ');
                const itemDiagramNodes = (item.diagram?.nodes?.length ? item.diagram.nodes : [itemTitle, ...splitBody(itemBody)]).filter(Boolean).slice(0, 4);
                const shouldShowStructureVisual =
                  noteClassName.includes('is-formula') ||
                  noteClassName.includes('is-comparison') ||
                  noteClassName.includes('is-timeline-strip') ||
                  noteClassName.includes('is-document-list') ||
                  noteClassName.includes('is-exam-date') ||
                  noteClassName.includes('is-mind-map') ||
                  noteClassName.includes('is-step-ladder') ||
                  noteClassName.includes('is-flowchart-box') ||
                  noteClassName.includes('is-calendar-reminder') ||
                  noteClassName.includes('is-ranked-list') ||
                  noteClassName.includes('is-quote-note');
                const priorityTitleMultiplier = priorityClass === 'is-priority-hero'
                  ? 1.34
                  : priorityClass === 'is-priority-major'
                    ? 1.18
                    : priorityClass === 'is-priority-support'
                      ? 0.84
                      : 1;
                const priorityBodyMultiplier = priorityClass === 'is-priority-support'
                  ? 0.82
                  : priorityClass === 'is-priority-hero' || priorityClass === 'is-priority-major'
                    ? 1.12
                    : 1;
                const itemTitleFontSize = clamp(
                  getResponsiveFontSize(itemTitle, index === 0 ? FONT_SIZES.heading1 : FONT_SIZES.heading2, FONT_SIZES.heading3) * priorityTitleMultiplier,
                  priorityClass === 'is-priority-hero' ? 82 : priorityClass === 'is-priority-support' ? 34 : 44,
                  priorityClass === 'is-priority-hero' ? 108 : priorityClass === 'is-priority-major' ? 82 : priorityClass === 'is-priority-support' ? 48 : 64,
                );
                const itemBodyFontSize = clamp(
                  getResponsiveFontSize(itemBody, FONT_SIZES.bodyLarge, FONT_SIZES.bodySmall) * priorityBodyMultiplier,
                  priorityClass === 'is-priority-support' ? 24 : FONT_SIZES.label,
                  priorityClass === 'is-priority-support' ? 34 : 48,
                );
                const titleDimensions = getTextDimensions(itemTitle, itemTitleFontSize, 'NOTES_Marker, NOTES_Caveat, NOTES_Kalam, cursive', CONTENT_AREA.width);
                const bodyDimensions = getTextDimensions(itemBody, itemBodyFontSize, 'NOTES_Poppins, Arial, sans-serif', CONTENT_AREA.width);
                const titleFrames = clamp(
                  Math.round(Math.min(itemDurationFrames * (itemBody ? 0.34 : 0.48), getAnimationDuration(itemTitle, 28) * fps)),
                  Math.round(ANIMATION_TIMINGS.transitionIn * fps) + 8,
                  46,
                );
                const bodyDelay = titleFrames + 4;
                const bodyFrames = clamp(
                  Math.round(Math.min(itemDurationFrames * 0.34, getAnimationDuration(itemBody, 30) * fps)),
                  14,
                  54,
                );
                const titleProgressForItem = item === activeOverlay ? clamp(itemLocalFrame / titleFrames, 0, 1) : 1;
                const bodyProgressForItem = item === activeOverlay ? clamp((itemLocalFrame - bodyDelay) / bodyFrames, 0, 1) : 1;
                const titleStartFrame = itemStartFrame;
                const bodyStartFrameForItem = itemStartFrame + bodyDelay;
                const entrance = item === activeOverlay
                  ? getFadeScaleEntrance(itemLocalFrame, 0, Math.round(ANIMATION_TIMINGS.transitionIn * fps))
                  : {opacity: 1, scale: 1};
                const exitOpacity = item === activeOverlay
                  ? getNoteExitOpacity(frame, Math.round(item.end * fps), Math.round(ANIMATION_TIMINGS.transitionOut * fps))
                  : 1;
                const emphasisScale = item === activeOverlay
                  ? getEmphasisScale(itemLocalFrame, titleFrames, Math.round(ANIMATION_TIMINGS.emphasis * fps))
                  : 1;
                const bounceY = item === activeOverlay
                  ? getBounceY(itemLocalFrame, titleFrames, Math.round(ANIMATION_TIMINGS.emphasis * fps), 5)
                  : 0;
                const stackRotate = index % 3 === 1 ? 1.2 : index % 3 === 2 ? -1 : 0;
                const slideInX = item === activeOverlay
                  ? getSlideInX(itemLocalFrame, 0, Math.round(ANIMATION_TIMINGS.transitionIn * fps), 22)
                  : 0;
                const drawingRotation = item === activeOverlay
                  ? getDrawingRotation(itemLocalFrame, titleFrames, Math.round(ANIMATION_TIMINGS.emphasis * fps))
                  : 0;
                const markerProgress = item === activeOverlay
                  ? clamp((itemLocalFrame - titleFrames - 2) / 14, 0, 1)
                  : 1;
                const focusProgress = item === activeOverlay
                  ? easeOutCubic(clamp(itemLocalFrame / 12, 0, 1))
                  : 0;
                const stampProgress = item === activeOverlay
                  ? Math.sin(clamp((itemLocalFrame - titleFrames - 8) / 16, 0, 1) * Math.PI)
                  : 0;
                const checkboxProgress = item === activeOverlay
                  ? easeOutCubic(clamp((itemLocalFrame - titleFrames - 4) / 14, 0, 1))
                  : 0;
                const markerNibProgress = item === activeOverlay
                  ? easeOutCubic(clamp((itemLocalFrame - titleFrames - 2) / 16, 0, 1))
                  : 0;
                const viralMarkProgress = item === activeOverlay
                  ? easeOutCubic(clamp((itemLocalFrame - titleFrames - 6) / 14, 0, 1))
                  : 0;
                const rankNumber = activePage ? index + activePage.startIndex + 1 : index + 1;
                const underlineStartFrame = Math.max(titleFrames + 4, bodyDelay + bodyFrames - 12);
                const hookAnimation = item === activeOverlay
                  ? getHookAnimation(itemLocalFrame, 0, Math.round(ANIMATION_TIMINGS.transitionIn * fps))
                  : {opacity: 1, scale: 1};
                const titleColor = item === activeOverlay && (noteClassName.includes('is-date') || noteClassName.includes('is-money') || noteClassName.includes('is-warning'))
                  ? getColorTransition(itemLocalFrame, 0, titleFrames, INK_COLORS.heading, INK_COLORS.accent)
                  : undefined;
                const noteTextColor = noteClassName.includes('is-warning') || noteClassName.includes('is-date') || noteClassName.includes('is-money')
                  ? getTextColor('warning')
                  : getTextColor('heading');
                const bodyTextColor = noteClassName.includes('is-warning') ? getTextColor('warning') : getTextColor('body');
                const noteBackground = noteClassName.includes('is-warning')
                  ? getBoxBackgroundColor('warning')
                  : noteClassName.includes('is-keyword')
                    ? getBoxBackgroundColor('highlight')
                    : 'transparent';
                const noteShadow = noteBackground === 'transparent' ? 'none' : getShadowStyle(1);
                const supportProgress = item === activeOverlay
                  ? clamp((itemLocalFrame - Math.max(titleFrames + 18, itemDurationFrames - 24)) / 14, 0, 1)
                  : 1;
                const drawingStartFrame = itemStartFrame + titleFrames + 2;
                const drawingDuration = Math.round(ANIMATION_TIMINGS.emphasis * fps);
                const noteEffectWidth = clamp(Math.max(titleDimensions.width + SPACING.xl, 220), 220, index === 0 ? 760 : 620);
                const titleEffectY = index === 0 ? 42 : 24;
                const effectOpacity = noteClassName.includes('is-warning') ? 0.46 : noteClassName.includes('is-keyword') ? 0.34 : 0.42;
                const effectStrokeWidth = noteClassName.includes('is-warning') ? 2.1 : 2.7;
                const underlineY = clamp(
                  Math.round(titleDimensions.height + (itemBody ? bodyDimensions.height : 0) + SPACING.lg),
                  72,
                  168,
                );
                return (
                  <div
                    className={noteClassName}
                    key={item.id || `${item.start}-${item.text}`}
                    style={{
                      '--mark': markerProgress,
                      '--support': supportProgress,
                      '--focus-glow': focusProgress,
                      '--focus-mark': item === activeOverlay ? clamp((itemLocalFrame - titleFrames + 4) / 12, 0, 1) : 0,
                      '--stamp': stampProgress,
                      '--stamp-scale': 0.78 + stampProgress * 0.34,
                      '--checkbox': checkboxProgress,
                      '--checkbox-scale': 0.86 + checkboxProgress * 0.14,
                      '--check-draw': checkboxProgress,
                      '--marker-nib': markerNibProgress,
                      '--marker-x': `${markerNibProgress * Math.min(520, noteEffectWidth)}px`,
                      '--side-note': viralMarkProgress,
                      '--rank': viralMarkProgress,
                      '--rank-scale': 0.82 + viralMarkProgress * 0.18,
                      '--correction': viralMarkProgress,
                      '--correction-scale': 0.86 + viralMarkProgress * 0.18,
                      '--keyword-box': viralMarkProgress,
                      opacity: entrance.opacity * exitOpacity,
                      background: noteBackground,
                      boxShadow: noteShadow,
                      transform: `translateX(${slideInX}px) translateY(${bounceY}px) rotate(${stackRotate}deg) scale(${entrance.scale * emphasisScale})`,
                      transition: 'filter 120ms linear',
                    } as CSSProperties}
                  >
                    <span className="paper-fold" />
                    {(priorityClass === 'is-priority-medium' || priorityClass === 'is-priority-support') ? <span className="note-tape" /> : null}
                    <span className="note-scribble" />
                    <span className="ranking-badge">{rankNumber}</span>
                    <span className="keyword-box" />
                    {item === activeOverlay ? (
                      <>
                        <span className="focus-scribble">look</span>
                        <span className="focus-arrow" />
                        <span className="side-note-chip">{noteClassName.includes('is-warning') ? 'check this' : noteClassName.includes('is-action') ? 'do this' : 'important'}</span>
                        {(noteClassName.includes('is-warning') || noteClassName.includes('is-date') || noteClassName.includes('is-money')) ? <span className="correction-mark">!</span> : null}
                        {(noteClassName.includes('is-keyword') || index === 0) ? <span className="marker-nib" style={{left: index === 0 ? 8 : 132, top: titleEffectY + 4} as CSSProperties} /> : null}
                        {(forceTick || noteClassName.includes('is-action') || noteClassName.includes('is-document-list')) ? <span className="motion-checkbox" /> : null}
                        {(noteClassName.includes('is-warning') || noteClassName.includes('is-before-after')) ? <span className="note-stamp">WHY?</span> : null}
                      </>
                    ) : null}
                    {(forceHighlight || index === 0 || noteClassName.includes('is-keyword')) ? (
                      <DrawingEffect
                        type="highlight"
                        startFrame={itemStartFrame + titleFrames + 2}
                        duration={drawingDuration}
                        x={index === 0 ? -10 : 132}
                        y={titleEffectY}
                        width={noteEffectWidth}
                        height={Math.max(28, itemTitleFontSize * 0.44)}
                        color={INK_COLORS.highlight}
                        opacity={index === 0 ? 0.24 : item === activeOverlay ? 0.20 : 0.14}
                      />
                    ) : null}
                    {(forceCircle || noteClassName.includes('is-date') || noteClassName.includes('is-money') || noteClassName.includes('is-warning')) ? (
                      <DrawingEffect
                        type="circle"
                        startFrame={drawingStartFrame}
                        duration={drawingDuration}
                        x={index === 0 ? 126 : 230}
                        y={index === 0 ? 70 : 48}
                        width={Math.min(noteEffectWidth, noteClassName.includes('is-exam-date') ? 260 : 220)}
                        height={Math.max(70, itemTitleFontSize * 1.55)}
                        color={INK_COLORS.accent}
                        strokeWidth={2.5}
                        opacity={noteClassName.includes('is-warning') ? 0.36 : 0.52}
                      />
                    ) : null}
                    {(forceArrow || noteClassName.includes('is-arrow')) ? (
                      <DrawingEffect
                        type="arrow"
                        startFrame={itemStartFrame + titleFrames + 8}
                        duration={Math.round(ANIMATION_TIMINGS.transitionIn * fps)}
                        x={44}
                        y={52}
                        width={72}
                        height={42}
                        direction="right"
                        color={noteClassName.includes('is-warning') ? INK_COLORS.accent : INK_COLORS.heading}
                        strokeWidth={2.7}
                        opacity={effectOpacity}
                      />
                    ) : null}
                    {noteClassName.includes('is-document') || noteClassName.includes('is-action') ? (
                      <DrawingEffect
                        type="bracket"
                        startFrame={drawingStartFrame}
                        duration={drawingDuration}
                        x={index === 0 ? -4 : 120}
                        y={6}
                        width={noteEffectWidth + SPACING.md}
                        height={Math.max(76, titleDimensions.height + SPACING.lg)}
                        color={noteClassName.includes('is-action') ? INK_COLORS.heading : INK_COLORS.body}
                        strokeWidth={effectStrokeWidth}
                        opacity={0.58}
                      />
                    ) : null}
                    <div
                      className="page-note-title"
                      style={{
                        color: titleColor || noteTextColor,
                        fontSize: itemTitleFontSize,
                        maxWidth: Math.min(CONTENT_AREA.width, Math.max(560, titleDimensions.width + SPACING.xxl)),
                        lineHeight: LINE_HEIGHTS.tight,
                      }}
                    >
                      {item === activeOverlay
                        ? renderAdvancedWritingText({text: itemTitle, frame, startFrame: titleStartFrame, accentWord: item.accentWord})
                        : renderWritingText(itemTitle, titleProgressForItem, item.accentWord, false)}
                    </div>
                    {itemBody ? (
                      <div
                        className="page-note-body"
                        style={{
                          color: bodyTextColor,
                          fontSize: itemBodyFontSize,
                          maxWidth: Math.min(CONTENT_AREA.width, Math.max(620, bodyDimensions.width + SPACING.xl)),
                          lineHeight: LINE_HEIGHTS.normal,
                        }}
                      >
                        {item === activeOverlay
                          ? renderAdvancedWritingText({text: itemBody, frame, startFrame: bodyStartFrameForItem, accentWord: item.accentWord})
                          : renderWritingText(itemBody, bodyProgressForItem, item.accentWord, false)}
                      </div>
                    ) : null}
                    {shouldShowStructureVisual ? (
                      <div
                        className={[
                          'note-structure-visual',
                          noteClassName.includes('is-formula') ? 'is-formula' : '',
                          noteClassName.includes('is-comparison') ? 'is-comparison' : '',
                          noteClassName.includes('is-document-list') ? 'is-docs' : '',
                          noteClassName.includes('is-exam-date') ? 'is-exam' : '',
                          noteClassName.includes('is-step-ladder') ? 'is-ladder' : '',
                          noteClassName.includes('is-ranked-list') ? 'is-ranked' : '',
                          noteClassName.includes('is-mind-map') ? 'is-mind' : '',
                          noteClassName.includes('is-calendar-reminder') ? 'is-calendar' : '',
                          noteClassName.includes('is-quote-note') ? 'is-quote-wrap' : '',
                        ].filter(Boolean).join(' ')}
                        style={{
                          opacity: item === activeOverlay ? easeOutCubic(clamp((itemLocalFrame - bodyDelay) / 12, 0, 1)) : 1,
                          transform: item === activeOverlay
                            ? `translateY(${(1 - easeOutCubic(clamp((itemLocalFrame - bodyDelay) / 12, 0, 1))) * 10}px) scale(${0.96 + easeOutCubic(clamp((itemLocalFrame - bodyDelay) / 12, 0, 1)) * 0.04})`
                            : undefined,
                        }}
                      >
                        {renderNoteStructureVisual(noteClassName, itemDiagramNodes, itemTitle)}
                      </div>
                    ) : null}
                    <DrawingEffect
                      type="underline"
                      startFrame={itemStartFrame + underlineStartFrame}
                      duration={Math.round(ANIMATION_TIMINGS.lineReveal * fps)}
                      x={index === 0 ? 2 : 132}
                      y={underlineY}
                      width={Math.min(520, noteEffectWidth)}
                      color={noteClassName.includes('is-warning') ? INK_COLORS.accent : INK_COLORS.heading}
                      strokeWidth={2.4}
                      opacity={noteClassName.includes('is-warning') ? 0.34 : 0.58}
                    />
                    {(forceTick || noteClassName.includes('is-action')) ? (
                      <AnimatedCheckmark
                        startFrame={drawingStartFrame}
                        duration={drawingDuration}
                        x={index === 0 ? noteEffectWidth + 12 : 76}
                        y={index === 0 ? 44 : 32}
                        size={34}
                        color={INK_COLORS.heading}
                        strokeWidth={3}
                        opacity={0.76}
                      />
                    ) : null}
                    {noteClassName.includes('is-warning') ? (
                      <AnimatedXMark
                        startFrame={drawingStartFrame}
                        duration={drawingDuration}
                        x={index === 0 ? noteEffectWidth + 12 : 76}
                        y={index === 0 ? 44 : 32}
                        size={30}
                        color={INK_COLORS.accent}
                        strokeWidth={2.4}
                        opacity={0.48}
                      />
                    ) : null}
                    <div className="page-note-support">
                      <span
                        className="page-note-doodle"
                        style={{
                          opacity: hookAnimation.opacity,
                          transform: `rotate(${-5 + drawingRotation}deg) scale(${hookAnimation.scale})`,
                        }}
                      >
                        <PageNoteSketch item={item} />
                      </span>
                      <span className="page-note-arrow" />
                    </div>
                  </div>
                );
              })}
            </div>
            {false ? <div className="page-number">PAGE {currentPageIndex + 1}</div> : null}

            <div
              className="scene-main"
              style={{
                opacity: introProgress,
                transform: `translateY(${(1 - introProgress) * 18}px) scale(${0.98 + introProgress * 0.02})`,
              }}
            >
              <div className="scene-title-wrap">
                <div className="scene-title main-title" style={{fontSize: titleSize}}>
                  {renderWritingText(sceneTitle, titleProgress, activeOverlay?.accentWord)}
                </div>
              </div>

              {shouldRenderBody ? (
                <div className="scene-body body-note">
                  {renderWritingText(trimLine(correctKnownSpellings(sceneBody), 92), bodyProgress, activeOverlay?.accentWord)}
                </div>
              ) : null}

              {shouldRenderBullets ? (
                <div className="note-card bullet-card">
                  <div className="scene-list">
                    {sceneBullets.map((item, index) => {
                      const itemProgress = revealProgress(
                        activeOverlay,
                        'bullet_write',
                        localFrame,
                        bulletStartFrame + index * bulletStepFrames,
                        bulletWriteFrames,
                        index,
                      );
                      return (
                        <div
                          className="scene-list-item"
                          key={`${item}-${index}`}
                          style={{
                            opacity: itemProgress,
                            transform: `translateY(${(1 - itemProgress) * 12}px)`,
                          }}
                        >
                          <span className="scene-list-mark">{activeOverlay?.type === 'warning' ? '!' : index + 1}</span>
                          <span>{renderWritingText(item, itemProgress, undefined, itemProgress > 0 && itemProgress < 1)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {false ? <div className="study-space-fill" style={{opacity: clamp((localFrame - 44) / 18, 0, 1)}}>
                <div
                  className="board-card"
                  style={{
                    opacity: clamp((localFrame - 50) / 14, 0, 1),
                    transform: `translateY(${(1 - clamp((localFrame - 50) / 14, 0, 1)) * 10}px)`,
                  }}
                >
                  <ControlledDoodle doodle={studyBoard.doodle} />
                  <span className="board-label">Fact Box</span>
                  <span className="board-text">{renderWritingText(studyBoard.fact, clamp((localFrame - 50) / 24, 0, 1), undefined, false)}</span>
                </div>
                <div
                  className="board-card is-highlight"
                  style={{
                    opacity: clamp((localFrame - 62) / 14, 0, 1),
                    transform: `translateY(${(1 - clamp((localFrame - 62) / 14, 0, 1)) * 10}px)`,
                    '--draw': highlightProgress,
                  } as CSSProperties}
                >
                  <span className="board-doodle">✦</span>
                  <span className="board-label">Highlight</span>
                  <span className="board-text">{renderWritingText(studyBoard.highlight, highlightProgress, undefined, false)}</span>
                </div>
                <div
                  className="board-card is-flow"
                  style={{
                    opacity: clamp((localFrame - 74) / 14, 0, 1),
                    transform: `translateY(${(1 - clamp((localFrame - 74) / 14, 0, 1)) * 10}px)`,
                  }}
                >
                  <span className="diagram-type-chip">{studyBoard.diagramType}</span>
                  <span className="board-label">Diagram</span>
                  <DiagramRenderer diagram={noteDiagram} localFrame={localFrame} startFrame={diagramStartFrame} />
                </div>
                <div
                  className="board-card is-red-circle"
                  style={{
                    opacity: clamp((localFrame - 86) / 14, 0, 1),
                    transform: `translateY(${(1 - clamp((localFrame - 86) / 14, 0, 1)) * 10}px)`,
                    '--draw': redCircleProgress,
                  } as CSSProperties}
                >
                  <span className="board-label">Circle This</span>
                  <span className="board-text">{renderWritingText(studyBoard.formula, redCircleProgress, undefined, false)}</span>
                  <span className="board-mini-doodle">↗</span>
                </div>
                <div
                  className="board-card is-revision"
                  style={{
                    opacity: clamp((localFrame - 98) / 14, 0, 1),
                    transform: `translateY(${(1 - clamp((localFrame - 98) / 14, 0, 1)) * 10}px)`,
                  }}
                >
                  <span className="revision-chip">Revision</span>
                  <span className="board-text">{renderWritingText(studyBoard.revision, clamp((localFrame - 98) / 22, 0, 1), undefined, false)}</span>
                  <span className="revision-arrow">→</span>
                </div>
              </div> : null}

              {shouldRenderSideNote ? (
                <div
                  className={`scene-side-note side-note ${activeOverlay?.type === 'warning' ? 'is-warning' : ''}`}
                  style={{
                    opacity: clamp((localFrame - sideStartFrame) / 14, 0, 1),
                    transform: `translateY(${(1 - clamp((localFrame - sideStartFrame) / 14, 0, 1)) * 16}px)`,
                  }}
                >
                  <div className="scene-side-title">{renderWritingText(trimLine(sideBlock.title, 22), sideTitleProgress)}</div>
                  <div className="scene-side-list">
                    {sideItems.slice(0, 4).map((item, index) => {
                      const itemProgress = clamp((localFrame - sideStartFrame - 20 - index * 14) / 18, 0, 1);
                      return (
                        <div className="scene-side-item" key={`${sideBlock.id}-${item}-${index}`}>
                          <span className="mini-check">✓</span>
                          <span className={sideBlock.type === 'amountBox' || sideBlock.type === 'websiteBox' ? 'highlight' : ''}>
                            {renderWritingText(trimLine(correctKnownSpellings(item), 34), itemProgress, undefined, itemProgress > 0 && itemProgress < 1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="scene-progress">
              <div className="scene-progress-fill" style={{width: `${totalProgress * 100}%`}} />
            </div>
          </div>
        </div>
      </div>
      {debugEnabled ? (
        <div className="notes-debug">
          {activeOverlay?.sceneType || 'scene'} · {activeOverlay?.visual || 'token'} · {activeOverlay?.revealPlan?.length || 0} reveals
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

function trimLine(value: string, maxChars: number) {
  const source = cleanText(value);
  if (source.length <= maxChars) return source;
  return `${source.slice(0, maxChars).replace(/\s+\S*$/, '')}...`;
}

export const NotesComposition = () => (
  <Composition
    id={COMPOSITION_ID}
    component={Notes}
    fps={fps}
    width={width}
    height={height}
    defaultProps={defaultProps}
    calculateMetadata={({props}: {props: ReelProps}) => ({
      durationInFrames: Math.max(1, Math.round(getDurationSeconds(props) * fps)),
      props: {
        ...props,
        brand: props.brand || '',
        mediaType: props.mediaType || 'audio',
        templateName: TEMPLATE_NAME as typeof TEMPLATE_NAME,
        backgroundMusic: props.backgroundMusic !== false,
        backgroundMusicMood: props.backgroundMusicMood || 'ambient',
        backgroundMusicVolume: props.backgroundMusicVolume ?? 0.018,
      },
    })}
  />
);
