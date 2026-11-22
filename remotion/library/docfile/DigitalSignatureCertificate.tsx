import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DigitalSignatureCertificateProps {
  signerName?: string;
  issuerOrg?: string;
  validUntil?: string;
}

export const DigitalSignatureCertificate: React.FC<DigitalSignatureCertificateProps> = (props) => {
  const {
    signerName = "Sarah Connor (VP Infrastructure)",
    issuerOrg = "DigiCert Global Root CA (X.509 PKI)",
    validUntil = "Nov 22, 2028 23:59:59 UTC",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>PKI Digital Signature Certificate</h3>
        <span style={{ backgroundColor: '#10b981', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
          SIGNATURE VALID
        </span>
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
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ fontSize: '36px' }}>🔏</span>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>{signerName}</div>
            <div style={{ fontSize: '11px', color: '#38bdf8' }}>Issuer: {issuerOrg}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', fontSize: '11px', color: '#cbd5e1' }}>
          Fingerprint: <code>SHA256: 8A:4F:92:C1:B8:34:E7:09:A1:D3...</code><br />
          Validity: {validUntil}
        </div>
      </div>
    </div>
  );
};
