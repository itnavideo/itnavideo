import type { Metadata } from 'next';
import YouTubeSubtitleDetail from './YouTubeSubtitleDetail';

export const metadata: Metadata = {
  title: 'YouTube Subtitle Generator — 16:9 Landscape Video Subtitles | Itnavideo',
  description:
    'Add clean, broadcast-quality 16:9 landscape subtitles to your YouTube videos and podcasts with Western creator styles and player safe zones in seconds.',
  keywords: [
    'youtube subtitle generator',
    '16:9 landscape subtitles',
    'ali abdaal subtitles',
    'vox documentary captions',
    'youtube closed caption generator',
    'landscape video subtitles',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/video-types/youtube-subtitle-generator' },
  openGraph: {
    title: 'YouTube Subtitle Generator — 16:9 Landscape Video Subtitles | Itnavideo',
    description:
      'Add broadcast-quality 16:9 landscape subtitles to YouTube videos with Western creator styles and player safe zones.',
    url: 'https://www.itnavideo.com/video-types/youtube-subtitle-generator',
    siteName: 'Itnavideo',
    type: 'website',
  },
};

export default function YouTubeSubtitleGeneratorTemplatePage() {
  return <YouTubeSubtitleDetail />;
}
