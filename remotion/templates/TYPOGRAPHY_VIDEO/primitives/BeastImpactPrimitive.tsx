import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function BeastImpactPrimitive({
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
  const bounceSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.35,
      damping: blueprint.animation?.damping ?? 11,
      stiffness: blueprint.animation?.stiffness ?? 250,
    },
  });

  const scale = interpolate(bounceSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.6, 1.05]);
  const translateY = interpolate(bounceSpring, [0, 1], [25, 0]);
  const tilt = interpolate(bounceSpring, [0, 0.5, 1], [4, -2, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [5, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 150, 68, 9);
  const leadSize = getResponsiveFontSize(lead, 46, 26, 16);
  const subSize = getResponsiveFontSize(sub, 42, 24, 18);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px) scale(${scale}) rotate(${tilt}deg)`,
        filter: `blur(${blurValue}px)`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        maxWidth: 980,
        padding: '0 24px',
        margin: '0 auto',
      }}
    >
      {lead ? (
        <div
          style={{
            background: '#F43F5E',
            border: '4px solid #FFFFFF',
            borderRadius: 12,
            padding: '4px 20px',
            boxShadow: '0 6px 0 #9F1239, 0 10px 20px rgba(0,0,0,0.8)',
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.bebas,
              fontSize: leadSize,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'block',
              lineHeight: 1.0,
            }}
          >
            {lead}
          </span>
        </div>
      ) : null}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.bebas,
            fontSize: heroSize,
            fontWeight: 900,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: '#38BDF8',
            WebkitTextStroke: '10px #0F172A',
            paintOrder: 'stroke fill',
            textShadow: '0 6px 0 #0284C7, 0 12px 0 #0369A1, 0 18px 0 #0F172A, 0 24px 35px rgba(0,0,0,0.95)',
            display: 'block',
            lineHeight: 0.95,
          }}
        >
          {hero}
        </span>
      </div>

      {sub ? (
        <span
          style={{
            fontFamily: FONTS.bebas,
            fontSize: subSize,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            WebkitTextStroke: '5px #000000',
            paintOrder: 'stroke fill',
            textShadow: '0 6px 0 #000000, 0 10px 20px rgba(0,0,0,0.8)',
            marginTop: 6,
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
