import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StaggerAnimationProps {
  children: React.ReactNode[];
  staggerFrames?: number;
  delayFrames?: number;
  direction?: 'up' | 'down' | 'scale';
  style?: React.CSSProperties;
}

export const StaggerAnimation: React.FC<StaggerAnimationProps> = ({
  children,
  staggerFrames = 4,
  delayFrames = 0,
  direction = 'up',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: 'contents', ...style }}>
      {React.Children.map(children, (child, idx) => {
        const itemSpring = spring({
          frame: Math.max(0, frame - delayFrames - idx * staggerFrames),
          fps,
          config: { damping: 14, stiffness: 95 },
        });

        const translateY = direction === 'up' ? (1 - itemSpring) * 20 : direction === 'down' ? (1 - itemSpring) * -20 : 0;
        const scale = direction === 'scale' ? itemSpring : 1;

        return (
          <div
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity: itemSpring,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
