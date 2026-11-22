import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProductShowcaseProps {
  title?: string;
  brand?: string;
  price?: string;
  originalPrice?: string;
  rating?: number;
  reviewCount?: string;
  discountBadge?: string;
  imageSrc?: string;
  stockStatus?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ProductShowcase — High-converting physical & digital product showcase card.
 * Features product photo zoom, 5-star rating badge, discount ribbon,
 * stock status indicator, and dynamic Buy CTA button.
 */
export function ProductShowcase({
  title = 'Autonomous Studio Microphone Pro',
  brand = 'ITNA AUDIO LABS',
  price = '$189.00',
  originalPrice = '$249.00',
  rating = 4.9,
  reviewCount = '2,480 Reviews',
  discountBadge = 'SAVE 25%',
  imageSrc = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
  stockStatus = 'Only 4 Units Left in Stock',
  accentColor = '#10b981',
  delay = 0,
  width = 380,
  height = 420,
}: ProductShowcaseProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Subtle product float
  const floatY = Math.sin(adjustedFrame * 0.05) * 4;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 20,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `translateY(${floatY}px) scale(${scale})`,
        opacity,
      }}
    >
      {/* Top Ribbon: Brand & Discount Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#71717a', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em' }}>
          {brand}
        </span>

        {discountBadge && (
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: '#ef4444',
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)',
            }}
          >
            {discountBadge}
          </span>
        )}
      </div>

      {/* Center: Product Image Showcase */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 180,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#18181b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <Img
          src={imageSrc}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />

        {/* Stock status indicator pill */}
        {stockStatus && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              padding: '3px 8px',
              borderRadius: 4,
              backgroundColor: 'rgba(9, 9, 11, 0.85)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#f59e0b',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <span>{stockStatus}</span>
          </div>
        )}
      </div>

      {/* Bottom Product Details & Pricing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Title & Star Rating */}
        <div>
          <h4 style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 800, lineHeight: 1.25 }}>
            {title}
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#f59e0b', fontSize: 13 }}>★★★★★</span>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{rating}</span>
            <span style={{ color: '#71717a', fontSize: 11 }}>({reviewCount})</span>
          </div>
        </div>

        {/* Price & Add to Cart CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 900, fontFamily: 'monospace' }}>
              {price}
            </span>
            {originalPrice && (
              <span style={{ color: '#71717a', fontSize: 13, textDecoration: 'line-through' }}>
                {originalPrice}
              </span>
            )}
          </div>

          <button
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              backgroundColor: accentColor,
              color: '#09090b',
              fontSize: 12,
              fontWeight: 900,
              border: 'none',
              boxShadow: `0 4px 14px ${accentColor}60`,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>🛒</span>
            <span>ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
}
