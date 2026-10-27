import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface WorkflowSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function WorkflowScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
}: WorkflowSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered entrances
  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const node1Spring = spring({ frame: Math.max(0, frame - 6), fps, config: { damping: 13, stiffness: 100 } });
  const phoneSpring = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 13, stiffness: 90 } });
  const node2Spring = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 13, stiffness: 100 } });
  const node3Spring = spring({ frame: Math.max(0, frame - 24), fps, config: { damping: 13, stiffness: 100 } });

  // Breathing float on central phone
  const phoneFloatY = Math.sin((frame / fps) * 2.2) * 5;

  // Waveform animation
  const waveBars = [0.4, 0.7, 1.0, 0.6, 0.9, 0.5, 0.8];

  const heading = scene.heading || 'MY AI EMPLOYEE PIPELINE';
  const supportingText = scene.supportingText || 'Handles incoming calls, solves queries & schedules bookings 24/7';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 80px',
        zIndex: 15,
        fontFamily: bodyFont,
      }}
    >
      {/* Top Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '42px',
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-25, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 87, 34, 0.12)',
            border: '1px solid rgba(255, 87, 34, 0.35)',
            color: '#FFA000',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          <span>🤖</span>
          <span>AUTONOMOUS AGENT WORKFLOW</span>
        </div>

        <h1
          style={{
            fontFamily: headingFont,
            fontSize: '44px',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.85)',
          }}
        >
          {heading}
        </h1>
        <p style={{ fontSize: '15px', color: '#94A3B8', margin: '8px 0 0 0', fontWeight: 600 }}>
          {supportingText}
        </p>
      </div>

      {/* Horizontal Pipeline Workflow Track */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          width: '100%',
          maxWidth: '1240px',
        }}
      >
        {/* NODE 1: Inbound Calls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            opacity: node1Spring,
            transform: `scale(${interpolate(node1Spring, [0, 1], [0.8, 1])})`,
          }}
        >
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '4px solid #0F172A',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Phone receiver icon with sound rings */}
            <span style={{ fontSize: '42px' }}>📞</span>
            <div
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#FF5722',
                color: '#FFF',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                fontSize: '12px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(255,87,34,0.8)',
              }}
            >
              24/7
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', display: 'block' }}>
              Incoming Calls
            </span>
            <span style={{ fontSize: '11px', color: '#FF7043', fontWeight: 800 }}>TRIGGER ➔</span>
          </div>
        </div>

        {/* Arrow 1 */}
        <div style={{ fontSize: '24px', color: '#FF5722', fontWeight: 900, opacity: node1Spring }}>➔</div>

        {/* NODE 2: HERO AI AGENT SMARTPHONE */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `translateY(${phoneFloatY}px) scale(${interpolate(phoneSpring, [0, 1], [0.85, 1])})`,
            opacity: phoneSpring,
          }}
        >
          <div
            style={{
              width: '270px',
              height: '460px',
              borderRadius: '40px',
              border: '5px solid #475569',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 45px rgba(255,87,34,0.3)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              position: 'relative',
            }}
          >
            {/* Dynamic Island */}
            <div
              style={{
                width: '74px',
                height: '18px',
                backgroundColor: '#000000',
                borderRadius: '12px',
                alignSelf: 'center',
                marginBottom: '14px',
              }}
            />

            {/* AI Agent Call Header */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em' }}>
                AI Employee
              </div>
              <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: 800, marginTop: '2px' }}>
                ● Active Call (00:42)
              </div>
            </div>

            {/* Circular Audio Waveform Visualizer */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  backgroundColor: '#F0F9FF',
                  border: '3px solid #0284C7',
                  boxShadow: '0 0 30px rgba(2, 132, 199, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                {waveBars.map((multiplier, idx) => {
                  const pulse = Math.abs(Math.sin((frame / fps) * 6 + idx * 0.8)) * multiplier;
                  const barHeight = Math.max(12, pulse * 55);
                  return (
                    <div
                      key={idx}
                      style={{
                        width: '5px',
                        height: `${barHeight}px`,
                        backgroundColor: '#0284C7',
                        borderRadius: '9999px',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* In-Call Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '12px 0 6px 0',
              }}
            >
              {/* Mic button */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                🎙️
              </div>
              {/* End call red button */}
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.5)',
                }}
              >
                ✕
              </div>
              {/* Speaker button */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                🔊
              </div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 800, marginTop: '12px' }}>
            VOICE AGENT COGNITION
          </div>
        </div>

        {/* Arrow 2 */}
        <div style={{ fontSize: '24px', color: '#FF5722', fontWeight: 900, opacity: node2Spring }}>➔</div>

        {/* NODE 3: Answers Questions (Knowledge / FAQ) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            opacity: node2Spring,
            transform: `scale(${interpolate(node2Spring, [0, 1], [0.8, 1])})`,
          }}
        >
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '4px solid #0F172A',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '42px' }}>💬</span>
            <div
              style={{
                position: 'absolute',
                bottom: '-4px',
                backgroundColor: '#38BDF8',
                color: '#070B14',
                borderRadius: '8px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: 900,
              }}
            >
              FAQ
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', display: 'block' }}>
              Live Questions
            </span>
            <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 800 }}>KNOWLEDGE BASE</span>
          </div>
        </div>

        {/* Arrow 3 */}
        <div style={{ fontSize: '24px', color: '#FF5722', fontWeight: 900, opacity: node3Spring }}>➔</div>

        {/* NODE 4: Calendar Bookings (Final Outcome) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            opacity: node3Spring,
            transform: `scale(${interpolate(node3Spring, [0, 1], [0.8, 1])})`,
          }}
        >
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '4px solid #10B981',
              boxShadow: '0 15px 35px rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '42px' }}>📅</span>
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#10B981',
                color: '#FFF',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                fontSize: '14px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(16,185,129,0.8)',
              }}
            >
              ✓
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', display: 'block' }}>
              Instant Bookings
            </span>
            <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 800 }}>REVENUE SECURED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
