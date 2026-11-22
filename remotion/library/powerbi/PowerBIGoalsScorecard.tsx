import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIGoalsScorecardProps {
  goalName?: string;
  statusBadge?: string;
  progressPercentage?: number;
}

export const PowerBIGoalsScorecard: React.FC<PowerBIGoalsScorecardProps> = (props) => {
  const {
    goalName = "Achieve Sub-2 Minute Remotion Cloud Render SLA",
    statusBadge = "On Track",
    progressPercentage = 94,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Power BI Metrics & Goals Scorecard</h3>
        <span style={{ backgroundColor: '#10b981', color: '#111', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
          {statusBadge}
        </span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 700 }}>{goalName}</div>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span>Progress towards Q4 Target:</span>
            <strong style={{ color: '#F2C811' }}>{progressPercentage}%</strong>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#0f172a', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `\%`, height: '100%', backgroundColor: '#F2C811' }} />
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Owner: Cloud Infrastructure & Rendering Squad</div>
      </div>
    </div>
  );
};
