import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function HudTelemetryPrimitive({
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
  const popSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.34,
      damping: blueprint.animation?.damping ?? 12,
      stiffness: blueprint.animation?.stiffness ?? 250,
    },
  });

  const scale = interpolate(popSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.8, 1.0]);
  const translateY = interpolate(popSpring, [0, 1], [14, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [4, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 124, 54, 12);
  const leadSize = getResponsiveFontSize(lead, 38, 22, 20);
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
      {/* Sci-Fi HUD Coordinates Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: '1px solid rgba(14, 165, 233, 0.5)',
          background: 'rgba(2, 6, 23, 0.85)',
          borderRadius: 4,
          padding: '2px 12px',
          boxShadow: '0 0 12px rgba(14, 165, 233, 0.3)',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            background: '#0EA5E9',
            boxShadow: '0 0 8px #0EA5E9',
          }}
        />
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: leadSize,
            fontWeight: 700,
            color: '#38BDF8',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          {lead ? `SYS.LOC // ${lead}` : 'SYS.LOC // 44.92°N 93.26°W'}
        </span>
      </div>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: heroSize,
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#E0F2FE',
            textShadow: '0 0 16px rgba(14, 165, 233, 0.9), 0 0 32px rgba(2, 132, 199, 0.6), 0 2px 8px #000',
            display: 'block',
            lineHeight: 1.0,
          }}
        >
          {`[ ${hero} ]`}
        </span>
      </div>

      {sub ? (
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.syne,
              fontSize: subSize,
              fontWeight: 600,
              color: '#7DD3FC',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textShadow: '0 0 8px rgba(14, 165, 233, 0.6)',
            }}
          >
            {sub}
          </span>
          <span style={{ color: '#0EA5E9', fontWeight: 900 }}>_</span>
        </div>
      ) : null}
    </div>
  );
}
