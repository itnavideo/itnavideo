import React from 'react';
import type { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCaseGallerySection from "@/components/landing/UseCaseGallerySection";
import SearchIntentSection from "@/components/landing/SearchIntentSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CreatorRewardsSection from "@/components/landing/CreatorRewardsSection";
import FAQSection from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "Itnavideo - Seven Premium AI Video Types",
  description: "Create polished 9:16 reels with seven focused AI video types: Custom AI Reel, Creator Reel, Auto Caption, Background Replace, Compare Explainer, Auto Draw, and Long Video Promo.",
  openGraph: {
    title: "Itnavideo - Seven Premium AI Video Types",
    description: "Create polished 9:16 reels with seven focused AI video types: Custom AI Reel, Creator Reel, Auto Caption, Background Replace, Compare Explainer, Auto Draw, and Long Video Promo.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Itnavideo - Seven Premium AI Video Types",
    description: "Create polished 9:16 reels with seven focused AI video types: Custom AI Reel, Creator Reel, Auto Caption, Background Replace, Compare Explainer, Auto Draw, and Long Video Promo.",
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
    description: "AI reel generator with seven focused video types for custom prompts, creator edits, background replacement, captions, comparison explainers, whiteboard explainers, and long video promos.",
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
      <HowItWorks />
      <UseCaseGallerySection />
      <FeaturesSection />
      <CreatorRewardsSection />
      <FAQSection />
      <SearchIntentSection />
    </div>
  );
}
