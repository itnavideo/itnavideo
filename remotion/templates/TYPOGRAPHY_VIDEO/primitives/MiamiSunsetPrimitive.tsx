import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

/**
 * Miami Sunset Kinetic & Electric Coral Primitive
 *
 * Implements:
 * 1. Ultra-heavy 900 Sans (Montserrat / Plus Jakarta Sans)
 * 2. Multi-stop Sunset Horizon gradient (Sun Gold -> Coral -> Hot Pink -> Violet)
 * 3. High-velocity elastic slam with dual-tone drop shadow
 * 4. Vibrant glowing sunset aura
 */
export function MiamiSunsetPrimitive({
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
  const sunsetSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.38,
      damping: blueprint.animation?.damping ?? 11,
      stiffness: blueprint.animation?.stiffness ?? 230,
    },
  });

  const scale = interpolate(sunsetSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.72, 1.0]);
  const translateY = interpolate(sunsetSpring, [0, 1], [18, 0]);
  const rotate = interpolate(sunsetSpring, [0, 1], [-2, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [6, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 126, 58, 11);
  const leadSize = getResponsiveFontSize(lead, 46, 26, 18);
  const subSize = getResponsiveFontSize(sub, 36, 22, 22);

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
        maxWidth: 960,
        padding: '0 24px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Lead Text: Crisp Warm White with Sunset Glow */}
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.montserrat,
            fontSize: leadSize,
            fontWeight: 800,
            color: '#FFFBEB',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 6,
            textShadow: '0 4px 16px rgba(0,0,0,0.9), 0 0 20px rgba(244, 63, 94, 0.5)',
          }}
        >
          {lead}
        </span>
      ) : null}

      {/* Hero Word: Multi-Stop Sunset Horizon Gradient */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.montserrat,
            fontSize: heroSize,
            fontWeight: 900,
            backgroundImage:
              'linear-gradient(135deg, #FFFBEB 0%, #FBBF24 20%, #F43F5E 55%, #E11D48 80%, #9333EA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.02,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            display: 'inline-block',
            filter:
              'drop-shadow(0 4px 0 #831843) drop-shadow(0 8px 0 #4C0519) drop-shadow(0 16px 28px rgba(244, 63, 94, 0.45))',
          }}
        >
          {hero}
        </span>

        {/* Ambient Sunset Glow Flare */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '130%',
            height: '140%',
            background:
              'radial-gradient(circle, rgba(244, 63, 94, 0.35) 0%, rgba(251, 191, 36, 0.15) 50%, transparent 75%)',
            filter: 'blur(34px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      </div>

      {/* Sub Context: Rounded Coral Pill Badge */}
      {sub ? (
        <div
          style={{
            marginTop: 12,
            padding: '6px 22px',
            borderRadius: 9999,
            background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)',
            border: '1.5px solid rgba(251, 191, 36, 0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 20px rgba(244, 63, 94, 0.35)',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.jakarta,
              fontSize: subSize,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.03em',
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

