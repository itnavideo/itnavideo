import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import '@fontsource/kalam/400.css'; 
import '@fontsource/kalam/700.css';

export const Scene = ({ title, subtitle, points }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ fps, frame, config: { damping: 12 } });

  return (
    <div 
      className="absolute inset-0 flex flex-col bg-white"
      style={{ fontFamily: '"Kalam", cursive' }}
    >
      <div 
        className="flex-1 flex flex-col items-center justify-center p-12 text-slate-800"
        style={{ opacity, transform: `scale(${scale})` }}
      >
        <h1 className="text-8xl font-bold mb-10 text-center border-b-8 border-blue-500 pb-4 inline-block">
          {title}
        </h1>
        
        {points && (
          <ul className="text-5xl space-y-6 mt-8">
            {points.map((point, index) => {
              const pointScale = spring({ fps, frame: frame - (index * 10), config: { damping: 12 } });
              return (
                <li key={index} className="flex items-center space-x-6" style={{ transform: `scale(${pointScale})` }}>
                  <span className="text-green-600 font-bold">☑</span>
                  <span>{point}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="h-48 bg-slate-50 border-t-4 border-dashed border-slate-300 flex items-center justify-center p-8">
        <p className="text-4xl text-center font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};