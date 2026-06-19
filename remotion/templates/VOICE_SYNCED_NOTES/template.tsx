import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {resolveFont, getFontForLanguage} from '../../utils/fonts';

type NoteLine = {
  text: string;
  start: number;
  end?: number;
  highlight?: string;
  highlightStart?: number;
  type?: 'heading' | 'bullet' | 'example' | 'warning' | 'summary';
};

type VoiceSyncedNotesProps = {
  title?: string;
  topicTitle?: string;
  lines?: NoteLine[];
  mediaSrc?: string;
  audioUrl?: string;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  language?: string;
  subtitleOutputLanguage?: string;
  captions?: Array<{start: number; end: number; text: string}>;
};

const COLORS = {
  bg: '#f8efe0',
  card: '#fffdf7',
  title: '#162033',
  text: '#1f2937',
  bullet: '#2563eb',
  highlight: 'rgba(255, 221, 72, 0.88)',
  warning: '#dc2626',
  example: '#059669',
  badge: '#f59e0b',
  badgeBg: '#fffbeb',
  border: 'rgba(79, 54, 24, 0.16)',
};

function VoiceSyncedNotes({
  title,
  topicTitle,
  lines = [],
  mediaSrc,
  audioUrl,
  sourceAudioVolume = 1,
  language,
  subtitleOutputLanguage,
  captions = [],
}: VoiceSyncedNotesProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;

  const audioSrc = audioUrl || mediaSrc || '';
  const displayTitle = title || topicTitle || 'Study Notes';
  const lang = language || subtitleOutputLanguage || 'en';
  const fontFamily = getFontForLanguage(lang) || resolveFont('Inter');

  // Build display lines from props or fallback from captions
  const displayLines: NoteLine[] = lines.length > 0
    ? lines
    : buildLinesFromCaptions(captions);

  // Title animation
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  const titleY = interpolate(frame, [0, 15], [20, 0], {extrapolateRight: 'clamp'});

  // End badge
  const totalDuration = displayLines.length > 0
    ? Math.max(...displayLines.map(l => l.end || l.start + 60))
    : fps * 10;
  const showBadge = frame > totalDuration - fps * 2;

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${COLORS.bg} 0%, #efe0c7 100%)`, fontFamily, padding: 48}}>
      {audioSrc ? <Audio src={audioSrc} volume={sourceAudioVolume} /> : null}

      {/* Note card */}
      <div style={{
        width: '100%', height: '100%', background: COLORS.card,
        borderRadius: 34, padding: '54px 48px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: `4px solid ${COLORS.border}`,
        position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Subtle paper lines */}
        <div style={{position: 'absolute', inset: 0, opacity: 0.035, background: 'repeating-linear-gradient(0deg, transparent, transparent 52px, #8b7355 52px, #8b7355 53px)', pointerEvents: 'none'}} />

        {/* Title */}
        <div style={{
          fontSize: 52, fontWeight: 900, color: COLORS.title, lineHeight: 1.1,
          marginBottom: 40, opacity: titleOpacity, transform: `translateY(${titleY}px)`,
          borderBottom: `3px solid ${COLORS.bullet}22`, paddingBottom: 20,
        }}>
          {displayTitle}
        </div>

        {/* Note lines */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 28, flex: 1}}>
          {displayLines.slice(0, 7).map((line, i) => (
            <NoteLineItem key={i} line={line} frame={frame} fps={fps} index={i} />
          ))}
        </div>

        {/* End badge */}
        {showBadge ? (
          <div style={{
            position: 'absolute', right: 44, bottom: 44,
            background: COLORS.badgeBg, border: `3px solid ${COLORS.badge}`,
            borderRadius: 20, padding: '18px 24px',
            fontSize: 26, fontWeight: 800, color: '#92400e',
            transform: 'rotate(-2deg)',
            opacity: interpolate(frame, [totalDuration - fps * 2, totalDuration - fps * 1.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}>
            Key points synced with voice
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function NoteLineItem({line, frame, fps, index}: {line: NoteLine; frame: number; fps: number; index: number}) {
  const startFrame = Math.round(line.start * fps);
  const show = frame >= startFrame;
  const localFrame = Math.max(0, frame - startFrame);

  const opacity = interpolate(localFrame, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(localFrame, [0, 14], [22, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Highlight activation
  const highlightFrame = line.highlightStart ? Math.round(line.highlightStart * fps) : startFrame + 12;
  const highlightActive = frame >= highlightFrame && frame <= highlightFrame + 50;

  const bulletColor = line.type === 'warning' ? COLORS.warning
    : line.type === 'example' ? COLORS.example
    : COLORS.bullet;

  const bulletSymbol = line.type === 'warning' ? '⚠'
    : line.type === 'example' ? '→'
    : line.type === 'summary' ? '★'
    : '●';

  if (!show) return null;

  return (
    <div style={{
      opacity, transform: `translateY(${y}px)`,
      fontSize: 38, lineHeight: 1.35, color: COLORS.text, fontWeight: 700,
      display: 'flex', gap: 16, alignItems: 'flex-start',
      letterSpacing: -0.5,
    }}>
      <span style={{color: bulletColor, fontSize: 32, marginTop: 4, flexShrink: 0}}>{bulletSymbol}</span>
      <span>
        <HighlightedText text={line.text} highlight={line.highlight} active={highlightActive} />
      </span>
    </div>
  );
}

function HighlightedText({text, highlight, active}: {text: string; highlight?: string; active: boolean}) {
  if (!highlight || !text.toLowerCase().includes(highlight.toLowerCase())) {
    return <>{text}</>;
  }
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  const before = text.slice(0, idx);
  const mid = text.slice(idx, idx + highlight.length);
  const after = text.slice(idx + highlight.length);

  return (
    <>
      {before}
      <span style={{position: 'relative', display: 'inline-block', padding: '0 6px'}}>
        <span style={{
          position: 'absolute', left: 0, right: 0, bottom: 2, height: 18,
          background: COLORS.highlight, borderRadius: 10, zIndex: -1,
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left center',
        }} />
        <span style={{fontWeight: 900}}>{mid}</span>
      </span>
      {after}
    </>
  );
}

function buildLinesFromCaptions(captions: Array<{start: number; end: number; text: string}>): NoteLine[] {
  if (!captions.length) return [];
  return captions.slice(0, 7).map((cap) => {
    const words = cap.text.split(' ');
    // Pick longest word as highlight (simple heuristic)
    const highlight = words.reduce((a, b) => b.length > a.length ? b : a, '');
    return {
      text: cap.text,
      start: cap.start,
      end: cap.end,
      highlight: highlight.length >= 4 ? highlight : undefined,
      type: 'bullet' as const,
    };
  });
}

const defaultProps: VoiceSyncedNotesProps = {
  title: 'RBI Grade B Explained',
  audioUrl: '',
  sourceAudioVolume: 1,
  durationSeconds: 30,
  sourceDurationSeconds: 30,
  lines: [
    {text: 'RBI Grade B is an officer-level job.', start: 1, highlight: 'officer-level', type: 'bullet'},
    {text: 'It is one of the most respected finance roles.', start: 4, highlight: 'finance roles', type: 'bullet'},
    {text: 'Selection happens through exam and interview.', start: 7, highlight: 'exam', type: 'bullet'},
    {text: 'Salary, growth, and stability make it attractive.', start: 10, highlight: 'stability', type: 'bullet'},
    {text: 'Preparation requires 6-8 months focused study.', start: 13, highlight: '6-8 months', type: 'example'},
  ],
  captions: [],
};

export const VoiceSyncedNotesComposition = () => (
  <Composition
    id="VOICE-SYNCED-NOTES"
    component={VoiceSyncedNotes}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as VoiceSyncedNotesProps;
      const dur = Math.max(8, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 30
      ));
      return {durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
