import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { FACELESS_DESIGN_TOKENS } from '../facelessTokens';

export interface QuoteSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: any;
}

/* ───────────────────────── Constants ───────────────────────── */

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/* ───────────────────────── Helpers ───────────────────────── */

// Font glyph ki jagah SVG quote mark (har machine / font pe same render hota hai)
function QuoteMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill={color} style={{ display: 'block' }}>
      <circle cx="21" cy="42" r="9" />
      <path d="M12 42 C12 28 18 20 30 14 L32 19 C25 23 22 28 22 35 Z" />
      <circle cx="47" cy="42" r="9" />
      <path d="M38 42 C38 28 44 20 56 14 L58 19 C51 23 48 28 48 35 Z" />
    </svg>
  );
}

// Quote ki length ke hisaab se font size (portrait aur landscape ke alag)
function getQuoteSize(length: number, isPortrait: boolean): number {
  if (isPortrait) {
    if (length <= 60) return 88;
    if (length <= 110) return 72;
    if (length <= 170) return 60;
    return 48;
  }
  if (length <= 60) return 76;
  if (length <= 110) return 62;
  if (length <= 170) return 52;
  return 42;
}

// Text ke aas-paas ke quotes hata deta hai, kyunki hum apna SVG quote mark dikhate hain
function cleanQuote(text: string): string {
  return text.trim().replace(/^["“”'‘’]+|["“”'‘’]+$/g, '').trim();
}

/* ───────────────────────── Main component ───────────────────────── */

export function QuoteScene({
  scene,
  headingFont = FACELESS_DESIGN_TOKENS.typography.editorialSerif,
  bodyFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  sceneFrame,
  palette,
}: QuoteSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const f = sceneFrame ?? frame;

  /* ── Format detect (16:9 ya 9:16) aur scale ── */
  const isPortrait = height > width;
  const u = isPortrait ? width / 1080 : width / 1920;

  const isDark = palette?.isDark ?? false;
  const bg = isDark ? (palette?.background || '#090D16') : FACELESS_DESIGN_TOKENS.colors.canvasWhite;
  const textColor = isDark ? '#FFFFFF' : FACELESS_DESIGN_TOKENS.colors.textPrimary;
  const quoteMarkColor = FACELESS_DESIGN_TOKENS.colors.accentCoral;
  const accentColor = FACELESS_DESIGN_TOKENS.colors.accentAmber;

  /* ── Data ── */
  const quoteText = cleanQuote(scene.heading || scene.narrationSegment?.text || '');
  const author = scene.quoteAuthor || undefined;
  const words = quoteText.split(/\s+/).filter(Boolean);
  const quoteSize = getQuoteSize(quoteText.length, isPortrait) * u;

  /* ── Animations ── */
  const markIn = spring({ frame: f, fps, config: { damping: 12, mass: 0.8, stiffness: 160 } });

  // Words ek ek karke aate hain (lambi quote me stagger kam, taaki 2 sec ke andar poori aa jaye)
  const WORD_START = 10;
  const stagger = Math.max(1, Math.min(3, Math.floor(50 / Math.max(words.length, 1))));
  const wordsEnd = WORD_START + words.length * stagger;

  const lineGrow = interpolate(f, [wordsEnd + 4, wordsEnd + 24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const authorIn = spring({ frame: f - (wordsEnd + 14), fps, config: { damping: 16, mass: 0.8, stiffness: 140 } });

  // Poore content me bahut halka slow zoom, taaki scene "zinda" lage
  const drift = interpolate(f, [0, Math.max(durationInFrames, 1)], [1.0, 1.035], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isPortrait ? `${140 * u}px ${80 * u}px` : `${100 * u}px ${140 * u}px`,
        zIndex: 10,
        backgroundColor: bg,
        overflow: 'hidden',
      }}
    >
      {/* Background watermark quote mark (bahut halka, depth ke liye) */}
      <div
        style={{
          position: 'absolute',
          top: isPortrait ? 120 * u : 60 * u,
          left: isPortrait ? 40 * u : 90 * u,
          opacity: 0.06 * interpolate(markIn, [0, 1], [0, 1], CLAMP),
          transform: `scale(${interpolate(markIn, [0, 1], [0.85, 1])})`,
          transformOrigin: 'top left',
        }}
      >
        <QuoteMark size={(isPortrait ? 520 : 640) * u} color={quoteMarkColor} />
      </div>

      <div
        style={{
          position: 'relative',
          maxWidth: (isPortrait ? 900 : 1300) * u,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          transform: `scale(${drift})`,
        }}
      >
        {/* Main quote mark */}
        <div
          style={{
            marginBottom: 28 * u,
            opacity: interpolate(markIn, [0, 1], [0, 1], CLAMP),
            transform: `scale(${interpolate(markIn, [0, 1], [0.5, 1])}) rotate(${interpolate(markIn, [0, 1], [-12, 0])}deg)`,
            filter: `drop-shadow(0 ${6 * u}px ${18 * u}px rgba(234, 88, 12, 0.28))`,
          }}
        >
          <QuoteMark size={(isPortrait ? 120 : 104) * u} color={quoteMarkColor} />
        </div>

        {/* Quote text: word-by-word reveal */}
        <div
          style={{
            fontFamily: headingFont,
            fontSize: quoteSize,
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.015em',
            color: textColor,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}
        >
          {words.map((word, i) => {
            const wordIn = spring({
              frame: f - WORD_START - i * stagger,
              fps,
              config: { damping: 16, mass: 0.7, stiffness: 160 },
            });
            return (
              <span
                key={`${word}-${i}`}
                style={{
                  display: 'inline-block',
                  marginRight: '0.28em',
                  opacity: interpolate(wordIn, [0, 1], [0, 1], CLAMP),
                  transform: `translateY(${interpolate(wordIn, [0, 1], [28, 0])}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Author: accent line draw hoti hai, phir naam aata hai */}
        {author && (
          <div
            style={{
              marginTop: 52 * u,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 22 * u,
            }}
          >
            <div
              style={{
                width: 140 * u,
                height: 6 * u,
                backgroundColor: accentColor,
                transform: `scaleX(${lineGrow})`,
                transformOrigin: 'center center',
              }}
            />
            <div
              style={{
                fontFamily: bodyFont,
                fontSize: (isPortrait ? 36 : 30) * u,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: textColor,
                opacity: 0.75 * interpolate(authorIn, [0, 1], [0, 1], CLAMP),
                transform: `translateY(${interpolate(authorIn, [0, 1], [18, 0])}px)`,
              }}
            >
              {author}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}