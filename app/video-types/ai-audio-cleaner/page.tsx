import type { Metadata } from 'next';
import AudioCleanerDetail from './AudioCleanerDetail';

export const metadata: Metadata = {
  title: 'AI Audio Cleaner & Studio Master — Cut Retakes & Denoise | Itnavideo',
  description:
    'Upload raw voiceover recordings. AI automatically transcribes speech, cuts 30+ sentence retakes, eliminates room noise and echo, and masters audio to 24-bit broadcast standards in seconds.',
  keywords: [
    'ai audio cleaner',
    'cut audio retakes automatically',
    'podcast audio master',
    'denoise audio online',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/video-types/ai-audio-cleaner' },
  openGraph: {
    title: 'AI Audio Cleaner & Studio Master — Cut Retakes & Denoise | Itnavideo',
    description:
      'Upload raw voiceovers. AI cuts sentence retakes, removes room echo, and masters audio to 24-bit broadcast standards.',
    url: 'https://www.itnavideo.com/video-types/ai-audio-cleaner',
    siteName: 'Itnavideo',
    type: 'website',
  },
};

export default function AiAudioCleanerTemplatePage() {
  return <AudioCleanerDetail />;
}
