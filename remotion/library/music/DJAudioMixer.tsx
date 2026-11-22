import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DJAudioMixerProps {
  channel1Volume?: number;
  channel2Volume?: number;
  crossfaderPosition?: number;
  className?: string;
}

export const DJAudioMixer: React.FC<DJAudioMixerProps> = ({
  channel1Volume = 78,
  channel2Volume = 84,
  crossfaderPosition = 50,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const faderX = Math.sin(frame * 0.1) * 20;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-zinc-700 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(16, 16, 20, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(56, 189, 248, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-sky-400 font-bold uppercase tracking-wider text-[10px]">
            PRO 2-CHANNEL DJ MIXER
          </span>
          <span className="text-zinc-500 text-[10px]">GAIN +3dB</span>
        </div>

        {/* Dual Channel Vertical Faders */}
        <div className="grid grid-cols-2 gap-4 my-3">
          {/* Channel 1 */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 flex flex-col items-center">
            <span className="text-[10px] text-zinc-400 font-bold mb-2">CH 1</span>
            {/* Vertical Slider Track */}
            <div className="w-2 h-20 bg-zinc-800 rounded-full relative flex flex-col justify-end">
              <div
                className="w-full bg-sky-400 rounded-full"
                style={{ height: `${channel1Volume}%` }}
              />
              <div className="w-5 h-2 bg-white rounded -left-1.5 absolute" style={{ bottom: `${channel1Volume}%` }} />
            </div>
          </div>

          {/* Channel 2 */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 flex flex-col items-center">
            <span className="text-[10px] text-zinc-400 font-bold mb-2">CH 2</span>
            <div className="w-2 h-20 bg-zinc-800 rounded-full relative flex flex-col justify-end">
              <div
                className="w-full bg-emerald-400 rounded-full"
                style={{ height: `${channel2Volume}%` }}
              />
              <div className="w-5 h-2 bg-white rounded -left-1.5 absolute" style={{ bottom: `${channel2Volume}%` }} />
            </div>
          </div>
        </div>

        {/* Horizontal Crossfader */}
        <div className="p-2 rounded-xl bg-zinc-950 border border-white/5 flex flex-col items-center">
          <span className="text-[9px] text-zinc-500 font-bold mb-1">CROSSFADER [A ⇄ B]</span>
          <div className="w-full h-2 bg-zinc-800 rounded-full relative flex items-center justify-center">
            <div
              className="w-6 h-4 bg-white rounded shadow-md cursor-pointer absolute"
              style={{ transform: `translateX(${faderX}px)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
