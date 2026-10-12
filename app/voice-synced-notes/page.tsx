import type { Metadata } from 'next';
import VoiceSyncedNotesDetail from '../video-types/voice-synced-notes/VoiceSyncedNotesDetail';

export const metadata: Metadata = {
  title: 'AI Voice Synced Notes Generator — Digital Note Cards | Itnavideo',
  description:
    'Convert spoken audio and lectures into interactive digital note cards with real-time highlighter animations, sticky note callouts, and clean background cards.',
  keywords: [
    'voice synced notes generator',
    'study notes video maker',
    'highlighter animation video creator',
    'digital notepad video generator',
  ],
  alternates: { canonical: 'https://www.itnavideo.com/voice-synced-notes' },
  openGraph: {
    title: 'AI Voice Synced Notes Generator — Digital Note Cards | Itnavideo',
    description:
      'Turn spoken lectures into interactive digital note cards with real-time highlighter animations.',
    url: 'https://www.itnavideo.com/voice-synced-notes',
    siteName: 'Itnavideo',
    type: 'website',
  },
};

export default function VoiceSyncedNotesAliasPage() {
  return <VoiceSyncedNotesDetail />;
}
