import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
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
    welcome: 'assets/stickman-transparent/2d-teacher/teacher-welcome.png',
    left: 'assets/stickman-transparent/2d-teacher/teacher-left.png',
    right: 'assets/stickman-transparent/2d-teacher/teacher-right.png',
    thinking: 'assets/stickman-transparent/2d-teacher/teacher-thinking.png',
    warning: 'assets/stickman-transparent/2d-teacher/teacher-warning.png',
    success: 'assets/stickman-transparent/2d-teacher/teacher-success.png',
  },
  cartoon: {
    welcome: 'assets/stickman-transparent/cartoon-teacher/teacher-answering.png',
    left: 'assets/stickman-transparent/cartoon-teacher/teacher-left.png',
    right: 'assets/stickman-transparent/cartoon-teacher/teacher-right.png',
    thinking: 'assets/stickman-transparent/cartoon-teacher/teacher-questioning.png',
    warning: 'assets/stickman-transparent/cartoon-teacher/teacher-questioning.png',
    success: 'assets/stickman-transparent/cartoon-teacher/teacher-success.png',
  },
  explainer: {
    welcome: "assets/stickman-transparent/stickman-explainer/follow.png",
    left: "assets/stickman-transparent/stickman-explainer/teacher-left.png",
    right: "assets/stickman-transparent/stickman-explainer/teacher-right.png",
    thinking: "assets/stickman-transparent/stickman-explainer/thinking-expression.png",
    warning: "assets/stickman-transparent/stickman-explainer/confused-expression.png",
    success: "assets/stickman-transparent/stickman-explainer/explaining-comparison.png",
  },
} as const;

type StickerSet = Record<'welcome' | 'left' | 'right' | 'thinking' | 'warning' | 'success', string>;

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

const getCaptionText = (
  overlay: CompareOverlay | undefined,
  caption: CompareCaption | undefined,
  fallback: string,
) => {
  const captionText = caption?.text || caption?.lines?.join(' ');
  return makeShortSubtitle(captionText || overlay?.text || overlay?.body || overlay?.title || fallback || 'Simple difference samjho.');
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
          <Audio src={staticFile(whoosh)} volume={0.38} />
        </Sequence>
      ) : null}

      {pop ? (
        <Sequence from={12} durationInFrames={18}>
          <Audio src={staticFile(pop)} volume={0.32} />
        </Sequence>
      ) : null}

      {whoosh ? (
        <Sequence from={58} durationInFrames={24}>
          <Audio src={staticFile(whoosh)} volume={0.30} />
        </Sequence>
      ) : null}

      {pop ? (
        <Sequence from={96} durationInFrames={18}>
          <Audio src={staticFile(pop)} volume={0.28} />
        </Sequence>
      ) : null}

      {whoosh ? (
        <Sequence from={150} durationInFrames={24}>
          <Audio src={staticFile(whoosh)} volume={0.28} />
        </Sequence>
      ) : null}

      {ding ? (
        <Sequence from={220} durationInFrames={28}>
          <Audio src={staticFile(ding)} volume={0.30} />
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


const getStickyPresenterPose = ({
  overlay,
  caption,
  leftTitle,
  rightTitle,
}: {
  overlay?: CompareOverlay;
  caption?: CompareCaption;
  leftTitle: string;
  rightTitle: string;
}) => {
  const text = [
    overlay?.text,
    overlay?.body,
    overlay?.title,
    caption?.text,
    caption?.lines?.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const left = leftTitle.toLowerCase();
  const right = rightTitle.toLowerCase();

  const leftWords = [
    left,
    'left',
    'before',
    'old',
    'pehle',
    'domain',
    'website',
    'problem',
    'without',
  ].filter(Boolean);

  const rightWords = [
    right,
    'right',
    'after',
    'new',
    'baad',
    'hosting',
    'server',
    'solution',
    'with',
  ].filter(Boolean);

  if (leftWords.some((word) => word && text.includes(word))) return 'left';
  if (rightWords.some((word) => word && text.includes(word))) return 'right';

  return 'welcome';
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

  const selectedStickerStyle = stickerStyle === 'cartoon' ? 'cartoon' : stickerStyle === 'explainer' ? 'explainer' : '2d';
  const set: StickerSet = STICKER_SETS[selectedStickerStyle];

  const cycle = [set.welcome, set.thinking, set.left, set.right, set.warning, set.success];
  const text = `${overlay?.title || ''} ${overlay?.text || ''} ${overlay?.body || ''}`.toLowerCase();

  const poseKey = getStickyPresenterPose({overlay, caption, leftTitle, rightTitle});
  let src = set[poseKey] || set.welcome;
  if (/wrong|risk|danger|scam|fraud|loss|problem|warning|avoid/.test(text)) src = set.warning;
  if (/success|correct|best|winner|done|profit|benefit/.test(text)) src = set.success;

  const enterOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enterY = interpolate(frame, [0, 18], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const idleY = Math.sin(frame / 52) * 1.2;
  const rotate = Math.sin(frame / 80) * 0.18;
  const pop = interpolate(frame, [0, 16, 30], [0.98, 1.005, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 135,
        width: stickerStyle === 'cartoon' ? 540 : stickerStyle === 'explainer' ? 590 : 600,
        height: 'auto',
        opacity: enterOpacity,
        transform: `translateX(-50%) translateY(${enterY + idleY}px) rotate(${rotate}deg) scale(${pop})`,
        transformOrigin: 'center bottom',
        filter: 'drop-shadow(0 20px 22px rgba(0,0,0,0.20))',
      }}
    />
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
















