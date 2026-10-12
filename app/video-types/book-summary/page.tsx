import type { Metadata } from 'next';
import BookSummaryDetail from './BookSummaryDetail';

export const metadata: Metadata = {
  title: 'AI Book Summary Video Generator — 3D Cover & Chapter Cards | Itnavideo',
  description:
    'Convert book review voiceovers and quotes into cinematic 16:9 widescreen videos with 3D book cover reveals, animated chapter cards, kinetic notes, and lo-fi focus BGM.',
  keywords: [
    'book summary video generator',
    'ai book review video maker',
    '3d book cover animation creator',
    'chapter card video generator',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/video-types/book-summary' },
  openGraph: {
    title: 'AI Book Summary Video Generator — 3D Cover & Chapter Cards | Itnavideo',
    description:
      'Turn book summary voiceovers into 16:9 widescreen videos with 3D book cover displays and kinetic notes.',
    url: 'https://www.itnavideo.com/video-types/book-summary',
    siteName: 'Itnavideo',
    type: 'website',
  },
};

export default function BookSummaryTemplatePage() {
  return <BookSummaryDetail />;
}
