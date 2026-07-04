import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {ReactNode} from 'react';
import {PremiumAudioLayer, type PremiumSoundCue, type PremiumStyleLock} from '../../components/PremiumAudioLayer';
import {PremiumVisualTreatment, type PremiumVisualStyleLock} from '../../components/PremiumVisualTreatment';

type CustomAiReelAsset = {
  id: string;
  kind: 'image' | 'logo' | 'video' | 'audio';
  src: string;
  fileName?: string;
  durationSeconds?: number;
};

type CustomAiReelScene = {
  id: string;
  start: number;
  end: number;
  type: 'title' | 'text' | 'image' | 'video' | 'logoEnd' | 'ctaEnd';
  title?: string;
  body?: string;
  label?: string;
  mediaId?: string;
  motion?: 'fade' | 'slideUp' | 'zoomIn' | 'zoomOut' | 'slowPan' | 'cardReveal' | 'pulse';
  layout?: 'heroText' | 'imageFeature' | 'screenshotFeature' | 'logoEnd' | 'cta';
};

type CustomAiReelCaption = {
  start: number;
  end: number;
  text: string;
};

type CustomAiReelProps = {
  durationSeconds?: number;
  scenes?: CustomAiReelScene[];
  media?: CustomAiReelAsset[];
  prompt?: string;
  templateName?: string;
  template?: string;
  compositionId?: string;
  audioSrc?: string;
  captions?: CustomAiReelCaption[];
  subtitlesEnabled?: boolean;
  premiumEditing?: boolean;
  styleLock?: PremiumStyleLock & PremiumVisualStyleLock;
  soundCues?: PremiumSoundCue[];
};

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

const defaultScenes: CustomAiReelScene[] = [
  {
    id: 'default-1',
    start: 0,
    end: 8,
    type: 'title',
    title: 'Custom AI Reel',
    body: 'Describe your idea. Upload your visuals. Get a polished vertical reel.',
    label: 'Itnavideo',
    motion: 'slideUp',
    layout: 'heroText',
  },
  {
    id: 'default-2',
    start: 8,
    end: 18,
    type: 'text',
    title: 'Your Instructions Become Video',
    body: 'Upload audio, images, video clips, or just describe what you want.',
    label: 'How It Works',
    motion: 'cardReveal',
    layout: 'heroText',
  },
  {
    id: 'default-3',
    start: 18,
    end: 28,
    type: 'text',
    title: 'Premium Motion Design',
    body: 'Clean typography, strong spacing, and modern creator-ready pacing.',
    label: 'Design',
    motion: 'slideUp',
    layout: 'heroText',
  },
  {
    id: 'default-4',
    start: 28,
    end: 36,
    type: 'ctaEnd',
    title: 'Ready to Share',
    body: 'Made with Itnavideo',
    label: 'Final',
    motion: 'pulse',
    layout: 'cta',
  },
];

const resolveSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function CustomAiReel({
  durationSeconds = 60,
  media = [],
  scenes = defaultScenes,
  audioSrc,
  captions = [],
  subtitlesEnabled = false,
  premiumEditing = true,
  styleLock,
  soundCues = [],
}: CustomAiReelProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sortedScenes = scenes.length ? scenes : defaultScenes;

  // Find active scene using global time
  const currentSec = frame / fps;
  const activeScene = sortedScenes.find((s) => currentSec >= s.start && currentSec < s.end)
    || sortedScenes[sortedScenes.length - 1]
    || defaultScenes[0];

  // Local frame within the active scene (for entrance animations)
  const sceneStartFrame = Math.round(activeScene.start * fps);
  const localFrame = Math.max(0, frame - sceneStartFrame);

  const activeAsset = media.find((asset) => asset.id === activeScene.mediaId);
  const lastImageAsset = [...(media)].reverse().find((a) => a.kind === 'image');
  const backgroundAsset = activeAsset?.kind === 'video'
    ? undefined
    : activeAsset?.kind === 'image' || activeAsset?.kind === 'logo'
      ? activeAsset
      : lastImageAsset;

  const resolvedAudioSrc = resolveSrc(audioSrc);
  const activeCaption = subtitlesEnabled && captions.length
    ? captions.find((c) => currentSec >= c.start && currentSec < c.end)
    : null;

  return (
    <AbsoluteFill style={{backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', overflow: 'hidden'}}>
      {activeAsset?.kind !== 'video' && (
        <SoftBlurBackground asset={backgroundAsset} frame={frame} />
      )}
      {resolvedAudioSrc ? <Audio src={resolvedAudioSrc} volume={1} /> : null}
      <PremiumAudioLayer enabled={premiumEditing} styleLock={styleLock} soundCues={soundCues} />
      <SafeAreaContainer>
        <SceneRenderer asset={activeAsset} localFrame={localFrame} globalFrame={frame} scene={activeScene} />
      </SafeAreaContainer>
      {activeCaption ? <CaptionOverlay caption={activeCaption} frame={frame} fps={fps} /> : null}
      <ProgressRail durationSeconds={durationSeconds} frame={frame} fps={fps} />
      <PremiumVisualTreatment enabled={premiumEditing} styleLock={styleLock} includeLightSweep />
    </AbsoluteFill>
  );
}

function SceneRenderer({asset, localFrame, globalFrame, scene}: {asset?: CustomAiReelAsset; localFrame: number; globalFrame: number; scene: CustomAiReelScene}) {
  if (scene.type === 'video' && asset?.kind === 'video') {
    return <VideoClipScene asset={asset} localFrame={localFrame} scene={scene} />;
  }
  if (scene.type === 'image' && asset) {
    return scene.layout === 'screenshotFeature'
      ? <ScreenshotZoomCard asset={asset} localFrame={localFrame} scene={scene} />
      : <ImageMotionCard asset={asset} localFrame={localFrame} scene={scene} />;
  }
  if (scene.type === 'logoEnd') {
    return <LogoEndScreen asset={asset} localFrame={localFrame} scene={scene} />;
  }
  if (scene.type === 'ctaEnd') {
    return <CTAEndCard localFrame={localFrame} scene={scene} />;
  }
  // title, text, and any unknown type
  return <PremiumTitleBlock localFrame={localFrame} scene={scene} />;
}

function VideoClipScene({asset, localFrame, scene}: {asset: CustomAiReelAsset; localFrame: number; scene: CustomAiReelScene}) {
  const enter = useEntrance(localFrame);
  const src = resolveSrc(asset.src);
  const sceneDurationSec = Math.max(1, scene.end - scene.start);
  return (
    <AbsoluteFill style={{opacity: enter}}>
      <OffthreadVideo
        src={src}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
        startFrom={0}
        endAt={Math.ceil(sceneDurationSec * FPS)}
        volume={0}
      />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.46) 100%)'}} />
      {scene.title ? (
        <AbsoluteFill style={{display: 'flex', alignItems: 'flex-end', padding: '0 72px 180px'}}>
          <div style={{
            borderRadius: 24,
            padding: '22px 32px',
            background: 'rgba(15,23,42,0.82)',
            border: '1px solid rgba(255,255,255,0.14)',
            backdropFilter: 'blur(12px)',
            transform: `translateY(${(1 - enter) * 30}px)`,
          }}>
            <h2 style={{fontSize: 48, lineHeight: 1.05, margin: 0, fontWeight: 900, color: '#f8fafc'}}>{scene.title}</h2>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
}

function CaptionOverlay({caption, frame, fps}: {caption: {start: number; end: number; text: string}; frame: number; fps: number}) {
  const captionLocalFrame = Math.max(0, frame - caption.start * fps);
  const {fps: configFps} = useVideoConfig();
  const enter = spring({frame: captionLocalFrame, fps: configFps, config: {damping: 20, stiffness: 160, mass: 0.7}});
  return (
    <AbsoluteFill style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 64px 200px', pointerEvents: 'none'}}>
      <div style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px)`,
        borderRadius: 18,
        padding: '16px 28px',
        background: 'rgba(24,24,27,0.92)',
        border: '1px solid rgba(255,255,255,0.12)',
        maxWidth: 860,
        textAlign: 'center',
      }}>
        <p style={{fontSize: 38, lineHeight: 1.2, margin: 0, fontWeight: 800, color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.6)'}}>{caption.text}</p>
      </div>
    </AbsoluteFill>
  );
}

function SoftBlurBackground({asset, frame}: {asset?: CustomAiReelAsset; frame: number}) {
  const src = resolveSrc(asset?.src);
  const drift = interpolate(frame % 240, [0, 240], [1.02, 1.08]);

  return (
    <AbsoluteFill>
      {src ? (
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(34px) saturate(1.08) brightness(0.48)',
            transform: `scale(${drift})`,
          }}
        />
      ) : (
        <AbsoluteFill style={{background: 'linear-gradient(145deg, #102033 0%, #16294b 42%, #111827 100%)'}} />
      )}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 18%, rgba(56,189,248,0.28), transparent 34%), radial-gradient(circle at 20% 82%, rgba(37,99,235,0.24), transparent 32%), linear-gradient(180deg, rgba(15,23,42,0.2), rgba(15,23,42,0.88))'}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 180px rgba(2,6,23,0.92)'}} />
    </AbsoluteFill>
  );
}

function SafeAreaContainer({children}: {children: ReactNode}) {
  return (
    <AbsoluteFill style={{padding: '116px 72px 112px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {children}
    </AbsoluteFill>
  );
}

function PremiumTitleBlock({localFrame, scene}: {localFrame: number; scene: CustomAiReelScene}) {
  const enter = useEntrance(localFrame);
  const title = scene.title || 'Custom AI Reel';
  const fontSize = title.length > 46 ? 68 : title.length > 30 ? 78 : 92;

  return (
    <div style={{width: '100%', transform: `translateY(${(1 - enter) * 42}px)`, opacity: enter}}>
      <div style={{marginBottom: 28}}>
        <LabelPill>{scene.label || 'Custom AI Reel'}</LabelPill>
      </div>
      <div style={{
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 34,
        padding: '58px 54px 56px',
        background: 'linear-gradient(145deg, rgba(15,23,42,0.88), rgba(30,41,59,0.7))',
        boxShadow: '0 34px 120px rgba(2,6,23,0.55), inset 0 1px 0 rgba(255,255,255,0.14)',
        backdropFilter: 'blur(18px)',
      }}>
        <h1 style={{fontSize, lineHeight: 0.96, letterSpacing: 0, margin: 0, fontWeight: 900, color: '#f8fafc', textShadow: '0 8px 38px rgba(2,6,23,0.55)'}}>
          {title}
        </h1>
        {scene.body ? (
          <p style={{margin: '30px 0 0', fontSize: 34, lineHeight: 1.28, fontWeight: 720, color: '#cbd5e1', maxWidth: 820}}>
            {scene.body}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function MediaShowcaseFrame({asset, children, localFrame, scene}: {asset: CustomAiReelAsset; children: React.ReactNode; localFrame: number; scene: CustomAiReelScene}) {
  const enter = useEntrance(localFrame);
  const reveal = interpolate(enter, [0, 1], [0.96, 1]);
  return (
    <div style={{width: '100%', opacity: enter, transform: `translateY(${(1 - enter) * 36}px) scale(${reveal})`}}>
      <div style={{marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24}}>
        <LabelPill>{scene.label || (asset.kind === 'logo' ? 'Brand' : 'Uploaded visual')}</LabelPill>
        <span style={{fontSize: 22, color: '#94a3b8', fontWeight: 760, maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          {asset.fileName || 'Uploaded media'}
        </span>
      </div>
      <div style={{
        borderRadius: 34,
        border: '1px solid rgba(255,255,255,0.2)',
        padding: 18,
        background: 'linear-gradient(145deg, rgba(248,250,252,0.18), rgba(15,23,42,0.42))',
        boxShadow: '0 42px 140px rgba(2,6,23,0.62), inset 0 1px 0 rgba(255,255,255,0.16)',
      }}>
        {children}
      </div>
      {(scene.title || scene.body) ? (
        <div style={{marginTop: 28, borderRadius: 26, padding: '30px 32px', background: 'rgba(15,23,42,0.76)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 24px 90px rgba(2,6,23,0.34)'}}>
          {scene.title ? <h2 style={{fontSize: 50, lineHeight: 1.02, margin: 0, fontWeight: 900, color: '#f8fafc'}}>{scene.title}</h2> : null}
          {scene.body ? <p style={{fontSize: 27, lineHeight: 1.25, margin: scene.title ? '14px 0 0' : 0, color: '#cbd5e1', fontWeight: 700}}>{scene.body}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function ScreenshotZoomCard({asset, localFrame, scene}: {asset: CustomAiReelAsset; localFrame: number; scene: CustomAiReelScene}) {
  const progress = sceneProgress(localFrame, scene);
  const zoom = interpolate(progress, [0, 1], [1.03, 1.13]);
  return (
    <MediaShowcaseFrame asset={asset} localFrame={localFrame} scene={scene}>
      <div style={{height: 920, borderRadius: 24, overflow: 'hidden', background: '#e5e7eb', position: 'relative'}}>
        <div style={{height: 54, background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', borderBottom: '1px solid rgba(15,23,42,0.1)'}}>
          <span style={{width: 14, height: 14, borderRadius: 999, background: '#ef4444'}} />
          <span style={{width: 14, height: 14, borderRadius: 999, background: '#f59e0b'}} />
          <span style={{width: 14, height: 14, borderRadius: 999, background: '#10b981'}} />
          <span style={{marginLeft: 18, height: 24, flex: 1, borderRadius: 999, background: '#e2e8f0'}} />
        </div>
        <Img src={resolveSrc(asset.src)} style={{width: '100%', height: 'calc(100% - 54px)', objectFit: 'contain', transform: `scale(${zoom})`, transformOrigin: 'center top'}} />
      </div>
    </MediaShowcaseFrame>
  );
}

function ImageMotionCard({asset, localFrame, scene}: {asset: CustomAiReelAsset; localFrame: number; scene: CustomAiReelScene}) {
  const progress = sceneProgress(localFrame, scene);
  const zoom = scene.motion === 'zoomOut'
    ? interpolate(progress, [0, 1], [1.12, 1.02])
    : interpolate(progress, [0, 1], [1.02, 1.1]);
  const pan = scene.motion === 'slowPan' ? interpolate(progress, [0, 1], [-18, 18]) : 0;
  return (
    <MediaShowcaseFrame asset={asset} localFrame={localFrame} scene={scene}>
      <div style={{height: 920, borderRadius: 24, overflow: 'hidden', background: '#0f172a', position: 'relative'}}>
        <Img src={resolveSrc(asset.src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translateX(${pan}px) scale(${zoom})`}} />
        <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 -180px 160px rgba(2,6,23,0.34)'}} />
      </div>
    </MediaShowcaseFrame>
  );
}

function LogoEndScreen({asset, localFrame, scene}: {asset?: CustomAiReelAsset; localFrame: number; scene: CustomAiReelScene}) {
  const enter = useEntrance(localFrame);
  const pulse = 1 + Math.sin(localFrame / 18) * 0.018;
  return (
    <div style={{width: '100%', textAlign: 'center', opacity: enter, transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`}}>
      <div style={{margin: '0 auto 42px', width: 260, height: 260, borderRadius: 52, display: 'grid', placeItems: 'center', background: 'rgba(248,250,252,0.14)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 36px 120px rgba(37,99,235,0.28)', transform: `scale(${pulse})`}}>
        {asset ? <Img src={resolveSrc(asset.src)} style={{maxWidth: 188, maxHeight: 188, objectFit: 'contain'}} /> : <span style={{fontSize: 82, fontWeight: 900}}>AI</span>}
      </div>
      <h1 style={{fontSize: 82, lineHeight: 0.96, margin: 0, fontWeight: 950, color: '#f8fafc'}}>{scene.title || 'Ready to Share'}</h1>
      {scene.body ? <p style={{fontSize: 34, color: '#cbd5e1', fontWeight: 760, margin: '26px auto 0', maxWidth: 760}}>{scene.body}</p> : null}
    </div>
  );
}

function CTAEndCard({localFrame, scene}: {localFrame: number; scene: CustomAiReelScene}) {
  const enter = useEntrance(localFrame);
  const pulse = 1 + Math.sin(localFrame / 16) * 0.012;
  return (
    <div style={{width: '100%', opacity: enter, transform: `translateY(${(1 - enter) * 34}px)`}}>
      <div style={{borderRadius: 38, padding: '72px 58px', background: 'linear-gradient(145deg, rgba(37,99,235,0.92), rgba(14,165,233,0.78))', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 46px 150px rgba(2,6,23,0.58)'}}>
        <LabelPill dark>{scene.label || 'Final frame'}</LabelPill>
        <h1 style={{fontSize: 86, lineHeight: 0.96, margin: '34px 0 0', fontWeight: 950, color: '#ffffff'}}>{scene.title || 'Ready to Share'}</h1>
        <p style={{fontSize: 34, lineHeight: 1.25, margin: '28px 0 0', fontWeight: 760, color: 'rgba(255,255,255,0.84)'}}>{scene.body || 'Made with Itnavideo'}</p>
        <div style={{marginTop: 42, width: 180, height: 10, borderRadius: 999, background: '#ffffff', opacity: 0.92, transform: `scaleX(${pulse})`, transformOrigin: 'left'}} />
      </div>
    </div>
  );
}

function LabelPill({children, dark = false}: {children: ReactNode; dark?: boolean}) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 42,
      borderRadius: 999,
      padding: '0 22px',
      background: dark ? 'rgba(15,23,42,0.26)' : 'rgba(255,255,255,0.12)',
      border: '1px solid rgba(255,255,255,0.18)',
      color: '#dbeafe',
      fontSize: 20,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: 0,
    }}>
      {children}
    </span>
  );
}

function ProgressRail({durationSeconds, fps, frame}: {durationSeconds: number; fps: number; frame: number}) {
  const progress = clamp(frame / Math.max(1, durationSeconds * fps), 0, 1);
  return (
    <div style={{position: 'absolute', left: 72, right: 72, bottom: 54, height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.14)', overflow: 'hidden'}}>
      <div style={{height: '100%', width: `${progress * 100}%`, background: 'linear-gradient(90deg, #38bdf8, #ffffff)', borderRadius: 999}} />
    </div>
  );
}

function useEntrance(localFrame: number) {
  const {fps} = useVideoConfig();
  // localFrame is always 0-based within the scene — no modulo needed
  return spring({frame: localFrame, fps, config: {damping: 18, stiffness: 110, mass: 0.9}});
}

function sceneProgress(localFrame: number, scene: CustomAiReelScene) {
  const durationFrames = Math.max(1, (scene.end - scene.start) * FPS);
  return clamp(localFrame / durationFrames, 0, 1);
}

export {CustomAiReel};

export const CustomAiReelComposition = () => (
  <Composition
    id="CUSTOM-AI-REEL"
    component={CustomAiReel}
    durationInFrames={1800}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{
      durationSeconds: 60,
      scenes: defaultScenes,
      media: [],
      templateName: 'CUSTOM_AI_REEL',
      template: 'CUSTOM_AI_REEL',
      compositionId: 'CUSTOM-AI-REEL',
    } as CustomAiReelProps}
    calculateMetadata={({props}) => {
      const p = props as CustomAiReelProps;
      const duration = Math.max(1, Math.min(60, Number(p.durationSeconds) || 60));
      return {durationInFrames: Math.ceil(duration * FPS), fps: FPS, width: WIDTH, height: HEIGHT};
    }}
  />
);
