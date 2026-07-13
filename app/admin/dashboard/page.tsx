'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, AlertTriangle, BookOpen, Database, KeyRound, Loader2, PenLine, Server, ShieldCheck, Sparkles, Users } from 'lucide-react';

type AdminStats = {
  totalUsers: number;
  activeToday: number;
  activeThisWeek: number;
  totalRenders: number;
  rendersToday: number;
  errors: Array<{ id: string; message: string; mode: string; createdAt: string; userId: string }>;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => { if (data.ok) setStats(data.stats); })
      .catch((e) => console.warn('Stats load failed:', e))
      .finally(() => setStatsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        <p className="text-brand-mint text-xs uppercase tracking-[0.3em] font-bold">Founder overview</p>
        <h1 className="mt-3 text-4xl font-black text-white">Admin Dashboard</h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          Users, renders, errors, and content management.
        </p>
      </section>

      {/* Live Stats */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Users" value={stats?.totalUsers} loading={statsLoading} icon={Users} tone="text-emerald-400" />
        <StatCard label="Active Today" value={stats?.activeToday} loading={statsLoading} icon={Activity} tone="text-green-400" />
        <StatCard label="Active This Week" value={stats?.activeThisWeek} loading={statsLoading} icon={Activity} tone="text-cyan-300" />
        <StatCard label="Total Renders" value={stats?.totalRenders} loading={statsLoading} icon={Server} tone="text-amber-300" />
        <StatCard label="Renders Today" value={stats?.rendersToday} loading={statsLoading} icon={Sparkles} tone="text-pink-300" />
      </section>

      {/* Main Grid: Blog + Errors */}
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        {/* Blog Management */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="text-brand-mint" size={22} />
              <h2 className="text-xl font-black text-white">Blog Posts</h2>
            </div>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-mint px-4 py-2 text-xs font-black text-black transition hover:bg-white"
            >
              <PenLine size={13} />
              Write New Post
            </Link>
          </div>
          <div className="space-y-3">
            <Link href="/blog" className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition hover:border-brand-mint/40">
              <div>
                <p className="font-bold text-white">View All Blog Posts</p>
                <p className="mt-1 text-sm text-zinc-500">See published SEO content</p>
              </div>
              <span className="text-xs text-zinc-500">→</span>
            </Link>
            <Link href="/admin/blog" className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition hover:border-brand-mint/40">
              <div>
                <p className="font-bold text-white">Manage Blog Posts</p>
                <p className="mt-1 text-sm text-zinc-500">Edit, delete, or reorder posts</p>
              </div>
              <span className="text-xs text-zinc-500">→</span>
            </Link>
          </div>
        </div>

        {/* Recent Errors */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={22} />
            <h2 className="text-xl font-black text-white">Recent Errors</h2>
          </div>
          {statsLoading ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="animate-spin" size={14} /> Loading...
            </div>
          ) : stats?.errors?.length ? (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {stats.errors.map((error) => (
                <div key={error.id} className="rounded-lg border border-red-900/30 bg-red-950/20 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-red-200 line-clamp-2">{error.message}</p>
                    <span className="shrink-0 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-400">{error.mode}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] text-zinc-600">
                    <span>{new Date(error.createdAt).toLocaleString()}</span>
                    {error.userId ? <span>user: {error.userId.slice(0, 8)}…</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950 p-6 text-center">
              <p className="text-sm text-zinc-500">No recent errors 🎉</p>
              <p className="mt-1 text-xs text-zinc-600">Render errors will appear here when they happen.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <KeyRound className="text-amber-300" size={22} />
            <h2 className="text-xl font-black text-white">Quick Actions</h2>
          </div>
          <div className="grid gap-3">
            {[
              { title: 'Open creator dashboard', href: '/dashboard', note: 'Test as a user' },
              { title: 'Review pricing', href: '/pricing', note: 'Check plans and ₹9 gate' },
              { title: 'Admin settings', href: '/admin/settings', note: 'Auth, database, config' },
              { title: 'Video types', href: '/video-types', note: 'See all landing pages' },
            ].map((action) => (
              <Link key={action.title} href={action.href} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition hover:border-brand-mint/40">
                <p className="font-bold text-white">{action.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{action.note}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <Database className="text-cyan-300" size={22} />
            <h2 className="text-xl font-black text-white">System Status</h2>
          </div>
          <div className="space-y-3">
            <StatusRow label="Auth" value="Supabase" status="ok" />
            <StatusRow label="Transcription" value="Groq Whisper" status="ok" />
            <StatusRow label="Rendering" value="Remotion Lambda" status="ok" />
            <StatusRow label="Payments" value="Razorpay" status="ok" />
            <StatusRow label="AI Planning" value="Gemini 2.0 Flash" status={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'ok' : 'warn'} />
            <StatusRow label="Storage" value="AWS S3" status="ok" />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, loading, icon: Icon, tone }: { label: string; value?: number; loading: boolean; icon: any; tone: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <Icon className={tone} size={20} />
      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      {loading ? (
        <Loader2 className="mt-2 animate-spin text-zinc-600" size={18} />
      ) : (
        <p className="mt-1 text-2xl font-black text-white">{value ?? 0}</p>
      )}
    </div>
  );
}

function StatusRow({ label, value, status }: { label: string; value: string; status: 'ok' | 'warn' | 'error' }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${status === 'ok' ? 'bg-green-500' : status === 'warn' ? 'bg-amber-400' : 'bg-red-500'}`} />
        <span className="text-sm font-bold text-zinc-300">{label}</span>
      </div>
      <span className="text-xs text-zinc-500">{value}</span>
    </div>
  );
}
