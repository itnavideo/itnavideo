import type { Metadata } from 'next';
import LongVideoPromoDetail from '../video-types/long-video-promo/LongVideoPromoDetail';

export const metadata: Metadata = {
  title: 'AI Long Video Promo Generator — YouTube Trailer Teasers | Itnavideo',
  description:
    'Convert long YouTube videos and podcasts into high-converting 9:16 vertical trailer teasers with pinned thumbnail frames, @channel tags, and watch CTAs in seconds.',
  keywords: [
    'long video promo generator',
    'youtube teaser maker',
    'podcast promo video generator',
    'vertical video trailer creator',
    'youtube short trailer maker',
    'promo reel generator',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/long-video-promo' },
  openGraph: {
    title: 'AI Long Video Promo Generator — YouTube Trailer Teasers | Itnavideo',
    description:
      'Turn long YouTube videos and podcasts into vertical teaser trailers with pinned thumbnails and watch CTAs.',
    url: 'https://www.itnavideo.com/long-video-promo',
    siteName: 'Itnavideo',
    type: 'website',
  },
};

export default function LongVideoPromoAliasPage() {
  return <LongVideoPromoDetail />;
}
