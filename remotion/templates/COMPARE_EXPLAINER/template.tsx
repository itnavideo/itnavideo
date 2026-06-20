import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {COMPARE_SFX} from './sfxManifest';

type CompareImageInput = string | {url?: string; src?: string; imageUrl?: string};

type CompareOverlay = {
  start?: number;
  end?: number;
  text?: string;
  body?: string;
  title?: string;
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

  comparisonImageUrls?: string[];
  comparisonImages?: CompareImageInput[];

  compareLeftTitle?: string;
  compareRightTitle?: string;
  leftTitle?: string;
  rightTitle?: string;

  creatorHandle?: string;
  stickerStyle?: '2d' | 'cartoon' | 'explainer' | string;

  overlayTimeline?: CompareOverlay[];
  captions?: CompareCaption[];
  transcriptSegments?: CompareCaption[];
  segments?: CompareCaption[];
  transcript?: string;
  sourceScript?: string;
  topicTitle?: string;
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

type StickerSet = Record<'welcome' | 'left' | 'right' | 'thinking' | 'warning' | 'success', string>;

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

// Size config per body type
const STICKER_SIZE_CONFIG: Record<StickerBodyType, {width: number; maxHeight: number; scale: number}> = {
  full_body: {width: 420, maxHeight: 620, scale: 1.0},
  half_body: {width: 520, maxHeight: 550, scale: 1.05},
  upper_body: {width: 560, maxHeight: 480, scale: 1.1},
};

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

const getActiveOverlayIndex = (items: CompareOverlay[] = [], frame: number, fps: number) => {
  const time = frame / fps;
  const index = items.findIndex((item) => time >= Number(item.start || 0) && time <= Number(item.end || 999));
  return index >= 0 ? index : 0;
};

const getActiveCaption = (items: CompareCaption[] = [], frame: number, fps: number) => {
  const time = frame / fps;
  return items.find((item) => time >= Number(item.start || 0) && time <= Number(item.end || 999)) || items[0];
};


const makeShortSubtitle = (value: string) => {
  const words = cleanText(value, 95).split(/\s+/).filter(Boolean);

  if (words.length <= 6) return words.join(' ');

  const maxWords = 7;
  const selected = words.slice(0, 14);
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
  fallback: string,
) => {
  const captionText = caption?.text || caption?.lines?.join(' ');
  return cleanHinglishSubtitle(makeShortSubtitle(captionText || overlay?.text || overlay?.body || overlay?.title || fallback || 'Simple difference samjho.'));
};

const findSfx = (pattern: RegExp) => COMPARE_SFX.find((src) => pattern.test(src)) || '';

const CompareSfxLayer = () => {
  const whoosh = findSfx(/whoosh|woosh|swoosh|swish|riser|jet/i) || COMPARE_SFX[0] || '';
  const pop = findSfx(/pop|click|tap|snap|shutter|mouse/i) || COMPARE_SFX[1] || whoosh;
  const ding = findSfx(/ding|chime|bell|notification|kaching|cash/i) || COMPARE_SFX[2] || pop;

  return (
    <>
      {whoosh ? (
        <Sequence from={0} durationInFrames={26}>
          <Audio src={staticFile(whoosh)} volume={0.95} />
        </Sequence>
      ) : null}

      {pop ? (
        <Sequence from={12} durationInFrames={18}>
          <Audio src={staticFile(pop)} volume={0.90} />
        </Sequence>
      ) : null}

      {whoosh ? (
        <Sequence from={58} durationInFrames={24}>
          <Audio src={staticFile(whoosh)} volume={0.88} />
        </Sequence>
      ) : null}

      {pop ? (
        <Sequence from={96} durationInFrames={18}>
          <Audio src={staticFile(pop)} volume={0.85} />
        </Sequence>
      ) : null}

      {whoosh ? (
        <Sequence from={150} durationInFrames={24}>
          <Audio src={staticFile(whoosh)} volume={0.85} />
        </Sequence>
      ) : null}

      {ding ? (
        <Sequence from={220} durationInFrames={28}>
          <Audio src={staticFile(ding)} volume={0.88} />
        </Sequence>
      ) : null}
    </>
  );
};

const VisualBox = ({
  image,
  side,
}: {
  image: string;
  side: 'left' | 'right';
}) => {
  const src = resolveAsset(image);

  return (
    <div
      style={{
        position: 'relative',
        width: 492,
        height: 438,
        border: '6px solid #ef233c',
        background: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 16px 30px rgba(0,0,0,0.12)',
      }}
    >
      <img
        src={src}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(18px)',
          opacity: 0.08,
          transform: 'scale(1.18)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        <img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center center',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 10,
          [side]: 10,
          width: 34,
          height: 34,
          borderRadius: 999,
          background: side === 'left' ? '#2563eb' : '#7c3aed',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontWeight: 750,
        }}
      >
        {side === 'left' ? 'A' : 'B'}
      </div>
    </div>
  );
};


type StickerPoseKey = 'welcome' | 'left' | 'right' | 'thinking' | 'warning' | 'success';

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
  // Frame 0 / intro: always deterministic welcome pose.
  if (currentTime < 1.15) return 'welcome';

  // Final answer / outro: success pose near end.
  if (durationSeconds > 0 && currentTime >= Math.max(0, durationSeconds - 2.4)) {
    return 'success';
  }

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

  const questionWords = [
    '?',
    'what is the difference',
    'difference kya hai',
    'kya difference',
    'kya farq',
    'farq kya',
    'kya zyada behtar',
    'which is better',
    'kaunsa better',
    'kaunsa behtar',
    'vs',
    'compare',
    'comparison',
    'difference',
    'better',
    'confused',
    'question',
    'kya',
    'kyun',
    'kaise',
  ];

  const leftWords = [
    left,
    'first concept',
    'first option',
    'left topic',
    'left side',
    'option a',
    'a option',
    'pehla',
    'pehle',
    'ye hai',
    'yeh hai',
    'this is',
    'website',
    'old',
    'before',
    'problem',
    'without',
  ];

  const rightWords = [
    right,
    'second concept',
    'second option',
    'right topic',
    'right side',
    'option b',
    'b option',
    'dusra',
    'doosra',
    'aur ye',
    'aur yeh',
    'jabki',
    'whereas',
    'while',
    'but',
    'web app',
    'new',
    'after',
    'solution',
    'with',
  ];

  const warningWords = [
    'wrong',
    'risk',
    'danger',
    'scam',
    'fraud',
    'loss',
    'problem',
    'warning',
    'avoid',
    'galat',
    'nuksan',
    'dhoka',
  ];

  const successWords = [
    'success',
    'correct',
    'best',
    'winner',
    'done',
    'profit',
    'benefit',
    'final answer',
    'conclusion',
    'result',
    'sahi',
    'behtar',
  ];

  if (containsAny(text, successWords)) return 'success';
  if (containsAny(text, warningWords)) return 'warning';
  if (text.includes('?') || containsAny(text, questionWords)) return 'thinking';
  if (containsAny(text, rightWords)) return 'right';
  if (containsAny(text, leftWords)) return 'left';

  // Compare template: force left/right alternation every 3 seconds
  const segment = Math.floor(currentTime / 3);
  const poses: StickerPoseKey[] = ['left', 'right', 'left', 'thinking', 'right', 'left', 'right', 'success'];
  return poses[segment % poses.length];
};

const StickerPresenter = ({
  overlay,
  caption,
  leftTitle,
  rightTitle,
  stickerStyle,
}: {
  overlay?: CompareOverlay;
  caption?: CompareCaption;
  leftTitle: string;
  rightTitle: string;
  stickerStyle?: string;
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

  const src = set[poseKey] || set.welcome;

  // Size based on sticker body type
  const bodyType = STICKER_BODY_TYPE[selectedStickerStyle] || 'full_body';
  const sizeConfig = STICKER_SIZE_CONFIG[bodyType];

  // Strict sticker zone. Never allow sticker into subtitle area.
  const STICKER_ZONE_TOP = 910;
  const STICKER_ZONE_BOTTOM = 10;
  const STICKER_ZONE_LEFT = 60;
  const STICKER_ZONE_RIGHT = 60;
  const STICKER_WIDTH = sizeConfig.width;
  const STICKER_MAX_HEIGHT = sizeConfig.maxHeight;

  const enterOpacity = interpolate(frame, [0, 6], [1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pop = interpolate(frame, [0, 10, 22], [0.94, 1.018, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const idleY = Math.sin(frame / 60) * 1.1;
  const rotate = Math.sin(frame / 100) * 0.12;

  return (
    <div
      style={{
        position: 'absolute',
        left: STICKER_ZONE_LEFT,
        right: STICKER_ZONE_RIGHT,
        top: STICKER_ZONE_TOP,
        bottom: STICKER_ZONE_BOTTOM,
        overflow: 'hidden',
        zIndex: 7,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <img
        src={staticFile(src)}
        style={{
          width: STICKER_WIDTH,
          maxWidth: '96%',
          maxHeight: STICKER_MAX_HEIGHT,
          height: 'auto',
          objectFit: 'contain',
          opacity: enterOpacity,
          transform: `translateY(${idleY}px) rotate(${rotate}deg) scale(${pop * sizeConfig.scale})`,
          transformOrigin: 'center bottom',
          filter: 'drop-shadow(0 16px 18px rgba(0,0,0,0.2))',
        }}
      />
    </div>
  );
};
const CompareExplainer = (props: CompareProps) => {
  const frame = useCurrentFrame();
  const fps = 30;

  const uploadedImages = props.comparisonImageUrls?.length
    ? props.comparisonImageUrls
    : (props.comparisonImages || []).map(pickImage).filter(Boolean);

  const leftImage = uploadedImages[0] || 'assets/compare/debit-card.jpg';
  const rightImage = uploadedImages[1] || 'assets/compare/credit-card.avif';

  const leftTitle = cleanText(props.compareLeftTitle || props.leftTitle || 'Left', 18);
  const rightTitle = cleanText(props.compareRightTitle || props.rightTitle || 'Right', 18);

  const audioUrl = props.audioUrl || props.mediaUrl || props.sourceAudioUrl || '';
  const activeOverlay = getActiveOverlay(props.overlayTimeline || [], frame, fps);
  const activeOverlayIndex = getActiveOverlayIndex(props.overlayTimeline || [], frame, fps);
  const activeCaption = getActiveCaption(props.captions || props.transcriptSegments || props.segments || [], frame, fps);

  const caption = getCaptionText(
    activeOverlay,
    activeCaption,
    props.transcript || props.sourceScript || props.topicTitle || `${leftTitle} vs ${rightTitle}`,
  );

  const captionScale = interpolate(frame, [0, 10], [0.98, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const activeStartSeconds = Number(activeCaption?.start ?? activeOverlay?.start ?? 0);
  const localSceneFrame = Math.max(0, frame - Math.round(activeStartSeconds * fps));

  const sceneOpacity = interpolate(localSceneFrame, [0, 10, 22], [0, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sceneLift = interpolate(localSceneFrame, [0, 14, 28], [26, 0, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scenePop = interpolate(localSceneFrame, [0, 10, 22], [0.96, 1.03, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#ffffff',
        fontFamily: 'Arial Black, Impact, Arial, Helvetica, sans-serif',
        overflow: 'hidden',
      }}
    >
      {audioUrl ? <Audio src={audioUrl} volume={1} /> : null}
      <CompareSfxLayer />

      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 40,
          fontWeight: 900,
          color: '#6b7280',
        }}
      >
        {props.creatorHandle || '@itnavideo'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 132,
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
            width: 492,
            minHeight: 82,
            borderRadius: 26,
            background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
            border: '4px solid #050505',
            boxShadow: '0 12px 0 rgba(0,0,0,0.22), 0 20px 32px rgba(37,99,235,0.24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 24px',
            position: 'relative',
            transform: `translateY(${Math.sin(frame / 18) * 2}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: -18,
              width: 42,
              height: 42,
              borderRadius: 999,
              background: '#ffffff',
              border: '4px solid #050505',
              color: '#2563eb',
              fontSize: 22,
              fontWeight: 750,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 0 rgba(0,0,0,0.18)',
            }}
          >
            A
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: 44,
              lineHeight: 0.95,
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
            width: 492,
            minHeight: 82,
            borderRadius: 26,
            background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            border: '4px solid #050505',
            boxShadow: '0 12px 0 rgba(0,0,0,0.22), 0 20px 32px rgba(124,58,237,0.24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 24px',
            position: 'relative',
            transform: `translateY(${Math.cos(frame / 18) * 2}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: -18,
              width: 42,
              height: 42,
              borderRadius: 999,
              background: '#ffffff',
              border: '4px solid #050505',
              color: '#7c3aed',
              fontSize: 22,
              fontWeight: 750,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 0 rgba(0,0,0,0.18)',
            }}
          >
            B
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: 44,
              lineHeight: 0.95,
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
          top: 245,
          left: 44,
          right: 44,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <VisualBox image={leftImage} side="left" />
        <VisualBox image={rightImage} side="right" />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 415,
          left: '50%',
          width: 82,
          height: 82,
          borderRadius: 999,
          background: '#ffffff',
          border: '5px solid #fb8500',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          fontWeight: 750,
          zIndex: 5,
          boxShadow: '0 10px 18px rgba(0,0,0,0.16)',
        }}
      >
        VS
      </div>

      <div
        style={{
          position: 'absolute',
          top: 735,
          left: 88,
          right: 88,
          minHeight: 104,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#050505',
          fontSize: 48,
          lineHeight: 1.06,
          fontWeight: 750,
          letterSpacing: -0.8,
          textTransform: 'uppercase',
          textShadow: '0 2px 0 rgba(255,255,255,0.65)',
          background: 'linear-gradient(135deg, #fff8cf 0%, #ffffff 48%, #c7f9e7 100%)',
          border: '4px solid #050505',
          borderRadius: 26,
          padding: '14px 24px',
          boxShadow: '0 8px 0 rgba(0,0,0,0.16), 0 16px 26px rgba(0,0,0,0.10)',
          transform: `scale(${captionScale})`,
          zIndex: 4,
        }}
      >
        {caption}
      </div>

      <StickerPresenter
        overlay={activeOverlay}
        caption={activeCaption}
        leftTitle={leftTitle}
        rightTitle={rightTitle}
        stickerStyle={props.stickerStyle}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 105,
          background: 'linear-gradient(0deg, rgba(255,255,255,0.92), rgba(255,255,255,0))',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export const CompareExplainerComposition = () => (
  <Composition
    id="comparisonImages"
    component={CompareExplainer}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const Compare2DPreviewComposition = () => (
  <Composition
    id="COMPARE-2D-PREVIEW"
    component={CompareExplainer}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      stickerStyle: '2d',
    }}
  />
);

export const CompareCartoonPreviewComposition = () => (
  <Composition
    id="COMPARE-CARTOON-PREVIEW"
    component={CompareExplainer}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      stickerStyle: 'cartoon',
    }}
  />
);

export const CompareExplainerPreviewComposition = () => (
  <Composition
    id="COMPARE-EXPLAINER-PREVIEW"
    component={CompareExplainer}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      stickerStyle: 'explainer',
    }}
  />
);






