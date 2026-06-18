import React from 'react';
import { 
  AbsoluteFill, 
  Audio,
  staticFile,
  Sequence, 
  interpolate, 
  useCurrentFrame, 
  useVideoConfig, 
  Img,
  spring,
  Composition
} from 'remotion';

interface Scene {
  start: number;
  end: number;
  text: string;
  imageUrl: string;
  // Mapping with ReelImageStoryMotionType from reelPlanner.ts
  animation: 'slowZoomIn' | 'slowZoomOut' | 'panLeft' | 'panRight' | 'panUp' | 'panDown' | 'parallax' | 'pushIn' | 'reveal' | 'fade';
  overlayImageUrl?: string;
  overlayPosition?: { top?: string; left?: string; right?: string; bottom?: string; rotate?: string; width?: string };
}

export const ImageStoryCollage: React.FC<{
  scenes: Scene[];
  audioUrl: string;
  language?: string;
}> = ({ scenes, audioUrl, language = 'en' }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-[#0a0a0a]">
      {/* Main Narrative Voiceover */}
      {audioUrl ? <Audio src={audioUrl} /> : null}

      {/* Cinematic Background Texture */}
      <div className="absolute inset-0 opacity-20 grayscale bg-[url('/visuals/textures/paper-grain.png')]" />

      {scenes.map((scene, i) => {
        const sceneStartFrame = scene.start * fps;
        const sceneEndFrame = scene.end * fps;
        const duration = sceneEndFrame - sceneStartFrame;
        
        return (
          <Sequence 
            key={i} 
            from={sceneStartFrame} 
            durationInFrames={duration}
          >
            {/* SFX: Transition sounds */}
            {/* Only render if files exist */}

            <SceneLayer scene={scene} language={language} durationInFrames={duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneLayer: React.FC<{ scene: Scene; language: string; durationInFrames: number }> = ({ scene, language, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isRtl = ['ur', 'ar', 'fa'].includes(language);
  
  let scale = 1;
  let panX = 0;
  let panY = 0;

  // Dynamic Ken Burns Effect based on scene.animation
  if (scene.animation === 'slowZoomIn') {
    scale = interpolate(frame, [0, durationInFrames], [1, 1.15], { extrapolateRight: 'clamp' });
  } else if (scene.animation === 'slowZoomOut') {
    scale = interpolate(frame, [0, durationInFrames], [1.15, 1], { extrapolateRight: 'clamp' });
  } else if (scene.animation === 'panLeft') {
    panX = interpolate(frame, [0, durationInFrames], [0, -10], { extrapolateRight: 'clamp' });
  } else if (scene.animation === 'panRight') {
    panX = interpolate(frame, [0, durationInFrames], [0, 10], { extrapolateRight: 'clamp' });
  } else if (scene.animation === 'panUp') {
    panY = interpolate(frame, [0, durationInFrames], [0, -10], { extrapolateRight: 'clamp' });
  } else if (scene.animation === 'panDown') {
    panY = interpolate(frame, [0, durationInFrames], [0, 10], { extrapolateRight: 'clamp' });
  }
  // For 'parallax', 'pushIn', 'reveal', 'fade', default scale/pan (no motion) is used unless specific logic is added.

  // Entrance Animation
  const textEntrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.5 }, // Snappier text entrance
  });
  const textTranslateY = interpolate(frame, [0, 10], [20, 0], { // Text slides up slightly
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill className="flex items-center justify-center p-10">
      {/* Image with Cinematic Motion */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ transform: `scale(${scale}) translateX(${panX}%) translateY(${panY}%)` }}
      >
        <Img 
          src={scene.imageUrl} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Kinetic Typography */}
      <div className={`relative z-10 text-center ${isRtl ? 'rtl' : 'ltr'}`}>
        <h2 
          className={`text-6xl font-black ${language === 'en' ? 'uppercase' : ''} tracking-tighter text-white drop-shadow-2xl`}
          style={{
            transform: `scale(${textEntrance}) translateY(${textTranslateY}px)`,
            opacity: textEntrance,
          }}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {scene.text}
        </h2>
      </div>

      {/* Decorative Overlay (e.g., tape, paper scrap, marker stroke) */}
      {scene.overlayImageUrl && (
        <div
          className="absolute z-20" // Higher z-index for overlays
          style={{
            top: scene.overlayPosition?.top,
            left: scene.overlayPosition?.left,
            right: scene.overlayPosition?.right,
            bottom: scene.overlayPosition?.bottom,
            transform: `rotate(${scene.overlayPosition?.rotate || '0deg'})`,
            opacity: textEntrance, // Animate with text entrance for consistency
            width: scene.overlayPosition?.width || 'auto',
          }}
        >
          <Img src={scene.overlayImageUrl} className="h-auto w-full" />
        </div>
      )}
    </AbsoluteFill>
  );
};

export const ImageStoryCollageComposition: React.FC = () => {
  return (
    <Composition
      id="IMAGE-STORY-COLLAGE"
      component={ImageStoryCollage}
      durationInFrames={1800} // Default 60s @ 30fps
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        scenes: [],
        audioUrl: '',
        language: 'en',
      }}
    />
  );
};