import type { Metadata } from 'next';
import AutoCaptionsShowcase from '@/components/captions/AutoCaptionsShowcase';

export const metadata: Metadata = {
  title: 'Auto Caption Generator — AI Captions for Instagram Reels & Videos | Itnavideo',
  description:
    'Free online auto caption generator for Instagram Reels, YouTube Shorts, and 16:9 videos. Generate accurate word-synced animated captions with custom styles.',
  keywords: [
    'auto caption generator',
    'captions for instagram',
    'video captions',
    'captions for videos',
    'automatic captions',
    'ai caption generator',
    'caption ai',
    'captions for reels',
  ],
  alternates: { canonical: '/auto-caption-generator' },
  openGraph: {
    title: 'Auto Caption Generator — AI Captions for Instagram Reels & Videos | Itnavideo',
    description:
      'Generate word-level animated captions for Instagram Reels and videos in seconds with our AI Auto Caption Generator.',
    images: ['/og-image.png'],
  },
};

export default function AutoCaptionGeneratorPage() {
  return <AutoCaptionsShowcase />;
}
