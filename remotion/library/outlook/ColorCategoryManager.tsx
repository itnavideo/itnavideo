import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ColorCategoryManagerProps {
  categoriesCount?: number;
  activeCategoryName?: string;
}

export const ColorCategoryManager: React.FC<ColorCategoryManagerProps> = (props) => {
  const {
    categoriesCount = 5,
    activeCategoryName = "Red Category (Urgent)",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const categories = [
    { name: 'Red Category', label: 'Urgent Action Required', color: '#ef4444' },
    { name: 'Blue Category', label: 'Client Deliverable', color: '#3b82f6' },
    { name: 'Green Category', label: 'Financial Compliance', color: '#22c55e' },
    { name: 'Orange Category', label: 'Engineering Review', color: '#f97316' },
  ];

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
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Outlook Color Categories</h3>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Cross-Folder Taxonomy</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {categories.map((c, i) => (
          <div key={i} style={{
            backgroundColor: '#1e293b',
            borderRadius: '6px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderLeft: `4px solid ${c.color}`,
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>{c.name}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
