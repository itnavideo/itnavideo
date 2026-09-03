import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function DubaiGoldPrimitive({
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
  const goldSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation.mass || 0.45,
      damping: blueprint.animation.damping || 14,
      stiffness: blueprint.animation.stiffness || 180,
    },
  });

  const scale = interpolate(goldSpring, [0, 1], blueprint.animation.scaleEntrance || [0.9, 1.0]);
  const translateY = interpolate(goldSpring, [0, 1], [14, 0]);
  const blurValue = interpolate(localFrame, [0, 3], [4, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 130, 60, 10);
  const leadSize = getResponsiveFontSize(lead, 52, 30, 16);
  const subSize = getResponsiveFontSize(sub, 42, 26, 20);

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
        padding: '0 24px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Upper Context Lead: Clean White Architectural Sans */}
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.outfit,
            fontSize: leadSize,
            fontWeight: 600,
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            marginBottom: 8,
            textShadow: '0 4px 18px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.95)',
          }}
        >
          {lead}
        </span>
      ) : null}

      {/* Hero Word: 24k Gold Cinzel Luxury Serif with Extrusion Bevel */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.cinzel,
            fontSize: heroSize,
            fontWeight: 900,
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFFBEB 20%, #FDE047 45%, #EAB308 75%, #CA8A04 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            display: 'inline-block',
            filter: 'drop-shadow(0 3px 0 #A16207) drop-shadow(0 6px 0 #78350F) drop-shadow(0 14px 28px rgba(0,0,0,0.95))',
          }}
        >
          {hero}
        </span>

        {/* Ambient Gold Halo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '115%',
            height: '135%',
            background: 'radial-gradient(ellipse at center, rgba(234, 179, 8, 0.2) 0%, rgba(161, 98, 7, 0.05) 50%, transparent 75%)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      </div>

      {/* Subtext */}
      {sub ? (
        <span
          style={{
            fontFamily: FONTS.outfit,
            fontSize: subSize,
            fontWeight: 600,
            color: '#E2E8F0',
            marginTop: 10,
            letterSpacing: '0.04em',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
