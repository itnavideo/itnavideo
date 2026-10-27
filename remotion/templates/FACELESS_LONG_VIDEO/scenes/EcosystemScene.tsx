import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface EcosystemSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function EcosystemScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
}: EcosystemSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Central hub entrance
  const centerSpring = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });

  const heading = scene.heading || 'COMPLETE SYSTEM IN A BOX';
  const rawItems = scene.listItems && scene.listItems.length >= 2
    ? scene.listItems
    : scene.supportingText
    ? scene.supportingText.split(/[•,\n]+/).map((s) => s.trim()).filter((s) => s.length > 2)
    : ['Foundational Books', 'AI Personal Tutor', 'Practice Projects', 'Action Blueprint'];

  const items = rawItems.slice(0, 4);

  // Satellite node positions around center
  const positions = [
    { label: 'MODULE 1', icon: '📚', x: -380, y: -110 },
    { label: 'MODULE 2', icon: '🤖', x: 380, y: -110 },
    { label: 'MODULE 3', icon: '📝', x: -380, y: 130 },
    { label: 'MODULE 4', icon: '⚡', x: 380, y: 130 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        zIndex: 15,
        fontFamily: bodyFont,
      }}
    >
      {/* SVG Connecting Curved Arrows */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polygon points="0 0, 8 4, 0 8" fill="#00F5D4" />
          </marker>
        </defs>

        {/* Center coordinates: 960, 540 */}
        {/* Top-Left Arrow */}
        <path
          d="M 960 510 C 820 480, 720 420, 640 430"
          fill="none"
          stroke="#00F5D4"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          opacity={interpolate(centerSpring, [0, 1], [0, 0.7])}
          markerEnd="url(#arrowhead)"
        />

        {/* Top-Right Arrow */}
        <path
          d="M 960 510 C 1100 480, 1200 420, 1280 430"
          fill="none"
          stroke="#00F5D4"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          opacity={interpolate(centerSpring, [0, 1], [0, 0.7])}
          markerEnd="url(#arrowhead)"
        />

        {/* Bottom-Left Arrow */}
        <path
          d="M 960 570 C 820 600, 720 660, 640 670"
          fill="none"
          stroke="#00F5D4"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          opacity={interpolate(centerSpring, [0, 1], [0, 0.7])}
          markerEnd="url(#arrowhead)"
        />

        {/* Bottom-Right Arrow */}
        <path
          d="M 960 570 C 1100 600, 1200 660, 1280 670"
          fill="none"
          stroke="#00F5D4"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          opacity={interpolate(centerSpring, [0, 1], [0, 0.7])}
          markerEnd="url(#arrowhead)"
        />
      </svg>

      {/* Central Hub Card (Sandeep Swadia "HARVARD IN A BOX" style) */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '380px',
          borderRadius: '28px',
          border: '4px solid #FFFFFF',
          backgroundColor: '#070B14',
          padding: '32px 28px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 245, 212, 0.25)',
          textAlign: 'center',
          transform: `scale(${interpolate(centerSpring, [0, 1], [0.82, 1.0])})`,
          opacity: centerSpring,
        }}
      >
        {/* Mint Teal Kicker Badge */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#00F5D4',
            color: '#070B14',
            fontSize: '12px',
            fontWeight: 900,
            padding: '3px 12px',
            borderRadius: '4px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '14px',
            transform: 'rotate(-1.5deg)',
          }}
        >
          FRAMEWORK ENGINE
        </div>

        <h2
          style={{
            fontFamily: headingFont,
            fontSize: '28px',
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {heading}
        </h2>
      </div>

      {/* Orbiting Satellite Cards */}
      {items.map((item, idx) => {
        const pos = positions[idx % positions.length];
        const nodeSpring = spring({
          frame: Math.max(0, frame - (8 + idx * 6)),
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        const nodeScale = interpolate(nodeSpring, [0, 1], [0.75, 1.0]);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              zIndex: 8,
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${nodeScale})`,
              opacity: nodeSpring,
              width: '300px',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(16px)',
              padding: '20px 22px',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75), 0 0 20px rgba(0, 245, 212, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 245, 212, 0.15)',
                border: '1px solid rgba(0, 245, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              {pos.icon}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#00F5D4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {pos.label}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, marginTop: '2px' }}>
                {item}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
