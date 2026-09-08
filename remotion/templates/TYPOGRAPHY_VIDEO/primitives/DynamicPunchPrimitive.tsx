import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';

export function DynamicPunchPrimitive({
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
  // 1. Snappy elastic spring pop entry
  const popSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation.mass || 0.35,
      damping: blueprint.animation.damping || 12,
      stiffness: blueprint.animation.stiffness || 220,
    },
  });

  const scaleEntrance = interpolate(popSpring, [0, 1], [0.68, 1.0]);
  const blurValue = interpolate(localFrame, [0, 4], [6, 0], { extrapolateRight: 'clamp' });
  const enterOpacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  // 2. Snappy exit fade out at phrase boundary
  const totalFrames = Math.max(1, Math.round((phrase.end - phrase.start) * fps));
  const framesRemaining = totalFrames - localFrame;
  const exitOpacity = interpolate(framesRemaining, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(framesRemaining, [0, 4], [1.05, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = scaleEntrance * exitScale;
  const opacity = enterOpacity * exitOpacity;

  const lead = phrase.leadText || '';
  const hero = phrase.heroText || phrase.word || '';
  const sub = phrase.subText || '';

  // Determine layout archetype
  const isShockWord = /^(not|don't|dont|never|stop|wrong|no)$/i.test(hero.trim());
  const isNumeric = /^\d+(\+|k|m|x)?$/i.test(hero.trim()) || /^\$\d+/i.test(hero.trim());
  const isBridgeOnly = !lead && !sub && hero.length < 15 && phrase.size === 'compact';

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blurValue}px)`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 980,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* ── ARCHETYPE 1: Red 3D Shock Punch (e.g. NOT / DON'T) ── */}
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
            <span
              style={{
                fontFamily: FONTS.outfit,
                fontSize: 48,
                fontWeight: 800,
                color: '#FFFFFF',
                textShadow: '0 4px 14px rgba(0,0,0,0.9)',
                marginBottom: -10,
              }}
            >
              {lead}
            </span>
          ) : null}
          <span
            style={{
              fontFamily: FONTS.outfit,
              fontSize: 155,
              fontWeight: 900,
              color: '#FF2E2E',
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              textShadow: '0 8px 0 #9E0000, 0 16px 36px rgba(0,0,0,0.9), 0 0 20px rgba(255,46,46,0.4)',
              display: 'inline-block',
            }}
          >
            {hero}
          </span>
          {sub ? (
            <span
              style={{
                fontFamily: FONTS.outfit,
                fontSize: 44,
                fontWeight: 800,
                color: '#FFFFFF',
                textShadow: '0 4px 14px rgba(0,0,0,0.9)',
                marginTop: 4,
              }}
            >
              {sub}
            </span>
          ) : null}
        </div>
      ) : isNumeric ? (
        /* ── ARCHETYPE 2: Hero Numeric with Overlaid Badge (e.g. 6000 buyers) ── */
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.outfit,
              fontSize: 170,
              fontWeight: 900,
              background: blueprint.colors.heroGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.9)) drop-shadow(0 2px 8px rgba(255,100,50,0.4))',
            }}
          >
            {hero}
          </span>
          {sub ? (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.75)',
                padding: '6px 24px',
                borderRadius: 14,
                border: '1.5px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.outfit,
                  fontSize: 54,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                }}
              >
                {sub}
              </span>
            </div>
          ) : null}
        </div>
      ) : isBridgeOnly ? (
        /* ── ARCHETYPE 3: Spoken Center Bridge Word (e.g. "home", "about", "database") ── */
        <span
          style={{
            fontFamily: FONTS.outfit,
            fontSize: 60,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.95)',
          }}
        >
          {hero}
        </span>
      ) : (
        /* ── ARCHETYPE 4: Signature Dynamic Punch 3-Tier Cluster (e.g. "We don't", "We launch it", "from professional") ── */
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Pre-Lead Shoulder Text (e.g. "We", "from", "If your") */}
          {lead ? (
            <div
              style={{
                alignSelf: 'flex-start',
                marginLeft: 12,
                marginBottom: -6,
                zIndex: 2,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.outfit,
                  fontSize: 48,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  textShadow: '0 4px 16px rgba(0,0,0,0.95)',
                  display: 'inline-block',
                }}
              >
                {lead}
              </span>
            </div>
          ) : null}

          {/* Giant Hero Punch Word (e.g. "don't", "launch", "videos", "content") */}
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <span
              style={{
                fontFamily: FONTS.outfit,
                fontSize: hero.length > 12 ? 96 : hero.length > 8 ? 116 : 138,
                fontWeight: 900,
                background: blueprint.colors.heroGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.0,
                letterSpacing: '-0.035em',
                filter:
                  'drop-shadow(0 10px 28px rgba(0,0,0,0.9)) drop-shadow(0 2px 10px rgba(255,100,50,0.45))',
                display: 'inline-block',
              }}
            >
              {hero}
            </span>

            {/* Sub-Anchor (e.g. "it", "in how", "views") tucked under hero word */}
            {sub ? (
              <div
                style={{
                  position: 'absolute',
                  right: -4,
                  bottom: -28,
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.outfit,
                    fontSize: 46,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 16px rgba(0,0,0,0.95)',
                    display: 'inline-block',
                  }}
                >
                  {sub}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
