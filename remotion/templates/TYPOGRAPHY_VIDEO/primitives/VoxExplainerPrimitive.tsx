import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function VoxExplainerPrimitive({
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
      mass: blueprint.animation?.mass ?? 0.38,
      damping: blueprint.animation?.damping ?? 13,
      stiffness: blueprint.animation?.stiffness ?? 210,
    },
  });

  const scale = interpolate(popSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.85, 1.0]);
  const translateY = interpolate(popSpring, [0, 1], [14, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [4, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 130, 58, 12);
  const leadSize = getResponsiveFontSize(lead, 40, 22, 20);
  const subSize = getResponsiveFontSize(sub, 36, 20, 22);

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
      {/* Vox-Style Coordinate Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#0F172A',
          border: '1.5px solid #FDE047',
          borderRadius: 4,
          padding: '3px 12px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.8)',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.oswald,
            fontSize: leadSize,
            fontWeight: 700,
            color: '#FDE047',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {lead ? `[ ${lead} ]` : '[ FIG. 01 // ANALYSIS ]'}
        </span>
      </div>

      {/* Hero Word inside High-Contrast Yellow Highlight Block */}
      <div
        style={{
          background: '#FDE047',
          padding: '6px 22px',
          borderRadius: 4,
          boxShadow: '0 8px 0 #CA8A04, 0 12px 28px rgba(0,0,0,0.9)',
          transform: 'rotate(-0.5deg)',
        }}
      >
        <span
          style={{
            fontFamily: FONTS.oswald,
            fontSize: heroSize,
            fontWeight: 900,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#0F172A',
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
            fontFamily: FONTS.oswald,
            fontSize: subSize,
            fontWeight: 600,
            color: '#FFFFFF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.95)',
            marginTop: 8,
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
