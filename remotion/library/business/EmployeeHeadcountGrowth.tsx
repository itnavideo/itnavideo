import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface EmployeeHeadcountGrowthProps {
  currentFte?: number;
  openRoles?: number;
  className?: string;
}

export const EmployeeHeadcountGrowth: React.FC<EmployeeHeadcountGrowthProps> = ({
  currentFte = 142,
  openRoles = 18,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          TALENT & HEADCOUNT TRAJECTORY
        </span>
        <span className="text-white/40">HR CAPACITY</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3">
        <div className="text-4xl font-extrabold font-mono text-teal-300">{currentFte} FTE</div>
        <div className="text-xs text-white/60">Across San Francisco, London, and Tokyo hubs</div>
        <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono">
          +{openRoles} ACTIVE ROLES OPEN
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>RETENTION RATE: 96%</span>
        <span>REVENUE PER EMPLOYEE: $128K</span>
      </div>
    </div>
  );
};
