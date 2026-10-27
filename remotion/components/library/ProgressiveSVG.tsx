import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const ProgressiveSVG: React.FC<{ 
  src: string; 
  durationInFrames?: number; 
  strokeColor?: string; 
  strokeWidth?: number;
}> = ({ 
  src, 
  durationInFrames = 60,
  strokeColor = '#333',
  strokeWidth = 2
}) => {
  const frame = useCurrentFrame();
  
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          opacity,
          transform: `scale(${scale})`,
          maskImage: `linear-gradient(to right, black ${progress * 100}%, transparent ${progress * 100}%)`,
          WebkitMaskImage: `linear-gradient(to right, black ${progress * 100}%, transparent ${progress * 100}%)`,
        }}
      >
        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="SVG Illustration" />
      </div>
    </div>
  );
};
