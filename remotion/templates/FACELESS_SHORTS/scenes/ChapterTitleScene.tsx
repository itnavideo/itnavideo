import React from 'react';
import {
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

export interface ChapterTitleSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  chapterNumber?: number;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
  /** Optional fade-out at the end of the scene. 0 = off (parent handles transitions). */
  exitFrames?: number;
  /** Background for the light theme. Default white; pass 'transparent' to let the parent show through. */
  backgroundColor?: string;
}

const ACCENT = '#FF5722';
const WORD_STAGGER = 3; // frames between each headline word
const HEADLINE_START = 8; // frames after badge begins

/* ───────────────────────── helpers ───────────────────────── */

interface Token {
  text: string;
  highlight?: boolean;
  glueAfter?: boolean; // no space after this token (punctuation attached)
}

function tokenize(headline: string, highlightWord: string): Token[] {
  const toWords = (s: string): Token[] =>
    s
      .split(/\s+/)
      .filter(Boolean)
      .map((text) => ({ text }));

  if (highlightWord) {
    const idx = headline.toLowerCase().indexOf(highlightWord.toLowerCase());
    if (idx >= 0) {
      const before = headline.slice(0, idx);
      const match = headline.slice(idx, idx + highlightWord.length);
      const after = headline.slice(idx + highlightWord.length);

      const beforeTokens = toWords(before);
      const afterTokens = toWords(after);

      if (beforeTokens.length && before && !/\s$/.test(before)) {
        beforeTokens[beforeTokens.length - 1].glueAfter = true;
      }
      const highlightToken: Token = {
        text: match, // keep the original casing from the headline
        highlight: true,
        glueAfter: after.length > 0 && !/^\s/.test(after),
      };
      return [...beforeTokens, highlightToken, ...afterTokens];
    }
  }
  return toWords(headline);
}

/** Bigger type for short titles, smaller for long ones, so it always fits nicely. */
function headlineSize(len: number): number {
  if (len <= 24) return 112;
  if (len <= 40) return 96;
  if (len <= 60) return 82;
  if (len <= 80) return 70;
  return 60;
}

/* ───────────────────────── media layer ───────────────────────── */

interface MediaLayerProps {
  src: string;
  isVideo: boolean;
  alt: string;
  scale: number;
  panX: number;
}

const MediaLayer: React.FC<MediaLayerProps> = ({ src, isVideo, alt, scale, panX }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      transform: `translate3d(${panX}px, 0, 0) scale(${scale})`,
      transformOrigin: 'center center',
      willChange: 'transform',
    }}
  >
    {isVideo ? (
      <Loop durationInFrames={180}>
        <OffthreadVideo
          src={src}
          volume={0}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Loop>
    ) : (
      <Img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )}
  </div>
);

/* ───────────────────────── scene ───────────────────────── */

export function ChapterTitleScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Plus Jakarta Sans, sans-serif',
  chapterNumber,
  sceneFrame,
  palette,
  exitFrames = 0,
  backgroundColor = '#FFFFFF',
}: ChapterTitleSceneProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  /* ── content ── */
  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);
  const hasMedia = Boolean(resolvedSrc);

  const rawBadge = chapterNumber ?? scene.numberBadge ?? 1;
  const chNum =
    typeof rawBadge === 'number' ? rawBadge : parseInt(String(rawBadge), 10) || 1;

  const headline = String(scene.heading || 'CORE CHAPTER TAKEAWAY').trim();
  const rawHighlight =
    scene.highlightedWords && typeof scene.highlightedWords[0] === 'string'
      ? scene.highlightedWords[0].trim()
      : '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const supportingText =
    scene.supportingText && scene.supportingText !== headline ? scene.supportingText : '';

  // White is the default. Only an explicit dark palette switches to the dark look.
  const isLight = palette?.isDark !== true;
  // Text sits on top of photo/video whenever media exists → always light text there.
  // Dark text only when the scene is light AND there is no media behind it.
  const textOnDark = hasMedia || !isLight;

  const headlineColor = textOnDark ? '#FFFFFF' : '#0F172A';
  const supportColor = textOnDark ? '#E2E8F0' : '#475569';
  const textShadow = hasMedia ? '0 4px 40px rgba(2, 6, 23, 0.55)' : 'none';

  /* ── motion ── */
  const softSpring = { damping: 18, mass: 0.9, stiffness: 120 };

  const badgeIn = spring({ frame: currentFrame, fps, config: softSpring });

  const tokens = tokenize(headline, highlightWord);
  const headlineEnd = HEADLINE_START + tokens.length * WORD_STAGGER;

  const barIn = spring({
    frame: currentFrame - headlineEnd,
    fps,
    config: { damping: 20, mass: 0.8, stiffness: 110 },
  });
  const supportIn = spring({
    frame: currentFrame - (headlineEnd + 6),
    fps,
    config: softSpring,
  });

  // Ken Burns spans the real scene length instead of a hard-coded 150 frames
  const drift = interpolate(currentFrame, [0, Math.max(durationInFrames, 1)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const kenBurnsScale = 1.03 + drift * 0.09;
  const panX = -drift * 24;

  // Optional exit fade
  const exitOpacity =
    exitFrames > 0
      ? interpolate(
        currentFrame,
        [durationInFrames - exitFrames, durationInFrames - 1],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
      : 1;

  const fontSize = headlineSize(headline.length);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: isLight ? backgroundColor : 'transparent',
        opacity: exitOpacity,
      }}
    >
      {/* ── 1. Background media ── */}
      {hasMedia &&
        (isLight ? (
          // Light theme: framed media card
          <div
            style={{
              position: 'absolute',
              top: '210px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '1440px',
              height: '730px',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(15, 23, 42, 0.22)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: '#0F172A',
              zIndex: 2,
            }}
          >
            <MediaLayer
              src={resolvedSrc}
              isVideo={isVid}
              alt={headline}
              scale={kenBurnsScale}
              panX={panX}
            />
            {/* Stronger scrim so white text is always readable */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.55) 50%, rgba(15,23,42,0.80) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        ) : (
          // Dark theme: full-bleed media
          <>
            <MediaLayer
              src={resolvedSrc}
              isVideo={isVid}
              alt={headline}
              scale={kenBurnsScale}
              panX={panX}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(2,6,23,0.80) 0%, rgba(2,6,23,0.35) 45%, rgba(2,6,23,0.92) 100%)',
                pointerEvents: 'none',
              }}
            />
            {/* Soft vignette for cinematic focus on the title */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at center, rgba(2,6,23,0) 40%, rgba(2,6,23,0.55) 100%)',
                pointerEvents: 'none',
              }}
            />
          </>
        ))}

      {/* ── 2. Chapter title stage ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 160px',
          zIndex: 10,
          textAlign: 'center',
          gap: '28px',
        }}
      >
        {/* Chapter badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            backgroundColor: textOnDark ? 'rgba(255, 87, 34, 0.20)' : 'rgba(255, 87, 34, 0.12)',
            border: '1.5px solid rgba(255, 87, 34, 0.55)',
            borderRadius: '9999px',
            padding: '12px 36px',
            backdropFilter: hasMedia ? 'blur(10px)' : undefined,
            opacity: badgeIn,
            transform: `translateY(${interpolate(badgeIn, [0, 1], [-16, 0])}px) scale(${interpolate(
              badgeIn,
              [0, 1],
              [0.9, 1]
            )})`,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: ACCENT,
              boxShadow: `0 0 16px ${ACCENT}`,
            }}
          />
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}
          >
            Chapter {String(chNum).padStart(2, '0')}
          </span>
        </div>

        {/* Headline — word-by-word reveal */}
        <h1
          style={{
            fontFamily: headingFont,
            fontSize: `${fontSize}px`,
            fontWeight: 900,
            color: headlineColor,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            margin: 0,
            maxWidth: '1500px',
            textShadow,
            // @ts-expect-error – supported in Chromium, not yet in all TS DOM typings
            textWrap: 'balance',
          }}
        >
          {tokens.map((token, i) => {
            const start = HEADLINE_START + i * WORD_STAGGER;
            const p = spring({
              frame: currentFrame - start,
              fps,
              config: { damping: 16, mass: 0.8, stiffness: 150 },
            });
            const prev = tokens[i - 1];
            const needsSpace = i > 0 && !prev.glueAfter;

            return (
              <React.Fragment key={`${token.text}-${i}`}>
                {needsSpace ? ' ' : ''}
                <span
                  style={{
                    display: 'inline-block',
                    opacity: p,
                    transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px)`,
                    filter: `blur(${interpolate(p, [0, 1], [10, 0])}px)`,
                  }}
                >
                  {token.highlight ? (
                    <HandwritingHighlight
                      text={token.text}
                      variant="underline"
                      color={ACCENT}
                      delayFrames={start + 6}
                      drawDurationFrames={18}
                    />
                  ) : (
                    token.text
                  )}
                </span>
              </React.Fragment>
            );
          })}
        </h1>

        {/* Accent bar draws in after the headline lands */}
        {!highlightWord && (
          <div
            style={{
              width: `${interpolate(barIn, [0, 1], [0, 140])}px`,
              height: '6px',
              borderRadius: '9999px',
              backgroundColor: ACCENT,
              boxShadow: `0 0 24px rgba(255, 87, 34, 0.55)`,
            }}
          />
        )}

        {/* Supporting text */}
        {supportingText && (
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: '36px',
              fontWeight: 600,
              color: supportColor,
              margin: 0,
              maxWidth: '1200px',
              lineHeight: 1.4,
              textShadow,
              opacity: supportIn,
              transform: `translateY(${interpolate(supportIn, [0, 1], [20, 0])}px)`,
            }}
          >
            {supportingText}
          </p>
        )}
      </div>
    </div>
  );
}