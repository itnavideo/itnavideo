import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ReporterNamePlateProps {
  reporterName?: string;
  location?: string;
  className?: string;
}

export const ReporterNamePlate: React.FC<ReporterNamePlateProps> = ({
  reporterName = 'DAVID CORTEZ',
  location = 'WASHINGTON BUREAU',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex flex-col font-mono shadow-2xl " + className}>
      <div className="bg-red-600 text-white font-bold text-[10px] px-3 py-0.5 uppercase tracking-widest inline-block self-start">
        LIVE CORRESPONDENT
      </div>
      <div className="bg-black/90 border border-white/20 px-4 py-2 text-white">
        <div className="text-lg font-black tracking-tight uppercase">{reporterName}</div>
        <div className="text-[10px] text-white/60 font-semibold">{location}</div>
      </div>
    </div>
  );
};
