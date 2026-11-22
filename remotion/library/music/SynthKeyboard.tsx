import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SynthKeyboardProps {
  keysCount?: number;
  className?: string;
}

export const SynthKeyboard: React.FC<SynthKeyboardProps> = ({
  keysCount = 14,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-zinc-700 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(14, 14, 18, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(56, 189, 248, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
            ANALOG SYNTHESIZER KEYBED
          </span>
          <span className="text-zinc-500 text-[10px]">MIDI CH 1</span>
        </div>

        {/* Piano Keys */}
        <div className="flex h-20 my-3 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-950">
          {Array.from({ length: keysCount }).map((_, i) => {
            const isPressed = Math.floor(frame / 15) % keysCount === i;

            return (
              <div
                key={i}
                className="flex-1 border-r border-zinc-400 transition-all duration-75 flex flex-col justify-end p-1"
                style={{
                  backgroundColor: isPressed ? '#06b6d4' : '#f8fafc',
                  boxShadow: isPressed ? '0 0 10px #06b6d4' : 'none',
                }}
              >
                <div className="w-full h-1 bg-zinc-300 rounded" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
