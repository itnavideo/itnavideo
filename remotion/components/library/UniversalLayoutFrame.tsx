import React from 'react';

export interface UniversalLayoutFrameProps {
  layoutFrameId?: string;
  frameStyle?: string;
  topicTitle?: string;
  children?: React.ReactNode;
}

export const UniversalLayoutFrame: React.FC<UniversalLayoutFrameProps> = ({
  children,
}) => {
  if (children) {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#020617',
        backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};
