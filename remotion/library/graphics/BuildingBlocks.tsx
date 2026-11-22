import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BlockItem {
  id: string;
  name: string;
  tagline: string;
  color: string;
}

export interface BuildingBlocksProps {
  headline?: string;
  blocks?: BlockItem[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_BLOCKS: BlockItem[] = [
  { id: '1', name: 'Supabase Data Engine', tagline: 'PostgreSQL & Realtime Auth', color: '#10b981' },
  { id: '2', name: 'Groq Whisper Cloud', tagline: 'Millisecond Word Cadence', color: '#f59e0b' },
  { id: '3', name: 'Remotion Lambda Grid', tagline: 'Headless Chromium Cluster', color: '#3b82f6' },
  { id: '4', name: 'Antigravity Autonomous Core', tagline: 'Full Orchestration Layer', color: '#8b5cf6' },
];

/**
 * BuildingBlocks — Modular lego/brick stack storytelling infographic.
 * Blocks descend from above and snap into place building a towering composite architecture.
 */
export function BuildingBlocks({
  headline = 'MODULAR ARCHITECTURE STACK',
  blocks = DEFAULT_BLOCKS,
  accentColor = '#3b82f6',
  delay = 0,
  width = 460,
  height = 420,
}: BuildingBlocksProps) {
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
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          COMPOSABLE INFRASTRUCTURE
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Vertical Stacking Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 8, padding: '0 16px' }}>
        {blocks.map((block, idx) => {
          const blockSpr = spring({
            frame: Math.max(0, t - idx * 8),
            fps,
            config: { damping: 12, stiffness: 90 },
          });

          const transY = interpolate(blockSpr, [0, 1], [-80, 0]);

          return (
            <div
              key={block.id}
              style={{
                padding: '12px 16px',
                borderRadius: 12,
                background: `linear-gradient(90deg, ${block.color}22, #18181b)`,
                border: `1.5px solid ${block.color}`,
                boxShadow: `0 8px 16px rgba(0,0,0,0.6), 0 0 12px ${block.color}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transform: `translateY(${transY}px)`,
                opacity: blockSpr,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: block.color,
                    color: '#000000',
                    fontSize: 10,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
                  {block.name}
                </span>
              </div>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>
                {block.tagline}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#64748b' }}>
        EACH BLOCK SOLIDIFIES THE NEXT LEVEL
      </div>
    </div>
  );
}
