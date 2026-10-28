import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface BeforeAfterTransformationSceneProps {
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

export function BeforeAfterTransformationScene({
  scene,
  headingFont = 'Outfit, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: BeforeAfterTransformationSceneProps) {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  const isDark = palette?.isDark !== false;
  const accentColor = palette?.accent || '#FF5722';
  const textPrimary = palette?.textPrimary || (isDark ? '#F8FAFC' : '#0F172A');
  const textSecondary = palette?.textSecondary || (isDark ? '#94A3B8' : '#64748B');

  // Entrance springs
  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const beforeSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 13, stiffness: 90 } });
  const centerSpring = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 12, stiffness: 85 } });
  const afterSpring = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 13, stiffness: 90 } });

  // Center engine pulse
  const enginePulse = interpolate(Math.sin(frame / 8), [-1, 1], [0.95, 1.05]);
  const sparkRotation = (frame * 3) % 360;

  // Header content
  const categoryPill = scene.categoryPill || 'THE TRANSFORMATION';
  const mainTitle = scene.heading || 'From Manual Chaos to Instant Clarity';
  const subtitle =
    scene.supportingText ||
    scene.narrationSegment?.text ||
    'Compare the exhausting old video creation process with automated AI scene synthesis.';

  const beforePoints = [
    '12+ hours manual timeline editing',
    'Complex keyframing & subtitle sync',
    'Inconsistent stock footage clips',
    'Creator fatigue and creator burnout',
  ];

  const afterPoints = [
    'Instant scene-by-scene storyboard',
    'Auto-synced kinetic subtitles',
    'High-retention SVG illustrations',
    '1-click cloud render in full 1080p',
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
        padding: '50px 75px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(ellipse 90% 80% at 50% 10%, #161938 0%, #090C16 60%, #030610 100%)'
          : 'radial-gradient(ellipse 90% 80% at 50% 10%, #F1F5F9 0%, #F8FAFC 60%, #EEF2F6 100%)',
        color: textPrimary,
      }}
    >
      {/* Background Subtle Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isDark ? 0.06 : 0.03,
          backgroundImage:
            'linear-gradient(to right, #6366F1 1px, transparent 1px), linear-gradient(to bottom, #6366F1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

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
            backgroundColor: isDark ? 'rgba(255, 87, 34, 0.15)' : 'rgba(255, 87, 34, 0.1)',
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
            fontSize: '44px',
            fontWeight: 900,
            letterSpacing: '-0.025em',
            margin: 0,
            lineHeight: 1.15,
            color: textPrimary,
          }}
        >
          {mainTitle}
        </h1>

        <p
          style={{
            fontFamily: bodyFont,
            fontSize: '18px',
            color: textSecondary,
            margin: '8px 0 0',
            maxWidth: '960px',
            lineHeight: 1.35,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* MAIN 16:9 CONTENT: BEFORE CARD ➔ AI MAGIC ENGINE ➔ AFTER CARD */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '15px',
          marginBottom: '10px',
          zIndex: 10,
        }}
      >
        {/* LEFT: THE OLD WAY (Before Card) */}
        <div
          style={{
            flex: '0 0 540px',
            borderRadius: '24px',
            background: isDark ? 'rgba(30, 20, 25, 0.8)' : 'rgba(255, 241, 242, 0.9)',
            border: '2px solid rgba(239, 68, 68, 0.35)',
            boxShadow: isDark
              ? '0 20px 45px rgba(0, 0, 0, 0.4), 0 0 25px rgba(239, 68, 68, 0.15)'
              : '0 20px 45px rgba(0, 0, 0, 0.08), 0 0 20px rgba(239, 68, 68, 0.1)',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            opacity: beforeSpring,
            transform: `translateX(${interpolate(beforeSpring, [0, 1], [-40, 0])}px)`,
          }}
        >
          {/* Card Top Pill & Icon */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(239, 68, 68, 0.18)',
                color: '#EF4444',
                fontFamily: headingFont,
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.08em',
              }}
            >
              <span>✕</span>
              <span>THE OLD WAY</span>
            </div>
            <span
              style={{
                fontFamily: bodyFont,
                fontSize: '13px',
                fontWeight: 700,
                color: '#EF4444',
              }}
            >
              12+ HOURS PER VIDEO
            </span>
          </div>

          <h3
            style={{
              fontFamily: headingFont,
              fontSize: '26px',
              fontWeight: 800,
              color: textPrimary,
              margin: 0,
            }}
          >
            Manual Timeline Editing
          </h3>

          {/* Pain Points List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {beforePoints.map((point, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </div>
                <span
                  style={{
                    fontFamily: bodyFont,
                    fontSize: '15px',
                    color: isDark ? '#E2E8F0' : '#334155',
                    fontWeight: 500,
                  }}
                >
                  {point}
                </span>
              </div>
            ))}
          </div>

          {/* Old Workflow Metric Banner */}
          <div
            style={{
              marginTop: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px dashed rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontFamily: bodyFont, fontSize: '13px', color: '#EF4444', fontWeight: 600 }}>
              Average Cost: 2-3 Days Work
            </span>
            <span style={{ fontSize: '16px' }}>📉</span>
          </div>
        </div>

        {/* CENTER: AI MAGIC ENGINE NODE */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            opacity: centerSpring,
            transform: `scale(${interpolate(centerSpring, [0, 1], [0.8, 1])})`,
          }}
        >
          {/* Animated Glowing Ring */}
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF5722 0%, #6366F1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 35px rgba(255, 87, 34, 0.4), 0 0 50px rgba(99, 102, 241, 0.3)',
              transform: `scale(${enginePulse})`,
              position: 'relative',
            }}
          >
            {/* Spinning Sparkle Ring */}
            <svg
              width="130"
              height="130"
              viewBox="0 0 130 130"
              style={{
                position: 'absolute',
                transform: `rotate(${sparkRotation}deg)`,
                pointerEvents: 'none',
              }}
            >
              <circle
                cx="65"
                cy="65"
                r="60"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
                strokeDasharray="6 8"
                fill="none"
              />
            </svg>

            <span style={{ fontSize: '42px' }}>⚡</span>
          </div>

          <div
            style={{
              marginTop: '12px',
              fontFamily: headingFont,
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: accentColor,
              textTransform: 'uppercase',
            }}
          >
            AI TRANSFORMATION
          </div>
        </div>

        {/* RIGHT: THE ITNAVIDEO WAY (After Card) */}
        <div
          style={{
            flex: '0 0 540px',
            borderRadius: '24px',
            background: isDark ? 'rgba(15, 30, 25, 0.85)' : 'rgba(240, 253, 244, 0.95)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            boxShadow: isDark
              ? '0 20px 45px rgba(0, 0, 0, 0.4), 0 0 30px rgba(16, 185, 129, 0.2)'
              : '0 20px 45px rgba(0, 0, 0, 0.08), 0 0 25px rgba(16, 185, 129, 0.15)',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            opacity: afterSpring,
            transform: `translateX(${interpolate(afterSpring, [0, 1], [40, 0])}px)`,
          }}
        >
          {/* Card Top Pill & Icon */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                color: '#10B981',
                fontFamily: headingFont,
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.08em',
              }}
            >
              <span>✓</span>
              <span>THE ITNAVIDEO WAY</span>
            </div>
            <span
              style={{
                fontFamily: bodyFont,
                fontSize: '13px',
                fontWeight: 700,
                color: '#10B981',
              }}
            >
              60s CLOUD RENDER
            </span>
          </div>

          <h3
            style={{
              fontFamily: headingFont,
              fontSize: '26px',
              fontWeight: 800,
              color: textPrimary,
              margin: 0,
            }}
          >
            Automated Scene Synthesis
          </h3>

          {/* Value Points List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {afterPoints.map((point, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <span
                  style={{
                    fontFamily: bodyFont,
                    fontSize: '15px',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontWeight: 600,
                  }}
                >
                  {point}
                </span>
              </div>
            ))}
          </div>

          {/* New Workflow Metric Banner */}
          <div
            style={{
              marginTop: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontFamily: bodyFont, fontSize: '13px', color: '#10B981', fontWeight: 700 }}>
              Speed Boost: 10x Faster Video Creation
            </span>
            <span style={{ fontSize: '16px' }}>🚀</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 24px',
          borderRadius: '12px',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)'}`,
          zIndex: 10,
        }}
      >
        <span style={{ fontFamily: bodyFont, fontSize: '14px', color: textSecondary }}>
          Automation unlocks effortless consistency, letting creators focus purely on storytelling.
        </span>
        <span style={{ fontFamily: headingFont, fontSize: '12px', fontWeight: 800, color: accentColor }}>
          SCENE 4 / 5
        </span>
      </div>
    </div>
  );
}
