import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudioDrivenCameraShakeProps {
  className?: string;
}

export const AudioDrivenCameraShake: React.FC<AudioDrivenCameraShakeProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const isBassHit = (frame % 30) < 4;
  const shakeX = isBassHit ? (Math.random() * 8 - 4) : 0;
  const shakeY = isBassHit ? (Math.random() * 8 - 4) : 0;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          AUDIO-DRIVEN CAMERA IMPACT
        </span>
        <span className="text-white/40">BASS DROP SHAKE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div
          className={"p-4 rounded-lg border-2 text-center transition-transform " + (
            isBassHit ? 'border-rose-500 bg-rose-950/40 text-rose-300' : 'border-white/10 text-white/50'
          )}
          style={{ transform: "translate(" + shakeX.toFixed(1) + "px, " + shakeY.toFixed(1) + "px)" }}
        >
          <div className="text-xl font-bold">{isBassHit ? '⚡ IMPACT SHAKE' : 'STABLE HORIZON'}</div>
          <div className="text-[10px] mt-1">Camera Jitter Synced to Kick Drum</div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>TRIGGER THRESHOLD: -6 dB</span>
        <span>RECOVERY DAMPING: 80ms</span>
      </div>
    </div>
  );
};
