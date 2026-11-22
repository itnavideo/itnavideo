import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface TagManagerPreviewDebuggerProps {
  title?: string;
  [key: string]: any;
}

export const TagManagerPreviewDebugger: React.FC<TagManagerPreviewDebuggerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Tag Assistant Debugger","selectedEvent":"4: Link Click","tagsFiredCount":3,"tagsNotFiredCount":2,"firedTags":["Google Ads Remarketing","GA4 Form Submit","LinkedIn Insight Tag"],"notFiredTags":["TikTok Pixel Lead","Hotjar Heatmap Init"],"accentColor":"#1A73E8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, selectedEvent, tagsFiredCount, tagsNotFiredCount, firedTags, notFiredTags, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#1E293B' : '#F1F5F9',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>Event: {selectedEvent}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Summary Active</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#0F172A' : '#FFFFFF', borderRadius: '8px', padding: '14px', border: '1px solid #10B98144' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', marginBottom: '10px' }}>TAGS FIRED ({tagsFiredCount})</div>
          {firedTags.map((t: string, idx: number) => (
            <div key={idx} style={{ fontSize: '11px', marginBottom: '6px' }}>✓ {t}</div>
          ))}
        </div>
        <div style={{ background: theme === 'dark' ? '#0F172A' : '#FFFFFF', borderRadius: '8px', padding: '14px', border: '1px solid #EF444444' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444', marginBottom: '10px' }}>TAGS NOT FIRED ({tagsNotFiredCount})</div>
          {notFiredTags.map((t: string, idx: number) => (
            <div key={idx} style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '6px' }}>✕ {t}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
