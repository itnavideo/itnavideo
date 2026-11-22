import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TacticalCompassProps {
  bearing?: number;
  targetBearing?: number;
  accentColor?: string;
  className?: string;
}

export const TacticalCompass: React.FC<TacticalCompassProps> = ({
  bearing = 135,
  targetBearing = 145,
  accentColor = '#06b6d4',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animatedBearing = (bearing + frame * 0.2) % 360;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl px-5 py-3 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 12, 16, 0.94)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(6, 182, 212, 0.15)',
        }}
      >
        {/* Center Bearing Readout */}
        <div className="flex items-center justify-center mb-1">
          <span className="text-sm font-black text-white">{Math.round(animatedBearing)}°</span>
          <span className="text-[10px] text-cyan-400 font-bold ml-1">SE</span>
        </div>

        {/* Compass Tape Simulator */}
        <div className="relative w-full h-7 flex items-center justify-center border-t border-b border-white/10 overflow-hidden">
          {/* Center Indicator Arrow */}
          <div className="absolute top-0 w-2 h-2 border-l border-t border-cyan-400 transform rotate-45 -translate-y-1 z-10" />

          {/* Tick marks */}
          <div className="flex items-center justify-between w-full px-4 text-[10px] text-zinc-400">
            <span>090° E</span>
            <span>•</span>
            <span className="text-white font-bold">120°</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">135°</span>
            <span>•</span>
            <span className="text-white font-bold">150°</span>
            <span>•</span>
            <span>180° S</span>
          </div>
        </div>
      </div>
    </div>
  );
};
