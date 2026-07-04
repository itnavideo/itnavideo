/**
 * DYNAMIC CREATOR REEL — Kinetic Typography Motion Graphics
 *
 * Identity: Premium motion-graphics reel. Big bold kinetic text.
 * NEVER renders subtitle bars. Every word is a visual event.
 *
 * Completely different from Auto Caption Reel (which is subtitle-focused).
 * Auto Caption = readable text at bottom. Dynamic = full-screen kinetic motion.
 */
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {PremiumAudioLayer, type PremiumSoundCue, type PremiumStyleLock} from '../../components/PremiumAudioLayer';
import {getPremiumMediaStyle, PremiumVisualTreatment, type PremiumVisualStyleLock} from '../../components/PremiumVisualTreatment';

type SceneType = 'creator_face' | 'typography' | 'key_point';

type DynamicScene = {
  type: SceneType;
  start: number;
  end: number;
  text?: string;
  highlightWord?: string;
  zoom?: number;
};

type CaptionWord = {
  word: string;
  start: number;
  end: number;
};

type DynamicCaption = {
  start: number;
  end: number;
  text: string;
  words?: CaptionWord[];
};

type DynamicCreatorReelProps = {
  mediaSrc?: string;
  mediaType?: 'video' | 'audio';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  scenes?: DynamicScene[];
  captions?: DynamicCaption[];
  accentColor?: string;
  topicTitle?: string;
  premiumEditing?: boolean;
  styleLock?: PremiumStyleLock & PremiumVisualStyleLock;
  soundCues?: PremiumSoundCue[];
};

const resolveUrl = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const cleanWords = (value = '') =>
  value.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);

const pickHighlightWord = (text = '', preferred?: string) => {
  if (preferred && text.toLowerCase().includes(preferred.toLowerCase())) return preferred;
  const words = cleanWords(text);
  return (
    words.filter((w) => w.replace(/[^a-zA-Z0-9]/g, '').length >= 4).at(-1) ||
    words.at(-1) ||
    ''
  );
};

const splitAroundHighlight = (text: string, highlight: string) => {
  if (!highlight) return [{text, highlight: false}];
  const lower = text.toLowerCase();
  const idx = lower.indexOf(highlight.toLowerCase());
  if (idx < 0) return [{text, highlight: false}];
  return [
    {text: text.slice(0, idx), highlight: false},
    {text: text.slice(idx, idx + highlight.length), highlight: true},
    {text: text.slice(idx + highlight.length), highlight: false},
  ].filter((p) => p.text);
};

const fitFontSize = (text = '') => {
  if (text.length > 44) return 48;
  if (text.length > 28) return 62;
  return 78;
};

type HookPhrase = {
  text: string;
  start: number;
  end: number;
};

const hookHighlightGradient = 'linear-gradient(90deg, #ffffff 0%, #8fd3ff 48%, #5b7cfa 100%)';

const isStatWord = (word = '') => {
  const w = word.trim().replace(/[,.!?;:]/g, '');
  const lower = w.toLowerCase();

  if (!w) return false;

  if (/^(\$|₹|rs\.?|inr)?\s?\d+(\.\d+)?(k|m|cr|l|lakh|crore|million|billion)?$/i.test(w)) return true;
  if (/^\d+(\.\d+)?%$/.test(w)) return true;
  if (/^\d{1,4}$/.test(w)) return true;

  return [
    'sold',
    'licensed',
    'realtor',
    'revenue',
    'clients',
    'growth',
    'roughly',
    'year',
    'years',
    'old',
    'million',
    'crore',
    'lakh',
  ].includes(lower);
};

const phraseHasStat = (text = '') => cleanWords(text).some(isStatWord);

const chunkHookText = (text = '') => {
  const words = cleanWords(text);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += 3) {
    chunks.push(words.slice(i, i + 3).join(' '));
  }

  return chunks.filter(Boolean);
};

const chunkHookPhrases = (
  captions: DynamicCaption[] = [],
  scenes: DynamicScene[] = []
): HookPhrase[] => {
  const phrases: string[] = [];

  const earlyCaptions = captions
    .filter((c) => c.start < 12 && c.text)
    .sort((a, b) => a.start - b.start);

  if (earlyCaptions.length) {
    earlyCaptions.forEach((caption) => {
      chunkHookText(caption.text).forEach((chunk) => phrases.push(chunk));
    });
  } else {
    scenes
      .filter((s) => s.start < 12 && s.text)
      .sort((a, b) => a.start - b.start)
      .forEach((scene) => {
        chunkHookText(scene.text || '').forEach((chunk) => phrases.push(chunk));
      });
  }

  const fallback = [
    'I am',
    '24 years old',
    'a realtor',
    'this year',
    '$17M',
    'I have sold',
    '$23M',
    'roughly',
  ];

  const finalPhrases = (phrases.length ? phrases : fallback).slice(0, 10);
  const slot = 12 / Math.max(1, finalPhrases.length);

  return finalPhrases.map((text, index) => ({
    text,
    start: index * slot,
    end: Math.min(12, (index + 1) * slot),
  }));
};


// ─── Kinetic word-by-word reveal ──────────────────────────────────────────────
// Each word pops in on its own spring. Short pauses between words feel energetic.
function KineticPhrase({
  text,
  highlightWord,
  localFrame,
  fps,
  accentColor,
  align = 'left',
  size = 'normal',
  stagger = 3, // frames between each word
}: {
  text: string;
  highlightWord?: string;
  localFrame: number;
  fps: number;
  accentColor: string;
  align?: 'left' | 'center' | 'right';
  size?: 'normal' | 'large' | 'huge';
  stagger?: number;
}) {
  const words = cleanWords(text);
  const highlight = pickHighlightWord(text, highlightWord).toLowerCase();
  const baseFontSize =
    size === 'huge' ? 108 : size === 'large' ? 82 : fitFontSize(text);

  return (
    <div
      style={{
        fontFamily: 'Inter, Arial, Helvetica, sans-serif',
        fontWeight: 950,
        letterSpacing: -1,
        lineHeight: 0.9,
        textAlign: align,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0 14px',
        rowGap: 8,
        justifyContent: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      {words.map((word, i) => {
        const wordFrame = Math.max(0, localFrame - i * stagger);
        const enter = spring({
          frame: wordFrame,
          fps,
          config: {damping: 12, mass: 0.25, stiffness: 220},
        });
        const opacity = interpolate(wordFrame, [0, 6], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const y = interpolate(enter, [0, 1], [32, 0]);
        const scale = interpolate(enter, [0, 1], [0.72, 1]);
        const isHighlight = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === highlight.replace(/[^a-zA-Z0-9]/g, '');

        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'inline-block',
              fontSize: baseFontSize,
              color: isHighlight ? accentColor : '#ffffff',
              fontStyle: isHighlight && size !== 'huge' ? 'italic' : 'normal',
              textShadow: isHighlight
                ? `0 4px 18px rgba(0,0,0,0.55), 0 0 28px ${accentColor}66`
                : '0 4px 22px rgba(0,0,0,0.65)',
              transform: `translateY(${y}px) scale(${scale})`,
              opacity,
              transformOrigin: 'bottom left',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

// ─── Word-by-word live highlight (for creator_face scenes) ────────────────────
// Shows the CURRENT spoken word LARGE in the center — no bottom bar, no subtitle strip.
function LiveWordBurst({
  caption,
  currentTime,
  fps,
  accentColor,
}: {
  caption: DynamicCaption;
  currentTime: number;
  fps: number;
  accentColor: string;
}) {
  const localFrame = Math.max(0, Math.round((currentTime - caption.start) * fps));
  const words = caption.words?.length ? caption.words : [];
  const wordCount = cleanWords(caption.text).length;

  // Single word or very short phrase: show big and centered
  if (wordCount <= 4 || !words.length) {
    return (
      <div
        style={{
          position: 'absolute',
          left: 54,
          right: 54,
          top: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9,
          pointerEvents: 'none',
        }}
      >
        <KineticPhrase
          text={caption.text}
          localFrame={localFrame}
          fps={fps}
          accentColor={accentColor}
          align="center"
          size="large"
          stagger={2}
        />
      </div>
    );
  }

  // Longer phrase: show word-by-word big, lower-center of screen
  // Highlight the active spoken word with accent color + scale pop
  return (
    <div
      style={{
        position: 'absolute',
        left: 54,
        right: 54,
        bottom: 220,
        zIndex: 9,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0 10px',
          rowGap: 6,
          justifyContent: 'flex-start',
        }}
      >
        {cleanWords(caption.text).map((word, i) => {
          const wordData = words[i];
          const isActive = wordData
            ? currentTime >= wordData.start && currentTime < wordData.end
            : false;
          const isPast = wordData ? currentTime >= wordData.end : false;

          // Pop animation for active word
          const activePop = isActive
            ? spring({frame: localFrame, fps, config: {damping: 10, mass: 0.2, stiffness: 300}})
            : 1;
          const scale = isActive ? interpolate(activePop, [0, 1], [0.85, 1.1]) : 1;

          return (
            <span
              key={`${word}-${i}`}
              style={{
                display: 'inline-block',
                fontFamily: 'Inter, Arial, Helvetica, sans-serif',
                fontSize: 64,
                fontWeight: 950,
                letterSpacing: -1,
                lineHeight: 1,
                color: isActive ? accentColor : isPast ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.88)',
                textShadow: isActive
                  ? `0 4px 18px rgba(0,0,0,0.55), 0 0 32px ${accentColor}88`
                  : '0 3px 16px rgba(0,0,0,0.55)',
                transform: `scale(${scale})`,
                transformOrigin: 'bottom left',
                transition: 'color 0.05s',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}


// ─── Reference-style first 12s kinetic hook ───────────────────────────────────
// Dark creator video background + huge statement typography.
// No boxes, no cards, no borders, no subtitle bar.
function KineticHookScene({
  captions,
  scenes,
  currentTime,
  frame,
  fps,
  accentColor,
}: {
  captions: DynamicCaption[];
  scenes: DynamicScene[];
  currentTime: number;
  frame: number;
  fps: number;
  accentColor: string;
}) {
  const phrases = chunkHookPhrases(captions, scenes);
  const activeIndex = clamp(
    phrases.findIndex((p) => currentTime >= p.start && currentTime < p.end),
    0,
    Math.max(0, phrases.length - 1)
  );
  const phrase = phrases[activeIndex] || phrases[0];
  const localFrame = Math.max(0, frame - Math.round(phrase.start * fps));
  const phraseDurationFrames = Math.max(18, Math.round((phrase.end - phrase.start) * fps));

  const enter = spring({
    frame: localFrame,
    fps,
    config: {damping: 13, mass: 0.25, stiffness: 240},
  });

  const opacityIn = interpolate(localFrame, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacityOut = interpolate(
    localFrame,
    [phraseDurationFrames - 7, phraseDurationFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const opacity = opacityIn * opacityOut;
  const y = interpolate(enter, [0, 1], [44, 0]);
  const scale = interpolate(enter, [0, 1], [0.78, 1]);

  const isStatPhrase = phraseHasStat(phrase.text);
  const words = cleanWords(phrase.text);
  const singleStat = words.length === 1 && isStatPhrase;

  const positions = [
    {top: '42%', left: 58, right: 58, align: 'left' as const},
    {top: '50%', left: 58, right: 58, align: 'center' as const},
    {top: '31%', left: 58, right: 58, align: 'center' as const},
    {top: '60%', left: 58, right: 58, align: 'left' as const},
  ];

  const pos = positions[activeIndex % positions.length];

  const fontSize = singleStat
    ? 214
    : phrase.text.length <= 8
      ? 138
      : phrase.text.length <= 18
        ? 118
        : 96;

  return (
    <>
      <AbsoluteFill
        style={{
          background: 'rgba(0,0,0,0.58)',
          zIndex: 6,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: pos.left,
          right: pos.right,
          top: pos.top,
          transform: `translateY(-50%) translateY(${y}px) scale(${scale})`,
          transformOrigin: pos.align === 'center' ? 'center center' : 'left center',
          zIndex: 12,
          opacity,
          pointerEvents: 'none',
          textAlign: pos.align,
          fontFamily: 'Inter, Arial, Helvetica, sans-serif',
          fontWeight: 950,
          letterSpacing: singleStat ? -8 : -3,
          lineHeight: singleStat ? 0.82 : 0.9,
          fontSize,
          textShadow: '0 8px 34px rgba(0,0,0,0.75)',
          textTransform: singleStat ? 'uppercase' : 'none',
        }}
      >
        {words.map((word, index) => {
          const useGradient = isStatWord(word) || (isStatPhrase && words.length <= 2);
          const wordFrame = Math.max(0, localFrame - index * 2);
          const wordEnter = spring({
            frame: wordFrame,
            fps,
            config: {damping: 11, mass: 0.22, stiffness: 280},
          });
          const wordScale = interpolate(wordEnter, [0, 1], [0.86, 1]);

          return (
            <span
              key={`${word}-${index}`}
              style={{
                display: 'inline-block',
                marginRight: index === words.length - 1 ? 0 : 18,
                transform: `scale(${wordScale})`,
                ...(useGradient
                  ? {
                      background: hookHighlightGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      filter: `drop-shadow(0 0 22px ${accentColor}77)`,
                    }
                  : {
                      color: '#ffffff',
                    }),
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </>
  );
}

// ─── Typography full-screen takeover ──────────────────────────────────────────
function TypographyScene({
  scene,
  localFrame,
  fps,
  accentColor,
}: {
  scene: DynamicScene;
  localFrame: number;
  fps: number;
  accentColor: string;
}) {
  // Overlay that dims the video during typography moments
  const dimOpacity = interpolate(localFrame, [0, 8], [0, 0.72], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* Dim overlay */}
      <AbsoluteFill
        style={{
          background: `rgba(0,0,0,${dimOpacity})`,
          zIndex: 6,
          pointerEvents: 'none',
        }}
      />
      {/* Accent line — left edge marker */}
      <div
        style={{
          position: 'absolute',
          left: 44,
          top: '50%',
          width: 7,
          height: interpolate(localFrame, [0, 14], [0, 320], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          marginTop: -160,
          background: accentColor,
          borderRadius: 4,
          zIndex: 8,
          boxShadow: `0 0 28px ${accentColor}88`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 54,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 8,
          pointerEvents: 'none',
        }}
      >
        <KineticPhrase
          text={scene.text || ''}
          highlightWord={scene.highlightWord}
          localFrame={localFrame}
          fps={fps}
          accentColor={accentColor}
          align="left"
          size="large"
          stagger={4}
        />
      </div>
    </>
  );
}

// ─── Key point — massive accent word + body ────────────────────────────────────
function KeyPointScene({
  scene,
  localFrame,
  fps,
  accentColor,
}: {
  scene: DynamicScene;
  localFrame: number;
  fps: number;
  accentColor: string;
}) {
  const bigWord = pickHighlightWord(scene.text || '', scene.highlightWord);
  const bigEnter = spring({frame: localFrame, fps, config: {damping: 14, mass: 0.3, stiffness: 190}});
  const bigY = interpolate(bigEnter, [0, 1], [60, 0]);
  const bigScale = interpolate(bigEnter, [0, 1], [0.78, 1]);
  const bigOpacity = interpolate(localFrame, [0, 10], [0, 0.62], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dimOpacity = interpolate(localFrame, [0, 8], [0, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <AbsoluteFill
        style={{background: `rgba(0,0,0,${dimOpacity})`, zIndex: 5, pointerEvents: 'none'}}
      />
      {/* Huge ghost word */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 6,
          fontFamily: 'Inter, Arial, Helvetica, sans-serif',
          fontSize: 148,
          fontWeight: 950,
          letterSpacing: -4,
          lineHeight: 0.82,
          color: accentColor,
          opacity: bigOpacity,
          transform: `translateY(${bigY}px) scale(${bigScale})`,
          textShadow: `0 0 60px ${accentColor}44`,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {bigWord.toUpperCase()}
      </div>
      {/* Body text lower */}
      <div
        style={{
          position: 'absolute',
          left: 58,
          right: 58,
          bottom: 240,
          zIndex: 8,
          pointerEvents: 'none',
        }}
      >
        <KineticPhrase
          text={scene.text || ''}
          highlightWord={scene.highlightWord}
          localFrame={Math.max(0, localFrame - 8)}
          fps={fps}
          accentColor={accentColor}
          align="left"
          size="normal"
          stagger={3}
        />
      </div>
    </>
  );
}

// ─── Persistent brand strip (top) ─────────────────────────────────────────────
function BrandStrip({accentColor, localFrame}: {accentColor: string; localFrame: number}) {
  const opacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: accentColor,
        zIndex: 20,
        opacity,
        boxShadow: `0 0 18px ${accentColor}99`,
      }}
    />
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
function DynamicCreatorReel({
  mediaSrc = '',
  mediaType = 'video',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  durationSeconds = 60,
  sourceDurationSeconds = 60,
  scenes = [],
  captions = [],
  accentColor = '#7DD3FC',
  premiumEditing = true,
  styleLock,
  soundCues = [],
}: DynamicCreatorReelProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const videoSrc = resolveUrl(mediaSrc);
  const currentTime = frame / fps;
  const premiumMediaStyle = getPremiumMediaStyle(styleLock, frame, Number(durationSeconds || sourceDurationSeconds || 60) * fps);

  const activeScene = scenes.find((s) => currentTime >= s.start && currentTime < s.end);
  const sceneLocalFrame = activeScene
    ? Math.max(0, Math.round((currentTime - activeScene.start) * fps))
    : 0;

  // Subtle continuous zoom per-scene
  const sceneIndex = activeScene ? Math.max(0, scenes.indexOf(activeScene)) : 0;
  const zoomTarget = activeScene?.zoom ?? (sceneIndex % 3 === 1 ? 1.03 : sceneIndex % 3 === 2 ? 1.055 : 1.012);
  const videoScale = clamp(zoomTarget, 1, 1.08);

  // Active caption for kinetic word display
  const currentCaption = captions.find((c) => currentTime >= c.start && currentTime < c.end);
  const showKineticHook = currentTime < 12;

  // On creator_face scenes: show live word burst if there's a caption
  const showLiveWord =
    !showKineticHook &&
    currentCaption &&
    activeScene?.type !== 'typography' &&
    activeScene?.type !== 'key_point';

  return (
    <AbsoluteFill style={{background: '#050505', overflow: 'hidden'}}>
      {/* ── Video layer ──────────────────────────────────── */}
      {videoSrc && mediaType === 'video' ? (
        <OffthreadVideo
          src={videoSrc}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          volume={sourceAudioVolume}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: premiumMediaStyle.filter,
            transform: `${premiumMediaStyle.transform} scale(${videoScale})`,
            transformOrigin: 'center center',
          }}
        />
      ) : null}
      <PremiumAudioLayer enabled={premiumEditing} styleLock={styleLock} soundCues={soundCues} />

      {/* ── Base gradient vignette ────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 22%, transparent 52%, rgba(0,0,0,0.5) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Brand accent strip ───────────────────────── */}
      {!showKineticHook ? <BrandStrip accentColor={accentColor} localFrame={frame} /> : null}

      {/* ── First 12s reference kinetic hook ─────────── */}
      {showKineticHook ? (
        <KineticHookScene
          captions={captions}
          scenes={scenes}
          currentTime={currentTime}
          frame={frame}
          fps={fps}
          accentColor={accentColor}
        />
      ) : null}

      {/* ── Typography takeover scene ─────────────────── */}
      {!showKineticHook && activeScene?.type === 'typography' ? (
        <TypographyScene
          scene={activeScene}
          localFrame={sceneLocalFrame}
          fps={fps}
          accentColor={accentColor}
        />
      ) : null}

      {/* ── Key point scene ──────────────────────────── */}
      {!showKineticHook && activeScene?.type === 'key_point' ? (
        <KeyPointScene
          scene={activeScene}
          localFrame={sceneLocalFrame}
          fps={fps}
          accentColor={accentColor}
        />
      ) : null}

      {/* ── Live word burst (creator face scenes) ────── */}
      {showLiveWord ? (
        <LiveWordBurst
          caption={currentCaption!}
          currentTime={currentTime}
          fps={fps}
          accentColor={accentColor}
        />
      ) : null}
      <PremiumVisualTreatment enabled={premiumEditing} styleLock={styleLock} />
    </AbsoluteFill>
  );
}

export {DynamicCreatorReel};

export const DynamicCreatorReelComposition = () => (
  <Composition
    id="DYNAMIC-CREATOR-REEL"
    component={DynamicCreatorReel}
    durationInFrames={1800}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      mediaType: 'video',
      mediaSrc: '',
      durationSeconds: 60,
      accentColor: '#7DD3FC',
      scenes: [
        {type: 'typography', start: 0, end: 2.2, text: 'This Changes Everything', highlightWord: 'Everything'},
        {type: 'creator_face', start: 2.2, end: 6, zoom: 1.01},
        {type: 'key_point', start: 6, end: 9, text: 'Most creators miss this simple trick', highlightWord: 'trick'},
        {type: 'creator_face', start: 9, end: 18, zoom: 1.035},
        {type: 'typography', start: 18, end: 21, text: 'Start today', highlightWord: 'today'},
        {type: 'creator_face', start: 21, end: 30, zoom: 1.015},
      ],
      captions: [
        {start: 0, end: 1.5, text: 'I am'},
        {start: 1.5, end: 3, text: '24 years old'},
        {start: 3, end: 4.5, text: 'a realtor'},
        {start: 4.5, end: 6, text: 'this year'},
        {start: 6, end: 7.5, text: '$17M'},
        {start: 7.5, end: 9, text: 'I have sold'},
        {start: 9, end: 10.5, text: '$23M'},
        {start: 10.5, end: 12, text: 'roughly'},
        {start: 21, end: 24, text: 'So start now'},
        {start: 24, end: 28, text: 'not tomorrow'},
      ],
    } as DynamicCreatorReelProps}
    calculateMetadata={({props}) => {
      const p = props as DynamicCreatorReelProps;
      const dur = Math.max(8, Math.min(60, Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || 60));
      return {durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
