import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DocumentGrammarCheckProps {
  sentence?: string;
  errorWord?: string;
  suggestion?: string;
  ruleCategory?: string;
  confidenceScore?: number;
}

export const DocumentGrammarCheck: React.FC<DocumentGrammarCheckProps> = (props) => {
  const {
    sentence = "Each of the engineering teams have completed their quarterly audit.",
    errorWord = "have",
    suggestion = "has",
    ruleCategory = "Subject-Verb Agreement",
    confidenceScore = 98,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({ frame, fps, config: { damping: 14 } });
  const pulse = Math.sin(frame * 0.15) * 3;

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
      opacity: anim,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>✍️</span>
          <span style={{ fontSize: '15px', fontWeight: 700 }}>Microsoft Editor • Grammar & Conciseness</span>
        </div>
        <span style={{ fontSize: '11px', color: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '3px 8px', borderRadius: '10px' }}>
          {confidenceScore}% Match Confidence
        </span>
      </div>

      {/* Document Sentence Underline */}
      <div style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        borderRadius: '8px',
        padding: '24px',
        fontSize: '15px',
        lineHeight: '1.8',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}>
        Each of the engineering teams{' '}
        <span style={{
          textDecoration: 'underline wavy #2563eb',
          fontWeight: 700,
          color: '#1e40af',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          padding: '2px 4px',
          borderRadius: '3px',
        }}>
          {errorWord}
        </span>{' '}
        completed their quarterly audit.
      </div>

      {/* Editor Suggestion Flyout */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '16px 20px',
        border: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>{ruleCategory}</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>
            Change to: <span style={{ color: '#4ade80' }}>"{suggestion}"</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 14px', fontSize: '12px', fontWeight: 600 }}>
            Accept Fix
          </button>
          <button style={{ backgroundColor: '#334155', color: '#cbd5e1', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px' }}>
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};
