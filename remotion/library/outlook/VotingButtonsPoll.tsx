import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface VotingButtonsPollProps {
  pollQuestion?: string;
  votesApprove?: number;
  votesReject?: number;
  votesPending?: number;
}

export const VotingButtonsPoll: React.FC<VotingButtonsPollProps> = (props) => {
  const {
    pollQuestion = "Approve production deployment of Remotion 1,000+ component library?",
    votesApprove = 14,
    votesReject = 0,
    votesPending = 2,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Outlook Voting Buttons</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Interactive Decision Header</span>
      </div>

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
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{pollQuestion}</div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ flex: 1, backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '12px', fontWeight: 700 }}>
            ✓ Approve ({votesApprove})
          </button>
          <button style={{ flex: 1, backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '12px', fontWeight: 700 }}>
            ✕ Reject ({votesReject})
          </button>
          <button style={{ flex: 1, backgroundColor: '#334155', color: '#cbd5e1', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '12px' }}>
            Pending ({votesPending})
          </button>
        </div>

        <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
          Responses are aggregated automatically into the organizer's tracking tab.
        </div>
      </div>
    </div>
  );
};
