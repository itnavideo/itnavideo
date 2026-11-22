import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface InstagramFollowCardProps {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  followersCount?: string;
  postsCount?: string;
  verified?: boolean;
  className?: string;
}

export const InstagramFollowCard: React.FC<InstagramFollowCardProps> = ({
  username = 'itnavideo.ai',
  fullName = 'ItnaVideo • AI Video Creator',
  avatarUrl,
  followersCount = '42.8K',
  postsCount = '164',
  verified = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 13, stiffness: 120 } });
  const isFollowing = frame >= 48;
  const followBounce = spring({ frame: frame - 48, fps, config: { damping: 10, stiffness: 220 } });

  // Story ring gradient rotation
  const ringRotation = (frame * 3) % 360;

  return (
    <div
      className={`flex items-center justify-center p-4 ${className}`}
      style={{
        transform: `scale(${enter}) translateY(${interpolate(enter, [0, 1], [35, 0])}px)`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.95), rgba(9, 9, 11, 0.98))',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(225, 48, 108, 0.15)',
        }}
      >
        {/* Subtle Instagram brand mesh glow */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          }}
        />

        <div className="flex items-center gap-4 relative z-10">
          {/* Avatar with Animated Instagram Story Gradient Ring */}
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-full p-[2.5px] flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(${ringRotation}deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)`,
              }}
            >
              <div className="w-full h-full rounded-full bg-zinc-950 p-[2px] overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white font-extrabold text-lg">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            {/* Live badge */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white tracking-widest shadow-md border border-white/20">
              Live
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base truncate">@{username}</span>
              {verified && (
                <svg className="w-4 h-4 text-sky-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              )}
            </div>
            <p className="text-zinc-400 text-xs font-medium truncate mt-0.5">{fullName}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-300">
              <span>
                <strong className="text-white font-bold">{postsCount}</strong> posts
              </span>
              <span>
                <strong className="text-white font-bold">{followersCount}</strong> followers
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Follow / Following */}
        <div className="mt-4 pt-3 border-t border-white/5 relative z-10 flex gap-2">
          <button
            type="button"
            className="flex-1 py-2 px-4 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg"
            style={{
              transform: isFollowing ? `scale(${interpolate(followBounce, [0, 0.5, 1], [1, 0.94, 1])})` : 'scale(1)',
              background: isFollowing
                ? 'rgba(39, 39, 42, 0.9)'
                : 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: isFollowing ? '#d4d4d8' : '#ffffff',
              border: isFollowing ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
          >
            {isFollowing ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Following</span>
              </>
            ) : (
              <span>Follow</span>
            )}
          </button>

          <button
            type="button"
            className="px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 text-xs font-semibold border border-white/5"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
};
