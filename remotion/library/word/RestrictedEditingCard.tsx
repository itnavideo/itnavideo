import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RestrictedEditingCardProps {
  protectionLevel?: string;
  allowedExceptions?: string;
  isPasswordEnforced?: boolean;
}

export const RestrictedEditingCard: React.FC<RestrictedEditingCardProps> = (props) => {
  const {
    protectionLevel = "Allow only this type of editing: Filling in forms",
    allowedExceptions = "Exceptions (optional): Financial Auditors Group",
    isPasswordEnforced = true,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Restrict Formatting and Editing</h3>
        <span style={{ fontSize: '11px', backgroundColor: '#dc2626', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
          🔒 ENFORCED
        </span>
      </div>

      {/* Protection Rules Box */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        flex: 1,
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>1. Formatting Restrictions</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Limit formatting to a selection of styles (Recommended)</div>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80' }}>2. Editing Restrictions</div>
          <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>{protectionLevel}</div>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#facc15' }}>3. Start Enforcement</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Password protection active. Unauthenticated modifications blocked.</div>
        </div>
      </div>
    </div>
  );
};
