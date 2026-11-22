import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface TagManagerTriggerTagFlowProps {
  title?: string;
  [key: string]: any;
}

export const TagManagerTriggerTagFlow: React.FC<TagManagerTriggerTagFlowProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"GTM Event Pipeline","trigger":"Click — Video Render CTA","variable":"{{Click ID}} = \"render-btn\"","tagsFired":[{"name":"GA4 Event — video_render_started","type":"Google Analytics"},{"name":"Google Ads Conversion — Render Initiated","type":"Google Ads"},{"name":"Meta Pixel — Lead Event","type":"Custom HTML"}],"accentColor":"#1A73E8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, trigger, variable, tagsFired, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#1E293B' : '#F0F9FF',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>Container: GTM-K982VX4</div>
        </div>
        <span style={{ fontSize: '11px', background: '#38BDF822', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Active Version 14</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#0F172A' : '#FFFFFF', borderRadius: '8px', padding: '14px', border: '1px solid #38BDF844' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>TRIGGER CONDITION</div>
          <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '6px', color: '#38BDF8' }}>{trigger}</div>
          <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '6px', fontFamily: 'monospace' }}>{variable}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>TAGS EXECUTED (FIRED)</div>
          {tagsFired.map((t: any, idx: number) => (
            <div key={idx} style={{
              background: theme === 'dark' ? '#0F172A' : '#FFFFFF',
              borderRadius: '6px', padding: '10px 14px', borderLeft: '3px solid #10B981',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>{t.type}</div>
              </div>
              <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>✓ Fired</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
