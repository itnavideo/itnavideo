import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CoverPageTemplateProps {
  documentTitle?: string;
  documentSubtitle?: string;
  authorName?: string;
  organization?: string;
  publishYear?: number;
}

export const CoverPageTemplate: React.FC<CoverPageTemplateProps> = (props) => {
  const {
    documentTitle = "ANNUAL ENTERPRISE ARCHITECTURE REPORT",
    documentSubtitle = "Next-Generation Cloud Orchestration & Security Governance",
    authorName = "Office of the Chief Technology Officer",
    organization = "Apex Global Enterprises Inc.",
    publishYear = 2025,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c1322',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: anim,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        flex: 1,
        borderRadius: '8px',
        padding: '48px',
        color: '#1e293b',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Accent Geometric Stripe */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '100%',
          backgroundColor: '#1e40af',
          opacity: 0.08,
          transform: 'skewX(-15deg) translateX(40px)',
        }} />

        {/* Title & Subtitle */}
        <div>
          <div style={{ width: '48px', height: '6px', backgroundColor: '#2563eb', marginBottom: '24px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: '0 0 12px 0', lineHeight: '1.2' }}>
            {documentTitle}
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '1.6', maxWidth: '85%' }}>
            {documentSubtitle}
          </p>
        </div>

        {/* Author Byline & Date */}
        <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{authorName}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{organization}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Published Fiscal Year {publishYear}</div>
        </div>
      </div>
    </div>
  );
};
