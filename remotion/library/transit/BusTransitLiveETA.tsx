import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface BusTransitLiveETAProps {
  title?: string;
  [key: string]: any;
}

export const BusTransitLiveETA: React.FC<BusTransitLiveETAProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Stop #4812 — City Center Plaza","routes":[{"route":"M15-SBS","dest":"South Ferry","eta":"3 min","crowded":"Low Seats Avail","color":"#3B82F6"},{"route":"M101","dest":"Harlem 125th St","eta":"8 min","crowded":"Standing Room Only","color":"#10B981"},{"route":"M42","dest":"Crosstown Pier","eta":"14 min","crowded":"Many Seats","color":"#F59E0B"}],"accentColor":"#3B82F6","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, routes, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F172A' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>Live Automated Vehicle Location (AVL)</div>
        </div>
        <span style={{ fontSize: '11px', background: '#3B82F622', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Real-Time GPS</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {routes.map((r: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderLeft: `4px solid ${r.color}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, background: r.color, color: '#FFF', padding: '4px 8px', borderRadius: '4px' }}>
                {r.route}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{r.dest}</div>
                <div style={{ fontSize: '10px', color: '#94A3B8' }}>{r.crowded}</div>
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#10B981' }}>{r.eta}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
