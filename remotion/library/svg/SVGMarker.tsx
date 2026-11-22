import React from 'react';

export interface SVGMarkerProps {
  id: string;
  type?: 'arrow-head' | 'stealth-arrow' | 'circle-dot' | 'diamond' | 'bar';
  color?: string;
  size?: number;
}

/**
 * SVGMarker — Vector path endpoint marker generator.
 * Produces crisp arrowhead tips, circular terminal dots, and diamond pins
 * referenced via markerEnd="url(#id)" or markerStart="url(#id)".
 */
export function SVGMarker({
  id,
  type = 'arrow-head',
  color = '#10b981',
  size = 8,
}: SVGMarkerProps) {
  if (type === 'stealth-arrow') {
    return (
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth={size}
        markerHeight={size}
        orient="auto-start-reverse"
      >
        <path d="M 0 1 L 10 5 L 0 9 L 3 5 Z" fill={color} />
      </marker>
    );
  }

  if (type === 'circle-dot') {
    return (
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth={size}
        markerHeight={size}
        orient="auto"
      >
        <circle cx="5" cy="5" r="4" fill={color} />
      </marker>
    );
  }

  if (type === 'diamond') {
    return (
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth={size}
        markerHeight={size}
        orient="auto"
      >
        <polygon points="5,0 10,5 5,10 0,5" fill={color} />
      </marker>
    );
  }

  // Classic triangle arrow-head
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="7"
      refY="5"
      markerWidth={size}
      markerHeight={size}
      orient="auto-start-reverse"
    >
      <path d="M 0 1 L 10 5 L 0 9 z" fill={color} />
    </marker>
  );
}
