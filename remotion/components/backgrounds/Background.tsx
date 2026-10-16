import React, { useMemo } from 'react';
import { interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { BACKGROUND_CATALOG } from './BackgroundCatalog';

export interface BackgroundProps {
  theme?: string;
  customBgUrl?: string;
  aspectRatio?: '9:16' | '16:9';
  children?: React.ReactNode;
}

/**
 * High-performance, code-based Video Background Component for Remotion Lambda.
 *
 * Rules:
 * 1. 100% Deterministic: All motion driven by useCurrentFrame() - zero CSS transitions.
 * 2. Deterministic Particles: Seeded via Remotion random(seed) - zero frame-to-frame jitter.
 * 3. Lambda-Optimized: Lightweight SVG & CSS gradients without heavy 80px blurs or box-shadows.
 * 4. Infinite Resolution: Sharp at 1080p, 4K, 16:9 widescreen or 9:16 vertical.
 */
export function Background({
  theme = 'midnight-mesh',
  customBgUrl = '',
  aspectRatio = '16:9',
  children,
}: BackgroundProps) {
  const frame = useCurrentFrame();
  const { fps, width = 1920, height = 1080 } = useVideoConfig();

  // Normalize theme or fallback
  const activeId = (theme || 'midnight-mesh').toLowerCase().trim();
  const matched = BACKGROUND_CATALOG.find((b) => b.id === activeId) || BACKGROUND_CATALOG[0];
  const isLight = activeId === 'studio-white';

  // Seeded particles generator (28 deterministic particles)
  const particles = useMemo(() => {
    const list = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        xRatio: random(`p-x-${i}`),
        yRatio: random(`p-y-${i}`),
        size: 2.5 + random(`p-sz-${i}`) * 4.5,
        speed: 0.6 + random(`p-sp-${i}`) * 1.4,
        opacityPhase: random(`p-op-${i}`) * Math.PI * 2,
        colorType: i % 3,
      });
    }
    return list;
  }, []);

  // ── 1. GRADIENT BACKGROUNDS ──
  const renderGradient = () => {
    if (activeId === 'aurora-borealis') {
      const shiftX1 = 30 + Math.sin(frame * 0.02) * 15;
      const shiftY1 = 25 + Math.cos(frame * 0.015) * 12;
      const shiftX2 = 70 + Math.cos(frame * 0.018) * 15;
      const shiftY2 = 65 + Math.sin(frame * 0.022) * 14;

      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#020B14', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(circle at ${shiftX1}% ${shiftY1}%, rgba(16, 185, 129, 0.35) 0%, transparent 55%),
                radial-gradient(circle at ${shiftX2}% ${shiftY2}%, rgba(6, 182, 212, 0.30) 0%, transparent 60%),
                radial-gradient(circle at 50% 90%, rgba(139, 92, 246, 0.25) 0%, transparent 60%)
              `,
            }}
          />
        </div>
      );
    }

    if (activeId === 'sunset-horizon') {
      const pulse = 45 + Math.sin(frame * 0.025) * 8;
      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#0A0503', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 90% 60% at 50% ${pulse}%, rgba(255, 87, 34, 0.40) 0%, rgba(255, 160, 0, 0.20) 45%, transparent 75%),
                linear-gradient(180deg, #070305 0%, #170705 60%, #050203 100%)
              `,
            }}
          />
        </div>
      );
    }

    if (activeId === 'neon-twilight') {
      const posX = 50 + Math.sin(frame * 0.02) * 20;
      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#060212', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 80% 50% at ${posX}% 40%, rgba(139, 92, 246, 0.38) 0%, transparent 65%),
                radial-gradient(ellipse 60% 45% at 30% 70%, rgba(37, 99, 235, 0.28) 0%, transparent 60%)
              `,
            }}
          />
        </div>
      );
    }

    // Default: 'midnight-mesh' (Deep obsidian, indigo, and flame amber pulse)
    const meshX = 50 + Math.sin(frame * 0.018) * 15;
    const meshY = 40 + Math.cos(frame * 0.015) * 12;
    const meshX2 = 80 + Math.cos(frame * 0.02) * 12;

    return (
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#05070D', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 70% 55% at ${meshX}% ${meshY}%, rgba(30, 27, 75, 0.75) 0%, transparent 70%),
              radial-gradient(circle at ${meshX2}% 75%, rgba(255, 87, 34, 0.22) 0%, transparent 50%),
              radial-gradient(circle at 15% 25%, rgba(14, 165, 233, 0.16) 0%, transparent 45%),
              linear-gradient(180deg, #05070E 0%, #090E1A 100%)
            `,
          }}
        />
      </div>
    );
  };

  // ── 2. MINIMAL BACKGROUNDS ──
  const renderMinimal = () => {
    if (activeId === 'studio-white') {
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FAFAFA',
            backgroundImage: `radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F1F5F9 80%, #E2E8F0 100%)`,
          }}
        />
      );
    }

    if (activeId === 'dark-paper') {
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#0C0E14',
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%),
              linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 24px 24px, 24px 24px',
          }}
        />
      );
    }

    if (activeId === 'deep-slate') {
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#0B0F19',
            backgroundImage: `radial-gradient(circle at 50% 45%, #111827 0%, #0B0F19 75%, #05080F 100%)`,
          }}
        />
      );
    }

    // Default 'studio-dark' (Obsidian #070B14)
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#070B14',
          backgroundImage: `radial-gradient(circle at 50% 40%, rgba(30, 41, 59, 0.45) 0%, #070B14 70%, #030509 100%)`,
        }}
      />
    );
  };

  // ── 3. TECH BACKGROUNDS (Grids, Dots, Neon Scanlines, Circuit) ──
  const renderTech = () => {
    if (activeId === 'matrix-dots') {
      const dotPulse = Math.sin(frame * 0.035) * 0.04;
      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#040812', overflow: 'hidden' }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id="matrix-dot-pat" width="36" height="36" patternUnits="userSpaceOnUse">
                <circle cx="18" cy="18" r="1.6" fill={`rgba(6, 182, 212, ${0.18 + dotPulse})`} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#matrix-dot-pat)" />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.12) 0%, transparent 65%)`,
              pointerEvents: 'none',
            }}
          />
        </div>
      );
    }

    if (activeId === 'neon-scanlines') {
      const scanY = (frame * 1.5) % height;
      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#050A14', overflow: 'hidden' }}>
          {/* Scanline pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
              backgroundSize: '100% 4px',
            }}
          />
          {/* Sweeping laser line */}
          <div
            style={{
              position: 'absolute',
              top: `${scanY}px`,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(14, 165, 233, 0.8) 50%, transparent 100%)',
              boxShadow: '0 0 8px rgba(14, 165, 233, 0.6)',
            }}
          />
        </div>
      );
    }

    if (activeId === 'circuit-flow') {
      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#060B12', overflow: 'hidden' }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.22 }}>
            <path
              d="M 100 200 L 400 200 L 500 300 L 900 300 L 1050 150 L 1400 150 M 300 600 L 650 600 L 800 450 L 1300 450 M 500 800 L 900 800 L 1100 600 L 1700 600"
              stroke="#F59E0B"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="500" cy="300" r="4" fill="#F59E0B" />
            <circle cx="900" cy="300" r="4" fill="#F59E0B" />
            <circle cx="800" cy="450" r="4" fill="#F59E0B" />
            <circle cx="1100" cy="600" r="4" fill="#F59E0B" />
          </svg>
        </div>
      );
    }

    // Default 'cyber-grid'
    const gridOffsetY = (frame * 0.6) % 60;
    return (
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#050811', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: -60,
            backgroundImage: `
              linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translateY(${gridOffsetY}px)`,
          }}
        />
        {/* Horizon focal glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, #050811 75%)`,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  };

  // ── 4. CINEMATIC BACKGROUNDS (Vignette, Film Grain, Spotlight) ──
  const renderCinematic = () => {
    if (activeId === 'spotlight-drama') {
      const beamX = 50 + Math.sin(frame * 0.015) * 8;
      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#020306', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse 65% 85% at ${beamX}% 0%, rgba(251, 191, 36, 0.28) 0%, rgba(15, 23, 42, 0.5) 55%, #020306 90%)`,
            }}
          />
        </div>
      );
    }

    if (activeId === 'film-grain') {
      // Fast jittering grain offset via frame % 4
      const grainOffset = (frame % 4) * 5;
      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#0A0C10', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: -20,
              background: `
                radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.5) 0%, #050608 85%),
                repeating-radial-gradient(circle at 17% 32%, rgba(255, 255, 255, 0.02) 0px, transparent 2px, rgba(0, 0, 0, 0.03) 4px)
              `,
              transform: `translate(${grainOffset}px, ${grainOffset}px)`,
            }}
          />
        </div>
      );
    }

    if (activeId === 'noir-monochrome') {
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000000',
            backgroundImage: `radial-gradient(circle at 50% 40%, #18181B 0%, #09090B 60%, #000000 100%)`,
          }}
        />
      );
    }

    // Default 'dark-vignette' (Cinema letterbox focal falloff)
    const vignetteBreath = 60 + Math.sin(frame * 0.02) * 5;
    return (
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#030508', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse ${vignetteBreath}% 65% at 50% 45%, #0F172A 0%, #060911 50%, #010204 100%)`,
          }}
        />
      </div>
    );
  };

  // ── 5. NATURE / CALM (Waves, Organic Blobs, Ocean) ──
  const renderNature = () => {
    if (activeId === 'flowing-waves') {
      const waveOffset1 = frame * 0.03;
      const waveOffset2 = frame * 0.02 + 1.5;

      // Construct smooth SVG wave paths
      const p1 = `M 0 650 Q 480 ${620 + Math.sin(waveOffset1) * 35} 960 650 T 1920 650 L 1920 1080 L 0 1080 Z`;
      const p2 = `M 0 740 Q 480 ${710 + Math.sin(waveOffset2) * 40} 960 740 T 1920 740 L 1920 1080 L 0 1080 Z`;

      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#040D1A', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, #040D1A 0%, #081B33 100%)`,
            }}
          />
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path d={p1} fill="rgba(14, 165, 233, 0.16)" />
            <path d={p2} fill="rgba(6, 182, 212, 0.22)" />
          </svg>
        </div>
      );
    }

    if (activeId === 'organic-blobs') {
      const bX = 45 + Math.sin(frame * 0.015) * 12;
      const bY = 50 + Math.cos(frame * 0.018) * 10;
      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#0D0814', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(circle at ${bX}% ${bY}%, rgba(251, 146, 60, 0.28) 0%, transparent 55%),
                radial-gradient(circle at 65% 75%, rgba(168, 85, 247, 0.22) 0%, transparent 50%),
                linear-gradient(180deg, #09050E 0%, #140C20 100%)
              `,
            }}
          />
        </div>
      );
    }

    if (activeId === 'zen-ripples') {
      const r1 = ((frame * 0.8) % 180) * 4;
      const r2 = (((frame * 0.8) + 60) % 180) * 4;
      const r3 = (((frame * 0.8) + 120) % 180) * 4;

      return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#040C12', overflow: 'hidden' }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="50%" cy="50%" r={r1} stroke="rgba(167, 243, 208, 0.14)" strokeWidth="1.5" fill="none" />
            <circle cx="50%" cy="50%" r={r2} stroke="rgba(167, 243, 208, 0.10)" strokeWidth="1.5" fill="none" />
            <circle cx="50%" cy="50%" r={r3} stroke="rgba(167, 243, 208, 0.06)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      );
    }

    // Default 'calm-ocean'
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#020E1C',
          backgroundImage: `
            radial-gradient(ellipse 90% 60% at 50% 30%, #03284C 0%, transparent 70%),
            linear-gradient(180deg, #020E1C 0%, #010811 100%)
          `,
        }}
      />
    );
  };

  // ── 6. PARTICLES BACKGROUNDS (Floating Dots, Bokeh, Stars, Sparks) ──
  const renderParticles = () => {
    // Upward floating particles
    const renderedDots = particles.map((p) => {
      const startY = p.yRatio * height;
      // Drift upward deterministically
      const currentY = ((startY - frame * p.speed * 2) % height + height) % height;
      const currentX = (p.xRatio * width + Math.sin(frame * 0.03 + p.opacityPhase) * 15) % width;
      const opacity = 0.25 + 0.5 * Math.sin(frame * 0.04 + p.opacityPhase);

      let color = '#FFA000'; // Amber by default
      if (activeId === 'starry-cosmos') color = p.colorType === 0 ? '#FFFFFF' : '#818CF8';
      if (activeId === 'cyber-sparks') color = p.colorType === 0 ? '#06B6D4' : '#FF5722';
      if (activeId === 'bokeh-orbs') color = '#FBBF24';

      const radius = activeId === 'bokeh-orbs' ? p.size * 3.5 : p.size;

      return (
        <circle
          key={p.id}
          cx={currentX}
          cy={currentY}
          r={radius}
          fill={color}
          opacity={opacity}
        />
      );
    });

    const isBokeh = activeId === 'bokeh-orbs';
    const isStars = activeId === 'starry-cosmos';

    return (
      <div style={{ position: 'absolute', inset: 0, backgroundColor: isStars ? '#020308' : '#070A12', overflow: 'hidden' }}>
        {/* Deep ambient backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isStars
              ? `radial-gradient(circle at 65% 30%, rgba(129, 140, 248, 0.18) 0%, transparent 60%), #020308`
              : `radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.12) 0%, #070A12 70%)`,
          }}
        />
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {renderedDots}
        </svg>
      </div>
    );
  };

  // ── 7. CUSTOM USER UPLOAD BACKGROUND ──
  const renderCustom = () => {
    const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(customBgUrl);
    const subtleZoom = interpolate(frame, [0, 300], [1.0, 1.05], { extrapolateRight: 'clamp' });

    if (!customBgUrl) {
      // Fallback if no custom URL uploaded yet
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#070B14',
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.6) 0%, #070B14 80%)`,
          }}
        />
      );
    }

    return (
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#020617', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: -20,
            background: `url(${customBgUrl}) center/cover no-repeat`,
            transform: `scale(${subtleZoom})`,
          }}
        />
        {/* Ambient Dark Overlay to ensure high subtitle legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.50)',
          }}
        />
      </div>
    );
  };

  // Determine which category renderer to invoke
  const category = customBgUrl ? 'custom' : matched.category;

  const renderActiveBackground = () => {
    if (customBgUrl || category === 'custom') return renderCustom();
    if (category === 'gradient') return renderGradient();
    if (category === 'minimal') return renderMinimal();
    if (category === 'tech') return renderTech();
    if (category === 'cinematic') return renderCinematic();
    if (category === 'nature') return renderNature();
    if (category === 'particles') return renderParticles();
    return renderGradient();
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: isLight ? '#FFFFFF' : '#070B14',
        color: isLight ? '#0F172A' : '#FFFFFF',
      }}
    >
      {renderActiveBackground()}

      {children}
    </div>
  );
}

export default Background;
