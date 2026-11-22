import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleSearchSERPResultProps {
  title?: string;
  [key: string]: any;
}

export const GoogleSearchSERPResult: React.FC<GoogleSearchSERPResultProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Itnavideo — AI Video Creation & Subtitle Engine","url":"https://itnavideo.com","breadcrumb":"itnavideo.com > tools > auto-caption","snippet":"Generate studio-quality vertical reels and subtitles in seconds. Automated Groq Whisper transcription with cloud 30fps rendering.","rating":4.9,"reviewsCount":1420,"sitelinks":["Auto Caption Reel","Compare Explainer","Pricing Plans","Remotion Cloud"],"accentColor":"#1A73E8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, url, breadcrumb, snippet, rating, reviewsCount, sitelinks, accentColor, theme } = merged;


  const linkHover = Math.sin(frame / 10) * 1;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#202124' : '#FFFFFF',
      color: theme === 'dark' ? '#BDC1C6' : '#4D5156',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Arial, Roboto, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#303134', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#4285F4"><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '13px', color: theme === 'dark' ? '#E8EAED' : '#202124', fontWeight: 600 }}>Itnavideo</span>
          <span style={{ fontSize: '11px', color: theme === 'dark' ? '#9AA0A6' : '#5F6368' }}>{breadcrumb}</span>
        </div>
      </div>
      <div style={{ fontSize: '18px', color: theme === 'dark' ? '#8AB4F8' : '#1A0DAB', fontWeight: 500, marginBottom: '6px', cursor: 'pointer' }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#F4B400', marginBottom: '6px' }}>
        <span>★★★★★</span>
        <span style={{ color: theme === 'dark' ? '#9AA0A6' : '#70757A' }}>Rating: {rating} • {reviewsCount} reviews</span>
      </div>
      <div style={{ fontSize: '13px', lineHeight: '1.5', color: theme === 'dark' ? '#BDC1C6' : '#4D5156', marginBottom: '14px' }}>
        {snippet}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {sitelinks.map((link: string, idx: number) => (
          <div key={idx} style={{ fontSize: '12px', color: theme === 'dark' ? '#8AB4F8' : '#1A0DAB', fontWeight: 500 }}>
            • {link}
          </div>
        ))}
      </div>
    </div>
  );
};
