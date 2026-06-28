import {
  AbsoluteFill,
  Composition,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { CanvasGraphicsLayer } from '../../layers/CanvasGraphicsLayer';
import { buildPromoEffects } from '../../layers/canvasEffectPresets';

type CaptionItem = {
  text?: string;
  start?: number;
  end?: number;
};

type LongVideoPromoProps = {
  // Core props (actively rendered)
  thumbnailSrc?: string;
  title?: string;
  subtitle?: string;
  mediaSrc?: string;
  mediaAspect?: 'landscape' | 'portrait' | 'reel' | '16:9' | '9:16' | '1:1' | '4:5';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  captions?: CaptionItem[];
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  videoDuration?: string;
  // Backward-compat props (accepted from API but not rendered)
  ctaText?: string;
  channelName?: string;
  channelLogoSrc?: string;
  subscriberCount?: string;
  mediaType?: string;
  chips?: string[];
  accentColor?: string;
};

/**
 * Clamps title text to max 2 lines worth of characters.
 * If too long, truncates with ellipsis.
 */
function clampTitle(value: string, maxChars = 60): string {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 1).trim()}…`;
}

/** Resolve asset path: URLs pass through, local paths use staticFile */
function resolveAsset(value: string): string {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
}

function LongVideoPromo({
  thumbnailSrc = '',
  title = 'Watch Full Video',
  subtitle = '',
  mediaSrc = '',
  mediaAspect = 'landscape',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  captions = [],
  videoDuration = '',
}: LongVideoPromoProps) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const hasPromoClip = Boolean(mediaSrc);
  const isPortraitClip = mediaAspect === 'portrait' || mediaAspect === 'reel' || mediaAspect === '9:16';
  const isSquareClip = mediaAspect === '1:1' || mediaAspect === '4:5';

  // Safe title — max 60 chars, 2 lines
  const displayTitle = clampTitle(title, 60);
  const titleFontSize = displayTitle.length > 40 ? 38 : displayTitle.length > 28 ? 44 : 50;

  // === ANIMATIONS ===

  // Thumbnail: slow zoom + fade in
  const thumbOpacity = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp'});
  const thumbScale = interpolate(frame, [0, 14, 900], [1.06, 1.0, 1.04], {extrapolateRight: 'clamp'});
  // Subtle shine sweep across thumbnail
  const shineX = interpolate(frame, [30, 55], [-100, 110], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Title: slide up + fade
  const titleSpring = spring({frame: Math.max(0, frame - 10), fps, config: {damping: 14, mass: 0.6}});
  const titleY = interpolate(frame, [10, 26], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Video clip: scale in + fade
  const clipSpring = spring({frame: Math.max(0, frame - 20), fps, config: {damping: 13, mass: 0.7}});

  // Gentle continuous float for video area
  const floatY = Math.sin(frame * 0.025) * 2;

  // Border highlight pulse (very subtle)
  const borderGlow = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.4, 0.7]);

  // Background slow Ken Burns drift
  const bgDriftX = Math.sin(frame * 0.008) * 8;
  const bgDriftY = Math.cos(frame * 0.006) * 5;
  const bgZoom = interpolate(frame, [0, durationInFrames], [1.2, 1.28], {extrapolateRight: 'clamp'});

  // Video preview frame dimensions based on aspect ratio
  const getClipFrameStyle = (): {width: string | number; height: string | number; aspectRatio?: string} => {
    if (isPortraitClip) {
      // 9:16 — phone-style vertical frame
      return {width: 480, height: 854, aspectRatio: '9/16'};
    }
    if (isSquareClip) {
      // 1:1 or 4:5 — square-ish frame
      return {width: 700, height: mediaAspect === '4:5' ? 875 : 700};
    }
    // Default 16:9 landscape
    return {width: '100%', height: 'auto', aspectRatio: '16/9'};
  };

  const clipFrameStyle = getClipFrameStyle();

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      {/* === BACKGROUND: blurred video (moving slowly) or thumbnail fallback === */}
      {hasPromoClip ? (
        <div style={{position: 'absolute', inset: -20, overflow: 'hidden'}}>
          <OffthreadVideo
            src={mediaSrc}
            startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
            style={{
              width: '110%', height: '110%',
              objectFit: 'cover',
              filter: 'blur(44px) brightness(0.22) saturate(1.3)',
              transform: `scale(${bgZoom}) translate(${bgDriftX}px, ${bgDriftY}px)`,
              transformOrigin: 'center center',
            }}
            volume={0}
          />
        </div>
      ) : thumbnailSrc ? (
        <div style={{position: 'absolute', inset: -20, overflow: 'hidden'}}>
          <Img
            src={resolveAsset(thumbnailSrc)}
            style={{
              width: '110%', height: '110%',
              objectFit: 'cover',
              filter: 'blur(44px) brightness(0.18) saturate(1.1)',
              transform: `scale(${bgZoom}) translate(${bgDriftX}px, ${bgDriftY}px)`,
            }}
          />
        </div>
      ) : (
        /* Fallback gradient when no media/thumbnail */
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #0a0a1a 0%, #0d1025 30%, #1a0f2e 60%, #0a0a1a 100%)',
        }} />
      )}

      {/* Soft vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
      }} />

      {/* Top gradient for thumbnail area readability */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 300,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
      }} />

      {/* === SECTION 1: THUMBNAIL (top) === */}
      <div style={{
        position: 'absolute', top: 60, left: 40, right: 40,
        opacity: thumbOpacity,
        transform: `scale(${thumbScale})`,
        transformOrigin: 'center top',
      }}>
        <div style={{
          position: 'relative', aspectRatio: '16/9', borderRadius: 16,
          overflow: 'hidden',
          border: `2.5px solid rgba(255,255,255,${borderGlow * 0.5})`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,${borderGlow * 0.06})`,
        }}>
          {thumbnailSrc ? (
            <Img src={resolveAsset(thumbnailSrc)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{fontSize: 32, color: 'rgba(255,255,255,0.2)', fontWeight: 800}}>THUMBNAIL</span>
            </div>
          )}

          {/* Shine sweep effect */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(105deg, transparent ${shineX - 15}%, rgba(255,255,255,0.12) ${shineX}%, transparent ${shineX + 15}%)`,
            pointerEvents: 'none',
          }} />

          {/* Play button — minimal */}
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{width: 0, height: 0, marginLeft: 5, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '20px solid rgba(255,255,255,0.9)'}} />
            </div>
          </div>

          {/* Duration badge — only if provided */}
          {videoDuration ? (
            <div style={{
              position: 'absolute', bottom: 10, right: 12,
              background: 'rgba(0,0,0,0.8)', borderRadius: 5, padding: '3px 8px',
              fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: 0.3,
            }}>
              {videoDuration}
            </div>
          ) : null}
        </div>
      </div>

      {/* === SECTION 2: TITLE (below thumbnail) === */}
      <div style={{
        position: 'absolute', top: 650, left: 44, right: 44,
        opacity: titleSpring,
        transform: `translateY(${titleY}px)`,
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: titleFontSize,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.2,
          letterSpacing: -0.5,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textShadow: '0 2px 16px rgba(0,0,0,0.6)',
          maxHeight: '2.4em',
          overflow: 'hidden',
        }}>
          {displayTitle}
        </h1>
        {subtitle ? (
          <p style={{
            marginTop: 10, fontSize: 24, fontWeight: 600,
            color: 'rgba(255,255,255,0.6)',
            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
          }}>
            {clampTitle(subtitle, 50)}
          </p>
        ) : null}
      </div>

      {/* === SECTION 3: PROMO VIDEO PREVIEW (bottom area — preserves aspect ratio) === */}
      {hasPromoClip ? (
        <div style={{
          position: 'absolute',
          top: isPortraitClip ? 790 : 820,
          left: 0, right: 0,
          bottom: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: clipSpring,
          transform: `scale(${clipSpring}) translateY(${floatY}px)`,
          transformOrigin: 'center top',
        }}>
          {/* Blurred background behind video for empty side space */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
            borderRadius: 18,
            margin: '0 28px',
          }} />

          {/* Video frame — aspect ratio preserved */}
          <div style={{
            position: 'relative',
            width: isPortraitClip ? 480 : isSquareClip ? 700 : 'calc(100% - 56px)',
            maxWidth: 1000,
            height: isPortraitClip ? 854 : undefined,
            aspectRatio: isPortraitClip ? '9/16' : isSquareClip ? (mediaAspect === '4:5' ? '4/5' : '1/1') : '16/9',
            maxHeight: isPortraitClip ? 1050 : 580,
            borderRadius: isPortraitClip ? 24 : 14,
            overflow: 'hidden',
            border: `2px solid rgba(255,255,255,${borderGlow * 0.35})`,
            boxShadow: '0 16px 50px rgba(0,0,0,0.5)',
            background: '#000',
          }}>
            <OffthreadVideo
              src={mediaSrc}
              startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain',
                objectPosition: 'center center',
              }}
              volume={sourceAudioVolume}
            />

            {/* Phone frame indicator for portrait clips */}
            {isPortraitClip && (
              <>
                {/* Top notch */}
                <div style={{
                  position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
                  width: 80, height: 5, borderRadius: 3,
                  background: 'rgba(255,255,255,0.15)',
                }} />
                {/* Bottom bar */}
                <div style={{
                  position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
                  width: 120, height: 4, borderRadius: 2,
                  background: 'rgba(255,255,255,0.12)',
                }} />
              </>
            )}
          </div>
        </div>
      ) : (
        /* No clip uploaded — show thumbnail echo as placeholder */
        <div style={{
          position: 'absolute', top: 820, left: 60, right: 60, bottom: 80,
          borderRadius: 14, overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.03)',
          opacity: clipSpring,
        }}>
          {thumbnailSrc ? (
            <Img src={resolveAsset(thumbnailSrc)} style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.4) blur(2px)',
            }} />
          ) : null}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              padding: '14px 36px', borderRadius: 12,
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontSize: 22, fontWeight: 700,
            }}>
              ▶ Promo clip area
            </div>
          </div>
        </div>
      )}

      {/* === CAPTION OVERLAY (safe zone at bottom) === */}
      {captions.length > 0 ? (() => {
        const time = frame / fps;
        const active = captions.find((c) => time >= Number(c.start ?? 0) && time < Number(c.end ?? 999));
        if (!active?.text) return null;
        return (
          <div style={{
            position: 'absolute', bottom: 16, left: 44, right: 44,
            textAlign: 'center', zIndex: 30,
          }}>
            <div style={{
              display: 'inline-block', padding: '10px 20px', borderRadius: 10,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
            }}>
              <span style={{fontSize: 22, fontWeight: 700, color: '#fff'}}>{active.text}</span>
            </div>
          </div>
        );
      })() : null}
      {/* === CANVAS GRAPHICS LAYER — motion effects overlay === */}
      <CanvasGraphicsLayer
        effects={buildPromoEffects({ durationFrames: durationInFrames })}
        zIndex={15}
      />
    </AbsoluteFill>
  );
}

const defaultProps: LongVideoPromoProps = {
  thumbnailSrc: '',
  title: 'Complete Guide to SBI Credit Card',
  subtitle: '',
  mediaSrc: '',
  mediaAspect: 'landscape',
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,
  durationSeconds: 30,
  sourceDurationSeconds: 30,
  captions: [],
  videoDuration: '12:34',
};

export const LongVideoPromoComposition = () => (
  <Composition
    id="LONG-VIDEO-PROMO"
    component={LongVideoPromo}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as LongVideoPromoProps;
      const dur = Math.max(8, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || 30
      ));
      return {durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
