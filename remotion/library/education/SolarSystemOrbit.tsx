import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface Planet {
  name: string;
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
}

export interface SolarSystemOrbitProps {
  systemName?: string;
  className?: string;
}

export const SolarSystemOrbit: React.FC<SolarSystemOrbitProps> = ({
  systemName = 'HELIOCENTRIC INNER SOLAR SYSTEM',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  const planets: Planet[] = [
    { name: 'Mercury', radius: 4, orbitRadius: 28, speed: 0.08, color: '#94a3b8' },
    { name: 'Venus', radius: 6, orbitRadius: 44, speed: 0.05, color: '#f59e0b' },
    { name: 'Earth', radius: 6.5, orbitRadius: 62, speed: 0.035, color: '#38bdf8' },
    { name: 'Mars', radius: 5, orbitRadius: 80, speed: 0.025, color: '#ef4444' },
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
        className="w-full max-w-sm rounded-2xl p-4 border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(8, 10, 16, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(245, 158, 11, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            {systemName}
          </span>
          <span className="text-zinc-500 text-[10px]">1 AU = 1.496×10⁸ km</span>
        </div>

        {/* Orbit Canvas */}
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center my-2">
          {/* Central Sun */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-[0_0_20px_#f59e0b] z-20" />

          {/* Planet Orbit Tracks & Planets */}
          {planets.map((planet) => {
            const angle = frame * planet.speed;
            const px = Math.cos(angle) * planet.orbitRadius;
            const py = Math.sin(angle) * planet.orbitRadius;

            return (
              <React.Fragment key={planet.name}>
                {/* Orbit track ring */}
                <div
                  className="absolute rounded-full border border-white/10 pointer-events-none"
                  style={{
                    width: `${planet.orbitRadius * 2}px`,
                    height: `${planet.orbitRadius * 2}px`,
                  }}
                />

                {/* Planet Body */}
                <div
                  className="absolute rounded-full z-10 shadow-md"
                  style={{
                    width: `${planet.radius * 2}px`,
                    height: `${planet.radius * 2}px`,
                    backgroundColor: planet.color,
                    boxShadow: `0 0 6px ${planet.color}`,
                    transform: `translate(${px}px, ${py}px)`,
                  }}
                />
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-white/10">
          <span>Mercury • Venus • Earth • Mars</span>
          <span className="text-amber-400">Keplerian Orbits</span>
        </div>
      </div>
    </div>
  );
};
