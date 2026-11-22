import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WordTableOfContentsProps {
  title?: string;
  themeColor?: string;
  items?: Array<{ level: number; title: string; page: number }>;
}

export const WordTableOfContents: React.FC<WordTableOfContentsProps> = (props) => {
  const {
    title = "Table of Contents",
    themeColor = "#2B579A",
    items = [{"level":1,"title":"1. Executive Summary & Vision","page":3},{"level":2,"title":"1.1 Strategic Cloud Objectives","page":4},{"level":2,"title":"1.2 Cost Efficiency Metrics","page":7},{"level":1,"title":"2. Architecture & Infrastructure","page":12},{"level":2,"title":"2.1 Serverless Orchestration","page":15},{"level":3,"title":"2.1.1 Microservice SLA Analysis","page":19},{"level":1,"title":"3. Compliance and Security Mandate","page":24}],
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '28px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        flex: 1,
        borderRadius: '8px',
        padding: '36px',
        color: '#1e293b',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* TOC Heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: themeColor }}>{title}</h2>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Automatic Table 1</span>
        </div>

        {/* Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {(items || []).map((item, index) => {
            const itemDelay = index * 4;
            const itemAnim = spring({ frame: Math.max(0, frame - itemDelay), fps, config: { damping: 15 } });
            const indent = (item.level - 1) * 24;

            return (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'baseline',
                paddingLeft: `${indent}px`,
                fontSize: item.level === 1 ? '14px' : '13px',
                fontWeight: item.level === 1 ? 600 : 400,
                color: item.level === 1 ? '#0f172a' : '#475569',
                opacity: itemAnim,
                transform: `translateX(${(1 - itemAnim) * -15}px)`,
              }}>
                <span style={{ whiteSpace: 'nowrap' }}>{item.title}</span>
                <span style={{
                  flex: 1,
                  margin: '0 8px',
                  borderBottom: '1px dotted #94a3b8',
                  transform: 'translateY(-4px)',
                }} />
                <span style={{
                  fontWeight: 700,
                  color: themeColor,
                  minWidth: '24px',
                  textAlign: 'right',
                }}>
                  {item.page}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
          <span>Ctrl + Click to follow link</span>
          <span>Update Table: Entire document synced</span>
        </div>
      </div>
    </div>
  );
};
