import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type CaptionWord = {
  word?: string;
  text?: string;
  start?: number;
  end?: number;
};

type CaptionItem = {
  text?: string;
  start?: number;
  end?: number;
  words?: CaptionWord[];
};

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
  captions?: CaptionItem[];
};

const W = 1080;
const H = 1920;
const SIDE = 28;
const VIDEO_W = W - SIDE * 2;
const VIDEO_H = Math.round((VIDEO_W * 9) / 16); // ~576

const VIDEO_Y = 20;
const SUBTITLE_Y = VIDEO_Y + VIDEO_H + 18;
const SUBTITLE_H = 140;
const TITLE_Y = SUBTITLE_Y + SUBTITLE_H + 10;
const TITLE_H = 100;
const IMAGE_Y = TITLE_Y + TITLE_H + 10;
const IMAGE_BOTTOM = 20;

const cleanText = (value?: string) =>
  String(value || '').replace(/\s+/g, ' ').trim();

const getCaptionText = (captions: CaptionItem[] | undefined, time: number) => {
  const list = Array.isArray(captions) ? captions : [];
  const active = list.find((item) => {
    const start = Number(item.start ?? 0);
    const end = Number(item.end ?? start + 2.5);
    return time >= start && time <= end;
  }) || list[0];

  const textFromWords = active?.words
    ?.map((word) => cleanText(word.word || word.text))
    .filter(Boolean)
    .join(' ');

  return cleanText(active?.text || textFromWords || '');
};

const breakSubtitle = (text: string): string[] => {
  const words = text.split(' ').filter(Boolean).slice(0, 12);
  if (words.length <= 5) return [words.join(' ')];
  return [words.slice(0, 6).join(' '), words.slice(6, 12).join(' ')];
};

export function VideoSimpleExplainer({
  title,
  topicTitle,
  mediaSrc,
  mediaType,
  sourceAudioUrl,
  audioSrc,
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  explanationImageUrl,
  bottomImageUrl,
  captions,
}: Props) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;

  const displayTitle = cleanText(title || topicTitle || 'Video Explainer').toUpperCase().slice(0, 50);
  const subtitleText = getCaptionText(captions, time);
  const imageUrl = explanationImageUrl || bottomImageUrl;
  const isVideo = mediaType === 'video' || Boolean(mediaSrc);

  const videoEnter = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const subtitlePop = subtitleText
    ? interpolate(frame % 90, [0, 8, 90], [0.97, 1, 0.97], {extrapolateRight: 'clamp'})
    : 1;

  return (
    <AbsoluteFill style={{backgroundColor: '#08080c', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"}}>
      {/* Ambient top glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 300,
          background: 'radial-gradient(ellipse 80% 100% at 50% -20%, rgba(99,102,241,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ─── CREATOR VIDEO ─── */}
      <div
        style={{
          position: 'absolute',
          left: SIDE,
          top: VIDEO_Y,
          width: VIDEO_W,
          height: VIDEO_H,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#111118',
          border: '2px solid rgba(255,255,255,0.06)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          opacity: videoEnter,
        }}
      >
        {isVideo && mediaSrc ? (
          <OffthreadVideo
            src={mediaSrc}
            startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
            volume={sourceAudioVolume}
          />
        ) : null}

        {!isVideo && mediaSrc ? (
          <Audio src={mediaSrc} volume={sourceAudioVolume} />
        ) : null}

        {!isVideo && (sourceAudioUrl || audioSrc) ? (
          <Audio src={sourceAudioUrl || audioSrc || ''} volume={sourceAudioVolume} />
        ) : null}

        {!mediaSrc ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #0f172a 100%)',
              color: 'rgba(255,255,255,0.2)',
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: 4,
            }}
          >
            CREATOR VIDEO
          </div>
        ) : null}

        {/* Progress bar at bottom of video */}
        <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(0,0,0,0.5)'}}>
          <div style={{height: '100%', width: `${Math.min(100, (time / 60) * 100)}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: 2}} />
        </div>
      </div>

      {/* ─── SUBTITLE STRIP ─── */}
      <div
        style={{
          position: 'absolute',
          left: SIDE,
          right: SIDE,
          top: SUBTITLE_Y,
          height: SUBTITLE_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {subtitleText ? (
          <div
            style={{
              width: '100%',
              padding: '20px 36px',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 45%, #a855f7 100%)',
              boxShadow: '0 14px 40px rgba(99,102,241,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
              textAlign: 'center',
              transform: `scale(${subtitlePop})`,
            }}
          >
            {breakSubtitle(subtitleText).map((line, i) => (
              <div
                key={`${line}-${i}`}
                style={{
                  color: '#ffffff',
                  fontSize: line.length > 30 ? 40 : 46,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: -0.3,
                  textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                {line}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 18,
              background: 'rgba(99,102,241,0.04)',
              border: '1.5px dashed rgba(99,102,241,0.15)',
            }}
          />
        )}
      </div>

      {/* ─── TITLE STRIP with brush highlight ─── */}
      <div
        style={{
          position: 'absolute',
          left: SIDE,
          right: SIDE,
          top: TITLE_Y,
          height: TITLE_H,
          borderRadius: 14,
          background: '#0c0c12',
          border: '1.5px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 32px',
          overflow: 'hidden',
        }}
      >
        {/* Brush stroke */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-0.5deg)',
            width: '80%',
            height: 46,
            borderRadius: '6px 16px 8px 12px',
            background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 35%, #f59e0b 70%, #d97706 100%)',
            opacity: 0.9,
            clipPath: 'polygon(2% 18%, 7% 5%, 15% 12%, 25% 3%, 35% 9%, 46% 2%, 57% 7%, 68% 3%, 78% 11%, 88% 5%, 95% 10%, 100% 35%, 99% 62%, 96% 88%, 89% 95%, 78% 92%, 65% 98%, 52% 94%, 38% 100%, 24% 93%, 12% 98%, 4% 88%, 0% 60%, 1% 32%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -48%) rotate(0.3deg)',
            width: '76%',
            height: 40,
            background: 'linear-gradient(90deg, #fbbf24, #fde68a 50%, #fbbf24)',
            opacity: 0.35,
            filter: 'blur(1px)',
            clipPath: 'polygon(3% 20%, 10% 6%, 20% 14%, 32% 4%, 44% 12%, 56% 3%, 66% 10%, 76% 5%, 86% 14%, 94% 7%, 100% 32%, 98% 68%, 93% 90%, 82% 96%, 68% 92%, 52% 100%, 36% 94%, 20% 100%, 8% 88%, 0% 58%)',
          }}
        />
        <span
          style={{
            position: 'relative',
            zIndex: 2,
            fontSize: displayTitle.length > 28 ? 30 : 36,
            fontWeight: 900,
            letterSpacing: 1.5,
            lineHeight: 1,
            color: '#0c0c12',
            textAlign: 'center',
            textTransform: 'uppercase',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {displayTitle}
        </span>
      </div>

      {/* ─── BOTTOM EXPLANATION IMAGE ─── */}
      <div
        style={{
          position: 'absolute',
          left: SIDE,
          right: SIDE,
          top: IMAGE_Y,
          bottom: IMAGE_BOTTOM,
          borderRadius: 20,
          overflow: 'hidden',
          background: '#ffffff',
          border: '2px solid rgba(255,255,255,0.06)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #6366f1, #a855f7, #06b6d4)',
          }}
        />

        {imageUrl ? (
          <Img
            src={imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              padding: 48,
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            Upload one image for visual explanation
          </div>
        )}
      </div>

      {/* Bottom ambient glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(45,212,191,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
}

export default VideoSimpleExplainer;
