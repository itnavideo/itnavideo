import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
  spring,
  Composition,
} from 'remotion';

interface Scene {
  start: number;
  end: number;
  text: string;
  imageUrl: string;
  animation: 'slowZoomIn' | 'slowZoomOut' | 'panLeft' | 'panRight' | 'panUp' | 'panDown' | 'parallax' | 'pushIn' | 'reveal' | 'fade';
  overlayImageUrl?: string;
  overlayPosition?: { top?: string; left?: string; right?: string; bottom?: string; rotate?: string; width?: string };
}

export const ImageStoryCollage: React.FC<{
  scenes: Scene[];
  audioUrl: string;
  language?: string;
}> = ({scenes, audioUrl, language = 'en'}) => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: '#0a0a0a'}}>
      {audioUrl ? <Audio src={audioUrl} /> : null}

      {scenes.map((scene, i) => {
        const from = Math.round(scene.start * fps);
        const duration = Math.max(1, Math.round((scene.end - scene.start) * fps));
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <SceneLayer scene={scene} language={language} durationInFrames={duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneLayer: React.FC<{scene: Scene; language: string; durationInFrames: number}> = ({scene, language, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const isRtl = ['ur', 'ar', 'fa'].includes(language);

  let scale = 1, panX = 0, panY = 0;
  if (scene.animation === 'slowZoomIn') scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {extrapolateRight: 'clamp'});
  else if (scene.animation === 'slowZoomOut') scale = interpolate(frame, [0, durationInFrames], [1.15, 1], {extrapolateRight: 'clamp'});
  else if (scene.animation === 'panLeft') panX = interpolate(frame, [0, durationInFrames], [0, -10], {extrapolateRight: 'clamp'});
  else if (scene.animation === 'panRight') panX = interpolate(frame, [0, durationInFrames], [0, 10], {extrapolateRight: 'clamp'});
  else if (scene.animation === 'panUp') panY = interpolate(frame, [0, durationInFrames], [0, -10], {extrapolateRight: 'clamp'});
  else if (scene.animation === 'panDown') panY = interpolate(frame, [0, durationInFrames], [0, 10], {extrapolateRight: 'clamp'});

  const textEntrance = spring({frame, fps, config: {damping: 15, mass: 0.5}});
  const textY = interpolate(frame, [0, 10], [20, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {/* Background visual */}
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', transform: `scale(${scale}) translateX(${panX}%) translateY(${panY}%)`}}>
        {scene.imageUrl ? (
          <Img src={scene.imageUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <div style={{width: '100%', height: '100%', background: `linear-gradient(${135 + (frame * 0.1)}deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`}} />
        )}
        {/* Dark overlay for text readability */}
        <div style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)'}} />
      </div>

      {/* Text */}
      {scene.text ? (
        <div style={{position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 60px', direction: isRtl ? 'rtl' : 'ltr'}}>
          <h2 style={{
            fontSize: scene.text.length > 30 ? 52 : 68,
            fontWeight: 900, color: '#ffffff',
            textTransform: language === 'en' ? 'uppercase' : 'none',
            letterSpacing: -2, lineHeight: 1.1,
            textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transform: `scale(${textEntrance}) translateY(${textY}px)`,
            opacity: textEntrance,
          }}>
            {scene.text}
          </h2>
        </div>
      ) : null}

      {/* Overlay image */}
      {scene.overlayImageUrl ? (
        <div style={{
          position: 'absolute', zIndex: 20,
          top: scene.overlayPosition?.top, left: scene.overlayPosition?.left,
          right: scene.overlayPosition?.right, bottom: scene.overlayPosition?.bottom,
          transform: `rotate(${scene.overlayPosition?.rotate || '0deg'})`,
          opacity: textEntrance, width: scene.overlayPosition?.width || 'auto',
        }}>
          <Img src={scene.overlayImageUrl} style={{height: 'auto', width: '100%'}} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const ImageStoryCollageComposition: React.FC = () => (
  <Composition
    id="IMAGE-STORY-COLLAGE"
    component={ImageStoryCollage}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{scenes: [], audioUrl: '', language: 'en'}}
    calculateMetadata={({props}) => {
      const p = props as any;
      const scenes = p.scenes || [];
      const lastEnd = scenes.length > 0 ? Math.max(...scenes.map((s: any) => Number(s.end || 0))) : 0;
      const dur = Math.max(8, Math.min(60, lastEnd || Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || 30));
      return {durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
