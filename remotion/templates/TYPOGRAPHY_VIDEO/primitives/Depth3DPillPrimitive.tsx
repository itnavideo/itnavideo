import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function Depth3DPillPrimitive({
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
  const depthSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation.mass || 0.45,
      damping: blueprint.animation.damping || 14,
      stiffness: blueprint.animation.stiffness || 190,
    },
  });

  const scale = interpolate(depthSpring, [0, 1], blueprint.animation.scaleEntrance || [0.85, 1.0]);
  const translateY = interpolate(depthSpring, [0, 1], [14, 0]);
  const blurValue = interpolate(localFrame, [0, 4], blueprint.animation.blurEntrance || [4, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = phrase.heroText || phrase.word || '';
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 96, 48, 12);
  const leadSize = getResponsiveFontSize(lead, 46, 28, 18);

  const pillColor = '#FACC15';

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
      {/* Upper Context Lead: Crisp White Sans */}
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: leadSize,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            marginBottom: 8,
            textShadow: '0 4px 16px rgba(0,0,0,0.95)',
          }}
        >
          {lead}
        </span>
      ) : null}

      {/* Emphasized 3D Glowing Glass Capsule Pill */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.88)',
          border: `2px solid ${pillColor}`,
          padding: '10px 32px',
          borderRadius: 9999,
          boxShadow: `0 12px 35px rgba(0,0,0,0.85), 0 0 28px rgba(250, 204, 21, 0.55)`,
          backdropFilter: 'blur(8px)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: heroSize,
            fontWeight: 900,
            color: pillColor,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            display: 'inline-block',
            textShadow: '0 2px 8px rgba(0,0,0,0.95)',
          }}
        >
          {hero}
        </span>
      </div>

      {/* Subtext */}
      {sub ? (
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: 32,
            fontWeight: 600,
            color: '#E2E8F0',
            marginTop: 10,
            letterSpacing: '0.02em',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
