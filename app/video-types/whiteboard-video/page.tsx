import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Whiteboard Video Maker — AI Explainer from Speech | Itnavideo",
  description: "Upload audio or video and AI writes key points on a professional whiteboard. Perfect for educational reels, business explainers, and step-by-step tutorials.",
  alternates: { canonical: "/whiteboard-video" },
  openGraph: {
    title: "Whiteboard Video Maker — AI Explainer from Speech | Itnavideo",
    description: "Upload audio or video and AI writes key points on a professional whiteboard. Perfect for educational reels, business explainers, and step-by-step tutorials.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Whiteboard Video — Itnavideo",
  applicationCategory: "VideoEditor",
  operatingSystem: "Web",
  url: "https://www.itnavideo.com/whiteboard-video",
  description: "Upload audio or video and AI writes key points on a professional whiteboard.",
  offers: { "@type": "Offer", priceCurrency: "INR", price: "9", availability: "https://schema.org/InStock" },
};

export default function WhiteboardVideoPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#0F172A' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{ border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.06)', color: '#10B981' }}>
            <Sparkles size={14} />
            AI Video Type
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">Whiteboard Video</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-dark-secondary)' }}>
            Upload your audio or video. AI extracts key points and writes them on a professional whiteboard — marker style, synced to your speech.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">What you get</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Handwritten marker-style text on whiteboard",
              "Points appear synced to your speech timing",
              "Professional corporate background",
              "Colored markers (blue, green, red, black)",
              "5-8 key points extracted by AI",
              "Clean 9:16 vertical format",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
                <Check size={18} className="mt-0.5 shrink-0" style={{ color: '#10B981' }} />
                <span className="text-sm leading-6" style={{ color: 'var(--text-dark-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">Who this is for</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Teachers explaining concepts",
              "Business coaches sharing frameworks",
              "Finance creators teaching strategies",
            ].map((item) => (
              <div key={item} className="rounded-lg p-4 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
                <p className="text-sm font-semibold leading-6" style={{ color: 'var(--text-dark-secondary)' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <Link href="/dashboard?videoType=whiteboard-video" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
            Try Whiteboard Video
            <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • Upload audio or video • 1080p MP4 export</p>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-lg p-6 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
          <p className="text-sm leading-6" style={{ color: 'var(--text-dark-secondary)' }}>
            All video types are available on every plan. No features locked behind higher tiers.
          </p>
          <Link href="/pricing" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold transition hover:opacity-80" style={{ color: 'var(--color-primary-hover)' }}>
            View pricing <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
