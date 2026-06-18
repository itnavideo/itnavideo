import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type CaptionWord = { word?: string; text?: string; start?: number; end?: number; };
type CaptionItem = { text?: string; start?: number; end?: number; words?: CaptionWord[]; };
type Props = { title?: string; topicTitle?: string; mediaSrc?: string; mediaType?: 'audio' | 'video' | string; sourceAudioUrl?: string; audioSrc?: string; mediaTrimStartSeconds?: number; sourceAudioVolume?: number; explanationImageUrl?: string; bottomImageUrl?: string; captions?: CaptionItem[]; };

const W = 1080;
const H = 1920;

const cleanText = (value?: string) => String(value || '').replace(/\s+/g, ' ').trim();

const getCaptionAtTime = (captions: CaptionItem[] | undefined, time: number) => {
  const list = Array.isArray(captions) ? captions : [];
  return list.find((item) => {
    const start = Number(item.start ?? 0);
    const end = Number(item.end ?? start + 2.5);
    return time >= start && time <= end;
  }) || list[0];
};

const breakSubtitle = (text: string): string[] => {
  const words = text.split(' ').filter(Boolean).slice(0, 12);
  if (words.length <= 5) return [words.join(' ')];
  return [words.slice(0, 6).join(' '), words.slice(6, 12).join(' ')];
};

export function VideoSimpleExplainer({
  title, topicTitle, mediaSrc, mediaType, sourceAudioUrl, audioSrc, mediaTrimStartSeconds = 0, sourceAudioVolume = 1, explanationImageUrl, bottomImageUrl, captions,
}: Props) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const time = frame / fps;
  const progress = frame / Math.max(1, durationInFrames - 1);

  const displayTitle = cleanText(title || topicTitle || 'Video Explainer').toUpperCase().slice(0, 45);
  const activeCaption = getCaptionAtTime(captions, time);
  const subtitleText = cleanText(
    activeCaption?.text ||
    activeCaption?.words?.map((w) => cleanText(w.word || w.text)).filter(Boolean).join(' ') ||
    ''
  );
  const imageUrl = explanationImageUrl || bottomImageUrl;
  const isVideo = mediaType === 'video' || Boolean(mediaSrc);

  // 🎬 --- NEW ENGAGING ANIMATIONS --- 🎬
  
  // 1. Smooth video scale-in
  const videoScale = spring({ fps, frame, config: { damping: 14, mass: 0.8 } });
  
  // 2. Cinematic Ken Burns slow zoom for the bottom image
  const imageZoom = interpolate(frame, [0, durationInFrames], [1, 1.15]);
  
  // 3. Title pop and dynamic marker draw effect
  const titlePop = spring({ fps, frame: frame - 10, config: { damping: 12 } });
  const markerDraw = spring({ fps, frame: frame - 15, config: { damping: 14 } });
  
  // 4. Subtitle subtle floating animation
  const floatY = Math.sin(frame / 15) * 4;

  return (
    <AbsoluteFill style={{backgroundColor: '#000000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"}}>
      
      {/* ═══ TOP: CREATOR VIDEO ═══ */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, width: W, height: 620,
          overflow: 'hidden', backgroundColor: '#0a0a0a',
          transform: `scale(${interpolate(videoScale, [0, 1], [0.92, 1])})`,
          transformOrigin: 'top center',
          borderBottom: '4px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          zIndex: 5,
        }}
      >
        {isVideo && mediaSrc ? (
          <OffthreadVideo src={mediaSrc} startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))} style={{width: '100%', height: '100%', objectFit: 'cover'}} volume={sourceAudioVolume} />
        ) : null}
        {!isVideo && mediaSrc ? <Audio src={mediaSrc} volume={sourceAudioVolume} /> : null}
        {!isVideo && (sourceAudioUrl || audioSrc) ? <Audio src={sourceAudioUrl || audioSrc || ''} volume={sourceAudioVolume} /> : null}
        
        {/* Subtle vignette for depth */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.4) 150%)', pointerEvents: 'none' }} />
      </div>

      {/* ═══ BOTTOM: EXPLANATION IMAGE (Ken Burns) ═══ */}
      <div
        style={{
          position: 'absolute', top: 620, left: 0, width: W, bottom: 0,
          backgroundColor: '#111', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {imageUrl ? (
          <Img
            src={imageUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${imageZoom})`, transformOrigin: 'center center' }}
          />
        ) : (
          <div style={{ color: '#555', fontSize: 32, fontWeight: 700 }}>IMAGE GOES HERE</div>
        )}
        
        {/* Cinematic dark gradients for text readability */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 350, background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }} />
      </div>

      {/* ═══ MIDDLE: TITLE BAR ═══ */}
      <div
        style={{
          position: 'absolute', top: 560, left: 0, width: W, height: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 48px',
          transform: `scale(${titlePop})`,
          zIndex: 10,
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Animated Highlight Marker */}
          <div
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%) rotate(-1deg)',
              width: `${markerDraw * 105}%`,
              height: 56,
              background: 'linear-gradient(90deg, #facc15 0%, #fde047 50%, #eab308 100%)',
              borderRadius: '8px 16px 10px 12px',
              opacity: 0.95,
              boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)',
            }}
          />
          <span
            style={{
              position: 'relative', zIndex: 2,
              fontSize: displayTitle.length > 28 ? 36 : 42,
              fontWeight: 900, letterSpacing: 1.5, color: '#000000',
              textAlign: 'center', textTransform: 'uppercase',
              whiteSpace: 'nowrap', padding: '0 15px',
            }}
          >
            {displayTitle}
          </span>
        </div>
      </div>

      {/* ═══ OVERLAY: SUBTITLES (Glassmorphism & Float) ═══ */}
      <div
        style={{
          position: 'absolute', top: 730, left: 0, width: W,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 50px',
          transform: `translateY(${floatY}px)`,
          zIndex: 15,
        }}
      >
        {subtitleText ? (
          <div
            style={{
              width: '100%', padding: '24px 40px', borderRadius: 24,
              background: 'rgba(20, 20, 20, 0.65)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
              textAlign: 'center',
            }}
          >
            {breakSubtitle(subtitleText).map((line, i) => (
              <div
                key={`${line}-${i}`}
                style={{
                  color: '#ffffff',
                  fontSize: line.length > 28 ? 40 : 48,
                  fontWeight: 800, lineHeight: 1.25,
                  textShadow: '0 4px 12px rgba(0,0,0,0.8)',
                  background: 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {line}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* ═══ PROGRESS BAR ═══ */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 20 }}>
        <div style={{ height: '100%', width: `${Math.min(100, progress * 100)}%`, background: 'linear-gradient(90deg, #facc15, #ff007a)', borderRadius: '0 4px 4px 0', boxShadow: '0 0 10px rgba(250,204,21,0.5)' }} />
      </div>
    </AbsoluteFill>
  );
}

export default VideoSimpleExplainer;
