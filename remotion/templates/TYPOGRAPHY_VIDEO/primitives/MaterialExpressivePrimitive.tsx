import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { M3_VIDEO_TYPE_SCALE, M3_TYPOGRAPHY_MOTION, M3_TONAL_SURFACES } from '../shared/m3Scale';

export function MaterialExpressivePrimitive({
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
  // 1. M3 Emphasized Decelerate Spring
  const popSpring = spring({
    frame: localFrame,
    fps,
    config: M3_TYPOGRAPHY_MOTION.spring,
  });

  const scaleEntrance = interpolate(popSpring, [0, 1], [0.72, 1.0]);
  const enterOpacity = interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' });
  const enterBlur = interpolate(localFrame, [0, 4], [8, 0], { extrapolateRight: 'clamp' });

  // 2. Phrase Exit Transition
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

  const accentColor = blueprint.accentColor || '#38BDF8';
  const primaryFont = FONTS.jakarta || FONTS.montserrat;

  // Determine M3 archetype
  const isShockWord = /^(not|don't|dont|never|stop|wrong|no|impossible)$/i.test(hero.trim());
  const isNumeric = /^\d+(\+|k|m|x|%|b)?$/i.test(hero.trim()) || /^\$\d+/i.test(hero.trim());

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
      {/* ── ARCHETYPE 1: M3 High-Impact Shock Word (Red/Coral Tonal) ── */}
      {isShockWord ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {lead ? (
            <div
              style={{
                ...M3_TONAL_SURFACES.pillContainer,
                padding: '6px 18px',
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  ...M3_VIDEO_TYPE_SCALE.labelMedium,
                  fontFamily: primaryFont,
                  color: 'rgba(255, 255, 255, 0.85)',
                }}
              >
                {lead}
              </span>
            </div>
          ) : null}

          <div
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 20%, #F43F5E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: primaryFont,
              ...M3_VIDEO_TYPE_SCALE.displayHero,
              textShadow: '0 12px 40px rgba(244, 63, 94, 0.45)',
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.8))',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            {hero}
          </div>

          {sub ? (
            <span
              style={{
                ...M3_VIDEO_TYPE_SCALE.titleMedium,
                fontFamily: primaryFont,
                color: '#FFFFFF',
                marginTop: 10,
                textAlign: 'center',
                textShadow: '0 4px 16px rgba(0,0,0,0.8)',
              }}
            >
              {sub}
            </span>
          ) : null}
        </div>
      ) : isNumeric ? (
        /* ── ARCHETYPE 2: M3 Numeric & Metric Hero (Accent Gradient + Label Tag) ── */
        <div
          style={{
            ...M3_TONAL_SURFACES.cardContainer,
            padding: '28px 44px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid ' + accentColor + '33',
          }}
        >
          <div
            style={{
              ...M3_TONAL_SURFACES.accentPill(accentColor),
              padding: '6px 16px',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                ...M3_VIDEO_TYPE_SCALE.labelSmall,
                fontFamily: primaryFont,
                color: accentColor,
              }}
            >
              {lead || 'KEY STAT'}
            </span>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 40%, ' + accentColor + ' 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: primaryFont,
              ...M3_VIDEO_TYPE_SCALE.displayHero,
              textShadow: '0 10px 30px ' + accentColor + '40',
              filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.7))',
              textAlign: 'center',
            }}
          >
            {hero}
          </div>

          {sub ? (
            <span
              style={{
                ...M3_VIDEO_TYPE_SCALE.headlineSmall,
                fontFamily: primaryFont,
                color: 'rgba(255, 255, 255, 0.9)',
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              {sub}
            </span>
          ) : null}
        </div>
      ) : (
        /* ── ARCHETYPE 3: M3 Expressive Dynamic Phrase (5-Role Hierarchy) ── */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          {lead ? (
            <div
              style={{
                ...M3_TONAL_SURFACES.pillContainer,
                padding: '8px 22px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: accentColor,
                  boxShadow: '0 0 8px ' + accentColor,
                }}
              />
              <span
                style={{
                  ...M3_VIDEO_TYPE_SCALE.labelMedium,
                  fontFamily: primaryFont,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {lead}
              </span>
            </div>
          ) : null}

          <div
            style={{
              ...M3_VIDEO_TYPE_SCALE.displayLarge,
              fontFamily: primaryFont,
              color: '#FFFFFF',
              textAlign: 'center',
              textTransform: 'uppercase',
              textShadow: '0 8px 30px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.7)',
              letterSpacing: M3_VIDEO_TYPE_SCALE.displayLarge.letterSpacing,
            }}
          >
            <span
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 60%, ' + accentColor + ' 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                filter: 'drop-shadow(0 0 20px ' + accentColor + '33)',
              }}
            >
              {hero}
            </span>
          </div>

          {sub ? (
            <div
              style={{
                ...M3_VIDEO_TYPE_SCALE.headlineSmall,
                fontFamily: primaryFont,
                color: 'rgba(255, 255, 255, 0.88)',
                textAlign: 'center',
                maxWidth: 780,
                textShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
