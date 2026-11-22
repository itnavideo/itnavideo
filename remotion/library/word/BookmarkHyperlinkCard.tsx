import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BookmarkHyperlinkCardProps {
  bookmarkName?: string;
  hyperlinkUrl?: string;
  screenTipText?: string;
}

export const BookmarkHyperlinkCard: React.FC<BookmarkHyperlinkCardProps> = (props) => {
  const {
    bookmarkName = "#Section_4_AuditResults",
    hyperlinkUrl = "https://security.itnavideo.com/audit-v4",
    screenTipText = "Click to navigate directly to Appendix Section 4.2 findings.",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Bookmarks & Interactive Hyperlinks</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Ctrl + Click to Jump</span>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        borderRadius: '8px',
        padding: '28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Document Line with Blue Underline Link */}
        <div>
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            For comprehensive statistical breakdowns, please consult the{' '}
            <span style={{
              color: '#2563eb',
              textDecoration: 'underline',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              Internal Verification Logs ({bookmarkName})
            </span>{' '}
            stored within the centralized audit ledger.
          </div>
        </div>

        {/* ScreenTip Tooltip */}
        <div style={{
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          borderRadius: '6px',
          padding: '10px 14px',
          fontSize: '11px',
          border: '1px solid #334155',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}>
          <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '2px' }}>ScreenTip:</div>
          <div>{screenTipText}</div>
        </div>
      </div>
    </div>
  );
};
