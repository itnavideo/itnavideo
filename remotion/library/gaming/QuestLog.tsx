import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface QuestObjective {
  text: string;
  completed: boolean;
}

export interface QuestLogProps {
  questTitle?: string;
  category?: string;
  objectives?: QuestObjective[];
  rewardXp?: number;
  rewardGold?: number;
  className?: string;
}

export const QuestLog: React.FC<QuestLogProps> = ({
  questTitle = 'The Cybernetic Singularity',
  category = 'MAIN STORY QUEST',
  objectives = [
    { text: 'Infiltrate Neural Substation Beta', completed: true },
    { text: 'Extract Master Cryptographic Key', completed: true },
    { text: 'Eliminate Rogue Drone Overseer', completed: false },
  ],
  rewardXp = 2500,
  rewardGold = 850,
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
        className="w-full max-w-sm rounded-2xl p-4 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden font-mono"
        style={{
          background: 'rgba(10, 14, 20, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(6, 182, 212, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
          <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">{category}</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        <h3 className="text-white font-bold text-sm tracking-tight mt-2">{questTitle}</h3>

        {/* Objectives */}
        <div className="flex flex-col gap-2 mt-3">
          {objectives.map((obj, i) => {
            const checkSpring = spring({
              frame: frame - i * 10,
              fps,
              config: { damping: 12, stiffness: 160 },
            });

            return (
              <div
                key={i}
                className="flex items-center gap-2 text-xs"
                style={{
                  opacity: checkSpring,
                  transform: `translateX(${interpolate(checkSpring, [0, 1], [-15, 0])}px)`,
                }}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                    obj.completed
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                      : 'border-zinc-700 bg-zinc-900 text-transparent'
                  }`}
                >
                  <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={obj.completed ? 'text-zinc-400 line-through' : 'text-zinc-200'}>
                  {obj.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rewards Footer */}
        <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Rewards:</span>
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold">+{rewardXp} XP</span>
            <span className="text-amber-400 font-bold">+{rewardGold} Gold</span>
          </div>
        </div>
      </div>
    </div>
  );
};
