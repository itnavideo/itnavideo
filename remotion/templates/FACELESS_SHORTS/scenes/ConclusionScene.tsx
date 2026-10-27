import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Heading } from '../components/Heading';
import { HighlightText } from '../components/HighlightText';
import { getScaleAnimation } from '../animations/Scale';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface ConclusionSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function ConclusionScene({
  scene,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: ConclusionSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isDark = palette?.isDark ?? true;
  const headingColor = isDark ? '#FFFFFF' : '#0F172A';

  const anim = getScaleAnimation(currentFrame, fps);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-16 z-10 text-center" style={anim}>
      <Heading
        text={scene.heading || 'TAKE ACTION TODAY'}
        level="h1"
        fontFamily={headingFont}
        color={headingColor}
        className="mb-8 max-w-4xl"
      />

      <HighlightText
        text={scene.supportingText || scene.narrationSegment?.text || ''}
        highlightedWords={scene.highlightedWords}
        accentColor="#10B981"
        fontFamily={bodyFont}
        className="max-w-2xl text-center"
      />
    </div>
  );
}

