import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type SceneType = 'creator_face' | 'typography' | 'key_point';

type DynamicScene = {
  type: SceneType;
  start: number;
  end: number;
  text?: string;
  highlightWord?: string;
  zoom?: number;
};

type CaptionWord = {
  word: string;
  start: number;
  end: number;
};

type DynamicCaption = {
  start: number;
  end: number;
  text: string;
  words?: CaptionWord[];
};

type DynamicCreatorReelProps = {
  mediaSrc?: string;
  mediaType?: 'video' | 'audio';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  scenes?: DynamicScene[];
  captions?: DynamicCaption[];
  accentColor?: string;
  topicTitle?: string;
};

const resolveUrl = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const cleanWords = (value = '') =>
  value
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

const pickHighlightWord = (text = '', preferred?: string) => {
  if (preferred && text.toLowerCase().includes(preferred.toLowerCase())) return preferred;
  const words = cleanWords(text);
  return words
    .filter((word) => word.replace(/[^a-zA-Z0-9]/g, '').length >= 4)
    .at(-1) || words.at(-1) || '';
};

const splitAroundHighlight = (text: string, highlight: string) => {
  if (!highlight) return [{text, highlight: false}];
  const lower = text.toLowerCase();
  const index = lower.indexOf(highlight.toLowerCase());
  if (index < 0) return [{text, highlight: false}];
  return [
    {text: text.slice(0, index), highlight: false},
    {text: text.slice(index, index + highlight.length), highlight: true},
    {text: text.slice(index + highlight.length), highlight: false},
  ].filter((part) => part.text);
};

const fitFontSize = (text = '', large = 72, medium = 58, small = 48) => {
  if (text.length > 44) return small;
  if (text.length > 28) return medium;
  return large;
};

function TypographyText({
  text,
  highlightWord,
  frame,
  fps,
  accentColor,
  align = 'left',
  size = 'normal',
}: {
  text: string;
  highlightWord?: string;
  frame: number;
  fps: number;
  accentColor: string;
  align?: 'left' | 'center' | 'right';
  size?: 'normal' | 'large' | 'huge';
}) {
  const highlight = pickHighlightWord(text, highlightWord);
  const parts = splitAroundHighlight(text, highlight);
  const entrance = spring({frame, fps, config: {damping: 15, mass: 0.35, stiffness: 180}});
  const y = interpolate(frame, [0, 10], [28, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = interpolate(frame, [0, 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fontSize = size === 'huge' ? 98 : size === 'large' ? 78 : fitFontSize(text);

  return (
    <div
      style={{
        fontFamily: 'Inter, Arial, Helvetica, sans-serif',
        fontSize,
        fontWeight: 950,
        letterSpacing: 0,
        lineHeight: 0.92,
        color: '#fff',
        textAlign: align,
        textShadow: '0 5px 22px rgba(0,0,0,0.58)',
        transform: `translateY(${y}px) scale(${0.96 + entrance * 0.04})`,
        opacity,
      }}
    >
      {parts.map((part, index) => (
        <span
          key={`${part.text}-${index}`}
          style={{
            color: part.highlight ? accentColor : '#fff',
            fontStyle: part.highlight && size !== 'huge' ? 'italic' : 'normal',
            textShadow: part.highlight
              ? `0 5px 20px rgba(0,0,0,0.48), 0 0 22px ${accentColor}55`
              : '0 5px 22px rgba(0,0,0,0.58)',
          }}
        >
          {part.text}
        </span>
      ))}
    </div>
  );
}

function CaptionTypography({
  caption,
  currentTime,
  fps,
  accentColor,
}: {
  caption: DynamicCaption;
  currentTime: number;
  fps: number;
  accentColor: string;
}) {
  const localFrame = Math.round((currentTime - caption.start) * fps);
  const text = caption.text;
  const words = caption.words?.length ? caption.words : [];
  const activeWord = words.find((word) => currentTime >= word.start && currentTime < word.end)?.word;
  const highlight = pickHighlightWord(text, activeWord);
  const wordCount = cleanWords(text).length;
  const align = wordCount <= 3 ? 'center' : 'left';

  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'center' ? 70 : 58,
        right: align === 'center' ? 70 : 140,
        bottom: wordCount <= 3 ? 360 : 265,
        zIndex: 8,
      }}
    >
      <TypographyText
        text={text}
        highlightWord={highlight}
        frame={localFrame}
        fps={fps}
        accentColor={accentColor}
        align={align}
        size={wordCount <= 3 ? 'large' : 'normal'}
      />
    </div>
  );
}

function DynamicCreatorReel({
  mediaSrc = '',
  mediaType = 'video',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  scenes = [],
  captions = [],
  accentColor = '#7DD3FC',
}: DynamicCreatorReelProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const videoSrc = resolveUrl(mediaSrc);
  const currentTime = frame / fps;

  const currentCaption = captions.find((caption) => currentTime >= caption.start && currentTime < caption.end);
  const activeScene = scenes.find((scene) => currentTime >= scene.start && currentTime < scene.end);
  const sceneLocalFrame = activeScene ? Math.round((currentTime - activeScene.start) * fps) : 0;
  const sceneIndex = activeScene ? Math.max(0, scenes.indexOf(activeScene)) : 0;
  const subtleZoom = activeScene?.zoom || (sceneIndex % 3 === 1 ? 1.025 : sceneIndex % 3 === 2 ? 1.045 : 1.01);
  const videoScale = clamp(subtleZoom, 1, 1.075);

  return (
    <AbsoluteFill style={{background: '#050505', overflow: 'hidden'}}>
      {videoSrc && mediaType === 'video' ? (
        <OffthreadVideo
          src={videoSrc}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          volume={sourceAudioVolume}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${videoScale})`,
            transformOrigin: 'center center',
          }}
        />
      ) : null}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 28%, transparent 58%, rgba(0,0,0,0.36) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {activeScene?.type === 'typography' ? (
        <div
          style={{
            position: 'absolute',
            left: 54,
            right: 54,
            bottom: 300,
            zIndex: 9,
          }}
        >
          <TypographyText
            text={activeScene.text || ''}
            highlightWord={activeScene.highlightWord}
            frame={sceneLocalFrame}
            fps={fps}
            accentColor={accentColor}
            align="left"
            size="large"
          />
        </div>
      ) : null}

      {activeScene?.type === 'key_point' ? (
        <div style={{position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none'}}>
          <div
            style={{
              position: 'absolute',
              top: 185,
              left: 44,
              right: 44,
              fontFamily: 'Inter, Arial, Helvetica, sans-serif',
              fontSize: 112,
              fontWeight: 950,
              letterSpacing: 0,
              lineHeight: 0.88,
              color: accentColor,
              opacity: interpolate(sceneLocalFrame, [0, 12], [0, 0.58], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              textAlign: 'center',
              textShadow: '0 8px 28px rgba(0,0,0,0.32)',
            }}
          >
            {pickHighlightWord(activeScene.text || '').toUpperCase()}
          </div>
          <div style={{position: 'absolute', left: 58, right: 58, bottom: 285}}>
            <TypographyText
              text={activeScene.text || ''}
              highlightWord={activeScene.highlightWord}
              frame={sceneLocalFrame}
              fps={fps}
              accentColor={accentColor}
              align="left"
              size="normal"
            />
          </div>
        </div>
      ) : null}

      {currentCaption && activeScene?.type !== 'typography' && activeScene?.type !== 'key_point' ? (
        <CaptionTypography caption={currentCaption} currentTime={currentTime} fps={fps} accentColor={accentColor} />
      ) : null}
    </AbsoluteFill>
  );
}

export {DynamicCreatorReel};

export const DynamicCreatorReelComposition = () => (
  <Composition
    id="DYNAMIC-CREATOR-REEL"
    component={DynamicCreatorReel}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      mediaType: 'video',
      mediaSrc: '',
      durationSeconds: 30,
      accentColor: '#7DD3FC',
      scenes: [
        {type: 'typography', start: 0, end: 2.2, text: 'This Changes Everything', highlightWord: 'Everything'},
        {type: 'creator_face', start: 2.2, end: 6, zoom: 1.01},
        {type: 'key_point', start: 6, end: 9, text: 'Most creators miss this simple trick', highlightWord: 'trick'},
        {type: 'creator_face', start: 9, end: 18, zoom: 1.035},
        {type: 'typography', start: 18, end: 21, text: 'Start today', highlightWord: 'today'},
        {type: 'creator_face', start: 21, end: 30, zoom: 1.015},
      ],
      captions: [
        {start: 2.2, end: 4.2, text: 'Let me show you something'},
        {start: 4.2, end: 6, text: 'that changed my content game'},
        {start: 9, end: 11, text: 'Here is the key insight'},
        {start: 11, end: 13.5, text: 'you need to understand'},
        {start: 21, end: 24, text: 'So start now'},
        {start: 24, end: 28, text: 'not tomorrow'},
      ],
    } as DynamicCreatorReelProps}
    calculateMetadata={({props}) => {
      const p = props as DynamicCreatorReelProps;
      const dur = Math.max(8, Math.min(60, Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || 30));
      return {durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
