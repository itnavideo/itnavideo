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
import {PremiumAudioLayer, type PremiumSoundCue, type PremiumStyleLock} from '../../components/PremiumAudioLayer';
import {getPremiumMediaStyle, PremiumVisualTreatment, type PremiumVisualStyleLock} from '../../components/PremiumVisualTreatment';

type LongVideoPromoProps = {
  // Core props (actively rendered)
  thumbnailSrc?: string;
  title?: string;
  mediaSrc?: string;
  mediaAspect?: 'landscape' | 'portrait' | 'reel' | '16:9' | '9:16' | '1:1' | '4:5' | 'square';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  accentColor?: string;
  fastRender?: boolean;
  premiumEditing?: boolean;
  styleLock?: PremiumStyleLock & PremiumVisualStyleLock;
  soundCues?: PremiumSoundCue[];
  // Backward-compat props (accepted from API but not rendered)
  ctaText?: string;
  channelName?: string;
  channelLogoSrc?: string;
  subscriberCount?: string;
  mediaType?: string;
  chips?: string[];
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
  mediaSrc = '',
  mediaAspect = 'landscape',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  accentColor = '#93C5FD',
  fastRender = true,
  premiumEditing = true,
  styleLock,
  soundCues = [],
}: LongVideoPromoProps) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const premiumMediaStyle = getPremiumMediaStyle(styleLock, frame, durationInFrames);

  const hasPromoClip = Boolean(mediaSrc);
  const isPortraitClip = mediaAspect === 'portrait' || mediaAspect === 'reel' || mediaAspect === '9:16';
  const isFourFiveClip = mediaAspect === '4:5';
  const isSquareClip = mediaAspect === '1:1' || mediaAspect === 'square';
  const videoAspectRatio = isPortraitClip ? '9/16' : isFourFiveClip ? '4/5' : isSquareClip ? '1/1' : '16/9';

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

  // Thumbnail highlight pulse (very subtle; only the top thumbnail is framed)
  const borderGlow = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.4, 0.7]);

  const bgZoom = interpolate(frame, [0, durationInFrames], [1.2, 1.28], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#0F172A'}}>
      <PremiumAudioLayer enabled={premiumEditing} styleLock={styleLock} soundCues={soundCues} />

      {/* === BACKGROUND: use thumbnail by default so Lambda decodes the uploaded video only once. === */}
      {thumbnailSrc ? (
        <div style={{position: 'absolute', inset: -28, overflow: 'hidden'}}>
          <Img
            src={resolveAsset(thumbnailSrc)}
            style={{
              width: '112%',
              height: '112%',
              objectFit: 'cover',
              filter: 'blur(52px) brightness(0.28) saturate(1.22)',
              transform: `${premiumMediaStyle.transform} scale(${bgZoom})`,
              transformOrigin: 'center center',
            }}
          />
        </div>
      ) : hasPromoClip && !fastRender ? (
        <div style={{position: 'absolute', inset: -20, overflow: 'hidden'}}>
          <OffthreadVideo
            src={resolveAsset(mediaSrc)}
            startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
            style={{
              width: '110%', height: '110%',
              objectFit: 'cover',
              filter: 'blur(44px) brightness(0.18) saturate(1.1)',
              transform: `scale(${bgZoom})`,
            }}
            volume={0}
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

      <div style={{
        position: 'absolute',
        top: 60,
        left: 40,
        right: 40,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      {/* === SECTION 1: THUMBNAIL (top) === */}
      <div style={{
        width: '100%',
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
        </div>
      </div>

      {/* === SECTION 2: TITLE (integrated typography, no bordered box) === */}
      <div style={{
        width: '100%',
        marginTop: 30,
        opacity: titleSpring,
        transform: `translateY(${titleY}px)`,
        textAlign: 'center',
      }}>
        <div style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: '100%',
          padding: '0 22px 18px',
        }}>
          <div style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            top: -14,
            bottom: 4,
            borderRadius: 999,
            background: `radial-gradient(ellipse at center, ${accentColor}24 0%, transparent 70%)`,
            filter: 'blur(12px)',
          }} />
          <div style={{
            position: 'absolute',
            left: 42,
            right: 42,
            bottom: 0,
            height: 5,
            borderRadius: 999,
            background: `linear-gradient(90deg, transparent 0%, ${accentColor}99 22%, rgba(248,250,252,0.65) 50%, ${accentColor}99 78%, transparent 100%)`,
            boxShadow: `0 0 24px ${accentColor}40`,
          }} />
          <h1 style={{
            position: 'relative',
            margin: 0,
            fontSize: titleFontSize,
            fontWeight: 900,
            color: '#F8FAFC',
            lineHeight: 1.2,
            letterSpacing: 0,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textShadow: '0 2px 12px rgba(0,0,0,0.75)',
            maxHeight: '2.4em',
            overflow: 'hidden',
          }}>
            {displayTitle}
          </h1>
        </div>
      </div>

      {/* === SECTION 3: PROMO VIDEO CLIP — plays below title === */}
      {hasPromoClip ? (
        <div style={{
          width: '100%',
          flex: 1,
          minHeight: 0,
          marginTop: 20,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          opacity: clipSpring,
          transform: `scale(${clipSpring}) translateY(${floatY}px)`,
          transformOrigin: 'center top',
        }}>
          <div style={{
            position: 'relative',
            width: isPortraitClip ? '65%' : '100%',
            maxWidth: isPortraitClip ? 520 : undefined,
            aspectRatio: videoAspectRatio,
            borderRadius: 16,
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.12)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <OffthreadVideo
              src={resolveAsset(mediaSrc)}
              startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: styleLock?.colorGrade?.filter || undefined,
              }}
              volume={sourceAudioVolume}
            />
          </div>
        </div>
      ) : (
        /* No clip uploaded — show thumbnail echo as placeholder */
        <div style={{
          width: '100%',
          flex: 1,
          minHeight: 0,
          marginTop: 18,
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent',
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
      </div>

      <PremiumVisualTreatment enabled={premiumEditing} styleLock={styleLock} includeLightSweep />
    </AbsoluteFill>
  );
}

const defaultProps: LongVideoPromoProps = {
  thumbnailSrc: '',
  title: 'Complete Guide to SBI Credit Card',
  mediaSrc: '',
  mediaAspect: 'landscape',
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,
  durationSeconds: 60,
  sourceDurationSeconds: 60,
  fastRender: true,
};

export const LongVideoPromoComposition = () => (
  <Composition
    id="LONG-VIDEO-PROMO"
    component={LongVideoPromo}
    durationInFrames={1800}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as LongVideoPromoProps;
      const dur = Math.max(8, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || 60
      ));
      return {durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
