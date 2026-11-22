import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EmailThreadingConversationProps {
  conversationTopic?: string;
  messagesCount?: number;
  latestSender?: string;
  latestReplySnippet?: string;
}

export const EmailThreadingConversation: React.FC<EmailThreadingConversationProps> = (props) => {
  const {
    conversationTopic = "Production Cloud Run Container Migration Strategy",
    messagesCount = 4,
    latestSender = "DevOps Lead Engineer",
    latestReplySnippet = "All health check endpoints passed in staging. Ready for off-peak production cutover at 02:00 UTC.",
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
      gap: '14px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Conversation Thread</h3>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{conversationTopic}</span>
        </div>
        <span style={{ fontSize: '11px', backgroundColor: '#1e293b', padding: '3px 8px', borderRadius: '4px', border: '1px solid #334155' }}>
          {messagesCount} messages in thread
        </span>
      </div>

      {/* Collapsed Parent Message */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '6px',
        padding: '10px 14px',
        fontSize: '11px',
        color: '#94a3b8',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>Original Message • Chief Architect (Yesterday 4:15 PM)</span>
        <span>▶ 3 prior replies hidden</span>
      </div>

      {/* Expanded Latest Reply */}
      <div style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        borderRadius: '8px',
        padding: '20px 24px',
        flex: 1,
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0078D4' }}>{latestSender}</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Today, 11:30 AM</span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#334155', margin: 0 }}>
            {latestReplySnippet}
          </p>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', gap: '8px' }}>
          <button style={{ backgroundColor: '#0078D4', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '11px', fontWeight: 600 }}>↩ Reply</button>
          <button style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 12px', fontSize: '11px' }}>↪ Forward</button>
        </div>
      </div>
    </div>
  );
};
