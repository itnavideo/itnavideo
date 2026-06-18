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
  const contentDelay = 12;

  return (
    <AbsoluteFill style={{padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      {/* Time stamp */}
      <div style={{position: 'absolute', top: 40, left: 60, fontSize: 22, fontFamily: 'monospace', color: COLORS.muted, opacity: 0.6}}>
        {formatTime(scene.start)} – {formatTime(scene.end)}
      </div>

      {/* Scene number + Title */}
      <div style={{display: 'flex', alignItems: 'center', gap: 24, opacity: titleReveal, transform: `translateY(${(1 - titleReveal) * 20}px)`}}>
        {scene.sceneNumber ? (
          <div style={{
            width: 72, height: 72, borderRadius: '50%', border: `4px solid ${COLORS.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 900, color: COLORS.accent, fontFamily: 'system-ui',
          }}>
            {scene.sceneNumber}
          </div>
        ) : null}
        <h1 style={{
          fontSize: scene.title.length > 20 ? 64 : 80,
          fontWeight: 900, color: COLORS.text, fontFamily: 'system-ui',
          letterSpacing: -2, lineHeight: 1,
          textTransform: 'uppercase',
        }}>
          {scene.title}
        </h1>
      </div>

      {/* Points / bullets */}
      {scene.points?.length ? (
        <div style={{marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20}}>
          {scene.points.map((point, i) => {
            const pointProgress = spring({frame: Math.max(0, frame - contentDelay - i * 8), fps, config: {damping: 12}});
            return (
              <div key={`point-${i}`} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                opacity: pointProgress,
                transform: `translateX(${(1 - pointProgress) * 30}px)`,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 6, backgroundColor: COLORS.green,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, color: '#fff', fontWeight: 900,
                }}>✓</div>
                <span style={{fontSize: 36, fontWeight: 700, color: COLORS.text, fontFamily: 'system-ui'}}>
                  {point}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Highlight box */}
      {scene.highlight ? (
        <div style={{
          marginTop: 40,
          padding: '20px 32px',
          borderRadius: 16,
          border: `3px solid ${COLORS.red}`,
          backgroundColor: 'rgba(239,68,68,0.05)',
          opacity: spring({frame: Math.max(0, frame - contentDelay - 20), fps, config: {damping: 14}}),
        }}>
          <span style={{fontSize: 32, fontWeight: 800, color: COLORS.red, fontFamily: 'system-ui'}}>
            {scene.highlight}
          </span>
        </div>
      ) : null}

      {/* Subtitle at bottom */}
      {scene.subtitle ? (
        <div style={{
          position: 'absolute', bottom: 60, left: 60, right: 60,
          opacity: spring({frame: Math.max(0, frame - 18), fps, config: {damping: 16}}),
        }}>
          <p style={{
            fontSize: 30, fontWeight: 600, color: COLORS.muted,
            fontFamily: 'system-ui', lineHeight: 1.4, textAlign: 'center',
          }}>
            {scene.subtitle}
          </p>
        </div>
      ) : null}

      {/* Decorative border */}
      <div style={{
        position: 'absolute', inset: 24, border: `2px solid ${COLORS.border}`,
        borderRadius: 20, pointerEvents: 'none',
      }} />
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
