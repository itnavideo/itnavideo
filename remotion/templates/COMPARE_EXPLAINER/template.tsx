import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  staticFile,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {PremiumAudioLayer, type PremiumSoundCue, type PremiumStyleLock} from '../../components/PremiumAudioLayer';
import {PremiumVisualTreatment, type PremiumVisualStyleLock} from '../../components/PremiumVisualTreatment';
import {resolveFont} from '../../utils/fonts';

// Self-hosted fonts (Lambda-safe). Titles/VS use a heavy display face; captions/handle a clean sans.
const DISPLAY_FONT = resolveFont('Anton');
const TEXT_FONT = resolveFont('Montserrat');

type CompareImageInput = string | {url?: string; src?: string; imageUrl?: string};

type CompareOverlay = {
  start?: number;
  end?: number;
  text?: string;
  body?: string;
  title?: string;
  stickerPose?: string;
  pose?: string;
};

type CompareCaption = {
  start?: number;
  end?: number;
  text?: string;
  lines?: string[];
};

type CompareProps = {
  audioUrl?: string;
  mediaUrl?: string;
  sourceAudioUrl?: string;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;

  comparisonImageUrls?: string[];
  comparisonImages?: CompareImageInput[];

  compareLeftTitle?: string;
  compareRightTitle?: string;
  leftTitle?: string;
  rightTitle?: string;

  creatorHandle?: string;
  // Visual theme + comparison tone + optional winner highlight
  themeId?: 'light' | 'dark' | 'bold' | string;
  tone?: 'versus' | 'goodBad' | string;
  winner?: 'left' | 'right' | 'none' | string;
  stickerStyle?: '2d' | 'cartoon' | 'explainer' | string;
  stickerScale?: number;
  stickerOffsetX?: number;
  stickerOffsetY?: number;

  overlayTimeline?: CompareOverlay[];
  captions?: CompareCaption[];
  transcriptSegments?: CompareCaption[];
  segments?: CompareCaption[];
  transcript?: string;
  sourceScript?: string;
  topicTitle?: string;
  premiumEditing?: boolean;
  styleLock?: PremiumStyleLock & PremiumVisualStyleLock;
  soundCues?: PremiumSoundCue[];
};

const STICKER_SETS = {
  '2d': {
    welcome: 'assets/stickman/2d-teacher/teacher-welcome.png',
    left: 'assets/stickman/2d-teacher/teacher-left.png',
    right: 'assets/stickman/2d-teacher/teacher-right.png',
    thinking: 'assets/stickman/2d-teacher/teacher-thinking.png',
    warning: 'assets/stickman/2d-teacher/teacher-warning.png',
    success: 'assets/stickman/2d-teacher/teacher-success.png',
  },
  cartoon: {
    welcome: 'assets/stickman/cartoon-teacher/teacher-answering.png',
    left: 'assets/stickman/cartoon-teacher/teacher-left.png',
    right: 'assets/stickman/cartoon-teacher/teacher-right.png',
    thinking: 'assets/stickman/cartoon-teacher/teacher-questioning.png',
    warning: 'assets/stickman/cartoon-teacher/teacher-questioning.png',
    success: 'assets/stickman/cartoon-teacher/teacher-success.png',
  },
  explainer: {
    welcome: 'assets/stickman/stickman-explainer/follow.png',
    left: 'assets/stickman/stickman-explainer/teacher-left.png',
    right: 'assets/stickman/stickman-explainer/teacher-right.png',
    thinking: 'assets/stickman/stickman-explainer/thinking-expression.png',
    warning: 'assets/stickman/stickman-explainer/confused-expression.png',
    success: 'assets/stickman/stickman-explainer/explaining-comparison.png',
    surprised: 'assets/stickman/stickman-explainer/confused-expression.png',
    explaining: 'assets/stickman/stickman-explainer/explaining-comparison.png',
    celebrating: 'assets/stickman/stickman-explainer/explaining-comparison.png',
    comparing: 'assets/stickman/stickman-explainer/explaining-comparison.png',
  },
  'girl-teacher': {
    welcome: 'assets/stickman/girl-teacher/teacher-welcome.png',
    left: 'assets/stickman/girl-teacher/teacher-left.png',
    right: 'assets/stickman/girl-teacher/teacher-right.png',
    thinking: 'assets/stickman/girl-teacher/teacher-thinking.png',
    warning: 'assets/stickman/girl-teacher/teacher-warning.png',
    success: 'assets/stickman/girl-teacher/teacher-success.png',
  },
  'girl-teacher-3d': {
    welcome: 'assets/stickman/girl-teacher-3d/teacher-welcome.png',
    left: 'assets/stickman/girl-teacher-3d/teacher-left.png',
    right: 'assets/stickman/girl-teacher-3d/teacher-right.png',
    thinking: 'assets/stickman/girl-teacher-3d/teacher-thinking.png',
    warning: 'assets/stickman/girl-teacher-3d/teacher-warning.png',
    success: 'assets/stickman/girl-teacher-3d/teacher-success.png',
    surprised: 'assets/stickman/girl-teacher-3d/teacher-surprised.png',
    explaining: 'assets/stickman/girl-teacher-3d/teacher-explaining.png',
    celebrating: 'assets/stickman/girl-teacher-3d/teacher-celebrating.png',
    comparing: 'assets/stickman/girl-teacher-3d/teacher-thinking.png',
  },
  'grandpa-teacher-3d': {
    welcome: 'assets/stickman/grandpa-teacher-3d/teacher-welcome.png',
    left: 'assets/stickman/grandpa-teacher-3d/teacher-left.png',
    right: 'assets/stickman/grandpa-teacher-3d/teacher-right.png',
    thinking: 'assets/stickman/grandpa-teacher-3d/teacher-thinking.png',
    warning: 'assets/stickman/grandpa-teacher-3d/teacher-warning.png',
    success: 'assets/stickman/grandpa-teacher-3d/teacher-success.png',
  },
  'young-presenter-3d': {
    welcome: 'assets/stickman/young-presenter-3d/teacher-welcome.png',
    left: 'assets/stickman/young-presenter-3d/teacher-left.png',
    right: 'assets/stickman/young-presenter-3d/teacher-right.png',
    thinking: 'assets/stickman/young-presenter-3d/teacher-thinking.png',
    warning: 'assets/stickman/young-presenter-3d/teacher-warning.png',
    success: 'assets/stickman/young-presenter-3d/teacher-success.png',
  },
  'teacher-2d-pro': {
    welcome: 'assets/stickman/teacher-2d-pro/teacher-welcome.png',
    left: 'assets/stickman/teacher-2d-pro/teacher-left.png',
    right: 'assets/stickman/teacher-2d-pro/teacher-right.png',
    thinking: 'assets/stickman/teacher-2d-pro/teacher-thinking.png',
    warning: 'assets/stickman/teacher-2d-pro/teacher-warning.png',
    success: 'assets/stickman/teacher-2d-pro/teacher-success.png',
  },
  'chibi-boy-3d': {
    welcome: 'assets/stickman/chibi-boy-3d/teacher-welcome.png',
    left: 'assets/stickman/chibi-boy-3d/teacher-left.png',
    right: 'assets/stickman/chibi-boy-3d/teacher-right.png',
    thinking: 'assets/stickman/chibi-boy-3d/teacher-thinking.png',
    warning: 'assets/stickman/chibi-boy-3d/teacher-warning.png',
    success: 'assets/stickman/chibi-boy-3d/teacher-success.png',
  },
  'corporate-woman-3d': {
    welcome: 'assets/stickman/corporate-woman-3d/teacher-welcome.png',
    left: 'assets/stickman/corporate-woman-3d/teacher-left.png',
    right: 'assets/stickman/corporate-woman-3d/teacher-right.png',
    thinking: 'assets/stickman/corporate-woman-3d/teacher-thinking.png',
    warning: 'assets/stickman/corporate-woman-3d/teacher-warning.png',
    success: 'assets/stickman/corporate-woman-3d/teacher-success.png',
  },
  'indian-teacher-woman': {
    welcome: 'assets/stickman/indian-teacher-woman/teacher-welcome.png',
    left: 'assets/stickman/indian-teacher-woman/teacher-left.png',
    right: 'assets/stickman/indian-teacher-woman/teacher-right.png',
    thinking: 'assets/stickman/indian-teacher-woman/teacher-thinking.png',
    warning: 'assets/stickman/indian-teacher-woman/teacher-warning.png',
    success: 'assets/stickman/indian-teacher-woman/teacher-success.png',
  },
  'doctor-3d-half': {
    welcome: 'assets/stickman/doctor-3d-half/teacher-welcome.png',
    left: 'assets/stickman/doctor-3d-half/teacher-left.png',
    right: 'assets/stickman/doctor-3d-half/teacher-right.png',
    thinking: 'assets/stickman/doctor-3d-half/teacher-thinking.png',
    warning: 'assets/stickman/doctor-3d-half/teacher-warning.png',
    success: 'assets/stickman/doctor-3d-half/teacher-success.png',
  },
  'banker-3d-half': {
    welcome: 'assets/stickman/banker-3d-half/teacher-welcome.png',
    left: 'assets/stickman/banker-3d-half/teacher-left.png',
    right: 'assets/stickman/banker-3d-half/teacher-right.png',
    thinking: 'assets/stickman/banker-3d-half/teacher-thinking.png',
    warning: 'assets/stickman/banker-3d-half/teacher-warning.png',
    success: 'assets/stickman/banker-3d-half/teacher-success.png',
  },
  'news-anchor-3d-half': {
    welcome: 'assets/stickman/news-anchor-3d-half/teacher-welcome.png',
    left: 'assets/stickman/news-anchor-3d-half/teacher-left.png',
    right: 'assets/stickman/news-anchor-3d-half/teacher-right.png',
    thinking: 'assets/stickman/news-anchor-3d-half/teacher-thinking.png',
    warning: 'assets/stickman/news-anchor-3d-half/teacher-warning.png',
    success: 'assets/stickman/news-anchor-3d-half/teacher-success.png',
  },
  'lawyer-girl-3d': {
    welcome: 'assets/stickman/lawyer-girl-3d/teacher-welcome.png',
    left: 'assets/stickman/lawyer-girl-3d/teacher-left.png',
    right: 'assets/stickman/lawyer-girl-3d/teacher-right.png',
    thinking: 'assets/stickman/lawyer-girl-3d/teacher-thinking.png',
    warning: 'assets/stickman/lawyer-girl-3d/teacher-warning.png',
    success: 'assets/stickman/lawyer-girl-3d/teacher-success.png',
  },
  'shia-moulana-3d': {
    welcome: 'assets/stickman/shia-moulana-3d/teacher-welcome.png',
    left: 'assets/stickman/shia-moulana-3d/teacher-left.png',
    right: 'assets/stickman/shia-moulana-3d/teacher-right.png',
    thinking: 'assets/stickman/shia-moulana-3d/teacher-thinking.png',
    warning: 'assets/stickman/shia-moulana-3d/teacher-warning.png',
    success: 'assets/stickman/shia-moulana-3d/teacher-success.png',
  },
} as const;

type StickerSet = Record<'welcome' | 'left' | 'right' | 'thinking' | 'warning' | 'success', string> & Partial<Record<'surprised' | 'explaining' | 'celebrating' | 'comparing', string>>;

// Sticker body type determines sizing in the render
type StickerBodyType = 'full_body' | 'half_body' | 'upper_body';

const STICKER_BODY_TYPE: Record<string, StickerBodyType> = {
  '2d': 'full_body',
  'cartoon': 'full_body',
  'explainer': 'full_body',
  'girl-teacher': 'full_body',
  'girl-teacher-3d': 'full_body',
  'grandpa-teacher-3d': 'half_body',
  'young-presenter-3d': 'full_body',
  'teacher-2d-pro': 'full_body',
  'chibi-boy-3d': 'full_body',
  'corporate-woman-3d': 'full_body',
  'indian-teacher-woman': 'full_body',
  'doctor-3d-half': 'half_body',
  'banker-3d-half': 'half_body',
  'news-anchor-3d-half': 'half_body',
  'lawyer-girl-3d': 'full_body',
  'shia-moulana-3d': 'full_body',
};

// Size config per body type — sized for strong mobile visibility in 1080x1920 reels
const STICKER_SIZE_CONFIG: Record<StickerBodyType, {width: number; maxHeight: number; scale: number}> = {
  full_body: {width: 720, maxHeight: 980, scale: 1.0},
  half_body: {width: 780, maxHeight: 860, scale: 1.08},
  upper_body: {width: 800, maxHeight: 720, scale: 1.12},
};

const COMPARE_LAYOUT = {
  handleTop: 50,
  titleTop: 112,
  titleHeight: 88,
  imageTop: 225,
  imageHeight: 430,
  captionTop: 720,
  captionHeight: 126,
  stickerTop: 870,
  stickerBottom: 34,
} as const;

// --- Visual themes (background + caption + handle styling) ---
type CompareTheme = {
  background: string;
  dots: [string, string];
  dotsOpacity: number;
  glow: string;
  handle: string;
  captionBg: string;
  captionText: string;
  captionBorder: string;
  bottomFade: string;
  boxBg: string;
  hookBg: string;
  hookText: string;
  hookSub: string;
};

const COMPARE_THEMES: Record<string, CompareTheme> = {
  light: {
    background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 30%, #f0f4ff 70%, #e8eeff 100%)',
    dots: ['#5B6FFF', '#9B82FF'],
    dotsOpacity: 0.03,
    glow: 'rgba(91,111,255,0.08)',
    handle: '#64748b',
    captionBg: 'rgba(255,255,255,0.92)',
    captionText: '#0f172a',
    captionBorder: 'rgba(61,82,255,0.15)',
    bottomFade: 'rgba(232,238,255,0.95)',
    boxBg: '#ffffff',
    hookBg: 'linear-gradient(160deg, #eef2ff 0%, #ffffff 55%, #e8eeff 100%)',
    hookText: '#0f172a',
    hookSub: '#475569',
  },
  dark: {
    background: 'linear-gradient(180deg, #0B1120 0%, #131C31 45%, #0B1120 100%)',
    dots: ['#3D52FF', '#7C5CFC'],
    dotsOpacity: 0.07,
    glow: 'rgba(124,92,252,0.14)',
    handle: '#64748b',
    captionBg: 'rgba(15,23,42,0.86)',
    captionText: '#f1f5f9',
    captionBorder: 'rgba(255,255,255,0.14)',
    bottomFade: 'rgba(8,12,22,0.96)',
    boxBg: '#0f172a',
    hookBg: 'linear-gradient(160deg, #0B1120 0%, #1E293B 60%, #0B1120 100%)',
    hookText: '#ffffff',
    hookSub: '#94a3b8',
  },
  bold: {
    background: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 48%, #4C1D95 100%)',
    dots: ['#A78BFA', '#F0ABFC'],
    dotsOpacity: 0.06,
    glow: 'rgba(167,139,250,0.18)',
    handle: '#c4b5fd',
    captionBg: 'rgba(255,255,255,0.95)',
    captionText: '#1E1B4B',
    captionBorder: 'rgba(167,139,250,0.4)',
    bottomFade: 'rgba(30,27,75,0.95)',
    boxBg: '#ffffff',
    hookBg: 'linear-gradient(160deg, #312E81 0%, #4C1D95 60%, #1E1B4B 100%)',
    hookText: '#ffffff',
    hookSub: '#ddd6fe',
  },
};

// --- Comparison tone (per-side accent colors) ---
type SideColor = {main: string; soft: string; glowPrefix: string; shadow: string};
const COMPARE_TONES: Record<string, {left: SideColor; right: SideColor}> = {
  // Neutral "A vs B" — both sides feel equal/positive
  versus: {
    left: {main: '#3D52FF', soft: '#5B6FFF', glowPrefix: 'rgba(61,82,255,', shadow: 'rgba(61,82,255,0.15)'},
    right: {main: '#7C5CFC', soft: '#9B82FF', glowPrefix: 'rgba(124,92,252,', shadow: 'rgba(124,92,252,0.15)'},
  },
  // Good vs bad — green (recommended) vs red (avoid)
  goodBad: {
    left: {main: '#16A34A', soft: '#22C55E', glowPrefix: 'rgba(22,163,74,', shadow: 'rgba(22,163,74,0.16)'},
    right: {main: '#DC2626', soft: '#F87171', glowPrefix: 'rgba(220,38,38,', shadow: 'rgba(220,38,38,0.16)'},
  },
};

const resolveTheme = (id?: string): CompareTheme => COMPARE_THEMES[String(id || 'light')] || COMPARE_THEMES.light;
const resolveTone = (id?: string) => COMPARE_TONES[String(id || 'versus')] || COMPARE_TONES.versus;

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const getTitleFontSize = (title: string) => title.length > 32 ? 28 : title.length > 24 ? 34 : title.length > 16 ? 39 : 44;

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

const pickImage = (input?: CompareImageInput) => {
  if (!input) return '';
  if (typeof input === 'string') return input;
  return input.url || input.src || input.imageUrl || '';
};

const cleanText = (value: string, max = 70) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
};

const getActiveOverlay = (items: CompareOverlay[] = [], frame: number, fps: number) => {
  const time = frame / fps;
  return items.find((item) => time >= Number(item.start || 0) && time <= Number(item.end || 999)) || items[0];
};

const getActiveCaption = (items: CompareCaption[] = [], frame: number, fps: number) => {
  const time = frame / fps;
  return items.find((item) => time >= Number(item.start || 0) && time <= Number(item.end || 999)) || items[0];
};


const makeShortSubtitle = (value: string) => {
  const words = cleanText(value, 78).split(/\s+/).filter(Boolean);

  if (words.length <= 5) return words.join(' ');

  const maxWords = 6;
  const selected = words.slice(0, 12);
  const first = selected.slice(0, maxWords).join(' ');
  const second = selected.slice(maxWords, maxWords * 2).join(' ');

  return second ? `${first}\n${second}` : first;
};


function cleanHinglishSubtitle(value: string) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\bkaaphee\b/gi, "kaafi")
    .replace(/\bkyaa\b/gi, "kya")
    .replace(/\bsavaal\b/gi, "sawaal")
    .replace(/\brahataa\b/gi, "rehta")
    .replace(/\brahata\b/gi, "rehta")
    .replace(/\bmen\b/gi, "mein")
    .replace(/\bmein mein\b/gi, "mein")
    .replace(/\blogon ke man mein\b/gi, "logon ke mann mein")
    .replace(/\bSir\b/g, "sir")
    .replace(/[\u0900-\u097F]/g, "");
}

const getCaptionText = (
  overlay: CompareOverlay | undefined,
  caption: CompareCaption | undefined,
) => {
  // Empty-safe: only render real transcript/overlay text. No placeholder filler
  // (avoids an odd Hinglish line appearing on English or silent sections).
  const captionText = caption?.text || caption?.lines?.join(' ') || overlay?.text || overlay?.body || overlay?.title || '';
  const cleaned = cleanHinglishSubtitle(makeShortSubtitle(captionText));
  return cleaned.trim();
};

const VisualBox = ({
  image,
  side,
  colors,
  boxBg,
  isActive = false,
}: {
  image: string;
  side: 'left' | 'right';
  colors: SideColor;
  boxBg: string;
  isActive?: boolean;
}) => {
  const src = resolveAsset(image);
  const frame = useCurrentFrame();
  // Subtle Ken Burns on images
  const imgZoom = 1 + Math.sin(frame / 120 + (side === 'right' ? 1.5 : 0)) * 0.015;
  // Active glow pulse when this side is being discussed
  const glowOpacity = isActive ? 0.15 + Math.sin(frame / 20) * 0.05 : 0;
  const activeScale = isActive ? 1.02 : 1;

  return (
    <div
      style={{
        position: 'relative',
        width: 488,
        height: COMPARE_LAYOUT.imageHeight,
        borderRadius: 20,
        border: `4px solid ${colors.main}`,
        background: boxBg,
        overflow: 'hidden',
        boxShadow: isActive
          ? `0 16px 40px ${colors.glowPrefix}0.3), 0 4px 12px rgba(0,0,0,0.1)`
          : `0 12px 32px ${colors.shadow}, 0 4px 12px rgba(0,0,0,0.08)`,
        transform: `scale(${activeScale})`,
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
    >
      {/* Blurred background fill */}
      <img
        src={src}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(16px)',
          opacity: 0.06,
          transform: 'scale(1.2)',
        }}
      />

      {/* Main image with Ken Burns */}
      <div
        style={{
          position: 'absolute',
          inset: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center center',
            transform: `scale(${imgZoom})`,
          }}
        />
      </div>

      {/* Corner badge */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          [side]: 12,
          width: 36,
          height: 36,
          borderRadius: 10,
          background: colors.main,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 800,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        {side === 'left' ? 'A' : 'B'}
      </div>

      {/* Bottom gradient accent */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
        borderRadius: '0 0 16px 16px',
        background: `linear-gradient(0deg, ${colors.glowPrefix}0.08) 0%, transparent 100%)`,
      }} />

      {/* Active glow overlay */}
      {isActive && (
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: 16,
          background: `radial-gradient(ellipse at center, ${colors.glowPrefix}${glowOpacity}) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
};


const STICKER_POSES = {
  welcome: 'sticker_welcome_intro_explainer',
  leftSideExplainer: 'sticker_pointing_left_side_explainer',
  rightSideExplainer: 'sticker_pointing_right_side_explainer',
  thinking: 'sticker_thinking_analysis_explainer',
  warning: 'sticker_warning_issue_explainer',
  success: 'sticker_success_conclusion_explainer',
  surprised: 'sticker_questioning_surprised_explainer',
  explaining: 'sticker_general_explaining_key_point',
  celebrating: 'sticker_happy_celebrating_outro',
  comparing: 'sticker_comparing_both_sides_explainer',
} as const;

type StickerPoseKey = typeof STICKER_POSES[keyof typeof STICKER_POSES];

const STICKER_POSE_ASSET_ALIASES: Record<string, keyof StickerSet> = {
  sticker_welcome: 'welcome',
  sticker_welcome_intro_explainer: 'welcome',
  sticker_left: 'left',
  sticker_right: 'right',
  left: 'left',
  right: 'right',
  sticker_pointing_left_side_explainer: 'left',
  sticker_pointing_right_side_explainer: 'right',
  welcome: 'welcome',
  sticker_thinking_analysis_explainer: 'thinking',
  thinking: 'thinking',
  sticker_warning_issue_explainer: 'warning',
  warning: 'warning',
  sticker_success_conclusion_explainer: 'success',
  success: 'success',
  sticker_questioning_surprised_explainer: 'surprised',
  surprised: 'thinking',
  sticker_general_explaining_key_point: 'explaining',
  explaining: 'success',
  sticker_happy_celebrating_outro: 'celebrating',
  celebrating: 'success',
  sticker_comparing_both_sides_explainer: 'comparing',
  comparing: 'thinking',
};

const CANONICAL_POSE_ALIASES: Record<string, StickerPoseKey> = {
  welcome: STICKER_POSES.welcome,
  sticker_welcome: STICKER_POSES.welcome,
  sticker_welcome_intro_explainer: STICKER_POSES.welcome,
  sticker_left: STICKER_POSES.leftSideExplainer,
  left: STICKER_POSES.leftSideExplainer,
  sticker_pointing_left_side_explainer: STICKER_POSES.leftSideExplainer,
  sticker_right: STICKER_POSES.rightSideExplainer,
  right: STICKER_POSES.rightSideExplainer,
  sticker_pointing_right_side_explainer: STICKER_POSES.rightSideExplainer,
  thinking: STICKER_POSES.thinking,
  sticker_thinking_analysis_explainer: STICKER_POSES.thinking,
  warning: STICKER_POSES.warning,
  sticker_warning_issue_explainer: STICKER_POSES.warning,
  success: STICKER_POSES.success,
  sticker_success_conclusion_explainer: STICKER_POSES.success,
  surprised: STICKER_POSES.surprised,
  sticker_questioning_surprised_explainer: STICKER_POSES.surprised,
  explaining: STICKER_POSES.explaining,
  sticker_general_explaining_key_point: STICKER_POSES.explaining,
  celebrating: STICKER_POSES.celebrating,
  sticker_happy_celebrating_outro: STICKER_POSES.celebrating,
  comparing: STICKER_POSES.comparing,
  sticker_comparing_both_sides_explainer: STICKER_POSES.comparing,
};

const normalizeStickerPoseId = (value?: string): StickerPoseKey | undefined => {
  const pose = String(value || '').trim().toLowerCase();
  if (!pose) return undefined;
  return CANONICAL_POSE_ALIASES[pose];
};

const resolveStickerAssetPose = (set: StickerSet, poseKey: StickerPoseKey): keyof StickerSet => {
  const setByKey = set as Record<string, string>;
  const exactAssetKey = STICKER_POSE_ASSET_ALIASES[poseKey];
  if (exactAssetKey && setByKey[exactAssetKey]) return exactAssetKey;

  // Fallback: map extended poses to basic poses that ALL sticker sets have
  const EXTENDED_TO_BASIC: Record<string, keyof StickerSet> = {
    explaining: 'success',      // explaining → success (confident pointing pose)
    celebrating: 'success',     // celebrating → success
    comparing: 'thinking',      // comparing → thinking (analytical pose)
    surprised: 'thinking',      // surprised → thinking
  };

  // Try the extended-to-basic fallback
  if (exactAssetKey && EXTENDED_TO_BASIC[exactAssetKey]) {
    const basicKey = EXTENDED_TO_BASIC[exactAssetKey];
    if (setByKey[basicKey]) return basicKey;
  }

  // Try legacy pose lookup
  const legacyPose = Object.entries(CANONICAL_POSE_ALIASES).find(([, canonical]) => canonical === poseKey)?.[0];
  if (legacyPose && setByKey[legacyPose]) return legacyPose as keyof StickerSet;

  // Final fallback based on pose intent
  if (poseKey.includes('left')) return 'left';
  if (poseKey.includes('right')) return 'right';
  if (poseKey.includes('warning') || poseKey.includes('issue')) return 'warning';
  if (poseKey.includes('success') || poseKey.includes('conclusion') || poseKey.includes('celebrating') || poseKey.includes('explaining')) return 'success';
  if (poseKey.includes('thinking') || poseKey.includes('comparing') || poseKey.includes('questioning')) return 'thinking';

  return 'welcome';
};

const normalizeForMatch = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s?]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const containsAny = (text: string, words: string[]) =>
  words.some((word) => {
    const clean = normalizeForMatch(word);
    return clean.length > 1 && text.includes(clean);
  });

/**
 * Intent-based sticker pose selection.
 *
 * The sticker acts as an active presenter who reacts to the script context.
 * Priority order (first match wins):
 *   1. Intro (first ~1.5s) → sticker_welcome_intro_explainer
 *   2. Outro (last ~2.8s) → sticker_happy_celebrating_outro
 *   3. Important rule / confidence keywords → sticker_general_explaining_key_point
 *   4. Warning / mistake keywords → sticker_warning_issue_explainer
 *   5. Question / confusion keywords → sticker_questioning_surprised_explainer or sticker_thinking_analysis_explainer
 *   6. Right-topic keywords → sticker_pointing_right_side_explainer
 *   7. Left-topic keywords → sticker_pointing_left_side_explainer
 *   8. Contextual fallback: alternate based on video progress (not rigid 3s)
 *
 * IMPORTANT: Keywords are chosen to be SPECIFIC enough that they don't trigger
 * on every caption. Common words like "kya", "difference", "compare" are avoided
 * as standalone triggers because they appear in nearly every Hinglish comparison.
 */
const getActiveStickerPose = ({
  currentTime,
  durationSeconds,
  overlay,
  caption,
  leftTitle,
  rightTitle,
}: {
  currentTime: number;
  durationSeconds: number;
  overlay?: CompareOverlay;
  caption?: CompareCaption;
  leftTitle: string;
  rightTitle: string;
}): StickerPoseKey => {
  const explicitPose = normalizeStickerPoseId(overlay?.stickerPose || overlay?.pose);
  if (explicitPose) return explicitPose;

  // Legacy jobs without a planned overlay still get a gentle intro/outro fallback.
  if (currentTime < 1.5) return STICKER_POSES.welcome;
  if (durationSeconds > 0 && currentTime >= Math.max(0, durationSeconds - 2.8)) return STICKER_POSES.celebrating;

  const text = normalizeForMatch(
    [
      overlay?.title,
      overlay?.text,
      overlay?.body,
      caption?.text,
      caption?.lines?.join(' '),
    ]
      .filter(Boolean)
      .join(' '),
  );

  const left = normalizeForMatch(leftTitle);
  const right = normalizeForMatch(rightTitle);

  // --- Intent keyword groups ---
  // RULE: Only use phrases/words that are SPECIFIC enough to indicate intent.
  // Avoid single common words that appear in every Hinglish comparison sentence.

  // Question/confusion: ONLY trigger on actual question patterns, not generic compare words
  const questionPhrases = [
    'what is the difference',
    'difference kya hai',
    'kya difference hai',
    'kya farq hai',
    'farq kya hai',
    'which is better',
    'kaunsa better hai',
    'kaunsa behtar',
    'konsa sahi hai',
    'which one should',
    'confused about',
    'socho zara',
    'think about it',
    'let me ask',
    'sawaal ye hai',
    'doubt hai',
    'samajh nahi aata',
    'confusing hai',
    'pata nahi',
    'how do we know',
    'kaise pata kare',
  ];

  // Left-side topic: the actual left title + contextual "first/pehla" phrases
  const leftPhrases = [
    left,
    `${left} ka matlab`,
    `${left} means`,
    `${left} hai`,
    'pehla option',
    'pehle wala',
    'first option',
    'first word',
    'first meaning',
    'iska matlab',
    'ye word',
    'yeh word',
    'this word means',
    'left side',
    'option a',
  ];

  // Right-side topic: the actual right title + contextual "second/dusra" phrases
  const rightPhrases = [
    right,
    `${right} ka matlab`,
    `${right} means`,
    `${right} hai`,
    'dusra option',
    'doosra wala',
    'second option',
    'second word',
    'second meaning',
    'uska matlab',
    'wo word',
    'woh word',
    'that word means',
    'right side',
    'option b',
    'on the other hand',
    'jabki ye',
    'lekin ye',
    'whereas this',
  ];

  // Warning/mistake: only specific warning language
  const warningPhrases = [
    'galat hai',
    'wrong answer',
    'wrong use',
    'mat karo',
    'avoid karo',
    'kabhi mat',
    'never use',
    'common mistake',
    'log galti',
    'ye galti',
    'careful here',
    'savdhan',
    'khabardar',
    'beware of',
    'warning',
    'danger',
    'scam',
    'fraud',
    'nuksan',
    'dhoka',
    'trap hai',
  ];

  // Success/conclusion: specific conclusion language
  const successPhrases = [
    'final answer',
    'sahi answer',
    'correct answer',
    'conclusion',
    'to sum up',
    'in short',
    'so basically',
    'toh basically',
    'yaad rakho',
    'remember this',
    'important rule',
    'rule hai ki',
    'simple rule',
    'easy trick',
    'asaan tarika',
    'shortcut hai',
    'ab samjh gaye',
    'clear hai na',
    'got it',
    'samajh gaye',
    'that is the answer',
    'yahi answer hai',
    'benefit hai',
    'profit hai',
    'winner hai',
    'best hai',
    'done',
    'thumbs up',
  ];

  // --- Priority-based intent matching ---

  // Has a question mark? Strong signal for surprised or thinking
  if (text.includes('?')) return STICKER_POSES.surprised;

  // Important rule / confident explanation → explaining (sticker points up with authority)
  if (containsAny(text, successPhrases)) return STICKER_POSES.explaining;

  // Warning / mistake → alert pose
  if (containsAny(text, warningPhrases)) return STICKER_POSES.warning;

  // Question / confusion → thinking pose (only specific question phrases)
  if (containsAny(text, questionPhrases)) return STICKER_POSES.thinking;

  // If BOTH titles appear in the same caption, it's likely an intro/comparison statement
  // → use comparing (hands weighing both options)
  const hasLeft = left.length > 1 && text.includes(left);
  const hasRight = right.length > 1 && text.includes(right);
  if (hasLeft && hasRight) return STICKER_POSES.comparing;

  // Talking about right-side topic → sticker points to the right-side comparison item.
  if (right.length > 1 && containsAny(text, rightPhrases)) return STICKER_POSES.rightSideExplainer;

  // Talking about left-side topic → sticker points to the left-side comparison item.
  if (left.length > 1 && containsAny(text, leftPhrases)) return STICKER_POSES.leftSideExplainer;

  // --- Smart contextual fallback ---
  // When no keywords match, use video progress zones to create a natural
  // presenter arc that follows the typical compare video structure:
  //   intro → explain left → compare → explain right → conclusion
  const progress = durationSeconds > 0 ? currentTime / durationSeconds : 0.5;

  if (progress < 0.12) {
    // Early section: intro zone → welcome
    return STICKER_POSES.welcome;
  } else if (progress < 0.28) {
    return STICKER_POSES.leftSideExplainer;
  } else if (progress < 0.55) {
    return STICKER_POSES.comparing;
  } else if (progress < 0.78) {
    return STICKER_POSES.rightSideExplainer;
  } else {
    return STICKER_POSES.success;
  }
};

const StickerPresenter = ({
  overlay,
  caption,
  leftTitle,
  rightTitle,
  stickerStyle,
  stickerScale = 1,
  stickerOffsetX = 0,
  stickerOffsetY = 0,
}: {
  overlay?: CompareOverlay;
  caption?: CompareCaption;
  leftTitle: string;
  rightTitle: string;
  stickerStyle?: string;
  stickerScale?: number;
  stickerOffsetX?: number;
  stickerOffsetY?: number;
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const selectedStickerStyle =
    (stickerStyle && stickerStyle in STICKER_SETS) ? stickerStyle as keyof typeof STICKER_SETS : 'explainer';

  const set: StickerSet = STICKER_SETS[selectedStickerStyle];

  const currentTime = frame / fps;
  const durationSeconds = durationInFrames / fps;

  const poseKey = getActiveStickerPose({
    currentTime,
    durationSeconds,
    overlay,
    caption,
    leftTitle,
    rightTitle,
  });

  // Bounce animation: detect pose transitions using time-based sampling.
  // Check the pose at a slightly earlier time to see if it differs from current.
  const checkBehindTime = Math.max(0, currentTime - 0.4);
  const prevPoseKey = getActiveStickerPose({
    currentTime: checkBehindTime,
    durationSeconds,
    overlay,
    caption,
    leftTitle,
    rightTitle,
  });

  // If pose just changed (current differs from 0.4s ago), trigger bounce
  const poseJustChanged = poseKey !== prevPoseKey;
  // Calculate how many frames into this pose segment we are
  // Use a simple spring from frame 0 when pose changes
  const poseDurationFrames = poseJustChanged ? Math.min(frame, 12) : 99;
  const poseBounce = poseDurationFrames < 12
    ? spring({frame: poseDurationFrames, fps, config: {damping: 7, mass: 0.4, stiffness: 180}})
    : 1;

  const resolvedPoseKey = resolveStickerAssetPose(set, poseKey);
  const src = (set as Record<string, string>)[resolvedPoseKey] || set.welcome;

  // Size based on sticker body type
  const bodyType = STICKER_BODY_TYPE[selectedStickerStyle] || 'full_body';
  const sizeConfig = STICKER_SIZE_CONFIG[bodyType];

  // Presenter remains centered in one lower-safe zone; direction is carried by the selected pose art.
  const STICKER_WIDTH = sizeConfig.width;
  const STICKER_MAX_HEIGHT = sizeConfig.maxHeight;
  const safeStickerScale = clampNumber(Number(stickerScale) || 1, 0.72, 1.15);
  const safeStickerOffsetX = clampNumber(Number(stickerOffsetX) || 0, -110, 110);
  const safeStickerOffsetY = clampNumber(Number(stickerOffsetY) || 0, -36, 46);

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Entrance: smooth spring scale-up
  const pop = interpolate(frame, [0, 8, 18, 28], [0.7, 1.05, 0.98, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Idle breathing — subtle but visible life pulse
  const breathCycle = frame / 45; // ~1.5s cycle at 30fps
  const idleY = Math.sin(breathCycle) * 6;
  const breathScale = 1 + Math.sin(breathCycle) * 0.012; // subtle 1.2% scale pulse

  // Gentle head tilt — makes character feel expressive
  const rotate = Math.sin(frame / 70) * 0.6;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: COMPARE_LAYOUT.stickerTop,
        bottom: COMPARE_LAYOUT.stickerBottom,
        overflow: 'hidden',
        zIndex: 3,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 10,
        pointerEvents: 'none',
      }}
    >
      <img
        src={staticFile(src)}
        style={{
          width: STICKER_WIDTH,
          maxWidth: '80%',
          maxHeight: STICKER_MAX_HEIGHT,
          height: 'auto',
          objectFit: 'contain',
          opacity: enterOpacity,
          transform: `translate(${safeStickerOffsetX}px, ${safeStickerOffsetY + idleY}px) rotate(${rotate}deg) scale(${pop * breathScale * sizeConfig.scale * poseBounce * safeStickerScale})`,
          transformOrigin: 'center bottom',
          filter: 'drop-shadow(0 24px 32px rgba(0,0,0,0.28))',
          transition: 'filter 0.3s',
        }}
      />
    </div>
  );
};
// Small crown badge that sits above the winning title pill.
const WinnerCrown = ({side}: {side: 'left' | 'right'}) => (
  <div
    style={{
      position: 'absolute',
      top: -34,
      [side === 'left' ? 'right' : 'left']: 16,
      fontSize: 30,
      lineHeight: 1,
      filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))',
      transform: `rotate(${side === 'left' ? 12 : -12}deg)`,
    }}
  >
    👑
  </div>
);

// Full-screen opening hook. Shows the topic (or "A vs B") to stop the scroll.
const HookCard = ({
  leftTitle,
  rightTitle,
  topic,
  theme,
  leftColor,
  rightColor,
  opacity,
}: {
  leftTitle: string;
  rightTitle: string;
  topic: string;
  theme: CompareTheme;
  leftColor: SideColor;
  rightColor: SideColor;
  opacity: number;
}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: 30, config: {damping: 12, mass: 0.4, stiffness: 150}, from: 0.86, to: 1});
  return (
    <AbsoluteFill
      style={{
        background: theme.hookBg,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        padding: 80,
        textAlign: 'center',
        transform: `scale(${pop})`,
      }}
    >
      <div style={{fontFamily: TEXT_FONT, fontSize: 30, fontWeight: 800, letterSpacing: 6, textTransform: 'uppercase', color: theme.hookSub, marginBottom: 26}}>
        Comparison
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center'}}>
        <div style={{fontFamily: DISPLAY_FONT, fontSize: 96, lineHeight: 0.98, textTransform: 'uppercase', color: leftColor.main, letterSpacing: -2}}>
          {leftTitle}
        </div>
        <div style={{fontFamily: DISPLAY_FONT, fontSize: 52, color: '#FF7A2F', letterSpacing: 2}}>VS</div>
        <div style={{fontFamily: DISPLAY_FONT, fontSize: 96, lineHeight: 0.98, textTransform: 'uppercase', color: rightColor.main, letterSpacing: -2}}>
          {rightTitle}
        </div>
      </div>
      {topic ? (
        <div style={{fontFamily: TEXT_FONT, fontSize: 34, fontWeight: 700, color: theme.hookText, marginTop: 40, maxWidth: 820, lineHeight: 1.2}}>
          {topic}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Full-screen closing card. Announces the winner (if set) and the follow CTA.
const ClosingCard = ({
  leftTitle,
  rightTitle,
  winner,
  handle,
  theme,
  leftColor,
  rightColor,
  opacity,
}: {
  leftTitle: string;
  rightTitle: string;
  winner: 'left' | 'right' | 'none';
  handle: string;
  theme: CompareTheme;
  leftColor: SideColor;
  rightColor: SideColor;
  opacity: number;
}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: 30, config: {damping: 13, mass: 0.4, stiffness: 150}, from: 0.9, to: 1});
  const winnerTitle = winner === 'left' ? leftTitle : winner === 'right' ? rightTitle : '';
  const winnerColor = winner === 'right' ? rightColor : leftColor;
  return (
    <AbsoluteFill
      style={{
        background: theme.hookBg,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        padding: 80,
        textAlign: 'center',
        transform: `scale(${pop})`,
      }}
    >
      {winner !== 'none' ? (
        <>
          <div style={{fontSize: 70, marginBottom: 8}}>👑</div>
          <div style={{fontFamily: TEXT_FONT, fontSize: 30, fontWeight: 800, letterSpacing: 6, textTransform: 'uppercase', color: theme.hookSub, marginBottom: 18}}>
            Winner
          </div>
          <div style={{fontFamily: DISPLAY_FONT, fontSize: 104, lineHeight: 0.98, textTransform: 'uppercase', color: winnerColor.main, letterSpacing: -2}}>
            {winnerTitle}
          </div>
        </>
      ) : (
        <>
          <div style={{fontFamily: TEXT_FONT, fontSize: 30, fontWeight: 800, letterSpacing: 6, textTransform: 'uppercase', color: theme.hookSub, marginBottom: 18}}>
            Which one wins?
          </div>
          <div style={{fontFamily: DISPLAY_FONT, fontSize: 78, lineHeight: 1.02, textTransform: 'uppercase', color: theme.hookText, letterSpacing: -1.5}}>
            <span style={{color: leftColor.main}}>{leftTitle}</span>
            <span style={{color: '#FF7A2F', margin: '0 18px'}}>vs</span>
            <span style={{color: rightColor.main}}>{rightTitle}</span>
          </div>
        </>
      )}
      <div
        style={{
          marginTop: 52,
          fontFamily: TEXT_FONT,
          fontSize: 40,
          fontWeight: 800,
          color: '#ffffff',
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F00 100%)',
          padding: '16px 40px',
          borderRadius: 999,
          boxShadow: '0 10px 30px rgba(255,107,53,0.35)',
        }}
      >
        Follow {handle}
      </div>
    </AbsoluteFill>
  );
};

export const CompareExplainer = (props: CompareProps) => {
  const frame = useCurrentFrame();
  const fps = 30;

  const uploadedImages = props.comparisonImageUrls?.length
    ? props.comparisonImageUrls
    : (props.comparisonImages || []).map(pickImage).filter(Boolean);

  const leftImage = uploadedImages[0] || 'assets/compare/debit-card.jpg';
  const rightImage = uploadedImages[1] || 'assets/compare/credit-card.avif';

  const leftTitle = cleanText(props.compareLeftTitle || props.leftTitle || 'Left', 40);
  const rightTitle = cleanText(props.compareRightTitle || props.rightTitle || 'Right', 40);
  const leftTitleFontSize = getTitleFontSize(leftTitle);
  const rightTitleFontSize = getTitleFontSize(rightTitle);

  // Theme + tone + optional winner
  const theme = resolveTheme(props.themeId);
  const tone = resolveTone(props.tone);
  const leftColor = tone.left;
  const rightColor = tone.right;
  const winner: 'left' | 'right' | 'none' =
    props.winner === 'left' || props.winner === 'right' ? props.winner : 'none';

  const audioUrl = props.audioUrl || props.mediaUrl || props.sourceAudioUrl || '';
  const activeOverlay = getActiveOverlay(props.overlayTimeline || [], frame, fps);
  const activeCaption = getActiveCaption(props.captions || props.transcriptSegments || props.segments || [], frame, fps);

  const caption = getCaptionText(activeOverlay, activeCaption);

  // Determine which image is "active" (being discussed) based on sticker pose
  const currentTime = frame / fps;
  const durationSeconds = Number(props.durationSeconds || props.sourceDurationSeconds || props.renderWindowSeconds || 45);

  // Opening hook card (first ~1.85s) and closing CTA card (last ~2.6s)
  const totalFrames = Math.max(1, Math.round(durationSeconds * fps));
  const hookText = cleanText(props.topicTitle || '', 46);
  const showHook = frame < 56;
  const hookOpacity = interpolate(frame, [0, 8, 44, 55], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const closingStart = Math.max(totalFrames - 78, Math.round(totalFrames * 0.72));
  const showClosing = frame >= closingStart;
  const closingOpacity = interpolate(frame, [closingStart, closingStart + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const currentPose = getActiveStickerPose({
    currentTime,
    durationSeconds,
    overlay: activeOverlay,
    caption: activeCaption,
    leftTitle,
    rightTitle,
  });
  const leftActive = currentPose === STICKER_POSES.leftSideExplainer;
  const rightActive = currentPose === STICKER_POSES.rightSideExplainer;

  const captionScale = spring({
    frame: frame % 90, // reset spring every ~3s for each new caption
    fps: 30,
    config: {damping: 12, mass: 0.35, stiffness: 140},
    from: 0.92,
    to: 1,
  });

  // Entry animations for title labels
  const leftLabelEntry = spring({frame, fps: 30, config: {damping: 13, mass: 0.4, stiffness: 130}, from: -1, to: 0});
  const rightLabelEntry = spring({frame: Math.max(0, frame - 4), fps: 30, config: {damping: 13, mass: 0.4, stiffness: 130}, from: 1, to: 0});

  // Image box slide-in
  const leftImageEntry = spring({frame: Math.max(0, frame - 8), fps: 30, config: {damping: 14, mass: 0.4, stiffness: 120}});
  const rightImageEntry = spring({frame: Math.max(0, frame - 12), fps: 30, config: {damping: 14, mass: 0.4, stiffness: 120}});

  // VS badge pop
  const vsBadgePop = spring({frame: Math.max(0, frame - 16), fps: 30, config: {damping: 8, mass: 0.3, stiffness: 200}});
  const vsPulse = 1 + Math.sin(frame / 40) * 0.03; // subtle periodic pulse

  return (
    <AbsoluteFill
      style={{
        background: theme.background,
        fontFamily: TEXT_FONT,
        overflow: 'hidden',
      }}
    >
      {/* Subtle background pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: theme.dotsOpacity,
        background: `radial-gradient(circle at 20% 20%, ${theme.dots[0]} 1px, transparent 1px), radial-gradient(circle at 80% 80%, ${theme.dots[1]} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      {/* Top accent glow */}
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${theme.glow} 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }} />

      {audioUrl ? <Audio src={resolveAsset(audioUrl)} volume={1} /> : null}
      <PremiumAudioLayer
        enabled={props.premiumEditing !== false}
        styleLock={props.styleLock}
        soundCues={props.soundCues}
      />

      {/* Creator handle */}
      <div
        style={{
          position: 'absolute',
          top: COMPARE_LAYOUT.handleTop,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 32,
          fontWeight: 800,
          color: theme.handle,
          letterSpacing: 0.5,
        }}
      >
        {props.creatorHandle || '@itnavideo'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: COMPARE_LAYOUT.titleTop,
          left: 44,
          right: 44,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            width: 488,
            height: COMPARE_LAYOUT.titleHeight,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${leftColor.main} 0%, ${leftColor.soft} 100%)`,
            border: winner === 'left' ? '2px solid #FACC15' : 'none',
            boxShadow: winner === 'left'
              ? `0 8px 28px ${leftColor.glowPrefix}0.35), 0 0 0 3px rgba(250,204,21,0.35)`
              : `0 8px 24px ${leftColor.glowPrefix}0.25), 0 2px 6px rgba(0,0,0,0.08)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 24px',
            position: 'relative',
            transform: `translateX(${leftLabelEntry * 80}px) translateY(${Math.sin(frame / 18) * 2}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: -16,
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#ffffff',
              border: 'none',
              color: leftColor.main,
              fontSize: 20,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            A
          </div>
          {winner === 'left' ? <WinnerCrown side="left" /> : null}
          <div
            style={{
              textAlign: 'center',
              fontFamily: DISPLAY_FONT,
              fontSize: leftTitleFontSize,
              lineHeight: 0.98,
              maxHeight: 58,
              overflow: 'hidden',
              fontWeight: 750,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: -1.2,
              textShadow: '0 4px 0 rgba(0,0,0,0.32)',
            }}
          >
            {leftTitle}
          </div>
        </div>

        <div
          style={{
            width: 488,
            height: COMPARE_LAYOUT.titleHeight,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${rightColor.main} 0%, ${rightColor.soft} 100%)`,
            border: winner === 'right' ? '2px solid #FACC15' : 'none',
            boxShadow: winner === 'right'
              ? `0 8px 28px ${rightColor.glowPrefix}0.35), 0 0 0 3px rgba(250,204,21,0.35)`
              : `0 8px 24px ${rightColor.glowPrefix}0.25), 0 2px 6px rgba(0,0,0,0.08)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 24px',
            position: 'relative',
            transform: `translateX(${rightLabelEntry * 80}px) translateY(${Math.cos(frame / 18) * 2}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: -16,
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#ffffff',
              border: 'none',
              color: rightColor.main,
              fontSize: 20,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            B
          </div>
          {winner === 'right' ? <WinnerCrown side="right" /> : null}
          <div
            style={{
              textAlign: 'center',
              fontFamily: DISPLAY_FONT,
              fontSize: rightTitleFontSize,
              lineHeight: 0.98,
              maxHeight: 58,
              overflow: 'hidden',
              fontWeight: 750,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: -1.2,
              textShadow: '0 4px 0 rgba(0,0,0,0.32)',
            }}
          >
            {rightTitle}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: COMPARE_LAYOUT.imageTop,
          left: 44,
          right: 44,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{opacity: leftImageEntry, transform: `translateX(${(1 - leftImageEntry) * -40}px)`}}>
          <VisualBox image={leftImage} side="left" colors={leftColor} boxBg={theme.boxBg} isActive={leftActive} />
        </div>
        <div style={{opacity: rightImageEntry, transform: `translateX(${(1 - rightImageEntry) * 40}px)`}}>
          <VisualBox image={rightImage} side="right" colors={rightColor} boxBg={theme.boxBg} isActive={rightActive} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 395,
          left: '50%',
          width: 78,
          height: 78,
          borderRadius: 18,
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F00 100%)',
          border: '3px solid #ffffff',
          transform: `translateX(-50%) scale(${vsBadgePop * vsPulse})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: DISPLAY_FONT,
          fontSize: 26,
          fontWeight: 900,
          color: '#ffffff',
          zIndex: 5,
          boxShadow: '0 8px 24px rgba(255,107,53,0.3), 0 2px 6px rgba(0,0,0,0.1)',
          letterSpacing: 1,
        }}
      >
        VS
      </div>

      {caption ? (
        <div
          style={{
            position: 'absolute',
            top: COMPARE_LAYOUT.captionTop,
            left: 72,
            right: 72,
            height: COMPARE_LAYOUT.captionHeight,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            color: theme.captionText,
            fontFamily: TEXT_FONT,
            fontSize: 40,
            lineHeight: 1.08,
            fontWeight: 800,
            letterSpacing: -0.8,
            background: theme.captionBg,
            backdropFilter: 'blur(12px)',
            border: `2px solid ${theme.captionBorder}`,
            borderRadius: 20,
            padding: '18px 28px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
            transform: `scale(${captionScale})`,
            zIndex: 4,
          }}
        >
          {caption}
        </div>
      ) : null}

      <StickerPresenter
        overlay={activeOverlay}
        caption={activeCaption}
        leftTitle={leftTitle}
        rightTitle={rightTitle}
        stickerStyle={props.stickerStyle}
        stickerScale={Number(props.stickerScale) || 1}
        stickerOffsetX={Number(props.stickerOffsetX) || 0}
        stickerOffsetY={Number(props.stickerOffsetY) || 0}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 100,
          background: `linear-gradient(0deg, ${theme.bottomFade}, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Opening hook card — big "A vs B" question to stop the scroll */}
      {showHook ? (
        <HookCard
          leftTitle={leftTitle}
          rightTitle={rightTitle}
          topic={hookText}
          theme={theme}
          leftColor={leftColor}
          rightColor={rightColor}
          opacity={hookOpacity}
        />
      ) : null}

      {/* Closing card — winner + follow CTA */}
      {showClosing ? (
        <ClosingCard
          leftTitle={leftTitle}
          rightTitle={rightTitle}
          winner={winner}
          handle={props.creatorHandle || '@itnavideo'}
          theme={theme}
          leftColor={leftColor}
          rightColor={rightColor}
          opacity={closingOpacity}
        />
      ) : null}

      <PremiumVisualTreatment enabled={props.premiumEditing !== false} styleLock={props.styleLock} />
    </AbsoluteFill>
  );
};

const getCompareDurationSeconds = (props: CompareProps) => {
  const requested =
    Number(props.durationSeconds) ||
    Number(props.sourceDurationSeconds) ||
    Number(props.renderWindowSeconds) ||
    60;
  return Math.max(1, Math.min(90, requested));
};

export const CompareExplainerComposition = () => (
  <Composition
    id="comparisonImages"
    component={CompareExplainer}
    durationInFrames={2700}
    fps={30}
    width={1080}
    height={1920}
    calculateMetadata={({props}) => {
      const durationSeconds = getCompareDurationSeconds(props as CompareProps);
      return {durationInFrames: Math.ceil(durationSeconds * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);

export const Compare2DPreviewComposition = () => (
  <Composition
    id="COMPARE-2D-PREVIEW"
    component={CompareExplainer}
    durationInFrames={1800}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      stickerStyle: '2d',
    }}
    calculateMetadata={({props}) => {
      const durationSeconds = getCompareDurationSeconds(props as CompareProps);
      return {durationInFrames: Math.ceil(durationSeconds * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);

export const CompareCartoonPreviewComposition = () => (
  <Composition
    id="COMPARE-CARTOON-PREVIEW"
    component={CompareExplainer}
    durationInFrames={1800}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      stickerStyle: 'cartoon',
    }}
    calculateMetadata={({props}) => {
      const durationSeconds = getCompareDurationSeconds(props as CompareProps);
      return {durationInFrames: Math.ceil(durationSeconds * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);

export const CompareExplainerPreviewComposition = () => (
  <Composition
    id="COMPARE-EXPLAINER-PREVIEW"
    component={CompareExplainer}
    durationInFrames={1800}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      stickerStyle: 'explainer',
    }}
    calculateMetadata={({props}) => {
      const durationSeconds = getCompareDurationSeconds(props as CompareProps);
      return {durationInFrames: Math.ceil(durationSeconds * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);






