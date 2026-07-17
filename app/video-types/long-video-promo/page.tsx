import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import PromoBeforeAfter from "@/components/landing/PromoBeforeAfter";

export const metadata: Metadata = {
  title: "Long Video Promo Maker — YouTube Video to Short Clip | Itnavideo",
  description: "Turn any YouTube video into a promotional short reel with thumbnail, title overlay, and highlight clip. Drive views to your long-form content.",
  alternates: {
    canonical: "/long-video-promo",
  },
  openGraph: {
    title: "Long Video Promo Maker — YouTube Video to Short Clip | Itnavideo",
    description: "Turn any YouTube video into a promotional short reel with thumbnail, title overlay, and highlight clip. Drive views to your long-form content.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Long Video Promo Maker — YouTube Video to Short Clip | Itnavideo",
    description: "Turn any YouTube video into a promotional short reel with thumbnail, title overlay, and highlight clip. Drive views to your long-form content.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Long Video Promo — Itnavideo",
  applicationCategory: "VideoEditor",
  operatingSystem: "Web",
  url: "https://www.itnavideo.com/long-video-promo",
  description: "Turn any YouTube video into a promotional short reel with thumbnail, title overlay, and highlight clip. Drive views to your long-form content.",
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    price: "9",
    availability: "https://schema.org/InStock",
  },
};

export default function LongVideoPromoPage() {
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
            Long Video Promo
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-dark-secondary)' }}>
            Promote your YouTube video with a thumbnail-driven promo reel.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">What you get</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Thumbnail + title overlay",
              "Highlight clip extraction",
              "Subscribe CTA built-in",
              "Channel branding support",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
                <Check size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--color-primary-hover)' }} />
                <span className="text-sm leading-6" style={{ color: 'var(--text-dark-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After demo */}
      <PromoBeforeAfter />

      {/* Who this is for */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">Who this is for</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "YouTubers promoting new uploads",
              "Podcasters driving listeners to full episodes",
              "Course creators previewing lesson content",
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
            href="/dashboard?videoType=long-video-promo"
            className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark"
          >
            Create a Long Video Promo
            <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>
            Paid Long Video Promo exports are included in the Pro and Business plans.
          </p>
        </div>
      </section>

      {/* Pricing note */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-lg p-6 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
          <p className="text-sm leading-6" style={{ color: 'var(--text-dark-secondary)' }}>
            All currently available video types use the same transparent credit pack, with the exact 1- or 2-credit cost shown before render. Long Video Clips and long-form captions use their stated dynamic rates.
          </p>
          <Link href="/pricing" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold transition hover:opacity-80" style={{ color: 'var(--color-primary-hover)' }}>
            View pricing <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
