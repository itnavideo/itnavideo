import type { Metadata } from 'next';
import ImageToVideoAiView from '@/components/tools/ImageToVideoAiView';

export const metadata: Metadata = {
  title: 'Image to Video AI — Turn Voiceovers & Photos into 16:9 Cinematic Videos | Itnavideo',
  description:
    'Transform voiceover narration and photos into 16:9 widescreen videos with Ken Burns camera motion, crossfade transitions, 2.5D parallax subtitles, and background music in seconds.',
  keywords: [
    'image to video ai',
    'photo to video generator',
    'ken burns video maker',
    'cinematic slideshow generator',
    'voiceover photo video maker',
    'ai documentary video generator',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/image-to-video-ai' },
  openGraph: {
    title: 'Image to Video AI — 16:9 Cinematic Video Generator | Itnavideo',
    description:
      'Turn voiceover audio and photos into 16:9 widescreen videos with Ken Burns camera motion and transitions.',
    url: 'https://www.itnavideo.com/image-to-video-ai',
    siteName: 'Itnavideo',
    type: 'website',
  },
};

export default function ImageToVideoAiAliasPage() {
  return <ImageToVideoAiView />;
}
