import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function PlatinumMinimalPrimitive({
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
  const minimalSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation.mass || 0.65,
      damping: blueprint.animation.damping || 18,
      stiffness: blueprint.animation.stiffness || 130,
    },
  });

  const scale = interpolate(minimalSpring, [0, 1], blueprint.animation.scaleEntrance || [0.95, 1.0]);
  const translateY = interpolate(minimalSpring, [0, 1], [12, 0]);
  const blurValue = interpolate(localFrame, [0, 4], blueprint.animation.blurEntrance || [6, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = phrase.heroText || phrase.word || '';
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 110, 52, 12);
  const leadSize = getResponsiveFontSize(lead, 44, 26, 18);
  const subSize = getResponsiveFontSize(sub, 36, 22, 22);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        filter: `blur(${blurValue}px)`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        maxWidth: 960,
        padding: '0 32px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Upper Context Lead: Refined Spaced Small Caps */}
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.cinzel,
            fontSize: leadSize,
            fontWeight: 600,
            color: '#E2E8F0',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 8,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          {lead}
        </span>
      ) : null}

      {/* Main Platinum Monochrome Hero Headline */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.cinzel,
            fontSize: heroSize,
            fontWeight: 700,
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 35%, #CBD5E1 70%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.08,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'inline-block',
            textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 0 16px rgba(226,232,240,0.3)',
          }}
        >
          {hero}
        </span>
      </div>

      {/* Subtext */}
      {sub ? (
        <span
          style={{
            fontFamily: FONTS.cinzel,
            fontSize: subSize,
            fontWeight: 600,
            color: '#94A3B8',
            marginTop: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
