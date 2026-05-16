import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorks from '@/components/landing/HowItWorks';
import ComparisonSection from '@/components/landing/ComparisonSection';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-black pt-28">
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-semibold text-brand-mint">
              <Sparkles size={15} />
              Product features
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-normal text-white md:text-7xl">
              Faceless videos and face-camera edits, handled end to end.
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400 md:text-xl">
              Itnavideo analyzes voiceovers for faceless videos, processes uploaded camera clips for talking-head edits,
              creates captions and text effects, then renders a vertical short ready for Reels, TikTok, and Shorts.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-6 py-4 text-base font-black text-black transition hover:bg-white"
              >
                Start creating
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/5 px-6 py-4 text-base font-bold text-white transition hover:bg-white/10"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
      <FeaturesSection />
      <HowItWorks />
      <ComparisonSection />
    </main>
  );
}
