import React from 'react';

interface ConnectorProps {
  color?: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function Connector({
  color = '#38BDF8',
  orientation = 'vertical',
  className = '',
}: ConnectorProps) {
  return (
    <div
      className={`rounded-full opacity-60 ${className}`}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 12px ${color}`,
        width: orientation === 'vertical' ? '4px' : '60px',
        height: orientation === 'vertical' ? '60px' : '4px',
      }}
    />
  );
}

