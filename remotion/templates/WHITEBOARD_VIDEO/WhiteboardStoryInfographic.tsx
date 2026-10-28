import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { Whiteboard2DIcon } from '../../components/graphics/Whiteboard2DIcon';
import { WhiteboardHand } from '../../components/graphics/WhiteboardHand';

const { fontFamily: KALAM_FONT } = loadKalam();
const { fontFamily: JAKARTA_FONT } = loadJakarta();

const FONT_HANDWRITING = `${KALAM_FONT}, 'Kalam', 'Caveat', cursive, sans-serif`;
const FONT_SANS = `${JAKARTA_FONT}, system-ui, sans-serif`;

export interface InfographicBracketItem {
  label: string;
  icon: 'medical_emergency' | 'car_repairs' | 'graduation_cap' | string;
}

export interface InfographicBottomCard {
  label: string;
  icon: 'emergency_siren' | 'wealth_plant' | 'target_bullseye' | 'character_happy' | string;
}

export interface WhiteboardStoryInfographicProps {
  titlePrefix?: string;
  titleAccent?: string;
  thoughtText?: string;
  bracketHeader?: string;
  bracketItems?: InfographicBracketItem[];
  centerStatement?: string;
  heroLabel?: string;
  heroType?: string;
  sideNote?: string;
  bottomSubhead?: string;
  bottomCards?: InfographicBottomCard[];
  showHand?: boolean;
}

/**
 * WhiteboardStoryInfographic — Authentic 2D Whiteboard Explainer Scene.
 * Replicates the complete top-to-bottom educational storyboard from reference:
 * - Playful marker title with accent spark dashes
 * - 2D Thinking Character with thought bubble & curly bracket breakdown
 * - Central hero illustration with glowing coins/rays and side note
 * - 4-column bottom takeaway cards with hand-drawn downward arrows
 * - Hand holding marker pen actively tracing items across the whiteboard
 */
export const WhiteboardStoryInfographic: React.FC<WhiteboardStoryInfographicProps> = ({
  titlePrefix = 'Why You Should',
  titleAccent = 'Save Money?',
  thoughtText = 'What if I need money later?',
  bracketHeader = 'Life has uncertainties...',
  bracketItems = [
    { label: 'Medical emergencies', icon: 'medical_emergency' },
    { label: 'Car repairs', icon: 'car_repairs' },
    { label: 'Future house & goals', icon: 'future_house' },
  ],
  centerStatement = 'Saving money helps you be prepared.',
  heroLabel = 'SAVINGS',
  heroType = 'savings_jar',
  sideNote = 'It gives you freedom and peace of mind.',
  bottomSubhead = 'Small steps today... Big benefits tomorrow.',
  bottomCards = [
    { label: 'Handle emergencies', icon: 'emergency_siren' },
    { label: 'Grow your wealth', icon: 'wealth_plant' },
    { label: 'Achieve your goals', icon: 'target_bullseye' },
    { label: 'Less stress', icon: 'character_happy' },
  ],
  showHand = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Scene Timeline Frame Anchors ──────────────────────────────────────────
  // Calibrated across the scene lifecycle so each beat draws progressively
  const titleFrame = Math.round(0.15 * fps);
  const thoughtFrame = Math.round(1.8 * fps);
  const bracketFrame = Math.round(3.6 * fps);
  const centerFrame = Math.round(5.8 * fps);
  const heroFrame = Math.round(7.2 * fps);
  const sideNoteFrame = Math.round(9.0 * fps);
  const bottomSubheadFrame = Math.round(10.8 * fps);
  const bottomCardsFrame = Math.round(12.5 * fps);

  // ── Dynamic Hand Tracking Coordinates ─────────────────────────────────────
  // Tracks where the pen tip should be during each drawing phase
  const handState = useMemo(() => {
    if (frame < thoughtFrame) {
      // Drawing top title
      return { x: 740, y: 155, isDrawing: true };
    } else if (frame < bracketFrame) {
      // Drawing thinking character & thought bubble
      return { x: 420, y: 350, isDrawing: true };
    } else if (frame < centerFrame) {
      // Drawing right curly bracket & list items
      const itemProgress = (frame - bracketFrame) / (centerFrame - bracketFrame);
      const targetY = 380 + itemProgress * 220;
      return { x: 880, y: targetY, isDrawing: true };
    } else if (frame < heroFrame) {
      // Drawing center statement
      return { x: 620, y: 680, isDrawing: true };
    } else if (frame < sideNoteFrame) {
      // Drawing center hero jar
      return { x: 570, y: 1040, isDrawing: true };
    } else if (frame < bottomSubheadFrame) {
      // Drawing side note callout
      return { x: 840, y: 920, isDrawing: true };
    } else if (frame < bottomCardsFrame) {
      // Drawing bottom subhead & underline
      return { x: 720, y: 1280, isDrawing: true };
    } else if (frame < bottomCardsFrame + 45) {
      // Drawing 4 bottom takeaway cards
      return { x: 840, y: 1640, isDrawing: true };
    } else {
      // Resting naturally at the bottom-right corner just like reference image
      return { x: 870, y: 1680, isDrawing: false };
    }
  }, [
    frame,
    thoughtFrame,
    bracketFrame,
    centerFrame,
    heroFrame,
    sideNoteFrame,
    bottomSubheadFrame,
    bottomCardsFrame,
  ]);

  // Entrance springs
  const titleProgress = interpolate(frame, [titleFrame, titleFrame + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const thoughtProgress = interpolate(frame, [thoughtFrame, thoughtFrame + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bracketProgress = interpolate(frame, [bracketFrame, bracketFrame + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const centerProgress = interpolate(frame, [centerFrame, centerFrame + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const heroProgress = interpolate(frame, [heroFrame, heroFrame + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sideNoteProgress = interpolate(frame, [sideNoteFrame, sideNoteFrame + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bottomSubheadProgress = interpolate(frame, [bottomSubheadFrame, bottomSubheadFrame + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bottomCardsProgress = interpolate(frame, [bottomCardsFrame, bottomCardsFrame + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px 48px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. TOP HEADER: TITLE & ACCENT WORDS ─────────────────────────────── */}
      <div
        style={{
          opacity: titleProgress,
          transform: `scale(${0.9 + titleProgress * 0.1})`,
          textAlign: 'center',
          marginBottom: 28,
          position: 'relative',
        }}
      >
        <h1
          style={{
            fontFamily: FONT_HANDWRITING,
            fontSize: 68,
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 6px 0',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          {titlePrefix}
        </h1>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Action spark dashes around accent text */}
          <svg
            width="42"
            height="36"
            viewBox="0 0 42 36"
            style={{ position: 'absolute', left: -46, top: 4 }}
          >
            <path d="M 36 28 L 12 28 M 38 12 L 18 2" stroke="#2563EB" strokeWidth="4.5" strokeLinecap="round" />
          </svg>

          <span
            style={{
              fontFamily: FONT_HANDWRITING,
              fontSize: 78,
              fontWeight: 900,
              color: '#2563EB',
              lineHeight: 1.15,
              textDecoration: 'none',
              letterSpacing: '-0.02em',
            }}
          >
            {titleAccent}
          </span>

          <svg
            width="42"
            height="36"
            viewBox="0 0 42 36"
            style={{ position: 'absolute', right: -46, top: 4 }}
          >
            <path d="M 6 28 L 30 28 M 4 12 L 24 2" stroke="#2563EB" strokeWidth="4.5" strokeLinecap="round" />
          </svg>

          {/* Accent text wrapper */}
        </div>
      </div>

      {/* ── 2. UPPER SPLIT: THINKING CHARACTER + CURLY BRACKET LIST ────────── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          padding: '0 10px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Thinking Character + Thought Bubble */}
        <div
          style={{
            opacity: thoughtProgress,
            transform: `translateY(${(1 - thoughtProgress) * 16}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            width: '42%',
          }}
        >
          {/* Thought Bubble */}
          <div
            style={{
              background: '#FFFFFF',
              border: '3.5px solid #0F172A',
              borderRadius: 36,
              padding: '16px 20px',
              fontFamily: FONT_HANDWRITING,
              fontSize: 24,
              fontWeight: 800,
              color: '#0F172A',
              textAlign: 'center',
              lineHeight: 1.25,
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
              position: 'relative',
              marginBottom: 16,
              maxWidth: 240,
            }}
          >
            {thoughtText}
            {/* Thought bubble trail tail dots */}
            <div
              style={{
                position: 'absolute',
                bottom: -18,
                left: 36,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '3px solid #0F172A',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -30,
                left: 24,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '2.5px solid #0F172A',
              }}
            />
          </div>

          {/* 2D Thinking Boy Illustration */}
          <Whiteboard2DIcon
            type="character_thinking"
            size={180}
            animated={false}
          />

          {/* Curved connecting arrow leading to center */}
          <svg
            width="60"
            height="70"
            viewBox="0 0 60 70"
            style={{
              position: 'absolute',
              right: -30,
              bottom: -40,
              overflow: 'visible',
            }}
          >
            <path
              d="M 10 10 C 15 45 35 50 50 60 M 38 58 L 52 60 L 46 46"
              fill="none"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Right: Large 2D Illustration Visuals (NO BRACKETS, NO TINY ICONS) */}
        <div
          style={{
            opacity: bracketProgress,
            transform: `translateY(${(1 - bracketProgress) * 16}px)`,
            display: 'flex',
            flexDirection: 'column',
            width: '54%',
            alignItems: 'center',
          }}
        >
          {bracketHeader && (
            <div
              style={{
                fontFamily: FONT_HANDWRITING,
                fontSize: 32,
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              {bracketHeader}
            </div>
          )}

          {/* Prominent Large 2D Illustrations */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              width: '100%',
            }}
          >
            {bracketItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 10,
                }}
              >
                <Whiteboard2DIcon
                  type={item.icon}
                  size={130}
                  animated={false}
                />
                <span
                  style={{
                    fontFamily: FONT_HANDWRITING,
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.2,
                    maxWidth: 140,
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. MIDDLE HERO CENTERPIECE: STATEMENT & SAVINGS JAR ─────────────── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 24,
          position: 'relative',
        }}
      >
        {/* Core statement */}
        <div
          style={{
            opacity: centerProgress,
            transform: `scale(${0.92 + centerProgress * 0.08})`,
            fontFamily: FONT_HANDWRITING,
            fontSize: 34,
            fontWeight: 800,
            color: '#0F172A',
            textAlign: 'center',
            marginBottom: 16,
            maxWidth: 580,
            lineHeight: 1.25,
          }}
        >
          {centerStatement}
        </div>

        {/* Center Container: Hero Jar + Side Note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Hero 2D Savings Jar */}
          <div
            style={{
              opacity: heroProgress,
              transform: `scale(${0.88 + heroProgress * 0.12})`,
            }}
          >
            <Whiteboard2DIcon
              type={heroType}
              label={heroLabel}
              size={240}
              animated={false}
            />
          </div>

          {/* Right Callout Side Note with Arrow */}
          <div
            style={{
              opacity: sideNoteProgress,
              transform: `translateX(${(1 - sideNoteProgress) * 16}px)`,
              position: 'absolute',
              right: 18,
              top: '32%',
              maxWidth: 240,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                fontFamily: FONT_HANDWRITING,
                fontSize: 27,
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.25,
                marginBottom: 8,
              }}
            >
              {sideNote}
            </span>

            {/* Hand-drawn arrow pointing to Jar */}
            <svg width="60" height="34" viewBox="0 0 60 34">
              <path
                d="M 52 24 C 36 28 20 20 6 12 M 16 6 L 4 12 L 14 20"
                fill="none"
                stroke="#0F172A"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── 4. BOTTOM TAKEAWAY: SUBHEAD & 4-CARD BENEFIT GRID ───────────────── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 'auto',
          paddingBottom: 20,
        }}
      >
        {/* Bottom Subhead */}
        <div
          style={{
            opacity: bottomSubheadProgress,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: FONT_HANDWRITING,
              fontSize: 34,
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: 16,
            }}
          >
            {bottomSubhead}
          </div>
        </div>

        {/* 4 Outcome Columns with Downward Arrows */}
        <div
          style={{
            opacity: bottomCardsProgress,
            transform: `translateY(${(1 - bottomCardsProgress) * 16}px)`,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            width: '100%',
            maxWidth: 820,
          }}
        >
          {bottomCards.map((card, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Hand-drawn Downward Arrow */}
              <svg width="24" height="28" viewBox="0 0 24 28" style={{ marginBottom: 6 }}>
                <path
                  d="M 12 2 L 12 22 M 6 16 L 12 22 L 18 16"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Large 2D Colored Icon */}
              <Whiteboard2DIcon
                type={card.icon}
                size={135}
                animated={false}
              />

              {/* Label */}
              <span
                style={{
                  fontFamily: FONT_HANDWRITING,
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#0F172A',
                  marginTop: 8,
                  lineHeight: 1.15,
                  maxWidth: 130,
                }}
              >
                {card.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. AUTHENTIC DRAWING HAND WITH MARKER PEN ───────────────────────── */}
      {showHand && (
        <WhiteboardHand
          targetX={handState.x}
          targetY={handState.y}
          isDrawing={handState.isDrawing}
          scale={0.92}
        />
      )}
    </div>
  );
};
