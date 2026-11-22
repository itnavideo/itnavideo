import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CommentOverlayProps {
  authorName?: string;
  authorHandle?: string;
  avatarUrl?: string;
  commentText?: string;
  likesCount?: string;
  timeAgo?: string;
  isPinned?: boolean;
  isCreatorHearted?: boolean;
  className?: string;
}

export const CommentOverlay: React.FC<CommentOverlayProps> = ({
  authorName = 'Alex Rivera',
  authorHandle = '@arivera_dev',
  avatarUrl,
  commentText = 'This saved me literally 15 hours of video editing this week. Absolute game changer 🔥',
  likesCount = '1.2K',
  timeAgo = '3h ago',
  isPinned = true,
  isCreatorHearted = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const heartPop = spring({ frame: frame - 25, fps, config: { damping: 10, stiffness: 220 } });

  return (
    <div
      className={`flex items-center justify-center p-4 ${className}`}
      style={{
        transform: `scale(${enter}) translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative"
        style={{
          background: 'rgba(15, 15, 18, 0.94)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px rgba(16, 185, 129, 0.1)',
        }}
      >
        {/* Pinned badge */}
        {isPinned && (
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold mb-2.5 pb-2 border-b border-white/5">
            <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
            <span>Pinned by Creator</span>
          </div>
        )}

        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center border border-white/10 flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {authorName.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm truncate">{authorName}</span>
              <span className="text-zinc-500 text-xs truncate">{timeAgo}</span>
            </div>

            <p className="text-zinc-200 text-xs leading-relaxed mt-1">{commentText}</p>

            <div className="flex items-center gap-4 mt-2.5 text-xs text-zinc-400">
              {/* Thumbs up */}
              <div className="flex items-center gap-1 hover:text-white">
                <svg className="w-3.5 h-3.5 text-zinc-400 fill-current" viewBox="0 0 24 24">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
                <span>{likesCount}</span>
              </div>

              {/* Creator Hearted */}
              {isCreatorHearted && (
                <div
                  className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20"
                  style={{ transform: `scale(${heartPop})` }}
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-[10px] font-bold">Loved by Creator</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
