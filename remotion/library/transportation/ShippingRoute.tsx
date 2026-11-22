import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface ShippingRouteProps {
  laneName?: string;
  originPort?: string;
  destinationPort?: string;
  nauticalMiles?: string;
  vesselName?: string;
  className?: string;
}

export const ShippingRoute: React.FC<ShippingRouteProps> = ({
  laneName = 'MARITIME SILK ROAD (SUEZ TRUNK)',
  originPort = 'SHANGHAI PORT (CNSHA)',
  destinationPort = 'ROTTERDAM (NLRTM)',
  nauticalMiles = '10,500 NM',
  vesselName = 'M/V ITNA EXPRESS (20,000 TEU)',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            OCEAN LOGISTICS ROUTE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {laneName}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-bold">{nauticalMiles}</span>
      </div>

      {/* Sea Route Map Graphic */}
      <div className="relative w-full aspect-[16/7] bg-[#0a1120] border border-zinc-800 rounded-xl overflow-hidden p-6 flex items-center justify-center">
        {/* Ocean Waves Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />

        {/* Maritime Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 100 120 Q 250 160 400 90 T 650 110"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="6 3"
            style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}
          />
        </svg>

        {/* Vessel Badge */}
        <div className="bg-zinc-900/90 border border-emerald-500/80 px-4 py-2 rounded-xl z-20 text-center shadow-xl">
          <div className="text-xs font-mono font-bold text-zinc-100">🚢 {vesselName}</div>
          <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
            {originPort} ➔ {destinationPort}
          </div>
        </div>
      </div>
    </div>
  );
};
