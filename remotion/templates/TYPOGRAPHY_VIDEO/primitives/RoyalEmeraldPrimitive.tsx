import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function RoyalEmeraldPrimitive({
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
  const emeraldSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation.mass || 0.45,
      damping: blueprint.animation.damping || 14,
      stiffness: blueprint.animation.stiffness || 180,
    },
  });

  const scale = interpolate(emeraldSpring, [0, 1], blueprint.animation.scaleEntrance || [0.88, 1.0]);
  const translateY = interpolate(emeraldSpring, [0, 1], [14, 0]);
  const blurValue = interpolate(localFrame, [0, 4], blueprint.animation.blurEntrance || [4, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const hook = phrase.hookWord || phrase.heroText || phrase.word || '';
  const lead = phrase.leadText || '';
  const subtitle = phrase.subtitleText || phrase.subText || '';

  const hookSize = getResponsiveFontSize(hook, 110, 52, 12);
  const leadSize = getResponsiveFontSize(lead, 44, 26, 20);
  const subtitleSize = getResponsiveFontSize(subtitle, 38, 24, 24);

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
      {/* Context Lead: Elegant Italic Sans / Gold Line */}
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: leadSize,
            fontWeight: 600,
            fontStyle: 'italic',
            color: '#FCD34D',
            letterSpacing: '0.04em',
            marginBottom: 6,
            textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 0 16px rgba(252,211,77,0.4)',
          }}
        >
          {lead}
        </span>
      ) : null}

      {/* Massive 3D Royal Emerald Hero Hook */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: hookSize,
            fontWeight: 900,
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #A7F3D0 30%, #10B981 65%, #047857 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            display: 'inline-block',
            filter: 'drop-shadow(0 3px 0 #065F46) drop-shadow(0 6px 0 #064E3B) drop-shadow(0 12px 24px rgba(0,0,0,0.95))',
          }}
        >
          {hook}
        </span>

        {/* Emerald Aura Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '110%',
            height: '130%',
            background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.22) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 75%)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      </div>

      {/* Synchronized Lower Context Subtitle */}
      {subtitle ? (
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: subtitleSize,
            fontWeight: 600,
            color: '#F8FAFC',
            marginTop: 8,
            letterSpacing: '0.02em',
            textShadow: '0 2px 12px rgba(0,0,0,0.95)',
          }}
        >
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}
