'use client';

import { useRef, useState, useEffect, useCallback, useId } from 'react';
import { Play, Pause } from 'lucide-react';

export type VideoBeforeAfterCardProps = {
  label: string;
  description: string;
  beforeSrc: string;
  afterSrc: string;
  accentColor?: string;
};

// ── Global singleton: only one comparison plays at a time ─────────────────────
type StopFn = () => void;
const registry = new Map<string, StopFn>();

function registerCard(id: string, stop: StopFn) {
  registry.set(id, stop);
}
function pauseAllExcept(id: string) {
  for (const [key, stop] of registry.entries()) {
    if (key !== id) stop();
  }
}

// ── Individual synchronized video player ──────────────────────────────────────
export default function VideoBeforeAfterCard({
  label,
  description,
  beforeSrc,
  afterSrc,
  accentColor = '#22C55E',
}: VideoBeforeAfterCardProps) {
  const cardId = useId();
  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Register stop callback so global singleton can pause this card
  const stop = useCallback(() => {
    beforeRef.current?.pause();
    afterRef.current?.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    registerCard(cardId, stop);
    return () => { registry.delete(cardId); };
  }, [cardId, stop]);

  const playBoth = useCallback(async () => {
    pauseAllExcept(cardId);
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b || !a) return;
    b.muted = true;
    a.muted = true;
    // Sync time
    b.currentTime = 0;
    a.currentTime = 0;
    try {
      await Promise.all([b.play(), a.play()]);
      setIsPlaying(true);
    } catch {}
  }, [cardId]);

  // Autoplay when visible, pause when hidden
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Auto-play when scrolled into view
          playBoth();
        } else {
          stop();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [stop, playBoth]);

  // Seek to first frame on load so poster is visible
  const seekToFirstFrame = useCallback((v: HTMLVideoElement | null) => {
    if (!v) return;
    const seek = () => { v.currentTime = 0.001; };
    v.addEventListener('loadedmetadata', seek, { once: true });
  }, []);

  useEffect(() => {
    seekToFirstFrame(afterRef.current);
    seekToFirstFrame(beforeRef.current);
  }, [seekToFirstFrame]);

  const pauseBoth = useCallback(() => {
    stop();
  }, [stop]);

  const togglePlay = useCallback(() => {
    isPlaying ? pauseBoth() : playBoth();
  }, [isPlaying, pauseBoth, playBoth]);

  // Desktop: hover = play
  const onMouseEnter = () => {
    setIsHovered(true);
    if (!isPlaying) playBoth();
  };
  const onMouseLeave = () => {
    setIsHovered(false);
    pauseBoth();
  };

  // Mobile: tap = toggle
  const onTap = (e: React.MouseEvent) => {
    // Detect touch device via pointer type when possible
    togglePlay();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Card ─────────────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative cursor-pointer select-none"
        style={{ touchAction: 'manipulation' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onTap}
      >
        {/* Outer container — sized by the After (dominant) video */}
        <div
          className="relative"
          style={{ overflow: 'visible', paddingBottom: '28px' }}
        >
          {/* ── AFTER VIDEO (dominant, full size) ─────────────────────────── */}
          <div
            className="relative overflow-hidden transition-all duration-500"
            style={{
              aspectRatio: '9/16',
              width: '100%',
              borderRadius: 20,
              border: `2px solid ${accentColor}66`,
              boxShadow: isPlaying || isHovered
                ? `0 28px 70px rgba(0,0,0,0.55), 0 0 50px ${accentColor}33, 0 0 0 1px ${accentColor}22`
                : `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)`,
              background: '#06090f',
            }}
          >
            <video
              ref={afterRef}
              src={afterSrc}
              muted
              playsInline
              loop
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* After badge */}
            <div
              className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
              style={{
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}66`,
                color: accentColor,
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ background: accentColor }}
              />
              After
            </div>

            {/* Play overlay (hidden while playing) */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
              style={{
                opacity: isPlaying ? 0 : 1,
                pointerEvents: isPlaying ? 'none' : 'auto',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)',
              }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
                style={{
                  background: accentColor,
                  boxShadow: `0 0 32px ${accentColor}99, 0 0 0 8px ${accentColor}22`,
                }}
              >
                <Play size={22} fill="#000" color="#000" style={{ marginLeft: 3 }} />
              </div>
            </div>

            {/* Pause button (visible while playing, bottom center) */}
            {isPlaying && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <Pause size={11} fill="rgba(255,255,255,0.7)" color="rgba(255,255,255,0.7)" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Tap to pause</span>
                </div>
              </div>
            )}
          </div>

          {/* ── BEFORE VIDEO (small, overlapping bottom-left) ───────────────── */}
          <div
            className="absolute transition-all duration-500"
            style={{
              /* Positioned overlapping the After video, bottom-left */
              bottom: 24,
              left: -16,
              width: '42%',
              aspectRatio: '9/16',
              borderRadius: 14,
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.18)',
              boxShadow: isPlaying || isHovered
                ? '0 12px 36px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)'
                : '0 8px 24px rgba(0,0,0,0.5)',
              background: '#06090f',
              zIndex: 10,
              transform: isPlaying ? 'scale(1.02) rotate(-1.5deg)' : 'rotate(-2deg)',
            }}
          >
            <video
              ref={beforeRef}
              src={beforeSrc}
              muted
              playsInline
              loop
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: 'grayscale(0.25) brightness(0.82)' }}
            />

            {/* Before badge */}
            <div
              className="absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
              style={{
                background: 'rgba(0,0,0,0.65)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
              Before
            </div>

            {/* Subtle desaturated overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.12)', mixBlendMode: 'multiply' }}
            />
          </div>
        </div>
      </div>

      {/* ── Label + description ───────────────────────────────────────────────── */}
      <div className="pl-2">
        <p className="text-sm font-black text-white">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}
