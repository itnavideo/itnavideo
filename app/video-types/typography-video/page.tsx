import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { DemoVideoGrid, TYPOGRAPHY_VIDEOS } from "@/components/captions/DemoCaptionGallery";

export const metadata: Metadata = {
  title: "Typography Video — Bold Keyword Reels from Talking Videos | Itnavideo",
  description: "Upload your talking video and AI adds big bold text overlays synced to your speech. Numbers, keywords, and stats pop on screen for maximum engagement.",
  alternates: { canonical: "/typography-video" },
  openGraph: {
    title: "Typography Video — Bold Keyword Reels | Itnavideo",
    description: "Upload your talking video and AI adds big bold text overlays synced to your speech.",
    images: ["/preview/Typography Video.png"],
  },
};

export default function TypographyVideoPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#0F172A' }}>
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{ border: '1px solid rgba(139,92,246,0.25)', background: 'rgba(139,92,246,0.08)', color: '#8B5CF6' }}>
            <Sparkles size={14} />
            AI Video Type
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">Typography Video</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-dark-secondary)' }}>
            Upload your talking video. AI detects important keywords, numbers, and strong statements — then displays them as big bold text overlays synced to your speech.
          </p>
          <div className="mt-8">
            <Link href="/dashboard?videoType=typography-video" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
              Create Typography Video <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • Upload video • 1080p MP4 export</p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">What you get</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Big bold keywords pop on screen",
              "Numbers and stats highlighted automatically",
              "Text synced exactly to your speech timing",
              "8 color styles (Chrome, Neon, Fire, Ice, Gold...)",
              "5 animation types (pop, slideUp, zoom, shake, flip)",
              "Semi-transparent text — doesn't block your face",
              "Small captions at bottom with active word",
              "Full-screen video stays as the background",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg p-3" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '10px' }}>
                <Check size={16} className="mt-0.5 shrink-0" style={{ color: '#8B5CF6' }} />
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
              { icon: "📹", title: "Upload video", desc: "Any talking video with clear speech" },
              { icon: "🎨", title: "Pick a style", desc: "Choose color style and caption preference" },
              { icon: "✨", title: "Get your reel", desc: "AI extracts keywords and renders bold text overlay" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <div className="mb-3 text-3xl">{item.icon}</div>
                <p className="text-sm font-black text-white">{item.title}</p>
                <p className="mt-2 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DemoVideoGrid
        videos={TYPOGRAPHY_VIDEOS}
        title="Typography Video demos"
        subtitle="Real output from creators. Hover or tap to play."
        accent="#8B5CF6"
      />

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">Best for</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { emoji: "🎤", title: "Motivational speakers", desc: "Key phrases hit harder with bold text" },
              { emoji: "📊", title: "Business creators", desc: "Numbers and stats stand out visually" },
              { emoji: "🧠", title: "Educators", desc: "Important concepts are emphasized on screen" },
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
              { q: "How does AI choose which words to highlight?", a: "AI analyzes your transcript for numbers, strong verbs, questions, and key phrases. It picks 2-3 word groups that carry the most impact." },
              { q: "Will the text block my face?", a: "No. Text appears semi-transparent and is positioned to complement your video, not obscure it." },
              { q: "Can I choose the color style?", a: "Yes! Pick from 8 styles: Chrome, Neon Blue, Fire, Ice White, Gold, Purple, Red Bold, and Green Matrix." },
              { q: "What kind of video works best?", a: "Any talking video with strong statements, numbers, or motivational content. Videos with stats and data look especially good." },
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
          <Link href="/dashboard?videoType=typography-video" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
            Create Typography Video <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • 8 color styles • Ready for Reels & Shorts</p>
        </div>
      </section>
    </main>
  );
}
