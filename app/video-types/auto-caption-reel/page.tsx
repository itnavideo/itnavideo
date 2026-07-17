import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import AutoCaptionsShowcase from "@/components/captions/AutoCaptionsShowcase";
import DemoCaptionGallery from "@/components/captions/DemoCaptionGallery";

export const metadata: Metadata = {
  title: "Auto Caption Reel Generator — AI Word-Level Subtitles | Itnavideo",
  description: "Upload your video and get stylish word-level captions automatically. 9:16 reel ready for Instagram Reels, YouTube Shorts, and TikTok. No editing needed.",
  alternates: {
    canonical: "/auto-caption-reel",
  },
  openGraph: {
    title: "Auto Caption Reel Generator — AI Word-Level Subtitles | Itnavideo",
    description: "Upload your video and get stylish word-level captions automatically. 9:16 reel ready for Instagram Reels, YouTube Shorts, and TikTok. No editing needed.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Caption Reel Generator — AI Word-Level Subtitles | Itnavideo",
    description: "Upload your video and get stylish word-level captions automatically. 9:16 reel ready for Instagram Reels, YouTube Shorts, and TikTok. No editing needed.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Auto Caption Reel — Itnavideo",
  applicationCategory: "VideoEditor",
  operatingSystem: "Web",
  url: "https://www.itnavideo.com/auto-caption-reel",
  description: "Upload your video and get stylish word-level captions automatically. 9:16 reel ready for Instagram Reels, YouTube Shorts, and TikTok. No editing needed.",
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    price: "9",
    availability: "https://schema.org/InStock",
  },
};

export default function AutoCaptionReelPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#0F172A' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{ border: '1px solid rgba(91, 111, 255, 0.2)', background: 'rgba(91, 111, 255, 0.06)', color: 'var(--color-primary-hover)' }}>
            <Sparkles size={14} />
            AI Video Type
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">
            Auto Caption Video
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-dark-secondary)' }}>
            Upload your video. Get stylish word-level subtitles back.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">What you get</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "AI-synced word-level captions",
              "15+ caption styles (bounce, wave, glow, karaoke)",
              "Full-screen video preserved",
              "English & Hinglish language support",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
                <Check size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--color-primary-hover)' }} />
                <span className="text-sm leading-6" style={{ color: 'var(--text-dark-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After demo — real videos */}
      <AutoCaptionsShowcase />

      {/* Demo Output Gallery */}
      <DemoCaptionGallery />

      {/* Who this is for */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">Who this is for</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Educators making Hinglish explainer reels",
              "Business owners adding captions to product demos",
              "Creators who want subtitles without editing software",
            ].map((item) => (
              <div key={item} className="rounded-lg p-4 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
                <p className="text-sm font-semibold leading-6" style={{ color: 'var(--text-dark-secondary)' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <Link
            href="/dashboard?videoType=auto-caption-reel"
            className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark"
          >
            Try this video type free
            <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>
            One free watermarked Auto Caption Video • No card needed • 1080p MP4 export
          </p>
        </div>
      </section>

      {/* Pricing note */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-lg p-6 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
          <p className="text-sm leading-6" style={{ color: 'var(--text-dark-secondary)' }}>
            Auto Caption is the only free trial workflow: one video up to 60 seconds with a fixed Itnavideo watermark. Paid credits unlock clean exports and every available video type at the shown credit cost.
          </p>
          <Link href="/pricing" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold transition hover:opacity-80" style={{ color: 'var(--color-primary-hover)' }}>
            View pricing <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
