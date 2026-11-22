import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EmailPhishingAlertBannerProps {
  alertLevel?: 'Warning' | 'Critical';
  alertMessage?: string;
  senderDomain?: string;
}

export const EmailPhishingAlertBanner: React.FC<EmailPhishingAlertBannerProps> = (props) => {
  const {
    alertLevel = "Warning",
    alertMessage = "The sender of this email could not be verified by DKIM/DMARC filters. Never click untrusted links.",
    senderDomain = "paypal-security-notice.xyz",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });
  const pulse = Math.sin(frame * 0.15) * 2;

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
      {/* Phishing Warning Ribbon */}
      <div style={{
        backgroundColor: '#7f1d1d',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '28px' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#fecaca', letterSpacing: '0.4px' }}>
              MICROSOFT DEFENDER FOR OFFICE 365: SUSPICIOUS SENDER
            </div>
            <div style={{ fontSize: '11px', color: '#fca5a5', marginTop: '2px' }}>
              Sender: <code style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: '2px' }}>{senderDomain}</code>
            </div>
          </div>
        </div>
        <button style={{
          backgroundColor: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 14px',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
        }}>
          Report Phishing
        </button>
      </div>

      {/* Simulated Email Body preview */}
      <div style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        borderRadius: '8px',
        padding: '24px',
        flex: 1,
        fontSize: '12px',
        lineHeight: '1.8',
      }}>
        <p style={{ margin: 0, color: '#64748b' }}>
          [External Message Content Quarantined until user verification. Suspicious hyperlinks have been neutralized by Safe Links protection.]
        </p>
      </div>
    </div>
  );
};
