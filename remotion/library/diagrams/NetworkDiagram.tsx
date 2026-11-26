import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NetworkNode {
  id: string;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size?: number;
  color?: string;
  isHub?: boolean;
}

export interface NetworkLink {
  from: string;
  to: string;
}

export interface NetworkDiagramProps {
  title?: string;
  subtitle?: string;
  nodes?: NetworkNode[];
  links?: NetworkLink[];
  width?: number | string;
  height?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_NETWORK_NODES: NetworkNode[] = [
  { id: 'hub', label: 'Cloud Run Web', x: 50, y: 50, size: 28, color: '#0066FF', isHub: true },
  { id: 'node1', label: 'AWS Lambda (Render)', x: 22, y: 28, size: 20, color: '#10B981' },
  { id: 'node2', label: 'Groq Whisper API', x: 78, y: 24, size: 20, color: '#F59E0B' },
  { id: 'node3', label: 'AWS S3 Temp Storage', x: 20, y: 74, size: 18, color: '#8B5CF6' },
  { id: 'node4', label: 'Supabase PostgreSQL', x: 80, y: 76, size: 18, color: '#3B82F6' },
];

const DEFAULT_NETWORK_LINKS: NetworkLink[] = [
  { from: 'hub', to: 'node1' },
  { from: 'hub', to: 'node2' },
  { from: 'hub', to: 'node3' },
  { from: 'hub', to: 'node4' },
  { from: 'node1', to: 'node3' },
];

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
  title = 'Distributed Cloud Mesh Architecture',
  subtitle = 'Decentralized service communication graph',
  nodes = DEFAULT_NETWORK_NODES,
  links = DEFAULT_NETWORK_LINKS,
  width = '100%',
  height = 340,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const edgeColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)';

  const items = nodes && nodes.length > 0 ? nodes : DEFAULT_NETWORK_NODES;
  const connections = links && links.length > 0 ? links : DEFAULT_NETWORK_LINKS;

  const nodeMap = new Map(items.map((n) => [n.id, n]));

  return (
    <div
      style={{
        width,
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '20px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Graph Area */}
      <div style={{ position: 'relative', width: '100%', height: `${height - 90}px` }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {/* Links / Edges */}
          {connections.map((link, idx) => {
            const n1 = nodeMap.get(link.from);
            const n2 = nodeMap.get(link.to);
            if (!n1 || !n2) return null;

            const linkSpring = spring({
              frame: Math.max(0, frame - delayFrames - idx * 3),
              fps,
              config: { damping: 14, stiffness: 85 },
            });

            return (
              <line
                key={idx}
                x1={`${n1.x}%`}
                y1={`${n1.y}%`}
                x2={`${n2.x}%`}
                y2={`${n2.y}%`}
                stroke={edgeColor}
                strokeWidth={2}
                strokeDasharray="4 4"
                opacity={linkSpring}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {items.map((node, idx) => {
          const nodeSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 4),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const nodeColor = node.color || '#0066FF';
          const r = node.size || 20;

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: `translate(-50%, -50%) scale(${nodeSpring})`,
                opacity: nodeSpring,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                zIndex: node.isHub ? 10 : 5,
              }}
            >
              {/* Node Circle */}
              <div
                style={{
                  width: `${r * 2}px`,
                  height: `${r * 2}px`,
                  borderRadius: '50%',
                  backgroundColor: nodeColor,
                  border: `3px solid ${bgColor}`,
                  boxShadow: `0 0 20px ${nodeColor}88`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />

              {/* Node Label */}
              <span
                style={{
                  fontSize: node.isHub ? '13px' : '11px',
                  fontWeight: node.isHub ? 800 : 600,
                  color: textColor,
                  backgroundColor: isDark ? 'rgba(17,24,39,0.85)' : 'rgba(255,255,255,0.85)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
