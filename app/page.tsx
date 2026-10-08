import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import Hero from '@/components/landing/Hero';
import PlatformMarqueeTicker from '@/components/landing/PlatformMarqueeTicker';
import CaptionStylesShowcase from '@/components/landing/CaptionStylesShowcase';
import ImageToVideoHomepageShowcase from '@/components/landing/ImageToVideoHomepageShowcase';
import WhatCanYouCreate from '@/components/landing/WhatCanYouCreate';
import TenStudiosHubArchitecture from '@/components/landing/TenStudiosHubArchitecture';
import {
  HomepageFinalCta,
  PlatformJourney,
  WhyItnavideo,
} from '@/components/landing/HomepageValueSections';
import { pricingPlans } from '@/lib/billing/plans';
import { HOMEPAGE_WORKFLOW_COUNT } from '@/constants/homepageWorkflows';

const PricingSection = nextDynamic(() => import('@/components/landing/PricingSection'), { ssr: true });
const FAQSection = nextDynamic(() => import('@/components/FAQSection'), { ssr: true });

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Free AI Video Generator & Maker',
  description: `AI video generator with ${HOMEPAGE_WORKFLOW_COUNT} purpose-built studios for captions, Reels, YouTube videos, explainers, clips, image stories, and audio cleanup.`,
  keywords: [
    'AI video generator',
    'free AI video generator',
    'AI video maker',
    'auto caption generator',
    'YouTube subtitle generator',
    'faceless video creator',
    'image to video AI',
    'AI reels maker',
    'YouTube shorts creator',
    'video caption generator',
  ],
  alternates: {
    canonical: 'https://www.itnavideo.com',
    languages: {
      en: 'https://www.itnavideo.com',
      'en-US': 'https://www.itnavideo.com',
      'x-default': 'https://www.itnavideo.com',
    },
  },
  openGraph: {
    title: 'Free AI Video Generator & Maker | Itnavideo',
    description: `Choose from ${HOMEPAGE_WORKFLOW_COUNT} dedicated AI video and audio studios built for specific creator outcomes.`,
    url: 'https://www.itnavideo.com',
    siteName: 'Itnavideo',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Itnavideo AI Video Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Video Generator & Maker | Itnavideo',
    description: `${HOMEPAGE_WORKFLOW_COUNT} purpose-built studios for Reels, YouTube videos, captions, explainers, and audio.`,
    images: ['/og-image.png'],
  },
};

const siteUrl = 'https://www.itnavideo.com';

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Itnavideo',
    url: siteUrl,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Itnavideo',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    description: `AI video creation platform with ${HOMEPAGE_WORKFLOW_COUNT} purpose-built workflows for short-form video, YouTube video, subtitles, image storytelling, clips, and audio cleanup.`,
    offers: pricingPlans.map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      priceCurrency: 'USD',
      price: String((plan.quotes.USD?.amount || 0) / 100),
      availability: 'https://schema.org/InStock',
      category: plan.id === 'free' ? 'Free Trial' : 'Creator Plan',
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I try Itnavideo for free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. New users can start with the available free signup credit without entering a card.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many video workflows does Itnavideo offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Itnavideo offers ${HOMEPAGE_WORKFLOW_COUNT} dedicated studios for Auto Caption, YouTube Subtitles, Image to Video, Compare Explainers, Whiteboard Videos, Typography Videos, Faceless Videos, Long Video Promotions, Long Video Clips, AI Audio Cleaning, and Book Summary Videos.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Do all Itnavideo workflows use the same inputs and limits?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Each studio has its own required inputs, duration limits, controls, processing stages, output format, and credit calculation.',
        },
      },
      {
        '@type': 'Question',
        name: 'What video resolutions, quality, and durations are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every video rendered on Itnavideo is exported in crisp 1080p Full HD at 30 FPS. All 9:16 vertical short-form videos (Reels, TikTok, Shorts) render at 1080×1920 (1080p) up to 3 minutes (180s). All 16:9 widescreen YouTube videos render at 1920×1080 (1080p) up to 12 minutes (720s). Long Video to Clips accepts source videos up to 3 hours and creates multiple 30s–60s 1080p Full HD viral shorts.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which caption languages are currently supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'English and Roman Hinglish captions are currently supported. Hindi and Hinglish speech is transcribed into readable Roman Hinglish.',
        },
      },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="relative flex flex-col overflow-x-hidden bg-[#050505] text-zinc-100 selection:bg-[#FF6D00]/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <Hero />
      <PlatformMarqueeTicker />
      <CaptionStylesShowcase />
      <ImageToVideoHomepageShowcase />
      <TenStudiosHubArchitecture />
      <WhatCanYouCreate />
      <PlatformJourney />
      <PricingSection />
      <FAQSection />
      <HomepageFinalCta />
    </div>
  );
}
