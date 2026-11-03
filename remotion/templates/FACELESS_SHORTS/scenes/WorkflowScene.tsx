import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface WorkflowSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

/* ───────────────────────── SVG Icons (100% Lambda-safe) ───────────────────────── */

function RobotIcon({ size = 20, color = '#FFA000' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16.01" />
      <line x1="16" y1="16" x2="16" y2="16.01" />
    </svg>
  );
}

function PhoneIcon({ size = 32, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ChatIcon({ size = 32, color = '#0284C7' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CalendarCheckIcon({ size = 32, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 16 12 19 16 14" />
    </svg>
  );
}

function MicIcon({ size = 18, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function VolumeIcon({ size = 18, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function ArrowSvg({ size = 20, color = '#FF5722', vertical = false }: { size?: number; color?: string; vertical?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: vertical ? 'rotate(90deg)' : 'none' }}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function WorkflowScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
}: WorkflowSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;
  const isDark = palette?.isDark ?? true;

  const bg = isDark ? (palette?.background || '#090D16') : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';

  // Staggered springs
  const headerSpring = spring({ frame: currentFrame, fps, config: { damping: 14, stiffness: 110 } });
  const node1Spring = spring({ frame: Math.max(0, currentFrame - 6), fps, config: { damping: 13, stiffness: 100 } });
  const heroSpring  = spring({ frame: Math.max(0, currentFrame - 12), fps, config: { damping: 13, stiffness: 90 } });
  const node2Spring = spring({ frame: Math.max(0, currentFrame - 18), fps, config: { damping: 13, stiffness: 100 } });
  const node3Spring = spring({ frame: Math.max(0, currentFrame - 24), fps, config: { damping: 13, stiffness: 100 } });

  // Floating ambient motion
  const heroFloatY = Math.sin((currentFrame / fps) * 2.2) * (4 * s);

  // Waveform bars
  const waveBars = [0.4, 0.7, 1.0, 0.6, 0.9, 0.5, 0.8];

  const heading = scene.heading || 'AUTOMATED WORKFLOW PIPELINE';
  const supportingText = scene.supportingText || 'Handles incoming calls, solves queries & schedules bookings 24/7';

  // Extract custom steps if blueprint provides listItems
  const steps = scene.listItems && scene.listItems.length >= 3 ? scene.listItems : [
    'Inbound Trigger',
    'AI Intelligence',
    'Knowledge Search',
    'Instant Booking',
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isPortrait ? `${160 * s}px ${50 * s}px ${180 * s}px` : `${60 * s}px ${80 * s}px`,
        backgroundColor: bg,
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: bodyFont,
      }}
    >
      {/* ── Top Header ── */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isPortrait ? `${28 * s}px` : `${36 * s}px`,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-20 * s, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: `${8 * s}px`,
            padding: `${6 * s}px ${18 * s}px`,
            borderRadius: `${999 * s}px`,
            backgroundColor: isDark ? 'rgba(255, 160, 0, 0.12)' : 'rgba(255, 160, 0, 0.15)',
            border: '1.5px solid rgba(255, 160, 0, 0.4)',
            color: '#FFA000',
            fontSize: `${13 * s}px`,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: `${12 * s}px`,
          }}
        >
          <RobotIcon size={16 * s} color="#FFA000" />
          <span>AUTONOMOUS WORKFLOW</span>
        </div>

        <h1
          style={{
            fontFamily: headingFont,
            fontSize: isPortrait ? `${40 * s}px` : `${46 * s}px`,
            fontWeight: 900,
            color: textPrimary,
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
          }}
        >
          {heading}
        </h1>
        <p style={{ fontSize: `${18 * s}px`, color: textSecondary, margin: `${8 * s}px 0 0 0`, fontWeight: 600, maxWidth: isPortrait ? '850px' : '1100px' }}>
          {supportingText}
        </p>
      </div>

      {/* ── Pipeline Track: Column in 9:16 Vertical, Row in 16:9 Landscape ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: isPortrait ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isPortrait ? `${14 * s}px` : `${20 * s}px`,
          width: '100%',
          maxWidth: isPortrait ? '520px' : '1240px',
        }}
      >
        {/* NODE 1: Inbound Trigger */}
        <div
          style={{
            display: 'flex',
            flexDirection: isPortrait ? 'row' : 'column',
            alignItems: 'center',
            gap: `${12 * s}px`,
            opacity: node1Spring,
            transform: `scale(${interpolate(node1Spring, [0, 1], [0.85, 1])})`,
            backgroundColor: isPortrait ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)') : 'transparent',
            padding: isPortrait ? `${12 * s}px ${20 * s}px` : '0',
            borderRadius: `${18 * s}px`,
            width: isPortrait ? '100%' : 'auto',
          }}
        >
          <div
            style={{
              width: `${72 * s}px`,
              height: `${72 * s}px`,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: `3px solid ${isDark ? '#334155' : '#E2E8F0'}`,
              boxShadow: `0 ${8 * s}px ${24 * s}px rgba(0,0,0,0.15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <PhoneIcon size={32 * s} color="#FF5722" />
            <div
              style={{
                position: 'absolute',
                top: `-${4 * s}px`,
                right: `-${4 * s}px`,
                backgroundColor: '#FF5722',
                color: '#FFF',
                borderRadius: '50%',
                width: `${22 * s}px`,
                height: `${22 * s}px`,
                fontSize: `${10 * s}px`,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              24/7
            </div>
          </div>
          <div style={{ textAlign: isPortrait ? 'left' : 'center', flex: 1 }}>
            <span style={{ fontSize: `${18 * s}px`, fontWeight: 800, color: textPrimary, display: 'block' }}>
              {steps[0]}
            </span>
            <span style={{ fontSize: `${12 * s}px`, color: '#FF7043', fontWeight: 800 }}>TRIGGER POINT</span>
          </div>
        </div>

        {/* Arrow 1 */}
        <div style={{ opacity: node1Spring }}>
          <ArrowSvg size={20 * s} color="#FF5722" vertical={isPortrait} />
        </div>

        {/* NODE 2: HERO AI AGENT (Interactive Card) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `translateY(${heroFloatY}px) scale(${interpolate(heroSpring, [0, 1], [0.9, 1])})`,
            opacity: heroSpring,
            width: isPortrait ? '100%' : '260px',
          }}
        >
          <div
            style={{
              width: isPortrait ? '100%' : '260px',
              height: isPortrait ? `${140 * s}px` : `${380 * s}px`,
              borderRadius: `${28 * s}px`,
              border: `3px solid ${isDark ? '#38BDF8' : '#0284C7'}`,
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              boxShadow: `0 ${20 * s}px ${50 * s}px rgba(2, 132, 199, 0.25)`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: isPortrait ? 'row' : 'column',
              padding: `${16 * s}px`,
              boxSizing: 'border-box',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Header info */}
            <div style={{ textAlign: isPortrait ? 'left' : 'center' }}>
              <div style={{ fontSize: `${18 * s}px`, fontWeight: 900, color: textPrimary }}>
                {steps[1]}
              </div>
              <div style={{ fontSize: `${12 * s}px`, color: '#0284C7', fontWeight: 800, marginTop: '2px' }}>
                ● Active Cognition
              </div>
            </div>

            {/* Circular / Waveform Visualizer */}
            <div
              style={{
                width: `${70 * s}px`,
                height: `${70 * s}px`,
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : '#F0F9FF',
                border: `2px solid #0284C7`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: `${3 * s}px`,
              }}
            >
              {waveBars.map((multiplier, idx) => {
                const pulse = Math.abs(Math.sin((currentFrame / fps) * 6 + idx * 0.8)) * multiplier;
                const barHeight = Math.max(8 * s, pulse * (36 * s));
                return (
                  <div
                    key={idx}
                    style={{
                      width: `${3.5 * s}px`,
                      height: `${barHeight}px`,
                      backgroundColor: '#0284C7',
                      borderRadius: '999px',
                    }}
                  />
                );
              })}
            </div>

            {/* Small Control Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * s}px` }}>
              <div style={{ width: `${32 * s}px`, height: `${32 * s}px`, borderRadius: '50%', backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MicIcon size={14 * s} color="#64748B" />
              </div>
              <div style={{ width: `${32 * s}px`, height: `${32 * s}px`, borderRadius: '50%', backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <VolumeIcon size={14 * s} color="#64748B" />
              </div>
            </div>
          </div>
        </div>

        {/* Arrow 2 */}
        <div style={{ opacity: node2Spring }}>
          <ArrowSvg size={20 * s} color="#38BDF8" vertical={isPortrait} />
        </div>

        {/* NODE 3: Knowledge Base / Logic */}
        <div
          style={{
            display: 'flex',
            flexDirection: isPortrait ? 'row' : 'column',
            alignItems: 'center',
            gap: `${12 * s}px`,
            opacity: node2Spring,
            transform: `scale(${interpolate(node2Spring, [0, 1], [0.85, 1])})`,
            backgroundColor: isPortrait ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)') : 'transparent',
            padding: isPortrait ? `${12 * s}px ${20 * s}px` : '0',
            borderRadius: `${18 * s}px`,
            width: isPortrait ? '100%' : 'auto',
          }}
        >
          <div
            style={{
              width: `${72 * s}px`,
              height: `${72 * s}px`,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: `3px solid ${isDark ? '#334155' : '#E2E8F0'}`,
              boxShadow: `0 ${8 * s}px ${24 * s}px rgba(0,0,0,0.15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <ChatIcon size={32 * s} color="#0284C7" />
          </div>
          <div style={{ textAlign: isPortrait ? 'left' : 'center', flex: 1 }}>
            <span style={{ fontSize: `${18 * s}px`, fontWeight: 800, color: textPrimary, display: 'block' }}>
              {steps[2]}
            </span>
            <span style={{ fontSize: `${12 * s}px`, color: '#38BDF8', fontWeight: 800 }}>KNOWLEDGE RESOLUTION</span>
          </div>
        </div>

        {/* Arrow 3 */}
        <div style={{ opacity: node3Spring }}>
          <ArrowSvg size={20 * s} color="#10B981" vertical={isPortrait} />
        </div>

        {/* NODE 4: Final Outcome / Booking */}
        <div
          style={{
            display: 'flex',
            flexDirection: isPortrait ? 'row' : 'column',
            alignItems: 'center',
            gap: `${12 * s}px`,
            opacity: node3Spring,
            transform: `scale(${interpolate(node3Spring, [0, 1], [0.85, 1])})`,
            backgroundColor: isPortrait ? (isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)') : 'transparent',
            padding: isPortrait ? `${12 * s}px ${20 * s}px` : '0',
            borderRadius: `${18 * s}px`,
            border: isPortrait ? '1.5px solid rgba(16,185,129,0.3)' : 'none',
            width: isPortrait ? '100%' : 'auto',
          }}
        >
          <div
            style={{
              width: `${72 * s}px`,
              height: `${72 * s}px`,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '3px solid #10B981',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <CalendarCheckIcon size={32 * s} color="#10B981" />
          </div>
          <div style={{ textAlign: isPortrait ? 'left' : 'center', flex: 1 }}>
            <span style={{ fontSize: `${18 * s}px`, fontWeight: 800, color: textPrimary, display: 'block' }}>
              {steps[3]}
            </span>
            <span style={{ fontSize: `${12 * s}px`, color: '#10B981', fontWeight: 800 }}>FINAL OUTCOME</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkflowScene;
