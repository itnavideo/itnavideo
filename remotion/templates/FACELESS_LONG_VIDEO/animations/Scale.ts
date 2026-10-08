import { interpolate, spring } from 'remotion';

export function getScaleAnimation(frame: number, fps: number, delayFrames: number = 0) {
  const currentFrame = Math.max(0, frame - delayFrames);
  const spr = spring({
    frame: currentFrame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const scale = interpolate(spr, [0, 1], [0.7, 1]);
  const opacity = interpolate(currentFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return {
    transform: `scale(${scale})`,
    opacity,
  };
}

