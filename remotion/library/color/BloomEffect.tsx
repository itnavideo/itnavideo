import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BloomEffectProps {
  bloomRadius?: number;
  bloomIntensity?: number;
  className?: string;
}

export const BloomEffect: React.FC<BloomEffectProps> = ({
  bloomRadius = 16,
  bloomIntensity = 80,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono overflow-hidden " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
          OPTICAL BLOOM & GLOW
        </span>
        <span className="text-white/40">LUMINESCENCE BLEED</span>
      </div>

      <div className="flex-1 my-4 bg-black/80 rounded-xl border border-white/10 relative p-5 flex items-center justify-center">
        <div
          className="text-4xl font-black text-amber-200 tracking-wider text-center"
          style={{
            textShadow: '0 0 ' + bloomRadius + 'px #f59e0b, 0 0 ' + (bloomRadius * 2) + 'px #fef08a',
          }}
        >
          ANAMORPHIC BLOOM
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>GAUSSIAN RADIUS: {bloomRadius}px</span>
        <span>INTENSITY: {bloomIntensity}%</span>
      </div>
    </div>
  );
};
