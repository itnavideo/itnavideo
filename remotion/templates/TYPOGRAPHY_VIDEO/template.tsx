import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { getAdvancedStyleBlueprint } from '../../../lib/typography/styleRegistry';
import type { CaptionSegment } from '../../types/subtitles';

export type TypographyVideoProps = {
  durationSeconds?: number;
  typographyStyle?: string;
  captions?: CaptionSegment[];
  subjectImageUrl?: string;
  backgroundMediaUrl?: string;
  mediaSrc?: string;
  audioUrl?: string;
  bgmUrl?: string;
  transcriptText?: string;
  aspectRatio?: '9:16';
};

export const KineticTypographyRenderer: React.FC<TypographyVideoProps> = ({
  durationSeconds = 5,
  typographyStyle = 'vox-giant-stagger',
  captions = [],
  subjectImageUrl,
  backgroundMediaUrl,
  mediaSrc,
  audioUrl,
  bgmUrl,
  transcriptText,
  aspectRatio = '9:16',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Load blueprint with strict dev guard
  const blueprint = getAdvancedStyleBlueprint(typographyStyle);

  if (process.env.NODE_ENV !== 'production' && !blueprint) {
    throw new Error(
      `[TYPOGRAPHY ENGINE] Invalid typographyStyle: "${typographyStyle}". No matching blueprint found in styleRegistry.`
    );
  }

  const activeBlueprint: any = blueprint || {
    id: typographyStyle,
    name: typographyStyle,
    typography: {
      heroFont: 'Playfair Display, serif',
      leadFont: 'Impact, sans-serif',
      heroSizePx: 96,
      leadSizePx: 42,
      heroWeight: 900,
      leadWeight: 700,
      letterSpacingEm: 0.05,
      textTransform: 'uppercase' as const,
      lineHeight: 1.1,
    },
    colorScheme: {
      primary: '#FFFFFF',
      secondary: '#E2E8F0',
      accent: '#FFD700',
      background: '#070B14',
    },
    animationPreset: 'pop',
  };

  // Find active caption word/phrase based on current time
  const currentTime = frame / fps;
  const allWords = captions.flatMap((c) => c.words || []);
  const activeWord = allWords.find((w) => currentTime >= w.start && currentTime <= w.end);
  const activeIndex = activeWord ? allWords.indexOf(activeWord) : 0;

  // Current phrase slice (3-4 words centered on active word)
  const startIndex = Math.max(0, activeIndex - 1);
  const visibleWords = allWords.slice(startIndex, startIndex + 4);

  // Camera Motion (Push & Pan)
  const cameraProgress = interpolate(frame, [0, durationSeconds * fps], [1, 1.08], {
    extrapolateRight: 'clamp',
  });
  const cameraPanY = interpolate(frame, [0, durationSeconds * fps], [0, -15], {
    extrapolateRight: 'clamp',
  });

  // Spring animation for word entrances
  const entranceSpring = spring({
    frame,
    fps,
    config: { mass: 0.6, damping: 14, stiffness: 180 },
  });

  const isLuxuryGold = typographyStyle.includes('gold') || typographyStyle.includes('luxury') || typographyStyle.includes('dubai') || typographyStyle.includes('obsidian');
  const is3DChrome = typographyStyle.includes('chrome') || typographyStyle.includes('3d') || typographyStyle.includes('depth') || typographyStyle.includes('extrude');
  const isBehindSubject = typographyStyle.includes('subject') || typographyStyle.includes('behind');
  const isSplitSerif = typographyStyle.includes('serif') || typographyStyle.includes('editorial') || typographyStyle.includes('vogue');

  return (
    <AbsoluteFill
      style={{
        backgroundColor: activeBlueprint.colorScheme?.background || '#070B14',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── LAYER 1: Background Parallax / Grain Layer ── */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraProgress * 1.05}) translateY(${cameraPanY * 0.5}px)`,
          opacity: 0.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: activeBlueprint.typography?.heroFont || 'Impact, sans-serif',
            fontSize: 220,
            fontWeight: 900,
            color: activeBlueprint.colorScheme?.accent || '#FF6D00',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 0.9,
          }}
        >
          {activeWord ? activeWord.word : 'ITNAVIDEO'}
        </span>
      </AbsoluteFill>

      {/* Optional Background Media */}
      {backgroundMediaUrl && (
        <AbsoluteFill style={{ opacity: 0.4 }}>
          <Img src={backgroundMediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
      )}

      {/* ── LAYER 2: Midground Kinetic Typography Engine ── */}
      <div
        style={{
          transform: `scale(${cameraProgress}) translateY(${cameraPanY}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          zIndex: isBehindSubject ? 10 : 20,
          textAlign: 'center',
        }}
      >
        {visibleWords.length > 0 ? (
          visibleWords.map((w, idx) => {
            const isActive = w === activeWord;
            const isHeroWord = isActive || w.word.length > 5 || w.word === w.word.toUpperCase();

            // Word Spring Motion
            const wordSpring = spring({
              frame: Math.max(0, frame - Math.round(w.start * fps)),
              fps,
              config: { mass: 0.5, damping: 12, stiffness: 200 },
            });

            // Gold Foil Sweep Gradient
            const goldGradient = 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)';

            // Text Styles
            const font = isHeroWord
              ? activeBlueprint.typography?.heroFont || (isSplitSerif ? 'Playfair Display, serif' : 'Impact, sans-serif')
              : activeBlueprint.typography?.leadFont || 'Inter, sans-serif';

            const fontSize = isHeroWord
              ? isActive ? 110 : 90
              : 52;

            const color = isLuxuryGold && isActive
              ? 'transparent'
              : isActive
              ? activeBlueprint.colorScheme?.accent || '#FF6D00'
              : activeBlueprint.colorScheme?.primary || '#FFFFFF';

            const shadow = is3DChrome
              ? '0 10px 0 #1E293B, 0 20px 0 #0F172A, 0 30px 40px rgba(0,0,0,0.9)'
              : isActive
              ? `0 0 30px ${activeBlueprint.colorScheme?.accent || '#FF6D00'}80, 0 4px 20px rgba(0,0,0,0.9)`
              : '0 4px 16px rgba(0,0,0,0.8)';

            return (
              <div
                key={`${w.word}-${idx}`}
                style={{
                  fontFamily: font,
                  fontSize: `${fontSize}px`,
                  fontWeight: isHeroWord ? 900 : 700,
                  color,
                  backgroundImage: isLuxuryGold && isActive ? goldGradient : undefined,
                  WebkitBackgroundClip: isLuxuryGold && isActive ? 'text' : undefined,
                  WebkitTextFillColor: isLuxuryGold && isActive ? 'transparent' : undefined,
                  textShadow: isLuxuryGold && isActive ? undefined : shadow,
                  letterSpacing: `${activeBlueprint.typography?.letterSpacingEm || 0.04}em`,
                  textTransform: 'uppercase',
                  transform: `scale(${isActive ? 1.0 + wordSpring * 0.12 : 0.95}) translateY(${(1 - wordSpring) * 20}px)`,
                  opacity: isActive ? 1 : 0.65,
                  margin: '8px 0',
                  transition: 'all 0.15s ease-out',
                }}
              >
                {w.word}
              </div>
            );
          })
        ) : (
          <div
            style={{
              fontFamily: activeBlueprint.typography?.heroFont || 'Impact, sans-serif',
              fontSize: '84px',
              fontWeight: 900,
              color: activeBlueprint.colorScheme?.accent || '#FF6D00',
              textTransform: 'uppercase',
            }}
          >
            {transcriptText || 'KINETIC TYPOGRAPHY'}
          </div>
        )}
      </div>

      {/* ── LAYER 3: Subject Overlay Layer (Behind-the-Subject Matting) ── */}
      {subjectImageUrl && (
        <AbsoluteFill style={{ zIndex: 25, pointerEvents: 'none' }}>
          <Img src={subjectImageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </AbsoluteFill>
      )}

      {/* ── LAYER 4: Foreground Accent & HUD Badge ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 24px',
          borderRadius: 100,
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: activeBlueprint.colorScheme?.accent || '#FF6D00' }} />
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#FFFFFF',
            textTransform: 'uppercase',
          }}
        >
          {activeBlueprint.name || typographyStyle}
        </span>
      </div>

      {/* ── Audio Playback Layer ── */}
      {(mediaSrc || audioUrl) && (
        <Audio src={mediaSrc || audioUrl} volume={1} />
      )}
      {bgmUrl && (
        <Audio src={bgmUrl} volume={0.15} loop />
      )}
    </AbsoluteFill>
  );
};

export const TypographyVideoComposition: React.FC = () => {
  return (
    <Composition
      id="TYPOGRAPHY-VIDEO"
      component={KineticTypographyRenderer}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={150}
      calculateMetadata={async ({ props }) => {
        const fps = 30;
        const width = 1080;
        const height = 1920;
        const maxDurSeconds = 90; // Strictly 9:16 Shorts up to 90s (Rule 4.1)

        let durationSeconds = Number(props.durationSeconds) || 0;
        if (durationSeconds <= 0 && Array.isArray(props.captions) && props.captions.length > 0) {
          const lastCap = props.captions[props.captions.length - 1];
          if (lastCap && typeof lastCap.end === 'number') {
            durationSeconds = lastCap.end;
          }
        }

        const clampedDuration = Math.max(5, Math.min(maxDurSeconds, durationSeconds || 5));
        const durationInFrames = Math.round(clampedDuration * fps);

        return {
          width,
          height,
          durationInFrames,
          props,
        };
      }}
      defaultProps={{
        durationSeconds: 5,
        typographyStyle: 'vox-giant-stagger',
        aspectRatio: '9:16',
        captions: [
          {
            start: 0,
            end: 5,
            text: 'Hello, world! This is how you GROW your business, fast.',
            words: [
              { word: 'Hello,', start: 0, end: 0.5 },
              { word: 'world!', start: 0.5, end: 1.0 },
              { word: 'This', start: 1.0, end: 1.5 },
              { word: 'is', start: 1.5, end: 1.8 },
              { word: 'how', start: 1.8, end: 2.1 },
              { word: 'you', start: 2.1, end: 2.5 },
              { word: 'GROW', start: 2.5, end: 3.2 },
              { word: 'your', start: 3.2, end: 3.6 },
              { word: 'business,', start: 3.6, end: 4.2 },
              { word: 'fast.', start: 4.2, end: 5.0 },
            ],
          },
        ],
      }}
    />
  );
};
