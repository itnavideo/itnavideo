import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function IsometricCubePrimitive({
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
  const cubeSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.4,
      damping: blueprint.animation?.damping ?? 12,
      stiffness: blueprint.animation?.stiffness ?? 220,
    },
  });

  const scale = interpolate(cubeSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.75, 1.0]);
  const translateY = interpolate(cubeSpring, [0, 1], [24, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [5, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 128, 58, 11);
  const leadSize = getResponsiveFontSize(lead, 42, 24, 18);
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
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.montserrat,
            fontSize: leadSize,
            fontWeight: 800,
            color: '#DDD6FE',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
            marginBottom: 4,
          }}
        >
          {lead}
        </span>
      ) : null}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.montserrat,
            fontSize: heroSize,
            fontWeight: 900,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            textShadow:
              '2px 2px 0 #7C3AED, 4px 4px 0 #6D28D9, 6px 6px 0 #5B21B6, 8px 8px 0 #4C1D95, 10px 10px 0 #2E1065, 14px 14px 28px rgba(0,0,0,0.95)',
            display: 'block',
            lineHeight: 1.0,
          }}
        >
          {hero}
        </span>
      </div>

      {sub ? (
        <span
          style={{
            fontFamily: FONTS.montserrat,
            fontSize: subSize,
            fontWeight: 800,
            color: '#A78BFA',
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
