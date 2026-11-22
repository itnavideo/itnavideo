import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface WorkflowAction {
  trigger: string;
  condition: string;
  action: string;
}

export interface WorkflowAutomationProps {
  title?: string;
  workflow?: WorkflowAction;
  className?: string;
}

const DEFAULT_WORKFLOW: WorkflowAction = {
  trigger: 'WHEN: User uploads podcast voiceover audio file (.mp3 / .wav)',
  condition: 'IF: User balance >= 1 video credit && duration <= 90s',
  action: 'THEN: Dispatch AWS Lambda 30fps headless Remotion video render',
};

export const WorkflowAutomation: React.FC<WorkflowAutomationProps> = ({
  title = 'EVENT-DRIVEN WORKFLOW AUTOMATION (TRIGGER-ACTION)',
  workflow = DEFAULT_WORKFLOW,
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
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            TEMPORAL AUTOMATION
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Sequential Automation Steps */}
      <div className="space-y-4">
        {/* Step 1: Trigger */}
        <div className="bg-zinc-900 border-l-4 border-l-sky-400 border-y border-r border-zinc-800 rounded-r-xl p-4 shadow">
          <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">
            1. WEBHOOK TRIGGER
          </span>
          <p className="text-xs sm:text-sm font-mono text-zinc-100 mt-1">{workflow.trigger}</p>
        </div>

        {/* Step 2: Conditional Filter */}
        <div className="bg-zinc-900 border-l-4 border-l-amber-500 border-y border-r border-zinc-800 rounded-r-xl p-4 shadow">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
            2. CONDITIONAL GUARD
          </span>
          <p className="text-xs sm:text-sm font-mono text-zinc-100 mt-1">{workflow.condition}</p>
        </div>

        {/* Step 3: Action Execution */}
        <div className="bg-zinc-900 border-l-4 border-l-emerald-500 border-y border-r border-zinc-800 rounded-r-xl p-4 shadow">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
            3. DOWNSTREAM ACTION
          </span>
          <p className="text-xs sm:text-sm font-mono text-zinc-100 mt-1">{workflow.action}</p>
        </div>
      </div>
    </div>
  );
};
