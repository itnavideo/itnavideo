import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AtomModelProps {
  elementSymbol?: string;
  atomicNumber?: number;
  protons?: number;
  neutrons?: number;
  electrons?: number;
  className?: string;
}

export const AtomModel: React.FC<AtomModelProps> = ({
  elementSymbol = 'C',
  atomicNumber = 6,
  protons = 6,
  neutrons = 6,
  electrons = 6,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // 3 orbital electron ring angles
  const orbit1 = (frame * 2) % 360;
  const orbit2 = (frame * -1.8) % 360;
  const orbit3 = (frame * 2.5) % 360;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-indigo-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 12, 22, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(99, 102, 241, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
            BOHR-RUTHERFORD ATOM MODEL
          </span>
          <span className="text-zinc-400 text-[11px]">Z = {atomicNumber}</span>
        </div>

        {/* Orbit Rings Container */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
          {/* Orbit Ring 1 */}
          <div
            className="absolute w-44 h-16 rounded-full border border-indigo-400/30 origin-center"
            style={{ transform: 'rotate(30deg)' }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] absolute"
              style={{
                top: '50%',
                left: `${50 + Math.sin(orbit1 * 0.05) * 45}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          {/* Orbit Ring 2 */}
          <div
            className="absolute w-44 h-16 rounded-full border border-indigo-400/30 origin-center"
            style={{ transform: 'rotate(90deg)' }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] absolute"
              style={{
                top: '50%',
                left: `${50 + Math.cos(orbit2 * 0.05) * 45}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          {/* Orbit Ring 3 */}
          <div
            className="absolute w-44 h-16 rounded-full border border-indigo-400/30 origin-center"
            style={{ transform: 'rotate(150deg)' }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] absolute"
              style={{
                top: '50%',
                left: `${50 + Math.sin(orbit3 * 0.05) * 45}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          {/* Nucleus */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 border border-white/20 flex items-center justify-center shadow-lg z-20">
            <span className="text-white font-black text-lg">{elementSymbol}</span>
          </div>
        </div>

        {/* Subatomic particles count */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-white/10 text-zinc-400">
          <div>p+: <strong className="text-rose-400">{protons}</strong></div>
          <div>n0: <strong className="text-amber-400">{neutrons}</strong></div>
          <div>e-: <strong className="text-cyan-400">{electrons}</strong></div>
        </div>
      </div>
    </div>
  );
};
