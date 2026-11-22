import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WordRibbonToolbarProps {
  activeTab?: string;
  documentTitle?: string;
  themeColor?: string;
  showQuickAccess?: boolean;
}

export const WordRibbonToolbar: React.FC<WordRibbonToolbarProps> = (props) => {
  const {
    activeTab = "Home",
    documentTitle = "Annual_Report_2025.docx",
    themeColor = "#2B579A",
    showQuickAccess = true,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tabs = ['File', 'Home', 'Insert', 'Layout', 'References', 'Review', 'View'];
  const activeTabIndex = Math.min(Math.floor(frame / 45) % tabs.length, tabs.length - 1);
  const currentTab = tabs[activeTabIndex] || activeTab;

  const ribbonEntrance = spring({ frame, fps, config: { damping: 14 } });
  const pulse = Math.sin(frame * 0.1) * 3;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      boxSizing: 'border-box',
      opacity: ribbonEntrance,
      transform: `translateY(${(1 - ribbonEntrance) * 20}px)`,
    }}>
      {/* Title Bar */}
      <div style={{
        backgroundColor: themeColor,
        borderRadius: '8px 8px 0 0',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            backgroundColor: '#185ABD',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '16px',
            color: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>W</div>
          <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.2px' }}>{documentTitle}</span>
          <span style={{ fontSize: '11px', color: '#cbd5e1', backgroundColor: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: '10px' }}>Saved to Cloud</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
        </div>
      </div>

      {/* Ribbon Tabs */}
      <div style={{
        backgroundColor: '#1e293b',
        display: 'flex',
        gap: '4px',
        padding: '6px 12px 0 12px',
        borderBottom: '1px solid #334155',
      }}>
        {tabs.map((tab, idx) => {
          const isActive = tab === currentTab;
          return (
            <div key={tab} style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#ffffff' : '#94a3b8',
              backgroundColor: isActive ? '#0f172a' : 'transparent',
              borderRadius: '6px 6px 0 0',
              borderTop: isActive ? `3px solid ${themeColor}` : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              {tab}
            </div>
          );
        })}
      </div>

      {/* Ribbon Action Deck */}
      <div style={{
        backgroundColor: '#0f172a',
        padding: '16px 20px',
        border: '1px solid #334155',
        borderTop: 'none',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {/* Clipboard Group */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid #334155', paddingRight: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>📋 Paste</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>✂️ Cut</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>📄 Copy</span>
            </div>
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', textTransform: 'uppercase' }}>Clipboard</span>
        </div>

        {/* Font Group */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid #334155', paddingRight: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '4px', padding: '4px 10px', fontSize: '12px' }}>
              Calibri (Body) ▾
            </div>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}>
              12 ▾
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ padding: '4px 6px', fontWeight: 700, backgroundColor: '#334155', borderRadius: '3px', fontSize: '12px' }}>B</span>
              <span style={{ padding: '4px 6px', fontStyle: 'italic', backgroundColor: '#1e293b', borderRadius: '3px', fontSize: '12px' }}>I</span>
              <span style={{ padding: '4px 6px', textDecoration: 'underline', backgroundColor: '#1e293b', borderRadius: '3px', fontSize: '12px' }}>U</span>
            </div>
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', textTransform: 'uppercase' }}>Font</span>
        </div>

        {/* Paragraph & Styles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Normal', 'Heading 1', 'Heading 2', 'Title'].map((st, i) => (
              <div key={st} style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: i === 0 ? '1px solid #3b82f6' : '1px solid #334155',
                backgroundColor: i === 0 ? 'rgba(59, 130, 246, 0.15)' : '#1e293b',
                fontSize: '11px',
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? '#60a5fa' : '#cbd5e1',
              }}>
                {st}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', textTransform: 'uppercase' }}>Styles</span>
        </div>
      </div>

      {/* Editor Mock Page Preview */}
      <div style={{
        flex: 1,
        marginTop: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '6px',
        padding: '24px 32px',
        color: '#1e293b',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        <div style={{ fontSize: '20px', fontWeight: 800, color: themeColor, marginBottom: '8px' }}>Executive Summary</div>
        <div style={{ height: '2px', backgroundColor: '#e2e8f0', width: '100%', marginBottom: '16px' }} />
        <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#475569', margin: 0 }}>
          This quarterly review encapsulates enterprise operational efficiencies, cloud transformation progress, and automated documentation flows powered by Microsoft 365 standard layouts.
        </p>
      </div>
    </div>
  );
};
