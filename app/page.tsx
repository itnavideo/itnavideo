import React from 'react';
import type { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import IntroVideoSection from "@/components/landing/IntroVideoSection";
import HowItWorks from "@/components/landing/HowItWorks";
import VideoTypeGuide from "@/components/landing/VideoTypeGuide";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import HomepageDemoGrid from "@/components/landing/HomepageDemoGrid";
import FounderVideoSection from "@/components/landing/FounderVideoSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FAQSection from "@/components/FAQSection";
import StatsBar from "@/components/landing/StatsBar";

export const metadata: Metadata = {
  title: "Itnavideo - Polished Short Clips and Long-form Captioned Videos",
  description: "AI video tool for creators. Turn uploads into captioned 9:16 reels or preserve a 16:9 long-form video with timed captions, original audio, and clear credit pricing.",
  openGraph: {
    title: "Itnavideo - Polished Short Clips and Long-form Captioned Videos",
    description: "Create captioned 9:16 reels or preserve a 16:9 long-form video with timed captions and original audio.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Itnavideo - Polished Short Clips and Long-form Captioned Videos",
    description: "Create captioned 9:16 reels or preserve a 16:9 long-form video with timed captions and original audio.",
    images: ["/og-image.png"],
  },
};

const siteUrl = "https://www.itnavideo.com";
const socialProfiles = [
  "https://www.instagram.com/itnavideo/",
  "https://www.youtube.com/@Itnavideo",
  "https://www.linkedin.com/company/itnavideo-ai/",
  "https://www.linkedin.com/in/syedrohi/",
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Itnavideo",
    url: siteUrl,
    logo: `${siteUrl}/icon`,
    sameAs: socialProfiles,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Itnavideo",
    url: siteUrl,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Itnavideo",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description: "AI video tool for creators that creates captioned 9:16 reels and preserves 16:9 long-form videos with timed captions. Focused video types include Auto Caption, Long-form Captioned Video, Compare Explainer, Long Video Promo, and more.",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "9",
      availability: "https://schema.org/InStock",
    },
  },
];

export default function LandingPage() {
  return (
    <div className="relative flex flex-col overflow-x-hidden bg-[#0F172A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <IntroVideoSection />
      <StatsBar />
      <HomepageDemoGrid />
      <HowItWorks />
      <FeaturesSection />
      <VideoTypeGuide />
      <FounderVideoSection />
      <TestimonialSection />
      <PricingSection />
      <FAQSection />
      {/* Discover more — pill links to all templates */}
      <section className="px-4 py-16 sm:px-6" style={{ background: '#070A12' }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Templates</p>
          <h2 className="mb-8 text-2xl font-black text-white sm:text-3xl">Discover more:</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Auto Caption Video', href: '/dashboard?videoType=auto-caption-reel' },
              { label: 'Caption Studio', href: '/dashboard?videoType=caption-studio' },
              { label: 'Compare Explainer', href: '/dashboard?videoType=compare-explainer' },
              { label: 'Whiteboard Video', href: '/dashboard?videoType=whiteboard-video' },
              { label: 'Typography Video', href: '/dashboard?videoType=typography-video' },
              { label: 'Multi Images Video', href: '/dashboard?videoType=multi-images-video' },
              { label: 'Long Video Promo', href: '/dashboard?videoType=long-video-promo' },
              { label: 'Long Video Captions', href: '/dashboard?videoType=long-form-captioned-video' },
              { label: 'Long Video Clips', href: '/dashboard?videoType=long-video-clips' },
              { label: 'AI Audio Cleaner', href: '/dashboard?videoType=ai-audio-cleaner' },
            ].map((t) => (
              <a key={t.label} href={t.href} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-brand-cyan/40 hover:bg-white/[0.08] hover:text-white">
                {t.label} <span className="text-slate-500">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
