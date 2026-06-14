import React from 'react';
import Hero from "@/components/landing/Hero";
import OutputProofSection from "@/components/landing/OutputProofSection";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCaseGallerySection from "@/components/landing/UseCaseGallerySection";
import ModeSplitSection from "@/components/landing/ModeSplitSection";
import SearchIntentSection from "@/components/landing/SearchIntentSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FAQSection from "@/components/FAQSection";

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
    description: "AI explainer video generator that turns audio or video into vertical reels with creator video, transcript subtitles, title, and support visuals.",
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
    <div className="relative flex flex-col overflow-x-hidden bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <OutputProofSection />
      <HowItWorks />
      <ModeSplitSection />
      <UseCaseGallerySection />
      <SearchIntentSection />
      <FeaturesSection />
      <FAQSection />
    </div>
  );
}


