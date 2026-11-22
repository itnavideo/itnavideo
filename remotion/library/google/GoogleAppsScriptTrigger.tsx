import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleAppsScriptTriggerProps {
  functionName?: string;
  triggerType?: string;
}

export const GoogleAppsScriptTrigger: React.FC<GoogleAppsScriptTriggerProps> = (props) => {
  const {
    functionName = "onFormSubmit(e)",
    triggerType = "Event: On form submission ➔ Dispatch Slack Notification",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#202124',
      color: '#f8f9fa',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      fontFamily: 'Consolas, monospace',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fbbc05' }}>Google Apps Script • Triggers</span>
        <span style={{ fontSize: '11px', color: '#8ab4f8' }}>Execution: 42ms</span>
      </div>

      <div style={{ backgroundColor: '#2d3033', padding: '16px', borderRadius: '6px', flex: 1, fontSize: '12px', lineHeight: '1.7' }}>
        <span style={{ color: '#8ab4f8' }}>function</span> <span style={{ color: '#fbbc05' }}>{functionName}</span> &#123;<br />
        &nbsp;&nbsp;<span style={{ color: '#81c995' }}>const</span> sheet = SpreadsheetApp.getActive();<br />
        &nbsp;&nbsp;UrlFetchApp.fetch(<span style={{ color: '#f28b82' }}>"https://api.itnavideo.com/webhook"</span>);<br />
        &#125;
      </div>
    </div>
  );
};
