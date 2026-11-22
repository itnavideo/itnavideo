import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CircularAudioWaveformProps {
  barsCount?: number;
  radius?: number;
  accentColor?: string;
  className?: string;
}

export const CircularAudioWaveform: React.FC<CircularAudioWaveformProps> = ({
  barsCount = 48,
  radius = 65,
  accentColor = '#06b6d4',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`relative flex items-center justify-center w-64 h-64 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      {/* Central Pulsing Ambient Glow */}
      <div
        className="w-24 h-24 rounded-full border border-cyan-500/30 flex items-center justify-center shadow-lg"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(3, 7, 18, 0.95) 100%)',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)',
        }}
      >
        <span className="text-2xl animate-pulse">🎵</span>
      </div>

      {/* 360-degree Radiating Frequency Bars */}
      {Array.from({ length: barsCount }).map((_, i) => {
        const angle = (i / barsCount) * Math.PI * 2;
        const barHeight = Math.abs(Math.sin(frame * 0.15 + i * 0.4)) * 28 + 6;
        const x = Math.cos(angle) * (radius + barHeight / 2);
        const y = Math.sin(angle) * (radius + barHeight / 2);
        const rotDeg = (angle * 180) / Math.PI + 90;

        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '3px',
              height: `${barHeight}px`,
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
              transform: `translate(${x}px, ${y}px) rotate(${rotDeg}deg)`,
              opacity: 0.5 + (barHeight / 34) * 0.5,
            }}
          />
        );
      })}
    </div>
  );
};
