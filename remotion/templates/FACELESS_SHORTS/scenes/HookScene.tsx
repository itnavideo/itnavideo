import React from 'react';
import {
  Easing,
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { safeResolveMediaSrc, isVideoMedia } from '../../../utils/safeMedia';

export interface HookSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

/* ───────────────────────── Constants ───────────────────────── */

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const VIDEO_LOOP_FRAMES = 180; // ek video loop ki length (30fps pe 6 sec)
const ACCENT = '#FF5722';
const SAFE_X = 110; // 1920 wide frame me left/right safe margin
const SAFE_BOTTOM = 120; // neeche safe margin

/* ───────────────────────── Helpers ───────────────────────── */

function getHeadlineSize(length: number, isLight: boolean): number {
  if (isLight) {
    if (length <= 38) return 78;
    if (length <= 64) return 66;
    return 54;
  }
  if (length <= 38) return 96;
  if (length <= 64) return 80;
  return 64;
}

interface MediaLayerProps {
  src: string;
  isVideo: boolean;
  alt: string;
  fallback: React.ReactNode;
}

function MediaLayer({ src, isVideo, alt, fallback }: MediaLayerProps) {
  const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
  if (!src) return <>{fallback}</>;
  if (isVideo) {
    return (
      <Loop durationInFrames={VIDEO_LOOP_FRAMES}>
        <OffthreadVideo src={src} volume={0} style={fill} />
      </Loop>
    );
  }
  // Remotion <Img>: render tab tak wait karta hai jab tak image load na ho
  return <Img src={src} alt={alt} style={fill} />;
}

interface Token {
  text: string;
  highlight?: boolean;
}

function buildTokens(headline: string, highlightWord: string): Token[] {
  const idx = highlightWord ? headline.toLowerCase().indexOf(highlightWord.toLowerCase()) : -1;
  const split = (s: string): Token[] =>
    s
      .split(/\s+/)
      .filter(Boolean)
      .map((text) => ({ text }));

  if (idx < 0) return split(headline);

  return [
    ...split(headline.slice(0, idx)),
    { text: headline.slice(idx, idx + highlightWord.length), highlight: true },
    ...split(headline.slice(idx + highlightWord.length)),
  ];
}

/* ───────────────────────── Main component ───────────────────────── */

export function HookScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  sceneFrame,
  palette,
}: HookSceneProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const f = sceneFrame ?? frame;
  const isLight = palette?.isDark === false;

  /* ── Data ── */
  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);

  const headline = String(scene.heading || 'EXCLUSIVE INSIGHT').trim();
  const rawHighlight =
    scene.highlightedWords && typeof scene.highlightedWords[0] === 'string'
      ? scene.highlightedWords[0].trim()
      : '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const tokens = buildTokens(headline, highlightWord);
  const headlineSize = getHeadlineSize(headline.length, isLight);

  /* ── Animations ── */
  // 1) Punch-in: scene shuru hote hi halka zoom-out (hook ka energy)
  const punch = spring({ frame: f, fps, config: { damping: 20, mass: 1, stiffness: 140 } });
  const punchScale = 1 + (1 - punch) * 0.07;

  // 2) Slow Ken Burns zoom + halka pan (scene ki asli duration pe)
  const total = Math.max(durationInFrames, 1);
  const zoom = interpolate(f, [0, total], [1.0, 1.12], { ...CLAMP, easing: Easing.inOut(Easing.quad) });
  const panX = interpolate(f, [0, total], [0, -36], CLAMP);

  // 3) Tag aur slab ka wipe reveal (left se right)
  const tagWipe = interpolate(f, [2, 14], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const slabWipe = interpolate(f, [6, 26], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  // 4) Accent bar upar se neeche grow hota hai
  const barGrow = interpolate(f, [8, 24], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  // 5) Words ek ek karke aate hain
  const WORD_START = 12;
  const WORD_STAGGER = 3;

  /* ── Fallback (jab media na ho) ── */
  const fallback = (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: isLight
          ? 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)'
          : 'radial-gradient(ellipse at 50% 40%, #1E1B4B 0%, #0F172A 50%, #020617 100%)',
      }}
    />
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      {/* ── 1. Full-bleed cinematic media (poori 16:9 frame) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${panX}px) scale(${zoom * punchScale})`,
          transformOrigin: 'center center',
        }}
      >
        <MediaLayer src={resolvedSrc} isVideo={isVid} alt={headline} fallback={fallback} />
      </div>

      {/* ── 2. Grading: neeche heavy gradient + kinaare vignette ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'linear-gradient(0deg, rgba(15, 23, 42, 0.60) 0%, rgba(15, 23, 42, 0.12) 45%, rgba(15, 23, 42, 0) 70%)'
            : 'linear-gradient(0deg, rgba(2, 6, 23, 0.94) 0%, rgba(2, 6, 23, 0.55) 35%, rgba(2, 6, 23, 0.05) 65%, rgba(2, 6, 23, 0.35) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(2, 6, 23, 0.5) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 3. Lower-third headline (TV / YouTube style, left aligned) ── */}
      <div
        style={{
          position: 'absolute',
          left: SAFE_X,
          right: SAFE_X,
          bottom: SAFE_BOTTOM,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '26px',
          zIndex: 15,
          pointerEvents: 'none',
        }}
      >
        {/* Tag: pill nahi, slanted rectangle (broadcast look) */}
        <div
          style={{
            clipPath: `inset(0 ${(1 - tagWipe) * 100}% 0 0)`,
          }}
        >
          <div
            style={{
              backgroundColor: ACCENT,
              color: '#FFFFFF',
              fontFamily: headingFont,
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '10px 44px 10px 24px',
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%)',
            }}
          >
            MUST WATCH
          </div>
        </div>

        {/* Headline block */}
        <div
          style={{
            clipPath: isLight ? `inset(0 ${(1 - slabWipe) * 100}% 0 0)` : undefined,
            backgroundColor: isLight ? '#FFFFFF' : 'transparent',
            padding: isLight ? '36px 64px 40px 40px' : 0,
            display: 'flex',
            alignItems: 'stretch',
            gap: '32px',
            maxWidth: '1600px',
            boxShadow: isLight ? '0 20px 60px rgba(0, 0, 0, 0.25)' : undefined,
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              width: '10px',
              flexShrink: 0,
              backgroundColor: ACCENT,
              transform: `scaleY(${barGrow})`,
              transformOrigin: 'top center',
            }}
          />

          <h1
            style={{
              margin: 0,
              fontFamily: headingFont,
              fontSize: `${headlineSize}px`,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: isLight ? '#0F172A' : '#FFFFFF',
              textAlign: 'left',
              textShadow: isLight
                ? 'none'
                : '0 4px 30px rgba(0, 0, 0, 0.9), 0 2px 12px rgba(0, 0, 0, 0.8)',
            }}
          >
            {tokens.map((token, i) => {
              const wordIn = spring({
                frame: f - WORD_START - i * WORD_STAGGER,
                fps,
                config: { damping: 14, mass: 0.8, stiffness: 170 },
              });
              const style: React.CSSProperties = {
                display: 'inline-block',
                marginRight: '0.26em',
                opacity: interpolate(wordIn, [0, 1], [0, 1], CLAMP),
                transform: `translateY(${interpolate(wordIn, [0, 1], [48, 0])}px)`,
              };

              return (
                <span key={`${token.text}-${i}`} style={style}>
                  {token.highlight ? (
                    <HandwritingHighlight
                      text={token.text.toUpperCase()}
                      variant="underline"
                      color={ACCENT}
                      delayFrames={WORD_START + i * WORD_STAGGER + 8}
                      drawDurationFrames={18}
                    />
                  ) : (
                    token.text
                  )}
                </span>
              );
            })}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default HookScene;