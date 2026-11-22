import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ChainStage {
  step: string;
  label: string;
  icon: string;
}

export interface ChainReactionProps {
  headline?: string;
  stages?: ChainStage[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_STAGES: ChainStage[] = [
  { step: '01', label: 'Idea Spark', icon: '💡' },
  { step: '02', label: 'Script Prompt', icon: '⚡' },
  { step: '03', label: 'Remotion Cloud', icon: '⚙️' },
  { step: '04', label: 'Viral Revenue', icon: '🚀' },
];

/**
 * ChainReaction — Rube Goldberg sequential kinetic chain reaction visualization.
 * Demonstrates step-by-step causal energy transmission across operational links.
 */
export function ChainReaction({
  headline = 'AUTOMATED CHAIN REACTION',
  stages = DEFAULT_STAGES,
  accentColor = '#06b6d4',
  delay = 0,
  width = 540,
  height = 300,
}: ChainReactionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Current active energy stage
  const activeIdx = Math.min(stages.length - 1, Math.floor(t / 15));

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
          MULTI-STAGE PIPELINE
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Interactive Chain Stage Nodes */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Connecting Energy Conduit Line */}
        <div
          style={{
            position: 'absolute',
            left: 30,
            right: 30,
            top: '40%',
            height: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(activeIdx / (stages.length - 1)) * 100}%`,
              background: `linear-gradient(90deg, ${accentColor}, #22c55e)`,
              boxShadow: `0 0 12px ${accentColor}`,
              transition: 'width 0.2s ease',
            }}
          />
        </div>

        {stages.map((st, i) => {
          const isActive = i <= activeIdx;
          const isCurrent = i === activeIdx;

          return (
            <div
              key={st.step}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Circular Node */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: isCurrent ? accentColor : isActive ? '#10b981' : '#18181b',
                  border: isCurrent ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  boxShadow: isCurrent ? `0 0 20px ${accentColor}` : 'none',
                  transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }}
              >
                {st.icon}
              </div>

              <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', marginTop: 8 }}>
                {st.label}
              </div>
              <div style={{ fontSize: 9, color: '#64748b' }}>
                Stage {st.step}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
        <span>AUTONOMOUS EXECUTION TRIGGERED</span>
        <span style={{ color: accentColor, fontWeight: 700 }}>ZERO HUMAN BOTTLENECK</span>
      </div>
    </div>
  );
}
