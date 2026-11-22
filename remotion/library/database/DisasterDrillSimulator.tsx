import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DisasterDrillSimulatorProps {
  drillScenario?: string;
  simulatedFault?: string;
  automatedRecoverySuccess?: boolean;
  scorePercent?: number;
  className?: string;
}

export const DisasterDrillSimulator: React.FC<DisasterDrillSimulatorProps> = ({
  drillScenario = "SCENARIO_AZ_TOTAL_POWER_LOSS",
  simulatedFault = "SIGKILL on Primary & Network Blackhole",
  automatedRecoverySuccess = true,
  scorePercent = 98.5,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            DISASTER RECOVERY DRILL SIMULATOR
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/20 font-bold">
          CHAOS TEST
        </span>
      </div>

      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 font-mono text-xs mb-3">
        <div className="text-[10px] text-purple-300 uppercase font-bold mb-1">Scenario: {drillScenario}</div>
        <code className="text-zinc-300">{simulatedFault}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Automation Result</div>
          <div className="text-emerald-400 font-bold mt-0.5">PASSED (Zero Human Touch)</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Resilience Readiness</div>
          <div className="text-purple-300 font-bold mt-0.5">{scorePercent}% Score</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Runbook Validated</span>
        <span className="text-emerald-400 font-bold">SOC2 / ISO 27001 Certified</span>
      </div>
    </div>
  );
};
