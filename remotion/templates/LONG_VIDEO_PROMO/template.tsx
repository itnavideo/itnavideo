import {
  AbsoluteFill,
  Composition,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type CaptionItem = {
  text?: string;
  start?: number;
  end?: number;
};

type LongVideoPromoProps = {
  thumbnailSrc?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  channelName?: string;
  subscriberCount?: string;
  mediaSrc?: string;
  mediaType?: 'video' | 'audio';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  captions?: CaptionItem[];
  chips?: string[];
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  accentColor?: string;
};

function LongVideoPromo({
  thumbnailSrc = '',
  title = 'Watch Full Video',
  subtitle = '',
  ctaText = 'Full video on YouTube →',
  channelName = '',
  subscriberCount = '',
  mediaSrc = '',
  mediaType = 'video',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  captions = [],
  chips = ['NEW VIDEO', 'FULL GUIDE'],
  accentColor = '#FF0050',
}: LongVideoPromoProps) {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // Animations
  const thumbEntry = spring({frame, fps, config: {damping: 12, mass: 0.7}});
  const titleEntry = spring({frame: Math.max(0, frame - 10), fps, config: {damping: 14}});
  const ctaEntry = spring({frame: Math.max(0, frame - 20), fps, config: {damping: 12}});
  const badgeEntry = spring({frame: Math.max(0, frame - 6), fps, config: {damping: 10}});
  const arrowBounce = interpolate(Math.sin(frame * 0.12), [-1, 1], [-8, 8]);
  const thumbPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [1, 1.02]);
  const ctaPulse = interpolate(Math.sin(frame * 0.09), [-1, 1], [0.96, 1.04]);
  const glowOpacity = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.3, 0.7]);

  const hasPromoClip = Boolean(mediaSrc);

  return (
    <AbsoluteFill style={{backgroundColor: '#0a0a0a'}}>
      {/* Dynamic gradient background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 30%, ${accentColor}15 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, ${accentColor}10 0%, transparent 40%), linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)`,
      }} />

      {/* Animated particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${10 + i * 12}%`, top: `${((frame * 0.2 + i * 13) % 100)}%`,
          width: 3 + (i % 3), height: 3 + (i % 3), borderRadius: '50%',
          background: `${accentColor}${i % 2 === 0 ? '33' : '1a'}`,
        }} />
      ))}

      {/* === "NEW VIDEO" Badge === */}
      <div style={{
        position: 'absolute', top: 80, left: '50%', transform: `translateX(-50%) scale(${badgeEntry})`,
        display: 'flex', gap: 10, zIndex: 20,
      }}>
        {chips.slice(0, 2).map((chip) => (
          <div key={chip} style={{
            padding: '8px 18px', borderRadius: 8,
            background: accentColor, color: '#fff',
            fontSize: 22, fontWeight: 900, letterSpacing: 1.5,
            boxShadow: `0 4px 16px ${accentColor}66`,
          }}>
            {chip}
          </div>
        ))}
      </div>

      {/* === TOP: Thumbnail Hero Card === */}
      <div style={{
        position: 'absolute', top: 150, left: 48, right: 48,
        transform: `scale(${thumbEntry * thumbPulse})`, transformOrigin: 'center top',
      }}>
        {/* Glow behind thumbnail */}
        <div style={{
          position: 'absolute', inset: -8, borderRadius: 24,
          background: `${accentColor}${Math.round(glowOpacity * 40).toString(16).padStart(2, '0')}`,
          filter: 'blur(20px)',
        }} />
        {/* Thumbnail card */}
        <div style={{
          position: 'relative', aspectRatio: '16/9', borderRadius: 20,
          overflow: 'hidden', border: `4px solid rgba(255,255,255,0.15)`,
          boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 30px ${accentColor}22`,
        }}>
          {thumbnailSrc ? (
            <Img src={thumbnailSrc} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
            <div style={{width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontSize: 42, color: 'rgba(255,255,255,0.3)', fontWeight: 900}}>YOUR THUMBNAIL</span>
            </div>
          )}
          {/* Play button */}
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,0,80,0.9)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(255,0,80,0.4)',
              transform: `scale(${ctaPulse})`,
            }}>
              <div style={{width: 0, height: 0, marginLeft: 8, borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderLeft: '26px solid #fff'}} />
            </div>
          </div>
          {/* Duration badge */}
          <div style={{position: 'absolute', bottom: 12, right: 14, background: 'rgba(0,0,0,0.85)', borderRadius: 6, padding: '4px 10px', fontSize: 18, fontWeight: 700, color: '#fff'}}>
            FULL VIDEO
          </div>
        </div>
      </div>

      {/* === MIDDLE: Title + Channel === */}
      <div style={{
        position: 'absolute', top: 720, left: 48, right: 48,
        opacity: titleEntry, transform: `translateY(${(1 - titleEntry) * 24}px)`,
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: title.length > 35 ? 44 : 52,
          fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -1,
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          {title}
        </h1>
        {subtitle ? (
          <p style={{marginTop: 12, fontSize: 26, fontWeight: 600, color: 'rgba(255,255,255,0.6)', lineHeight: 1.3}}>
            {subtitle}
          </p>
        ) : null}

        {/* Channel info */}
        {channelName ? (
          <div style={{
            marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: accentColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 900, color: '#fff',
            }}>
              {channelName[0]?.toUpperCase() || '▶'}
            </div>
            <div style={{textAlign: 'left'}}>
              <p style={{fontSize: 24, fontWeight: 800, color: '#fff'}}>{channelName}</p>
              {subscriberCount ? <p style={{fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.5)'}}>{subscriberCount} subscribers</p> : null}
            </div>
            <div style={{
              marginLeft: 12, padding: '8px 16px', borderRadius: 8,
              background: '#FF0000', color: '#fff', fontSize: 18, fontWeight: 800,
              transform: `scale(${ctaPulse})`,
            }}>
              Subscribe
            </div>
          </div>
        ) : null}
      </div>

      {/* === ARROW pointing up to thumbnail === */}
      <div style={{
        position: 'absolute', top: hasPromoClip ? 1020 : 980, left: '50%',
        transform: `translateX(-50%) translateY(${arrowBounce}px)`,
        opacity: ctaEntry,
      }}>
        <div style={{fontSize: 48, color: accentColor, textAlign: 'center', textShadow: `0 0 20px ${accentColor}66`}}>
          ↑
        </div>
        <p style={{fontSize: 20, fontWeight: 800, color: accentColor, textAlign: 'center', letterSpacing: 1}}>
          WATCH FULL VIDEO
        </p>
      </div>

      {/* === BOTTOM: Promo clip OR CTA card === */}
      {hasPromoClip ? (
        <div style={{
          position: 'absolute', bottom: 160, left: 80, right: 80,
          borderRadius: 20, overflow: 'hidden', height: 360,
          border: '3px solid rgba(255,255,255,0.12)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        }}>
          <OffthreadVideo
            src={mediaSrc}
            startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
            volume={sourceAudioVolume}
          />
        </div>
      ) : (
        <div style={{
          position: 'absolute', bottom: 180, left: 60, right: 60,
          textAlign: 'center', opacity: ctaEntry,
        }}>
          {/* CTA button */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '22px 44px', borderRadius: 50,
            background: accentColor, color: '#fff',
            fontSize: 32, fontWeight: 900, letterSpacing: 0.5,
            boxShadow: `0 8px 32px ${accentColor}55`,
            transform: `scale(${ctaPulse})`,
          }}>
            ▶ {ctaText}
          </div>
          <p style={{marginTop: 16, fontSize: 22, fontWeight: 600, color: 'rgba(255,255,255,0.4)'}}>
            Link in bio
          </p>
        </div>
      )}

      {/* Caption overlay */}
      {captions.length > 0 ? (() => {
        const time = frame / fps;
        const active = captions.find((c) => time >= Number(c.start ?? 0) && time < Number(c.end ?? 999));
        if (!active?.text) return null;
        return (
          <div style={{
            position: 'absolute', bottom: hasPromoClip ? 120 : 100, left: 48, right: 48,
            textAlign: 'center', zIndex: 15,
          }}>
            <div style={{
              display: 'inline-block', padding: '12px 24px', borderRadius: 12,
              background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
            }}>
              <span style={{fontSize: 28, fontWeight: 700, color: '#fff'}}>{active.text}</span>
            </div>
          </div>
        );
      })() : null}

      {/* Vignette */}
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.4) 100%)'}} />
    </AbsoluteFill>
  );
}

const defaultProps: LongVideoPromoProps = {
  thumbnailSrc: '',
  title: 'Complete Guide to Domain & Hosting',
  subtitle: 'Everything explained step by step',
  ctaText: 'Full video on YouTube →',
  channelName: 'Tech With Ali',
  subscriberCount: '125K',
  mediaSrc: '',
  mediaType: 'video',
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,
  chips: ['NEW VIDEO', 'FULL GUIDE'],
  accentColor: '#FF0050',
  durationSeconds: 30,
  sourceDurationSeconds: 30,
  captions: [],
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
