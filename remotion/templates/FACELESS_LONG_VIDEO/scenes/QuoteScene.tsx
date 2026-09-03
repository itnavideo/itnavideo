import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Heading } from '../components/Heading';
import { getFadeAnimation } from '../animations/Fade';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface QuoteSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function QuoteScene({ scene, headingFont = 'Playfair Display, serif', bodyFont = 'Inter, sans-serif' }: QuoteSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = getFadeAnimation(frame, fps);
  const author = scene.quoteAuthor || 'INDUSTRY EXPERT';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-20 z-10 text-center max-w-5xl mx-auto" style={anim}>
      <span className="text-8xl text-indigo-400 font-serif leading-none mb-4">“</span>
      <p className="text-4xl font-serif italic text-white leading-relaxed mb-8" style={{ fontFamily: headingFont }}>
        {scene.heading || scene.narrationSegment.text}
      </p>
      <span className="text-sm font-black uppercase tracking-widest text-indigo-300 border-t border-indigo-500/30 pt-4" style={{ fontFamily: bodyFont }}>
        — {author}
      </span>
    </div>
  );
}

