import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WordNavigationPaneProps {
  searchQuery?: string;
  activeHeading?: string;
  headingsCount?: number;
}

export const WordNavigationPane: React.FC<WordNavigationPaneProps> = (props) => {
  const {
    searchQuery = "encryption",
    activeHeading = "3.2 End-to-End Key Rotation",
    headingsCount = 18,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headings = [
    { title: '1. Executive Mandate', level: 1 },
    { title: '2. Cryptographic Architecture', level: 1 },
    { title: '3. Data Security Protocols', level: 1 },
    { title: '3.1 In-Transit SSL Handshake', level: 2 },
    { title: '3.2 End-to-End Key Rotation', level: 2, match: true },
    { title: '4. Appendix & References', level: 1 },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c1322',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      {/* Navigation Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>Navigation</div>
        
        {/* Search Bar */}
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #475569',
          borderRadius: '4px',
          padding: '6px 10px',
          fontSize: '11px',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span>🔍</span>
          <span>{searchQuery}</span>
        </div>

        {/* Headings List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {headings.map((h, i) => (
            <div key={i} style={{
              fontSize: '11px',
              padding: '6px 8px',
              paddingLeft: `${h.level * 10}px`,
              borderRadius: '4px',
              backgroundColor: h.title === activeHeading ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              color: h.title === activeHeading ? '#60a5fa' : '#94a3b8',
              fontWeight: h.title === activeHeading ? 700 : 400,
              borderLeft: h.title === activeHeading ? '2px solid #3b82f6' : 'none',
            }}>
              {h.title}
            </div>
          ))}
        </div>
      </div>

      {/* Target Content View */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        color: '#1e293b',
        borderRadius: '8px',
        padding: '28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563eb', marginBottom: '10px' }}>
          {activeHeading}
        </div>
        <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#475569', margin: 0 }}>
          Live jumping across document hierarchies allows readers to inspect automated cross-references and jump instantly to filtered search occurrences.
        </p>
      </div>
    </div>
  );
};
