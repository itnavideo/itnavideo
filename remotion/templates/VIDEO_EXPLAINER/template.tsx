import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Fragment} from 'react';
import {AssetSequenceLayer, assetSequenceLayerStyles, type AssetSequenceItem} from '../../layers/AssetSequenceLayer';
import {SimpleInfographicRenderer} from './SimpleInfographicRenderer';

export const TEMPLATE_NAME = 'VIDEO_EXPLAINER';
export const COMPOSITION_ID = 'VIDEO-EXPLAINER';

type OverlayType = 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta';
type PrimaryVisualType = 'uploadedMedia' | 'image' | 'icon' | 'chart' | 'document' | 'waveform' | 'mockup' | 'none';
type PrimaryVisualMotion = 'slowZoom' | 'panLeft' | 'float' | 'pop' | 'slideUp' | 'parallax';
type PrimaryVisual = {
  type?: PrimaryVisualType;
  assetId?: string;
  prompt?: string;
  label?: string;
  motion?: PrimaryVisualMotion;
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

type SfxCue =
  | 'softPop'
  | 'softTick'
  | 'softChime'
  | 'boom'
  | 'whoosh'
  | 'stamp'
  | 'bell'
  | 'warning'
  | 'cash'
  | 'typing'
  | 'bassDrop';

type ContinuousOverlayItem = {
  id?: string;
  start: number;
  end: number;
  type?: OverlayType;
  label?: string;
  text: string;
  body?: string;
  accentWord?: string;
  align?: 'left' | 'center';
  sfx?: SfxCue;
  layout?: 'headlineCard' | 'splitExplainer' | 'statCard' | 'warningCard' | 'checklist' | 'ctaCard';
  layoutType?:
    | 'character_hero'
    | 'big_statistic'
    | 'checklist'
    | 'step_process'
    | 'timeline'
    | 'comparison'
    | 'before_after'
    | 'progress_bar'
    | 'quote_card'
    | 'document_card'
    | 'phone_mockup'
    | 'dashboard_card'
    | 'graph_layout'
    | 'alert_layout'
    | 'question_hook'
    | 'feature_grid'
    | 'money_showcase'
    | 'roadmap'
    | 'ranking'
    | 'cta_layout';
  visual?: string;
  assetBrief?: string;
  visualRole?: 'topVideo' | 'bottomOverlay' | 'background' | 'assetInsert';
  primaryVisual?: PrimaryVisual;
  animation?: 'fadeUp' | 'popIn' | 'slideUp' | 'countUp' | 'warningPulse';
  emotion?: 'urgent' | 'informative' | 'serious' | 'motivational';
  words?: TimedWord[];
  frameType?: string;
  frameText?: string;
  frameLabel?: string;
  frameValue?: string;
  frameItems?: string[];
  visualPlanReason?: string;
};

type ContinuousCaptionItem = {
  id?: string;
  start: number;
  end: number;
  text: string;
  lines?: string[];
};

type TimedWord = {
  word: string;
  start: number;
  end: number;
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
  wordCount?: number;
  sourceScript?: string;
  originalScript?: string;
  keyPoints?: string[];
  avoidRepeats?: string[];
  processSteps: string[];
  websites: string[];
  amounts: string[];
  documents: string[];
  dates: string[];
  warnings: string[];
  detailBlocks: ScriptDetailBlock[];
};

type ReelProps = {
  brand?: string;
  topicTitle?: string;
  template?: typeof TEMPLATE_NAME;
  templateName?: typeof TEMPLATE_NAME;
  design?: string;
  mediaType: 'video' | 'audio' | 'image';
  mediaSrc?: string;
  mediaFit?: 'cover' | 'contain' | 'videoExplainer';
  mediaTrimStartSeconds?: number;
  durationSeconds?: number;
  backgroundMusic?: boolean;
  backgroundMusicMood?: BackgroundMusicMood;
  backgroundMusicSrc?: string;
  backgroundMusicVolume?: number;
  sourceAudioVolume?: number;
  overlayTimeline?: ContinuousOverlayItem[];
  assetTimeline?: AssetSequenceItem[];
  captions?: ContinuousCaptionItem[];
  scriptDetails?: ScriptDetails;
  visualPlan?: unknown;
};

const fps = 24;
const width = 1080;
const height = 1920;
const maxDurationSeconds = 60;

const fontFaces = `
@font-face {
  font-family: SPLIT_Inter;
  src: url("${staticFile('assets/reusable/fonts/Inter/Inter-Variable.ttf')}") format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: SPLIT_Montserrat;
  src: url("${staticFile('assets/reusable/fonts/Montserrat/Montserrat-Variable.ttf')}") format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: SPLIT_Anton;
  src: url("${staticFile('assets/reusable/fonts/Anton/Anton-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: SPLIT_Bebas_Neue;
  src: url("${staticFile('assets/reusable/fonts/Bebas_Neue/BebasNeue-Regular.ttf')}") format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: SPLIT_Oswald;
  src: url("${staticFile('assets/reusable/fonts/Oswald/Oswald-Variable.ttf')}") format('truetype');
  font-weight: 200 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: SPLIT_Barlow;
  src: url("${staticFile('assets/reusable/fonts/Barlow_Condensed/BarlowCondensed-Bold.ttf')}") format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: SPLIT_Barlow;
  src: url("${staticFile('assets/reusable/fonts/Barlow_Condensed/BarlowCondensed-ExtraBold.ttf')}") format('truetype');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}
`;
const matteTextureUrl = '';
const sfxSources: Partial<Record<NonNullable<ContinuousOverlayItem['sfx']>, string>> = {
  softPop: staticFile('assets/reusable/sound-effects/pop-soft.wav'),
  softTick: staticFile('assets/reusable/sound-effects/digital-tick.wav'),
  softChime: staticFile('assets/reusable/sound-effects/success-chime.wav'),
  boom: staticFile('assets/reusable/sound-effects/cinematic-boom.wav'),
  whoosh: staticFile('assets/reusable/sound-effects/whoosh-fast.wav'),
  stamp: staticFile('assets/reusable/sound-effects/stamp-approved.wav'),
  bell: staticFile('assets/reusable/sound-effects/notification-bell.wav'),
  warning: staticFile('assets/reusable/sound-effects/warning-beep.wav'),
  cash: staticFile('assets/reusable/sound-effects/cash-count.wav'),
  typing: staticFile('assets/reusable/sound-effects/typing-fast.wav'),
  bassDrop: staticFile('assets/reusable/sound-effects/bass-drop-light.wav'),
};
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
  --bg: #070b10;
  --matte-texture: ${matteTextureUrl ? `url("${matteTextureUrl}")` : 'none'};
  --panel: #0d1419;
  --panel-2: #111b20;
  --line: rgba(255, 216, 77, 0.42);
  --line-soft: rgba(255, 255, 255, 0.1);
  --text: rgba(255, 255, 255, 0.94);
  --muted: rgba(255, 255, 255, 0.62);
  --faint: rgba(255, 255, 255, 0.36);
  --accent: #ffd84d;
  --cyan: #5ce8d5;
  --danger: #ff756b;
  --unsafe-top: 250px;
  --unsafe-bottom: 350px;
  --top-section-height: 936px;
  --content-start: 968px;
}
.video-explainer-root {
  background: var(--bg);
  color: var(--text);
  font-family: SPLIT_Inter, Inter, Arial, sans-serif;
}
.top-shell {
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 2;
  height: var(--top-section-height);
  padding: var(--unsafe-top) 24px 0;
  background: linear-gradient(180deg, rgba(3,5,6,0.82) 0%, rgba(7,11,16,0.76) 70%, rgba(11,17,22,0.84) 100%);
}
.media-card {
  position: relative;
  width: 1032px;
  height: 580.5px;
  overflow: hidden;
  border-radius: 24px;
  background: #05070a;
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow:
    0 26px 90px rgba(0, 0, 0, 0.42),
    0 0 0 1px rgba(255, 216, 77, 0.055);
}
.media-card::before {
  content: "";
  position: absolute;
  left: 28px;
  right: 28px;
  top: 0;
  height: 1px;
  z-index: 2;
  background: linear-gradient(90deg, transparent, rgba(255,216,77,0.58), transparent);
}
.media-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}
.top-progress {
  position: absolute;
  left: 62px;
  right: 62px;
  bottom: 8px;
  height: 4px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.14);
}
.top-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--cyan));
}
.video-title {
  position: absolute;
  left: 50%;
  top: calc(var(--unsafe-top) + 612px);
  box-sizing: border-box;
  max-width: 860px;
  padding: 11px 28px 10px;
  transform: translateX(-50%);
  color: #071015;
  background:
    linear-gradient(135deg, rgba(255,216,77,0.98), rgba(92,232,213,0.88));
  border: 1px solid rgba(255,255,255,0.28);
  border-radius: 999px;
  box-shadow:
    0 14px 34px rgba(0,0,0,0.34),
    inset 0 1px 0 rgba(255,255,255,0.42);
  font-family: SPLIT_Montserrat, SPLIT_Inter, Arial, sans-serif;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0.035em;
  line-height: 1;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  text-shadow: 0 1px 0 rgba(255,255,255,0.28);
  text-transform: uppercase;
  white-space: nowrap;
}
.divider {
  position: absolute;
  left: 0;
  right: 0;
  top: var(--top-section-height);
  z-index: 3;
  height: 32px;
  background: linear-gradient(180deg, #0b1116 0%, #0d1419 100%);
}
.divider::before {
  content: "";
  position: absolute;
  left: 64px;
  right: 64px;
  top: 14px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--line), transparent);
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  top: var(--content-start);
  bottom: var(--unsafe-bottom);
  z-index: 3;
  padding: 22px 88px 28px;
  overflow: hidden;
  border-left: 1px solid rgba(255,255,255,0.06);
  border-right: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.075);
  background:
    linear-gradient(180deg, rgba(13,20,25,0.84) 0%, rgba(8,16,18,0.88) 100%),
    rgba(13,20,25,0.78);
  box-shadow: inset 0 1px 0 rgba(255,216,77,0.07);
}
.content::before {
  content: "";
  position: absolute;
  inset: -80px -120px;
  background:
    linear-gradient(180deg, rgba(7,11,16,0.36), rgba(7,11,16,0.72)),
    var(--matte-texture) center / cover no-repeat;
  opacity: 0.22;
  filter: saturate(0.68) contrast(1.08) brightness(0.74);
}
.content::after {
  content: "";
  position: absolute;
  inset: 0 36px 24px;
  background:
    radial-gradient(circle at 50% 0%, rgba(255,216,77,0.045), transparent 42%),
    linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.18) 100%);
  border-left: 1px solid rgba(255,255,255,0.045);
  border-right: 1px solid rgba(255,255,255,0.045);
  border-bottom: 1px solid rgba(255,255,255,0.055);
  border-radius: 0 0 26px 26px;
  pointer-events: none;
}
.content-inner {
  position: relative;
  z-index: 1;
  height: 100%;
}
.content-inner::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,216,77,0.42), rgba(92,232,213,0.28), transparent);
}
.content-inner::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 24px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
}
.overlay-scene {
  position: absolute;
  inset: 0;
  will-change: opacity, transform;
}
.main-block {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
}
.main-block.center {
  text-align: center;
}
.main-block.left {
  text-align: left;
}
.type-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 216, 77, 0.24);
  border-radius: 999px;
  background: rgba(255, 216, 77, 0.08);
  color: var(--accent);
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.11em;
  line-height: 1;
  padding: 12px 20px;
  text-transform: uppercase;
}
.type-pill.warning {
  border-color: rgba(255,117,107,0.28);
  background: rgba(255,117,107,0.10);
  color: var(--danger);
}
.type-pill.stat {
  border-color: rgba(92,232,213,0.28);
  background: rgba(92,232,213,0.09);
  color: var(--cyan);
}
.type-pill {
  display: none;
}
.title {
  margin: 0;
  font-family: SPLIT_Montserrat, SPLIT_Barlow, SPLIT_Inter, Arial, sans-serif;
  font-size: 86px;
  font-weight: 900;
  line-height: 0.98;
  letter-spacing: 0;
  text-transform: uppercase;
  text-wrap: balance;
  color: var(--text);
  text-shadow: 0 12px 38px rgba(0, 0, 0, 0.42);
}
.title-word {
  display: inline-block;
  transform-origin: 50% 82%;
  will-change: opacity, transform, filter;
}
.title-word.accent {
  position: relative;
  color: var(--accent);
}
.title-word.accent::after {
  content: "";
  position: absolute;
  left: -0.04em;
  right: -0.04em;
  bottom: 0.02em;
  height: 0.16em;
  z-index: -1;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255,216,77,0.0), rgba(255,216,77,0.34), rgba(92,232,213,0.20));
}
.kinetic-underline {
  height: 4px;
  max-width: 520px;
  margin-top: 18px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), var(--cyan), transparent);
  transform-origin: left center;
}
.center .kinetic-underline {
  margin-left: auto;
  margin-right: auto;
}
.body {
  max-width: 850px;
  margin: 22px 0 0;
  color: var(--muted);
  font-size: 36px;
  font-weight: 650;
  line-height: 1.32;
  letter-spacing: 0;
}
.body-word {
  display: inline-block;
  will-change: opacity, transform;
}
.center .body {
  margin-left: auto;
  margin-right: auto;
}
.support-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 26px;
}
.support-card {
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 18px;
  background: rgba(255,255,255,0.045);
  color: rgba(255,255,255,0.82);
  font-size: 25px;
  font-weight: 800;
  line-height: 1.22;
  padding: 18px 20px;
}
.support-card strong {
  color: var(--accent);
}
.headline-card .main-block {
  top: 46px;
}
.headline-card .title {
  max-width: 900px;
  margin: 0 auto;
  font-size: 96px;
  line-height: 0.92;
}
.headline-card .body {
  max-width: 820px;
  margin-top: 26px;
  font-size: 34px;
}
.split-explainer .main-block {
  top: 36px;
}
.split-explainer .title {
  max-width: 850px;
  font-size: 68px;
  line-height: 1.02;
}
.split-explainer .body {
  max-width: 780px;
  font-size: 32px;
}
.checklist-card .main-block {
  top: 32px;
}
.checklist-card .title {
  max-width: 760px;
  font-size: 66px;
  line-height: 1.02;
}
.checklist-card .support-row {
  grid-template-columns: 1fr;
  max-width: 820px;
  gap: 12px;
}
.checklist-card .support-card {
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  border-color: rgba(92,232,213,0.20);
  background: rgba(92,232,213,0.07);
  font-size: 26px;
}
.checklist-card .support-card strong {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 999px;
  background: var(--cyan);
  color: #061015;
}
.stat-card .main-block {
  top: 28px;
}
.stat-card .title {
  max-width: 840px;
  font-size: 66px;
}
.stat-number {
  display: inline-block;
  margin: 0 0 18px;
  color: var(--accent);
  font-family: SPLIT_Barlow, SPLIT_Inter, Arial, sans-serif;
  font-size: 118px;
  font-weight: 900;
  line-height: 0.84;
  text-shadow: 0 14px 48px rgba(255,216,77,0.24);
  will-change: transform, filter;
}
.stat-card .body {
  max-width: 760px;
  margin-top: 18px;
  font-size: 32px;
}
.warning-card .main-block {
  top: 34px;
}
.warning-card .title {
  max-width: 850px;
  color: #fff4f2;
  font-size: 76px;
}
.warning-line {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 16px;
  align-items: center;
  margin-top: 24px;
  border: 1px solid rgba(255,117,107,0.22);
  border-radius: 18px;
  background: rgba(255,117,107,0.09);
  color: rgba(255,255,255,0.90);
  font-size: 28px;
  font-weight: 850;
  line-height: 1.28;
  padding: 18px 22px;
  will-change: transform, box-shadow;
}
.warning-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 999px;
  background: var(--danger);
  color: #080b10;
  font-size: 30px;
  font-weight: 900;
}
.cta-card-layout .main-block {
  top: 44px;
}
.cta-card-layout .title {
  max-width: 850px;
  margin: 0 auto;
  font-size: 84px;
  line-height: 0.94;
}
.cta-card {
  margin: 28px auto 0;
  max-width: 780px;
  border: 1px solid rgba(92,232,213,0.24);
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(92,232,213,0.14), rgba(255,216,77,0.10));
  box-shadow: 0 18px 64px rgba(0,0,0,0.24);
  color: rgba(255,255,255,0.90);
  font-size: 30px;
  font-weight: 850;
  line-height: 1.22;
  padding: 22px 28px;
}
.visual-cue {
  display: none;
  align-items: center;
  max-width: 740px;
  margin-top: 18px;
  border: 1px solid rgba(92,232,213,0.20);
  border-radius: 999px;
  background: rgba(92,232,213,0.08);
  color: rgba(255,255,255,0.72);
  font-size: 20px;
  font-weight: 850;
  letter-spacing: 0.055em;
  line-height: 1;
  overflow: hidden;
  padding: 10px 18px;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}
.shadcn-scene-panel {
  position: absolute;
  inset: 34px 0 0;
  display: grid;
  align-content: start;
  gap: 18px;
}
.shadcn-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  max-width: 900px;
  margin: 0 auto;
}
.shadcn-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 999px;
  background: rgba(255,255,255,0.055);
  color: rgba(255,255,255,0.82);
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.06em;
  line-height: 1;
  padding: 11px 16px;
  text-transform: uppercase;
}
.shadcn-badge.accent {
  border-color: rgba(255,216,77,0.28);
  background: rgba(255,216,77,0.10);
  color: var(--accent);
}
.shadcn-panel-title {
  color: rgba(255,255,255,0.92);
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1;
}
.shadcn-card-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}
.shadcn-caption-card {
  width: min(900px, 100%);
  margin: 0 auto;
}
.shadcn-card {
  position: relative;
  overflow: hidden;
  min-height: 178px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025)),
    rgba(3,8,12,0.82);
  box-shadow:
    0 18px 54px rgba(0,0,0,0.28),
    inset 0 1px 0 rgba(255,255,255,0.08);
  padding: 22px;
}
.shadcn-card::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--cyan), transparent);
  opacity: 0.72;
}
.shadcn-card-label {
  color: rgba(255,255,255,0.48);
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 0.10em;
  line-height: 1;
  text-transform: uppercase;
}
.shadcn-card-value {
  margin-top: 18px;
  color: rgba(255,255,255,0.94);
  font-size: 42px;
  font-weight: 950;
  letter-spacing: 0;
  line-height: 1.02;
  text-wrap: balance;
}
.shadcn-card-value.small {
  font-size: 30px;
  line-height: 1.12;
}
.shadcn-card-support {
  margin-top: 12px;
  color: rgba(255,255,255,0.64);
  font-size: 28px;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 1.16;
}
.shadcn-visual-frame {
  display: grid;
  grid-template-columns: 74px 1fr;
  gap: 18px;
  align-items: center;
}
.shadcn-icon-tile {
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  border: 1px solid rgba(92,232,213,0.24);
  border-radius: 8px;
  background: rgba(92,232,213,0.11);
  color: var(--cyan);
  font-size: 34px;
  font-weight: 950;
}
.shadcn-image {
  width: 100%;
  height: 132px;
  object-fit: cover;
  border-radius: 8px;
}
.shadcn-progress {
  height: 10px;
  margin-top: 26px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.10);
}
.shadcn-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--cyan));
}
.shadcn-alert {
  border-color: rgba(255,117,107,0.24);
  background:
    linear-gradient(180deg, rgba(255,117,107,0.11), rgba(255,255,255,0.025)),
    rgba(3,8,12,0.82);
}
.shadcn-alert .shadcn-icon-tile {
  border-color: rgba(255,117,107,0.26);
  background: rgba(255,117,107,0.12);
  color: var(--danger);
}
.shadcn-chip-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
}
.shadcn-chip {
  min-height: 76px;
  border: 1px solid rgba(255,255,255,0.11);
  border-radius: 8px;
  background: rgba(255,255,255,0.045);
  color: rgba(255,255,255,0.82);
  font-size: 22px;
  font-weight: 900;
  line-height: 1.08;
  padding: 16px;
}
.shadcn-chip span {
  display: block;
  margin-bottom: 8px;
  color: var(--accent);
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.shadcn-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  max-width: 900px;
  margin: 0 auto;
  border: 1px solid rgba(255,255,255,0.11);
  border-radius: 8px;
  background: rgba(255,255,255,0.04);
  padding: 8px;
}
.shadcn-tab {
  border-radius: 7px;
  background: rgba(255,255,255,0.065);
  color: rgba(255,255,255,0.78);
  font-size: 24px;
  font-weight: 950;
  line-height: 1;
  padding: 18px 20px;
  text-align: center;
}
.shadcn-tab.active {
  background: linear-gradient(135deg, rgba(255,216,77,0.22), rgba(92,232,213,0.14));
  color: #fff;
}
.material-layer {
  display: grid;
  gap: 14px;
  margin-top: 24px;
  max-width: 850px;
}
.center .material-layer {
  margin-left: auto;
  margin-right: auto;
}
.material-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.material-tile {
  position: relative;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.10);
  border-radius: 22px;
  background:
    radial-gradient(circle at 20% 0%, rgba(92,232,213,0.14), transparent 50%),
    rgba(255,255,255,0.045);
  box-shadow: 0 12px 36px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08);
  min-height: 100px;
  padding: 20px;
  will-change: opacity, transform;
  backdrop-filter: blur(4px);
}
.material-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.12) 48%, transparent 68%);
  pointer-events: none;
  transform: translateX(-120%);
}
.material-tile::after {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 14px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), rgba(92,232,213,0.3));
}
.material-icon {
  display: grid;
  width: 38px;
  height: 38px;
  margin-bottom: 12px;
  place-items: center;
  border-radius: 12px;
  background: rgba(255,216,77,0.14);
  color: var(--accent);
  font-size: 22px;
  font-weight: 900;
}
.material-label {
  color: rgba(255,255,255,0.58);
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
}
.material-value {
  margin-top: 8px;
  color: rgba(255,255,255,0.92);
  font-size: 25px;
  font-weight: 900;
  line-height: 1.02;
}
.mini-chart {
  display: grid;
  align-items: end;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  height: 114px;
  max-width: 520px;
  margin: 22px auto 0;
  padding: 18px 22px;
  border: 1px solid rgba(92,232,213,0.16);
  border-radius: 18px;
  background: rgba(92,232,213,0.055);
  position: relative;
  overflow: hidden;
}
.mini-chart::after {
  content: "";
  position: absolute;
  left: 16px;
  right: 16px;
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
}
.chart-bar {
  border-radius: 999px 999px 8px 8px;
  background: linear-gradient(180deg, var(--accent), var(--cyan));
  box-shadow: 0 10px 28px rgba(92,232,213,0.16);
  transform-origin: bottom center;
}
.flow-diagram {
  display: grid;
  grid-template-columns: 1fr 46px 1fr 46px 1fr;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  max-width: 850px;
}
.flow-node {
  min-height: 96px;
  border: 1.5px solid rgba(92,232,213,0.20);
  border-radius: 22px;
  background:
    radial-gradient(circle at 50% 0%, rgba(92,232,213,0.10) 0%, transparent 50%),
    rgba(92,232,213,0.04);
  color: rgba(255,255,255,0.92);
  font-size: 22px;
  font-weight: 900;
  line-height: 1.1;
  padding: 20px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04);
}
.flow-node span {
  display: block;
  margin-bottom: 10px;
  color: var(--cyan);
  font-size: 15px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.9;
}
.flow-arrow {
  color: var(--accent);
  font-size: 38px;
  font-weight: 900;
  text-align: center;
  text-shadow: 0 0 16px rgba(247,216,74,0.3);
}
.warning-meter {
  margin-top: 24px;
  max-width: 820px;
  border: 1px solid rgba(255,117,107,0.18);
  border-radius: 18px;
  background: rgba(255,117,107,0.075);
  padding: 18px 20px;
}
.warning-meter-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255,255,255,0.84);
  font-size: 19px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.warning-track {
  height: 10px;
  margin-top: 16px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
}
.warning-fill {
  width: 76%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--danger), var(--accent));
}
.cta-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 24px auto 0;
  max-width: 820px;
}
.cta-action {
  border: 1px solid rgba(255,216,77,0.18);
  border-radius: 18px;
  background: rgba(255,216,77,0.075);
  color: rgba(255,255,255,0.90);
  font-size: 22px;
  font-weight: 900;
  line-height: 1.1;
  padding: 20px;
}
.cta-action span {
  display: block;
  margin-bottom: 8px;
  color: var(--accent);
  font-size: 28px;
}
.media-visual-empty {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 32%, rgba(92,232,213,0.18), transparent 34%),
    linear-gradient(135deg, rgba(255,216,77,0.13), transparent 32%),
    #06090d;
}
.audio-hero {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: center;
  padding: 52px 58px;
}
.audio-hero::before {
  content: "";
  position: absolute;
  inset: -35%;
  background:
    radial-gradient(circle at 22% 28%, rgba(255,216,77,0.20), transparent 32%),
    radial-gradient(circle at 74% 42%, rgba(92,232,213,0.18), transparent 36%);
  animation: audioDrift 7s ease-in-out infinite alternate;
}
.audio-copy,
.audio-wave {
  position: relative;
  z-index: 1;
}
.audio-badge {
  display: inline-flex;
  border: 1px solid rgba(92,232,213,0.28);
  border-radius: 999px;
  background: rgba(92,232,213,0.10);
  color: var(--cyan);
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.12em;
  line-height: 1;
  padding: 10px 14px;
  text-transform: uppercase;
}
.audio-title {
  margin-top: 22px;
  color: var(--text);
  font-family: SPLIT_Bebas_Neue, SPLIT_Anton, SPLIT_Oswald, SPLIT_Montserrat, Arial, sans-serif;
  font-size: 64px;
  font-weight: 900;
  line-height: 0.92;
  text-transform: uppercase;
}
.audio-subtitle {
  max-width: 390px;
  margin-top: 18px;
  color: rgba(255,255,255,0.66);
  font-size: 24px;
  font-weight: 750;
  line-height: 1.18;
}
.mid-subtitle-layer {
  position: absolute;
  left: 72px;
  right: 72px;
  top: 790px;
  z-index: 8;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
.mid-subtitle-box {
  max-width: 900px;
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 18px;
  background: rgba(3, 5, 6, 0.76);
  box-shadow:
    0 18px 54px rgba(0,0,0,0.42),
    inset 0 1px 0 rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.96);
  font-size: 38px;
  font-weight: 900;
  line-height: 1.12;
  padding: 16px 24px 18px;
  text-align: center;
  text-shadow: 0 3px 12px rgba(0,0,0,0.72);
}
.mid-subtitle-line + .mid-subtitle-line {
  margin-top: 4px;
}
.mid-subtitle-line .accent {
  color: var(--accent);
}
.collage-root {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #0c1011;
  color: #fff;
}
.collage-root::before {
  display: none;
}
.collage-root::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.06),
    inset 0 -140px 180px rgba(0,0,0,0.30);
}
.collage-bg {
  position: absolute;
  inset: 0;
  opacity: 0.24;
  filter: blur(8px) saturate(0.72) contrast(1.08) brightness(0.78);
  transform: scale(1.04);
}
.collage-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.collage-animated-bg {
  display: none;
}
.collage-animated-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(154deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 44px),
    linear-gradient(180deg, transparent, rgba(0,0,0,0.28));
}
.collage-soft-wash {
  display: none;
}
.collage-top-frame {
  position: absolute;
  left: 0;
  right: 0;
  top: 6px;
  box-sizing: border-box;
  height: 608px;
  overflow: hidden;
  border-radius: 24px;
  border: 2px solid rgba(56,189,248,0.88);
  background:
    linear-gradient(135deg, rgba(34,211,238,0.16), transparent 34%),
    linear-gradient(180deg, #07111f, #020617);
  box-shadow:
    0 24px 64px rgba(0,0,0,0.52),
    0 0 0 2px rgba(255,255,255,0.16),
    0 0 26px rgba(56,189,248,0.24),
    0 0 42px rgba(250,204,21,0.10),
    inset 0 0 0 1px rgba(0,0,0,0.38);
  z-index: 3;
}
.collage-top-frame::before {
  content: "";
  position: absolute;
  inset: 10px;
  border-radius: 18px;
  z-index: 5;
  pointer-events: none;
  border: 1.5px solid rgba(250,204,21,0.62);
  box-shadow:
    inset 0 0 0 2px rgba(255,255,255,0.24),
    inset 0 8px 0 rgba(34,211,238,0.22),
    inset 0 -1px 0 rgba(0,0,0,0.42),
    0 0 22px rgba(34,211,238,0.30);
}
.collage-top-frame::after {
  content: "";
  position: absolute;
  inset: 7px;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.05), transparent 24%, transparent 72%, rgba(0,0,0,0.16)),
    linear-gradient(90deg, rgba(0,0,0,0.10), transparent 16%, transparent 84%, rgba(0,0,0,0.12));
}
.collage-top-ambient {
  position: absolute;
  inset: -30px;
  z-index: 0;
  opacity: 0.42;
  filter: blur(22px) saturate(1.15) brightness(0.64);
  transform-origin: center center;
  will-change: transform;
}
.collage-top-ambient img,
.collage-top-ambient video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}
.collage-top-media {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}
.collage-video-progress {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 18px;
  z-index: 6;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.24);
  box-shadow:
    0 10px 22px rgba(0,0,0,0.34),
    inset 0 1px 0 rgba(255,255,255,0.22);
}
.collage-video-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22d3ee, #ffffff 55%, #facc15);
  box-shadow: 0 0 18px rgba(34,211,238,0.48);
}
.collage-main {
  position: absolute;
  left: 0;
  right: 0;
  top: 722px;
  bottom: 0;
  z-index: 2;
  overflow: hidden;
  background: #0c1011;
}
.collage-main::after {
  display: none;
}
.collage-main-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: saturate(1.08) contrast(1.03) brightness(1.04);
  transform-origin: center center;
}
.motion-graphics-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  overflow: hidden;
  pointer-events: none;
}
.mg-vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 44%), transparent 0 18%, rgba(0,0,0,0.16) 48%, rgba(0,0,0,0.36) 100%),
    linear-gradient(180deg, transparent 0 50%, rgba(0,0,0,0.28) 100%);
}
.mg-focus-ring {
  position: absolute;
  left: 50%;
  top: 42%;
  width: 360px;
  height: 360px;
  border: 7px solid rgba(247,216,74,0.82);
  border-radius: 999px;
  box-shadow:
    0 0 0 14px rgba(247,216,74,0.10),
    0 0 42px rgba(247,216,74,0.42);
  transform: translate(-50%, -50%) scale(var(--ring-scale, 1));
  opacity: var(--ring-opacity, 0);
}
.mg-arrow {
  position: absolute;
  left: 118px;
  top: 47%;
  width: 310px;
  height: 9px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #f7d84a 18%, #ffffff);
  box-shadow: 0 0 28px rgba(247,216,74,0.42);
  transform: translateX(var(--arrow-x, 0px));
  opacity: var(--arrow-opacity, 0);
}
.mg-arrow::after {
  content: "";
  position: absolute;
  right: -3px;
  top: 50%;
  width: 34px;
  height: 34px;
  border-right: 9px solid #fff;
  border-top: 9px solid #fff;
  transform: translateY(-50%) rotate(45deg);
}
.mg-badge {
  position: absolute;
  left: 54px;
  top: 62px;
  min-width: 230px;
  max-width: 440px;
  border: 3px solid rgba(255,255,255,0.22);
  border-radius: 999px;
  background:
    linear-gradient(135deg, rgba(247,216,74,0.96), rgba(92,232,213,0.90));
  color: #061015;
  font-family: SPLIT_Barlow, SPLIT_Montserrat, Arial, sans-serif;
  font-size: 38px;
  font-weight: 950;
  letter-spacing: 0.02em;
  line-height: 1;
  padding: 18px 26px;
  text-align: center;
  text-transform: uppercase;
  transform: translateY(var(--badge-y, 0px)) scale(var(--badge-scale, 1));
  opacity: var(--badge-opacity, 0);
  box-shadow:
    0 20px 48px rgba(0,0,0,0.38),
    0 0 30px rgba(92,232,213,0.24);
}
.mg-counter {
  position: absolute;
  right: 52px;
  bottom: 78px;
  display: grid;
  min-width: 290px;
  justify-items: center;
  border: 3px solid rgba(247,216,74,0.36);
  border-radius: 24px;
  background: rgba(5,8,8,0.76);
  color: #fff;
  padding: 22px 28px;
  transform: translateY(var(--counter-y, 0px)) scale(var(--counter-scale, 1));
  opacity: var(--counter-opacity, 0);
  box-shadow: 0 26px 58px rgba(0,0,0,0.42);
}
.mg-counter strong {
  color: #f7d84a;
  font-size: 62px;
  font-weight: 950;
  line-height: 0.92;
}
.mg-counter span {
  margin-top: 8px;
  color: rgba(255,255,255,0.78);
  font-size: 21px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.mg-progress {
  position: absolute;
  left: 70px;
  right: 70px;
  bottom: 36px;
  height: 11px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.18);
  opacity: var(--progress-opacity, 0);
}
.mg-progress div {
  width: var(--progress-width, 0%);
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f7d84a, #5ce8d5, #ffffff);
  box-shadow: 0 0 22px rgba(92,232,213,0.42);
}
.mg-particle {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  border-radius: 999px;
  background: rgba(247,216,74,0.78);
  box-shadow: 0 0 18px rgba(247,216,74,0.48);
  transform: translate3d(var(--dx), var(--dy), 0) scale(var(--ps, 1));
  opacity: var(--po, 0.5);
}
.collage-band {
  position: absolute;
  left: 0;
  right: 0;
  top: 633px;
  min-height: 89px;
  display: grid;
  place-items: center;
  border: 1.5px solid rgba(250,204,21,0.62);
  background:
    linear-gradient(180deg, rgba(55,76,84,0.98), rgba(21,35,42,0.99)),
    radial-gradient(circle at 50% 0%, rgba(247,216,74,0.15), transparent 56%);
  color: #fff;
  font-family: SPLIT_Barlow, SPLIT_Bebas_Neue, SPLIT_Montserrat, Arial, sans-serif;
  font-size: 56px;
  font-weight: 900;
  letter-spacing: 0.045em;
  line-height: 1;
  padding: 14px 48px;
  text-align: center;
  text-transform: uppercase;
  text-shadow: 0 5px 18px rgba(0,0,0,0.42);
  z-index: 4;
  box-shadow:
    0 18px 38px rgba(0,0,0,0.34),
    inset 0 1px 0 rgba(255,255,255,0.20),
    inset 0 -1px 0 rgba(0,0,0,0.42);
}
.collage-band::before {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  top: 10px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.34), rgba(247,216,74,0.42), transparent);
}
.collage-subtitle-words {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0 20px;
  max-width: 100%;
}
.collage-subtitle-word {
  display: inline-block;
  color: rgba(255,255,255,0.88);
  transform-origin: center bottom;
  transition: none;
}
.collage-subtitle-word.active {
  color: #f7d84a;
  text-shadow:
    0 0 18px rgba(247,216,74,0.72),
    0 7px 20px rgba(0,0,0,0.55);
  transform: translateY(-1px) scale(1.075);
}
.collage-subtitle-word.past {
  color: rgba(255,255,255,0.98);
}
.collage-caption {
  position: absolute;
  left: 0;
  right: 0;
  top: 633px;
  min-height: 89px;
  display: grid;
  place-items: center;
  border: 1.5px solid rgba(250,204,21,0.62);
  background:
    linear-gradient(180deg, rgba(8,22,38,0.99), rgba(2,8,20,0.99));
  color: #fff;
  font-family: SPLIT_Barlow, SPLIT_Bebas_Neue, SPLIT_Montserrat, Arial, sans-serif;
  font-size: 56px;
  font-weight: 900;
  letter-spacing: 0.06em;
  line-height: 1;
  padding: 14px 48px;
  text-align: center;
  text-shadow: 0 5px 18px rgba(0,0,0,0.42);
  text-transform: uppercase;
  z-index: 5;
  box-shadow:
    0 18px 38px rgba(0,0,0,0.34),
    inset 0 1px 0 rgba(255,255,255,0.12);
}
.collage-fallback {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(247,216,74,0.16), transparent 28%),
    linear-gradient(180deg, rgba(255,255,255,0.10), transparent 42%, rgba(0,0,0,0.28)),
    repeating-linear-gradient(135deg, rgba(255,255,255,0.055) 0 2px, transparent 2px 26px),
    #111417;
}
.collage-fallback::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 42%, rgba(255,255,255,0.10), transparent 22%),
    linear-gradient(90deg, rgba(0,0,0,0.28), transparent 28%, transparent 72%, rgba(0,0,0,0.32));
}
.collage-fallback.bottom {
  background:
    linear-gradient(145deg, rgba(247,216,74,0.10), transparent 28%),
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.36)),
    repeating-linear-gradient(154deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 34px),
    #101416;
}
.collage-keyword-frame {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(ellipse 120% 80% at 50% 110%, rgba(92,232,213,0.08) 0%, transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(247,216,74,0.05) 0%, transparent 40%),
    linear-gradient(180deg, #080a0c 0%, #0c1216 50%, #0a0f12 100%);
  font-family: SPLIT_Barlow, SPLIT_Montserrat, Arial, sans-serif;
}
.collage-keyword-frame.finance {
  background:
    radial-gradient(ellipse 100% 70% at 50% 100%, rgba(45,212,129,0.10) 0%, transparent 55%),
    radial-gradient(circle at 75% 15%, rgba(247,216,74,0.07) 0%, transparent 38%),
    linear-gradient(180deg, #060a08 0%, #0a1210 50%, #080d0b 100%);
}
.collage-keyword-frame.education,
.collage-keyword-frame.government_exam {
  background:
    radial-gradient(ellipse 110% 75% at 50% 105%, rgba(99,102,241,0.09) 0%, transparent 55%),
    radial-gradient(circle at 20% 20%, rgba(168,85,247,0.06) 0%, transparent 40%),
    linear-gradient(180deg, #080810 0%, #0c0e18 50%, #0a0b14 100%);
}
.collage-keyword-frame.career_business {
  background:
    radial-gradient(ellipse 110% 75% at 50% 105%, rgba(251,146,60,0.08) 0%, transparent 55%),
    radial-gradient(circle at 80% 25%, rgba(247,216,74,0.06) 0%, transparent 38%),
    linear-gradient(180deg, #0a0806 0%, #10100a 50%, #0c0a08 100%);
}
.collage-keyword-frame.tech_ai {
  background:
    radial-gradient(ellipse 110% 75% at 50% 105%, rgba(56,189,248,0.09) 0%, transparent 55%),
    radial-gradient(circle at 25% 20%, rgba(99,102,241,0.06) 0%, transparent 40%),
    linear-gradient(180deg, #06080c 0%, #0a1018 50%, #080c14 100%);
}
.collage-keyword-frame.news_document {
  background:
    radial-gradient(ellipse 110% 75% at 50% 105%, rgba(244,63,94,0.07) 0%, transparent 55%),
    radial-gradient(circle at 70% 20%, rgba(251,146,60,0.05) 0%, transparent 38%),
    linear-gradient(180deg, #0a0608 0%, #120a0c 50%, #0e080a 100%);
}
.keyword-frame-grid {
  display: none;
}
.keyword-frame-grid {
  transform: translate3d(var(--grid-x, 0px), var(--grid-y, 0px), 0);
}
.keyword-frame-orbit {
  display: none;
}
.keyword-frame-orbit.one {
  transform: rotate(calc(18deg + var(--orbit-rotate, 0deg))) translateX(-180px);
}
.keyword-frame-orbit.two {
  width: 860px;
  height: 860px;
  transform: rotate(calc(-22deg - var(--orbit-rotate, 0deg))) translateX(210px);
  border-color: rgba(92,232,213,0.10);
}
.keyword-frame-particles {
  display: none;
}
.keyword-frame-progress {
  display: none;
}
.keyword-frame-progress div {
  width: var(--kw-progress, 0%);
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f7d84a, #5ce8d5, #ffffff);
  box-shadow: 0 0 22px rgba(92,232,213,0.38);
}
.keyword-beat-badge {
  display: none;
}
.keyword-frame-inner {
  position: relative;
  z-index: 2;
  width: min(88%, 900px);
  text-align: center;
  filter: drop-shadow(0 28px 48px rgba(0,0,0,0.38));
}
.keyword-frame-kicker {
  display: inline-grid;
  min-height: 46px;
  place-items: center;
  border: 2px solid rgba(247,216,74,0.50);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(247,216,74,0.12) 0%, rgba(92,232,213,0.08) 100%);
  color: #f7d84a;
  font-size: 24px;
  font-weight: 950;
  letter-spacing: 0.16em;
  line-height: 1;
  padding: 12px 26px;
  box-shadow: 0 8px 24px rgba(247,216,74,0.08), inset 0 1px 0 rgba(255,255,255,0.06);
  backdrop-filter: blur(8px);
}
.keyword-frame-words {
  display: grid;
  gap: 8px;
  margin-top: 28px;
  color: #ffffff;
  font-size: clamp(96px, 15vw, 162px);
  font-weight: 950;
  letter-spacing: -0.02em;
  line-height: 0.88;
  text-transform: uppercase;
  text-shadow:
    0 0 36px rgba(247,216,74,0.30),
    0 0 72px rgba(92,232,213,0.10),
    0 18px 42px rgba(0,0,0,0.65);
}
.keyword-frame-words span:nth-child(2) {
  background: linear-gradient(135deg, #f7d84a 20%, #5ce8d5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 8px 24px rgba(247,216,74,0.25));
}
.keyword-frame-words span {
  display: inline-block;
  transform: translateY(var(--word-y, 0px)) scale(var(--word-scale, 1));
  filter: blur(var(--word-blur, 0px));
  opacity: var(--word-opacity, 1);
}
.keyword-frame-words.compact {
  font-size: clamp(72px, 12vw, 132px);
}
.remotion-stat-frame,
.remotion-growth-frame,
.remotion-alert-frame,
.remotion-cta-frame {
  display: grid;
  justify-items: center;
  gap: 22px;
  margin-top: 34px;
}
.stat-value,
.growth-value {
  color: #ffffff;
  font-size: clamp(112px, 17vw, 190px);
  font-weight: 950;
  letter-spacing: -0.02em;
  line-height: 0.88;
  text-shadow:
    0 0 40px rgba(247,216,74,0.38),
    0 0 80px rgba(92,232,213,0.14),
    0 20px 48px rgba(0,0,0,0.65);
  background: linear-gradient(180deg, #ffffff 30%, rgba(247,216,74,0.85) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stat-label {
  max-width: 760px;
  color: rgba(255,255,255,0.78);
  font-size: 42px;
  font-weight: 900;
  line-height: 1.06;
  text-transform: uppercase;
  text-shadow: 0 8px 22px rgba(0,0,0,0.4);
}
.growth-chart {
  position: relative;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 22px;
  width: min(760px, 86vw);
  height: 220px;
  margin-top: 12px;
  padding: 16px 24px;
  border: 1.5px solid rgba(247,216,74,0.18);
  border-radius: 24px;
  border-bottom: 4px solid rgba(247,216,74,0.42);
  background: rgba(247,216,74,0.03);
}
.growth-chart i {
  width: 76px;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(180deg, #f7d84a 0%, #2dd481 60%, rgba(45,212,129,0.6) 100%);
  box-shadow: 0 0 32px rgba(45,212,129,0.22), inset 0 2px 0 rgba(255,255,255,0.2);
}
.growth-line {
  position: absolute;
  left: 72px;
  right: 70px;
  top: 72px;
  width: var(--line-width, 100%);
  height: 6px;
  transform: rotate(-15deg);
  transform-origin: left center;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffffff, rgba(247,216,74,0.8));
  box-shadow: 0 0 28px rgba(255,255,255,0.4), 0 0 56px rgba(247,216,74,0.2);
}
.remotion-compare-frame {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
  margin-top: 34px;
}
.remotion-compare-frame div {
  display: grid;
  min-height: 220px;
  place-items: center;
  border: 2px solid rgba(255,255,255,0.10);
  border-radius: 24px;
  background:
    radial-gradient(circle at 50% 0%, rgba(92,232,213,0.08) 0%, transparent 50%),
    rgba(255,255,255,0.055);
  color: #fff;
  font-size: 44px;
  font-weight: 950;
  line-height: 1.05;
  padding: 28px;
  text-transform: uppercase;
  box-shadow: 0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
  backdrop-filter: blur(6px);
}
.remotion-compare-frame strong {
  display: grid;
  place-items: center;
  width: 82px;
  height: 82px;
  border-radius: 999px;
  border: 3px solid rgba(247,216,74,0.5);
  background: rgba(247,216,74,0.12);
  color: #f7d84a;
  font-size: 38px;
  font-weight: 950;
  box-shadow: 0 0 32px rgba(247,216,74,0.18);
}
.remotion-timeline-frame {
  display: grid;
  gap: 18px;
  margin-top: 34px;
}
.timeline-step {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 18px;
  align-items: center;
  min-height: 92px;
  padding: 8px 18px 8px 8px;
  border: 1.5px solid rgba(92,232,213,0.12);
  border-radius: 22px;
  background: rgba(92,232,213,0.035);
  transform: translate3d(0, var(--step-y, 0px), 0);
  opacity: var(--step-opacity, 1);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.timeline-step span,
.check-row span {
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  border-radius: 18px;
  background: linear-gradient(135deg, #f7d84a, #e6c030);
  color: #111;
  font-size: 28px;
  font-weight: 950;
  box-shadow: 0 8px 20px rgba(247,216,74,0.2);
}
.timeline-step p,
.check-row p {
  margin: 0;
  color: #fff;
  font-size: 40px;
  font-weight: 920;
  line-height: 1.06;
  text-align: left;
  text-transform: uppercase;
}
.remotion-checklist-frame {
  display: grid;
  gap: 14px;
  margin-top: 32px;
}
.check-row {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 16px;
  align-items: center;
  min-height: 82px;
  border: 1.5px solid rgba(92,232,213,0.14);
  border-radius: 22px;
  background:
    radial-gradient(circle at 0% 50%, rgba(92,232,213,0.06) 0%, transparent 40%),
    rgba(255,255,255,0.04);
  padding: 14px 20px;
  transform: translate3d(0, var(--check-y, 0px), 0);
  opacity: var(--check-opacity, 1);
  box-shadow: 0 6px 18px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04);
}
.alert-symbol {
  display: grid;
  width: 116px;
  height: 116px;
  place-items: center;
  border: 3px solid rgba(255,128,112,0.50);
  border-radius: 24px;
  background:
    radial-gradient(circle at 50% 30%, rgba(255,128,112,0.22) 0%, transparent 60%),
    rgba(255,128,112,0.10);
  color: #ffb4aa;
  font-size: 78px;
  font-weight: 950;
  line-height: 1;
  box-shadow: 0 16px 48px rgba(255,128,112,0.15), inset 0 1px 0 rgba(255,255,255,0.06);
}
.remotion-quote-frame,
.remotion-question-frame {
  max-width: 880px;
  margin-top: 34px;
  color: #fff;
  font-size: clamp(76px, 12vw, 136px);
  font-weight: 950;
  line-height: 0.94;
  text-align: center;
  text-transform: uppercase;
  text-shadow: 0 18px 42px rgba(0,0,0,0.58), 0 0 60px rgba(255,255,255,0.06);
}
.remotion-question-frame {
  background: linear-gradient(180deg, #f7d84a 20%, #ffa726 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 12px 32px rgba(247,216,74,0.3));
}
.cta-pill {
  display: inline-grid;
  min-height: 64px;
  place-items: center;
  border-radius: 999px;
  background: #ffffff;
  color: #111;
  font-size: 28px;
  font-weight: 950;
  letter-spacing: 0.08em;
  padding: 14px 28px;
}
.v2-root {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #f4f1eb;
  color: #101820;
  font-family: SPLIT_Montserrat, SPLIT_Inter, Arial, sans-serif;
}
.v2-bg {
  position: absolute;
  inset: -70px;
  opacity: 0.34;
  filter: blur(26px) saturate(0.76) brightness(1.12);
}
.v2-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.v2-top {
  position: absolute;
  left: 24px;
  right: 24px;
  top: 28px;
  height: 584px;
  overflow: hidden;
  border-radius: 34px;
  background:
    linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,0.98));
  border: 3px solid rgba(247,216,74,0.78);
  box-shadow:
    0 30px 90px rgba(0,0,0,0.42),
    0 0 0 1px rgba(255,255,255,0.10) inset,
    0 0 45px rgba(247,216,74,0.18);
  padding: 12px;
}

.v2-top::before {
  content: "";
  position: absolute;
  inset: 12px;
  border-radius: 26px;
  border: 1.5px solid rgba(255,255,255,0.16);
  box-shadow:
    inset 0 0 0 1px rgba(247,216,74,0.25),
    inset 0 18px 45px rgba(255,255,255,0.05);
  pointer-events: none;
  z-index: 2;
}

.v2-top::after {
  content: "";
  position: absolute;
  left: 26px;
  right: 26px;
  top: 22px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), rgba(247,216,74,0.70), transparent);
  z-index: 3;
  pointer-events: none;
}

.v2-top img,
.v2-top video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  background: #020617;
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.10),
    0 18px 50px rgba(0,0,0,0.35);
}
.v2-stage {
  position: absolute;
  inset: 596px 0 0;
  overflow: hidden;
}
.v2-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.12));
}
.v2-scene {
  position: absolute;
  inset: 0;
}
.v2-hero {
  position: absolute;
  right: -36px;
  bottom: -54px;
  width: 68%;
  height: 86%;
  object-fit: cover;
  object-position: center bottom;
  filter: saturate(1.04) contrast(1.03);
}
.v2-hero.wide {
  left: 0;
  right: 0;
  width: 100%;
  opacity: 0.84;
}
.v2-copy {
  position: absolute;
  left: 70px;
  top: 164px;
  width: 590px;
}
.v2-kicker {
  display: inline-block;
  margin-bottom: 16px;
  background: rgba(15,24,31,0.92);
  color: #fff;
  font-size: 28px;
  font-weight: 950;
  letter-spacing: 0.08em;
  line-height: 1;
  padding: 12px 18px;
  text-transform: uppercase;
}
.v2-main {
  color: #fff;
  font-family: SPLIT_Bebas_Neue, SPLIT_Montserrat, Arial, sans-serif;
  font-size: 112px;
  font-weight: 950;
  letter-spacing: 0;
  line-height: 0.88;
  text-transform: uppercase;
  -webkit-text-stroke: 2px rgba(12,20,26,0.82);
  text-shadow: 0 10px 24px rgba(0,0,0,0.32);
}
.v2-sub {
  margin-top: 10px;
  color: #fff;
  font-size: 44px;
  font-weight: 900;
  line-height: 1.02;
  text-shadow: 0 6px 20px rgba(0,0,0,0.36);
}
.v2-band {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  min-height: 88px;
  display: grid;
  place-items: center;
  background: rgba(35,48,55,0.96);
  color: #fff;
  font-family: SPLIT_Barlow, SPLIT_Bebas_Neue, SPLIT_Montserrat, Arial, sans-serif;
  font-size: 58px;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  padding: 16px 36px;
  text-align: center;
  text-transform: uppercase;
}
.v2-stat .v2-main,
.v2-money_showcase .v2-main {
  color: #35e0b7;
  font-size: 148px;
}
.v2-alert_layout .v2-main {
  color: #ff7431;
}
.v2-cta_layout .v2-main {
  color: #35e0b7;
}
.v2-list {
  display: grid;
  gap: 18px;
  margin-top: 20px;
}
.v2-list-item {
  width: fit-content;
  max-width: 760px;
  background: rgba(255,255,255,0.84);
  color: #111820;
  font-size: 38px;
  font-weight: 950;
  line-height: 1;
  padding: 16px 22px;
  box-shadow: 0 14px 34px rgba(0,0,0,0.10);
}
.v2-progress-track {
  width: 620px;
  height: 34px;
  margin-top: 24px;
  background: rgba(17,24,32,0.18);
}
.v2-progress-fill {
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, #ff7431, #35e0b7);
}
.v2-caption {
  position: absolute;
  left: 70px;
  right: 70px;
  bottom: 92px;
  background: rgba(0,0,0,0.54);
  color: #fff;
  font-size: 34px;
  font-weight: 900;
  line-height: 1.1;
  padding: 18px 24px;
  text-align: center;
}
.v2-progress {
  position: absolute;
  left: 58px;
  right: 58px;
  bottom: 46px;
  height: 7px;
  background: rgba(0,0,0,0.14);
}
.v2-progress > div {
  height: 100%;
  background: linear-gradient(90deg, #ff7431, #34e2bb);
}
.audio-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 250px;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)),
    rgba(0,0,0,0.20);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}
.wave-bar {
  width: 11px;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--accent), var(--cyan));
  box-shadow: 0 0 24px rgba(92,232,213,0.20);
  transform-origin: center;
}
@keyframes audioDrift {
  from { transform: translate3d(-2%, -1%, 0) rotate(0deg); }
  to { transform: translate3d(2%, 1%, 0) rotate(5deg); }
}
.media-visual-card {
  width: 74%;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 26px;
  background: rgba(255,255,255,0.055);
  box-shadow: 0 26px 70px rgba(0,0,0,0.34);
  padding: 44px;
  text-align: center;
}
.media-visual-label {
  color: var(--cyan);
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.media-visual-title {
  margin-top: 20px;
  color: var(--text);
  font-family: SPLIT_Bebas_Neue, SPLIT_Anton, SPLIT_Oswald, SPLIT_Montserrat, Arial, sans-serif;
  font-size: 58px;
  font-weight: 900;
  line-height: 0.98;
  text-transform: uppercase;
}
.media-visual-chip {
  position: absolute;
  right: 28px;
  bottom: 24px;
  max-width: 520px;
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 999px;
  background: rgba(0,0,0,0.44);
  color: rgba(255,255,255,0.76);
  font-size: 20px;
  font-weight: 850;
  letter-spacing: 0.08em;
  overflow: hidden;
  padding: 10px 16px;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}
.scene-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.9;
}
.scene-atmosphere::before {
  content: "";
  position: absolute;
  inset: -18px;
  background:
    radial-gradient(circle at 12% 18%, rgba(92,232,213,0.12), transparent 34%),
    radial-gradient(circle at 86% 10%, rgba(255,216,77,0.10), transparent 30%),
    linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.025) 48%, transparent 80%);
}
.scene-primary-visual {
  position: absolute;
  right: 0;
  bottom: 32px;
  width: 360px;
  min-height: 210px;
  z-index: 0;
  will-change: opacity, transform;
}
.main-block {
  z-index: 2;
}
.overlay-scene.has-visual .main-block.left {
  right: 390px;
}
.overlay-scene.has-visual .main-block.center .title,
.overlay-scene.has-visual .main-block.center .body {
  max-width: 640px;
}
.primary-card {
  position: relative;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.10);
  border-radius: 24px;
  background:
    radial-gradient(circle at 30% 0%, rgba(92,232,213,0.14), transparent 45%),
    radial-gradient(circle at 80% 100%, rgba(247,216,74,0.06), transparent 40%),
    rgba(255,255,255,0.04);
  box-shadow:
    0 24px 72px rgba(0,0,0,0.28),
    inset 0 1px 0 rgba(255,255,255,0.08);
  padding: 26px;
  backdrop-filter: blur(6px);
}
.visual-icon-orb {
  display: grid;
  width: 92px;
  height: 92px;
  place-items: center;
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(255,216,77,0.95), rgba(92,232,213,0.86));
  color: #061015;
  font-size: 46px;
  font-weight: 900;
  box-shadow: 0 18px 48px rgba(92,232,213,0.18);
}
.visual-label {
  margin-top: 18px;
  color: rgba(255,255,255,0.56);
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
}
.visual-value {
  margin-top: 10px;
  color: rgba(255,255,255,0.92);
  font-size: 28px;
  font-weight: 900;
  line-height: 1.02;
}
.visual-waveform {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 118px;
}
.visual-waveform .wave-bar {
  width: 9px;
}
.document-lines {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}
.document-line {
  height: 13px;
  border-radius: 999px;
  background: rgba(255,255,255,0.15);
}
.document-line:nth-child(2) {
  width: 76%;
}
.document-line:nth-child(3) {
  width: 58%;
  background: rgba(92,232,213,0.30);
}
.mockup-frame {
  border: 1px solid rgba(92,232,213,0.18);
  border-radius: 18px;
  background: rgba(0,0,0,0.18);
  padding: 14px;
}
.mockup-top {
  display: flex;
  gap: 7px;
  margin-bottom: 16px;
}
.mockup-dot {
  width: 11px;
  height: 11px;
  border-radius: 999px;
  background: rgba(255,255,255,0.24);
}
.asset-insert {
  position: absolute;
  right: 46px;
  top: 34px;
  z-index: 3;
  border: 1px solid rgba(255,216,77,0.22);
  border-radius: 999px;
  background: rgba(255,216,77,0.10);
  color: var(--accent);
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 10px 16px;
  text-transform: uppercase;
}
`;


const defaultProps: ReelProps = {
  brand: '',
  templateName: TEMPLATE_NAME,
  design: 'imageCollage',
  mediaType: 'video',
  mediaFit: 'videoExplainer',
  backgroundMusic: true,
  backgroundMusicMood: 'corporate',
  backgroundMusicVolume: 0.055,
  durationSeconds: 12,
  overlayTimeline: [
    {
      start: 0,
      end: 12,
      type: 'hook',
      label: 'Hook',
      text: 'Upload a video',
      body: 'The first minute becomes a clean video explainer with correct text.',
      accentWord: 'video',
      align: 'center',
    },
  ],
  captions: [{start: 0, end: 12, text: 'Upload your video to generate the final reel.'}],
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const easeInOutCubic = (value: number) => {
  const x = clamp(value, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const easeOutBack = (value: number) => {
  const x = clamp(value, 0, 1);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

const cleanText = (value: unknown, fallback = '') =>
  String(value || fallback)
    .replace(/\s+/g, ' ')
    .trim();

const limitWords = (value: unknown, maxWords: number, maxChars: number) => cleanText(value)
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, maxWords)
  .join(' ')
  .slice(0, maxChars);

const normalizeOverlay = (item: ContinuousOverlayItem): ContinuousOverlayItem => ({
  ...item,
  start: Math.max(0, Number(item.start) || 0),
  end: Math.max(0, Number(item.end) || 0),
  label: cleanText(item.label || item.type || 'Point', 'Point').slice(0, 32),
  text: limitWords(item.text || 'Story', 8, 70),
  body: limitWords(item.body || '', 12, 128),
  accentWord: cleanText(item.accentWord || '', '').split(/\s+/)[0] || undefined,
  align: item.align === 'left' ? 'left' : 'center',
  sfx: item.sfx,
  layout: normalizeLayout(item.layout, item.type),
  layoutType: normalizeV2LayoutType(item.layoutType, item),
  visual: cleanText(item.visual || '').slice(0, 180),
  visualRole: normalizeVisualRole(item.visualRole),
  primaryVisual: normalizePrimaryVisual(item.primaryVisual, item),
  animation: normalizeAnimation(item.animation, item.type),
  emotion: normalizeEmotion(item.emotion, item.type),
  words: normalizeTimedWords(item.words),
});

const normalizeCaption = (item: ContinuousCaptionItem): ContinuousCaptionItem => {
  const text = limitWords(item.text || '', 16, 96);
  const lines = item.lines?.length
    ? item.lines.map((line) => limitWords(line, 8, 46)).filter(Boolean).slice(0, 2)
    : breakSubtitleLines(text);
  return {
    ...item,
    start: Math.max(0, Number(item.start) || 0),
    end: Math.max(0, Number(item.end) || 0),
    text,
    lines,
  };
};

function breakSubtitleLines(text: string) {
  const words = cleanText(text).split(/\s+/).filter(Boolean);
  if (words.length <= 6) return [words.join(' ')];
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')].filter(Boolean);
}

function normalizeTimedWords(value: unknown): TimedWord[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const words = value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const word = cleanText(record.word || '');
      const start = Number(record.start);
      const end = Number(record.end);
      if (!word || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
      return {word, start, end};
    })
    .filter((item): item is TimedWord => Boolean(item));
  return words.length ? words : undefined;
}

const normalizeVisualRole = (value: ContinuousOverlayItem['visualRole']): ContinuousOverlayItem['visualRole'] => {
  if (value === 'topVideo' || value === 'bottomOverlay' || value === 'background' || value === 'assetInsert') return value;
  return 'bottomOverlay';
};

const normalizePrimaryVisual = (
  value: PrimaryVisual | undefined,
  item: ContinuousOverlayItem,
): PrimaryVisual => {
  const type = normalizePrimaryVisualType(value?.type, item);
  return {
    type,
    assetId: cleanText(value?.assetId || '').slice(0, 500) || undefined,
    prompt: cleanText(value?.prompt || item.visual || item.text || '').slice(0, 180),
    label: limitWords(value?.label || item.label || item.text || labelForOverlay(item), 4, 48),
    motion: normalizePrimaryVisualMotion(value?.motion, type),
  };
};

function normalizePrimaryVisualType(value: unknown, item: ContinuousOverlayItem): PrimaryVisualType {
  if (value === 'uploadedMedia' || value === 'image' || value === 'chart' || value === 'document' || value === 'waveform' || value === 'mockup' || value === 'none') return value;
  if (item.visualRole === 'topVideo') return 'uploadedMedia';
  if (item.type === 'stat') return 'chart';
  if (item.type === 'warning') return 'mockup';
  if (item.layout === 'checklist') return 'document';
  if (item.type === 'hook') return 'waveform';
  if (/\b(site|website|portal|app|screen|form)\b/i.test(item.visual || item.body || '')) return 'mockup';
  return 'mockup';
}

function normalizePrimaryVisualMotion(value: unknown, type: PrimaryVisualType): PrimaryVisualMotion {
  if (value === 'slowZoom' || value === 'panLeft' || value === 'float' || value === 'pop' || value === 'slideUp' || value === 'parallax') return value;
  if (type === 'chart') return 'pop';
  if (type === 'document' || type === 'mockup') return 'slideUp';
  if (type === 'uploadedMedia' || type === 'image') return 'slowZoom';
  return 'float';
}

const normalizeLayout = (value: ContinuousOverlayItem['layout'], type?: OverlayType): ContinuousOverlayItem['layout'] => {
  if (value) return value;
  if (type === 'hook' || type === 'quote') return 'headlineCard';
  if (type === 'stat') return 'statCard';
  if (type === 'warning') return 'warningCard';
  if (type === 'cta') return 'ctaCard';
  return 'splitExplainer';
};

function normalizeV2LayoutType(
  value: ContinuousOverlayItem['layoutType'],
  item: ContinuousOverlayItem,
): NonNullable<ContinuousOverlayItem['layoutType']> {
  if (value) return value;
  const source = cleanText([item.type, item.text, item.body, item.visual].filter(Boolean).join(' ')).toLowerCase();
  if (item.type === 'hook' || /\b(question|why|kya|kaise)\b/.test(source)) return 'question_hook';
  if (item.type === 'cta' || /\b(follow|save|share|comment)\b/.test(source)) return 'cta_layout';
  if (item.type === 'warning' || /\b(warning|alert|risk|avoid|fail|panic)\b/.test(source)) return 'alert_layout';
  if (/\b(salary|income|money|earning|rupee|₹|amount)\b/.test(source)) return 'money_showcase';
  if (item.type === 'stat' || /\b(%|percent|rate|number|score|marks|\d)\b/.test(source)) return 'big_statistic';
  if (/\b(step|process|how to|apply|download)\b/.test(source)) return 'step_process';
  if (/\b(timeline|journey|prelims|mains|interview)\b/.test(source)) return 'timeline';
  if (/\b(vs|versus|compare|comparison)\b/.test(source)) return 'comparison';
  if (/\b(document|notification|admit|card|form)\b/.test(source)) return 'document_card';
  if (/\b(progress|preparation|practice|daily|target)\b/.test(source)) return 'progress_bar';
  return 'character_hero';
}

const normalizeAnimation = (value: ContinuousOverlayItem['animation'], type?: OverlayType): ContinuousOverlayItem['animation'] => {
  if (value) return value;
  if (type === 'hook') return 'popIn';
  if (type === 'stat') return 'countUp';
  if (type === 'warning') return 'warningPulse';
  if (type === 'cta') return 'slideUp';
  return 'fadeUp';
};

const normalizeEmotion = (value: ContinuousOverlayItem['emotion'], type?: OverlayType): ContinuousOverlayItem['emotion'] => {
  if (value) return value;
  if (type === 'hook') return 'urgent';
  if (type === 'warning') return 'serious';
  if (type === 'cta') return 'motivational';
  return 'informative';
};

const getActiveItem = <T extends {start: number; end: number}>(items: T[], time: number) =>
  items.find((item) => time >= item.start && time < item.end) || items.find((item) => time < item.end) || items.at(-1);

const getDurationSeconds = (props: ReelProps) => {
  const overlayEnd = Math.max(0, ...(props.overlayTimeline || []).map((item) => Number(item.end) || 0));
  const captionEnd = Math.max(0, ...(props.captions || []).map((item) => Number(item.end) || 0));
  const requested = Number(props.durationSeconds) || 0;
  return clamp(Math.ceil(Math.max(requested, overlayEnd, captionEnd, 1)), 1, maxDurationSeconds);
};

const isAccentToken = (value: string, accentWord?: string) => {
  if (!accentWord) return false;
  const normalizedAccent = accentWord.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const normalizedPart = value.toLowerCase().replace(/[^a-z0-9]+/g, '');
  return Boolean(normalizedPart && normalizedPart === normalizedAccent);
};

const wordParts = (text: string) => text.split(/(\s+)/).filter((part) => part.length > 0);

const indexedWordParts = (text: string) => {
  let wordIndex = -1;
  return wordParts(text).map((part) => {
    if (/^\s+$/.test(part)) return {part, wordIndex: -1};
    wordIndex += 1;
    return {part, wordIndex};
  });
};

function normalizeWordForSync(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9₹$%]+/g, '');
}

function getMatchedWordTime(
  part: string,
  wordIndex: number,
  timedWords: TimedWord[] | undefined,
  usedTimedIndexes: Set<number>,
) {
  if (!timedWords?.length) return null;
  const token = normalizeWordForSync(part);
  if (!token) return null;
  const exactIndex = timedWords.findIndex((word, index) => {
    if (usedTimedIndexes.has(index)) return false;
    return normalizeWordForSync(word.word) === token;
  });
  if (exactIndex >= 0) {
    usedTimedIndexes.add(exactIndex);
    return timedWords[exactIndex];
  }
  const looseIndex = timedWords.findIndex((word, index) => {
    if (usedTimedIndexes.has(index)) return false;
    const timed = normalizeWordForSync(word.word);
    return token.length >= 4 && timed.length >= 4 && (token.includes(timed) || timed.includes(token));
  });
  if (looseIndex >= 0) {
    usedTimedIndexes.add(looseIndex);
    return timedWords[looseIndex];
  }
  const fallback = timedWords[wordIndex];
  return fallback || null;
}

function getWordCount(text: string) {
  return indexedWordParts(text).filter((part) => part.wordIndex >= 0).length;
}

function titleWordStyle(
  localFrame: number,
  wordIndex: number,
  isAccent: boolean,
  wordCount: number,
  durationFrames: number,
  timedWord?: TimedWord | null,
) {
  const localSeconds = localFrame / fps;
  const revealWindow = clamp(durationFrames * 0.44, 24, 56);
  const step = wordCount <= 1 ? 0 : revealWindow / Math.max(1, wordCount - 1);
  const fallbackProgress = clamp((localFrame - 8 - wordIndex * step) / 16, 0, 1);
  const timedProgress = timedWord
    ? clamp((localSeconds - Math.max(0, timedWord.start - 0.12)) / Math.max(0.14, timedWord.end - timedWord.start + 0.12), 0, 1)
    : fallbackProgress;
  const progress = timedWord ? timedProgress : fallbackProgress;
  const eased = 1 - Math.pow(1 - progress, 3);
  const isCurrent = timedWord ? localSeconds >= timedWord.start && localSeconds <= timedWord.end + 0.08 : false;
  const settle = timedWord ? progress : clamp((localFrame - 18 - wordIndex * step) / 10, 0, 1);
  const punch = (isAccent || isCurrent) ? Math.sin(Math.min(Math.PI, settle * Math.PI)) * 0.075 : 0;
  return {
    opacity: eased,
    filter: `blur(${(1 - eased) * 3.5}px)`,
    color: isCurrent ? 'var(--accent)' : undefined,
    transform: `translateY(${(1 - eased) * 20}px) rotateX(${(1 - eased) * 10}deg) scale(${0.92 + eased * 0.08 + punch})`,
  };
}

function bodyWordStyle(
  localFrame: number,
  wordIndex: number,
  wordCount: number,
  durationFrames: number,
  timedWord?: TimedWord | null,
) {
  const localSeconds = localFrame / fps;
  const revealWindow = clamp(durationFrames * 0.68, 40, 100);
  const step = wordCount <= 1 ? 0 : revealWindow / Math.max(1, wordCount - 1);
  const fallbackProgress = clamp((localFrame - 24 - wordIndex * step) / 14, 0, 1);
  const timedProgress = timedWord
    ? clamp((localSeconds - Math.max(0, timedWord.start - 0.08)) / Math.max(0.12, timedWord.end - timedWord.start + 0.1), 0, 1)
    : fallbackProgress;
  const progress = timedWord ? timedProgress : fallbackProgress;
  const eased = 1 - Math.pow(1 - progress, 2);
  const isCurrent = timedWord ? localSeconds >= timedWord.start && localSeconds <= timedWord.end + 0.08 : false;
  return {
    opacity: eased,
    color: isCurrent ? 'var(--accent)' : undefined,
    transform: `translateY(${(1 - eased) * 8}px)`,
  };
}

const AnimatedTitle = ({
  accentWord,
  durationFrames,
  localFrame,
  text,
  timedWords,
}: {
  accentWord?: string;
  durationFrames: number;
  localFrame: number;
  text: string;
  timedWords?: TimedWord[];
}) => {
  const wordCount = getWordCount(text);
  const underlineStart = clamp(durationFrames * 0.38, 18, 44);
  const underlineProgress = clamp((localFrame - underlineStart) / 16, 0, 1);
  const usedTimedIndexes = new Set<number>();
  return (
    <>
      {indexedWordParts(text).map(({part, wordIndex}, index) => {
        if (wordIndex < 0) return part;
        const isAccent = isAccentToken(part, accentWord);
        const timedWord = getMatchedWordTime(part, wordIndex, timedWords, usedTimedIndexes);
        return (
          <span
            className={`title-word${isAccent ? ' accent' : ''}`}
            key={`${part}-${index}`}
            style={titleWordStyle(localFrame, wordIndex, isAccent, wordCount, durationFrames, timedWord)}
          >
            {part}
          </span>
        );
      })}
      <div className="kinetic-underline" style={{opacity: underlineProgress, transform: `scaleX(${underlineProgress})`}} />
    </>
  );
};

const AnimatedBody = ({
  accentWord,
  durationFrames,
  localFrame,
  text,
  timedWords,
}: {
  accentWord?: string;
  durationFrames: number;
  localFrame: number;
  text: string;
  timedWords?: TimedWord[];
}) => {
  const wordCount = getWordCount(text);
  const usedTimedIndexes = new Set<number>();
  return (
    <>
      {indexedWordParts(text).map(({part, wordIndex}, index) => {
        if (wordIndex < 0) return part;
        const isAccent = isAccentToken(part, accentWord);
        const timedWord = getMatchedWordTime(part, wordIndex, timedWords, usedTimedIndexes);
        return (
          <span
            className={`body-word${isAccent ? ' accent' : ''}`}
            key={`${part}-${index}`}
            style={bodyWordStyle(localFrame, wordIndex, wordCount, durationFrames, timedWord)}
          >
            {isAccent ? (
              <span style={{color: 'var(--accent)', fontWeight: 900}}>{part}</span>
            ) : (
              part
            )}
          </span>
        );
      })}
    </>
  );
};

const splitSupportItems = (body?: string) => cleanText(body || '')
  .split(/(?<=[.!?])\s+|,\s+|\s+\|\s+/)
  .map((item) => item.replace(/[.!?]+$/g, '').trim())
  .filter((item) => item.length > 2)
  .slice(0, 4);

const getScriptDetailSupportItems = (details: ScriptDetails | undefined, item: ContinuousOverlayItem | undefined) => {
  if (!details || !item) return [];
  const label = cleanText([item.label, item.text, item.body].filter(Boolean).join(' ')).toLowerCase();
  const matchingBlock = (details.detailBlocks || []).find((block) => {
    const title = cleanText(block.title).toLowerCase();
    if (title && label.includes(title)) return true;
    if (item.type === 'stat' && (block.type === 'dateBox' || block.type === 'amountBox')) return true;
    if (item.type === 'warning' && block.type === 'warningBox') return true;
    return block.items.some((value) => label.includes(cleanText(value).toLowerCase()));
  });
  if (matchingBlock?.items?.length) return matchingBlock.items.slice(0, 4);
  if (item.type === 'point' && details.keyPoints?.length) return details.keyPoints.slice(0, 4);
  if (item.type === 'cta' && details.warnings?.length) return details.warnings.slice(0, 3);
  return [];
};

const extractStatToken = (value?: string) => cleanText(value || '').match(/[₹$]?\s?\d[\d,.]*(?:\s?(?:%|lakh|crore|k|thousand|days?|hours?|months?|years?))?/i)?.[0] || '';

const labelForOverlay = (item?: ContinuousOverlayItem) => {
  if (!item) return 'Point';
  if (item.type === 'hook') return 'Start here';
  if (item.type === 'stat') return 'Key number';
  if (item.type === 'warning') return 'Important';
  if (item.type === 'cta') return 'Remember';
  if (item.type === 'quote') return 'Note';
  return item.label || 'Point';
};

const compactVideoTitle = (value?: string, fallback?: string) => {
  const source = cleanText(value || fallback || 'Video');
  const words = source.split(/\s+/).filter(Boolean);
  return words.slice(0, 5).join(' ').slice(0, 42);
};

const getTextLayout = (item?: ContinuousOverlayItem) => {
  const title = cleanText(item?.text || 'Story');
  const body = cleanText(item?.body || '');
  const titleLength = title.length;
  const titleWords = title.split(/\s+/).filter(Boolean).length;
  const bodyWords = body.split(/\s+/).filter(Boolean).length;
  const combinedWeight = titleWords + bodyWords;

  const titleSize = titleLength <= 16 ? 82 : titleLength <= 28 ? 72 : titleLength <= 44 ? 62 : 54;
  const bodySize = bodyWords <= 9 ? 36 : bodyWords <= 16 ? 32 : 28;
  const blockTop = combinedWeight >= 24 ? 26 : combinedWeight >= 18 ? 34 : 42;

  return {
    blockTop,
    bodySize,
    titleSize,
    titleLineHeight: titleLength > 32 ? 1.04 : 0.96,
  };
};

const SoundCueLayer = ({items}: {items: ContinuousOverlayItem[]}) => (
  <>
    {items
      .map((item, index) => ({
        item,
        cue: item.sfx || defaultSceneSfx(item, index, items.length),
      }))
      .filter(({cue}) => cue && sfxSources[cue])
      .map(({item, cue}) => (
        <Sequence
          durationInFrames={Math.max(12, Math.round(0.8 * fps))}
          from={Math.max(0, Math.round(item.start * fps))}
          key={`${item.id || item.start}-${cue}`}
        >
          <Audio src={sfxSources[cue!]!} volume={sfxVolume(cue!)} />
        </Sequence>
      ))}
  </>
);

const MidSubtitleLayer = ({captions, time}: {captions: ContinuousCaptionItem[]; time: number}) => {
  const activeCaption = getActiveItem(captions, time);
  if (!activeCaption?.text) return null;
  const lines = activeCaption.lines?.length ? activeCaption.lines : breakSubtitleLines(activeCaption.text);
  return (
    <div className="mid-subtitle-layer">
      <div className="mid-subtitle-box">
        {lines.slice(0, 2).map((line, lineIndex) => (
          <div className="mid-subtitle-line" key={`${line}-${lineIndex}`}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

function defaultSceneSfx(item: ContinuousOverlayItem, index: number, total: number): NonNullable<ContinuousOverlayItem['sfx']> {
  const text = [
    item.text,
    item.body,
    item.label,
    item.visual,
    item.assetBrief,
    item.primaryVisual?.prompt,
    item.primaryVisual?.label,
  ].join(' ').toLowerCase();
  if (index === 0 || item.type === 'hook') return /cash|currency|rupee|bank|rbi|market|finance/.test(text) ? 'boom' : 'softPop';
  if (index === total - 1 || item.type === 'cta') return 'softChime';
  if (/cash|currency|rupee|banknote|notes?|money|salary|finance|investment/.test(text)) return 'cash';
  if (/official|approved|statement|policy|document|proposal|decision|notice/.test(text)) return 'stamp';
  if (/question|why|how|benefit|countries|global|compare|change/.test(text)) return 'whoosh';
  if (/warning|risk|alert|deadline|failed|rejected/.test(text)) return 'warning';
  if (/type|typing|form|apply|download|report|paper/.test(text)) return 'typing';
  if (item.type === 'stat' || item.type === 'warning') return 'softPop';
  return 'softTick';
}

function sfxVolume(cue: NonNullable<ContinuousOverlayItem['sfx']>) {
  if (cue === 'cash') return 0.08;
  if (cue === 'boom' || cue === 'bassDrop') return 0.075;
  if (cue === 'stamp' || cue === 'whoosh') return 0.065;
  if (cue === 'typing') return 0.035;
  if (cue === 'warning') return 0.055;
  return 0.05;
}

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
  const musicSrc = resolveMediaSrc(src) || backgroundMusicSources[mood || 'corporate'];
  if (!musicSrc) return null;
  return <Audio loop src={musicSrc} volume={clamp(Number(volume ?? 0.028), 0.012, 0.04)} />;
};

const SourceAudioLayer = ({
  mediaSrc,
  mediaTrimStartSeconds,
  mediaType,
  volume,
}: {
  mediaSrc?: string;
  mediaTrimStartSeconds?: number;
  mediaType: ReelProps['mediaType'];
  volume?: number;
}) => {
  const src = resolveMediaSrc(mediaSrc);
  if (!src || (mediaType !== 'video' && mediaType !== 'audio')) return null;
  return (
    <Audio
      src={src}
      startFrom={Math.max(0, Math.round((mediaTrimStartSeconds || 0) * fps))}
      volume={clamp(Number(volume ?? 1.35), 0.85, 2)}
    />
  );
};

const AudioHeroVisual = ({
  frame,
  item,
  title,
  visualHint,
}: {
  frame: number;
  item?: ContinuousOverlayItem;
  title?: string;
  visualHint?: string;
}) => {
  const label = cleanText(item?.primaryVisual?.label || item?.label || 'Voice explainer');
  const headline = limitWords(title || item?.text || 'Video Explainer', 5, 58).replace(/[_-]+/g, ' ');
  const brief = limitWords(item?.primaryVisual?.prompt || visualHint || item?.body || 'Transcript-timed visual story', 9, 96).replace(/[_-]+/g, ' ');
  const bars = Array.from({length: 22}, (_, index) => {
    const wave = Math.sin(frame / 5 + index * 0.72);
    const secondary = Math.sin(frame / 11 + index * 1.4);
    return 38 + (wave + 1) * 40 + (secondary + 1) * 14;
  });

  return (
    <div className="media-visual-empty">
      <div className="audio-hero">
        <div className="audio-copy">
          <div className="audio-badge">{label}</div>
          <div className="audio-title">{headline}</div>
          <div className="audio-subtitle">{brief}</div>
        </div>
        <div className="audio-wave">
          {bars.map((heightValue, index) => (
            <div
              className="wave-bar"
              key={index}
              style={{
                height: `${heightValue}%`,
                opacity: 0.54 + (index % 5) * 0.07,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MediaFrame = ({
  activeOverlay,
  captionsEnabled,
  frame,
  mediaFit,
  mediaSrc,
  mediaTrimStartSeconds,
  mediaType,
  progress,
  title,
  visualHint,
}: {
  activeOverlay?: ContinuousOverlayItem;
  captionsEnabled?: boolean;
  frame: number;
  mediaFit?: ReelProps['mediaFit'];
  mediaSrc?: string;
  mediaTrimStartSeconds?: number;
  mediaType: ReelProps['mediaType'];
  progress: number;
  title?: string;
  visualHint?: string;
}) => {
  const objectFit = mediaFit === 'contain' ? 'contain' : 'cover';
  const src = resolveMediaSrc(mediaSrc);
  const cleanVisualHint = cleanText(visualHint || title || 'Explainer visual');

  return (
    <div className="top-shell">
      <div className="media-card">
        {src && mediaType === 'video' ? (
          <OffthreadVideo
            muted
            src={src}
            startFrom={Math.max(0, Math.round((mediaTrimStartSeconds || 0) * fps))}
            style={{
              width: '100%',
              height: '100%',
              objectFit,
              objectPosition: 'center center',
            }}
          />
        ) : null}
        {src && mediaType === 'image' ? (
          <Img
            src={src}
            style={{
              width: '100%',
              height: '100%',
              objectFit,
              objectPosition: 'center center',
            }}
          />
        ) : null}
        {mediaType === 'audio' || !src ? (
          <AudioHeroVisual
            frame={frame}
            item={activeOverlay}
            title={title}
            visualHint={cleanVisualHint}
          />
        ) : null}
        {cleanVisualHint && mediaType === 'image' ? (
          <div className="media-visual-chip">{cleanVisualHint.replace(/[_-]+/g, ' ').slice(0, 70)}</div>
        ) : null}
      </div>
      {title && !captionsEnabled ? <div className="video-title">{title}</div> : null}
      <div className="top-progress">
        <div className="top-progress-fill" style={{width: `${progress * 100}%`}} />
      </div>
    </div>
  );
};

function getOverlayClass(item?: ContinuousOverlayItem) {
  if (item?.layout === 'headlineCard') return 'headline-card';
  if (item?.layout === 'statCard') return 'stat-card';
  if (item?.layout === 'warningCard') return 'warning-card';
  if (item?.layout === 'checklist') return 'checklist-card';
  if (item?.layout === 'ctaCard') return 'cta-card-layout';
  return 'split-explainer';
}

function getSceneAnimationStyle(item: ContinuousOverlayItem | undefined, localFrame: number, durationFrames: number) {
  const enter = clamp(localFrame / 12, 0, 1);
  const exit = clamp((durationFrames - localFrame) / 10, 0, 1);
  const opacity = Math.min(enter, exit);
  const baseY = (1 - enter) * 30;
  const exitY = (1 - exit) * -18;
  const scaleIn = 0.96 + enter * 0.04;
  const pulse = item?.animation === 'warningPulse'
    ? 1 + Math.sin(localFrame / 4) * 0.006
    : 1;
  const popScale = item?.animation === 'popIn'
    ? 0.92 + enter * 0.08
    : scaleIn;

  return {
    opacity,
    transform: `translateY(${baseY + exitY}px) scale(${(item?.animation === 'popIn' ? popScale : scaleIn) * pulse})`,
  };
}

function getDisplayStatToken(item: ContinuousOverlayItem | undefined, localFrame: number) {
  const token = item?.type === 'stat' ? extractStatToken([item.text, item.body].filter(Boolean).join(' ')) : '';
  if (!token || item?.animation !== 'countUp') return token;
  const match = token.match(/^(.*?)(\d[\d,.]*)(.*)$/);
  if (!match) return token;
  const numeric = Number(match[2].replace(/,/g, ''));
  if (!Number.isFinite(numeric) || numeric > 1000000) return token;
  const progress = clamp(localFrame / 18, 0, 1);
  const value = Math.round(numeric * progress).toLocaleString('en-IN');
  return `${match[1]}${value}${match[3]}`;
}

function shortMaterialText(value: string, maxWords = 3) {
  return cleanText(value)
    .split(/\s+/)
    .slice(0, maxWords)
    .join(' ')
    .replace(/[.!?]+$/g, '');
}

function getMaterialItems(item: ContinuousOverlayItem, supportItems: string[]) {
  if (item.layout === 'headlineCard' || item.type === 'hook') return topicFallbackItems(item).slice(0, 3);
  if (item.layout === 'ctaCard' || item.type === 'cta') return ['Check details', 'Save link', 'Publish'];
  const candidates = [
    ...supportItems,
    ...splitSupportItems(item.body),
    item.visual || '',
    item.text || '',
  ]
    .map((value) => shortMaterialText(value, 3))
    .filter(Boolean);
  const unique = candidates.filter((value, index) => {
    const key = value.toLowerCase();
    return candidates.findIndex((candidate) => candidate.toLowerCase() === key) === index;
  });
  if (unique.length >= 3) return unique.slice(0, 3);
  if (item.type === 'stat') return ['Key number', 'Proof point', 'Impact'];
  if (item.type === 'warning') return ['Risk', 'Check first', 'Avoid mistake'];
  return topicFallbackItems(item).slice(0, 3);
}

function topicFallbackItems(item: ContinuousOverlayItem) {
  const source = cleanText([item.text, item.body, item.visual].filter(Boolean).join(' ')).toLowerCase();
  if (/\b(exam|admit|hall|syllabus|student|marks|result)\b/.test(source)) return ['Exam update', 'Important date', 'Next step'];
  if (/\b(bank|rbi|salary|rupee|fee|amount|loan|money|income)\b/.test(source)) return ['Money detail', 'Official check', 'Growth point'];
  if (/\b(job|career|interview|office|work|hiring)\b/.test(source)) return ['Career path', 'Role detail', 'Apply step'];
  if (/\b(document|certificate|card|id|proof|form)\b/.test(source)) return ['Document', 'Verification', 'Submit'];
  return ['Key idea', 'Proof point', 'Action'];
}

function materialEntryStyle(localFrame: number, index: number, delay = 16) {
  const progress = clamp((localFrame - delay - index * 5) / 12, 0, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  return {
    opacity: eased,
    transform: `translateY(${(1 - eased) * 18}px) scale(${0.96 + eased * 0.04})`,
  };
}

function materialSlideStyle(localFrame: number, index: number, delay = 18) {
  const progress = clamp((localFrame - delay - index * 6) / 12, 0, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  return {
    opacity: eased,
    transform: `translateX(${(1 - eased) * -22}px)`,
  };
}

function materialScaleStyle(localFrame: number, index: number, delay = 20) {
  const progress = clamp((localFrame - delay - index * 5) / 10, 0, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  return {
    opacity: eased,
    transform: `scale(${0.9 + eased * 0.1})`,
  };
}

function sheenStyle(localFrame: number, index: number) {
  const progress = clamp((localFrame - 24 - index * 6) / 18, 0, 1);
  return {
    opacity: progress > 0 && progress < 1 ? 1 : 0,
    transform: `translateX(${-120 + progress * 260}%)`,
  };
}

function primaryVisualStyle(item: ContinuousOverlayItem, localFrame: number) {
  const visual = item.primaryVisual;
  const enter = clamp((localFrame - 8) / 18, 0, 1);
  const eased = 1 - Math.pow(1 - enter, 3);
  const floatY = Math.sin(localFrame / 14) * 5;
  const motion = visual?.motion || 'float';
  const scale = motion === 'pop'
    ? 0.86 + eased * 0.14
    : motion === 'slowZoom'
      ? 1 + clamp(localFrame / 180, 0, 1) * 0.035
      : 0.96 + eased * 0.04;
  const translateX = motion === 'panLeft' ? (1 - eased) * 34 : 0;
  const translateY = motion === 'slideUp' ? (1 - eased) * 28 : floatY;
  return {
    opacity: eased,
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
  };
}

function visualGlyph(type: PrimaryVisualType | undefined, item: ContinuousOverlayItem) {
  if (type === 'chart' || item.type === 'stat') return '#';
  if (type === 'document') return '✓';
  if (type === 'mockup') return '⌁';
  if (type === 'waveform') return '~';
  if (item.type === 'warning') return '!';
  if (item.type === 'cta') return '↗';
  return 'i';
}

function shouldShowCaptionSupportPanel(item: ContinuousOverlayItem, statToken: string, supportItems: string[]) {
  if (item.type === 'hook' || item.type === 'stat' || item.type === 'warning' || item.type === 'cta') return true;
  if (item.layout === 'statCard' || item.layout === 'warningCard' || item.layout === 'ctaCard') return true;
  if (statToken) return true;
  const text = cleanText([item.text, item.body].filter(Boolean).join(' '));
  if (supportItems.length >= 2 && text.split(/\s+/).length <= 9) return true;
  return false;
}

const ShadcnScenePanel = ({
  item,
  localFrame,
  statToken,
  supportItems,
}: {
  item: ContinuousOverlayItem;
  localFrame: number;
  statToken: string;
  supportItems: string[];
}) => {
  const assetSrc = resolveMediaSrc(item.primaryVisual?.assetId);
  const icon = visualGlyph(item.primaryVisual?.type, item);
  const title = shadcnPanelTitle(item, statToken);
  const brief = shadcnVisualBrief(item);
  const chips = shadcnChips(item, supportItems);
  const progress = clamp((localFrame - 10) / 24, 0, 1);
  const isAlert = item.type === 'warning';
  const isComparison = /\b(vs|versus|compare|comparison)\b/i.test([item.text, item.body, item.visual].filter(Boolean).join(' '));
  const eyebrow = labelForOverlay(item);

  return (
    <div className="shadcn-scene-panel" style={getSceneAnimationStyle(item, localFrame, 96)}>
      <div className="shadcn-panel-header">
        <div className={`shadcn-badge ${isAlert || item.type === 'stat' ? 'accent' : ''}`}>{eyebrow}</div>
        <div className="shadcn-panel-title">{title}</div>
      </div>
      {isComparison ? (
        <div className="shadcn-tabs">
          <div className="shadcn-tab active">{chips[0] || 'Option A'}</div>
          <div className="shadcn-tab">{chips[1] || 'Option B'}</div>
        </div>
      ) : null}
      <div className={`shadcn-card shadcn-caption-card ${isAlert ? 'shadcn-alert' : ''}`}>
        <div className="shadcn-visual-frame">
          {assetSrc ? (
            <Img className="shadcn-image" src={assetSrc} />
          ) : (
            <div className="shadcn-icon-tile">{icon}</div>
          )}
          <div>
            <div className="shadcn-card-value">{title}</div>
            {brief && brief.toLowerCase() !== title.toLowerCase() ? (
              <div className="shadcn-card-support">{brief}</div>
            ) : null}
          </div>
        </div>
        <div className="shadcn-progress">
          <div className="shadcn-progress-fill" style={{width: `${Math.max(18, progress * 100)}%`}} />
        </div>
      </div>
    </div>
  );
};

function shadcnPanelTitle(item: ContinuousOverlayItem, statToken: string) {
  if (item.type === 'stat' && statToken) return statToken;
  if (item.type === 'warning') return 'Reality Check';
  const text = limitWords(cleanText(item.text || item.body || ''), 5, 56);
  if (text) return text;
  if (item.type === 'cta') return 'Next Step';
  if (item.type === 'hook') return 'Important Update';
  return 'Key Update';
}

function shadcnVisualBrief(item: ContinuousOverlayItem) {
  const source = cleanText(item.primaryVisual?.prompt || item.visual || item.primaryVisual?.label || item.label || '');
  const cleaned = source
    .replace(/\b(top video|bottom|overlay|continues|dominant|large|punchy|card|text|matched to|active transcript phrase)\b/gi, ' ')
    .replace(/[;:_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned && cleaned.length > 8) return limitWords(cleaned, 6, 64);
  if (item.type === 'stat') return 'Number focused visual';
  if (item.type === 'warning') return 'Clean alert visual';
  if (item.type === 'cta') return 'Comment action visual';
  if (item.type === 'hook') return 'Strong opening visual';
  return 'Support visual';
}

function shadcnChips(item: ContinuousOverlayItem, supportItems: string[]) {
  if (item.type === 'cta') return ['Save', 'Comment', 'Share'];
  if (item.type === 'warning') return ['Risk', 'Check', 'Avoid'];
  if (item.type === 'stat') return ['Number', 'Proof', 'Impact'];
  const fallback = topicFallbackItems(item);
  return (supportItems.length ? supportItems : fallback)
    .map((value) => shortMaterialText(value, 2))
    .filter(Boolean)
    .slice(0, 3);
}

const WaveformMini = ({frame}: {frame: number}) => (
  <div className="visual-waveform">
    {Array.from({length: 18}, (_, index) => (
      <div
        className="wave-bar"
        key={index}
        style={{height: `${28 + (Math.sin(frame / 4 + index * 0.86) + 1) * 36}%`}}
      />
    ))}
  </div>
);

const PrimaryVisualCard = ({
  item,
  localFrame,
  statToken,
  supportItems,
}: {
  item: ContinuousOverlayItem;
  localFrame: number;
  statToken: string;
  supportItems: string[];
}) => {
  const visual = item.primaryVisual || {};
  const type = visual.type || 'icon';
  const label = limitWords(visual.label || item.label || labelForOverlay(item), 4, 48);
  const value = limitWords(
    type === 'chart' && statToken ? statToken : visual.prompt || item.visual || item.text,
    type === 'document' || type === 'mockup' ? 5 : 4,
    72,
  );
  const assetSrc = resolveMediaSrc(visual.assetId);

  if (type === 'none' || type === 'uploadedMedia') return null;

  if (type === 'image' && assetSrc) {
    return (
      <div className="primary-card" style={primaryVisualStyle(item, localFrame)}>
        <Img
          src={assetSrc}
          style={{
            width: '100%',
            height: 170,
            objectFit: 'cover',
            borderRadius: 18,
          }}
        />
        <div className="visual-label">{label}</div>
      </div>
    );
  }

  if (type === 'waveform') {
    return (
      <div className="primary-card" style={primaryVisualStyle(item, localFrame)}>
        <WaveformMini frame={localFrame} />
        <div className="visual-label">{label}</div>
        <div className="visual-value">{value}</div>
      </div>
    );
  }

  if (type === 'chart') {
    const progress = clamp((localFrame - 18) / 28, 0, 1);
    return (
      <div className="primary-card" style={primaryVisualStyle(item, localFrame)}>
        <div className="visual-label">{label}</div>
        <div className="visual-value">{value}</div>
        <div className="mini-chart" style={{margin: '18px 0 0', height: 96}}>
          {[35, 62, 48, 78, 92].map((heightValue, index) => (
            <div
              className="chart-bar"
              key={`${heightValue}-${index}`}
              style={{
                height: `${heightValue * progress}%`,
                opacity: clamp((localFrame - 18 - index * 4) / 10, 0, 1),
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'document') {
    const items = (supportItems.length ? supportItems : splitSupportItems(item.body)).slice(0, 3);
    return (
      <div className="primary-card" style={primaryVisualStyle(item, localFrame)}>
        <div className="visual-icon-orb">{visualGlyph(type, item)}</div>
        <div className="visual-label">{label}</div>
        <div className="document-lines">
          {(items.length ? items : [value, item.text, item.body || 'Ready']).slice(0, 3).map((line, index) => (
            <div className="document-line" key={`${line}-${index}`} style={{opacity: clamp((localFrame - 18 - index * 5) / 12, 0, 1)}} />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'mockup') {
    return (
      <div className="primary-card" style={primaryVisualStyle(item, localFrame)}>
        <div className="mockup-frame">
          <div className="mockup-top">
            <span className="mockup-dot" />
            <span className="mockup-dot" />
            <span className="mockup-dot" />
          </div>
          <div className="document-lines">
            <div className="document-line" />
            <div className="document-line" />
            <div className="document-line" />
          </div>
        </div>
        <div className="visual-label">{label}</div>
        <div className="visual-value">{value}</div>
      </div>
    );
  }

  return (
    <div className="primary-card" style={primaryVisualStyle(item, localFrame)}>
      <div className="visual-icon-orb">{visualGlyph(type, item)}</div>
      <div className="visual-label">{label}</div>
      <div className="visual-value">{value}</div>
    </div>
  );
};

const SceneMaterial = ({
  durationFrames,
  item,
  localFrame,
  statToken,
  supportItems,
}: {
  durationFrames: number;
  item: ContinuousOverlayItem;
  localFrame: number;
  statToken: string;
  supportItems: string[];
}) => {
  const materialItems = getMaterialItems(item, supportItems);
  const materialDelay = clamp(durationFrames * 0.42, 24, 58);
  const chartProgress = clamp((localFrame - materialDelay - 8) / 24, 0, 1);
  const warningProgress = clamp((localFrame - materialDelay - 4) / 24, 0, 1);

  if (item.layout === 'statCard' || item.type === 'stat') {
    return (
      <div className="material-layer">
        <div className="material-row">
          {materialItems.map((label, index) => (
            <div className="material-tile" key={`${label}-${index}`} style={materialEntryStyle(localFrame, index, materialDelay)}>
              <div className="material-sheen" style={sheenStyle(localFrame - materialDelay + 16, index)} />
              <div className="material-icon">{index === 0 ? '₹' : index === 1 ? '+' : '↗'}</div>
              <div className="material-label">{index === 0 ? 'Primary' : index === 1 ? 'Support' : 'Upside'}</div>
              <div className="material-value">{index === 0 && statToken ? statToken : label}</div>
            </div>
          ))}
        </div>
        <div className="mini-chart">
          {[42, 58, 74, 66, 88].map((heightValue, index) => (
            <div
              className="chart-bar"
              key={heightValue + index}
              style={{
                height: `${heightValue * chartProgress}%`,
                opacity: clamp((localFrame - materialDelay - index * 4) / 12, 0, 1),
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (item.layout === 'checklist') {
    return (
      <div className="flow-diagram">
        {materialItems.map((label, index) => (
          <Fragment key={`${label}-${index}`}>
            <div className="flow-node" key={`${label}-node`} style={materialSlideStyle(localFrame, index, materialDelay)}>
              <span>{`Step ${index + 1}`}</span>
              {label}
            </div>
            {index < 2 ? (
              <div className="flow-arrow" key={`${label}-arrow`} style={{opacity: clamp((localFrame - materialDelay - index * 6) / 12, 0, 1)}}>
                →
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    );
  }

  if (item.layout === 'warningCard' || item.type === 'warning') {
    return (
      <div className="warning-meter">
        <div className="warning-meter-top">
          <span>Quality Guard</span>
          <span>Needs exact match</span>
        </div>
        <div className="warning-track">
          <div className="warning-fill" style={{width: `${76 * warningProgress}%`}} />
        </div>
      </div>
    );
  }

  if (item.layout === 'ctaCard' || item.type === 'cta') {
    return (
      <div className="cta-actions">
        {materialItems.map((label, index) => (
          <div className="cta-action" key={`${label}-${index}`} style={materialScaleStyle(localFrame, index, materialDelay)}>
            <span>{index === 0 ? '01' : index === 1 ? '02' : '03'}</span>
            {label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="material-layer">
      <div className="material-row">
        {materialItems.map((label, index) => (
          <div className="material-tile" key={`${label}-${index}`} style={materialEntryStyle(localFrame, index, materialDelay)}>
            <div className="material-sheen" style={sheenStyle(localFrame - materialDelay + 16, index)} />
            <div className="material-icon">{index + 1}</div>
            <div className="material-label">{index === 0 ? 'Focus' : index === 1 ? 'Proof' : 'Action'}</div>
            <div className="material-value">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OverlayScene = ({
  align,
  captionsEnabled,
  durationFrames,
  item,
  scriptSupportItems,
}: {
  align: 'left' | 'center';
  captionsEnabled: boolean;
  durationFrames: number;
  item: ContinuousOverlayItem;
  scriptSupportItems: string[];
}) => {
  const localFrame = useCurrentFrame();
  const textLayout = getTextLayout(item);
  const statToken = getDisplayStatToken(item, localFrame);
  const layoutClass = getOverlayClass(item);
  const supportItems = scriptSupportItems.length > 1 ? scriptSupportItems : splitSupportItems(item.body);
  const showSupport = !captionsEnabled && (item.layout === 'checklist' || item.type === 'point') && supportItems.length > 1;
  const hasPrimaryVisual = Boolean(item.primaryVisual?.type && item.primaryVisual.type !== 'none' && item.primaryVisual.type !== 'uploadedMedia');
  const showMaterial = !hasPrimaryVisual && (captionsEnabled || item.layout === 'statCard' || item.layout === 'checklist' || item.layout === 'warningCard' || item.layout === 'ctaCard' || Boolean(statToken));
  const showTypographyTitle = !captionsEnabled || item.type === 'stat' || item.type === 'cta';
  const showTypographyBody = !captionsEnabled;
  const sceneStyle = getSceneAnimationStyle(item, localFrame, durationFrames);
  const supportDelay = clamp(durationFrames * 0.32, 22, 48);
  const statBeat = statToken ? 1 + Math.sin(localFrame / 3) * 0.012 * clamp((localFrame - 18) / 10, 0, 1) : 1;
  const warningShake = item.type === 'warning' ? Math.sin(localFrame * 1.6) * 3 * clamp((localFrame - 16) / 8, 0, 1) : 0;

  if (captionsEnabled) {
    if (!shouldShowCaptionSupportPanel(item, statToken, supportItems)) return null;
    return (
      <div className={`overlay-scene ${layoutClass}${hasPrimaryVisual ? ' has-visual' : ''}`}>
        <ShadcnScenePanel item={item} localFrame={localFrame} statToken={statToken} supportItems={supportItems} />
      </div>
    );
  }

  return (
    <div className={`overlay-scene ${layoutClass}${hasPrimaryVisual ? ' has-visual' : ''}`} style={sceneStyle}>
      {item.visualRole === 'background' ? <div className="scene-atmosphere" /> : null}
      {item.visualRole === 'assetInsert' ? <div className="asset-insert">{item.primaryVisual?.label || labelForOverlay(item)}</div> : null}
      {hasPrimaryVisual ? (
        <div className="scene-primary-visual">
          <PrimaryVisualCard
            item={item}
            localFrame={localFrame}
            statToken={statToken}
            supportItems={supportItems}
          />
        </div>
      ) : null}
      <div className={`main-block ${align}`} style={{top: textLayout.blockTop}}>
        <div className={`type-pill ${item.type || ''}`}>{labelForOverlay(item)}</div>
        {statToken ? <div className="stat-number" style={{transform: `scale(${statBeat})`}}>{statToken}</div> : null}
        {showTypographyTitle ? (
          <h1 className="title" style={{fontSize: textLayout.titleSize, lineHeight: textLayout.titleLineHeight}}>
            <AnimatedTitle
              accentWord={item.accentWord}
              durationFrames={durationFrames}
              localFrame={localFrame}
              text={item.text || 'Story'}
              timedWords={item.words}
            />
          </h1>
        ) : null}
        {showTypographyBody && item.body && item.type !== 'warning' && item.type !== 'cta' ? (
          <div className="body" style={{fontSize: textLayout.bodySize}}>
            <AnimatedBody
              accentWord={item.accentWord}
              durationFrames={durationFrames}
              localFrame={localFrame}
              text={item.body}
              timedWords={item.words}
            />
          </div>
        ) : null}
        {showTypographyBody && item.type === 'warning' && item.body ? (
          <div className="warning-line" style={{transform: `translateX(${warningShake}px)`}}>
            <span className="warning-icon">!</span>
            <span>
              <AnimatedBody
                accentWord={item.accentWord}
                durationFrames={durationFrames}
                localFrame={localFrame}
                text={item.body}
                timedWords={item.words}
              />
            </span>
          </div>
        ) : null}
        {showTypographyBody && item.type === 'cta' && item.body ? (
          <div className="cta-card">
            <AnimatedBody
              accentWord={item.accentWord}
              durationFrames={durationFrames}
              localFrame={localFrame}
              text={item.body}
              timedWords={item.words}
            />
          </div>
        ) : null}
        {showSupport ? (
          <div className="support-row">
            {supportItems.slice(0, 4).map((supportItem, index) => (
              <div className="support-card" key={`${supportItem}-${index}`} style={materialSlideStyle(localFrame, index, supportDelay)}>
                <strong>{item.layout === 'checklist' ? '✓' : String(index + 1).padStart(2, '0')}</strong> {supportItem}
              </div>
            ))}
          </div>
        ) : null}
        {showMaterial ? (
          <SceneMaterial
            durationFrames={durationFrames}
            item={item}
            localFrame={localFrame}
            statToken={statToken}
            supportItems={supportItems}
          />
        ) : null}
        {item.visual ? <div className="visual-cue">{item.visual.replace(/[_-]+/g, ' ')}</div> : null}
      </div>
    </div>
  );
};

const ImageCollageReel = ({
  captions,
  frame,
  overlays,
  progress,
  props,
  time,
}: {
  captions: ContinuousCaptionItem[];
  frame: number;
  overlays: ContinuousOverlayItem[];
  progress: number;
  props: ReelProps;
  time: number;
}) => {
  const activeOverlay = getActiveItem(overlays, time) || overlays[0];
  const activeCaption = getActiveItem(captions, time);
  const topSrc = resolveMediaSrc(props.mediaSrc);
  const activeAsset = findActiveVisualAsset(props.assetTimeline, time);
  const captionLines = activeCaption?.text
    ? (activeCaption.lines?.length ? activeCaption.lines : breakSubtitleLines(activeCaption.text)).slice(0, 2)
    : breakSubtitleLines(activeOverlay?.text || props.topicTitle || 'Video Explainer').slice(0, 2);
  const subtitle = captionLines.join(' ');
  const subtitleWords = subtitle.split(/\s+/).filter(Boolean).slice(0, 11);
  const activeWordIndex = getActiveSubtitleWordIndex(activeCaption, time, subtitleWords.length);

  return (
    <AbsoluteFill className="collage-root">
      <div className="collage-soft-wash" />
      <div className="collage-top-frame">
        {topSrc && props.mediaType === 'video' ? (
          <OffthreadVideo
            className="collage-top-media"
            muted
            src={topSrc}
            startFrom={Math.max(0, Math.round((props.mediaTrimStartSeconds || 0) * fps))}
          />
        ) : topSrc ? (
          <Img className="collage-top-media" src={topSrc} />
        ) : (
          <div className="collage-fallback" />
        )}
        {topSrc ? (
          <div className="collage-video-progress">
            <div className="collage-video-progress-fill" style={{width: `${Math.max(4, progress * 100)}%`}} />
          </div>
        ) : null}
      </div>
      <div className="collage-band">
        <div className="collage-subtitle-words">
          {subtitleWords.map((word, index) => (
            <span
              className={`collage-subtitle-word ${index === activeWordIndex ? 'active' : index < activeWordIndex ? 'past' : ''}`}
              key={`${word}-${index}`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      <div className="collage-main">
        <KeywordFrame
          asset={activeAsset}
          frame={frame}
          overlay={activeOverlay}
          time={time}
        />
      </div>
    </AbsoluteFill>
  );
};

function findActiveVisualAsset(items: unknown, time: number) {
  if (!Array.isArray(items)) return null;
  const active = items.find((item) => {
    if (!item || typeof item !== 'object') return false;
    const record = item as Record<string, unknown>;
    const start = Math.max(0, Number(record.start) || 0);
    const end = Math.max(0, Number(record.end) || 0);
    const role = cleanText(record.role || '');
    const kind = cleanText(record.kind || '');
    const hasSrc = Boolean(cleanText(record.src || ''));
    return time >= start && time < end && kind !== 'background' && role !== 'background' && (hasSrc || kind === 'frame');
  }) as Record<string, unknown> | undefined;
  return active || null;
}

const KeywordFrame = ({
  asset,
  frame,
  overlay,
  time,
}: {
  asset: Record<string, unknown> | null;
  frame: number;
  overlay?: ContinuousOverlayItem;
  time: number;
}) => {
  const sceneStart = Math.max(0, Number(asset?.start) || overlay?.start || 0);
  const sceneEnd = Math.max(sceneStart + 0.1, Number(asset?.end) || overlay?.end || sceneStart + 6);
  const sceneDuration = Math.max(0.1, sceneEnd - sceneStart);
  const sceneProgress = clamp((time - sceneStart) / Math.max(0.1, sceneEnd - sceneStart), 0, 1);
  const beat = getSceneBeat(sceneStart, sceneEnd, time);
  // Stronger enter/exit so scene transitions are clearly visible
  const enterProgress = clamp(sceneProgress * sceneDuration * 3, 0, 1); // reaches 1 after ~0.33s
  const exitProgress = clamp((1 - sceneProgress) * sceneDuration * 3, 0, 1); // fades in last ~0.33s
  const visibility = Math.min(enterProgress, exitProgress);
  const enter = easeOutBack(enterProgress);
  const text = buildKeywordFrameText(asset, overlay);
  const category = cleanText(asset?.category || detectFrameCategory(overlay));
  const words = text.split(/\s+/).filter(Boolean).slice(0, 3);
  const frameType = cleanText(asset?.frameType || overlay?.frameType || selectLocalFrameType(category, overlay));
  const frameValue = cleanText(asset?.frameValue || overlay?.frameValue || extractLocalFrameValue(`${overlay?.text || ''} ${overlay?.body || ''}`));
  const frameLabel = cleanText(asset?.frameLabel || overlay?.frameLabel || labelForFrameCategory(category));
  const frameItems = getFrameItems(asset, overlay, frameType, text);

  return (
    <div className={`collage-keyword-frame ${category} ${frameType} beat-${beat.index}`}>
      <div
        className="keyword-frame-inner"
        style={{
          opacity: clamp(visibility, 0, 1),
          transform: `translateY(${(1 - enter) * 40}px) scale(${0.90 + enter * 0.10})`,
        }}
      >
        <div className="keyword-frame-kicker">{frameLabel || labelForFrameCategory(category)}</div>
        <RemotionFrameBody
          frameItems={frameItems}
          frameType={frameType}
          frameValue={frameValue}
          frame={frame}
          sceneDuration={sceneDuration}
          sceneProgress={sceneProgress}
          timedWords={overlay?.words}
          beatIndex={beat.index}
          beatProgress={beat.progress}
          words={words}
        />
      </div>
    </div>
  );
};

const MotionGraphicsOverlay = ({
  asset,
  frame,
  overlay,
  time,
}: {
  asset: Record<string, unknown> | null;
  frame: number;
  overlay?: ContinuousOverlayItem;
  time: number;
}) => {
  const sceneStart = Math.max(0, Number(asset?.start) || overlay?.start || 0);
  const sceneEnd = Math.max(sceneStart + 0.1, Number(asset?.end) || overlay?.end || sceneStart + 6);
  const sceneProgress = clamp((time - sceneStart) / Math.max(0.1, sceneEnd - sceneStart), 0, 1);
  const beat = getSceneBeat(sceneStart, sceneEnd, time);
  const source = `${asset?.title || ''} ${overlay?.text || ''} ${overlay?.body || ''} ${overlay?.visual || ''}`;
  const keyword = buildKeywordFrameText(asset, overlay);
  const value = cleanText((asset?.frameValue as string) || extractLocalFrameValue(source));
  const counter = buildAnimatedCounter(value, beat.progress);
  const badge = beat.index === 0 ? keyword : beat.index === 1 ? labelForOverlay(overlay) : beat.index === 2 ? 'WATCH THIS' : 'NEXT POINT';
  const style = {
    '--spot-x': `${44 + Math.sin(frame / 48) * 10}%`,
    '--spot-y': `${38 + Math.cos(frame / 52) * 8}%`,
    '--ring-scale': `${0.72 + easeOutBack(clamp((beat.progress - 0.05) * 1.2, 0, 1)) * 0.34}`,
    '--ring-opacity': `${beat.index === 0 || beat.index === 2 ? 0.82 * (1 - Math.abs(beat.progress - 0.55) * 1.2) : 0}`,
    '--arrow-x': `${-44 + beat.progress * 90}px`,
    '--arrow-opacity': `${beat.index === 2 ? 0.88 : 0}`,
    '--badge-y': `${beat.index === 1 ? 0 : -24}px`,
    '--badge-scale': `${beat.index === 1 ? 0.94 + easeOutBack(beat.progress) * 0.08 : 0.88}`,
    '--badge-opacity': `${beat.index === 1 ? 1 : 0}`,
    '--counter-y': `${beat.index === 3 || value ? 0 : 34}px`,
    '--counter-scale': `${0.92 + easeOutBack(beat.progress) * 0.08}`,
    '--counter-opacity': `${beat.index === 3 || value ? 0.94 : 0}`,
    '--progress-opacity': `${beat.index >= 2 ? 0.96 : 0.22}`,
    '--progress-width': `${Math.round(sceneProgress * 100)}%`,
  } as Record<string, string>;

  return (
    <div className="motion-graphics-layer" style={style}>
      <div className="mg-vignette" />
      <MotionParticles frame={frame} progress={sceneProgress} />
      <div className="mg-focus-ring" />
      <div className="mg-arrow" />
      <div className="mg-badge">{badge}</div>
      <div className="mg-counter">
        <strong>{counter || `${Math.round(sceneProgress * 100)}%`}</strong>
        <span>{value ? 'Count Up' : 'Scene Progress'}</span>
      </div>
      <div className="mg-progress"><div /></div>
    </div>
  );
};

const MotionParticles = ({frame, progress}: {frame: number; progress: number}) => {
  const particles = Array.from({length: 16}, (_, index) => {
    const angle = index * 0.85 + frame / 38;
    const radius = 24 + (index % 5) * 18 + progress * 34;
    const x = 10 + ((index * 23) % 80);
    const y = 8 + ((index * 37) % 84);
    const size = 5 + (index % 4) * 3;
    return {
      x: `${x}%`,
      y: `${y}%`,
      s: `${size}px`,
      dx: `${Math.cos(angle) * radius}px`,
      dy: `${Math.sin(angle) * radius}px`,
      opacity: `${0.18 + ((index % 5) / 5) * 0.5}`,
      scale: `${0.7 + Math.sin(frame / 16 + index) * 0.24}`,
    };
  });
  return (
    <>
      {particles.map((particle, index) => (
        <i
          className="mg-particle"
          key={index}
          style={{
            '--x': particle.x,
            '--y': particle.y,
            '--s': particle.s,
            '--dx': particle.dx,
            '--dy': particle.dy,
            '--po': particle.opacity,
            '--ps': particle.scale,
          } as Record<string, string>}
        />
      ))}
    </>
  );
};

const RemotionFrameBody = ({
  beatIndex,
  beatProgress,
  frame,
  frameItems,
  frameType,
  frameValue,
  sceneDuration,
  sceneProgress,
  timedWords,
  words,
}: {
  beatIndex: number;
  beatProgress: number;
  frame: number;
  frameItems: string[];
  frameType: string;
  frameValue: string;
  sceneDuration: number;
  sceneProgress: number;
  timedWords?: TimedWord[];
  words: string[];
}) => {
  const isNumberFrame = isNumberFrameType(frameType);
  const displayValue = frameValue
    ? buildAnimatedCounter(frameValue, clamp(sceneProgress * 1.2, 0, 1)) || frameValue
    : words.join(' ');
  if (isNumberFrame) {
    return (
      <div className="remotion-stat-frame">
        <div
          className="stat-value"
          style={{
            transform: `scale(${0.88 + easeOutBack(clamp(sceneProgress * 1.35, 0, 1)) * 0.12})`,
            filter: `blur(${(1 - clamp(sceneProgress * 1.5, 0, 1)) * 6}px)`,
            opacity: clamp(sceneProgress * 1.5, 0, 1),
          }}
        >
          {displayValue}
        </div>
        <div className="stat-label">{frameValue ? words.join(' ') : 'Key Number'}</div>
      </div>
    );
  }

  if (isGrowthFrameType(frameType)) {
    const lineStyle = {'--line-width': `${Math.round(clamp(sceneProgress * 1.15, 0, 1) * 100)}%`} as Record<string, string>;
    return (
      <div className="remotion-growth-frame">
        <div className="growth-value">{displayValue}</div>
        <div className="growth-chart">
          {[34, 48, 42, 68, 82].map((heightValue, index) => (
            <i
              key={index}
              style={{
                height: `${heightValue}%`,
                transform: `scaleY(${clamp(sceneProgress * 1.7 - index * 0.14, 0.08, 1)})`,
                transformOrigin: 'bottom',
                opacity: clamp(sceneProgress * 1.8 - index * 0.12, 0.18, 1),
              }}
            />
          ))}
          <div className="growth-line" style={lineStyle} />
        </div>
      </div>
    );
  }

  if (isComparisonFrameType(frameType)) {
    const sideEnter = clamp(sceneProgress * 1.35, 0, 1);
    return (
      <div className="remotion-compare-frame">
        <div style={{opacity: sideEnter, transform: `translateX(${(1 - sideEnter) * -90}px)`}}>{frameItems[0] || words[0] || 'Before'}</div>
        <strong>VS</strong>
        <div style={{opacity: sideEnter, transform: `translateX(${(1 - sideEnter) * 90}px)`}}>{frameItems[1] || words[1] || 'After'}</div>
      </div>
    );
  }

  if (isTimelineFrameType(frameType)) {
    const items = frameItems.slice(0, 4);
    return (
      <div className="remotion-timeline-frame">
        {items.map((item, index) => (
          <div
            className="timeline-step"
            key={`${item}-${index}`}
            style={scriptSyncedListItemStyle({
              items,
              index,
              sceneDuration,
              sceneProgress,
              timedWords,
              variablePrefix: 'step',
            })}
          >
            <span>{index + 1}</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    );
  }

  if (isListFrameType(frameType)) {
    const items = frameItems.slice(0, 5);
    return (
      <div className="remotion-checklist-frame">
        {items.map((item, index) => (
          <div
            className="check-row"
            key={`${item}-${index}`}
            style={scriptSyncedListItemStyle({
              items,
              index,
              sceneDuration,
              sceneProgress,
              timedWords,
              variablePrefix: 'check',
            })}
          >
            <span>{index + 1}</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    );
  }

  if (frameType === 'AlertCard') {
    return (
      <div className="remotion-alert-frame">
        <div className="alert-symbol">!</div>
        <div className="keyword-frame-words compact">
          {words.map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}
        </div>
      </div>
    );
  }

  if (frameType === 'QuoteCard') {
    return <div className="remotion-quote-frame">"{words.join(' ')}"</div>;
  }

  if (frameType === 'CTAFrame') {
    return (
      <div className="remotion-cta-frame">
        <div className="keyword-frame-words compact">
          {words.map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}
        </div>
        <div className="cta-pill">TAKE ACTION</div>
      </div>
    );
  }

  if (frameType === 'QuestionFrame') {
    return <div className="remotion-question-frame">{words.join(' ')}?</div>;
  }

  return (
    <div className="keyword-frame-words">
      {frameItems.length > 1 ? (
        // Cycle through frameItems per beat for reel-like content rotation
        frameItems.slice(0, 4).map((item, index) => {
          const isActive = beatIndex % frameItems.length === index;
          const itemEnter = isActive ? easeOutBack(clamp(beatProgress * 1.6, 0, 1)) : 0;
          const itemStyle = {
            '--word-y': `${isActive ? (1 - itemEnter) * 60 : -20}px`,
            '--word-scale': `${isActive ? 0.80 + itemEnter * 0.20 : 0.7}`,
            '--word-blur': `${isActive ? (1 - itemEnter) * 10 : 6}px`,
            '--word-opacity': `${isActive ? clamp(itemEnter, 0, 1) : 0}`,
            position: isActive ? 'relative' as const : 'absolute' as const,
          } as Record<string, string>;
          const displayWords = item.split(/\s+/).filter(Boolean).slice(0, 3);
          return displayWords.map((word, wIndex) => (
            <span key={`${word}-${index}-${wIndex}`} style={itemStyle}>
              {word}
            </span>
          ));
        }).flat()
      ) : (
        words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            style={kineticWordStyle(index, beatIndex, beatProgress, frame, sceneDuration)}
          >
            {word}
          </span>
        ))
      )}
    </div>
  );
};

function scriptSyncedListItemStyle({
  index,
  items,
  sceneDuration,
  sceneProgress,
  timedWords,
  variablePrefix,
}: {
  index: number;
  items: string[];
  sceneDuration: number;
  sceneProgress: number;
  timedWords?: TimedWord[];
  variablePrefix: 'check' | 'step';
}) {
  const timings = getScriptSyncedItemTimings(items, timedWords, sceneDuration);
  const currentTime = clamp(sceneProgress, 0, 1) * Math.max(0.1, sceneDuration);
  const timing = timings[index] || proportionalItemTiming(index, items.length, sceneDuration);
  const nextTiming = timings[index + 1];
  const nextStart = nextTiming ? nextTiming.start : sceneDuration;
  const revealWindow = Math.max(0.001, nextStart - timing.start);
  const revealProgress = clamp((currentTime - timing.start) / revealWindow, 0, 1);
  const eased = 1 - Math.pow(1 - revealProgress, 3);

  return {
    [`--${variablePrefix}-y`]: `${(1 - eased) * 34}px`,
    [`--${variablePrefix}-opacity`]: `${eased}`,
  } as Record<string, string>;
}

function getScriptSyncedItemTimings(items: string[], timedWords: TimedWord[] | undefined, sceneDuration: number) {
  const normalizedWords = (timedWords || [])
    .map((word) => ({
      ...word,
      token: normalizeTimingToken(word.word),
      start: clamp(Number(word.start) || 0, 0, sceneDuration),
      end: clamp(Number(word.end) || 0, 0, sceneDuration),
    }))
    .filter((word) => word.token && word.end >= word.start);

  const timings = items.map((item, index) => {
    const match = findItemTimingFromWords(item, normalizedWords);
    return match || proportionalItemTiming(index, items.length, sceneDuration);
  });

  return timings
    .map((timing, index) => ({
      start: clamp(timing.start, 0, sceneDuration),
      end: clamp(Math.max(timing.end, timing.start), 0, sceneDuration),
      index,
    }))
    .sort((a, b) => a.index - b.index);
}

function findItemTimingFromWords(
  item: string,
  words: Array<TimedWord & {token: string}>,
) {
  if (!words.length) return null;
  const itemTokens = item
    .split(/\s+/)
    .map(normalizeTimingToken)
    .filter((token) => token.length > 2)
    .slice(0, 4);
  if (!itemTokens.length) return null;

  let firstMatch: (TimedWord & {token: string}) | undefined;
  let lastMatch: (TimedWord & {token: string}) | undefined;
  let cursor = 0;
  for (const token of itemTokens) {
    const foundIndex = words.findIndex((word, index) => index >= cursor && (word.token === token || word.token.includes(token) || token.includes(word.token)));
    if (foundIndex < 0) continue;
    firstMatch ||= words[foundIndex];
    lastMatch = words[foundIndex];
    cursor = foundIndex + 1;
  }

  return firstMatch
    ? {start: firstMatch.start, end: lastMatch?.end || firstMatch.end}
    : null;
}

function proportionalItemTiming(index: number, itemCount: number, sceneDuration: number) {
  const count = Math.max(1, itemCount);
  const start = (index / count) * sceneDuration;
  const end = ((index + 1) / count) * sceneDuration;
  return {start, end};
}

function normalizeTimingToken(value: unknown) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9₹$%]+/g, '');
}

function buildKeywordFrameText(asset: Record<string, unknown> | null, overlay?: ContinuousOverlayItem) {
  const explicit = cleanText(asset?.kind) === 'frame' ? cleanText(asset?.frameText || asset?.title || '') : '';
  if (explicit && !/^(asset|selected asset)$/i.test(explicit)) return limitWords(explicit, 2, 32).toUpperCase();
  const planned = cleanText(overlay?.frameText);
  if (planned) return limitWords(planned, 2, 32).toUpperCase();
  const source = [
    overlay?.accentWord,
    overlay?.primaryVisual?.label,
    overlay?.visual,
    overlay?.text,
    overlay?.body,
  ].filter(Boolean).join(' ');
  const words = source
    .replace(/[^a-zA-Z0-9₹$% ]+/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 || /^[₹$%]?\d/.test(word))
    .filter((word) => !KEYWORD_FRAME_STOP_WORDS.has(word.toLowerCase()));
  const preferred = words.filter((word) => word.length > 5 || /[A-Z0-9₹$%]/.test(word[0] || ''));
  return ((preferred.length ? preferred : words).slice(0, 2).join(' ') || 'KEY POINT').toUpperCase();
}

function getSceneBeat(sceneStart: number, sceneEnd: number, time: number) {
  const duration = Math.max(0.1, sceneEnd - sceneStart);
  const beatSeconds = 1.45;
  const beatCount = Math.max(3, Math.ceil(duration / beatSeconds));
  const raw = clamp((time - sceneStart) / beatSeconds, 0, beatCount - 0.001);
  const index = Math.floor(raw);
  const progress = clamp(raw - index, 0, 1);
  return {index, progress, count: beatCount};
}

function kineticWordStyle(index: number, beatIndex: number, beatProgress: number, frame: number, sceneDuration: number) {
  const wordActive = beatIndex % 2 === index % 2;
  const pop = easeOutBack(clamp(beatProgress * 1.35 - index * 0.18, 0, 1));
  const breathe = Math.sin(frame / 18 + index) * 0.018;
  return {
    '--word-y': `${wordActive ? (1 - pop) * 48 : Math.sin(frame / 28 + index) * 8}px`,
    '--word-scale': `${wordActive ? 0.82 + pop * 0.22 + breathe : 0.96 + breathe}`,
    '--word-blur': `${wordActive ? (1 - pop) * 8 : 0}px`,
    '--word-opacity': `${wordActive ? clamp(pop + 0.12, 0, 1) : 0.82}`,
  } as Record<string, string>;
}

function buildAnimatedCounter(value: string, progress: number) {
  const match = value.match(/^(.*?)(\d[\d,]*)(.*)$/);
  if (!match) return '';
  const prefix = match[1].trim();
  const target = Number(match[2].replace(/,/g, ''));
  const suffix = match[3].trim();
  if (!Number.isFinite(target) || target <= 0) return value;
  const current = Math.round(target * easeInOutCubic(clamp(progress, 0, 1)));
  return `${prefix ? `${prefix} ` : ''}${formatCompactNumber(current)}${suffix ? ` ${suffix}` : ''}`.trim();
}

function formatCompactNumber(value: number) {
  if (value >= 10000000) return `${(value / 10000000).toFixed(value >= 100000000 ? 0 : 1)}Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(value >= 1000000 ? 0 : 1)}L`;
  if (value >= 1000) return value.toLocaleString('en-IN');
  return String(value);
}

function isNumberFrameType(frameType: string) {
  return [
    'StatisticCounter',
    'BigNumberReveal',
    'MoneyCounter',
    'SalaryCounter',
    'RevenueCounter',
    'PriceReveal',
    'PercentageMeter',
    'ScoreReveal',
    'RankReveal',
    'Countdown',
    'DeadlineTimer',
  ].includes(frameType);
}

function isGrowthFrameType(frameType: string) {
  return [
    'MoneyGrowthGraph',
    'ProfitMeter',
    'ROIChart',
    'StockCandleChart',
    'SavingsMeter',
    'RevenueGraph',
    'BudgetBreakdown',
    'ProgressCircle',
    'ProgressBar',
    'TrendLine',
  ].includes(frameType);
}

function isComparisonFrameType(frameType: string) {
  return [
    'ComparisonCard',
    'BeforeAfter',
    'ProsCons',
    'ChoiceSplit',
    'PlanComparison',
    'SalaryComparison',
    'FeatureComparison',
    'MythFact',
  ].includes(frameType);
}

function isTimelineFrameType(frameType: string) {
  return [
    'TimelineFrame',
    'RoadmapFrame',
    'ProcessFlow',
    'StepLadder',
    'ApplicationFlow',
    'ExamRoadmap',
    'CareerPath',
    'MilestonePath',
    'WorkflowChain',
    'DecisionTree',
  ].includes(frameType);
}

function isListFrameType(frameType: string) {
  return [
    'ChecklistFrame',
    'RankingList',
    'TopBenefits',
    'RequirementsList',
    'DocumentList',
    'MistakeList',
    'TipsList',
    'ActionList',
    'FeatureList',
    'DoDontList',
  ].includes(frameType);
}

function detectFrameCategory(overlay?: ContinuousOverlayItem) {
  const source = `${overlay?.visual || ''} ${overlay?.text || ''} ${overlay?.body || ''}`.toLowerCase();
  if (/\b(rupee|cash|bank|loan|salary|trading|stock|market|money|payment|income|finance)\b/.test(source)) return 'finance';
  if (/\b(exam|student|study|course|class|learning|admit|result|education)\b/.test(source)) return 'education';
  if (/\b(job|career|office|business|client|meeting|startup|work)\b/.test(source)) return 'career_business';
  if (/\b(ai|tech|app|software|automation|dashboard|data|coding)\b/.test(source)) return 'tech_ai';
  if (/\b(government|official|document|form|policy|notice|certificate)\b/.test(source)) return 'news_document';
  return 'general';
}

function labelForFrameCategory(category: string) {
  if (category === 'finance') return 'FINANCE';
  if (category === 'education' || category === 'government_exam') return 'LEARN';
  if (category === 'career_business') return 'CAREER';
  if (category === 'tech_ai') return 'TECH';
  if (category === 'news_document') return 'UPDATE';
  return 'KEY POINT';
}

function selectLocalFrameType(category: string, overlay?: ContinuousOverlayItem) {
  const source = `${overlay?.type || ''} ${overlay?.visual || ''} ${overlay?.text || ''} ${overlay?.body || ''}`.toLowerCase();
  if (/\b(subscribe)\b/.test(source)) return 'SubscribeCTA';
  if (/\b(save|bookmark)\b/.test(source)) return 'SaveCTA';
  if (/\b(comment|reply)\b/.test(source)) return 'CommentCTA';
  if (/\b(follow)\b/.test(source)) return 'FollowCTA';
  if (overlay?.type === 'cta' || /\b(share|download|try now|start now)\b/.test(source)) return 'CTAFrame';
  if (overlay?.type === 'warning' || /\b(warning|alert|risk|avoid|failed|danger)\b/.test(source)) return 'RedAlertCard';
  if (/\b(mistake|wrong|error)\b/.test(source)) return 'MistakeList';
  if (/\b(before|after)\b/.test(source)) return 'BeforeAfter';
  if (/\b(vs|versus|compare|comparison)\b/.test(source)) return /\bsalary\b/.test(source) ? 'SalaryComparison' : 'ComparisonCard';
  if (/\b(application|apply|approval)\b/.test(source)) return 'ApplicationFlow';
  if (/\b(step|process|timeline|roadmap|prelims|mains|interview|selection)\b/.test(source)) return /\b(exam|prelims|mains|interview)\b/.test(source) ? 'ExamRoadmap' : 'ProcessFlow';
  if (/\b(documents|certificate|id proof)\b/.test(source)) return 'DocumentList';
  if (/\b(requirements|eligibility)\b/.test(source)) return 'RequirementsList';
  if (/\b(top|benefits|checklist|points|tips|reasons)\b/.test(source)) return /\bbenefits\b/.test(source) ? 'TopBenefits' : 'ChecklistFrame';
  if (category === 'finance' && /[₹$]|\d|salary|growth|profit|trading|stock/.test(source)) {
    if (/\bsalary\b/.test(source)) return 'SalaryCounter';
    if (/\bprofit\b/.test(source)) return 'ProfitMeter';
    if (/\b(trading|stock|market|intraday)\b/.test(source)) return 'StockCandleChart';
    return /growth|profit|trading|stock/.test(source) ? 'MoneyGrowthGraph' : 'MoneyCounter';
  }
  if (category === 'education' || category === 'government_exam') return 'ChecklistFrame';
  if (overlay?.type === 'hook' && /\?|\b(why|how|what)\b/.test(source)) return 'QuestionFrame';
  return 'InfoCard';
}

function extractLocalFrameValue(value: string) {
  const match = value.match(/(?:₹|rs\.?|inr|\$)?\s?\d[\d,]*(?:\.\d+)?\s?(?:%|percent|crore|lakh|k|m|million|billion)?/i);
  return match?.[0]?.replace(/\s+/g, ' ').trim().toUpperCase() || '';
}

function getFrameItems(asset: Record<string, unknown> | null, overlay: ContinuousOverlayItem | undefined, frameType: string, fallbackText: string) {
  if (Array.isArray(asset?.frameItems)) {
    const items = asset.frameItems.map((item) => limitWords(item, 5, 56)).filter(Boolean).slice(0, 5);
    if (items.length) return items;
  }
  if (Array.isArray(overlay?.frameItems)) {
    const items = overlay.frameItems.map((item) => limitWords(item, 5, 56)).filter(Boolean).slice(0, 5);
    if (items.length) return items;
  }
  const source = `${overlay?.body || ''} ${overlay?.text || ''} ${overlay?.visual || ''}`
    .replace(/\b(create|vertical|portrait|image|scene|show|with|modern|indian|premium|explainer|bottom|layer)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const items = source
    .split(/(?:,|;|→|->|↓|\||\bthen\b|\bvs\b|\bversus\b)/i)
    .map((item) => limitWords(item.replace(/^\d+[\).\s-]*/, ''), 5, 56))
    .filter((item) => item.length > 2)
    .slice(0, frameType === 'ComparisonCard' ? 2 : frameType === 'TimelineFrame' ? 4 : 5);
  if (frameType === 'ComparisonCard' && items.length < 2) return ['Before', 'After'];
  if (frameType === 'TimelineFrame' && items.length < 3) return ['Start', fallbackText, 'Result'];
  if (frameType === 'ChecklistFrame' && items.length < 3) return ['Key Point', fallbackText, 'Action'];
  return items.length ? items : [fallbackText];
}

const KEYWORD_FRAME_STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'this',
  'that',
  'from',
  'into',
  'your',
  'video',
  'reel',
  'scene',
  'visual',
  'image',
  'show',
  'shows',
  'should',
  'must',
  'bottom',
  'layer',
  'indian',
  'modern',
  'clean',
  'context',
  'topic',
  'about',
  'people',
  'person',
]);

function findActiveVisualAssetSrc(items: unknown, time: number) {
  const active = findActiveVisualAsset(items, time);
  return active ? cleanText(active.src || '') : '';
}

function collageImageMotionStyle({
  activeAsset: _activeAsset,
  frame: _frame,
  item: _item,
  time: _time,
}: {
  activeAsset: Record<string, unknown> | null;
  frame: number;
  item?: ContinuousOverlayItem;
  time: number;
}) {
  return {
    opacity: 1,
    transform: 'none',
  };
}

function getActiveSubtitleWordIndex(caption: ContinuousCaptionItem | undefined, time: number, wordCount: number) {
  if (!caption || wordCount <= 0) return -1;
  const start = Math.max(0, Number(caption.start) || 0);
  const end = Math.max(start + 0.1, Number(caption.end) || start + 0.1);
  const progress = clamp((time - start) / Math.max(0.1, end - start), 0, 0.999);
  return Math.min(wordCount - 1, Math.max(0, Math.floor(progress * wordCount)));
}

function findBackgroundAssetSrc(items: unknown) {
  if (!Array.isArray(items)) return '';
  const background = items.find((item) => {
    if (!item || typeof item !== 'object') return false;
    const record = item as Record<string, unknown>;
    return record.role === 'background' || record.kind === 'background';
  }) as Record<string, unknown> | undefined;
  return cleanText(background?.src || '');
}

const LayoutV2Reel = ({
  captions,
  overlays,
  progress,
  props,
  time,
}: {
  captions: ContinuousCaptionItem[];
  overlays: ContinuousOverlayItem[];
  progress: number;
  props: ReelProps;
  time: number;
}) => {
  const activeCaption = getActiveItem(captions, time);
  const topSrc = resolveMediaSrc(props.mediaSrc);

  return (
    <AbsoluteFill className="v2-root">
      <div className="v2-top" style={{transform: 'none'}}>
        {topSrc && props.mediaType === 'video' ? (
          <OffthreadVideo
            muted
            src={topSrc}
            startFrom={Math.max(0, Math.round((props.mediaTrimStartSeconds || 0) * fps))}
            style={{width: '100%', height: '100%', objectFit: props.mediaFit === 'contain' ? 'contain' : 'cover'}}
          />
        ) : topSrc ? (
          <Img src={topSrc} style={{width: '100%', height: '100%', objectFit: props.mediaFit === 'contain' ? 'contain' : 'cover'}} />
        ) : null}
      </div>
      <div className="v2-stage">
        <div className="v2-band">{limitWords(props.topicTitle || overlays[0]?.text || 'Video Explainer', 9, 76)}</div>
        {overlays.map((item) => {
          const from = Math.max(0, Math.round(item.start * fps));
          const duration = Math.max(1, Math.round((item.end - item.start) * fps));
          return (
            <Sequence durationInFrames={duration} from={from} key={item.id || `${item.start}-${item.text}`}>
              <V2Scene item={item} />
            </Sequence>
          );
        })}
      </div>
      {activeCaption?.text ? (
        <div className="v2-caption">
          {breakSubtitleLines(activeCaption.text).slice(0, 2).map((line) => (
            <Fragment key={line}>{line}<br /></Fragment>
          ))}
        </div>
      ) : null}
      <div className="v2-progress"><div style={{width: `${progress * 100}%`}} /></div>
    </AbsoluteFill>
  );
};

const V2Scene = ({item}: {item: ContinuousOverlayItem}) => {
  const layoutType = item.layoutType || 'character_hero';
  const heroSrc = resolveMediaSrc(item.primaryVisual?.assetId);
  const mainText = cleanV2MainText(item);
  const subText = cleanText(item.body || item.primaryVisual?.label || '');
  const listItems = splitSupportItems(item.body).length > 1
    ? splitSupportItems(item.body)
    : splitIntoCompactItems(item.text, item.body);
  const heroWide = layoutType === 'document_card' || layoutType === 'phone_mockup' || layoutType === 'graph_layout' || layoutType === 'dashboard_card';

  return (
    <div className={`v2-scene v2-${layoutType} ${item.type === 'stat' ? 'v2-stat' : ''}`}>
      {heroSrc ? (
        <Img
          className={`v2-hero ${heroWide ? 'wide' : ''}`}
          src={heroSrc}
          style={{
            opacity: 1,
            transform: 'none',
          }}
        />
      ) : null}
      <div
        className="v2-copy"
        style={{
          opacity: 1,
          transform: 'none',
        }}
      >
        <div className="v2-kicker">{limitWords(item.label || labelForOverlay(item), 3, 28)}</div>
        <div className="v2-main">{mainText}</div>
        {renderV2LayoutDetails(layoutType, subText, listItems)}
      </div>
    </div>
  );
};

function renderV2LayoutDetails(
  layoutType: NonNullable<ContinuousOverlayItem['layoutType']>,
  subText: string,
  listItems: string[],
) {
  if (layoutType === 'checklist' || layoutType === 'feature_grid' || layoutType === 'ranking') {
    return (
      <div className="v2-list">
        {listItems.slice(0, layoutType === 'feature_grid' ? 4 : 5).map((item, index) => (
          <div className="v2-list-item" key={`${item}-${index}`}>
            {layoutType === 'ranking' ? `#${index + 1} ` : '✓ '}{limitWords(item, 7, 58)}
          </div>
        ))}
      </div>
    );
  }
  if (layoutType === 'step_process' || layoutType === 'timeline' || layoutType === 'roadmap') {
    return (
      <div className="v2-list">
        {listItems.slice(0, 3).map((item, index) => (
          <div className="v2-list-item" key={`${item}-${index}`}>
            {`Step ${index + 1}: ${limitWords(item, 6, 54)}`}
          </div>
        ))}
      </div>
    );
  }
  if (layoutType === 'progress_bar') {
    return (
      <>
        {subText ? <div className="v2-sub">{limitWords(subText, 7, 64)}</div> : null}
        <div className="v2-progress-track"><div className="v2-progress-fill" /></div>
      </>
    );
  }
  return subText ? <div className="v2-sub">{limitWords(subText, 7, 64)}</div> : null;
}

function cleanV2MainText(item: ContinuousOverlayItem) {
  const text = cleanText(item.text || '');
  if (item.layoutType === 'big_statistic' || item.layoutType === 'money_showcase') {
    const token = extractStatToken([item.text, item.body].filter(Boolean).join(' '));
    if (token) return token;
  }
  return limitWords(text, 4, 44) || 'Key Point';
}

function splitIntoCompactItems(text?: string, body?: string) {
  const source = cleanText(body || text || '');
  if (!source) return [];
  return source
    .split(/[;,.|/]+/)
    .map((item) => cleanText(item))
    .filter(Boolean)
    .slice(0, 5);
}

function repairOverlayTiming(overlays: ContinuousOverlayItem[], totalDuration: number): ContinuousOverlayItem[] {
  if (overlays.length <= 1 && totalDuration > 8) {
    // Single overlay covering entire duration — split into chunks
    return splitLongOverlays(overlays, totalDuration);
  }
  if (overlays.length < 2) return overlays;

  // Check if most overlays share the same start time (bad planning)
  const startsAtZero = overlays.filter((item) => item.start < 0.1).length;
  const allSameStart = startsAtZero >= Math.ceil(overlays.length * 0.7);
  if (allSameStart) {
    // Space overlays evenly across total duration
    const sliceDuration = totalDuration / overlays.length;
    return overlays.map((item, index) => ({
      ...item,
      start: index * sliceDuration,
      end: (index + 1) * sliceDuration,
    }));
  }

  // Check for overlapping
  let hasOverlap = false;
  for (let i = 1; i < overlays.length; i++) {
    if (overlays[i].start < overlays[i - 1].end - 0.1) {
      hasOverlap = true;
      break;
    }
  }
  if (hasOverlap) {
    const sliceDuration = totalDuration / overlays.length;
    return overlays.map((item, index) => ({
      ...item,
      start: index * sliceDuration,
      end: (index + 1) * sliceDuration,
    }));
  }

  // Even if timing is OK, split any overlay longer than 8s into sub-scenes
  return splitLongOverlays(overlays, totalDuration);
}

function splitLongOverlays(overlays: ContinuousOverlayItem[], totalDuration: number): ContinuousOverlayItem[] {
  const MAX_SCENE_SECONDS = 7;
  const result: ContinuousOverlayItem[] = [];

  for (const overlay of overlays) {
    const duration = overlay.end - overlay.start;
    if (duration <= MAX_SCENE_SECONDS) {
      result.push(overlay);
      continue;
    }
    // Split into sub-scenes of ~5-7 seconds
    const chunks = Math.ceil(duration / MAX_SCENE_SECONDS);
    const chunkDuration = duration / chunks;
    const bodyParts = (overlay.body || '').split(/[.|,;]+/).map((s) => s.trim()).filter(Boolean);
    const textParts = (overlay.text || '').split(/\s+/).filter(Boolean);

    for (let i = 0; i < chunks; i++) {
      const start = overlay.start + i * chunkDuration;
      const end = overlay.start + (i + 1) * chunkDuration;
      // Rotate text content across sub-scenes for visual variety
      const subText = i === 0
        ? overlay.text
        : bodyParts[i - 1]
          ? bodyParts[i - 1].slice(0, 70)
          : textParts.slice(i, i + 3).join(' ') || overlay.text;
      const subBody = bodyParts.slice(i * 2, i * 2 + 2).join(' | ') || overlay.body;
      const types: Array<ContinuousOverlayItem['type']> = ['hook', 'point', 'stat', 'point', 'cta'];

      result.push({
        ...overlay,
        id: `${overlay.id || 'overlay'}-${i}`,
        start,
        end,
        text: subText || overlay.text,
        body: subBody || overlay.body,
        type: i === 0 ? overlay.type : types[i % types.length],
        label: i === 0 ? overlay.label : `Point ${i + 1}`,
        animation: i % 2 === 0 ? 'slideUp' as ContinuousOverlayItem['animation'] : 'popIn' as ContinuousOverlayItem['animation'],
      });
    }
  }

  return result;
}

const VideoExplainer = (props: ReelProps) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const time = frame / fps;
  const rawOverlays = (props.overlayTimeline?.length ? props.overlayTimeline : defaultProps.overlayTimeline || [])
    .map(normalizeOverlay)
    .filter((item) => item.end > item.start && item.text);
  // Safety: if all overlays start at same time (bad planning), space them evenly
  const overlays = repairOverlayTiming(rawOverlays, durationInFrames / fps);
  const captions = (props.captions || [])
    .map(normalizeCaption)
    .filter((item) => item.end > item.start && item.text);
  const activeOverlay = getActiveItem(overlays, time) || overlays[0];
  const captionsEnabled = captions.length > 0;
  const progress = clamp(frame / Math.max(1, durationInFrames - 1), 0, 1);

  if (props.design === 'layoutV2') {
    return (
      <AbsoluteFill className="video-explainer-root">
        <style>{fontFaces}</style>
        <style>{stylesheet}</style>
        <BackgroundMusicLayer
          enabled={props.backgroundMusic}
          mood={props.backgroundMusicMood}
          src={props.backgroundMusicSrc}
          volume={props.backgroundMusicVolume}
        />
        <SourceAudioLayer
          mediaSrc={props.mediaSrc}
          mediaTrimStartSeconds={props.mediaTrimStartSeconds}
          mediaType={props.mediaType}
          volume={props.sourceAudioVolume}
        />
        <SoundCueLayer items={overlays} />
      <div
        className="video-explainer-flowchart-layer"
        style={{
          position: "absolute",
          left: 0,
          bottom: 40,
          width: 1080,
          height: 720,`n          zIndex: 30,`n          pointerEvents: "none",
        }}
      >
        <SimpleInfographicRenderer overlay={activeOverlay} visualPlan={props.visualPlan} time={time} />
      </div>
        <LayoutV2Reel
          captions={captions}
          overlays={overlays}
          progress={progress}
          props={props}
          time={time}
        />
      </AbsoluteFill>
    );
  }

  if (props.design === 'imageCollage') {
    return (
      <AbsoluteFill className="video-explainer-root">
        <style>{fontFaces}</style>
        <style>{stylesheet}</style>
        <BackgroundMusicLayer
          enabled={props.backgroundMusic}
          mood={props.backgroundMusicMood}
          src={props.backgroundMusicSrc}
          volume={props.backgroundMusicVolume}
        />
        <SourceAudioLayer
          mediaSrc={props.mediaSrc}
          mediaTrimStartSeconds={props.mediaTrimStartSeconds}
          mediaType={props.mediaType}
          volume={props.sourceAudioVolume}
        />
        <SoundCueLayer items={overlays} />
      <div
        className="video-explainer-flowchart-layer"
        style={{
          position: "absolute",
          left: 0,
          bottom: 40,
          width: 1080,
          height: 720,`n          zIndex: 30,`n          pointerEvents: "none",
        }}
      >
        <SimpleInfographicRenderer overlay={activeOverlay} visualPlan={props.visualPlan} time={time} />
      </div>
        <ImageCollageReel
          captions={captions}
          frame={frame}
          overlays={overlays}
          progress={progress}
          props={props}
          time={time}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill className="video-explainer-root">
      <style>{fontFaces}</style>
      <style>{stylesheet}</style>
      <style>{assetSequenceLayerStyles}</style>
      <BackgroundMusicLayer
        enabled={props.backgroundMusic}
        mood={props.backgroundMusicMood}
        src={props.backgroundMusicSrc}
        volume={props.backgroundMusicVolume}
      />
      <SourceAudioLayer
        mediaSrc={props.mediaSrc}
        mediaTrimStartSeconds={props.mediaTrimStartSeconds}
        mediaType={props.mediaType}
        volume={props.sourceAudioVolume}
      />
      <MediaFrame
        activeOverlay={activeOverlay}
        captionsEnabled={captionsEnabled}
        frame={frame}
        mediaFit={props.mediaFit}
        mediaSrc={props.mediaSrc}
        mediaTrimStartSeconds={props.mediaTrimStartSeconds}
        mediaType={props.mediaType}
        progress={progress}
        title={compactVideoTitle(props.topicTitle, activeOverlay?.text)}
        visualHint={activeOverlay?.visual || activeOverlay?.text}
      />
      <MidSubtitleLayer captions={captions} time={time} />
      <AssetSequenceLayer fps={fps} items={props.assetTimeline} />
      <SoundCueLayer items={overlays} />
      <div
        className="video-explainer-flowchart-layer"
        style={{
          position: "absolute",
          left: 0,
          bottom: 40,
          width: 1080,
          height: 720,`n          zIndex: 30,`n          pointerEvents: "none",
        }}
      >
        <SimpleInfographicRenderer overlay={activeOverlay} visualPlan={props.visualPlan} time={time} />
      </div>
      <div className="divider" style={{display: 'none'}} />
      <div className="content" style={{display: 'none'}}>
        <div className="content-inner">
          {overlays.map((item) => {
            const from = Math.max(0, Math.round(item.start * fps));
            const duration = Math.max(1, Math.round((item.end - item.start) * fps));
            const directSupportItems = splitSupportItems(item.body);
            const scriptSupportItems = directSupportItems.length > 1
              ? directSupportItems
              : getScriptDetailSupportItems(props.scriptDetails, item);
            return (
              <Sequence durationInFrames={duration} from={from} key={item.id || `${item.start}-${item.text}`}>
                <OverlayScene
                  align={item.align || 'center'}
                  captionsEnabled={captionsEnabled}
                  durationFrames={duration}
                  item={item}
                  scriptSupportItems={scriptSupportItems}
                />
              </Sequence>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const VideoExplainerComposition = () => (
  <Composition
    id={COMPOSITION_ID}
    component={VideoExplainer}
    fps={fps}
    width={width}
    height={height}
    defaultProps={defaultProps}
    calculateMetadata={({props}: {props: ReelProps}) => ({
      durationInFrames: Math.max(1, Math.round(getDurationSeconds(props) * fps)),
      props: {
        ...props,
        brand: props.brand || '',
        mediaType: props.mediaType || 'video',
        mediaFit: props.mediaFit || 'videoExplainer',
        design: props.design || 'imageCollage',
        backgroundMusic: props.backgroundMusic !== false,
        backgroundMusicMood: props.backgroundMusicMood || 'corporate',
        backgroundMusicVolume: props.backgroundMusicVolume ?? 0.028,
        sourceAudioVolume: props.sourceAudioVolume ?? 1.35,
        templateName: TEMPLATE_NAME as typeof TEMPLATE_NAME,
      },
    })}
  />
);














