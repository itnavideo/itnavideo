import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface CreatorCelebrationSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: {
    isDark?: boolean;
    primary?: string;
    accent?: string;
    textPrimary?: string;
    textSecondary?: string;
  };
}

export function CreatorCelebrationScene({
  scene,
  headingFont = 'Outfit, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: CreatorCelebrationSceneProps) {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  const isDark = palette?.isDark !== false;
  const accentColor = palette?.accent || '#FF5722';
  const textPrimary = palette?.textPrimary || (isDark ? '#F8FAFC' : '#0F172A');
  const textSecondary = palette?.textSecondary || (isDark ? '#94A3B8' : '#64748B');

  // Entrance springs
  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const characterSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 13, stiffness: 90 } });
  const contentSpring = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 13, stiffness: 85 } });

  // Floating celebration bounce
  const floatY = Math.sin(frame / 14) * 6;

  // Header and content
  const categoryPill = scene.categoryPill || 'THE RESULT';
  const mainTitle = scene.heading || 'Upload. Edit. Post. Done!';
  const subtitle =
    scene.supportingText ||
    scene.narrationSegment?.text ||
    'Join thousands of smart creators publishing high-retention faceless videos in minutes.';

  // Social badges
  const platforms = [
    { name: 'YouTube', color: '#EF4444', icon: '▶' },
    { name: 'Instagram', color: '#EC4899', icon: '📸' },
    { name: 'TikTok', color: '#06B6D4', icon: '🎵' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '50px 80px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(ellipse 95% 85% at 50% 100%, #1F193C 0%, #0B0E1B 55%, #030612 100%)'
          : 'radial-gradient(ellipse 95% 85% at 50% 100%, #FFF1EB 0%, #F8FAFC 55%, #F1F5F9 100%)',
        color: textPrimary,
      }}
    >
      {/* Background Celebration Rays / Starburst */}
      <svg
        viewBox="0 0 1920 1080"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: isDark ? 0.08 : 0.04,
          pointerEvents: 'none',
        }}
      >
        {[...Array(16)].map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <line
              key={i}
              x1="960"
              y1="540"
              x2={960 + Math.cos((angle * Math.PI) / 180) * 1200}
              y2={540 + Math.sin((angle * Math.PI) / 180) * 1200}
              stroke="#FF5722"
              strokeWidth="4"
              strokeDasharray="12 12"
            />
          );
        })}
      </svg>

      {/* Confetti Particles */}
      {[
        { x: '15%', y: '20%', c: '#FF5722', s: 12, r: 25 },
        { x: '35%', y: '12%', c: '#F59E0B', s: 10, r: 60 },
        { x: '68%', y: '18%', c: '#10B981', s: 14, r: 40 },
        { x: '82%', y: '28%', c: '#3B82F6', s: 11, r: 75 },
        { x: '90%', y: '65%', c: '#8B5CF6', s: 13, r: 15 },
        { x: '22%', y: '78%', c: '#EC4899', s: 12, r: 50 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: `${p.s}px`,
            height: `${p.s * 1.5}px`,
            backgroundColor: p.c,
            borderRadius: '2px',
            transform: `rotate(${p.r + frame * 2}deg) translateY(${Math.sin((frame + i * 15) / 10) * 8}px)`,
            opacity: isDark ? 0.6 : 0.75,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* TOP HEADER */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 20px',
            borderRadius: '9999px',
            backgroundColor: isDark ? 'rgba(255, 87, 34, 0.16)' : 'rgba(255, 87, 34, 0.12)',
            border: '1px solid rgba(255, 87, 34, 0.35)',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: accentColor,
            }}
          >
            {categoryPill}
          </span>
        </div>

        <h1
          style={{
            fontFamily: headingFont,
            fontSize: '48px',
            fontWeight: 900,
            letterSpacing: '-0.025em',
            margin: 0,
            lineHeight: 1.15,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FF5722 100%)',
            WebkitBackgroundClip: isDark ? 'text' : undefined,
            WebkitTextFillColor: isDark ? 'transparent' : undefined,
            color: isDark ? undefined : '#0F172A',
          }}
        >
          {mainTitle}
        </h1>
      </div>

      {/* MAIN 16:9 CONTENT: LEFT CELEBRATING CREATOR + RIGHT GROWTH STATS & BADGES */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '60px',
          marginTop: '15px',
          marginBottom: '10px',
          zIndex: 10,
        }}
      >
        {/* LEFT: 2D Celebratory Creator Character with Thumbs Up */}
        <div
          style={{
            flex: '0 0 48%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            opacity: characterSpring,
            transform: `translateY(${floatY}px) scale(${interpolate(characterSpring, [0, 1], [0.92, 1])})`,
          }}
        >
          {/* Creator Aura Ring */}
          <div
            style={{
              position: 'absolute',
              width: '440px',
              height: '440px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 87, 34, 0.22) 0%, rgba(99, 102, 241, 0.12) 60%, transparent 80%)',
              filter: 'blur(45px)',
              pointerEvents: 'none',
            }}
          />

          {/* SVG Vector Creator Character */}
          <svg
            viewBox="0 0 460 460"
            style={{
              width: '100%',
              maxWidth: '440px',
              height: 'auto',
              maxHeight: '420px',
              overflow: 'visible',
            }}
          >
            <defs>
              <linearGradient id="celebHoodie" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF5722" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
            </defs>

            {/* CREATOR BODY */}
            <path
              d="M 150 420 L 175 250 C 185 220, 275 220, 285 250 L 310 420 Z"
              fill="url(#celebHoodie)"
              stroke="#0F172A"
              strokeWidth="4"
            />
            {/* Drawstrings */}
            <path d="M 218 260 L 216 295" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M 242 260 L 244 295" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

            {/* NECK */}
            <rect x="215" y="215" width="30" height="25" rx="4" fill="#FBBF24" />

            {/* HEAD */}
            <circle cx="230" cy="190" r="38" fill="#FBBF24" stroke="#0F172A" strokeWidth="4" />

            {/* STYLISH HAIR */}
            <path
              d="M 190 185 C 190 148, 270 144, 270 185 C 270 165, 260 152, 230 152 C 205 152, 193 168, 190 185 Z"
              fill="#18181B"
            />
            <path d="M 196 176 Q 230 164 264 178" stroke="#18181B" strokeWidth="8" strokeLinecap="round" />

            {/* JOYFUL FACE: Winking / Big Smile */}
            {/* Left Eye: Big Happy Curve */}
            <path d="M 208 190 Q 215 182 222 190" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Right Eye: Wink Star or Happy Curve */}
            <path d="M 238 190 Q 245 182 252 190" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            {/* Big Joyful Smile */}
            <path
              d="M 215 204 Q 230 220 245 204 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="3"
            />
            <path d="M 215 204 Q 230 220 245 204" stroke="#0F172A" strokeWidth="3" fill="none" />

            {/* Rosy Cheeks */}
            <circle cx="204" cy="198" r="6" fill="#F87171" opacity="0.6" />
            <circle cx="256" cy="198" r="6" fill="#F87171" opacity="0.6" />

            {/* LEFT ARM - RAISED THUMBS UP */}
            <path
              d="M 180 250 L 120 220 L 100 160"
              stroke="url(#celebHoodie)"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Hand with Thumbs Up */}
            <circle cx="100" cy="155" r="14" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
            <rect x="94" y="132" width="12" height="24" rx="6" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
            {/* Sparkles near thumb */}
            <text x="70" y="130" fontSize="22" fill="#F59E0B">✨</text>

            {/* RIGHT ARM - PEACE SIGN / FIST PUMP */}
            <path
              d="M 280 250 L 330 230 L 350 170"
              stroke="url(#celebHoodie)"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="350" cy="165" r="14" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
            {/* Two peace fingers */}
            <rect x="342" y="142" width="8" height="22" rx="4" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="354" y="146" width="8" height="20" rx="4" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" />
            <text x="365" y="140" fontSize="20" fill="#10B981">✨</text>
          </svg>
        </div>

        {/* RIGHT: High-Impact Metrics & Platforms */}
        <div
          style={{
            flex: '0 0 48%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            opacity: contentSpring,
            transform: `translateX(${interpolate(contentSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Subtitle / Narration */}
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: '20px',
              color: textSecondary,
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            {subtitle}
          </p>

          {/* Big Growth Metric Card */}
          <div
            style={{
              padding: '24px 28px',
              borderRadius: '20px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)',
              border: `2px solid ${isDark ? 'rgba(255, 87, 34, 0.4)' : 'rgba(255, 87, 34, 0.3)'}`,
              boxShadow: isDark
                ? '0 16px 36px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 87, 34, 0.15)'
                : '0 16px 36px rgba(0, 0, 0, 0.08), 0 0 20px rgba(255, 87, 34, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: headingFont,
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: accentColor,
                  textTransform: 'uppercase',
                }}
              >
                PROVEN RESULTS
              </div>
              <div
                style={{
                  fontFamily: headingFont,
                  fontSize: '44px',
                  fontWeight: 900,
                  color: textPrimary,
                  lineHeight: 1.1,
                  marginTop: '4px',
                }}
              >
                +450%
              </div>
              <div style={{ fontFamily: bodyFont, fontSize: '14px', color: textSecondary, marginTop: '2px' }}>
                Channel views & posting consistency
              </div>
            </div>

            {/* Growth Chart Mini Graphic */}
            <div style={{ width: '120px', height: '60px' }}>
              <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
                <path
                  d="M 5 50 Q 35 45 60 28 T 115 8"
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="115" cy="8" r="5" fill="#10B981" filter="drop-shadow(0 0 6px #10B981)" />
              </svg>
            </div>
          </div>

          {/* Social Platforms Row */}
          <div style={{ display: 'flex', gap: '14px' }}>
            {platforms.map((p) => (
              <div
                key={p.name}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.85)',
                  border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                }}
              >
                <span style={{ fontSize: '18px' }}>{p.icon}</span>
                <span style={{ fontFamily: headingFont, fontSize: '14px', fontWeight: 700, color: textPrimary }}>
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 28px',
          borderRadius: '14px',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)'}`,
          zIndex: 10,
        }}
      >
        <span style={{ fontFamily: bodyFont, fontSize: '15px', color: textSecondary }}>
          Start building your faceless video empire today — fast, automated, and effortless.
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: accentColor,
            }}
          >
            CREATE WITH ITNAVIDEO ➔
          </span>
        </div>
      </div>
    </div>
  );
}
