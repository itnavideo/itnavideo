import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsChannelMessagePostProps {
  authorName?: string;
  postTitle?: string;
  postContent?: string;
  repliesCount?: number;
  reactionsCount?: number;
}

export const TeamsChannelMessagePost: React.FC<TeamsChannelMessagePostProps> = (props) => {
  const {
    authorName = "David Kim (DevOps Lead)",
    postTitle = "🚀 Milestone: Batch 70 Released with Zero Duplicates",
    postContent = "The team has successfully deployed 1,102 verified components to the Remotion media library with 100% duplicate protection across 59 subdirectories.",
    repliesCount = 6,
    reactionsCount = 18,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#11101d',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#1e1c2e',
        borderRadius: '8px',
        border: '1px solid #2d2a45',
        padding: '24px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#5B5FC7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>DK</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{authorName}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>General Channel • Today at 11:45 AM</div>
          </div>
        </div>

        {/* Post Headline & Body */}
        <div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#c7d2fe', marginBottom: '8px' }}>{postTitle}</div>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#cbd5e1', margin: 0 }}>
            {postContent}
          </p>
        </div>

        {/* Reactions & Replies Bar */}
        <div style={{ borderTop: '1px solid #2d2a45', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ backgroundColor: '#2d2a45', padding: '3px 8px', borderRadius: '12px', fontSize: '11px' }}>❤️ 8</span>
            <span style={{ backgroundColor: '#2d2a45', padding: '3px 8px', borderRadius: '12px', fontSize: '11px' }}>👍 6</span>
            <span style={{ backgroundColor: '#2d2a45', padding: '3px 8px', borderRadius: '12px', fontSize: '11px' }}>🚀 4</span>
          </div>
          <span style={{ fontSize: '12px', color: '#7b83eb', fontWeight: 600, cursor: 'pointer' }}>{repliesCount} Replies</span>
        </div>
      </div>
    </div>
  );
};
