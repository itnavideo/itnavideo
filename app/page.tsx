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
  description: "Free AI video generator for creators. Turn text, audio, clips, and photos into viral Reels, Shorts, and 16:9 YouTube videos automatically with Itnavideo.",
  keywords: [
    "AI video generator",
    "text to video maker",
    "faceless video creator",
    "auto caption generator",
    "free subtitle generator",
    "AI reels maker",
    "YouTube shorts creator",
    "video caption generator",
    "AI video creator USA",
  ],
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
    description: "Free AI video generator for creators. Turn text, audio, clips, and photos into viral Reels, Shorts, and 16:9 YouTube videos automatically with Itnavideo.",
    url: "https://www.itnavideo.com",
    siteName: "Itnavideo",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Itnavideo Free AI Video Generator & Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Video Generator & Maker | Itnavideo",
    description: "Free AI video generator for creators. Turn text, audio, clips, and photos into viral Reels, Shorts, and 16:9 YouTube videos automatically with Itnavideo.",
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
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/video-types?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Itnavideo",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web, Windows, macOS, iOS, Android",
    url: siteUrl,
    description: "AI video creation platform with purpose-built video workflows including Auto Caption Generator, Faceless 16:9 YouTube Video Studio, Compare Explainers, Whiteboard Videos, and AI Voiceover sync.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1420",
      bestRating: "5",
    },
    offers: [
      {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "0",
        availability: "https://schema.org/InStock",
        category: "Free Trial",
      },
      {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "9.99",
        availability: "https://schema.org/InStock",
        category: "Creator Starter Pack",
      },
      {
        "@type": "Offer",
        priceCurrency: "INR",
        price: "99",
        availability: "https://schema.org/InStock",
        category: "Creator Starter Pack India",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I use Itnavideo to generate videos for free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Itnavideo offers free sign up with complimentary credits to try out Auto Caption generation, Faceless Video creation, and AI Audio cleaning without requiring a credit card upfront.",
        },
      },
      {
        "@type": "Question",
        name: "How does the Auto Caption Generator work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply upload your video or audio. Our deep learning speech engine transcribes words with sub-second accuracy and creates animated, kinetic karaoke-style captions styled like Alex Hormozi and MrBeast reels.",
        },
      },
      {
        "@type": "Question",
        name: "What aspect ratios and video lengths are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Itnavideo supports 9:16 vertical videos for Instagram Reels, YouTube Shorts, and TikTok, as well as 16:9 widescreen formats for full-length YouTube videos up to 30 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Does Itnavideo support faceless YouTube video generation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the Faceless Video and Image to Video AI workflows allow you to upload audio voiceovers or scripts and automatically generate cinematic 16:9 YouTube videos with continuous Ken Burns camera motion, visuals, and synchronized captions.",
        },
      },
    ],
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
