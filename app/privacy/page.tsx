import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 pb-24 pt-32 text-foreground">
      <section className="mx-auto max-w-4xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
          <ShieldCheck size={16} />
          Privacy Policy
        </div>
        <h1 className="text-5xl font-black leading-tight md:text-7xl">Privacy Policy</h1>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Last updated: May 13, 2026</p>
        <div className="mt-10 space-y-8 text-base leading-8 text-zinc-300">
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
          className="mt-10 inline-flex items-center gap-2 rounded-lg px-6 py-4 font-black text-white transition hover:-translate-y-[1px]"
          style={{ background: 'var(--color-primary-hover)' }}
        >
          Contact support
          <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}
