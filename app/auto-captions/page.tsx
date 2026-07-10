import type { Metadata } from 'next';
import AutoCaptionsShowcase from '@/components/captions/AutoCaptionsShowcase';

export const metadata: Metadata = {
  title: 'Auto Caption Examples — Before vs After | Itnavideo',
  description:
    'See how Itnavideo Auto Caption Video transforms raw talking-head recordings into polished, styled, word-level captioned reels. Real before & after examples.',
  openGraph: {
    title: 'Auto Caption Examples — Before vs After | Itnavideo',
    description:
      'See how Itnavideo transforms raw videos into captioned reels. Word-level captions, 15+ styles, English & Hinglish.',
    images: ['/og-image.png'],
  },
};

export default function AutoCaptionsPage() {
  return <AutoCaptionsShowcase />;
}
