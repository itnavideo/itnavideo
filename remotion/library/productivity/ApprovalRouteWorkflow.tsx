import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface ApprovalRouteWorkflowProps {
  title?: string;
  [key: string]: any;
}

export const ApprovalRouteWorkflow: React.FC<ApprovalRouteWorkflowProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Capital Expenditure Approval","stages":[{"name":"Submission","actor":"Alex Chen","status":"approved","time":"10:14 AM"},{"name":"Tech Lead Review","actor":"Marcus Vance","status":"approved","time":"11:30 AM"},{"name":"VP Finance","actor":"Elena Rostova","status":"in-review","time":"Pending"},{"name":"Executive Sign-off","actor":"CEO Office","status":"pending","time":"Queued"}],"currentStageIndex":2,"approverName":"Elena Rostova","accentColor":"#8B5CF6","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#3B82F6',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, stages, currentStageIndex, approverName, accentColor, theme } = merged;


  const flowDash = frame * 1.5;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0D0B18' : '#FAF5FF',
      color: theme === 'dark' ? '#F5F3FF' : '#2E1065',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#8B5CF6' }}>Automated Multi-Tier Routing Chain</div>
        </div>
        <span style={{ fontSize: '11px', background: '#8B5CF622', color: '#8B5CF6', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Stage {currentStageIndex + 1} of 4</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginTop: '20px' }}>
        <div style={{ position: 'absolute', left: '20px', right: '20px', top: '24px', height: '3px', background: theme === 'dark' ? '#2E1065' : '#E9D5FF', zIndex: 0 }} />
        {stages.map((stage: any, idx: number) => {
          const isPassed = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '120px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: isPassed ? '#10B981' : isCurrent ? '#8B5CF6' : (theme === 'dark' ? '#1F1738' : '#F3E8FF'),
                border: `2px solid ${isCurrent ? '#C084FC' : 'transparent'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '14px',
                boxShadow: isCurrent ? '0 0 16px #8B5CF688' : 'none'
              }}>
                {isPassed ? '✓' : idx + 1}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '8px', textAlign: 'center' }}>{stage.name}</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', textAlign: 'center' }}>{stage.actor}</div>
              <span style={{ fontSize: '9px', marginTop: '4px', padding: '2px 6px', borderRadius: '4px', background: isPassed ? '#10B98122' : isCurrent ? '#8B5CF622' : '#64748B22', color: isPassed ? '#10B981' : isCurrent ? '#C084FC' : '#94A3B8', fontWeight: 600 }}>
                {stage.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
