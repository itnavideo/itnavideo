import React from 'react';
import { interpolate, spring } from 'remotion';
import type { KineticPhrase, StyleBlueprint } from '../../../../lib/typography/types';
import { FONTS } from '../shared/fonts';
import { getResponsiveFontSize } from '../shared/ResponsiveText';

/**
 * Elevate Script & Real Estate Luxury Primitive
 *
 * Implements:
 * 1. Editorial Luxury Serif (Playfair Display) + Clean Sans (Inter) Pairing
 * 2. Champagne Gold Metallic Shimmer Gradient (#FFF6D6 -> #F5D061 -> #E5B869 -> #AA771C)
 * 3. 5 Floating Graphic Overlays:
 *    - Floating Glassmorphism Badges (Pills with gold neon glow outline)
 *    - iOS / Social Review Bubble (Dark frosted glass card with 5 gold stars + avatar)
 *    - Interactive Calendar Overlay (Minimalist September grid with animated circle highlight)
 *    - Incoming Call UI Card (Black frosted pill with contact photo & accept/decline buttons)
 *    - End Screen Profile Card (Floating luxury business card with smooth zoom-in)
 * 4. Scale & Snap spring entrance (90% -> 100% with cubic-bezier spring & opacity pop)
 */
export function ElevateScriptPrimitive({
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
  // 1. Scale & Snap spring entrance (90% -> 100% with heavy easing)
  const snapSpring = spring({
    frame: localFrame,
    fps,
    config: {
      mass: blueprint.animation?.mass ?? 0.45,
      damping: blueprint.animation?.damping ?? 14,
      stiffness: blueprint.animation?.stiffness ?? 190,
    },
  });

  const scale = interpolate(snapSpring, [0, 1], [0.9, 1.0]);
  const translateY = interpolate(snapSpring, [0, 1], [15, 0]);
  const blurValue = interpolate(localFrame, [0, 4], [6, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' });

  const lead = phrase.leadText || '';
  const hero = phrase.heroText || phrase.word || '';
  const sub = phrase.subText || '';
  const variant = phrase.styleVariant || phrase.variant || phrase.highlightType || '';

  const heroSize = getResponsiveFontSize(hero, 96, 48, 16);
  const leadSize = getResponsiveFontSize(lead, 42, 26, 22);

  // Champagne Gold metallic shimmer gradient
  const goldGradient = 'linear-gradient(135deg, #FFF6D6 0%, #F5D061 35%, #E5B869 60%, #AA771C 100%)';

  // ── GRAPHIC OVERLAY 1: iOS / Social Review Bubble ─────────────────────────
  if (variant === 'review-bubble' || variant === 'review-card' || variant === 'ui-card') {
    return (
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          filter: `blur(${blurValue}px)`,
          width: '100%',
          maxWidth: 780,
          margin: '0 auto',
          padding: '24px 32px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 24,
          border: '1.5px solid rgba(245, 208, 97, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 208, 97, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Header: User Avatar + Name + 5 Gold Stars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: goldGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 900,
                color: '#0F172A',
                boxShadow: '0 4px 12px rgba(245, 208, 97, 0.4)',
              }}
            >
              CJ
            </div>
            <div>
              <div style={{ fontFamily: FONTS.inter, fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>
                Verified Client Review
              </div>
              <div style={{ fontFamily: FONTS.inter, fontSize: 14, color: '#94A3B8' }}>
                @christy_realtor · Luxury Estate
              </div>
            </div>
          </div>
          {/* 5 Gold Stars */}
          <div style={{ display: 'flex', gap: 4, color: '#F5D061', fontSize: 20 }}>
            {'★★★★★'}
          </div>
        </div>

        {/* Review Quote Body */}
        <div
          style={{
            fontFamily: FONTS.playfair,
            fontSize: 28,
            fontStyle: 'italic',
            lineHeight: 1.35,
            color: '#F8FAFC',
            paddingTop: 6,
          }}
        >
          &ldquo;{hero || 'Christy always knows someone — trusted advice every step of the way.'}&rdquo;
        </div>
      </div>
    );
  }

  // ── GRAPHIC OVERLAY 2: Floating Glassmorphism Badges (Pills) ───────────────
  if (
    variant === 'glass-badge' ||
    variant === 'pill-badge' ||
    variant === 'badge-pills' ||
    phrase.badgeLabel
  ) {
    const defaultPills = ['✦ Lenders', '✦ Contractors', '✦ Inspectors'];
    const pillsToRender = phrase.stepWords && phrase.stepWords.length > 0 ? phrase.stepWords : defaultPills;

    return (
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          filter: `blur(${blurValue}px)`,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          width: '100%',
          maxWidth: 920,
          margin: '0 auto',
        }}
      >
        {pillsToRender.map((pillText, idx) => {
          const pillSpring = spring({
            frame: Math.max(0, localFrame - idx * 4),
            fps,
            config: { mass: 0.4, damping: 12, stiffness: 200 },
          });
          const pillScale = interpolate(pillSpring, [0, 1], [0.8, 1.0]);

          return (
            <div
              key={idx}
              style={{
                transform: `scale(${pillScale})`,
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(245, 208, 97, 0.7)',
                borderRadius: 9999,
                padding: '14px 28px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 208, 97, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.inter,
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.02em',
                }}
              >
                {pillText}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // ── GRAPHIC OVERLAY 3: Interactive Calendar Overlay ────────────────────────
  if (variant === 'calendar-overlay' || variant === 'calendar-grid' || phrase.badgeLabel === 'calendar') {
    const circleProgress = interpolate(localFrame, [6, 18], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          filter: `blur(${blurValue}px)`,
          width: 440,
          margin: '0 auto',
          padding: '24px 28px',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: '1.5px solid rgba(245, 208, 97, 0.5)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(245, 208, 97, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontFamily: FONTS.playfair, fontSize: 24, fontStyle: 'italic', fontWeight: 700, color: '#F5D061' }}>
            September Schedule
          </span>
          <span style={{ fontFamily: FONTS.inter, fontSize: 14, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em' }}>
            2026
          </span>
        </div>

        {/* Days of week */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 10, color: '#64748B', fontSize: 12, fontWeight: 700 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Dates Grid (Sample 1-14 with 15 Highlighted) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center', fontSize: 16, fontWeight: 600, color: '#CBD5E1' }}>
          {[...Array(14)].map((_, i) => (
            <div key={i} style={{ padding: '6px 0' }}>
              {i + 1}
            </div>
          ))}
          {/* Highlighted Target Date 15 */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#F5D061', fontWeight: 900, zIndex: 2 }}>15</span>
            <svg
              style={{
                position: 'absolute',
                width: 38,
                height: 38,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-90deg)',
              }}
            >
              <circle
                cx="19"
                cy="19"
                r="16"
                fill="none"
                stroke="#F5D061"
                strokeWidth="2.5"
                strokeDasharray="100"
                strokeDashoffset={100 - circleProgress * 100}
                style={{ filter: 'drop-shadow(0 0 6px rgba(245, 208, 97, 0.8))' }}
              />
            </svg>
          </div>
          {[...Array(13)].map((_, i) => (
            <div key={i + 16} style={{ padding: '6px 0' }}>
              {i + 16}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── GRAPHIC OVERLAY 4: Incoming Call UI Card ──────────────────────────────
  if (variant === 'incoming-call' || variant === 'call-card') {
    return (
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          filter: `blur(${blurValue}px)`,
          width: '100%',
          maxWidth: 680,
          margin: '0 auto',
          padding: '18px 28px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(24px)',
          borderRadius: 9999,
          border: '1.5px solid rgba(245, 208, 97, 0.4)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(245, 208, 97, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: goldGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 900,
              color: '#0F172A',
            }}
          >
            ☎
          </div>
          <div>
            <div style={{ fontFamily: FONTS.inter, fontSize: 14, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Incoming Call
            </div>
            <div style={{ fontFamily: FONTS.playfair, fontSize: 24, fontStyle: 'italic', fontWeight: 700, color: '#FFFFFF' }}>
              {hero || 'Trusted Real Estate Advisor'}
            </div>
          </div>
        </div>

        {/* Accept / Decline Action Buttons */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: 20,
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
            }}
          >
            ✕
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#22C55E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: 20,
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
            }}
          >
            ✓
          </div>
        </div>
      </div>
    );
  }

  // ── GRAPHIC OVERLAY 5: End Screen Profile Card ─────────────────────────────
  if (variant === 'profile-card' || variant === 'contact-card') {
    return (
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          filter: `blur(${blurValue}px)`,
          width: '100%',
          maxWidth: 640,
          margin: '0 auto',
          padding: '36px 32px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(32px)',
          borderRadius: 28,
          border: '2px solid rgba(245, 208, 97, 0.6)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(245, 208, 97, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: goldGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 900,
            color: '#0F172A',
            boxShadow: '0 8px 24px rgba(245, 208, 97, 0.5)',
          }}
        >
          ✦
        </div>

        <div>
          <div style={{ fontFamily: FONTS.playfair, fontSize: 36, fontStyle: 'italic', fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
            {hero || 'Christy Jenkins'}
          </div>
          <div style={{ fontFamily: FONTS.inter, fontSize: 16, fontWeight: 700, color: '#F5D061', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Luxury Real Estate Advisor
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 8,
          }}
        >
          <div style={{ padding: '10px 20px', borderRadius: 9999, background: 'rgba(255,255,255,0.08)', color: '#CBD5E1', fontSize: 14, fontFamily: FONTS.inter, fontWeight: 600 }}>
            ✉ contact@luxuryestate.com
          </div>
          <div style={{ padding: '10px 20px', borderRadius: 9999, background: 'rgba(245, 208, 97, 0.15)', border: '1px solid rgba(245, 208, 97, 0.4)', color: '#F5D061', fontSize: 14, fontFamily: FONTS.inter, fontWeight: 700 }}>
            Schedule Call →
          </div>
        </div>
      </div>
    );
  }

  // ── DEFAULT HEADLINE / SENTENCE PAIRING ────────────────────────────────────
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
      }}
    >
      {/* Upper Context: Clean Modern Sans in Title Case / Lowercase */}
      {lead ? (
        <span
          style={{
            fontFamily: FONTS.inter,
            fontSize: leadSize,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.03em',
            marginBottom: 8,
            textShadow: '0 4px 18px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          {lead}
        </span>
      ) : null}

      {/* Hero Keyword: Editorial Luxury Serif with Champagne Gold Shimmer */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONTS.playfair,
            fontSize: heroSize,
            fontStyle: 'italic',
            fontWeight: 700,
            backgroundImage: goldGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.08,
            letterSpacing: '0.01em',
            filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.95)) drop-shadow(0 0 20px rgba(245,208,97,0.35))',
            display: 'inline-block',
          }}
        >
          {hero}
        </span>
      </div>

      {/* Subtext: Warm Cream / Pale Yellow Highlighting */}
      {sub ? (
        <span
          style={{
            fontFamily: FONTS.inter,
            fontSize: 28,
            fontWeight: 600,
            color: '#FDF2C5',
            marginTop: 10,
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
