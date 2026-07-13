import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { DemoVideoGrid, COMPARE_VIDEOS } from "@/components/captions/DemoCaptionGallery";

export const metadata: Metadata = {
  title: "Compare Explainer Video Maker — Side-by-Side Reels | Itnavideo",
  description: "Create comparison reels with left vs right panels, voiceover subtitles, and sticker presenters. Perfect for education, finance, and career explainers.",
  alternates: {
    canonical: "/compare-explainer",
  },
  openGraph: {
    title: "Compare Explainer Video Maker — Side-by-Side Reels | Itnavideo",
    description: "Create comparison reels with left vs right panels, voiceover subtitles, and sticker presenters. Perfect for education, finance, and career explainers.",
    images: ["/preview/Compare Explainer.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Compare Explainer — Itnavideo",
  applicationCategory: "VideoEditor",
  operatingSystem: "Web",
  url: "https://www.itnavideo.com/compare-explainer",
  description: "Create comparison reels with left vs right panels, voiceover subtitles, and sticker presenters.",
  offers: { "@type": "Offer", priceCurrency: "INR", price: "9", availability: "https://schema.org/InStock" },
};

export default function CompareExplainerPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#0F172A' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{ border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.08)', color: '#F59E0B' }}>
            <Sparkles size={14} />
            AI Video Type
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">Compare Explainer Video</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-dark-secondary)' }}>
            Upload audio + 2 images. AI builds a left-vs-right comparison reel with animated sticker presenter, subtitles synced to your voiceover, and professional transitions.
          </p>
          <div className="mt-8">
            <Link href="/dashboard?videoType=compare-explainer" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
              Create Compare Video <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • Upload audio + 2 images • 1080p MP4</p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">What you get</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Dual-panel left vs right comparison layout",
              "Animated sticker character presenter",
              "Voiceover-synced subtitles at bottom",
              "Title and creator handle overlay",
              "Sticker poses change based on content",
              "Multiple sticker characters to choose from",
              "Professional dark gradient background",
              "9:16 vertical format for Reels & Shorts",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg p-3" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '10px' }}>
                <Check size={16} className="mt-0.5 shrink-0" style={{ color: '#F59E0B' }} />
                <span className="text-sm leading-6" style={{ color: 'var(--text-dark-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", icon: "🖼️", title: "Upload 2 images", desc: "Left and right visuals for your comparison" },
              { step: "2", icon: "🎙️", title: "Upload voiceover", desc: "Record or upload your comparison script" },
              { step: "3", icon: "✨", title: "Get your reel", desc: "AI syncs everything into a polished comparison video" },
            ].map((item) => (
              <div key={item.step} className="rounded-xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <div className="mb-3 text-3xl">{item.icon}</div>
                <p className="text-sm font-black text-white">{item.title}</p>
                <p className="mt-2 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DemoVideoGrid
        videos={COMPARE_VIDEOS}
        title="Compare Explainer demo videos"
        subtitle="Real output from creators. Hover or tap to play."
        accent="#F59E0B"
      />

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">Best for</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { emoji: "💰", title: "Finance educators", desc: "Compare investment options, accounts, insurance" },
              { emoji: "💼", title: "Career coaches", desc: "Compare job paths, exams, certifications" },
              { emoji: "💻", title: "Tech reviewers", desc: "Compare tools, frameworks, devices" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <div className="mb-2 text-2xl">{item.emoji}</div>
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-center text-2xl font-black">FAQ</h2>
          <div className="grid gap-3">
            {[
              { q: "What format should the images be?", a: "JPG, PNG, or WEBP. Any size — they'll be cropped to fit the comparison panels." },
              { q: "How long should the voiceover be?", a: "30-60 seconds works best. AI trims to the first 60 seconds if longer." },
              { q: "Can I choose the sticker character?", a: "Yes! Pick from multiple animated presenter characters in the dashboard." },
              { q: "What language is supported?", a: "English and Hinglish (Hindi in Roman script). Subtitles are generated from your voiceover." },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <summary className="cursor-pointer text-sm font-bold text-white list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-zinc-500 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <p className="mt-2 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <Link href="/dashboard?videoType=compare-explainer" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
            Create Compare Video <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • 1080p MP4 • Ready for Reels & Shorts</p>
        </div>
      </section>
    </main>
  );
}
