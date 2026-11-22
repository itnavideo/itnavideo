import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface SearchConsoleQueryRankingsProps {
  title?: string;
  [key: string]: any;
}

export const SearchConsoleQueryRankings: React.FC<SearchConsoleQueryRankingsProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Top Organic Queries","queries":[{"query":"ai auto caption video generator","clicks":18400,"impr":142000,"pos":2.1},{"query":"faceless shorts maker","clicks":12900,"impr":98000,"pos":3.4},{"query":"remotion lambda cloud render","clicks":9400,"impr":61000,"pos":1.8},{"query":"youtube subtitle generator free","clicks":8200,"impr":85000,"pos":4.2}],"accentColor":"#1A73E8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, queries, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#202124' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Roboto, Arial, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
        <span style={{ fontSize: '11px', color: '#9AA0A6' }}>Top 4 Queries by Clicks</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', fontSize: '11px', color: '#9AA0A6', paddingBottom: '4px' }}>
          <span>Search Query</span><span style={{ textAlign: 'right' }}>Clicks</span><span style={{ textAlign: 'right' }}>Impressions</span><span style={{ textAlign: 'right' }}>Position</span>
        </div>
        {queries.map((q: any, idx: number) => (
          <div key={idx} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center',
            background: theme === 'dark' ? '#303134' : '#F8F9FA', padding: '10px 14px', borderRadius: '6px', fontSize: '12px'
          }}>
            <span style={{ fontWeight: 600, color: theme === 'dark' ? '#8AB4F8' : '#1A73E8' }}>{q.query}</span>
            <span style={{ textAlign: 'right', fontWeight: 700 }}>{q.clicks.toLocaleString()}</span>
            <span style={{ textAlign: 'right', color: '#9AA0A6' }}>{q.impr.toLocaleString()}</span>
            <span style={{ textAlign: 'right', fontWeight: 800, color: '#34A853' }}>#{q.pos}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
