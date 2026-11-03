import React from 'react';
import {
  AbsoluteFill,
  Sequence,
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

export interface OverlayLayerItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  startSeconds?: number;
  durationSeconds?: number;
  position?: 'top-right' | 'top-left' | 'center';
  isCutaway?: boolean;
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

export interface AiShortsPolisherProps {
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
  aspectRatio?: '9:16';
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

export function AiShortsPolisher({
  mediaSrc = '',
  mediaItems = [],
  layerItems = [],
  title = 'AI Shorts Polisher',
  smartPunchIns = true,
  silenceJumpCuts = true,
  captions = [],
  captionStyle = 'Pop Word',
  captionPosition = 'center',
  bgmUrl = '',
  bgmVolume = 0.12,
  enableSfx = true,
  durationSeconds = 60,
  sourceAudioVolume = 1,
  aspectRatio = '9:16',
  brandWatermark = false,
  retentionWords = [
    { word: 'WAIT', atSeconds: 15 },
    { word: 'THE SECRET', atSeconds: 32 },
    { word: 'LOOK HERE', atSeconds: 48 },
    { word: 'STEP 1', atSeconds: 65 },
  ],
  curvedArrows = [],
  equationFormula,
  comparisonBanner,
}: AiShortsPolisherProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSeconds = frame / fps;

  // 1. SMART CAMERA PUNCH-IN (+15% Zoom Cut for 9:16 Vertical)
  const zoomCycle = 135; // ~4.5s
  const isPunchedIn = smartPunchIns && (Math.floor(frame / zoomCycle) % 2 === 1);
  const zoomSpring = spring({
    frame: frame % zoomCycle,
    fps,
    config: { damping: 11, mass: 0.45, stiffness: 175 },
  });
  const cameraScale = isPunchedIn
    ? interpolate(zoomSpring, [0, 1], [1.0, 1.15])
    : interpolate(zoomSpring, [0, 1], [1.15, 1.0]);

  // 2. PRIMARY FULLSCREEN 9:16 MEDIA RESOLUTION
  const activeMediaSrc = mediaSrc || (mediaItems.length > 0 ? mediaItems[0].url : '');

  // 3. OVERLAY LAYER (Picture-in-Picture Callout or Full B-Roll Cutaway)
  const activeOverlay = layerItems.find((layer) => {
    const start = layer.startSeconds ?? 4;
    const dur = layer.durationSeconds ?? 4;
    return currentSeconds >= start && currentSeconds <= start + dur;
  }) || (layerItems.length > 0 && currentSeconds >= 4 && currentSeconds <= 8 ? layerItems[0] : null);

  const isFullCutaway = Boolean(activeOverlay && (activeOverlay.isCutaway || (currentSeconds >= 4 && currentSeconds <= 7.5)));

  // Entrance spring for overlay PIP
  const pipSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 210 },
  });
  const pipScale = interpolate(pipSpring, [0, 1], [0.85, 1.0]);
  const pipOpacity = interpolate(pipSpring, [0, 1], [0, 1]);

  // 4. VERTICAL 9:16 KINETIC CAPTIONS
  const activeCaption = captions.find(
    (c) => currentSeconds >= (c.start ?? 0) && currentSeconds <= (c.end ?? (c.start ?? 0) + 2.5)
  );

  // 5. TOP CREATOR FEATURE #1: NEON PROOF STAT DETECTION
  const statRegex = /(?:[\$₹€£]\s*)?\d+(?:[,\.]\d+)*(?:\s*(?:k|m|b|%|x|cr|lakh))?/i;
  const statMatch = activeCaption?.text ? activeCaption.text.match(statRegex) : null;
  const hasStat = Boolean(statMatch && statMatch[0].trim().length >= 2);
  const detectedStat = statMatch ? statMatch[0].trim() : '';

  // 6. TOP CREATOR FEATURE #2: BLACKOUT RETENTION RESET
  const activeRetention = retentionWords.find(
    (r) => currentSeconds >= r.atSeconds && currentSeconds <= r.atSeconds + 1.1
  );

    // Calculate Punch-In Whoosh Triggers
  const totalFrames = Math.round(durationSeconds * fps);
  const punchInCount = Math.floor(totalFrames / zoomCycle);
  const punchInFrames = Array.from({ length: punchInCount }, (_, i) => (i + 1) * zoomCycle);

  return (
    <AbsoluteFill style={{ backgroundColor: '#070B14', overflow: 'hidden' }}>
      {/* 0. SYNCHRONIZED TOP-CREATOR MOTION SFX (Whoosh on punch-in, Pop on overlays) */}
      {enableSfx && punchInFrames.map((f, idx) => (
        <Sequence key={`punch-sfx-${idx}`} from={f} durationInFrames={18} layout="none">
          <Audio src={resolveAsset('assets/reusable/sfx/whoosh.wav')} volume={0.16} />
        </Sequence>
      ))}
      {enableSfx && activeOverlay && (
        <Sequence from={Math.round((activeOverlay.startSeconds ?? 4) * fps)} durationInFrames={18} layout="none">
          <Audio src={resolveAsset('assets/reusable/sfx/pop.mp3')} volume={0.22} />
        </Sequence>
      )}
      {enableSfx && hasStat && (
        <Sequence from={Math.round((activeCaption?.start ?? 0) * fps)} durationInFrames={18} layout="none">
          <Audio src={resolveAsset('assets/reusable/sfx/pop.mp3')} volume={0.20} />
        </Sequence>
      )}
      {enableSfx && activeRetention && (
        <Sequence from={Math.round(activeRetention.atSeconds * fps)} durationInFrames={24} layout="none">
          <Audio src={resolveAsset('assets/reusable/sfx/hit.mp3')} volume={0.26} />
        </Sequence>
      )}
      {/* Background Music Loop (Ducked at 12% default) */}
      {bgmUrl && bgmUrl !== 'none' && (
        <Audio
          src={resolveAsset(bgmUrl)}
          volume={bgmVolume}
          loop
        />
      )}

      {/* PRIMARY FULLSCREEN 9:16 VIDEO CANVAS with Dynamic +15% Zoom */}
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
              fontSize: 42,
              fontWeight: 800,
              textAlign: 'center',
              padding: 40,
            }}
          >
            AI Shorts Polisher
          </div>
        )}
      </div>

      {/* TOP CREATOR FEATURE #3: FULL B-ROLL CUTAWAY OR PIP CALLOUT */}
      {activeOverlay && (
        isFullCutaway ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 35,
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
                  bottom: 120,
                  left: 48,
                  right: 48,
                  padding: '12px 24px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  color: '#FFFFFF',
                  borderRadius: 16,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 22,
                  fontWeight: 800,
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
                }}
              >
                {activeOverlay.title}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 140,
              right: 48,
              width: 380,
              height: 240,
              borderRadius: 24,
              overflow: 'hidden',
              border: '3px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 24px rgba(255, 87, 34, 0.4)',
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
                  padding: '10px 16px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 16,
                  fontWeight: 800,
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
          durationFrames={34}
        />
      )}

      {/* TOP CREATOR FEATURE #4: ANIMATED CURVED ARROW CALLOUT */}
      {(() => {
        const activeArrow = curvedArrows.find((arrow) => {
          const dur = arrow.durationSeconds ?? 3.5;
          return currentSeconds >= arrow.atSeconds && currentSeconds <= arrow.atSeconds + dur;
        }) || (activeOverlay && !isFullCutaway && currentSeconds >= (activeOverlay.startSeconds ?? 4) + 0.3 && currentSeconds <= (activeOverlay.startSeconds ?? 4) + 3.8 ? {
          label: 'LOOK HERE',
          direction: 'down-left' as const,
          atSeconds: (activeOverlay.startSeconds ?? 4) + 0.3,
          x: '45%',
          y: '80px',
          color: '#EF4444',
        } : null);

        if (!activeArrow) return null;

        return (
          <div
            style={{
              position: 'absolute',
              left: activeArrow.x ?? '50%',
              top: activeArrow.y ?? '120px',
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

      {/* KINETIC VERTICAL 9:16 CAPTIONS (TikTok/Reels Safe-Zone & Active Word Glow) */}
      {activeCaption && !hasStat && !activeRetention && (
        <div
          style={{
            position: 'absolute',
            bottom: 360, // Above bottom 20% TikTok/Reels description & audio title
            left: 48,
            right: 104, // Clears vertical Like/Comment/Share buttons on right
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '16px 28px',
              borderRadius: 22,
              background: 'rgba(7, 11, 20, 0.88)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(255, 255, 255, 0.22)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 24px rgba(255, 87, 34, 0.35)',
              maxWidth: '100%',
              textAlign: 'center',
            }}
          >
            {Array.isArray(activeCaption.words) && activeCaption.words.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 12px' }}>
                {activeCaption.words.map((w, wIdx) => {
                  const isWordActive = currentSeconds >= (w.start ?? 0) && currentSeconds <= (w.end ?? (w.start ?? 0) + 0.35);
                  return (
                    <span
                      key={wIdx}
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: 42,
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                        color: isWordActive ? '#FACC15' : '#FFFFFF',
                        textShadow: isWordActive
                          ? '0 0 16px rgba(250, 204, 21, 0.85), 0 2px 8px rgba(0,0,0,0.9)'
                          : '0 3px 12px rgba(0, 0, 0, 0.9)',
                        transform: isWordActive ? 'scale(1.08)' : 'scale(1)',
                        display: 'inline-block',
                        transition: 'transform 0.1s ease',
                      }}
                    >
                      {w.word}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 42,
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  textShadow: '0 3px 12px rgba(0, 0, 0, 0.9)',
                  lineHeight: 1.25,
                }}
              >
                {activeCaption.text}
              </span>
            )}
          </div>
        </div>
      )}

      {/* BRAND WATERMARK (OPTIONAL) */}
      {brandWatermark && <BrandWatermark />}
    </AbsoluteFill>
  );
}

export const AiShortsPolisherComposition = () => (
  <Composition
    id="AI-SHORTS-POLISHER"
    component={AiShortsPolisher}
    durationInFrames={1800} // default 60s
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      title: 'AI Shorts Polisher',
      smartPunchIns: true,
      silenceJumpCuts: true,
      durationSeconds: 60,
      aspectRatio: '9:16' as const,
      bgmVolume: 0.12,
      captionStyle: 'Pop Word',
    }}
  />
);
