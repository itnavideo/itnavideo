import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface JCutProps {
  audioLeadFrames?: number;
  videoCutFrame?: number;
  clipAName?: string;
  clipBName?: string;
  accentColor?: string;
  className?: string;
}

export const JCut: React.FC<JCutProps> = ({
  audioLeadFrames = 25,
  videoCutFrame = 60,
  clipAName = 'Scene A: Office Dialogue',
  clipBName = 'Scene B: Exterior Traffic',
  accentColor = '#10b981',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const audioStarts = videoCutFrame - audioLeadFrames;

  const audioActive = frame >= audioStarts;
  const videoSwitched = frame >= videoCutFrame;

  return (
    <div className={"relative w-full h-full flex flex-col justify-between p-6 bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden text-white " + className}>
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
            J-CUT (AUDIO LEAD)
          </span>
          <span className="text-xs text-white/60 font-mono">Audio leads by {audioLeadFrames}f</span>
        </div>
        <div className="text-xs font-mono text-white/40">F: {frame}</div>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center relative rounded-xl overflow-hidden border border-white/10 bg-zinc-900/80">
        <div className="text-center z-10">
          <p className="text-2xl font-bold tracking-tight mb-1">
            {videoSwitched ? clipBName : clipAName}
          </p>
          <p className="text-xs text-white/50 uppercase tracking-widest">
            {videoSwitched ? 'Incoming Video Cut' : 'Outgoing Video Track'}
          </p>
        </div>

        {audioActive && !videoSwitched && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border-2 border-emerald-400/40 animate-ping" />
            <div className="absolute px-3 py-1 bg-emerald-950/90 text-emerald-300 text-xs font-mono rounded-full border border-emerald-500/40 bottom-4">
              ♪ Audio Track B Active Ahead of Video
            </div>
          </div>
        )}
      </div>

      <div className="bg-black/60 p-4 rounded-xl border border-white/10 space-y-2 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-12 text-white/50 text-[10px]">VIDEO:</span>
          <div className="flex-1 h-5 bg-blue-900/40 border border-blue-500/40 rounded flex items-center px-2 text-[10px]">
            {videoSwitched ? clipBName : clipAName}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-12 text-white/50 text-[10px]">AUDIO:</span>
          <div className="flex-1 h-5 bg-emerald-900/40 border border-emerald-500/40 rounded flex items-center px-2 text-[10px]" style={{ borderColor: accentColor }}>
            {audioActive ? ('♫ ' + clipBName + ' (Lead in)') : ('♫ ' + clipAName)}
          </div>
        </div>
      </div>
    </div>
  );
};
