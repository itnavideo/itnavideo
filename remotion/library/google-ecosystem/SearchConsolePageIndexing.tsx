import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface SearchConsolePageIndexingProps {
  title?: string;
  [key: string]: any;
}

export const SearchConsolePageIndexing: React.FC<SearchConsolePageIndexingProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Page Indexing Coverage","indexedPages":1420,"notIndexedPages":84,"reasons":[{"reason":"Crawled - currently not indexed","count":42},{"reason":"Page with redirect","count":26},{"reason":"Excluded by noindex tag","count":16}],"accentColor":"#34A853","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, indexedPages, notIndexedPages, reasons, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#202124' : '#FFFFFF',
      color: theme === 'dark' ? '#E8EAED' : '#202124',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Roboto, Arial, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>Index Status & Crawl Diagnostics</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
          <span style={{ color: '#34A853', fontWeight: 700 }}>✓ {indexedPages} Indexed</span>
          <span style={{ color: '#EA4335', fontWeight: 700 }}>✕ {notIndexedPages} Not Indexed</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#9AA0A6', marginBottom: '4px' }}>Why pages aren't indexed:</div>
        {reasons.map((r: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#303134' : '#F1F3F4',
            padding: '12px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontSize: '12px' }}>{r.reason}</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#EA4335' }}>{r.count} pages</span>
          </div>
        ))}
      </div>
    </div>
  );
};
