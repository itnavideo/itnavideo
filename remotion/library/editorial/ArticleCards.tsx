import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ArticleItem {
  title: string;
  publication: string;
  readTime: string;
  date: string;
  author: string;
  authorAvatar?: string;
  coverImage?: string;
  claps?: string;
}

export interface ArticleCardsProps {
  articles?: ArticleItem[];
  staggerFrames?: number;
  delay?: number;
  width?: number | string;
}

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    title: 'How Remotion and Lambda Revolutionized Programmatic Video Rendering',
    publication: 'TOWARDS VIDEO AI',
    readTime: '6 min read',
    date: 'Nov 20, 2026',
    author: 'Alex Thorne',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    claps: '4.8K',
  },
  {
    title: 'The Math Behind 60 FPS Subtitle Synchronization on Vertical Reels',
    publication: 'FRONTEND ARCHITECTURE',
    readTime: '4 min read',
    date: 'Nov 18, 2026',
    author: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80',
    claps: '2.3K',
  },
];

/**
 * ArticleCards — Modern online publication article cards.
 * Displays article metadata, reading time pill, author avatar,
 * cover thumbnail, and applause/bookmark metrics.
 */
export function ArticleCards({
  articles = DEFAULT_ARTICLES,
  staggerFrames = 8,
  delay = 0,
  width = '100%',
}: ArticleCardsProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width }}>
      {articles.map((item, index) => {
        const itemFrame = Math.max(0, frame - delay - index * staggerFrames);
        const entrySpr = spring({
          frame: itemFrame,
          fps,
          config: { damping: 14, stiffness: 100, mass: 0.8 },
        });

        const translateY = interpolate(entrySpr, [0, 1], [30, 0]);
        const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

        return (
          <div
            key={index}
            style={{
              backgroundColor: '#09090b',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 18,
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
              transform: `translateY(${translateY}px)`,
              opacity,
            }}
          >
            {/* Left Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Publication & Read Time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#10b981', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em' }}>
                  {item.publication}
                </span>
                <span style={{ color: '#71717a', fontSize: 10 }}>•</span>
                <span style={{ color: '#a1a1aa', fontSize: 10, fontWeight: 600 }}>{item.readTime}</span>
              </div>

              {/* Title */}
              <h4
                style={{
                  margin: 0,
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                }}
              >
                {item.title}
              </h4>

              {/* Author Row & Claps */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.authorAvatar && (
                    <Img
                      src={item.authorAvatar}
                      alt={item.author}
                      style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                  <span style={{ color: '#d4d4d8', fontSize: 12, fontWeight: 600 }}>{item.author}</span>
                  <span style={{ color: '#71717a', fontSize: 11 }}>• {item.date}</span>
                </div>

                {item.claps && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#38bdf8', fontSize: 11, fontWeight: 700 }}>
                    <span>👏</span>
                    <span>{item.claps}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Cover Thumbnail */}
            {item.coverImage && (
              <div
                style={{
                  width: 100,
                  height: 80,
                  borderRadius: 10,
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Img
                  src={item.coverImage}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
