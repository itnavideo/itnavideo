import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ColorGradingProps {
  lookName?: string;
  intensity?: number; // 0 to 100
  shadowTint?: string;
  highlightTint?: string;
  className?: string;
}

export const ColorGrading: React.FC<ColorGradingProps> = ({
  lookName = 'BLOCKBUSTER TEAL & ORANGE',
  intensity = 85,
  shadowTint = '#0e7490',
  highlightTint = '#ea580c',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
          CREATIVE COLOR GRADE
        </span>
        <span className="text-white/40">INTENSITY: {intensity}%</span>
      </div>

      <div className="flex-1 my-4 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, ' + shadowTint + '33 0%, ' + highlightTint + '33 100%)',
        }}
      >
        <div className="text-center z-10">
          <div className="text-2xl font-black tracking-tight mb-2">{lookName}</div>
          <div className="text-xs text-white/60">Split-Tone Cinematic Harmony</div>
        </div>
        <div className="flex space-x-6 mt-4 z-10 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: shadowTint }} />
            <span className="text-white/70">Shadow Tint</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: highlightTint }} />
            <span className="text-white/70">Highlight Tint</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>BLEND MODE: SOFT LIGHT</span>
        <span>DYNAMIC RANGE: WIDE</span>
      </div>
    </div>
  );
};
