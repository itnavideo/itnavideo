import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleAdsQualityScoreMetricProps {
  title?: string;
  [key: string]: any;
}

export const GoogleAdsQualityScoreMetric: React.FC<GoogleAdsQualityScoreMetricProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Keyword Quality Score: 9/10","keyword":"\"ai video creation software\"","factors":[{"name":"Expected CTR","grade":"Above Average","color":"#34A853"},{"name":"Ad Relevance","grade":"Above Average","color":"#34A853"},{"name":"Landing Page Experience","grade":"Average","color":"#FBBC05"}],"score":9,"accentColor":"#34A853","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, keyword, factors, score, accentColor, theme } = merged;


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
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Keyword: {keyword}</div>
        </div>
        <div style={{ fontSize: '22px', fontWeight: 900, color: '#34A853' }}>{score} / 10</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {factors.map((f: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#303134' : '#F8F9FA',
            borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderLeft: `4px solid ${f.color}`
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{f.name}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: f.color }}>{f.grade}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
