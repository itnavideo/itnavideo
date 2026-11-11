import type { Metadata } from 'next';
import SplitScreenExplainerDetail from '../video-types/split-screen-explainer/SplitScreenExplainerDetail';

export const metadata: Metadata = {
  title: 'Split Screen Explainer Video Generator — Presenter + Screen Demo | Itnavideo',
  description:
    'Create multi-frame split screen explainer videos for Reels, Shorts, and TikTok. Combine talking head video recordings with software demos, presentations, or reaction clips with synchronized animated captions.',
  keywords: [
    'split screen explainer video generator',
    'split screen video maker',
    'talking head and screen recording',
    'dual video layout generator',
    'saas demo video maker',
    'reaction video editor online',
    'vertical split screen reels',
    'split screen subtitles ai',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/split-screen-explainer' },
  openGraph: {
    title: 'Split Screen Explainer Video Generator — Presenter + Screen Demo | Itnavideo',
    description:
      'Combine presenter video with live software demos or reactions in a synchronized 9:16 vertical split screen layout with animated captions.',
    url: 'https://www.itnavideo.com/split-screen-explainer',
    siteName: 'Itnavideo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split Screen Explainer Video Generator — Presenter + Screen Demo',
    description:
      'Create synchronized dual-panel split screen videos for Instagram Reels and Shorts in under 45 seconds.',
  },
};

export default function SplitScreenExplainerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Itnavideo Split Screen Explainer Video Generator',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    url: 'https://www.itnavideo.com/split-screen-explainer',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description:
      'Split Screen Explainer Video Generator creates dual-panel vertical videos pairing presenter footage with software screencasts and animated captions.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SplitScreenExplainerDetail />
    </>
  );
}

