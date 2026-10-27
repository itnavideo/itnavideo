import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import * as LucideIcons from 'lucide-react';
import { AnimatedSvgProps } from './SvgAnimatedArrow';

export interface AnimatedLucideProps extends AnimatedSvgProps {
  iconName: string;
}

export const AnimatedLucideIcon: React.FC<AnimatedLucideProps> = ({
  iconName,
  color = '#ffffff',
  strokeWidth = 2,
  size = 100,
  delay = 0,
  durationInFrames = 20,
  className = '',
  isThumbnail = false,
}) => {
  let frame = 100;
  let fps = 30;

  try {
    frame = useCurrentFrame();
    fps = useVideoConfig().fps;
  } catch (e) {
    // Fallback outside Remotion context
  }

  const rawProgress = isThumbnail ? 1 : interpolate(
    frame - delay,
    [0, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = isThumbnail ? 1 : spring({
    fps,
    frame: frame - delay,
    config: { damping: 12 },
    durationInFrames: 20
  });

  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Circle;

  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={className}>
      <div style={{ 
        width: '100%', 
        height: '100%', 
        transform: `scale(${scale})`, 
        opacity: scale > 0.05 ? 1 : 0,
        color: color
      }}>
        <IconComponent size={size} strokeWidth={strokeWidth} color={color} />
      </div>
    </div>
  );
};
