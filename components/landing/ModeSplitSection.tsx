import { AudioLines, Captions, Music, PauseCircle, Sparkles, Type } from 'lucide-react';
import Link from 'next/link';

const modes = [
  {
    title: 'Audio-First Video',
    eyebrow: 'Audio-led creation',
    image: '/mode-cards/faceless-video.svg',
    body: 'Use this MVP flow when you have a clear voiceover. Audio is required and Itnavideo turns it into a typography-led short.',
    cta: 'Create audio video',
    href: '/dashboard',
    accent: 'text-emerald-200',
    border: 'border-emerald-300/20',
    bg: 'bg-emerald-300/[0.055]',
    items: [
      { label: 'Voiceover analysis', icon: AudioLines },
      { label: 'Dynamic typography', icon: Type },
      { label: 'Caption-safe layout', icon: Captions },
      { label: 'Audio polish + export', icon: Music },
    ],
  },
  {
    title: 'Media Uploads',
    eyebrow: 'Paused for MVP',
    image: '/mode-cards/face-camera-video.svg',
    body: 'Camera videos, screenshots, images, and clips are temporarily paused so the live demo stays reliable while we stabilize the core pipeline.',
    cta: 'Create with audio',
    href: '/dashboard',
    accent: 'text-cyan-200',
    border: 'border-cyan-300/20',
    bg: 'bg-cyan-300/[0.055]',
    items: [
      { label: 'Camera upload paused', icon: PauseCircle },
      { label: 'Image upload paused', icon: PauseCircle },
      { label: 'Clip upload paused', icon: PauseCircle },
      { label: 'Returning after MVP', icon: Sparkles },
    ],
  },
];

export default function ModeSplitSection() {
  return (
    <section className="relative overflow-hidden bg-[#050506] px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Focused MVP engine</p>
          <h2 className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl">
            Audio-first now. Media uploads next.
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            The current demo keeps one reliable input path open: voiceover audio. Other media modes are parked until the core render flow is consistently stable.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {modes.map((mode) => (
            <article key={mode.title} className={`overflow-hidden rounded-lg border ${mode.border} bg-zinc-950`}>
              <img src={mode.image} alt="" className="aspect-[5/3] w-full bg-black/30 object-cover" />
              <div className="p-6">
                <div className={`mb-5 inline-flex items-center gap-2 rounded-md border ${mode.border} ${mode.bg} px-3 py-2 text-xs font-black uppercase tracking-[0.16em] ${mode.accent}`}>
                  {mode.title.includes('Media') ? <PauseCircle size={15} /> : <AudioLines size={15} />}
                  {mode.eyebrow}
                </div>
                <h3 className="text-2xl font-black text-white">{mode.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{mode.body}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {mode.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3 text-sm font-bold text-zinc-200">
                        <Icon size={17} className={mode.accent} />
                        {item.label}
                      </div>
                    );
                  })}
                </div>

                <Link href={mode.href} className={`mt-7 inline-flex rounded-lg border ${mode.border} ${mode.bg} px-5 py-3 text-sm font-black text-white transition hover:bg-white/10`}>
                  {mode.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
