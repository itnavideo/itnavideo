import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIKeyInfluencersAIProps {
  targetMetric?: string;
  primaryInfluencer?: string;
  multiplierEffect?: string;
}

export const PowerBIKeyInfluencersAI: React.FC<PowerBIKeyInfluencersAIProps> = (props) => {
  const {
    targetMetric = "Customer Retention is High",
    primaryInfluencer = "Subscription Plan is Pro / Enterprise",
    multiplierEffect = "3.4x more likely",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Key Influencers (Machine Learning Visual)</h3>
        <span style={{ fontSize: '11px', color: '#F2C811' }}>Logistic Regression</span>
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
        <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
          What influences <strong>{targetMetric}</strong>?
        </div>

        {/* Primary Influencer Card */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '6px',
          padding: '16px',
          borderLeft: '4px solid #F2C811',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>TOP FACTOR</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{primaryInfluencer}</div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 900, color: '#F2C811' }}>
            {multiplierEffect}
          </div>
        </div>

        <div style={{ fontSize: '10px', color: '#94a3b8' }}>
          Calculated automatically using Azure ML algorithms over 150,000+ data points.
        </div>
      </div>
    </div>
  );
};
