import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CameraZoomProps {
  children: React.ReactNode;
  fromZoom?: number;
  toZoom?: number;
  mode?: 'ken-burns' | 'punch-in';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const CameraZoom: React.FC<CameraZoomProps> = ({
  children,
  fromZoom = 1.0,
  toZoom = 1.15,
  mode = 'ken-burns',
  delayFrames = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  let zoom = fromZoom;

  if (mode === 'ken-burns') {
    // Smooth cinematic continuous zoom over entire clip
    const progress = Math.min(1, Math.max(0, (frame - delayFrames) / (durationInFrames || 1)));
    zoom = interpolate(progress, [0, 1], [fromZoom, toZoom]);
  } else {
    // Sudden punch-in spring (viral retention pattern interrupt)
    const punchSpring = spring({
      frame: Math.max(0, frame - delayFrames),
      fps,
      config: { damping: 12, stiffness: 120 },
    });
    zoom = interpolate(punchSpring, [0, 1], [fromZoom, toZoom]);
  }

  return (
    <div
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'center center',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
