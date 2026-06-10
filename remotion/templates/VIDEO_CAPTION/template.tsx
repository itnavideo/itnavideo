import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {type CSSProperties} from 'react';

export const TEMPLATE_NAME = 'VIDEO_CAPTION';
export const COMPOSITION_ID = 'VIDEO-CAPTION';

type TimedWord = {
  word: string;
  start: number;
  end: number;
  lineIndex?: number;
  wordIndex?: number;
};

type CaptionItem = {
  id?: string;
  start: number;
  end: number;
  text: string;
  lines?: string[];
  words?: TimedWord[];
  mode?: 'wordHighlight' | 'phraseReveal' | 'segmentCaption';
  stylePreset?: 'boldCreator' | 'cleanSubtitle' | 'podcast' | 'screenRecord' | 'productDemo';
};

type OverlayItem = {
  id?: string;
  start: number;
  end: number;
  text: string;
  words?: TimedWord[];
};

type ReelProps = {
  brand?: string;
  topicTitle?: string;
  templateName?: typeof TEMPLATE_NAME;
  mediaType: 'video' | 'audio' | 'image';
  mediaSrc?: string;
  mediaTrimStartSeconds?: number;
  durationSeconds?: number;
  captions?: CaptionItem[];
  captionPlan?: {
    mode: 'wordHighlight' | 'phraseReveal' | 'segmentCaption';
    position: 'bottomSafe' | 'middleLower' | 'topSafe';
    avoidArea?: 'faceCenter' | 'screenCenter' | 'productCenter' | 'none';
    captions: CaptionItem[];
  };
  videoStyle?: {
    fit: 'cover' | 'contain';
    cropMode: 'center' | 'faceSafe' | 'screenSafe';
    backgroundBlur?: boolean;
  };
  safeZones?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  overlayTimeline?: OverlayItem[];
  captionStyle?: 'creator' | 'clean' | 'bold';
};

const fps = 24;
const width = 1080;
const height = 1920;
const maxDurationSeconds = 60;
const TOP_SAFE = 120;
const BOTTOM_SAFE = 340;
const LEFT_SAFE = 72;
const RIGHT_SAFE = 140;

const fontFaces = `
@font-face {
  font-family: CAPTION_Inter;
  src: url("${staticFile('assets/reusable/fonts/Inter/Inter-Variable.ttf')}") format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: CAPTION_Montserrat;
  src: url("${staticFile('assets/reusable/fonts/Montserrat/Montserrat-Variable.ttf')}") format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: CAPTION_Anton;
  src: url("${staticFile('assets/reusable/fonts/Anton/Anton-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: CAPTION_Bebas_Neue;
  src: url("${staticFile('assets/reusable/fonts/Bebas_Neue/BebasNeue-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: CAPTION_Oswald;
  src: url("${staticFile('assets/reusable/fonts/Oswald/Oswald-Variable.ttf')}") format('truetype');
  font-weight: 200 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: CAPTION_Barlow;
  src: url("${staticFile('assets/reusable/fonts/Barlow_Condensed/BarlowCondensed-Bold.ttf')}") format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
`;

const stylesheet = `
:root {
  --safe-top: ${TOP_SAFE}px;
  --safe-bottom: ${BOTTOM_SAFE}px;
  --safe-left: ${LEFT_SAFE}px;
  --safe-right: ${RIGHT_SAFE}px;
  --mint: #5ce8d5;
  --gold: #ffd84d;
  --ink: #050506;
}
.video-caption-root {
  background: #020304;
  color: white;
  font-family: CAPTION_Inter, Arial, sans-serif;
}
.source-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.video-vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.42) 0%, transparent 24%, transparent 62%, rgba(0,0,0,0.72) 100%),
    radial-gradient(circle at 50% 40%, transparent 0 42%, rgba(0,0,0,0.35) 100%);
  pointer-events: none;
}
.top-safe {
  position: absolute;
  left: 42px;
  right: 42px;
  top: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255,255,255,0.72);
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.caption-wrap {
  position: absolute;
  left: var(--safe-left);
  right: var(--safe-right);
  bottom: var(--safe-bottom);
  display: flex;
  justify-content: center;
  text-align: center;
}
.caption-wrap.middleLower {
  bottom: calc(var(--safe-bottom) + 150px);
}
.caption-wrap.topSafe {
  top: var(--safe-top);
  bottom: auto;
}
.caption-box {
  max-width: 940px;
  border-radius: 18px;
  background: rgba(0,0,0,0.34);
  box-shadow: 0 18px 58px rgba(0,0,0,0.38);
  padding: 20px 26px 22px;
  backdrop-filter: blur(8px);
}
.caption-line {
  color: rgba(255,255,255,0.94);
  font-family: CAPTION_Bebas_Neue, CAPTION_Anton, CAPTION_Oswald, CAPTION_Montserrat, CAPTION_Inter, Arial, sans-serif;
  font-size: 58px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.06;
  text-transform: uppercase;
  text-shadow: 0 6px 22px rgba(0,0,0,0.62);
}
.caption-line-row + .caption-line-row {
  margin-top: 6px;
}
.caption-line.clean {
  font-family: CAPTION_Inter, Arial, sans-serif;
  font-size: 48px;
  line-height: 1.18;
  text-transform: none;
}
.caption-line.bold {
  font-size: 66px;
}
.caption-line.cleanSubtitle,
.caption-line.screenRecord,
.caption-line.productDemo {
  font-family: CAPTION_Inter, Arial, sans-serif;
  font-size: 48px;
  line-height: 1.14;
  text-transform: none;
}
.caption-line.podcast {
  font-family: CAPTION_Montserrat, CAPTION_Inter, Arial, sans-serif;
  font-size: 54px;
  text-transform: none;
}
.caption-line.boldCreator {
  font-size: 60px;
}
.caption-word {
  display: inline-block;
  margin: 0 7px;
  color: rgba(255,255,255,0.9);
  transform-origin: center bottom;
}
.caption-word.active {
  color: var(--gold);
  text-shadow: 0 0 24px rgba(255,216,77,0.42), 0 6px 22px rgba(0,0,0,0.62);
  transform: scale(1.08);
}
.caption-bar {
  height: 6px;
  margin: 20px auto 0;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.16);
}
.caption-bar-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--mint), var(--gold));
}
.progress {
  position: absolute;
  left: 190px;
  right: 190px;
  bottom: calc(var(--safe-bottom) - 72px);
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.16);
}
.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--mint), white, var(--gold));
}
.caption-debug {
  position: absolute;
  left: 24px;
  bottom: 24px;
  z-index: 10;
  max-width: 440px;
  border-radius: 10px;
  background: rgba(0,0,0,0.72);
  color: rgba(255,255,255,0.88);
  font-family: CAPTION_Inter, Arial, sans-serif;
  font-size: 15px;
  line-height: 1.35;
  padding: 10px 12px;
  pointer-events: none;
}
`;

const defaultProps: ReelProps = {
  brand: 'itnavideo',
  templateName: TEMPLATE_NAME,
  mediaType: 'video',
  durationSeconds: 12,
  topicTitle: 'Video Caption',
  captionStyle: 'creator',
  captions: [
    {start: 0, end: 4, text: 'Upload video get clean captions', lines: ['Upload video', 'get clean captions'], mode: 'phraseReveal', stylePreset: 'boldCreator'},
    {start: 4, end: 8, text: 'Word timing feels synced', lines: ['Word timing', 'feels synced'], mode: 'phraseReveal', stylePreset: 'boldCreator'},
    {start: 8, end: 12, text: 'Ready for reels and shorts', lines: ['Ready for reels', 'and shorts'], mode: 'phraseReveal', stylePreset: 'boldCreator'},
  ],
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

const getDurationSeconds = (props: ReelProps) => {
  const captionEnd = Math.max(0, ...(props.captions || []).map((item) => Number(item.end) || 0));
  const overlayEnd = Math.max(0, ...(props.overlayTimeline || []).map((item) => Number(item.end) || 0));
  const requested = Number(props.durationSeconds) || 0;
  return clamp(Math.ceil(Math.max(requested, captionEnd, overlayEnd, 1)), 1, maxDurationSeconds);
};

const normalizeCaption = (item: CaptionItem): CaptionItem => ({
  id: item.id,
  start: Math.max(0, Number(item.start) || 0),
  end: Math.max(0, Number(item.end) || 0),
  text: cleanCaptionText(item.text).slice(0, 120),
  lines: normalizeCaptionLines(item.lines, item.text),
  words: normalizeCaptionWords(item.words),
  mode: item.mode === 'wordHighlight' || item.mode === 'phraseReveal' || item.mode === 'segmentCaption'
    ? item.mode
    : item.words?.length ? 'wordHighlight' : 'phraseReveal',
  stylePreset: normalizeCaptionStyle(item.stylePreset),
});

const getCaptions = (props: ReelProps): CaptionItem[] => {
  const captions = props.captionPlan?.captions?.length ? props.captionPlan.captions : props.captions?.length ? props.captions : [];
  return captions
    .map(normalizeCaption)
    .filter((item) => item.text && item.end > item.start);
};

const getActiveCaption = (captions: CaptionItem[], time: number) =>
  captions.find((caption) => time >= caption.start && time < caption.end) ||
  captions.find((caption) => time < caption.end) ||
  captions.at(-1);

const getActiveWords = (props: ReelProps, caption: CaptionItem | undefined) => {
  if (!caption) return [];
  if (caption.words?.length) return caption.words;
  const overlays = props.overlayTimeline || [];
  const overlay = overlays.find((item) => Math.abs(item.start - caption.start) < 0.25 || (caption.start >= item.start && caption.start < item.end));
  return overlay?.words || [];
};

const renderCaptionWords = (caption: CaptionItem, activeWords: TimedWord[], localTime: number) => {
  const lines = caption.lines?.length ? caption.lines : normalizeCaptionLines(undefined, caption.text);
  const words = lines.join(' ').split(/\s+/).filter(Boolean).slice(0, 14);
  if (!activeWords.length) {
    return lines.map((line, lineIndex) => (
      <div className="caption-line-row" key={`${line}-${lineIndex}`}>
        {line.split(/\s+/).filter(Boolean).map((word, index) => (
          <span className="caption-word" key={`${word}-${lineIndex}-${index}`}>{word}</span>
        ))}
      </div>
    ));
  }

  let globalIndex = 0;
  return lines.map((line, lineIndex) => (
    <div className="caption-line-row" key={`${line}-${lineIndex}`}>
      {line.split(/\s+/).filter(Boolean).map((word, wordIndex) => {
        const currentIndex = globalIndex;
        globalIndex += 1;
        const active = activeWords.some((timed) => {
          const indexedMatch = timed.lineIndex === lineIndex && timed.wordIndex === wordIndex;
          const same = normalizeWord(timed.word) === normalizeWord(word);
          return (indexedMatch || same || currentIndex === timed.wordIndex) && localTime >= timed.start && localTime <= timed.end + 0.06;
        });
        return <span className={`caption-word ${active ? 'active' : ''}`} key={`${word}-${lineIndex}-${wordIndex}`}>{word}</span>;
      })}
    </div>
  ));
};

const SourceVideo = ({mediaSrc, trimStart, fit}: {mediaSrc?: string; trimStart?: number; fit?: 'cover' | 'contain'}) => {
  const src = resolveMediaSrc(mediaSrc);
  if (!src) return null;
  return (
    <OffthreadVideo
      className="source-video"
      muted={false}
      src={src}
      style={{objectFit: fit === 'contain' ? 'contain' : 'cover'}}
      startFrom={Math.max(0, Math.round((trimStart || 0) * fps))}
    />
  );
};

const VideoCaption = (props: ReelProps) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const time = frame / fps;
  const captions = getCaptions(props);
  const activeCaption = getActiveCaption(captions, time);
  const activeWords = getActiveWords(props, activeCaption);
  const localTime = activeCaption ? time - activeCaption.start : 0;
  const captionProgress = activeCaption
    ? clamp(localTime / Math.max(0.1, activeCaption.end - activeCaption.start), 0, 1)
    : 0;
  const enter = activeCaption ? clamp((localTime * fps) / 8, 0, 1) : 0;
  const totalProgress = clamp(frame / Math.max(1, durationInFrames - 1), 0, 1);
  const captionStyle = activeCaption?.stylePreset || stylePresetFromLegacy(props.captionStyle);
  const debugEnabled = process.env.NODE_ENV !== 'production';
  const activeWord = activeWords.find((word) => localTime >= word.start && localTime <= word.end + 0.06)?.word;
  const safeZones = normalizeSafeZones(props.safeZones);
  const captionPosition = props.captionPlan?.position === 'middleLower' || props.captionPlan?.position === 'topSafe'
    ? props.captionPlan.position
    : 'bottomSafe';

  return (
    <AbsoluteFill
      className="video-caption-root"
      style={{
        '--safe-top': `${safeZones.top}px`,
        '--safe-bottom': `${safeZones.bottom}px`,
        '--safe-left': `${safeZones.left}px`,
        '--safe-right': `${safeZones.right}px`,
      } as CSSProperties}
    >
      <style>{fontFaces}</style>
      <style>{stylesheet}</style>
      <SourceVideo mediaSrc={props.mediaSrc} trimStart={props.mediaTrimStartSeconds} fit={props.videoStyle?.fit} />
      <div className="video-vignette" />
      {activeCaption ? (
        <div
          className={`caption-wrap ${captionPosition}`}
          style={{
            opacity: enter,
            transform: `translateY(${(1 - enter) * 18}px)`,
          }}
        >
          <div className="caption-box">
            <div className={`caption-line ${captionStyle}`}>
              {renderCaptionWords(activeCaption, activeWords, localTime)}
            </div>
            <div className="caption-bar">
              <div className="caption-bar-fill" style={{width: `${captionProgress * 100}%`}} />
            </div>
          </div>
        </div>
      ) : null}
      <div className="progress">
        <div className="progress-fill" style={{width: `${totalProgress * 100}%`}} />
      </div>
      {debugEnabled && activeCaption ? (
        <div className="caption-debug">
          {activeCaption.id || 'caption'} · {activeCaption.mode || 'phraseReveal'} · {activeWord || 'phrase'}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

function cleanCaptionText(value: unknown) {
  return String(value || '')
    .replace(/[\u0600-\u06FF]+/g, ' ')
    .replace(/[\u0750-\u077F]+/g, ' ')
    .replace(/[\u08A0-\u08FF]+/g, ' ')
    .replace(/[\u0900-\u097F]+/g, ' ')
    .replace(/[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCaptionLines(lines: CaptionItem['lines'], text: string) {
  const provided = (lines || [])
    .map((line) => cleanCaptionText(line).split(/\s+/).filter(Boolean).slice(0, 7).join(' '))
    .filter(Boolean)
    .slice(0, 2);
  if (provided.length) return provided;
  const words = cleanCaptionText(text).split(/\s+/).filter(Boolean).slice(0, 14);
  if (words.length <= 7) return [words.join(' ')];
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')].filter(Boolean);
}

function normalizeCaptionWords(words: CaptionItem['words']) {
  const cleaned = (words || [])
    .map((word, index) => ({
      word: cleanCaptionText(word.word).slice(0, 40),
      start: Math.max(0, Number(word.start) || 0),
      end: Math.max(0, Number(word.end) || 0),
      lineIndex: Number.isFinite(word.lineIndex) ? Math.max(0, Math.min(1, Number(word.lineIndex))) : undefined,
      wordIndex: Number.isFinite(word.wordIndex) ? Math.max(0, Math.min(14, Number(word.wordIndex))) : index,
    }))
    .filter((word) => word.word && word.end > word.start);
  return cleaned.length ? cleaned : undefined;
}

function normalizeCaptionStyle(value: CaptionItem['stylePreset']) {
  if (value === 'boldCreator' || value === 'cleanSubtitle' || value === 'podcast' || value === 'screenRecord' || value === 'productDemo') return value;
  return 'boldCreator';
}

function normalizeSafeZones(value: ReelProps['safeZones']) {
  return {
    top: clamp(Number(value?.top) || TOP_SAFE, 0, 320),
    bottom: clamp(Number(value?.bottom) || BOTTOM_SAFE, 0, 520),
    left: clamp(Number(value?.left) || LEFT_SAFE, 0, 240),
    right: clamp(Number(value?.right) || RIGHT_SAFE, 0, 240),
  };
}

function stylePresetFromLegacy(value: ReelProps['captionStyle']): CaptionItem['stylePreset'] {
  if (value === 'clean') return 'cleanSubtitle';
  if (value === 'bold' || value === 'creator') return 'boldCreator';
  return 'boldCreator';
}

function normalizeWord(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export const VideoCaptionComposition = () => (
  <Composition
    id={COMPOSITION_ID}
    component={VideoCaption}
    fps={fps}
    width={width}
    height={height}
    defaultProps={defaultProps}
    calculateMetadata={({props}: {props: ReelProps}) => ({
      durationInFrames: Math.max(1, Math.round(getDurationSeconds(props) * fps)),
      props: {
        ...props,
        brand: props.brand || 'itnavideo',
        mediaType: 'video' as const,
        templateName: TEMPLATE_NAME as typeof TEMPLATE_NAME,
        captionStyle: props.captionStyle || 'creator',
      },
    })}
  />
);
