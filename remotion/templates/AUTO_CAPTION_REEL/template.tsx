import React from 'react';
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type CaptionWord = {
  word?: string;
  text?: string;
  start?: number;
  end?: number;
};

type CaptionItem = {
  text?: string;
  start?: number;
  end?: number;
  words?: CaptionWord[];
  stylePreset?: string;
};

type AutoCaptionProps = {
  mediaSrc?: string;
  mediaType?: 'video' | 'audio';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  captions?: CaptionItem[];
  subtitleChunks?: CaptionItem[];
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  textColor?: string;
  highlightColor?: string;
  topicTitle?: string;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
};

const cleanText = (value?: string) =>
  String(value || '').replace(/\s+/g, ' ').trim();

const getActiveCaption = (captions: CaptionItem[] = [], time: number) =>
  captions.find((c) => {
    const start = Number(c.start ?? 0);
    const end = Number(c.end ?? start + 2.5);
    return time >= start && time <= end;
  });

const breakLines = (text: string): string[] => {
  const words = text.split(' ').filter(Boolean).slice(0, 14);
  if (words.length <= 5) return [words.join(' ')];
  if (words.length <= 10) return [words.slice(0, 5).join(' '), words.slice(5).join(' ')];
  return [words.slice(0, 5).join(' '), words.slice(5, 10).join(' '), words.slice(10).join(' ')];
};

function AutoCaptionReel({
  mediaSrc,
  mediaType = 'video',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  captions = [],
  subtitleChunks,
  captionStyle = 'yellowPop',
  captionPosition = 'bottom',
  textColor = '#ffffff',
  highlightColor = '#facc15',
  topicTitle,
}: AutoCaptionProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;

  // Use captions or subtitleChunks (fallback prop name)
  const captionData = captions.length > 0 ? captions : (subtitleChunks || []);

  const activeCaption = getActiveCaption(captionData, time);
  const subtitleText = cleanText(
    activeCaption?.text ||
    activeCaption?.words?.map((w) => cleanText(w.word || w.text)).filter(Boolean).join(' ') ||
    '',
  );

  const captionEnter = subtitleText
    ? interpolate(frame % (fps * 5), [0, 4], [0.92, 1], {extrapolateRight: 'clamp'})
    : 0;

  // Caption position mapping
  const positionStyle: React.CSSProperties = captionPosition === 'top'
    ? {top: 180, bottom: 'auto'}
    : captionPosition === 'center'
      ? {top: '50%', bottom: 'auto', transform: `translateY(-50%) scale(${captionEnter})`}
      : {bottom: 220, top: 'auto'};

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Full-screen video */}
      {mediaSrc && mediaType === 'video' ? (
        <OffthreadVideo
          src={mediaSrc}
          startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
          volume={sourceAudioVolume}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #111 0%, #000 100%)',
            color: 'rgba(255,255,255,0.2)',
            fontSize: 36,
            fontWeight: 800,
          }}
        >
          YOUR REEL VIDEO
        </div>
      )}

      {/* Subtitle overlay */}
      {subtitleText ? (
        <div
          style={{
            position: 'absolute',
            left: 48,
            right: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: captionPosition !== 'center' ? `scale(${captionEnter})` : undefined,
            zIndex: 10,
            ...positionStyle,
          }}
        >
          <CaptionCard
            text={subtitleText}
            style={captionStyle}
            textColor={textColor}
            highlightColor={highlightColor}
          />
        </div>
      ) : null}

      {/* Subtle vignette for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.2) 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
    </AbsoluteFill>
  );
}

function CaptionCard({
  text,
  style,
  textColor,
  highlightColor,
}: {
  text: string;
  style: string;
  textColor: string;
  highlightColor: string;
}) {
  const lines = breakLines(text);

  // Style: yellowPop — bold text with colored highlight on first word of each line
  if (style === 'yellowPop') {
    return (
      <div
        style={{
          padding: '20px 36px',
          borderRadius: 18,
          background: 'rgba(0,0,0,0.75)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          textAlign: 'center',
          backdropFilter: 'blur(8px)',
        }}
      >
        {lines.map((line, i) => {
          const words = line.split(' ');
          const firstWord = words[0] || '';
          const rest = words.slice(1).join(' ');
          return (
            <div key={`${line}-${i}`} style={{fontSize: 48, fontWeight: 900, lineHeight: 1.25, letterSpacing: -0.5}}>
              <span style={{color: highlightColor, textShadow: `0 2px 12px ${highlightColor}44`}}>{firstWord}</span>
              {rest ? <span style={{color: textColor}}>{' '}{rest}</span> : null}
            </div>
          );
        })}
      </div>
    );
  }

  // Style: clean — minimal white text with shadow
  if (style === 'clean') {
    return (
      <div style={{textAlign: 'center'}}>
        {lines.map((line, i) => (
          <div
            key={`${line}-${i}`}
            style={{
              color: textColor,
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.3,
              textShadow: '0 3px 12px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {line}
          </div>
        ))}
      </div>
    );
  }

  // Style: blackBox — dark background box
  if (style === 'blackBox') {
    return (
      <div
        style={{
          padding: '16px 28px',
          borderRadius: 10,
          background: 'rgba(0,0,0,0.85)',
          textAlign: 'center',
        }}
      >
        {lines.map((line, i) => (
          <div key={`${line}-${i}`} style={{color: textColor, fontSize: 44, fontWeight: 800, lineHeight: 1.3}}>
            {line}
          </div>
        ))}
      </div>
    );
  }

  // Style: neon — glowing border
  if (style === 'neon') {
    return (
      <div
        style={{
          padding: '18px 32px',
          borderRadius: 16,
          background: 'rgba(0,0,0,0.7)',
          border: `2px solid ${highlightColor}99`,
          boxShadow: `0 0 30px ${highlightColor}33, inset 0 0 20px ${highlightColor}11`,
          textAlign: 'center',
          backdropFilter: 'blur(8px)',
        }}
      >
        {lines.map((line, i) => (
          <div key={`${line}-${i}`} style={{color: textColor, fontSize: 46, fontWeight: 800, lineHeight: 1.25, textShadow: `0 0 20px ${highlightColor}88, 0 2px 4px rgba(0,0,0,0.5)`}}>
            {line}
          </div>
        ))}
      </div>
    );
  }

  // Style: bold / minimal / classic — fallback
  if (style === 'minimal') {
    return (
      <div style={{textAlign: 'center'}}>
        {lines.map((line, i) => (
          <div key={`${line}-${i}`} style={{color: textColor, fontSize: 48, fontWeight: 700, lineHeight: 1.3, textShadow: '0 3px 12px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)'}}>
            {line}
          </div>
        ))}
      </div>
    );
  }

  if (style === 'classic') {
    return (
      <div
        style={{
          padding: '16px 28px',
          borderRadius: 8,
          background: 'rgba(0,0,0,0.75)',
          textAlign: 'center',
          backdropFilter: 'blur(4px)',
        }}
      >
        {lines.map((line, i) => (
          <div key={`${line}-${i}`} style={{color: textColor, fontSize: 42, fontWeight: 700, lineHeight: 1.3}}>
            {line}
          </div>
        ))}
      </div>
    );
  }

  // Default: bold style (same as yellowPop but without highlight split)
  return (
    <div
      style={{
        padding: '20px 36px',
        borderRadius: 18,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(20,20,30,0.9) 100%)',
        border: '2px solid rgba(255,255,255,0.1)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
      }}
    >
      {lines.map((line, i) => (
        <div key={`${line}-${i}`} style={{color: textColor, fontSize: 48, fontWeight: 900, lineHeight: 1.2, letterSpacing: -0.5, textShadow: '0 2px 8px rgba(0,0,0,0.4)'}}>
          {line}
        </div>
      ))}
    </div>
  );
}

const defaultProps: AutoCaptionProps = {
  mediaType: 'video',
  mediaSrc: '',
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,
  captionStyle: 'yellowPop',
  captionPosition: 'bottom',
  textColor: '#ffffff',
  highlightColor: '#facc15',
  durationSeconds: 30,
  sourceDurationSeconds: 30,
  captions: [
    {start: 0, end: 3, text: 'Upload your reel video here'},
    {start: 3, end: 6, text: 'Subtitles will appear like this'},
    {start: 6, end: 9, text: 'Auto captions sync with speech'},
  ],
};

export const AutoCaptionReelComposition = () => (
  <Composition
    id="AUTO-CAPTION-REEL"
    component={AutoCaptionReel}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as AutoCaptionProps;
      const durationSeconds = Math.max(8, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 30
      ));
      return {
        durationInFrames: Math.ceil(durationSeconds * 30),
        fps: 30,
        width: 1080,
        height: 1920,
      };
    }}
  />
);
