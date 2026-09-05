import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function GadzhiDocumentaryPrimitive({
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
  const driftSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.55,
      damping: blueprint.animation?.damping ?? 16,
      stiffness: blueprint.animation?.stiffness ?? 160,
    },
  });

  const scale = interpolate(driftSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.92, 1.0]);
  const translateY = interpolate(driftSpring, [0, 1], [12, 0]);
  const blurValue = interpolate(localFrame, [0, 3], [6, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 120, 54, 12);
  const leadSize = getResponsiveFontSize(lead, 38, 22, 22);
  const subSize = getResponsiveFontSize(sub, 34, 20, 24);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 36, height: 1, background: 'rgba(245, 158, 11, 0.6)' }} />
          <span
            style={{
              fontFamily: FONTS.cinzel,
              fontSize: leadSize,
              fontWeight: 700,
              color: '#FDE68A',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {lead}
          </span>
          <div style={{ width: 36, height: 1, background: 'rgba(245, 158, 11, 0.6)' }} />
        </div>
      ) : null}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.cinzel,
            fontSize: heroSize,
            fontWeight: 900,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FEF3C7 35%, #F59E0B 75%, #B45309 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 0 #78350F) drop-shadow(0 8px 20px rgba(245, 158, 11, 0.35))',
            display: 'block',
            lineHeight: 1.05,
          }}
        >
          {hero}
        </span>
      </div>

      {sub ? (
        <span
          style={{
            fontFamily: FONTS.cinzel,
            fontSize: subSize,
            fontWeight: 600,
            color: '#F1F5F9',
            letterSpacing: '0.12em',
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
