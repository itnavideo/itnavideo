import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BrandWatermark } from '../../components/BrandWatermark';
import { NeonStatCallout } from './components/NeonStatCallout';
import { BlackoutRetentionCard } from './components/BlackoutRetentionCard';
import { CurvedArrowCallout } from './components/CurvedArrowCallout';
import { EquationFormulaCard, type EquationStep } from './components/EquationFormulaCard';
import { SideBySideComparisonBanner, type ComparisonSide } from './components/SideBySideComparisonBanner';

export interface OverlayLayerItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  startSeconds?: number;
  durationSeconds?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'center';
  isCutaway?: boolean; // When true, cuts away full screen like top creator B-roll
}

export interface PrimaryMediaItem {
  id: string;
  url: string;
  type?: 'video' | 'image';
  durationSeconds?: number;
}

export interface CaptionSegment {
  text: string;
  start: number;
  end: number;
  words?: Array<{ word: string; start: number; end: number }>;
}

export interface RetentionWordItem {
  word: string;
  atSeconds: number;
}

export interface ArrowItem {
  label?: string;
  direction?: 'down-left' | 'down-right' | 'up-right' | 'up-left';
  atSeconds: number;
  durationSeconds?: number;
  x?: number | string;
  y?: number | string;
  color?: string;
}

export interface EquationFormulaData {
  step1: EquationStep;
  operator1?: string;
  step2: EquationStep;
  operator2?: string;
  result: EquationStep;
  atSeconds: number;
  durationSeconds?: number;
}

export interface ComparisonBannerData {
  left: ComparisonSide;
  right: ComparisonSide;
  atSeconds: number;
  durationSeconds?: number;
}

export interface AiVideoPolisherProps {
  mediaSrc?: string;
  mediaItems?: PrimaryMediaItem[];
  layerItems?: OverlayLayerItem[];
  title?: string;
  smartPunchIns?: boolean;
  silenceJumpCuts?: boolean;
  captions?: CaptionSegment[];
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  bgmUrl?: string;
  bgmVolume?: number;
  enableSfx?: boolean;
  durationSeconds?: number;
  sourceAudioVolume?: number;
  aspectRatio?: '16:9';
  brandWatermark?: boolean;
  retentionWords?: RetentionWordItem[];
  curvedArrows?: ArrowItem[];
  equationFormula?: EquationFormulaData;
  comparisonBanner?: ComparisonBannerData;
}

/** Resolve asset path: absolute web URLs pass through, relative paths use staticFile */
function resolveAsset(value: string): string {
  if (!value) return '';
  if (/^(https?:|data:|blob:|\/)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
}

export function AiVideoPolisher({
  mediaSrc = '',
  mediaItems = [],
  layerItems = [],
  title = 'AI YouTube Video Polisher',
  smartPunchIns = true,
  silenceJumpCuts = true,
  captions = [],
  captionStyle = 'Pop Word',
  captionPosition = 'bottom',
  bgmUrl = '',
  bgmVolume = 0.12,
  enableSfx = true,
  durationSeconds = 60,
  sourceAudioVolume = 1,
  aspectRatio = '16:9',
  brandWatermark = false,
  retentionWords = [
    { word: 'RETHINK', atSeconds: 17 },
    { word: 'THE PROOF', atSeconds: 35 },
    { word: 'THE SECRET', atSeconds: 52 },
    { word: 'RULE #1', atSeconds: 70 },
  ],
  curvedArrows = [],
  equationFormula,
  comparisonBanner,
}: AiVideoPolisherProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSeconds = frame / fps;

  // 1. SMART CAMERA PUNCH-IN (+15% Zoom Cut on Alternating Sentence Rhythm)
  const zoomCycle = 135; // ~4.5 seconds at 30fps
  const isPunchedIn = smartPunchIns && (Math.floor(frame / zoomCycle) % 2 === 1);
  const zoomSpring = spring({
    frame: frame % zoomCycle,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const cameraScale = isPunchedIn
    ? interpolate(zoomSpring, [0, 1], [1.0, 1.15])
    : interpolate(zoomSpring, [0, 1], [1.15, 1.0]);

  // 2. PRIMARY FULLSCREEN MEDIA RESOLUTION
  const activeMediaSrc = mediaSrc || (mediaItems.length > 0 ? mediaItems[0].url : '');

  // 3. OVERLAY LAYER (Picture-in-Picture Callout or Full B-Roll Cutaway)
  const activeOverlay = layerItems.find((layer) => {
    const start = layer.startSeconds ?? 4; // Defaults to 4s mark (like top creator cutaway)
    const dur = layer.durationSeconds ?? 4.5;
    return currentSeconds >= start && currentSeconds <= start + dur;
  }) || (layerItems.length > 0 && currentSeconds >= 4 && currentSeconds <= 8 ? layerItems[0] : null);

  // Check if this overlay acts as a full B-roll cutaway (e.g. between seconds 4 and 8)
  const isFullCutaway = Boolean(activeOverlay && (activeOverlay.isCutaway || (currentSeconds >= 4 && currentSeconds <= 8.5)));

  // Entrance spring for overlay PIP
  const pipSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 13, mass: 0.7 },
  });
  const pipScale = interpolate(pipSpring, [0, 1], [0.85, 1.0]);
  const pipOpacity = interpolate(pipSpring, [0, 1], [0, 1]);

  // 4. ACTIVE SPOKEN CAPTIONS
  const activeCaption = captions.find(
    (c) => currentSeconds >= (c.start ?? 0) && currentSeconds <= (c.end ?? (c.start ?? 0) + 3)
  );

  // 5. TOP CREATOR FEATURE #1: NEON PROOF STAT DETECTION
  // Automatically detects numbers, currencies ($293,071 / 290,000 / 81% / 10x) and triggers neon callout
  const statRegex = /(?:[\$₹€£]\s*)?\d+(?:[,\.]\d+)*(?:\s*(?:k|m|b|%|x|cr|lakh))?/i;
  const statMatch = activeCaption?.text ? activeCaption.text.match(statRegex) : null;
  const hasStat = Boolean(statMatch && statMatch[0].trim().length >= 2);
  const detectedStat = statMatch ? statMatch[0].trim() : '';

  // 6. TOP CREATOR FEATURE #2: BLACKOUT RETENTION RESET
  const activeRetention = retentionWords.find(
    (r) => currentSeconds >= r.atSeconds && currentSeconds <= r.atSeconds + 1.2
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#070B14', overflow: 'hidden' }}>
      {/* Background Music Loop (Ducked at 12% default) */}
      {bgmUrl && bgmUrl !== 'none' && (
        <Audio
          src={resolveAsset(bgmUrl)}
          volume={bgmVolume}
          loop
        />
      )}

      {/* PRIMARY FULLSCREEN VIDEO CANVAS with Dynamic +15% Zoom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${cameraScale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {activeMediaSrc ? (
          <OffthreadVideo
            src={resolveAsset(activeMediaSrc)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            volume={sourceAudioVolume}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'radial-gradient(ellipse at center, #1E293B 0%, #0F172A 70%, #020617 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            AI YouTube Video Polisher
          </div>
        )}
      </div>

      {/* TOP CREATOR FEATURE #3: FULL B-ROLL CUTAWAY OR PIP CALLOUT */}
      {activeOverlay && (
        isFullCutaway ? (
          // Full-Screen B-Roll Cutaway (Like YouTube Channel Grid or Screenshot Demo at 0:04)
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 35,
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.25s ease-in',
            }}
          >
            {activeOverlay.type === 'video' ? (
              <OffthreadVideo
                src={resolveAsset(activeOverlay.url)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                volume={0}
              />
            ) : (
              <Img
                src={resolveAsset(activeOverlay.url)}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}
            {activeOverlay.title && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 40,
                  left: 40,
                  padding: '8px 18px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  color: '#FFFFFF',
                  borderRadius: 12,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 16,
                  fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                }}
              >
                {activeOverlay.title}
              </div>
            )}
          </div>
        ) : (
          // Standard Top-Right Floating Picture-in-Picture Callout
          <div
            style={{
              position: 'absolute',
              top: 48,
              right: 56,
              width: 440,
              height: 250,
              borderRadius: 20,
              overflow: 'hidden',
              border: '2.5px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 20px rgba(255, 87, 34, 0.35)',
              backgroundColor: '#0F172A',
              opacity: pipOpacity,
              transform: `scale(${pipScale})`,
              zIndex: 30,
            }}
          >
            {activeOverlay.type === 'video' ? (
              <OffthreadVideo
                src={resolveAsset(activeOverlay.url)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                volume={0}
              />
            ) : (
              <Img
                src={resolveAsset(activeOverlay.url)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            {activeOverlay.title && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '8px 14px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {activeOverlay.title}
              </div>
            )}
          </div>
        )
      )}

      {/* TOP CREATOR FEATURE #1: NEON PROOF STAT CALLOUT */}
      {hasStat && !activeRetention && (
        <NeonStatCallout
          statText={detectedStat}
          subText={activeCaption?.text && activeCaption.text.length > detectedStat.length ? activeCaption.text.replace(detectedStat, '').trim() : undefined}
          triggerFrame={Math.round((activeCaption?.start ?? 0) * fps)}
          neonColor="#22C55E"
        />
      )}

      {/* TOP CREATOR FEATURE #2: BLACKOUT RETENTION CARD RESET */}
      {activeRetention && (
        <BlackoutRetentionCard
          word={activeRetention.word}
          triggerFrame={Math.round(activeRetention.atSeconds * fps)}
          durationFrames={36}
        />
      )}

      {/* TOP CREATOR FEATURE #4: ANIMATED CURVED ARROW CALLOUT */}
      {(() => {
        const activeArrow = curvedArrows.find((arrow) => {
          const dur = arrow.durationSeconds ?? 3.5;
          return currentSeconds >= arrow.atSeconds && currentSeconds <= arrow.atSeconds + dur;
        }) || (activeOverlay && !isFullCutaway && currentSeconds >= (activeOverlay.startSeconds ?? 4) + 0.3 && currentSeconds <= (activeOverlay.startSeconds ?? 4) + 3.8 ? {
          label: 'KEY EVIDENCE',
          direction: 'down-left' as const,
          atSeconds: (activeOverlay.startSeconds ?? 4) + 0.3,
          x: '55%',
          y: '45px',
          color: '#EF4444',
        } : null);

        if (!activeArrow) return null;

        return (
          <div
            style={{
              position: 'absolute',
              left: activeArrow.x ?? '50%',
              top: activeArrow.y ?? '100px',
              zIndex: 48,
              pointerEvents: 'none',
            }}
          >
            <CurvedArrowCallout
              label={activeArrow.label}
              direction={activeArrow.direction}
              color={activeArrow.color || '#EF4444'}
              triggerFrame={Math.round(activeArrow.atSeconds * fps)}
            />
          </div>
        );
      })()}

      {/* TOP CREATOR FEATURE #5: MULTI-STEP EQUATION / FORMULA CARD */}
      {(() => {
        if (!equationFormula) return null;
        const dur = equationFormula.durationSeconds ?? 5;
        if (currentSeconds < equationFormula.atSeconds || currentSeconds > equationFormula.atSeconds + dur) return null;

        return (
          <EquationFormulaCard
            step1={equationFormula.step1}
            operator1={equationFormula.operator1}
            step2={equationFormula.step2}
            operator2={equationFormula.operator2}
            result={equationFormula.result}
            triggerFrame={Math.round(equationFormula.atSeconds * fps)}
          />
        );
      })()}

      {/* TOP CREATOR FEATURE #6: SIDE-BY-SIDE SPLIT COMPARISON BANNER */}
      {(() => {
        if (!comparisonBanner) return null;
        const dur = comparisonBanner.durationSeconds ?? 5.5;
        if (currentSeconds < comparisonBanner.atSeconds || currentSeconds > comparisonBanner.atSeconds + dur) return null;

        return (
          <SideBySideComparisonBanner
            left={comparisonBanner.left}
            right={comparisonBanner.right}
            triggerFrame={Math.round(comparisonBanner.atSeconds * fps)}
          />
        );
      })()}

      {/* SMART LOWER-THIRD YOUTUBE PHRASE CAPTIONS */}
      {activeCaption && !hasStat && !activeRetention && (
        <div
          style={{
            position: 'absolute',
            bottom: 72,
            left: '10%',
            right: '10%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '14px 28px',
              borderRadius: 18,
              background: 'rgba(7, 11, 20, 0.88)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255, 109, 0, 0.55)',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.75), 0 0 20px rgba(255, 87, 34, 0.25)',
              maxWidth: '85%',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              {activeCaption.text}
            </span>
          </div>
        </div>
      )}

      {/* JUMP CUT / POLISHER STATUS WATERMARK (OPTIONAL) */}
      {brandWatermark && <BrandWatermark />}
    </AbsoluteFill>
  );
}

export const AiVideoPolisherComposition = () => (
  <Composition
    id="AI-VIDEO-POLISHER"
    component={AiVideoPolisher}
    durationInFrames={1800} // default 60s
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{
      title: 'AI YouTube Video Polisher',
      smartPunchIns: true,
      silenceJumpCuts: true,
      durationSeconds: 60,
      aspectRatio: '16:9' as const,
      bgmVolume: 0.12,
      captionStyle: 'Pop Word',
    }}
  />
);
