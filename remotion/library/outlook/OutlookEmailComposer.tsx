import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OutlookEmailComposerProps {
  toRecipient?: string;
  ccRecipient?: string;
  subject?: string;
  bodyText?: string;
  isHighImportance?: boolean;
  themeColor?: string;
}

export const OutlookEmailComposer: React.FC<OutlookEmailComposerProps> = (props) => {
  const {
    toRecipient = "sarah.connor@apexenterprise.com",
    ccRecipient = "finance-team@apexenterprise.com",
    subject = "Q4 Cloud Infrastructure Budget Allocation Review",
    bodyText = "Hi Sarah, please find attached the revised financial projections for our cloud migration and Remotion rendering pipeline.",
    isHighImportance = true,
    themeColor = "#0078D4",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });
  const sendPulse = Math.sin(frame * 0.12) * 2;

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
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      opacity: entrance,
      transform: `translateY(${(1 - entrance) * 20}px)`,
    }}>
      {/* Composer Window Header */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px 8px 0 0',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #334155',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            backgroundColor: themeColor,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 800,
            color: '#fff',
          }}>O</div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>New Message • Outlook Mail</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isHighImportance && (
            <span style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '3px',
            }}>! HIGH IMPORTANCE</span>
          )}
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
        </div>
      </div>

      {/* Recipient & Subject Header Fields */}
      <div style={{
        backgroundColor: '#1e293b',
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderBottom: '1px solid #334155',
      }}>
        {/* To Field */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', minWidth: '32px' }}>To</span>
          <div style={{
            backgroundColor: 'rgba(0, 120, 212, 0.15)',
            border: '1px solid #0078D4',
            borderRadius: '14px',
            padding: '3px 10px',
            fontSize: '12px',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>👤 {toRecipient}</span>
          </div>
        </div>

        {/* Cc Field */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', minWidth: '32px' }}>Cc</span>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '3px 10px',
            fontSize: '12px',
            color: '#cbd5e1',
          }}>
            {ccRecipient}
          </div>
        </div>

        {/* Subject Field */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', minWidth: '32px' }}>Subject</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{subject}</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div style={{
        backgroundColor: '#0f172a',
        padding: '8px 18px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        borderBottom: '1px solid #334155',
      }}>
        <button style={{
          backgroundColor: themeColor,
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 16px',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          transform: `scale(${1 + sendPulse * 0.01})`,
          boxShadow: '0 2px 8px rgba(0, 120, 212, 0.4)',
        }}>
          <span>🚀 Send</span>
        </button>
        <span style={{ fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>📎 Attach File</span>
        <span style={{ fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>🔒 Encrypt</span>
        <span style={{ fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>🏷️ Sensitivity: Confidential</span>
      </div>

      {/* Message Body Canvas */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '0 0 8px 8px',
        padding: '24px 28px',
        color: '#1e293b',
        fontSize: '13px',
        lineHeight: '1.8',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      }}>
        <p style={{ margin: '0 0 16px 0' }}>{bodyText}</p>
        <div style={{
          border: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          borderRadius: '6px',
          padding: '10px 14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '18px' }}>📊</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Q4_Budget_Model_v3.xlsx</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>2.4 MB • Excel Workbook</div>
          </div>
        </div>
      </div>
    </div>
  );
};
