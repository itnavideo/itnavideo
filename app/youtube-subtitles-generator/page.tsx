import type { Metadata } from 'next';
import YouTubeSubtitleDetail from '../video-types/youtube-subtitle-generator/YouTubeSubtitleDetail';

export const metadata: Metadata = {
  title: 'YouTube Subtitle Generator — 16:9 Landscape Video Subtitles | Itnavideo',
  description:
    'Add clean, broadcast-quality 16:9 landscape subtitles to your YouTube videos and podcasts with Western creator styles and player safe zones in seconds.',
  keywords: [
    'youtube subtitle generator',
    '16:9 landscape subtitles',
    'ali abdaal subtitles',
    'vox documentary captions',
    'youtube closed caption generator',
    'landscape video subtitles',
    'burned in youtube captions',
    'youtube video subtitle maker',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/youtube-subtitles-generator' },
  openGraph: {
    title: 'YouTube Subtitle Generator — 16:9 Landscape Video Subtitles | Itnavideo',
    description:
      'Add broadcast-quality 16:9 landscape subtitles to YouTube videos with Western creator styles and player safe zones.',
    url: 'https://www.itnavideo.com/youtube-subtitles-generator',
    siteName: 'Itnavideo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Subtitle Generator — 16:9 Landscape Video Subtitles',
    description:
      'Add broadcast-quality 16:9 landscape subtitles to YouTube videos with Western creator styles and player safe zones.',
  },
};

export default function YouTubeSubtitlesGeneratorRootPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Itnavideo YouTube Subtitle Generator',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    url: 'https://www.itnavideo.com/youtube-subtitles-generator',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description:
      'Burn broadcast-grade 16:9 landscape subtitles into YouTube videos and podcasts with creator typography presets and scrubber safe margins.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <YouTubeSubtitleDetail />
    </>
  );
}

