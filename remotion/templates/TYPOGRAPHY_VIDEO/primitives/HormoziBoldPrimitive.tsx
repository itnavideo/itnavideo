import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function HormoziBoldPrimitive({
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
      mass: blueprint.animation?.mass ?? 0.3,
      damping: blueprint.animation?.damping ?? 10,
      stiffness: blueprint.animation?.stiffness ?? 280,
    },
  });

  const scale = interpolate(popSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.65, 1.0]);
  const translateY = interpolate(popSpring, [0, 1], [15, 0]);
  const rotate = interpolate(popSpring, [0, 1], [-4, -2]);
  const blurValue = interpolate(localFrame, [0, 2], [4, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 136, 62, 10);
  const leadSize = getResponsiveFontSize(lead, 48, 28, 16);
  const subSize = getResponsiveFontSize(sub, 40, 24, 20);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
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
        <span
          style={{
            fontFamily: FONTS.montserrat,
            fontSize: leadSize,
            fontWeight: 900,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            WebkitTextStroke: '6px #000000',
            paintOrder: 'stroke fill',
            textShadow: '0 8px 0 #000000, 0 12px 24px rgba(0,0,0,0.9)',
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
            fontStyle: 'italic',
            color: '#FACC15',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            WebkitTextStroke: '12px #000000',
            paintOrder: 'stroke fill',
            textShadow: '0 10px 0 #000000, 0 16px 30px rgba(0,0,0,0.95)',
            display: 'block',
            lineHeight: 0.95,
          }}
        >
          {hero}
        </span>
      </div>

      {sub ? (
        <div
          style={{
            marginTop: 10,
            background: '#4ADE80',
            border: '4px solid #000000',
            borderRadius: 14,
            padding: '4px 18px',
            boxShadow: '0 6px 0 #000000',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.montserrat,
              fontSize: subSize,
              fontWeight: 900,
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'block',
              lineHeight: 1.1,
            }}
          >
            {sub}
          </span>
        </div>
      ) : null}
    </div>
  );
}
