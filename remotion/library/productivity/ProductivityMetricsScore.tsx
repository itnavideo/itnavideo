import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface ProductivityMetricsScoreProps {
  title?: string;
  [key: string]: any;
}

export const ProductivityMetricsScore: React.FC<ProductivityMetricsScoreProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Weekly Productivity Pulse","score":94,"focusHours":28.5,"meetingHours":6.2,"efficiencyTrend":"+14% vs last week","benchmarkPercentile":"Top 5%","accentColor":"#8B5CF6","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, score, focusHours, meetingHours, efficiencyTrend, benchmarkPercentile, accentColor, theme } = merged;


  const gaugeAnim = interpolate(frame, [0, 25], [0, 94], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F0D1C' : '#FAF5FF',
      color: theme === 'dark' ? '#F5F3FF' : '#2E1065',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#8B5CF6' }}>Benchmark: {benchmarkPercentile} of Tech Orgs</div>
        </div>
        <span style={{ fontSize: '11px', color: '#10B981', background: '#10B98122', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
          {efficiencyTrend}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', flex: 1, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? '#1A1633' : '#F3E8FF', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '42px', fontWeight: 900, color: '#8B5CF6' }}>{Math.round(gaugeAnim)}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>EFFICIENCY SCORE</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: theme === 'dark' ? '#1A1633' : '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #8B5CF633' }}>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Deep Focus Time</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981' }}>{focusHours} hrs / week</div>
          </div>
          <div style={{ background: theme === 'dark' ? '#1A1633' : '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #8B5CF633' }}>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Meeting Overhead</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#F59E0B' }}>{meetingHours} hrs (Minimal)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
