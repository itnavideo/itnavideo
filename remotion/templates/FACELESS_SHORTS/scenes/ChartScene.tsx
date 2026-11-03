import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface ChartSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

/* ───────────────────────── SVG Icons ───────────────────────── */

function TrendUpSvg({ size = 18, color = '#34D399' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function AnalyticsBarIcon({ size = 20, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 16H7v-5h2v5zm4 0h-2v-9h2v9zm4 0h-2v-3h2v3z" />
    </svg>
  );
}

export function ChartScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
}: ChartSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;
  const isDark = palette?.isDark ?? true;

  const bg = isDark ? (palette?.background || '#090D16') : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? 'rgba(10, 14, 26, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)';

  // Entrance spring
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  // Animated metric counter
  const targetPercent = Math.min(850, Math.max(120, scene.chartValuePercent ? scene.chartValuePercent * 4 : 340));
  const animatedGrowth = Math.round(
    interpolate(
      spring({ frame: Math.max(0, currentFrame - 6), fps, config: { damping: 16, stiffness: 85 } }),
      [0, 1],
      [12, targetPercent]
    )
  );

  // SVG Chart Line Draw Animation
  const pathLength = 900;
  const drawSpring = spring({
    frame: Math.max(0, currentFrame - 10),
    fps,
    config: { damping: 18, stiffness: 60 },
  });
  const strokeDashoffset = interpolate(drawSpring, [0, 1], [pathLength, 0]);

  const statLabel = scene.statLabel || scene.heading || 'GROWTH TRAJECTORY';
  const subtitle = scene.supportingText || 'Performance scaling significantly above baseline metrics.';
  const statVal = scene.statValue || `+${animatedGrowth}%`;

  // Parse custom items or use safe defaults
  const customItems = scene.listItems && scene.listItems.length >= 2 ? scene.listItems : [
    'Audience Reach',
    'Engagement Depth',
    'Compounding Return',
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isPortrait ? `${160 * s}px ${45 * s}px ${180 * s}px` : `${50 * s}px ${80 * s}px`,
        zIndex: 15,
        backgroundColor: bg,
        boxSizing: 'border-box',
        overflow: 'hidden',
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.93, 1.0])})`,
      }}
    >
      {/* Analytics Glass Card */}
      <div
        style={{
          maxWidth: isPortrait ? '520px' : '1080px',
          width: '100%',
          borderRadius: `${28 * s}px`,
          border: `2px solid ${cardBorder}`,
          backgroundColor: cardBg,
          padding: isPortrait ? `${24 * s}px ${24 * s}px` : `${36 * s}px ${48 * s}px`,
          boxShadow: isDark
            ? '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.12)'
            : '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 30px rgba(16, 185, 129, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: bodyFont,
          boxSizing: 'border-box',
        }}
      >
        {/* Top Glow Accent Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${4 * s}px`,
            background: 'linear-gradient(90deg, #10B981 0%, #34D399 50%, #FF5722 100%)',
          }}
        />

        {/* Studio Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: `${18 * s}px` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: `${12 * s}px` }}>
            <div
              style={{
                width: `${40 * s}px`,
                height: `${40 * s}px`,
                borderRadius: `${10 * s}px`,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AnalyticsBarIcon size={20 * s} color="#10B981" />
            </div>

            <div>
              <div style={{ fontSize: `${12 * s}px`, fontWeight: 800, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                CREATOR PERFORMANCE ANALYTICS
              </div>
              <div style={{ fontSize: isPortrait ? `${20 * s}px` : `${24 * s}px`, fontWeight: 900, color: textPrimary, fontFamily: headingFont }}>
                {statLabel}
              </div>
            </div>
          </div>

          {/* Live indicator badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: `${6 * s}px`,
              padding: `${5 * s}px ${12 * s}px`,
              borderRadius: `${999 * s}px`,
              backgroundColor: 'rgba(16, 185, 129, 0.14)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              fontSize: `${12 * s}px`,
              fontWeight: 800,
              color: '#10B981',
            }}
          >
            <span
              style={{
                width: `${7 * s}px`,
                height: `${7 * s}px`,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981',
              }}
            />
            REALTIME
          </div>
        </div>

        {/* Hero Stat Row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: `${16 * s}px`, marginBottom: `${12 * s}px` }}>
          <div
            style={{
              fontFamily: headingFont,
              fontSize: isPortrait ? `${44 * s}px` : `${54 * s}px`,
              fontWeight: 900,
              color: textPrimary,
              letterSpacing: '-0.03em',
            }}
          >
            {statVal}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: `${6 * s}px`,
              padding: `${5 * s}px ${12 * s}px`,
              borderRadius: `${999 * s}px`,
              backgroundColor: 'rgba(16, 185, 129, 0.16)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10B981',
              fontSize: `${13 * s}px`,
              fontWeight: 900,
            }}
          >
            <TrendUpSvg size={14 * s} color="#10B981" />
            <span>EXCEEDING BENCHMARK</span>
          </div>
        </div>

        {/* Dynamic SVG Growth Chart Curve */}
        <div style={{ width: '100%', height: isPortrait ? `${120 * s}px` : `${150 * s}px`, position: 'relative', margin: `${8 * s}px 0 ${18 * s}px` }}>
          <svg
            viewBox="0 0 800 150"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="35" x2="800" y2="35" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="800" y2="80" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} strokeDasharray="4 4" />
            <line x1="0" y1="130" x2="800" y2="130" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} strokeDasharray="4 4" />

            {/* Area Fill */}
            <path
              d="M 0 130 C 120 125, 200 110, 320 75 C 440 40, 560 50, 680 20 C 740 8, 780 6, 800 4 L 800 145 L 0 145 Z"
              fill="url(#chartGradient)"
              opacity={interpolate(drawSpring, [0, 1], [0, 1])}
            />

            {/* Main Growth Curve Line */}
            <path
              d="M 0 130 C 120 125, 200 110, 320 75 C 440 40, 560 50, 680 20 C 740 8, 780 6, 800 4"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
            />

            {/* Glowing endpoint indicator */}
            {drawSpring > 0.85 && (
              <circle
                cx="800"
                cy="4"
                r="7"
                fill="#34D399"
                stroke="#FFFFFF"
                strokeWidth="3"
              />
            )}
          </svg>
        </div>

        {/* 3 Metric Pills at bottom */}
        <div style={{ display: 'grid', gridTemplateColumns: isPortrait ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)', gap: `${10 * s}px` }}>
          <div
            style={{
              padding: `${12 * s}px ${14 * s}px`,
              borderRadius: `${14 * s}px`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.03)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
            }}
          >
            <div style={{ fontSize: `${11 * s}px`, color: textSecondary, fontWeight: 700 }}>{customItems[0]}</div>
            <div style={{ fontSize: isPortrait ? `${18 * s}px` : `${20 * s}px`, fontWeight: 900, color: textPrimary, marginTop: `${2 * s}px`, fontFamily: headingFont }}>
              +280%
            </div>
            <div style={{ fontSize: `${11 * s}px`, color: '#10B981', fontWeight: 800, marginTop: `${2 * s}px`, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendUpSvg size={11 * s} color="#10B981" /> Active
            </div>
          </div>

          <div
            style={{
              padding: `${12 * s}px ${14 * s}px`,
              borderRadius: `${14 * s}px`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.03)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
            }}
          >
            <div style={{ fontSize: `${11 * s}px`, color: textSecondary, fontWeight: 700 }}>{customItems[1] || 'Retention'}</div>
            <div style={{ fontSize: isPortrait ? `${18 * s}px` : `${20 * s}px`, fontWeight: 900, color: textPrimary, marginTop: `${2 * s}px`, fontFamily: headingFont }}>
              +195%
            </div>
            <div style={{ fontSize: `${11 * s}px`, color: '#10B981', fontWeight: 800, marginTop: `${2 * s}px`, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendUpSvg size={11 * s} color="#10B981" /> High
            </div>
          </div>

          <div
            style={{
              padding: `${12 * s}px ${14 * s}px`,
              borderRadius: `${14 * s}px`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.03)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
            }}
          >
            <div style={{ fontSize: `${11 * s}px`, color: textSecondary, fontWeight: 700 }}>{customItems[2] || 'Output'}</div>
            <div style={{ fontSize: isPortrait ? `${18 * s}px` : `${20 * s}px`, fontWeight: 900, color: textPrimary, marginTop: `${2 * s}px`, fontFamily: headingFont }}>
              +340%
            </div>
            <div style={{ fontSize: `${11 * s}px`, color: '#10B981', fontWeight: 800, marginTop: `${2 * s}px`, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendUpSvg size={11 * s} color="#10B981" /> Compounding
            </div>
          </div>
        </div>

        {/* Supporting Subtitle */}
        <p
          style={{
            fontSize: `${15 * s}px`,
            color: textSecondary,
            marginTop: `${14 * s}px`,
            marginBottom: 0,
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default ChartScene;
