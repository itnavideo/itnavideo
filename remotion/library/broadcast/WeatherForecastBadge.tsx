import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WeatherForecastBadgeProps {
  city?: string;
  temperatureC?: number;
  condition?: string;
  humidity?: string;
  windSpeed?: string;
  className?: string;
}

export const WeatherForecastBadge: React.FC<WeatherForecastBadgeProps> = ({
  city = 'SAN FRANCISCO',
  temperatureC = 22,
  condition = 'SUNNY & CLEAR',
  humidity = '54%',
  windSpeed = '12 km/h',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const sunRotate = (frame * 1.5) % 360;

  return (
    <div
      className={`p-3 flex items-center font-mono pointer-events-none ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 16, 24, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(251, 191, 36, 0.15)',
        }}
      >
        {/* Animated Sun Icon */}
        <div
          className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0"
          style={{ transform: `rotate(${sunRotate}deg)` }}
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
          </svg>
        </div>

        {/* City & Temperature */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{temperatureC}°C</span>
            <span className="text-zinc-500 text-xs">/ {Math.round(temperatureC * 1.8 + 32)}°F</span>
          </div>
          <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
            {city} • {condition}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
            <span>💧 {humidity}</span>
            <span>•</span>
            <span>💨 {windSpeed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
