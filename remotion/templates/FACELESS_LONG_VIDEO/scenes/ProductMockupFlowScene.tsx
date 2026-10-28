import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface ProductMockupFlowSceneProps {
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

export function ProductMockupFlowScene({
  scene,
  headingFont = 'Outfit, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: ProductMockupFlowSceneProps) {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  const isDark = palette?.isDark !== false;
  const accentColor = palette?.accent || '#FF5722';
  const textPrimary = palette?.textPrimary || (isDark ? '#F8FAFC' : '#0F172A');
  const textSecondary = palette?.textSecondary || (isDark ? '#94A3B8' : '#64748B');

  // Entrance spring animations
  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const mockupSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 13, stiffness: 85 } });
  const inputsSpring = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 14, stiffness: 90 } });

  // Flow pulse animation for the connector arrows
  const flowProgress = (frame % 40) / 40;

  // Header content
  const categoryPill = scene.categoryPill || 'AUTOMATION WORKFLOW';
  const mainTitle = scene.heading || 'Everything in One Unified Studio';
  const subtitle =
    scene.supportingText ||
    scene.narrationSegment?.text ||
    'Drop your raw voiceover, script, or clips — our AI pipeline structures every scene automatically.';

  const inputTiles = [
    { label: 'Video Clips', icon: '🎬', color: '#3B82F6' },
    { label: 'Audio Voice', icon: '🎙️', color: '#8B5CF6' },
    { label: 'Visual Assets', icon: '🖼️', color: '#10B981' },
    { label: 'Script Text', icon: '📝', color: '#F59E0B' },
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
        padding: '45px 70px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(ellipse 95% 85% at 50% 0%, #171B36 0%, #0A0D18 60%, #030611 100%)'
          : 'radial-gradient(ellipse 95% 85% at 50% 0%, #EEF4FF 0%, #F8FAFC 60%, #F1F5F9 100%)',
        color: textPrimary,
      }}
    >
      {/* Background Subtle Tech Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isDark ? 0.07 : 0.035,
          backgroundImage:
            'radial-gradient(#6366F1 1.5px, transparent 1.5px), radial-gradient(#6366F1 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Central Glow behind the mockup */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '52%',
          transform: 'translate(-50%, -50%)',
          width: '780px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(255, 87, 34, 0.08) 50%, transparent 75%)',
          filter: 'blur(70px)',
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
            padding: '6px 18px',
            borderRadius: '9999px',
            backgroundColor: isDark ? 'rgba(99, 102, 241, 0.18)' : 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(129, 140, 248, 0.35)',
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
              color: isDark ? '#A5B4FC' : '#4338CA',
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
            letterSpacing: '-0.02em',
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
            maxWidth: '1000px',
            lineHeight: 1.35,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* MAIN 16:9 CONTENT: LEFT INPUT CARDS ➔ CONNECTOR ARROWS ➔ CENTRAL MOCKUP */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '15px',
          marginBottom: '10px',
          zIndex: 10,
        }}
      >
        {/* LEFT COLUMN: 4 Media Input Cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flex: '0 0 260px',
            opacity: inputsSpring,
            transform: `translateX(${interpolate(inputsSpring, [0, 1], [-30, 0])}px)`,
          }}
        >
          {inputTiles.map((tile, idx) => {
            const tileSpring = spring({
              frame: Math.max(0, frame - (8 + idx * 4)),
              fps,
              config: { damping: 14, stiffness: 95 },
            });
            return (
              <div
                key={tile.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  background: isDark
                    ? 'rgba(15, 23, 42, 0.8)'
                    : 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                  boxShadow: isDark
                    ? '0 10px 24px rgba(0, 0, 0, 0.35)'
                    : '0 10px 24px rgba(0, 0, 0, 0.05)',
                  opacity: tileSpring,
                  transform: `scale(${interpolate(tileSpring, [0, 1], [0.92, 1])})`,
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: `${tile.color}22`,
                    border: `1px solid ${tile.color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                  }}
                >
                  {tile.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: headingFont,
                      fontSize: '16px',
                      fontWeight: 700,
                      color: textPrimary,
                    }}
                  >
                    {tile.label}
                  </div>
                  <div
                    style={{
                      fontFamily: bodyFont,
                      fontSize: '12px',
                      color: tile.color,
                      fontWeight: 600,
                    }}
                  >
                    Ready to Sync
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MIDDLE: Animated Flow Connectors */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            height: '240px',
            width: '60px',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <svg width="60" height="240" viewBox="0 0 60 240" fill="none">
            {/* 4 Flow Lines converging */}
            {[25, 85, 155, 215].map((y, idx) => (
              <g key={idx}>
                <path
                  d={`M 0 ${y} C 30 ${y}, 30 120, 60 120`}
                  stroke={isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.25)'}
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  fill="none"
                />
                {/* Moving Pulse Dot */}
                <circle
                  cx={interpolate(flowProgress, [0, 1], [5, 55])}
                  cy={interpolate(flowProgress, [0, 1], [y, 120])}
                  r="3.5"
                  fill={accentColor}
                  filter={`drop-shadow(0 0 6px ${accentColor})`}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* RIGHT / CENTER: High-Fidelity Modern Laptop / Browser SaaS Mockup */}
        <div
          style={{
            flex: '0 0 960px',
            borderRadius: '20px',
            background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            border: `2px solid ${isDark ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.25)'}`,
            boxShadow: isDark
              ? '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.2)'
              : '0 25px 60px rgba(0, 0, 0, 0.12), 0 0 25px rgba(99, 102, 241, 0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            opacity: mockupSpring,
            transform: `scale(${interpolate(mockupSpring, [0, 1], [0.95, 1])})`,
          }}
        >
          {/* Mockup Window Chrome Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(248, 250, 252, 0.8)',
            }}
          >
            {/* Window Traffic Lights */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>

            {/* Address Bar */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 24px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.9)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                fontFamily: bodyFont,
                fontSize: '12px',
                color: isDark ? '#94A3B8' : '#64748B',
                fontWeight: 600,
              }}
            >
              <span style={{ color: '#10B981' }}>🔒</span>
              <span>itnavideo.com/studio/faceless-editor</span>
            </div>

            {/* Cloud Status Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <span style={{ fontFamily: headingFont, fontSize: '11px', fontWeight: 700, color: '#10B981' }}>
                ONLINE
              </span>
            </div>
          </div>

          {/* Mockup Studio Workspace Content */}
          <div
            style={{
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Top Workspace Bar: Active Mode & Progress */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontFamily: headingFont,
                      fontSize: '18px',
                      fontWeight: 800,
                      color: textPrimary,
                    }}
                  >
                    16:9 Faceless Video Studio
                  </span>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 87, 34, 0.18)',
                      color: accentColor,
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                    }}
                  >
                    AI DIRECTOR V2
                  </span>
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: '13px', color: textSecondary, marginTop: '2px' }}>
                  Automatic scene breakdown, dynamic SVG illustrations, kinetic subtitles
                </div>
              </div>

              {/* Action Button */}
              <button
                style={{
                  padding: '10px 22px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FF5722 0%, #EA580C 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontFamily: headingFont,
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(234, 88, 12, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>⚡</span>
                <span>GENERATE 1080P</span>
              </button>
            </div>

            {/* Central Media Canvas with 3 Scene Cards Preview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
              }}
            >
              {[
                { title: 'Scene 01: Hook', badge: 'Story Character', color: '#3B82F6', icon: '👤' },
                { title: 'Scene 02: Process', badge: '5-Step Framework', color: '#10B981', icon: '📊' },
                { title: 'Scene 03: Result', badge: 'Comparison Battle', color: '#8B5CF6', icon: '🏆' },
              ].map((card, idx) => (
                <div
                  key={card.title}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px' }}>{card.icon}</span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: `${card.color}22`,
                        color: card.color,
                        fontSize: '10px',
                        fontWeight: 700,
                      }}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <div style={{ fontFamily: headingFont, fontSize: '15px', fontWeight: 700, color: textPrimary }}>
                    {card.title}
                  </div>
                  {/* Miniature Skeleton Lines */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                        width: '85%',
                      }}
                    />
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                        width: '60%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Studio Bottom Timeline Bar */}
            <div
              style={{
                padding: '12px 18px',
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.9)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <span style={{ fontSize: '14px', color: accentColor }}>▶</span>
              <div style={{ flex: 1, position: 'relative' }}>
                {/* Timeline Bar Track */}
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${interpolate((frame % 90), [0, 90], [15, 85])}%`,
                      background: 'linear-gradient(90deg, #3B82F6, #FF5722)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
              <span
                style={{
                  fontFamily: bodyFont,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isDark ? '#94A3B8' : '#64748B',
                }}
              >
                00:45 / 03:00
              </span>
            </div>
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
          Seamless synthesis: Inputs combine into a high-retention 16:9 production ready for YouTube.
        </span>
        <span style={{ fontFamily: headingFont, fontSize: '12px', fontWeight: 800, color: accentColor }}>
          STEP 2 / 5
        </span>
      </div>
    </div>
  );
}
