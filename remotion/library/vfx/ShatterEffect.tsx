import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface ShatterShard {
  id: number;
  clipPath: string;
  x: number;
  y: number;
  rot: number;
  delay: number;
}

export interface ShatterEffectProps {
  children?: React.ReactNode;
  shardCount?: number; // 6 to 16 polygonal shards
  triggerFrame?: number; // Frame when explosion triggers
  explosionForce?: number; // Spread distance in px
  rotationIntensity?: number;
  className?: string;
}

export const ShatterEffect: React.FC<ShatterEffectProps> = ({
  children,
  shardCount = 8,
  triggerFrame = 15,
  explosionForce = 120,
  rotationIntensity = 45,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Deterministically create 8-12 polygonal shard wedges around the center
  const shards: ShatterShard[] = React.useMemo(() => {
    const list: ShatterShard[] = [];
    const count = Math.max(4, Math.min(16, shardCount));
    const step = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      const a1 = i * step;
      const a2 = (i + 1) * step;

      // Center point (50%, 50%)
      const p1 = '50% 50%';
      // Outer points
      const x2 = 50 + Math.cos(a1) * 70;
      const y2 = 50 + Math.sin(a1) * 70;
      const x3 = 50 + Math.cos(a2) * 70;
      const y3 = 50 + Math.sin(a2) * 70;

      const midAngle = (a1 + a2) / 2;
      const dirX = Math.cos(midAngle);
      const dirY = Math.sin(midAngle);

      list.push({
        id: i,
        clipPath: `polygon(${p1}, ${x2}% ${y2}%, ${x3}% ${y3}%)`,
        x: dirX * explosionForce,
        y: dirY * explosionForce,
        rot: (i % 2 === 0 ? 1 : -1) * rotationIntensity,
        delay: (i % 4) * 2,
      });
    }
    return list;
  }, [shardCount, explosionForce, rotationIntensity]);

  const activeFrame = Math.max(0, frame - triggerFrame);
  const isExploded = frame >= triggerFrame;

  return (
    <div className={`relative overflow-visible ${className}`}>
      {/* If not triggered yet, show normal child */}
      {!isExploded ? (
        <div className="relative">{children}</div>
      ) : (
        /* Exploded fragments */
        shards.map((s) => {
          const shardProgress = spring({
            frame: Math.max(0, activeFrame - s.delay),
            fps,
            config: { damping: 10, mass: 0.8, stiffness: 60 },
          });

          const currentX = s.x * shardProgress;
          const currentY = s.y * shardProgress;
          const currentRot = s.rot * shardProgress;
          const currentOpacity = Math.max(0, 1 - shardProgress * 0.7);

          return (
            <div
              key={s.id}
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: s.clipPath,
                transform: `translate(${currentX}px, ${currentY}px) rotate(${currentRot}deg)`,
                opacity: currentOpacity,
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
              }}
            >
              {children}
            </div>
          );
        })
      )}
    </div>
  );
};
