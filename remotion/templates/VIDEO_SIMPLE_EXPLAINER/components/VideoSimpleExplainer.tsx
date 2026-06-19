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
type Props = { 
  title?: string; 
  topicTitle?: string; 
  mediaSrc?: string; 
  mediaType?: 'audio' | 'video' | string; 
  sourceAudioUrl?: string; 
  audioSrc?: string; 
  mediaTrimStartSeconds?: number; 
  sourceAudioVolume?: number; 
  explanationImageUrl?: string; 
  bottomImageUrl?: string; 
  bottomImages?: string[]; // NEW: Array of images
  captions?: CaptionItem[]; 
};

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

export function VideoSimpleExplainer({
  title, topicTitle, mediaSrc, mediaType, sourceAudioUrl, audioSrc, mediaTrimStartSeconds = 0, sourceAudioVolume = 1, explanationImageUrl, bottomImageUrl, bottomImages, captions,
}: Props) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const time = frame / fps;
  const progress = frame / Math.max(1, durationInFrames - 1);

  const displayTitle = cleanText(title || topicTitle || 'Video Explainer').toUpperCase().slice(0, 45);
  const activeCaption = getCaptionAtTime(captions, time);
  const isVideo = mediaType === 'video' || Boolean(mediaSrc);

  // Fallback if user only provided 1 old image vs multiple new ones
  const imagesList = bottomImages && bottomImages.length > 0 
    ? bottomImages 
    : [explanationImageUrl || bottomImageUrl].filter(Boolean) as string[];

  // 1. Smooth video scale-in
  const videoScale = spring({ fps, frame, config: { damping: 14, mass: 0.8 } });
  
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
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.4) 150%)', pointerEvents: 'none' }} />
      </div>

      {/* ═══ BOTTOM: DYNAMIC B-ROLL CAROUSEL ═══ */}
      <div
        style={{
          position: 'absolute', top: 620, left: 0, width: W, bottom: 0,
          backgroundColor: '#111', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {imagesList.length > 0 ? (
          imagesList.map((img, index) => {
            // Auto-calculate timing for each image
            const durationPerImage = durationInFrames / imagesList.length;
            const startFrame = index * durationPerImage;
            const endFrame = startFrame + durationPerImage;
            
            // Crossfade logic: fade in for 15 frames, fade out for 15 frames
            const opacity = interpolate(
              frame,
              [startFrame - 15, startFrame, endFrame - 15, endFrame],
              [0, 1, 1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            // Independent Ken Burns for EACH image so it starts moving exactly when it appears
            const localFrame = Math.max(0, frame - startFrame);
            const imageZoom = interpolate(localFrame, [0, durationPerImage], [1, 1.15], { extrapolateRight: 'clamp' });
            const imagePanX = index % 2 === 0 
              ? interpolate(localFrame, [0, durationPerImage], [0, -40], { extrapolateRight: 'clamp' }) // Pan left
              : interpolate(localFrame, [0, durationPerImage], [-40, 0], { extrapolateRight: 'clamp' }); // Pan right

            return (
              <Img
                key={`${img}-${index}`}
                src={img}
                style={{ 
                  position: 'absolute',
                  width: '100%', height: '100%', objectFit: 'cover', 
                  opacity,
                  transform: `scale(${imageZoom}) translateX(${imagePanX}px)`, 
                  transformOrigin: 'center center' 
                }}
              />
            );
          })
        ) : (
          <div style={{ color: '#555', fontSize: 32, fontWeight: 700 }}>IMAGES GO HERE</div>
        )}
        
        {/* Cinematic dark gradients for text readability */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 350, background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 300, background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)' }} />
      </div>

      {/* ═══ MIDDLE: TITLE BAR ═══ */}
      <div
        style={{
          position: 'absolute', top: 560, left: 0, width: W, height: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 48px',
          transform: `scale(${titlePop})`, zIndex: 10,
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-1deg)', width: `${markerDraw * 105}%`, height: 56, background: 'linear-gradient(90deg, #facc15 0%, #fde047 50%, #eab308 100%)', borderRadius: '8px 16px 10px 12px', opacity: 0.95, boxShadow: '0 4px 20px rgba(250, 204, 21, 0.5)' }} />
          <span style={{ position: 'relative', zIndex: 2, fontSize: displayTitle.length > 28 ? 36 : 42, fontWeight: 900, letterSpacing: 1.5, color: '#000000', textAlign: 'center', textTransform: 'uppercase', whiteSpace: 'nowrap', padding: '0 15px' }}>
            {displayTitle}
          </span>
        </div>
      </div>

      {/* ═══ OVERLAY: VIRAL SUBTITLES ═══ */}
      <div
        style={{
          position: 'absolute', top: 760, left: 0, width: W,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 50px',
          transform: `translateY(${floatY}px)`, zIndex: 15,
        }}
      >
        {activeCaption ? (
          <div style={{ width: '100%', padding: '30px 40px', borderRadius: 24, background: 'rgba(10, 10, 10, 0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            {activeCaption.words && activeCaption.words.length > 0 ? (
              activeCaption.words.map((w, i) => {
                const wordText = cleanText(w.word || w.text);
                if (!wordText) return null;
                const isActive = time >= (w.start || 0) && time <= (w.end || 0);
                return (
                  <span key={`${wordText}-${i}`} style={{ fontSize: 48, fontWeight: 900, textTransform: 'uppercase', color: isActive ? '#fde047' : '#ffffff', transform: isActive ? 'scale(1.15) translateY(-4px)' : 'scale(1)', transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)', textShadow: isActive ? '0 0 20px rgba(253, 224, 71, 0.6)' : '0 4px 12px rgba(0,0,0,0.8)' }}>
                    {wordText}
                  </span>
                );
              })
            ) : (
               <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
                 {cleanText(activeCaption.text)}
               </span>
            )}
          </div>
        ) : null}
      </div>

      {/* ═══ PROGRESS BAR ═══ */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 10, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 20 }}>
        <div style={{ height: '100%', width: `${Math.min(100, progress * 100)}%`, background: 'linear-gradient(90deg, #fde047, #f59e0b, #ef4444)', borderRadius: '0 4px 4px 0', boxShadow: '0 0 15px rgba(245,158,11,0.6)' }} />
      </div>
    </AbsoluteFill>
  );
}

export default VideoSimpleExplainer;
