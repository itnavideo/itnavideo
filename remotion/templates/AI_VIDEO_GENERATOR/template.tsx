import React from 'react';
import { Composition } from 'remotion';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import {
  FacelessLongVideoTemplate,
  type FacelessLongVideoProps,
} from '../FACELESS_LONG_VIDEO/template';

export type AiVideoGeneratorProps = FacelessLongVideoProps;

export const AiVideoGeneratorTemplate = FacelessLongVideoTemplate;

// 16:9 Widescreen (Primary YouTube Long-Form Format)
export const AiVideoGeneratorComposition = () => (
  <Composition
    id="AI-VIDEO-GENERATOR"
    component={AiVideoGeneratorTemplate}
    durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1920}
    height={1080}
    defaultProps={{
      durationSeconds: 60,
      title: 'AI VIDEO GENERATOR',
      backgroundTheme: 'purple-vignette',
    }}
    calculateMetadata={({ props }) => {
      const p = props as AiVideoGeneratorProps;
      const durationSeconds = Math.max(5, Math.min(1200, Number(p.durationSeconds) || 60));
      return {
        durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width: 1920,
        height: 1080,
      };
    }}
  />
);
