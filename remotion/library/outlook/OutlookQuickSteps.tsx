import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OutlookQuickStepsProps {
  activeStepName?: string;
  themeColor?: string;
}

export const OutlookQuickSteps: React.FC<OutlookQuickStepsProps> = (props) => {
  const {
    activeStepName = "Team Email",
    themeColor = "#0078D4",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { name: 'Team Email', icon: '👥', action: 'New email to Core Engineering' },
    { name: 'Forward to Manager', icon: '↗️', action: 'Forward with high importance' },
    { name: 'Done & Archive', icon: '📥', action: 'Mark read & move to Archive' },
    { name: 'Create Task', icon: '📋', action: 'Flag & copy to Microsoft To Do' },
  ];

  const activeIndex = Math.min(Math.floor(frame / 45) % steps.length, steps.length - 1);
  const currentStep = steps[activeIndex]?.name || activeStepName;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c1322',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Outlook Quick Steps Gallery</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>1-Click Automation Deck</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', flex: 1 }}>
        {steps.map((st) => {
          const isActive = st.name === currentStep;
          return (
            <div key={st.name} style={{
              backgroundColor: isActive ? 'rgba(0, 120, 212, 0.18)' : '#1e293b',
              border: isActive ? '2px solid #0078D4' : '1px solid #334155',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isActive ? '0 4px 16px rgba(0, 120, 212, 0.3)' : 'none',
              transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{st.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isActive ? '#38bdf8' : '#f8fafc' }}>{st.name}</span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '8px 0 0 0' }}>{st.action}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
