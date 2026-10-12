import type { Metadata } from 'next';
import WhiteboardVideoDetail from '../video-types/whiteboard-video/WhiteboardVideoDetail';

export const metadata: Metadata = {
  title: 'AI Whiteboard Video Generator — Hand-Drawn Explainer Studio | Itnavideo',
  description:
    'Turn speech recordings into interactive whiteboard animations with drawing hands, blueprint schematics, executive marker colors, and automatic concept summaries.',
  keywords: [
    'whiteboard video generator',
    'ai whiteboard animation',
    'hand drawn explainer video',
    'blueprint video maker',
    'doodly alternative online',
    'automatic whiteboard creator',
    'video scribe alternative',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/whiteboard-video' },
  openGraph: {
    title: 'AI Whiteboard Video Generator — Hand-Drawn Explainer Studio | Itnavideo',
    description:
      'Transform voiceovers into hand-drawn whiteboard animations with realistic drawing hands and executive marker themes.',
    url: 'https://www.itnavideo.com/whiteboard-video',
    siteName: 'Itnavideo',
    type: 'website',
  },
};

export default function WhiteboardVideoAliasPage() {
  return <WhiteboardVideoDetail />;
}
