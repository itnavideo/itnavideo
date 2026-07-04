import { Clock3, Film, ListChecks, Sparkles } from 'lucide-react';
import Link from 'next/link';

const modes = [
  {
    title: 'Video Explainer',
    eyebrow: 'Video upload type',
    body: 'Best for talking-head clips and explainers where the source video should stay visible.',
    href: '/dashboard?videoType=video-explainer',
    accent: 'text-cyan-200',
    border: 'border-cyan-300/25',
    bg: 'bg-cyan-300/[0.07]',
    icon: Film,
    steps: [
      { label: 'Upload one video', icon: Film },
      { label: 'Use the first minute', icon: Clock3 },
      { label: 'Keep video visible on top', icon: Sparkles },
      { label: 'Smart text below', icon: ListChecks },
    ],
  },
];

const rules = [
  'Upload audio or video with clear speech.',
  'Outputs are capped at 1 minute for stable mobile renders.',
  'The top creator video stays clear and centered.',
  'Subtitles and scene visuals follow the English transcript timeline.',
];

export default function ModeSplitSection() {
  return (
    <section className="relative overflow-hidden bg-[#08090b] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl sm:mb-12">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Workflow</p>
          <h2 className="text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl md:text-6xl">
            Two video types. Pick and upload.
          </h2>
          <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Choose your video type first, then upload. Each video type has a focused workflow for clean, fast renders.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-1">
          {modes.map((mode) => {
            const ModeIcon = mode.icon;
            return (
              <article key={mode.title} className={`rounded-lg border ${mode.border} bg-zinc-950 p-4 sm:p-6`}>
                <div className={`mb-5 inline-flex max-w-full items-center gap-2 rounded-md border ${mode.border} ${mode.bg} px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${mode.accent} sm:mb-6 sm:tracking-[0.16em]`}>
                  <ModeIcon size={15} />
                  <span className="truncate">{mode.eyebrow}</span>
                </div>
                <h3 className="text-2xl font-black text-white sm:text-3xl">{mode.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{mode.body}</p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {mode.steps.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex min-h-16 items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-zinc-200">
                        <Icon size={18} className={mode.accent} />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <Link href={mode.href} className={`mt-7 inline-flex w-full justify-center rounded-lg border ${mode.border} ${mode.bg} px-5 py-3 text-sm font-black text-white transition hover:bg-white/10 sm:w-auto`}>
                  Start this flow
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:mt-10 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.62fr_1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">Editor rules</p>
              <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">Premium reels need fewer things on screen.</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {rules.map((rule) => (
                <div key={rule} className="rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold leading-6 text-zinc-300">
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
