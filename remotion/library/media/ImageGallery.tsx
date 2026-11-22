import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GalleryItem {
  src: string;
  alt?: string;
  title?: string;
  tag?: string;
}

export interface ImageGalleryProps {
  items?: GalleryItem[];
  layout?: 'grid-2x2' | 'grid-3x1' | 'staggered-stack' | 'filmstrip';
  gap?: number;
  borderRadius?: number;
  activeIndex?: number;
  staggerFrames?: number;
  width?: string | number;
  height?: string | number;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    title: 'Visual Architecture',
    tag: 'Design',
  },
  {
    src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    title: 'Color Gradients',
    tag: 'Palette',
  },
  {
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    title: 'Technology Core',
    tag: 'Hardware',
  },
  {
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    title: 'Algorithmic Data',
    tag: 'Code',
  },
];

/**
 * ImageGallery — Multi-image grid and animated filmstrip gallery.
 * Staggers entrance of visual assets with spring bounce and active focus highlights.
 */
export function ImageGallery({
  items = DEFAULT_GALLERY,
  layout = 'grid-2x2',
  gap = 16,
  borderRadius = 14,
  activeIndex,
  staggerFrames = 4,
  width = '100%',
  height = 'auto',
}: ImageGalleryProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const getGridStyle = (): React.CSSProperties => {
    switch (layout) {
      case 'grid-3x1':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap,
        };
      case 'filmstrip':
        return {
          display: 'flex',
          overflow: 'hidden',
          gap,
          width: '100%',
        };
      case 'staggered-stack':
        return {
          position: 'relative',
          height: 380,
          width: '100%',
        };
      case 'grid-2x2':
      default:
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap,
        };
    }
  };

  return (
    <div style={{ width, height, ...getGridStyle() }}>
      {items.map((item, index) => {
        const itemFrame = Math.max(0, frame - index * staggerFrames);
        const spr = spring({
          frame: itemFrame,
          fps,
          config: { damping: 14, stiffness: 120, mass: 0.8 },
        });

        const scale = interpolate(spr, [0, 1], [0.85, 1]);
        const opacity = interpolate(spr, [0, 1], [0, 1]);
        const translateY = interpolate(spr, [0, 1], [30, 0]);

        const isActive = activeIndex === undefined || activeIndex === index;

        // Custom stack layout
        if (layout === 'staggered-stack') {
          const stackOffset = index * 24;
          const stackRotation = (index - 1.5) * 4;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: stackOffset,
                left: `calc(50% - 160px + ${index * 30}px)`,
                width: 320,
                height: 220,
                borderRadius,
                overflow: 'hidden',
                border: '2px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                transform: `rotate(${stackRotation}deg) translateY(${translateY}px) scale(${scale})`,
                opacity,
                zIndex: index,
                backgroundColor: '#18181b',
              }}
            >
              <Img
                src={item.src}
                alt={item.alt || item.title || `Gallery Item ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {item.title && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    right: 8,
                    padding: '6px 12px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(9, 9, 11, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {item.title}
                </div>
              )}
            </div>
          );
        }

        return (
          <div
            key={index}
            style={{
              position: 'relative',
              borderRadius,
              overflow: 'hidden',
              border: isActive
                ? '2px solid rgba(16, 185, 129, 0.6)'
                : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: isActive
                ? '0 12px 28px rgba(16, 185, 129, 0.25), 0 4px 12px rgba(0,0,0,0.5)'
                : '0 8px 24px rgba(0, 0, 0, 0.4)',
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity: isActive ? opacity : opacity * 0.5,
              backgroundColor: '#18181b',
              minHeight: 160,
              aspectRatio: '16/10',
            }}
          >
            <Img
              src={item.src}
              alt={item.alt || item.title || `Gallery item ${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(9, 9, 11, 0.85) 0%, transparent 60%)',
              }}
            />

            {(item.title || item.tag) && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  right: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {item.title && (
                  <span
                    style={{
                      color: '#f4f4f5',
                      fontSize: 13,
                      fontWeight: 600,
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    }}
                  >
                    {item.title}
                  </span>
                )}
                {item.tag && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 9999,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(6px)',
                      color: '#a1a1aa',
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    {item.tag}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
