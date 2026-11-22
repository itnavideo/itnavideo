import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TreeNode {
  label: string;
  badge?: string;
  color?: string;
  children?: TreeNode[];
}

export interface TreeDiagramProps {
  title?: string;
  subtitle?: string;
  root?: TreeNode;
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_TREE_ROOT: TreeNode = {
  label: 'Itnavideo Engine',
  badge: 'Core Root',
  color: '#0066FF',
  children: [
    {
      label: '16:9 Studios',
      badge: 'Widescreen',
      color: '#2563EB',
      children: [
        { label: 'Faceless Video', color: '#3B82F6' },
        { label: 'Book Summary', color: '#3B82F6' },
        { label: 'YouTube Subtitles', color: '#3B82F6' },
      ],
    },
    {
      label: '9:16 Studios',
      badge: 'Vertical Reels',
      color: '#10B981',
      children: [
        { label: 'Auto Caption', color: '#059669' },
        { label: 'Compare Explainer', color: '#059669' },
        { label: 'Whiteboard Maker', color: '#059669' },
      ],
    },
  ],
};

export const TreeDiagram: React.FC<TreeDiagramProps> = ({
  title = 'Hierarchical Branching Tree',
  subtitle = 'System taxonomy & module breakdown',
  root = DEFAULT_TREE_ROOT,
  width = '100%',
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const nodeBg = isDark ? '#1E293B' : '#F8FAFC';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const rootSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 95 },
  });

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
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Tree Visualization */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* Root Node */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: nodeBg,
            border: `2px solid ${root.color || '#0066FF'}`,
            borderRadius: '16px',
            boxShadow: `0 4px 20px ${(root.color || '#0066FF')}33`,
            transform: `scale(${rootSpring})`,
            opacity: rootSpring,
            textAlign: 'center',
          }}
        >
          {root.badge && (
            <span style={{ fontSize: '10px', fontWeight: 800, color: root.color, textTransform: 'uppercase', display: 'block' }}>
              {root.badge}
            </span>
          )}
          <span style={{ fontSize: '16px', fontWeight: 800, color: textColor }}>{root.label}</span>
        </div>

        {/* Stem line */}
        <div style={{ width: '2px', height: '24px', backgroundColor: borderColor, opacity: rootSpring }} />

        {/* Level 1 Children Branches */}
        {root.children && (
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', width: '100%', position: 'relative' }}>
            {root.children.map((child, idx) => {
              const childSpring = spring({
                frame: Math.max(0, frame - delayFrames - 8 - idx * 5),
                fps,
                config: { damping: 14, stiffness: 90 },
              });

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '280px' }}>
                  {/* Branch Node */}
                  <div
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      backgroundColor: nodeBg,
                      border: `1.5px solid ${child.color || '#2563EB'}`,
                      borderRadius: '14px',
                      transform: `scale(${childSpring})`,
                      opacity: childSpring,
                      textAlign: 'center',
                    }}
                  >
                    {child.badge && (
                      <span style={{ fontSize: '9px', fontWeight: 800, color: child.color, textTransform: 'uppercase', display: 'block' }}>
                        {child.badge}
                      </span>
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: textColor }}>{child.label}</span>
                  </div>

                  {/* Sub-children Leaf nodes */}
                  {child.children && (
                    <>
                      <div style={{ width: '2px', height: '16px', backgroundColor: borderColor, opacity: childSpring }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        {child.children.map((leaf, leafIdx) => {
                          const leafSpring = spring({
                            frame: Math.max(0, frame - delayFrames - 16 - leafIdx * 4),
                            fps,
                            config: { damping: 14, stiffness: 95 },
                          });

                          return (
                            <div
                              key={leafIdx}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                border: `1px solid ${borderColor}`,
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: textColor,
                                textAlign: 'center',
                                transform: `translateY(${(1 - leafSpring) * 10}px)`,
                                opacity: leafSpring,
                              }}
                            >
                              {leaf.label}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
