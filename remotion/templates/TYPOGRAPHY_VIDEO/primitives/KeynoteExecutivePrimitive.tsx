import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function KeynoteExecutivePrimitive({
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
      mass: blueprint.animation?.mass ?? 0.48,
      damping: blueprint.animation?.damping ?? 16,
      stiffness: blueprint.animation?.stiffness ?? 170,
    },
  });

  const scale = interpolate(riseSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.95, 1.0]);
  const translateY = interpolate(riseSpring, [0, 1], [10, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [4, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 110, 50, 14);
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
        maxWidth: 920,
        padding: '0 24px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1.5px solid rgba(255, 255, 255, 0.22)',
          borderRadius: 24,
          padding: '16px 36px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {lead ? (
          <span
            style={{
              fontFamily: FONTS.inter,
              fontSize: leadSize,
              fontWeight: 600,
              color: '#94A3B8',
              letterSpacing: '0.04em',
              marginBottom: 4,
            }}
          >
            {lead}
          </span>
        ) : null}

        <span
          style={{
            fontFamily: FONTS.inter,
            fontSize: heroSize,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            display: 'block',
            lineHeight: 1.05,
          }}
        >
          {hero}
        </span>

        {sub ? (
          <span
            style={{
              fontFamily: FONTS.inter,
              fontSize: subSize,
              fontWeight: 500,
              color: '#38BDF8',
              letterSpacing: '0.02em',
              marginTop: 6,
            }}
          >
            {sub}
          </span>
        ) : null}
      </div>
    </div>
  );
}
