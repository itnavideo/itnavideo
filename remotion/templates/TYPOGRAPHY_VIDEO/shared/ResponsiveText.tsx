import React from 'react';

/**
 * Calculates a responsive font size based on text length to prevent overflow
 */
export function getResponsiveFontSize(
  text: string,
  baseSize: number,
  minSize: number = 32,
  maxCharThreshold: number = 16
): number {
  if (!text) return baseSize;
  const len = text.trim().length;
  if (len <= maxCharThreshold) return baseSize;
  
  const scale = Math.max(minSize / baseSize, maxCharThreshold / len);
  return Math.round(baseSize * scale);
}

/**
 * Responsive text wrapper with safe boundary constraints
 */
export function ResponsiveText({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        maxWidth: '100%',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
