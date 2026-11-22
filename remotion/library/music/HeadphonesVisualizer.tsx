import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HeadphonesVisualizerProps {
  modelName?: string;
  driverType?: string;
  rgbColor?: string;
  className?: string;
}

export const HeadphonesVisualizer: React.FC<HeadphonesVisualizerProps> = ({
  modelName = 'PLANAR MAGNETIC STUDIO MONITORS',
  driverType = '50mm NEODYMIUM OPEN-BACK',
  rgbColor = '#06b6d4',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame * 0.2) * 0.08 + 1;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-zinc-700 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 14, 18, 0.95)',
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px ${rgbColor}20`,
        }}
      >
        <div className="flex items-center gap-3.5">
          {/* Headphones Graphic */}
          <div
            className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xl shadow-lg flex-shrink-0"
            style={{ transform: `scale(${pulse})` }}
          >
            🎧
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              AUDIOPHILE GEAR
            </span>
            <h4 className="text-white font-bold text-xs truncate mt-0.5">{modelName}</h4>
            <span className="text-zinc-500 text-[10px] truncate block">{driverType}</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="text-cyan-400 font-bold">● HI-RES AUDIO 24-BIT/96kHz</span>
          <span>Lossless Direct</span>
        </div>
      </div>
    </div>
  );
};
