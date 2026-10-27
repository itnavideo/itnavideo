import React, { useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, delayRender, continueRender } from 'remotion';
import { codeToHtml } from 'shiki';

export const ShikiCodeBlock: React.FC<{ code: string; language: string; theme?: string }> = ({
  code,
  language = 'javascript',
  theme = 'dracula'
}) => {
  const [html, setHtml] = useState<string | null>(null);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    let isCancelled = false;
    codeToHtml(code || 'console.log("Hello");', { lang: language, theme })
      .then((res) => {
        if (!isCancelled) {
          setHtml(res);
          continueRender(handle);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!isCancelled) continueRender(handle);
      });
      
    return () => { isCancelled = true; };
  }, [code, language, theme, handle]);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8 },
  });

  const scale = interpolate(entrance, [0, 1], [0.95, 1.0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  if (!html) {
    return <div style={{ color: '#fff', fontFamily: 'monospace' }}>Loading code...</div>;
  }

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px',
        fontSize: '32px',
        fontFamily: 'monospace',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
