import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#07090E] px-6 pb-24 pt-32 text-zinc-100">
      <section className="mx-auto max-w-4xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-400">
          <FileText size={15} />
          Terms of Service
        </div>
        <h1 className="text-4xl font-black leading-tight sm:text-6xl text-white">Terms of Service</h1>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Last updated: May 13, 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-300">
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
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 active:scale-95"
        >
          Contact Support
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
