'use client';

import Link from 'next/link';
import { Activity, Database, Film, FolderOpen, KeyRound, Server, ShieldCheck, Sparkles } from 'lucide-react';

const statusCards = [
  { title: 'Auth', value: 'Protected', note: 'HttpOnly admin session cookie', icon: ShieldCheck, tone: 'text-emerald-300' },
  { title: 'AI model', value: 'Gemini', note: 'OpenAI kept as future upgrade path', icon: Sparkles, tone: 'text-cyan-300' },
  { title: 'Rendering', value: 'Render + Python + FFmpeg', note: 'Final stitching, captions, audio sync', icon: Server, tone: 'text-amber-300' },
  { title: 'Assets', value: 'Local first', note: 'Owned library and uploaded creator media', icon: FolderOpen, tone: 'text-violet-300' },
];

const actionCards = [
  { title: 'Check asset library', href: '/admin/settings', note: 'Review internal assets, styles, and upload defaults.' },
  { title: 'Open public dashboard', href: '/dashboard', note: 'Test the creator upload flow as a user.' },
  { title: 'Review pricing', href: '/pricing', note: 'Confirm live plans and free video limits.' },
  { title: 'Read blog SEO pages', href: '/blog', note: 'Review public product-led content.' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        <p className="text-brand-mint text-xs uppercase tracking-[0.3em] font-bold">Founder overview</p>
        <h1 className="mt-3 text-4xl font-black text-white">Itnavideo control dashboard</h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          Quick status for the current MVP: creator auth, Supabase metadata, Gemini planning, owned asset library, uploaded media, and Render/Python/FFmpeg export path.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statusCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.title} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <Icon className={card.tone} size={24} />
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-zinc-500">{card.title}</p>
              <p className="mt-2 text-2xl font-black text-white">{card.value}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{card.note}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <Activity className="text-brand-mint" size={22} />
            <h2 className="text-2xl font-black text-white">Founder checklist</h2>
          </div>
          <div className="space-y-3 text-sm text-zinc-300">
            <ChecklistItem label="Keep media uploads paused until the audio-only MVP render is stable." />
            <ChecklistItem label="Keep Supabase for auth, project metadata, job status, waitlist, and newsletter leads." />
            <ChecklistItem label="Test the active path: one voiceover audio file to typography video." />
            <ChecklistItem label="Keep long FFmpeg jobs on the Render worker with Python-assisted filter planning." />
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <KeyRound className="text-amber-300" size={22} />
            <h2 className="text-2xl font-black text-white">Private links</h2>
          </div>
          <div className="grid gap-3">
            {actionCards.map((action) => (
              <Link key={action.title} href={action.href} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition hover:border-brand-mint/40">
                <p className="font-bold text-white">{action.title}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">{action.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <Database className="mt-0.5 shrink-0 text-brand-mint" size={17} />
      <span>{label}</span>
    </div>
  );
}
