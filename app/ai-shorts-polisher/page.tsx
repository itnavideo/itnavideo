import type { Metadata } from 'next';
import AiShortsPolisherDetail from '../video-types/ai-shorts-polisher/AiShortsPolisherDetail';

export const metadata: Metadata = {
  title: 'AI Shorts Polisher — Auto Subtitles, Zoom Cuts & Emojis for Reels | Itnavideo',
  description:
    'Transform raw phone recordings into viral Instagram Reels, YouTube Shorts, and TikToks. AI automatically adds animated karaoke subtitles, rapid zoom punch-ins, kinetic emojis, and trims awkward pauses.',
  keywords: [
    'AI shorts polisher',
    'instagram reels video editor ai',
    'tiktok caption generator',
    'hormozi style subtitles online',
    'vertical video polisher',
    'auto zoom cuts for reels',
    'silence remover for shorts',
    'viral shorts maker',
    'short form video editor ai',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/ai-shorts-polisher' },
  openGraph: {
    title: 'AI Shorts Polisher — Subtitles & Zoom Cuts for Reels | Itnavideo',
    description:
      'Transform raw phone videos into viral Reels and Shorts with animated karaoke subtitles, zoom punch-ins, and sound effects.',
    url: 'https://www.itnavideo.com/ai-shorts-polisher',
    siteName: 'Itnavideo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Shorts Polisher — Turn Raw Videos into Viral Reels',
    description:
      'Add animated karaoke subtitles, dynamic zoom cuts, and sound effects to vertical videos in under 45 seconds.',
  },
};

export default function AiShortsPolisherPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Itnavideo AI Shorts Polisher',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    url: 'https://www.itnavideo.com/ai-shorts-polisher',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description:
      'AI Shorts Polisher transforms raw vertical phone recordings into viral Reels, Shorts, and TikToks with automated subtitles, zoom cuts, and emojis.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AiShortsPolisherDetail />
    </>
  );
}

