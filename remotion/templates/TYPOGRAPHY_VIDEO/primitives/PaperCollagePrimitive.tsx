import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

export function PaperCollagePrimitive({
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
  const lead = phrase.leadText || '';
  const hero = phrase.heroText || phrase.word || '';
  const sub = phrase.subText || '';

  const f1 = Math.max(0, localFrame);
  const f2 = Math.max(0, localFrame - 2);

  const sp1 = spring({ frame: f1, fps, config: { mass: 0.35, damping: 11, stiffness: 220 } });
  const sp2 = spring({ frame: f2, fps, config: { mass: 0.3, damping: 10, stiffness: 260 } });

  const heroSize = getResponsiveFontSize(hero, 94, 48, 12);
  const leadSize = getResponsiveFontSize(lead, 46, 28, 16);

  // Subtle analog paper rotation
  const tiltDeg = -1.8;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        maxWidth: 960,
        padding: '0 24px',
        margin: '0 auto',
        gap: 8,
      }}
    >
      {/* Tier 1: Italic Lead Phrase */}
      {lead ? (
        <div
          style={{
            transform: `scale(${interpolate(sp1, [0, 1], [0.85, 1.0])})`,
            opacity: interpolate(f1, [0, 2], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <span
            style={{
              fontFamily: FONTS.montserrat,
              fontSize: leadSize,
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.02em',
              textShadow: '0 3px 12px rgba(0,0,0,0.95)',
            }}
          >
            {lead}
          </span>
        </div>
      ) : null}

      {/* Tier 2: Torn Paper Tape Badge with Dark Ink Hero Lettering */}
      <div
        style={{
          transform: `scale(${interpolate(sp2, [0, 1], [0.65, 1.0])}) rotate(${tiltDeg}deg)`,
          opacity: interpolate(f2, [0, 2], [0, 1], { extrapolateRight: 'clamp' }),
          display: 'inline-block',
          position: 'relative',
        }}
      >
        <div
          style={{
            backgroundColor: '#FEF08A',
            padding: '8px 24px',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65), 0 2px 6px rgba(0, 0, 0, 0.4)',
            border: '1px dashed rgba(202, 138, 4, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.montserrat,
              fontSize: heroSize,
              fontWeight: 900,
              color: '#0F172A',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              display: 'inline-block',
            }}
          >
            {hero}
          </span>
        </div>
      </div>

      {/* Tier 3: Subtext */}
      {sub ? (
        <div
          style={{
            opacity: interpolate(localFrame, [3, 6], [0, 1], { extrapolateRight: 'clamp' }),
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.montserrat,
              fontSize: 32,
              fontWeight: 600,
              color: '#F1F5F9',
              letterSpacing: '0.02em',
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
