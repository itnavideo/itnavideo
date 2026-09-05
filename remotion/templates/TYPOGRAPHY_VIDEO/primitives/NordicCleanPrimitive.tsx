import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function NordicCleanPrimitive({
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
  const riseSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.52,
      damping: blueprint.animation?.damping ?? 16,
      stiffness: blueprint.animation?.stiffness ?? 160,
    },
  });

  const scale = interpolate(riseSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.96, 1.0]);
  const translateY = interpolate(riseSpring, [0, 1], [10, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [4, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 116, 52, 13);
  const leadSize = getResponsiveFontSize(lead, 36, 20, 22);
  const subSize = getResponsiveFontSize(sub, 32, 18, 24);

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
        maxWidth: 920,
        padding: '0 24px',
        margin: '0 auto',
      }}
    >
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.outfit,
            fontSize: leadSize,
            fontWeight: 500,
            color: '#94A3B8',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {lead}
        </span>
      ) : null}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.outfit,
            fontSize: heroSize,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#F8FAFC',
            textShadow: '0 4px 16px rgba(0,0,0,0.85)',
            display: 'block',
            lineHeight: 1.15,
          }}
        >
          {hero}
        </span>
        <div
          style={{
            height: 2,
            width: '60%',
            margin: '8px auto 0',
            background: 'rgba(148, 163, 184, 0.5)',
          }}
        />
      </div>

      {sub ? (
        <span
          style={{
            fontFamily: FONTS.outfit,
            fontSize: subSize,
            fontWeight: 400,
            color: '#CBD5E1',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginTop: 8,
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
