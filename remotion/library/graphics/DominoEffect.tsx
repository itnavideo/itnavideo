import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DominoTile {
  title: string;
  subtext?: string;
  color?: string;
}

export interface DominoEffectProps {
  headline?: string;
  tiles?: DominoTile[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_TILES: DominoTile[] = [
  { title: 'Habit Trigger', subtext: 'Small daily action', color: '#38bdf8' },
  { title: 'Momentum', subtext: 'Unstoppable consistency', color: '#818cf8' },
  { title: 'Audience Reach', subtext: 'Compounding views', color: '#c084fc' },
  { title: 'Market Monopoly', subtext: 'Breakthrough scale', color: '#22c55e' },
];

/**
 * DominoEffect — Kinetic sequential domino cascade storytelling visualizer.
 * Each domino tile tilts and topples into the next, demonstrating catalytic compounding growth.
 */
export function DominoEffect({
  headline = 'THE COMPOUNDING DOMINO EFFECT',
  tiles = DEFAULT_TILES,
  accentColor = '#f59e0b',
  delay = 0,
  width = 540,
  height = 360,
}: DominoEffectProps) {
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
        padding: '28px 24px',
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
          CATALYTIC COMPOUNDING
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Domino Tiles Lineup Stage */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 16,
          height: 180,
          perspective: 600,
        }}
      >
        {tiles.map((tile, i) => {
          const fallStart = i * 8;
          const fallSpr = spring({
            frame: Math.max(0, t - fallStart),
            fps,
            config: { damping: 12, stiffness: 80 },
          });

          // Topple forward by 45 degrees, last one stands proud or triggers pulse
          const isLast = i === tiles.length - 1;
          const toppleAngle = isLast ? 0 : interpolate(fallSpr, [0, 1], [0, 48]);
          const tileHeight = 80 + i * 22; // Each domino gets progressively larger!

          return (
            <div
              key={tile.title}
              style={{
                width: 70,
                height: tileHeight,
                borderRadius: 12,
                background: `linear-gradient(180deg, ${tile.color || accentColor}33, #18181b)`,
                border: `2px solid ${tile.color || accentColor}`,
                transformOrigin: 'bottom right',
                transform: `rotate(${toppleAngle}deg)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '8px 6px',
                boxSizing: 'border-box',
                boxShadow: `0 10px 20px rgba(0,0,0,0.7), 0 0 12px ${tile.color || accentColor}33`,
                transition: 'transform 0.05s linear',
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 900, color: tile.color || accentColor }}>
                0{i + 1}
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                {tile.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
        <span>ONE TINY PUSH TOPPLES GIANT OUTCOMES</span>
        <span style={{ color: '#22c55e', fontWeight: 700 }}>EXPONENTIAL MOMENTUM</span>
      </div>
    </div>
  );
}
