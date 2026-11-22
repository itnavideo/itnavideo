import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';

export interface MatchCutProps {
  shape?: 'circle' | 'square' | 'silhouette' | 'eye';
  firstSceneLabel?: string;
  secondSceneLabel?: string;
  transitionFrame?: number;
  guideColor?: string;
  className?: string;
}

export const MatchCut: React.FC<MatchCutProps> = ({
  shape = 'circle',
  firstSceneLabel = 'Coffee Cup (Morning)',
  secondSceneLabel = 'Ferris Wheel (Evening)',
  transitionFrame = 45,
  guideColor = '#38bdf8',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isSecondScene = frame >= transitionFrame;

  const shapeMorph = spring({
    frame: Math.max(0, frame - transitionFrame),
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  return (
    <div className={"relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950 text-white select-none " + className}>
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          background: isSecondScene
            ? 'radial-gradient(circle at center, #1e1b4b 0%, #030712 85%)'
            : 'radial-gradient(circle at center, #431407 0%, #030712 85%)',
        }}
      />

      <svg className="w-64 h-64 z-10" viewBox="0 0 200 200" fill="none">
        <circle
          cx="100"
          cy="100"
          r="60"
          stroke={guideColor}
          strokeWidth="3"
          strokeDasharray="6 4"
          className="opacity-80"
          style={{ transform: 'rotate(' + (frame * 1.5) + 'deg)', transformOrigin: 'center' }}
        />
        {shape === 'circle' && (
          <circle
            cx="100"
            cy="100"
            r={50 + shapeMorph * 8}
            fill={isSecondScene ? '#0284c7' : '#d97706'}
            fillOpacity="0.85"
            stroke="#ffffff"
            strokeWidth="3"
          />
        )}
        {shape === 'eye' && (
          <ellipse
            cx="100"
            cy="100"
            rx={50}
            ry={28 + shapeMorph * 10}
            fill={isSecondScene ? '#7c3aed' : '#059669'}
            stroke="#ffffff"
            strokeWidth="3"
          />
        )}
        <line x1="100" y1="20" x2="100" y2="180" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
      </svg>

      <div className="z-10 mt-8 text-center space-y-1">
        <div className="text-xl font-bold tracking-tight">
          {isSecondScene ? secondSceneLabel : firstSceneLabel}
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 font-mono">
          MATCH CUT ALIGNMENT • {isSecondScene ? 'OUTGOING MATCH' : 'INCOMING ANCHOR'}
        </div>
      </div>
    </div>
  );
};
