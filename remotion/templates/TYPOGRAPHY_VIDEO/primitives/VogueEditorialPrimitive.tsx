import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function VogueEditorialPrimitive({
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
      mass: blueprint.animation?.mass ?? 0.5,
      damping: blueprint.animation?.damping ?? 15,
      stiffness: blueprint.animation?.stiffness ?? 170,
    },
  });

  const scale = interpolate(riseSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.94, 1.0]);
  const translateY = interpolate(riseSpring, [0, 1], [14, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [5, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 126, 56, 12);
  const leadSize = getResponsiveFontSize(lead, 36, 20, 22);
  const subSize = getResponsiveFontSize(sub, 34, 18, 24);

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
            fontFamily: FONTS.bodoni,
            fontSize: leadSize,
            fontWeight: 500,
            color: '#FDA4AF',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
            marginBottom: 6,
          }}
        >
          {lead}
        </span>
      ) : null}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.bodoni,
            fontSize: heroSize,
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            textShadow: '0 4px 20px rgba(244,63,94,0.4), 0 2px 8px rgba(0,0,0,0.9)',
            display: 'block',
            lineHeight: 1.05,
          }}
        >
          {hero}
        </span>
      </div>

      {sub ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <div style={{ width: 24, height: 1, background: '#F43F5E' }} />
          <span
            style={{
              fontFamily: FONTS.bodoni,
              fontSize: subSize,
              fontWeight: 500,
              color: '#FFF1F2',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(0,0,0,0.9)',
            }}
          >
            {sub}
          </span>
          <div style={{ width: 24, height: 1, background: '#F43F5E' }} />
        </div>
      ) : null}
    </div>
  );
}
