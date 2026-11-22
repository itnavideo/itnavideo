import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnSpeechBubbleProps {
  quote?: string;
  color?: string;
  className?: string;
}

export const HandDrawnSpeechBubble: React.FC<HandDrawnSpeechBubbleProps> = ({
  quote = '"Wait, does this really render in cloud?"',
  color = '#38bdf8',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          HAND-DRAWN SPEECH BUBBLE
        </span>
        <span className="text-white/40">DIALOGUE CALLOUT</span>
      </div>

      <div className="flex-1 my-4 relative flex items-center justify-center p-6">
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 150">
          <path
            d="M 30,25 C 90,18 210,22 275,26 C 285,60 282,95 270,110 C 210,114 120,112 80,110 L 45,138 L 55,110 C 30,105 24,70 30,25 Z"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="750"
            strokeDashoffset={750 * (1 - progress)}
          />
        </svg>
        <div className="z-10 text-center font-bold text-white text-base px-6 italic">
          {quote}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TAIL ANCHOR: LOWER LEFT</span>
        <span>COMIC STRIP INKING</span>
      </div>
    </div>
  );
};
