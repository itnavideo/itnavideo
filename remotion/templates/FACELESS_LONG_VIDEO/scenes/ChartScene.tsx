import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface ChartSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function ChartScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
}: ChartSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  // Animated metric counter
  const targetPercent = Math.min(650, Math.max(120, scene.chartValuePercent ? scene.chartValuePercent * 4 : 340));
  const animatedGrowth = Math.round(
    interpolate(
      spring({ frame: Math.max(0, frame - 6), fps, config: { damping: 16, stiffness: 85 } }),
      [0, 1],
      [12, targetPercent]
    )
  );

  // SVG Chart Line Draw Animation
  const pathLength = 900;
  const drawSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 18, stiffness: 60 },
  });
  const strokeDashoffset = interpolate(drawSpring, [0, 1], [pathLength, 0]);

  const statLabel = scene.statLabel || scene.heading || 'CHANNEL GROWTH MOMENTUM';
  const subtitle = scene.supportingText || 'Your channel is performing significantly above your typical viewer retention average.';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 100px',
        zIndex: 15,
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.93, 1.0])})`,
      }}
    >
      {/* YouTube Creator Studio Analytics Glass Card */}
      <div
        style={{
          maxWidth: '1120px',
          width: '100%',
          borderRadius: '32px',
          border: '2px solid rgba(255, 255, 255, 0.16)',
          backgroundColor: 'rgba(10, 14, 26, 0.94)',
          padding: '40px 52px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(16, 185, 129, 0.12)',
          backdropFilter: 'blur(30px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: bodyFont,
        }}
      >
        {/* Subtle Top Glow Accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #10B981 0%, #34D399 50%, #FF5722 100%)',
          }}
        />

        {/* Studio Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Analytics Play Icon */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#EF4444">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 16H7v-5h2v5zm4 0h-2v-9h2v9zm4 0h-2v-3h2v3z"/>
              </svg>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                YouTube Creator Studio Analytics
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', fontFamily: headingFont }}>
                {statLabel}
              </div>
            </div>
          </div>

          {/* Live indicator badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              fontSize: '13px',
              fontWeight: 800,
              color: '#34D399',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 10px #10B981',
              }}
            />
            REALTIME OVERVIEW
          </div>
        </div>

        {/* Hero Stat Row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '16px' }}>
          <div
            style={{
              fontFamily: headingFont,
              fontSize: '56px',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
            }}
          >
            +{animatedGrowth}%
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.45)',
              color: '#34D399',
              fontSize: '15px',
              fontWeight: 900,
            }}
          >
            <span>↗</span> MORE THAN USUAL
          </div>
        </div>

        {/* Dynamic SVG Growth Chart Curve */}
        <div style={{ width: '100%', height: '160px', position: 'relative', margin: '10px 0 24px' }}>
          <svg
            viewBox="0 0 800 160"
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

            {/* Dotted grid lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="800" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="800" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

            {/* Area Fill */}
            <path
              d="M 0 140 C 120 135, 200 120, 320 85 C 440 50, 560 60, 680 25 C 740 10, 780 8, 800 5 L 800 150 L 0 150 Z"
              fill="url(#chartGradient)"
              opacity={interpolate(drawSpring, [0, 1], [0, 1])}
            />

            {/* Main Growth Curve Line */}
            <path
              d="M 0 140 C 120 135, 200 120, 320 85 C 440 50, 560 60, 680 25 C 740 10, 780 8, 800 5"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
              style={{ filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.7))' }}
            />

            {/* Glowing endpoint indicator */}
            {drawSpring > 0.85 && (
              <circle
                cx="800"
                cy="5"
                r="7"
                fill="#34D399"
                stroke="#FFFFFF"
                strokeWidth="3"
                style={{ filter: 'drop-shadow(0 0 10px #34D399)' }}
              />
            )}
          </svg>
        </div>

        {/* 3 Analytics Metric Pills at bottom */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>Total Views</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px', fontFamily: headingFont }}>
              1.48M
            </div>
            <div style={{ fontSize: '13px', color: '#34D399', fontWeight: 800, marginTop: '2px' }}>
              ↗ +{animatedGrowth}%
            </div>
          </div>

          <div
            style={{
              padding: '16px 20px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>Watch Time (Hours)</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px', fontFamily: headingFont }}>
              62.4K
            </div>
            <div style={{ fontSize: '13px', color: '#34D399', fontWeight: 800, marginTop: '2px' }}>
              ↗ +215%
            </div>
          </div>

          <div
            style={{
              padding: '16px 20px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>Subscribers</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px', fontFamily: headingFont }}>
              +48,600
            </div>
            <div style={{ fontSize: '13px', color: '#34D399', fontWeight: 800, marginTop: '2px' }}>
              ↗ +490%
            </div>
          </div>
        </div>

        {/* Supporting Subtitle */}
        <p
          style={{
            fontSize: '15px',
            color: '#94A3B8',
            marginTop: '20px',
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
