import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TrackChangesMarkupProps {
  reviewerName?: string;
  timestamp?: string;
  insertedText?: string;
  deletedText?: string;
  commentText?: string;
}

export const TrackChangesMarkup: React.FC<TrackChangesMarkupProps> = (props) => {
  const {
    reviewerName = "Sarah Jenkins (Legal)",
    timestamp = "Today at 2:15 PM",
    insertedText = "within forty-five (45) business days",
    deletedText = "immediately upon written notice",
    commentText = "Standard corporate indemnification period aligned with Q3 governance framework.",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 12 } });
  const commentSlide = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
      color: '#f1f5f9',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '4px',
            letterSpacing: '0.5px',
          }}>TRACK CHANGES ACTIVE</span>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Simple Markup Mode</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>✓ Accept</button>
          <button style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>✕ Reject</button>
        </div>
      </div>

      {/* Main Diff Document & Margin Comments */}
      <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
        {/* Document Body */}
        <div style={{
          flex: 2,
          backgroundColor: '#ffffff',
          color: '#1e293b',
          borderRadius: '8px',
          padding: '28px',
          fontSize: '14px',
          lineHeight: '1.9',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '12px', color: '#0f172a' }}>
            Section 4.2 - Notice and Remedy Period
          </div>
          <div>
            The receiving party shall cure any non-conformity or protocol variance{' '}
            <span style={{
              color: '#dc2626',
              textDecoration: 'line-through',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              padding: '2px 4px',
              borderRadius: '2px',
              opacity: progress,
            }}>
              {deletedText}
            </span>{' '}
            <span style={{
              color: '#16a34a',
              textDecoration: 'underline',
              backgroundColor: 'rgba(22, 163, 74, 0.12)',
              fontWeight: 600,
              padding: '2px 4px',
              borderRadius: '2px',
              opacity: progress,
            }}>
              {insertedText}
            </span>{' '}
            following receipt of written specification details from auditing inspectors.
          </div>
        </div>

        {/* Comment Balloon on Margin */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          opacity: commentSlide,
          transform: `translateX(${(1 - commentSlide) * 30}px)`,
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
              }}>SJ</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>{reviewerName}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>{timestamp}</div>
              </div>
            </div>
            <p style={{ fontSize: '12px', lineHeight: '1.5', color: '#cbd5e1', margin: '0 0 10px 0' }}>
              {commentText}
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: '#38bdf8', cursor: 'pointer' }}>Reply</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '10px', color: '#4ade80', cursor: 'pointer' }}>Resolve</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
