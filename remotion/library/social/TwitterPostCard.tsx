import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TwitterPostCardProps {
  displayName?: string;
  handle?: string;
  avatarUrl?: string;
  content?: string;
  timestamp?: string;
  replies?: string;
  retweets?: string;
  likes?: string;
  verified?: boolean;
  className?: string;
}

export const TwitterPostCard: React.FC<TwitterPostCardProps> = ({
  displayName = 'Elon Musk',
  handle = 'elonmusk',
  avatarUrl,
  content = 'Video production just changed forever with AI automation. The next million creators won’t need cameras or timeline editing.',
  timestamp = '2h ago',
  replies = '1.8K',
  retweets = '8.4K',
  likes = '54.2K',
  verified = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const isLiked = frame >= 40;
  const likeSpring = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 240 } });

  return (
    <div
      className={`flex items-center justify-center p-4 ${className}`}
      style={{
        transform: `scale(${enter}) translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-5 border border-white/10 backdrop-blur-2xl shadow-2xl relative"
        style={{
          background: 'rgba(10, 10, 12, 0.94)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 25px rgba(29, 155, 240, 0.12)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center border border-white/10 flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-sky-600 flex items-center justify-center text-white font-bold text-base">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>

            {/* Names */}
            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm truncate">{displayName}</span>
                {verified && (
                  <svg className="w-4 h-4 text-[#1d9bf0] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <span className="text-zinc-500 text-xs truncate">@{handle}</span>
            </div>
          </div>

          {/* X / Twitter logo mark */}
          <div className="text-zinc-500">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </div>

        {/* Content Body */}
        <p className="text-zinc-100 text-sm leading-relaxed font-normal mb-3">{content}</p>

        {/* Timestamp */}
        <div className="text-zinc-500 text-xs pb-3 border-b border-white/5">
          <span>{timestamp}</span> • <span className="text-sky-400 font-medium">ItnaVideo for Web</span>
        </div>

        {/* Counters (Replies, Retweets, Likes) */}
        <div className="flex items-center justify-between pt-3 text-zinc-400 text-xs">
          {/* Reply */}
          <div className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{replies}</span>
          </div>

          {/* Retweet */}
          <div className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{retweets}</span>
          </div>

          {/* Like */}
          <div
            className="flex items-center gap-1.5 font-medium transition-colors"
            style={{
              color: isLiked ? '#f43f5e' : undefined,
              transform: isLiked ? `scale(${interpolate(likeSpring, [0, 0.5, 1], [1, 1.25, 1])})` : 'scale(1)',
            }}
          >
            <svg
              className="w-4 h-4"
              fill={isLiked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{likes}</span>
          </div>

          {/* Bookmark / Share */}
          <div className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
