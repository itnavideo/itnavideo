import { interpolate, spring } from 'remotion';

export function getSlideAnimation(
  frame: number,
  fps: number,
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  delayFrames: number = 0
) {
  const currentFrame = Math.max(0, frame - delayFrames);
  const spr = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const distance = 80;
  let translateX = 0;
  let translateY = 0;

  if (direction === 'up') translateY = interpolate(spr, [0, 1], [distance, 0]);
  else if (direction === 'down') translateY = interpolate(spr, [0, 1], [-distance, 0]);
  else if (direction === 'left') translateX = interpolate(spr, [0, 1], [distance, 0]);
  else if (direction === 'right') translateX = interpolate(spr, [0, 1], [-distance, 0]);

  const opacity = interpolate(currentFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return {
    transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
    opacity,
  };
}

