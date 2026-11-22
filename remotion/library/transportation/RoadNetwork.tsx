import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface RoadNetworkProps {
  corridorName?: string;
  totalDistance?: string;
  speedLimit?: string;
  interchanges?: string[];
  className?: string;
}

export const RoadNetwork: React.FC<RoadNetworkProps> = ({
  corridorName = 'INTERSTATE 95 NORTHEAST CORRIDOR',
  totalDistance = '485 MILES (780 KM)',
  speedLimit = '65 MPH (105 KM/H)',
  interchanges = ['WASHINGTON D.C.', 'BALTIMORE', 'PHILADELPHIA', 'NEW YORK', 'BOSTON'],
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
          <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            HIGHWAY TRANSPORT NETWORK
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {corridorName}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-bold">{totalDistance}</span>
      </div>

      {/* Highway Artery Nodes */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3">
          <span className="text-zinc-500">POSTED SPEED LIMIT</span>
          <span className="text-amber-400 font-bold">{speedLimit}</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-zinc-500 text-[10px] uppercase block mb-3">KEY ARTERIAL EXITS</span>
          <div className="flex flex-wrap gap-2">
            {interchanges.map((exit, idx) => (
              <span
                key={idx}
                className="bg-zinc-950 border border-zinc-700 text-zinc-200 px-3 py-1 rounded font-bold"
              >
                EXIT 0{idx + 1}: {exit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
