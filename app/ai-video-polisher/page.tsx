import type { Metadata } from 'next';
import AiVideoPolisherDetail from '../video-types/ai-video-polisher/AiVideoPolisherDetail';

export const metadata: Metadata = {
  title: 'AI YouTube Video Polisher — Auto Zoom Cuts, B-Roll & 16:9 Subtitles | Itnavideo',
  description:
    'Turn raw 16:9 talking head YouTube videos into high-retention cinematic uploads. AI automatically adds dynamic camera zoom punch-ins, topic B-roll overlays, trims dead air, and burns in landscape subtitles.',
  keywords: [
    'AI YouTube video polisher',
    'youtube video editor ai',
    'auto zoom cut video editor',
    'talking head video editor',
    'automated b roll generator',
    'ali abdaal editing style ai',
    'video dead air trimmer',
    '16:9 youtube subtitles',
    'youtube video enhancer',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/ai-video-polisher' },
  openGraph: {
    title: 'AI YouTube Video Polisher — Auto Zoom Cuts & B-Roll | Itnavideo',
    description:
      'Turn raw talking head videos into high-retention 16:9 YouTube videos with automated zoom cuts, stock B-roll, and burned-in subtitles.',
    url: 'https://www.itnavideo.com/ai-video-polisher',
    siteName: 'Itnavideo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI YouTube Video Polisher — Studio-Grade 16:9 Videos',
    description:
      'Automate your YouTube editing with AI zoom punch-ins, topic B-roll overlays, and word-synced subtitles in seconds.',
  },
};

export default function AiVideoPolisherPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Itnavideo AI YouTube Video Polisher',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    url: 'https://www.itnavideo.com/ai-video-polisher',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description:
      'AI YouTube Video Polisher automatically transforms raw 16:9 talking head videos into studio-grade YouTube videos with zoom cuts, topic B-roll, and subtitles.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AiVideoPolisherDetail />
    </>
  );
}

