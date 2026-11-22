import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RadialDiagramSpoke {
  label: string;
  subLabel?: string;
  color?: string;
  icon?: string;
}

export interface RadialDiagramProps {
  title?: string;
  subtitle?: string;
  centralTitle?: string;
  spokes?: RadialDiagramSpoke[];
  size?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_SPOKES: RadialDiagramSpoke[] = [
  { label: 'Voiceover STT', subLabel: 'Groq Whisper', color: '#0066FF' },
  { label: 'Visual Matcher', subLabel: 'AWS S3 Pool', color: '#10B981' },
  { label: 'Kinetic Subs', subLabel: '32 Styles', color: '#F59E0B' },
  { label: 'Lambda Cloud', subLabel: 'Distributed', color: '#8B5CF6' },
  { label: 'Audio Cleaner', subLabel: '-36dB Noise', color: '#EF4444' },
  { label: 'SEO Engine', subLabel: 'Auto Metadata', color: '#06B6D4' },
];

export const RadialDiagram: React.FC<RadialDiagramProps> = ({
  title = 'Hub & Spoke Radial Architecture',
  subtitle = 'Central engine with radiating operational capabilities',
  centralTitle = 'Itnavideo Engine',
  spokes = DEFAULT_SPOKES,
  size = 380,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const spokeColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';

  const center = size / 2;
  const radius = size * 0.36;
  const items = spokes && spokes.length >= 3 ? spokes : DEFAULT_SPOKES;

  const centerSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.45)' : '0 8px 30px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>
          {title && <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* SVG Canvas for Spoke Lines */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Orbital Circle Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
            strokeWidth={2}
            strokeDasharray="4 4"
          />

          {/* Radiating Spokes from Center */}
          {items.map((spoke, idx) => {
            const angle = (idx / items.length) * 2 * Math.PI - Math.PI / 2;
            const x2 = center + radius * Math.cos(angle);
            const y2 = center + radius * Math.sin(angle);

            const spokeSpring = spring({
              frame: Math.max(0, frame - delayFrames - idx * 3),
              fps,
              config: { damping: 14, stiffness: 85 },
            });

            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={center + (x2 - center) * spokeSpring}
                y2={center + (y2 - center) * spokeSpring}
                stroke={spoke.color || spokeColor}
                strokeWidth={2}
                opacity={spokeSpring}
              />
            );
          })}
        </svg>

        {/* Central Core Circle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${centerSpring})`,
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: '#0066FF',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10px',
            boxSizing: 'border-box',
            boxShadow: '0 8px 30px rgba(0, 102, 255, 0.45)',
            fontSize: '13px',
            fontWeight: 900,
            lineHeight: 1.15,
            zIndex: 10,
          }}
        >
          {centralTitle}
        </div>

        {/* Outer Nodes */}
        {items.map((spoke, idx) => {
          const angle = (idx / items.length) * 2 * Math.PI - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);

          const nodeSpring = spring({
            frame: Math.max(0, frame - delayFrames - 8 - idx * 3),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const nodeColor = spoke.color || '#0066FF';

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -50%) scale(${nodeSpring})`,
                opacity: nodeSpring,
                backgroundColor: cardBg,
                border: `1.5px solid ${nodeColor}`,
                borderRadius: '14px',
                padding: '8px 12px',
                textAlign: 'center',
                boxShadow: `0 4px 16px ${nodeColor}33`,
                whiteSpace: 'nowrap',
                zIndex: 5,
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, color: textColor }}>
                {spoke.label}
              </div>
              {spoke.subLabel && (
                <div style={{ fontSize: '10px', fontWeight: 600, color: nodeColor, marginTop: '2px' }}>
                  {spoke.subLabel}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
