import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleSearchKnowledgePanelProps {
  title?: string;
  [key: string]: any;
}

export const GoogleSearchKnowledgePanel: React.FC<GoogleSearchKnowledgePanelProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Itnavideo Platform","entityType":"Software company","verified":true,"description":"Itnavideo is an enterprise cloud video automation suite utilizing serverless AWS Lambda Remotion rendering and speech transcription.","attributes":[{"label":"Founded","value":"2024"},{"label":"Headquarters","value":"San Francisco, CA"},{"label":"Engine","value":"AWS Lambda Remotion 30fps"}],"socials":["YouTube","X (Twitter)","GitHub","LinkedIn"],"accentColor":"#1A73E8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, entityType, verified, description, attributes, socials, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#171717' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Roboto, Arial, sans-serif',
      border: '1px solid ' + (theme === 'dark' ? '#303134' : '#DADCE0'), borderRadius: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ fontSize: '20px', fontWeight: 700 }}>{title}</div>
        {verified && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#1A73E8', background: '#1A73E822', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
            ✓ Verified
          </div>
        )}
      </div>
      <div style={{ fontSize: '12px', color: '#9AA0A6', marginBottom: '12px' }}>{entityType}</div>
      <div style={{ fontSize: '12px', lineHeight: '1.5', color: theme === 'dark' ? '#BDC1C6' : '#3C4043', marginBottom: '16px', borderBottom: '1px solid ' + (theme === 'dark' ? '#303134' : '#E8EAED'), paddingBottom: '12px' }}>
        {description}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
        {attributes.map((attr: any, idx: number) => (
          <div key={idx} style={{ fontSize: '12px', display: 'flex' }}>
            <span style={{ fontWeight: 700, width: '120px', color: theme === 'dark' ? '#E8EAED' : '#202124' }}>{attr.label}:</span>
            <span style={{ color: theme === 'dark' ? '#BDC1C6' : '#5F6368' }}>{attr.value}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        {socials.map((s: string, idx: number) => (
          <span key={idx} style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '12px', background: theme === 'dark' ? '#303134' : '#F1F3F4', color: theme === 'dark' ? '#8AB4F8' : '#1A73E8', fontWeight: 600 }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};
