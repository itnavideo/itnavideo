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
import {DEFAULT_FPS, secondsToFrames} from '../../constants';
import {BrandWatermark} from '../../components/BrandWatermark';

// Self-hosted fonts (Lambda-safe). Title uses a bold clean sans; badges/CTA use a heavy display face.
const resolveFont = (fontFamily: string) => fontFamily;
const TITLE_FONT = resolveFont('Montserrat');
const DISPLAY_FONT = resolveFont('Anton');

export type LongVideoPromoProps = {
  // Core props
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
  // Traffic-driving CTA & branding
  promoGoal?: 'watch-full-video' | 'subscribers' | 'promote-episode';
  ctaText?: string;
  ctaSubtext?: string;
  promoCtaStyle?: 'youtube-red' | 'emerald' | 'glass' | 'tiktok-yellow';
  promoCreatorHandle?: string;
  promoBackgroundMode?: 'blur' | 'solid';
  // Optional word-synced subtitles
  captions?: Array<{
    text: string;
    start: number;
    end: number;
  }>;
  // Backward-compat props
  channelName?: string;
  channelLogoSrc?: string;
  subscriberCount?: string;
  mediaType?: string;
  chips?: string[];
  watermark?: boolean;
};

/** Clamps title text to max 2 lines worth of characters */
function clampTitle(value: string, maxChars = 80): string {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 1).trim()}…`;
}

/** Resolve asset path: Absolute web paths and full URLs pass through, relative paths use staticFile */
function resolveAsset(value: string): string {
  if (!value) return '';
  if (/^(https?:|data:|blob:|\/)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
}

/** Floating Atmospheric Bokeh Dust Particles */
function AmbientDustParticles({frame}: {frame: number}) {
  const particles = [
    {x: 12, y: 18, size: 4, speed: 0.6, opacity: 0.35},
    {x: 84, y: 25, size: 5, speed: 0.8, opacity: 0.4},
    {x: 30, y: 65, size: 3, speed: 0.5, opacity: 0.25},
    {x: 75, y: 82, size: 6, speed: 0.7, opacity: 0.3},
    {x: 50, y: 40, size: 4, speed: 0.9, opacity: 0.35},
    {x: 90, y: 55, size: 3, speed: 0.4, opacity: 0.2},
    {x: 15, y: 90, size: 5, speed: 0.65, opacity: 0.3},
  ];

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden'}}>
      {particles.map((p, i) => {
        const floatY = (p.y - (frame * p.speed * 0.12)) % 100;
        const normalizedY = floatY < 0 ? floatY + 100 : floatY;
        const driftX = p.x + Math.sin(frame * 0.03 + i) * 3;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${driftX}%`,
              top: `${normalizedY}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              opacity: p.opacity,
              filter: `blur(${p.size > 4 ? 2 : 1}px)`,
              boxShadow: '0 0 12px rgba(255, 255, 255, 0.8)',
            }}
          />
        );
      })}
    </div>
  );
}

/** 20-band Kinetic Audio Spectrum Visualizer (After Effects Audio Spectrum Effect) */
function AudioSpectrumVisualizer({
  frame,
  accentColor = '#38BDF8',
  barCount = 20,
}: {
  frame: number;
  accentColor?: string;
  barCount?: number;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 32,
        padding: '0 16px',
      }}
    >
      {Array.from({length: barCount}).map((_, i) => {
        const centerWeight = 1 - Math.abs((i - barCount / 2) / (barCount / 2)) * 0.45;
        const wave1 = Math.sin(frame * 0.22 + i * 0.75);
        const wave2 = Math.cos(frame * 0.32 - i * 0.5);
        const wave3 = Math.sin(frame * 0.12 + i * 1.3);
        const rawHeight = Math.max(0.15, (wave1 * 0.3 + wave2 * 0.25 + wave3 * 0.2 + 0.65) * centerWeight);
        const barHeight = Math.min(32, Math.max(4, Math.round(rawHeight * 26)));

        return (
          <div
            key={i}
            style={{
              width: 5,
              height: `${barHeight}px`,
              borderRadius: 999,
              background:
                i % 2 === 0
                  ? `linear-gradient(180deg, #F59E0B 0%, ${accentColor} 100%)`
                  : `linear-gradient(180deg, ${accentColor} 0%, #EC4899 100%)`,
              boxShadow: `0 0 8px ${accentColor}55`,
            }}
          />
        );
      })}
    </div>
  );
}

export function LongVideoPromo({
  thumbnailSrc = '',
  title = 'Watch Full Video',
  mediaSrc = '',
  mediaAspect = 'landscape',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  accentColor = '#38BDF8',
  fastRender = true,
  premiumEditing = true,
  styleLock,
  soundCues = [],
  promoGoal,
  ctaText,
  ctaSubtext,
  promoCtaStyle = 'youtube-red',
  promoCreatorHandle = '',
  promoBackgroundMode = 'blur',
  captions = [],
  durationSeconds = 60,
  channelName,
  watermark = false,
}: LongVideoPromoProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const hasPromoClip = Boolean(mediaSrc);
  const isPortraitClip = mediaAspect === 'portrait' || mediaAspect === 'reel' || mediaAspect === '9:16';
  const displayCreatorHandle = (promoCreatorHandle || channelName || '').trim().replace(/^@+/, '');

  // Resolve CTA text & subtext from promoGoal or fallback
  let resolvedCtaText = ctaText || 'WATCH FULL VIDEO';
  let resolvedCtaSubtext = ctaSubtext || 'Link in bio';

  if (promoGoal === 'watch-full-video') {
    resolvedCtaText = ctaText || 'WATCH FULL VIDEO';
    resolvedCtaSubtext = ctaSubtext || 'Link in bio & comments';
  } else if (promoGoal === 'subscribers') {
    resolvedCtaText = ctaText || 'SUBSCRIBE FOR MORE';
    resolvedCtaSubtext = ctaSubtext || (displayCreatorHandle ? `@${displayCreatorHandle} on YouTube` : 'Full video on YouTube');
  } else if (promoGoal === 'promote-episode') {
    resolvedCtaText = ctaText || 'WATCH FULL EPISODE';
    resolvedCtaSubtext = ctaSubtext || 'Out now on YouTube';
  }

  // Safe title with max 2-line clamp & GA Orange accents
  const displayTitle = clampTitle(title, 80);
  const titleFontSize = displayTitle.length > 56 ? 30 : displayTitle.length > 40 ? 34 : displayTitle.length > 28 ? 40 : 44;

  const titleWords = displayTitle.split(/\s+/);
  const formattedTitle = titleWords.map((word, idx) => {
    const cleanWord = word.replace(/[^\w]/g, '');
    const isHighlight = idx === titleWords.length - 1 || /^(how|why|secret|top|new|exclusive|full|master|best|ultimate|real|live|watch)$/i.test(cleanWord);
    if (isHighlight && titleWords.length > 2) {
      return (
        <span key={idx} style={{ color: '#FF9100' }}>
          {word}{' '}
        </span>
      );
    }
    return word + ' ';
  });

  // === AFTER EFFECTS MOTION GRAPHICS CALCULATIONS ===

  // 1. 3D Floating Parallax Card Physics for Thumbnail
  const thumbSpring = spring({frame, fps, config: {damping: 14, mass: 0.8}});
  const thumbScale = interpolate(thumbSpring, [0, 1], [0.92, 1.0]);
  const thumbOpacity = interpolate(thumbSpring, [0, 1], [0, 1]);
  const cardTiltX = Math.sin(frame * 0.035) * 3.2; // 3D X rotation
  const cardTiltY = Math.cos(frame * 0.025) * 4.0; // 3D Y rotation
  const cardFloatY = Math.sin(frame * 0.04) * 5.0; // Levitation float
  const cardShineX = interpolate(frame % 110, [0, 40], [-120, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. Play Button Concentric Ripple Wave Rings (Radio Wave effect)
  const ripple1Progress = (frame % 40) / 40;
  const ripple2Progress = ((frame + 20) % 40) / 40;
  const playPulse = 1 + Math.sin(frame * 0.12) * 0.05;

  // 3. Title Spring
  const titleSpring = spring({frame: Math.max(0, frame - 10), fps, config: {damping: 14, mass: 0.6}});
  const titleY = interpolate(frame, [10, 26], [20, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // 4. Video Stage Spring & Ken Burns Drift
  const clipSpring = spring({frame: Math.max(0, frame - 16), fps, config: {damping: 13, mass: 0.7}});
  const kenBurnsScale = 1.0 + interpolate(frame, [0, 900], [0, 0.04], {extrapolateRight: 'clamp'});

  // 5. Blinking Live REC Dot & Timecode
  const isRecDotVisible = Math.floor(frame / 15) % 2 === 0;
  const elapsedSecs = Math.floor(frame / fps);
  const elapsedMillis = Math.floor(((frame % fps) / fps) * 100);
  const timecode = `00:${String(elapsedSecs).padStart(2, '0')}:${String(elapsedMillis).padStart(2, '0')}`;
  const teaserProgress = Math.min(100, Math.max(0, (frame / ((durationSeconds || 60) * fps)) * 100));

  // 6. Active Caption within Video Window
  const currentSeconds = frame / fps;
  const activeCaption = captions.find(
    (c) => currentSeconds >= (c.start ?? 0) && currentSeconds <= (c.end ?? (c.start ?? 0) + 2)
  );

  // 7. CTA Spring & Bouncing Arrows
  const ctaSpring = spring({frame: Math.max(0, frame - 25), fps, config: {damping: 13, mass: 0.6}});
  const ctaPulse = 1 + Math.sin(frame * 0.1) * 0.025;
  const arrowBounce = Math.sin(frame * 0.16) * 7;
  const arrowOpacity = interpolate(frame, [20, 36], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // CTA Style Configs
  const ctaThemeMap = {
    'youtube-red': {
      bg: 'linear-gradient(135deg, #FF0000 0%, #DC2626 100%)',
      textColor: '#FFFFFF',
      subColor: '#FEE2E2',
      border: '2px solid rgba(255, 255, 255, 0.35)',
      shadow: '0 16px 44px rgba(220, 38, 38, 0.55), 0 0 24px rgba(239, 68, 68, 0.4)',
      iconBg: '#FFFFFF',
      iconFill: '#DC2626',
    },
    emerald: {
      bg: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      textColor: '#FFFFFF',
      subColor: '#D1FAE5',
      border: '2px solid rgba(52, 211, 153, 0.6)',
      shadow: '0 16px 44px rgba(16, 185, 129, 0.5), 0 0 24px rgba(52, 211, 153, 0.45)',
      iconBg: '#FFFFFF',
      iconFill: '#059669',
    },
    glass: {
      bg: 'rgba(15, 23, 42, 0.92)',
      textColor: '#F8FAFC',
      subColor: '#94A3B8',
      border: `2px solid ${accentColor}88`,
      shadow: `0 16px 44px rgba(0, 0, 0, 0.6), 0 0 24px ${accentColor}44`,
      iconBg: accentColor,
      iconFill: '#0F172A',
    },
    'tiktok-yellow': {
      bg: 'linear-gradient(135deg, #FACC15 0%, #EAB308 100%)',
      textColor: '#0F172A',
      subColor: '#451A03',
      border: '2px solid rgba(255, 255, 255, 0.8)',
      shadow: '0 16px 44px rgba(234, 179, 8, 0.5), 0 0 24px rgba(250, 204, 21, 0.4)',
      iconBg: '#0F172A',
      iconFill: '#FACC15',
    },
  };
  const activeCtaTheme = ctaThemeMap[promoCtaStyle] || ctaThemeMap['youtube-red'];

  return (
    <AbsoluteFill style={{backgroundColor: '#090D16', overflow: 'hidden'}}>
      <PremiumAudioLayer enabled={premiumEditing} styleLock={styleLock} soundCues={soundCues} />

      {/* === BACKGROUND: Cinematic Ambient Blur vs Deep Solid Charcoal === */}
      {promoBackgroundMode === 'blur' && thumbnailSrc ? (
        <div style={{position: 'absolute', inset: -30, overflow: 'hidden'}}>
          <Img
            src={resolveAsset(thumbnailSrc)}
            style={{
              width: '115%',
              height: '115%',
              objectFit: 'cover',
              filter: 'blur(56px) brightness(0.24) saturate(1.3)',
              transform: 'scale(1.16)',
            }}
          />
        </div>
      ) : hasPromoClip && promoBackgroundMode === 'blur' && !fastRender ? (
        <div style={{position: 'absolute', inset: -20, overflow: 'hidden'}}>
          <OffthreadVideo
            src={resolveAsset(mediaSrc)}
            startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
            style={{
              width: '110%',
              height: '110%',
              objectFit: 'cover',
              filter: 'blur(48px) brightness(0.2) saturate(1.2)',
              transform: 'scale(1.12)',
            }}
            volume={0}
          />
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 20%, #17213A 0%, #0A0D18 60%, #06070C 100%)',
          }}
        />
      )}

      {/* Ambient Vignette & Volumetric Lighting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.72) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: '20%',
          width: '60%',
          height: 380,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${accentColor}25 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Atmospheric Dust Particles */}
      <AmbientDustParticles frame={frame} />

      {/* Main Container Stage */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 40,
          right: 40,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        {/* === SECTION 1: 3D FLOATING PARALLAX THUMBNAIL CARD === */}
        <div
          style={{
            width: '100%',
            perspective: 1200,
            opacity: thumbOpacity,
            transform: `perspective(1200px) rotateX(${cardTiltX}deg) rotateY(${cardTiltY}deg) translateY(${cardFloatY}px) scale(${thumbScale})`,
            transformOrigin: 'center center',
          }}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '16/9',
              borderRadius: 22,
              overflow: 'hidden',
              border: '2.5px solid rgba(255, 255, 255, 0.45)',
              boxShadow: `0 24px 64px rgba(0, 0, 0, 0.65), 0 0 35px ${accentColor}33`,
              background: '#0D1322',
            }}
          >
            {thumbnailSrc ? (
              <Img
                src={resolveAsset(thumbnailSrc)}
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
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{fontSize: 28, color: 'rgba(255,255,255,0.4)', fontWeight: 800}}>THUMBNAIL</span>
              </div>
            )}

            {/* Glossy Reflection Light Sweep */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(115deg, transparent ${cardShineX - 25}%, rgba(255,255,255,0.22) ${cardShineX}%, transparent ${cardShineX + 25}%)`,
                pointerEvents: 'none',
              }}
            />

            {/* TOP BADGE LEFT: FULL VIDEO OUT NOW */}
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 14px',
                borderRadius: 12,
                background: 'rgba(220, 38, 38, 0.95)',
                boxShadow: '0 6px 18px rgba(220, 38, 38, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  boxShadow: '0 0 8px #FFFFFF',
                }}
              />
              <span style={{fontFamily: DISPLAY_FONT, fontSize: 18, letterSpacing: 1.2, color: '#FFFFFF'}}>
                FULL VIDEO
              </span>
            </div>

            {/* TOP BADGE RIGHT: 4K UHD QUALITY TAG */}
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                padding: '6px 12px',
                borderRadius: 10,
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <span style={{fontFamily: DISPLAY_FONT, fontSize: 14, letterSpacing: 1, color: '#F8FAFC'}}>
                4K UHD
              </span>
            </div>

            {/* CENTRAL PLAY BUTTON WITH EXPANDING RADIO-WAVE RIPPLE RINGS */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Ripple Ring 1 */}
              <div
                style={{
                  position: 'absolute',
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  border: '2.5px solid rgba(255, 255, 255, 0.5)',
                  transform: `scale(${1 + ripple1Progress * 0.9})`,
                  opacity: 1 - ripple1Progress,
                  pointerEvents: 'none',
                }}
              />
              {/* Ripple Ring 2 */}
              <div
                style={{
                  position: 'absolute',
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  border: '2.5px solid rgba(255, 255, 255, 0.4)',
                  transform: `scale(${1 + ripple2Progress * 0.9})`,
                  opacity: 1 - ripple2Progress,
                  pointerEvents: 'none',
                }}
              />
              {/* Center Play Button Glass Sphere */}
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.72)',
                  backdropFilter: 'blur(10px)',
                  border: '2.5px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${playPulse})`,
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    marginLeft: 6,
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent',
                    borderLeft: '22px solid #FFFFFF',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* === SECTION 2: PROMO TITLE === */}
        <div
          style={{
            width: '100%',
            marginTop: 22,
            opacity: titleSpring,
            transform: `translateY(${titleY}px)`,
            textAlign: 'center',
          }}
        >
          <div style={{position: 'relative', display: 'inline-block', maxWidth: '100%', padding: '0 16px 8px'}}>
            <h1
              style={{
                position: 'relative',
                margin: 0,
                fontSize: titleFontSize,
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.22,
                fontFamily: TITLE_FONT,
                textShadow: '0 3px 16px rgba(0, 0, 0, 0.85)',
                maxHeight: '2.4em',
                overflow: 'hidden',
              }}
            >
              {formattedTitle}
            </h1>
            {/* Glowing Accent Line */}
            <div
              style={{
                marginTop: 8,
                height: 4,
                borderRadius: 999,
                background: `linear-gradient(90deg, transparent 0%, ${accentColor} 30%, #F59E0B 70%, transparent 100%)`,
                boxShadow: `0 0 16px ${accentColor}88`,
              }}
            />
          </div>
        </div>

        {/* === SECTION 3: CENTER DIVIDER WITH KINETIC AUDIO SPECTRUM VISUALIZER === */}
        <div
          style={{
            width: '100%',
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <AudioSpectrumVisualizer frame={frame} accentColor={accentColor} barCount={20} />
          <div
            style={{
              padding: '4px 12px',
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(6px)',
              fontSize: 11,
              fontFamily: DISPLAY_FONT,
              letterSpacing: 1.2,
              color: '#F8FAFC',
              textTransform: 'uppercase',
            }}
          >
            ⚡ TEASER CLIP
          </div>
        </div>

        {/* === SECTION 4: CINEMA MONITOR VIDEO BEZEL (BOTTOM HALF) === */}
        {hasPromoClip ? (
          <div
            style={{
              width: '100%',
              flex: 1,
              minHeight: 0,
              marginTop: 12,
              paddingBottom: 160,
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
              opacity: clipSpring,
              transform: `scale(${0.96 + clipSpring * 0.04})`,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: 24,
                overflow: 'hidden',
                background: '#030712',
                border: '2.5px solid rgba(255, 255, 255, 0.22)',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Blurred Backdrop inside bezel */}
              {thumbnailSrc ? (
                <Img
                  src={resolveAsset(thumbnailSrc)}
                  style={{
                    position: 'absolute',
                    inset: -20,
                    width: 'calc(100% + 40px)',
                    height: 'calc(100% + 40px)',
                    objectFit: 'cover',
                    filter: 'blur(30px) brightness(0.35)',
                  }}
                />
              ) : null}

              {/* Video with subtle Ken Burns drift */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <OffthreadVideo
                  src={resolveAsset(mediaSrc)}
                  startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: isPortraitClip ? 'cover' : 'contain',
                    transform: `scale(${kenBurnsScale})`,
                  }}
                  volume={sourceAudioVolume}
                />
              </div>

              {/* TOP STATUS BAR: BLINKING REC DOT + TIMECODE */}
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 12px',
                  borderRadius: 8,
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: '#EF4444',
                    boxShadow: '0 0 10px #EF4444',
                    opacity: isRecDotVisible ? 1 : 0.25,
                  }}
                />
                <span
                  style={{
                    fontFamily: DISPLAY_FONT,
                    fontSize: 14,
                    letterSpacing: 1,
                    color: '#FFFFFF',
                  }}
                >
                  REC · {timecode}
                </span>
              </div>

              {/* TOP STATUS BAR RIGHT: VERIFIED CREATOR HANDLE */}
              {displayCreatorHandle ? (
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 12px',
                    borderRadius: 8,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: TITLE_FONT,
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#F8FAFC',
                    }}
                  >
                    @{displayCreatorHandle}
                  </span>
                  {/* Blue Verified Badge */}
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="#38BDF8">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              ) : null}

              {/* DYNAMIC SPEECH CAPTIONS INSIDE VIDEO STAGE WITH AUTOMATIC KEYWORD HIGHLIGHTING & 9:16 SAFE AREA */}
              {activeCaption ? (
                (() => {
                  const chunkDuration = Math.max(0.1, (activeCaption.end ?? activeCaption.start + 2) - (activeCaption.start ?? 0));
                  const progressInChunk = Math.min(1, Math.max(0, (currentSeconds - (activeCaption.start ?? 0)) / chunkDuration));
                  const words = (activeCaption.text || '').trim().split(/\s+/);
                  const activeWordIdx = Math.min(words.length - 1, Math.floor(progressInChunk * words.length));

                  return (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 24,
                        left: 16,
                        right: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 15,
                        pointerEvents: 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          padding: '10px 22px',
                          borderRadius: 16,
                          background: 'rgba(5, 9, 18, 0.90)',
                          backdropFilter: 'blur(12px)',
                          border: '1.5px solid rgba(255, 109, 0, 0.5)',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 16px rgba(255, 109, 0, 0.25)',
                          maxWidth: '92%',
                        }}
                      >
                        {words.map((w, wIdx) => {
                          const isActive = wIdx === activeWordIdx;
                          const isKeyword = /\d+|[\$€₹%]|everything|secret|never|money|scale|first|best|stop|watch|decision|changed|lost|built/i.test(w);

                          return (
                            <span
                              key={wIdx}
                              style={{
                                fontFamily: TITLE_FONT,
                                fontSize: 26,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                                color: isActive
                                  ? '#FFA726'
                                  : isKeyword
                                  ? '#FFDD00'
                                  : '#FFFFFF',
                                transform: isActive ? 'scale(1.08)' : 'scale(1.0)',
                                transition: 'transform 0.1s ease-out, color 0.1s ease-out',
                                textShadow: isActive
                                  ? '0 0 14px rgba(255, 167, 38, 0.8), 0 2px 4px rgba(0,0,0,0.9)'
                                  : '0 2px 6px rgba(0, 0, 0, 0.85)',
                              }}
                            >
                              {w}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              ) : null}

              {/* TEASER PROGRESS BAR AT BOTTOM OF VIDEO STAGE */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'rgba(255, 255, 255, 0.15)',
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${teaserProgress}%`,
                    background: `linear-gradient(90deg, ${accentColor} 0%, #F59E0B 100%)`,
                    boxShadow: `0 0 10px ${accentColor}`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder area */
          <div
            style={{
              width: '100%',
              flex: 1,
              minHeight: 0,
              marginTop: 18,
              borderRadius: 24,
              border: '2px dashed rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.03)',
            }}
          >
            <div style={{color: 'rgba(255,255,255,0.4)', fontSize: 20, fontWeight: 700}}>
              ▶ Upload Promo Clip
            </div>
          </div>
        )}
      </div>

      {/* === SECTION 5: BROADCAST-GRADE CONVERSION CTA === */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          bottom: 38,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: ctaSpring,
          transform: `translateY(${(1 - ctaSpring) * 20}px)`,
        }}
      >
        {/* Animated Bouncing Up-Arrow pointing to full video */}
        <svg
          viewBox="0 0 48 44"
          width={44}
          height={38}
          style={{
            opacity: arrowOpacity,
            transform: `translateY(${arrowBounce}px)`,
            filter: `drop-shadow(0 4px 10px ${accentColor}66)`,
          }}
        >
          <path
            d="M10 24 L24 10 L38 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 36 L24 22 L38 36"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.55}
          />
        </svg>

        {/* Dynamic CTA Theme Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 28px',
            borderRadius: 999,
            background: activeCtaTheme.bg,
            border: activeCtaTheme.border,
            boxShadow: activeCtaTheme.shadow,
            transform: `scale(${ctaPulse})`,
            maxWidth: '100%',
          }}
        >
          {/* Action Icon Sphere */}
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: activeCtaTheme.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 0,
                height: 0,
                marginLeft: 4,
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderLeft: `14px solid ${activeCtaTheme.iconFill}`,
              }}
            />
          </span>

          {/* CTA Text & Subtext */}
          <span style={{display: 'flex', flexDirection: 'column', minWidth: 0}}>
            <span
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: 26,
                lineHeight: 1.1,
                letterSpacing: 0.5,
                color: activeCtaTheme.textColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {resolvedCtaText}
            </span>
            {resolvedCtaSubtext ? (
              <span
                style={{
                  fontFamily: TITLE_FONT,
                  fontSize: 15,
                  fontWeight: 800,
                  color: activeCtaTheme.subColor,
                  letterSpacing: 0.4,
                }}
              >
                {resolvedCtaSubtext}
              </span>
            ) : null}
          </span>
        </div>
      </div>

      <PremiumVisualTreatment enabled={premiumEditing} styleLock={styleLock} includeLightSweep />
      <BrandWatermark watermark={watermark} />
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
  promoCtaStyle: 'youtube-red',
  promoCreatorHandle: '',
  promoBackgroundMode: 'blur',
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
      const dur = Math.max(8, Math.min(180, Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || 60));
      return {
        durationInFrames: secondsToFrames(dur, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width: 1080,
        height: 1920,
      };
    }}
  />
);
