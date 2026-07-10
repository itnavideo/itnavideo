import React from 'react';
import type { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import AutoCaptionsShowcase from "@/components/captions/AutoCaptionsShowcase";
import PromoBeforeAfter from "@/components/landing/PromoBeforeAfter";
import VideoTypeGuide from "@/components/landing/VideoTypeGuide";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "Itnavideo - Upload a Talking Video, Get It Back Captioned and Styled",
  description: "AI video tool for creators. Upload your video, pick a style, get a finished 9:16 reel with captions in under 3 minutes. 1 free credit on signup. No editing skills needed.",
  openGraph: {
    title: "Itnavideo - Upload a Talking Video, Get It Back Captioned and Styled",
    description: "AI video tool for creators. Upload your video, pick a style, get a finished 9:16 reel with captions in under 3 minutes. 1 free credit on signup.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Itnavideo - Upload a Talking Video, Get It Back Captioned and Styled",
    description: "AI video tool for creators. Upload your video, pick a style, get a finished 9:16 reel with captions in under 3 minutes. 1 free credit on signup.",
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
    description: "AI video tool that turns talking videos, audio, and images into polished 9:16 reels with word-level captions. Focused video types for creators: Auto Caption, Compare Explainer, Long Video Promo, and more.",
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
      <AutoCaptionsShowcase limit={3} />
      <HowItWorks />
      <FeaturesSection />
      <PromoBeforeAfter />
      <PricingSection />
      <FAQSection />
      <VideoTypeGuide />
    </div>
  );
}
