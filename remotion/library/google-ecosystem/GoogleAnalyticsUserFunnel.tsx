import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleAnalyticsUserFunnelProps {
  title?: string;
  [key: string]: any;
}

export const GoogleAnalyticsUserFunnel: React.FC<GoogleAnalyticsUserFunnelProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"E-commerce Purchase Funnel","steps":[{"name":"1. Session Start","users":12500,"drop":"0%"},{"name":"2. View Product","users":7800,"drop":"-37.6%"},{"name":"3. Add to Cart","users":3400,"drop":"-56.4%"},{"name":"4. Completed Purchase","users":1120,"drop":"-67.1%"}],"conversionRate":"8.96%","accentColor":"#4285F4","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, steps, conversionRate, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#1F2023' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Google Sans, Roboto, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>User Drop-off & Conversion Rate Flow</div>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#34A853' }}>{conversionRate} Overall CR</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        {steps.map((s: any, idx: number) => {
          const widthPct = Math.max(25, (s.users / steps[0].users) * 100);
          return (
            <div key={idx} style={{
              flex: 1, height: '100%', background: theme === 'dark' ? '#292A2D' : '#F1F3F4',
              borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              borderTop: `4px solid ${idx === steps.length - 1 ? '#34A853' : '#4285F4'}`
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: '18px', fontWeight: 900, marginTop: '6px' }}>{s.users.toLocaleString()}</div>
              </div>
              <div style={{ fontSize: '11px', color: idx === 0 ? '#34A853' : '#EA4335', fontWeight: 600 }}>
                {s.drop}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
