import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function NeonCyberLuxuryPrimitive({
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
  const neonSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation.mass || 0.35,
      damping: blueprint.animation.damping || 11,
      stiffness: blueprint.animation.stiffness || 240,
    },
  });

  const scale = interpolate(neonSpring, [0, 1], blueprint.animation.scaleEntrance || [0.75, 1.0]);
  const translateY = interpolate(neonSpring, [0, 1], [12, 0]);
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });
  const glitchJitter = (Math.sin(localFrame * 2.8) * 1.5) * (localFrame < 6 ? 1 : 0);

  const lead = phrase.leadText || '';
  const hero = phrase.heroText || phrase.word || '';
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 110, 52, 12);
  const leadSize = getResponsiveFontSize(lead, 48, 28, 16);

  // High-voltage Electric Cyan & Neon Magenta dual bloom
  const cyanColor = '#22D3EE';
  const magentaColor = '#F43F5E';

  return (
    <div
      style={{
        transform: `translateY(${translateY + glitchJitter}px) scale(${scale})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        maxWidth: 960,
        padding: '0 24px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Upper Context Lead: Cyber Uppercase Tag */}
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: leadSize,
            fontWeight: 800,
            color: cyanColor,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 6,
            textShadow: `0 0 16px ${cyanColor}, 0 0 32px rgba(34, 211, 238, 0.6), 0 2px 8px rgba(0,0,0,0.95)`,
          }}
        >
          {lead}
        </span>
      ) : null}

      {/* Main Cyber Display Hero Keyword */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: heroSize,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            display: 'inline-block',
            textShadow: `
              0 0 10px #FFFFFF,
              0 0 25px ${cyanColor},
              0 0 45px ${cyanColor},
              0 0 70px ${magentaColor},
              0 4px 14px rgba(0,0,0,0.95)
            `,
            filter: 'drop-shadow(0 0 18px rgba(34, 211, 238, 0.8))',
          }}
        >
          {hero}
        </span>

        {/* Ambient Neon Edge Flare */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '140%',
            background: 'radial-gradient(ellipse at center, rgba(34, 211, 238, 0.15) 0%, rgba(244, 63, 94, 0.08) 50%, transparent 75%)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      </div>

      {/* Subtext */}
      {sub ? (
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: 28,
            fontWeight: 700,
            color: '#F8FAFC',
            marginTop: 10,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
