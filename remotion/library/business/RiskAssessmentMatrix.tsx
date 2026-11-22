import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface RiskAssessmentMatrixProps {
  topRisk?: string;
  mitigation?: string;
  className?: string;
}

export const RiskAssessmentMatrix: React.FC<RiskAssessmentMatrixProps> = ({
  topRisk = 'Third-Party Transcription API Outage',
  mitigation = 'Automatic fallback to Gemini 2.0 Flash in asia-south1',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          ENTERPRISE RISK MANAGEMENT
        </span>
        <span className="text-white/40">HEATMAP MATRIX</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
            HIGH SEVERITY
          </span>
          <span className="text-white/80 font-semibold">{topRisk}</span>
        </div>
        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/70 mt-2">
          <span className="text-emerald-400 font-bold font-mono">MITIGATION STRATEGY: </span>
          {mitigation}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>RESIDUAL RISK LEVEL: MINIMAL</span>
        <span>SLA COMPLIANCE: 99.9%</span>
      </div>
    </div>
  );
};
