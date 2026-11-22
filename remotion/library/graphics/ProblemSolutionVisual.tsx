import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProblemSolutionVisualProps {
  headline?: string;
  problemTitle?: string;
  problemBullets?: string[];
  solutionTitle?: string;
  solutionBullets?: string[];
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_PROBLEMS = [
  '8 Hours to edit one reel',
  'Timeline crashes & render freezes',
  'Manual word-by-word keyframing',
];

const DEFAULT_SOLUTIONS = [
  'Render 1,000 reels in 3 minutes',
  'AWS Lambda serverless 30fps grid',
  'Groq Whisper 99.8% accurate sync',
];

/**
 * ProblemSolutionVisual — High-contrast Problem vs. Solution duel card.
 * Direct visual contrast juxtaposing painful chaos against streamlined modern salvation.
 */
export function ProblemSolutionVisual({
  headline = 'THE REVOLUTIONARY CONTRAST',
  problemTitle = 'THE OLD WAY (FRICTION)',
  problemBullets = DEFAULT_PROBLEMS,
  solutionTitle = 'THE ITNAVIDEO WAY (FLOW)',
  solutionBullets = DEFAULT_SOLUTIONS,
  delay = 0,
  width = 540,
  height = 360,
}: ProblemSolutionVisualProps) {
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
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.12em' }}>
          PARADIGM SHIFT
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Side-by-Side Duel Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Problem Card (Red/Dark) */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 16,
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: '#ef4444' }}>
            ✕ {problemTitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {problemBullets.map((b, i) => (
              <div key={i} style={{ fontSize: 11, color: '#e2e8f0', lineHeight: 1.3 }}>
                • {b}
              </div>
            ))}
          </div>
        </div>

        {/* Solution Card (Emerald/Glowing) */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 16,
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1.5px solid #22c55e',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: '#22c55e' }}>
            ✓ {solutionTitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {solutionBullets.map((b, i) => (
              <div key={i} style={{ fontSize: 11, color: '#ffffff', fontWeight: 600, lineHeight: 1.3 }}>
                • {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#64748b' }}>
        UPGRADE TO COMPUTATIONAL CREATION • 10X LEVERAGE
      </div>
    </div>
  );
}
