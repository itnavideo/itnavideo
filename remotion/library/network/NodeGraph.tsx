import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GraphNode {
  id: string;
  label: string;
  x: number; // percentage
  y: number; // percentage
  radius?: number;
  color?: string;
  cluster?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  label?: string;
}

export interface NodeGraphProps {
  title?: string;
  subtitle?: string;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  width?: number | string;
  height?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_GRAPH_NODES: GraphNode[] = [
  { id: 'gemini', label: 'Gemini 2.0 Flash', x: 50, y: 30, radius: 26, color: '#0066FF', cluster: 'AI Core' },
  { id: 'groq', label: 'Groq Whisper STT', x: 22, y: 65, radius: 22, color: '#10B981', cluster: 'Audio' },
  { id: 'remotion', label: 'Remotion Cloud', x: 78, y: 65, radius: 24, color: '#F59E0B', cluster: 'Render' },
  { id: 's3', label: 'AWS S3 Assets', x: 34, y: 88, radius: 18, color: '#8B5CF6', cluster: 'Storage' },
  { id: 'supabase', label: 'Supabase DB', x: 66, y: 88, radius: 18, color: '#06B6D4', cluster: 'Database' },
];

const DEFAULT_GRAPH_EDGES: GraphEdge[] = [
  { source: 'gemini', target: 'groq', label: 'Transcription' },
  { source: 'gemini', target: 'remotion', label: 'Scene Props' },
  { source: 'groq', target: 's3', label: 'Audio Mono' },
  { source: 'remotion', target: 's3', label: 'Render Upload' },
  { source: 'remotion', target: 'supabase', label: 'Job Complete' },
];

export const NodeGraph: React.FC<NodeGraphProps> = ({
  title = 'Autonomous Agent Topological Node Graph',
  subtitle = 'Multi-agent orchestration and data communication matrix',
  nodes = DEFAULT_GRAPH_NODES,
  edges = DEFAULT_GRAPH_EDGES,
  width = '100%',
  height = 360,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const edgeColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';

  const items = nodes && nodes.length > 0 ? nodes : DEFAULT_GRAPH_NODES;
  const linkList = edges && edges.length > 0 ? edges : DEFAULT_GRAPH_EDGES;

  const nodeMap = new Map(items.map((n) => [n.id, n]));

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
        <div style={{ marginBottom: '20px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* SVG Canvas for Edges */}
      <div style={{ position: 'relative', width: '100%', height: `${height - 90}px` }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {linkList.map((edge, idx) => {
            const n1 = nodeMap.get(edge.source);
            const n2 = nodeMap.get(edge.target);
            if (!n1 || !n2) return null;

            const edgeSpring = spring({
              frame: Math.max(0, frame - delayFrames - idx * 3),
              fps,
              config: { damping: 14, stiffness: 85 },
            });

            return (
              <g key={idx} opacity={edgeSpring}>
                <line
                  x1={`${n1.x}%`}
                  y1={`${n1.y}%`}
                  x2={`${n2.x}%`}
                  y2={`${n2.y}%`}
                  stroke={edgeColor}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Nodes */}
        {items.map((node, idx) => {
          const nodeSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 4),
            fps,
            config: { damping: 13, stiffness: 95 },
          });

          const nodeColor = node.color || '#0066FF';
          const r = node.radius || 22;

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
                zIndex: 10,
              }}
            >
              {/* Outer Pulsing Halo */}
              <div
                style={{
                  width: `${r * 2}px`,
                  height: `${r * 2}px`,
                  borderRadius: '50%',
                  backgroundColor: nodeColor,
                  border: `3px solid ${bgColor}`,
                  boxShadow: `0 0 24px ${nodeColor}88`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />

              {/* Node Title Badge */}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: textColor,
                  backgroundColor: isDark ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.9)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${borderColor}`,
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
