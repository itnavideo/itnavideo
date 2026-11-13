import React, { memo } from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {
  KineticAnimationName,
  PlannedTypographyItem,
  TextCase,
  TextPattern,
  TextAlignment,
} from '@/services/ai/aiPolisherDirector';

export interface KineticTypographyEngineProps {
  segment: PlannedTypographyItem;
  aspectRatio?: '16:9' | '9:16';
}

export const KineticTypographyEngine: React.FC<KineticTypographyEngineProps> = memo(({
  segment,
  aspectRatio = '16:9',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.round(segment.startSeconds * fps);
  const totalFrames = Math.max(6, segment.dynamicDurationFrames || Math.round(segment.durationSeconds * fps));
  const localFrame = frame - startFrame;

  // Render only during the segment's active lifespan
  if (localFrame < 0 || localFrame > totalFrames) {
    return null;
  }

  // ── DYNAMIC DURATION CALCULATION ─────────────────────────────────────────
  // Durations scale dynamically based on total phrase duration (not hardcoded fixed frames)
  const inFrames = Math.max(3, Math.min(10, Math.round(totalFrames * 0.22)));
  const outFrames = Math.max(2, Math.min(7, Math.round(totalFrames * 0.16)));
  const outStartFrame = totalFrames - outFrames;

  // Smooth exit fade envelope
  let exitOpacity = 1;
  if (localFrame > outStartFrame) {
    exitOpacity = interpolate(localFrame, [outStartFrame, totalFrames], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // Spring physics for dynamic motion
  const entrySpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 13, stiffness: 290, mass: 0.5 },
  });

  // Calculate animation parameters across the 25 kinetic types
  let transform = '';
  let opacity = exitOpacity;
  let filter = '';
  let clipPath = '';
  let letterSpacing = 'normal';

  const anim = segment.animation || 'spring';

  switch (anim) {
    case 'zoom-out-2': {
      // Two-stage kinetic deceleration: starts at 1.7x down to 1.0x
      const zScale = interpolate(entrySpring, [0, 1], [1.7, 1.0]);
      transform = `scale(${zScale * (segment.scale || 1)}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'jolt-forward': {
      // Rapid forward punch: snaps up to 1.25x then rebounds to 1.0x
      const joltScale = spring({
        frame: localFrame,
        fps,
        config: { damping: 9, stiffness: 420, mass: 0.35 },
        from: 0.65,
        to: 1.0,
      });
      transform = `scale(${joltScale * (segment.scale || 1)}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'flicker': {
      // Strobe opacity mimicking energetic neon light flicker
      let strobe = 1.0;
      if (localFrame < inFrames) {
        const step = localFrame % 4;
        strobe = step === 0 ? 0.2 : step === 1 ? 0.95 : step === 2 ? 0.4 : 1.0;
      }
      opacity = Math.min(exitOpacity, strobe);
      transform = `scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      break;
    }

    case 'faulty-text': {
      // Micro-jitter chromatic aberration offset
      const jitterX = localFrame < inFrames ? (localFrame % 2 === 0 ? 4 : -4) : 0;
      transform = `translateX(${jitterX}px) scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'karaoke': {
      // Clean pop entrance, words highlighted along time
      transform = `scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = exitOpacity;
      break;
    }

    case 'mini-zoom': {
      // Subtle 8% punch-in
      const miniScale = interpolate(entrySpring, [0, 1], [0.94, 1.0]);
      transform = `scale(${miniScale * (segment.scale || 1)}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'blur': {
      // Gaussian optical blur into focus
      const blurPx = interpolate(localFrame, [0, inFrames], [12, 0], { extrapolateRight: 'clamp' });
      filter = `blur(${blurPx}px)`;
      transform = `scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'concentrate': {
      // Tracking converges from wide to normal
      const spacingEm = interpolate(entrySpring, [0, 1], [0.35, 0.02]);
      letterSpacing = `${spacingEm}em`;
      transform = `scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'bounce-left': {
      // Enters from left with elastic settle
      const transX = spring({
        frame: localFrame,
        fps,
        config: { damping: 11, stiffness: 280, mass: 0.5 },
        from: -80,
        to: 0,
      });
      transform = `translateX(${transX}px) scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'wave-in': {
      // Sine wave vertical ripple
      const waveY = Math.sin(localFrame * 0.4) * interpolate(localFrame, [0, inFrames * 1.5], [14, 0], { extrapolateRight: 'clamp' });
      transform = `translateY(${waveY}px) scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'bounce-right': {
      // Enters from right with elastic settle
      const transX = spring({
        frame: localFrame,
        fps,
        config: { damping: 11, stiffness: 280, mass: 0.5 },
        from: 80,
        to: 0,
      });
      transform = `translateX(${transX}px) scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'zoom-out': {
      // Starts oversized (2.2x) and zooms down into lock position
      const zScale = interpolate(entrySpring, [0, 1], [2.2, 1.0]);
      transform = `scale(${zScale * (segment.scale || 1)}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'open': {
      // Vertical curtain scale open
      const scaleY = interpolate(entrySpring, [0, 1], [0.05, 1.0]);
      transform = `scaleY(${scaleY}) scaleX(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'wipe-right': {
      // Horizontal clip path wipe reveal
      const wipePct = interpolate(localFrame, [0, inFrames], [100, 0], { extrapolateRight: 'clamp' });
      clipPath = `inset(0 ${wipePct}% 0 0)`;
      transform = `scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = exitOpacity;
      break;
    }

    case 'roll-in': {
      // Slight rotational tilt combined with scale
      const rollDeg = interpolate(entrySpring, [0, 1], [-18, segment.rotationDeg || 0]);
      const rollScale = interpolate(entrySpring, [0, 1], [0.65, segment.scale || 1]);
      transform = `scale(${rollScale}) rotate(${rollDeg}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'slide-right': {
      const transX = interpolate(localFrame, [0, inFrames], [-60, 0], { extrapolateRight: 'clamp' });
      transform = `translateX(${transX}px) scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'slide-up': {
      const transY = spring({
        frame: localFrame,
        fps,
        config: { damping: 14, stiffness: 280, mass: 0.5 },
        from: 35,
        to: 0,
      });
      transform = `translateY(${transY}px) scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'boing': {
      // Rubber band squash and stretch
      const squashX = interpolate(entrySpring, [0, 0.5, 1], [1.35, 0.88, 1.0]);
      const squashY = interpolate(entrySpring, [0, 0.5, 1], [0.7, 1.15, 1.0]);
      transform = `scale(${squashX * (segment.scale || 1)}, ${squashY * (segment.scale || 1)}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'showing-up': {
      // Instant pop with ambient ring
      const popScale = interpolate(localFrame, [0, 3, 6], [0.8, 1.08, 1.0], { extrapolateRight: 'clamp' });
      transform = `scale(${popScale * (segment.scale || 1)}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = exitOpacity;
      break;
    }

    case 'throw-out': {
      // Centrifugal entrance
      const throwTransY = spring({
        frame: localFrame,
        fps,
        config: { damping: 12, stiffness: 320, mass: 0.4 },
        from: -50,
        to: 0,
      });
      const throwScale = interpolate(entrySpring, [0, 1], [1.4, segment.scale || 1]);
      transform = `translateY(${throwTransY}px) scale(${throwScale}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'grow': {
      // Continuous progressive scale growth throughout duration
      const growScale = interpolate(localFrame, [0, totalFrames], [0.95, 1.08], { extrapolateRight: 'clamp' });
      transform = `scale(${growScale * (segment.scale || 1)}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'judder-up': {
      // Stepped micro-jitter rise
      const stepIdx = Math.floor(localFrame / 2);
      const stepY = Math.max(0, 24 - stepIdx * 6);
      transform = `translateY(${stepY}px) scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'trail': {
      // Motion blur trail
      const trailBlur = interpolate(localFrame, [0, inFrames], [6, 0], { extrapolateRight: 'clamp' });
      filter = `blur(${trailBlur}px)`;
      transform = `scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'float-down': {
      // Atmospheric gentle float descent
      const floatY = interpolate(localFrame, [0, inFrames * 1.5], [-25, 0], { extrapolateRight: 'clamp' });
      const sway = Math.sin(localFrame * 0.15) * 3;
      transform = `translate(${sway}px, ${floatY}px) scale(${segment.scale || 1}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }

    case 'spring':
    default: {
      const springScale = interpolate(entrySpring, [0, 1], [0.75, 1.0]);
      transform = `scale(${springScale * (segment.scale || 1)}) rotate(${segment.rotationDeg || 0}deg)`;
      opacity = Math.min(exitOpacity, interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' }));
      break;
    }
  }

  // ── TYPOGRAPHY PATTERN FORMATTING ────────────────────────────────────────
  let fontWeight: React.CSSProperties['fontWeight'] = 800;
  let fontStyle: React.CSSProperties['fontStyle'] = 'normal';
  let textDecoration: React.CSSProperties['textDecoration'] = 'none';

  if (segment.pattern === 'bold') {
    fontWeight = 900;
  } else if (segment.pattern === 'italic') {
    fontStyle = 'italic';
  } else if (segment.pattern === 'underline') {
    textDecoration = 'underline';
  } else if (segment.pattern === 'normal') {
    fontWeight = 600;
  }

  // ── POSITIONING & SAFE MARGINS ───────────────────────────────────────────
  const isLandscape = aspectRatio === '16:9';
  const bottomPosition = isLandscape ? 72 : '22%';

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: bottomPosition,
    left: isLandscape ? '10%' : '5%',
    right: isLandscape ? '10%' : '5%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: segment.alignment === 'left' ? 'flex-start' : segment.alignment === 'right' ? 'flex-end' : 'center',
    zIndex: 42,
    pointerEvents: 'none',
  };

  const badgeStyle: React.CSSProperties = {
    padding: isLandscape ? '14px 28px' : '10px 22px',
    borderRadius: 18,
    background: 'rgba(7, 11, 20, 0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1.5px solid ${segment.color ? `${segment.color}66` : 'rgba(255, 109, 0, 0.55)'}`,
    boxShadow: `0 16px 36px rgba(0, 0, 0, 0.8), 0 0 24px ${segment.color ? `${segment.color}40` : 'rgba(255, 87, 34, 0.3)'}`,
    maxWidth: isLandscape ? '85%' : '94%',
    textAlign: segment.alignment || 'center',
    transform,
    transformOrigin: 'center center',
    opacity,
    filter: filter || undefined,
    clipPath: clipPath || undefined,
    letterSpacing,
    transition: 'border-color 0.2s ease',
  };

  const textStyle: React.CSSProperties = {
    fontFamily: segment.fontFamily || 'Montserrat, sans-serif',
    fontSize: isLandscape ? segment.fontSize : Math.round(segment.fontSize * 0.9),
    fontWeight,
    fontStyle,
    textDecoration,
    color: segment.color || '#FFFFFF',
    textShadow: '0 2px 12px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.6)',
    letterSpacing: '-0.02em',
    lineHeight: 1.25,
    display: 'inline-block',
  };

  // If words array provided and karaoke animation chosen, highlight current word
  const currentSeconds = frame / fps;

  return (
    <div style={containerStyle}>
      <div style={badgeStyle}>
        {anim === 'karaoke' && segment.words && segment.words.length > 0 ? (
          <span style={textStyle}>
            {segment.words.map((w, wIdx) => {
              const isActive = currentSeconds >= w.start && currentSeconds <= w.end;
              return (
                <span
                  key={wIdx}
                  style={{
                    color: isActive ? (segment.color || '#FACC15') : '#94A3B8',
                    textShadow: isActive ? `0 0 16px ${segment.color || '#FACC15'}` : 'none',
                    marginRight: '0.28em',
                    transition: 'color 0.1s ease',
                  }}
                >
                  {segment.case === 'TT' ? w.word.toUpperCase() : segment.case === 'tt' ? w.word.toLowerCase() : w.word}
                </span>
              );
            })}
          </span>
        ) : (
          <span style={textStyle}>
            {segment.displayText}
          </span>
        )}
      </div>
    </div>
  );
});
KineticTypographyEngine.displayName = 'KineticTypographyEngine';

