import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CycleStep {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface CycleDiagramProps {
  title?: string;
  subtitle?: string;
  steps?: CycleStep[];
  size?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_CYCLE_STEPS: CycleStep[] = [
  { label: '1. Ideate', description: 'Topic & Angle', color: '#0066FF' },
  { label: '2. Script', description: 'Hook & Outline', color: '#2563EB' },
  { label: '3. Render', description: 'Remotion Cloud', color: '#10B981' },
  { label: '4. Publish', description: 'Reels & Shorts', color: '#F59E0B' },
  { label: '5. Analyze', description: 'Retention Data', color: '#8B5CF6' },
];

export const CycleDiagram: React.FC<CycleDiagramProps> = ({
  title = 'Viral Content Engine Loop',
  subtitle = 'Continuous feedback flywheel',
  steps = DEFAULT_CYCLE_STEPS,
  size = 380,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.42)' : 'rgba(15, 23, 42, 0.04)';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const items = steps && steps.length >= 3 ? steps : DEFAULT_CYCLE_STEPS;
  const numSteps = items.length;
  const radius = size * 0.36;
  const center = size / 2;

  const cycleSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: 'none',
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

      {/* Circular Flywheel Loop */}
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Orbital Track SVG */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0 }}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
            strokeWidth={3}
            strokeDasharray="6 6"
          />
        </svg>

        {/* Center Flywheel Hub */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 800, color: textMuted, textTransform: 'uppercase' }}>Flywheel</span>
          <span style={{ fontSize: '14px', fontWeight: 900, color: textColor }}>Loop</span>
        </div>

        {/* Circular Nodes */}
        {items.map((step, idx) => {
          const angle = (idx / numSteps) * 2 * Math.PI - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);

          const stepSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 4),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const stepColor = step.color || '#0066FF';

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -50%) scale(${stepSpring})`,
                opacity: stepSpring,
                backgroundColor: cardBg,
                border: `2px solid ${stepColor}`,
                borderRadius: '16px',
                padding: '10px 14px',
                textAlign: 'center',
                boxShadow: `0 4px 18px ${stepColor}33`,
                whiteSpace: 'nowrap',
                zIndex: 5,
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, color: textColor }}>
                {step.label}
              </div>
              {step.description && (
                <div style={{ fontSize: '10px', fontWeight: 500, color: textMuted, marginTop: '2px' }}>
                  {step.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
