import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleAdsROASTrackerProps {
  title?: string;
  [key: string]: any;
}

export const GoogleAdsROASTracker: React.FC<GoogleAdsROASTrackerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Target ROAS Performance","targetROAS":"380%","actualROAS":"462%","totalCost":"$4,120.00","convValue":"$19,034.40","status":"Target Exceeded (+82%)","accentColor":"#34A853","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, targetROAS, actualROAS, totalCost, convValue, status, accentColor, theme } = merged;


  const meterWidth = interpolate(frame, [0, 25], [0, 85], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#202124' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Google Sans, Roboto, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Conversion Value / Ad Spend Efficiency</div>
        </div>
        <span style={{ fontSize: '11px', background: '#34A85322', color: '#34A853', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>{status}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1, alignItems: 'center' }}>
        <div style={{ background: theme === 'dark' ? '#303134' : '#F8F9FA', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>ACTUAL ROAS</div>
          <div style={{ fontSize: '38px', fontWeight: 900, color: '#34A853', margin: '6px 0' }}>{actualROAS}</div>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Target Benchmark: {targetROAS}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: theme === 'dark' ? '#303134' : '#F8F9FA', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Total Conversion Value</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#34A853' }}>{convValue}</div>
          </div>
          <div style={{ background: theme === 'dark' ? '#303134' : '#F8F9FA', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Total Ad Spend</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#FBBC05' }}>{totalCost}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
