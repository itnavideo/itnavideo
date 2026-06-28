import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { CanvasGraphicsLayer } from '../../layers/CanvasGraphicsLayer';
import type { CanvasEffect } from '../../layers/CanvasGraphicsLayer';

type DrawScene = {
  start: number;
  end: number;
  title: string;
  subtitle?: string;
  points?: string[];
  highlight?: string;
  sceneNumber?: number;
  isSummary?: boolean;
};

type AutoDrawProps = {
  scenes?: DrawScene[];
  audioUrl?: string;
  mediaSrc?: string;
  sourceAudioVolume?: number;
  topicTitle?: string;
  captions?: Array<{start: number; end: number; text: string}>;
  sourceDurationSeconds?: number;
};

// Dark premium palette
const C = {
  bg: '#07080f',
  bgCard: 'rgba(255,255,255,0.04)',
  bgCardHover: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.08)',
  borderAccent: 'rgba(255,255,255,0.14)',
  text: '#f0f0f5',
  textMuted: 'rgba(255,255,255,0.5)',
  blue: '#5B6FFF',
  violet: '#7C5CFC',
  amber: '#F5C542',
  green: '#34D399',
  red: '#F87171',
  pink: '#F472B6',
};

// Point card colors — rotate per index
const POINT_COLORS = [
  { border: C.blue, bg: 'rgba(91,111,255,0.08)', icon: '→' },
  { border: C.amber, bg: 'rgba(245,197,66,0.07)', icon: '★' },
  { border: C.green, bg: 'rgba(52,211,153,0.07)', icon: '✓' },
  { border: C.pink, bg: 'rgba(244,114,182,0.07)', icon: '◆' },
  { border: C.violet, bg: 'rgba(124,92,252,0.07)', icon: '•' },
];

// ─── SCENE TRANSITION WRAPPER ────────────────────────────────────────────────
// Each scene slides in from right, slides out to left
function SceneTransition({ children }: { children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in from right on entry (frames 0-10)
  const enterX = interpolate(frame, [0, 10], [120, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const enterOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
  });

  return (
    <div style={{
      transform: `translateX(${enterX}px)`,
      opacity: enterOpacity,
      width: '100%', height: '100%',
    }}>
      {children}
    </div>
  );
}

// ─── INTRO SCENE ─────────────────────────────────────────────────────────────
function IntroScene({ title }: { title: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12, stiffness: 120, mass: 0.8 }, from: 0.7, to: 1 });
  const titleOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const lineProgress = interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
  const subtextOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Canvas underline draw effect
  const introEffects: CanvasEffect[] = [{
    type: 'underline', startFrame: 10, endFrame: 28,
    config: { x: 80, y: 1010, width: 920, color: C.violet, thickness: 4 }
  }, {
    type: 'sparkle', startFrame: 0, endFrame: 50,
    config: { count: 8, color: C.amber }
  }, {
    type: 'glow-pulse', startFrame: 0, endFrame: 45,
    config: { x: 540, y: 960, radius: 350, color: 'rgba(124,92,252,0.12)' }
  }];

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* Dot pattern bg */}
      <CanvasGraphicsLayer effects={[{
        type: 'dot-pattern', startFrame: 0, endFrame: 999,
        config: { spacing: 44, dotSize: 1.5, color: 'rgba(255,255,255,0.7)' }
      }]} zIndex={1} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 60px', gap: 24,
      }}>
        {/* Pill label */}
        <div style={{
          opacity: subtextOpacity,
          padding: '8px 20px', borderRadius: 100,
          background: 'rgba(124,92,252,0.12)',
          border: `1px solid rgba(124,92,252,0.3)`,
          fontSize: 22, fontWeight: 600, color: C.violet,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Explainer
        </div>

        {/* Main title */}
        <h1 style={{
          fontSize: title.length > 24 ? 72 : title.length > 16 ? 84 : 96,
          fontWeight: 900, color: C.text, textAlign: 'center',
          lineHeight: 1.1, letterSpacing: -1.5,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}>
          {title}
        </h1>

        {/* Canvas underline */}
        <CanvasGraphicsLayer effects={introEffects} zIndex={5} />
      </div>
    </AbsoluteFill>
  );
}

// ─── DRAW SCENE PANEL ────────────────────────────────────────────────────────
function DrawScenePanel({
  scene, index, totalScenes,
}: { scene: DrawScene; index: number; totalScenes: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneDuration = Math.round((scene.end - scene.start) * fps);

  const isIntro = !scene.sceneNumber && index === 0;
  const isSummary = scene.isSummary;
  const hasPoints = scene.points && scene.points.length > 0;

  // Title animation
  const titleSpring = spring({ frame, fps, config: { damping: 14, mass: 0.6, stiffness: 160 } });
  const titleY = interpolate(frame, [0, 14], [32, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Scene number badge spring
  const badgeSpring = spring({ frame, fps, config: { damping: 10, stiffness: 200, mass: 0.5 }, from: 0.4, to: 1 });

  // Highlight card
  const highlightSpring = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 14 } });

  // Subtitle strip
  const subOpacity = interpolate(frame, [16, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subY = interpolate(frame, [16, 28], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Canvas effects for this scene
  const sceneEffects: CanvasEffect[] = [];

  // Underline under title
  sceneEffects.push({
    type: 'underline', startFrame: 8, endFrame: 22,
    config: { x: 80, y: 520, width: 920, color: C.blue, thickness: 3 }
  });

  // Glow pulse near scene number
  if (scene.sceneNumber) {
    sceneEffects.push({
      type: 'glow-pulse', startFrame: 0, endFrame: 30,
      config: { x: 120, y: 230, radius: 80, color: `${C.blue}33` }
    });
  }

  // Summary sparkle
  if (isSummary) {
    sceneEffects.push({
      type: 'sparkle', startFrame: 0, endFrame: 60,
      config: { count: 10, color: C.amber }
    });
  }

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* Subtle dot pattern */}
      <CanvasGraphicsLayer effects={[{
        type: 'dot-pattern', startFrame: 0, endFrame: 9999,
        config: { spacing: 44, dotSize: 1.2, color: 'rgba(255,255,255,0.6)' }
      }]} zIndex={1} />

      <SceneTransition>
        {/* ── TOP ZONE (0–200px): progress + scene badge ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 180,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '0 60px 20px',
          gap: 14,
        }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 7 }}>
            {Array.from({ length: totalScenes }).map((_, i) => (
              <div key={i} style={{
                height: 5, flex: 1, borderRadius: 3,
                background: i <= index ? C.blue : 'rgba(255,255,255,0.1)',
              }} />
            ))}
          </div>

          {/* Scene badge or emoji */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {scene.sceneNumber ? (
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `linear-gradient(135deg, ${C.blue}, ${C.violet})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 900, color: '#fff',
                boxShadow: `0 4px 16px rgba(91,111,255,0.35)`,
                transform: `scale(${badgeSpring})`,
              }}>
                {scene.sceneNumber}
              </div>
            ) : (
              <div style={{
                fontSize: 44,
                opacity: titleSpring,
                transform: `scale(${badgeSpring})`,
              }}>
                {isSummary ? '🎯' : '💡'}
              </div>
            )}
            <span style={{
              fontSize: 20, fontWeight: 600, color: C.textMuted,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {isSummary ? 'Summary' : scene.sceneNumber ? `Step ${scene.sceneNumber}` : 'Key Point'}
            </span>
          </div>
        </div>

        {/* ── MAIN ZONE (180–1700px): title + content ── */}
        <div style={{
          position: 'absolute', top: 180, left: 0, right: 0, bottom: 220,
          padding: '40px 60px',
          display: 'flex', flexDirection: 'column', gap: 28,
          overflowY: 'hidden',
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: scene.title.length > 22 ? 62 : scene.title.length > 14 ? 74 : 86,
            fontWeight: 900, color: C.text,
            letterSpacing: -1.5, lineHeight: 1.08,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            opacity: titleSpring,
            transform: `translateY(${titleY}px)`,
          }}>
            {scene.title}
          </h1>

          {/* Points — each staggered by transcript-aware delay */}
          {hasPoints && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {scene.points!.map((point, i) => {
                // Spread points across scene duration instead of all at start
                const totalPoints = scene.points!.length;
                const spreadDelay = Math.round((sceneDuration * 0.15) + (sceneDuration * 0.5 / totalPoints) * i);
                const pointProgress = spring({
                  frame: Math.max(0, frame - spreadDelay), fps,
                  config: { damping: 14, stiffness: 160, mass: 0.5 }
                });
                const col = POINT_COLORS[i % POINT_COLORS.length];

                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 16,
                    padding: '20px 24px', borderRadius: 20,
                    background: col.bg,
                    border: `1px solid ${col.border}`,
                    borderLeft: `4px solid ${col.border}`,
                    opacity: pointProgress,
                    transform: `translateX(${(1 - pointProgress) * 40}px)`,
                  }}>
                    <span style={{
                      fontSize: 22, color: col.border,
                      fontWeight: 900, flexShrink: 0, marginTop: 3,
                      width: 32, textAlign: 'center',
                    }}>
                      {col.icon}
                    </span>
                    <span style={{
                      fontSize: 32, fontWeight: 700, color: C.text,
                      fontFamily: 'system-ui', lineHeight: 1.35,
                    }}>
                      {point}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Highlight / Warning card */}
          {scene.highlight && (
            <div style={{
              padding: '22px 28px', borderRadius: 20,
              background: 'rgba(248,113,113,0.06)',
              border: `1px solid rgba(248,113,113,0.25)`,
              borderLeft: `4px solid ${C.red}`,
              display: 'flex', alignItems: 'flex-start', gap: 16,
              opacity: highlightSpring,
              transform: `translateX(${(1 - highlightSpring) * 30}px)`,
            }}>
              <span style={{ fontSize: 34, flexShrink: 0 }}>⚡</span>
              <span style={{
                fontSize: 30, fontWeight: 800, color: C.red,
                fontFamily: 'system-ui', lineHeight: 1.3,
              }}>
                {scene.highlight}
              </span>
            </div>
          )}

          {/* Summary checklist */}
          {isSummary && !hasPoints && (
            <div style={{
              padding: '24px 28px', borderRadius: 20,
              background: `rgba(52,211,153,0.06)`,
              border: `1px solid rgba(52,211,153,0.2)`,
              borderLeft: `4px solid ${C.green}`,
              opacity: highlightSpring,
            }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: C.green, lineHeight: 1.4 }}>
                ✅ Now you know the key points!
              </span>
            </div>
          )}
        </div>

        {/* ── BOTTOM ZONE (1700–1920px): subtitle quote strip ── */}
        {scene.subtitle && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 220,
            display: 'flex', alignItems: 'center',
            padding: '0 60px',
            borderTop: `1px solid ${C.border}`,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}>
            <div style={{
              padding: '18px 24px', borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${C.violet}`,
            }}>
              <p style={{
                fontSize: 28, fontWeight: 600, color: C.textMuted,
                fontFamily: 'system-ui', lineHeight: 1.4,
              }}>
                {scene.subtitle.length > 100
                  ? scene.subtitle.slice(0, 97) + '...'
                  : scene.subtitle}
              </p>
            </div>
          </div>
        )}
      </SceneTransition>

      {/* Canvas effects */}
      <CanvasGraphicsLayer effects={sceneEffects} zIndex={6} />
    </AbsoluteFill>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
function AutoDrawExplainer({
  scenes = [],
  audioUrl,
  mediaSrc,
  sourceAudioVolume = 1,
  topicTitle = 'Explainer',
  captions = [],
}: AutoDrawProps) {
  const { fps, durationInFrames } = useVideoConfig();
  const audioSrc = audioUrl || mediaSrc || '';
  const durationSeconds = durationInFrames / fps;

  // Use provided scenes or build from captions
  const rawScenes = scenes.length > 0 ? scenes : buildScenesFromCaptions(captions, topicTitle);

  // Ensure scenes cover full duration — last scene always extends to end
  const displayScenes: DrawScene[] = rawScenes.map((s, i) => ({
    ...s,
    // Last scene extends to full duration
    end: i === rawScenes.length - 1 ? Math.max(s.end, durationSeconds) : s.end,
  }));

  // Check if first scene is already an intro (no sceneNumber, title matches topicTitle)
  const firstIsIntro = displayScenes.length > 0 && !displayScenes[0].sceneNumber && displayScenes[0].start < 1;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Audio */}
      {audioSrc ? <Audio src={audioSrc} volume={sourceAudioVolume} /> : null}

      {/* Scenes */}
      {displayScenes.map((scene, i) => {
        const from = Math.round(scene.start * fps);
        const duration = Math.max(1, Math.round((scene.end - scene.start) * fps));
        const isIntroScene = i === 0 && firstIsIntro;

        return (
          <Sequence key={`scene-${i}-${scene.start}`} from={from} durationInFrames={duration}>
            {isIntroScene ? (
              <IntroScene title={topicTitle || scene.title} />
            ) : (
              <DrawScenePanel
                scene={scene}
                index={i}
                totalScenes={displayScenes.length}
              />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}

// ─── CAPTION FALLBACK SCENE BUILDER ──────────────────────────────────────────
function buildScenesFromCaptions(
  captions: Array<{start: number; end: number; text: string}>,
  topicTitle: string,
): DrawScene[] {
  if (!captions.length) {
    return [
      { start: 0, end: 3, title: topicTitle || 'EXPLAINER', subtitle: undefined },
      { start: 3, end: 10, title: 'UPLOAD AUDIO', subtitle: 'Upload audio to generate scenes automatically', sceneNumber: 1 },
    ];
  }

  const totalDuration = captions[captions.length - 1]?.end || 30;
  const scenes: DrawScene[] = [];

  // Intro scene
  scenes.push({
    start: 0,
    end: Math.min(3, captions[0]?.start || 3),
    title: topicTitle || 'EXPLAINER',
    subtitle: undefined,
  });

  // Group captions into 5-7s scenes
  let group: typeof captions = [];
  let groupStart = captions[0]?.start || 0;

  for (const cap of captions) {
    if (group.length > 0 && (cap.start - groupStart > 6 || group.length >= 4)) {
      scenes.push({
        start: groupStart,
        end: group[group.length - 1].end,
        title: group[0].text.split(' ').slice(0, 4).join(' ').toUpperCase(),
        subtitle: group.map(c => c.text).join(' ').slice(0, 120),
        sceneNumber: scenes.length,
        points: group.length > 1 ? group.slice(0, 4).map(c => c.text.slice(0, 50)) : undefined,
      });
      group = [];
      groupStart = cap.start;
    }
    group.push(cap);
  }

  // Last group — extends to full duration
  if (group.length) {
    scenes.push({
      start: groupStart,
      end: totalDuration,
      title: group[0].text.split(' ').slice(0, 4).join(' ').toUpperCase(),
      subtitle: group.map(c => c.text).join(' ').slice(0, 120),
      sceneNumber: scenes.length,
      isSummary: true,
    });
  }

  return scenes;
}

// ─── DEFAULT PROPS + COMPOSITION ─────────────────────────────────────────────
const defaultProps: AutoDrawProps = {
  topicTitle: '5 Habits That Will Change Your Life',
  audioUrl: '',
  sourceAudioVolume: 1,
  scenes: [
    { start: 0, end: 3, title: '5 HABITS', subtitle: undefined },
    { start: 3, end: 11, title: 'WAKE UP EARLY', points: ['More time for yourself', 'Better focus and clarity', 'Positive start to the day'], subtitle: 'Subah jaldi uthna mental clarity deta hai', sceneNumber: 1 },
    { start: 11, end: 20, title: 'PLAN YOUR DAY', points: ['Set 3 main goals', 'Block focus time', 'Review at night'], subtitle: 'Plan karne se focus badhta hai aur productivity bhi', sceneNumber: 2, highlight: 'FOCUS → PRODUCTIVITY → DISCIPLINE' },
    { start: 20, end: 30, title: 'EXERCISE DAILY', points: ['Better health', 'Boosts mood instantly', 'Builds discipline'], subtitle: 'Exercise body aur mind ke liye zaroori hai', sceneNumber: 3, isSummary: true },
  ],
  captions: [],
};

export const AutoDrawExplainerComposition = () => (
  <Composition
    id="AUTO-DRAW-EXPLAINER"
    component={AutoDrawExplainer}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const p = props as AutoDrawProps;
      const dur = Math.max(8, Math.min(60, Number(p.sourceDurationSeconds) || 30));
      return { durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920 };
    }}
  />
);
