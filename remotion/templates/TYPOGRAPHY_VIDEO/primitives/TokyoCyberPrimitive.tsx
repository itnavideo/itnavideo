import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

/**
 * Tokyo Cyber Neon & Terminal Hacker Primitive
 *
 * Implements:
 * 1. Futuristic Syne / Outfit monospace-inspired heavy punch
 * 2. Electric Lime & Matrix Green gradient text with neon drop-shadow
 * 3. Cyber bracket framing `[ HERO ]` with terminal cursor `_`
 * 4. Micro-tag metadata badge `SYS.TERMINAL // 01`
 */
export function TokyoCyberPrimitive({
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
  const cyberSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.35,
      damping: blueprint.animation?.damping ?? 12,
      stiffness: blueprint.animation?.stiffness ?? 240,
    },
  });

  const scale = interpolate(cyberSpring, [0, 1], blueprint.animation?.scaleEntrance ?? [0.75, 1.0]);
  const translateY = interpolate(cyberSpring, [0, 1], [16, 0]);
  const blurValue = interpolate(localFrame, [0, 2], [6, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  // Blinking terminal cursor (toggles every 8 frames)
  const showCursor = Math.floor(localFrame / 8) % 2 === 0;

  const lead = phrase.leadText || '';
  const hero = (phrase.heroText || phrase.word || '').replace(/[.,!?:;]+$/, '');
  const sub = phrase.subText || '';

  const heroSize = getResponsiveFontSize(hero, 110, 52, 12);
  const leadSize = getResponsiveFontSize(lead, 40, 24, 20);
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
      {/* Top Cyber Micro-Tag */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 14px',
          borderRadius: 4,
          background: 'rgba(5, 46, 22, 0.7)',
          border: '1px solid rgba(74, 222, 128, 0.4)',
          marginBottom: 8,
          boxShadow: '0 0 15px rgba(74, 222, 128, 0.25)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#4ADE80',
            boxShadow: '0 0 8px #4ADE80',
          }}
        />
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: 13,
            fontWeight: 800,
            color: '#4ADE80',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          {lead || 'SYS.TERMINAL // 01'}
        </span>
      </div>

      {/* Hero Word: Bracketed Matrix Green Glitch Neon */}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        {/* Left Cyber Bracket */}
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: heroSize * 1.1,
            fontWeight: 900,
            color: '#4ADE80',
            textShadow: '0 0 14px #4ADE80, 0 0 30px #22C55E',
            opacity: 0.9,
          }}
        >
          [
        </span>

        {/* Hero Text */}
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: heroSize,
            fontWeight: 900,
            backgroundImage:
              'linear-gradient(180deg, #FFFFFF 0%, #DCFCE7 25%, #4ADE80 55%, #22C55E 80%, #15803D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.05,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            display: 'inline-block',
            filter:
              'drop-shadow(0 0 12px rgba(74, 222, 128, 0.7)) drop-shadow(0 0 28px rgba(34, 197, 94, 0.4))',
          }}
        >
          {hero}
        </span>

        {/* Right Cyber Bracket + Cursor */}
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: heroSize * 1.1,
            fontWeight: 900,
            color: '#4ADE80',
            textShadow: '0 0 14px #4ADE80, 0 0 30px #22C55E',
            opacity: 0.9,
          }}
        >
          ]
        </span>

        {/* Terminal Blinking Underscore */}
        <span
          style={{
            fontFamily: FONTS.syne,
            fontSize: heroSize,
            fontWeight: 900,
            color: '#4ADE80',
            opacity: showCursor ? 1 : 0,
            marginLeft: 2,
            textShadow: '0 0 12px #4ADE80',
          }}
        >
          _
        </span>

        {/* Ambient Matrix Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '130%',
            height: '140%',
            background:
              'radial-gradient(circle, rgba(34, 197, 94, 0.28) 0%, rgba(21, 128, 61, 0.1) 50%, transparent 75%)',
            filter: 'blur(32px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      </div>

      {/* Sub Context */}
      {sub ? (
        <div
          style={{
            marginTop: 12,
            padding: '6px 18px',
            borderRadius: 6,
            background: 'rgba(5, 46, 22, 0.65)',
            border: '1px solid rgba(74, 222, 128, 0.35)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.outfit,
              fontSize: subSize,
              fontWeight: 600,
              color: '#DCFCE7',
              letterSpacing: '0.06em',
            }}
          >
            {sub}
          </span>
        </div>
      ) : null}
    </div>
  );
}

