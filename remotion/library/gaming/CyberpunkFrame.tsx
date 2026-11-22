import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CyberpunkFrameProps {
  systemStatus?: string;
  coordinates?: string;
  warningText?: string;
  accentColor?: string;
  className?: string;
}

export const CyberpunkFrame: React.FC<CyberpunkFrameProps> = ({
  systemStatus = 'SYS_ONLINE // V.4.2',
  coordinates = 'LAT: 35.6895° N, LNG: 139.6917° E',
  warningText = 'NEURAL LINK SYNCHRONIZED',
  accentColor = '#06b6d4',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`relative w-full h-full p-6 pointer-events-none flex flex-col justify-between font-mono ${className}`}
      style={{ opacity: enter }}
    >
      {/* 4 Tech Corner Brackets */}
      {/* Top Left */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2" style={{ borderColor: accentColor }}>
        <div className="w-1.5 h-1.5 bg-cyan-400 absolute top-0 left-0" />
      </div>
      {/* Top Right */}
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2" style={{ borderColor: accentColor }}>
        <div className="w-1.5 h-1.5 bg-cyan-400 absolute top-0 right-0" />
      </div>
      {/* Bottom Left */}
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2" style={{ borderColor: accentColor }}>
        <div className="w-1.5 h-1.5 bg-cyan-400 absolute bottom-0 left-0" />
      </div>
      {/* Bottom Right */}
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2" style={{ borderColor: accentColor }}>
        <div className="w-1.5 h-1.5 bg-cyan-400 absolute bottom-0 right-0" />
      </div>

      {/* Top Status Bar */}
      <div className="flex items-center justify-between text-xs px-6 pt-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
          <span className="text-white font-bold tracking-wider">{systemStatus}</span>
        </div>
        <span className="text-zinc-500 text-[10px]">{coordinates}</span>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between text-xs px-6 pb-1">
        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
          <span className="text-cyan-400 font-bold">REC ●</span>
          <span>FRAME: {frame}</span>
        </div>
        <span className="text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          {warningText}
        </span>
      </div>
    </div>
  );
};
