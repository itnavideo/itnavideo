import type { Metadata } from 'next';
import AutoCaptionReelDetail from '../auto-caption-reel/AutoCaptionReelDetail';

export const metadata: Metadata = {
  title: 'Auto Caption Generator — Free Subtitles & Reels | Itnavideo',
  description:
    'Generate word-synced animated captions automatically with our AI video maker. 9:16 vertical reels and 16:9 landscape videos ready for Instagram, Shorts, and YouTube.',
  keywords: [
    'auto caption generator',
    'captions for instagram',
    'video captions',
    'captions for videos',
    'automatic captions',
    'ai caption generator',
  ],
  alternates: { canonical: '/video-types/auto-caption-generator' },
};

export default function AutoCaptionGeneratorVideoTypePage() {
  return <AutoCaptionReelDetail />;
}
