import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EmailSignatureBlockProps {
  fullName?: string;
  jobTitle?: string;
  company?: string;
  phone?: string;
  email?: string;
  avatarInitials?: string;
  themeColor?: string;
}

export const EmailSignatureBlock: React.FC<EmailSignatureBlockProps> = (props) => {
  const {
    fullName = "Marcus Vance",
    jobTitle = "Principal Cloud Systems Architect",
    company = "Itnavideo Media Intelligence",
    phone = "+1 (555) 392-8190",
    email = "marcus.vance@itnavideo.com",
    avatarInitials = "MV",
    themeColor = "#0078D4",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '28px',
        color: '#1e293b',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Main Signature Card */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: themeColor,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 800,
            boxShadow: '0 4px 10px rgba(0, 120, 212, 0.35)',
          }}>
            {avatarInitials}
          </div>
          <div style={{ borderLeft: '3px solid #0078D4', paddingLeft: '16px' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{fullName}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: themeColor }}>{jobTitle}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{company}</div>
            <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
              📞 {phone} • ✉️ {email}
            </div>
          </div>
        </div>

        {/* Confidentiality Disclaimer */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '9px', lineHeight: '1.5', color: '#94a3b8' }}>
          NOTICE: This electronic transmission contains confidential and legally privileged information intended solely for the recipient named above. If you received this in error, please notify sender immediately.
        </div>
      </div>
    </div>
  );
};
