'use client';

import Link from 'next/link';
import { ArrowLeft, AudioLines, Captions, Clapperboard, Sparkles } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';

const highlights = [
  { icon: AudioLines, label: 'Voice analysis' },
  { icon: Captions, label: 'Clean title moments' },
  { icon: Clapperboard, label: 'Facecam reels' },
];

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0B1120] px-6 py-24 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.14),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="hidden lg:block">
          <div className="mb-10">
            <BrandLogo size="md" showTagline />
          </div>
          <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-white">
            <ArrowLeft size={17} />
            Back to home
          </Link>
          <div className="mb-8 inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-300">
            <Sparkles size={15} />
            {eyebrow}
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight tracking-normal md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">{subtitle}</p>

          <div className="mt-10 grid max-w-xl gap-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                  <Icon size={18} className="text-emerald-300" />
                  <span className="font-semibold text-zinc-200">{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-white lg:hidden">
            <ArrowLeft size={17} />
            Back to home
          </Link>
          {children}
        </section>
      </div>
    </main>
  );
}

