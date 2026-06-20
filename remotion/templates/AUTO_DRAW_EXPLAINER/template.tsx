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

const COLORS = {
  bg: '#ffffff',
  text: '#1a1a2e',
  accent: '#2563eb',
  highlight: '#facc15',
  red: '#ef4444',
  green: '#22c55e',
  border: '#e2e8f0',
  muted: '#64748b',
};

function AutoDrawExplainer({
  scenes = [],
  audioUrl,
  mediaSrc,
  sourceAudioVolume = 1,
  topicTitle = 'Explainer',
  captions = [],
}: AutoDrawProps) {
  const {fps} = useVideoConfig();
  const audioSrc = audioUrl || mediaSrc || '';

  // If no scenes provided, generate from captions
  const displayScenes = scenes.length > 0 ? scenes : buildScenesFromCaptions(captions, topicTitle);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* Audio */}
      {audioSrc ? <Audio src={audioSrc} volume={sourceAudioVolume} /> : null}

      {/* Paper texture overlay */}
      <div style={{position: 'absolute', inset: 0, opacity: 0.03, background: 'repeating-linear-gradient(0deg, transparent, transparent 28px, #000 28px, #000 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, #000 28px, #000 29px)'}} />

      {/* Scenes */}
      {displayScenes.map((scene, i) => {
        const from = Math.round(scene.start * fps);
        const duration = Math.max(1, Math.round((scene.end - scene.start) * fps));
        return (
          <Sequence key={`scene-${i}`} from={from} durationInFrames={duration}>
            <DrawScenePanel scene={scene} index={i} totalScenes={displayScenes.length} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}

function DrawScenePanel({scene, index, totalScenes}: {scene: DrawScene; index: number; totalScenes: number}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleReveal = spring({frame, fps, config: {damping: 14, mass: 0.6}});
  const contentDelay = 10;
  const isIntro = index === 0 && !scene.sceneNumber;
  const isSummary = scene.isSummary || index === totalScenes - 1;
  const sceneEmoji = isSummary ? '🎯' : scene.highlight ? '⚠️' : scene.points?.length ? '📋' : isIntro ? '💡' : '📌';
  const hasPoints = scene.points && scene.points.length > 0;

  return (
    <AbsoluteFill style={{padding: '80px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32}}>
      {/* Progress indicator */}
      <div style={{position: 'absolute', top: 36, left: 48, right: 48, display: 'flex', gap: 6}}>
        {Array.from({length: totalScenes}).map((_, i) => (
          <div key={i} style={{flex: 1, height: 6, borderRadius: 3, background: i <= index ? COLORS.accent : COLORS.border, transition: 'background 0.3s'}} />
        ))}
      </div>

      {/* Scene number badge */}
      {scene.sceneNumber ? (
        <div style={{
          opacity: titleReveal,
          width: 64, height: 64, borderRadius: 16, background: COLORS.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, fontWeight: 900, color: '#fff',
          boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
        }}>
          {scene.sceneNumber}
        </div>
      ) : (
        <span style={{fontSize: 52, opacity: titleReveal}}>{sceneEmoji}</span>
      )}

      {/* Title */}
      <h1 style={{
        fontSize: scene.title.length > 20 ? 56 : 68,
        fontWeight: 900, color: COLORS.text, fontFamily: 'system-ui',
        letterSpacing: -2, lineHeight: 1.05,
        opacity: titleReveal, transform: `translateY(${(1 - titleReveal) * 20}px)`,
      }}>
        {scene.title}
      </h1>

      {/* Points */}
      {hasPoints ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          {scene.points!.map((point, i) => {
            const pointProgress = spring({frame: Math.max(0, frame - contentDelay - i * 10), fps, config: {damping: 12}});
            const emojis = ['✅', '📍', '⭐', '💡', '🔑', '→'];
            return (
              <div key={`point-${i}`} style={{
                opacity: pointProgress, transform: `translateX(${(1 - pointProgress) * 30}px)`,
                display: 'flex', alignItems: 'flex-start', gap: 16,
                padding: '20px 28px', borderRadius: 18,
                background: i === 0 ? '#f0f9ff' : i === 1 ? '#fefce8' : '#f0fdf4',
                border: `2px solid ${i === 0 ? '#bae6fd' : i === 1 ? '#fde68a' : '#bbf7d0'}`,
              }}>
                <span style={{fontSize: 28, flexShrink: 0, marginTop: 2}}>{emojis[i % emojis.length]}</span>
                <span style={{fontSize: 34, fontWeight: 700, color: COLORS.text, fontFamily: 'system-ui', lineHeight: 1.3}}>
                  {point}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Highlight / Warning card */}
      {scene.highlight ? (
        <div style={{
          padding: '24px 32px', borderRadius: 20,
          background: 'linear-gradient(135deg, #fef2f2, #fff1f2)',
          border: `3px solid ${COLORS.red}55`,
          opacity: spring({frame: Math.max(0, frame - contentDelay - 16), fps, config: {damping: 14}}),
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <span style={{fontSize: 38}}>⚡</span>
          <span style={{fontSize: 32, fontWeight: 800, color: COLORS.red, fontFamily: 'system-ui', lineHeight: 1.3}}>
            {scene.highlight}
          </span>
        </div>
      ) : null}

      {/* Subtitle — larger, centered, visible */}
      {scene.subtitle ? (
        <div style={{
          marginTop: 'auto', paddingTop: 24,
          opacity: spring({frame: Math.max(0, frame - 12), fps, config: {damping: 16}}),
        }}>
          <div style={{
            padding: '22px 32px', borderRadius: 20,
            background: COLORS.accent + '0a', border: `2px solid ${COLORS.accent}22`,
          }}>
            <p style={{
              fontSize: 32, fontWeight: 700, color: COLORS.text,
              fontFamily: 'system-ui', lineHeight: 1.4, textAlign: 'center',
            }}>
              {scene.subtitle}
            </p>
          </div>
        </div>
      ) : null}

      {/* Background accent */}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 300, background: 'linear-gradient(0deg, #f8fafc, transparent)', pointerEvents: 'none', zIndex: -1}} />
    </AbsoluteFill>
  );
}

function buildScenesFromCaptions(captions: Array<{start: number; end: number; text: string}>, topicTitle: string): DrawScene[] {
  if (!captions.length) {
    return [{start: 0, end: 10, title: topicTitle || 'Explainer', sceneNumber: 1, subtitle: 'Upload audio to generate scenes'}];
  }
  return captions.map((cap, i) => ({
    start: cap.start,
    end: cap.end,
    title: cap.text.split(' ').slice(0, 4).join(' ').toUpperCase(),
    subtitle: cap.text,
    sceneNumber: i + 1,
    points: i > 0 ? cap.text.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3) : undefined,
  }));
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const defaultProps: AutoDrawProps = {
  topicTitle: '5 Habits That Will Change Your Life',
  audioUrl: '',
  sourceAudioVolume: 1,
  scenes: [
    {start: 0, end: 4, title: '5 HABITS', subtitle: 'Aaj hum baat karenge 5 habits ke baare mein', sceneNumber: undefined, isSummary: false},
    {start: 5, end: 12, title: 'WAKE UP EARLY', points: ['More time for yourself', 'Better focus', 'Positive start'], subtitle: 'Subah jaldi uthna mental clarity deta hai', sceneNumber: 1},
    {start: 13, end: 20, title: 'PLAN YOUR DAY', points: ['Focus', 'Productivity', 'Discipline'], subtitle: 'Plan karne se focus badhta hai', sceneNumber: 2, highlight: 'FOCUS → PRODUCTIVITY → DISCIPLINE'},
    {start: 21, end: 28, title: 'EXERCISE DAILY', points: ['Better Health', 'Good Mood', 'More Energy'], subtitle: 'Exercise body aur mind ke liye zaroori hai', sceneNumber: 3},
  ],
  captions: [],
};

export const AutoDrawExplainerComposition = () => (
  <Composition
    id="AUTO-DRAW-EXPLAINER"
    component={AutoDrawExplainer}
    durationInFrames={1800}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const dur = Math.max(8, Math.min(60, Number((props as any).sourceDurationSeconds) || 60));
      return {durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
