import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface StoryCharacterDeskSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: {
    isDark?: boolean;
    primary?: string;
    accent?: string;
    textPrimary?: string;
    textSecondary?: string;
  };
}

export interface FloatingCardItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  color: string;
}

const DEFAULT_FLOATING_CARDS: FloatingCardItem[] = [
  {
    id: 'video',
    title: 'Raw Video Footage',
    subtitle: 'Hours of recorded clips & b-roll',
    icon: 'video',
    badge: 'INPUT 01',
    color: '#3B82F6',
  },
  {
    id: 'audio',
    title: 'Voiceover Audio',
    subtitle: 'Speech, retakes & background noise',
    icon: 'mic',
    badge: 'INPUT 02',
    color: '#8B5CF6',
  },
  {
    id: 'images',
    title: 'Visual Assets',
    subtitle: 'Photos, diagrams & screenshots',
    icon: 'image',
    badge: 'INPUT 03',
    color: '#10B981',
  },
  {
    id: 'script',
    title: 'Written Script',
    subtitle: 'Story outline, captions & hooks',
    icon: 'script',
    badge: 'INPUT 04',
    color: '#F59E0B',
  },
];

export function StoryCharacterDeskScene({
  scene,
  headingFont = 'Outfit, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: StoryCharacterDeskSceneProps) {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  const isDark = palette?.isDark !== false;
  const accentColor = palette?.accent || '#FF5722';
  const textPrimary = palette?.textPrimary || (isDark ? '#F8FAFC' : '#0F172A');
  const textSecondary = palette?.textSecondary || (isDark ? '#94A3B8' : '#64748B');

  // Entrance animations
  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const characterSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 13, stiffness: 90 } });
  const bubbleSpring = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 12, stiffness: 85 } });

  // Floating ambient motion for speech bubble
  const bubbleFloatY = Math.sin(frame / 18) * 6;

  // Extract content
  const categoryPill = scene.categoryPill || 'CREATOR STORY';
  const mainTitle = scene.heading || 'Meet the Modern Creator';
  const thoughtText =
    scene.supportingText ||
    scene.narrationSegment?.text ||
    '“Can I consistently create high-quality videos without showing my face?”';

  // Custom cards or defaults
  const cards: FloatingCardItem[] =
    scene.listItems && scene.listItems.length >= 2
      ? scene.listItems.slice(0, 4).map((item, idx) => ({
          id: `item-${idx}`,
          title: item,
          subtitle: `Element 0${idx + 1} in creative workflow`,
          icon: idx === 0 ? 'video' : idx === 1 ? 'mic' : idx === 2 ? 'image' : 'script',
          badge: `ASSET 0${idx + 1}`,
          color: idx === 0 ? '#3B82F6' : idx === 1 ? '#8B5CF6' : idx === 2 ? '#10B981' : '#F59E0B',
        }))
      : DEFAULT_FLOATING_CARDS;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '50px 75px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(ellipse 90% 80% at 50% -10%, #1E1B4B 0%, #0B0F19 60%, #030712 100%)'
          : 'radial-gradient(ellipse 90% 80% at 50% -10%, #EEF2FF 0%, #F8FAFC 60%, #F1F5F9 100%)',
        color: textPrimary,
      }}
    >
      {/* Background Subtle Tech Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isDark ? 0.08 : 0.04,
          backgroundImage:
            'linear-gradient(to right, #6366F1 1px, transparent 1px), linear-gradient(to bottom, #6366F1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          left: '12%',
          top: '25%',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '10%',
          top: '30%',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 87, 34, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* TOP HEADER BAR */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-25, 0])}px)`,
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 20px',
            borderRadius: '9999px',
            backgroundColor: isDark ? 'rgba(99, 102, 241, 0.18)' : 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(129, 140, 248, 0.35)',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: isDark ? '#A5B4FC' : '#4338CA',
            }}
          >
            {categoryPill}
          </span>
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontFamily: headingFont,
            fontSize: '44px',
            fontWeight: 900,
            letterSpacing: '-0.025em',
            margin: 0,
            lineHeight: 1.15,
            color: textPrimary,
          }}
        >
          {mainTitle}
        </h1>
      </div>

      {/* MAIN 16:9 CONTENT: LEFT CHARACTER AT DESK + RIGHT FLOATING WORKFLOW CARDS */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '50px',
          marginTop: '20px',
          marginBottom: '10px',
          zIndex: 10,
        }}
      >
        {/* LEFT COLUMN: Character at Desk with Speech Bubble */}
        <div
          style={{
            flex: '0 0 54%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            opacity: characterSpring,
            transform: `scale(${interpolate(characterSpring, [0, 1], [0.94, 1])})`,
          }}
        >
          {/* Animated Thought / Speech Bubble */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '40px',
              maxWidth: '460px',
              padding: '18px 24px',
              borderRadius: '24px 24px 24px 6px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.92) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 245, 249, 0.95) 100%)',
              border: `2px solid ${isDark ? 'rgba(129, 140, 248, 0.45)' : 'rgba(99, 102, 241, 0.35)'}`,
              boxShadow: isDark
                ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 24px rgba(99, 102, 241, 0.25)'
                : '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 20px rgba(99, 102, 241, 0.15)',
              opacity: bubbleSpring,
              transform: `translateY(${bubbleFloatY}px) scale(${interpolate(bubbleSpring, [0, 1], [0.85, 1])})`,
              zIndex: 15,
            }}
          >
            {/* Question Mark Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245, 158, 11, 0.18)',
                color: '#F59E0B',
                fontFamily: headingFont,
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                marginBottom: '8px',
              }}
            >
              <span>💭</span>
              <span>CREATOR THOUGHT</span>
            </div>

            <p
              style={{
                fontFamily: bodyFont,
                fontSize: '19px',
                fontWeight: 600,
                color: isDark ? '#FFFFFF' : '#0F172A',
                lineHeight: 1.4,
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              {thoughtText}
            </p>
          </div>

          {/* SVG Character Sitting at Desk with Laptop */}
          <svg
            viewBox="0 0 620 440"
            style={{
              width: '100%',
              maxWidth: '580px',
              height: 'auto',
              maxHeight: '430px',
              overflow: 'visible',
            }}
          >
            <defs>
              {/* Laptop Screen Glow Gradient */}
              <linearGradient id="laptopGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.4" />
              </linearGradient>

              {/* Desk Lamp Cone */}
              <linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
              </linearGradient>

              {/* Character Hoodie Gradient */}
              <linearGradient id="hoodieGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>

              {/* Desk Surface Gradient */}
              <linearGradient id="deskWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isDark ? '#334155' : '#CBD5E1'} />
                <stop offset="100%" stopColor={isDark ? '#1E293B' : '#94A3B8'} />
              </linearGradient>

              {/* Chair Gradient */}
              <linearGradient id="chairGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isDark ? '#475569' : '#64748B'} />
                <stop offset="100%" stopColor={isDark ? '#1E293B' : '#334155'} />
              </linearGradient>
            </defs>

            {/* ERGONOMIC CHAIR BACK */}
            <path
              d="M 230 180 C 230 120, 390 120, 390 180 L 380 320 C 380 330, 240 330, 240 320 Z"
              fill="url(#chairGrad)"
              stroke={isDark ? '#0F172A' : '#1E293B'}
              strokeWidth="4"
            />
            {/* Chair Headrest */}
            <rect
              x="270"
              y="90"
              width="80"
              height="36"
              rx="18"
              fill={isDark ? '#64748B' : '#475569'}
              stroke={isDark ? '#0F172A' : '#1E293B'}
              strokeWidth="3"
            />

            {/* CHARACTER BODY (Torso & Shoulders) */}
            <path
              d="M 235 320 L 255 210 C 265 190, 355 190, 365 210 L 385 320 Z"
              fill="url(#hoodieGrad)"
              stroke={isDark ? '#1E1B4B' : '#0F172A'}
              strokeWidth="4"
            />
            {/* Hoodie Collar Strings */}
            <path d="M 298 220 L 296 250" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M 322 220 L 324 250" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

            {/* CHARACTER NECK */}
            <rect x="295" y="175" width="30" height="26" rx="4" fill="#FBBF24" />

            {/* CHARACTER HEAD */}
            <circle cx="310" cy="155" r="32" fill="#FBBF24" stroke="#0F172A" strokeWidth="3.5" />

            {/* STYLISH HAIR */}
            <path
              d="M 276 150 C 276 122, 344 118, 344 150 C 344 135, 335 125, 310 125 C 288 125, 278 138, 276 150 Z"
              fill="#18181B"
            />
            {/* Hair bangs / front cut */}
            <path d="M 282 142 Q 310 134 338 144" stroke="#18181B" strokeWidth="6" strokeLinecap="round" />

            {/* FACE DETAILS: Eyes, Eyebrows, Glasses, Smirk */}
            {/* Eyebrows */}
            <path d="M 294 145 Q 303 142 308 146" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 314 146 Q 319 142 328 145" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Modern Glasses Frame */}
            <rect x="290" y="149" width="18" height="14" rx="4" fill="none" stroke="#0F172A" strokeWidth="3" />
            <rect x="314" y="149" width="18" height="14" rx="4" fill="none" stroke="#0F172A" strokeWidth="3" />
            <line x1="308" y1="155" x2="314" y2="155" stroke="#0F172A" strokeWidth="2.5" />

            {/* Eyes */}
            <circle cx="299" cy="156" r="2.5" fill="#0F172A" />
            <circle cx="323" cy="156" r="2.5" fill="#0F172A" />

            {/* Smirk / Smile */}
            <path d="M 303 172 Q 311 178 318 172" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* DESK SURFACE */}
            <path
              d="M 50 330 L 570 330 L 550 420 L 70 420 Z"
              fill="url(#deskWood)"
              stroke={isDark ? '#475569' : '#64748B'}
              strokeWidth="4"
            />
            {/* Desk Bevel Front Edge */}
            <rect
              x="70"
              y="420"
              width="480"
              height="16"
              fill={isDark ? '#0F172A' : '#475569'}
            />

            {/* DESK LAMP CONE & GLOW */}
            <polygon points="120,230 70,330 170,330" fill="url(#lampCone)" />
            {/* Desk Lamp Hardware */}
            <circle cx="120" cy="330" r="16" fill="#64748B" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M 120 330 L 110 260 L 130 220" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 115 215 L 140 235 L 110 240 Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />

            {/* COFFEE MUG WITH STEAM */}
            <rect x="470" y="308" width="28" height="26" rx="4" fill="#EF4444" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M 498 314 C 506 314, 506 328, 498 328" stroke="#0F172A" strokeWidth="2.5" fill="none" />
            {/* Steam curls */}
            <path
              d="M 478 300 Q 482 292 479 285"
              stroke={isDark ? '#94A3B8' : '#64748B'}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity={interpolate(Math.sin(frame / 10), [-1, 1], [0.3, 0.9])}
            />
            <path
              d="M 488 298 Q 492 290 489 283"
              stroke={isDark ? '#94A3B8' : '#64748B'}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity={interpolate(Math.sin(frame / 12), [-1, 1], [0.2, 0.8])}
            />

            {/* POTTED SUCCULENT PLANT */}
            <path d="M 425 330 L 445 330 L 441 315 L 429 315 Z" fill="#D97706" stroke="#0F172A" strokeWidth="2" />
            <circle cx="435" cy="310" r="9" fill="#10B981" stroke="#0F172A" strokeWidth="2" />
            <circle cx="430" cy="306" r="6" fill="#059669" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="440" cy="306" r="6" fill="#34D399" stroke="#0F172A" strokeWidth="1.5" />

            {/* MODERN LAPTOP */}
            {/* Laptop Base */}
            <path
              d="M 230 326 L 390 326 L 400 338 L 220 338 Z"
              fill="#94A3B8"
              stroke="#0F172A"
              strokeWidth="3"
            />
            {/* Laptop Trackpad */}
            <rect x="294" y="329" width="32" height="6" rx="2" fill="#CBD5E1" />

            {/* Laptop Screen Open */}
            <polygon
              points="242,246 378,246 388,326 232,326"
              fill="#0F172A"
              stroke="#0F172A"
              strokeWidth="3.5"
            />
            {/* Screen Glow & Code / Timeline UI */}
            <polygon
              points="246,250 374,250 384,322 236,322"
              fill="url(#laptopGlow)"
            />
            {/* Timeline UI Lines on Laptop Screen */}
            <line x1="252" y1="262" x2="368" y2="262" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <line x1="252" y1="272" x2="330" y2="272" stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="252" y1="282" x2="350" y2="282" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            {/* Scrubber Playhead on Laptop Screen */}
            <line x1="288" y1="255" x2="288" y2="315" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
            <polygon points="285,255 291,255 288,260" fill="#FF5722" />

            {/* CHARACTER ARMS TYPING ON LAPTOP */}
            {/* Left Arm */}
            <path
              d="M 255 220 L 230 270 L 260 326"
              stroke="url(#hoodieGrad)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Left Hand */}
            <circle cx="260" cy="326" r="8" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />

            {/* Right Arm */}
            <path
              d="M 365 220 L 390 270 L 360 326"
              stroke="url(#hoodieGrad)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Right Hand */}
            <circle cx="360" cy="326" r="8" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
          </svg>
        </div>

        {/* RIGHT COLUMN: 4 Staggered Glassmorphic Input Cards */}
        <div
          style={{
            flex: '0 0 44%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          {cards.map((card, idx) => {
            const cardDelay = 6 + idx * 5;
            const cardSpring = spring({
              frame: Math.max(0, frame - cardDelay),
              fps,
              config: { damping: 14, stiffness: 95 },
            });
            const floatOffset = Math.sin((frame + idx * 20) / 16) * 4;

            return (
              <div
                key={card.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  padding: '16px 22px',
                  borderRadius: '18px',
                  background: isDark
                    ? 'rgba(15, 23, 42, 0.75)'
                    : 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(16px)',
                  border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                  boxShadow: isDark
                    ? '0 12px 28px rgba(0, 0, 0, 0.35)'
                    : '0 12px 28px rgba(0, 0, 0, 0.05)',
                  opacity: cardSpring,
                  transform: `translateX(${interpolate(cardSpring, [0, 1], [40, 0])}px) translateY(${floatOffset}px)`,
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Vector Icon Badge */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: `${card.color}22`,
                    border: `1.5px solid ${card.color}66`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CardVectorIcon type={card.icon} color={card.color} />
                </div>

                {/* Card Text Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontFamily: headingFont,
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        color: card.color,
                        textTransform: 'uppercase',
                      }}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: headingFont,
                      fontSize: '20px',
                      fontWeight: 700,
                      color: textPrimary,
                      lineHeight: 1.2,
                    }}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{
                      fontFamily: bodyFont,
                      fontSize: '14px',
                      color: textSecondary,
                      marginTop: '3px',
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {card.subtitle}
                  </div>
                </div>

                {/* Check / Status Icon */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                    fontSize: '14px',
                    fontWeight: 800,
                  }}
                >
                  ✓
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM NARRATION / FOOTER BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 28px',
          borderRadius: '14px',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)'}`,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>💡</span>
          <span
            style={{
              fontFamily: bodyFont,
              fontSize: '15px',
              fontWeight: 500,
              color: textSecondary,
            }}
          >
            {scene.narrationSegment?.text || 'Creators need a smarter, automated workflow to produce videos effortlessly.'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: accentColor,
            }}
          >
            SCENE {scene.sceneNumber || 1}
          </span>
        </div>
      </div>
    </div>
  );
}

// Helper SVG Vector Icons for the 4 workflow cards
function CardVectorIcon({ type, color }: { type: string; color: string }) {
  if (type === 'video') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="14" height="16" rx="3" stroke={color} strokeWidth="2" />
        <polygon points="16,10 22,7 22,17 16,14" fill={color} />
        <circle cx="7" cy="9" r="1.5" fill={color} />
        <circle cx="11" cy="9" r="1.5" fill={color} />
      </svg>
    );
  }
  if (type === 'mic') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="3" width="6" height="12" rx="3" stroke={color} strokeWidth="2" />
        <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'image') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" stroke={color} strokeWidth="2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill={color} />
        <path d="M21 15l-5-5L5 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Script / document
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" />
      <polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="2" />
      <line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="9" x2="8" y2="9" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
