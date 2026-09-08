import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Heading } from '../components/Heading';
import { HighlightText } from '../components/HighlightText';
import { getScaleAnimation } from '../animations/Scale';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface ConclusionSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function ConclusionScene({ scene, headingFont = 'Montserrat, sans-serif', bodyFont = 'Inter, sans-serif' }: ConclusionSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = getScaleAnimation(frame, fps);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-16 z-10 text-center" style={anim}>
      <div className="mb-6 inline-block rounded-full bg-emerald-500/20 px-6 py-2 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/40">
        CONCLUSION & NEXT STEPS
      </div>

      <Heading
        text={scene.heading || 'TAKE ACTION TODAY'}
        level="h1"
        fontFamily={headingFont}
        color="#FFFFFF"
        className="mb-8 max-w-4xl"
      />

      <HighlightText
        text={scene.supportingText || scene.narrationSegment.text}
        highlightedWords={scene.highlightedWords}
        accentColor="#10B981"
        fontFamily={bodyFont}
        className="max-w-2xl text-center"
      />
    </div>
  );
}

