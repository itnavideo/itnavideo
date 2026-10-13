import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import Hero from '@/components/landing/Hero';
import PlatformMarqueeTicker from '@/components/landing/PlatformMarqueeTicker';
import FacelessVideoFlagshipShowcase from '@/components/landing/FacelessVideoFlagshipShowcase';
import CaptionStylesShowcase from '@/components/landing/CaptionStylesShowcase';
import ImageToVideoHomepageShowcase from '@/components/landing/ImageToVideoHomepageShowcase';
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
  title: 'Free AI Video Generator & Maker | Faceless Video AI',
  description: `The #1 Faceless Video AI Generator. Create 16:9 YouTube videos and 9:16 Shorts with automated storytelling, B-roll visuals, voiceovers, and subtitles.`,
  keywords: [
    'faceless video generator',
    'AI faceless video generator',
    'faceless YouTube video creator',
    'AI video generator',
    'free AI video generator',
    'auto caption generator',
    'book summary video maker',
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
    title: 'Free AI Video Generator & Maker | Faceless Video AI',
    description: `Create 16:9 YouTube Faceless Videos and 9:16 Shorts with automated storytelling, voiceovers, and B-roll visuals.`,
    url: 'https://www.itnavideo.com',
    siteName: 'Itnavideo',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Itnavideo Faceless Video AI Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Video Generator & Maker | Faceless Video AI',
    description: `Create 16:9 YouTube Faceless Videos and 9:16 Shorts with automated B-roll, voiceover, and captions.`,
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
    name: 'Itnavideo Faceless Video AI',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    description: `AI Faceless video creation platform for 16:9 YouTube videos and 9:16 Shorts with automated storytelling, voiceovers, B-roll matching, and captions.`,
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
        name: 'Can I create 16:9 YouTube Faceless Videos on Itnavideo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Itnavideo provides a dedicated 16:9 Widescreen Faceless Video studio for YouTubers and creators to make long-form videos up to 12 minutes.',
        },
      },
      {
        '@type': 'Question',
        name: 'What formats are supported for Faceless Video?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Both 16:9 Widescreen (YouTube long-form) and 9:16 Vertical (Shorts, Reels, TikTok) formats are supported.',
        },
      },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="relative flex flex-col overflow-x-hidden bg-white text-slate-900 selection:bg-orange-500/20 selection:text-orange-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <Hero />
      <PlatformMarqueeTicker />
      <FacelessVideoFlagshipShowcase />
      <PlatformJourney />
      <CaptionStylesShowcase />
      <ImageToVideoHomepageShowcase />
      <TenStudiosHubArchitecture />
      <PricingSection />
      <FAQSection />
      <HomepageFinalCta />
    </div>
  );
}
