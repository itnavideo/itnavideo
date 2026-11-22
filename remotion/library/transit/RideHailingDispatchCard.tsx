import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface RideHailingDispatchCardProps {
  title?: string;
  [key: string]: any;
}

export const RideHailingDispatchCard: React.FC<RideHailingDispatchCardProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Driver Confirmed & En Route","driverName":"Michael K.","carModel":"Toyota Camry Hybrid (Silver)","licensePlate":"7XYZ412","pickupETA":"4 mins away","rating":"4.96 ★ (2,410 trips)","fareEstimate":"$18.50","accentColor":"#10B981","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, driverName, carModel, licensePlate, pickupETA, rating, fareEstimate, accentColor, theme } = merged;


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
          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>{pickupETA}</div>
        </div>
        <div style={{ fontSize: '20px', fontWeight: 900, color: '#10B981' }}>{fareEstimate}</div>
      </div>
      <div style={{ flex: 1, background: theme === 'dark' ? '#1E293B' : '#FFFFFF', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid ' + (theme === 'dark' ? '#334155' : '#E2E8F0') }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
          🚗
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 800 }}>{driverName} • <span style={{ fontSize: '11px', color: '#F59E0B' }}>{rating}</span></div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{carModel}</div>
          <div style={{ fontSize: '11px', fontWeight: 800, background: '#38BDF822', color: '#38BDF8', padding: '2px 8px', borderRadius: '4px', width: 'fit-content', marginTop: '6px' }}>
            {licensePlate}
          </div>
        </div>
      </div>
    </div>
  );
};
