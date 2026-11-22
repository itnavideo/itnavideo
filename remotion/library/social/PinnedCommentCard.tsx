import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PinnedCommentCardProps {
  creatorName?: string;
  badgeText?: string;
  comment?: string;
  publishedTime?: string;
  avatarUrl?: string;
  className?: string;
}

export const PinnedCommentCard: React.FC<PinnedCommentCardProps> = ({
  creatorName = 'ItnaVideo Creator Studio',
  badgeText = 'Author • Pinned',
  comment = 'Drop your channel link in the replies and our team will review your first AI reel live! 👇',
  publishedTime = 'Pinned 1 hour ago',
  avatarUrl,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-4 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-4 border border-amber-500/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(20, 18, 14, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(245, 158, 11, 0.15)',
        }}
      >
        {/* Top pinned bar */}
        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-3 pb-2 border-b border-white/5">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
          <span className="uppercase tracking-wider text-[11px]">{badgeText}</span>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={creatorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-amber-400 font-bold text-sm">{creatorName.charAt(0)}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-sm truncate">{creatorName}</span>
              <span className="text-zinc-500 text-[11px]">{publishedTime}</span>
            </div>

            <p className="text-zinc-200 text-xs mt-1 leading-relaxed">{comment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
