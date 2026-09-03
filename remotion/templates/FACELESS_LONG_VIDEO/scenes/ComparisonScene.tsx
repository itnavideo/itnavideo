import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Heading } from '../components/Heading';
import { getScaleAnimation } from '../animations/Scale';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface ComparisonSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function ComparisonScene({ scene, headingFont = 'Montserrat, sans-serif', bodyFont = 'Inter, sans-serif' }: ComparisonSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = getScaleAnimation(frame, fps);
  const leftItem = scene.comparisonItems?.left || 'OLD APPROACH';
  const rightItem = scene.comparisonItems?.right || 'OPTIMIZED AI METHOD';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-16 z-10 text-center" style={anim}>
      <Heading
        text={scene.heading || 'COMPARISON ANALYSIS'}
        level="h1"
        fontFamily={headingFont}
        color="#FFFFFF"
        className="mb-12"
      />

      <div className="grid grid-cols-2 gap-12 w-full max-w-5xl">
        <div className="rounded-3xl p-8 bg-red-950/40 border border-red-500/30 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center">
          <span className="text-sm font-black text-red-400 uppercase tracking-widest mb-4">BEFORE / COMMON PITFALL</span>
          <span className="text-3xl font-extrabold text-white" style={{ fontFamily: bodyFont }}>{leftItem}</span>
        </div>

        <div className="rounded-3xl p-8 bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center">
          <span className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4">AFTER / WINNING FORMULA</span>
          <span className="text-3xl font-extrabold text-white" style={{ fontFamily: bodyFont }}>{rightItem}</span>
        </div>
      </div>
    </div>
  );
}

