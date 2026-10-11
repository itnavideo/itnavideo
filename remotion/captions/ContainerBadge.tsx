// remotion/captions/ContainerBadge.tsx
// Universal Container / Pill / Card Badge component for captions

import React from 'react';

export interface ContainerBadgeProps {
  children: React.ReactNode;
  showBackground?: boolean;
  backgroundColor?: string;
  borderRadius?: number | string;
  padding?: string;
  border?: string;
  backdropFilter?: string;
  boxShadow?: string;
  maxWidth?: number | string;
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  customStyle?: React.CSSProperties;
}

export const ContainerBadge: React.FC<ContainerBadgeProps> = ({
  children,
  showBackground = true,
  backgroundColor = 'rgba(0,0,0,0.65)',
  borderRadius = 16,
  padding = '12px 28px',
  border = 'none',
  backdropFilter,
  boxShadow = '0 4px 20px rgba(0,0,0,0.4)',
  maxWidth = 920,
  alignItems = 'center',
  justifyContent = 'center',
  customStyle,
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems,
        justifyContent,
        gap: '6px 12px',
        maxWidth,
        backgroundColor: showBackground ? backgroundColor : 'transparent',
        borderRadius,
        padding: showBackground ? padding : '0px',
        border: showBackground ? border : 'none',
        backdropFilter: showBackground ? backdropFilter : undefined,
        WebkitBackdropFilter: showBackground ? backdropFilter : undefined,
        boxShadow: showBackground ? boxShadow : undefined,
        lineHeight: 1.15,
        textAlign: 'center',
        ...customStyle,
      }}
    >
      {children}
    </div>
  );
};
