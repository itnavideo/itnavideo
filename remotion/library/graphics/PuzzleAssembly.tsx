import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PuzzlePiece {
  id: string;
  label: string;
  color: string;
  startOffsetX: number;
  startOffsetY: number;
}

export interface PuzzleAssemblyProps {
  headline?: string;
  pieces?: PuzzlePiece[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_PIECES: PuzzlePiece[] = [
  { id: '1', label: 'Strategy', color: '#38bdf8', startOffsetX: -60, startOffsetY: -60 },
  { id: '2', label: 'Story', color: '#f59e0b', startOffsetX: 60, startOffsetY: -60 },
  { id: '3', label: 'Design', color: '#ec4899', startOffsetX: -60, startOffsetY: 60 },
  { id: '4', label: 'Remotion', color: '#10b981', startOffsetX: 60, startOffsetY: 60 },
];

/**
 * PuzzleAssembly — 4-piece jigsaw puzzle snap-together storytelling visual.
 * Pieces fly in from diagonal quadrants and magnetically interlock to complete the big picture.
 */
export function PuzzleAssembly({
  headline = 'THE MISSING PIECE IN YOUR WORKFLOW',
  pieces = DEFAULT_PIECES,
  accentColor = '#f59e0b',
  delay = 0,
  width = 460,
  height = 440,
}: PuzzleAssemblyProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const snapSpr = spring({
    frame: Math.max(0, t - 15),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const isSnapped = t >= 30;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
          VISUAL STORYTELLING
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* 2x2 Interlocking Puzzle Grid */}
      <div
        style={{
          position: 'relative',
          width: 240,
          height: 240,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: isSnapped ? 2 : 12,
          transition: 'gap 0.3s ease',
        }}
      >
        {pieces.map((p, idx) => {
          const transX = interpolate(snapSpr, [0, 1], [p.startOffsetX, 0]);
          const transY = interpolate(snapSpr, [0, 1], [p.startOffsetY, 0]);

          return (
            <div
              key={p.id}
              style={{
                borderRadius: 14,
                background: `linear-gradient(135deg, ${p.color}33, ${p.color}11)`,
                border: `2px solid ${p.color}`,
                boxShadow: `0 8px 16px rgba(0,0,0,0.5), 0 0 12px ${p.color}33`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `translate(${transX}px, ${transY}px)`,
                padding: 10,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: p.color,
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                0{idx + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff', marginTop: 8 }}>
                {p.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Completion Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '6px 14px',
          borderRadius: 9999,
          fontSize: 11,
          fontWeight: 700,
          color: isSnapped ? '#22c55e' : '#94a3b8',
        }}
      >
        <span>{isSnapped ? '✓ PERFECTLY ALIGNED ECOSYSTEM' : 'ASSEMBLING PIECES...'}</span>
      </div>
    </div>
  );
}
