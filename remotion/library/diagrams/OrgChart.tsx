import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface OrgPerson {
  name: string;
  role: string;
  department?: string;
  avatar?: string;
  color?: string;
}

export interface OrgChartProps {
  title?: string;
  subtitle?: string;
  leader?: OrgPerson;
  executives?: OrgPerson[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_LEADER: OrgPerson = {
  name: 'Chief Video Officer',
  role: 'AI Strategy & Vision',
  department: 'Leadership',
  color: '#0066FF',
};

const DEFAULT_EXECUTIVES: OrgPerson[] = [
  { name: 'Head of Voiceover', role: 'Groq Whisper & TTS', department: 'Audio AI', color: '#2563EB' },
  { name: 'Director of Visuals', role: 'Smart B-Roll & Visuals', department: 'Graphics', color: '#10B981' },
  { name: 'Lead Cloud Engineer', role: 'AWS Lambda Render Engine', department: 'DevOps', color: '#F59E0B' },
];

export const OrgChart: React.FC<OrgChartProps> = ({
  title = 'Organizational Hierarchy',
  subtitle = 'Team roles & department distribution',
  leader = DEFAULT_LEADER,
  executives = DEFAULT_EXECUTIVES,
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

  const leaderSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

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

      {/* Leader Top Node */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            padding: '16px 28px',
            backgroundColor: cardBg,
            border: `2px solid ${leader.color || '#0066FF'}`,
            borderRadius: '18px',
            boxShadow: `0 6px 24px ${(leader.color || '#0066FF')}33`,
            transform: `scale(${leaderSpring}) translateY(${(1 - leaderSpring) * 15}px)`,
            opacity: leaderSpring,
            textAlign: 'center',
            minWidth: '220px',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 800, color: leader.color, textTransform: 'uppercase' }}>
            {leader.department}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: textColor, marginTop: '2px' }}>
            {leader.name}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: textMuted, marginTop: '2px' }}>
            {leader.role}
          </div>
        </div>

        {/* Stem down */}
        <div style={{ width: '2px', height: '24px', backgroundColor: borderColor, opacity: leaderSpring }} />

        {/* Executives Row */}
        <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
          {executives.map((exec, idx) => {
            const execSpring = spring({
              frame: Math.max(0, frame - delayFrames - 8 - idx * 4),
              fps,
              config: { damping: 14, stiffness: 90 },
            });

            const execColor = exec.color || '#2563EB';

            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  minWidth: '180px',
                  maxWidth: '240px',
                  padding: '14px 18px',
                  backgroundColor: cardBg,
                  border: 'none',
                  borderTop: `3px solid ${execColor}`,
                  borderRadius: '14px',
                  transform: `scale(${execSpring}) translateY(${(1 - execSpring) * 15}px)`,
                  opacity: execSpring,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '9px', fontWeight: 800, color: execColor, textTransform: 'uppercase' }}>
                  {exec.department}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: textColor, marginTop: '2px' }}>
                  {exec.name}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 500, color: textMuted, marginTop: '2px' }}>
                  {exec.role}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
