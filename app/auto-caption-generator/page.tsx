import type { Metadata } from 'next';
import AutoCaptionsDetail from '@/components/captions/AutoCaptionsDetail';

export const metadata: Metadata = {
  title: 'AI Auto Caption Generator — Add Animated Subtitles for Reels & Shorts | Itnavideo',
  description:
    'Free online AI auto caption generator for Instagram Reels, YouTube Shorts, and TikTok videos. Generate accurate word-synced animated subtitles in seconds with custom styles.',
  keywords: [
    'auto caption generator',
    'ai automatic subtitles',
    'captions for instagram reels',
    'auto subtitles for shorts',
    'video captioning online',
    'animated karaoke subtitles',
    'word synced caption generator',
    'subtitles for tiktok videos',
    'hinglish caption generator',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/auto-caption-generator' },
  openGraph: {
    title: 'AI Auto Caption Generator — Add Animated Subtitles for Reels & Shorts | Itnavideo',
    description:
      'Generate word-level animated subtitles for Instagram Reels and videos in seconds with our AI Auto Caption Generator.',
    url: 'https://www.itnavideo.com/auto-caption-generator',
    siteName: 'Itnavideo',
    type: 'website',
    images: [
      {
        url: 'https://www.itnavideo.com/visuals/heroimages/autocaptions-hero.png',
        width: 1200,
        height: 630,
        alt: 'Itnavideo AI Auto Caption Generator Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Auto Caption Generator — Subtitles for Reels & Shorts',
    description:
      'Add word-synced animated karaoke subtitles to your videos automatically with AI in under 20 seconds.',
    images: ['https://www.itnavideo.com/visuals/heroimages/autocaptions-hero.png'],
  },
};

export default function AutoCaptionGeneratorPage() {
  return <AutoCaptionsDetail />;
}
