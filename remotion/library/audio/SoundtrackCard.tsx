import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SoundtrackCardProps {
  trackTitle?: string;
  artist?: string;
  className?: string;
}

export const SoundtrackCard: React.FC<SoundtrackCardProps> = ({
  trackTitle = 'Midnight City (Cyberpunk Mix)',
  artist = 'M83 / Synthwave Collective',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 font-bold border border-green-500/30">
          NOW PLAYING SOUNDTRACK
        </span>
        <span className="text-white/40">SPOTIFY WIDGET</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/90 rounded-xl border border-white/10 p-4 flex items-center space-x-4">
        {/* Rotating Vinyl */}
        <div
          className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-white/20 flex items-center justify-center shadow-lg"
          style={{ transform: 'rotate(' + (frame * 2) + 'deg)' }}
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-0.5">{trackTitle}</div>
          <div className="text-xs text-emerald-400">{artist}</div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>AUDIO CODEC: FLAC 24-BIT</span>
        <span>SYNC: TIMECODE MATCH</span>
      </div>
    </div>
  );
};
