import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NewsTickerProps {
  category?: string;
  items?: string[];
  speed?: number;
  className?: string;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({
  category = 'GLOBAL HEADLINES',
  items = [
    'Tech Markets Rally as Autonomous AI Adoption Surges 40%',
    'Renewable Energy Grid Reaches 65% Capacity Milestone',
    'Global Aerospace Summit Unveils Next-Gen Electric Aircraft',
    'Major Scientific Breakthrough in Ambient Superconductivity',
  ],
  speed = 2,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const text = items.join('   •   ');
  const offset = (frame * speed) % 1200;

  return (
    <div className={"w-full flex items-center bg-black/90 border-y border-white/10 font-mono text-xs overflow-hidden select-none " + className} style={{ height: '38px' }}>
      <div className="bg-red-600 text-white font-black px-4 py-2 z-10 flex items-center space-x-1.5 shadow-md">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="tracking-wider uppercase">{category}</span>
      </div>
      <div className="flex-1 overflow-hidden whitespace-nowrap relative">
        <div
          className="inline-block text-white/90 font-medium pl-6"
          style={{ transform: "translateX(-" + offset + "px)" }}
        >
          {text}   •   {text}
        </div>
      </div>
    </div>
  );
};
