import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050506] px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-4xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
          <FileText size={16} />
          Terms of Service
        </div>
        <h1 className="text-5xl font-black leading-tight md:text-7xl">Terms of Service</h1>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Last updated: May 13, 2026</p>
        <div className="mt-10 space-y-8 text-base leading-8 text-zinc-300">
          <p>
            By using Itnavideo, you agree to use the service responsibly and only upload content you have the
            rights to use. You are responsible for the voiceovers, media, prompts, and final videos you create.
          </p>
          <p>
            Itnavideo provides AI-assisted editing, captioning, asset matching, and rendering tools. Output quality
            can vary based on uploaded assets, voiceover quality, selected settings, and available infrastructure.
          </p>
          <p>
            Do not use the platform for illegal, harmful, deceptive, or rights-infringing content. We may limit or
            suspend access to protect users, creators, and the service.
          </p>
          <p>
            Plans, limits, features, and pricing may change as the product develops. We will keep customer-facing
            pricing and usage limits clear on the pricing page.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-10 inline-flex items-center gap-2 rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white"
        >
          Contact support
          <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}
