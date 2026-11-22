import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FlowchartNode {
  id: string;
  type?: 'start' | 'process' | 'decision' | 'end';
  title: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface FlowchartProps {
  title?: string;
  subtitle?: string;
  nodes?: FlowchartNode[];
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  direction?: 'vertical' | 'horizontal';
  style?: React.CSSProperties;
}

const DEFAULT_FLOW_NODES: FlowchartNode[] = [
  { id: '1', type: 'start', title: '1. Hook Script', description: 'Catch viewer in first 3s', color: '#0066FF' },
  { id: '2', type: 'process', title: '2. AI Voiceover', description: 'Generate high-clarity voice', color: '#2563EB' },
  { id: '3', type: 'decision', title: '3. Viral Retention > 70%?', description: 'Branch into Shorts / Widescreen', color: '#F59E0B' },
  { id: '4', type: 'end', title: '4. Cloud Render', description: 'Export 1080p 30fps video', color: '#10B981' },
];

export const Flowchart: React.FC<FlowchartProps> = ({
  title = 'AI Video Automation Flowchart',
  subtitle = 'Deterministic 4-step pipeline',
  nodes = DEFAULT_FLOW_NODES,
  width = '100%',
  theme = 'dark',
  delayFrames = 5,
  direction = 'vertical',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const items = nodes && nodes.length > 0 ? nodes : DEFAULT_FLOW_NODES;

  return (
    <div
      style={{
        width,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.45)' : '0 8px 30px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '24px' }}>
          {title && (
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor, letterSpacing: '-0.02em' }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Nodes Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: direction === 'vertical' ? 'column' : 'row',
          alignItems: 'center',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: direction === 'horizontal' ? 'wrap' : 'nowrap',
        }}
      >
        {items.map((node, idx) => {
          const nodeSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 6),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const nodeColor = node.color || '#0066FF';
          const isDecision = node.type === 'decision';

          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div
                style={{
                  width: direction === 'vertical' ? '100%' : 'auto',
                  minWidth: '220px',
                  maxWidth: direction === 'vertical' ? '460px' : '260px',
                  backgroundColor: cardBg,
                  border: `2px solid ${isDecision ? '#F59E0B' : nodeColor}`,
                  borderRadius: isDecision ? '14px' : '18px',
                  padding: '16px 20px',
                  boxShadow: `0 4px 20px ${nodeColor}22`,
                  transform: `scale(${nodeSpring}) translateY(${(1 - nodeSpring) * 20}px)`,
                  opacity: nodeSpring,
                  position: 'relative',
                  boxSizing: 'border-box',
                }}
              >
                {/* Node Pill Tag */}
                <div
                  style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: `${nodeColor}22`,
                    color: nodeColor,
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}
                >
                  {node.type || 'step'}
                </div>

                <div style={{ fontSize: '15px', fontWeight: 800, color: textColor, lineHeight: 1.2 }}>
                  {node.title}
                </div>
                {node.description && (
                  <div style={{ fontSize: '12px', fontWeight: 500, color: textMuted, marginTop: '4px' }}>
                    {node.description}
                  </div>
                )}
              </div>

              {/* Connecting Animated Arrow */}
              {idx < items.length - 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: nodeColor,
                    opacity: nodeSpring,
                    transform: `scale(${nodeSpring})`,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {direction === 'vertical' ? (
                      <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
