import React from 'react';
import type { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import IntroVideoSection from "@/components/landing/IntroVideoSection";
import HowItWorks from "@/components/landing/HowItWorks";
import VideoTypeGuide from "@/components/landing/VideoTypeGuide";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import HomepageDemoGrid from "@/components/landing/HomepageDemoGrid";
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
      <PricingSection />
      <FAQSection />
    </div>
  );
}
