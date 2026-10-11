// remotion/captions/MotionWrapper.tsx
// Parametric Entrance / Exit Spring Motion Wrapper for captions

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type MotionType = 'slide-up' | 'zoom-in' | 'bounce' | 'glitch' | 'none';

export interface MotionWrapperProps {
  children: React.ReactNode;
  motionType?: MotionType;
  startFrame?: number;
  position?: 'bottom' | 'center' | 'top';
  customStyle?: React.CSSProperties;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  motionType = 'slide-up',
  startFrame = 0,
  position = 'bottom',
  customStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - startFrame);

  let transform = '';
  let opacity = 1;

  if (motionType === 'slide-up') {
    const translateY = spring({
      frame: localFrame,
      fps,
      config: { damping: 18, stiffness: 280, mass: 0.6 },
      from: 32,
      to: 0,
    });
    opacity = interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: 'clamp' });
    transform = `translateY(${translateY}px)`;
  } else if (motionType === 'zoom-in' || motionType === 'bounce') {
    const scale = spring({
      frame: localFrame,
      fps,
      config: { damping: 12, stiffness: 320, mass: 0.4 },
      from: 0.65,
      to: 1,
    });
    opacity = interpolate(localFrame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
    transform = `scale(${scale})`;
  } else if (motionType === 'glitch') {
    const glitchX = localFrame < 6 ? (localFrame % 2 === 0 ? 6 : -6) : 0;
    opacity = interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
    transform = `translateX(${glitchX}px)`;
  }

  const bottomOffset = '22%';

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 32,
    paddingRight: 32,
    zIndex: 30,
    pointerEvents: 'none',
    ...(position === 'top' && { top: 120 }),
    ...(position === 'center' && { top: '50%', transform: 'translateY(-50%)' }),
    ...(position === 'bottom' && { bottom: bottomOffset }),
  };

  return (
    <div style={containerStyle}>
      <div style={{ transform, opacity, maxWidth: '100%', ...customStyle }}>
        {children}
      </div>
    </div>
  );
};
