import React from 'react';

interface HeadingProps {
  text: string;
  level?: 'h1' | 'subheading' | 'body' | 'stat';
  fontFamily?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Heading({
  text,
  level = 'h1',
  fontFamily = 'Montserrat, sans-serif',
  color = '#FFFFFF',
  className = '',
  style = {},
}: HeadingProps) {
  let fontSize = 72; // H1 default (64-96px range)
  let fontWeight = 800;

  if (level === 'h1') {
    fontSize = 80;
    fontWeight = 900;
  } else if (level === 'subheading') {
    fontSize = 38; // (32-48px range)
    fontWeight = 700;
  } else if (level === 'body') {
    fontSize = 26; // (22-30px range)
    fontWeight = 500;
  } else if (level === 'stat') {
    fontSize = 96; // (70-120px range)
    fontWeight = 900;
  }

  return (
    <div
      className={`leading-tight tracking-tight uppercase ${className}`}
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        textShadow: '0 2px 10px rgba(0,0,0,0.05)',
        ...style,
      }}
    >
      {text}
    </div>
  );
}

