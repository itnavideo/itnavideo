import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnLightbulbProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnLightbulb: React.FC<HandDrawnLightbulbProps> = ({
  color = '#facc15',
  size = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const bulbProgress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          HAND-DRAWN LIGHTBULB
        </span>
        <span className="text-yellow-400 font-bold">IDEA / INNOVATION</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100">
          {/* Bulb Outline */}
          <path
            d="M 38,70 C 25,60 20,40 32,25 C 42,12 58,12 68,25 C 80,40 75,60 62,70 L 62,80 L 38,80 Z"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="220"
            strokeDashoffset={220 * (1 - bulbProgress)}
          />
          {/* Filament coil */}
          <path d="M 45,70 L 45,50 Q 50,42 55,50 L 55,70" fill="none" stroke={color} strokeWidth="2.5" />
          {/* Radiating Rays */}
          <line x1="50" y1="5" x2="50" y2="0" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="82" y1="18" x2="88" y2="12" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="18" y1="18" x2="12" y2="12" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>FILAMENT COIL SIMULATION</span>
        <span>EUREKA MOMENT TRIGGER</span>
      </div>
    </div>
  );
};
