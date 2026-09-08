import { interpolate, spring } from 'remotion';

export function getFadeAnimation(frame: number, fps: number, delayFrames: number = 0) {
  const currentFrame = Math.max(0, frame - delayFrames);
  const opacity = interpolate(currentFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { opacity };
}

