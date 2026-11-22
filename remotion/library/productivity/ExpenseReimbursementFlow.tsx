import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface ExpenseReimbursementFlowProps {
  title?: string;
  [key: string]: any;
}

export const ExpenseReimbursementFlow: React.FC<ExpenseReimbursementFlowProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Expense Claim #EXP-8841","claimId":"EXP-8841","totalAmount":"$1,248.50","currency":"USD","items":[{"desc":"AWS Lambda Render Credits","amount":"$540.00","cat":"Cloud Infra"},{"desc":"Flight to Tech Summit NYC","amount":"$480.00","cat":"Travel"},{"desc":"Groq Whisper API Quota","amount":"$228.50","cat":"AI Compute"}],"status":"Approved & Reimbursed","accentColor":"#10B981","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, claimId, totalAmount, currency, items, status, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F172A' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Corporate Finance Audit Workflow</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#10B981' }}>{totalAmount}</div>
          <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>✓ {status}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {items.map((it: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            padding: '12px 14px', borderRadius: '8px', border: '1px solid ' + (theme === 'dark' ? '#334155' : '#E2E8F0'),
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700 }}>{it.desc}</div>
              <span style={{ fontSize: '10px', color: '#64748B' }}>{it.cat}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>{it.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
