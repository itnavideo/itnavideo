import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DateStampProps {
  dateText?: string;
  timeText?: string;
  timeZone?: string;
  theme?: 'military' | 'surveillance' | 'archival';
  blinkingColon?: boolean;
  className?: string;
}

export const DateStamp: React.FC<DateStampProps> = ({
  dateText = 'OCTOBER 14, 1962',
  timeText = '04:30',
  timeZone = 'EST',
  theme = 'military',
  blinkingColon = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 100 },
  });

  const colonVisible = blinkingColon ? Math.floor(frame / 15) % 2 === 0 : true;

  const [hours, minutes] = timeText.split(':');

  const themeStyle =
    theme === 'surveillance'
      ? 'bg-zinc-950/90 text-red-500 border-red-900/60 font-mono'
      : theme === 'archival'
      ? 'bg-[#e4decb] text-zinc-900 border-[#c4bc9f] font-serif'
      : 'bg-zinc-900/90 text-amber-400 border-zinc-700 font-mono';

  return (
    <div
      className={`relative inline-flex items-center gap-3 px-4 py-2 rounded-md border shadow-xl backdrop-blur-md select-none ${themeStyle} ${className}`}
      style={{
        transform: `scale(${entry})`,
        opacity: entry,
      }}
    >
      {/* Blinking Recording Dot */}
      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />

      {/* Date */}
      <span className="text-xs sm:text-sm font-bold tracking-widest uppercase">
        {dateText}
      </span>

      <span className="opacity-40">•</span>

      {/* Time with Blinking Colon */}
      <div className="text-xs sm:text-sm font-bold tracking-wider">
        <span>{hours || '00'}</span>
        <span className={colonVisible ? 'opacity-100' : 'opacity-0'}>:</span>
        <span>{minutes || '00'}</span>
        {timeZone && <span className="ml-1 text-[10px] opacity-70">{timeZone}</span>}
      </div>
    </div>
  );
};
