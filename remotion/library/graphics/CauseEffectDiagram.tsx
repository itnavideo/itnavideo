import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CauseItem {
  category: string;
  detail: string;
}

export interface CauseEffectDiagramProps {
  headline?: string;
  effect?: string;
  causes?: CauseItem[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_CAUSES: CauseItem[] = [
  { category: 'Tooling Friction', detail: 'Manual keyframing timelines' },
  { category: 'Cognitive Burnout', detail: 'Repetitive daily rendering' },
  { category: 'Distribution Deficit', detail: 'Single format bottlenecks' },
  { category: 'High Production Cost', detail: '$2,000/mo freelance editors' },
];

/**
 * CauseEffectDiagram — Root-cause & multi-factor Ishikawa causal storytelling graphic.
 * Links multiple foundational causes to the ultimate observed effect.
 */
export function CauseEffectDiagram({
  headline = 'ROOT CAUSE ANALYSIS',
  effect = 'Creator Growth Plateau & Creative Burnout',
  causes = DEFAULT_CAUSES,
  accentColor = '#ef4444',
  delay = 0,
  width = 540,
  height = 360,
}: CauseEffectDiagramProps) {
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
          CAUSALITY FRAMEWORK
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Main Fishbone / Convergence Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '10px 0' }}>
        {causes.map((c, i) => (
          <div
            key={c.category}
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderLeft: `3px solid ${accentColor}`,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 800, color: accentColor }}>
              CAUSE #{i + 1}: {c.category.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: '#ffffff', fontWeight: 600, marginTop: 2 }}>
              {c.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Final Effect Card */}
      <div
        style={{
          padding: '12px 18px',
          borderRadius: 12,
          background: `linear-gradient(135deg, ${accentColor}22, rgba(239,68,68,0.05))`,
          border: `1.5px solid ${accentColor}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: `0 0 16px ${accentColor}33`,
        }}
      >
        <div>
          <div style={{ fontSize: 9, color: accentColor, fontWeight: 800 }}>RESULTING CRITICAL EFFECT</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>{effect}</div>
        </div>
        <span style={{ fontSize: 20 }}>⚠️</span>
      </div>
    </div>
  );
}
