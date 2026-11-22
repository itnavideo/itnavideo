import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SpatialAudioFieldProps {
  className?: string;
}

export const SpatialAudioField: React.FC<SpatialAudioFieldProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const orbitAngle = frame * 2;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          360° BINAURAL SPATIAL SOUNDSTAGE
        </span>
        <span className="text-white/40">DOLBY ATMOS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center relative overflow-hidden">
        <div className="w-40 h-40 rounded-full border border-sky-500/30 relative flex items-center justify-center">
          <span className="text-xs text-white/60">HEAD</span>
          <div
            className="w-4 h-4 rounded-full bg-sky-400 absolute shadow-lg"
            style={{
              transform: 'rotate(' + orbitAngle + 'deg) translate(65px)',
            }}
          />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>HRTF FILTER: ENABLED</span>
        <span>AZIMUTH: {(orbitAngle % 360).toFixed(0)}°</span>
      </div>
    </div>
  );
};
