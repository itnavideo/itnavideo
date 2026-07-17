import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { ConversionHook, StickyBottomCTA } from "@/components/landing/ConversionHook";

export const metadata: Metadata = {
  title: "Multi Images Video — Story & News Reels with Image Slideshow | Itnavideo",
  description: "Upload a video, write a title, add multiple images. Get a professional reel with animated image slideshow perfect for news, stories, and visual content.",
  alternates: { canonical: "/multi-images-video" },
  openGraph: {
    title: "Multi Images Video — Story & News Reels | Itnavideo",
    description: "Upload a video, write a title, add multiple images. Get a professional reel with animated image slideshow.",
    images: ["/preview/Multi Images Video.png"],
  },
};

export default function MultiImagesVideoPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#0F172A' }}>
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{ border: '1px solid rgba(244,114,182,0.2)', background: 'rgba(244,114,182,0.06)', color: '#F472B6' }}>
            <Sparkles size={14} />
            AI Video Type
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">Multi Images Video</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-dark-secondary)' }}>
            Upload your video, write a title, add images. Get a professional story-style reel with animated image slideshow below your video.
          </p>
          <div className="mt-8">
            <Link href="/dashboard?videoType=multi-images-video" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
              Try Multi Images Video
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • Upload video + images • 1080p MP4 export</p>
        </div>
      </section>

      {/* Banner */}
      <section className="px-4 pb-12 sm:px-6">
        <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-pink-400/15 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <img src="/visuals/banners/multi-images-video.png" alt="Multi Images Video output preview" className="w-full h-auto" loading="lazy" />
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">What you get</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "16:9 video plays at top with audio",
              "Bold title below the video",
              "Animated image slideshow (Ken Burns, pan, zoom)",
              "Images crossfade smoothly",
              "Progress dots show current image",
              "Professional dark background with glow effects",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
                <Check size={18} className="mt-0.5 shrink-0" style={{ color: '#F472B6' }} />
                <span className="text-sm leading-6" style={{ color: 'var(--text-dark-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">Best for</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "News pages sharing breaking stories",
              "Travel creators showing trip photos",
              "Product launches with multiple shots",
            ].map((item) => (
              <div key={item} className="rounded-lg p-4 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
                <p className="text-sm font-semibold leading-6" style={{ color: 'var(--text-dark-secondary)' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConversionHook
        templateName="Multi Images Video"
        dashboardUrl="/dashboard?videoType=multi-images-video"
        accentColor="#F472B6"
        inputType="video + images"
        outputTime="2 minutes"
      />

      <StickyBottomCTA
        templateName="Multi Images Video"
        dashboardUrl="/dashboard?videoType=multi-images-video"
        accentColor="#F472B6"
      />
    </main>
  );
}
