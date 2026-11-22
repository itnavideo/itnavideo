import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessParameterQueryDialogProps {
  promptText?: string;
  parameterName?: string;
  defaultInput?: string;
}

export const AccessParameterQueryDialog: React.FC<AccessParameterQueryDialogProps> = (props) => {
  const {
    promptText = "Enter Minimum Revenue Threshold [USD]:",
    parameterName = "[Forms]![frm_Reports]![txt_MinRevenue]",
    defaultInput = "50000",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

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
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      {/* Parameter Dialog Box */}
      <div style={{
        width: '380px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '24px',
        color: '#1e293b',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Enter Parameter Value</div>
        <div style={{ fontSize: '12px', color: '#475569' }}>{promptText}</div>
        <input readOnly value={defaultInput} style={{ border: '1px solid #0078D4', padding: '8px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 600 }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
          <button style={{ backgroundColor: '#0078D4', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 16px', fontSize: '12px', fontWeight: 600 }}>OK</button>
          <button style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', fontSize: '12px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
