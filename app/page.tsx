import React from 'react';
import type { Metadata } from "next";

import Hero from "@/components/landing/Hero";
import QuickStartDropzone from "@/components/landing/QuickStartDropzone";
import UploadPipelineSection from "@/components/landing/UploadPipelineSection";
import WhatCanYouCreate from "@/components/landing/WhatCanYouCreate";
import DemoVideosShowcase from "@/components/landing/DemoVideosShowcase";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FAQSection from "@/components/FAQSection";

import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Free AI Video Generator & Maker | Itnavideo - AI Video Creation Platform",
  description: "The best free AI video generator for creators and brands. Turn text scripts, audio, video clips, and photos into viral Reels, Shorts, and 16:9 YouTube videos automatically.",
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
    description: "The best free AI video generator for creators and brands. Turn text scripts, audio, video clips, and photos into viral Reels, Shorts, and 16:9 YouTube videos automatically.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Video Generator & Maker | Itnavideo",
    description: "The best free AI video generator for creators and brands. Turn text scripts, audio, video clips, and photos into viral Reels, Shorts, and 16:9 YouTube videos automatically.",
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
    <div className="relative flex flex-col overflow-x-hidden bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

            {/* 1. Hero Section — White Background, Google Workspace Aesthetic */}
      <Hero />

      {/* 1.5. Interactive Visual Entry Point */}
      <QuickStartDropzone />

      {/* 2. Universal AI Pipeline */}
      <UploadPipelineSection />

      {/* 3. "What Can You Create?" Section — Shows Output Explanations for ALL 11 Video Types */}
      <WhatCanYouCreate />

      {/* Real Demo Videos Showcase — 27 Horizontal Demo Videos (Auto Caption, Compare Explainer, Typography) */}
      <DemoVideosShowcase />

      <TestimonialSection />

      {/* 11. Pricing Section */}
      <PricingSection />

      {/* 12. FAQ Section */}
      <FAQSection />

      {/* 13. Comprehensive SEO Content Section (Text-to-Code Ratio Boost) */}
      <section className="bg-slate-50 border-t border-slate-200 py-16 px-6">
        <div className="mx-auto max-w-5xl text-slate-700 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Free AI Video Generator &amp; Online AI Video Maker Platform
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Itnavideo is the all-in-one <strong>free AI video generator</strong> and automated video creation platform designed to streamline video production for Instagram Reels, YouTube Shorts, TikTok, and LinkedIn. Instead of spending hours learning complex video editing software, our <strong>AI video maker</strong> leverages artificial intelligence to analyze raw audio tracks, video clips, photos, and text scripts, automatically converting them into engaging, high-retention videos in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-sm leading-relaxed">
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900">
                Text to Video Generator
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Turn written scripts, outlines, and prompts into complete narrated videos. Our <strong>text to video generator</strong> matches visual assets, designs dynamic scene transitions, and syncs word-level subtitles automatically.
              </p>
            </div>

            <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900">
                Best AI Video Generators for Creators
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Explore 11 specialized video generation workflows including Auto Caption Reels, Compare Explainers, Whiteboard Lessons, Faceless Long Videos, and 16:9 Landscape Video Pro.
              </p>
            </div>

            <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900">
                Studio-Quality AI Video Generation
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Generate videos with cloud rendering, sub-second speech synchronization, Roman Hinglish subtitle support, audio noise cleaning, and 1080p Full HD watermark-free downloads.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
