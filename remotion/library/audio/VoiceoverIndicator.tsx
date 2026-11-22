import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface VoiceoverIndicatorProps {
  speakerName?: string;
  className?: string;
}

export const VoiceoverIndicator: React.FC<VoiceoverIndicatorProps> = ({
  speakerName = 'AI Narrator (ElevenLabs)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          VOICEOVER ACTIVITY SENSOR
        </span>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-rose-400 font-bold text-[10px]">MIC ON AIR</span>
        </div>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full bg-rose-950 border-2 border-rose-500/60 flex items-center justify-center text-rose-300 text-xl shadow-lg">
          🎙
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-1">{speakerName}</div>
          <div className="flex items-center space-x-1 h-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-rose-400 rounded-full"
                style={{ height: (Math.abs(Math.sin((frame * 0.2) + i * 0.5)) * 18 + 4) + 'px' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>NOISE GATE: OPEN</span>
        <span>SAMPLE RATE: 48.0 kHz</span>
      </div>
    </div>
  );
};
