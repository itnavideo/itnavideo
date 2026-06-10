'use client';

import { FormEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Calculator, CheckCircle2, Clock3, Code2, DatabaseZap, Film, Loader2, MapPin, Megaphone, Palette, ShieldCheck, Sparkles, X } from 'lucide-react';

type Role = {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  icon: typeof DatabaseZap;
  summary: string;
  focus: string[];
};

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const roles: Role[] = [
  {
    slug: 'video-product-engineer',
    title: 'Video Pipeline Engineer',
    team: 'Media Infrastructure',
    location: 'Remote',
    type: 'Future role',
    icon: Film,
    summary: 'Own the hard parts of automated video generation: safe fallbacks, subtitles, audio polish, render speed, and final MP4 validation.',
    focus: ['Media workflow design', 'Subtitle and overlay safety', 'Render debugging and optimization'],
  },
  {
    slug: 'backend-developer-video-systems',
    title: 'Backend Developer, Video Systems',
    team: 'Engineering',
    location: 'Remote',
    type: 'Future role',
    icon: DatabaseZap,
    summary: 'Build the render system, queue controls, status sync, telemetry, storage cleanup, and API reliability layer behind Itnavideo.',
    focus: ['Backend worker systems', 'Queues, retries, and observability', 'Data and media APIs'],
  },
  {
    slug: 'full-stack-product-developer',
    title: 'Full-Stack Product Developer',
    team: 'Product Engineering',
    location: 'Remote',
    type: 'Future role',
    icon: Code2,
    summary: 'Ship creator-facing workflows across dashboard, uploads, status, billing, admin tools, and product data.',
    focus: ['Modern web app architecture', 'Creator-facing interfaces', 'Secure backend APIs'],
  },
  {
    slug: 'graphic-designer-video-templates',
    title: 'Graphic Designer, Video Templates',
    team: 'Creative',
    location: 'Remote',
    type: 'Future role',
    icon: Palette,
    summary: 'Create clean short-form visual systems, template packs, thumbnails, motion directions, and brand-safe layouts for creator videos.',
    focus: ['Social video graphics', 'Template systems', 'Thumbnails and brand kits'],
  },
  {
    slug: 'marketing-manager-ai-saas',
    title: 'Marketing Manager, AI/SaaS',
    team: 'Growth',
    location: 'Remote',
    type: 'Future role',
    icon: Megaphone,
    summary: 'Help turn a working AI video engine into a repeatable acquisition, activation, and demo story for creators and teams.',
    focus: ['Launch campaigns', 'SEO and content loops', 'Creator and agency partnerships'],
  },
  {
    slug: 'finance-operations-manager',
    title: 'Finance & Operations Manager',
    team: 'Operations',
    location: 'Remote',
    type: 'Future role',
    icon: Calculator,
    summary: 'Support pricing, payment-provider readiness, vendor costs, creator plan economics, and lightweight operational reporting as the product grows.',
    focus: ['Pricing and cost models', 'Payment operations', 'Founder finance reporting'],
  },
];

const culture = [
  'Remote-first and async-friendly',
  'High ownership, low ceremony',
  'Product proof before polish',
  'Reliable systems over fragile demos',
];

export default function CareersClient() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [state, setState] = useState<SubmitState>('idle');
  const [error, setError] = useState('');
  const roleOptions = useMemo(() => roles.map((role) => ({ value: role.slug, label: role.title })), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRole || state === 'loading') return;

    const formData = new FormData(event.currentTarget);
    setState('loading');
    setError('');

    try {
      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleSlug: selectedRole.slug,
          roleTitle: selectedRole.title,
          name: formData.get('name'),
          email: formData.get('email'),
          linkedinUrl: formData.get('linkedinUrl'),
          resumeUrl: formData.get('resumeUrl'),
          portfolioUrl: formData.get('portfolioUrl'),
          note: formData.get('note'),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || 'Application failed.');
      }
      setState('success');
      event.currentTarget.reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Application failed.');
      setState('error');
    }
  };

  const openRole = (role: Role) => {
    setSelectedRole(role);
    setState('idle');
    setError('');
  };

  return (
    <main className="brand-surface min-h-screen text-white">
      <section className="relative overflow-hidden px-6 pb-20 pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand-mint/25 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
              <Sparkles size={16} />
              Careers
            </div>
            <h1 className="max-w-5xl text-5xl font-black leading-tight md:text-7xl">
              Build the video engine creators wish existed.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
              Itnavideo is building practical AI video workflows for creators: planning, rendering, asset systems, templates, growth, and operations.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#open-roles" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white">
                View roles
                <ArrowRight size={18} />
              </a>
              <Link href="/about" className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition hover:border-brand-mint/40">
                Learn about Itnavideo
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/85 p-3 shadow-2xl shadow-black/30">
            <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-black/35">
              <Image
                src="/visuals/careers-team-visual.png"
                alt="Remote AI video team working across engineering, design, growth, and operations"
                fill
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-brand-mint/25 bg-black/55 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-mint backdrop-blur">
                  <BriefcaseBusiness size={14} />
                  Talent network
                </div>
                <h2 className="text-2xl font-black">Engineering, creative, growth, and ops.</h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-300">
                  Planned hiring areas, not a promise of immediate interviews. Strong profiles are saved for the right opening window.
                </p>
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {roleOptions.slice(0, 3).map((role) => (
                <div key={role.value} className="flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-3 text-xs font-semibold text-zinc-200">
                  <CheckCircle2 size={15} className="shrink-0 text-brand-mint" />
                  <span className="line-clamp-2">{role.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="open-roles" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Open areas</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">Roles we want to know great people for.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <article key={role.slug} className="rounded-lg border border-white/10 bg-zinc-950 p-6 transition hover:border-brand-mint/40">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
                      <Icon size={22} />
                    </div>
                    <span className="rounded-md border border-brand-mint/20 bg-brand-mint/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-brand-mint">
                      {role.type}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-zinc-500">{role.team}</p>
                  <h3 className="mt-2 text-2xl font-black leading-tight">{role.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-400">{role.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-zinc-300">
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-3 py-2">
                      <MapPin size={14} />
                      {role.location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-3 py-2">
                      <Clock3 size={14} />
                      Flexible timing
                    </span>
                  </div>
                  <ul className="mt-6 grid gap-2">
                    {role.focus.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-zinc-300">
                        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-mint" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => openRole(role)}
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-black text-black transition hover:bg-brand-mint sm:w-auto"
                  >
                    Join talent pool
                    <ArrowRight size={17} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-zinc-950/65 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Culture</p>
            <h2 className="text-4xl font-black leading-tight">Small team energy, serious product standards.</h2>
            <p className="mt-5 text-sm leading-6 text-zinc-400">
              We care about visible product proof: a user uploads media, sees live progress, and receives a playable video. The best work here is practical, calm under pressure, and obsessed with reliability.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {culture.map((item, index) => (
              <div key={item} className="rounded-lg border border-white/10 bg-black/35 p-5">
                <p className="font-mono text-sm font-black text-brand-mint">0{index + 1}</p>
                <p className="mt-4 text-lg font-black text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedRole && (
        <div className="fixed inset-0 z-[200] flex items-end bg-black/80 px-4 py-4 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-brand-mint">{selectedRole.team}</p>
                <h2 className="mt-2 text-2xl font-black leading-tight">{selectedRole.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">Share links only. No file upload needed.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 text-zinc-400 transition hover:text-white"
                aria-label="Close application form"
              >
                <X size={18} />
              </button>
            </div>

            {state === 'success' ? (
              <div className="rounded-lg border border-brand-mint/20 bg-brand-mint/10 p-6">
                <CheckCircle2 className="mb-4 text-brand-mint" size={28} />
                <h3 className="text-2xl font-black">Profile received</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  Thank you for reaching out. We review talent profiles for upcoming openings and reply within 2-3 weeks when there is a strong match.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="mt-6 rounded-lg bg-white px-5 py-3 font-black text-black transition hover:bg-brand-mint"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                <Field label="Full name" name="name" placeholder="Your name" required />
                <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
                <Field label="LinkedIn profile" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." />
                <Field label="Resume link" name="resumeUrl" type="url" placeholder="Google Drive, Notion, personal site, or PDF link" />
                <Field label="Portfolio or work link" name="portfolioUrl" type="url" placeholder="https://..." />
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-zinc-300">Short note</span>
                  <textarea
                    name="note"
                    rows={4}
                    placeholder="What kind of work would you be excited to own at Itnavideo?"
                    className="w-full resize-none rounded-lg border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-brand-mint"
                  />
                </label>
                {error && <p className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">{error}</p>}
                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {state === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                  Submit profile
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-zinc-300">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-brand-mint"
      />
    </label>
  );
}
