import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { UniversalCaptionLayer, CaptionChunk } from '../../components/library/UniversalCaptionLayer';
import { BookSummaryScene } from '../../../services/ai/bookSummaryPlanner';

export interface BookSummaryTemplateProps {
  audioSrc?: string;
  audioUrl?: string;
  bgmSrc?: string;
  bgmUrl?: string;
  bgmVolume?: number;
  scenes?: BookSummaryScene[];
  captions?: CaptionChunk[];
  subtitleChunks?: CaptionChunk[];
  durationSeconds?: number;
  bookTitle?: string;
  authorName?: string;
  bookCoverUrl?: string;
  authorPortraitUrl?: string;
  referenceImages?: string[];
  captionThemeId?: string;
}

const FALLBACK_COVER = 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688233/person_calculating_typing_laptop_npimij.png';

const resolveUrl = (src?: string) => {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();
  if (!trimmed || trimmed === '[object Object]' || trimmed.includes('[object')) return '';
  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^\/+/, '');
  try {
    return staticFile(cleanPath);
  } catch {
    return cleanPath;
  }
};

const resolveAssetUrl = (src?: string, fallback = FALLBACK_COVER) => {
  const url = resolveUrl(src);
  if (!url) return fallback;
  if (url.includes('storage.googleapis.com/itnavideo-media-assets')) {
    return fallback;
  }
  return url;
};

/**
 * Animated Ambient Background for Audio-Only and Scene Cards
 */
const SubtleAmbientBackground: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame / fps;
  const pulseOpacity = interpolate(Math.sin(t * 0.8), [-1, 1], [0.15, 0.35]);
  const gradientAngle = (t * 12) % 360;

  return (
    <AbsoluteFill style={{ backgroundColor: '#070B14', overflow: 'hidden' }}>
      {/* 1. Deep Obsidian Base Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
          opacity: 0.4,
        }}
      />

      {/* 2. Soft Animated Google Analytics Orange Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '20%',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 109, 0, ${pulseOpacity}) 0%, rgba(255, 143, 0, 0.05) 50%, transparent 80%)`,
          filter: 'blur(90px)',
          transform: `rotate(${gradientAngle}deg) scale(${1 + Math.sin(t * 0.5) * 0.05})`,
        }}
      />

      {/* 3. Deep Slate Secondary Warm Accent */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '15%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(14, 21, 38, 0.9) 0%, rgba(7, 11, 20, 0.8) 70%, transparent 100%)`,
          filter: 'blur(70px)',
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * 1. BOOK_COVER Scene Component
 */
const BookCoverSceneCard: React.FC<{
  scene: BookSummaryScene;
  defaultCoverUrl?: string;
  defaultTitle?: string;
  defaultAuthor?: string;
  fps: number;
}> = ({ scene, defaultCoverUrl, defaultTitle, defaultAuthor, fps }) => {
  const frame = useCurrentFrame();
  const coverImg = resolveAssetUrl(scene.assetUrl || defaultCoverUrl);
  const title = scene.bookTitle || scene.text || defaultTitle || 'Book Summary';
  const author = scene.authorName || defaultAuthor || '';

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const scale = interpolate(cardSpring, [0, 1], [0.92, 1]);
  const opacity = interpolate(cardSpring, [0, 1], [0, 1]);
  
  // Subtle Ken-Burns zoom on image
  const imageZoom = interpolate(frame, [0, 300], [1.0, 1.05], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '60px 80px' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '60px',
          width: '100%',
          maxWidth: '1400px',
          backgroundColor: 'rgba(14, 21, 38, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '32px',
          padding: '48px 64px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 109, 0, 0.15)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Book Cover Image */}
        <div
          style={{
            width: '380px',
            height: '520px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 109, 0, 0.2)',
            flexShrink: 0,
            border: '2px solid rgba(255, 109, 0, 0.3)',
          }}
        >
          <Img
            src={coverImg}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${imageZoom})`,
            }}
          />
        </div>

        {/* Book Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left', flex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 109, 0, 0.15)',
              border: '1px solid rgba(255, 109, 0, 0.4)',
              borderRadius: '999px',
              padding: '8px 20px',
              width: 'fit-content',
              fontSize: '18px',
              fontWeight: 800,
              color: '#FF9100',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}
          >
            <span>📖 Master Book Summary</span>
          </div>

          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.15,
              margin: 0,
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-1px',
            }}
          >
            {title}
          </h1>

          {author && (
            <p
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#94A3B8',
                margin: 0,
              }}
            >
              By <span style={{ color: '#FFA726' }}>{author}</span>
            </p>
          )}

          <div style={{ height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.1)', width: '100%', marginTop: '10px' }} />

          <p style={{ fontSize: '20px', color: '#64748B', margin: 0, fontWeight: 600 }}>
            Core Lessons & Practical Wisdom Breakdown
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 2. LESSON_TITLE Scene Component
 */
const LessonTitleSceneCard: React.FC<{ scene: BookSummaryScene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const translateY = interpolate(titleSpring, [0, 1], [40, 0]);
  const opacity = interpolate(titleSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 100px' }}>
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          maxWidth: '1200px',
          backgroundColor: 'rgba(14, 21, 38, 0.95)',
          border: '1px solid rgba(255, 109, 0, 0.3)',
          borderRadius: '32px',
          padding: '60px 80px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 109, 0, 0.25)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(255, 109, 0, 0.18)',
            border: '1px solid rgba(255, 143, 0, 0.5)',
            borderRadius: '999px',
            padding: '10px 28px',
            fontSize: '20px',
            fontWeight: 900,
            color: '#FF9100',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          <span>💡 {scene.subtitle || `Lesson #${scene.lessonNumber || 1}`}</span>
        </div>

        <h2
          style={{
            fontSize: '60px',
            fontWeight: 900,
            lineHeight: 1.2,
            margin: 0,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 50%, #FFA726 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {scene.text}
        </h2>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 3. KEY_IDEA Scene Component
 */
const KeyIdeaSceneCard: React.FC<{ scene: BookSummaryScene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const scale = interpolate(cardSpring, [0, 1], [0.94, 1]);
  const opacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const hasAsset = Boolean(scene.assetUrl);
  const imageZoom = interpolate(frame, [0, 300], [1.0, 1.04], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 80px' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          display: 'flex',
          flexDirection: hasAsset ? 'row' : 'column',
          alignItems: 'center',
          gap: '50px',
          width: '100%',
          maxWidth: '1350px',
          backgroundColor: 'rgba(14, 21, 38, 0.94)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '32px',
          padding: '50px 70px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(255, 109, 0, 0.18)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {hasAsset && (
          <div
            style={{
              width: '320px',
              height: '320px',
              borderRadius: '24px',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 15px 30px rgba(0,0,0,0.6)',
              border: '2px solid rgba(255, 143, 0, 0.4)',
            }}
          >
            <Img
              src={resolveAssetUrl(scene.assetUrl)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${imageZoom})`,
              }}
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            textAlign: hasAsset ? 'left' : 'center',
            flex: 1,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: hasAsset ? 'flex-start' : 'center',
              gap: '8px',
              color: '#FF8F00',
              fontSize: '18px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}
          >
            <span>🔑 {scene.subtitle || 'Key Takeaway'}</span>
          </div>

          <p
            style={{
              fontSize: '48px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.25,
              margin: 0,
              fontFamily: 'Inter, system-ui, sans-serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            }}
          >
            {scene.text}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 4. QUOTE Scene Component
 */
const QuoteSceneCard: React.FC<{ scene: BookSummaryScene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();

  const quoteSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const scale = interpolate(quoteSpring, [0, 1], [0.93, 1]);
  const opacity = interpolate(quoteSpring, [0, 1], [0, 1]);
  const hasPortrait = Boolean(scene.assetUrl);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 90px' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '30px',
          maxWidth: '1300px',
          backgroundColor: 'rgba(14, 21, 38, 0.95)',
          border: '1px solid rgba(255, 143, 0, 0.35)',
          borderRadius: '32px',
          padding: '60px 80px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 109, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: '90px',
            lineHeight: 0.5,
            color: '#FF6D00',
            opacity: 0.8,
            fontFamily: 'Georgia, serif',
          }}
        >
          “
        </span>

        <p
          style={{
            fontSize: '44px',
            fontWeight: 800,
            fontStyle: 'italic',
            color: '#F8FAFC',
            lineHeight: 1.35,
            margin: 0,
            fontFamily: 'Georgia, Inter, serif',
          }}
        >
          {scene.text}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
          {hasPortrait && (
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #FF8F00',
              }}
            >
              <Img src={resolveAssetUrl(scene.assetUrl)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <span style={{ fontSize: '26px', fontWeight: 900, color: '#FFA726', letterSpacing: '0.5px' }}>
            — {scene.authorName || 'Author'}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BookSummaryTemplate: React.FC<BookSummaryTemplateProps> = ({
  audioSrc,
  audioUrl,
  bgmSrc,
  bgmUrl,
  bgmVolume = 0.15,
  scenes = [],
  captions = [],
  subtitleChunks = [],
  bookTitle,
  authorName,
  bookCoverUrl,
  authorPortraitUrl,
  captionThemeId = 'glow-viral',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const activeAudioUrl = audioUrl || audioSrc;
  const activeBgmUrl = bgmUrl || bgmSrc;
  const activeCaptions = captions.length > 0 ? captions : subtitleChunks;

  // Find active scene at current timestamp
  const activeScene = scenes.find(
    s => !s.disabled && currentTime >= s.startSeconds && currentTime <= s.endSeconds
  );

  // Determine whether to show bottom captions:
  // Hide captions during visual cards (KEY_IDEA, QUOTE, LESSON_TITLE, BOOK_COVER)
  // Show captions during CAPTIONS scene or gaps
  const showBottomCaptions = !activeScene || activeScene.type === 'CAPTIONS';

  return (
    <AbsoluteFill style={{ backgroundColor: '#070B14' }}>
      {/* 1. Main Spoken Audio Track */}
      {activeAudioUrl && <Audio src={resolveUrl(activeAudioUrl)} volume={1.0} />}

      {/* 2. Background Music Track (if provided) */}
      {activeBgmUrl && <Audio src={resolveUrl(activeBgmUrl)} volume={bgmVolume} loop />}

      {/* 3. Ambient Dynamic Visual Background */}
      <SubtleAmbientBackground frame={frame} fps={fps} />

      {/* 4. Active Visual Scene Render (KEY_IDEA, QUOTE, LESSON_TITLE, BOOK_COVER) */}
      {activeScene && activeScene.type === 'BOOK_COVER' && (
        <BookCoverSceneCard
          scene={activeScene}
          defaultCoverUrl={bookCoverUrl}
          defaultTitle={bookTitle}
          defaultAuthor={authorName}
          fps={fps}
        />
      )}

      {activeScene && activeScene.type === 'LESSON_TITLE' && (
        <LessonTitleSceneCard scene={activeScene} fps={fps} />
      )}

      {activeScene && activeScene.type === 'KEY_IDEA' && (
        <KeyIdeaSceneCard scene={activeScene} fps={fps} />
      )}

      {activeScene && activeScene.type === 'QUOTE' && (
        <QuoteSceneCard scene={activeScene} fps={fps} />
      )}

      {/* 5. Animated Universal Captions (Pauses during Cards, Resumes instantly at exact word timestamp) */}
      {showBottomCaptions && (
        <UniversalCaptionLayer
          captions={activeCaptions}
          captionThemeId={captionThemeId}
        />
      )}
    </AbsoluteFill>
  );
};

export const BookSummaryComposition: React.FC = () => (
  <Composition
    id="BOOK-SUMMARY"
    component={BookSummaryTemplate}
    durationInFrames={30 * 60} // 60s default (30 fps * 60)
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{
      durationSeconds: 60,
      bookTitle: 'Book Summary',
      scenes: [],
    }}
    calculateMetadata={({ props }) => {
      const p = props as BookSummaryTemplateProps;
      const rawDuration = Number(p.durationSeconds) || 60;
      // Max proven limit 12 minutes (720s)
      const durationSeconds = Math.max(5, Math.min(720, rawDuration));
      return {
        durationInFrames: Math.round(durationSeconds * 30),
        fps: 30,
        width: 1920,
        height: 1080,
      };
    }}
  />
);

