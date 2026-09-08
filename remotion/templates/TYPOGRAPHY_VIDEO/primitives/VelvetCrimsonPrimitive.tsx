import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

/**
 * Velvet Crimson & Rose Gold Luxe Primitive
 *
 * Implements:
 * 1. Editorial Luxury Serif (Playfair Display Italic) + Clean Outfit Sans Pairing
 * 2. Rose Gold & Velvet Crimson metallic gradient
 * 3. Deep royal ruby halo & ambient sparkle accents
 * 4. Scale & snap spring entrance with subtle blur fade
 */
export function VelvetCrimsonPrimitive({
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
  const velvetSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.45,
      damping: blueprint.animation?.damping ?? 14,
      stiffness: blueprint.animation?.stiffness ?? 190,
    },
  });

  const scale = interpolate(velvetSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.9, 1.0]);
  const translateY = interpolate(velvetSpring, [0, 1], [14, 0]);
  const blurValue = interpolate(localFrame, [0, 3], [5, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 120, 56, 12);
  const leadSize = getResponsiveFontSize(lead, 46, 26, 18);
  const subSize = getResponsiveFontSize(sub, 38, 22, 22);

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
      {/* Upper Context Lead: Italic Serif with Rose Gold Accent */}
      {lead ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span style={{ color: '#FB7185', fontSize: 16 }}>✦</span>
          <span
            style={{
              fontFamily: FONTS.playfair,
              fontStyle: 'italic',
              fontSize: leadSize,
              fontWeight: 600,
              color: '#FFF1F2',
              letterSpacing: '0.03em',
              textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 16px rgba(225, 29, 72, 0.4)',
            }}
          >
            {lead}
          </span>
          <span style={{ color: '#FB7185', fontSize: 16 }}>✦</span>
        </div>
      ) : null}

      {/* Hero Word: Rose Gold & Velvet Crimson Extruded Gradient */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.playfair,
            fontSize: heroSize,
            fontWeight: 900,
            backgroundImage:
              'linear-gradient(135deg, #FFFFFF 0%, #FFE4E6 20%, #FDA4AF 40%, #FB7185 65%, #E11D48 85%, #9F1239 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            display: 'inline-block',
            filter:
              'drop-shadow(0 3px 0 #881337) drop-shadow(0 6px 0 #4C0519) drop-shadow(0 14px 28px rgba(0,0,0,0.95))',
          }}
        >
          {hero}
        </span>

        {/* Ambient Crimson Glow Halo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '140%',
            background:
              'radial-gradient(circle, rgba(225, 29, 72, 0.38) 0%, rgba(159, 18, 57, 0.12) 50%, transparent 75%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      </div>

      {/* Sub Context: Velvet Frosted Capsule Pill */}
      {sub ? (
        <div
          style={{
            marginTop: 12,
            padding: '6px 20px',
            borderRadius: 9999,
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(251, 113, 133, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 18px rgba(225, 29, 72, 0.25)',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.outfit,
              fontSize: subSize,
              fontWeight: 600,
              color: '#FFE4E6',
              letterSpacing: '0.03em',
            }}
          >
            {sub}
          </span>
        </div>
      ) : null}
    </div>
  );
}

