import React from 'react';
import {
  AbsoluteFill,
  Composition,
  interpolate,
  useCurrentFrame,
} from 'remotion';

type NoteLine = {
  text: string;
  start: number;
  highlight?: string;
};

type VoiceSyncedNotesProps = {
  title?: string;
  lines?: NoteLine[];
};

const DEFAULT_LINES: NoteLine[] = [
  {text: 'RBI Grade B is an officer-level job.', start: 30, highlight: 'officer-level'},
  {text: 'It is one of the most respected finance roles.', start: 85, highlight: 'finance roles'},
  {text: 'Selection happens through exam and interview.', start: 140, highlight: 'exam'},
  {text: 'Salary, growth, and stability make it attractive.', start: 195, highlight: 'stability'},
];

const HighlightedText = ({text, highlight, active}: {text: string; highlight?: string; active: boolean}) => {
  if (!highlight || !text.toLowerCase().includes(highlight.toLowerCase())) {
    return <>{text}</>;
  }

  const index = text.toLowerCase().indexOf(highlight.toLowerCase());
  const before = text.slice(0, index);
  const mid = text.slice(index, index + highlight.length);
  const after = text.slice(index + highlight.length);

  return (
    <>
      {before}
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          padding: '0 8px',
          transform: active ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.25s ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 4,
            height: 22,
            background: 'rgba(255, 221, 72, 0.88)',
            borderRadius: 12,
            zIndex: -1,
            transform: active ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left center',
            transition: 'transform 0.35s ease',
          }}
        />
        {mid}
      </span>
      {after}
    </>
  );
};

const VoiceSyncedNotes = ({title = 'Voice-Synced Notes', lines = DEFAULT_LINES}: VoiceSyncedNotesProps) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #f8efe0 0%, #efe0c7 100%)',
        fontFamily: 'Arial, sans-serif',
        padding: 54,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#fffdf7',
          borderRadius: 34,
          padding: '58px 54px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          border: '4px solid rgba(79, 54, 24, 0.16)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: '#162033',
            lineHeight: 1.1,
            marginBottom: 44,
          }}
        >
          {title}
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 34}}>
          {lines.map((line, index) => {
            const show = frame >= line.start;
            const opacity = interpolate(frame, [line.start, line.start + 18], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const y = interpolate(frame, [line.start, line.start + 18], [26, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const active = frame >= line.start + 16 && frame <= line.start + 70;

            return (
              <div
                key={index}
                style={{
                  opacity: show ? opacity : 0,
                  transform: `translateY(${y}px)`,
                  fontSize: 42,
                  lineHeight: 1.32,
                  color: '#1f2937',
                  fontWeight: 800,
                  letterSpacing: -0.8,
                  display: 'flex',
                  gap: 18,
                  alignItems: 'flex-start',
                }}
              >
                <span style={{color: '#2563eb'}}>●</span>
                <span>
                  <HighlightedText text={line.text} highlight={line.highlight} active={active} />
                </span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            right: 54,
            bottom: 54,
            background: '#fffbeb',
            border: '3px solid #f59e0b',
            borderRadius: 24,
            padding: '22px 28px',
            fontSize: 30,
            fontWeight: 900,
            color: '#92400e',
            opacity: frame > 245 ? 1 : 0,
            transform: frame > 245 ? 'rotate(-2deg) scale(1)' : 'rotate(-2deg) scale(0.8)',
            transition: 'all 0.25s ease',
          }}
        >
          Key points synced with voice
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const VoiceSyncedNotesComposition = () => (
  <Composition
    id="VOICE-SYNCED-NOTES"
    component={VoiceSyncedNotes}
    durationInFrames={360}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      title: 'RBI Job Explained',
      lines: DEFAULT_LINES,
    }}
  />
);


