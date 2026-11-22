import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudioDuckingVisualizerProps {
  duckingDb?: number; // e.g. -12 dB
  className?: string;
}

export const AudioDuckingVisualizer: React.FC<AudioDuckingVisualizerProps> = ({
  duckingDb = -12,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const isSpeaking = (frame % 80) < 45;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          SMART AUDIO DUCKING
        </span>
        <span className="text-white/40">SIDECHAIN COMPRESSOR</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col justify-center space-y-3">
        <div className="p-3 rounded bg-black/50 border border-white/5 flex justify-between items-center text-xs">
          <span className="text-white/70">Voiceover Dialogue:</span>
          <span className={isSpeaking ? "text-emerald-400 font-bold" : "text-white/30"}>
            {isSpeaking ? "SPEAKING [GATE OPEN]" : "SILENT [STANDBY]"}
          </span>
        </div>

        <div className="p-3 rounded bg-black/50 border border-white/5 flex justify-between items-center text-xs">
          <span className="text-white/70">Background Music Level:</span>
          <span className={isSpeaking ? "text-amber-400 font-bold" : "text-sky-400 font-bold"}>
            {isSpeaking ? (duckingDb + " dB (Ducked)") : "0.0 dB (Full)"}
          </span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ATTACK: 50ms</span>
        <span>RELEASE: 350ms</span>
      </div>
    </div>
  );
};
