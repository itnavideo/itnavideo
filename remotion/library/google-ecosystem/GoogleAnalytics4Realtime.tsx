import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleAnalytics4RealtimeProps {
  title?: string;
  [key: string]: any;
}

export const GoogleAnalytics4Realtime: React.FC<GoogleAnalytics4RealtimeProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Realtime Overview (GA4)","activeUsers":842,"minutesWindow":30,"devices":[{"type":"Mobile","pct":68,"color":"#4285F4"},{"type":"Desktop","pct":28,"color":"#34A853"},{"type":"Tablet","pct":4,"color":"#FBBC05"}],"topCountries":["United States (310)","India (215)","United Kingdom (84)","Germany (52)"],"accentColor":"#F57C00","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, activeUsers, minutesWindow, devices, topCountries, accentColor, theme } = merged;


  const pulse = Math.sin(frame / 8) * 0.08 + 1;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#1F2023' : '#F8F9FA',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Google Sans, Roboto, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Users in last {minutesWindow} minutes</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34A853', transform: `scale(${pulse})` }} />
          <span style={{ fontSize: '11px', color: '#34A853', fontWeight: 700 }}>LIVE</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#292A2D' : '#FFFFFF', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '38px', fontWeight: 900, color: '#4285F4' }}>{activeUsers}</div>
          <div style={{ fontSize: '11px', color: '#9AA0A6', marginTop: '4px' }}>Users active per minute</div>
          <div style={{ display: 'flex', gap: '4px', height: '36px', alignItems: 'flex-end', marginTop: '14px' }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ flex: 1, background: '#4285F4', height: `${20 + (i % 7) * 12}%`, borderRadius: '2px 2px 0 0' }} />
            ))}
          </div>
        </div>
        <div style={{ background: theme === 'dark' ? '#292A2D' : '#FFFFFF', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>Device Breakdown</div>
            {devices.map((d: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span style={{ color: d.color, fontWeight: 600 }}>• {d.type}</span>
                <span style={{ fontWeight: 700 }}>{d.pct}%</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#9AA0A6', borderTop: '1px solid ' + (theme === 'dark' ? '#3C4043' : '#E8EAED'), paddingTop: '8px' }}>
              Top: {topCountries[0]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
