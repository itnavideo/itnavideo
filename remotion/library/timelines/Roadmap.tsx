import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RoadmapPhase {
  quarter: string;
  phaseName: string;
  deliverables: string[];
  status?: 'launched' | 'active' | 'planned';
  color?: string;
}

export interface RoadmapProps {
  title?: string;
  subtitle?: string;
  phases?: RoadmapPhase[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_ROADMAP_PHASES: RoadmapPhase[] = [
  {
    quarter: 'Q1',
    phaseName: 'Phase 1: Foundation',
    status: 'launched',
    color: '#10B981',
    deliverables: ['Remotion Cloud Render Cluster', 'Groq Whisper STT API', 'Next.js 16 App Router'],
  },
  {
    quarter: 'Q2',
    phaseName: 'Phase 2: 15 Core Studios',
    status: 'launched',
    color: '#0066FF',
    deliverables: ['Faceless Video 16:9 Studio', 'Compare Explainer 9:16', 'Whiteboard Video Maker'],
  },
  {
    quarter: 'Q3',
    phaseName: 'Phase 3: 500+ Component Library',
    status: 'active',
    color: '#F59E0B',
    deliverables: ['Kinetic Typography Engine', 'Financial & Crypto Cards', 'Animated Charts & Timelines'],
  },
  {
    quarter: 'Q4',
    phaseName: 'Phase 4: Global Scale',
    status: 'planned',
    color: '#8B5CF6',
    deliverables: ['1-Click Multi-Language Dubbing', 'Autonomous AI Reel Director', 'Instant Viral Clips Slicing'],
  },
];

export const Roadmap: React.FC<RoadmapProps> = ({
  title = 'Product Strategic Roadmap',
  subtitle = 'Quarterly release milestones & feature execution',
  phases = DEFAULT_ROADMAP_PHASES,
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

  const items = phases && phases.length > 0 ? phases : DEFAULT_ROADMAP_PHASES;

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

      {/* Roadmap Phase Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {items.map((phase, idx) => {
          const phaseSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 4),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const phaseColor = phase.color || '#0066FF';
          const isActive = phase.status === 'active';

          return (
            <div
              key={idx}
              style={{
                backgroundColor: cardBg,
                border: `1.5px solid ${isActive ? phaseColor : borderColor}`,
                borderTop: `4px solid ${phaseColor}`,
                borderRadius: '16px',
                padding: '20px 18px',
                boxShadow: isActive ? `0 8px 24px ${phaseColor}33` : undefined,
                transform: `scale(${phaseSpring}) translateY(${(1 - phaseSpring) * 15}px)`,
                opacity: phaseSpring,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Quarter Pill & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '8px',
                    backgroundColor: `${phaseColor}22`,
                    color: phaseColor,
                    fontSize: '11px',
                    fontWeight: 900,
                  }}
                >
                  {phase.quarter}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: phase.status === 'launched' ? '#10B981' : isActive ? '#0066FF' : textMuted,
                  }}
                >
                  {phase.status}
                </span>
              </div>

              {/* Phase Title */}
              <div style={{ fontSize: '15px', fontWeight: 800, color: textColor, marginBottom: '12px' }}>
                {phase.phaseName}
              </div>

              {/* Deliverable Checkpoints */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {phase.deliverables.map((item, dIdx) => (
                  <div key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: textColor }}>
                    <span style={{ color: phaseColor, fontWeight: 900, lineHeight: 1 }}>✓</span>
                    <span style={{ fontWeight: 500, lineHeight: 1.3 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
