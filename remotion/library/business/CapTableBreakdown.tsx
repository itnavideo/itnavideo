import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface CapTableBreakdownProps {
  stakeholders?: { name: string; share: number; color: string }[];
  className?: string;
}

export const CapTableBreakdown: React.FC<CapTableBreakdownProps> = ({
  stakeholders = [
    { name: 'Founding Team', share: 48, color: '#6366f1' },
    { name: 'Series A Investors', share: 28, color: '#3b82f6' },
    { name: 'Employee Option Pool (ESOP)', share: 16, color: '#10b981' },
    { name: 'Angel & Advisors', share: 8, color: '#f59e0b' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          CAPITALIZATION TABLE
        </span>
        <span className="text-white/40">FULLY DILUTED SHARES</span>
      </div>

      <div className="flex-1 my-4 flex flex-col justify-center space-y-3">
        <div className="w-full h-7 bg-zinc-900 rounded-lg overflow-hidden flex border border-white/10">
          {stakeholders.map((st, i) => {
            const width = interpolate(frame, [0, 30], [0, st.share], { extrapolateRight: 'clamp' });
            return (
              <div
                key={i}
                className="h-full flex items-center justify-center text-[10px] font-black text-white"
                style={{ width: width + '%', backgroundColor: st.color }}
              >
                {st.share > 10 ? st.share + '%' : ''}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {stakeholders.map((st, i) => (
            <div key={i} className="flex items-center space-x-2 text-xs">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color }} />
              <span className="text-white/80">{st.name}:</span>
              <span className="font-mono font-bold text-white">{st.share}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TOTAL AUTHORIZED SHARES: 10,000,000</span>
        <span>POST-MONEY ROUND</span>
      </div>
    </div>
  );
};
