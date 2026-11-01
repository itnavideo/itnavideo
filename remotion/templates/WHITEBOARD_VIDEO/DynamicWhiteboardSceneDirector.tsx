import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadBalsamiqSans } from '@remotion/google-fonts/BalsamiqSans';
import { loadFont as loadPermanentMarker } from '@remotion/google-fonts/PermanentMarker';
import { loadFont as loadCaveat } from '@remotion/google-fonts/Caveat';
import { loadFont as loadComicNeue } from '@remotion/google-fonts/ComicNeue';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { loadFont as loadShadowsIntoLight } from '@remotion/google-fonts/ShadowsIntoLight';
import { loadFont as loadSchoolbell } from '@remotion/google-fonts/Schoolbell';
import { loadFont as loadIndieFlower } from '@remotion/google-fonts/IndieFlower';
import { loadFont as loadComicRelief } from '@remotion/google-fonts/ComicRelief';
import { loadFont as loadGochiHand } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadArchitectsDaughter } from '@remotion/google-fonts/ArchitectsDaughter';
import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { Whiteboard2DIcon } from '../../components/graphics/Whiteboard2DIcon';
import { WhiteboardHand } from '../../components/graphics/WhiteboardHand';
import { WhiteboardFlowArrow } from '../../components/graphics/WhiteboardFlowArrow';
import type { WhiteboardScene, WhiteboardExplanationLine } from '@/services/ai/whiteboardPlanner';

const { fontFamily: BALSAMIQ_FONT } = loadBalsamiqSans();
const { fontFamily: PERMANENT_MARKER_FONT } = loadPermanentMarker();
const { fontFamily: CAVEAT_FONT } = loadCaveat();
const { fontFamily: COMIC_NEUE_FONT } = loadComicNeue();
const { fontFamily: HANDLEE_FONT } = loadHandlee();
const { fontFamily: SHADOWS_FONT } = loadShadowsIntoLight();
const { fontFamily: SCHOOLBELL_FONT } = loadSchoolbell();
const { fontFamily: INDIE_FLOWER_FONT } = loadIndieFlower();
const { fontFamily: COMIC_RELIEF_FONT } = loadComicRelief();
const { fontFamily: GOCHI_HAND_FONT } = loadGochiHand();
const { fontFamily: KALAM_FONT } = loadKalam();
const { fontFamily: ARCHITECT_FONT } = loadArchitectsDaughter();
const { fontFamily: JAKARTA_FONT } = loadJakarta();

const FONT_SANS = `${JAKARTA_FONT}, system-ui, sans-serif`;

export const getWhiteboardFont = (personality: string = 'balsamiq') => {
  switch (personality) {
    case 'balsamiq':
      return `${BALSAMIQ_FONT}, 'Balsamiq Sans', cursive, sans-serif`;
    case 'permanent':
    case 'permanent-marker':
      return `${PERMANENT_MARKER_FONT}, 'Permanent Marker', cursive, sans-serif`;
    case 'kids-hand':
    case 'gochi-hand':
      return `${GOCHI_HAND_FONT}, 'Gochi Hand', cursive, sans-serif`;
    case 'comic-neue':
      return `${COMIC_NEUE_FONT}, 'Comic Neue', cursive, sans-serif`;
    case 'caveat':
    case 'casual':
      return `${CAVEAT_FONT}, 'Caveat', cursive, sans-serif`;
    case 'shadows':
    case 'shadows-into-light':
      return `${SHADOWS_FONT}, 'Shadows Into Light', cursive, sans-serif`;
    case 'schoolbell':
      return `${SCHOOLBELL_FONT}, 'Schoolbell', cursive, sans-serif`;
    case 'handlee':
      return `${HANDLEE_FONT}, 'Handlee', cursive, sans-serif`;
    case 'indie':
    case 'indie-flower':
      return `${INDIE_FLOWER_FONT}, 'Indie Flower', cursive, sans-serif`;
    case 'comic-relief':
      return `${COMIC_RELIEF_FONT}, 'Comic Relief', cursive, sans-serif`;
    case 'clean':
      return `${JAKARTA_FONT}, system-ui, sans-serif`;
    case 'architect':
      return `${ARCHITECT_FONT}, 'Architects Daughter', cursive, sans-serif`;
    case 'marker':
    case 'kalam':
      return `${KALAM_FONT}, 'Kalam', cursive, sans-serif`;
    default:
      return `${BALSAMIQ_FONT}, 'Balsamiq Sans', cursive, sans-serif`;
  }
};

export interface DynamicWhiteboardSceneDirectorProps {
  scenes: WhiteboardScene[];
  showHand?: boolean;
  fontPersonality?: string;
}

/**
 * DynamicWhiteboardSceneDirector
 * Implements the 9:16 Vertical Archetype Layout Engine:
 * - Maps each 5-10s beat to a dedicated, dynamically chosen archetype.
 * - Enforces the 9:16 mobile safe area (x: 40-1040, y: 120-1500, bottom 20% clear for captions).
 * - Animates vector marker strokes and tracks pen tip coordinates with WhiteboardHand.
 * - Supports 12 archetypes: hero_center, keyword_slam, split_comparison, stat_callout, step_ladder, hub_spoke, etc.
 */

// Infinite Whiteboard Canvas Coordinates (Smooth camera pan & zoom between scenes)
const CANVAS_WAYPOINTS = [
  { x: 0, y: 0, zoom: 1.00 },        // Scene 0: Hook / Intro
  { x: 80, y: -45, zoom: 0.98 },     // Scene 1: Glide down-right
  { x: -90, y: 60, zoom: 1.04 },     // Scene 2: Glide left
  { x: 0, y: 90, zoom: 0.96 },       // Scene 3: Glide down
  { x: 100, y: 70, zoom: 1.02 },     // Scene 4: Diagonal
  { x: 0, y: 0, zoom: 1.08 },        // Scene 5: Zoom in on stat callout
  { x: -110, y: -50, zoom: 0.97 },   // Scene 6: Breakthrough launch
  { x: 90, y: 0, zoom: 1.00 },       // Scene 7: Step ladder
  { x: -70, y: 80, zoom: 1.03 },     // Scene 8: Split comparison
  { x: 0, y: 0, zoom: 1.00 },        // Scene 9: Final victory
];

export const DynamicWhiteboardSceneDirector: React.FC<DynamicWhiteboardSceneDirectorProps> = ({
  scenes = [],
  showHand = true,
  fontPersonality = 'marker',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // 1. Identify active scene
  const activeSceneIndex = useMemo(() => {
    if (!scenes.length) return 0;
    const idx = scenes.findIndex(s => currentTime >= s.startTime && currentTime < s.endTime);
    if (idx !== -1) return idx;
    if (currentTime >= scenes[scenes.length - 1].endTime) return scenes.length - 1;
    return 0;
  }, [scenes, currentTime]);

  const scene = scenes[activeSceneIndex] || scenes[0];
  if (!scene) return null;

  // Scene relative timing
  const sceneStartFrame = Math.round(scene.startTime * fps);
  const sceneDurationFrames = Math.max(1, Math.round(scene.duration * fps));
  const sceneLocalFrame = Math.max(0, frame - sceneStartFrame);
  const sceneProgress = Math.min(1, sceneLocalFrame / sceneDurationFrames);

  // Entrance spring
  const entranceSpring = spring({
    frame: sceneLocalFrame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Exit transition for erase_wipe or element_exit
  const exitFrames = Math.round(0.4 * fps);
  const isExiting = sceneLocalFrame > sceneDurationFrames - exitFrames;
  const exitProgress = isExiting
    ? interpolate(sceneLocalFrame, [sceneDurationFrames - exitFrames, sceneDurationFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;


  const accentColor = scene.accentColor || '#3B82F6';

  // ── Infinite Canvas Camera Panning & Zooming (SeeKen Canvas Glide) ─────────
  const prevWaypoint = CANVAS_WAYPOINTS[Math.max(0, activeSceneIndex - 1) % CANVAS_WAYPOINTS.length];
  const currWaypoint = CANVAS_WAYPOINTS[activeSceneIndex % CANVAS_WAYPOINTS.length];

  // Camera spring easing for smooth glide across the infinite whiteboard plane
  const cameraSpring = spring({
    frame: sceneLocalFrame,
    fps,
    config: { damping: 18, stiffness: 60, mass: 1.1 },
  });

  const panX = interpolate(cameraSpring, [0, 1], [prevWaypoint.x, currWaypoint.x]);
  const panY = interpolate(cameraSpring, [0, 1], [prevWaypoint.y, currWaypoint.y]);
  const zoom = interpolate(cameraSpring, [0, 1], [prevWaypoint.zoom, currWaypoint.zoom]);


  // Synchronized Hand Motion: exactly follows text writing, underline, explanation lines, and icon sketching
  const handCoords = useMemo(() => {
    const isCenteredTitle = scene.archetype === 'keyword_slam';
    const isSplitStory = scene.archetype === 'split_story';
    const titleY = isCenteredTitle ? 480 : (isSplitStory ? 340 : 210);
    const heroY = isCenteredTitle ? 880 : (isSplitStory ? 860 : (scene.explanationLines?.length ? 940 : 800));

    if (sceneProgress < 0.18) {
      // Phase 1: Hand writes the title text from left to right directly on the letters
      const p = Math.min(1, sceneProgress / 0.16);
      const x = interpolate(p, [0, 1], [isSplitStory ? 360 : 220, 880]);
      const y = titleY;
      return { x, y, isDrawing: true, opacity: 1 };
    } else if (sceneProgress < 0.25) {
      // Phase 1b: Hand draws the accent underline below the title
      const p = Math.min(1, (sceneProgress - 0.18) / 0.07);
      const x = interpolate(p, [0, 1], [470, 610]);
      const y = titleY + 45;
      return { x, y, isDrawing: true, opacity: 1 };
    } else if (sceneProgress < 0.42 && scene.explanationLines?.length) {
      // Phase 2: Hand writes the explanation bullet lines
      const p = Math.min(1, (sceneProgress - 0.25) / 0.17);
      const lineIdx = p < 0.5 ? 0 : 1;
      const lineP = (p - lineIdx * 0.5) / 0.5;
      const x = interpolate(lineP, [0, 1], [230, 830]);
      const y = titleY + 95 + lineIdx * 52;
      return { x, y, isDrawing: true, opacity: 1 };
    } else if (sceneProgress < 0.78) {
      // Phase 3: Hand sketches the central illustration stroke-by-stroke & shades colors
      const sketchStart = scene.explanationLines?.length ? 0.42 : 0.28;
      const p = Math.min(1, Math.max(0, (sceneProgress - sketchStart) / (0.78 - sketchStart)));

      if (p < 0.68) {
        // 3a. Line Sketching Phase: Hand leads the black ink outline drawing path
        const outlineP = p / 0.68;
        const strokeWaypoints = [
          { p: 0.00, x: 420, y: heroY - 145 },
          { p: 0.10, x: 540, y: heroY - 170 },
          { p: 0.20, x: 650, y: heroY - 135 },
          { p: 0.30, x: 670, y: heroY - 70 },
          { p: 0.40, x: 410, y: heroY - 60 },
          { p: 0.50, x: 410, y: heroY + 15 },
          { p: 0.60, x: 660, y: heroY + 25 },
          { p: 0.70, x: 650, y: heroY + 95 },
          { p: 0.80, x: 420, y: heroY + 90 },
          { p: 0.90, x: 440, y: heroY + 155 },
          { p: 1.00, x: 640, y: heroY + 155 },
        ];

        let segIdx = 0;
        for (let i = 0; i < strokeWaypoints.length - 1; i++) {
          if (outlineP >= strokeWaypoints[i].p && outlineP <= strokeWaypoints[i + 1].p) {
            segIdx = i;
            break;
          }
        }
        const p0 = strokeWaypoints[segIdx];
        const p1 = strokeWaypoints[segIdx + 1] || p0;
        const segSpan = Math.max(0.001, p1.p - p0.p);
        const segFrac = Math.min(1, Math.max(0, (outlineP - p0.p) / segSpan));
        const x = interpolate(segFrac, [0, 1], [p0.x, p1.x]);
        const y = interpolate(segFrac, [0, 1], [p0.y, p1.y]);
        return { x, y, isDrawing: true, opacity: 1 };
      } else if (p < 0.88) {
        // 3b. Delayed Color Accent Phase: Marker pen does energetic diagonal color shading sweeps
        const colorP = (p - 0.68) / 0.20;
        const colorWaypoints = [
          { p: 0.00, x: 470, y: heroY - 50 },
          { p: 0.25, x: 600, y: heroY - 10 },
          { p: 0.50, x: 480, y: heroY + 30 },
          { p: 0.75, x: 600, y: heroY + 60 },
          { p: 1.00, x: 530, y: heroY + 90 },
        ];
        let segIdx = 0;
        for (let i = 0; i < colorWaypoints.length - 1; i++) {
          if (colorP >= colorWaypoints[i].p && colorP <= colorWaypoints[i + 1].p) {
            segIdx = i;
            break;
          }
        }
        const p0 = colorWaypoints[segIdx];
        const p1 = colorWaypoints[segIdx + 1] || p0;
        const segSpan = Math.max(0.001, p1.p - p0.p);
        const segFrac = Math.min(1, Math.max(0, (colorP - p0.p) / segSpan));
        const x = interpolate(segFrac, [0, 1], [p0.x, p1.x]);
        const y = interpolate(segFrac, [0, 1], [p0.y, p1.y]);
        return { x, y, isDrawing: true, opacity: 1 };
      } else {
        // 3c. Hand lifts off and glides downward
        const exitP = (p - 0.88) / 0.12;
        const x = interpolate(exitP, [0, 1], [530, 720]);
        const y = interpolate(exitP, [0, 1], [heroY + 90, 2200]);
        return { x, y, isDrawing: false, opacity: 1 - exitP * 0.5 };
      }
    } else {
      // Phase 4: Hand stays off-screen while audience reads key principle
      return { x: 720, y: 2200, isDrawing: false, opacity: 0 };
    }
  }, [sceneProgress, scene.archetype, scene.explanationLines]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: 1080,
        height: 1920,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* 0. Infinite Whiteboard Paper Texture with Parallax Dot Grid */}
      <div
        style={{
          position: 'absolute',
          inset: -300,
          backgroundImage: 'radial-gradient(#CBD5E1 2px, transparent 2px)',
          backgroundSize: '40px 40px',
          opacity: 0.38,
          transform: `translate(${panX * 0.3}px, ${panY * 0.3}px)`,
          pointerEvents: 'none',
        }}
      />

      {/* Infinite Canvas Camera Viewport: Glides & Zooms smoothly between scenes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: 1080,
          height: 1920,
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: '540px 960px',
        }}
      >
        {/* 9:16 Safe Area Stage Container */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 60,
          right: 60,
          bottom: 380, // Leaves bottom 20% safe for subtitles & platform UI
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: 1 - exitProgress,
          transform: `scale(${interpolate(entranceSpring, [0, 1], [0.94, 1])})`,
          transition: 'all 0.1s ease-out',
        }}
      >
        {/* Render Specific Archetype with live writing & drawing reveals */}
        {renderArchetypeContent(scene, sceneLocalFrame, fps, accentColor, sceneProgress, fontPersonality)}
      </div>

      {/* Real Photorealistic Hand Holding Marker */}
      {showHand && (
        <WhiteboardHand
          targetX={handCoords.x}
          targetY={handCoords.y}
          isDrawing={handCoords.isDrawing}
          opacity={handCoords.opacity}
          scale={1.25}
        />
      )}


      </div>

      {/* Erase Wipe Transition Overlay */}
      {scene.transition === 'erase_wipe' && exitProgress > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: `${exitProgress * 100}%`,
            background: 'linear-gradient(90deg, rgba(241,245,249,0.98) 85%, rgba(241,245,249,0) 100%)',
            borderRight: '6px dashed #94A3B8',
            zIndex: 40,
          }}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE RENDERERS (Clean Named Slots & Responsive 9:16 Flow)
// ─────────────────────────────────────────────────────────────────────────────

function renderHighlightedText(line: WhiteboardExplanationLine) {
  if (!line.highlightWord || !line.text.toLowerCase().includes(line.highlightWord.toLowerCase())) {
    return <span>{line.text}</span>;
  }
  const escaped = line.highlightWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = line.text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, pIdx) => {
        const isMatch = part.toLowerCase() === line.highlightWord!.toLowerCase();
        if (isMatch) {
          return (
            <span
              key={pIdx}
              style={{
                color: line.highlightColor || '#DC2626',
                fontWeight: 900,
                textDecoration: 'underline',
                textDecorationThickness: '3px',
                textUnderlineOffset: '6px',
                textDecorationColor: line.highlightColor || '#DC2626',
              }}
            >
              {part}
            </span>
          );
        }
        return <span key={pIdx}>{part}</span>;
      })}
    </>
  );
}

function renderSceneTopHeader(
  scene: WhiteboardScene,
  activeHandwritingFont: string,
  accentColor: string,
  titleWriteProgress: number,
  underlineProgress: number
) {
  return (
    <div className="w-full text-center px-4 flex flex-col items-center">
      {/* Scene Timing Tag: e.g. SCENE 1 (0:00 - 0:04) */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 18px',
          borderRadius: 999,
          backgroundColor: '#FFFFFF',
          border: '2px solid #E2E8F0',
          fontFamily: activeHandwritingFont,
          fontSize: 22,
          fontWeight: 700,
          color: '#64748B',
          marginBottom: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <span>📍</span>
        <span>{scene.timeLabel || `SCENE ${scene.sceneIndex + 1}`}</span>
      </div>

      {/* Main Punchy Headline with Live Writing Clip Path */}
      <div
        style={{
          fontFamily: activeHandwritingFont,
          fontSize: 58,
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.15,
          clipPath: `inset(0 ${(1 - titleWriteProgress) * 100}% 0 0)`,
          display: 'inline-block',
        }}
      >
        {scene.headline}
      </div>
      <div
        style={{
          height: 4,
          width: 140 * underlineProgress,
          backgroundColor: accentColor,
          margin: '10px auto 0',
          borderRadius: 2,
          opacity: underlineProgress > 0 ? 1 : 0,
        }}
      />
    </div>
  );
}

function renderExplanationBlock(
  explanationLines: WhiteboardExplanationLine[] | undefined,
  activeHandwritingFont: string,
  accentColor: string,
  revealProgress: number
) {
  if (!explanationLines || explanationLines.length === 0) return null;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 880,
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #E2E8F0',
        borderRadius: 22,
        padding: '18px 26px',
        boxShadow: '0 6px 20px -4px rgba(15,23,42,0.06)',
        opacity: revealProgress,
        transform: `translateY(${(1 - revealProgress) * 16}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {explanationLines.map((line, idx) => {
        const lineReveal = Math.min(1, Math.max(0, (revealProgress - idx * 0.25) / 0.5));
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              opacity: lineReveal,
              transform: `translateX(${(1 - lineReveal) * 20}px)`,
            }}
          >
            <span
              style={{
                fontFamily: activeHandwritingFont,
                fontSize: 26,
                fontWeight: 900,
                color: line.highlightColor || accentColor,
                lineHeight: 1.3,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            <div
              style={{
                fontFamily: activeHandwritingFont,
                fontSize: 30,
                fontWeight: 700,
                color: '#1E293B',
                lineHeight: 1.35,
              }}
            >
              {renderHighlightedText(line)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderArchetypeContent(
  scene: WhiteboardScene,
  localFrame: number,
  fps: number,
  accentColor: string,
  sceneProgress: number = 0,
  fontPersonality: string = 'marker'
) {
  const activeHandwritingFont = getWhiteboardFont(fontPersonality);
  const { archetype, headline, heroVisual, supportingItems, statData, comparisonData } = scene;

  // Progressive Writing & Drawing Timing
  const titleWriteProgress = Math.min(1, Math.max(0, sceneProgress / 0.24));
  const underlineProgress = Math.min(1, Math.max(0, (sceneProgress - 0.26) / 0.08));
  const textRevealProgress = Math.min(1, Math.max(0, (sceneProgress - 0.22) / 0.22));
  const heroDrawProgress = Math.min(1, Math.max(0, (sceneProgress - 0.34) / 0.38));
  const bottomRevealProgress = Math.min(1, Math.max(0, (sceneProgress - 0.72) / 0.15));

  // 0. SPLIT STORY (The Exact Master Blueprint from Section 6 of Teacher Reference)
  if (archetype === 'split_story') {
    return (
      <div className="w-full h-full flex flex-col justify-between py-5 px-3">
        {/* Step Timing & Stage Header: e.g. STEP 1 (0:00 - 0:02) */}
        <div className="w-full flex items-center justify-between px-2 pb-2 border-b-2 border-slate-200">
          <div
            style={{
              fontFamily: activeHandwritingFont,
              fontSize: 28,
              fontWeight: 800,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ color: accentColor }}>✦</span>
            <span>{scene.timeLabel || `STEP ${scene.sceneIndex + 1}`}</span>
          </div>
          <span
            style={{
              fontFamily: activeHandwritingFont,
              fontSize: 22,
              fontWeight: 700,
              color: '#64748B',
            }}
          >
            {scene.visualIntent?.role ? scene.visualIntent.role.toUpperCase() : 'STORY FLOW'}
          </span>
        </div>

        {/* Master Whiteboard Frame (Matching the clean bordered box in Section 6) */}
        <div
          style={{
            flex: 1,
            margin: '20px 0',
            backgroundColor: '#FFFFFF',
            borderRadius: 32,
            border: '4px solid #CBD5E1',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 14px 40px -10px rgba(15,23,42,0.08)',
            position: 'relative',
          }}
        >
          {/* Top/Right Header Text: Big, Short, Punchy with Underlines (Section 5 Note) */}
          <div className="w-full flex flex-col items-end text-right">
            <div
              style={{
                fontFamily: activeHandwritingFont,
                fontSize: 60,
                fontWeight: 900,
                color: '#0F172A',
                lineHeight: 1.15,
                clipPath: `inset(0 ${(1 - titleWriteProgress) * 100}% 0 0)`,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
              }}
            >
              {headline.split(' ').map((word, wIdx) => {
                const isHighlight = wIdx === headline.split(' ').length - 1 || word.length > 5;
                return (
                  <span
                    key={wIdx}
                    style={{
                      color: isHighlight ? (wIdx % 2 === 0 ? '#1E40AF' : '#DC2626') : '#0F172A',
                    }}
                  >
                    {word}{' '}
                  </span>
                );
              })}
            </div>
            <div
              style={{
                height: 5,
                width: 200 * underlineProgress,
                backgroundColor: accentColor || '#1E40AF',
                marginTop: 10,
                borderRadius: 3,
                opacity: underlineProgress > 0 ? 1 : 0,
              }}
            />
          </div>

          {/* Central Section: The Dedicated Hand-Drawn Vector Illustration */}
          <div className="relative flex items-center justify-center my-auto">
            <Whiteboard2DIcon
              type={heroVisual.drawingId}
              size={420}
              drawProgress={heroDrawProgress}
              animated={false}
            />
          </div>

          {/* Bottom Explanatory Strip: Short & Clear */}
          {scene.explanationLines && scene.explanationLines.length > 0 && (
            <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between">
              <span
                style={{
                  fontFamily: activeHandwritingFont,
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#334155',
                }}
              >
                {scene.explanationLines[0]?.text}
              </span>
              {scene.explanationLines[0]?.highlightWord && (
                <span
                  style={{
                    fontFamily: activeHandwritingFont,
                    fontSize: 24,
                    fontWeight: 900,
                    color: scene.explanationLines[0].highlightColor || '#DC2626',
                    textDecoration: 'underline',
                    textDecorationThickness: '3px',
                    textUnderlineOffset: '5px',
                  }}
                >
                  {scene.explanationLines[0].highlightWord}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Step Indicator Footer */}
        <div className="text-center">
          <span
            style={{
              fontFamily: activeHandwritingFont,
              fontSize: 22,
              fontWeight: 700,
              color: '#94A3B8',
            }}
          >
            Step {scene.sceneIndex + 1} • Hand-Drawn Whiteboard Story Flow
          </span>
        </div>
      </div>
    );
  }

  // 1. HERO CENTER (The Master Text + Draw Explainer Layout)
  if (archetype === 'hero_center') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-between py-4">
        {/* Top Headline Slot with Live Writing Reveal & Scene Timing */}
        {renderSceneTopHeader(scene, activeHandwritingFont, accentColor, titleWriteProgress, underlineProgress)}

        {/* Explanatory Points (Text Section with Highlights & Underlines) */}
        {scene.explanationLines && scene.explanationLines.length > 0 ? (
          <div className="w-full px-2 my-2">
            {renderExplanationBlock(scene.explanationLines, activeHandwritingFont, accentColor, textRevealProgress)}
          </div>
        ) : null}

        {/* Center Hero Illustration with Live Stroke-by-Stroke Reveal & Delayed Color Fill */}
        <div className="relative flex items-center justify-center my-auto">
          <Whiteboard2DIcon
            type={heroVisual.drawingId}
            size={scene.explanationLines?.length ? 360 : 420}
            drawProgress={heroDrawProgress}
            animated={false}
          />
        </div>

        {/* Bottom Key Takeaway Badge */}
        <div
          style={{
            fontFamily: activeHandwritingFont,
            fontSize: 32,
            fontWeight: 800,
            color: '#1E293B',
            backgroundColor: '#FFFFFF',
            border: `3px solid ${accentColor}`,
            borderRadius: 24,
            padding: '16px 36px',
            boxShadow: '0 8px 24px -6px rgba(0,0,0,0.08)',
            opacity: bottomRevealProgress,
            transform: `scale(${0.9 + bottomRevealProgress * 0.1})`,
            transition: 'all 0.15s ease-out',
          }}
        >
          {heroVisual.label || 'Master Principle'}
        </div>
      </div>
    );
  }

  // 2. KEYWORD SLAM
  if (archetype === 'keyword_slam') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-8">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            borderRadius: 999,
            backgroundColor: '#FFFFFF',
            border: '2px solid #E2E8F0',
            fontFamily: activeHandwritingFont,
            fontSize: 22,
            fontWeight: 700,
            color: '#64748B',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <span>📍</span>
          <span>{scene.timeLabel || `SCENE ${scene.sceneIndex + 1}`}</span>
        </div>
        <div
          style={{
            fontFamily: activeHandwritingFont,
            fontSize: 92,
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.04em',
            textAlign: 'center',
            lineHeight: 1.05,
            clipPath: `inset(0 ${(1 - titleWriteProgress) * 100}% 0 0)`,
          }}
        >
          <span style={{ color: accentColor }}>{headline.split(' ')[0]}</span>{' '}
          {headline.split(' ').slice(1).join(' ')}
        </div>

        <div className="flex items-center justify-center">
          <Whiteboard2DIcon
            type={heroVisual.drawingId}
            size={360}
            drawProgress={heroDrawProgress}
            animated={false}
          />
        </div>

        <div
          style={{
            fontFamily: activeHandwritingFont,
            fontSize: 40,
            fontWeight: 600,
            color: '#64748B',
            textAlign: 'center',
            opacity: bottomRevealProgress,
          }}
        >
          Pay close attention here ✍️
        </div>
      </div>
    );
  }

  // 3. VERTICAL SPLIT COMPARISON
  if (archetype === 'split_comparison') {
    return (
      <div className="w-full h-full flex flex-col justify-between py-4">
        {/* Top Headline + Scene Timing */}
        <div className="w-full text-center flex flex-col items-center">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 18px',
              borderRadius: 999,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E8F0',
              fontFamily: activeHandwritingFont,
              fontSize: 22,
              fontWeight: 700,
              color: '#64748B',
              marginBottom: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <span>📍</span>
            <span>{scene.timeLabel || `SCENE ${scene.sceneIndex + 1}`}</span>
          </div>
          <div
            style={{
              fontFamily: activeHandwritingFont,
              fontSize: 56,
              fontWeight: 700,
              color: '#0F172A',
              textAlign: 'center',
            }}
          >
            {headline}
          </div>
        </div>

        {/* Comparison Cards Stage */}
        <div className="flex-1 flex flex-col justify-center gap-6 my-auto">
          {/* Top Card: Left / Traditional / Problem */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '3px solid #EF4444',
              borderRadius: 24,
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              boxShadow: '0 8px 20px -6px rgba(239,68,68,0.15)',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 900,
              }}
            >
              ✕
            </div>
            <div>
              <div style={{ fontFamily: activeHandwritingFont, fontSize: 26, fontWeight: 700, color: '#991B1B' }}>
                {comparisonData?.leftTitle || 'Without System'}
              </div>
              <div style={{ fontFamily: activeHandwritingFont, fontSize: 36, fontWeight: 700, color: '#0F172A' }}>
                {comparisonData?.leftItem || 'Slow, confusing, manual work'}
              </div>
            </div>
          </div>

          {/* Central VS Badge */}
          <div className="flex items-center justify-center">
            <span
              style={{
                fontFamily: activeHandwritingFont,
                fontSize: 24,
                fontWeight: 900,
                color: '#FFFFFF',
                backgroundColor: '#0F172A',
                padding: '8px 24px',
                borderRadius: 999,
                letterSpacing: 2,
              }}
            >
              VS
            </span>
          </div>

          {/* Bottom Card: Right / Modern / Solution */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: `3px solid ${accentColor}`,
              borderRadius: 24,
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              boxShadow: `0 8px 24px -6px ${accentColor}33`,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: `${accentColor}1A`,
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 900,
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontFamily: activeHandwritingFont, fontSize: 26, fontWeight: 700, color: accentColor }}>
                {comparisonData?.rightTitle || 'With Smart Automation'}
              </div>
              <div style={{ fontFamily: activeHandwritingFont, fontSize: 36, fontWeight: 700, color: '#0F172A' }}>
                {comparisonData?.rightItem || 'Instant execution, maximum output'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. STAT CALLOUT
  if (archetype === 'stat_callout') {
    const statSpring = spring({
      frame: localFrame,
      fps,
      config: { damping: 14, stiffness: 140 },
    });

    return (
      <div className="w-full h-full flex flex-col items-center justify-between py-8">
        <div className="w-full text-center flex flex-col items-center">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 18px',
              borderRadius: 999,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E8F0',
              fontFamily: activeHandwritingFont,
              fontSize: 22,
              fontWeight: 700,
              color: '#64748B',
              marginBottom: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <span>📍</span>
            <span>{scene.timeLabel || `SCENE ${scene.sceneIndex + 1}`}</span>
          </div>
          <div
            style={{
              fontFamily: activeHandwritingFont,
              fontSize: 60,
              fontWeight: 700,
              color: '#0F172A',
              textAlign: 'center',
            }}
          >
            {headline}
          </div>
        </div>

        {/* Big Number Circle */}
        <div
          style={{
            width: 480,
            height: 480,
            borderRadius: '50%',
            border: `6px dashed ${accentColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 12px 32px -8px rgba(0,0,0,0.1)',
            transform: `scale(${statSpring})`,
            margin: 'auto 0',
          }}
        >
          <div
            style={{
              fontFamily: activeHandwritingFont,
              fontSize: 120,
              fontWeight: 900,
              color: accentColor,
              lineHeight: 1,
            }}
          >
            {statData?.number || '85%'}
          </div>
          <div
            style={{
              fontFamily: activeHandwritingFont,
              fontSize: 36,
              fontWeight: 700,
              color: '#475569',
              marginTop: 12,
            }}
          >
            {statData?.metric || 'Measured Impact'}
          </div>
        </div>

        <div
          style={{
            fontFamily: activeHandwritingFont,
            fontSize: 30,
            fontWeight: 700,
            color: '#0F172A',
            backgroundColor: '#FFFFFF',
            border: '2px solid #E2E8F0',
            borderRadius: 16,
            padding: '16px 32px',
          }}
        >
          📌 {statData?.context || 'Statistically proven result'}
        </div>
      </div>
    );
  }

  // 5. STEP LADDER / VERTICAL TIMELINE
  if (archetype === 'step_ladder') {
    const steps = [
      { num: '1', title: 'Start with clear focus', desc: 'Identify the exact lever' },
      { num: '2', title: 'Eliminate friction', desc: 'Remove redundant steps' },
      { num: '3', title: 'Automate & scale', desc: 'Let systems do the heavy lifting' },
    ];

    return (
      <div className="w-full h-full flex flex-col justify-between py-6">
        <div className="w-full text-center flex flex-col items-center">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 18px',
              borderRadius: 999,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E8F0',
              fontFamily: activeHandwritingFont,
              fontSize: 22,
              fontWeight: 700,
              color: '#64748B',
              marginBottom: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <span>📍</span>
            <span>{scene.timeLabel || `SCENE ${scene.sceneIndex + 1}`}</span>
          </div>
          <div
            style={{
              fontFamily: activeHandwritingFont,
              fontSize: 60,
              fontWeight: 700,
              color: '#0F172A',
              textAlign: 'center',
            }}
          >
            {headline}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-8 my-auto px-6">
          {steps.map((step, idx) => {
            const stepSpring = spring({
              frame: Math.max(0, localFrame - idx * 10),
              fps,
              config: { damping: 14, stiffness: 120 },
            });

            const arrowProgress = Math.min(1, Math.max(0, (localFrame - (idx - 1) * 12) / 14));

            return (
              <React.Fragment key={step.num}>
                {idx > 0 && (
                  <div className="flex justify-center my-[-10px] z-10">
                    <WhiteboardFlowArrow
                      direction="down"
                      drawProgress={arrowProgress}
                      color={accentColor}
                      width={48}
                      height={48}
                      label={idx === 1 ? 'Action ➔' : 'Result ➔'}
                      fontFamily={activeHandwritingFont}
                    />
                  </div>
                )}
                <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  backgroundColor: '#FFFFFF',
                  border: `2px solid ${idx === 1 ? accentColor : '#CBD5E1'}`,
                  borderRadius: 20,
                  padding: '20px 24px',
                  boxShadow: '0 6px 18px -4px rgba(0,0,0,0.06)',
                  transform: `translateX(${(1 - stepSpring) * 60}px)`,
                  opacity: stepSpring,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    backgroundColor: idx === 1 ? accentColor : '#0F172A',
                    color: '#FFFFFF',
                    fontFamily: activeHandwritingFont,
                    fontSize: 26,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <div style={{ fontFamily: activeHandwritingFont, fontSize: 28, fontWeight: 800, color: '#0F172A' }}>
                    {step.title}
                  </div>
                  <div style={{ fontFamily: activeHandwritingFont, fontSize: 26, color: '#64748B' }}>
                    {step.desc}
                  </div>
                </div>
              </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // 6. HUB AND SPOKE (Default Fallback)
  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-6">
      <div className="w-full text-center flex flex-col items-center">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            borderRadius: 999,
            backgroundColor: '#FFFFFF',
            border: '2px solid #E2E8F0',
            fontFamily: activeHandwritingFont,
            fontSize: 22,
            fontWeight: 700,
            color: '#64748B',
            marginBottom: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <span>📍</span>
          <span>{scene.timeLabel || `SCENE ${scene.sceneIndex + 1}`}</span>
        </div>
        <div
          style={{
            fontFamily: activeHandwritingFont,
            fontSize: 60,
            fontWeight: 700,
            color: '#0F172A',
            textAlign: 'center',
          }}
        >
          {headline}
        </div>
      </div>

      {/* Central Hub with Progressive Stroke Reveal */}
      <div className="relative flex items-center justify-center my-auto">
        <Whiteboard2DIcon
          type={heroVisual.drawingId}
          size={380}
          drawProgress={heroDrawProgress}
          animated={false}
        />
      </div>

      {/* Connecting Flow Arrows from Central Hub to Spokes */}
      <div className="w-full flex justify-around px-12 my-[-8px] z-10">
        <WhiteboardFlowArrow
          direction="curved_down"
          drawProgress={heroDrawProgress}
          color={accentColor}
          width={68}
          height={56}
          label="Idea ➔"
          fontFamily={activeHandwritingFont}
        />
        <WhiteboardFlowArrow
          direction="down"
          drawProgress={heroDrawProgress}
          color="#0F172A"
          width={68}
          height={56}
          label="Execute ➔"
          fontFamily={activeHandwritingFont}
        />
      </div>

      {/* Spoke Badges */}
      <div className="w-full grid grid-cols-2 gap-4 px-4">
        {(supportingItems || [
          { id: '1', text: 'Action 1' },
          { id: '2', text: 'Action 2' },
        ]).slice(0, 2).map((item, idx) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: `2px solid ${idx === 0 ? accentColor : '#CBD5E1'}`,
              borderRadius: 16,
              padding: '16px 20px',
              fontFamily: activeHandwritingFont,
              fontSize: 24,
              fontWeight: 800,
              color: '#0F172A',
              textAlign: 'center',
              boxShadow: '0 4px 12px -2px rgba(0,0,0,0.06)',
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
