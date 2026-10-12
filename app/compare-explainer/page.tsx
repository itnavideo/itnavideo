import type { Metadata } from 'next';
import CompareExplainerDetail from '../video-types/compare-explainer/CompareExplainerDetail';

export const metadata: Metadata = {
  title: 'AI Compare Explainer Video Generator — Product VS Split Screen | Itnavideo',
  description:
    'Create side-by-side Product VS comparison explainer videos with animated 3D presenters, dynamic pose switching, tension soundtracks, and winner reveals in seconds.',
  keywords: [
    'compare explainer video generator',
    'product vs video maker',
    'side by side comparison video',
    'split screen video creator',
    'vs comparison reels',
    'affiliate product review video',
    '3d presenter comparison video',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/compare-explainer' },
  openGraph: {
    title: 'AI Compare Explainer Video Generator — Product VS Split Screen | Itnavideo',
    description:
      'Generate high-converting Product VS comparison videos with animated hosts and tension beat soundtracks.',
    url: 'https://www.itnavideo.com/compare-explainer',
    siteName: 'Itnavideo',
    type: 'website',
  },
};

export default function CompareExplainerAliasPage() {
  return <CompareExplainerDetail />;
}
