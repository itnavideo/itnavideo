import type { Metadata } from 'next';
import FacelessVideoDetail from './FacelessVideoDetail';

export const metadata: Metadata = {
  title: 'Faceless Video — 16:9 YouTube Video Generator | Itnavideo',
  description: 'Turn voiceovers up to 20 minutes into complete 16:9 widescreen YouTube videos with curated AI visuals, Canva backgrounds & captions.',
  alternates: { canonical: '/video-types/faceless-video' },
};

export default function FacelessVideoPage() {
  return <FacelessVideoDetail />;
}
