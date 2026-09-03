/**
 * AI Director Reel — Cinematic short-form video with intelligent scene direction.
 *
 * Consumes a directed scene plan (from sceneDirector.ts) and renders:
 * - Per-scene background assets with cinematic camera motion
 * - Smooth transitions between scenes
 * - Word-level emphasis effects
 * - Timed captions via shared SubtitleRenderer
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SubtitleRenderer } from '../../components/SubtitleRenderer';
import type { CaptionSegment, SubtitleConfig } from '../../types/subtitles';
import { mapCaptionStyle, getCaptionFont } from '../../utils/captionStyleMap';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import {
  MOTION_PRESETS,
  TRANSITION_PRESETS,
  EMPHASIS_EFFECTS,
  getSceneProgress,
  interpolateMotion,
  type MotionPresetConfig,
} from '../../../lib/motion/presets';
import {
  TYPE_SCALE,
  getFontStack,
  findEmphasisWords,
  typeStyleToCSS,
  applyContrast,
  getScaledTypeStyle,
} from '../../../lib/typography/system';

// ── Types ─────────────────────────────────────────────────────────────────────

type DirectedSceneProps = {
  scene: number;
  startWord: number;
  endWord: number;
  startTime: number;
  endTime: number;
  visualType: string;
  motion: string;
  transitionIn: string;
  intent: string;
  emphasis?: string[];
  assetUrl?: string;
  assetQuery?: string;
  reframe?: {
    cropX: number;
    cropY: number;
    cropWidth: number;
    cropHeight: number;
    scale: number;
    subjectAnchor: { x: number; y: number };
    objectFit: 'cover' | 'contain';
  };
  probabilistic?: {
    motion: string;
    transition: string;
    confidence: number;
    reasoning: string;
  };
};

type KineticTextProps = {
  text: string;
  startTime: number;
  endTime: number;
  function: string;
  emotionalWeight: string;
  importance: number;
  motionIntent: string;
  entryDurationFrames: number;
  holdDurationFrames: number;
  exitDurationFrames: number;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  textTransform: 'none' | 'uppercase' | 'capitalize';
  opacity: number;
  color: string;
  accentColor: string;
  decorStyle: string;
  zIndex: number;
  positionY: 'top' | 'center' | 'bottom';
  adaptiveContext?: string;
  anchor?: {
    x: number;
    y: number;
    alignment: 'left' | 'center' | 'right';
    verticalAlign: 'top' | 'center' | 'bottom';
    maxWidth: number;
    region: string;
  };
};

type AIDirectorReelProps = {
  mediaSrc?: string;
  audioSrc?: string;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  scenes?: DirectedSceneProps[];
  captions?: CaptionSegment[];
  words?: Array<{ word: string; start: number; end: number }>;
  kineticText?: KineticTextProps[];
  typographyPackage?: string;
  directorDecisions?: Array<{ sceneId: number; visualMode: string; focalPoint: string; hierarchyRule: string }>;
  visualContinuity?: { colorGrade?: { temperature?: number; contrast?: number; saturation?: number; tint?: string; tintOpacity?: number }; motionCurve?: string };
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  fontSize?: SubtitleConfig['fontSize'];
  fontFamily?: string;
  showBackground?: boolean;
  backgroundMusic?: boolean;
  backgroundMusicSrc?: string;
  backgroundMusicVolume?: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

const normalizeCaptions = (captions: CaptionSegment[]) =>
  captions
    .map((c) => ({
      start: Number(c.start ?? 0),
      end: Number(c.end ?? (c.start ?? 0) + 2.5),
      text: String(c.text || ''),
      words: Array.isArray(c.words)
        ? c.words.map((w) => ({ word: String(w.word || ''), start: Number(w.start ?? 0), end: Number(w.end ?? 0) }))
        : undefined,
    }))
    .filter((c) => c.text.trim());

// ── Scene Layer ───────────────────────────────────────────────────────────────

function SceneLayer({
  scene,
  totalScenes,
}: {
  scene: DirectedSceneProps;
  totalScenes: DirectedSceneProps[];
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Is this scene active?
  if (currentTime < scene.startTime || currentTime > scene.endTime) return null;

  // Motion
  const motionPreset: MotionPresetConfig = MOTION_PRESETS[scene.motion] || MOTION_PRESETS.slow_zoom_in;
  const progress = getSceneProgress(frame, fps, scene.startTime, scene.endTime);
  const motion = interpolateMotion(motionPreset, progress);

  // Transition IN (first 0.4s of scene)
  const transitionConfig = TRANSITION_PRESETS[scene.transitionIn] || TRANSITION_PRESETS.cross_dissolve;
  const sceneStartFrame = Math.round(scene.startTime * fps);
  const localFrame = frame - sceneStartFrame;
  const transitionProgress = Math.min(1, localFrame / Math.max(1, transitionConfig.durationFrames));
  let transitionOpacity = 1;
  let transitionTransform = '';

  if (transitionConfig.type === 'opacity') {
    transitionOpacity = interpolate(transitionProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  } else if (transitionConfig.type === 'slide') {
    const dir = transitionConfig.direction === 'right' ? 1 : -1;
    const slideX = interpolate(transitionProgress, [0, 1], [dir * 100, 0], { extrapolateRight: 'clamp' });
    transitionTransform = `translateX(${slideX}%)`;
  } else if (transitionConfig.type === 'scale') {
    const s = interpolate(transitionProgress, [0, 1], [0.8, 1], { extrapolateRight: 'clamp' });
    transitionTransform = `scale(${s})`;
    transitionOpacity = transitionProgress;
  }

  // Transition OUT (last 8 frames of scene)
  const EXIT_FRAMES = 8;
  const sceneEndFrame = Math.round(scene.endTime * fps);
  const framesUntilEnd = sceneEndFrame - frame;
  const exitOpacity = framesUntilEnd < EXIT_FRAMES
    ? interpolate(framesUntilEnd, [0, EXIT_FRAMES], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  const finalOpacity = transitionOpacity * exitOpacity;

  const assetSrc = scene.assetUrl ? resolveAsset(scene.assetUrl) : '';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: finalOpacity,
        transform: `${transitionTransform} translate(${motion.translateX}px, ${motion.translateY}px) scale(${motion.scale}) rotate(${motion.rotate}deg)`,
        transformOrigin: 'center center',
        overflow: 'hidden',
      }}
    >
      {assetSrc ? (
        <Img
          src={assetSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: scene.reframe?.objectFit || 'cover',
            objectPosition: scene.reframe
              ? `${scene.reframe.subjectAnchor.x * 100}% ${scene.reframe.subjectAnchor.y * 100}%`
              : 'center',
            transform: scene.reframe ? `scale(${scene.reframe.scale})` : undefined,
          }}
        />
      ) : (
        <ScenePlaceholder intent={scene.intent} visualType={scene.visualType} />
      )}
    </div>
  );
}

function ScenePlaceholder({ intent, visualType }: { intent: string; visualType: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors: Record<string, string> = {
    establish_atmosphere: '#0F172A',
    introduce_topic: '#1E293B',
    explain_concept: '#1A2332',
    show_example: '#162032',
    emphasize_point: '#1E1B2E',
    compare_contrast: '#1B2838',
    build_tension: '#1A1020',
    resolve_conclusion: '#0F1F2A',
    call_to_action: '#1A1030',
  };

  // Animated floating orbs for visual life
  const drift = Math.sin(frame / 60) * 8;
  const drift2 = Math.cos(frame / 45) * 6;
  const pulse = 1 + Math.sin(frame / 30) * 0.08;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `radial-gradient(ellipse at ${40 + drift}% ${35 + drift2}%, ${colors[intent] || '#0F172A'}dd, #020617)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Primary orb */}
      <div
        style={{
          position: 'absolute',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 65%)',
          filter: 'blur(50px)',
          transform: `translate(${drift * 2}px, ${drift2 * 1.5}px) scale(${pulse})`,
        }}
      />
      {/* Secondary orb */}
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '30%',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 60%)',
          filter: 'blur(40px)',
          transform: `translate(${-drift}px, ${-drift2}px)`,
        }}
      />
      {/* Subtle grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.02,
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

// ── Emphasis Overlay ──────────────────────────────────────────────────────────

function EmphasisOverlay({
  words,
  scenes,
}: {
  words: Array<{ word: string; start: number; end: number }>;
  scenes: DirectedSceneProps[];
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find current scene
  const currentScene = scenes.find((s) => currentTime >= s.startTime && currentTime <= s.endTime);
  if (!currentScene?.emphasis?.length) return null;

  // Check if any emphasis word is currently being spoken
  const emphasisSet = new Set(currentScene.emphasis.map((w) => w.toLowerCase()));
  const activeWord = words.find(
    (w) => currentTime >= w.start && currentTime <= w.end && emphasisSet.has(w.word.toLowerCase()),
  );

  if (!activeWord) return null;

  const wordLocalFrame = Math.round((currentTime - activeWord.start) * fps);
  const effect = EMPHASIS_EFFECTS.scale_bump;
  const effectProgress = Math.min(1, wordLocalFrame / effect.durationFrames);
  const pulse = effectProgress < 0.5
    ? interpolate(effectProgress, [0, 0.5], [1, 1 + effect.intensity], { extrapolateRight: 'clamp' })
    : interpolate(effectProgress, [0.5, 1], [1 + effect.intensity, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
      }}
    >
      <div
        style={{
          width: '70%',
          height: '25%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(34,211,238,${0.12 * pulse}) 0%, transparent 70%)`,
          transform: `scale(${pulse})`,
          filter: 'blur(30px)',
        }}
      />
    </div>
  );
}

// ── Kinetic Text Layer (Stage 3 Renderer) ─────────────────────────────────────

function KineticTextLayer({ phrases }: { phrases: KineticTextProps[] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find active phrase
  const active = phrases.find((p) => currentTime >= p.startTime && currentTime <= p.endTime);
  if (!active) return null;

  const phraseStartFrame = Math.round(active.startTime * fps);
  const localFrame = frame - phraseStartFrame;
  const totalFrames = active.entryDurationFrames + active.holdDurationFrames + active.exitDurationFrames;

  // Phase detection
  const isEntry = localFrame < active.entryDurationFrames;
  const isExit = localFrame > (active.entryDurationFrames + active.holdDurationFrames);
  const entryProgress = isEntry ? Math.min(1, localFrame / Math.max(1, active.entryDurationFrames)) : 1;
  const exitProgress = isExit ? Math.min(1, (localFrame - active.entryDurationFrames - active.holdDurationFrames) / Math.max(1, active.exitDurationFrames)) : 0;

  // Motion intent → CSS transform
  let transform = '';
  let opacity = active.opacity;
  let filter = '';

  switch (active.motionIntent) {
    case 'punch_in':
      transform = isEntry ? `scale(${0.5 + entryProgress * 0.5})` : isExit ? `scale(${1 + exitProgress * 0.1})` : 'scale(1)';
      opacity = isEntry ? entryProgress * active.opacity : isExit ? (1 - exitProgress) * active.opacity : active.opacity;
      break;
    case 'drop_settle': {
      const dropY = isEntry ? (1 - entryProgress) * -60 : 0;
      const bounce = isEntry && entryProgress > 0.7 ? Math.sin((entryProgress - 0.7) * 10) * 3 : 0;
      transform = `translateY(${dropY + bounce}px)`;
      opacity = isEntry ? entryProgress * active.opacity : isExit ? (1 - exitProgress) * active.opacity : active.opacity;
      break;
    }
    case 'slide_reveal':
      transform = isEntry ? `translateX(${(1 - entryProgress) * 80}px)` : isExit ? `translateX(${exitProgress * -40}px)` : '';
      opacity = isEntry ? entryProgress * active.opacity : isExit ? (1 - exitProgress) * active.opacity : active.opacity;
      break;
    case 'scale_breathe': {
      const breathe = 1 + Math.sin(localFrame / 20) * 0.015;
      transform = `scale(${isEntry ? entryProgress * breathe : breathe})`;
      opacity = isEntry ? entryProgress * active.opacity : isExit ? (1 - exitProgress) * active.opacity : active.opacity;
      break;
    }
    case 'fade_cascade':
      opacity = isEntry ? entryProgress * active.opacity : isExit ? (1 - exitProgress) * active.opacity : active.opacity;
      break;
    case 'typewriter':
      opacity = active.opacity;
      break;
    case 'static_hold':
      opacity = isEntry ? Math.min(1, entryProgress * 2) * active.opacity : isExit ? (1 - exitProgress) * active.opacity : active.opacity;
      break;
    default:
      opacity = isEntry ? entryProgress * active.opacity : isExit ? (1 - exitProgress) * active.opacity : active.opacity;
  }

  // Typewriter: show partial text
  let displayText = active.text;
  if (active.motionIntent === 'typewriter' && isEntry) {
    const chars = Math.floor(active.text.length * entryProgress);
    displayText = active.text.slice(0, chars);
  }

  // Position: use content-aware anchor if available, else fallback to positionY
  const anchor = active.anchor;
  const positionStyles: React.CSSProperties = anchor ? {
    top: anchor.verticalAlign === 'bottom' ? undefined : `${Math.round(anchor.y * 100)}%`,
    bottom: anchor.verticalAlign === 'bottom' ? `${Math.round((1 - anchor.y) * 100)}%` : undefined,
    left: anchor.alignment === 'right' ? undefined : anchor.alignment === 'center' ? '50%' : `${Math.round(anchor.x * 50)}%`,
    right: anchor.alignment === 'right' ? `${Math.round((1 - anchor.x) * 50)}%` : undefined,
    transform: anchor.alignment === 'center' ? `translateX(-50%) ${transform}` : transform,
    textAlign: anchor.alignment,
    maxWidth: `${Math.round(anchor.maxWidth * 100)}%`,
  } : {
    top: active.positionY === 'top' ? '15%' : active.positionY === 'bottom' ? undefined : '38%',
    bottom: active.positionY === 'bottom' ? '22%' : undefined,
  };

  // Decoration
  let decoration: React.CSSProperties = {};
  if (active.decorStyle === 'highlight') {
    decoration = { backgroundColor: `${active.accentColor}30`, padding: '4px 16px', borderRadius: 8 };
  } else if (active.decorStyle === 'box') {
    decoration = { border: `3px solid ${active.accentColor}`, padding: '8px 20px', borderRadius: 12 };
  } else if (active.decorStyle === 'glow') {
    filter = `drop-shadow(0 0 12px ${active.accentColor}55)`;
  } else if (active.decorStyle === 'underline') {
    decoration = { borderBottom: `3px solid ${active.accentColor}`, paddingBottom: 6 };
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: anchor?.alignment === 'left' ? 'flex-start' : anchor?.alignment === 'right' ? 'flex-end' : 'center',
        alignItems: 'center',
        padding: '0 48px',
        zIndex: active.zIndex,
        pointerEvents: 'none',
        ...positionStyles,
      }}
    >
      <div
        style={{
          fontSize: active.fontSize,
          fontWeight: active.fontWeight,
          fontFamily: getFontStack(),
          letterSpacing: `${active.letterSpacing}em`,
          textTransform: active.textTransform,
          color: active.color,
          opacity,
          transform,
          filter: filter || undefined,
          textAlign: 'center',
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          maxWidth: '88%',
          lineHeight: 1.15,
          ...decoration,
        }}
      >
        {displayText}
      </div>
    </div>
  );
}

// ── Typography Overlay Layer ──────────────────────────────────────────────────

function TypographyOverlay({
  scenes,
  words,
  captions,
}: {
  scenes: DirectedSceneProps[];
  words: Array<{ word: string; start: number; end: number }>;
  captions: CaptionSegment[];
}) {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const currentTime = frame / fps;

  // Find current scene
  const currentScene = scenes.find((s) => currentTime >= s.startTime && currentTime <= s.endTime);
  if (!currentScene) return null;

  // Only show typography overlay for text-heavy intents
  const textIntents = ['emphasize_point', 'introduce_topic', 'call_to_action'];
  if (!textIntents.includes(currentScene.intent)) return null;

  // Get current caption text
  const activeCaption = captions.find((c) => currentTime >= Number(c.start) && currentTime <= Number(c.end));
  if (!activeCaption?.text) return null;

  const text = String(activeCaption.text);
  const emphasisWords = findEmphasisWords(text, currentScene.emphasis);
  const allWords = text.split(/\s+/).filter(Boolean);

  // Entry animation
  const sceneStartFrame = Math.round(currentScene.startTime * fps);
  const localFrame = frame - sceneStartFrame;
  const entryProgress = Math.min(1, localFrame / 12);
  const entryOpacity = entryProgress;
  const entryY = interpolate(entryProgress, [0, 1], [30, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: '28%',
        left: 0,
        right: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        padding: '0 60px',
        zIndex: 12,
        opacity: entryOpacity,
        transform: `translateY(${entryY}px)`,
        fontFamily: getFontStack(),
      }}
    >
      {allWords.map((word, i) => {
        const isEmphasis = emphasisWords.some((ew) => word.toLowerCase().includes(ew.toLowerCase()));
        const style = isEmphasis
          ? typeStyleToCSS(getScaledTypeStyle('display', width), '#FFFFFF')
          : typeStyleToCSS(applyContrast(getScaledTypeStyle('body', width), 'secondary'), '#FFFFFF');

        return (
          <span
            key={`${word}-${i}`}
            style={{
              ...style,
              display: 'inline-block',
              textShadow: isEmphasis
                ? '0 4px 16px rgba(0,0,0,0.5), 0 0 40px rgba(34,211,238,0.15)'
                : '0 2px 8px rgba(0,0,0,0.4)',
              transform: isEmphasis ? 'scale(1.05)' : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AIDirectorReel({
  mediaSrc,
  audioSrc,
  sourceAudioVolume = 1,
  durationSeconds = 30,
  scenes = [],
  captions = [],
  words = [],
  kineticText = [],
  typographyPackage,
  directorDecisions = [],
  visualContinuity,
  captionStyle = 'Studio Clean',
  captionPosition = 'bottom',
  textColor = '#FFFFFF',
  highlightColor = '#22D3EE',
  backgroundColor = '#0F172A',
  fontSize = 'large',
  fontFamily,
  showBackground = true,
  backgroundMusic = false,
  backgroundMusicSrc,
  backgroundMusicVolume = 0.03,
}: AIDirectorReelProps) {
  const subtitleConfig: SubtitleConfig = {
    style: mapCaptionStyle(captionStyle),
    position: captionPosition,
    language: 'en',
    textColor,
    highlightColor,
    backgroundColor,
    fontSize,
    fontFamily: getCaptionFont(captionStyle, fontFamily),
    showBackground,
  };

  const audioUrl = audioSrc || mediaSrc || '';
  const resolvedAudio = resolveAsset(audioUrl);

  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', overflow: 'hidden' }}>
      {/* Scene layers */}
      {scenes.map((scene) => (
        <SceneLayer key={scene.scene} scene={scene} totalScenes={scenes} />
      ))}

      {/* Emphasis visual pop */}
      <EmphasisOverlay words={words} scenes={scenes} />

      {/* Typography hierarchy overlay for text-driven scenes */}
      <TypographyOverlay scenes={scenes} words={words} captions={captions} />

      {/* Kinetic text from the three-stage typography pipeline */}
      {kineticText.length > 0 ? <KineticTextLayer phrases={kineticText} /> : null}

      {/* Cinematic overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent 50%, rgba(2,6,23,0.55) 100%)',
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 120px 40px rgba(2,6,23,0.3)',
          zIndex: 11,
        }}
      />
      {/* Visual Continuity: Color Grade + Tint overlay */}
      {visualContinuity?.colorGrade ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundColor: visualContinuity.colorGrade.tint || '#1E293B',
            opacity: visualContinuity.colorGrade.tintOpacity ?? 0.04,
            mixBlendMode: 'overlay',
            zIndex: 12,
          }}
        />
      ) : null}

      {/* Cinematic vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 150px 50px rgba(0,0,0,0.28)',
          zIndex: 13,
        }}
      />

      {/* Audio */}
      {resolvedAudio ? <Audio src={resolvedAudio} volume={sourceAudioVolume} /> : null}
      {backgroundMusic && backgroundMusicSrc ? (
        <Audio src={resolveAsset(backgroundMusicSrc)} volume={backgroundMusicVolume} />
      ) : null}

      {/* Captions */}
      <SubtitleRenderer captions={normalizeCaptions(captions)} config={subtitleConfig} />
    </AbsoluteFill>
  );
}

// ── Composition Registration ──────────────────────────────────────────────────

const defaultProps: AIDirectorReelProps = {
  durationSeconds: 30,
  captionStyle: 'Studio Clean',
  captionPosition: 'bottom',
  textColor: '#FFFFFF',
  highlightColor: '#22D3EE',
  backgroundColor: '#0F172A',
  fontSize: 'large',
  showBackground: true,
  scenes: [
    { scene: 1, startWord: 0, endWord: 4, startTime: 0, endTime: 4, visualType: 'cinematic_landscape', motion: 'slow_zoom_in', transitionIn: 'soft_fade', intent: 'establish_atmosphere', emphasis: ['director'] },
    { scene: 2, startWord: 5, endWord: 10, startTime: 4, endTime: 8, visualType: 'text_overlay', motion: 'pan_right_ease', transitionIn: 'cross_dissolve', intent: 'explain_concept' },
  ],
  captions: [
    { start: 0, end: 4, text: 'The AI Director plans every shot' },
    { start: 4, end: 8, text: 'Cinematic motion and perfect sync' },
  ],
  words: [
    { word: 'The', start: 0, end: 0.3 },
    { word: 'AI', start: 0.3, end: 0.6 },
    { word: 'Director', start: 0.6, end: 1.2 },
    { word: 'plans', start: 1.2, end: 1.6 },
    { word: 'every', start: 1.6, end: 2.0 },
    { word: 'shot', start: 2.0, end: 2.4 },
  ],
};

export const AIDirectorReelComposition = () => (
  <Composition
    id="AI-DIRECTOR-REEL"
    component={AIDirectorReel}
    durationInFrames={secondsToFrames(30, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const input = props as AIDirectorReelProps;
      const dur = Math.max(1, Math.min(60, Number(input.durationSeconds) || Number(input.sourceDurationSeconds) || 30));
      return { durationInFrames: secondsToFrames(dur, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1080, height: 1920 };
    }}
  />
);
