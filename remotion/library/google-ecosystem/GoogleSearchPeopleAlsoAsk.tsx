import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoogleSearchPeopleAlsoAskProps {
  title?: string;
  [key: string]: any;
}

export const GoogleSearchPeopleAlsoAsk: React.FC<GoogleSearchPeopleAlsoAskProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"People also ask","questions":[{"q":"How long does it take to render a 60s video with Remotion Lambda?","open":true,"ans":"Typically 15 to 30 seconds across distributed headless Chromium containers running on AWS Lambda."},{"q":"What is the best subtitle style for viral reels?","open":false},{"q":"Can I generate faceless videos from audio scripts?","open":false},{"q":"How does Groq Whisper achieve millisecond transcription accuracy?","open":false}],"accentColor":"#1A73E8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#1A73E8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, questions, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#202124' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '14px' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid ' + (theme === 'dark' ? '#3C4043' : '#DADCE0'), borderRadius: '8px', overflow: 'hidden' }}>
        {questions.map((item: any, idx: number) => (
          <div key={idx} style={{ borderBottom: idx < questions.length - 1 ? '1px solid ' + (theme === 'dark' ? '#3C4043' : '#DADCE0') : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: theme === 'dark' ? '#303134' : '#F8F9FA', fontSize: '13px', fontWeight: 500 }}>
              <span>{item.q}</span>
              <span style={{ fontSize: '12px', transform: item.open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            </div>
            {item.open && (
              <div style={{ padding: '12px 16px', fontSize: '12px', lineHeight: '1.5', color: theme === 'dark' ? '#BDC1C6' : '#4D5156', background: theme === 'dark' ? '#202124' : '#FFFFFF' }}>
                {item.ans}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
