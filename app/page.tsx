import React from 'react';
import type { Metadata } from "next";

import nextDynamic from "next/dynamic";
import Hero from "@/components/landing/Hero";
import WhatCanYouCreate from "@/components/landing/WhatCanYouCreate";

const LongVideoShowcase = nextDynamic(() => import("@/components/landing/LongVideoShowcase"), { ssr: true });
const DemoVideosShowcase = nextDynamic(() => import("@/components/landing/DemoVideosShowcase"), { ssr: true });
const TestimonialSection = nextDynamic(() => import("@/components/landing/TestimonialSection"), { ssr: true });
const PricingSection = nextDynamic(() => import("@/components/landing/PricingSection"), { ssr: true });
const FAQSection = nextDynamic(() => import("@/components/FAQSection"), { ssr: true });

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours ISR edge cache

export const metadata: Metadata = {
  title: "Free AI Video Generator & Maker | Itnavideo",
  description: "Free AI video generator for creators. Turn text, audio, clips, and photos into viral Reels, Shorts, and YouTube videos automatically with Itnavideo.",
  alternates: {
    canonical: "https://www.itnavideo.com",
    languages: {
      "en": "https://www.itnavideo.com",
      "en-US": "https://www.itnavideo.com",
      "x-default": "https://www.itnavideo.com",
    },
  },
  openGraph: {
    title: "Free AI Video Generator & Maker | Itnavideo",
    description: "Free AI video generator for creators. Turn text, audio, clips, and photos into viral Reels, Shorts, and YouTube videos automatically with Itnavideo.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Video Generator & Maker | Itnavideo",
    description: "Free AI video generator for creators. Turn text, audio, clips, and photos into viral Reels, Shorts, and YouTube videos automatically with Itnavideo.",
    images: ["/og-image.png"],
  },
};

const siteUrl = "https://www.itnavideo.com";
const socialProfiles = [
  "https://x.com/itnavideo",
  "https://www.facebook.com/itnavideo",
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
    description: "AI video creation platform with purpose-built video workflows including Auto Caption Generator, Compare Explainers, Whiteboard Videos, Kinetic Typography, and AI Video Generator.",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "99",
      availability: "https://schema.org/InStock",
    },
  },
];

export default function LandingPage() {
  return (
    <div className="relative flex flex-col overflow-x-hidden bg-[#08070B] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* 1. Hero Section — Cinematic Midnight Studio Aesthetic */}
      <Hero />

      {/* 2. "What Can You Create?" Section — Shows Output Explanations for ALL Video Types (9:16 & 16:9) */}
      <WhatCanYouCreate />

      {/* 3.5. Faceless Video Showcase — 16:9 YouTube Long-Form Production */}
      <LongVideoShowcase />

      {/* Real Demo Videos Showcase — Live Rendered Demo Videos */}
      <DemoVideosShowcase />

      <TestimonialSection />

      {/* 11. Pricing Section */}
      <PricingSection />

      {/* 12. FAQ Section */}
      <FAQSection />

      {/* 13. Comprehensive SEO Content Section (Text-to-Code Ratio Boost) */}
      <section className="bg-[#050407] border-t border-white/10 py-16 px-6">
        <div className="mx-auto max-w-5xl text-zinc-300 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
              Free AI Video Generator &amp; <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">Online AI Video Maker Platform</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Itnavideo is the all-in-one <strong>free AI video generator</strong> and automated video creation platform designed to streamline video production for Instagram Reels, YouTube Shorts, TikTok, and LinkedIn. Instead of spending hours learning complex video editing software, our <strong>AI video maker</strong> leverages artificial intelligence to analyze raw audio tracks, video clips, photos, and text scripts, automatically converting them into engaging, high-retention videos in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-sm leading-relaxed">
            <div className="space-y-3 bg-[#131218] p-5 rounded-2xl border border-white/10 shadow-sm">
              <h3 className="text-base font-semibold text-white">
                Text to Video Generator
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Turn written scripts, outlines, and prompts into complete narrated videos. Our <strong>text to video generator</strong> matches visual assets, designs dynamic scene transitions, and syncs word-level subtitles automatically.
              </p>
            </div>

            <div className="space-y-3 bg-[#131218] p-5 rounded-2xl border border-white/10 shadow-sm">
              <h3 className="text-base font-semibold text-white">
                Best AI Video Generators for Creators
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Explore specialized video generation workflows including Auto Caption Reels, Compare Explainers, Whiteboard Lessons, Typography Videos, AI Audio Cleaner, and Faceless Videos.
              </p>
            </div>

            <div className="space-y-3 bg-[#131218] p-5 rounded-2xl border border-white/10 shadow-sm">
              <h3 className="text-base font-semibold text-white">
                Studio-Quality AI Video Generation
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Generate videos with cloud rendering, sub-second speech synchronization, Roman Hinglish subtitle support, audio noise cleaning, and 1080p Full HD watermark-free downloads.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
