'use client';

import Link from 'next/link';
import { PenLine, Sparkles, CreditCard, Database } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        <p className="text-emerald-400 text-xs uppercase tracking-[0.3em] font-bold">Founder</p>
        <h1 className="mt-2 text-3xl font-black text-white">Admin Panel</h1>
        <p className="mt-2 text-sm text-zinc-400">Quick actions and content management.</p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction href="/admin/blog/new" icon={PenLine} label="Write Blog Post" desc="Add new SEO content" />
        <QuickAction href="/dashboard" icon={Sparkles} label="Test as User" desc="Open creator dashboard" />
        <QuickAction href="/pricing" icon={CreditCard} label="Review Pricing" desc="Check plans & rates" />
        <QuickAction href="/admin/settings" icon={Database} label="Settings" desc="Env & config" />
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-400">
        <p>Full analytics dashboard will be built when we have 50+ users and active renders.</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener" className="text-emerald-400 hover:underline">Supabase →</a>
          <a href="https://analytics.google.com" target="_blank" rel="noopener" className="text-blue-400 hover:underline">Analytics →</a>
          <a href="https://console.aws.amazon.com/billing" target="_blank" rel="noopener" className="text-yellow-400 hover:underline">AWS Billing →</a>
          <a href="https://dashboard.razorpay.com" target="_blank" rel="noopener" className="text-cyan-400 hover:underline">Razorpay →</a>
          <a href="https://search.google.com/search-console" target="_blank" rel="noopener" className="text-green-400 hover:underline">Search Console →</a>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, desc }: { href: string; icon: any; label: string; desc: string }) {
  return (
    <Link href={href} className="group rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-600">
      <Icon size={16} className="text-zinc-400 group-hover:text-white transition" />
      <p className="mt-2 text-sm font-bold text-white">{label}</p>
      <p className="mt-0.5 text-[11px] text-zinc-500">{desc}</p>
    </Link>
  );
}
