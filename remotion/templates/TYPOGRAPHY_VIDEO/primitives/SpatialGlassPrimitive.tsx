import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function SpatialGlassPrimitive({
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
      mass: blueprint.animation?.mass ?? 0.44,
      damping: blueprint.animation?.damping ?? 14,
      stiffness: blueprint.animation?.stiffness ?? 190,
    },
  });

  const scale = interpolate(popSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.88, 1.0]);
  const translateY = interpolate(popSpring, [0, 1], [16, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [5, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 120, 54, 12);
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
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 28,
          padding: '20px 42px',
          boxShadow:
            '0 24px 60px rgba(0, 0, 0, 0.75), inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {lead ? (
          <span
            style={{
              fontFamily: FONTS.jakarta,
              fontSize: leadSize,
              fontWeight: 700,
              color: '#93C5FD',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {lead}
          </span>
        ) : null}

        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: heroSize,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            display: 'block',
            lineHeight: 1.05,
          }}
        >
          {hero}
        </span>

        {sub ? (
          <div
            style={{
              marginTop: 8,
              background: 'rgba(96, 165, 250, 0.25)',
              border: '1px solid rgba(147, 197, 253, 0.5)',
              borderRadius: 12,
              padding: '2px 14px',
            }}
          >
            <span
              style={{
                fontFamily: FONTS.jakarta,
                fontSize: subSize,
                fontWeight: 700,
                color: '#BFDBFE',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              {sub}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
