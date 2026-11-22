import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface TagManagerDataLayerInspectorProps {
  title?: string;
  [key: string]: any;
}

export const TagManagerDataLayerInspector: React.FC<TagManagerDataLayerInspectorProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"dataLayer.push Monitor","eventName":"purchase","payload":{"transaction_id":"ORD_9410","value":49,"currency":"USD","items":[{"item_name":"Pro Creator 100 Credits","price":49}]},"timestamp":"14:22:08.412","accentColor":"#38BDF8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, eventName, payload, timestamp, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F172A' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontFamily: 'Inter, sans-serif' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>Captured Event: {eventName} @ {timestamp}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>JSON Valid</span>
      </div>
      <div style={{
        flex: 1, background: theme === 'dark' ? '#020617' : '#FFFFFF',
        borderRadius: '8px', padding: '16px', border: '1px solid ' + (theme === 'dark' ? '#1E293B' : '#E2E8F0'),
        fontSize: '11px', lineHeight: '1.6', overflow: 'hidden', color: theme === 'dark' ? '#38BDF8' : '#0369A1'
      }}>
        <div style={{ color: '#94A3B8' }}>// window.dataLayer.push()</div>
        <div>{JSON.stringify({ event: eventName, ecommerce: payload }, null, 2)}</div>
      </div>
    </div>
  );
};
