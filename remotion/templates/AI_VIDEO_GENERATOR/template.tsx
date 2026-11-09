import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import { UniversalCaptionLayer, CaptionChunk } from '../../components/library/UniversalCaptionLayer';

export interface AiVideoGeneratorSceneProp {
  id: string;
  startSeconds: number;
  endSeconds: number;
  duration?: number;
  title?: string;
  narration?: string;
  visualDescription?: string;
  cameraMotion?: 'ken-burns-in' | 'ken-burns-out' | 'pan-left' | 'pan-right' | 'static';
  transition?: 'cut' | 'dissolve' | 'wipe-left';
  mediaUrl: string;
  mediaType?: 'image' | 'video';
  isLocked?: boolean;
}

export interface AiVideoGeneratorTemplateProps {
  scenes?: AiVideoGeneratorSceneProp[];
  captions?: CaptionChunk[];
  audioUrl?: string;
  bgmUrl?: string;
  bgmVolume?: number;
  durationSeconds?: number;
  captionThemeId?: string;
  title?: string;
  aspectRatio?: '16:9';
}

const DEFAULT_SAMPLE_SCENES: AiVideoGeneratorSceneProp[] = [
  {
    id: 's1',
    startSeconds: 0,
    endSeconds: 5,
    title: 'The AI Revolution',
    narration: 'Artificial intelligence is reshaping video storytelling faster than ever before.',
    cameraMotion: 'ken-burns-in',
    mediaUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793807678/itnavideo12345/blog_podcaster_new_york.png',
  },
  {
    id: 's2',
    startSeconds: 5,
    endSeconds: 10,
    title: 'Dynamic Production',
    narration: 'From automated script beats to kinetic subtitles and scene pacing in seconds.',
    cameraMotion: 'pan-right',
    mediaUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793807713/itnavideo12345/blog_video_producer_studio.png',
  },
  {
    id: 's3',
    startSeconds: 10,
    endSeconds: 15,
    title: 'Creator Empowerment',
    narration: 'Produce broadcast-grade 1080p content straight from your browser with zero hassle.',
    cameraMotion: 'ken-burns-out',
    mediaUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793807603/itnavideo12345/blog_youtube_creator_usa.png',
  },
];

const DEFAULT_SAMPLE_CAPTIONS: CaptionChunk[] = [
  {
    text: 'Artificial intelligence is reshaping video storytelling faster than ever before.',
    start: 0,
    end: 5,
  },
  {
    text: 'From automated script beats to kinetic subtitles and scene pacing in seconds.',
    start: 5,
    end: 10,
  },
  {
    text: 'Produce broadcast-grade 1080p content straight from your browser with zero hassle.',
    start: 10,
    end: 15,
  },
];

export const AiVideoGeneratorTemplate: React.FC<AiVideoGeneratorTemplateProps> = ({
  scenes = DEFAULT_SAMPLE_SCENES,
  captions = DEFAULT_SAMPLE_CAPTIONS,
  audioUrl,
  bgmUrl = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/parasail-silent-partner.mp3',
  bgmVolume = 0.35,
  durationSeconds = 15,
  captionThemeId = 'pop-word',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      {/* 1. Scenes Sequence with Smooth Cinematography */}
      {scenes.map((scene, idx) => {
        const fromFrame = Math.round(scene.startSeconds * fps);
        const toFrame = Math.round(scene.endSeconds * fps);
        const durationInFrames = Math.max(1, toFrame - fromFrame);

        return (
          <Sequence
            key={scene.id || `scene-${idx}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SceneRenderer scene={scene} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}

      {/* 2. Kinetic Caption Layer */}
      {captions && captions.length > 0 && (
        <UniversalCaptionLayer
          chunks={captions}
          captionThemeId={captionThemeId}
          position="bottom"
          styleOverrides={{ bottom: 64 }}
        />
      )}

      {/* 3. Spoken Voiceover Narration Track */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* 4. Background Music Track */}
      {bgmUrl && bgmUrl !== 'none' && (
        <Audio
          src={bgmUrl}
          volume={(f) => {
            const totalFrames = Math.round(durationSeconds * fps);
            // Gentle fade-in over 1s and fade-out over 2s
            const fadeIn = interpolate(f, [0, fps], [0, bgmVolume], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const fadeOut = interpolate(f, [totalFrames - fps * 2, totalFrames], [bgmVolume, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return Math.min(fadeIn, fadeOut);
          }}
        />
      )}
    </AbsoluteFill>
  );
};

interface SceneRendererProps {
  scene: AiVideoGeneratorSceneProp;
  durationInFrames: number;
}

const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, durationInFrames }) => {
  const frame = useCurrentFrame();

  // Camera Motion Interpolations
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  switch (scene.cameraMotion) {
    case 'ken-burns-in':
      scale = interpolate(frame, [0, durationInFrames], [1.0, 1.14], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    case 'ken-burns-out':
      scale = interpolate(frame, [0, durationInFrames], [1.14, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    case 'pan-left':
      scale = 1.1;
      translateX = interpolate(frame, [0, durationInFrames], [30, -30], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    case 'pan-right':
      scale = 1.1;
      translateX = interpolate(frame, [0, durationInFrames], [-30, 30], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    case 'static':
    default:
      scale = 1.0;
      break;
  }

  // Crossfade opacity on scene start
  const opacity = interpolate(frame, [0, 8], [0.6, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0B0E17' }}>
      <Img
        src={scene.mediaUrl}
        alt={scene.title || 'Scene Visual'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          opacity,
        }}
      />
      {/* Subtle cinematic gradient vignette for subtitle readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 30%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export const AiVideoGeneratorComposition: React.FC = () => {
  return (
    <Composition
      id="AI-VIDEO-GENERATOR"
      component={AiVideoGeneratorTemplate}
      durationInFrames={secondsToFrames(15, DEFAULT_FPS)}
      fps={DEFAULT_FPS}
      width={1920}
      height={1080}
      defaultProps={{
        durationSeconds: 15,
        title: 'AI Video Generator Master Preview',
        aspectRatio: '16:9',
      }}
    />
  );
};
