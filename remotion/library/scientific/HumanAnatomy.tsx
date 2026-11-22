import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AnatomyCallout {
  name: string;
  metric?: string;
  status?: string;
  x: number; // percentage of canvas
  y: number; // percentage of canvas
  side?: 'left' | 'right';
  color?: string;
}

export interface HumanAnatomyProps {
  gender?: 'neutral' | 'masculine' | 'feminine';
  callouts?: AnatomyCallout[];
  pulseHeart?: boolean;
  scanlineBeam?: boolean;
  accentColor?: string;
  width?: number | string;
  height?: number;
  delay?: number;
}

const DEFAULT_CALLOUTS: AnatomyCallout[] = [
  { name: 'Cerebral Cortex', metric: '100B Neurons', status: 'OPTIMAL', x: 50, y: 15, side: 'right', color: '#6366f1' },
  { name: 'Cardiovascular Heart', metric: '72 BPM', status: 'RHYTHMIC', x: 48, y: 34, side: 'left', color: '#ef4444' },
  { name: 'Respiratory Lungs', metric: '98% SpO₂', status: 'STABLE', x: 52, y: 38, side: 'right', color: '#38bdf8' },
  { name: 'Metabolic Core', metric: '1.2 mmol/L', status: 'NORMAL', x: 50, y: 55, side: 'left', color: '#10b981' },
];

/**
 * HumanAnatomy — Stylized medical and biological human anatomy diagram.
 * Features vector silhouette, pulsating heart indicator, animated laser scan beam,
 * and diagnostic biometric callout tags.
 */
export function HumanAnatomy({
  gender = 'neutral',
  callouts = DEFAULT_CALLOUTS,
  pulseHeart = true,
  scanlineBeam = true,
  accentColor = '#10b981',
  width = '100%',
  height = 420,
  delay = 0,
}: HumanAnatomyProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Cardiac cycle pulse (simulate lub-dub heart rhythm)
  const heartLoop = adjustedFrame % 30;
  const isHeartBeat = pulseHeart && (heartLoop < 4 || (heartLoop > 6 && heartLoop < 10));
  const heartScale = isHeartBeat ? 1.4 : 1;

  // Scanning laser beam Y position
  const scanProgress = (adjustedFrame % 90) / 90;
  const scanY = scanProgress * (height - 40);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Central Anatomy Silhouette */}
      <svg
        width={height * 0.65}
        height={height - 20}
        viewBox="0 0 240 380"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="body-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#090d16" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Head */}
        <circle cx="120" cy="50" r="26" fill="url(#body-grad)" stroke={accentColor} strokeWidth="1.5" />

        {/* Neck */}
        <rect x="113" y="74" width="14" height="16" fill="url(#body-grad)" />

        {/* Torso & Arms abstract silhouette */}
        <path
          d="M 80 90 L 160 90 L 148 200 L 138 230 L 102 230 L 92 200 Z"
          fill="url(#body-grad)"
          stroke={accentColor}
          strokeWidth="1.5"
        />

        {/* Arms */}
        <path d="M 80 90 L 60 170 L 52 240" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
        <path d="M 160 90 L 180 170 L 188 240" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" opacity="0.6" />

        {/* Legs */}
        <path d="M 106 230 L 98 310 L 94 370" fill="none" stroke={accentColor} strokeWidth="8" strokeLinecap="round" opacity="0.7" />
        <path d="M 134 230 L 142 310 L 146 370" fill="none" stroke={accentColor} strokeWidth="8" strokeLinecap="round" opacity="0.7" />

        {/* Pulsating Heart Indicator Node */}
        {pulseHeart && (
          <g transform="translate(116, 130)">
            <circle
              r={7 * heartScale}
              fill="#ef4444"
              filter="drop-shadow(0 0 10px #ef4444)"
            />
            <circle
              r={14 * heartScale}
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.5"
              opacity={isHeartBeat ? 0.8 : 0.2}
            />
          </g>
        )}

        {/* Brain Node */}
        <circle cx="120" cy="50" r="8" fill="#6366f1" opacity="0.8" filter="drop-shadow(0 0 8px #6366f1)" />

        {/* Scanning Laser Beam */}
        {scanlineBeam && (
          <line
            x1="20"
            y1={scanY}
            x2="220"
            y2={scanY}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.85"
            filter="drop-shadow(0 0 6px #10b981)"
          />
        )}
      </svg>

      {/* Floating Biometric Callout Tags */}
      {callouts.map((c, i) => {
        const isRight = c.side === 'right';
        const tagColor = c.color || accentColor;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${c.y}%`,
              left: isRight ? '62%' : 'auto',
              right: isRight ? 'auto' : '62%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              padding: '6px 12px',
              borderRadius: 8,
              backgroundColor: 'rgba(9, 9, 11, 0.85)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${tagColor}60`,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
              minWidth: 120,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{c.name}</span>
              {c.status && (
                <span style={{ color: tagColor, fontSize: 9, fontWeight: 800 }}>{c.status}</span>
              )}
            </div>
            {c.metric && (
              <span style={{ color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}>
                {c.metric}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
