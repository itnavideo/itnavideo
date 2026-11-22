import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface SearchConsoleCoreWebVitalsProps {
  title?: string;
  [key: string]: any;
}

export const SearchConsoleCoreWebVitals: React.FC<SearchConsoleCoreWebVitalsProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Core Web Vitals Assessment","device":"Mobile","metrics":[{"name":"LCP (Largest Contentful Paint)","val":"1.4s","status":"Good","color":"#34A853"},{"name":"INP (Interaction to Next Paint)","val":"85ms","status":"Good","color":"#34A853"},{"name":"CLS (Cumulative Layout Shift)","val":"0.02","status":"Good","color":"#34A853"}],"overallStatus":"Passed","accentColor":"#34A853","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, device, metrics, overallStatus, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#202124' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Roboto, Arial, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Real-User Chrome UX Report ({device})</div>
        </div>
        <span style={{ fontSize: '11px', background: '#34A85322', color: '#34A853', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
          ✓ {overallStatus}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', flex: 1 }}>
        {metrics.map((m: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#303134' : '#F8F9FA',
            borderRadius: '10px', padding: '16px', borderTop: `4px solid ${m.color}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '11px', color: '#9AA0A6' }}>{m.name}</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: m.color, margin: '10px 0' }}>{m.val}</div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: m.color, background: `${m.color}22`, padding: '2px 8px', borderRadius: '4px', width: 'fit-content' }}>
              ✓ {m.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
