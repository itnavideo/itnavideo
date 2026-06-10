import { CheckCircle2, Clock3, Film, Wand2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const outputs = [
  {
    title: 'Video Explainer',
    label: 'Video upload',
    image: '/visuals/template-video-explainer.png',
    accent: 'text-cyan-200',
    border: 'border-cyan-300/25',
    surface: 'bg-[linear-gradient(180deg,rgba(8,47,73,0.45),rgba(9,9,11,1))]',
    icon: Film,
    status: 'Available now',
    href: '/dashboard?template=video-explainer',
    body: 'Your video stays on top. Clean AI-written title and story text appears below.',
    items: ['16:9 creator video', 'Smart lower text', '1 minute output'],
    active: true,
  },
];

const contract = [
  { title: 'Template first', body: 'Creators choose the output style before upload, so expectations are clear.', icon: CheckCircle2 },
  { title: 'Audio or video input', body: 'Upload a talking-head clip, screen recording, or clear voiceover for the same explainer flow.', icon: Film },
  { title: '1 minute cap', body: 'Long uploads are accepted, but the reel uses only the first minute.', icon: Clock3 },
  { title: 'Private output', body: 'Uploads are used for rendering and kept out of public galleries by default.', icon: Wand2 },
];

const liveDemos = [
  {
    title: 'Video Explainer',
    label: 'Rendered preview',
    image: '/visuals/video-explainer-preview.png',
    href: '/dashboard?template=video-explainer',
    accent: 'text-cyan-200',
    border: 'border-cyan-300/20',
    glow: 'from-cyan-300/16',
    kicker: 'Top video + smart story text',
  },
];

function OutputCard({ output }: { output: (typeof outputs)[number] }) {
  const Icon = output.icon;

  return (
    <article className={`group overflow-hidden rounded-lg border ${output.border} ${output.surface} transition hover:border-white/25`}>
      <div className="relative aspect-[9/16] bg-black">
        <Image
          src={output.image}
          alt={`${output.title} preview`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover object-top transition duration-500 group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
        <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-md bg-black/58 text-white backdrop-blur-md">
          <Icon size={20} className={output.accent} />
        </div>
        <div
          className={`absolute right-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/12 bg-black/62 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] ${
            output.active ? 'text-brand-mint' : 'text-zinc-300'
          }`}
        >
          {output.status}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className={`text-[11px] font-black uppercase tracking-[0.18em] ${output.accent}`}>{output.label}</p>
          <h3 className="mt-2 text-2xl font-black leading-tight text-white">{output.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-6 text-zinc-400">{output.body}</p>
        <div className="mt-5 space-y-2">
          {output.items.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm font-bold text-zinc-200">
              <span className={`h-2 w-2 rounded-full ${output.active ? 'bg-brand-mint' : 'bg-zinc-500'}`} />
              {item}
            </div>
          ))}
        </div>
        {output.active && output.href ? (
          <Link
            href={output.href}
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-brand-mint"
          >
            Start this template
          </Link>
        ) : (
          <div className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-black text-zinc-500">
            Coming soon
          </div>
        )}
      </div>
    </article>
  );
}

function FeaturedTemplateStrip() {
  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
      {outputs.map((output) => {
        const Icon = output.icon;
        return (
          <article key={output.title} className={`overflow-hidden rounded-lg border ${output.border} bg-zinc-950`}>
            <div className="grid gap-0 md:grid-cols-[0.72fr_1fr]">
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[260px] bg-black md:max-w-none">
                <Image
                  src={output.image}
                  alt={`${output.title} preview`}
                  fill
                  sizes="(min-width: 1280px) 260px, (min-width: 768px) 36vw, 280px"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-white/[0.06]">
                    <Icon size={22} className={output.accent} />
                  </div>
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${output.accent}`}>{output.label}</p>
                  <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">{output.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-400">{output.body}</p>
                </div>
                <div className="mt-7 grid gap-2">
                  {output.items.map((item) => (
                    <span key={item} className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-3 text-sm font-bold text-zinc-200">
                      {item}
                    </span>
                  ))}
                </div>
                {output.href ? (
                  <Link
                    href={output.href}
                    className="mt-6 inline-flex justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-brand-mint"
                  >
                    Use this template
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function LiveDemoShowcase() {
  return (
    <div className="mb-10 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(94,234,212,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-3 shadow-2xl shadow-black/35 sm:p-4 lg:p-5">
      <div className="mb-4 flex flex-col gap-3 px-2 pt-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-mint">Rendered output</p>
            <h3 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">Real generated reel outputs.</h3>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        {liveDemos.map((demo) => (
          <article key={demo.title} className={`relative overflow-hidden rounded-[1.35rem] border ${demo.border} bg-black`}>
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${demo.glow} via-transparent to-transparent`} />
            <div className="relative grid gap-0 md:grid-cols-[0.62fr_0.38fr]">
              <div className="relative bg-zinc-950">
                <Image
                  src={demo.image}
                  alt={`${demo.title} rendered preview`}
                  width={720}
                  height={1280}
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="aspect-[9/16] h-full w-full max-h-[720px] object-cover object-top"
                />
                <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/55 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  <Film size={12} className={demo.accent} />
                  Preview
                </div>
              </div>

              <div className="relative flex flex-col justify-between p-5 sm:p-6">
                <div>
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${demo.accent}`}>{demo.label}</p>
                  <h4 className="mt-3 text-3xl font-black leading-tight text-white">{demo.title}</h4>
                  <p className="mt-4 text-base font-bold leading-7 text-zinc-300">{demo.kicker}</p>
                  <div className="mt-6 h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
                  <p className="mt-6 text-sm leading-6 text-zinc-500">
                    This preview shows the current template direction without loading bundled demo video assets.
                  </p>
                </div>
                <Link
                  href={demo.href}
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-brand-mint"
                >
                  Try this flow
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function OutputProofSection() {
  return (
    <section id="template-proof" className="relative overflow-hidden bg-[#050506] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-5 sm:mb-12 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-amber-200">Generated reel proof</p>
            <h2 className="text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl md:text-6xl">
              See the Explainer Video output before you sign up.
            </h2>
          </div>
          <p className="text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Start with proof, not promises. We are focusing on one excellent Explainer Video template so users get a faster, cleaner first render.
          </p>
        </div>

        <LiveDemoShowcase />

        <FeaturedTemplateStrip />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {outputs.map((output) => <OutputCard key={output.title} output={output} />)}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contract.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-white/[0.06] text-amber-100">
                  <Icon size={19} />
                </div>
                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.body}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.045] p-4 sm:mt-10 sm:p-6 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">Before and after clarity</p>
            <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">Source file in, generated reel out.</h3>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 md:mt-0">
            Each template card tells users what to upload and what they will receive, before they enter the dashboard.
          </p>
          <Film className="mt-5 shrink-0 text-cyan-200 md:mt-0" size={28} />
        </div>
      </div>
    </section>
  );
}
