import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TransformStage {
  label: string;
  subtext: string;
  icon: string;
}

export interface ObjectTransformationProps {
  headline?: string;
  stages?: TransformStage[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_STAGES: TransformStage[] = [
  { label: 'Raw Seed', subtext: 'Simple text prompt', icon: '🌱' },
  { label: 'Sprout', subtext: 'Whisper audio sync', icon: '🌿' },
  { label: 'Tree', subtext: 'Remotion composition', icon: '🌲' },
  { label: 'Forest', subtext: 'Autonomous multi-channel media empire', icon: '🌍' },
];

/**
 * ObjectTransformation — Evolutionary transformation storytelling graphic.
 * Illustrates metamorphic growth from a humble seed to an expansive ecosystem.
 */
export function ObjectTransformation({
  headline = 'THE METAMORPHIC EVOLUTION',
  stages = DEFAULT_STAGES,
  accentColor = '#10b981',
  delay = 0,
  width = 520,
  height = 320,
}: ObjectTransformationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          METAMORPHOSIS TIMELINE
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Evolution Stages Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {stages.map((st, i) => {
          const stageSpr = spring({
            frame: Math.max(0, t - i * 8),
            fps,
            config: { damping: 12, stiffness: 90 },
          });

          return (
            <React.Fragment key={st.label}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  opacity: stageSpr,
                  transform: `scale(${interpolate(stageSpr, [0, 1], [0.8, 1])})`,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
                  }}
                >
                  {st.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#ffffff', marginTop: 8 }}>
                  {st.label}
                </div>
                <div style={{ fontSize: 9, color: '#94a3b8', maxWidth: 80, marginTop: 2 }}>
                  {st.subtext}
                </div>
              </div>

              {i < stages.length - 1 && (
                <div style={{ color: accentColor, fontWeight: 900, fontSize: 18, opacity: stageSpr }}>
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
        <span>SEED TO EXPONENTIAL HARVEST</span>
        <span style={{ color: '#22c55e', fontWeight: 700 }}>UNSTOPPABLE TRAJECTORY</span>
      </div>
    </div>
  );
}
