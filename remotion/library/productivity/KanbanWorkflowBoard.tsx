import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface KanbanWorkflowBoardProps {
  title?: string;
  [key: string]: any;
}

export const KanbanWorkflowBoard: React.FC<KanbanWorkflowBoardProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Sprint Workflow Board","columns":[{"name":"To Do","limit":5,"cards":["Refactor Auth API","Design Style Guide"]},{"name":"In Progress","limit":3,"cards":["Remotion Player v2","Webhook Handler"]},{"name":"Done","limit":10,"cards":["Setup Cloud Run","Tailwind Config"]}],"accentColor":"#3B82F6","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, columns, accentColor, theme } = merged;


  const colProgress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const cardFloat = Math.sin(frame / 12) * 3;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#090D16' : '#F8FAFC',
      color: theme === 'dark' ? '#F1F5F9' : '#0F172A',
      padding: '28px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${accentColor}22`, border: `1.5px solid ${accentColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.2"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Agile Workflow & Card Progression</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: '#22C55E22', color: '#22C55E', fontWeight: 600 }}>Active Sprint 42</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', flex: 1 }}>
        {columns.map((col: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#111827' : '#FFFFFF',
            borderRadius: '12px', border: '1px solid ' + (theme === 'dark' ? '#1F2937' : '#E2E8F0'),
            padding: '16px', display: 'flex', flexDirection: 'column', opacity: colProgress
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid ' + (theme === 'dark' ? '#1F2937' : '#E2E8F0'), paddingBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>{col.name}</span>
              <span style={{ fontSize: '11px', color: '#64748B', background: theme === 'dark' ? '#1F2937' : '#F1F5F9', padding: '2px 8px', borderRadius: '12px' }}>
                {col.cards.length}/{col.limit}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.cards.map((card: string, cIdx: number) => (
                <div key={cIdx} style={{
                  background: theme === 'dark' ? '#1E293B' : '#F8FAFC',
                  borderRadius: '8px', padding: '12px', border: '1px solid ' + (theme === 'dark' ? '#334155' : '#CBD5E1'),
                  transform: idx === 1 && cIdx === 0 ? `translateY(${cardFloat}px)` : 'none',
                  boxShadow: idx === 1 && cIdx === 0 ? `0 8px 16px ${accentColor}33` : 'none'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{card}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: accentColor, fontWeight: 700 }}>P{cIdx + 1}</span>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: accentColor, color: '#FFF', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      U{cIdx + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
