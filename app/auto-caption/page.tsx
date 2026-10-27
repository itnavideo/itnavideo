import type { Metadata } from 'next';
import AutoCaptionsDetail from '@/components/captions/AutoCaptionsDetail';

export const metadata: Metadata = {
  title: 'Auto Caption Generator — Free Word-Synced Subtitles | Itnavideo',
  description:
    'Generate word-synced animated captions automatically with our AI video maker. 9:16 vertical reels and 16:9 landscape videos ready for Instagram, Shorts, and YouTube.',
  keywords: [
    'auto caption generator',
    'captions for instagram',
    'video captions',
    'captions for videos',
    'automatic captions',
    'ai caption generator',
    'see it in action live demo',
  ],
  alternates: { canonical: '/auto-caption' },
};

export default function AutoCaptionDedicatedPage() {
  return <AutoCaptionsDetail />;
}
