import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SubscribeBellAssetProps {
  /** Override the current frame if driven by an external scene timeline */
  sceneFrame?: number;
  /** Scale factor (default 1.0) */
  scale?: number;
  /** Position preset */
  position?: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'center';
  /** Custom x/y pixel offsets */
  offsetX?: number;
  offsetY?: number;
  /** Delay in frames before the sequence begins (default 0) */
  startDelayFrames?: number;
  /** Whether the component should loop its animation sequence */
  loop?: boolean;
}

/**
 * SubscribeBellAsset
 * Ultra-Premium Animated YouTube Subscribe Pill + Notification Bell + Vector Cursor.
 * Frame-accurate Remotion component with:
 * - Metallic gold/white gradient border & continuous shimmer sweep
 * - Shockwave ripple ring on subscribe
 * - Reveal transition of the golden bell button
 * - Bell swing physics (+26deg to -4deg) & radiating sound waves
 * - Golden particle burst
 * - Animated vector mouse cursor click choreography
 */
export const SubscribeBellAsset: React.FC<SubscribeBellAssetProps> = ({
  sceneFrame,
  scale = 1.0,
  position = 'bottom-center',
  offsetX = 0,
  offsetY = 0,
  startDelayFrames = 8,
  loop = false,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frame calculation with start delay and optional looping (150 frames = 5 seconds)
  const sequenceLength = 150;
  const rawFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = rawFrame < 0 ? 0 : loop ? rawFrame % sequenceLength : Math.min(rawFrame, sequenceLength);
  const isStarted = rawFrame >= 0;

  // ── 1. Stage Entrance Pop (Frame 0-16) ──
  const stageSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const stageOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const stageY = interpolate(stageSpring, [0, 1], [28, 0]);

  // ── 2. Click Subscribe Timing (Frame 28: click down, Frame 34: release & subscribed) ──
  const isSubscribed = frame >= 34;
  const isSubPressing = frame >= 28 && frame < 34;
  const subBtnScale = isSubPressing ? 0.91 : 1;

  // Shockwave Ripple Ring (Frame 34-52)
  const rippleProgress = interpolate(frame, [34, 52], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rippleScaleX = interpolate(rippleProgress, [0, 1], [0.92, 1.42]);
  const rippleScaleY = interpolate(rippleProgress, [0, 1], [0.92, 1.72]);
  const rippleOpacity = interpolate(rippleProgress, [0, 0.2, 1], [0.85, 0.65, 0]);

  // ── 3. Bell Reveal (Frame 34-50) ──
  const bellSpring = spring({
    frame: Math.max(0, frame - 34),
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const bellWidth = interpolate(bellSpring, [0, 1], [0, 52]);
  const bellOpacity = interpolate(frame, [34, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bellTranslateX = interpolate(bellSpring, [0, 1], [-16, 0]);

  // ── 4. Click Bell Timing (Frame 58: click down, Frame 64: release & ring) ──
  const isBellActivated = frame >= 64;
  const isBellPressing = frame >= 58 && frame < 64;
  const bellBtnScale = isBellPressing ? 0.86 : 1;

  // Bell Swing Physics (Frame 64-96)
  const bellSwingFrame = Math.max(0, frame - 64);
  const bellRotation = isBellActivated
    ? interpolate(
        bellSwingFrame,
        [0, 5, 10, 15, 20, 25, 30, 36],
        [0, 26, -22, 18, -14, 9, -4, 0],
        { extrapolateRight: 'clamp' }
      )
    : 0;

  // Sound-Wave Arcs Radiating From Bell (Frame 64-88)
  const soundWaveProgress = interpolate(frame, [64, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const waveScale = interpolate(soundWaveProgress, [0, 1], [0.75, 1.42]);
  const waveOpacity = interpolate(soundWaveProgress, [0, 0.3, 1], [0, 1, 0]);

  // Golden Particle Burst (Frame 64-90)
  const particleProgress = interpolate(frame, [64, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const particleOpacity = interpolate(particleProgress, [0, 0.2, 0.7, 1], [0, 1, 1, 0]);

  // ── 5. Mouse Cursor Choreography ──
  // Step 1: Glides onto Subscribe pill (Frame 8-28)
  // Step 2: Clicks Subscribe (Frame 28-34)
  // Step 3: Glides to Bell (Frame 42-58)
  // Step 4: Clicks Bell (Frame 58-64)
  // Step 5: Glides out and fades (Frame 78-102)
  const cursorOpacity = interpolate(
    frame,
    [8, 16, 78, 100],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cursorX = interpolate(
    frame,
    [8, 24, 42, 56, 78, 98],
    [130, -12, -12, 84, 84, 140],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cursorY = interpolate(
    frame,
    [8, 24, 42, 56, 78, 98],
    [85, 4, 4, 4, 4, 45],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cursorSquish =
    isSubPressing || isBellPressing
      ? 0.82
      : 1;

  // Continuous Shimmer Sweep (Translates across the button)
  const shimmerProgress = (frame % 90) / 90;
  const shimmerTranslateX = interpolate(shimmerProgress, [0, 0.45, 1], [-160, 260, 260]);

  // Golden Particle Definitions
  const particles = useMemo(() => {
    const colors = ['#FDE047', '#FBBF24', '#F59E0B', '#FFFFFF', '#FCD34D'];
    const list = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + ((i % 3) - 1) * 0.15;
      const dist = 36 + (i % 4) * 8;
      const size = 4 + (i % 3) * 2;
      list.push({
        id: `spark-${i}`,
        size,
        color: colors[i % colors.length],
        targetX: Math.cos(angle) * dist,
        targetY: Math.sin(angle) * dist,
      });
    }
    return list;
  }, []);

  // Position Styling
  const positionStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 45,
    ...(position === 'bottom-center' && {
      bottom: `${80 + offsetY}px`,
      left: '50%',
      transform: `translateX(-50%) translate(${offsetX}px, 0px) scale(${scale})`,
    }),
    ...(position === 'bottom-right' && {
      bottom: `${80 + offsetY}px`,
      right: `${80 - offsetX}px`,
      transform: `scale(${scale})`,
    }),
    ...(position === 'bottom-left' && {
      bottom: `${80 + offsetY}px`,
      left: `${80 + offsetX}px`,
      transform: `scale(${scale})`,
    }),
    ...(position === 'center' && {
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
    }),
  };

  if (!isStarted) return null;

  return (
    <div style={positionStyles}>
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          opacity: stageOpacity,
          transform: `translateY(${stageY}px) scale(${stageSpring})`,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 16px 36px rgba(0, 0, 0, 0.45))',
        }}
      >
        {/* ── 1. Subscribe Button Pill Wrapper ── */}
        <div
          style={{
            position: 'relative',
            padding: '1.5px',
            borderRadius: '9999px',
            background: isSubscribed
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(251, 191, 36, 0.65) 50%, rgba(255, 255, 255, 0.45) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 215, 115, 0.75) 35%, rgba(255, 59, 92, 0.55) 70%, rgba(255, 255, 255, 0.75) 100%)',
            boxShadow: isSubscribed
              ? '0 18px 36px -8px rgba(0, 0, 0, 0.48), 0 0 22px -6px rgba(251, 191, 36, 0.25)'
              : '0 20px 42px -8px rgba(0, 0, 0, 0.55), 0 0 28px -4px rgba(255, 23, 68, 0.42)',
            transform: `scale(${subBtnScale})`,
            transition: 'transform 0.12s ease',
          }}
        >
          {/* Shockwave Ripple Ring */}
          {rippleProgress > 0 && rippleProgress < 1 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '9999px',
                border: '2px solid rgba(255, 215, 115, 0.85)',
                pointerEvents: 'none',
                opacity: rippleOpacity,
                transform: `scale(${rippleScaleX}, ${rippleScaleY})`,
              }}
            />
          )}

          {/* Inner Button Body */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '9999px',
              background: isSubscribed
                ? 'linear-gradient(135deg, #16181F 0%, #222530 100%)'
                : 'linear-gradient(135deg, #1E1318 0%, #2C0B14 48%, #B90E31 100%)',
              color: isSubscribed ? '#F9FAFB' : '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              userSelect: 'none',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.24)',
            }}
          >
            {/* Shimmer Light Sweep */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '45%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.28) 50%, transparent 100%)',
                pointerEvents: 'none',
                transform: `translateX(${shimmerTranslateX}%) skewX(-22deg)`,
              }}
            />

            {/* Play Icon (Before Subscribe) */}
            {!isSubscribed && (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ position: 'relative', zIndex: 2 }}>
                <path d="M8 5.5V18.5L19 12L8 5.5Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            )}

            {/* Checkmark Icon (After Subscribe) */}
            {isSubscribed && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position: 'relative', zIndex: 2 }}>
                <path d="M20 6L9 17L4 12" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}

            <span style={{ position: 'relative', zIndex: 2 }}>
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </span>
          </div>
        </div>

        {/* ── 2. Separate Interactive Notification Bell ── */}
        {frame >= 34 && (
          <div
            style={{
              position: 'relative',
              width: `${bellWidth}px`,
              opacity: bellOpacity,
              transform: `scale(${bellBtnScale}) translateX(${bellTranslateX}px)`,
              overflow: 'visible',
            }}
          >
            {/* Golden Particle Burst Layer */}
            {isBellActivated && particleOpacity > 0 && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {particles.map((p) => {
                  const currentX = p.targetX * particleProgress;
                  const currentY = p.targetY * particleProgress;
                  const sparkScale = interpolate(particleProgress, [0, 0.65, 1], [0.4, 1.2, 1.0]);

                  return (
                    <span
                      key={p.id}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        borderRadius: '9999px',
                        backgroundColor: p.color,
                        boxShadow: '0 0 8px rgba(251, 191, 36, 0.85)',
                        opacity: particleOpacity,
                        transform: `translate(${currentX}px, ${currentY}px) scale(${sparkScale})`,
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Radiating Sound-Wave Arcs SVG */}
            {isBellActivated && waveOpacity > 0 && (
              <svg
                width="76"
                height="76"
                viewBox="0 0 76 76"
                fill="none"
                style={{
                  position: 'absolute',
                  left: '-12px',
                  top: '-12px',
                  pointerEvents: 'none',
                  opacity: waveOpacity,
                  transform: `scale(${waveScale})`,
                  transformOrigin: 'center center',
                }}
              >
                <path d="M15 26C11 32 11 44 15 50" stroke="#FBBF24" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M61 26C65 32 65 44 61 50" stroke="#FBBF24" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}

            {/* Bell Round Button */}
            <div
              style={{
                position: 'relative',
                width: '52px',
                height: '52px',
                borderRadius: '9999px',
                border: isBellActivated
                  ? '1.5px solid #FEF08A'
                  : '1.5px solid rgba(255, 255, 255, 0.25)',
                background: isBellActivated
                  ? 'linear-gradient(145deg, #FBBF24 0%, #D97706 100%)'
                  : 'linear-gradient(145deg, #1B1D26 0%, #111218 100%)',
                color: isBellActivated ? '#111827' : '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isBellActivated
                  ? '0 14px 32px -4px rgba(245, 158, 11, 0.55), 0 0 24px rgba(251, 191, 36, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.65)'
                  : '0 14px 28px -6px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.18)',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  transform: `rotate(${bellRotation}deg)`,
                  transformOrigin: 'top center',
                }}
              >
                <path
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        {/* ── 3. Vector Mouse Cursor ── */}
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            pointerEvents: 'none',
            zIndex: 40,
            opacity: cursorOpacity,
            transform: `translate(${cursorX}px, ${cursorY}px) scale(${cursorSquish})`,
            filter: 'drop-shadow(0 8px 14px rgba(0, 0, 0, 0.45))',
          }}
        >
          <path
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
            fill="#FFFFFF"
            stroke="#111827"
            strokeWidth="1.35"
          />
        </svg>
      </div>
    </div>
  );
};

