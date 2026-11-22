import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TikTokProfileCardProps {
  handle?: string;
  bio?: string;
  soundTitle?: string;
  likesCount?: string;
  avatarUrl?: string;
  className?: string;
}

export const TikTokProfileCard: React.FC<TikTokProfileCardProps> = ({
  handle = 'itnavideo',
  bio = 'Turn scripts into viral videos in 60s ⚡️',
  soundTitle = 'Original Sound - ItnaVideo Beats',
  likesCount = '1.4M',
  avatarUrl,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const discRotation = (frame * 4) % 360;

  // Floating musical note animation
  const note1Y = Math.sin(frame * 0.15) * 12;
  const note2Y = Math.cos(frame * 0.12) * 15;

  return (
    <div
      className={`flex items-center justify-center p-4 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-xs rounded-3xl p-5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 10, 12, 0.92)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8), -4px 0 20px rgba(0,242,234,0.15), 4px 0 20px rgba(254,44,85,0.15)',
        }}
      >
        {/* Floating animated musical note */}
        <div
          className="absolute top-4 right-6 text-cyan-400 opacity-60 text-xs pointer-events-none"
          style={{ transform: `translateY(${note1Y}px)` }}
        >
          ♫
        </div>
        <div
          className="absolute top-8 right-12 text-rose-500 opacity-60 text-sm pointer-events-none"
          style={{ transform: `translateY(${note2Y}px)` }}
        >
          ♪
        </div>

        <div className="flex items-center gap-3.5">
          {/* Avatar with TikTok plus badge */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 bg-zinc-800 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt={handle} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#fe2c55] to-[#00f2fe] flex items-center justify-center text-white font-black text-xl">
                  {handle.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Plus follow icon */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#fe2c55] border-2 border-zinc-950 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              +
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-white font-black text-base truncate tracking-tight">@{handle}</h4>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                ♥ {likesCount}
              </span>
              <span>•</span>
              <span className="text-zinc-400 truncate">Creator</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-zinc-300 text-xs font-medium mt-3 leading-relaxed">{bio}</p>

        {/* Animated Rotating Vinyl Sound Bar */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2.5">
          {/* Spinning mini vinyl disc */}
          <div
            className="w-7 h-7 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center flex-shrink-0 shadow-inner"
            style={{ transform: `rotate(${discRotation}deg)` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#00f2fe]" />
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 truncate">
              <span className="text-xs">🎵</span>
              <span className="truncate font-mono">{soundTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
