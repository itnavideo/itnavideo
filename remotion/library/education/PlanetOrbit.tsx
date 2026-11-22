import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PlanetOrbitProps {
  planetName?: string;
  eccentricity?: string;
  orbitalPeriodDays?: number;
  className?: string;
}

export const PlanetOrbit: React.FC<PlanetOrbitProps> = ({
  planetName = 'MARS // ELLIPTICAL TRAJECTORY',
  eccentricity = 'e = 0.0934 (KEPLER LAW I)',
  orbitalPeriodDays = 687,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Elliptical orbit animation
  const angle = frame * 0.04;
  const a = 90; // semi-major axis
  const b = 60; // semi-minor axis
  const px = Math.cos(angle) * a;
  const py = Math.sin(angle) * b;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 10, 16, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(245, 158, 11, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            {planetName}
          </span>
          <span className="text-zinc-500 text-[10px]">{orbitalPeriodDays} DAYS</span>
        </div>

        {/* Elliptical Canvas */}
        <div className="relative w-60 h-44 mx-auto flex items-center justify-center my-2">
          {/* Central Sun at Focus 1 */}
          <div
            className="w-8 h-8 rounded-full bg-amber-400 border border-white/40 shadow-[0_0_15px_#f59e0b] absolute"
            style={{ transform: 'translateX(-20px)' }}
          />

          {/* Orbit Ellipse Track */}
          <div
            className="w-[180px] h-[120px] rounded-full border border-white/20 pointer-events-none"
          />

          {/* Orbiting Planet */}
          <div
            className="absolute w-4 h-4 rounded-full bg-rose-500 border border-white shadow-[0_0_8px_#f43f5e] z-10"
            style={{ transform: `translate(${px}px, ${py}px)` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-zinc-400">
          <span>{eccentricity}</span>
          <span className="text-amber-300 font-bold">Perihelion Acceleration</span>
        </div>
      </div>
    </div>
  );
};
