import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface IcebergDiagramProps {
  headline?: string;
  visibleTipText?: string;
  submergedItems?: string[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_SUBMERGED = [
  'Hundreds of Unseen Revisions',
  'Algorithmic Audio Cadence',
  'Custom Remotion Engine Shaders',
  'High-Retention Script Psychology',
];

/**
 * IcebergDiagram — Famous iceberg mental model storytelling graphic.
 * Visually separates the 10% visible outcome from the 90% hidden underwater foundational work.
 */
export function IcebergDiagram({
  headline = 'WHAT PEOPLE SEE VS. WHAT IT TAKES',
  visibleTipText = '10% VIRAL POLISHED REEL',
  submergedItems = DEFAULT_SUBMERGED,
  accentColor = '#38bdf8',
  delay = 0,
  width = 500,
  height = 480,
}: IcebergDiagramProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const waterWave = Math.sin(t * 0.08) * 4;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          THE ICEBERG ILLUSION
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Main Canvas with Water Level */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          borderRadius: 16,
          background: 'linear-gradient(180deg, #18181b 0%, #0369a1 40%, #0c4a6e 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Visible Tip (Above Water) */}
        <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <div
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1.5px solid #ffffff',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 13,
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            }}
          >
            {visibleTipText}
          </div>
        </div>

        {/* Animated Waterline Divider */}
        <div
          style={{
            width: '100%',
            height: 3,
            background: '#38bdf8',
            boxShadow: '0 0 16px #38bdf8',
            transform: `translateY(${waterWave}px)`,
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: 12,
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 9, color: '#e0f2fe', fontWeight: 800, background: '#0369a1', padding: '1px 6px', borderRadius: 3 }}>
            WATERLINE (SURFACE)
          </span>
        </div>

        {/* Submerged 90% (Under Water) */}
        <div
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, color: '#bae6fd', letterSpacing: '0.1em' }}>
            90% HIDDEN INFRASTRUCTURE & DISCIPLINE
          </div>

          {submergedItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                width: '85%',
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              • {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
