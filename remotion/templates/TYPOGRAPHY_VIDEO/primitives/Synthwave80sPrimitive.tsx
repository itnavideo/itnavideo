import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function Synthwave80sPrimitive({
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
      stiffness: blueprint.animation?.stiffness ?? 240,
    },
  });

  const scale = interpolate(slamSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.7, 1.0]);
  const translateY = interpolate(slamSpring, [0, 1], [18, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [6, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 130, 58, 11);
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
            fontFamily: FONTS.syne,
            fontSize: leadSize,
            fontWeight: 800,
            color: '#67E8F9',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textShadow: '0 0 12px rgba(6, 182, 212, 0.8), 0 2px 10px rgba(0,0,0,0.9)',
            marginBottom: 4,
          }}
        >
          {lead}
        </span>
      ) : null}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: heroSize,
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            backgroundImage:
              'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 30%, #F472B6 60%, #DB2777 85%, #9D174D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter:
              'drop-shadow(0 3px 0 #831843) drop-shadow(0 0 24px rgba(236, 72, 153, 0.75))',
            display: 'block',
            lineHeight: 1.0,
          }}
        >
          {hero}
        </span>
      </div>

      {sub ? (
        <div
          style={{
            marginTop: 8,
            borderBottom: '2px solid #06B6D4',
            paddingBottom: 2,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.syne,
              fontSize: subSize,
              fontWeight: 800,
              color: '#FDF4FF',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textShadow: '0 0 8px rgba(236, 72, 153, 0.6), 0 2px 8px rgba(0,0,0,0.9)',
            }}
          >
            {sub}
          </span>
        </div>
      ) : null}
    </div>
  );
}
