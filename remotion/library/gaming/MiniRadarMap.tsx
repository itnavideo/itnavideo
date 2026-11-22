import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RadarBlip {
  x: number;
  y: number;
  type: 'enemy' | 'ally' | 'objective';
}

export interface MiniRadarMapProps {
  blips?: RadarBlip[];
  mapName?: string;
  zoomLevel?: string;
  className?: string;
}

export const MiniRadarMap: React.FC<MiniRadarMapProps> = ({
  blips = [
    { x: 30, y: -25, type: 'enemy' },
    { x: -45, y: 35, type: 'enemy' },
    { x: -15, y: -40, type: 'ally' },
    { x: 50, y: 40, type: 'objective' },
  ],
  mapName = 'SECTOR_07',
  zoomLevel = '1x',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  // Radar 360 degree scan beam
  const sweepAngle = (frame * 3) % 360;

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-56 h-56 rounded-full border-2 border-emerald-500/40 backdrop-blur-2xl shadow-2xl relative flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(circle, rgba(6, 44, 28, 0.95) 0%, rgba(2, 20, 12, 0.98) 100%)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.9), 0 0 30px rgba(16, 185, 129, 0.3)',
        }}
      >
        {/* Concentric grid rings */}
        <div className="absolute inset-4 rounded-full border border-emerald-500/20" />
        <div className="absolute inset-10 rounded-full border border-emerald-500/20" />
        <div className="absolute inset-16 rounded-full border border-emerald-500/30" />

        {/* Crosshair axis lines */}
        <div className="absolute w-full h-[1px] bg-emerald-500/30" />
        <div className="absolute h-full w-[1px] bg-emerald-500/30" />

        {/* Compass Cardinal Points */}
        <span className="absolute top-1 text-[10px] font-mono font-bold text-emerald-400">N</span>
        <span className="absolute bottom-1 text-[10px] font-mono font-bold text-emerald-400">S</span>
        <span className="absolute left-1 text-[10px] font-mono font-bold text-emerald-400">W</span>
        <span className="absolute right-1 text-[10px] font-mono font-bold text-emerald-400">E</span>

        {/* Radar Sweeping Beam */}
        <div
          className="absolute inset-0 origin-center pointer-events-none"
          style={{
            transform: `rotate(${sweepAngle}deg)`,
            background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.4) 0deg, transparent 60deg, transparent 360deg)',
          }}
        />

        {/* Center Player Dot */}
        <div className="w-3 h-3 rounded-full bg-white border border-emerald-400 shadow-[0_0_10px_#fff] z-10" />

        {/* Radar Blips */}
        {blips.map((blip, i) => {
          const color =
            blip.type === 'enemy' ? '#ef4444' : blip.type === 'ally' ? '#06b6d4' : '#eab308';
          return (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full z-10 shadow-md animate-pulse"
              style={{
                transform: `translate(${blip.x}px, ${blip.y}px)`,
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
          );
        })}

        {/* Header HUD Info */}
        <div className="absolute bottom-2 px-2 py-0.5 rounded bg-black/60 border border-emerald-500/30 text-[9px] font-mono text-emerald-300 z-10">
          {mapName} • {zoomLevel}
        </div>
      </div>
    </div>
  );
};
