import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AuditPrintSpoolerQueueProps {
  printerName?: string;
  queuedJobs?: number;
}

export const AuditPrintSpoolerQueue: React.FC<AuditPrintSpoolerQueueProps> = (props) => {
  const {
    printerName = "HP LaserJet Enterprise MFP M635",
    queuedJobs = 2,
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
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Corporate Print Spooler Queue</h3>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>Spooler Service Running</span>
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
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>{printerName}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{queuedJobs} Active Spooled Document Jobs</div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '10px 14px', borderRadius: '4px', fontSize: '11px', color: '#cbd5e1' }}>
          Job #481: Executive_Summary.pdf (14 Pages • Duplex • Color)
        </div>
      </div>
    </div>
  );
};
