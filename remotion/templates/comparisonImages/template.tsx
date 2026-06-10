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

export const TEMPLATE_NAME = 'comparisonImages';
export const COMPOSITION_ID = 'comparisonImages';

type CompareImage = {
  id?: string;
  src: string;
  label?: string;
};

type CompareScene = {
  id?: string;
  start: number;
  end: number;
  text: string;
  body?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftImageSrc?: string;
  rightImageSrc?: string;
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
  overlayTimeline?: CompareScene[];
  comparisonImages?: CompareImage[];
  safeZones?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};

const fps = 24;
const width = 1080;
const height = 1920;
const maxDurationSeconds = 60;
const TOP_SAFE = 112;
const BOTTOM_SAFE = 260;
const LEFT_SAFE = 34;
const RIGHT_SAFE = 96;

const fontFaces = `
@font-face {
  font-family: comparisonImages_Inter;
  src: url("${staticFile('assets/reusable/fonts/Inter/Inter-Variable.ttf')}") format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: comparisonImages_Bebas;
  src: url("${staticFile('assets/reusable/fonts/Bebas_Neue/BebasNeue-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
`;

const stylesheet = `
.comparisonImages-root {
  background: #f7f8f5;
  color: #050505;
  font-family: comparisonImages_Inter, Arial, sans-serif;
}
.scene {
  position: absolute;
  inset: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
}
.pair {
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 92px;
  align-items: start;
}
.label {
  margin: 0 auto 40px;
  width: max-content;
  max-width: 390px;
  border-radius: 8px;
  background: #050505;
  color: white;
  padding: 18px 38px 20px;
  font-family: comparisonImages_Bebas, comparisonImages_Inter, Arial, sans-serif;
  font-size: 56px;
  line-height: 0.9;
  letter-spacing: 0;
  text-align: center;
  text-transform: uppercase;
  box-shadow: 0 8px 0 rgba(0,0,0,0.08);
}
.image-box {
  display: grid;
  place-items: center;
  height: 440px;
  border: 6px solid #f02263;
  background: white;
  overflow: hidden;
}
.image-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.caption {
  position: absolute;
  left: 110px;
  right: 110px;
  top: 650px;
  display: flex;
  justify-content: center;
}
.caption-text {
  max-width: 760px;
  border-radius: 14px;
  background: #050505;
  color: white;
  padding: 18px 34px 22px;
  font-size: 44px;
  font-weight: 760;
  line-height: 1.08;
  text-align: center;
  letter-spacing: 0;
}
.caption-text.gray {
  border-radius: 0;
  background: rgba(170,170,170,0.72);
  color: #141414;
  font-size: 34px;
}
.handle {
  position: absolute;
  left: 0;
  right: 0;
  top: 800px;
  color: #202020;
  font-family: comparisonImages_Bebas, comparisonImages_Inter, Arial, sans-serif;
  font-size: 26px;
  letter-spacing: 0;
  text-align: center;
}
.presenter {
  position: absolute;
  left: 50%;
  top: 850px;
  width: 430px;
  height: 640px;
  transform: translateX(-50%);
}
.head {
  position: absolute;
  left: 136px;
  top: 28px;
  width: 164px;
  height: 164px;
  border: 8px solid #050505;
  border-radius: 999px;
  background: #fff3df;
}
.hair {
  position: absolute;
  left: 126px;
  top: 0;
  width: 182px;
  height: 78px;
  border-radius: 100px 100px 22px 22px;
  background: #050505;
  transform: rotate(-5deg);
}
.eye {
  position: absolute;
  top: 86px;
  width: 44px;
  height: 44px;
  border: 7px solid #050505;
  border-radius: 999px;
  background: white;
}
.eye.left {
  left: 164px;
}
.eye.right {
  left: 226px;
}
.glass {
  position: absolute;
  left: 207px;
  top: 105px;
  width: 22px;
  height: 6px;
  background: #050505;
}
.smile {
  position: absolute;
  left: 195px;
  top: 150px;
  width: 54px;
  height: 24px;
  border-bottom: 7px solid #050505;
  border-radius: 0 0 80px 80px;
}
.body {
  position: absolute;
  left: 140px;
  top: 195px;
  width: 154px;
  height: 220px;
  border: 8px solid #050505;
  border-radius: 34px 34px 18px 18px;
  background: #173f78;
}
.shirt-mark {
  position: absolute;
  left: 180px;
  top: 278px;
  color: white;
  font-size: 54px;
  font-weight: 900;
}
.arm {
  position: absolute;
  width: 8px;
  height: 255px;
  background: #050505;
  transform-origin: top center;
}
.arm.left {
  left: 146px;
  top: 218px;
  transform: rotate(156deg);
}
.arm.right {
  left: 286px;
  top: 220px;
  transform: rotate(-32deg);
}
.hand {
  position: absolute;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #050505;
}
.hand.left {
  left: 23px;
  top: 350px;
}
.hand.right {
  left: 354px;
  top: 360px;
}
.pointer {
  position: absolute;
  left: 18px;
  top: 210px;
  width: 6px;
  height: 260px;
  background: #050505;
  transform: rotate(-15deg);
  transform-origin: bottom center;
}
.leg {
  position: absolute;
  top: 408px;
  width: 8px;
  height: 225px;
  background: #050505;
}
.leg.left {
  left: 178px;
  transform: rotate(4deg);
}
.leg.right {
  left: 256px;
  transform: rotate(-6deg);
}
.foot {
  position: absolute;
  top: 620px;
  width: 66px;
  height: 20px;
  border-radius: 999px;
  background: #050505;
}
.foot.left {
  left: 136px;
}
.foot.right {
  left: 244px;
}
.progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 8px;
  background: rgba(0,0,0,0.14);
}
.progress-fill {
  height: 100%;
  background: #050505;
}
`;

const defaultProps: ReelProps = {
  brand: 'itnavideo',
  topicTitle: 'Compare',
  templateName: TEMPLATE_NAME,
  mediaType: 'audio',
  durationSeconds: 16,
  backgroundMusic: false,
  comparisonImages: [
    {src: '', label: 'Option A'},
    {src: '', label: 'Option B'},
  ],
  overlayTimeline: [
    {id: 'compare-1', start: 0, end: 5.4, text: 'mostly dekhte ho..', leftLabel: 'Web App', rightLabel: 'Website'},
    {id: 'compare-2', start: 5.4, end: 10.8, text: 'dono same lagte hain, lekin kaam alag hota hai'},
    {id: 'compare-3', start: 10.8, end: 16, text: 'ab simple difference samjho'},
  ],
};

const ComparisonImages = (props: ReelProps) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const safeZones = normalizeSafeZones(props.safeZones);
  const scenes = buildScenes(props);
  const totalProgress = clamp(frame / Math.max(1, durationInFrames - 1), 0, 1);

  return (
    <AbsoluteFill
      className="comparisonImages-root"
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
      {scenes.map((scene, index) => {
        const from = Math.max(0, Math.round(scene.start * fps));
        const durationFrames = Math.max(1, Math.round((scene.end - scene.start) * fps));
        return (
          <Sequence from={from} durationInFrames={durationFrames} key={scene.id || `${scene.start}-${scene.text}`}>
            <SceneLayer brand={props.brand} imagePair={getImagePair(props.comparisonImages, index)} scene={scene} />
          </Sequence>
        );
      })}
      <div className="progress"><div className="progress-fill" style={{width: `${totalProgress * 100}%`}} /></div>
    </AbsoluteFill>
  );
};

const SceneLayer = ({brand, imagePair, scene}: {brand?: string; imagePair: [CompareImage, CompareImage]; scene: CompareScene}) => {
  const frame = useCurrentFrame();
  const enter = easeOut(clamp(frame / 14, 0, 1));
  const captionGray = cleanText(scene.text, 120).length > 42;
  const left = imagePair[0];
  const right = imagePair[1];
  const leftLabel = cleanText(scene.leftLabel || left.label || 'Left', 18);
  const rightLabel = cleanText(scene.rightLabel || right.label || 'Right', 18);

  return (
    <div className="scene" style={{opacity: enter, transform: `translateY(${(1 - enter) * 18}px)`}}>
      <div className="pair">
        <ImagePanel label={leftLabel} src={scene.leftImageSrc || left.src} />
        <ImagePanel label={rightLabel} src={scene.rightImageSrc || right.src} />
      </div>
      <div className="caption">
        <div className={`caption-text ${captionGray ? 'gray' : ''}`}>{cleanText(scene.text, 120)}</div>
      </div>
      <div className="handle">@{cleanText(brand || 'itnavideo', 26)}</div>
      <Presenter />
    </div>
  );
};

const ImagePanel = ({label, src}: {label: string; src?: string}) => (
  <div>
    <div className="label">{label}</div>
    <div className="image-box">
      {resolveSrc(src) ? <Img src={resolveSrc(src)} /> : <div style={{fontSize: 28, fontWeight: 900, color: '#777'}}>Upload image</div>}
    </div>
  </div>
);

const Presenter = () => (
  <div className="presenter">
    <div className="hair" />
    <div className="head" />
    <div className="eye left" />
    <div className="eye right" />
    <div className="glass" />
    <div className="smile" />
    <div className="body" />
    <div className="shirt-mark">&lt;/&gt;</div>
    <div className="arm left" />
    <div className="arm right" />
    <div className="hand left" />
    <div className="hand right" />
    <div className="pointer" />
    <div className="leg left" />
    <div className="leg right" />
    <div className="foot left" />
    <div className="foot right" />
  </div>
);

function buildScenes(props: ReelProps): CompareScene[] {
  const durationSeconds = getDurationSeconds(props);
  const scenes = (props.overlayTimeline || [])
    .map((scene, index) => ({
      ...scene,
      id: scene.id || `compare-${index + 1}`,
      start: clamp(Number(scene.start) || 0, 0, durationSeconds),
      end: clamp(Number(scene.end) || 0, 0, durationSeconds),
      text: cleanText(scene.text || scene.body || props.topicTitle || 'Compare', 120),
    }))
    .filter((scene) => scene.text && scene.end > scene.start)
    .slice(0, 10);
  return scenes.length ? scenes : defaultProps.overlayTimeline || [];
}

function getImagePair(images: ReelProps['comparisonImages'], sceneIndex: number): [CompareImage, CompareImage] {
  const normalized = (images || []).filter((image) => image?.src).slice(0, 4);
  if (normalized.length >= 4 && sceneIndex % 2 === 1) return [normalized[2], normalized[3]];
  return [
    normalized[0] || {src: '', label: 'Left'},
    normalized[1] || normalized[0] || {src: '', label: 'Right'},
  ];
}

function getDurationSeconds(props: ReelProps) {
  const explicit = Number(props.durationSeconds);
  if (Number.isFinite(explicit) && explicit > 0) return Math.min(maxDurationSeconds, explicit);
  const lastScene = props.overlayTimeline?.at(-1);
  if (lastScene?.end) return Math.min(maxDurationSeconds, Math.max(1, lastScene.end));
  return defaultProps.durationSeconds || 16;
}

function resolveSrc(src?: string) {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
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
  return <Audio loop src={musicSrc} volume={clamp(Number(volume ?? 0.022), 0, 0.06)} />;
};

function cleanText(value: unknown, maxLength = 120) {
  return String(value || '')
    .replace(/[\u0600-\u06FF]+/g, ' ')
    .replace(/[\u0750-\u077F]+/g, ' ')
    .replace(/[\u08A0-\u08FF]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function normalizeSafeZones(value: ReelProps['safeZones']) {
  return {
    top: clamp(Number(value?.top) || TOP_SAFE, 0, 320),
    bottom: clamp(Number(value?.bottom) || BOTTOM_SAFE, 0, 520),
    left: clamp(Number(value?.left) || LEFT_SAFE, 0, 240),
    right: clamp(Number(value?.right) || RIGHT_SAFE, 0, 240),
  };
}

function easeOut(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export const ComparisonImagesComposition = () => (
  <Composition
    id={COMPOSITION_ID}
    component={ComparisonImages}
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
        backgroundMusic: props.backgroundMusic === true,
        backgroundMusicVolume: props.backgroundMusicVolume ?? 0.022,
      },
    })}
  />
);
