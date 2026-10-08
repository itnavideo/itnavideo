import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#07090E] px-6 pb-24 pt-32 text-zinc-100">
      <section className="mx-auto max-w-4xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-400">
          <ShieldCheck size={15} />
          Privacy Policy
        </div>
        <h1 className="text-4xl font-black leading-tight sm:text-6xl text-white">Privacy Policy</h1>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Last updated: May 13, 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-300">
          <p>
            Itnavideo collects the information needed to provide AI video generation, account access, billing,
            support, and product improvements. This may include your account details, uploaded media, voiceovers,
            project records, account settings, uploaded media metadata, and basic usage data.
          </p>
          <p>
            Uploaded content is used to process your requested videos, generate captions, match assets, render
            exports, and keep your workspace available. We do not sell your personal information.
          </p>
          <p>
            We use trusted infrastructure providers for hosting, storage, authentication, analytics, and AI
            processing. These providers process data only as needed to operate the service.
          </p>
          <p>
            For privacy questions, data deletion, or account requests, contact us through the support page.
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
