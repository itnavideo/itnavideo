import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ShoppingInterfaceProps {
  productName?: string;
  itemPrice?: number;
  quantity?: number;
  shipping?: number;
  promoDiscount?: number;
  delay?: number;
  width?: number | string;
}

/**
 * ShoppingInterface — E-commerce checkout & cart drawer interface.
 * Features item quantity selector, calculated subtotal, promo code discount,
 * shipping calculation, and Pay CTA button.
 */
export function ShoppingInterface({
  productName = 'Studio Microphone Ultra Pro',
  itemPrice = 189.00,
  quantity = 1,
  shipping = 0,
  promoDiscount = 30.00,
  delay = 0,
  width = 360,
}: ShoppingInterfaceProps) {
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

  const subtotal = itemPrice * quantity;
  const total = subtotal - promoDiscount + shipping;

  return (
    <div
      style={{
        position: 'relative',
        width,
        backgroundColor: '#09090b',
        borderRadius: 18,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Drawer Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 12 }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 800 }}>Order Summary (1 Item)</h3>
        <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700 }}>FREE SHIPPING</span>
      </div>

      {/* Cart Item Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b', padding: '10px 14px', borderRadius: 10 }}>
        <div>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, display: 'block' }}>{productName}</span>
          <span style={{ color: '#a1a1aa', fontSize: 11 }}>QTY: {quantity} • Express Delivery</span>
        </div>
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 800, fontFamily: 'monospace' }}>
          ${itemPrice.toFixed(2)}
        </span>
      </div>

      {/* Breakdown Calculations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#a1a1aa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <span style={{ color: '#fff', fontFamily: 'monospace' }}>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Promo Code (ITNA30)</span>
          <span style={{ color: '#10b981', fontWeight: 700, fontFamily: 'monospace' }}>-${promoDiscount.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Estimated Shipping</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
        </div>
      </div>

      {/* Total Due & Pay CTA */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>TOTAL AMOUNT</span>
          <span style={{ color: '#fff', fontSize: 24, fontWeight: 900, fontFamily: 'monospace' }}>
            ${total.toFixed(2)}
          </span>
        </div>

        <button
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 10,
            backgroundColor: '#10b981',
            color: '#09090b',
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: '0.04em',
            border: 'none',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
            cursor: 'pointer',
          }}
        >
          COMPLETE ORDER ➔
        </button>
      </div>
    </div>
  );
}
