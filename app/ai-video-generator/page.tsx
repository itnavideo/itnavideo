import type { Metadata } from 'next';
import AiVideoGeneratorDetail from '@/app/video-types/ai-video-generator/AiVideoGeneratorDetail';

export const metadata: Metadata = {
  title: 'AI Video Generator — Free Online AI Video Maker & Text to Video | Itnavideo',
  description:
    'Generate complete 16:9 YouTube & 9:16 vertical videos from voiceovers, facecam clips, or text scripts. Free AI video generator with automatic B-roll, motion graphics, ducked music, and animated subtitles.',
  keywords: [
    'ai video generator',
    'ai video maker',
    'free ai video generator',
    'text to video ai',
    'script to video generator',
    'text to video generator',
    'ai long video generator',
    'ai video creator',
    'voiceover to video ai',
    'faceless video generator',
  ],
  alternates: { canonical: '/ai-video-generator' },
  openGraph: {
    title: 'AI Video Generator (Long YT Videos) — Free Online AI Video Maker | Itnavideo',
    description:
      'Turn voiceovers, videos, or scripts into fully produced videos with AI B-roll, music, motion graphics & captions.',
    images: ['https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png'],
  },
};

export default function AiVideoGeneratorPage() {
  return <AiVideoGeneratorDetail />;
}
