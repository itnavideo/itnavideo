import { ArrowRight, CheckCircle2, Clock3, Film, Layers3, Wand2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const outputs = [
  {
    title: 'Video Explainer',
    label: 'Video upload',
    image: '/visuals/previews/Video Simple Explainer Homepage Hero.png',
    accent: 'text-cyan-200',
    border: 'border-cyan-300/25',
    surface: 'bg-[linear-gradient(180deg,rgba(8,47,73,0.35),rgba(9,9,11,1))]',
    icon: Film,
    status: 'Available now',
    href: '/dashboard?template=video-explainer',
    body: 'Upload video/audio with speech. Get a reel with creator video on top, subtitles, title, and your explanation image at the bottom.',
    items: ['16:9 creator video', 'Transcript subtitles', 'Custom bottom image'],
    active: true,
  },
  {
    title: 'Compare Explainer',
    label: 'Audio + images',
    image: '/visuals/previews/Compare Explainer Homepage Hero.png',
    accent: 'text-emerald-200',
    border: 'border-emerald-300/25',
    surface: 'bg-[linear-gradient(180deg,rgba(6,78,59,0.35),rgba(9,9,11,1))]',
    icon: Layers3,
    status: 'Available now',
    href: '/dashboard?template=compare',
    body: 'Upload audio voiceover + 2-4 images. AI creates a left vs right comparison reel with timed captions.',
    items: ['Audio voiceover', 'Left vs Right panels', 'VS badge + subtitles'],
    active: true,
  },
];

const contract = [
  { title: 'Choose template first', body: 'Pick the output style before uploading so expectations are clear from the start.', icon: CheckCircle2 },
  { title: 'Audio or video input', body: 'Upload a talking-head clip, screen recording, or a clean voiceover file.', icon: Film },
  { title: '1 minute max', body: 'Long uploads are accepted but the reel uses only the first minute of speech.', icon: Clock3 },
  { title: 'Private & temporary', body: 'Your uploads are used only for rendering and never shared publicly.', icon: Wand2 },
];

export default function OutputProofSection() {
  return (
    <section id="template-proof" className="relative overflow-hidden bg-[#050506] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Available templates</p>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
            Two templates. Real outputs.
          </h2>
          <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
            Each template shows exactly what you upload and what you receive. No guessing.
          </p>
        </div>

        {/* Template cards — large featured layout */}
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          {outputs.map((output) => {
            const Icon = output.icon;
            return (
              <article key={output.title} className={`group overflow-hidden rounded-2xl border ${output.border} ${output.surface} transition hover:border-white/20`}>
                <div className="grid gap-0 md:grid-cols-[0.55fr_1fr]">
                  {/* Image */}
                  <div className="relative aspect-[3/4] max-h-[420px] bg-black md:max-h-none md:aspect-auto md:min-h-[380px]">
                    <Image
                      src={output.image}
                      alt={`${output.title} preview`}
                      fill
                      sizes="(min-width: 1024px) 300px, (min-width: 768px) 40vw, 100vw"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/30" />
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-black/60 backdrop-blur-md">
                      <Icon size={18} className={output.accent} />
                    </div>
                    <div className={`absolute right-4 top-4 rounded-md border border-white/12 bg-black/60 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-brand-mint backdrop-blur-md`}>
                      {output.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between p-5 sm:p-6">
                    <div>
                      <p className={`text-xs font-black uppercase tracking-[0.18em] ${output.accent}`}>{output.label}</p>
                      <h3 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">{output.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-zinc-400">{output.body}</p>
                      <div className="mt-5 grid gap-2">
                        {output.items.map((item) => (
                          <div key={item} className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm font-bold text-zinc-200">
                            <CheckCircle2 size={14} className="shrink-0 text-brand-mint" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={output.href}
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-black transition hover:bg-brand-mint"
                    >
                      Use {output.title}
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Trust contract */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {contract.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-xl border border-white/8 bg-white/[0.025] p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-brand-mint">
                  <Icon size={18} />
                </div>
                <h3 className="text-base font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
