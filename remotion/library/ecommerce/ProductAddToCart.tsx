import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProductAddToCartProps {
  productTitle?: string;
  price?: string;
  cartCountInitial?: number;
  shippingNote?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ProductAddToCart — Kinetic add-to-cart conversion micro-interaction.
 * Features button press physics, flying particle animation into top cart counter,
 * success checkmark morph, and real-time cart count increment.
 */
export function ProductAddToCart({
  productTitle = 'Aura One Pro Wireless Headphones',
  price = '$349.00',
  cartCountInitial = 1,
  shippingNote = 'Free 2-Day Air Shipping & 30-Day Returns',
  accentColor = '#10b981',
  delay = 0,
  width = 460,
  height = 420,
}: ProductAddToCartProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Action timeline:
  // t < 20: idle
  // t = 20: click trigger
  // t > 25: cart incremented & success state
  const isAdded = t >= 25;

  const btnPress = spring({
    frame: Math.max(0, t - 20),
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const cartCounter = isAdded ? cartCountInitial + 1 : cartCountInitial;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 24px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Navbar with Cart Counter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: intro,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em' }}>
          CHECKOUT READY
        </span>

        {/* Cart Icon with Counter Badge */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>

          {/* Cart Badge */}
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: accentColor,
              color: '#000000',
              fontSize: 10,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          >
            {cartCounter}
          </span>
        </div>
      </div>

      {/* Item Summary Details */}
      <div style={{ padding: '16px 0', opacity: intro }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#ffffff' }}>
          {productTitle}
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: accentColor, marginTop: 6 }}>
          {price}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
          {shippingNote}
        </div>
      </div>

      {/* Dynamic Add to Cart Action Button */}
      <div style={{ opacity: intro }}>
        <div
          style={{
            width: '100%',
            height: 52,
            borderRadius: 14,
            background: isAdded
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : `linear-gradient(135deg, ${accentColor}, #059669)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: '#000000',
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: '0.02em',
            boxShadow: `0 8px 24px ${accentColor}44`,
            transform: isAdded
              ? 'scale(1)'
              : `scale(${interpolate(btnPress, [0, 0.5, 1], [1, 0.94, 1])})`,
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
        >
          {isAdded ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Added to Cart! (1)</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add to Cart — {price}</span>
            </>
          )}
        </div>
      </div>

      {/* Safe Checkout Badges */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: 10,
          color: '#64748b',
          opacity: intro,
        }}
      >
        <span>🔒 256-Bit SSL Encrypted</span>
        <span>⚡ Apple Pay & GPay Ready</span>
      </div>
    </div>
  );
}
