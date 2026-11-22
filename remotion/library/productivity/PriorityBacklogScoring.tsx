import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface PriorityBacklogScoringProps {
  title?: string;
  [key: string]: any;
}

export const PriorityBacklogScoring: React.FC<PriorityBacklogScoringProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"RICE Prioritization Matrix","features":[{"name":"Lambda Cloud Render v2","reach":80,"impact":90,"conf":85,"effort":30,"score":204},{"name":"Auto-Subtitles Dual Tab","reach":95,"impact":85,"conf":90,"effort":40,"score":182},{"name":"AI Voice Cloning Studio","reach":60,"impact":75,"conf":70,"effort":50,"score":63}],"accentColor":"#F59E0B","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, features, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#161106' : '#FFFBEB',
      color: theme === 'dark' ? '#FEF3C7' : '#78350F',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#F59E0B' }}>Score = (Reach × Impact × Confidence) / Effort</div>
        </div>
        <span style={{ fontSize: '11px', background: '#F59E0B22', color: '#F59E0B', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>RICE Model</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {features.map((f: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#271D0B' : '#FFFFFF',
            borderRadius: '8px', padding: '12px 16px', border: '1px solid #F59E0B44',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{f.name}</div>
              <div style={{ fontSize: '10px', color: '#A16207', marginTop: '2px' }}>
                R: {f.reach} • I: {f.impact} • C: {f.conf}% • E: {f.effort}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#F59E0B' }}>{f.score}</div>
              <div style={{ fontSize: '9px', color: '#A16207' }}>Rank #{idx + 1}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
