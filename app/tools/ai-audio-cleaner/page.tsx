import type { Metadata } from 'next';
import AudioCleanerDetail from '@/app/video-types/ai-audio-cleaner/AudioCleanerDetail';

export const metadata: Metadata = {
  title: 'AI Audio Cleaner & Studio Master — Cut Retakes & 300ms Silence | Itnavideo',
  description:
    'Upload raw voiceover recordings. AI automatically transcribes speech, cuts sentence retakes, trims dead silences over 300ms, and masters audio to 24-bit broadcast standards in seconds.',
  alternates: { canonical: '/tools/ai-audio-cleaner' },
  openGraph: {
    title: 'AI Audio Cleaner & Broadcast Master – Itnavideo',
    description: 'Cuts repeated takes, stumbles, and room noise. Broadcast-grade vocal master in seconds.',
  },
};

export default function AIAudioCleanerToolPage() {
  return <AudioCleanerDetail />;
}
