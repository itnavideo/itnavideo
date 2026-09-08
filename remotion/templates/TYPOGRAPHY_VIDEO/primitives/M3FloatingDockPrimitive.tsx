import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { M3_VIDEO_TYPE_SCALE, M3_TYPOGRAPHY_MOTION, M3_TONAL_SURFACES } from '../shared/m3Scale';

export function M3FloatingDockPrimitive({
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
    config: M3_TYPOGRAPHY_MOTION.spring,
  });

  const scaleEntrance = interpolate(popSpring, [0, 1], [0.72, 1.0]);
  const enterOpacity = interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' });
  const enterBlur = interpolate(localFrame, [0, 4], [8, 0], { extrapolateRight: 'clamp' });

  const totalFrames = Math.max(1, Math.round((phrase.end - phrase.start) * fps));
  const framesRemaining = totalFrames - localFrame;
  const exitOpacity = interpolate(framesRemaining, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(framesRemaining, [0, 4], [1.04, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = scaleEntrance * exitScale;
  const opacity = enterOpacity * exitOpacity;

  const lead = phrase.leadText || '';
  const hero = phrase.heroText || phrase.word || '';
  const sub = phrase.subText || '';

  const accentColor = blueprint.accentColor || '#A855F7';
  const secondaryAccent = blueprint.secondaryAccentColor || '#C084FC';
  const primaryFont = FONTS.jakarta || FONTS.montserrat;

  return (
    <div
      style={{
        transform: 'scale(' + scale + ')',
        filter: 'blur(' + enterBlur + 'px)',
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 960,
        padding: '0 24px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {lead ? (
        <div
          style={{
            ...M3_TONAL_SURFACES.accentPill(accentColor),
            padding: '8px 24px',
            marginBottom: 16,
          }}
        >
          <span
            style={{
              ...M3_VIDEO_TYPE_SCALE.labelLarge,
              fontFamily: primaryFont,
              color: secondaryAccent,
              letterSpacing: '0.08em',
            }}
          >
            {lead}
          </span>
        </div>
      ) : null}

      <div
        style={{
          ...M3_TONAL_SURFACES.cardContainer,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 48px',
          maxWidth: '100%',
          textAlign: 'center',
          background: 'rgba(28, 27, 31, 0.88)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
        }}
      >
        <span
          style={{
            ...M3_VIDEO_TYPE_SCALE.displayHero,
            fontFamily: primaryFont,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            textShadow: '0 0 35px ' + accentColor + '66, 0 4px 20px rgba(0,0,0,0.8)',
            lineHeight: 1.02,
          }}
        >
          {hero}
        </span>
      </div>

      {sub ? (
        <div
          style={{
            marginTop: 18,
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 22px',
            borderRadius: 9999,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <span
            style={{
              ...M3_VIDEO_TYPE_SCALE.titleMedium,
              fontFamily: primaryFont,
              color: 'rgba(255, 255, 255, 0.88)',
              fontWeight: 600,
            }}
          >
            {sub}
          </span>
        </div>
      ) : null}
    </div>
  );
}
