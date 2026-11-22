import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessValidationRuleValidatorProps {
  ruleExpression?: string;
  validationText?: string;
  testedValue?: string;
}

export const AccessValidationRuleValidator: React.FC<AccessValidationRuleValidatorProps> = (props) => {
  const {
    ruleExpression = ">= 0 And <= 100",
    validationText = "Discount percentage must be between 0% and 100%.",
    testedValue = "125%",
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
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Field Validation Rule Engine</h3>
        <span style={{ backgroundColor: '#dc2626', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
          RULE VIOLATION
        </span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>VALIDATION RULE:</div>
          <code style={{ fontSize: '13px', color: '#38bdf8' }}>{ruleExpression}</code>
        </div>

        {/* Access Modal Error Dialog */}
        <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '14px 18px', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', borderLeft: '4px solid #dc2626' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: '#dc2626', marginBottom: '4px' }}>Microsoft Access Error:</div>
          <div style={{ fontSize: '12px', color: '#334155' }}>{validationText}</div>
        </div>
      </div>
    </div>
  );
};
