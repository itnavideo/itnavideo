import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIDAXMeasureCardProps {
  measureName?: string;
  daxFormula?: string;
  evaluatedResult?: string;
  tableName?: string;
  themeColor?: string;
}

export const PowerBIDAXMeasureCard: React.FC<PowerBIDAXMeasureCardProps> = (props) => {
  const {
    measureName = "Total Sales YTD",
    daxFormula = "TOTALYTD(SUM(FactSales[RevenueUSD]), DimDate[FullDateAlternateKey])",
    evaluatedResult = "$48,250,900 USD",
    tableName = "FactSales",
    themeColor = "#F2C811",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      opacity: entrance,
      transform: `translateY(${(1 - entrance) * 20}px)`,
    }}>
      {/* Formula Bar Header */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px 8px 0 0',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #334155',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            backgroundColor: themeColor,
            color: '#111827',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '14px',
          }}>∑</div>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>DAX Measure • {measureName}</span>
        </div>
        <span style={{ fontSize: '11px', color: '#94a3b8', backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px' }}>
          Table: {tableName}
        </span>
      </div>

      {/* Code Editor Body */}
      <div style={{
        backgroundColor: '#1e293b',
        padding: '20px',
        fontFamily: 'Consolas, monospace',
        fontSize: '13px',
        lineHeight: '1.7',
        borderBottom: '1px solid #334155',
      }}>
        <span style={{ color: '#F2C811', fontWeight: 700 }}>{measureName}</span> ={' '}
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>TOTALYTD</span>(
        <br />
        &nbsp;&nbsp;<span style={{ color: '#38bdf8', fontWeight: 600 }}>SUM</span>(
        <span style={{ color: '#4ade80' }}>FactSales[RevenueUSD]</span>),
        <br />
        &nbsp;&nbsp;<span style={{ color: '#4ade80' }}>DimDate[Date]</span>
        <br />
        )
      </div>

      {/* Evaluation Output Result */}
      <div style={{
        flex: 1,
        backgroundColor: '#0f172a',
        borderRadius: '0 0 8px 8px',
        border: '1px solid #334155',
        borderTop: 'none',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Current Filter Context Output</div>
        <div style={{ fontSize: '36px', fontWeight: 900, color: '#F2C811', marginTop: '6px' }}>
          {evaluatedResult}
        </div>
        <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '4px' }}>
          ● Engine execution time: 14ms (In-Memory VertiPaq Columnar Storage)
        </div>
      </div>
    </div>
  );
};
