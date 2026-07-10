import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Typography Video — Bold Keyword Reels from Talking Videos | Itnavideo",
  description: "Upload your talking video and AI adds big bold text overlays synced to your speech. Numbers, keywords, and stats pop on screen for maximum engagement.",
  alternates: { canonical: "/typography-video" },
  openGraph: {
    title: "Typography Video — Bold Keyword Reels | Itnavideo",
    description: "Upload your talking video and AI adds big bold text overlays synced to your speech. Numbers, keywords, and stats pop on screen for maximum engagement.",
    images: ["/og-image.png"],
  },
};

export default function TypographyVideoPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#0F172A' }}>
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{ border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.06)', color: '#8B5CF6' }}>
            <Sparkles size={14} />
            AI Video Type
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">Typography Video</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-dark-secondary)' }}>
            Upload your talking video. AI detects important keywords and numbers, then displays them as big bold text overlays synced to your speech.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">What you get</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Big bold keywords pop on screen",
              "Numbers and stats highlighted automatically",
              "Text synced to your speech timing",
              "Small captions at bottom with active word",
              "Semi-transparent text — doesn't block you",
              "Different colors and sizes for variety",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
                <Check size={18} className="mt-0.5 shrink-0" style={{ color: '#8B5CF6' }} />
                <span className="text-sm leading-6" style={{ color: 'var(--text-dark-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <Link href="/dashboard?videoType=typography-video" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
            Try Typography Video
            <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • Upload video • 1080p MP4 export</p>
        </div>
      </section>
    </main>
  );
}
