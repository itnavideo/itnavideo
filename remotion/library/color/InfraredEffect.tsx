import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface InfraredEffectProps {
  foliageColor?: string;
  contrast?: number;
  className?: string;
}

export const InfraredEffect: React.FC<InfraredEffectProps> = ({
  foliageColor = '#f43f5e',
  contrast = 140,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono overflow-hidden " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          AEROCHROME INFRARED (IR 720nm)
        </span>
        <span className="text-white/40">FALSE COLOR SPECTRUM</span>
      </div>

      <div
        className="flex-1 my-4 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center text-center"
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, ' + foliageColor + ' 100%)',
        }}
      >
        <div className="text-3xl font-black text-white drop-shadow-lg">AEROCHROME IR</div>
        <div className="text-xs text-white/90 mt-1">Chlorophyll Reflectance Inversion</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>IR CUT FILTER: REMOVED</span>
        <span>BANDPASS: 720nm - 850nm</span>
      </div>
    </div>
  );
};
