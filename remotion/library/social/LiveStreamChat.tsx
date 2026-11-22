import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ChatMessage {
  username: string;
  badge?: string;
  color?: string;
  text: string;
}

export interface LiveStreamChatProps {
  messages?: ChatMessage[];
  title?: string;
  viewerCount?: string;
  className?: string;
}

export const LiveStreamChat: React.FC<LiveStreamChatProps> = ({
  messages = [
    { username: 'crypto_dan', badge: 'VIP', color: '#38bdf8', text: 'Wait, this video was rendered in 30 seconds?! 🤯' },
    { username: 'sarah_edits', badge: 'PRO', color: '#f43f5e', text: 'The subtitle kinetic bounce is so smooth!' },
    { username: 'dev_mark', color: '#10b981', text: 'Remotion + Next.js is an absolute superpower 🔥' },
    { username: 'aaron_vfx', badge: 'MOD', color: '#eab308', text: 'Check out the new social graphics pack guys!' },
  ],
  title = 'Live Stream Chat',
  viewerCount = '3.8K watching',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 12, 16, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(56, 189, 248, 0.12)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-white font-bold tracking-tight">{title}</span>
          </div>
          <span className="text-zinc-400 font-mono text-[11px]">{viewerCount}</span>
        </div>

        {/* Rolling message stream */}
        <div className="flex flex-col gap-2.5 pt-3">
          {messages.map((msg, idx) => {
            const msgEnter = spring({
              frame: frame - idx * 8,
              fps,
              config: { damping: 12, stiffness: 150 },
            });

            return (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs leading-relaxed"
                style={{
                  transform: `translateX(${interpolate(msgEnter, [0, 1], [-20, 0])}px)`,
                  opacity: msgEnter,
                }}
              >
                {msg.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-white/10 text-white flex-shrink-0">
                    {msg.badge}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-bold mr-1.5 truncate" style={{ color: msg.color || '#38bdf8' }}>
                    {msg.username}:
                  </span>
                  <span className="text-zinc-200">{msg.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
