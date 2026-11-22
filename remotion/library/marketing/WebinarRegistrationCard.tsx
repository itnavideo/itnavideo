import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface WebinarRegistrationCardProps {
  topic?: string;
  host?: string;
  datetime?: string;
  className?: string;
}

export const WebinarRegistrationCard: React.FC<WebinarRegistrationCardProps> = ({
  topic = 'Mastering Programmatic Remotion Cloud Video Renders',
  host = 'Itnavideo Engineering Team',
  datetime = 'Thursday, 6 PM EST',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30 flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>LIVE MASTERCLASS</span>
        </span>
        <span className="text-white/40">FREE ACCESS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="text-xs font-mono text-red-400 font-bold mb-1">{datetime}</div>
          <div className="text-sm font-bold text-white leading-snug">{topic}</div>
          <div className="text-xs text-white/50 mt-1">Presented by: {host}</div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span className="text-xs text-emerald-400 font-mono">SEATS: 87% CLAIMED</span>
          <button className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs shadow-lg">
            Reserve My Seat →
          </button>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>RECORDING SENT TO ALL REGISTRANTS</span>
        <span>LIVE Q&A INCLUDED</span>
      </div>
    </div>
  );
};
