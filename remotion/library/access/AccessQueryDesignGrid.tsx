import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessQueryDesignGridProps {
  queryName?: string;
  sourceTable?: string;
  filterCriteria?: string;
  recordsCount?: number;
  themeColor?: string;
}

export const AccessQueryDesignGrid: React.FC<AccessQueryDesignGridProps> = (props) => {
  const {
    queryName = "qry_HighValueEnterpriseOrders",
    sourceTable = "tbl_Orders",
    filterCriteria = "> 5000 AND [Status]=\"Shipped\"",
    recordsCount = 384,
    themeColor = "#A4373A",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c101c',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Query By Example (QBE Grid)</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>{recordsCount} Output Rows</span>
      </div>

      {/* QBE Design Grid Table */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        color: '#1e293b',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Table Rows: Field, Table, Sort, Show, Criteria */}
        <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', backgroundColor: '#f1f5f9', fontWeight: 700, fontSize: '11px', padding: '8px', borderBottom: '1px solid #cbd5e1' }}>
          <span>Design Row</span>
          <span>OrderID</span>
          <span>CustomerID</span>
          <span>OrderDate</span>
          <span>TotalAmount</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', fontSize: '12px', padding: '8px', borderBottom: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontWeight: 600 }}>Table:</span>
          <span>{sourceTable}</span>
          <span>{sourceTable}</span>
          <span>{sourceTable}</span>
          <span>{sourceTable}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', fontSize: '12px', padding: '8px', borderBottom: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontWeight: 600 }}>Sort:</span>
          <span>(not sorted)</span>
          <span>(not sorted)</span>
          <span>Descending</span>
          <span>(not sorted)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', fontSize: '12px', padding: '8px', borderBottom: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontWeight: 600 }}>Show:</span>
          <span>☑</span>
          <span>☑</span>
          <span>☑</span>
          <span>☑</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', fontSize: '12px', padding: '8px', backgroundColor: 'rgba(22, 163, 74, 0.08)' }}>
          <span style={{ color: '#16a34a', fontWeight: 700 }}>Criteria:</span>
          <span></span>
          <span></span>
          <span>{'> #01/01/2025#'}</span>
          <span style={{ color: '#16a34a', fontWeight: 700 }}>{'> 5000'}</span>
        </div>

        <div style={{ marginTop: 'auto', backgroundColor: '#0f172a', color: '#cbd5e1', padding: '10px 14px', fontSize: '11px', fontFamily: 'monospace' }}>
          SELECT OrderID, CustomerID, OrderDate, TotalAmount FROM tbl_Orders WHERE TotalAmount &gt; 5000;
        </div>
      </div>
    </div>
  );
};
