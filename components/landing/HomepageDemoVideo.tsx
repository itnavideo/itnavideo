'use client';

/**
 * HomepageDemoVideo — Hero demo video section.
 *
 * PLACEHOLDER: Upload the actual demo video to Cloudinary under
 * `itnavideo12345/homepage/demo-video.mp4` then replace the
 * DEMO_VIDEO_URL and DEMO_POSTER_URL constants below.
 *
 * Usage: import and place directly below <Hero /> or <PlatformMarqueeTicker />.
 */

import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

// ─── Replace these two URLs once you upload the demo video ───────────────────
const DEMO_VIDEO_URL = ''; // e.g. 'https://res.cloudinary.com/dhouh9idx/video/upload/v.../homepage-demo.mp4'
const DEMO_POSTER_URL = 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png';
const IS_READY = Boolean(DEMO_VIDEO_URL); // flip to true once URL is set
// ─────────────────────────────────────────────────────────────────────────────

export default function HomepageDemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <section className="relative bg-white px-4 py-10 sm:py-16 border-b border-slate-100">
      <div className="mx-auto max-w-5xl">
        {/* Section label */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            See it in{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              60 seconds
            </span>
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Upload audio → AI creates → Download 1080p HD video.
          </p>
        </div>

        {/* Video player */}
        <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(249,115,22,0.2)] border border-slate-200/80 bg-slate-950 aspect-video">
          {IS_READY ? (
            <>
              <video
                ref={videoRef}
                src={DEMO_VIDEO_URL}
                poster={DEMO_POSTER_URL}
                className="w-full h-full object-cover"
                playsInline
                preload="metadata"
                onEnded={() => setPlaying(false)}
              />
              {/* Play/Pause overlay */}
              <button
                onClick={togglePlay}
                aria-label={playing ? 'Pause demo' : 'Play demo'}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                  playing ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                }`}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl shadow-orange-500/30 hover:scale-110 transition-transform">
                  {playing ? (
                    <Pause size={28} className="text-white" fill="white" />
                  ) : (
                    <Play size={28} className="text-white ml-1" fill="white" />
                  )}
                </div>
              </button>
            </>
          ) : (
            /* ── PLACEHOLDER — shown until demo video is uploaded ── */
            <div className="flex flex-col items-center justify-center h-full gap-5 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30">
                <Play size={28} className="text-orange-500 ml-1" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Demo video coming soon</p>
                <p className="text-xs text-slate-400 mt-1">
                  Upload your demo MP4 to Cloudinary, then set{' '}
                  <code className="text-orange-400 font-mono">DEMO_VIDEO_URL</code>{' '}
                  in <code className="text-orange-400 font-mono">HomepageDemoVideo.tsx</code>
                </p>
              </div>
              {/* Poster image as background while video isn't set */}
              <img
                src={DEMO_POSTER_URL}
                alt="Itnavideo demo preview"
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              />
            </div>
          )}
        </div>

        {/* Duration + trust note */}
        <p className="mt-4 text-center text-xs text-zinc-500 font-medium">
          ~60 second product walkthrough • No editing software required
        </p>
      </div>
    </section>
  );
}
