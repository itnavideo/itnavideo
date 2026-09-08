import type { Metadata } from 'next';
import FacelessVideoDetail from '@/app/video-types/faceless-video/FacelessVideoDetail';

export const metadata: Metadata = {
  title: 'Faceless Video — Free 16:9 YouTube Video Generator | Itnavideo',
  description: 'Turn voiceover audio up to 20 minutes into complete 16:9 widescreen YouTube videos with curated AI visuals, Canva backgrounds & captions.',
  alternates: { canonical: '/faceless-video' },
};

export default function FacelessVideoMainPage() {
  return <FacelessVideoDetail />;
}
