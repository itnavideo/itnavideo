import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AgendaChapter {
  number: number | string;
  title: string;
  durationOrPages?: string;
  description?: string;
  isActive?: boolean;
}

export interface TableOfContentsInfographicProps {
  title?: string;
  subtitle?: string;
  chapters: AgendaChapter[];
  activeChapterIndex?: number;
  isDark?: boolean;
  accentColor?: string;
  sceneFrame?: number;
}

/**
 * TableOfContentsInfographic
 * Executive PowerPoint / Keynote agenda & table of contents infographic slide.
 * Highlights the roadmap of video topics with sleek numbered blocks and active chapter glows.
 */
export const TableOfContentsInfographic: React.FC<TableOfContentsInfographicProps> = ({
  title = 'Table of Contents',
  subtitle = 'Today’s core discussion agenda & key takeaways',
  chapters,
  activeChapterIndex = 0,
  isDark = false,
  accentColor = '#EA580C',
  sceneFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });

  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.11)' : 'rgba(30, 41, 59, 0.08)';
  const textPrimary = isDark ? '#F8FAFC' : '#141414';
  const textSecondary = isDark ? '#94A3B8' : '#2C2B29';

  const activeChapters = chapters.slice(0, 5);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '50px 80px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          transform: `translateY(${(1 - headerSpring) * -20}px)`,
          opacity: headerSpring,
          marginBottom: '28px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '6px',
              height: '32px',
              backgroundColor: accentColor,
              borderRadius: '3px',
            }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: '36px',
              fontFamily: 'Lora, "Playfair Display", Georgia, serif',
              fontWeight: 700,
              color: textPrimary,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>
        </div>
        {subtitle && (
          <p
            style={{
              margin: '8px 0 0 20px',
              fontSize: '18px',
              fontWeight: 500,
              color: textSecondary,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* ── CHAPTER LIST CARDS ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '14px',
          width: '100%',
        }}
      >
        {activeChapters.map((chapter, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - (8 + idx * 5)),
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const isCurrent = idx === activeChapterIndex || chapter.isActive;
          const formattedNumber = typeof chapter.number === 'number'
            ? String(chapter.number).padStart(2, '0')
            : chapter.number;

          return (
            <div
              key={`chapter-${idx}`}
              style={{
                transform: `translateX(${(1 - itemSpring) * -25}px) scale(${0.98 + itemSpring * 0.02})`,
                opacity: itemSpring,
                borderRadius: '18px',
                backgroundColor: isCurrent
                  ? (isDark ? 'rgba(30, 41, 59, 0.95)' : '#FFFFFF')
                  : cardBg,
                border: isCurrent
                  ? `2px solid ${accentColor}`
                  : `1.5px solid ${cardBorder}`,
                boxShadow: isCurrent
                  ? (isDark ? `0 14px 36px ${accentColor}33` : '0 16px 36px rgba(234, 88, 12, 0.16)')
                  : (isDark ? '0 8px 20px rgba(0,0,0,0.3)' : '0 8px 20px rgba(180, 160, 140, 0.12)'),
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease',
              }}
            >
              {/* Left: Number + Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: isCurrent ? accentColor : textSecondary,
                    minWidth: '36px',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formattedNumber}
                </span>

                <div
                  style={{
                    width: '2px',
                    height: '24px',
                    backgroundColor: isCurrent ? accentColor : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(30,41,59,0.1)'),
                  }}
                />

                <div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: isCurrent ? 650 : 600,
                      color: isCurrent ? textPrimary : textSecondary,
                    }}
                  >
                    {chapter.title}
                  </div>
                  {chapter.description && (
                    <div style={{ fontSize: '13px', color: textSecondary, marginTop: '2px' }}>
                      {chapter.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Badge or Duration */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isCurrent && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 650,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                      backgroundColor: accentColor,
                    }}
                  >
                    ● NOW PLAYING
                  </span>
                )}

                {chapter.durationOrPages && (
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: textSecondary,
                    }}
                  >
                    {chapter.durationOrPages}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

