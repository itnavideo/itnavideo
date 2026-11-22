import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface JSONSchemaDocumentValidatorProps {
  schemaName?: string;
  validationStatus?: string;
}

export const JSONSchemaDocumentValidator: React.FC<JSONSchemaDocumentValidatorProps> = (props) => {
  const {
    schemaName = "RemotionJobPayload.schema.json",
    validationStatus = "100% Compliant (0 Validation Errors)",
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
      gap: '14px',
      fontFamily: 'Consolas, monospace',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#facc15' }}>JSON Schema Validator</span>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>✓ {validationStatus}</span>
      </div>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '6px', padding: '16px', flex: 1, fontSize: '11px', lineHeight: '1.7', color: '#cbd5e1', border: '1px solid #334155' }}>
        &#123;<br />
        &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>"schema"</span>: "{schemaName}",<br />
        &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>"mode"</span>: "AUTO_CAPTION_GENERATOR",<br />
        &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>"fps"</span>: 30,<br />
        &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>"durationInFrames"</span>: 2700<br />
        &#125;
      </div>
    </div>
  );
};
