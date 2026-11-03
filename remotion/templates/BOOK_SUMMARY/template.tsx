import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  interpolate,
  Sequence,
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
  aspectRatio?: '16:9';
}

// No laptop placeholder — BOOK_COVER falls back to a styled title-only card when no image is supplied
const FALLBACK_COVER = '';

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
 * Clean White Editorial Ambient Background for Book Summary Videos
 * Pure White (#FFFFFF / #FAFAFA) canvas with delicate grid texture and soft warm ambient blooms.
 */
const SubtleAmbientBackground: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame / fps;
  const pulseOpacity = interpolate(Math.sin(t * 0.8), [-1, 1], [0.03, 0.07]);
  const gradientAngle = (t * 8) % 360;

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAFA', overflow: 'hidden' }}>
      {/* 1. Delicate Light Grey Dot Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.05) 1.5px, transparent 1.5px)`,
          backgroundSize: '36px 36px',
          opacity: 0.85,
        }}
      />

      {/* 2. Soft Warm Flame Orange & Amber Ambient Bloom (Top-Left) */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '55%',
          height: '55%',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 87, 34, ${pulseOpacity}) 0%, rgba(255, 160, 0, 0.02) 60%, transparent 80%)`,
          filter: 'blur(100px)',
          transform: `rotate(${gradientAngle}deg) scale(${1 + Math.sin(t * 0.4) * 0.04})`,
        }}
      />

      {/* 3. Soft Subtle Slate Warm Ambient Glow (Bottom-Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 143, 0, 0.04) 0%, rgba(241, 245, 249, 0.6) 50%, transparent 80%)`,
          filter: 'blur(90px)',
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * 1. BOOK_COVER Scene Component (Clean White Theme)
 * 3D perspective book reveal with title, author, and book cover card
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

  const scale = interpolate(cardSpring, [0, 1], [0.93, 1]);
  const opacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const imageZoom = interpolate(frame, [0, 300], [1.0, 1.04], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '60px 80px' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '64px',
          width: '100%',
          maxWidth: '1380px',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          border: '1.5px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '36px',
          padding: '52px 68px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Book Cover Image with 3D Depth */}
        {coverImg ? (
          <div
            style={{
              width: '380px',
              height: '520px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(234, 88, 12, 0.15)',
              flexShrink: 0,
              border: '2px solid rgba(234, 88, 12, 0.25)',
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
        ) : (
          <div
            style={{
              width: '340px',
              height: '460px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)',
              border: '2px dashed rgba(234, 88, 12, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '30px',
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '64px' }}>📖</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#C2410C' }}>Book Summary Master</span>
          </div>
        )}

        {/* Book Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left', flex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FFEDD5',
              border: '1px solid rgba(234, 88, 12, 0.3)',
              borderRadius: '999px',
              padding: '8px 22px',
              width: 'fit-content',
              fontSize: '16px',
              fontWeight: 800,
              color: '#EA580C',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
            }}
          >
            <span>📖 Master Book Summary</span>
          </div>

          <h1
            style={{
              fontSize: '54px',
              fontWeight: 900,
              color: '#0F172A',
              lineHeight: 1.15,
              margin: 0,
              fontFamily: 'Inter, "Plus Jakarta Sans", system-ui, sans-serif',
              letterSpacing: '-1.5px',
            }}
          >
            {title}
          </h1>

          {author && (
            <p
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#475569',
                margin: 0,
              }}
            >
              By <span style={{ color: '#EA580C', fontWeight: 800 }}>{author}</span>
            </p>
          )}

          <div style={{ height: '1.5px', backgroundColor: 'rgba(0, 0, 0, 0.08)', width: '100%', marginTop: '6px' }} />

          <p style={{ fontSize: '20px', color: '#64748B', margin: 0, fontWeight: 600 }}>
            Core Lessons &amp; Actionable Frameworks Breakdown
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 2. LESSON_TITLE Scene Component (Clean White Theme)
 * Chapter / Lesson header banner with crisp contrast
 */
const LessonTitleSceneCard: React.FC<{ scene: BookSummaryScene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const translateY = interpolate(titleSpring, [0, 1], [35, 0]);
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
          maxWidth: '1240px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          border: '1.5px solid rgba(234, 88, 12, 0.25)',
          borderRadius: '36px',
          padding: '64px 84px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 35px rgba(234, 88, 12, 0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FFEDD5',
            border: '1px solid rgba(234, 88, 12, 0.35)',
            borderRadius: '999px',
            padding: '10px 28px',
            fontSize: '18px',
            fontWeight: 900,
            color: '#EA580C',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          <span>💡 {scene.subtitle || `Lesson #${scene.lessonNumber || 1}`}</span>
        </div>

        <h2
          style={{
            fontSize: '58px',
            fontWeight: 900,
            lineHeight: 1.18,
            margin: 0,
            color: '#0F172A',
            fontFamily: 'Inter, "Plus Jakarta Sans", system-ui, sans-serif',
            letterSpacing: '-1.5px',
          }}
        >
          {scene.text}
        </h2>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 3. KEY_IDEA Scene Component (Clean White Theme)
 * Editorial insight card with optional reference graphic / author portrait
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
          gap: '54px',
          width: '100%',
          maxWidth: '1360px',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          border: '1.5px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '36px',
          padding: '54px 72px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(20px)',
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
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
              border: '2px solid rgba(234, 88, 12, 0.3)',
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
              color: '#EA580C',
              fontSize: '16px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
            }}
          >
            <span>🔑 {scene.subtitle || 'Key Takeaway'}</span>
          </div>

          <p
            style={{
              fontSize: '46px',
              fontWeight: 900,
              color: '#0F172A',
              lineHeight: 1.25,
              margin: 0,
              fontFamily: 'Inter, "Plus Jakarta Sans", system-ui, sans-serif',
              letterSpacing: '-1px',
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
 * 4. COMPARISON Scene Component (Learned from Faceless Video)
 * 2-column split card contrasting Old Habit / Mistake vs The Book Principle
 */
const ComparisonSceneCard: React.FC<{ scene: BookSummaryScene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();

  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftSpring = spring({ frame: Math.max(0, frame - 4), fps, config: { damping: 14, stiffness: 90 } });
  const rightSpring = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 14, stiffness: 90 } });
  const vsSpring = spring({ frame: Math.max(0, frame - 7), fps, config: { damping: 10, stiffness: 180 } });

  const leftTitle = scene.comparisonLeftTitle || 'THE OLD WAY / MISTAKE';
  const rightTitle = scene.comparisonRightTitle || 'THE BOOK PRINCIPLE';
  const leftContent = scene.comparisonLeft || 'Reactive habits & short-term impulses';
  const rightContent = scene.comparisonRight || scene.text || 'Compounding daily execution & intentional focus';

  const leftX = interpolate(leftSpring, [0, 1], [-40, 0]);
  const rightX = interpolate(rightSpring, [0, 1], [40, 0]);
  const vsScale = interpolate(vsSpring, [0, 1], [0.3, 1.0]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '50px 90px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1360px',
        }}
      >
        {/* Header Kicker */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px',
            opacity: headerSpring,
            transform: `translateY(${interpolate(headerSpring, [0, 1], [-20, 0])}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 22px',
              borderRadius: '9999px',
              backgroundColor: '#FFEDD5',
              border: '1px solid rgba(234, 88, 12, 0.3)',
              color: '#EA580C',
              fontSize: '15px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
            }}
          >
            <span>⚖️ PARADIGM SHIFT</span>
          </div>
        </div>

        {/* 2-Column Comparison Layout with VS Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Left Column: Old Way / Mistake */}
          <div
            style={{
              flex: 1,
              borderRadius: '28px',
              border: '1.5px solid rgba(239, 68, 68, 0.3)',
              backgroundColor: '#FEF2F2',
              padding: '42px 40px',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.06)',
              opacity: leftSpring,
              transform: `translateX(${leftX}px)`,
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#DC2626',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '16px',
                }}
              >
                ✕ {leftTitle}
              </span>

              <p
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#1E293B',
                  lineHeight: 1.3,
                  margin: 0,
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {leftContent}
              </p>
            </div>

            <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 600 }}>Unconscious Friction</span>
          </div>

          {/* Center VS Badge */}
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              transform: `scale(${vsScale})`,
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#EA580C',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 900,
              boxShadow: '0 8px 24px rgba(234, 88, 12, 0.35)',
              border: '3px solid #FFFFFF',
            }}
          >
            VS
          </div>

          {/* Right Column: The Book Principle */}
          <div
            style={{
              flex: 1,
              borderRadius: '28px',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              backgroundColor: '#ECFDF5',
              padding: '42px 40px',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.06)',
              opacity: rightSpring,
              transform: `translateX(${rightX}px)`,
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#D1FAE5',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#059669',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '16px',
                }}
              >
                ✓ {rightTitle}
              </span>

              <p
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.3,
                  margin: 0,
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {rightContent}
              </p>
            </div>

            <span style={{ fontSize: '14px', color: '#059669', fontWeight: 700 }}>High-Leverage Breakthrough</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 5. KEY_STEPS Scene Component (Learned from Faceless Video)
 * 3 Actionable Pillars / Numbered Roadmap
 */
const KeyStepsSceneCard: React.FC<{ scene: BookSummaryScene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const rawSteps = scene.steps && scene.steps.length > 0
    ? scene.steps
    : ['Identify highest leverage point', 'Establish consistent daily ritual', 'Compound results systematically'];
  const steps = rawSteps.slice(0, 3);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '60px 100px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1280px',
        }}
      >
        {/* Title Header */}
        <div
          style={{
            opacity: titleSpring,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [-20, 0])}px)`,
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 22px',
              borderRadius: '9999px',
              backgroundColor: '#FFEDD5',
              border: '1px solid rgba(234, 88, 12, 0.3)',
              color: '#EA580C',
              fontSize: '15px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              marginBottom: '12px',
            }}
          >
            <span>⚡ {scene.subtitle || 'ACTION ROADMAP'}</span>
          </div>
          <h2
            style={{
              fontSize: '44px',
              fontWeight: 900,
              color: '#0F172A',
              margin: 0,
              letterSpacing: '-1px',
            }}
          >
            {scene.text || 'Core Implementation Framework'}
          </h2>
        </div>

        {/* Staggered Step Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '1080px' }}>
          {steps.map((step, idx) => {
            const stepSpring = spring({
              frame: Math.max(0, frame - 5 - idx * 6),
              fps,
              config: { damping: 14, stiffness: 100 },
            });
            const translateY = interpolate(stepSpring, [0, 1], [30, 0]);

            return (
              <div
                key={idx}
                style={{
                  opacity: stepSpring,
                  transform: `translateY(${translateY}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '24px',
                  padding: '24px 32px',
                  boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    backgroundColor: '#FFEDD5',
                    color: '#EA580C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 900,
                    flexShrink: 0,
                    border: '1.5px solid rgba(234, 88, 12, 0.3)',
                  }}
                >
                  0{idx + 1}
                </div>
                <p
                  style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 6. STAT_INSIGHT Scene Component (Learned from Faceless Video)
 * High-impact metric / power law callout
 */
const StatInsightSceneCard: React.FC<{ scene: BookSummaryScene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const scale = interpolate(entrance, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const statVal = scene.statValue || '80 / 20';
  const statLbl = scene.statLabel || 'The Core Compounding Principle';

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 80px' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          maxWidth: '1200px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid rgba(234, 88, 12, 0.3)',
          borderRadius: '36px',
          padding: '60px 80px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 35px rgba(234, 88, 12, 0.1)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFEDD5',
            border: '1px solid rgba(234, 88, 12, 0.35)',
            borderRadius: '999px',
            padding: '8px 24px',
            fontSize: '16px',
            fontWeight: 800,
            color: '#EA580C',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
          }}
        >
          <span>📊 {statLbl}</span>
        </div>

        <div
          style={{
            fontSize: '96px',
            fontWeight: 900,
            lineHeight: 1.0,
            color: '#EA580C',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-3px',
          }}
        >
          {statVal}
        </div>

        <p
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.3,
            maxWidth: '920px',
            margin: 0,
          }}
        >
          {scene.text}
        </p>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 7. QUOTE Scene Component (Clean White Theme)
 * Editorial serif quotation card with author portrait
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
          gap: '24px',
          maxWidth: '1300px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          border: '1.5px solid rgba(234, 88, 12, 0.25)',
          borderRadius: '36px',
          padding: '60px 80px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 35px rgba(234, 88, 12, 0.08)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: '84px',
            lineHeight: 0.5,
            color: '#EA580C',
            opacity: 0.6,
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
            color: '#0F172A',
            lineHeight: 1.35,
            margin: 0,
            fontFamily: 'Georgia, Fraunces, serif',
          }}
        >
          {scene.text}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '10px' }}>
          {hasPortrait && (
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid #EA580C',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
              }}
            >
              <Img src={resolveAssetUrl(scene.assetUrl)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <span style={{ fontSize: '24px', fontWeight: 900, color: '#EA580C', letterSpacing: '0.5px' }}>
            — {scene.authorName || 'The Author'}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 8. CONCLUSION Scene Component (Learned from Faceless Video)
 * Final core takeaway & action directive card
 */
const ConclusionSceneCard: React.FC<{ scene: BookSummaryScene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const scale = interpolate(entrance, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 80px' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          maxWidth: '1240px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(234, 88, 12, 0.4)',
          borderRadius: '36px',
          padding: '64px 84px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 40px rgba(234, 88, 12, 0.12)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFEDD5',
            border: '1px solid rgba(234, 88, 12, 0.35)',
            borderRadius: '999px',
            padding: '8px 24px',
            fontSize: '16px',
            fontWeight: 800,
            color: '#EA580C',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
          }}
        >
          <span>🎯 FINAL TAKEAWAY</span>
        </div>

        <h2
          style={{
            fontSize: '52px',
            fontWeight: 900,
            color: '#0F172A',
            lineHeight: 1.22,
            margin: 0,
            letterSpacing: '-1.5px',
          }}
        >
          {scene.text}
        </h2>

        {scene.subtitle && (
          <p style={{ fontSize: '22px', fontWeight: 700, color: '#64748B', margin: 0 }}>
            {scene.subtitle}
          </p>
        )}
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

  // Show bottom captions during CAPTIONS scenes or gaps between visual cards
  const showBottomCaptions = !activeScene || activeScene.type === 'CAPTIONS';

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAFA' }}>
      {/* 1. Main Spoken Audio Track */}
      {activeAudioUrl && <Audio src={resolveUrl(activeAudioUrl)} volume={1.0} />}

      {/* 2. Background Music Track (User selectable with default 12% volume) */}
      {activeBgmUrl !== 'none' && (
        <Audio
          src={resolveUrl(activeBgmUrl || 'assets/reusable/music/parasail-silent-partner.mp3')}
          volume={typeof bgmVolume === 'number' ? bgmVolume : 0.12}
          loop
        />
      )}

      {/* 2.5 Sound Effects (SFX) Timed on Scene Transitions */}
      {scenes.filter(s => !s.disabled).map((s, idx) => {
        const startFrame = Math.round(s.startSeconds * fps);
        if (startFrame < 0) return null;
        const sfxFile =
          s.type === 'BOOK_COVER' || s.type === 'LESSON_TITLE'
            ? 'assets/reusable/sfx/chime.mp3'
            : s.type === 'KEY_IDEA' || s.type === 'STAT_INSIGHT'
            ? 'assets/reusable/sfx/ding.mp3'
            : 'assets/reusable/sfx/pop.mp3';

        return (
          <Sequence key={`sfx-${s.id || idx}`} from={startFrame} durationInFrames={Math.round(fps * 1.5)}>
            <Audio src={resolveUrl(sfxFile)} volume={0.22} />
          </Sequence>
        );
      })}

      {/* 3. Ambient Dynamic Visual Background (Clean White Theme) */}
      <SubtleAmbientBackground frame={frame} fps={fps} />

      {/* 4. Active Visual Scene Render (8 Distinct Dynamic Scene Types) */}
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

      {activeScene && activeScene.type === 'COMPARISON' && (
        <ComparisonSceneCard scene={activeScene} fps={fps} />
      )}

      {activeScene && activeScene.type === 'KEY_STEPS' && (
        <KeyStepsSceneCard scene={activeScene} fps={fps} />
      )}

      {activeScene && activeScene.type === 'STAT_INSIGHT' && (
        <StatInsightSceneCard scene={activeScene} fps={fps} />
      )}

      {activeScene && activeScene.type === 'QUOTE' && (
        <QuoteSceneCard scene={activeScene} fps={fps} />
      )}

      {activeScene && activeScene.type === 'CONCLUSION' && (
        <ConclusionSceneCard scene={activeScene} fps={fps} />
      )}

      {/* 5. Animated Subtitles Layer Styled for Clean White Background */}
      {showBottomCaptions && (
        <UniversalCaptionLayer
          captions={activeCaptions}
          captionThemeId={captionThemeId}
          backgroundTheme="solid-white"
          styleOverrides={{
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            border: '1.5px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
            color: '#0F172A',
            textShadow: 'none',
            filter: 'none',
          }}
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
      const maxDur = 600; // 10 minutes strictly per Rule 4.1
      const durationSeconds = Math.max(5, Math.min(maxDur, rawDuration));
      return {
        durationInFrames: Math.round(durationSeconds * 30),
        fps: 30,
        width: 1920,
        height: 1080,
      };
    }}
  />
);

