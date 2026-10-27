import { interpolate } from 'remotion';

export function getRevealAnimation(frame: number, fps: number, delayFrames: number = 0) {
  const currentFrame = Math.max(0, frame - delayFrames);
  const clipPercent = interpolate(currentFrame, [0, 20], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return {
    clipPath: `inset(0 ${100 - clipPercent}% 0 0)`,
    opacity: currentFrame > 0 ? 1 : 0,
  };
}

