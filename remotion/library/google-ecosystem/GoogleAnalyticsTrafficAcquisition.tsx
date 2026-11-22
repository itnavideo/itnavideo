import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleAnalyticsTrafficAcquisitionProps {
  title?: string;
  [key: string]: any;
}

export const GoogleAnalyticsTrafficAcquisition: React.FC<GoogleAnalyticsTrafficAcquisitionProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Traffic Acquisition Channels","channels":[{"channel":"Organic Search","sessions":48200,"users":39100,"convRate":"4.8%"},{"channel":"Direct","sessions":22400,"users":18200,"convRate":"3.9%"},{"channel":"Paid Search (Ads)","sessions":19100,"users":16400,"convRate":"6.2%"},{"channel":"Organic Social","sessions":8500,"users":7100,"convRate":"2.1%"}],"totalSessions":98200,"accentColor":"#4285F4","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, channels, totalSessions, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#1F2023' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Google Sans, Roboto, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Session Default Channel Group</div>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#4285F4' }}>{totalSessions.toLocaleString()} Sessions</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {channels.map((ch: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#292A2D' : '#F8F9FA',
            borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{ch.channel}</div>
              <div style={{ fontSize: '11px', color: '#9AA0A6', marginTop: '2px' }}>{ch.sessions.toLocaleString()} sessions • {ch.users.toLocaleString()} users</div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#34A853' }}>{ch.convRate} CR</span>
          </div>
        ))}
      </div>
    </div>
  );
};
