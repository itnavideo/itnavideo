import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface SearchConsolePerformanceClicksProps {
  title?: string;
  [key: string]: any;
}

export const SearchConsolePerformanceClicks: React.FC<SearchConsolePerformanceClicksProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"GSC Search Performance","totalClicks":"148K","totalImpressions":"3.2M","averageCTR":"4.6%","averagePosition":"8.4","accentColor":"#4285F4","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, totalClicks, totalImpressions, averageCTR, averagePosition, accentColor, theme } = merged;


  const wave = Math.sin(frame / 12) * 4;
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
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Performance on Search results (Last 3 months)</div>
        </div>
        <span style={{ fontSize: '11px', background: '#4285F422', color: '#8AB4F8', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>Web Search</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#303134' : '#F1F3F4', borderRadius: '8px', padding: '14px', borderTop: '4px solid #4285F4' }}>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Total clicks</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#4285F4', marginTop: '6px' }}>{totalClicks}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#303134' : '#F1F3F4', borderRadius: '8px', padding: '14px', borderTop: '4px solid #8E24AA' }}>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Total impressions</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#BA68C8', marginTop: '6px' }}>{totalImpressions}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#303134' : '#F1F3F4', borderRadius: '8px', padding: '14px', borderTop: '4px solid #00897B' }}>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Average CTR</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#26A69A', marginTop: '6px' }}>{averageCTR}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#303134' : '#F1F3F4', borderRadius: '8px', padding: '14px', borderTop: '4px solid #E65100' }}>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Average position</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFB74D', marginTop: '6px' }}>{averagePosition}</div>
        </div>
      </div>
    </div>
  );
};
