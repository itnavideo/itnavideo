'use client';

import React from 'react';
import Hero from "@/components/landing/Hero";
import ComparisonSection from "@/components/landing/ComparisonSection";
import AudienceWall from "@/components/landing/AudienceWall";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ModeSplitSection from "@/components/landing/ModeSplitSection";
import DeploymentStackSection from "@/components/landing/DeploymentStackSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import LongFormComingSoon from "@/components/landing/LongFormComingSoon";
import HowItWorks from "@/components/landing/HowItWorks";
import BlogPreviewSection from "@/components/landing/BlogPreviewSection";
import FAQSection from "@/components/FAQSection";

export default function LandingPage() {
  return (
    <div className="relative flex flex-col overflow-x-hidden bg-black">
      <Hero />
      <AudienceWall />
      <ModeSplitSection />
      <DeploymentStackSection />
      <ComparisonSection />
      <HowItWorks />
      <FeaturesSection />
      <BlogPreviewSection />
      <LongFormComingSoon />
      <TestimonialSection />
      <FAQSection />
    </div>
  );
}

