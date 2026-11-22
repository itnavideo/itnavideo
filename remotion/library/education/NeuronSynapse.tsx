import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NeuronSynapseProps {
  neurotransmitter?: string;
  actionPotentialMv?: number;
  className?: string;
}

export const NeuronSynapse: React.FC<NeuronSynapseProps> = ({
  neurotransmitter = 'DOPAMINE / SEROTONIN',
  actionPotentialMv = 40,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Synaptic vesicle firing
  const fireOffset = (frame * 3) % 100;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-purple-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(14, 10, 20, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(168, 85, 247, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px]">
            SYNAPTIC NEUROTRANSMISSION
          </span>
          <span className="text-zinc-500 text-[10px]">+{actionPotentialMv} mV PEAK</span>
        </div>

        {/* Synaptic Cleft Graphic */}
        <div className="h-36 my-2 relative flex items-center justify-between px-6 overflow-hidden">
          {/* Pre-synaptic Terminal */}
          <div className="w-16 h-28 rounded-r-3xl bg-purple-900/60 border border-purple-400/40 p-2 flex flex-col justify-center">
            <span className="text-[8px] text-purple-200">Pre-Synapse</span>
          </div>

          {/* Firing Neurotransmitter Vesicles */}
          <div className="flex-1 flex items-center justify-center relative">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                style={{
                  transform: `translateX(${-30 + ((fireOffset + i * 25) % 70)}px) translateY(${
                    Math.sin(frame * 0.2 + i) * 8
                  }px)`,
                }}
              />
            ))}
          </div>

          {/* Post-synaptic Receptor Density */}
          <div className="w-16 h-28 rounded-l-3xl bg-indigo-900/60 border border-indigo-400/40 p-2 flex flex-col justify-center text-right">
            <span className="text-[8px] text-indigo-200">Receptors</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
          <span className="text-purple-300 font-bold">{neurotransmitter}</span>
          <span className="text-zinc-500 text-[10px]">Cleft: 20nm</span>
        </div>
      </div>
    </div>
  );
};
