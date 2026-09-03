import React from 'react';
import { Composition } from 'remotion';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import {
  FacelessLongVideoTemplate,
  type FacelessLongVideoProps,
} from '../FACELESS_LONG_VIDEO/template';

export type AiVideoGeneratorProps = FacelessLongVideoProps;

export const AiVideoGeneratorTemplate = FacelessLongVideoTemplate;

export const AiVideoGeneratorComposition = () => (
  <>
    {/* 16:9 Widescreen (Primary YouTube Long-Form Format) */}
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
        const durationSeconds = Math.max(5, Math.min(600, Number(p.durationSeconds) || 60));
        return {
          durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
          fps: DEFAULT_FPS,
          width: 1920,
          height: 1080,
        };
      }}
    />

    {/* 9:16 Vertical (Shorts & Reels Long Clip Format) */}
    <Composition
      id="AI-VIDEO-GENERATOR-VERTICAL"
      component={AiVideoGeneratorTemplate}
      durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
      fps={DEFAULT_FPS}
      width={1080}
      height={1920}
      defaultProps={{
        durationSeconds: 60,
        title: 'AI VIDEO GENERATOR',
        backgroundTheme: 'purple-vignette',
      }}
      calculateMetadata={({ props }) => {
        const p = props as AiVideoGeneratorProps;
        const durationSeconds = Math.max(5, Math.min(600, Number(p.durationSeconds) || 60));
        return {
          durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
          fps: DEFAULT_FPS,
          width: 1080,
          height: 1920,
        };
      }}
    />
  </>
);
