import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-32 text-slate-900">
      <section className="mx-auto max-w-4xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-bold text-orange-700">
          <ShieldCheck size={15} className="text-[#FF5722]" />
          <span>Privacy Policy</span>
        </div>
        <h1 className="text-4xl font-black leading-tight sm:text-6xl text-slate-900 font-sans">
          Privacy{' '}
          <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
            Policy
          </span>
        </h1>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Last updated: May 13, 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
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
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:brightness-105 active:scale-95"
        >
          <span>Contact Support</span>
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
