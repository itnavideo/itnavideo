import React from 'react';
import {
  TransitionSeries,
  linearTiming,
  springTiming,
  crossZoom,
  dreamyZoom,
  filmBurn,
  linearBlur,
  type TransitionPresentation,
} from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';

export type TransitionStylePreset =
  | 'fade'
  | 'crossfade'
  | 'slide'
  | 'slide-push'
  | 'wipe'
  | 'cross-zoom'
  | 'zoom-whip'
  | 'dreamy-zoom'
  | 'film-burn'
  | 'linear-blur'
  | 'hard-cut';

export interface TransitionSceneItem {
  id: string;
  durationInFrames: number;
  content: React.ReactNode;
  transitionAfter?: TransitionStylePreset;
  transitionDurationFrames?: number;
}

/**
 * Resolves a preset name into an official @remotion/transitions presentation.
 * Uses only Lambda-safe HTML/CSS presentations.
 */
export function getTransitionPresentation(
  preset: TransitionStylePreset = 'fade'
): TransitionPresentation<Record<string, unknown>> | null {
  switch (preset) {
    case 'hard-cut':
      return null;
    case 'slide':
    case 'slide-push':
      return slide({ direction: 'from-right' }) as unknown as TransitionPresentation<Record<string, unknown>>;
    case 'wipe':
      return wipe({ direction: 'from-left' }) as unknown as TransitionPresentation<Record<string, unknown>>;
    case 'cross-zoom':
    case 'zoom-whip':
      return crossZoom({}) as unknown as TransitionPresentation<Record<string, unknown>>;
    case 'dreamy-zoom':
      return dreamyZoom({}) as unknown as TransitionPresentation<Record<string, unknown>>;
    case 'film-burn':
      return filmBurn({}) as unknown as TransitionPresentation<Record<string, unknown>>;
    case 'linear-blur':
      return linearBlur({}) as unknown as TransitionPresentation<Record<string, unknown>>;
    case 'fade':
    case 'crossfade':
    default:
      return fade() as unknown as TransitionPresentation<Record<string, unknown>>;
  }
}

/**
 * Reusable @remotion/transitions TransitionSeries wrapper for scene-to-scene
 * crossfades, slides, wipes, and zoom transitions.
 */
export const FacelessTransitionSeries: React.FC<{
  scenes: TransitionSceneItem[];
  defaultTransition?: TransitionStylePreset;
  defaultDurationFrames?: number;
  useSpringTiming?: boolean;
}> = ({
  scenes,
  defaultTransition = 'crossfade',
  defaultDurationFrames = 12,
  useSpringTiming = true,
}) => {
  if (!scenes || scenes.length === 0) return null;

  return (
    <TransitionSeries>
      {scenes.map((scene, index) => {
        const isLast = index === scenes.length - 1;
        const style = scene.transitionAfter ?? defaultTransition;
        const presentation = !isLast ? getTransitionPresentation(style) : null;
        const dur = scene.transitionDurationFrames ?? defaultDurationFrames;

        return (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence durationInFrames={Math.max(1, scene.durationInFrames)}>
              {scene.content}
            </TransitionSeries.Sequence>
            {!isLast && presentation && (
              <TransitionSeries.Transition
                presentation={presentation}
                timing={
                  useSpringTiming
                    ? springTiming({ config: { damping: 200 }, durationInFrames: dur })
                    : linearTiming({ durationInFrames: dur })
                }
              />
            )}
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};

