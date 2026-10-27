import type { Metadata } from 'next';
import FacelessShortsDetail from '@/app/video-types/faceless-shorts/FacelessShortsDetail';

export const metadata: Metadata = {
  title: 'Faceless Shorts AI Generator - Create 9:16 Shorts Without Camera | Itnavideo',
  description:
    'Turn voiceover recordings and scripts into viral 9:16 vertical short-form videos with AI-generated visual stories, SVG animations, and dynamic subtitles in under 2 minutes.',
  keywords: [
    'faceless shorts generator',
    'ai shorts maker',
    'youtube shorts generator',
    'tiktok shorts ai',
    'faceless vertical videos',
    'voiceover to shorts',
    'automated short video creator',
    'viral faceless shorts',
    'instagram reels ai maker'
  ],
  alternates: { canonical: 'https://www.itnavideo.com/faceless-shorts' },
  openGraph: {
    title: 'Faceless Shorts AI Generator - Create 9:16 Vertical Videos',
    description:
      'Transform voiceovers into complete viral 9:16 shorts. The Story-First AI engine adds SVG graphics, charts, kinetic typography, and motion perfectly synced to your voice.',
    url: 'https://www.itnavideo.com/faceless-shorts',
    siteName: 'Itnavideo',
    type: 'website',
    images: [
      {
        url: 'https://storage.googleapis.com/itnavideo-media-assets/faceless_shorts_hero.jpg', // Placeholder for now
        width: 1080,
        height: 1920,
        alt: 'Itnavideo Faceless Shorts Dashboard',
      },
    ],
  },
};

export default function FacelessShortsPage() {
  return <FacelessShortsDetail />;
}
