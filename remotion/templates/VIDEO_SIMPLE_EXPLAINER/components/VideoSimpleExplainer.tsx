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

const SIDE = 26;
const TOP = 58;
const VIDEO_W = W - SIDE * 2;
const VIDEO_H = Math.round((VIDEO_W * 9) / 16);

const GAP_AFTER_VIDEO = 58;
const SUBTITLE_H = 116;
const TITLE_H = 118;

const VIDEO_Y = TOP;
const SUBTITLE_Y = VIDEO_Y + VIDEO_H + GAP_AFTER_VIDEO;
const TITLE_Y = SUBTITLE_Y + SUBTITLE_H;
const IMAGE_Y = TITLE_Y + TITLE_H;
const IMAGE_H = H - IMAGE_Y;

const cleanText = (value?: string) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

const getCaptionText = (captions: CaptionItem[] | undefined, time: number) => {
  const list = Array.isArray(captions) ? captions : [];
  const active =
    list.find((item) => {
      const start = Number(item.start ?? 0);
      const end = Number(item.end ?? start + 2.5);
      return time >= start && time <= end;
    }) || list[0];

  const textFromWords = active?.words
    ?.map((word) => cleanText(word.word || word.text))
    .filter(Boolean)
    .join(' ');

  return cleanText(active?.text || textFromWords || 'Subtitles apply here...');
};

const splitSubtitle = (text: string) => {
  const words = cleanText(text).split(' ').filter(Boolean);
  if (words.length <= 6) return text.toUpperCase();
  return words.slice(0, 7).join(' ').toUpperCase();
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

  const displayTitle = cleanText(title || topicTitle || 'Video Title Here').toUpperCase();
  const subtitle = splitSubtitle(getCaptionText(captions, time));
  const imageUrl = explanationImageUrl || bottomImageUrl;
  const isVideo = mediaType === 'video' || Boolean(mediaSrc);

  const videoOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleScale = interpolate(frame % 45, [0, 7, 45], [0.985, 1, 0.985], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, Arial, sans-serif'}}>
      {/* TOP USER VIDEO */}
      <div
        style={{
          position: 'absolute',
          left: SIDE,
          top: VIDEO_Y,
          width: VIDEO_W,
          height: VIDEO_H,
          overflow: 'hidden',
          backgroundColor: '#050505',
          border: '4px solid rgba(255,255,255,0.96)',
          opacity: videoOpacity,
        }}
      >
        {isVideo && mediaSrc ? (
          <OffthreadVideo
            src={mediaSrc}
            startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            volume={sourceAudioVolume}
          />
        ) : mediaSrc ? (
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
              color: 'white',
              fontSize: 42,
              fontWeight: 900,
              letterSpacing: 2,
              background: 'linear-gradient(135deg,#1f2937,#020617)',
            }}
          >
            USER VIDEO
          </div>
        ) : null}
      </div>

      {/* GRADIENT SUBTITLE STRIP */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: SUBTITLE_Y,
          width: W,
          height: SUBTITLE_H,
          background: 'linear-gradient(90deg,#5967ff 0%, #8a63ff 42%, #ff62bf 100%)',
          borderTop: '4px solid #fff24a',
          borderBottom: '4px solid #fff24a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 70px',
          transform: `scale(${subtitleScale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.18), transparent 36%, rgba(255,255,255,0.12))',
          }}
        />
        <div
          style={{
            position: 'relative',
            color: '#fff',
            fontSize: subtitle.length > 34 ? 50 : 62,
            lineHeight: 1,
            fontWeight: 1000,
            letterSpacing: 2,
            textAlign: 'center',
            textTransform: 'uppercase',
            textShadow: '0 6px 0 rgba(0,0,0,0.25), 0 14px 28px rgba(0,0,0,0.35)',
            maxWidth: 950,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* BLACK TITLE STRIP */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: TITLE_Y,
          width: W,
          height: TITLE_H,
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: displayTitle.length > 24 ? 52 : 64,
            lineHeight: 1,
            fontWeight: 1000,
            letterSpacing: 4,
            textAlign: 'center',
            textTransform: 'uppercase',
            textShadow: '0 5px 0 rgba(255,255,255,0.08)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 940,
          }}
        >
          {displayTitle}
        </div>
      </div>

      {/* BOTTOM USER EXPLANATION IMAGE - NO BACKGROUND DESIGN */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: IMAGE_Y,
          width: W,
          height: IMAGE_H,
          backgroundColor: '#000',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {imageUrl ? (
          <Img
            src={imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center center',
              backgroundColor: '#000',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#111',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 60,
              fontSize: 44,
              fontWeight: 900,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Bottom explanation image
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

export default VideoSimpleExplainer;
