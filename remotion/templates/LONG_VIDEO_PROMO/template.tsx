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
import {PremiumVisualTreatment, type PremiumVisualStyleLock} from '../../components/PremiumVisualTreatment';
import {resolveFont} from '../../utils/fonts';
import {DEFAULT_FPS, secondsToFrames} from '../../constants';

// Self-hosted fonts (Lambda-safe). Title uses a bold clean sans; badges/CTA use a heavy display face.
const TITLE_FONT = resolveFont('Montserrat');
const DISPLAY_FONT = resolveFont('Anton');

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
  // Traffic-driving CTA (rendered)
  ctaText?: string;
  ctaSubtext?: string;
  // Backward-compat props (accepted from API but not rendered)
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
function clampTitle(value: string, maxChars = 80): string {
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

export function LongVideoPromo({
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
  ctaText = 'Watch the full video',
  ctaSubtext = 'Link in bio',
}: LongVideoPromoProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const hasPromoClip = Boolean(mediaSrc);
  const isPortraitClip = mediaAspect === 'portrait' || mediaAspect === 'reel' || mediaAspect === '9:16';
  const isFourFiveClip = mediaAspect === '4:5';
  const isSquareClip = mediaAspect === '1:1' || mediaAspect === 'square';
  const videoAspectRatio = isPortraitClip ? '9/16' : isFourFiveClip ? '4/5' : isSquareClip ? '1/1' : '16/9';
  const mediaFrameAspectRatio = isPortraitClip ? '2/3' : videoAspectRatio;

  // Safe title — max 80 chars (matches dashboard limit), up to 2 lines
  const displayTitle = clampTitle(title, 80);
  const titleFontSize = displayTitle.length > 56 ? 34 : displayTitle.length > 40 ? 38 : displayTitle.length > 28 ? 44 : 50;

  // CTA pill entrance + a gentle continuous pulse so "watch full video" stays alive.
  const ctaSpring = spring({frame: Math.max(0, frame - 30), fps, config: {damping: 13, mass: 0.6}});
  const ctaPulse = 1 + Math.sin(frame * 0.09) * 0.02;
  // Bouncing arrow that points up toward the thumbnail / bio.
  const arrowBounce = Math.sin(frame * 0.14) * 6;
  const arrowOpacity = interpolate(frame, [24, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Play button attention pulse on the thumbnail.
  const playPulse = 1 + Math.sin(frame * 0.11) * 0.06;
  // Badge entrance.
  const badgeOpacity = interpolate(frame, [6, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

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
              transform: 'scale(1.14)',
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
              transform: 'scale(1.12)',
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

          {/* FULL VIDEO badge — clarifies the thumbnail is the full long video */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 14px', borderRadius: 10,
            background: '#EF4444',
            boxShadow: '0 6px 18px rgba(239,68,68,0.4)',
            opacity: badgeOpacity,
          }}>
            <span style={{width: 8, height: 8, borderRadius: '50%', background: '#fff'}} />
            <span style={{fontFamily: DISPLAY_FONT, fontSize: 20, letterSpacing: 1, color: '#fff'}}>FULL VIDEO</span>
          </div>

          {/* Play button — minimal, gently pulsing to draw the eye */}
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: `scale(${playPulse})`,
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
            fontFamily: TITLE_FONT,
            textShadow: '0 2px 12px rgba(0,0,0,0.75)',
            maxHeight: '2.4em',
            overflow: 'hidden',
          }}>
            {displayTitle}
          </h1>
        </div>
      </div>

      {/* === SECTION 3: PROMO VIDEO CLIP — aspect-aware cinematic media stage === */}
      {hasPromoClip ? (
        <div style={{
          width: '100%',
          flex: 1,
          minHeight: 0,
          marginTop: 20,
          paddingBottom: 156,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          opacity: clipSpring,
          transform: `translateY(${(1 - clipSpring) * 28 + floatY}px) scale(${0.96 + clipSpring * 0.04})`,
          transformOrigin: 'center top',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            minHeight: 0,
            overflow: 'hidden',
            borderRadius: 28,
            background: 'rgba(3, 7, 18, 0.78)',
            boxShadow: '0 28px 80px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Matching media fill gives non-vertical uploads a deliberate full-stage composition. */}
            {thumbnailSrc ? (
              <Img
                src={resolveAsset(thumbnailSrc)}
                style={{
                  position: 'absolute',
                  inset: -36,
                  width: 'calc(100% + 72px)',
                  height: 'calc(100% + 72px)',
                  objectFit: 'cover',
                  filter: 'blur(34px) brightness(0.42) saturate(1.18)',
                  transform: 'scale(1.08)',
                }}
              />
            ) : (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(145deg, #10182c 0%, #080d1a 54%, #17213a 100%)',
              }} />
            )}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(3,7,18,0.28) 0%, transparent 25%, transparent 72%, rgba(3,7,18,0.52) 100%)',
            }} />

            {/* PREVIEW chip — signals this clip is a teaser, not the full video */}
            <div style={{
              position: 'absolute', top: 14, left: 14, zIndex: 5,
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 13px', borderRadius: 9,
              background: 'rgba(3,7,18,0.7)', backdropFilter: 'blur(6px)',
              border: `1.5px solid ${accentColor}66`,
              opacity: clipSpring,
            }}>
              <span style={{width: 7, height: 7, borderRadius: '50%', background: accentColor}} />
              <span style={{fontFamily: DISPLAY_FONT, fontSize: 16, letterSpacing: 1, color: '#fff'}}>PREVIEW</span>
            </div>
            <div style={{
              position: 'relative',
              height: isPortraitClip ? '100%' : isFourFiveClip ? '92%' : isSquareClip ? '82%' : 'auto',
              width: isPortraitClip ? 'auto' : isFourFiveClip || isSquareClip ? 'auto' : '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              // Let the full stage height determine this 2:3 portrait hero. Setting a fixed width here
              // overrides aspectRatio and causes a much harsher, face-blind 9:16 crop.
              aspectRatio: mediaFrameAspectRatio,
              overflow: 'hidden',
              borderRadius: isPortraitClip ? 22 : 18,
              boxShadow: '0 24px 60px rgba(0,0,0,0.52)',
              background: '#070B14',
            }}>
              <OffthreadVideo
                src={resolveAsset(mediaSrc)}
                startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: isPortraitClip ? 'cover' : 'contain',
                  objectPosition: isPortraitClip ? 'center 32%' : 'center center',
                  filter: styleLock?.colorGrade?.filter || undefined,
                }}
                volume={sourceAudioVolume}
              />
            </div>
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: 'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.34) 100%)',
            }} />
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

      {/* === CTA: the whole point of the promo — tell the viewer where to watch the full video === */}
      <div style={{
        position: 'absolute',
        left: 40,
        right: 40,
        bottom: 40,
        zIndex: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity: ctaSpring,
        transform: `translateY(${(1 - ctaSpring) * 24}px)`,
      }}>
        {/* Bouncing up-arrow — points to the full video / link in bio */}
        <svg viewBox="0 0 48 44" width={46} height={42} style={{opacity: arrowOpacity, transform: `translateY(${arrowBounce}px)`, filter: `drop-shadow(0 4px 10px ${accentColor}66)`}}>
          <path d="M10 24 L24 10 L38 24" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 36 L24 22 L38 36" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
        </svg>

        {/* CTA pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '15px 30px',
          borderRadius: 999,
          background: '#FFFFFF',
          boxShadow: `0 16px 44px rgba(0,0,0,0.5), 0 0 0 4px ${accentColor}33`,
          transform: `scale(${ctaPulse})`,
          maxWidth: '100%',
        }}>
          <span style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#EF4444',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{width: 0, height: 0, marginLeft: 4, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '15px solid #fff'}} />
          </span>
          <span style={{display: 'flex', flexDirection: 'column', minWidth: 0}}>
            <span style={{fontFamily: DISPLAY_FONT, fontSize: 30, lineHeight: 1.05, letterSpacing: 0.3, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {ctaText}
            </span>
            {ctaSubtext ? (
              <span style={{fontFamily: TITLE_FONT, fontSize: 17, fontWeight: 800, color: '#64748B', letterSpacing: 0.4}}>
                {ctaSubtext}
              </span>
            ) : null}
          </span>
        </div>
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
  ctaText: 'Watch the full video',
  ctaSubtext: 'Link in bio',
};

export const LongVideoPromoComposition = () => (
  <Composition
    id="LONG-VIDEO-PROMO"
    component={LongVideoPromo}
    durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as LongVideoPromoProps;
      const dur = Math.max(8, Math.min(90,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || 60
      ));
      return {durationInFrames: secondsToFrames(dur, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1080, height: 1920};
    }}
  />
);
