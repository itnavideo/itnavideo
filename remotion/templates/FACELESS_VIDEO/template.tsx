import React from 'react';
import { Composition } from 'remotion';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import {
  FacelessLongVideoTemplate,
  type FacelessLongVideoProps,
} from '../FACELESS_LONG_VIDEO/template';

export type FacelessVideoProps = FacelessLongVideoProps;
export const FacelessVideoTemplate = FacelessLongVideoTemplate;

// Strictly 16:9 Widescreen YouTube format
export const FacelessVideoComposition = () => (
  <Composition
    id="FACELESS-VIDEO"
    component={FacelessVideoTemplate}
    durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1920}
    height={1080}
    defaultProps={{
      durationSeconds: 60,
      title: 'FACELESS VIDEO',
      backgroundTheme: 'purple-vignette',
    }}
    calculateMetadata={({ props }) => {
      const p = props as FacelessVideoProps;
      const rawDuration = Number(p.durationSeconds) || Number(p.renderWindowSeconds) || Number(p.sourceDurationSeconds) || 60;
      const durationSeconds = Math.max(5, Math.min(1200, rawDuration));
      return {
        durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width: 1920,
        height: 1080,
      };
    }}
  />
);

export { FacelessVideoComposition as AiVideoGeneratorComposition, FacelessVideoTemplate as AiVideoGeneratorTemplate };
