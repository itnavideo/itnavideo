import {
  AbsoluteFill,
  Composition,
  Img,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from 'remotion';

type BackgroundFit = 'cover' | 'contain';

type CreatorBackgroundReplaceProps = {
  mediaSrc?: string;
  creatorSrc?: string;
  processedCreatorSrc?: string;
  backgroundImageSrc?: string;
  backgroundFit?: BackgroundFit;
  backgroundScale?: number;
  backgroundX?: number;
  backgroundY?: number;
  creatorScale?: number;
  creatorX?: number;
  creatorY?: number;
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
};

const resolveUrl = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

const finite = (value: unknown, fallback: number) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

function CreatorBackgroundReplace({
  mediaSrc = '',
  creatorSrc,
  processedCreatorSrc,
  backgroundImageSrc = '',
  backgroundFit = 'cover',
  backgroundScale = 1,
  backgroundX = 0,
  backgroundY = 0,
  creatorScale = 1,
  creatorX = 0,
  creatorY = 0,
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
}: CreatorBackgroundReplaceProps) {
  const {fps} = useVideoConfig();
  const videoSrc = resolveUrl(processedCreatorSrc || creatorSrc || mediaSrc);
  const backgroundSrc = resolveUrl(backgroundImageSrc);

  return (
    <AbsoluteFill style={{backgroundColor: '#0B1120', overflow: 'hidden'}}>
      {backgroundSrc ? (
        <Img
          src={backgroundSrc}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: backgroundFit === 'contain' ? 'contain' : 'cover',
            transform: `translate(${finite(backgroundX, 0)}px, ${finite(backgroundY, 0)}px) scale(${finite(backgroundScale, 1)})`,
            transformOrigin: 'center',
          }}
        />
      ) : null}

      {videoSrc ? (
        <OffthreadVideo
          src={videoSrc}
          startFrom={Math.round(finite(mediaTrimStartSeconds, 0) * fps)}
          volume={finite(sourceAudioVolume, 1)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: `translate(${finite(creatorX, 0)}px, ${finite(creatorY, 0)}px) scale(${finite(creatorScale, 1)})`,
            transformOrigin: 'center bottom',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
}

export {CreatorBackgroundReplace};

export const CreatorBackgroundReplaceComposition = () => (
  <Composition
    id="CREATOR-BACKGROUND-REPLACE"
    component={CreatorBackgroundReplace}
    durationInFrames={1800}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      mediaSrc: '',
      backgroundImageSrc: '',
      backgroundFit: 'cover',
      backgroundScale: 1,
      backgroundX: 0,
      backgroundY: 0,
      creatorScale: 1,
      creatorX: 0,
      creatorY: 0,
      sourceAudioVolume: 1,
      durationSeconds: 60,
    } as CreatorBackgroundReplaceProps}
    calculateMetadata={({props}) => {
      const p = props as CreatorBackgroundReplaceProps;
      const duration = Math.max(1, Math.min(60, Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || 60));
      return {durationInFrames: Math.ceil(duration * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
