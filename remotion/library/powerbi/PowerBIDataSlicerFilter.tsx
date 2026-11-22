import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIDataSlicerFilterProps {
  selectedSlicer?: string;
  themeColor?: string;
}

export const PowerBIDataSlicerFilter: React.FC<PowerBIDataSlicerFilterProps> = (props) => {
  const {
    selectedSlicer = "Year-To-Date (YTD)",
    themeColor = "#F2C811",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const options = ['Last 30 Days', 'Quarter-To-Date', 'Year-To-Date (YTD)', 'All Time'];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0b1120',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Interactive Tile Slicer Filter</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Cross-Filtering Active</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', flex: 1, alignItems: 'center' }}>
        {options.map((opt) => {
          const isSelected = opt === selectedSlicer;
          return (
            <div key={opt} style={{
              flex: 1,
              backgroundColor: isSelected ? themeColor : '#1e293b',
              color: isSelected ? '#111827' : '#f8fafc',
              border: isSelected ? '2px solid #F2C811' : '1px solid #334155',
              borderRadius: '8px',
              padding: '16px 12px',
              textAlign: 'center',
              fontWeight: isSelected ? 800 : 500,
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: isSelected ? '0 4px 16px rgba(242, 200, 17, 0.3)' : 'none',
              transition: 'all 0.2s',
            }}>
              {opt}
            </div>
          );
        })}
      </div>
    </div>
  );
};
