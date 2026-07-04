/**
 * AUTO DRAW EXPLAINER — Premium Visual Explainer
 *
 * Identity: Bloomberg / Visualize Value / Ali Abdaal educational motion graphics.
 * One scene fills the full 9:16 canvas. No subtitles. No notebook. No white canvas.
 * Every element draws in sync with the voiceover.
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {PremiumAudioLayer, type PremiumSoundCue, type PremiumStyleLock} from '../../components/PremiumAudioLayer';
import {PremiumVisualTreatment, type PremiumVisualStyleLock} from '../../components/PremiumVisualTreatment';

// ─── Types (must match autoDrawPlanner.ts exports) ────────────────────────────

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

type NoteElementType =
  | 'heading' | 'bullet' | 'label' | 'highlight'
  | 'sketch' | 'arrow' | 'circle' | 'underline';

type NoteElement = {
  id: string;
  type: NoteElementType;
  text?: string;
  x: number; y: number;
  width: number; height: number;
  start: number; end: number;
  revealStart: number; revealEnd: number;
  pageIndex: number;
  sourceSceneIndex: number;
  sourceCaptionIndex?: number;
  accent?: string;
  variant?: string;
};

type NotePage = {
  id: string; index: number; title: string;
  start: number; end: number;
  elements: NoteElement[];
};

type RevealItem = {
  elementId: string; pageIndex: number;
  start: number; end: number;
  effect: 'mask-wipe' | 'fade-slide' | 'stroke-reveal' | 'highlight-sweep' | 'circle-burst' | 'arrow-draw' | 'pop';
  sourceSceneIndex: number;
  sourceCaptionIndex?: number;
  transcriptText?: string;
};

type NotesPlan = {
  pages: NotePage[];
  elements: NoteElement[];
  revealTimeline: RevealItem[];
  transcriptSegmentMapping?: Array<{
    segmentIndex: number; start: number; end: number;
    text: string; elementIds: string[]; pageIndex: number;
  }>;
};

type AutoDrawProps = {
  scenes?: DrawScene[];
  notesPlan?: NotesPlan;
  audioUrl?: string;
  mediaSrc?: string;
  sourceAudioVolume?: number;
  topicTitle?: string;
  captions?: Array<{start: number; end: number; text: string}>;
  sourceDurationSeconds?: number;
  durationSeconds?: number;
  showDebugPanel?: boolean;
  showDebugControls?: boolean;
  debugPlaybackSpeed?: 0.5 | 1 | 1.5 | 2;
  premiumEditing?: boolean;
  styleLock?: PremiumStyleLock & PremiumVisualStyleLock;
  soundCues?: PremiumSoundCue[];
};

// ─── Design tokens ────────────────────────────────────────────────────────────

const D = {
  bg: '#080C14',
  bgCard: '#0E1420',
  bgCardBright: '#121A2A',
  border: 'rgba(255,255,255,0.08)',
  borderAccent: 'rgba(255,255,255,0.18)',
  text: '#F1F5F9',
  textMuted: '#64748B',
  textDim: '#94A3B8',
  blue: '#3B82F6',
  cyan: '#06B6D4',
  amber: '#F59E0B',
  emerald: '#10B981',
  rose: '#F43F5E',
  violet: '#8B5CF6',
  // scene accent palette — each scene gets one
  accents: ['#3B82F6', '#06B6D4', '#F59E0B', '#10B981', '#8B5CF6', '#F43F5E'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function resolveRemotionMediaSrc(src: string) {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return staticFile(src.slice(1));
  return src;
}

function useEntrance(localFrame: number, config = {damping: 16, stiffness: 140, mass: 0.7}) {
  const {fps} = useVideoConfig();
  return spring({frame: localFrame, fps, config});
}

function sceneAccent(sceneIndex: number) {
  return D.accents[sceneIndex % D.accents.length];
}

// ─── Scene-level utilities ────────────────────────────────────────────────────

function getActiveScene(scenes: DrawScene[], currentTime: number): {scene: DrawScene; index: number} | null {
  for (let i = 0; i < scenes.length; i++) {
    if (currentTime >= scenes[i].start && currentTime < scenes[i].end) {
      return {scene: scenes[i], index: i};
    }
  }
  // clamp to last scene after end
  if (scenes.length > 0 && currentTime >= scenes[scenes.length - 1].end) {
    return {scene: scenes[scenes.length - 1], index: scenes.length - 1};
  }
  return null;
}

function sceneDuration(scene: DrawScene) {
  return Math.max(0.1, scene.end - scene.start);
}

function sceneLocalTime(scene: DrawScene, currentTime: number) {
  return Math.max(0, currentTime - scene.start);
}

// ─── Background ───────────────────────────────────────────────────────────────

function PremiumBackground({accent}: {accent: string}) {
  return (
    <AbsoluteFill style={{background: D.bg, overflow: 'hidden'}}>
      {/* Subtle dot-grid */}
      <AbsoluteFill style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
      {/* Top accent glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: accent,
        boxShadow: `0 0 40px ${accent}99`,
      }} />
      {/* Ambient radial from top */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 900px 500px at 50% 0%, ${accent}18 0%, transparent 65%)`,
      }} />
    </AbsoluteFill>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar({topicTitle, sceneIndex, totalScenes, accent}: {topicTitle: string; sceneIndex: number; totalScenes: number; accent: string}) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 120, padding: '0 64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      zIndex: 30,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <div style={{
          width: 8, height: 8, borderRadius: 999,
          background: accent, boxShadow: `0 0 12px ${accent}`,
        }} />
        <span style={{
          fontSize: 22, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: D.textMuted,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          {topicTitle}
        </span>
      </div>
      <span style={{
        fontSize: 22, fontWeight: 800, color: D.textMuted,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {sceneIndex + 1} / {totalScenes}
      </span>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({currentTime, durationSeconds, accent}: {currentTime: number; durationSeconds: number; accent: string}) {
  const pct = clamp(currentTime / Math.max(1, durationSeconds), 0, 1);
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, zIndex: 30,
      background: 'rgba(255,255,255,0.07)',
    }}>
      <div style={{
        height: '100%', width: `${pct * 100}%`,
        background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
        borderRadius: '0 3px 3px 0',
        boxShadow: `0 0 14px ${accent}88`,
      }} />
    </div>
  );
}

// ─── Animated line ────────────────────────────────────────────────────────────

function DrawLine({progress, color, width = 900, thickness = 3, y = 0}: {
  progress: number; color: string; width?: number; thickness?: number; y?: number;
}) {
  const dash = width;
  return (
    <svg width={width} height={thickness + 2} style={{display: 'block', overflow: 'visible'}}>
      <line
        x1={0} y1={y + thickness / 2} x2={width} y2={y + thickness / 2}
        stroke={color} strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - easeOut(progress))}
      />
    </svg>
  );
}

// ─── Heading with mask-wipe ────────────────────────────────────────────────────

function WipeHeading({text, localFrame, accent, fontSize, color = D.text}: {
  text: string; localFrame: number; accent: string; fontSize: number; color?: string;
}) {
  const {fps} = useVideoConfig();
  const progress = spring({frame: localFrame, fps, config: {damping: 14, stiffness: 100, mass: 0.6}});
  const wipe = easeOut(clamp(progress, 0, 1));
  return (
    <div style={{overflow: 'hidden', position: 'relative'}}>
      <div style={{
        clipPath: `inset(0 ${Math.round((1 - wipe) * 100)}% 0 0)`,
        fontSize, fontWeight: 900, lineHeight: 1.0,
        color,
        fontFamily: 'Inter, system-ui, sans-serif',
        letterSpacing: '-0.02em',
      }}>
        {text}
      </div>
    </div>
  );
}

// ─── Staggered bullets ────────────────────────────────────────────────────────

function StaggerBullet({text, localFrame, delay, accent, index}: {
  text: string; localFrame: number; delay: number; accent: string; index: number;
}) {
  const {fps} = useVideoConfig();
  const f = Math.max(0, localFrame - delay);
  const enter = spring({frame: f, fps, config: {damping: 18, stiffness: 130, mass: 0.65}});
  const opacity = clamp(interpolate(f, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);
  const y = interpolate(enter, [0, 1], [28, 0]);
  const colors = [D.blue, D.cyan, D.amber, D.emerald, D.violet];
  const dotColor = colors[index % colors.length];

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 28,
      transform: `translateY(${y}px)`, opacity,
    }}>
      <div style={{
        width: 12, height: 12, borderRadius: 999,
        background: dotColor, flexShrink: 0,
        marginTop: 16,
        boxShadow: `0 0 10px ${dotColor}88`,
      }} />
      <span style={{
        fontSize: 40, fontWeight: 700, lineHeight: 1.25,
        color: D.text, fontFamily: 'Inter, system-ui, sans-serif',
        flex: 1,
      }}>
        {text}
      </span>
    </div>
  );
}

// ─── Highlight callout ────────────────────────────────────────────────────────

function HighlightCallout({text, localFrame, accent}: {text: string; localFrame: number; accent: string}) {
  const enter = useEntrance(localFrame, {damping: 14, stiffness: 110, mass: 0.75});
  const opacity = clamp(interpolate(localFrame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);
  const scale = interpolate(enter, [0, 1], [0.94, 1]);
  return (
    <div style={{
      transform: `scale(${scale})`, opacity,
      padding: '36px 44px',
      borderRadius: 20,
      background: `${accent}14`,
      border: `2px solid ${accent}55`,
      boxShadow: `0 0 60px ${accent}22, inset 0 1px 0 ${accent}33`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 24,
      }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{flexShrink: 0, marginTop: 4}}>
          <path d="M18 4L4 28h28L18 4z" fill={`${accent}22`} stroke={accent} strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M18 15v7" stroke={accent} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="18" cy="25" r="1.5" fill={accent}/>
        </svg>
        <span style={{
          fontSize: 40, fontWeight: 800, lineHeight: 1.25, color: accent,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          {text}
        </span>
      </div>
    </div>
  );
}

// ─── Large stat / number badge ────────────────────────────────────────────────

function SceneNumberBadge({num, accent, localFrame}: {num: number; accent: string; localFrame: number}) {
  const enter = useEntrance(localFrame, {damping: 12, stiffness: 160, mass: 0.5});
  const scale = interpolate(enter, [0, 1], [0.5, 1]);
  const opacity = clamp(interpolate(localFrame, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);
  return (
    <div style={{
      transform: `scale(${scale})`, opacity,
      fontSize: 160, fontWeight: 950, lineHeight: 0.85,
      color: `${accent}1A`,
      fontFamily: 'Inter, system-ui, sans-serif',
      letterSpacing: '-0.05em',
      position: 'absolute', right: 52, top: 130,
      userSelect: 'none', pointerEvents: 'none',
    }}>
      {String(num).padStart(2, '0')}
    </div>
  );
}

// ─── Scene renderers ──────────────────────────────────────────────────────────

/**
 * INTRO scene — big hook title, full screen centered
 */
function IntroScene({scene, localFrame, accent}: {scene: DrawScene; localFrame: number; accent: string}) {
  const {fps} = useVideoConfig();
  const lineProgress = clamp(interpolate(localFrame, [8, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);
  const subtitleEnter = spring({frame: Math.max(0, localFrame - 22), fps, config: {damping: 18, stiffness: 100, mass: 0.8}});
  const subtitleOpacity = clamp(interpolate(localFrame, [22, 36], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '160px 72px',
    }}>
      {/* Eyebrow label */}
      <div style={{
        fontSize: 22, fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: accent,
        marginBottom: 28,
        fontFamily: 'Inter, system-ui, sans-serif',
        opacity: clamp(interpolate(localFrame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1),
      }}>
        Explainer
      </div>

      <WipeHeading
        text={scene.title}
        localFrame={localFrame}
        accent={accent}
        fontSize={scene.title.length > 28 ? 84 : scene.title.length > 20 ? 100 : 116}
      />

      {/* Animated underline */}
      <div style={{marginTop: 32, marginBottom: 36}}>
        <DrawLine progress={lineProgress} color={accent} width={480} thickness={5} />
      </div>

      {scene.subtitle ? (
        <div style={{
          transform: `translateY(${interpolate(subtitleEnter, [0, 1], [24, 0])}px)`,
          opacity: subtitleOpacity,
          fontSize: 40, fontWeight: 500, lineHeight: 1.45, color: D.textDim,
          fontFamily: 'Inter, system-ui, sans-serif',
          maxWidth: 860,
        }}>
          {scene.subtitle}
        </div>
      ) : null}
    </div>
  );
}

/**
 * POINT scene — numbered, large title + subtitle + optional bullets
 */
function PointScene({scene, sceneIndex, localFrame, accent}: {scene: DrawScene; sceneIndex: number; localFrame: number; accent: string}) {
  const {fps} = useVideoConfig();
  const lineProgress = clamp(interpolate(localFrame, [10, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);
  const hasBullets = (scene.points?.length ?? 0) > 0;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      padding: '140px 72px 160px', justifyContent: 'center',
    }}>
      {/* Ghost number */}
      {scene.sceneNumber != null ? (
        <SceneNumberBadge num={scene.sceneNumber} accent={accent} localFrame={localFrame} />
      ) : null}

      {/* Accent label */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 32,
        opacity: clamp(interpolate(localFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1),
      }}>
        <div style={{width: 36, height: 5, background: accent, borderRadius: 99, boxShadow: `0 0 12px ${accent}88`}} />
        <span style={{
          fontSize: 22, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: accent,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          {scene.sceneNumber != null ? `Point ${scene.sceneNumber}` : 'Key idea'}
        </span>
      </div>

      <WipeHeading
        text={scene.title}
        localFrame={localFrame}
        accent={accent}
        fontSize={scene.title.length > 30 ? 74 : scene.title.length > 22 ? 88 : 100}
      />

      <div style={{marginTop: 24, marginBottom: hasBullets ? 48 : 0}}>
        <DrawLine progress={lineProgress} color={accent} width={560} thickness={4} />
      </div>

      {hasBullets ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          {(scene.points ?? []).map((pt, i) => (
            <StaggerBullet
              key={i} text={pt}
              localFrame={localFrame}
              delay={28 + i * 14}
              accent={accent} index={i}
            />
          ))}
        </div>
      ) : scene.subtitle ? (
        <div style={{
          fontSize: 42, fontWeight: 500, lineHeight: 1.45, color: D.textDim,
          fontFamily: 'Inter, system-ui, sans-serif',
          opacity: clamp(interpolate(localFrame, [20, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1),
          transform: `translateY(${interpolate(
            spring({frame: Math.max(0, localFrame - 20), fps, config: {damping: 18, stiffness: 110, mass: 0.7}}),
            [0, 1], [22, 0],
          )}px)`,
        }}>
          {scene.subtitle}
        </div>
      ) : null}

      {scene.highlight ? (
        <div style={{marginTop: 44}}>
          <HighlightCallout text={scene.highlight} localFrame={Math.max(0, localFrame - (hasBullets ? 28 + (scene.points?.length ?? 0) * 14 + 8 : 32))} accent={accent} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * STEPS scene — numbered checklist, each step draws in
 */
function StepsScene({scene, localFrame, accent}: {scene: DrawScene; localFrame: number; accent: string}) {
  const {fps} = useVideoConfig();
  const points = scene.points ?? (scene.subtitle ? [scene.subtitle] : []);
  const lineProgress = clamp(interpolate(localFrame, [6, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      padding: '140px 72px 160px', justifyContent: 'center',
    }}>
      <div style={{
        fontSize: 22, fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: accent, marginBottom: 28,
        fontFamily: 'Inter, system-ui, sans-serif',
        opacity: clamp(interpolate(localFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1),
      }}>
        Steps
      </div>

      <WipeHeading text={scene.title} localFrame={localFrame} accent={accent} fontSize={scene.title.length > 28 ? 74 : 90} />

      <div style={{marginTop: 24, marginBottom: 44}}>
        <DrawLine progress={lineProgress} color={accent} width={420} thickness={4} />
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
        {points.map((pt, i) => {
          const f = Math.max(0, localFrame - 20 - i * 16);
          const enter = spring({frame: f, fps, config: {damping: 18, stiffness: 120, mass: 0.7}});
          const opacity = clamp(interpolate(f, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);
          const y = interpolate(enter, [0, 1], [28, 0]);
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 28,
              transform: `translateY(${y}px)`, opacity,
            }}>
              {/* Step number */}
              <div style={{
                width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: `${accent}22`,
                border: `2px solid ${accent}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 900, color: accent,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}>
                {i + 1}
              </div>
              <span style={{
                fontSize: 40, fontWeight: 650, lineHeight: 1.3,
                color: D.text,
                fontFamily: 'Inter, system-ui, sans-serif',
                paddingTop: 8,
              }}>
                {pt}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * HIGHLIGHT scene — big callout, used when scene.highlight is the main content
 */
function HighlightScene({scene, localFrame, accent}: {scene: DrawScene; localFrame: number; accent: string}) {
  const {fps} = useVideoConfig();
  const lineProgress = clamp(interpolate(localFrame, [8, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      padding: '140px 72px', justifyContent: 'center',
    }}>
      <WipeHeading text={scene.title} localFrame={localFrame} accent={accent} fontSize={scene.title.length > 28 ? 72 : 90} />
      <div style={{marginTop: 24, marginBottom: 48}}>
        <DrawLine progress={lineProgress} color={accent} width={520} thickness={4} />
      </div>
      <HighlightCallout text={scene.highlight ?? scene.subtitle ?? ''} localFrame={Math.max(0, localFrame - 20)} accent={accent} />
      {(scene.points?.length ?? 0) > 0 ? (
        <div style={{marginTop: 44, display: 'flex', flexDirection: 'column', gap: 22}}>
          {(scene.points ?? []).map((pt, i) => (
            <StaggerBullet key={i} text={pt} localFrame={localFrame} delay={36 + i * 14} accent={accent} index={i} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * SUMMARY scene — checklist with circled checkmarks
 */
function SummaryScene({scene, localFrame, accent}: {scene: DrawScene; localFrame: number; accent: string}) {
  const {fps} = useVideoConfig();
  const points = scene.points ?? (scene.subtitle ? scene.subtitle.split(/[,;.]/).map(s => s.trim()).filter(Boolean) : []);
  const lineProgress = clamp(interpolate(localFrame, [6, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      padding: '140px 72px', justifyContent: 'center',
    }}>
      <div style={{
        fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: D.emerald, marginBottom: 28,
        fontFamily: 'Inter, system-ui, sans-serif',
        opacity: clamp(interpolate(localFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1),
      }}>Summary</div>

      <WipeHeading text={scene.title} localFrame={localFrame} accent={D.emerald} fontSize={scene.title.length > 28 ? 74 : 90} />

      <div style={{marginTop: 24, marginBottom: 44}}>
        <DrawLine progress={lineProgress} color={D.emerald} width={420} thickness={4} />
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
        {points.map((pt, i) => {
          const f = Math.max(0, localFrame - 24 - i * 14);
          const enter = spring({frame: f, fps, config: {damping: 18, stiffness: 120, mass: 0.7}});
          const opacity = clamp(interpolate(f, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);
          const y = interpolate(enter, [0, 1], [24, 0]);
          const dash = 120;
          const checkProgress = clamp(interpolate(f, [4, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: 28, transform: `translateY(${y}px)`, opacity}}>
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{flexShrink: 0, marginTop: 4}}>
                <circle cx="26" cy="26" r="22" stroke={D.emerald} strokeWidth="3" strokeDasharray="138" strokeDashoffset={138 * (1 - checkProgress)} strokeLinecap="round"/>
                <path d="M16 27 L23 34 L36 19" stroke={D.emerald} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} strokeDashoffset={dash * (1 - Math.max(0, checkProgress - 0.4) / 0.6)} />
              </svg>
              <span style={{fontSize: 40, fontWeight: 650, lineHeight: 1.3, color: D.text, fontFamily: 'Inter, system-ui, sans-serif', paddingTop: 6}}>
                {pt}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Scene transition wrapper ─────────────────────────────────────────────────

function SceneTransition({scene, sceneIndex, scenes, localFrame, accent}: {
  scene: DrawScene; sceneIndex: number; scenes: DrawScene[]; localFrame: number; accent: string;
}) {
  const {fps} = useVideoConfig();
  // Fade in at start of scene
  const fadeIn = clamp(interpolate(localFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), 0, 1);

  const isIntro = sceneIndex === 0;
  const isSummary = scene.isSummary === true;
  const isHighlight = !isSummary && !isIntro && Boolean(scene.highlight) && !scene.points?.length;
  const isSteps = !isSummary && !isIntro && !isHighlight && (scene.points?.length ?? 0) >= 3;

  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      {isIntro ? (
        <IntroScene scene={scene} localFrame={localFrame} accent={accent} />
      ) : isSummary ? (
        <SummaryScene scene={scene} localFrame={localFrame} accent={accent} />
      ) : isHighlight ? (
        <HighlightScene scene={scene} localFrame={localFrame} accent={accent} />
      ) : isSteps ? (
        <StepsScene scene={scene} localFrame={localFrame} accent={accent} />
      ) : (
        <PointScene scene={scene} sceneIndex={sceneIndex} localFrame={localFrame} accent={accent} />
      )}
    </AbsoluteFill>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function AutoDrawExplainer({
  scenes: rawScenes = [],
  notesPlan,
  audioUrl,
  mediaSrc,
  sourceAudioVolume = 1,
  topicTitle = 'Explainer',
  captions = [],      // received but NOT rendered — Auto Draw is visual, not caption-based
  premiumEditing = true,
  styleLock,
  soundCues = [],
}: AutoDrawProps) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const audioSrc = resolveRemotionMediaSrc(audioUrl || mediaSrc || '');
  const durationSeconds = durationInFrames / fps;
  const currentTime = frame / fps;

  // Build scene list — prefer notesPlan scenes (already transcript-aligned),
  // fallback to rawScenes prop, then caption-derived scenes
  const scenes: DrawScene[] = (() => {
    if (notesPlan?.pages?.length && notesPlan.elements?.length) {
      // Extract scenes from notesPlan pages — use page start/end as scene boundaries
      // with title from page elements
      const planScenes: DrawScene[] = notesPlan.pages.map((page) => {
        const headings = page.elements.filter(e => e.type === 'heading');
        const bullets = page.elements.filter(e => e.type === 'bullet');
        const highlights = page.elements.filter(e => e.type === 'highlight');
        // Rehydrate from element data — group elements back into scenes by sourceSceneIndex
        return {
          start: page.start,
          end: page.end,
          title: headings[0]?.text || page.title || 'Key Point',
          points: bullets.map(b => b.text).filter(Boolean) as string[],
          highlight: highlights[0]?.text,
          isSummary: page.index === notesPlan.pages.length - 1,
        };
      });
      return planScenes.filter(s => s.end > s.start);
    }
    if (rawScenes.length > 0) return rawScenes;
    // Derive from captions as last resort
    return deriveScenesFromCaptions(captions, topicTitle, durationSeconds);
  })();

  const active = getActiveScene(scenes, currentTime);
  const activeScene = active?.scene ?? scenes[scenes.length - 1];
  const activeIndex = active?.index ?? Math.max(0, scenes.length - 1);
  const accent = sceneAccent(activeIndex);
  const localTime = activeScene ? sceneLocalTime(activeScene, currentTime) : 0;
  const localFrame = Math.round(localTime * fps);

  return (
    <AbsoluteFill style={{
      background: D.bg,
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    }}>
      {audioSrc ? <Audio src={audioSrc} volume={sourceAudioVolume} /> : null}
      <PremiumAudioLayer enabled={premiumEditing} styleLock={styleLock} soundCues={soundCues} />

      {/* Background with per-scene accent color */}
      <PremiumBackground accent={accent} />

      {/* Active scene content */}
      {activeScene ? (
        <SceneTransition
          scene={activeScene}
          sceneIndex={activeIndex}
          scenes={scenes}
          localFrame={localFrame}
          accent={accent}
        />
      ) : null}

      {/* Top bar */}
      <TopBar
        topicTitle={topicTitle}
        sceneIndex={activeIndex}
        totalScenes={scenes.length}
        accent={accent}
      />

      {/* Progress bar */}
      <ProgressBar currentTime={currentTime} durationSeconds={durationSeconds} accent={accent} />
      <PremiumVisualTreatment enabled={premiumEditing} styleLock={styleLock} />
    </AbsoluteFill>
  );
}

// ─── Fallback scene builder from captions ─────────────────────────────────────

function deriveScenesFromCaptions(
  captions: Array<{start: number; end: number; text: string}>,
  topicTitle: string,
  durationSeconds: number,
): DrawScene[] {
  if (!captions.length) {
    return [
      {start: 0, end: Math.min(durationSeconds, 8), title: topicTitle || 'Explainer', subtitle: 'Upload audio to generate content'},
      {start: Math.min(durationSeconds, 8), end: durationSeconds, title: 'Key Ideas', isSummary: true},
    ];
  }
  const scenes: DrawScene[] = [];
  let group: typeof captions = [];
  let groupStart = captions[0]?.start || 0;
  for (const cap of captions) {
    if (group.length > 0 && (cap.start - groupStart > 8 || group.length >= 5)) {
      const text = group.map(c => c.text).join(' ');
      scenes.push({
        start: groupStart, end: group[group.length - 1].end,
        title: text.split(/\s+/).slice(0, 4).join(' ').toUpperCase(),
        subtitle: text.slice(0, 140),
        points: group.length > 2 ? group.map(c => c.text.slice(0, 60)) : undefined,
        sceneNumber: scenes.length + 1,
      });
      group = []; groupStart = cap.start;
    }
    group.push(cap);
  }
  if (group.length) {
    const text = group.map(c => c.text).join(' ');
    scenes.push({
      start: groupStart, end: durationSeconds,
      title: text.split(/\s+/).slice(0, 4).join(' ').toUpperCase(),
      subtitle: text.slice(0, 140),
      points: group.length > 2 ? group.map(c => c.text.slice(0, 60)) : undefined,
      sceneNumber: scenes.length + 1,
      isSummary: true,
    });
  }
  return scenes;
}

// ─── Export ───────────────────────────────────────────────────────────────────

export {AutoDrawExplainer};

const defaultProps: AutoDrawProps = {
  topicTitle: '5 Habits That Will Change Your Life',
  audioUrl: '',
  sourceAudioVolume: 1,
  sourceDurationSeconds: 60,
  scenes: [
    {start: 0, end: 6, title: 'WAKE UP EARLY', points: ['More time for yourself', 'Better focus and clarity'], subtitle: 'Subah jaldi uthna mental clarity deta hai', sceneNumber: 1},
    {start: 6, end: 14, title: 'PLAN YOUR DAY', points: ['Set 3 main goals', 'Block focus time', 'Review at night'], subtitle: 'Plan karne se focus badhta hai', sceneNumber: 2, highlight: 'Focus creates discipline'},
    {start: 14, end: 22, title: 'EXERCISE DAILY', points: ['Better health', 'Mood boost', 'Builds discipline'], subtitle: 'Exercise body aur mind ke liye zaroori hai', sceneNumber: 3},
    {start: 22, end: 30, title: 'KEEP GOING', points: ['Start small', 'Repeat daily', 'Track progress'], subtitle: 'Small actions compound over time', sceneNumber: 4, isSummary: true},
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
      const p = props as AutoDrawProps;
      const dur = Math.max(8, Math.min(60, Number(p.sourceDurationSeconds || p.durationSeconds) || 60));
      return {durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
