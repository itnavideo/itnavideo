import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleSearchAutocompleteProps {
  title?: string;
  [key: string]: any;
}

export const GoogleSearchAutocomplete: React.FC<GoogleSearchAutocompleteProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Google Search Bar","typedQuery":"how to create ai viral shorts","suggestions":["how to create ai viral shorts with captions","how to create ai viral shorts free without watermark","how to create ai viral shorts on remotion lambda","how to create ai viral shorts for youtube and tiktok"],"accentColor":"#4285F4","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, typedQuery, suggestions, accentColor, theme } = merged;


  const textLen = Math.min(typedQuery.length, Math.floor(frame / 2));
  const currentText = typedQuery.slice(0, textLen);
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: theme === 'dark' ? '#202124' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '90%', background: theme === 'dark' ? '#303134' : '#FFFFFF',
        borderRadius: '24px', border: '1px solid ' + (theme === 'dark' ? '#5F6368' : '#DFE1E5'),
        overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 18px', gap: '12px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA0A6" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span style={{ fontSize: '15px', fontWeight: 500, flex: 1 }}>{currentText}<span style={{ opacity: Math.sin(frame / 6) > 0 ? 1 : 0 }}>|</span></span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#EA4335"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
        </div>
        <div style={{ borderTop: '1px solid ' + (theme === 'dark' ? '#3C4043' : '#E8EAED'), padding: '8px 0' }}>
          {suggestions.map((s: string, idx: number) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: '14px', padding: '8px 18px',
              fontSize: '13px', color: theme === 'dark' ? '#E8EAED' : '#202124',
              background: idx === 0 ? (theme === 'dark' ? '#3C4043' : '#F1F3F4') : 'transparent'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9AA0A6" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
