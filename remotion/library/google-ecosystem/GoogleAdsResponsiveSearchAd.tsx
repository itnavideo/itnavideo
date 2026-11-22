import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleAdsResponsiveSearchAdProps {
  title?: string;
  [key: string]: any;
}

export const GoogleAdsResponsiveSearchAd: React.FC<GoogleAdsResponsiveSearchAdProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Responsive Search Ad Preview","headlines":["AI Video Creator 1080p","Auto Subtitles In 30 Seconds","Render Fast on Cloud Lambda"],"descriptions":["Turn audio and voiceovers into high-retention vertical reels automatically. 100% cloud rendering.","No manual editing required. Try our free auto caption generator today."],"adStrength":"Excellent","accentColor":"#1A73E8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, headlines, descriptions, adStrength, accentColor, theme } = merged;


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
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Google Search Ad Preview (Sponsored)</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#9AA0A6' }}>Ad strength:</span>
          <span style={{ fontSize: '11px', background: '#34A85322', color: '#34A853', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{adStrength}</span>
        </div>
      </div>
      <div style={{
        background: theme === 'dark' ? '#303134' : '#F8F9FA',
        borderRadius: '10px', padding: '16px', border: '1px solid ' + (theme === 'dark' ? '#3C4043' : '#DADCE0')
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginBottom: '6px' }}>
          <span style={{ fontWeight: 700, color: theme === 'dark' ? '#E8EAED' : '#202124' }}>Sponsored</span>
          <span style={{ color: '#9AA0A6' }}>• https://itnavideo.com/ai-reels</span>
        </div>
        <div style={{ fontSize: '17px', color: theme === 'dark' ? '#8AB4F8' : '#1A0DAB', fontWeight: 500, marginBottom: '6px' }}>
          {headlines.join(' | ')}
        </div>
        <div style={{ fontSize: '12px', lineHeight: '1.5', color: theme === 'dark' ? '#BDC1C6' : '#4D5156' }}>
          {descriptions.join(' ')}
        </div>
      </div>
    </div>
  );
};
