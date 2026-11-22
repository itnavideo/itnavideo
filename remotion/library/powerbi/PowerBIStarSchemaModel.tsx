import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIStarSchemaModelProps {
  factTable?: string;
  dimTablesCount?: number;
  relationshipsType?: string;
  themeColor?: string;
}

export const PowerBIStarSchemaModel: React.FC<PowerBIStarSchemaModelProps> = (props) => {
  const {
    factTable = "FactInternetSales",
    dimTablesCount = 4,
    relationshipsType = "Single Direction Filter (1:*)",
    themeColor = "#F2C811",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  const dims = ['DimProduct', 'DimCustomer', 'DimDate', 'DimTerritory'];

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
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Power BI Model View • Star Schema</h3>
        <span style={{ fontSize: '11px', color: '#F2C811', backgroundColor: 'rgba(242, 200, 17, 0.15)', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
          {relationshipsType}
        </span>
      </div>

      {/* Model Canvas */}
      <div style={{
        flex: 1,
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        border: '1px solid #334155',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'relative',
      }}>
        {/* Dimension Tables Row (Top) */}
        <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'space-around' }}>
          {dims.map((dim) => (
            <div key={dim} style={{
              backgroundColor: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '11px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              <div style={{ fontWeight: 700, color: '#38bdf8' }}>{dim}</div>
              <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>1 (Dimension)</div>
            </div>
          ))}
        </div>

        {/* Central Connecting Hub Arrow */}
        <div style={{ fontSize: '16px', color: '#F2C811' }}>
          ⬇️ ⬇️ ⬇️ ⬇️
        </div>

        {/* Fact Table (Center Bottom) */}
        <div style={{
          backgroundColor: '#0f172a',
          border: '2px solid #F2C811',
          borderRadius: '8px',
          padding: '14px 28px',
          textAlign: 'center',
          boxShadow: '0 0 16px rgba(242, 200, 17, 0.25)',
        }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#F2C811' }}>{factTable}</div>
          <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>
            * (Fact Table • High Cardinality Grain)
          </div>
        </div>
      </div>
    </div>
  );
};
