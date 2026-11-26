import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Lottie, type LottieAnimationData } from '@remotion/lottie';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface LottieSceneProps {
  heading?: string;
  supportingText?: string;
  lottieUrl?: string;
  animationData?: LottieAnimationData;
  playbackRate?: number;
  accentColor?: string;
  headingFont?: string;
  typographyFont?: string;
  palette?: BackgroundColorPalette;
}

/**
 * Remotion @remotion/lottie animated vector scene.
 * Loads remote/local Lottie JSON safely via delayRender, with deterministic
 * spring fallback badge when no Lottie JSON is supplied.
 */
export const LottieScene: React.FC<LottieSceneProps> = ({
  heading = 'Animated Concept',
  supportingText = 'Smooth vector motion synced directly to your narration timeline.',
  lottieUrl,
  animationData: initialData,
  playbackRate = 1,
  accentColor = '#EA580C',
  headingFont = 'Inter, sans-serif',
  typographyFont = 'Inter, sans-serif',
  palette,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [loadedData, setLoadedData] = useState<LottieAnimationData | null>(initialData ?? null);
  const [handle] = useState<number | null>(() => (lottieUrl && !initialData ? delayRender('Loading Lottie JSON') : null));

  useEffect(() => {
    if (initialData) {
      setLoadedData(initialData);
      if (handle !== null) continueRender(handle);
      return;
    }
    if (!lottieUrl) return;

    let cancelled = false;
    fetch(lottieUrl)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json && typeof json === 'object') {
          setLoadedData(json as LottieAnimationData);
        }
      })
      .catch(() => {
        // Fallback gracefully to vector badge
      })
      .finally(() => {
        if (handle !== null) continueRender(handle);
      });

    return () => {
      cancelled = true;
    };
  }, [lottieUrl, initialData, handle]);

  const isDark = palette?.isDark ?? false;
  const textPrimary = palette?.textPrimary ?? (isDark ? '#FFFFFF' : '#0F172A');
  const textSecondary = palette?.textSecondary ?? (isDark ? '#94A3B8' : '#475569');
  const cardBg = palette?.cardBg ?? (isDark ? 'rgba(15, 23, 42, 0.82)' : '#FFFFFF');
  const cardBorder = palette?.cardBorder ?? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.1)');
  const accent = accentColor || palette?.accent || '#EA580C';

  const entry = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const pulse = 1 + Math.sin((frame / fps) * 3) * 0.04;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '72px',
        padding: '0 100px',
        opacity: entry,
        transform: `translateY(${interpolate(entry, [0, 1], [24, 0])}px)`,
      }}
    >
      {/* Left: Lottie Canvas or Graceful Animated Vector Fallback */}
      <div
        style={{
          width: '440px',
          height: '440px',
          borderRadius: '36px',
          backgroundColor: cardBg,
          border: `1.5px solid ${cardBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isDark
            ? '0 24px 60px rgba(0,0,0,0.45)'
            : '0 24px 60px rgba(15,23,42,0.08)',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {loadedData ? (
          <Lottie
            animationData={loadedData}
            playbackRate={playbackRate}
            style={{ width: '360px', height: '360px' }}
          />
        ) : (
          <div
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${accent}33 0%, ${accent}11 70%, transparent 100%)`,
              border: `3px solid ${accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${pulse})`,
            }}
          >
            <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
        )}
      </div>

      {/* Right: Editorial Copy */}
      <div style={{ maxWidth: '640px', textAlign: 'left' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            borderRadius: '9999px',
            backgroundColor: `${accent}18`,
            border: `1px solid ${accent}44`,
            color: accent,
            fontFamily: typographyFont,
            fontSize: '16px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '20px',
          }}
        >
          Motion Graphic
        </div>
        <h2
          style={{
            fontFamily: headingFont,
            fontSize: '54px',
            fontWeight: 900,
            lineHeight: 1.12,
            color: textPrimary,
            margin: '0 0 20px',
          }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontFamily: typographyFont,
            fontSize: '25px',
            fontWeight: 500,
            lineHeight: 1.48,
            color: textSecondary,
            margin: 0,
          }}
        >
          {supportingText}
        </p>
      </div>
    </div>
  );
};

