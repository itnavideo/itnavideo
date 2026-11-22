import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OutlookRulesAutomationProps {
  ruleName?: string;
  senderFilter?: string;
  actionMoveFolder?: string;
  prioritySetting?: string;
}

export const OutlookRulesAutomation: React.FC<OutlookRulesAutomationProps> = (props) => {
  const {
    ruleName = "VIP Client Escalation Rule",
    senderFilter = "emails from *@enterprise-corp.com",
    actionMoveFolder = "Priority Inquiries",
    prioritySetting = "Set Importance to High",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c1322',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Outlook Inbox Rules & Alerts</h3>
        <span style={{ fontSize: '11px', color: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '3px 8px', borderRadius: '10px' }}>
          Rule Active & Synced
        </span>
      </div>

      {/* Rule Pipeline Flow Diagram */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8' }}>{ruleName}</div>

        {/* Condition Stage */}
        <div style={{ backgroundColor: '#0f172a', padding: '12px 16px', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>WHEN MESSAGE ARRIVES</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>{senderFilter}</div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '16px', color: '#64748b' }}>⬇️</div>

        {/* Action Stage */}
        <div style={{ backgroundColor: '#0f172a', padding: '12px 16px', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>THEN DO THE FOLLOWING</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#4ade80', marginTop: '2px' }}>
            Move to folder <span style={{ color: '#facc15' }}>"{actionMoveFolder}"</span> and {prioritySetting}
          </div>
        </div>
      </div>
    </div>
  );
};
