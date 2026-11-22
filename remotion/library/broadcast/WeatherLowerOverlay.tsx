import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface WeatherLowerOverlayProps {
  city?: string;
  currentTemp?: string;
  forecast?: { day: string; icon: string; high: string; low: string }[];
  className?: string;
}

export const WeatherLowerOverlay: React.FC<WeatherLowerOverlayProps> = ({
  city = 'SAN FRANCISCO',
  currentTemp = '68°F',
  forecast = [
    { day: 'MON', icon: '☀️', high: '72°', low: '54°' },
    { day: 'TUE', icon: '⛅', high: '69°', low: '52°' },
    { day: 'WED', icon: '🌧️', high: '61°', low: '49°' },
    { day: 'THU', icon: '🌤️', high: '65°', low: '50°' },
    { day: 'FRI', icon: '☀️', high: '74°', low: '55°' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full bg-zinc-950/90 border border-white/10 p-3 rounded-xl font-mono text-white flex items-center justify-between shadow-2xl " + className}>
      <div className="flex items-center space-x-3 border-r border-white/10 pr-4">
        <div>
          <div className="text-[10px] text-white/50">{city}</div>
          <div className="text-2xl font-black text-sky-400">{currentTemp}</div>
        </div>
      </div>
      <div className="flex-1 flex justify-around pl-4">
        {forecast.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <span className="text-[10px] text-white/50 font-bold">{f.day}</span>
            <span className="text-base my-0.5">{f.icon}</span>
            <span className="text-[10px] font-bold text-white">{f.high} / <span className="text-white/40">{f.low}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};
