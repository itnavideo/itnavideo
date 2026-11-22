import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AssemblyStep {
  stepNumber: number;
  partName: string;
  description: string;
  snapSoundTriggerFrame?: number;
}

export interface ProductAssemblyProps {
  title?: string;
  subtitle?: string;
  steps?: AssemblyStep[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_STEPS: AssemblyStep[] = [
  { stepNumber: 1, partName: 'Unibody Chassis Base', description: 'CNC milled aerospace aluminum housing locked in place' },
  { stepNumber: 2, partName: 'Logic Board & Sensor Array', description: 'Zero-insertion force magnetic connector engaged' },
  { stepNumber: 3, partName: 'Acoustic Driver Chamber', description: 'Dual silicone acoustic isolation gaskets seated' },
  { stepNumber: 4, partName: 'Sapphire Bezel Ring', description: 'Hermetically sealed with IP68 pressure lock' },
];

/**
 * ProductAssembly — High-precision sequential assembly line visualization.
 * Demonstrates component-by-component assembly with snap-into-place kinetic physics,
 * completion checklist, and progress tracker.
 */
export function ProductAssembly({
  title = 'PRECISION ASSEMBLY SEQUENCE',
  subtitle = 'High-Speed Automated Robotic Manufacturing Line',
  steps = DEFAULT_STEPS,
  accentColor = '#10b981',
  delay = 0,
  width = 520,
  height = 540,
}: ProductAssemblyProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Calculate active step based on frame progression
  const stepDuration = 25;
  const currentStepIndex = Math.min(steps.length - 1, Math.floor(t / stepDuration));
  const progressPercent = Math.min(100, Math.round(((t) / (steps.length * stepDuration)) * 100));

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 24px',
        boxSizing: 'border-box',
        background: 'linear-gradient(180deg, #09090b 0%, #111827 100%)',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header with Live Progress */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
          opacity: intro,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
              {title}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{subtitle}</div>
        </div>

        {/* Progress Pill */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '6px 14px',
            borderRadius: 9999,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
            {progressPercent}%
          </span>
          <span style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>
            Assembled
          </span>
        </div>
      </div>

      {/* Assembly Steps List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'center' }}>
        {steps.map((st, idx) => {
          const stepStartFrame = idx * stepDuration;
          const isCurrent = idx === currentStepIndex;
          const isDone = t >= (idx + 1) * stepDuration;

          const stepSpring = spring({
            frame: Math.max(0, t - stepStartFrame),
            fps,
            config: { damping: 15, stiffness: 95 },
          });

          // Snap animation: translate from right or top and snap into place
          const snapX = isDone ? 0 : interpolate(stepSpring, [0, 1], [40, 0]);

          return (
            <div
              key={st.stepNumber}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 18px',
                borderRadius: 16,
                background: isCurrent
                  ? 'rgba(16, 185, 129, 0.08)'
                  : isDone
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(255, 255, 255, 0.01)',
                border: isCurrent
                  ? `1px solid ${accentColor}`
                  : '1px solid rgba(255, 255, 255, 0.06)',
                opacity: stepSpring,
                transform: `translateX(${snapX}px)`,
                transition: 'border-color 0.2s',
              }}
            >
              {/* Step Status Icon Badge */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDone
                    ? accentColor
                    : isCurrent
                    ? `${accentColor}22`
                    : 'rgba(255, 255, 255, 0.06)',
                  color: isDone ? '#000000' : '#ffffff',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                {isDone ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  st.stepNumber
                )}
              </div>

              {/* Step Details */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                  {st.partName}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  {st.description}
                </div>
              </div>

              {/* Magnetic Lock Status */}
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: isDone
                      ? 'rgba(16, 185, 129, 0.2)'
                      : isCurrent
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: isDone ? '#34d399' : isCurrent ? '#fbbf24' : '#64748b',
                  }}
                >
                  {isDone ? 'LOCKED' : isCurrent ? 'SNAPPING...' : 'QUEUED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Status Bar */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: intro,
        }}
      >
        <span style={{ fontSize: 11, color: '#64748b' }}>
          AUTOMATED ROBOTIC GANTRY: ACTIVE
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: accentColor }}>
          CALIBRATED 0.01mm
        </span>
      </div>
    </div>
  );
}
