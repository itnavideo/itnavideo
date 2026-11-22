import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface GlowEffectProps {
  glowColor?: string;
  pulsing?: boolean;
  className?: string;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  glowColor = '#06b6d4',
  pulsing = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const pulseFactor = pulsing ? (0.8 + Math.sin(frame * 0.15) * 0.2) : 1;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono overflow-hidden " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          NEON RADIANT GLOW
        </span>
        <span className="text-white/40">FALLOFF: QUADRATIC</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-950 rounded-xl border border-white/10 relative p-5 flex items-center justify-center">
        <div
          className="px-6 py-3 rounded-full border-2 text-sm font-black tracking-widest uppercase transition-all"
          style={{
            borderColor: glowColor,
            color: glowColor,
            boxShadow: '0 0 ' + (20 * pulseFactor) + 'px ' + glowColor + ', inset 0 0 ' + (10 * pulseFactor) + 'px ' + glowColor,
          }}
        >
          CYBER GLOW CORE
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>CORE RADIUS: 24px</span>
        <span>PULSE PHASE: {(pulseFactor * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};
