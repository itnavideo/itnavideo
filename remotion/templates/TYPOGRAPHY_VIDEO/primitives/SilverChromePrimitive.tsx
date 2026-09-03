import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function SilverChromePrimitive({
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
  const punchSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation.mass || 0.38,
      damping: blueprint.animation.damping || 12,
      stiffness: blueprint.animation.stiffness || 220,
    },
  });

  const scale = interpolate(punchSpring, [0, 1], blueprint.animation.scaleEntrance || [0.7, 1.0]);
  const translateY = interpolate(punchSpring, [0, 1], [12, 0]);
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = phrase.heroText || phrase.word || '';
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 130, 60, 10);
  const leadSize = getResponsiveFontSize(lead, 50, 28, 16);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
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
      {/* Upper Context Lead: Crisp Condensed Silver Tag */}
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.oswald,
            fontSize: leadSize,
            fontWeight: 700,
            color: '#CBD5E1',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
            textShadow: '0 2px 10px rgba(0,0,0,0.95)',
          }}
        >
          {lead}
        </span>
      ) : null}

      {/* Main Liquid Silver Chrome Hero Word */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.oswald,
            fontSize: heroSize,
            fontWeight: 900,
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 25%, #94A3B8 55%, #475569 80%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.02,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            display: 'inline-block',
            filter: 'drop-shadow(0 3px 0 #334155) drop-shadow(0 6px 0 #1E293B) drop-shadow(0 14px 28px rgba(0,0,0,0.95))',
          }}
        >
          {hero}
        </span>

        {/* Ambient Silver Shimmer */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '110%',
            height: '130%',
            background: 'radial-gradient(ellipse at center, rgba(203, 213, 225, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      </div>

      {/* Subtext */}
      {sub ? (
        <span
          style={{
            fontFamily: FONTS.oswald,
            fontSize: 32,
            fontWeight: 700,
            color: '#94A3B8',
            marginTop: 8,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
