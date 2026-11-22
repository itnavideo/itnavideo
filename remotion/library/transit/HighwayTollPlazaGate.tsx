import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface HighwayTollPlazaGateProps {
  title?: string;
  [key: string]: any;
}

export const HighwayTollPlazaGate: React.FC<HighwayTollPlazaGateProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Electronic Toll Collection (ETC)","plazaName":"Expressway Gateway Plaza","tagId":"TAG-8840-X1","tollFee":"$4.50","accountBalance":"$82.50","gateStatus":"BARRIER OPEN — PROCEED","accentColor":"#10B981","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, plazaName, tagId, tollFee, accountBalance, gateStatus, accentColor, theme } = merged;


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
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{plazaName}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>RFID Valid</span>
      </div>
      <div style={{ flex: 1, background: theme === 'dark' ? '#1E293B' : '#FFFFFF', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 900, color: '#10B981' }}>{gateStatus}</div>
        <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px' }}>Tag: {tagId} • Toll Deducted: {tollFee}</div>
        <div style={{ fontSize: '11px', color: '#38BDF8', marginTop: '4px' }}>Remaining Balance: {accountBalance}</div>
      </div>
    </div>
  );
};
