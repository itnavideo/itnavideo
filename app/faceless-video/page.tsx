import type { Metadata } from 'next';
import FacelessVideoDetail from '@/app/video-types/faceless-video/FacelessVideoDetail';

export const metadata: Metadata = {
  title: 'AI Faceless Video Generator — Create 16:9 YouTube Videos Without Camera | Itnavideo',
  description:
    'Turn voiceover recordings and scripts into 1080p widescreen YouTube videos with curated stock B-roll, studio vignette backgrounds, karaoke subtitles, and auto audio ducking.',
  keywords: [
    'faceless video generator',
    'ai faceless youtube channel',
    'faceless video maker',
    'voiceover to widescreen video',
    'automated youtube video generator',
    'faceless video creation',
    'no camera video creator',
    'ai stock visual video editor',
    'vox style documentary generator',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/faceless-video' },
  openGraph: {
    title: 'AI Faceless Video Generator — Create 16:9 YouTube Videos | Itnavideo',
    description:
      'Transform voiceovers into complete 1080p widescreen YouTube videos in under 2 minutes with automated stock B-roll, studio backgrounds, and subtitles.',
    url: 'https://www.itnavideo.com/faceless-video',
    siteName: 'Itnavideo',
    type: 'website',
    images: [
      {
        url: 'https://storage.googleapis.com/itnavideo-media-assets/file_0000000089c48211b67c16fe3c2636a2_prirg0.png',
        width: 1920,
        height: 1080,
        alt: 'Itnavideo AI Faceless Video Generator Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Faceless Video Generator — 16:9 YouTube Video Creator',
    description:
      'Create high-yield faceless YouTube videos with automated stock B-roll, studio backgrounds, and word-synced subtitles in seconds.',
    images: ['https://storage.googleapis.com/itnavideo-media-assets/file_0000000089c48211b67c16fe3c2636a2_prirg0.png'],
  },
};

export default function FacelessVideoMainPage() {
  return <FacelessVideoDetail />;
}
