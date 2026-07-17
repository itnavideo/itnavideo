/**
 * Caption Studio — advanced manual caption template.
 * Every visual primitive (font/size/weight/case/color/stroke/shadow/rotation/position)
 * is a first-class prop, so the dashboard can expose the full control panel.
 */
import {
  AbsoluteFill,
  Composition,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {CaptionSegment, WordTiming} from '../../types/subtitles';
import {resolveFont} from '../../utils/fonts';

type TextCase = 'as-is' | 'uppercase' | 'title' | 'lowercase';
type BackgroundShape = 'pill' | 'rounded' | 'square' | 'none';
type ShadowPreset = 'none' | 'soft' | 'hard';
type Position = 'bottom' | 'center' | 'top';
type HorizontalAlign = 'left' | 'center' | 'right';
type EntryAnimation = 'none' | 'fade' | 'slide-up' | 'pop';
type EmphasisMode = 'color' | 'scale' | 'box' | 'underline' | 'none';

type CaptionStudioProps = {
  mediaSrc?: string;
  mediaType?: 'video' | 'audio';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  captions?: CaptionSegment[];
  subtitleChunks?: CaptionSegment[];
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  language?: string;

  // Text
  fontFamily?: string;
  fontSizePx?: number;
  fontWeight?: number;
  italic?: boolean;
  textCase?: TextCase;
  letterSpacingEm?: number;
  lineHeight?: number;

  // Color
  textColor?: string;
  activeWordColor?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  backgroundShape?: BackgroundShape;
  paddingPx?: number;

  // Effects
  strokeWidthPx?: number;
  strokeColor?: string;
  shadow?: ShadowPreset;
  rotationDeg?: number;

  // Position
  position?: Position;
  horizontalAlign?: HorizontalAlign;
  maxWidthPercent?: number;

  // Motion
  entryAnimation?: EntryAnimation;
  emphasisMode?: EmphasisMode;
  wordsPerGroup?: number;
};

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

function normalizeCaptions(captions: CaptionSegment[], subtitleChunks?: CaptionSegment[]) {
  return (captions.length > 0 ? captions : subtitleChunks || [])
    .map((caption) => ({
      start: Number(caption.start ?? 0),
      end: Number(caption.end ?? (caption.start ?? 0) + 2.5),
      text: String(caption.text || ''),
      words: Array.isArray(caption.words)
        ? caption.words.map((word) => ({
            word: String(word.word || ''),
            start: Number(word.start ?? 0),
            end: Number(word.end ?? 0),
          }))
        : undefined,
    }))
    .filter((caption) => caption.text.trim());
}

function applyCase(text: string, mode: TextCase): string {
  if (mode === 'uppercase') return text.toUpperCase();
  if (mode === 'lowercase') return text.toLowerCase();
  if (mode === 'title') return text.replace(/\b\w/g, (c) => c.toUpperCase());
  return text;
}

function borderRadiusFor(shape: BackgroundShape, fontSizePx: number): number | string {
  if (shape === 'pill') return 999;
  if (shape === 'rounded') return Math.round(fontSizePx * 0.35);
  if (shape === 'square') return 8;
  return 0;
}

function shadowStyle(preset: ShadowPreset): string {
  if (preset === 'soft') return '0 4px 14px rgba(0,0,0,0.65)';
  if (preset === 'hard') return '2px 3px 0 rgba(0,0,0,0.92)';
  return 'none';
}

type StudioGroup = {start: number; end: number; words: WordTiming[]};

/**
 * Re-chunk all caption words into groups of `wordsPerGroup`. When word-level
 * timing is missing, we fall back to the original caption segments as-is.
 */
function regroupByWordsPerGroup(captions: CaptionSegment[], wordsPerGroup: number): StudioGroup[] {
  const flatWords: WordTiming[] = [];
  captions.forEach((caption) => {
    if (caption.words && caption.words.length > 0) {
      caption.words.forEach((w) => flatWords.push({word: String(w.word), start: Number(w.start), end: Number(w.end)}));
    } else {
      // No word timing — split evenly across the segment duration
      const parts = caption.text.split(/\s+/).filter(Boolean);
      const span = Math.max(0.1, caption.end - caption.start);
      const per = span / Math.max(1, parts.length);
      parts.forEach((word, i) => {
        flatWords.push({word, start: caption.start + i * per, end: caption.start + (i + 1) * per});
      });
    }
  });

  const valid = flatWords.filter((w) => w.word && Number.isFinite(w.start) && Number.isFinite(w.end));
  if (valid.length === 0) return [];

  const size = Math.max(1, Math.min(5, Math.round(wordsPerGroup)));
  const groups: StudioGroup[] = [];
  for (let i = 0; i < valid.length; i += size) {
    const chunk = valid.slice(i, i + size);
    groups.push({
      start: chunk[0].start,
      end: Math.max(chunk[chunk.length - 1].end, chunk[0].start + 0.4),
      words: chunk,
    });
  }
  return groups;
}

function entryTransform(entryAnimation: EntryAnimation, localFrame: number, fps: number): React.CSSProperties {
  if (entryAnimation === 'none') return {};
  if (entryAnimation === 'fade') {
    return {opacity: interpolate(localFrame, [0, 6], [0, 1], {extrapolateRight: 'clamp'})};
  }
  if (entryAnimation === 'slide-up') {
    const y = spring({frame: localFrame, fps, config: {damping: 20, stiffness: 300, mass: 0.7}, from: 36, to: 0});
    const opacity = interpolate(localFrame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
    return {transform: `translateY(${y}px)`, opacity};
  }
  // pop
  const scale = spring({frame: localFrame, fps, config: {damping: 16, stiffness: 380, mass: 0.5}, from: 0.6, to: 1});
  const opacity = interpolate(localFrame, [0, 5], [0, 1], {extrapolateRight: 'clamp'});
  return {transform: `scale(${scale})`, opacity};
}

function CaptionStudioReel({
  mediaSrc,
  mediaType = 'video',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  captions = [],
  subtitleChunks,

  fontFamily = 'Inter, sans-serif',
  fontSizePx = 72,
  fontWeight = 800,
  italic = false,
  textCase = 'as-is',
  letterSpacingEm = 0,
  lineHeight = 1.2,

  textColor = '#FFFFFF',
  activeWordColor = '#22D3EE',
  backgroundColor = '#000000',
  backgroundOpacity = 0.6,
  backgroundShape = 'pill',
  paddingPx = 24,

  strokeWidthPx = 0,
  strokeColor = '#000000',
  shadow = 'soft',
  rotationDeg = 0,

  position = 'bottom',
  horizontalAlign = 'center',
  maxWidthPercent = 80,

  entryAnimation = 'slide-up',
  emphasisMode = 'color',
  wordsPerGroup = 4,
}: CaptionStudioProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const timeSec = frame / fps;

  const captionData = normalizeCaptions(captions, subtitleChunks);
  const videoStartFrom = Math.max(0, Math.round(mediaTrimStartSeconds * fps));
  const resolvedMediaSrc = resolveMediaSrc(mediaSrc);
  // Lambda only renders fonts registered via @remotion/google-fonts; resolve to a loaded family.
  const resolvedFontFamily = resolveFont(fontFamily);

  // Regroup words to the requested words-per-group, then find the active group
  const groups = regroupByWordsPerGroup(captionData, wordsPerGroup);
  const activeGroup = groups.find((g) => timeSec >= g.start && timeSec < g.end) || null;
  const activeCaption = activeGroup;
  const words = activeGroup ? activeGroup.words : [];
  const activeWord = activeGroup ? words.find((w) => timeSec >= w.start && timeSec < w.end) || null : null;

  // Entry animation is relative to the active group's start frame
  const groupStartFrame = activeGroup ? Math.round(activeGroup.start * fps) : 0;
  const localFrame = frame - groupStartFrame;
  const entryStyle = entryTransform(entryAnimation, localFrame, fps);

  const containerPositionStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: horizontalAlign === 'left' ? 'flex-start' : horizontalAlign === 'right' ? 'flex-end' : 'center',
    paddingLeft: 60,
    paddingRight: 60,
    ...(position === 'top' && {top: 180}),
    ...(position === 'center' && {top: '50%', transform: 'translateY(-50%)'}),
    ...(position === 'bottom' && {bottom: 180}),
  };

  // Compose rotation + entry animation into ONE transform so they don't overwrite each other.
  const composedTransform = [
    entryStyle.transform ? String(entryStyle.transform) : '',
    rotationDeg ? `rotate(${rotationDeg}deg)` : '',
  ].filter(Boolean).join(' ');
  const captionMotionStyle: React.CSSProperties = {
    ...(composedTransform ? {transform: composedTransform} : {}),
    ...(entryStyle.opacity !== undefined ? {opacity: entryStyle.opacity} : {}),
  };

  // Background color with opacity
  const hasBackground = backgroundShape !== 'none';
  const rgbaBg = hexToRgba(backgroundColor, backgroundOpacity);

  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      {resolvedMediaSrc && mediaType === 'video' ? (
        <OffthreadVideo
          src={resolvedMediaSrc}
          startFrom={videoStartFrom}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
          volume={sourceAudioVolume}
        />
      ) : (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: 'rgba(255,255,255,0.25)',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 36,
            fontWeight: 800,
          }}
        >
          Upload a video to design your captions
        </AbsoluteFill>
      )}

      {activeCaption && words.length > 0 ? (
        <div style={containerPositionStyle}>
          <div
            style={{
              ...captionMotionStyle,
              maxWidth: `${maxWidthPercent}%`,
              display: 'inline-flex',
              flexWrap: 'wrap',
              justifyContent: horizontalAlign === 'left' ? 'flex-start' : horizontalAlign === 'right' ? 'flex-end' : 'center',
              alignItems: 'baseline',
              gap: `${Math.round(fontSizePx * 0.28)}px`,
              padding: hasBackground ? `${paddingPx}px ${paddingPx + 8}px` : 0,
              background: hasBackground ? rgbaBg : 'transparent',
              borderRadius: borderRadiusFor(backgroundShape, fontSizePx),
            }}
          >
            {words.map((w, i) => {
              const isActive = activeWord ? w === activeWord : false;
              const emphasize = isActive && emphasisMode !== 'none';
              const useColor = emphasize && emphasisMode === 'color';
              const useScale = emphasize && emphasisMode === 'scale';
              const useBox = emphasize && emphasisMode === 'box';
              const useUnderline = emphasize && emphasisMode === 'underline';
              return (
                <span
                  key={`${i}-${w.word}`}
                  style={{
                    color: useColor || useScale || useUnderline ? activeWordColor : useBox ? '#0B1120' : textColor,
                    fontFamily: resolvedFontFamily,
                    fontSize: fontSizePx,
                    fontWeight,
                    fontStyle: italic ? 'italic' : 'normal',
                    letterSpacing: `${letterSpacingEm}em`,
                    lineHeight,
                    textShadow: shadowStyle(shadow),
                    WebkitTextStroke: strokeWidthPx > 0 ? `${strokeWidthPx}px ${strokeColor}` : undefined,
                    paintOrder: strokeWidthPx > 0 ? 'stroke fill' : undefined,
                    display: 'inline-block',
                    whiteSpace: 'pre',
                    transform: useScale ? 'scale(1.12)' : 'scale(1)',
                    transformOrigin: 'center bottom',
                    background: useBox ? activeWordColor : 'transparent',
                    borderRadius: useBox ? Math.round(fontSizePx * 0.18) : 0,
                    padding: useBox ? `0 ${Math.round(fontSizePx * 0.12)}px` : 0,
                    borderBottom: useUnderline ? `${Math.max(3, Math.round(fontSizePx * 0.08))}px solid ${activeWordColor}` : undefined,
                    transition: 'color 60ms linear, transform 80ms ease-out',
                  } as React.CSSProperties}
                >
                  {applyCase(w.word, textCase)}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

function hexToRgba(hex: string, opacity: number): string {
  const clean = String(hex || '#000000').replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return `rgba(0,0,0,${opacity})`;
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

const defaultProps: CaptionStudioProps = {
  mediaType: 'video',
  mediaSrc: '',
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,

  fontFamily: 'Inter, sans-serif',
  fontSizePx: 72,
  fontWeight: 800,
  italic: false,
  textCase: 'as-is',
  letterSpacingEm: 0,
  lineHeight: 1.2,

  textColor: '#FFFFFF',
  activeWordColor: '#22D3EE',
  backgroundColor: '#000000',
  backgroundOpacity: 0.6,
  backgroundShape: 'pill',
  paddingPx: 24,

  strokeWidthPx: 0,
  strokeColor: '#000000',
  shadow: 'soft',
  rotationDeg: 0,

  position: 'bottom',
  horizontalAlign: 'center',
  maxWidthPercent: 80,

  entryAnimation: 'slide-up',
  emphasisMode: 'color',
  wordsPerGroup: 4,

  durationSeconds: 90,
  sourceDurationSeconds: 90,

  captions: [
    {start: 0, end: 3, text: 'design your own captions'},
    {start: 3, end: 6, text: 'full control over every detail'},
    {start: 6, end: 9, text: 'ready to render in 9 by 16'},
  ],
};

export {CaptionStudioReel};

export const CaptionStudioComposition = () => (
  <Composition
    id="CAPTION-STUDIO"
    component={CaptionStudioReel}
    durationInFrames={2700}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as CaptionStudioProps;
      const durationSeconds = Math.max(5, Math.min(90,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 90
      ));
      return {durationInFrames: Math.ceil(durationSeconds * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
