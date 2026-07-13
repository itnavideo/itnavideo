"use client";

import { useCallback, useRef, useState } from "react";
import { Clock, Volume2, VolumeX } from "lucide-react";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dhouh9idx/video/upload/v1/uploads/DEMO%20VIDEOS/LONG%20VIDEO%20CLIPS/uploads/DEMO%20VIDEOS/LONG%20VIDEO%20CLIPS";

const DEMO_CLIPS_VIDEOS = [
  { id: "clip-01-opening-hook", title: "Opening Hook", time: "0:15" },
  { id: "clip-02-startup-advice", title: "Startup Advice", time: "1:35" },
  { id: "clip-03-yc-insight", title: "YC Insight", time: "3:30" },
  { id: "clip-04-founder-mindset", title: "Founder Mindset", time: "5:40" },
  { id: "clip-05-building-product", title: "Building Product", time: "7:55" },
  { id: "clip-06-growth-strategy", title: "Growth Strategy", time: "10:00" },
  { id: "clip-07-fundraising-truth", title: "Fundraising Truth", time: "12:10" },
  { id: "clip-08-team-culture", title: "Team & Culture", time: "14:30" },
  { id: "clip-09-market-timing", title: "Market Timing", time: "16:50" },
  { id: "clip-10-closing-wisdom", title: "Closing Wisdom", time: "19:10" },
];

export function DemoClipsGrid() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const videosRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  const registerVideo = useCallback((id: string, el: HTMLVideoElement | null) => {
    if (el) videosRef.current.set(id, el);
    else videosRef.current.delete(id);
  }, []);

  const handleClick = useCallback((id: string) => {
    const clicked = videosRef.current.get(id);
    if (!clicked) return;

    if (activeId === id) {
      clicked.muted = true;
      setActiveId(null);
    } else {
      // Mute all others
      videosRef.current.forEach((v, vid) => {
        if (vid !== id) v.muted = true;
      });
      clicked.muted = false;
      clicked.play();
      setActiveId(id);
    }
  }, [activeId]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {DEMO_CLIPS_VIDEOS.map((clip, i) => {
          const isActive = activeId === clip.id;
          return (
            <div key={clip.id} className="group overflow-hidden rounded-xl" style={{ background: 'var(--bg-card)', border: isActive ? '1.5px solid rgba(6,182,212,0.6)' : '0.5px solid var(--border-dark)' }}>
              <div className="relative aspect-[9/16] overflow-hidden bg-black">
                <video
                  ref={(el) => registerVideo(clip.id, el)}
                  src={`${CLOUDINARY_BASE}/${clip.id}.mp4`}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                  onMouseLeave={(e) => {
                    const v = e.target as HTMLVideoElement;
                    if (!isActive) { v.pause(); v.currentTime = 0; }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    const v = e.target as HTMLVideoElement;
                    if (v.paused) v.play();
                    handleClick(clip.id);
                  }}
                  onTouchStart={(e) => {
                    (e.target as HTMLVideoElement).play();
                  }}
                />

                {/* Bottom info overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                  <p className="text-xs font-bold text-white">{clip.title}</p>
                  <p className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <Clock size={9} />
                    from {clip.time}
                  </p>
                </div>

                {/* Clip number badge */}
                <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-black" style={{ background: 'rgba(6,182,212,0.9)', color: '#fff' }}>
                  Clip {i + 1}
                </span>

                {/* Sound indicator */}
                <div className="pointer-events-none absolute right-2 top-2">
                  {isActive ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                      <Volume2 size={10} className="text-white" />
                    </div>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <VolumeX size={10} className="text-white/50" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs" style={{ color: 'var(--text-dark-muted)' }}>
        Hover to preview • Click for sound • 30 seconds each • 9:16 vertical format
      </p>
    </div>
  );
}
