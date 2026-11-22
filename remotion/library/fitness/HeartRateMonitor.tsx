import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HeartRateMonitorProps {
  bpm?: number;
  zone?: 'WARM UP' | 'FAT BURN' | 'CARDIO' | 'PEAK';
  caloriesPerHour?: number;
  className?: string;
}

export const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({
  bpm = 158,
  zone = 'CARDIO',
  caloriesPerHour = 640,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Heart beat pulse rhythm
  const beat = (frame * (bpm / 60) * 0.5) % 1;
  const heartScale = 1 + Math.sin(beat * Math.PI) * 0.2;

  // Moving ECG pulse line
  const ecgOffset = (frame * 3) % 200;

  const zoneColors = {
    'WARM UP': '#38bdf8',
    'FAT BURN': '#34d399',
    CARDIO: '#f59e0b',
    PEAK: '#ef4444',
  }[zone];

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-4 px-5 py-3.5 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(15, 12, 14, 0.95)',
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px ${zoneColors}25`,
        }}
      >
        {/* Pulsing Heart Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-rose-500/30 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(225,29,72,0.4))',
            transform: `scale(${heartScale})`,
          }}
        >
          <svg className="w-6 h-6 text-rose-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* BPM Numbers */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white tracking-tight">{bpm}</span>
            <span className="text-zinc-500 text-xs font-bold">BPM</span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
              style={{ backgroundColor: `${zoneColors}25`, color: zoneColors }}
            >
              {zone}
            </span>
            <span className="text-[11px] text-zinc-400">{caloriesPerHour} kcal/h</span>
          </div>
        </div>

        {/* Mini ECG Graph Waveform */}
        <div className="w-24 h-9 overflow-hidden relative opacity-70 border-l border-white/10 pl-3">
          <svg className="w-48 h-full" viewBox="0 0 200 40" style={{ transform: `translateX(-${ecgOffset}px)` }}>
            <path
              d="M0,20 L40,20 L50,5 L55,35 L60,10 L65,25 L75,20 L120,20 L130,5 L135,35 L140,10 L145,25 L155,20 L200,20"
              fill="none"
              stroke={zoneColors}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
