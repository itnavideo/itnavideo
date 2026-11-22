import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GanttTask {
  id: string;
  name: string;
  startWeek: number; // 1 to 8
  durationWeeks: number;
  color?: string;
  progress?: number; // 0 to 100%
}

export interface GanttChartProps {
  title?: string;
  tasks?: GanttTask[];
  totalWeeks?: number;
  className?: string;
}

const DEFAULT_TASKS: GanttTask[] = [
  { id: '1', name: 'Architecture & Design', startWeek: 1, durationWeeks: 2, color: '#38bdf8', progress: 100 },
  { id: '2', name: 'Whisper Transcription API', startWeek: 2, durationWeeks: 3, color: '#6366f1', progress: 85 },
  { id: '3', name: 'Remotion Lambda Cluster', startWeek: 4, durationWeeks: 3, color: '#10b981', progress: 60 },
  { id: '4', name: 'End-to-End Stress Testing', startWeek: 6, durationWeeks: 2, color: '#f59e0b', progress: 20 },
];

export const GanttChart: React.FC<GanttChartProps> = ({
  title = 'PRODUCT RELEASE SPRINT TIMELINE',
  tasks = DEFAULT_TASKS,
  totalWeeks = 8,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            GANTT SCHEDULE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-500">{totalWeeks} WEEKS CYCLE</span>
      </div>

      {/* Week Headers */}
      <div className="grid grid-cols-12 gap-2 text-center text-[10px] font-mono text-zinc-500 border-b border-zinc-800 pb-2 mb-4">
        <div className="col-span-4 text-left">TASK NAME</div>
        <div className="col-span-8 grid grid-cols-8 gap-1">
          {Array.from({ length: totalWeeks }).map((_, w) => (
            <span key={w}>W0{w + 1}</span>
          ))}
        </div>
      </div>

      {/* Task Gantt Rows */}
      <div className="space-y-3">
        {tasks.map((task, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          const barLeft = ((task.startWeek - 1) / totalWeeks) * 100;
          const barWidth = (task.durationWeeks / totalWeeks) * 100;
          const barColor = task.color || '#38bdf8';

          return (
            <div key={task.id} className="grid grid-cols-12 gap-2 items-center text-xs font-mono">
              <div className="col-span-4 text-zinc-300 font-bold truncate">
                {task.name}
              </div>

              {/* Gantt Bar Lane */}
              <div className="col-span-8 relative h-7 bg-zinc-900/80 rounded border border-zinc-800 overflow-hidden">
                <div
                  className="absolute inset-y-0 rounded transition-all flex items-center justify-between px-2"
                  style={{
                    left: `${barLeft}%`,
                    width: `${barWidth * itemSpring}%`,
                    backgroundColor: barColor,
                    boxShadow: `0 0 10px ${barColor}40`,
                  }}
                >
                  <span className="text-[9px] font-bold text-zinc-950">
                    {task.durationWeeks}W
                  </span>
                  {task.progress !== undefined && (
                    <span className="text-[9px] font-black text-zinc-950">
                      {task.progress}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
