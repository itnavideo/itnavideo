import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PodcastAudioWaveProps {
  episodeTitle?: string;
  duration?: string;
  className?: string;
}

export const PodcastAudioWave: React.FC<PodcastAudioWaveProps> = ({
  episodeTitle = 'Ep 42: The Future of Autonomous AI Video',
  duration = '04:12',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progressPercent = Math.min(100, (frame / 90) * 100);

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          PODCAST AUDIO PLAYER WAVE
        </span>
        <span className="text-white/40">{duration} TOTAL</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col justify-between">
        <div className="text-sm font-bold text-white mb-2">{episodeTitle}</div>
        <div className="flex items-center space-x-1 h-8">
          {Array.from({ length: 30 }).map((_, i) => {
            const isPlayed = (i / 30) * 100 <= progressPercent;
            const h = Math.abs(Math.sin(i * 0.4)) * 20 + 6;
            return (
              <div
                key={i}
                className={"flex-1 rounded-full transition-colors " + (isPlayed ? 'bg-sky-400' : 'bg-zinc-700')}
                style={{ height: h + 'px' }}
              />
            );
          })}
        </div>
        <div className="text-[10px] text-white/40 flex justify-between mt-2">
          <span>00:{(frame / 30).toFixed(0).padStart(2, '0')}</span>
          <span>{duration}</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>BITRATE: 320 kbps</span>
        <span>STEREO AAC</span>
      </div>
    </div>
  );
};
