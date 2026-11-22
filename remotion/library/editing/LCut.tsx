import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface LCutProps {
  audioLingerFrames?: number;
  videoCutFrame?: number;
  clipAName?: string;
  clipBName?: string;
  accentColor?: string;
  className?: string;
}

export const LCut: React.FC<LCutProps> = ({
  audioLingerFrames = 25,
  videoCutFrame = 45,
  clipAName = 'Scene A: Character Speaks',
  clipBName = 'Scene B: Listener Reaction',
  accentColor = '#8b5cf6',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const videoSwitched = frame >= videoCutFrame;
  const audioLingers = frame < videoCutFrame + audioLingerFrames;

  return (
    <div className={"relative w-full h-full flex flex-col justify-between p-6 bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden text-white " + className}>
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-mono text-xs font-bold border border-purple-500/30">
            L-CUT (AUDIO LINGER)
          </span>
          <span className="text-xs text-white/60 font-mono">Audio overlaps {audioLingerFrames}f</span>
        </div>
        <div className="text-xs font-mono text-white/40">F: {frame}</div>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center relative rounded-xl overflow-hidden border border-white/10 bg-zinc-900/80">
        <div className="text-center z-10">
          <p className="text-2xl font-bold tracking-tight mb-1">
            {videoSwitched ? clipBName : clipAName}
          </p>
          <p className="text-xs text-white/50 uppercase tracking-widest">
            {videoSwitched ? 'Reaction Video Active' : 'Initial Speaker Shot'}
          </p>
        </div>

        {videoSwitched && audioLingers && (
          <div className="absolute bottom-4 px-3 py-1 bg-purple-950/90 text-purple-300 text-xs font-mono rounded-full border border-purple-500/40">
            ♪ Speaker Audio A Overlapping Over Reaction B
          </div>
        )}
      </div>

      <div className="bg-black/60 p-4 rounded-xl border border-white/10 space-y-2 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-12 text-white/50 text-[10px]">VIDEO:</span>
          <div className="flex-1 h-5 bg-sky-900/40 border border-sky-500/40 rounded flex items-center px-2 text-[10px]">
            {videoSwitched ? clipBName : clipAName}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-12 text-white/50 text-[10px]">AUDIO:</span>
          <div className="flex-1 h-5 bg-purple-900/40 border border-purple-500/40 rounded flex items-center px-2 text-[10px]">
            {audioLingers ? ('♫ ' + clipAName + ' (Lingering voice)') : ('♫ ' + clipBName + ' (Room tone)')}
          </div>
        </div>
      </div>
    </div>
  );
};
