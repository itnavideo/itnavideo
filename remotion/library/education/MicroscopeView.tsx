import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MicroscopeViewProps {
  magnification?: string;
  specimenName?: string;
  stainType?: string;
  className?: string;
}

export const MicroscopeView: React.FC<MicroscopeViewProps> = ({
  magnification = '1000x OIL IMMERSION',
  specimenName = 'BACILLUS SUBTILIS // CELL DIVISION',
  stainType = 'GRAM STAIN POSITIVE',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Floating swimming microbes
  const microbes = [
    { x: -30, y: -20, r: 8, speed: 0.1 },
    { x: 25, y: -35, r: 12, speed: 0.14 },
    { x: -10, y: 30, r: 10, speed: 0.08 },
    { x: 40, y: 20, r: 6, speed: 0.18 },
  ];

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-64 h-64 rounded-full border-4 border-emerald-500/30 backdrop-blur-2xl shadow-2xl relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(6, 24, 18, 0.98) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(16, 185, 129, 0.25)',
        }}
      >
        {/* Reticle Focus Circle & Ticks */}
        <div className="absolute inset-4 rounded-full border border-emerald-500/20" />
        <div className="absolute w-full h-[1px] bg-emerald-500/20" />
        <div className="absolute h-full w-[1px] bg-emerald-500/20" />

        {/* Swimming Cellular Microbes */}
        {microbes.map((m, i) => {
          const mx = m.x + Math.sin(frame * m.speed) * 12;
          const my = m.y + Math.cos(frame * m.speed) * 10;

          return (
            <div
              key={i}
              className="absolute rounded-full bg-emerald-400/70 border border-emerald-300 shadow-[0_0_10px_#34d399]"
              style={{
                width: `${m.r * 2}px`,
                height: `${m.r * 2}px`,
                transform: `translate(${mx}px, ${my}px)`,
              }}
            />
          );
        })}

        {/* Telemetry labels */}
        <div className="absolute top-4 px-2 py-0.5 rounded bg-black/60 text-[9px] text-emerald-400 border border-emerald-500/20">
          {magnification}
        </div>

        <div className="absolute bottom-4 px-2 py-0.5 rounded bg-black/60 text-[9px] text-zinc-300 border border-white/10 text-center max-w-48 truncate">
          {specimenName}
        </div>
      </div>
    </div>
  );
};
