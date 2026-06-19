import {
  AbsoluteFill,
  Composition,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {SubtitleRenderer} from '../../components/SubtitleRenderer';
import type {CaptionSegment} from '../../types/subtitles';

type CaptionItem = {
  text?: string;
  start?: number;
  end?: number;
};

type LongVideoPromoProps = {
  thumbnailSrc?: string;
  title?: string;
  subtitle?: string;
  mediaSrc?: string;
  mediaType?: 'video' | 'audio';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  captions?: CaptionItem[];
  chips?: string[];
  ctaText?: string;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  accentColor?: string;
};

const ACCENT = '#10b981';

function LongVideoPromo({
  thumbnailSrc = '',
  title = 'Watch Full Video',
  subtitle = '',
  mediaSrc = '',
  mediaType = 'video',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  captions = [],
  chips = ['Full Guide', 'Step-by-Step', 'Must Watch'],
  ctaText = 'Watch Now →',
  accentColor = ACCENT,
}: LongVideoPromoProps) {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // Animations
  const introScale = spring({frame, fps, config: {damping: 12, mass: 0.8}});
  const titleReveal = spring({frame: Math.max(0, frame - 12), fps, config: {damping: 14, mass: 0.6}});
  const chipsReveal = spring({frame: Math.max(0, frame - 24), fps, config: {damping: 12}});
  const ctaPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.97, 1.03]);
  const glowPulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.4, 0.8]);
  const thumbZoom = interpolate(frame, [0, fps * 3], [1, 1.06], {extrapolateRight: 'clamp'});
  const particleOffset = (frame * 0.3) % 100;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* BG: Blurred thumbnail or dark gradient */}
      {thumbnailSrc ? (
        <Img
          src={thumbnailSrc}
          style={{
            position: 'absolute', inset: -40, width: width + 80, height: height + 80,
            objectFit: 'cover', filter: 'blur(40px) brightness(0.3) saturate(1.4)',
            transform: `scale(${thumbZoom})`,
          }}
        />
      ) : (
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0a0a1a 0%, #000 50%, #0a1a15 100%)'}} />
      )}

      {/* Dark overlay */}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)'}} />

      {/* Soft glow accent */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', width: 600, height: 600,
        borderRadius: '50%', transform: 'translateX(-50%)',
        background: `radial-gradient(circle, ${accentColor}${Math.round(glowPulse * 25).toString(16).padStart(2,'0')} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${15 + i * 14}%`,
          top: `${((particleOffset + i * 17) % 100)}%`,
          width: 4 + i * 2, height: 4 + i * 2,
          borderRadius: '50%',
          background: `${accentColor}${i % 2 === 0 ? '44' : '22'}`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* === TOP: Thumbnail Hero Card === */}
      <div style={{
        position: 'absolute', top: 120, left: 60, right: 60,
        opacity: introScale, transform: `scale(${introScale * thumbZoom})`,
      }}>
        {/* Glow border */}
        <div style={{
          position: 'absolute', inset: -4, borderRadius: 24,
          background: `linear-gradient(135deg, ${accentColor}88, transparent 50%, ${accentColor}44)`,
          opacity: glowPulse,
        }} />
        {/* Thumbnail 16:9 */}
        <div style={{
          position: 'relative', aspectRatio: '16/9', borderRadius: 20,
          overflow: 'hidden', border: `3px solid ${accentColor}66`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${accentColor}22`,
        }}>
          {thumbnailSrc ? (
            <Img src={thumbnailSrc} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
            <div style={{width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontSize: 48, color: 'rgba(255,255,255,0.2)', fontWeight: 900}}>THUMBNAIL</span>
            </div>
          )}
          {/* Play button overlay */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              border: `2px solid ${accentColor}88`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 20px ${accentColor}44`,
            }}>
              <div style={{
                width: 0, height: 0, marginLeft: 6,
                borderTop: '14px solid transparent', borderBottom: '14px solid transparent',
                borderLeft: `22px solid ${accentColor}`,
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* === MIDDLE: Title / Hook Layer === */}
      <div style={{
        position: 'absolute', top: 680, left: 48, right: 48,
        opacity: titleReveal, transform: `translateY(${(1 - titleReveal) * 30}px)`,
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: title.length > 30 ? 52 : 64,
          fontWeight: 900, color: '#fff',
          lineHeight: 1.1, letterSpacing: -1.5,
          textShadow: `0 4px 20px rgba(0,0,0,0.8), 0 0 40px ${accentColor}33`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          {title}
        </h1>
        {subtitle ? (
          <p style={{
            marginTop: 16, fontSize: 28, fontWeight: 600,
            color: 'rgba(255,255,255,0.7)', lineHeight: 1.3,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}>
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* === Chips === */}
      <div style={{
        position: 'absolute', top: 900, left: 48, right: 48,
        display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
        opacity: chipsReveal, transform: `translateY(${(1 - chipsReveal) * 20}px)`,
      }}>
        {chips.slice(0, 4).map((chip, i) => (
          <div key={chip} style={{
            padding: '10px 20px', borderRadius: 30,
            background: `${accentColor}18`, border: `1.5px solid ${accentColor}55`,
            fontSize: 22, fontWeight: 700, color: accentColor,
            backdropFilter: 'blur(4px)',
            transform: `scale(${spring({frame: Math.max(0, frame - 24 - i * 5), fps, config: {damping: 12}})})`,
          }}>
            {chip}
          </div>
        ))}
      </div>

      {/* === BOTTOM: Promo video/audio + captions === */}
      {mediaSrc ? (
        <div style={{
          position: 'absolute', bottom: 260, left: 60, right: 60,
          borderRadius: 20, overflow: 'hidden',
          border: `2px solid rgba(255,255,255,0.1)`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          height: 320,
        }}>
          {mediaType === 'video' ? (
            <OffthreadVideo
              src={mediaSrc}
              startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
              volume={sourceAudioVolume}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #0f172a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Audio waveform visual */}
              <div style={{display: 'flex', gap: 4, alignItems: 'center'}}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} style={{
                    width: 6, borderRadius: 3, backgroundColor: accentColor,
                    height: 20 + Math.sin((frame * 0.15) + i * 0.8) * 30,
                    opacity: 0.6 + Math.sin((frame * 0.1) + i) * 0.3,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Caption overlay — uses shared SubtitleRenderer */}
      <SubtitleRenderer
        captions={captions.map((c) => ({
          start: Number(c.start ?? 0),
          end: Number(c.end ?? (c.start ?? 0) + 2.5),
          text: String(c.text || ''),
        }))}
        config={{
          style: 'normal',
          position: mediaSrc ? 'bottom' : 'center',
          language: 'en',
          textColor: '#ffffff',
          highlightColor: accentColor,
          fontSize: 'medium',
          showBackground: true,
        }}
      />

      {/* === CTA Button === */}
      <div style={{
        position: 'absolute', bottom: 100, left: 48, right: 48,
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          padding: '20px 48px', borderRadius: 50,
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
          boxShadow: `0 8px 32px ${accentColor}44, 0 0 20px ${accentColor}22`,
          transform: `scale(${ctaPulse})`,
          fontSize: 30, fontWeight: 900, color: '#000',
          letterSpacing: 0.5,
        }}>
          {ctaText}
        </div>
      </div>

      {/* Top vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.4) 100%)',
      }} />
    </AbsoluteFill>
  );
}

const defaultProps: LongVideoPromoProps = {
  thumbnailSrc: '',
  title: 'Complete Guide to Domain & Hosting',
  subtitle: 'Everything explained in 15 minutes',
  mediaSrc: '',
  mediaType: 'video',
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,
  chips: ['Full Guide', 'Step-by-Step', 'Real Example', 'Must Watch'],
  ctaText: 'Watch Full Video →',
  accentColor: '#10b981',
  durationSeconds: 30,
  sourceDurationSeconds: 30,
  captions: [
    {start: 0, end: 4, text: 'New video is live now'},
    {start: 4, end: 8, text: 'Complete guide step by step'},
    {start: 8, end: 12, text: 'Link in bio to watch full video'},
  ],
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
