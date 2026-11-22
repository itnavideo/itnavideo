import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SoundLevelMeterProps {
  lufs?: number;
  className?: string;
}

export const SoundLevelMeter: React.FC<SoundLevelMeterProps> = ({
  lufs = -14.2,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          LOUDNESS RADAR METER
        </span>
        <span className="text-white/40">ITU-R BS.1770</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-4xl font-black text-emerald-400 mb-1">{lufs} LUFS</div>
        <div className="text-xs text-white/50">TARGET: YOUTUBE / SPOTIFY NORMALIZED</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>LRA: 6.2 LU</span>
        <span>TRUE PEAK: -1.0 dBTP</span>
      </div>
    </div>
  );
};
