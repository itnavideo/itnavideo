import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CSVDataStreamParserProps {
  delimiter?: string;
  rowCount?: number;
  encoding?: string;
}

export const CSVDataStreamParser: React.FC<CSVDataStreamParserProps> = (props) => {
  const {
    delimiter = "Comma (,)",
    rowCount = 14250,
    encoding = "UTF-8",
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
      gap: '14px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>CSV Tabular Stream Parser</h3>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>{rowCount.toLocaleString()} Parsed Rows</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        border: '1px solid #334155',
        overflow: 'hidden',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 180px 120px 1fr', backgroundColor: '#0f172a', padding: '10px 14px', fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>
          <span>RecordID</span>
          <span>UserEmail</span>
          <span>PlanType</span>
          <span>CreditsRemaining</span>
        </div>

        {[
          { id: 1001, email: 'alex.m@apex.io', plan: 'Enterprise', creds: '450 Credits' },
          { id: 1002, email: 'sarah.c@cloud.com', plan: 'Pro Creator', creds: '120 Credits' },
          { id: 1003, email: 'elena.r@design.net', plan: 'Enterprise', creds: '800 Credits' },
        ].map((r) => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '80px 180px 120px 1fr', padding: '10px 14px', fontSize: '12px', borderBottom: '1px solid #334155', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>#{r.id}</span>
            <span style={{ color: '#38bdf8' }}>{r.email}</span>
            <span style={{ color: '#facc15' }}>{r.plan}</span>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>{r.creds}</span>
          </div>
        ))}

        <div style={{ marginTop: 'auto', backgroundColor: '#0f172a', padding: '8px 14px', fontSize: '10px', color: '#94a3b8' }}>
          Delimiter: {delimiter} • Encoding: {encoding} • Streaming Parser Active
        </div>
      </div>
    </div>
  );
};
