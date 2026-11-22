import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleAnalyticsRetentionCohortProps {
  title?: string;
  [key: string]: any;
}

export const GoogleAnalyticsRetentionCohort: React.FC<GoogleAnalyticsRetentionCohortProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Weekly Retention Cohorts","cohorts":[{"week":"Oct 06 - Oct 12","size":"2,400","w0":"100%","w1":"42%","w2":"31%","w3":"26%"},{"week":"Oct 13 - Oct 19","size":"2,850","w0":"100%","w1":"45%","w2":"34%","w3":"29%"},{"week":"Oct 20 - Oct 26","size":"3,100","w0":"100%","w1":"48%","w2":"36%","w3":"-"}],"accentColor":"#34A853","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, cohorts, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#1F2023' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Google Sans, Roboto, sans-serif'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#9AA0A6' }}>User Loyalty & Churn Matrix by Signup Week</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 80px 1fr 1fr 1fr 1fr', fontSize: '11px', color: '#9AA0A6', paddingBottom: '6px' }}>
          <span>Cohort Week</span><span>Users</span><span>Week 0</span><span>Week 1</span><span>Week 2</span><span>Week 3</span>
        </div>
        {cohorts.map((c: any, idx: number) => (
          <div key={idx} style={{
            display: 'grid', gridTemplateColumns: '140px 80px 1fr 1fr 1fr 1fr', alignItems: 'center',
            background: theme === 'dark' ? '#292A2D' : '#F8F9FA', padding: '10px 12px', borderRadius: '6px', fontSize: '12px'
          }}>
            <span style={{ fontWeight: 600 }}>{c.week}</span>
            <span style={{ color: '#9AA0A6' }}>{c.size}</span>
            <span style={{ color: '#34A853', fontWeight: 700 }}>{c.w0}</span>
            <span style={{ color: '#34A853', fontWeight: 600 }}>{c.w1}</span>
            <span style={{ color: '#4285F4', fontWeight: 600 }}>{c.w2}</span>
            <span style={{ color: c.w3 === '-' ? '#9AA0A6' : '#FBBC05', fontWeight: 600 }}>{c.w3}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
