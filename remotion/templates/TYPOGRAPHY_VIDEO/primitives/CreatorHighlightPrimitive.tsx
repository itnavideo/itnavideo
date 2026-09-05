import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function CreatorHighlightPrimitive({
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
      mass: blueprint.animation?.mass ?? 0.45,
      damping: blueprint.animation?.damping ?? 15,
      stiffness: blueprint.animation?.stiffness ?? 180,
    },
  });

  const scale = interpolate(riseSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.92, 1.0]);
  const translateY = interpolate(riseSpring, [0, 1], [14, 0]);
  const highlightWidth = interpolate(localFrame, [2, 10], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blurValue = interpolate(localFrame, [0, 2], [4, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 114, 52, 13);
  const leadSize = getResponsiveFontSize(lead, 42, 24, 20);
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
        maxWidth: 940,
        padding: '0 24px',
        margin: '0 auto',
      }}
    >
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: leadSize,
            fontWeight: 600,
            color: '#F8FAFC',
            letterSpacing: '0.01em',
            textShadow: '0 2px 10px rgba(0,0,0,0.85)',
            marginBottom: 4,
          }}
        >
          {lead}
        </span>
      ) : null}

      <div style={{ position: 'relative', display: 'inline-block', padding: '2px 12px' }}>
        {/* Animated Yellow Marker Highlighter Sweep */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: '8%',
            height: '65%',
            width: `${highlightWidth}%`,
            background: 'rgba(250, 204, 21, 0.92)',
            borderRadius: 6,
            transform: 'rotate(-1deg)',
            zIndex: 0,
            boxShadow: '0 4px 14px rgba(250,204,21,0.3)',
          }}
        />

        <span
          style={{
            position: 'relative',
            zIndex: 1,
            fontFamily: FONTS.jakarta,
            fontSize: heroSize,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: '#0F172A',
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
            fontFamily: FONTS.jakarta,
            fontSize: subSize,
            fontWeight: 600,
            color: '#E2E8F0',
            letterSpacing: '0.02em',
            textShadow: '0 2px 8px rgba(0,0,0,0.85)',
            marginTop: 6,
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
