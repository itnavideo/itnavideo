import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface RetargetingPixelOverlayProps {
  pixelId?: string;
  audienceSize?: string;
  className?: string;
}

export const RetargetingPixelOverlay: React.FC<RetargetingPixelOverlayProps> = ({
  pixelId = 'PIXEL-8402-META',
  audienceSize = '42,800 Engaged Visitors',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          RETARGETING PIXEL AUDIENCE
        </span>
        <span className="text-white/40">{pixelId}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-blue-400">STATUS: PIXEL FIRING</span>
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
        </div>
        <div className="my-2">
          <div className="text-xs text-white/50 font-mono">CUSTOM AUDIENCE POOL:</div>
          <div className="text-lg font-bold font-mono text-white mt-0.5">{audienceSize}</div>
        </div>
        <div className="p-2 bg-black/40 rounded border border-white/10 text-[10px] font-mono text-white/60">
          EVENTS: ViewContent, InitiateCheckout, Lead
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>LOOKALIKE (1%): 2.4M PROFILES</span>
        <span>MATCH RATE: 89%</span>
      </div>
    </div>
  );
};
