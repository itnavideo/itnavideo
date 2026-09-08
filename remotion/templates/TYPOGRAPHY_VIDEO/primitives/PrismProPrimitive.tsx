import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function PrismProPrimitive({
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
  const prismSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation.mass || 0.45,
      damping: blueprint.animation.damping || 14,
      stiffness: blueprint.animation.stiffness || 200,
    },
  });

  const scale = interpolate(prismSpring, [0, 1], blueprint.animation.scaleEntrance || [0.88, 1.0]);
  const translateY = interpolate(prismSpring, [0, 1], [12, 0]);
  const blurValue = interpolate(localFrame, [0, 4], blueprint.animation.blurEntrance || [6, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = phrase.heroText || phrase.word || '';
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 100, 50, 12);
  const leadSize = getResponsiveFontSize(lead, 46, 28, 18);

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
        position: 'relative',
      }}
    >
      {/* Upper Context Lead */}
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: leadSize,
            fontWeight: 700,
            color: '#F8FAFC',
            letterSpacing: '0.02em',
            marginBottom: 6,
            textShadow: '0 2px 12px rgba(0,0,0,0.95)',
          }}
        >
          {lead}
        </span>
      ) : null}

      {/* Main Prismatic Cyan-to-Indigo Hero Keyword */}
      <div
        style={{
          display: 'inline-block',
          position: 'relative',
          padding: '6px 20px',
          borderRadius: 16,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.25)',
        }}
      >
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: heroSize,
            fontWeight: 800,
            backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #E0F2FE 25%, #38BDF8 60%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            display: 'inline-block',
            textShadow: '0 0 24px rgba(56, 189, 248, 0.6)',
          }}
        >
          {hero}
        </span>
      </div>

      {/* Subtext */}
      {sub ? (
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: 30,
            fontWeight: 600,
            color: '#CBD5E1',
            marginTop: 8,
            letterSpacing: '0.02em',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
