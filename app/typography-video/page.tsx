import type { Metadata } from 'next';
import TypographyVideoDetail from '../video-types/typography-video/TypographyVideoDetail';

export const metadata: Metadata = {
  title: 'AI Kinetic Typography Video Generator — Viral Motion Text | Itnavideo',
  description:
    'Transform voiceovers into high-energy kinetic typography videos with camera pulses, 3D gold depth layers, punch sound effects, and viral text animations in seconds.',
  keywords: [
    'kinetic typography generator',
    'ai text animation maker',
    'kinetic text video generator',
    'viral typography reels',
    'motion text video creator',
    'punch sfx typography video',
    'after effects kinetic typography alternative',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/typography-video' },
  openGraph: {
    title: 'AI Kinetic Typography Video Generator — Viral Motion Text | Itnavideo',
    description:
      'Generate high-energy kinetic typography videos with camera pulses, 3D depth, and impact sound effects automatically.',
    url: 'https://www.itnavideo.com/typography-video',
    siteName: 'Itnavideo',
    type: 'website',
  },
};

export default function TypographyVideoAliasPage() {
  return <TypographyVideoDetail />;
}
