import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EventReconstructionProps {
  children?: React.ReactNode;
  incidentLabel?: string;
  timestamp?: string;
  location?: string;
  disclaimer?: string;
  className?: string;
}

export const EventReconstruction: React.FC<EventReconstructionProps> = ({
  children,
  incidentLabel = 'INCIDENT RECONSTRUCTION',
  timestamp = '23:44:18 LOCAL TIME',
  location = 'CROSSING POINT CHARLIE',
  disclaimer = 'ACTUAL DIALOGUE DRAMATIZED FROM RECORDED AUDIO WIRELOGS',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 90 },
  });

  const blink = Math.sin(frame * 0.3) > 0;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {/* Background Reenactment Footage / Animation */}
      <div className="relative w-full h-full">{children}</div>

      {/* Top Dramatic Banner */}
      <div
        className="absolute top-6 inset-x-6 z-30 flex items-center justify-between bg-red-950/80 border border-red-800/80 backdrop-blur-md rounded-xl px-5 py-3 shadow-2xl select-none"
        style={{
          transform: `translateY(${interpolate(entry, [0, 1], [-25, 0])}px)`,
          opacity: entry,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              blink ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-red-900'
            }`}
          />
          <span className="text-xs sm:text-sm font-mono font-black tracking-widest text-red-200 uppercase">
            {incidentLabel}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-amber-400">{timestamp}</span>
      </div>

      {/* Bottom Subtitle / Disclaimers */}
      <div className="absolute bottom-6 inset-x-6 z-30 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-400 bg-zinc-950/80 border border-zinc-800 backdrop-blur-md rounded-lg px-4 py-2 select-none">
        <span className="font-semibold text-zinc-200 uppercase">{location}</span>
        <span className="text-zinc-500 italic mt-1 sm:mt-0">{disclaimer}</span>
      </div>
    </div>
  );
};
