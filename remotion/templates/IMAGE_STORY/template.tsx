import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {type CSSProperties} from 'react';

export const TEMPLATE_NAME = 'IMAGE_STORY';
export const COMPOSITION_ID = 'IMAGE-STORY';

type ImageStoryScene = {
  id?: string;
  start: number;
  end: number;
  imageSrc?: string;
  imageFit?: 'cover' | 'contain' | 'smart';
  focusX?: number;
  focusY?: number;
  motionType?: 'slowZoomIn' | 'slowZoomOut' | 'panLeft' | 'panRight' | 'panUp' | 'panDown' | 'parallax' | 'pushIn' | 'reveal';
  motionIntensity?: 'low' | 'medium';
  textPosition?: 'topSafe' | 'lowerThird' | 'centerSoft' | 'none';
  transitionIn?: 'fade' | 'cut' | 'slide' | 'blurReveal';
  transitionOut?: 'fade' | 'cut' | 'blur';
  title: string;
  body?: string;
  accentWord?: string;
  label?: string;
  tone?: 'hook' | 'proof' | 'warning' | 'action' | 'cta' | 'point';
};

type OverlayItem = {
  id?: string;
  start: number;
  end: number;
  type?: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta';
  text: string;
  body?: string;
  accentWord?: string;
  label?: string;
};

type ReelProps = {
  brand?: string;
  topicTitle?: string;
  templateName?: typeof TEMPLATE_NAME;
  mediaType?: 'audio' | 'video' | 'image';
  mediaSrc?: string;
  mediaTrimStartSeconds?: number;
  durationSeconds?: number;
  backgroundMusic?: boolean;
  backgroundMusicSrc?: string;
  backgroundMusicVolume?: number;
  source?: {
    mode: 'singleImage' | 'multiImage' | 'audioImageStory' | 'imageOnlyStory';
    topic?: string;
    prompt?: string;
  };
  images?: Array<{
    id: string;
    src: string;
    source: 'uploaded' | 'selectedAsset' | 'generated' | 'fallback';
    width?: number;
    height?: number;
    alt?: string;
    category?: string;
    safeCrop?: {
      focusX: number;
      focusY: number;
      avoidTextZone?: 'top' | 'bottom' | 'center' | 'none';
    };
  }>;
  storyPlan?: {
    languageMode: 'english' | 'roman_hinglish';
    stylePreset: 'cinematic' | 'product' | 'motivation' | 'education' | 'documentary';
    scenes: Array<{
      id: string;
      start: number;
      end: number;
      imageId: string;
      imageRole: 'hero' | 'detail' | 'proof' | 'transition' | 'ending';
      beatText?: string;
      label?: string;
      title?: string;
      motion: {
        type: NonNullable<ImageStoryScene['motionType']>;
        intensity: 'low' | 'medium';
        focusX?: number;
        focusY?: number;
      };
      textOverlay?: {
        enabled: boolean;
        text?: string;
        position: 'topSafe' | 'lowerThird' | 'centerSoft' | 'none';
        maxLines: 1 | 2;
        style: 'minimalTitle' | 'smallLabel' | 'punchLine' | 'productTag';
      };
      transition?: {
        in: 'fade' | 'cut' | 'slide' | 'blurReveal';
        out: 'fade' | 'cut' | 'blur';
      };
    }>;
  };
  safeZones?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  imageSources?: string[];
  imageScenes?: ImageStoryScene[];
  overlayTimeline?: OverlayItem[];
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
  font-family: IMAGE_Inter;
  src: url("${staticFile('assets/reusable/fonts/Inter/Inter-Variable.ttf')}") format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: IMAGE_Montserrat;
  src: url("${staticFile('assets/reusable/fonts/Montserrat/Montserrat-Variable.ttf')}") format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: IMAGE_Anton;
  src: url("${staticFile('assets/reusable/fonts/Anton/Anton-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: IMAGE_Bebas_Neue;
  src: url("${staticFile('assets/reusable/fonts/Bebas_Neue/BebasNeue-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: IMAGE_Oswald;
  src: url("${staticFile('assets/reusable/fonts/Oswald/Oswald-Variable.ttf')}") format('truetype');
  font-weight: 200 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: IMAGE_Barlow;
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
  --text: rgba(255,255,255,0.96);
  --muted: rgba(255,255,255,0.78);
  --accent: #ffd84d;
  --cyan: #5ce8d5;
  --danger: #ff756b;
}
.image-story-root {
  background: #030506;
  color: var(--text);
  font-family: IMAGE_Inter, Arial, sans-serif;
}
.scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.image-bg {
  position: absolute;
  inset: -48px;
  filter: blur(26px) saturate(1.04) brightness(0.58);
  transform: scale(1.1);
}
.image-main {
  position: absolute;
  inset: 0;
}
.image-main.contain {
  inset: var(--safe-top) 34px var(--safe-bottom);
}
.image-main img,
.image-bg img {
  width: 100%;
  height: 100%;
  object-position: center;
}
.image-main.cover img,
.image-bg img {
  object-fit: cover;
}
.image-main.contain img {
  object-fit: contain;
}
.semantic-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 28% 18%, rgba(255,216,77,0.22), transparent 28%),
    radial-gradient(circle at 80% 30%, rgba(92,232,213,0.16), transparent 28%),
    linear-gradient(180deg, #060708 0%, #090d10 50%, #030506 100%);
}
.semantic-grid {
  position: absolute;
  inset: var(--safe-top) 46px var(--safe-bottom);
  border-radius: 34px;
  background-image:
    linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: radial-gradient(circle at 50% 46%, black 0 42%, transparent 78%);
}
.finance-symbol {
  position: absolute;
  right: 76px;
  top: calc(var(--safe-top) + 42px);
  color: rgba(255,216,77,0.18);
  font-family: IMAGE_Bebas_Neue, IMAGE_Anton, IMAGE_Oswald, Arial, sans-serif;
  font-size: 260px;
  line-height: 1;
}
.semantic-pill-row {
  position: absolute;
  left: 82px;
  right: 82px;
  top: calc(var(--safe-top) + 96px);
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.semantic-pill {
  border: 1px solid rgba(255,216,77,0.22);
  border-radius: 999px;
  background: rgba(0,0,0,0.32);
  color: rgba(255,255,255,0.78);
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 12px 18px;
  text-transform: uppercase;
}
.semantic-card {
  position: absolute;
  left: 78px;
  right: 78px;
  top: calc(var(--safe-top) + 235px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 30px;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025));
  box-shadow: 0 30px 80px rgba(0,0,0,0.28);
  padding: 34px;
}
.semantic-card-title {
  color: rgba(255,216,77,0.94);
  font-family: IMAGE_Bebas_Neue, IMAGE_Anton, IMAGE_Oswald, Arial, sans-serif;
  font-size: 72px;
  line-height: 0.95;
  text-transform: uppercase;
}
.semantic-card-line {
  height: 12px;
  margin-top: 22px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(92,232,213,0.9), rgba(255,216,77,0.9), transparent);
}
.shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.56) 0%, rgba(0,0,0,0.08) 27%, rgba(0,0,0,0.18) 56%, rgba(0,0,0,0.84) 100%),
    radial-gradient(circle at 50% 36%, transparent 0 36%, rgba(0,0,0,0.42) 100%);
}
.safe-frame {
  position: absolute;
  left: 46px;
  right: 46px;
  top: var(--safe-top);
  bottom: var(--safe-bottom);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 34px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 28px 80px rgba(0,0,0,0.36);
  pointer-events: none;
}
.copy {
  position: absolute;
  left: var(--safe-left);
  right: var(--safe-right);
  bottom: calc(var(--safe-bottom) + 64px);
  z-index: 5;
}
.copy.topSafe {
  top: var(--safe-top);
  bottom: auto;
}
.copy.centerSoft {
  top: 50%;
  bottom: auto;
  transform: translateY(-50%);
}
.copy.none {
  display: none;
}
.copy.center {
  text-align: center;
}
.label {
  display: inline-flex;
  margin-bottom: 20px;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  background: rgba(0,0,0,0.52);
  color: var(--cyan);
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.14em;
  padding: 10px 16px;
  text-transform: uppercase;
}
.title {
  margin: 0;
  color: var(--text);
  font-family: IMAGE_Bebas_Neue, IMAGE_Anton, IMAGE_Oswald, IMAGE_Montserrat, IMAGE_Inter, Arial, sans-serif;
  font-size: 98px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 0.94;
  text-transform: uppercase;
  text-shadow: 0 14px 44px rgba(0,0,0,0.62);
  text-wrap: balance;
}
.title .accent {
  color: var(--accent);
}
.body {
  max-width: 860px;
  margin-top: 24px;
  color: var(--muted);
  font-size: 36px;
  font-weight: 850;
  line-height: 1.28;
  text-shadow: 0 8px 26px rgba(0,0,0,0.68);
}
.center .body {
  margin-left: auto;
  margin-right: auto;
}
.warning .label {
  color: var(--danger);
}
.warning .title .accent,
.warning .title {
  color: #fff3f0;
}
.progress {
  position: absolute;
  left: 190px;
  right: 190px;
  bottom: calc(var(--safe-bottom) - 54px);
  z-index: 6;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.18);
}
.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--cyan));
}
.debug-label {
  position: absolute;
  left: 24px;
  bottom: 24px;
  z-index: 20;
  max-width: 460px;
  border-radius: 10px;
  background: rgba(0,0,0,0.72);
  color: rgba(255,255,255,0.9);
  font-family: IMAGE_Inter, Arial, sans-serif;
  font-size: 15px;
  line-height: 1.35;
  padding: 10px 12px;
  pointer-events: none;
}
`;

const defaultProps: ReelProps = {
  brand: 'itnavideo',
  templateName: TEMPLATE_NAME,
  mediaType: 'audio',
  durationSeconds: 14,
  backgroundMusic: true,
  backgroundMusicVolume: 0.024,
  topicTitle: 'Image Story',
  imageSources: [
    '/visuals/full-screen-reel-preview.png',
    '/visuals/video-explainer-preview.png',
    '/visuals/site-scenes/students-campus-walk.png',
  ],
  overlayTimeline: [
    {start: 0, end: 5, type: 'hook', text: 'IMAGE STORY REEL', body: 'Voiceover becomes a cinematic image-first reel.', accentWord: 'IMAGE'},
    {start: 5, end: 10, type: 'point', text: 'SCRIPT PICKS VISUALS', body: 'Script details decide what images each scene needs.', accentWord: 'VISUALS'},
    {start: 10, end: 14, type: 'cta', text: 'READY TO TEST', body: 'Full-screen images, clean text, music, and safe zones.', accentWord: 'TEST'},
  ],
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const resolveSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

const cleanText = (value: unknown) => String(value || '')
  .replace(/[\u0600-\u06FF]+/g, ' ')
  .replace(/[\u0750-\u077F]+/g, ' ')
  .replace(/[\u08A0-\u08FF]+/g, ' ')
  .replace(/[\u0900-\u097F]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const getDurationSeconds = (props: ReelProps) => {
  const overlayEnd = Math.max(0, ...(props.overlayTimeline || []).map((item) => Number(item.end) || 0));
  const sceneEnd = Math.max(0, ...(props.imageScenes || []).map((item) => Number(item.end) || 0));
  const requested = Number(props.durationSeconds) || 0;
  return clamp(Math.ceil(Math.max(requested, overlayEnd, sceneEnd, 1)), 1, maxDurationSeconds);
};

const buildScenes = (props: ReelProps): ImageStoryScene[] => {
  if (props.storyPlan?.scenes?.length && props.images?.length) {
    return props.storyPlan.scenes.map((scene, index) => {
      const image = props.images?.find((item) => item.id === scene.imageId) || props.images?.[index % props.images.length];
      const text = scene.textOverlay?.enabled ? scene.textOverlay.text || scene.title || scene.beatText || '' : '';
      return normalizeScene({
        id: scene.id,
        start: scene.start,
        end: scene.end,
        imageSrc: image?.src,
        imageFit: image?.width && image?.height && image.width > image.height ? 'contain' : 'smart',
        focusX: scene.motion.focusX ?? image?.safeCrop?.focusX ?? 0.5,
        focusY: scene.motion.focusY ?? image?.safeCrop?.focusY ?? 0.45,
        motionType: scene.motion.type,
        motionIntensity: scene.motion.intensity,
        textPosition: scene.textOverlay?.position || 'lowerThird',
        transitionIn: scene.transition?.in || 'fade',
        transitionOut: scene.transition?.out || 'fade',
        title: text || scene.title || scene.beatText || '',
        body: '',
        accentWord: text.split(/\s+/).find((word) => /[0-9₹$%]/.test(word) || word.length > 4),
        label: scene.label,
        tone: scene.imageRole === 'ending' ? 'cta' : scene.imageRole === 'hero' ? 'hook' : 'point',
      });
    }).filter((scene) => scene.end > scene.start && scene.imageSrc);
  }
  if (props.imageScenes?.length) return props.imageScenes.map(normalizeScene).filter((scene) => scene.end > scene.start && scene.imageSrc);
  const imageSources = props.imageSources?.length ? props.imageSources : [];
  return (props.overlayTimeline?.length ? props.overlayTimeline : []).map((item, index) => normalizeScene({
    id: item.id || `image-scene-${index + 1}`,
    start: item.start,
    end: item.end,
    imageSrc: imageSources[index % imageSources.length],
    imageFit: 'smart',
    title: item.text,
    body: item.body,
    accentWord: item.accentWord,
    label: item.label || labelForType(item.type),
    tone: item.type === 'warning' ? 'warning' : item.type === 'cta' ? 'cta' : item.type === 'hook' ? 'hook' : 'point',
  })).filter((scene) => scene.end > scene.start && scene.imageSrc);
};

const normalizeScene = (scene: ImageStoryScene): ImageStoryScene => ({
  ...scene,
  start: Math.max(0, Number(scene.start) || 0),
  end: Math.max(0, Number(scene.end) || 0),
  imageSrc: cleanText(scene.imageSrc),
  imageFit: scene.imageFit || 'smart',
  focusX: clamp(Number(scene.focusX ?? 0.5), 0, 1),
  focusY: clamp(Number(scene.focusY ?? 0.45), 0, 1),
  motionType: scene.motionType || 'slowZoomIn',
  motionIntensity: scene.motionIntensity || 'low',
  textPosition: scene.textPosition || 'lowerThird',
  transitionIn: scene.transitionIn || 'fade',
  transitionOut: scene.transitionOut || 'fade',
  title: limitWords(cleanText(scene.title), 7, 86),
  body: limitWords(cleanText(scene.body), 10, 150),
  accentWord: cleanText(scene.accentWord).split(/\s+/)[0] || undefined,
  label: cleanText(scene.label || labelForType(scene.tone)).slice(0, 38),
  tone: scene.tone || 'point',
});

const labelForType = (type?: string) => {
  if (type === 'hook') return 'Story';
  if (type === 'warning') return 'Watch';
  if (type === 'cta') return 'Final';
  if (type === 'stat') return 'Proof';
  return '';
};

function limitWords(value: string, maxWords: number, maxChars: number) {
  return value.split(/\s+/).filter(Boolean).slice(0, maxWords).join(' ').slice(0, maxChars);
}

const renderTitle = (text: string, accentWord?: string) => {
  if (!accentWord) return text;
  const normalizedAccent = accentWord.toLowerCase().replace(/[^a-z0-9]+/g, '');
  return text.split(/(\s+)/).map((part, index) => {
    const normalizedPart = part.toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (normalizedPart !== normalizedAccent) return part;
    return <span className="accent" key={`${part}-${index}`}>{part}</span>;
  });
};

const SceneLayer = ({scene, durationFrames}: {scene: ImageStoryScene; durationFrames: number}) => {
  const frame = useCurrentFrame();
  const progress = clamp(frame / Math.max(1, durationFrames - 1), 0, 1);
  const enter = clamp(frame / 14, 0, 1);
  const exit = clamp((durationFrames - frame) / 12, 0, 1);
  const opacity = Math.min(enter, exit);
  const motion = getMotionTransform(scene, progress);
  const transition = getTransitionStyle(scene, enter, exit);
  const isContain = scene.imageFit === 'contain';
  const titleSize = scene.title.length > 46 ? 72 : scene.title.length > 28 ? 84 : 98;
  const hasImage = Boolean(scene.imageSrc);
  const objectPosition = `${Math.round((scene.focusX ?? 0.5) * 100)}% ${Math.round((scene.focusY ?? 0.45) * 100)}%`;
  if (!hasImage) return null;

  return (
    <div className={`scene ${scene.tone || ''}`} style={{opacity, ...transition}}>
      <div className="image-bg">
        <Img src={resolveSrc(scene.imageSrc)} style={{objectPosition}} />
      </div>
      <div className={`image-main ${isContain ? 'contain' : 'cover'}`} style={{transform: motion}}>
        <Img src={resolveSrc(scene.imageSrc)} style={{objectPosition}} />
      </div>
      <div className="shade" />
      <div className="safe-frame" />
      <div
        className={`copy ${scene.textPosition || 'lowerThird'} ${scene.tone === 'hook' || scene.title.length < 24 ? 'center' : ''}`}
        style={{transform: scene.textPosition === 'centerSoft' ? `translateY(${(1 - enter) * 22 - 50}%)` : `translateY(${(1 - enter) * 22}px)`}}
      >
        {scene.label ? <div className="label">{scene.label}</div> : null}
        {scene.title ? <h1 className="title" style={{fontSize: titleSize}}>{renderTitle(scene.title, scene.accentWord)}</h1> : null}
        {scene.body ? <div className="body">{renderTitle(scene.body, scene.accentWord)}</div> : null}
      </div>
    </div>
  );
};

function getMotionTransform(scene: ImageStoryScene, progress: number) {
  const amount = scene.motionIntensity === 'medium' ? 1 : 0.62;
  const zoom = scene.motionType === 'slowZoomOut'
    ? 1.08 - progress * 0.045 * amount
    : scene.motionType === 'pushIn'
      ? 1.02 + progress * 0.08 * amount
      : 1.025 + progress * 0.05 * amount;
  const pan = 34 * amount;
  const x = scene.motionType === 'panLeft'
    ? pan - progress * pan * 2
    : scene.motionType === 'panRight'
      ? -pan + progress * pan * 2
      : scene.motionType === 'parallax'
        ? Math.sin(progress * Math.PI) * pan * 0.7
        : 0;
  const y = scene.motionType === 'panUp'
    ? pan - progress * pan * 2
    : scene.motionType === 'panDown'
      ? -pan + progress * pan * 2
      : scene.motionType === 'reveal'
        ? (1 - progress) * 18
        : 0;
  return `translate(${x}px, ${y}px) scale(${zoom})`;
}

function getTransitionStyle(scene: ImageStoryScene, enter: number, exit: number): CSSProperties {
  const inBlur = scene.transitionIn === 'blurReveal' ? (1 - enter) * 16 : 0;
  const outBlur = scene.transitionOut === 'blur' ? (1 - exit) * 14 : 0;
  const slideX = scene.transitionIn === 'slide' ? (1 - enter) * 28 : 0;
  return {
    filter: `blur(${Math.max(inBlur, outBlur)}px)`,
    transform: slideX ? `translateX(${slideX}px)` : undefined,
  };
}

const SourceAudio = ({mediaSrc, trimStart}: {mediaSrc?: string; trimStart?: number}) => {
  const src = resolveSrc(mediaSrc);
  if (!src) return null;
  return <Audio src={src} startFrom={Math.max(0, Math.round((trimStart || 0) * fps))} />;
};

const BackgroundMusic = ({enabled, src, volume}: {enabled?: boolean; src?: string; volume?: number}) => {
  if (enabled === false) return null;
  const musicSrc = resolveSrc(src);
  if (!musicSrc) return null;
  return <Audio loop src={musicSrc} volume={clamp(Number(volume ?? 0.024), 0, 0.07)} />;
};

const ImageStory = (props: ReelProps) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scenes = buildScenes(props);
  const totalProgress = clamp(frame / Math.max(1, durationInFrames - 1), 0, 1);
  const safeZones = normalizeSafeZones(props.safeZones);
  const activeScene = scenes.find((scene) => frame / fps >= scene.start && frame / fps < scene.end) || scenes[0];
  const debugEnabled = process.env.NODE_ENV !== 'production';

  return (
    <AbsoluteFill
      className="image-story-root"
      style={{
        '--safe-top': `${safeZones.top}px`,
        '--safe-bottom': `${safeZones.bottom}px`,
        '--safe-left': `${safeZones.left}px`,
        '--safe-right': `${safeZones.right}px`,
      } as CSSProperties}
    >
      <style>{fontFaces}</style>
      <style>{stylesheet}</style>
      <BackgroundMusic enabled={props.backgroundMusic} src={props.backgroundMusicSrc} volume={props.backgroundMusicVolume} />
      <SourceAudio mediaSrc={props.mediaSrc} trimStart={props.mediaTrimStartSeconds} />
      {scenes.map((scene) => {
        const from = Math.max(0, Math.round(scene.start * fps));
        const durationFrames = Math.max(1, Math.round((scene.end - scene.start) * fps));
        return (
          <Sequence from={from} durationInFrames={durationFrames} key={scene.id || `${scene.start}-${scene.title}`}>
            <SceneLayer scene={scene} durationFrames={durationFrames} />
          </Sequence>
        );
      })}
      <div className="progress"><div className="progress-fill" style={{width: `${totalProgress * 100}%`}} /></div>
      {debugEnabled && activeScene ? (
        <div className="debug-label">
          {activeScene.id || 'scene'} · {activeScene.motionType || 'motion'} · {props.source?.mode || 'imageStory'}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

function normalizeSafeZones(value: ReelProps['safeZones']) {
  return {
    top: clamp(Number(value?.top) || TOP_SAFE, 0, 320),
    bottom: clamp(Number(value?.bottom) || BOTTOM_SAFE, 0, 520),
    left: clamp(Number(value?.left) || LEFT_SAFE, 0, 240),
    right: clamp(Number(value?.right) || RIGHT_SAFE, 0, 240),
  };
}

export const ImageStoryComposition = () => (
  <Composition
    id={COMPOSITION_ID}
    component={ImageStory}
    fps={fps}
    width={width}
    height={height}
    defaultProps={defaultProps}
    calculateMetadata={({props}: {props: ReelProps}) => ({
      durationInFrames: Math.max(1, Math.round(getDurationSeconds(props) * fps)),
      props: {
        ...props,
        brand: props.brand || 'itnavideo',
        mediaType: props.mediaType || 'audio',
        templateName: TEMPLATE_NAME as typeof TEMPLATE_NAME,
        backgroundMusic: props.backgroundMusic !== false,
        backgroundMusicVolume: props.backgroundMusicVolume ?? 0.024,
      },
    })}
  />
);
