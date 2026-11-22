import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleAdsAuctionInsightsProps {
  title?: string;
  [key: string]: any;
}

export const GoogleAdsAuctionInsights: React.FC<GoogleAdsAuctionInsightsProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Auction Insights Report","competitors":[{"domain":"You (Itnavideo)","imprShare":"64.2%","overlapRate":"-","outrankShare":"-","topOfPage":"88.4%"},{"domain":"CompetitorA.io","imprShare":"42.1%","overlapRate":"58.4%","outrankShare":"72.1%","topOfPage":"74.2%"},{"domain":"CompetitorB.com","imprShare":"31.5%","overlapRate":"41.2%","outrankShare":"84.6%","topOfPage":"61.0%"}],"accentColor":"#1A73E8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, competitors, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#202124' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Google Sans, Roboto, sans-serif'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Competitive Intelligence & SERP Ad Dominance</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', fontSize: '11px', color: '#9AA0A6', paddingBottom: '4px' }}>
          <span>Display Domain</span><span style={{ textAlign: 'right' }}>Impr. Share</span><span style={{ textAlign: 'right' }}>Overlap</span><span style={{ textAlign: 'right' }}>Outrank</span><span style={{ textAlign: 'right' }}>Top of Page</span>
        </div>
        {competitors.map((c: any, idx: number) => (
          <div key={idx} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', alignItems: 'center',
            background: theme === 'dark' ? '#303134' : '#F8F9FA', padding: '10px 14px', borderRadius: '6px', fontSize: '12px'
          }}>
            <span style={{ fontWeight: idx === 0 ? 800 : 500, color: idx === 0 ? '#4285F4' : (theme === 'dark' ? '#E8EAED' : '#202124') }}>{c.domain}</span>
            <span style={{ textAlign: 'right', fontWeight: 700 }}>{c.imprShare}</span>
            <span style={{ textAlign: 'right', color: '#9AA0A6' }}>{c.overlapRate}</span>
            <span style={{ textAlign: 'right', color: '#9AA0A6' }}>{c.outrankShare}</span>
            <span style={{ textAlign: 'right', color: '#34A853', fontWeight: 700 }}>{c.topOfPage}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
