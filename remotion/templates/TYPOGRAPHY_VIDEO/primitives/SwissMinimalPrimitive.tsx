import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

/**
 * Swiss Bauhaus & Architectural Studio Primitive
 *
 * Implements:
 * 1. Geometric high-contrast Sans (Inter / Outfit) with wide tracking
 * 2. Stark Obsidian & Pure Ice-White with architectural micro-typography
 * 3. Minimalist 1px hairline frosted glass studio card with corner crosshairs (+)
 * 4. Micro index indicator `// 01 ARCHITECTURE`
 */
export function SwissMinimalPrimitive({
  phrase,
  localFrame,
  fps,
  blueprint,
}: {
  phrase: KineticPhrase;
  localFrame: number;
  fps: number;
  blueprint: StyleBlueprint;
}) {
  const swissSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.55,
      damping: blueprint.animation?.damping ?? 16,
      stiffness: blueprint.animation?.stiffness ?? 160,
    },
  });

  const scale = interpolate(swissSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.94, 1.0]);
  const translateY = interpolate(swissSpring, [0, 1], [14, 0]);
  const blurValue = interpolate(localFrame, [0, 3], [5, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 98, 48, 14);
  const leadSize = getResponsiveFontSize(lead, 38, 22, 22);
  const subSize = getResponsiveFontSize(sub, 32, 18, 26);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        filter: `blur(${blurValue}px)`,
        opacity,
        width: '100%',
        maxWidth: 820,
        margin: '0 auto',
        padding: '24px 32px',
        background: 'rgba(9, 9, 11, 0.82)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: 16,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
      }}
    >
      {/* Corner Crosshairs */}
      <span
        style={{
          position: 'absolute',
          top: 8,
          left: 10,
          fontFamily: FONTS.inter,
          fontSize: 12,
          color: 'rgba(255,255,255,0.4)',
          fontWeight: 400,
        }}
      >
        +
      </span>
      <span
        style={{
          position: 'absolute',
          top: 8,
          right: 10,
          fontFamily: FONTS.inter,
          fontSize: 12,
          color: 'rgba(255,255,255,0.4)',
          fontWeight: 400,
        }}
      >
        +
      </span>

      {/* Top Architectural Header */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: 10,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.inter,
            fontSize: 11,
            fontWeight: 700,
            color: '#A1A1AA',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          // KEYNOTE ARCHITECTURE
        </span>
        <span
          style={{
            fontFamily: FONTS.inter,
            fontSize: 11,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.1em',
          }}
        >
          01 / STUDIO
        </span>
      </div>

      {/* Context Lead */}
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.inter,
            fontSize: leadSize,
            fontWeight: 500,
            color: '#D4D4D8',
            letterSpacing: '0.04em',
            marginBottom: 4,
          }}
        >
          {lead}
        </span>
      ) : null}

      {/* Hero Text: Bold Architectural Precision */}
      <span
        style={{
          fontFamily: FONTS.inter,
          fontSize: heroSize,
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          display: 'block',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
        }}
      >
        {hero}
      </span>

      {/* Sub Context */}
      {sub ? (
        <div
          style={{
            marginTop: 14,
            paddingTop: 10,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.inter,
              fontSize: subSize,
              fontWeight: 500,
              color: '#A1A1AA',
              letterSpacing: '0.02em',
            }}
          >
            {sub}
          </span>
        </div>
      ) : null}
    </div>
  );
}

