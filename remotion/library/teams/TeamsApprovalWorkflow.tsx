import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsApprovalWorkflowProps {
  approvalTitle?: string;
  requester?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  amount?: string;
}

export const TeamsApprovalWorkflow: React.FC<TeamsApprovalWorkflowProps> = (props) => {
  const {
    approvalTitle = "AWS Lambda Render Credits Top-up",
    requester = "DevOps Platform Team",
    status = "Approved",
    amount = "$1,250.00 USD",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#11101d',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Teams Approvals App</h3>
        <span style={{
          backgroundColor: status === 'Approved' ? '#22c55e' : '#f59e0b',
          color: '#111',
          fontSize: '11px',
          fontWeight: 800,
          padding: '2px 8px',
          borderRadius: '4px',
        }}>
          {status}
        </span>
      </div>

      <div style={{
        backgroundColor: '#1e1c2e',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #2d2a45',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>{approvalTitle}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Requested by {requester} • {amount}</div>
        </div>

        <div style={{ borderTop: '1px solid #2d2a45', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
          <span>Approver: Sarah Connor (VP Engineering)</span>
          <span style={{ color: '#4ade80' }}>Signed via Microsoft Power Automate</span>
        </div>
      </div>
    </div>
  );
};
