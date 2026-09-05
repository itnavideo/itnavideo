import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

/**
 * Monarch Amethyst & Royal Gold Luxe Primitive
 *
 * Implements:
 * 1. High-status Cinzel Serif Roman Typography
 * 2. Royal Amethyst & Liquid Gold multi-stop gradient
 * 3. Deep purple ambient halo & luxury gold crest accents
 * 4. Scale & snap spring entrance with heavy velvet blur
 */
export function MonarchVioletPrimitive({
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
  const monarchSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.48,
      damping: blueprint.animation?.damping ?? 15,
      stiffness: blueprint.animation?.stiffness ?? 175,
    },
  });

  const scale = interpolate(monarchSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.88, 1.0]);
  const translateY = interpolate(monarchSpring, [0, 1], [15, 0]);
  const blurValue = interpolate(localFrame, [0, 3], [5, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 122, 56, 12);
  const leadSize = getResponsiveFontSize(lead, 44, 26, 18);
  const subSize = getResponsiveFontSize(sub, 36, 22, 22);

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
      {/* Upper Context Lead: Champagne Gold Serif Accent */}
      {lead ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 6,
          }}
        >
          <span style={{ color: '#FACC15', fontSize: 14 }}>✦</span>
          <span
            style={{
              fontFamily: FONTS.cinzel,
              fontSize: leadSize,
              fontWeight: 700,
              color: '#F3E8FF',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textShadow: '0 2px 12px rgba(0,0,0,0.95), 0 0 16px rgba(147, 51, 234, 0.5)',
            }}
          >
            {lead}
          </span>
          <span style={{ color: '#FACC15', fontSize: 14 }}>✦</span>
        </div>
      ) : null}

      {/* Hero Word: Royal Amethyst Extruded Gradient */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.cinzel,
            fontSize: heroSize,
            fontWeight: 900,
            backgroundImage:
              'linear-gradient(180deg, #FFFFFF 0%, #F5D0FE 25%, #C084FC 55%, #9333EA 80%, #581C87 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.05,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            display: 'inline-block',
            filter:
              'drop-shadow(0 3px 0 #581C87) drop-shadow(0 6px 0 #3B0764) drop-shadow(0 14px 28px rgba(0,0,0,0.95))',
          }}
        >
          {hero}
        </span>

        {/* Ambient Amethyst Glow Halo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '125%',
            height: '140%',
            background:
              'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(88, 28, 135, 0.15) 50%, transparent 75%)',
            filter: 'blur(32px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      </div>

      {/* Sub Context: Velvet Amethyst Pill with Gold Hairline */}
      {sub ? (
        <div
          style={{
            marginTop: 12,
            padding: '6px 22px',
            borderRadius: 9999,
            background: 'rgba(24, 9, 43, 0.85)',
            border: '1px solid rgba(250, 204, 21, 0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(147, 51, 234, 0.35)',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.outfit,
              fontSize: subSize,
              fontWeight: 600,
              color: '#FDE047',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {sub}
          </span>
        </div>
      ) : null}
    </div>
  );
}

