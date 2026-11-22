import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessMacroActionBuilderProps {
  macroName?: string;
  triggerEvent?: string;
}

export const AccessMacroActionBuilder: React.FC<AccessMacroActionBuilderProps> = (props) => {
  const {
    macroName = "mcro_AutomatedMonthlyClose",
    triggerEvent = "OnClick: btn_RunMonthlyClose",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  const actions = [
    { name: 'SetWarnings', args: 'Warnings On: No' },
    { name: 'OpenQuery', args: 'qry_ArchiveOldInvoices (Data Mode: Edit)' },
    { name: 'Requery', args: 'Control Name: lst_ActiveOrders' },
    { name: 'MessageBox', args: 'Message: "Monthly ledger successfully balanced."' },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c101c',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Visual Macro Action Builder</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>{triggerEvent}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {actions.map((act, i) => (
          <div key={i} style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#A4373A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>{i + 1}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>{act.name}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>{act.args}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
