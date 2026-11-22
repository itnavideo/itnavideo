import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MailMergeWizardProps {
  currentRecord?: number;
  totalRecords?: number;
  recipientName?: string;
  recipientCompany?: string;
  recipientCity?: string;
}

export const MailMergeWizard: React.FC<MailMergeWizardProps> = (props) => {
  const {
    currentRecord = 3,
    totalRecords = 148,
    recipientName = "Eleanor Vance",
    recipientCompany = "Apex Financial Services",
    recipientCity = "Boston, MA",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({ frame, fps, config: { damping: 12 } });
  const pulse = Math.sin(frame * 0.15) * 4;

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
      opacity: anim,
    }}>
      {/* Wizard Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: '12px 20px',
        borderRadius: '8px',
        border: '1px solid #334155',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>✉️</span>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Mail Merge Recipient Preview</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ backgroundColor: '#334155', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>◀ Prev</button>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#38bdf8' }}>Record {currentRecord} of {totalRecords}</span>
          <button style={{ backgroundColor: '#334155', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>Next ▶</button>
        </div>
      </div>

      {/* Main Split: Data Source vs Rendered Letter */}
      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
        {/* Recipient Data Card */}
        <div style={{
          flex: 1,
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          padding: '18px',
          border: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Excel Recipient Row</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '8px 12px', borderRadius: '4px' }}>
              <div style={{ fontSize: '10px', color: '#64748b' }}>{'<<FullName>>'}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#4ade80' }}>{recipientName}</div>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '8px 12px', borderRadius: '4px' }}>
              <div style={{ fontSize: '10px', color: '#64748b' }}>{'<<Company>>'}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8' }}>{recipientCompany}</div>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '8px 12px', borderRadius: '4px' }}>
              <div style={{ fontSize: '10px', color: '#64748b' }}>{'<<Location>>'}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#facc15' }}>{recipientCity}</div>
            </div>
          </div>
        </div>

        {/* Merged Letter Output */}
        <div style={{
          flex: 2,
          backgroundColor: '#ffffff',
          color: '#1e293b',
          borderRadius: '8px',
          padding: '24px 28px',
          fontSize: '13px',
          lineHeight: '1.8',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}>
          <div style={{ marginBottom: '16px' }}>
            Dear <strong style={{ color: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{recipientName}</strong>,
          </div>
          <p style={{ margin: 0 }}>
            We are pleased to inform you that <strong>{recipientCompany}</strong> has been selected as a premier enterprise partner for our fiscal 2025 technology cohort in <strong>{recipientCity}</strong>. Your customized onboarding package will arrive shortly.
          </p>
          <div style={{ marginTop: '24px', fontStyle: 'italic', color: '#64748b' }}>
            Warm regards,<br />
            Global Enterprise Operations Team
          </div>
        </div>
      </div>
    </div>
  );
};
