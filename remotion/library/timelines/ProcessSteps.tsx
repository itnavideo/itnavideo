import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProcessStepItem {
  stepNumber: string | number;
  title: string;
  description?: string;
  status?: 'completed' | 'active' | 'upcoming';
  badge?: string;
  color?: string;
}

export interface ProcessStepsProps {
  title?: string;
  subtitle?: string;
  steps?: ProcessStepItem[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_PROCESS_STEPS: ProcessStepItem[] = [
  { stepNumber: '01', title: 'Extract Audio & Transcribe', description: 'Groq Whisper large-v3-turbo sub-second speech-to-text', status: 'completed', color: '#10B981', badge: 'Fast API' },
  { stepNumber: '02', title: 'Generate Kinetic Captions', description: 'Synchronize word-level timestamps & active karaoke glow', status: 'completed', color: '#10B981', badge: 'Karaoke' },
  { stepNumber: '03', title: 'Match Viral B-Roll Visuals', description: 'Smart cinematic matching from AWS S3 media asset pool', status: 'active', color: '#0066FF', badge: 'In Progress' },
  { stepNumber: '04', title: 'AWS Lambda Render', description: 'Parallel distributed Chromium video export under 60 seconds', status: 'upcoming', color: '#94A3B8', badge: 'Cloud' },
];

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  title = 'Execution Process Steps',
  subtitle = 'Sequential operational workflow progress',
  steps = DEFAULT_PROCESS_STEPS,
  width = '100%',
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

  const items = steps && steps.length > 0 ? steps : DEFAULT_PROCESS_STEPS;

  return (
    <div
      style={{
        width,
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
        <div style={{ marginBottom: '24px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Steps Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.map((step, idx) => {
          const stepSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 5),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const stepColor = step.color || (step.status === 'active' ? '#0066FF' : step.status === 'completed' ? '#10B981' : '#64748B');
          const isActive = step.status === 'active';

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                padding: '16px 20px',
                backgroundColor: cardBg,
                border: `1.5px solid ${isActive ? stepColor : borderColor}`,
                borderRadius: '16px',
                boxShadow: isActive ? `0 0 24px ${stepColor}33` : undefined,
                transform: `scale(${stepSpring}) translateY(${(1 - stepSpring) * 15}px)`,
                opacity: stepSpring,
                boxSizing: 'border-box',
              }}
            >
              {/* Step Number Circle */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: `${stepColor}22`,
                  border: `2px solid ${stepColor}`,
                  color: stepColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                {step.stepNumber}
              </div>

              {/* Title & Description */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: textColor }}>
                    {step.title}
                  </span>
                  {step.badge && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: `${stepColor}22`,
                        color: stepColor,
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>
                {step.description && (
                  <div style={{ fontSize: '12px', fontWeight: 500, color: textMuted, marginTop: '3px' }}>
                    {step.description}
                  </div>
                )}
              </div>

              {/* Status Indicator Pill */}
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: step.status === 'completed' ? '#10B98122' : isActive ? '#0066FF22' : 'transparent',
                  color: step.status === 'completed' ? '#10B981' : isActive ? '#0066FF' : textMuted,
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'capitalize',
                  border: `1px solid ${stepColor}44`,
                }}
              >
                {step.status || 'step'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
