import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DateRangePickerVisualizerProps {
  startDate?: string;
  endDate?: string;
  durationNights?: number;
  className?: string;
}

export const DateRangePickerVisualizer: React.FC<DateRangePickerVisualizerProps> = ({
  startDate = 'NOV 22',
  endDate = 'NOV 29',
  durationNights = 7,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-80 bg-zinc-950 border border-white/10 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="text-[10px] text-emerald-400 font-bold mb-2 uppercase tracking-wider">SELECTED DATE RANGE</div>
      <div className="flex items-center justify-between border-y border-white/10 py-3 mb-2">
        <div>
          <div className="text-[10px] text-white/40">CHECK-IN</div>
          <div className="text-lg font-black text-white">{startDate}</div>
        </div>
        <span className="text-emerald-400 font-bold text-lg">➔</span>
        <div className="text-right">
          <div className="text-[10px] text-white/40">CHECK-OUT</div>
          <div className="text-lg font-black text-white">{endDate}</div>
        </div>
      </div>
      <div className="text-xs text-white/50 text-center font-bold">
        {durationNights} NIGHTS RESERVATION
      </div>
    </div>
  );
};
