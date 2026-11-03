import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import { UniversalCaptionLayer, CaptionChunk } from '../../components/library/UniversalCaptionLayer';

export interface SplitScreenExplainerProps {
  mediaSrc?: string;
  creatorVideoUrl?: string;
  audioSrc?: string;
  audioUrl?: string;
  bgmUrl?: string;
  bgmVolume?: number;
  explanationMediaUrls?: string[];
  explanationImages?: string[];
  explanationVideos?: string[];
  captions?: CaptionChunk[];
  subtitleChunks?: CaptionChunk[];
  captionThemeId?: string;
  subtitleStyle?: string;
  durationSeconds?: number;
  title?: string;
  topicTitle?: string;
  aspectRatio?: '9:16';
  [key: string]: any;
}

const resolveUrl = (src?: string) => {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();
  if (!trimmed || trimmed === '[object Object]' || trimmed.includes('[object')) return '';
  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^\/+/, '');
  try {
    return staticFile(cleanPath);
  } catch {
    return cleanPath;
  }
};

const isVideoUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) || url.includes('/video/');
};

/**
 * Clean White Ambient Background for Split Screen Explainer
 */
const SubtleAmbientBackground: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame / fps;
  const pulseOpacity = interpolate(Math.sin(t * 0.8), [-1, 1], [0.03, 0.07]);
  const gradientAngle = (t * 8) % 360;

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAFA', overflow: 'hidden' }}>
      {/* Delicate Dot Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.06) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          opacity: 0.85,
        }}
      />

      {/* Soft Warm Flame Orange Ambient Bloom (Top-Left) */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '5%',
          width: '60%',
          height: '40%',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 87, 34, ${pulseOpacity}) 0%, rgba(255, 160, 0, 0.02) 60%, transparent 80%)`,
          filter: 'blur(90px)',
          transform: `rotate(${gradientAngle}deg)`,
        }}
      />

      {/* Soft Slate Ambient Glow (Bottom-Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '5%',
          width: '55%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 143, 0, 0.04) 0%, rgba(241, 245, 249, 0.6) 50%, transparent 80%)',
          filter: 'blur(80px)',
        }}
      />
    </AbsoluteFill>
  );
};

export const SplitScreenExplainerTemplate: React.FC<SplitScreenExplainerProps> = ({
  mediaSrc = '',
  creatorVideoUrl = '',
  audioSrc = '',
  audioUrl = '',
  bgmUrl = '',
  bgmVolume = 0.12,
  explanationMediaUrls = [],
  explanationImages = [],
  explanationVideos = [],
  captions = [],
  subtitleChunks = [],
  captionThemeId = 'glow-viral',
  subtitleStyle,
  durationSeconds = 60,
  title = '',
  topicTitle = '',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Active Spoken Media & Creator Facecam Video
  const finalCreatorVideo = resolveUrl(creatorVideoUrl || mediaSrc);
  const finalAudioUrl = resolveUrl(audioUrl || audioSrc || creatorVideoUrl || mediaSrc);
  const finalBgmUrl = resolveUrl(bgmUrl);
  const activeCaptions = captions.length > 0 ? captions : subtitleChunks;
  const activeCaptionTheme = captionThemeId || subtitleStyle || 'glow-viral';
  const effectiveTitle = title || topicTitle || 'Split Screen Explainer';

  // Combine and normalize explanation visuals for top 50%
  const allVisuals = React.useMemo(() => {
    const list = [
      ...explanationMediaUrls,
      ...explanationImages,
      ...explanationVideos,
    ].filter(Boolean);
    return list.length > 0
      ? list
      : ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1080&q=80'];
  }, [explanationMediaUrls, explanationImages, explanationVideos]);

  // Duration per explanation visual item
  const totalDuration = Math.max(5, durationSeconds);
  const totalFrames = Math.max(150, Math.round(totalDuration * fps));
  const visualDurationFrames = Math.max(90, Math.floor(totalFrames / Math.max(1, allVisuals.length)));

  // Current visual index for top 50%
  const activeVisualIdx = Math.min(
    allVisuals.length - 1,
    Math.floor(frame / visualDurationFrames)
  );
  const currentVisualUrl = resolveUrl(allVisuals[activeVisualIdx]);
  const isVisualVideo = isVideoUrl(currentVisualUrl);

  // Dynamic Camera Punch-In (+8% Zoom) for Bottom Creator Video (Every 4.5s)
  const creatorZoomCycle = 135;
  const isCreatorPunchedIn = (Math.floor(frame / creatorZoomCycle) % 2 === 1);
  const creatorZoomScale = isCreatorPunchedIn ? 1.08 : 1.0;

  // Subtle Ken Burns Camera Motion for Top Visual
  const localVisualFrame = frame % visualDurationFrames;
  const kenBurnsScale = interpolate(localVisualFrame, [0, visualDurationFrames], [1.02, 1.12], {
    extrapolateRight: 'clamp',
  });
  const kenBurnsPanX = interpolate(localVisualFrame, [0, visualDurationFrames], [0, -15], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAFA' }}>
      {/* 1. CLEAN WHITE AMBIENT BACKGROUND */}
      <SubtleAmbientBackground frame={frame} fps={fps} />

      {/* 2. TOP 50%: EXPLANATION MEDIA ZONE (Images / Video Clips / Infographics) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          borderBottom: '3px solid #FF5722',
        }}
      >
        {isVisualVideo ? (
          <OffthreadVideo
            src={currentVisualUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Img
            src={currentVisualUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${kenBurnsScale}) translateX(${kenBurnsPanX}px)`,
              transformOrigin: 'center center',
            }}
          />
        )}

        {/* Top Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 35%, rgba(0,0,0,0.65) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Topic Badge */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 36,
            right: 36,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 9999,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255, 87, 34, 0.4)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#FF5722',
                boxShadow: '0 0 8px #FF5722',
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: '#0F172A',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {effectiveTitle}
            </span>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 800,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Explanation Visual #{activeVisualIdx + 1}
          </div>
        </div>
      </div>

      {/* 3. CENTER SPLIT DIVIDER BAR */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: '#FF5722',
          zIndex: 30,
          boxShadow: '0 0 16px rgba(255, 87, 34, 0.8)',
        }}
      />

      {/* 4. BOTTOM 50%: CREATOR VIDEO ZONE (Facecam / Talking Head) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '50%',
          overflow: 'hidden',
          backgroundColor: '#1E293B',
        }}
      >
        {finalCreatorVideo && isVideoUrl(finalCreatorVideo) ? (
          <OffthreadVideo
            src={finalCreatorVideo}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${creatorZoomScale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        ) : finalCreatorVideo ? (
          <Img
            src={finalCreatorVideo}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8',
              backgroundColor: '#0F172A',
            }}
          >
            <p style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Creator Video Feed
            </p>
            <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 6 }}>
              Talking head facecam video plays in bottom 50%
            </p>
          </div>
        )}

        {/* Creator Label Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 36,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 800,
            zIndex: 10,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22C55E' }} />
          <span>Creator Reaction / Narration</span>
        </div>
      </div>

      {/* 5. SCENE TRANSITION SFX EVENTS */}
      {allVisuals.map((_, idx) => {
        const startFrame = idx * visualDurationFrames;
        const sfxFile = idx === 0 ? 'assets/reusable/sfx/pop.mp3' : 'assets/reusable/sfx/whoosh.wav';
        return (
          <Sequence key={`sfx-${idx}`} from={startFrame} durationInFrames={Math.round(fps * 1.5)}>
            <Audio src={resolveUrl(sfxFile)} volume={0.22} />
          </Sequence>
        );
      })}

      {/* 6. UNIVERSAL 20 CAPTION STYLES (Positioned in Center Safe-Zone) */}
      {activeCaptions.length > 0 && (
        <UniversalCaptionLayer
          captions={activeCaptions}
          captionThemeId={activeCaptionTheme}
          backgroundTheme="solid-white"
          position="center"
          styleOverrides={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            border: '2px solid rgba(255, 87, 34, 0.35)',
            boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.08)',
            color: '#0F172A',
            fontSize: 28,
            padding: '10px 24px',
            borderRadius: 16,
          }}
        />
      )}

      {/* 7. ORIGINAL CREATOR AUDIO */}
      {finalAudioUrl && (
        <Audio
          src={finalAudioUrl}
          volume={1.0}
        />
      )}

      {/* 8. BACKGROUND MUSIC (12% Default Volume) */}
      {finalBgmUrl && finalBgmUrl !== 'none' && (
        <Audio
          src={finalBgmUrl}
          volume={Math.max(0, Math.min(1, typeof bgmVolume === 'number' ? bgmVolume : 0.12))}
          loop
        />
      )}
      {!finalBgmUrl && bgmUrl !== 'none' && (
        <Audio
          src={resolveUrl('assets/reusable/music/parasail-silent-partner.mp3')}
          volume={Math.max(0, Math.min(1, typeof bgmVolume === 'number' ? bgmVolume : 0.12))}
          loop
        />
      )}
    </AbsoluteFill>
  );
};

export const SplitScreenExplainerComposition: React.FC = () => (
  <Composition
    id="SPLIT-SCREEN-EXPLAINER"
    component={SplitScreenExplainerTemplate}
    durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={{
      durationSeconds: 60,
      title: 'Split Screen Explainer',
      explanationMediaUrls: [],
    }}
    calculateMetadata={({ props }) => {
      const p = props as SplitScreenExplainerProps;
      const durationSeconds = Math.max(5, Math.min(90, Number(p.durationSeconds) || 60));
      return {
        durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width: 1080,
        height: 1920,
      };
    }}
  />
);

