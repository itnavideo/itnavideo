import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SpeechBubbleWaveProps {
  speakerTag?: string;
  className?: string;
}

export const SpeechBubbleWave: React.FC<SpeechBubbleWaveProps> = ({
  speakerTag = 'SPEAKER A',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          DIALOGUE SPEECH BALLOON WAVE
        </span>
        <span className="text-white/40">{speakerTag}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="px-5 py-3 rounded-2xl bg-zinc-800 border border-yellow-400/40 flex items-center space-x-1.5 shadow-lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-yellow-400 rounded-full"
              style={{ height: (Math.abs(Math.sin((frame * 0.2) + i * 0.6)) * 16 + 6) + 'px' }}
            />
          ))}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>PHONETIC SYNC: AUTOMATIC</span>
        <span>TRANSCRIBER: WHISPER v3</span>
      </div>
    </div>
  );
};
