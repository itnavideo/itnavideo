import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { M3_VIDEO_TYPE_SCALE, M3_TYPOGRAPHY_MOTION, M3_TONAL_SURFACES } from '../shared/m3Scale';

export function M3AssistChipPrimitive({
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
      mass: 0.52,
      damping: 13,
      stiffness: 200,
    },
  });

  const scaleEntrance = interpolate(popSpring, [0, 1], [0.75, 1.0]);
  const enterOpacity = interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' });
  const enterBlur = interpolate(localFrame, [0, 4], [6, 0], { extrapolateRight: 'clamp' });

  const totalFrames = Math.max(1, Math.round((phrase.end - phrase.start) * fps));
  const framesRemaining = totalFrames - localFrame;
  const exitOpacity = interpolate(framesRemaining, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(framesRemaining, [0, 4], [1.03, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = scaleEntrance * exitScale;
  const opacity = enterOpacity * exitOpacity;

  const lead = phrase.leadText || '';
  const hero = phrase.heroText || phrase.word || '';
  const sub = phrase.subText || '';

  const accentColor = blueprint.accentColor || '#10B981';
  const secondaryAccent = blueprint.secondaryAccentColor || '#34D399';
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
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 20px',
          borderRadius: 9999,
          background: 'rgba(16, 185, 129, 0.16)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: accentColor,
            boxShadow: '0 0 10px ' + accentColor,
          }}
        />
        <span
          style={{
            ...M3_VIDEO_TYPE_SCALE.labelLarge,
            fontFamily: primaryFont,
            color: '#ECFDF5',
            letterSpacing: '0.08em',
          }}
        >
          {lead || 'M3 Expressive'}
        </span>
      </div>

      <div
        style={{
          ...M3_TONAL_SURFACES.cardContainer,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px 44px',
          maxWidth: '100%',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            ...M3_VIDEO_TYPE_SCALE.displayLarge,
            fontFamily: primaryFont,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '-0.025em',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.6)',
            lineHeight: 1.05,
          }}
        >
          {hero}
        </span>

        {sub ? (
          <div
            style={{
              marginTop: 16,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 20px',
              borderRadius: 9999,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.2) 100%)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
            }}
          >
            <span
              style={{
                ...M3_VIDEO_TYPE_SCALE.titleMedium,
                fontFamily: primaryFont,
                color: secondaryAccent,
                fontWeight: 700,
              }}
            >
              {sub}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
