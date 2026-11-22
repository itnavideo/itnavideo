import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleAdsCampaignOverviewProps {
  title?: string;
  [key: string]: any;
}

export const GoogleAdsCampaignOverview: React.FC<GoogleAdsCampaignOverviewProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Search — High Intent Reels SaaS","budget":"$150.00 / day","impressions":"42,800","clicks":"2,640","cpc":"$0.84","cost":"$2,217.60","conversions":218,"costPerConv":"$10.17","accentColor":"#1A73E8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, budget, impressions, clicks, cpc, cost, conversions, costPerConv, accentColor, theme } = merged;


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
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Budget: {budget} • Status: Eligible (Active)</div>
        </div>
        <span style={{ fontSize: '11px', background: '#34A85322', color: '#34A853', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Running</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#303134' : '#F8F9FA', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Clicks / Impr</div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{clicks}</div>
          <div style={{ fontSize: '10px', color: '#9AA0A6', marginTop: '2px' }}>{impressions} views</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#303134' : '#F8F9FA', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Avg. CPC</div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', color: '#4285F4' }}>{cpc}</div>
          <div style={{ fontSize: '10px', color: '#9AA0A6', marginTop: '2px' }}>Cost: {cost}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#303134' : '#F8F9FA', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Conversions</div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', color: '#34A853' }}>{conversions}</div>
          <div style={{ fontSize: '10px', color: '#9AA0A6', marginTop: '2px' }}>8.25% Conv. rate</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#303134' : '#F8F9FA', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Cost / conv.</div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', color: '#FBBC05' }}>{costPerConv}</div>
          <div style={{ fontSize: '10px', color: '#34A853', marginTop: '2px' }}>Target: $12.00</div>
        </div>
      </div>
    </div>
  );
};
