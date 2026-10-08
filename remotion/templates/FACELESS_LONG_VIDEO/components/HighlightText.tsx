import React from 'react';

interface HighlightTextProps {
  text: string;
  highlightedWords?: string[];
  accentColor?: string;
  fontFamily?: string;
  className?: string;
}

export function HighlightText({
  text,
  highlightedWords = [],
  accentColor = '#38BDF8',
  fontFamily = 'Inter, sans-serif',
  className = '',
}: HighlightTextProps) {
  if (!text) return null;

  const words = text.split(/\s+/);
  const highlightSet = new Set(
    highlightedWords.map((w) => w.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''))
  );

  return (
    <div className={`text-2xl font-semibold text-slate-200 leading-relaxed ${className}`} style={{ fontFamily }}>
      {words.map((word, idx) => {
        const clean = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        const isHighlighted = highlightSet.has(clean);

        return (
          <span key={idx}>
            {isHighlighted ? (
              <span
                className="inline-block px-2 py-0.5 rounded-lg font-bold text-white shadow-md mx-0.5"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 0 16px ${accentColor}60`,
                }}
              >
                {word}
              </span>
            ) : (
              <span>{word}</span>
            )}
            {' '}
          </span>
        );
      })}
    </div>
  );
}

