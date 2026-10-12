import type { Metadata } from 'next';
import LongVideoClipsDetail from '../video-types/long-video-clips/LongVideoClipsDetail';

export const metadata: Metadata = {
  title: 'AI Long Video Clips Generator — Podcast to Shorts | Itnavideo',
  description:
    'AI automatically identifies viral moments from long videos, podcasts, and webinars, cutting captioned 9:16 vertical short clips in seconds.',
  keywords: [
    'long video to clips generator',
    'podcast to shorts converter',
    'opus clip alternative',
    'ai viral clip maker',
    'long video clips generator',
    'automatic video clipper',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/long-video-clips' },
  openGraph: {
    title: 'AI Long Video Clips Generator — Podcast to Shorts | Itnavideo',
    description:
      'Harvest viral 9:16 short clips from podcasts and webinars with AI hook detection and automatic captions.',
    url: 'https://www.itnavideo.com/long-video-clips',
    siteName: 'Itnavideo',
    type: 'website',
  },
};

export default function LongVideoClipsAliasPage() {
  return <LongVideoClipsDetail />;
}
