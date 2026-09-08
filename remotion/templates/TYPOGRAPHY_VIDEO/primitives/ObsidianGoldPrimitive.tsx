import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

/**
 * Obsidian Noir & 3D Gold Extrusion Primitive
 *
 * Implements:
 * 1. Captions AI Depth & 3D Layering behind subject
 * 2. Massive multi-layer 3D gold extrusion bevel
 * 3. Obsidian frosted pill capsule with 24k gold border
 * 4. High-impact Plus Jakarta Sans / Bebas Neue Punch
 */
export function ObsidianGoldPrimitive({
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
      mass: blueprint.animation?.mass ?? 0.42,
      damping: blueprint.animation?.damping ?? 13,
      stiffness: blueprint.animation?.stiffness ?? 200,
    },
  });

  const scale = interpolate(popSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.82, 1.0]);
  const translateY = interpolate(popSpring, [0, 1], [16, 0]);
  const blurValue = interpolate(localFrame, [0, 3], [5, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 114, 54, 12);
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
        maxWidth: 960,
        padding: '0 24px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* 3D Depth Pill Container */}
      <div
        style={{
          padding: '18px 36px',
          borderRadius: 28,
          background: 'rgba(5, 5, 8, 0.88)',
          border: '2px solid rgba(234, 179, 8, 0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow:
            '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(234, 179, 8, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Upper Lead Context */}
        {lead ? (
          <span
            style={{
              fontFamily: FONTS.jakarta,
              fontSize: leadSize,
              fontWeight: 800,
              color: '#F8FAFC',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 4,
              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            }}
          >
            {lead}
          </span>
        ) : null}

        {/* Hero Word: 3D Gold Extruded Bevel */}
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: heroSize,
            fontWeight: 900,
            backgroundImage:
              'linear-gradient(180deg, #FFFFFF 0%, #FEF08A 25%, #EAB308 60%, #CA8A04 85%, #854D0E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            display: 'inline-block',
            filter:
              'drop-shadow(0 3px 0 #A16207) drop-shadow(0 6px 0 #78350F) drop-shadow(0 9px 0 #451A03) drop-shadow(0 16px 28px rgba(0,0,0,0.95))',
          }}
        >
          {hero}
        </span>
      </div>

      {/* Sub Context */}
      {sub ? (
        <div style={{ marginTop: 12 }}>
          <span
            style={{
              fontFamily: FONTS.outfit,
              fontSize: subSize,
              fontWeight: 700,
              color: '#FDE047',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(0,0,0,0.95)',
            }}
          >
            {sub}
          </span>
        </div>
      ) : null}
    </div>
  );
}

