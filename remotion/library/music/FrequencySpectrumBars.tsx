import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FrequencySpectrumBarsProps {
  bandsCount?: number;
  peakHold?: boolean;
  className?: string;
}

export const FrequencySpectrumBars: React.FC<FrequencySpectrumBarsProps> = ({
  bandsCount = 24,
  peakHold = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 14, 18, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(244, 63, 94, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-white font-bold uppercase tracking-wider text-[10px]">
            GRAPHIC EQUALIZER SPECTRUM
          </span>
          <span className="text-rose-400 text-[10px]">20Hz - 20kHz</span>
        </div>

        {/* Spectrum Bars */}
        <div className="flex items-end justify-between h-24 mt-3 gap-1">
          {Array.from({ length: bandsCount }).map((_, i) => {
            const height = Math.abs(Math.sin(frame * 0.2 + i * 0.5)) * 75 + 10;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
                {/* Peak hold marker */}
                {peakHold && (
                  <div
                    className="w-full h-0.5 bg-white mb-0.5"
                    style={{ opacity: 0.8 }}
                  />
                )}
                {/* Main spectrum bar */}
                <div
                  className="w-full rounded-t-sm transition-all duration-100"
                  style={{
                    height: `${height}%`,
                    background: 'linear-gradient(to top, #10b981, #f59e0b, #ef4444)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
