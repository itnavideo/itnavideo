import React from 'react';

export interface RibbonTagProps {
  label: string;
  color?: string;
  textColor?: string;
  variant?: 'solid' | 'soft' | 'outline' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

/**
 * Modern Infographic Ribbon & Category Badge
 */
export const RibbonTag: React.FC<RibbonTagProps> = ({
  label,
  color = '#EA580C',
  textColor,
  variant = 'soft',
  size = 'md',
  icon,
}) => {
  const paddingMap = {
    sm: '3px 8px',
    md: '5px 12px',
    lg: '7px 16px',
  };

  const fontMap = {
    sm: '10px',
    md: '12px',
    lg: '14px',
  };

  const isOutline = variant === 'outline';
  const isSolid = variant === 'solid';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: paddingMap[size],
        borderRadius: variant === 'pill' ? '999px' : '8px',
        fontSize: fontMap[size],
        fontWeight: 650,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: isSolid ? '#FFFFFF' : (textColor || color),
        backgroundColor: isSolid ? color : (isOutline ? 'transparent' : `${color}18`),
        border: isOutline ? `1.5px solid ${color}` : 'none',
      }}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};

export interface ChevronStepArrowProps {
  stepNumber: number | string;
  label: string;
  isActive?: boolean;
  color?: string;
  isDark?: boolean;
}

/**
 * Chevron Step Flow Arrow Badge
 */
export const ChevronStepArrow: React.FC<ChevronStepArrowProps> = ({
  stepNumber,
  label,
  isActive = false,
  color = '#EA580C',
  isDark = false,
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 18px',
        borderRadius: '12px',
        backgroundColor: isActive ? color : (isDark ? 'rgba(30,41,59,0.7)' : '#F1F5F9'),
        color: isActive ? '#FFFFFF' : (isDark ? '#F8FAFC' : '#0F172A'),
        fontWeight: 650,
        fontSize: '13px',
        gap: '8px',
      }}
    >
      <span
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : `${color}25`,
          color: isActive ? '#FFFFFF' : color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 900,
        }}
      >
        {stepNumber}
      </span>
      <span>{label}</span>
    </div>
  );
};

export const ModernInfographicTags = ChevronStepArrow;

