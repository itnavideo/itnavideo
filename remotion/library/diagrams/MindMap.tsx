import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MindMapBranch {
  label: string;
  color?: string;
  subBranches?: string[];
}

export interface MindMapProps {
  title?: string;
  subtitle?: string;
  centralIdea?: string;
  branches?: MindMapBranch[];
  size?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_MIND_BRANCHES: MindMapBranch[] = [
  { label: 'Hook Psychology', color: '#0066FF', subBranches: ['First 3s Interrupt', 'Text Highlight'] },
  { label: 'B-Roll Rhythm', color: '#10B981', subBranches: ['3-5s Dynamic Cuts', 'Audio Ducking'] },
  { label: 'Kinetic Subtitles', color: '#F59E0B', subBranches: ['Word-by-word bounce', 'Karaoke Glow'] },
  { label: 'Audio Engine', color: '#8B5CF6', subBranches: ['Groq Whisper', 'Sound FX Risers'] },
];

export const MindMap: React.FC<MindMapProps> = ({
  title = 'Viral Retention Mind Map',
  subtitle = 'Deconstructed video creation architecture',
  centralIdea = 'High Retention Video',
  branches = DEFAULT_MIND_BRANCHES,
  size = 380,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const centerBg = isDark ? '#0066FF' : '#0066FF';
  const nodeBg = isDark ? '#1E293B' : '#F8FAFC';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const centerSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const centerRadius = 60;
  const branchRadius = size * 0.38;
  const items = branches && branches.length > 0 ? branches : DEFAULT_MIND_BRANCHES;

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

      {/* SVG Canvas with radiating curves */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {items.map((branch, idx) => {
            const angle = (idx / items.length) * 2 * Math.PI;
            const bx = size / 2 + branchRadius * Math.cos(angle);
            const by = size / 2 + branchRadius * Math.sin(angle);

            const branchSpring = spring({
              frame: Math.max(0, frame - delayFrames - 8 - idx * 4),
              fps,
              config: { damping: 14, stiffness: 85 },
            });

            // Curved organic Bezier arm from center to branch
            const cpX = (size / 2 + bx) / 2 + Math.sin(angle) * 20;
            const cpY = (size / 2 + by) / 2 - Math.cos(angle) * 20;

            return (
              <g key={idx} style={{ opacity: branchSpring }}>
                <path
                  d={`M ${size / 2} ${size / 2} Q ${cpX} ${cpY} ${bx} ${by}`}
                  fill="none"
                  stroke={branch.color || '#0066FF'}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </g>
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
            width: `${centerRadius * 2}px`,
            height: `${centerRadius * 2}px`,
            borderRadius: '50%',
            backgroundColor: centerBg,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '12px',
            boxSizing: 'border-box',
            boxShadow: '0 8px 32px rgba(0, 102, 255, 0.45)',
            fontSize: '13px',
            fontWeight: 800,
            lineHeight: 1.15,
            zIndex: 10,
          }}
        >
          {centralIdea}
        </div>

        {/* Outer Branch Cards */}
        {items.map((branch, idx) => {
          const angle = (idx / items.length) * 2 * Math.PI;
          const bx = size / 2 + branchRadius * Math.cos(angle);
          const by = size / 2 + branchRadius * Math.sin(angle);

          const branchSpring = spring({
            frame: Math.max(0, frame - delayFrames - 8 - idx * 4),
            fps,
            config: { damping: 14, stiffness: 85 },
          });

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${bx}px`,
                top: `${by}px`,
                transform: `translate(-50%, -50%) scale(${branchSpring})`,
                opacity: branchSpring,
                backgroundColor: nodeBg,
                border: `1.5px solid ${branch.color || '#0066FF'}`,
                borderRadius: '12px',
                padding: '8px 14px',
                textAlign: 'center',
                boxShadow: `0 4px 16px ${(branch.color || '#0066FF')}33`,
                whiteSpace: 'nowrap',
                zIndex: 5,
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, color: textColor }}>
                {branch.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
