import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function ViralRedlinePrimitive({
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
  const slamSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.36,
      damping: blueprint.animation?.damping ?? 12,
      stiffness: blueprint.animation?.stiffness ?? 230,
    },
  });

  const scale = interpolate(slamSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.72, 1.0]);
  const translateY = interpolate(slamSpring, [0, 1], [18, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [5, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 126, 56, 12);
  const leadSize = getResponsiveFontSize(lead, 44, 24, 18);
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
        padding: '0 24px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(239, 68, 68, 0.95)',
          border: '2px solid #FCA5A5',
          borderRadius: 8,
          padding: '4px 16px',
          boxShadow: '0 0 24px rgba(239,68,68,0.7)',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 0 8px #FFFFFF',
          }}
        />
        <span
          style={{
            fontFamily: FONTS.montserrat,
            fontSize: leadSize,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {lead || 'CRITICAL UPDATE'}
        </span>
      </div>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.montserrat,
            fontSize: heroSize,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            textShadow: '0 4px 0 #991B1B, 0 8px 24px rgba(0,0,0,0.9), 0 0 30px rgba(239,68,68,0.5)',
            display: 'block',
            lineHeight: 1.0,
          }}
        >
          {hero}
        </span>
        {/* Red Warning Underline Bar */}
        <div
          style={{
            height: 6,
            width: '100%',
            background: 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)',
            borderRadius: 3,
            marginTop: 6,
            boxShadow: '0 0 16px #EF4444',
          }}
        />
      </div>

      {sub ? (
        <span
          style={{
            fontFamily: FONTS.montserrat,
            fontSize: subSize,
            fontWeight: 800,
            color: '#FECACA',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
            marginTop: 8,
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
